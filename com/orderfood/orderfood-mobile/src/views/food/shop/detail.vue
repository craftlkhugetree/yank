<template>
  <div class="wrapper">
    <van-nav-bar
      class="nav-bar"
      title="我要订餐"
      :border="false"
      left-arrow
      fixed
      @click-left="reback"
    ></van-nav-bar>
    <!---------------------------- 菜品详情页 ---------------------------->
    <section class="main-wapper">
      <div class="bigImg">
        <img
          :src="common.viewIcon(food.photo)"
          class="image"
          v-if="food.photo && food.photo != '-1'"
        />
        <img src="@/assets/img/no-img.png" class="image" v-else />
      </div>
      <div class="meal-box">
        <h1 class="name ellipsis">{{ food.name }}</h1>
        <div v-show="food.note" class="res-des">{{ food.note }}</div>
        <div class="money-div">
          <span class="orange-money">
            <i class="orange-tag">￥</i>
            <span class="orange-num">{{
              food.promotionprice ? food.promotionprice : food.price
            }}</span>
            <span v-show="food.promotionprice">
              <i class="gray-tag">￥</i>
              <span class="gray-num">{{ food.price }}</span>
            </span>
            <span
              class="limit-tips"
              v-show="food.onelimit == '1' || food.alllimit == '1'"
              >{{ food.limittext }}
            </span>
          </span>
          <span class="right-btn">
            <!-- 选中改变数字值，删除仍保留减号及input框 -->
            <van-stepper
              v-if="food.id == changeIndex"
              v-model="food.num"
              theme="round"
              button-size="22"
              :min="0"
              :max="food.max"
              integer
              @blur="(event) => handleBlur(event, food)"
            />
            <!-- 非选中数字时 -->
            <van-stepper
              v-else
              :show-minus="food.num >= 1"
              :show-input="food.num >= 1"
              :value="food.num"
              async-change
              theme="round"
              button-size="22"
              :min="0"
              :max="food.max"
              integer
              @focus="(event) => handleFocus(event, food)"
              @plus="addNum(food)"
              @minus="reduceNum(food)"
            />
          </span>
        </div>
      </div>
    </section>
    <footer-cart
      ref="footerCart"
      v-if="activeCafeId"
      :shopId="activeCafeId"
      :shopTypeId="shopTypeId"
      @toRefresh="doRefresh"
    ></footer-cart>
  </div>
