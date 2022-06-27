<template>
  <div class="food" v-loading="loading">
    <p v-if="openCafeList.length == 0">暂无餐厅</p>
    <!---------------------------- 餐厅列表 -------------------------->
    <div class="left-box" v-if="openCafeList.length > 0">
      <div class="title">
        <h3>餐厅列表</h3>
      </div>
      <div class="list">
        <ul>
          <li
            :class="{'active': item.shopid == activeCafeId}"
            v-for="item in openCafeList"
            :key="item.shopid"
            @click="clickType(item.shopid, item.shopname)"
          >
            <div>
              <span class="name">{{item.shopname}}</span>
              <p>
                <span v-if="item.ordertype.includes('group')" class="tag">单位订餐</span>
                <span v-if="item.ordertype.includes('self')" class="tag">个人订餐</span>
              </p>
              <p>
                <label>备餐时间：</label>
                {{item.preparetime || "--"}}{{common.unitFormat(item.prepareunit)}}
              </p>
              <p>
                <label>配送时间：</label>
                {{sendTimeFormat(item.sendtime)}}
              </p>
              <p>
                <label>联系电话：</label>
                {{item.mobile}}
              </p>
              <p>
                <label>餐厅说明：</label>
                {{item.note || "--"}}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!---------------------------- 菜品表格 -------------------------->
    <div
      class="right-box"
      v-if="openCafeList.length > 0 && tabs.length == 0"
      style="padding:20px;"
    >暂无菜品分类</div>
    <div class="right-box" v-if="openCafeList.length > 0 && tabs.length > 0">
      <el-tabs v-model="activeTab" @tab-click="handleClick" v-loading="typeLoading">
        <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id">
          <span slot="label">{{tab.name}} {{tab.itemnum}}</span>
          <div>
            <div v-if="tab.note" class="tips" style="max-width:calc(100% - 300px);">
              <i class="el-icon-warning"></i>
              <!-- 备餐时间：
              <i style="font-weight:600;">{{tab.preparetime || "--"}}</i>
              {{common.unitFormat(tab.prepareunit)}}。-->
              {{tab.note}}
            </div>
            <!---------------------------- 查询条件 ---------------------------->
            <div class="search-box-right">
              <el-input
                class="input-box"
                v-model="keyword"
                placeholder="请输入菜品名称"
                size="small"
                clearable
                style="width:170px;margin-right:10px;"
                prefix-icon="el-icon-search"
                @clear="getFoodList"
                @keyup.enter.native="getFoodList"
              ></el-input>
              <el-button type="primary" size="small" icon="el-icon-search" @click="getFoodList">查询</el-button>
              <!-- <el-divider direction="vertical"></el-divider>
            <el-badge
              v-if="curShopCart && curShopCart.num > 0"
              :value="curShopCart.num"
              class="item"
            >
              <el-button
                class="shopcart"
                size="small"
                icon="iconfont icon-dingcan"
                @click="toShopCart"
              >购物车</el-button>
            </el-badge>
            <el-button
              v-else
              class="shopcart"
              size="small"
              icon="iconfont icon-dingcan"
              @click="toShopCart"
              >购物车</el-button>-->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tab-content clearfix" v-loading="foodLoading">
        <div class="food-box" v-for="food in foodList" :key="food.id">
          <img v-if="!food.photo || food.photo == -1" src="@/assets/img/nodata.png" alt />
          <img v-else :src="food.url" alt />
          <div class="food-title">
            <span class="title ellipsis">{{food.name}}</span>
            <div class="price">
              <span v-if="food.promotionprice">¥{{food.promotionprice}}</span>
              <span v-if="food.promotionprice" class="delete">¥{{food.price}}</span>
              <span v-else>¥ {{food.price}}</span>
            </div>
          </div>
          <el-tooltip
            v-if="food.note && food.note.length > 13"
            :content="food.note"
            placement="bottom-start"
          >
            <p class="note ellipsis">{{food.note || "--"}}</p>
          </el-tooltip>
          <p v-else class="note ellipsis">{{food.note || "--"}}</p>
          <el-input-number
            v-if="food.num > 0"
            v-model="food.num"
            @change="(val,old) => handleChange(val,old,food)"
            :min="0"
            size="mini"
            step-strictly
          ></el-input-number>
          <span v-else class="btn" @click="addToCart(food)">加入购物车</span>
        </div>
      </div>
    </div>

    <!---------------------------- 底部 -------------------------->
    <div class="right-footer">
      共{{totalNum}}份，合计：
      <span>{{totalPrice}}元</span>
      <el-button type="primary" size="small" @click="toShopCart">去结算</el-button>
    </div>
  </div>
