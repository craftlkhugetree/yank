<template>
  <div class="food">
    <div class="base-search-table">
      <!----------------- 顶部 ----------------->
      <div class="search-box clearfix" style="padding: 15px 20px 10px;">
        <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
        <el-divider direction="vertical"></el-divider>
        {{shopname}}
        <div v-if="shopDetail.ordertype" style="display:inline-block;margin-left:10px;">
          <span v-if="shopDetail.ordertype.includes('group')" class="tag">单位订餐</span>
          <span v-if="shopDetail.ordertype.includes('self')" class="tag">个人订餐</span>
        </div>
      </div>
      <div v-loading="loading" class="detail">
        <p>
          <template v-if="shopDetail.orderway == 1">
          <label>备餐时间：</label>
          <span
            class="ellipsis"
            style="width:300px;"
          >{{shopDetail.preparetime || "--"}}{{common.unitFormat(shopDetail.prepareunit)}}</span>
          </template>
          <template v-else>
          <label>取餐时间：</label>
           <el-tooltip :content="common.pickupTimeText(shopDetail)" placement="top-start">
            <span class="more ellipsis">{{common.pickupTimeText(shopDetail)}}</span>
          </el-tooltip>
          </template>
          <label>联系电话：</label>
          <el-tooltip :content="shopDetail.mobile || '--'" placement="top-start">
            <span class="more ellipsis">{{shopDetail.mobile || "--"}}</span>
          </el-tooltip>
        </p>
        <p>
          <label v-if="shopDetail.orderway == 1">配送时间：</label>
          <el-tooltip v-if="shopDetail.orderway == 1" :content="sendTimeFormat(shopDetail.sendtime)" placement="top-start">
            <span class="ellipsis" style="width:300px;">{{sendTimeFormat(shopDetail.sendtime)}}</span>
          </el-tooltip>
          <label>餐厅说明：</label>
          <el-tooltip :content="shopDetail.note || '--'" placement="top-start">
            <span class="more ellipsis">{{shopDetail.note || "--"}}</span>
          </el-tooltip>
        </p>
      </div>
    </div>

    <!----------------- 菜品分类 ----------------->
    <div class="food-list" v-loading="typeLoading">
      <div class="nodata animation-1" v-if="tabs.length == 0">
        <img src="@/assets/img/nocafe.png" alt />
        <p>暂无菜品</p>
      </div>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id">
          <span slot="label">{{tab.name}} {{tab.itemnum}}</span>
        </el-tab-pane>
      </el-tabs>
      <div class="tab-content clearfix" v-loading="foodLoading">
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
        </div>
        <div
          class="food-box"
          v-for="(food,index) in foodList"
          :key="food.id"
          :class="`animation-${index+1}`"
        >
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
            :max="food.max"
            size="mini"
            step-strictly
          ></el-input-number>
          <span v-if="food.num == 0 && (food.lastnum > 0 || food.lastnum == null)" class="btn" @click="addToCart(food)">加入购物车</span>
          <span v-if="food.num == 0 && food.lastnum <= 0" class="btn disabled" style="color: #999;cursor:auto;">加入购物车</span>
          <span class="limit" v-if="food.onelimit=='1' || food.alllimit == '1'">
            <span>{{food.limittext}}</span>
          </span>
        </div>
      </div>
    </div>

    <!---------------------------- 底部 -------------------------->
    <div class="right-footer" v-if="!foodLoading">
      共{{totalNum}}份，合计：
      <span>{{totalPrice}}元</span>
      <el-button type="primary" size="small" @click="toShopCart">去结算</el-button>
    </div>
  </div>
</template>

