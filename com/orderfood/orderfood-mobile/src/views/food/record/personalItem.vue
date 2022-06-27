<template>
  <div class="list-item">
    <div class="title">
      订单 #{{Tid}}
      <div v-if="item.orderstatus=='0'" class="right-btn">
        <span
          :class="rocallTime == '00:00' ? 'graytag' : 'yellowtag'"
        >{{rocallTime=='00:00'?"已取消":"等待支付"}}</span>
        <span class="rocall-time" v-show="rocallTime!='00:00'">剩余{{rocallTime}}</span>
      </div>
      <span v-if="item.orderstatus=='1'" class="yellowtag right">待配餐</span>
      <span v-if="item.orderstatus=='2'" class="yellowtag right">待取餐</span>
      <span v-if="item.orderstatus=='3'" class="bluetag right">已取餐</span>
      <span v-if="item.orderstatus=='4'" class="graytag right">已取消</span>
    </div>
    <div class="content clearfix">
      <div class="div-info">
        <h3 class="van-ellipsis h3-title">{{item.shopname}}</h3>
        <div class="div-box">
          <div class="meal-des">
            <span class="meals ellipsis">{{meals}}</span>
            <span class="tips">{{tips}}</span>
          </div>
          <span class="black-money">
            <i class="black-tag">￥</i>
            <span class="black-num">{{badgePrice}}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },
  data() {
    return {
      meals: "",
      tips: "",
      badgePrice: 0,
      rocallTime: "00:00"
    };
  },

  created() {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.getOrder(this.item);
    //是等待支付状态时，倒计时
    if (this.item.orderstatus == "0") {
      this.computetTime(this.item);
    }
  },
  computed: {
    Tid() {
      let len = this.item.id.toString().length;
      let tid = "T" + Array(9 - len).join("0") + this.item.id;
      return tid;
    },
    // 状态列表
    statusList() {
      return this.$store.state.statusList;
    }
  },
  methods: {
    //支付倒计时  计算下单时间距离现在的时间差
    computetTime(data) {
      let orderTime = this.moment(data.createtime, "YYYYMMDD HH:mm:ss");
      let now = this.moment();
      let diff = now.diff(orderTime, "seconds", true); //minutes
      let cm = 15 * 60 * 1000 - diff * 1000;
      this.runBack(cm);
    },
    runBack(cm) {
      if (cm > 0) {
        cm > 60000
          ? (this.rocallTime =
              (new Date(cm).getMinutes() < 10
                ? "0" + new Date(cm).getMinutes()
                : new Date(cm).getMinutes()) +
              ":" +
              (new Date(cm).getSeconds() < 10
                ? "0" + new Date(cm).getSeconds()
                : new Date(cm).getSeconds()))
          : (this.rocallTime =
              "00:" +
              (new Date(cm).getSeconds() < 10
                ? "0" + new Date(cm).getSeconds()
                : new Date(cm).getSeconds()));

        let _msThis = this;
        setTimeout(function() {
          cm -= 1000;
          _msThis.runBack(cm);
        }, 1000);
      } else {
        this.rocallTime = "00:00";
      }
    },
    getOrder(shops) {
      let strArr = [],
        sum = 0;
      let cartList = shops.items;
      cartList.forEach(meal => {
        let newprice = meal.promotionprice ? meal.promotionprice : meal.price;
        let des = `${meal.itemname} x${meal.itemnum}`;
        strArr.push(des);
        sum = sum + meal.itemnum;
        meal.totalPrice = this.common.multiply(newprice, meal.itemnum, 2);
      });
      let strShop = strArr.join("，");
      let Tips = cartList.length > 1 ? `等${sum}份商品` : "";
      this.meals = strShop;
      this.tips = Tips;

      let priceList = cartList.map(i => i.totalPrice);
      this.badgePrice = priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.list-item {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 10px;
  margin-bottom: 24px;
  .title {
    font-size: 24px;
    color: #7d7d80;
    line-height: 28px;
    padding-left: 24px;
    padding-top: 24px;
    .yellowtag {
      font-size: 24px;
      color: #ff9f0a;
      padding-right: 24px;
    }
    .bluetag {
      font-size: 24px;
      color: #3f86f7;
      padding-right: 24px;
    }
    .graytag {
      font-size: 24px;
      color: #999999;
      padding-right: 24px;
    }
    .right {
      float: right;
    }
  }
  .content {
    padding: 24px;
    .div-info {
      .h3-title {
        height: 39px;
        font-size: 28px;
        font-weight: 600;
        color: #474d51;
        line-height: 39px;
      }
    }
    .div-box {
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .meal-des {
        display: flex;
      }
    }
    .meals {
      width: 300px;
      font-size: 24px;
      font-weight: 400;
      color: #999999;
      display: inline-block;
    }
    .tips {
      font-size: 24px;
      font-weight: 400;
      color: #999999;
      display: inline-block;
    }
  }
}
.black-money {
  font-size: 28px;
  font-weight: 400;
  color: #474d51;
  line-height: 36px;
  .black-tag {
    font-size: 24px;
  }
}
.right-btn {
  float: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.rocall-time {
  color: #999999;
  font-size: 24px;
  margin-left: 10px;
  padding-right: 24px;
  margin-top: 12px;
}
</style>