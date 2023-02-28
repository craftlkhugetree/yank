<template>
  <div class="success-box">
    <van-nav-bar
      class="nav-bar"
      title="确认取餐"
      left-arrow
      :border="false"
      fixed
      @click-left="$router.push('/record')"
    ></van-nav-bar>
    <div class="success-head">
      <img src="@/assets/img/appoint-ok.png" class="image" />
      <p class="tip-text">订单确认取餐成功！</p>
    </div>
    <div>
      <h1 class="order-h1">
        订单 #{{orderData.id}}
        <van-tag plain type="primary" class="tag-blue">已取餐</van-tag>
      </h1>
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

    <section class="order-box">
      <h1 class="order-title">取餐信息</h1>
      <p class="order-info">
        <span>联系手机</span>
        <span>{{orderData.mobile}}</span>
      </p>
      <p class="order-info">
        <span>期望取餐</span>
        <!-- <span class="bold" >{{moment(orderData.senddate,"YYYYMMDDHHmmss").format("YYYY-MM-DD")}} {{orderData.sendtime}}</span> -->
        <span :class="common.expectFetch(orderData) == '--' ? '' : 'bold'">{{common.expectFetch(orderData)}}</span>
      </p>
      <p class="order-info" v-show="orderData.flow">
        <span>取餐序号</span>
        <span class="bold">#{{orderData.flow}}</span>
      </p>
    </section>
    <section class="order-box">
      <h1 class="order-title">订单信息</h1>
      <p class="order-info">
        <span>下单时间</span>
        <span>{{moment(orderData.createtime,"YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss")}}</span>
      </p>
      <p class="order-info">
        <span>签收时间</span>
        <span>{{ common.defaultTimeFormat(orderData.signtime)}}</span>
      </p>
      <p class="order-info">
        <span>签收人</span>
        <span>{{orderData.signername}}（{{orderData.signerid}}）</span>
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
            let data = res.data || {};
            let len = data.id.toString().length;
            data.id = "T" + Array(9 - len).join("0") + data.id;
            this.orderData = data || {};
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
    padding-bottom: 30px;
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
      margin-top: 24px;
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
.order-h1 {
  text-align: left;
  font-size: 32px;
  font-weight: 600;
  color: #474d51;
  line-height: 38px;
  padding-bottom: 24px;
  .tag-blue {
    background: #ebf2fe;
    border-radius: 6px;
    border-color: #85b2fa;
    font-size: 24px;
    font-weight: 400;
    color: #3f86f7;
    padding: 8px;
    height: 38px;
    margin-left: 12px;
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
  .bold {
    font-weight: bold;
    color: #fd7d18;
  }
  .order-ads {
    width: 520px;
    display: inline-block;
    text-align: right;
  }
}
</style>