<script>
import { fetchCafeConfig } from "@/api/admin/cafe";
import {
  fetchTypeList,
  fetchAllFoodList,
  fetchTypeNums,
} from "@/api/admin/food";
export default {
  props: {
    shopid: String,
    shopname: String
  },
  data() {
    return {
      loading: false,
      shopDetail: {},
      tabs: [],
      activeTab: null,
      typeLoading: false,
      keyword: null,
      foodList: [],
      foodLoading: false,
      totalNum: 0,
      totalPrice: 0,
      shopCartList: [],
      curShopCart: null,
    };
  },
  computed: {
    // 当前用户购物车列表名称
    shopCartName() {
      return "shopCartList-" + this.$store.state.userInfo.ID;
    },
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
    // 获取餐厅的配置
    getCafeConfig() {
      let param = {
        shopid: this.shopid
      };
      this.loading = true;
      fetchCafeConfig(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.shopDetail = res.data;
            let mobiles = res.data.mobile || "";
            this.shopDetail.mobiles = mobiles.split(",").join("，");
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 格式转换
    sendTimeFormat(time) {
      let arr = time ? time.split(",") : [];
      let timeArr = [];
      arr.forEach(i => {
        let iTime = i.split("-");
        timeArr.push(`${iTime[0]} ~ ${iTime[1]}`);
      });
      return timeArr.join("，");
    },
    // 获取菜品分类
    getTypeList() {
      this.tabs = [];
      this.typeLoading = true;
      let param = {
        shopid: this.shopid
      };
      fetchTypeList(param)
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            fetchTypeNums(param).then(res => {
              this.typeLoading = false;
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
                this.getFoodList();
              }
            });
          } else {
            this.typeLoading = false;
          }
        })
        .catch(err => {
          this.typeLoading = false;
        });
    },
    // 点击分类
    handleClick() {
      this.getFoodList();
    },

    // 获取菜品列表
    getFoodList() {
      this.foodList = [];
      this.foodLoading = true;
      let param = {
        name: this.keyword || null,
        shopid: this.shopid,
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
            // 设置菜品的剩余数量 和 最大可选值
            this.common.setLastAndMaxNum(this.foodList);
            if (this.curShopCart && this.curShopCart.list.length > 0) {
              // 设置菜品的购物车数量
              this.curShopCart.list.forEach((i, index) => {
                this.foodList.forEach(j => {
                  if (i.id == j.id) {
                    let num = i.num > j.max ? j.max : i.num;
                    j.num = i.num = num;
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
    async handleChange(curVal, oldVal, food) {
      // 如果限制每人预定数量
      if (food.onelimit == "1" && curVal > oldVal) {
        // 获取当前登录人已购买量
        let perLimit = await this.common.fetchItemBuyNum(food);
        if (perLimit <= 0 || curVal > perLimit) {
          this.$message({
            showClose: true,
            type: "error",
            message: `每人最多预订${food.onelimitnum}份!`
          });
          food.num = oldVal;
          return;
        }
      }
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
    async addToCart(food) {
      // 如果限制每人预定数量
      if (food.onelimit == "1") {
        // 获取当前登录人已购买量
        let perLimit = await this.common.fetchItemBuyNum(food);
        if (perLimit <= 0) {
          this.$message({
            showClose: true,
            type: "error",
            message: `每人最多预订${food.onelimitnum}份!`
          });
        } else {
          this.doAddToCart(food);
        }
      } else {
        this.doAddToCart(food);
      }
    },
    // 执行加入购物车
    doAddToCart(food) {
      food.num += 1;
      // 如果不存在当前购物车，则新增购物车
      if (!this.curShopCart) {
        this.curShopCart = {
          shopid: this.shopid,
          shopname: this.shopname,
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
        path: `/order/shopCart/${this.shopid}`,
        query: {
          name: this.shopname
        }
      });
    },

    // 初始化购物车列表
    initShopCart() {
      let data = localStorage.getItem(this.shopCartName);
      this.shopCartList = data ? JSON.parse(data) : [];
      this.curShopCart =
        this.shopCartList.filter(i => i.shopid == this.shopid)[0] || null;
      if (this.curShopCart) {
        // 获取该餐厅下的所有菜品
        fetchAllFoodList({
          shopid: this.shopid,
          status: "1"
        }).then(res => {
          if (res.success) {
            let allFood = res.data || [];
            this.common.setLastAndMaxNum(allFood);
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
    }
  },
  created() {
    this.getCafeConfig();
    this.getTypeList();
  }
};
</script>

<style lang="scss" scoped>
.food {
  margin: 20px 0 0 20px;
  height: calc(100% - 20px);
  overflow: hidden;
  position: relative;
}
.base-search-table {
  position: relative;
  overflow: hidden;
  background: #fff;
  margin-bottom: 10px;
}
.search-box {
  width: 100%;
  border-bottom: 1px solid #d8d8d8;
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 22px;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
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
.detail {
  padding: 10px 20px 0;
  p {
    margin-bottom: 10px;
    label {
      font-size: 13px;
      font-weight: 600;
      color: #6e7384;
      line-height: 18px;
    }
    span {
      display: inline-block;
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      margin-right: 20px;
      vertical-align: sub;
    }
    .more {
      width: 40%;
      // width: calc(100% - 500px);
    }
  }
}
.food-list {
  height: calc(100% - 180px);
  background: #fff;
  overflow: hidden;
}
.tab-content {
  position: relative;
  margin-top: -5px;
  padding: 30px 10px 10px;
  overflow-y: auto;
  height: calc(100% - 70px);
}
.search-box-right {
  position: absolute;
  right: 20px;
  top: 0;
}
.food-box {
  float: left;
  width: 220px;
  padding-bottom: 10px;
  background: #ffffff;
  box-shadow: 0px 5px 8px 4px rgba(110, 115, 132, 0.05),
    0px 3px 6px 0px rgba(110, 115, 132, 0.08),
    0px 3px 6px -4px rgba(110, 115, 132, 0.12);
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

  .limit {
    color: #fd7d18;
    float: right;
    line-height: 28px;
    padding-right: 10px;
  }
  .el-input-number {
    margin: 0 0 0 10px;
  }
  .el-input-number--mini {
    width: 110px;
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