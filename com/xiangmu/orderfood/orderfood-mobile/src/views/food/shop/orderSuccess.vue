<template>
  <div class="success-box">
    <van-nav-bar
      class="nav-bar"
      title="提交成功"
      left-arrow
      :border="false"
      fixed
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <div class="success-head">
      <img src="@/assets/img/appoint-ok.png" class="image" />
      <p class="tip-text">提交成功！</p>
    </div>
    <div>
      <van-button class="jumper-btn" type="default" @click="keepOrder">继续订餐</van-button>
      <van-button class="jumper-btn2" type="default" @click="lookOrder">查看订单</van-button>
    </div>
    <!------------------------- 订单列表 ------------------------->

    <section class="order-box">
      <h1 class="order-subtitle">{{orderData.shopname}}</h1>
      <template v-for="(res,index) in foodList">
        <div
          class="res-ordercard"
          :class="`animation-${index + 1}`"
          :key="'res2'+index"
          :body-style="{ padding: '0px' }"
        >
          <div class="img-box">
            <img :src="common.viewIcon(res.photo)" class="image" v-if="res.photo&&res.photo!='-1'" />
            <img src="@/assets/img/no-img.png" class="image" v-else />
          </div>
          <div class="right-box">
            <h1 class="ordername ellipsis">{{res.itemname}}</h1>
            <p>
              <span class="num">
                <i class="min">x</i>
                {{res.itemnum}}
              </span>
            </p>
          </div>
          <span class="black-money">
            <span>
              <i class="black-tag">￥</i>
              <span class="black-num">{{res.totalPrice}}</span>
            </span>
            <span class="sales" v-show="res.promotionprice">
              <i class="gray-tag">￥</i>
              <span class="gray-num">{{res.price}}</span>
            </span>
          </span>
        </div>
      </template>
      <div class="total-div">
        <span class="total-money">
          共{{badgeNum}}份，合计：
          <span class="orange-money">
            <i class="orange-tag">￥</i>
            <span class="orange-num">{{badgePrice}}</span>
          </span>
        </span>
      </div>
      <p class="order-info">
        <span>订餐类型</span>
        <span>{{orderData.ordertype=='group'?"单位订餐":'个人订餐'}}</span>
      </p>
    </section>
    <section class="order-box" v-if="orderData.ordertype=='group'">
      <h1 class="order-title">配送信息</h1>
      <div class="order-info">
        <span>配送地址</span>
        <div class="order-ads">
          <span>{{orderData.area}}{{orderData.house}}</span>
        </div>
      </div>
      <div class="order-info">
        <span></span>
        <div class="order-ads">
          <span>{{orderData.settlername}}（{{orderData.settlerid}}） {{orderData.mobile}}</span>
        </div>
      </div>

      <p class="order-info">
        <span>期望送达</span>
        <!-- <span>{{moment(orderData.senddate,"YYYYMMDDHHmmss").format("YYYY-MM-DD")}} {{orderData.sendtime}}</span> -->
        <span :class="common.expectFetch(orderData) == '--' ? '' : 'bold'">{{common.expectFetch(orderData)}}</span>
      </p>
      <p class="order-info">
        <span>订餐事由</span>
        <span class="reason-info">{{orderData.reason||'--'}}</span>
      </p>
    </section>
    <section class="order-box" v-else>
      <h1 class="order-title">取餐信息</h1>
      <p class="order-info">
        <span>联系手机</span>
        <span>{{orderData.mobile}}</span>
      </p>
      <p class="order-info">
        <span>期望取餐</span>
        <!-- <span>{{moment(orderData.senddate,"YYYYMMDDHHmmss").format("YYYY-MM-DD")}} {{orderData.sendtime}}</span> -->
        <span>{{common.expectFetch(orderData)}}</span>
      </p>
    </section>
    <section class="order-box">
      <h1 class="order-title">订单信息</h1>
      <p class="order-info" v-show="orderData.ordertype=='group'">
        <span>订餐人</span>
        <span>{{orderData.creatername}}（{{orderData.createrid}}）</span>
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
    shopId: String
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
    this.getDetail();
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
        id: this.shopId
      };
      getOrderById(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.orderData = res.data || {};
            let cartArr = res.data.items;
            cartArr.forEach(item => {
              item.newprice = item.promotionprice
                ? item.promotionprice
                : item.price;
              this.badgeNum = this.badgeNum + item.itemnum;
              item.totalPrice = this.common.multiply(
                item.newprice,
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

    //继续订单
    keepOrder() {
      this.$router.push(`/home`);
    },

    //查看订单
    lookOrder() {
      if (this.orderData.ordertype == "self") {
        this.$router.push(`/personalOrder/${this.shopId}`);
      } else {
        this.$router.push(`/companyOrder/${this.shopId}`);
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

.total-div {
  text-align: right;
  padding-bottom: 24px;
  border-bottom: 1px solid #dbdbdb;
  .total-money {
    height: 36px;
    font-size: 24px;
    font-weight: 400;
    color: #474d51;
    line-height: 36px;
    .orange-money {
      font-size: 37px;
      color: #fd7d18;
      line-height: 48px;
      .orange-tag {
        font-size: 24px;
        font-weight: 600;
      }
      .orange-num {
        font-weight: 600;
      }
    }
  }
}
.order-box {
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 10px;
  padding: 30px 24px;
  margin-bottom: 24px;
  .order-subtitle {
    height: 39px;
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
    text-align: left;
    margin-bottom: 32px;
  }
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
  .bold {
    font-weight: bold;
    color: #fd7d18;
  }
}
.reason-info {
  width: 70%;
  line-height: 36px;
  text-align: right;
}
</style>