</template>
<script>
import FooterCart from "./components/footerCart";
import { fetchDetail } from "@/api/client/order";
export default {
  data() {
    return {
      changeIndex: "",
      activeCafeId: null,
      shopTypeId: null,
      food: {},
      curShopCart: null, //当前餐厅的购物车
      shopCartList: [], //当前用户下所有餐厅的购物车
    };
  },
  components: { FooterCart },
  props: {
    id: String,
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
      immediate: true,
    },
  },
  created() {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.initShopCart();
    this.getDetail();
  },
  methods: {
    reback() {
      this.$router.push({
        path: `/menuList/${this.activeCafeId}`,
        query: {
          shopTypeId: this.shopTypeId,
        },
      });
    },
    //购物车数量增减
    doRefresh(curShopId, shopTypeId) {
      this.initShopCart();
      this.curShopCart = this.shopCartList.filter(
        (i) => i.shopid == this.shopId
      )[0];
      this.getDetail();
    },

    // 初始化购物车列表
    initShopCart() {
      let data = localStorage.getItem(this.shopCartName);
      this.shopCartList = data ? JSON.parse(data) : [];
    },

    //失去焦点时
    async handleBlur(event, food) {
      this.changeIndex = "";
      let curNum = food.num > food.max ? food.max : food.num;
      this.$set(food, "num", curNum);
      //个人限制--个人剩余量
      if (food.onelimit == "1") {
        let personSurplusNum = await this.common.fetchItemBuyNum(food);
        if (food.num > personSurplusNum) {
          this.$set(food, "num", personSurplusNum);
          this.$toast.fail(`限${food.onelimitnum}份每人`);
        }
      }
      let index = this.curShopCart.list.findIndex((i) => i.id == food.id);
      this.curShopCart.list[index] = food;
      localStorage.setItem(
        this.shopCartName,
        JSON.stringify(this.shopCartList)
      );
      this.$refs.footerCart.initShopCart();
    },

    //获取焦点时
    handleFocus(event, res) {
      this.changeIndex = res.id;
    },

    // 购物车数量加1  如果不存在当前购物车，则新增购物车
    async addNum(food) {
      //个人限制--个人剩余量
      if (food.onelimit == "1") {
        let personSurplusNum = await this.common.fetchItemBuyNum(food);
        if (food.num >= personSurplusNum) {
          this.$toast.fail(`限${food.onelimitnum}份每人`);
          return false;
        }
      }
      //总量限制
      if (food.alllimit == "1" && food.num > food.lastnum) {
        this.$toast.fail(`菜品余量不足，最多可定${food.lastnum}份`);
        return false;
      }
      food.num += 1;
      food.newprice = food.promotionprice ? food.promotionprice : food.price;
      this.$forceUpdate();
      if (!this.curShopCart) {
        this.curShopCart = {
          shopid: food.shopid,
          shopTypeId: food.shopitemtypeid,
          shopname: food.shopname,
          num: 1,
          list: [food],
        };
        this.shopCartList.push(this.curShopCart);
      } else {
        let index = this.curShopCart.list.findIndex((i) => i.id == food.id);
        if (index == -1) {
          this.curShopCart.list.push(food);
        }
        this.curShopCart.num += 1;
      }
      localStorage.setItem(
        this.shopCartName,
        JSON.stringify(this.shopCartList)
      );
      this.$refs.footerCart.initShopCart();
    },

    // 购物车数量减1
    reduceNum(food) {
      let index = this.curShopCart.list.findIndex((i) => i.id == food.id);
      if (food.num == 1) {
        this.curShopCart.num -= 1;
        food.num = 0;
        this.curShopCart.list.splice(index, 1);
      } else {
        food.num -= 1;
        this.curShopCart.num -= 1;
        this.curShopCart.list[index] = food;
      }
      localStorage.setItem(
        this.shopCartName,
        JSON.stringify(this.shopCartList)
      );
      this.$refs.footerCart.initShopCart();
      this.$forceUpdate();
    },

    // 设置菜品的剩余数量 和 最大可选值
    setLastAndMaxNum(i) {
      if (i.alllimit == "1") {
        i.lastnum = parseInt(
          this.common.subtract(i.alllimitnum, i.allbuynum, 0)
        );
      }
      // 设置限制文本 和 限制数量
      if (i.alllimit == "1" && i.onelimit == "0") {
        i.limittext = `剩余${i.lastnum}份`;
        this.$set(i, "max", i.lastnum);
      } else if (i.alllimit == "0" && i.onelimit == "1") {
        i.limittext = `限${i.onelimitnum}份/人`;
        this.$set(i, "max", i.onelimitnum);
      } else if (i.alllimit == "1" && i.onelimit == "1") {
        i.limittext =
          i.lastnum > i.onelimitnum
            ? `限${i.onelimitnum}份/人`
            : `剩余${i.lastnum}份`;
        let max = i.lastnum > i.onelimitnum ? i.onelimitnum : i.lastnum;
        this.$set(i, "max", max);
      }
    },

    // 获取详情
    getDetail() {
      this.loading = true;
      let data = {
        id: this.id,
      };
      fetchDetail(data)
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.food = res.data || {};
            this.food.num = 0;
            this.setLastAndMaxNum(this.food);
            let shopid = res.data.shopid;
            this.activeCafeId = shopid;
            this.shopTypeId = res.data.shopitemtypeid;
            this.curShopCart = this.shopCartList.filter(
              (i) => i.shopid == shopid
            )[0];
            // 设置单个菜品的购物车数量
            if (this.curShopCart && this.curShopCart.list.length > 0) {
              this.curShopCart.list.forEach((item) => {
                if (item.id == this.food.id) {
                  this.food = item;
                }
              });
            }
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wapper {
  padding: 32px 0px;
  margin-top: 64px;
  min-height: 1250px;
  background: #f6f6f6;
}
.bigImg {
  width: 100%;
  height: 566px;
  display: block;
}
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-box {
  display: block;
  margin: 24px;
  padding: 24px;
  // height: 234px;
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 10px;
  .money-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
  }
  .name {
    height: 54px;
    font-size: 39px;
    font-weight: 600;
    color: #474d51;
    line-height: 54px;
    display: block;
    .search-text {
      color: #586add !important;
    }
  }
  .res-des {
    margin-top: 12px;
    font-size: 23px;
    font-weight: 400;
    color: #999999;
    line-height: 40px;
    word-break: break-all;
    word-wrap: break-word;
    width: 100%;
  }

  .right-btn {
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .orange-money {
    font-size: 46px;
    font-weight: 600;
    color: #fd7d18;
    line-height: 64px;
    .orange-tag {
      font-size: 30px;
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
    .limit-tips {
      font-size: 22px;
      line-height: 48px;
      margin-left: 12px;
    }
  }
  .num {
    padding: 0 18px;
    color: #474d51;
    font-size: 28px;
  }
  .minus-btn {
    border: 1px solid #3f86f7 !important;
  }
  .plus-btn {
    margin-right: 27px;
    background-color: #3f86f7 !important;
    border: 1px solid #3f86f7 !important;
  }
}
</style>
