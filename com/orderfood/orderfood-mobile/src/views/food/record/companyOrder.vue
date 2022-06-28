<template>
  <div class="success-box">
    <van-nav-bar
      class="nav-bar"
      title="查看订单"
      :border="false"
      left-arrow
      fixed
      @click-left="jumperTab"
    ></van-nav-bar>

    <div class="main-wapper">
      <h1 class="h1-title">
        订单 #{{orderData.id}}
        <van-tag plain type="primary" class="tag-orange" v-if="orderData.orderstatus=='1'">待确认</van-tag>
        <van-tag plain type="primary" class="tag-orange" v-if="orderData.orderstatus=='2'">配送中</van-tag>
        <van-tag plain type="primary" class="tag-blue" v-if="orderData.orderstatus=='3'">已送达</van-tag>
        <van-tag plain type="primary" class="tag-gray" v-if="orderData.orderstatus=='4'">已取消</van-tag>
      </h1>
      <div class="yellow-tips" v-if="orderData.orderstatus=='2'">
        <van-icon name="warning" color="#FAAD14" size="20" />
        <span>送餐上门后请扫码收餐，并及时结算订单。</span>
      </div>
      <!------------------------- 订单列表 ------------------------->
      <div class="order-div">
        <section class="order-box">
          <h1 class="order-subtitle">{{orderData.shopname}}</h1>
          <template v-for="(res,index) in foodList">
            <div
              class="res-ordercard"
              :class="`animation-${index + 1}`"
              :key="'company'+index"
              :body-style="{ padding: '0px' }"
            >
              <div class="img-box">
                <img
                  :src="common.viewIcon(res.photo)"
                  class="image"
                  v-if="res.photo&&res.photo!='-1'"
                />
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
            <span>单位订餐</span>
          </p>
        </section>
        <section class="order-box">
          <h1 class="order-title">配送信息</h1>
          <div class="order-info">
            <span>配送地址</span>
            <div class="ads-info">
              <span>{{orderData.area}}{{orderData.house}}</span>
            </div>
          </div>
          <div class="order-info">
            <span></span>
            <div class="ads-info">
              <span>{{orderData.settlername}}（{{orderData.settlerid}}）{{orderData.mobile}}</span>
            </div>
          </div>

          <p class="order-info">
            <span>期望送达</span>
            <span>{{moment(orderData.senddate,"YYYYMMDDHHmmss").format("YYYY-MM-DD")}} {{orderData.sendtime}}</span>
          </p>
          <p class="order-info">
            <span>订餐事由</span>
            <span class="reason-info">{{orderData.reason||'--'}}</span>
          </p>
        </section>
        <section class="order-box">
          <h1 class="order-title">订单信息</h1>
          <p class="order-info">
            <span>订餐人</span>
            <span>{{orderData.creatername}}（{{orderData.createrid}}）</span>
          </p>
          <p class="order-info">
            <span>下单时间</span>
            <span>{{ common.defaultTimeFormat(orderData.createtime) }}</span>
          </p>
          <p class="order-info" v-show="orderData.orderstatus=='3'">
            <span>签收时间</span>
            <span>{{ common.defaultTimeFormat(orderData.signtime)}}</span>
          </p>
          <p class="order-info" v-show="orderData.orderstatus=='3'">
            <span>签收人</span>
            <span>{{orderData.signername}}（{{orderData.signerid}}）</span>
          </p>
        </section>
        <van-button
          v-show="orderData.orderstatus=='1'"
          class="big-btn"
          type="info"
          @click="editOrder"
        >修改订单</van-button>
        <van-button
          v-show="orderData.orderstatus=='2'"
          class="big-btn"
          type="info"
          @click="confirmSend"
        >确认送达</van-button>
        <van-dialog
          class="mini-dialog"
          theme="round-button"
          v-model="showVisible"
          :showCancelButton="false"
          :showConfirmButton="false"
        >
          <slot name="title">
            <h1 class="dialog-title">确认送达</h1>
          </slot>
          <div class="bottom-btn">
            <van-button class="cancel-btn" plain round type="primary" @click="showVisible=false">取消</van-button>
            <van-button class="clear-btn" round type="info" @click="handleConfirm">确定</van-button>
          </div>
        </van-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderById, orderSign } from "@/api/client/order";
