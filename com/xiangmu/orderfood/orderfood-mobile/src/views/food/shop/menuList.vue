<template>
  <div class="wrapper">
    <van-nav-bar
      :title="(openCafeList[0] && openCafeList[0].shopname) || '我要订餐'"
      class="nav-bar"
      :border="false"
      left-arrow
      fixed
      @click-left="jumperStart"
    ></van-nav-bar>
    <section class="main-wapper">
      <div>
        <div class="top-menu">
          <!--------------------------- 头部卡片 --------------------------->
          <shop-head :openCafeList="openCafeList" :shopId="shopId"></shop-head>
          <div class="header-height"></div>
          <van-search
            class="search-btn"
            v-model="keyword"
            placeholder="请输入菜品名称"
            shape="round"
            @input="doSearch"
          />
        </div>
        <div class="menu-box">
          <!--------------------------- 左侧菜品分类 --------------------------->
          <van-sidebar v-model="activeIndex" @change="handleClick" class="side-menu">
            <template v-for="(menu, index) in tabs">
              <van-sidebar-item :title="menu.name" :key="'slide' + index" />
            </template>
          </van-sidebar>
          <!--------------------------- 菜品列表 --------------------------->
          <van-list
            class="right-list"
            v-model="foodLoading"
            :finished="finished"
            @load="getFoodList(currentPage, limit)"
          >
            <span class="menu-title">{{ activeName }}</span>
            <div class="menu-tips">{{ activeItem && activeItem.note }}</div>
            <template v-for="(res, index) in foodList">
              <div
                class="res-card"
                :class="`animation-${index + 1}`"
                :key="'meal' + res.id + index"
                :body-style="{ padding: '0px' }"
              >
                <div class="img-box" @click="jumpDetail(res)">
                  <img
                    :src="common.viewIcon(res.photo)"
                    class="image"
                    v-if="res.photo && res.photo != '-1'"
                  />
                  <img src="@/assets/img/no-img.png" class="image" v-else />
                </div>

                <div class="right-box">
                  <h1 class="name ellipsis">{{ res.name }}</h1>
                  <p class="res-des">{{ res.note }}</p>
                  <p>
                    <span class="orange-money">
                      <i class="orange-tag">￥</i>
                      <span class="orange-num">
                        {{ res.promotionprice ? res.promotionprice : res.price }}
                      </span>
                      <span v-show="res.promotionprice">
                        <i class="gray-tag">￥</i>
                        <span class="gray-num">{{ res.price }}</span>
                      </span>
                    </span>
                    <span class="right-btn">
                      <!-- 选中改变数字值，删除仍保留减号及input框 -->
                      <van-stepper
                        v-if="res.id == changeIndex"
                        v-model="res.num"
                        theme="round"
                        button-size="22"
                        :min="0"
                        :max="res.max"
                        integer
                        @blur="event => handleBlur(event, res)"
                      />
                      <!-- 非选中数字时 -->
                      <van-stepper
                        v-else
                        :show-minus="res.num >= 1"
                        :show-input="res.num >= 1"
                        :value="res.num"
                        async-change
                        theme="round"
                        button-size="22"
                        :min="0"
                        :max="res.max"
                        integer
                        @focus="event => handleFocus(event, res)"
                        @plus="addNum(res)"
                        @minus="reduceNum(res)"
                      />
                    </span>
                  </p>
                  <span class="tip-orange" v-show="res.onelimit == '1' || res.alllimit == '1'">
                    {{ res.limittext }}
                  </span>
                </div>
              </div>
            </template>
            <!---------------------------- 无资源 ---------------------------->
            <div class="nodata" v-if="foodList.length == 0">
              <img src="@/assets/img/nofind.png" alt />
              <p>没有找到</p>
            </div>
            <div slot="finished" :class="`animation-${foodList.length + 1}`" v-else>
              <van-divider
                :style="{
                  color: '#999999',
                  fontSize: '12px',
                  borderColor: '#dbdbdb',
                  padding: '0 24px',
                }"
              >
                没有更多了
              </van-divider>
            </div>
          </van-list>
        </div>
      </div>
    </section>
    <footer-cart
      ref="footerCart"
      v-if="shopId"
      :shopId="shopId"
      :shopTypeId="clickTypeId"
      @toRefresh="doRefresh"
    ></footer-cart>
  </div>
