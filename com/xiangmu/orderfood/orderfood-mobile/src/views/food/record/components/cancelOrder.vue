<template>
  <div class="success-box">
    <van-nav-bar
      class="nav-bar"
      title="取消订单"
      left-arrow
      :border="false"
      fixed
      @click-left="$router.push('/record')"
    ></van-nav-bar>
    <div class="success-head">
      <img src="@/assets/img/appoint-ok.png" class="image" />
      <p class="tip-text">订单已取消！</p>
      <p v-show="orderStatus!='0'" class="tip-more">您的订单已取消，系统将自动退款至原账户</p>
    </div>
    <div>
      <van-button class="jumper-btn" type="default" @click="keepOrder">返回首页</van-button>
      <van-button class="jumper-btn2" type="default" @click="lookOrder">查看订单</van-button>
    </div>

    <!------------------------- 支付信息 ------------------------->
    <section class="order-box">
      <h1 class="order-title">支付信息</h1>
      <p class="order-info">
        <span>支付方式</span>
        <span>校园一卡通</span>
      </p>
      <p class="order-info">
        <span>支付金额</span>
        <span>￥{{badgePrice}}</span>
      </p>
      <p class="order-info">
        <span>下单时间</span>
        <span>{{moment(orderData.createtime,"YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss")}}</span>
      </p>
    </section>
  </div>
</template>

<script>
import { getOrderById } from "@/api/client/order";
export default {
  props: {
    shopId: String,
    orderStatus: String
  },
  data() {
    return {
      orderData: {},
      foodList: [],
      loading: false,
      badgeNum: 0
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
    console.log("orderStatus", this.orderStatus);
    this.getDetail();
  },
  methods: {
    //继续订单
    keepOrder() {
      this.$router.push(`/home`);
    },
    //查看订单
    lookOrder() {
      this.$router.push(`/personalOrder/${this.shopId}`);
    },
    //跳转到详情页
    jumpDetail(meal) {
      this.$router.push(`/detail/${meal.id}`);
    },
    // 获取详情
    getDetail() {
      this.loading = true;
      let data = {
        id: this.shopId
      };
      getOrderById(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || {};
            let len = data.id.toString().length;
            data.id = "T" + Array(9 - len).join("0") + data.id;
            this.orderData = data || {};
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
    margin-top: 88px;
    padding-top: 60px;

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
      margin: 24px 0;
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
  .title-box {
    padding: 10px 0;
  }
  .h1-title {
    width: 480px;
    font-size: 28px;
    line-height: 39px;
    text-indent: 24px;
    text-align: left;
    font-weight: blod;
    color: #474d51;
  }
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