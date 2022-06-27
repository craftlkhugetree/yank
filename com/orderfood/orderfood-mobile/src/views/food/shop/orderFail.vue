<template>
  <div class="success-box">
    <van-nav-bar
      class="nav-bar"
      title="支付失败"
      left-arrow
      :border="false"
      fixed
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <div class="success-head">
      <img src="@/assets/img/pay-error.png" class="image" />
      <p class="tip-text">支付失败！</p>
      <p class="tip-more">{{errorMsg}}，请尝试重新支付</p>
    </div>
    <div>
      <van-button class="jumper-btn" type="default" @click="lookOrder">查看订单</van-button>
      <van-button class="jumper-btn2" :loading="payLoading" type="default" @click="againPay">重新支付</van-button>
    </div>
    <!------------------------- 支付信息 ------------------------->
    <section class="order-box">
      <h1 class="order-title">支付信息</h1>
      <p class="order-info">
        <span>支付方式</span>
        <span>校园一卡通</span>
      </p>
      <p class="order-info">
        <span>下单时间</span>
        <span>{{moment(orderData.createtime,"YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss")}}</span>
      </p>
    </section>
  </div>
</template>

<script>
import { getOrderById, payOrder } from "@/api/client/order";
export default {
  props: {
    orderId: String,
    msg: String
  },
  data() {
    return {
      orderData: {},
      foodList: [],
      loading: false,
      badgeNum: 0,
      payLoading: false,
      errorMsg: ""
    };
  },
  computed: {
    // 总费用
    badgePrice() {
      let priceList = this.foodList.map(i => i.totalPrice);
      return priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    }
  },
  components: {},
  mounted() {
    this.getDetail();
    if (this.msg) {
      this.errorMsg = decodeURIComponent(this.msg);
    }
  },
  methods: {
    //跳转到详情页
    jumpDetail(meal) {
      this.$router.push(`/detail/${meal.id}`);
    },
    // 获取详情
    getDetail() {
      this.loading = true;
      let data = {
        id: this.orderId
      };
      getOrderById(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.orderData = res.data || {};
            let cartArr = res.data.items;
            cartArr.forEach(item => {
              this.badgeNum = this.badgeNum + item.itemnum;
              item.totalPrice = this.common.multiply(
                item.price,
                item.itemnum,
                2
              );
            });
            this.foodList = cartArr;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    //重新支付订单
    againPay() {
      let orderId = this.orderId;
      let params = { orderid: orderId, paypwd: null };
      this.payLoading = true;
      payOrder(params).then(res => {
        this.showPay = false;
        this.payLoading = false;
        if (res.success) {
          this.$router.push(`/orderSelfSuccess/${orderId}`);
        } else {
          let msg = res.data.message || "";
          this.errorMsg = msg;
          this.$toast.fail(`支付失败：${msg}`);
          // this.$router.push({
          //   path: `/orderFail/${orderId}`,
          //   query: {
          //     msg: encodeURI(msg)
          //   }
          // });
        }
      });
    },

    //查看订单
    lookOrder() {
      if (this.orderData.ordertype == "self") {
        this.$router.push(`/personalOrder/${this.orderId}`);
      } else {
        this.$router.push(`/companyOrder/${this.orderId}`);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.success-box {
  background: #f6f6f6;
  padding: 24px;
  text-align: center;
  overflow-y: auto;
  height: 100%;
  .success-head {
    margin-top: 124px;
    .image {
      width: 300px;
      height: 200px;
    }
    .tip-text {
      height: 42px;
      font-size: 30px;
      font-weight: 600;
      color: #474d51;
      line-height: 42px;
      margin: 24px 0px;
    }
    .tip-more {
      height: 39px;
      line-height: 39px;
      font-weight: 400;
      color: #474d51;
      font-size: 28px;
      margin-bottom: 24px;
    }
  }
  .jumper-btn,
  .jumper-btn2 {
    width: 265px;
    height: 72px;
    font-size: 30px;
    background: #ffffff;
    border-radius: 36px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-left: 24px;
    margin-bottom: 24px;
  }
  .jumper-btn2 {
    background: #3a78fc;
    border: none !important;
    color: #ffffff;
  }

  .suc-btn {
    margin-top: 32px;
    font-size: 24px;
    color: #686868;
    width: 160px;
    height: 56px;
    border-radius: 28px;
  }
}

.content {
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 10px;
  margin: 0 auto;
  padding: 24px;
  position: relative;
}

.order-box {
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 10px;
  padding: 30px 24px;
  margin-bottom: 24px;
  .order-title {
    height: 39px;
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
    text-align: left;
  }
}
.order-info {
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  font-size: 24px;
  font-weight: 400;
  color: #474d51;
  line-height: 36px;
  .order-ads {
    width: 520px;
    display: inline-block;
    text-align: right;
  }
}
</style>