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
        订单 #{{ orderData.id }}
        <van-tag
          plain
          type="primary"
          class="tag-orange"
          v-if="orderData.orderstatus == '1'"
          >待配餐</van-tag
        >
        <van-tag
          plain
          type="primary"
          class="tag-orange"
          v-if="orderData.orderstatus == '2'"
          >待取餐</van-tag
        >
        <van-tag
          plain
          type="primary"
          class="tag-blue"
          v-if="orderData.orderstatus == '3'"
          >已取餐</van-tag
        >
        <van-tag
          plain
          type="primary"
          class="tag-gray"
          v-if="orderData.orderstatus == '4'"
          >已取消</van-tag
        >
        <div v-if="orderData.orderstatus == '0'">
          <van-tag
            plain
            type="primary"
            :class="rocallTime == '00:00' ? 'tag-gray' : 'tag-orange'"
            >{{ rocallTime == "00:00" ? "已取消" : "等待支付" }}</van-tag
          >
          <span class="rocall-time" v-show="rocallTime != '00:00'"
            >剩余{{ rocallTime }}</span
          >
        </div>
      </h1>
      <div class="yellow-tips" v-if="orderData.orderstatus == '2'">
        <van-icon name="warning" color="#FAAD14" size="20" />
        <span v-if="shopDetail.orderway == 1">您的订单已经打包完成，请尽快取餐~</span>
        <span v-if="shopDetail.orderway == 2">{{str0}}取餐日期内{{common.pickupTimeText(shopDetail)}}</span>
        <span v-if="shopDetail.orderway == 3">{{str0}}取餐日期{{common.pickupTimeText(shopDetail)}}</span>
      </div>
      <!------------------------- 订单列表 ------------------------->
      <div class="order-div">
        <section class="order-box">
          <h1 class="order-subtitle">{{ orderData.shopname }}</h1>
          <template v-for="(res, index) in foodList">
            <div
              class="res-ordercard"
              :class="`animation-${index + 1}`"
              :key="'personal' + index"
              :body-style="{ padding: '0px' }"
            >
              <div class="img-box">
                <img
                  :src="common.viewIcon(res.photo)"
                  class="image"
                  v-if="res.photo && res.photo != '-1'"
                />
                <img src="@/assets/img/no-img.png" class="image" v-else />
              </div>
              <div class="right-box">
                <h1 class="ordername ellipsis">{{ res.itemname }}</h1>
                <p>
                  <span class="num">
                    <i class="min">x</i>
                    {{ res.itemnum }}
                  </span>
                </p>
              </div>
              <span class="black-money">
                <span>
                  <i class="black-tag">￥</i>
                  <span class="black-num">{{ res.totalPrice }}</span>
                </span>
                <span class="sales" v-show="res.promotionprice">
                  <i class="gray-tag">￥</i>
                  <span class="gray-num">{{ res.price }}</span>
                </span>
              </span>
            </div>
          </template>
          <div class="total-div">
            <span class="total-money">
              共{{ badgeNum }}份，合计：
              <span class="orange-money">
                <i class="orange-tag">￥</i>
                <span class="orange-num">{{ badgePrice }}</span>
              </span>
            </span>
          </div>
          <p class="order-info">
            <span>订餐类型</span>
            <span>个人订餐</span>
          </p>
        </section>
        <section class="order-box">
          <h1 class="order-title">取餐信息</h1>
          <p class="order-info">
            <span>联系手机</span>
            <span>{{ orderData.mobile }}</span>
          </p>
          <p class="order-info">
            <span>期望取餐</span>
            <!-- <span class="bold" >{{ moment(orderData.senddate, "YYYYMMDDHHmmss").format( "YYYY-MM-DD") }} {{ orderData.sendtime }}</span> -->
            <span :class="common.expectFetch(orderData) == '--' ? '' : 'bold'">{{common.expectFetch(orderData)}}</span>
          </p>
          <p class="order-info" v-show="orderData.flow">
            <span>取餐序号</span>
            <span class="bold">#{{ orderData.flow }}</span>
          </p>
        </section>
        <section class="order-box">
          <h1 class="order-title">订单信息</h1>
          <p class="order-info">
            <span>下单时间</span>
            <span>{{ common.defaultTimeFormat(orderData.createtime) }}</span>
          </p>
          <p class="order-info" v-show="orderData.orderstatus == '3'">
            <span>签收时间</span>
            <span>{{ common.defaultTimeFormat(orderData.signtime) }}</span>
          </p>
          <p class="order-info" v-show="orderData.orderstatus == '3'">
            <span>签收人</span>
            <span>{{ orderData.signername }}（{{ orderData.signerid }}）</span>
          </p>
        </section>
        <div
          class="tow-btn"
          v-show="orderData.orderstatus == '0' && rocallTime != '00:00'"
        >
          <van-button class="jumper-btn" type="default" @click="cancelBtn"
            >取消订单</van-button
          >
          <van-button class="jumper-btn2" type="default" @click="confirmPay"
            >确认支付</van-button
          >
        </div>
        <van-button
          v-show="orderData.orderstatus == '1'"
          class="big-btn"
          type="info"
          @click="cancelBtn"
          >取消订单</van-button
        >

        <van-button
          v-show="orderData.orderstatus == '2'"
          class="big-btn"
          type="info"
          :loading="sendLoading"
          @click="confirmSend"
          >确认取餐</van-button
        >
        <van-dialog
          class="mini-dialog"
          theme="round-button"
          v-model="showVisible"
          :showCancelButton="false"
          :showConfirmButton="false"
        >
          <slot name="title">
            <h1 class="dialog-title">确认取餐</h1>
          </slot>
          <div class="bottom-btn">
            <van-button
              class="cancel-btn"
              plain
              round
              type="primary"
              @click="showVisible = false"
              >取消</van-button
            >
            <van-button
              class="clear-btn"
              round
              type="info"
              @click="handleConfirm"
              >确定</van-button
            >
          </div>
        </van-dialog>
        <van-dialog
          class="mini-dialog"
          theme="round-button"
          v-model="cancelVisible"
          :showCancelButton="false"
          :showConfirmButton="false"
        >
          <slot name="title">
            <h1 class="dialog-title">取消订单提示</h1>
            <p class="dialog-p">确认取消这个订单吗？</p>
          </slot>
          <div class="bottom-btn">
            <van-button
              class="cancel-btn"
              plain
              round
              type="primary"
              @click="cancelVisible = false"
              >我再想想</van-button
            >
            <van-button
              class="clear-btn"
              round
              type="info"
              @click="handleCancel"
              >确定取消</van-button
            >
          </div>
        </van-dialog>
        <!---------------------------- 支付订单 -------------------------->
        <van-popup
          v-model="showPay"
          round
          position="bottom"
          :close-on-click-overlay="false"
        >
          <div class="payinfo">
            <van-icon
              class="del-btn"
              name="cross"
              color="#8E8E8E"
              size="20"
              @click="showPay = false"
            />
            <h1>支付订单</h1>
            <p class="mg-bt50">
              <label>支付方式</label>
              <span>校园一卡通（6666）</span>
            </p>
            <p class="mg-bt40">
              <label>订单金额</label>
              <span>
                <i class="black-tag">￥</i>
                <span>{{ badgePrice }}</span>
              </span>
            </p>
            <div class="hr"></div>
            <div class="money-box">
              <label>需付款</label>
              <span class="orange-money">
                <i class="orange-tag">￥</i>
                <span class="orange-num">{{ badgePrice }}</span>
              </span>
            </div>
            <div class="tips">
              校园卡支付有默认额度限制，教职工和研究生单笔200，当天400；本科生单笔30，当天200；超当天限额需先在校园卡-个人中心-消费设置中修改，或去充值机修改。
            </div>

            <van-button
              round
              class="paybtn"
              :loading="payLoading"
              type="info"
              @click="handlePay"
              >确认支付</van-button
            >
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOrderById,
  orderSign,
  payOrder,
  cancelOrder,
} from "@/api/client/order";
import { fetchOneCafeConfig } from '@/api/client/cafe'
export default {
  props: {
    orderId: String,
  },
  data() {
    return {
      shopDetail: {},
      str0: '您的订单已接收，',
      foodList: [],
      orderData: {},
      sendLoading: false,
      payLoading: false,
      badgeNum: 0,
      cancelVisible: false,
      showVisible: false,
      rocallTime: "00:00",
      showPay: false, //显示支付弹框
    };
  },
  computed: {
    Tid() {
      let len = this.orderData.id.toString().length;
      let tid = "T" + Array(9 - len).join("0") + this.orderData.id;
      return tid;
    },
    // 总费用
    badgePrice() {
      let priceList = this.foodList.map((i) => i.totalPrice);
      return priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
  },

  components: {},
  mounted() {
    this.getDetail();
  },
  methods: {
    jumperTab() {
      sessionStorage.setItem("recordTab", "self");
      this.$router.push("/record");
    },
    //支付倒计时  计算下单时间距离现在的时间差
    computetTime(data) {
      let orderTime = this.moment(data.createtime, "YYYYMMDD HH:mm:ss");
      // let now = this.moment("2021-09-27 14:31:40", "YYYYMMDD HH:mm:ss");
      let now = this.moment();
      let diff = now.diff(orderTime, "seconds", true); //minutes
      let cm = 15 * 60 * 1000 - diff * 1000;
      this.runBack(cm);
      // console.log("diff", diff, cm);
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
        setTimeout(function () {
          cm -= 1000;
          _msThis.runBack(cm);
        }, 1000);
      } else {
        this.rocallTime = "00:00";
      }
    },

    handleConfirm() {
      let cartArr = this.orderData.items;
      let ids = cartArr.map((v) => v.itemid);
      let data = {
        ids: JSON.stringify([this.orderId]),
      };
      orderSign(data).then((res) => {
        if (res.success) {
          this.$router.push(`/selfSuccess/${this.orderId}`);
          this.showVisible = false;
        }
      });
    },

    //跳转到详情页
    jumpDetail(meal) {
      this.$router.push(`/detail/${meal.id}`);
    },
    //修改订单
    cancelBtn() {
      this.cancelVisible = true;
    },
    //确认支付
    confirmPay() {
      this.showPay = true;
    },
    //支付
    handlePay() {
      let orderId = this.orderId;
      let params = { orderid: orderId, paypwd: null };
      this.payLoading = true;
      payOrder(params).then((res) => {
        this.showPay = false;
        this.payLoading = false;
        if (res.success) {
          this.$router.push(`/orderSelfSuccess/${orderId}`);
        } else {
          let msg = res.data.message || "";
          if (msg == "需要密码认证") {
            this.$router.push(`/orderQuota/${orderId}`);
          } else {
            this.$router.push({
              path: `/orderFail/${orderId}`,
              query: {
                msg: encodeURIComponent(msg),
              },
            });
          }
        }
      });
    },
    //确认送达
    confirmSend() {
      let data = {
        id: this.orderId,
      };
      this.sendLoading = true;
      getOrderById(data).then((res) => {
        this.sendLoading = false;
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
            cartArr.forEach((item) => {
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
    //确认取消订单
    handleCancel() {
      let data = {
        ids: JSON.stringify([this.orderId]),
      };
      cancelOrder(data).then((res) => {
        let result = res.data[0].returncode == "SUCCESS" ? true : false;
        if (result) {
          this.$router.push({
            path: `/cancelOrder/${this.orderId}`,
            query: {
              orderStatus: this.orderData.orderstatus,
            },
          });

          this.cancelVisible = false;
        } else {
          let msg = res.data[0].returnmsg;
          this.$toast.fail(`${msg}`);
        }
      });
    },

    // 获取详情
    getDetail() {
      let data = {
        id: this.orderId,
      };
      getOrderById(data)
        .then((res) => {
          if (res.success) {
            let data = res.data || {};
            data.shopid && fetchOneCafeConfig({shopid: data.shopid}).then(r => {
              if (r.success && r.data) {
                this.shopDetail = r.data
            // this.shopDetail.orderway = 3
            // this.shopDetail.pickuptime =  "$$，每天$$可取|2022.06.22 ~ 2022.6.30|01:00 ~ 00:40，04:20 ~ 10:20"
              }
            })
            let len = data.id.toString().length;
            data.id = "T" + Array(9 - len).join("0") + data.id;
            this.orderData = data || {};
            this.computetTime(data);
            let cartArr = res.data.items;
            cartArr.forEach((item) => {
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
        .catch((err) => {});
    },
  },
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
  .yellow-tips {
    width: 702px;
    min-height: 82px;
    line-height: 41px;
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
    span {
      width: 90%;
      text-align: left;
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
  .tow-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .jumper-btn,
  .jumper-btn2 {
    width: 339px;
    height: 72px;
    font-size: 30px;
    background: #ffffff;
    border-radius: 36px;
    border: 1px solid rgba(0, 0, 0, 0.15);
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
  .bold {
    font-weight: bold;
    color: #fd7d18;
  }
}
.big-btn {
  width: 702px;
  height: 72px;
  background: #3a78fc;
  border-radius: 36px;
  border: none;
  margin-bottom: 24px;
}

//确认弹框
.mini-dialog {
  min-height: 261px;
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
  .dialog-p {
    color: #474d51;
    height: 34px;
    line-height: 34px;
    font-size: 24px;
    margin-top: 24px;
    margin-bottom: 64px;
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
.rocall-time {
  color: #999999;
  font-size: 24px;
  margin-left: 10px;
}
</style>