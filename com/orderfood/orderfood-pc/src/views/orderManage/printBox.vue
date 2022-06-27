<template>
  <div class="printDisplay">
    <div
      v-for="(order,index) in orderList"
      :key="order.id"
      :ref="'printDiv'+index"
      style="width: 340px;padding: 20px;"
    >
      <div
        style="width:100%;font-size: 18px;text-align:center;line-height:20px;margin-bottom:10px;"
      >后勤保障部</div>
      <div
        style="width:100%;font-size: 18px;font-weight: 600;color: #000000;line-height: 20px;padding-bottom: 10px;position: relative;border-bottom: 1px dashed #000000;"
      >
        *******************************
        <span
          style="position: absolute;top: 0;left: 50%;transform: translateX(-50%);background: #ffffff;padding: 0 10px;display: inline-block;max-width: 100%;white-space: nowrap;"
        >#{{order.flow}} {{order.ordertype == "group" ? "单位订餐" : "个人订餐"}}</span>
      </div>
      <div
        style="padding:0;border-bottom: 1px dashed #000000;font-size: 14px;line-height: 14px;"
      >
        <p style="margin:10px 0;" v-if="order.ordertype == 'group'">【配送时间】{{order.time}}</p>
        <p style="margin:10px 0;" v-if="order.ordertype == 'self'">【期望取餐】{{order.time}}</p>
        <p style="margin:10px 0;">【下单时间】{{common.defaultTimeFormat(order.createtime)}}</p>
      </div>
      <div style="padding: 10px 0;border-bottom: 1px dashed #000000;">
        <div
          style="font-size: 16px;font-weight: 400;color: #000000;line-height: 20px;"
          v-for="item in order.items"
          :key="item.id"
        >
          <span>{{item.itemname}}</span>
          <div style="float: right;width: 110px;text-align: right;">
            <span style="display: inline-block;text-align:left;width:30%;">x{{item.itemnum}}</span>
            <span style="display: inline-block;width:70%;">{{item.totalPrice}}</span>
          </div>
        </div>
      </div>
      <div
        style="padding: 10px 0;font-size: 18px;font-weight: 600;color: #000000;line-height: 18px;"
      >
        <span>总计：</span>
        <span style="float:right;">¥{{order.totalfee}}</span>
      </div>
      <div style="font-size: 18px;font-weight: 600;color: #000000;line-height: 20px;">
        <p style="margin: 10px 0;" v-if="order.ordertype == 'group'">{{order.address}}</p>
        <p style="margin: 10px 0;">{{order.creatername}}（{{order.createrid}}）</p>
        <p style="margin: 10px 0;">{{order.mobile}}</p>
      </div>
      <div v-if="order.reason" style="font-size:16px; border-top: 1px dashed #000000;">
        <p style="margin: 10px 0;">订餐事由：{{order.reason || "无"}}</p>
      </div>
      <div
        style="padding: 0 0 10px 60px;border-top: 1px dashed #000000;"
        v-if="order.ordertype == 'group'"
      >
        <p style="font-size: 14px;margin: 10px 0;">请扫描下方二维码签收</p>
        <div :id="'qrcode'+index"></div>
      </div>
      <div>
        <p style="font-size: 14px;margin: 10px 0;" v-if="order.ordertype == 'group'">请及时确认送达，当日结束系统自动确认送达</p>
        <p style="font-size: 14px;margin: 10px 0;" v-if="order.ordertype == 'self'">请及时确认取餐，当日结束系统自动确认取餐</p>
      </div>
      <div
        style="width:100%;font-size: 18px;font-weight: 400;color: #000000;line-height: 20px;position: relative;margin:10px 0 0;"
      >
        *******************************
        <span
          style="position: absolute;top: 0;left: 50%;transform: translateX(-50%);background: #ffffff;padding: 0 10px;display: inline-block;max-width: 100%;white-space: nowrap;"
        >#{{order.flow}} 完</span>
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
        width: 160,
        height: 160,
        text: url, // 二维码内容
        colorDark: "#000",
        colorLight: "#fff"
      });
    },

    //  lodop 打印
    print() {
      let agent = navigator.userAgent.toLowerCase();
      this.orderList.forEach((order, index) => {
        if (order.ordertype == "group") {
          this.createCode(order, index);
        }
        this.$nextTick(() => {
          setTimeout(() => {
            let dom = this.$refs["printDiv" + index][0];
            // 判断是否Windows系统
            if (agent.indexOf("windows") >= 0) {
              let h = dom.offsetHeight - 30 + "px";
              let LODOP = getLodop();
              LODOP.PRINT_INIT("");
              // LODOP.SET_PRINT_PAGESIZE(3, "80mm", 0, "");
              LODOP.SET_PRINT_PAGESIZE(1, "80mm", h);
              LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Auto-Width"); //宽度缩放
              LODOP.ADD_PRINT_HTM(10, 10, "100%", "100%", dom.innerHTML);
              // 不预览直接打印
              if (window.g.isPrintDirect) {
                LODOP.PRINT(); // 不预览直接打印
              } else {
                LODOP.PREVIEW(); // 预览打印
              }
            } else {
              this.$print(dom); // printjs预览打印
            }
          }, 100);
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
// .printDisplay {
//   display: none;
// }
// @media print {
//   .printDisplay {
//     display: block !important;
//   }
// }
</style>