</template>
<script>
import shopHead from './components/shopHead';
import { fetchAllCafeList, fetchCafeDetail, fetchCafeConfigList } from '@/api/client/cafe';
import {
  fetchTypeList,
  fetchAllFoodList,
  fetchFoodList,
  fetchTypeNums,
  getItemBuyNum,
} from '@/api/client/order';
import FooterCart from './components/footerCart';
export default {
  props: {
    shopId: String,
    shopTypeId: String,
  },
  data() {
    return {
      changeIndex: '',
      curCafe: null,
      cafeList: [],
      clickTypeId: '',
      activeIndex: 0,
      tabs: [],
      keyword: null,
      foodList: [],
      foodLoading: false,
      shopCartList: [],
      curShopCart: null,
      loading: false,
      finished: false,
      activeName: '', //分类名称
      activeItem: null, //分类
      currentPage: 1,
      limit: 10,
      detailItemID: '',
      openCafeList: [],
    };
  },
  components: { FooterCart, shopHead },
  computed: {
    // 当前用户购物车列表名称
    shopCartName() {
      return 'shopCartList-' + this.$store.state.userInfo.ID;
    },
  },
  watch: {
    shopCartName: {
      handler(newVal, oldVal) {
        this.initShopCart();
      },
      immediate: true,
    },
  },

  methods: {
    //跳转
    jumperStart() {
      this.$router.push('/home');
      sessionStorage.removeItem('ActiveCafe');
    },

    //购物车数量增减
    doRefresh(curShopId, shopTypeId) {
      this.initShopCart();
      this.curShopCart = this.shopCartList.filter(i => i.shopid == this.shopId)[0];
      this.currentPage = 1;
      this.getFoodList(this.currentPage, this.limit);
    },

    // 获取餐厅列表
    getCafeDetail() {
      this.loading = true;
      let param = { id: this.shopId };
      fetchCafeDetail(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.curCafe = res.data;
            this.getCafeList();
            this.getTypeList();
            this.synchMeal();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 获取餐厅列表
    getCafeList() {
      this.loading = true;
      let param = {};
      fetchAllCafeList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let List = res.data || [];
            fetchCafeConfigList({}).then(res => {
              if (res.success) {
                let configList = res.data || [];
                let cafeList = List.map(i => {
                  let index = configList.findIndex(j => j.shopid == i.id);
                  let obj = { ...i };
                  if (index > -1) {
                    obj = {
                      ...configList[index],
                      shopname: i.name,
                    };
                  }
                  return obj;
                });
                //当前餐厅配置信息
                this.openCafeList = cafeList.filter(i => i.shopid == this.shopId);
              }
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 获取菜品分类
    getTypeList() {
      let param = {
        shopid: this.shopId,
      };
      fetchTypeList(param).then(res => {
        if (res.success) {
          let data = res.data || [];
          fetchTypeNums(param).then(res => {
            if (res.success) {
              data.sort((a, b) => {
                return a.level > b.level ? 1 : -1;
              });
              this.tabs = data;
              //从详情返回时
              let index = data.findIndex(i => i.id === this.detailItemID);
              if (index && index != -1) {
                this.activeIndex = index;
                this.activeName = data[index].name;
                this.activeItem = data[index];
              } else {
                this.activeName = data[0].name;
                this.activeItem = data[0];
              }
              this.currentPage = 1;
              this.getFoodList(this.currentPage, this.limit);
            }
          });
        }
      });
    },
    doSearch() {
      this.currentPage = 1;
      this.getFoodList(this.currentPage, this.limit);
    },

    // 按分类获取菜品列表
    getFoodList(page, limit) {
      this.foodLoading = true;
      let param = {
        filter: {
          name: this.keyword || null,
          shopid: this.shopId,
          shopitemtypeid: this.clickTypeId,
          status: '1',
        },
        page: page,
        limit: limit,
      };
      fetchFoodList(param)
        .then(res => {
          this.foodLoading = false;
          if (res.success) {
            let list = res.data || [];
            list.forEach(i => {
              this.$set(i, 'num', 0);
              i.newprice = i.promotionprice ? i.promotionprice : i.price;
            });
            this.common.setLastAndMaxNum(list);
            this.foodList = page == 1 ? list : this.foodList.concat(list);
            this.finished = list.length < this.limit ? true : false;
            this.currentPage = page + 1;
            this.curShopCart = this.shopCartList.filter(i => i.shopid == this.shopId)[0];
            if (this.curShopCart && this.curShopCart.list.length > 0) {
              // 设置菜品的购物车数量
              this.foodList.forEach(i => {
                this.curShopCart.list.forEach(j => {
                  if (j.id == i.id) {
                    i.num = j.num;
                  }
                });
              });
              localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
              this.$refs.footerCart.initShopCart();
            }
          }
        })
        .catch(err => {
          this.foodLoading = false;
        });
    },
    //同步后台菜品信息
    synchMeal() {
      //首次进来默认的分类购物车
      this.curShopCart = this.shopCartList.filter(i => i.shopid == this.shopId)[0];
      //更新购物车信息，对比餐厅下的所有菜品最新信息（下架、删除、更改价格等）
      fetchAllFoodList({
        shopid: this.shopId,
        status: '1',
      }).then(res => {
        if (res.success) {
          let allFood = res.data || [];
          // 去掉购物车中已删除的菜
          if (this.curShopCart) {
            let list = this.curShopCart.list || [];
            let newarr = [];
            list.forEach(cart => {
              let index = allFood.findIndex(j => j.id == cart.id);
              if (index > -1) {
                // 更新购物车中菜品信息
                newarr.push({
                  ...allFood[index],
                  num: cart.num,
                  newprice: allFood[index].promotionprice
                    ? allFood[index].promotionprice
                    : allFood[index].price,
                });
              }
            });
            this.curShopCart.list = newarr;
          }
        }
      });
    },

    // 点击左侧菜品
    handleClick(index) {
      this.activeIndex = index;
      let active = this.tabs[index];
      this.activeItem = active;
      this.clickTypeId = active.id;
      this.activeName = active.name;
      this.currentPage = 1;
      this.synchMeal();
      this.getFoodList(this.currentPage, this.limit);
    },

    //失去焦点时
    async handleBlur(event, food) {
      this.changeIndex = '';
      let curNum = food.num > food.max ? food.max : food.num;
      this.$set(food, 'num', curNum);
      //个人限制--个人剩余量
      if (food.onelimit == '1') {
        let personSurplusNum = await this.common.fetchItemBuyNum(food);
        if (food.num > personSurplusNum) {
          this.$set(food, 'num', personSurplusNum);
          this.$toast.fail(`限${food.onelimitnum}份每人`);
        }
      }

      let index = this.curShopCart.list.findIndex(i => i.id == food.id);
      this.curShopCart.list[index] = food;
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      this.$refs.footerCart.initShopCart();
    },

    //获取焦点时
    handleFocus(event, res) {
      this.changeIndex = res.id;
    },

    // 购物车数量加1  如果不存在当前购物车，则新增购物车
    async addNum(food) {
      //个人限制--个人剩余量
      if (food.onelimit == '1') {
        let personSurplusNum = await this.common.fetchItemBuyNum(food);
        console.log('personSurplusNum', personSurplusNum);
        if (food.num >= personSurplusNum) {
          this.$toast.fail(`限${food.onelimitnum}份每人`);
          return false;
        }
      }
      //总量限制
      if (food.alllimit == '1' && food.num > food.lastnum) {
        this.$toast.fail(`菜品余量不足，最多可定${food.lastnum}份`);
        return false;
      }
      food.num += 1;
      if (!this.curShopCart) {
        this.curShopCart = {
          shopid: this.shopId,
          shopTypeId: this.clickTypeId, //分类的id
          shopname: this.curCafe.name,
          num: 1,
          list: [food],
        };
        this.shopCartList.push(this.curShopCart);
      } else {
        let index = this.curShopCart.list.findIndex(i => i.id == food.id);
        if (index == -1) {
          this.curShopCart.list.push(food);
        } else {
          this.curShopCart.list[index] = food;
        }
        this.curShopCart.num += 1;
      }
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      this.$refs.footerCart.initShopCart();
    },

    // 购物车数量减1
    reduceNum(food) {
      let index = this.curShopCart.list.findIndex(i => i.id == food.id);
      if (food.num == 1) {
        this.curShopCart.num -= 1;
        food.num = 0;
        this.curShopCart.list.splice(index, 1);
      } else {
        food.num -= 1;
        this.curShopCart.num -= 1;
        this.curShopCart.list[index] = food;
      }
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      this.$refs.footerCart.initShopCart();
    },

    //跳转到详情页
    jumpDetail(meal) {
      this.$router.push(`/detail/${meal.id}`);
    },

    // 初始化购物车列表
    initShopCart() {
      let data = localStorage.getItem(this.shopCartName);
      this.shopCartList = data ? JSON.parse(data) : [];
    },
  },
  mounted() {
    this.$refs.footerCart.getCafeConfig(this.shopId)
  },
  created() {
    this.clickTypeId = this.shopTypeId;
    this.detailItemID = this.shopTypeId ? this.shopTypeId : '';
    // localStorage.clear();
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.getCafeDetail();
  },
};
</script>

<style lang="scss" scoped>
.main-wapper {
  padding-top: 82px;
  padding-bottom: 120px;
}
.search-filed {
  height: 60px;
  background: #fafafa;
  border-radius: 40px;
  font-size: 28px;
  color: #7d7d80;
}
.title-h4 {
  font-size: 20px;
  font-weight: blod;
  color: #474d51;
  line-height: 30px;
  margin-left: 40px;
  margin-bottom: 20px;
}
.res-name {
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
i.van-icon.van-icon-search {
  color: #ccc !important;
}

.top-menu {
  position: fixed;
  background: #fff;
  width: 100%;
  z-index: 1;
}
.top-zindex {
  z-index: 0;
}
.search-btn {
  width: 100%;
}

.menu-box {
  display: flex;
  justify-content: space-between;
  .right-list {
    margin-left: 165px;
    margin-top: 270px;
    width: calc(100% - 150px);
  }

  .side-menu {
    width: 150px;
    height: calc(100% - 280px);
    overflow-y: auto;
    background: #f6f6f6;
    position: fixed;
    top: 330px;
    line-height: 31px;
    .van-sidebar-item {
      padding: 24px;
      font-size: 24px;
    }
  }
}

.menu-title {
  display: inline-block;
  color: #474d51;
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
}
.menu-tips {
  margin-top: 10px;
  margin-right: 24px;
  font-weight: 400;
  color: #999999;
  line-height: 32px;
  font-size: 23px;
}

.van-search {
  padding: 5px 24px 24px;
}
.header-height {
  height: 74px;
  width: 100%;
}
</style>