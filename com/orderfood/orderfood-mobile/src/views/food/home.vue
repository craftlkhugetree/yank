<template>
  <div class="wrapper">
    <van-nav-bar
      title="我要订餐"
      class="nav-bar"
      :border="false"
      fixed
    ></van-nav-bar>
    <div class="tabbar-height"></div>
    <section class="main-wapper">
      <div class="noshop" v-if="categoryList.length == 0">
        <img src="@/assets/img/noshop.png" alt />
        <p>暂无餐厅</p>
      </div>
      <div v-else>
        <!--------------------------- 顶部图片 --------------------------->
        <div class="top-menu">
          <img class="top-bg" src="@/assets/img/bg-header.png" alt />
          <van-search
            class="search-btn"
            v-model="keyword"
            placeholder="请输入菜品名称"
            shape="round"
            @input="doSearch"
          />
        </div>
        <div class="tabbar-height"></div>
        <!--------------------------- 分类 --------------------------->
        <div class="menu-box">
          <div class="type-List">
            <span
              class="icon-list"
              v-for="(item, index) in categoryList"
              :key="'category' + index"
              @click="handleClick(item)"
            >
              <span class="icon-card">
                <img
                  v-if="item.id == 'all'"
                  class="title-icon"
                  src="@/assets/img/all.png"
                  alt
                />
                <img
                  v-else
                  class="title-icon"
                  src="@/assets/img/category.png"
                  alt
                />
                <span
                  :class="activeType == item.id ? 'blue-title' : 'title-name'"
                  >{{ item.name }}</span
                >
              </span>
            </span>
          </div>
          <!--------------------------- 餐厅列表 --------------------------->
          <van-list
            class="shop-list"
            v-model="shopLoading"
            :finished="finished"
            @load="getShopLists"
          >
            <template v-for="(shop, index) in openCafeList">
              <!--------------------------- 餐厅信息 --------------------------->
              <div
                class="shop-card"
                :class="`animation-${index + 1}`"
                :key="'meal' + shop.id + index"
                :body-style="{ padding: '0px' }"
              >
                <h3 class="shop-title-box" @click="jumpDetail(shop, 'shop')">
                  <span class="shop-title">{{ shop.name }}</span>
                  <van-tag
                    plain
                    type="primary"
                    class="tag-yellow"
                    v-if="shop.hasGroup"
                    >单位订餐</van-tag
                  >
                  <van-tag
                    plain
                    type="primary"
                    class="tag-yellow"
                    v-if="shop.hasSelf"
                    >个人订餐</van-tag
                  >
                  <van-icon class="arrow-right" color="#8C8C8C" name="arrow" />
                </h3>
                <div class="shop-tips" v-if="shop.shopconfig.preparetime">
                  {{ getSendTime(shop.shopconfig) }}
                </div>
                <div class="shop-tips">
                  <span v-if="shop.shopconfig.orderway == 1">
                  配送时间：
                  {{ shop.shopconfig.sendtime ? common.sendTimeFormat(shop.shopconfig.sendtime) : '--' }}
                  </span>
                  <span v-else>
                    取餐时间：
                    {{common.pickupTimeText(shop.shopconfig)}}
                  </span>
                </div>
                <div class="item-box">
                  <div
                    class="img-list"
                    v-for="(item, itemindex) in shop.shopitems"
                    :key="'item' + item.id + itemindex"
                    @click="jumpDetail(item, 'type')"
                  >
                    <img
                      :src="common.viewIcon(item.photo)"
                      class="image"
                      v-if="item.photo && item.photo != '-1'"
                    />
                    <img src="@/assets/img/no-img.png" class="image" v-else />
                    <span class="name ellipsis">{{ item.name }}</span>
                    <span class="orange-money">
                      <i class="orange-tag">￥</i>
                      <span class="orange-num">{{
                        item.promotionprice ? item.promotionprice : item.price
                      }}</span>
                      <span v-show="item.promotionprice">
                        <i class="gray-tag">￥</i>
                        <span class="gray-num">{{ item.price }}</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </template>
            <!---------------------------- 无资源 ---------------------------->
            <div class="nodata" v-if="openCafeList.length == 0">
              <img src="@/assets/img/nofind.png" alt />
              <p>没有找到</p>
            </div>
            <div
              slot="finished"
              :class="`animation-${openCafeList.length + 1}`"
              v-else
            >
              <van-divider
                :style="{
                  color: '#999999',
                  fontSize: '12px',
                  borderColor: '#dbdbdb',
                  padding: '0 24px',
                }"
                >没有更多了</van-divider
              >
            </div>
          </van-list>
        </div>
      </div>
    </section>

    <!-- 有未结算提示 -->
    <van-dialog
      class="tipsmini-dialog"
      theme="round-button"
      v-model="showVisible"
      :showCancelButton="false"
      :showConfirmButton="false"
    >
      <slot name="title">
        <h1 class="h1-title">还有订单未结算，请去电脑端尽快结算！</h1>
      </slot>
      <div class="bottom-btn">
        <van-button
          class="clear-btn"
          round
          type="info"
          @click="showVisible = false"
          >继续订餐</van-button
        >
      </div>
    </van-dialog>
  </div>
