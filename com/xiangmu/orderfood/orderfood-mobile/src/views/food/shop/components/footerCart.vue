<template>
  <div class="footer">
    <div class="card-money">
      <van-badge :content="badgeNum" color="#FF4D4F" v-if="badgeNum">
        <img class="wan" src="@/assets/img/blue-wan.png" alt @click="showPopu = true" />
      </van-badge>
      <img class="wan" src="@/assets/img/blue-wan.png" alt v-else @click="showPopu = true" />
      <span class="money">
        <label style="font-weight: 600">￥</label>
        <span style="font-weight: 600">{{ totalPrice }}</span>
      </span>
    </div>
    <van-button
      round
      type="info"
      :disabled="!badgeNum || can3Submit"
      size="small"
      :class="badgeNum && !can3Submit ? 'submit-blue' : 'submit-gray'"
      @click="submitOrder"
    >
      提交订单
    </van-button>
    <van-popup
      v-model="showPopu"
      get-container="#app"
      round
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="goods">
        <p class="head">
          <span class="title">已选商品</span>
          <span class="clear" @click="showVisible = true">
            <i class="iconfont icon-qingkong"></i>
            清空
          </span>
        </p>
        <template v-for="(res, index) in tableData">
          <div
            class="footer-card"
            :class="`animation-${index + 1}`"
            :key="'footer' + res.id"
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
              <div class="money-div">
                <span class="orange-money">
                  <i class="orange-tag">￥</i>
                  <span class="orange-num">{{ res.totalPrice }}</span>
                  <!-- <span class="orange-num">{{res.promotionprice?res.promotionprice:res.totalPrice}}</span> -->
                  <span v-show="res.promotionprice">
                    <i class="gray-tag">￥</i>
                    <span class="gray-num">{{ res.price }}</span>
                  </span>
                  <span class="limit-tips" v-show="res.onelimit == '1' || res.alllimit == '1'">
                    {{ res.limittext }}
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
                    theme="round"
                    button-size="22"
                    :min="0"
                    :max="res.max"
                    integer
                    async-change
                    @focus="event => handleFocus(event, res)"
                    @plus="addNum(res)"
                    @minus="reduceNum(res)"
                  />
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </van-popup>
    <van-dialog
      class="mini-dialog"
      theme="round-button"
      v-model="showVisible"
      :showCancelButton="false"
      :showConfirmButton="false"
      get-container="#app"
    >
      <slot name="title">
        <h1 class="dialog-title">清空购物车</h1>
      </slot>
      <div class="bottom-btn">
        <van-button class="cancel-btn" plain round type="primary" @click="showVisible = false">
          取消
        </van-button>
        <van-button class="clear-btn" round type="info" @click="handleClear">清空</van-button>
      </div>
    </van-dialog>
    <!---------------------------- 选择餐厅 -------------------------->
    <!-- <transition name="fade">
    </transition> -->
    <van-popup
      v-model="showChoosePop"
      get-container="#app"
      round
      position="bottom"
      :style="{ height: '35%' }"
    >
      <div class="shopchoose">
        <p class="head">
          <span class="title">选择订餐类型</span>
          <van-icon
            class="del-btn"
            name="cross"
            color="#8E8E8E"
            size="16"
            @click="showChoosePop = false"
          />
        </p>
        <template v-for="cafe in cafeArr">
          <div class="shopchoose-card" :key="'cafe' + cafe.id" :body-style="{ padding: '0px' }">
            <div style="width: 100%" @click="chooseCafeType(cafe)">
              <div class="icon-check">
                <van-icon
                  name="checked"
                  class="budge"
                  color="#1890FF"
                  v-if="activeShop == cafe.id"
                />
                <van-icon name="circle" class="budge" color="#DEDEDE" v-else />
                <span class="shopchoose-title">{{ cafe.title }}</span>
              </div>
              <p class="gray-info">{{ cafe.tips }}</p>
            </div>
          </div>
        </template>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Dialog } from 'vant';
