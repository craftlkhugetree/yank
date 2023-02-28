<template>
  <div class="success-box">
    <van-nav-bar
      class="nav-bar"
      title="支付超额"
      left-arrow
      :border="false"
      fixed
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <div class="success-head">
      <img src="@/assets/img/pay-error.png" class="image" />
      <p class="tip-text">支付超额！</p>
      <p class="tip-more">请输入支付密码（默认身份证后六位）</p>
      <div class="pswd">
        <van-password-input
          :value="value"
          :length="6"
          :error-info="errorInfo"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
        <van-number-keyboard v-model="value" :show="showKeyboard" @blur="showKeyboard = false" />
      </div>
    </div>
    <div>
      <van-button class="jumper-btn" type="default" @click="lookOrder">取消</van-button>
      <van-button class="jumper-btn2" :loading="payLoading" type="default" @click="againPay">确认支付</van-button>
    </div>
  </div>
</template>

<script>
import JSEncrypt from "@/assets/js/jsencrypt.min";
import { getOrderById, payOrder } from "@/api/client/order";
export default {
  props: {
    orderId: String,
    msg: String
  },
  data() {
    return {
      value: "",
      errorInfo: "",
      showKeyboard: true,
      orderData: {},
      foodList: [],
      loading: false,
      badgeNum: 0,
      payLoading: false,
      errorMsg: "",
      publicKey: window.g.publicKey
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
      if (this.value.length < 6) {
        this.errorInfo = "请输入六位支付密码！";
        return false;
      }
      let sixValue = this.value.substring(0, 6);
      let orderId = this.orderId;
      const jse = new JSEncrypt();
      jse.setPublicKey(this.publicKey);
      let paypwd_encrypt = jse.encrypt(sixValue);

      let params = { orderid: orderId, paypwd: paypwd_encrypt };
      this.payLoading = true;
      payOrder(params).then(res => {
        this.showPay = false;
        this.payLoading = false;
        if (res.success) {
          this.$router.push(`/orderSelfSuccess/${orderId}`);
        } else {
          let msg = res.data.message || "";
          this.errorMsg = msg;
          // this.$toast.fail(`支付失败：${msg}`);
          this.errorInfo = `支付失败：${msg}`;
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
.pswd {
  margin-bottom: 24px;
}
</style>