</template>

<script>
import { fetchAllCafeList, fetchCafeConfigList } from "@/api/admin/cafe";
import {
  fetchTypeList,
  fetchAllFoodList,
  fetchTypeNums
} from "@/api/admin/food";
export default {
  data() {
    return {
      loading: false,
      activeCafeName: null,
      activeCafeId: null,
      cafeList: [],
      typeLoading: false,
      activeTab: null,
      tabs: [],
      keyword: null,
      foodList: [],
      foodLoading: false,
      shopCartList: [],
      curShopCart: null,
      totalNum: 0,
      totalPrice: 0
    };
  },
  computed: {
    // 当前用户购物车列表名称
    shopCartName() {
      return "shopCartList-" + this.$store.state.userInfo.ID;
    },
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
    // 开放的餐厅（开放时间，开放对象）
    openCafeList() {
      let list = this.cafeList.filter(i => {
        // 是否设置开放对象 和 开放时间
        if (
          !i.openobj ||
          !i.opentime ||
          !i.sendtime ||
          !i.ordertype ||
          !i.preparetime
        ) {
          return false;
        } else {
          // 开放对象是否包含当前用户
          if (i.openobj.includes(this.userType)) {
            // 开放时间是否包含当前时间
            let timeArr = i.opentime.split(",");
            let now = this.moment().format("MMDD");
            if (
              timeArr.some(j => {
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
      list.sort((a, b) => {
        return a.level > b.level ? 1 : -1;
      });
      return list;
    }
  },
  watch: {
    shopCartName: {
      handler(newVal, oldVal) {
        this.initShopCart();
      },
      immediate: true
    }
  },
  methods: {
    // 获取餐厅列表
    getCafeList() {
      this.loading = true;
      let param = {};
      fetchAllCafeList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let cafeList = res.data || [];
            fetchCafeConfigList({}).then(res => {
              if (res.success) {
                let configList = res.data || [];
                this.cafeList = cafeList.map(i => {
                  let index = configList.findIndex(j => j.shopid == i.id);
                  let obj = { ...i };
                  if (index > -1) {
                    obj = {
                      ...configList[index],
                      shopname: i.name,
                      level: i.level
                    };
                  }
                  obj.mobile = obj.mobile
                    ? obj.mobile.split(",").join("，")
                    : "--";
                  return obj;
                });
                this.initParams();
              }
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 点击餐厅
    clickType(shopid, shopname) {
      this.activeCafeName = shopname;
      this.activeCafeId = shopid;
      this.curShopCart =
        this.shopCartList.filter(i => i.shopid == this.activeCafeId)[0] || null;
      if (this.curShopCart) {
        // 获取该餐厅下的所有菜品
        fetchAllFoodList({
          shopid: this.activeCafeId,
          status: "1"
        }).then(res => {
          if (res.success) {
            let allFood = res.data || [];
            // 去掉购物车中已经不存在的商品
            let list = this.curShopCart.list || [];
            let arr = [];
            for (let i = 0; i < list.length; i++) {
              let index = allFood.findIndex(j => j.id == list[i].id);
              if (index > -1) {
                // 更新购物车中商品信息
                arr.push({
                  ...allFood[index],
                  num: list[i].num
                });
              }
            }
            this.curShopCart.list = arr;
          }
        });
      }
      this.getTypeList();
    },

    // 获取菜品分类
    getTypeList() {
      this.typeLoading = true;
      let param = {
        shopid: this.activeCafeId
      };
      fetchTypeList(param)
        .then(res => {
          this.typeLoading = false;
          if (res.success) {
            let data = res.data || [];
            fetchTypeNums(param).then(res => {
              if (res.success) {
                let numList = res.data.filter(i => i.status == "1");
                data.forEach(i => {
                  i.itemnum = 0;
                  numList.forEach(j => {
                    if (i.id == j.shopitemtypeid) {
                      i.itemnum = j.num;
                    }
                  });
                });
                data = data.filter(i => i.itemnum > 0);
                data.sort((a, b) => {
                  return a.level > b.level ? 1 : -1;
                });
                this.tabs = data;
                if (!this.tabs.some(i => i.id == this.activeTab)) {
                  this.activeTab = this.tabs[0].id;
                }
                this.handleClick();
              }
            });
          }
        })
        .catch(err => {
          this.typeLoading = false;
        });
    },

    // 点击tab
    handleClick() {
      // this.curShopCart = this.shopCartList.filter(
      //   i => i.typeid == this.activeTab
      // )[0];
      this.getFoodList();
    },

    // 获取菜品列表
    getFoodList() {
      this.foodLoading = true;
      let param = {
        name: this.keyword || null,
        shopid: this.activeCafeId,
        shopitemtypeid: this.activeTab,
        status: "1"
      };
      fetchAllFoodList(param)
        .then(res => {
          this.foodLoading = false;
          if (res.success) {
            this.foodList = res.data || [];
            this.foodList.forEach(i => {
              this.$set(i, "num", 0);
              i.url = i.photo
                ? window.g.viewUrl + i.photo
                : "@/assets/img/nodata.png";
            });
            if (this.curShopCart && this.curShopCart.list.length > 0) {
              // 设置菜品的购物车数量
              this.curShopCart.list.forEach((i, index) => {
                this.foodList.forEach(j => {
                  if (i.id == j.id) {
                    j.num = i.num;
                  }
                });
              });
            }
            this.setCurShopCartTotal();
            localStorage.setItem(
              this.shopCartName,
              JSON.stringify(this.shopCartList)
            );

            // 记录参数
            let orderParams = {
              ...param,
              shopname: this.activeCafeName
            };
            sessionStorage.setItem("orderParams", JSON.stringify(orderParams));
          }
        })
        .catch(err => {
          this.foodLoading = false;
        });
    },

    // 格式转换
    sendTimeFormat(time) {
      let arr = time.split(",");
      let timeArr = [];
      arr.forEach(i => {
        let iTime = i.split("-");
        timeArr.push(`${iTime[0]} ~ ${iTime[1]}`);
      });
      return timeArr.join("，");
    },
    // 设置购物车数量及金额
    setCurShopCartTotal() {
      if (this.curShopCart) {
        let list = this.curShopCart.list || [];
        // 总金额
        let priceList = list.map(i => {
          let price = i.promotionprice ? i.promotionprice : i.price;
          return this.common.multiply(price, i.num, 2);
        });
        this.totalPrice = priceList.reduce((sum, num) => {
          return this.common.add(sum, num);
        }, 0);
        // 总数量
        let numList = list.filter(i => i.name).map(i => i.num);
        this.totalNum = numList.reduce((sum, num) => {
          return this.common.add(sum, num);
        }, 0);
      } else {
        this.totalNum = 0;
        this.totalPrice = 0;
      }
    },
    // 增减菜品购物车数量
    handleChange(curVal, oldVal, food) {
      if (!curVal) {
        food.num = 0;
        curVal = 0;
      }
      let index = this.curShopCart.list.findIndex(i => i.id == food.id);
      if (curVal == 0) {
        this.curShopCart.list.splice(index, 1);
      } else {
        this.curShopCart.list[index] = food;
      }
      this.$nextTick(() => {
        this.setCurShopCartTotal();
        localStorage.setItem(
          this.shopCartName,
          JSON.stringify(this.shopCartList)
        );
      });
    },

    // 加入购物车
    addToCart(food) {
      food.num += 1;
      // 如果不存在当前购物车，则新增购物车
      if (!this.curShopCart) {
        this.curShopCart = {
          shopid: this.activeCafeId,
          shopname: this.activeCafeName,
          // typeid: this.activeTab,
          list: [food]
        };
        this.shopCartList.push(this.curShopCart);
      } else {
        this.curShopCart.list.push(food);
      }
      this.setCurShopCartTotal();
      localStorage.setItem(
        this.shopCartName,
        JSON.stringify(this.shopCartList)
      );
    },

    // 进入购物车
    toShopCart() {
      this.$router.push({
        // path: `/order/shopCart/${this.activeCafeId}/${this.activeTab}`,
        path: `/order/shopCart/${this.activeCafeId}`,
        query: {
          name: this.activeCafeName
        }
      });
    },

    // 初始化购物车列表
    initShopCart() {
      let data = localStorage.getItem(this.shopCartName);
      this.shopCartList = data ? JSON.parse(data) : [];
    },

    // 初始化页面参数
    initParams() {
      let params = sessionStorage.getItem("orderParams");
      let data = params ? JSON.parse(params) : {};
      this.activeCafeId = data.shopid || this.openCafeList[0].shopid;
      this.activeCafeName = data.shopname || this.openCafeList[0].shopname;
      this.activeTab = data.shopitemtypeid || null;
      this.keyword = data.name;
      this.clickType(this.activeCafeId, this.activeCafeName);
    }
  },
  created() {
    this.getCafeList();
  }
};
</script>

<style lang="scss" scoped>
.food {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  & > p {
    padding: 30px;
  }
  .left-box,
  .right-box {
    height: 100%;
    float: left;
    overflow: hidden;
  }
  .left-box {
    width: 200px;
    border-right: 1px solid #dbdbdb;
  }
  .title {
    border-bottom: 2px solid #e4e7ed;
    h3 {
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      color: #373b4b;
      line-height: 22px;
      padding: 16px 0 10px 20px;
    }
  }
  .list {
    height: calc(100% - 120px);
    overflow-y: auto;
    li {
      color: #6e7384;
      font-size: 16px;
      line-height: 20px;
      padding: 15px 0 15px 20px;
      cursor: pointer;
      p {
        padding-top: 12px;
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        line-height: 18px;
      }
      .tag {
        font-size: 12px;
        font-weight: 400;
        color: #faad14;
        line-height: 20px;
        padding: 1px 8px;
        background: #fffbe6;
        border-radius: 2px;
        border: 1px solid #ffe58f;
        margin-right: 10px;
      }
    }
    .active {
      background: #f5f6fd;
      .name {
        color: #3f86f7;
        font-weight: 600;
      }
      label {
        color: #6e7384;
        font-weight: 600;
      }
    }
  }
  .right-box {
    width: calc(100% - 200px);
    position: relative;
  }
}
.tab-content {
  position: relative;
  margin-top: 0;
  padding: 0 10px 20px;
  height: calc(100% - 150px);
  overflow-y: auto;
}
.search-box-right {
  position: absolute;
  right: 20px;
  top: 5px;
  z-index: 1000;
}
.food-box {
  float: left;
  width: 220px;
  padding-bottom: 10px;
  background: #ffffff;
  box-shadow: 0px 5px 8px 4px rgba(0, 0, 0, 0.05),
    0px 3px 6px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  margin: 15px 10px;
  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
  .food-title {
    position: relative;
    padding: 10px 15px 5px 10px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    .title {
      border: none;
      width: 130px;
    }
    .price {
      position: absolute;
      font-size: 14px;
      right: 10px;
      top: 10px;
    }
    .delete {
      text-decoration: line-through;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      margin-left: 5px;
    }
  }
  p {
    width: 100%;
    padding: 0 10px 4px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
  }
  .btn {
    padding: 0 10px;
    color: #3f86f7;
    line-height: 28px;
    cursor: pointer;
  }
  .el-input-number {
    margin: 0 10px;
  }
}

.tips {
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  padding: 8px 16px;
  background: #fffbe6;
  border-radius: 2px;
  border: 1px solid #ffe58f;
  margin-left: 10px;
  i {
    font-size: 14px;
    color: #faad14;
    margin-right: 5px;
  }
}
.right-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px -3px 6px -4px rgba(0, 0, 0, 0.12),
    0px -6px 16px 0px rgba(0, 0, 0, 0.08), 0px -9px 28px 8px rgba(0, 0, 0, 0.05);
  padding: 16px 20px;
  text-align: right;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  span {
    font-size: 16px;
    font-weight: 600;
    color: #3a78fc;
  }
  .el-button {
    margin-left: 20px;
  }
}
</style>
<style lang="scss">
.right-box {
  .el-tabs {
    .el-tabs__header {
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: #e4e7ed;
        z-index: 1;
      }
      .el-tabs__nav-wrap {
        width: calc(100% - 10px);
      }
    }
  }
}
</style>