import { fetchOneCafeConfig } from '@/api/client/cafe';
import { fetchAllFoodList } from '@/api/client/order';
export default {
  props: {
    shopId: String,
    shopTypeId: String,
  },
  data() {
    return {
      activeShop: '',
      showChoosePop: false,
      cafeArr: [
        {
          title: '单位订餐',
          id: 'group',
          tips: '送餐上门后请扫码收餐，并及时结算订单。',
        },
        {
          title: '个人订餐',
          id: 'self',
          tips: '需自行去往餐厅取餐。',
        },
      ],
      changeIndex: '',
      showPopu: false,
      showVisible: false,
      shopCarts: [],
      shopCartList: [],
      shopCart: [],
      tableData: [],
      cafeConfig: {},
    };
  },
  computed: {
    can3Submit() {
      let flag = this.cafeConfig.fixedtime1 && this.cafeConfig.fixedtime2;
      let fixedtime1, fixedtime2;
      if (flag) {
        fixedtime1 = new Date(this.cafeConfig.fixedtime1).getTime();
        fixedtime2 = new Date(this.cafeConfig.fixedtime2).getTime();
        let time = new Date().getTime();
        flag = fixedtime1 > time || time > fixedtime2;
      }
      return this.cafeConfig.orderway == 3 && flag;
    },
    // 当前用户购物车列表名称
    shopCartName() {
      return 'shopCartList-' + this.$store.state.userInfo.ID;
    },
    // 总计钱
    totalPrice() {
      let priceList = this.tableData.map(i => i.totalPrice);
      return priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
    // 总计个数
    badgeNum() {
      let numList = this.tableData.map(i => i.num);
      return numList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
  },
  watch: {
    shopCartName: {
      handler(newVal, oldVal) {
        this.initShopCart();
      },
      immediate: true,
    },
    shopTypeId: {
      handler(newVal, oldVal) {
        if (this.shopTypeId) {
          this.initShopCart();
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    // 获取餐厅配置权限
    getCafeConfig(id) {
      let data = {
        shopid: this.shopId || id,
      };
      fetchOneCafeConfig(data)
        .then(res => {
          if (res.success) {
            let ordertype = res.data.ordertype || '';
            this.cafeConfig = res.data;
            this.cafeArr = this.cafeArr.filter(v => ordertype.includes(v.id));
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //选中的地址
    chooseCafeType(cafe) {
      this.$toast.loading({
        message: '跳转中...',
        forbidClick: true,
        overlay: true,
        duration: 0,
      });
      this.activeShop = cafe.id;
      setTimeout(() => {
        //设置延迟执行
        this.$router.push({
          path: `/order/${this.shopId}`,
          query: {
            shopTypeId: this.shopTypeId,
            activeTab: cafe.id,
          },
        });
      }, 500);
    },
    // 初始化购物车
    initShopCart() {
      let data = localStorage.getItem(this.shopCartName);
      this.shopCartList = data ? JSON.parse(data) : [];
      this.shopCart = this.shopCartList.filter(i => i.shopid == this.shopId)[0];
      let cartList = this.shopCart ? this.shopCart.list : [];
      let cartArr = cartList.filter(v => v.num > 0);
      this.tableData = cartArr;
      this.tableData.forEach(i => {
        i.totalPrice = this.common.multiply(i.newprice, i.num, 2);
      });
    },
    //跳转到详情页
    jumpDetail(meal) {
      this.$router.push(`/detail/${meal.id}`);
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
            let isNew = false;
            list.forEach(cart => {
              let index = allFood.findIndex(j => j.id == cart.id);
              if (index > -1) {
                isNew = true;
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
            this.common.setLastAndMaxNum(newarr);
            this.curShopCart.list = newarr;
            localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
            //存在菜品后台更新
            // if (isNew) {
            //   this.$toast.fail("菜品信息已同步后台数据更新");
            // }
          }
        }
      });
    },

    submitOrder() {
      this.synchMeal();
      this.getCafeConfig();
      this.showChoosePop = true;
    },
    //清空当前餐厅的购物车
    handleClear() {
      this.shopCartList.forEach(shopCart => {
        if (shopCart.shopid == this.shopId) {
          shopCart.list = [];
          shopCart.num = 0;
        }
      });
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      this.initShopCart();
      this.$emit('toRefresh', this.shopId, this.shopTypeId);
      this.showVisible = false;
      this.showPopu = false;
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

      let index = this.shopCart.list.findIndex(i => i.id == food.id);
      food.totalPrice = this.common.multiply(food.newprice, food.num, 2);
      this.shopCart.list[index] = food;
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      this.$emit('toRefresh', this.shopId, this.shopTypeId);
      this.initShopCart();
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

      food.num = parseInt(food.num) + 1;
      food.totalPrice = this.common.multiply(food.newprice, food.num, 2);
      this.shopCart.num += 1;
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      this.$emit('toRefresh', this.shopId, this.shopTypeId);
    },

    // 购物车数量减1
    reduceNum(food) {
      let index = this.shopCart.list.findIndex(i => i.id == food.id);
      if (food.num == 1) {
        this.shopCart.num -= 1;
        food.num = 0;
        this.shopCart.list.splice(index, 1);
      } else {
        food.num -= 1;
        this.shopCart.num -= 1;
        this.shopCart.list[index] = food;
      }
      food.totalPrice = this.common.multiply(food.newprice, food.num, 2);
      localStorage.setItem(this.shopCartName, JSON.stringify(this.shopCartList));
      this.$emit('toRefresh', this.shopId, this.shopTypeId);
      this.initShopCart();
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  padding: 24px;
  position: fixed;
  bottom: 0;
  height: 120px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  // z-index: 999;
  .card-money {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img.wan {
    width: 65px;
    height: 60px;
  }
  .money {
    font-weight: 600;
    color: #474d51;
    font-size: 37px;
    margin-left: 17px;
    label {
      font-size: 24px;
    }
  }

  .submit-gray,
  .submit-blue {
    width: 220px;
    height: 72px;
    font-size: 30px;
    background: #3a78fc !important;
    border-color: #3a78fc !important;
    border-radius: 36px;
  }
  .submit-gray {
    background: #999999 !important;
    border-color: #999999 !important;
  }
}
//购物车
.goods {
  padding: 30px 24px;
  .head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
  }
  .title {
    height: 38px;
    font-size: 27px;
    font-weight: 400;
    color: #474d51;
    line-height: 38px;
  }
  .clear {
    height: 32px;
    font-size: 23px;
    font-weight: 400;
    color: #999999;
    line-height: 32px;
    margin-right: 24px;
    .icon-qingkong {
      width: 32px;
      height: 22px;
      color: #999999;
      font-size: 24px;
      margin-right: 5px;
    }
  }
}
//确认弹框
.mini-dialog {
  height: 261px;
  padding: 60px 48px;
  .dialog-title {
    width: 100%;
    text-align: center;
    height: 39px;
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
    margin-bottom: 30px;
  }
  .bottom-btn {
    display: flex;
  }
  .cancel-btn {
    width: 240px;
    height: 72px;
    background: #ffffff;
    border-radius: 36px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.65) !important;
    margin-right: 24px;
  }
  .clear-btn {
    width: 240px;
    height: 72px;
    background: #3a78fc;
    border-radius: 36px;
    border: none;
  }
}
.shopchoose {
  padding: 30px 24px;
  .head {
    display: flex;
    justify-content: space-between;
  }
  .title {
    height: 38px;
    font-size: 27px;
    font-weight: 400;
    color: #474d51;
    line-height: 38px;
  }

  .shopchoose-title {
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
  }
  .shopchoose-card {
    padding: 34px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .icon-check:before {
    display: none;
  }
  .icon-check {
    display: flex;
    justify-content: flex-start;
  }
  p.gray-info {
    height: 36px;
    font-size: 24px;
    font-weight: 400;
    color: #999999;
    line-height: 36px;
    padding-left: 48px;
    margin-top: 16px;
  }
  .icon-edit {
    width: 32px;
    height: 32px;
    color: #999999;
    font-size: 32px;
  }
  .budge {
    font-size: 40px;
    display: inline-block;
    margin-right: 12px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>