export default {
  props: {
    orderId: String
  },
  data() {
    return {
      foodList: [],
      orderData: {},
      loading: false,
      badgeNum: 0,
      showVisible: false
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
    jumperTab() {
      sessionStorage.setItem("recordTab", "group");
      this.$router.push("/record");
    },
    //跳转到详情页
    jumpDetail(meal) {
      this.$router.push(`/detail/${meal.id}`);
    },
    editOrder() {
      this.$router.push({
        path: `/editOrder/${this.orderData.shopid}`,
        query: {
          orderId: this.orderId,
          activeTab: this.orderData.ordertype
        }
      });
    },

    confirmSend() {
      let data = {
        id: this.orderId
      };
      getOrderById(data).then(res => {
        this.loading = false;
        if (res.success) {
          let orders = res.data || {};
          if (orders.orderstatus > 2) {
            let msg = null;
            switch (orders.orderstatus) {
              case "3":
                msg = "订单已取餐";
                break;
              case "4":
                msg = "订单已取消";
                break;
            }
            this.$toast.fail(`${msg}`);
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
            return false;
          } else {
            this.showVisible = true;
          }
        }
      });
    },
    handleConfirm() {
      let cartArr = this.orderData.items;
      let ids = cartArr.map(v => v.itemid);
      let data = {
        ids: JSON.stringify([this.orderId])
      };
      orderSign(data).then(res => {
        if (res.success) {
          // this.getDetail();
          this.$router.push(`/companySuccess/${this.orderId}`);
          this.showVisible = false;
        }
      });
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
.main-wapper {
  padding-top: 92px;
}
.success-box {
  background: #f6f6f6;
  text-align: center;
  min-height: 100%;
  .h1-title {
    font-size: 32px;
    font-weight: 600;
    color: #474d51;
    line-height: 38px;
    padding: 24px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .tag-orange {
      background: #fff5e6;
      border-radius: 6px;
      border-color: #ffc162;
      font-size: 24px;
      font-weight: 400;
      color: #ff9f0a;
      padding: 8px;
      height: 38px;
      margin-left: 12px;
    }
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
    .tag-gray {
      background: #fafafa;
      border-radius: 6px;
      border-color: #dbdbdb;
      font-size: 24px;
      font-weight: 400;
      color: #999999;
      padding: 8px;
      height: 38px;
      margin-left: 12px;
    }
  }
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
  margin-top: 20px;
  border-bottom: 1px solid #dbdbdb;
  .total-money {
    height: 36px;
    font-size: 24px;
    font-weight: 400;
    color: #474d51;
    line-height: 36px;
    .orange-money {
      font-size: 37px;
      font-weight: 600;
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
.order-div {
  padding: 0 24px;
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
  .order-ads {
    display: flex;
    flex-direction: column;
    justify-content: center;
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
  .ads-info {
    width: 520px;
    display: inline-block;
    text-align: right;
  }
}
.big-btn {
  width: 702px;
  height: 72px;
  font-size: 30px;
  background: #3a78fc;
  border-radius: 36px;
  border: none;
  margin-bottom: 24px;
}

//确认弹框
.mini-dialog {
  height: 261px;
  padding: 60px 48px;
  .dialog-title {
    width: 100%;
    text-align: center;
    height: 39px;
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
    margin-bottom: 30px;
  }
  .bottom-btn {
    display: flex;
  }
  .cancel-btn {
    width: 240px;
    height: 72px;
    background: #ffffff;
    border-radius: 36px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.65) !important;
    margin-right: 24px;
  }
  .clear-btn {
    width: 240px;
    height: 72px;
    background: #3a78fc;
    border-radius: 36px;
    border: none;
  }
}

.yellow-tips {
  width: 702px;
  height: 82px;
  line-height: 82px;
  background: #fffbe6;
  border-radius: 10px;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.65);
  border: 1px solid #ffe58f;
  display: flex;
  align-items: center;
  padding-left: 26px;
  margin-bottom: 24px;
  margin-left: 24px;
  .van-icon {
    margin-right: 26px;
  }
}
.reason-info {
  width: 70%;
  line-height: 36px;
  text-align: right;
}
</style>