<template>
  <div>
    <div
      v-for="(order,index) in orderList"
      :key="order.id"
      :ref="'printDiv'+index"
      class="print-box"
    >
      <div class="title print-border">
        *******************************
        <span>#{{order.id}} {{order.ordertype == "group" ? "单位订餐" : "个人订餐"}}</span>
      </div>
      <div class="time-box print-border">
        <p v-if="order.ordertype == 'group'">【配送时间】{{order.time}}</p>
        <p>【下单时间】{{common.defaultTimeFormat(order.createtime)}}</p>
      </div>
      <div class="food-list print-border">
        <div class="list-box" v-for="item in order.items" :key="item.id">
          <span class="name">{{item.itemname}}</span>
          <div class="num">
            <span style="text-align:left;width:30%;">x{{item.itemnum}}</span>
            <span style="width:70%;">{{item.totalPrice}}</span>
          </div>
        </div>
      </div>
      <div class="total">
        <span>总计：</span>
        <span style="float:right;">¥{{order.totalfee}}</span>
      </div>
      <div class="address print-border">
        <p v-if="order.ordertype == 'group'">{{order.address}}</p>
        <p>{{order.creatername}}（{{order.createrid}}）</p>
        <p>{{order.mobile}}</p>
      </div>
      <div class="code">
        <p>请扫描下方二维码签收</p>
        <div :id="'qrcode'+index"></div>
      </div>
      <div class="title">
        *******************************
        <span>#{{order.id}} 完</span>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { getLodop } from "@/assets/js/lodop";
export default {
  data() {
    return {
      orderList: []
    };
  },
  methods: {
    // 生成二维码
    createCode(order, index) {
      let code = document.getElementById("qrcode" + index);
      let img = code.getElementsByTagName("img")[0];
      if (img) {
        code.removeChild(img);
      }
      let url =
        order.ordertype == "group"
          ? `${window.g.codeUrl}companyOrder/${order.id}`
          : `${window.g.codeUrl}personalOrder/${order.id}`;
      let drawerCode = new QRCode("qrcode" + index, {
        width: 340,
        height: 340,
        text: url, // 二维码内容
        colorDark: "#000",
        colorLight: "#fff"
      });
    },

    // 打印
    print() {
      this.orderList.forEach((order, index) => {
        this.createCode(order, index);
        this.$nextTick(() => {
          setTimeout(() => {
            let dom = this.$refs["printDiv" + index][0];
            this.$print(dom);
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.print-box {
  width: 420px;
  padding: 20px;
  .title {
    font-size: 24px;
    font-weight: 400;
    color: #000000;
    line-height: 25px;
    padding-bottom: 20px;
    position: relative;
    span {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      background: #ffffff;
      padding: 0 10px;
      display: inline-block;
      max-width: 100%;
      white-space: nowrap;
    }
  }
  .time-box {
    padding: 20px 0 10px;
    p {
      font-size: 20px;
      font-weight: 400;
      color: #000000;
      line-height: 22px;
      margin-bottom: 10px;
    }
  }
  .food-list {
    padding: 20px 0 10px;
    .list-box {
      font-size: 22px;
      font-weight: 400;
      color: #000000;
      line-height: 24px;
      margin-bottom: 10px;
      .num {
        float: right;
        width: 110px;
        text-align: right;
        span {
          display: inline-block;
        }
      }
    }
  }
  .total {
    padding: 20px 0;
    font-size: 22px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
  }
  .address {
    p {
      font-size: 22px;
      font-weight: 400;
      color: #000000;
      line-height: 24px;
      margin-bottom: 10px;
    }
  }
  .code {
    text-align: center;
    padding: 20px;
    p {
      font-size: 18px;
      margin-bottom: 10px;
    }
  }
}
.print-border {
  border-bottom: 1px dashed #000000;
}
</style>