</template>
<script>
import {
  fetchAllCafeList,
  fetchAllShopType,
  fetchAllShopList,
  fetchCafeConfigList,
} from "@/api/client/cafe";
import {
  fetchTypeList,
  fetchAllFoodList,
  fetchTypeNums,
  getNoSettleNum,
} from "@/api/client/order";

export default {
  props: {
    shopTypeId: String,
  },
  data() {
    return {
      changeIndex: "",
      activeType: "all",
      keyword: null,
      finished: false,
      currentPage: 1,
      limit: 1000,
      showVisible: false,
      categoryList: [],
      shopLists: [],
      shopLoading: false,
    };
  },
  computed: {
    // 当前用户类型(1开头为学生，2开头为教职工)
    userType() {
      let userInfo = this.$store.state.userInfo;
      let rylx = userInfo.RYLX || null;
      let userType = null;
      if (/^1.*$/.test(rylx)) {
        userType = "student";
      } else if (/^2.*$/.test(rylx)) {
        userType = "teacher";
      }
      return userType;
    },
    //开放的餐厅（开放时间，开放对象）
    openCafeList() {
      let list = this.shopLists.filter((i) => {
        // 是否设置开放对象 和 开放时间
        if (
          !i.shopconfig.openobj ||
          !i.shopconfig.opentime ||
          // !i.shopconfig.ordertype ||
          // !i.shopconfig.sendtime ||
          // !i.shopconfig.preparetime
          (!i.shopconfig.sendtime && i.shopconfig.orderway == 1) ||
          ((!i.shopconfig.ordertype || !i.shopconfig.preparetime) && i.shopconfig.orderway == 1) ||
          !i.shopconfig.pickuptime && (i.shopconfig.orderway == 2 || i.shopconfig.orderway == 3)
        ) {
          return false;
        } else {
          // 开放对象是否包含当前用户
          if (i.shopconfig.openobj.includes(this.userType)) {
            // 开放时间是否包含当前时间
            let timeArr = i.shopconfig.opentime.split(",");
            let now = this.moment().format("MMDD");
            if (
              timeArr.some((j) => {
                let time = j.split("-");
                let st = time[0];
                let et = time[1];
                return now >= st && now <= et;
              })
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
      });
      return list;
    },
  },

  methods: {
    getSendTime(config) {
      let str;
      if (config) {
        let { prepareunit, preparetime } = config;
        let unit = "";
        if (preparetime) {
          unit =
            prepareunit == "hour"
              ? "小时"
              : prepareunit == "minute"
              ? "分钟"
              : "天";
        }

        preparetime = preparetime ? preparetime : "--";
        str = `备餐时间：${preparetime}${unit}`;
      }
      return str;
    },
    jumperStart() {
      this.$router.push("/home");
      sessionStorage.removeItem("ActiveCafe");
    },

    // 分页获取列表
    getShopLists(page, limit) {
      let param = {
        filter: {
          name: this.keyword || null,
          shoptypeid: this.activeType == "all" ? null : this.activeType,
          status: "1",
        },
        page: page,
        limit: limit,
      };
      this.shopLoading = true;
      fetchAllShopList(param)
        .then((res) => {
          this.shopLoading = false;
          if (res.success) {
            let list = res.data || [];
            list.forEach((shop) => {
              let arrtype = shop.shopconfig.ordertype.split(",");
              shop.hasSelf = arrtype.includes("self") ? true : false;
              shop.hasGroup = arrtype.includes("group") ? true : false;
            });
            this.shopLists = page === 1 ? list : this.shopLists.concat(list);
            console.log("this.shopLists", this.shopLists);
            this.finished = list.length < this.limit ? true : false;
            this.currentPage = page + 1;
          }
        })
        .catch((err) => {
          this.shopLoading = false;
        });
    },
    //获取全部类别
    getAllCategory() {
      let data = {
        status: "1",
      };
      fetchAllShopType(data)
        .then((res) => {
          if (res.success) {
            let list = res.data || [];
            list.unshift({
              id: "all",
              level: 0,
              name: "全部",
              status: "1",
            });
            let newList = list.filter((i) => i.status == "1");
            newList.sort((a, b) => {
              return a.level > b.level ? 1 : -1;
            });
            this.categoryList = newList;
          }
        })
        .catch((err) => {});
    },

    doSearch() {
      this.currentPage = 1;
      this.getShopLists(this.currentPage, this.limit);
    },

    // 点击分类
    handleClick(item) {
      this.activeType = item.id;
      this.currentPage = 1;
      this.getShopLists(this.currentPage, this.limit);
    },

    //跳转该餐厅对应菜单列表
    jumpDetail(data, type) {
      let item = {};
      if (type == "shop") {
        item.shopid = data.id;
        item.shopitemtypeid = data.shopitems[0].shopitemtypeid;
      } else {
        item = data;
      }
      this.$router.push({
        path: `/menuList/${item.shopid}`,
        query: {
          shopTypeId: item.shopitemtypeid,
        },
      });
    },
  },
  mounted() {
    this.getAllCategory();
  },
  created() {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    // 获取超过30天未结算订单数量
    getNoSettleNum().then((res) => {
      if (res.success) {
        let curpath = this.$route.path;
        let data = res.data || 0;
        let isShow = sessionStorage.getItem("isShowTips");
        if (data > 0 && !isShow) {
          this.showVisible = true;
          sessionStorage.setItem("isShowTips", 1);
        }
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.main-wapper {
  padding-bottom: 120px;
}

i.van-icon.van-icon-search {
  color: #ccc !important;
}

.top-menu {
  position: fixed;
  background: #fff;
  width: 100%;
  z-index: 1;
  .top-bg {
    width: 100%;
    height: 80px;
  }
}

.search-btn .van-search__content {
  width: 100%;
  height: 60px;
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 30px;
  margin-top: -60px;
}

.menu-box {
  background: #ffffff;
  .type-List {
    margin-top: 32px;
    .title-icon {
      width: 82px;
      height: 82px;
    }
    .icon-list {
      width: 187px;
      height: 107px;
      display: inline-block;
      position: relative;
      margin-bottom: 23px;
      .icon-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .blue-title {
        color: #3f86f7;
        line-height: 31px;
        font-size: 22px;
      }
      .title-name {
        color: #999999;
        line-height: 31px;
        font-size: 22px;
      }
    }
  }
}
.shop-list {
  padding: 24px;
  .shop-card {
    padding: 24px;
    width: 702px;
    background: #ffffff;
    box-shadow: 0px 5px 20px 0px #e6e6e6;
    border-radius: 10px;
    margin-bottom: 24px;
    .shop-title-box {
      display: flex;
      justify-content: flex-start;
      position: relative;
    }
    .shop-title {
      color: #474d51;
      font-size: 32px;
      font-weight: 600;
      color: #474d51;
      line-height: 45px;
    }
    .arrow-right {
      position: absolute;
      top: 10px;
      right: 0px;
    }
    .shop-tips {
      margin-top: 10px;
      margin-bottom: 16px;
      margin-right: 24px;
      font-weight: 400;
      color: #999999;
      line-height: 32px;
      font-size: 23px;
    }
    .item-box {
      display: flex;
      justify-content: flex-start;
    }
    .img-list {
      margin-right: 12px;
      display: flex;
      flex-direction: column;
      .image {
        width: 154px;
        height: 116px;
      }
      .name {
        font-weight: 400;
        color: #474d51;
        line-height: 30px;
        margin-top: 8px;
        width: 154px;
      }
      .orange-money {
        font-size: 28px;
        color: #fd7d18;
        line-height: 40px;
        .orange-tag {
          font-size: 20px;
          font-weight: 600;
        }
        .orange-num {
          font-weight: 600;
        }
        .gray-tag {
          font-size: 20px;
          color: #999999;
          text-decoration: line-through;
          margin-left: 12px;
        }
        .gray-num {
          font-size: 20px;
          color: #999999;
          text-decoration: line-through;
        }
      }
    }
  }
}

.van-search {
  padding: 5px 24px 24px;
}

.tag-yellow {
  background: #fffbe6;
  border-radius: 6px;
  border-color: #ffe58f;
  font-size: 24px;
  font-weight: 400;
  color: #faad14 !important;
  padding: 8px;
  height: 44px;
  margin-left: 24px;
}
</style>
