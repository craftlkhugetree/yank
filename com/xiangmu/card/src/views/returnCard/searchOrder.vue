<template>
  <div class="order">
    <!----------------------------- 加载中。。。 ----------------------------->
    <searching v-if="loading" :text="loadingText"></searching>
    <!----------------------------- 打印中。。。 ----------------------------->
    <searching
      v-if="printing && !signing"
      :src="require('@/assets/img/print.png')"
      :text="printingText"
    ></searching>
    <!----------------------------签字版------------------------------->
    <div v-show="signing" class="signinput noPrint">
      <object
        id="HWPenSign"
        name="HWPenSign"
        classid="clsid:E8F5278C-0C72-4561-8F7E-CCBC3E48C2E3"
        width="800"
        height="300"
      ></object>
      <h3>请在签字版签字</h3>
    </div>
    <!----------------------------- 有订单 ----------------------------->
    <div class="table-box noPrint" v-if="!loading && !printing && order.id && !signing">
      <table border="1" width="100%">
        <tr>
          <td>提货单号</td>
          <td>{{ order.billNo }}</td>
        </tr>
        <tr>
          <td>物料名称</td>
          <td>{{ order.goodsName }}</td>
        </tr>
        <tr>
          <td>实装量</td>
          <td>{{ order.factqty ? order.factqty + 'KG' : '--' }}</td>
        </tr>
        <tr>
          <td>客户名称</td>
          <td>{{ order.consignee }}</td>
        </tr>
        <tr>
          <td>车牌号</td>
          <td>{{ order.shipname }}</td>
        </tr>
        <tr>
          <td>司机</td>
          <td>
            {{
              order.drivers[0].name + (order.drivers.length > 1 ? '，' + order.drivers[1].name : '')
            }}
          </td>
        </tr>
      </table>
      <!----------------------------- 按钮 ----------------------------->
      <div class="btns">
        <img
          class="btn"
          src="@/assets/img/back-btn-white.png"
          alt
          @click="$router.push('/returncard')"
        />
        <img class="btn" src="@/assets/img/print-btn.png" alt @click="sign" />
      </div>
    </div>
    <!----------------------------- 无订单 ----------------------------->
    <img
      class="btn"
      v-if="(showBtns && !printing) || signing"
      src="@/assets/img/back-btn.png"
      alt
      @click="$router.push('/returncard')"
    />
    <!----------------------------- 打印 ----------------------------->
    <print-box ref="PrintBox1" :order="order" style="margin-top: 10px"></print-box>
    <!----------------------------- 卡片 ----------------------------->
    <object
      classid="clsid:0be4f795-6a71-4192-8900-0932acd6100a"
      id="SmartCard1"
      width="0"
      height="0"
    ></object>
    <object
      id="WebBrowser"
      width="0"
      height="0"
      classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"
    ></object>
  </div>
</template>

<script>
import Searching from '@/components/Searching';
import { searchOrderByCard, backCard } from '@/api/card';
import PrintBox from './printBox.vue';
export default {
  components: {
    Searching,
    PrintBox,
  },
  data() {
    return {
      loading: false,
      loadingText: '正在查询订单信息，请稍后…',
      printing: false,
      signing: false,
      printingText: '正在打印中，请稍后…',
      cardNumber: sessionStorage.getItem('cardNumber'),
      showBtns: false,
      SmartCard: null,
      HWPenSign: null,
      signStream: '',
      WebBrowser: null,
      order: { signStream: '' },
    };
  },
  methods: {
    // 查询订单
    getOrders() {
      /**测试用数据开始**/
      this.order = {
        id: 7,
        billNo: 'B2000002',
        consignee: '测试公司',
        goodsId: '0101',
        goodsName: '甲苯',
        shipname: '苏A0003',
        drivers: [
          { id: null, billId: null, name: '徐宇鹏', idcard: '320924198910286513' },
          { id: null, billId: null, name: '徐明华', idcard: '320924198910286513' },
        ]
      };
      return true;

      /**测试用数据结束**/
      this.loading = true;
      this.loadingText = '正在查询订单信息，请稍后…';
      searchOrderByCard({
        cardNo: this.cardNumber,
      })
        .then(res => {
          if (res.code == '000000' && res.data && res.data.id && res.data.status == '5') {
            this.loading = false;
            this.showBtns = false;
            this.order = res.data || {};
          } else {
            this.SmartCard.returnCard();
            this.loadingText = '没有查到订单信息';
            this.order = {};
            this.showBtns = true;
          }
        })
        .catch(err => {
          this.loadingText = '没有查到订单信息';
          this.order = {};
          this.showBtns = true;
        });
    },
    //汉王签字板初始化
    initHwang() {
      if (this.HWPenSign) this.HWPenSign.HWFinalize();
      this.HWPenSign = document.getElementById('HWPenSign');
      this.HWPenSign.HWSetBkColor(0xe0f8e0);
      this.HWPenSign.HWSetCtlFrame(2, 0x000000);
      window.signComplete = () => {
        this.signComplete();
      };
      window.signRestart = () => {
        this.signRestart();
      };
    },
    //签字
    sign() {
      this.signing = true;
      this.signComplete();
      /** this.initHwang();
		setTimeout(() => {
		  this.HWPenSign.HWInitialize();
		},1500) **/
    },
    // 打印订单
    printOrder() {
      this.printing = true;
      try {
        this.printView();
        setTimeout(() => {
          this.printing = false;
          this.backCard();
        }, 10000);
      } catch (e) {
        this.printing = false;
        this.showBtns = true;
        this.SmartCard.returnCard();
        //console.log(e)
      }
    },
    // 还卡
    backCard() {
      this.loading = true;
      this.loadingText = '正在归还卡片，请稍后…';
      backCard(this.order.id)
        .then(res => {
          if (res.code == '000000') {
            this.loading = false;
            this.SmartCard.reciveCard();
            this.$router.push('/returncard/success');
          } else {
            this.SmartCard.returnCard();
            this.loadingText = '还卡失败，系统故障，请联系管理员';
            this.showBtns = true;
          }
        })
        .catch(err => {
          this.SmartCard.returnCard();
          this.loadingText = '还卡失败，系统故障，请联系管理员';
          this.showBtns = true;
        });
    },
    signComplete() {
      let signStream =
        'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABCpJREFUaAXNWk1sG0UUnjfeOLtJlBzCqQEk4pAAIq6bEAKRQFFV9YDEgSNCFDggJE7kQgCJC5dWgBS1ByROiB6qVr1wy4kekpujyImjlJY4QdCqqoSIUIW9trOex5tVB42d+Gd/jGcv8//N983Mvjc7s8C0pzyVnqrVcJkhzAHiC8gY14ojR4FBDRnuMoBsIoEX7V93DqKCggIopk5/RKRXqANH5XUzJDFFAPaxs5+/GqUfX0AplVlgWFuPe8TbEQOAIwtgPlnYzrWr26zckgXIxPcU+MuFFAnk7EcmeJaDqDVrGCZfIFjAcIHavkODRROOfR5j31H61TB4sg3g5OwTJa/6pwKgUfl0YD//jUp3Iyympr+iUftSYssBc4ZgGPL5Ypi+eIVVM3pDwL4berobcQv4f33IZeuWEumw/fBaLTGkN7aTiVAjoWO0iwsL6vrg3Bts16ZZeaxmslknjfn0LlT1PBTWkZ4OEu+JgMG7uQf0rt2SROkduGOP8I0gpPW6PREgCTgzU+ctzl90nh49A5ubJZ1UkLhvRoM0iKsu3LwpTfQuK0RD7NkMNNLGxUULx2dHGvPbpY0QIH2Re+/wN5dVD30f0Y61Vm6EgLLnvUle+Ul/K0MOrjQxfUnj2DJqhADWz2/Rxq6imKJgy52KMEKA80vudyLyVhgRRgiQI2/v76yGEWGMgLAijBIQRoRxAoKKMFJAEBHGCuhUROS9ED738qh7VF6hL6xJ2WncjyDvhoD/EG6/wpZ+ojieFoMH+S8iCyDyn5EXfVeBdyUkEccf/LySSl+LvIRoP//3cfDu5/iHD8grkWfAhrFvXXb/CBG6soTkUBDZs3Re9UzdsAAs2ftbe5EFQGFV7mG+rgOPMeGm0hdoiX6gQ9Kh2Cd0cnJF5kVeQjpw3PHH5H/wd6mPwX3yB/nLqi9jBXRCXoowUkCn5I0UEIS8cQKCkjdKQBjyxggoTaRfIVPZ0tpIsic9ZrzEdCPUylSeRFzlGSHAAX6djhp/pm/ie5zDhwOanVdEm4WRPXEz4CD5UMjJ+4lzQdqoukbMgCITJuyZADpKtN3J9GthjhN1oT0RQBYH3D/+WhMerrlQ3cGJ+WGdVJB4TwS4U5lTZHXmJFFE9lRZuH48CHFVtycCIMHrjAdwqEsrcp2EnDPxSK9YxnLo6dRxWsV5xavrQzBex6FV28Yybg9g3SUz3Qy/11gp7jTdbLyvMOXvB84I31bpoCF9rTFWSk1v0Fp8STUmh/ITOZYNFChvUWJ7CNMS8qIb2RsKlASsk+N6XaWDhr6A6rOZjCdElqxDX1CAKPXlaXQCrJn+Qu52WBz/JU7ubW3RpzMdjcD/ecJwSN9Tb0chL0X7M6DUlyZPj7EaLtEUzyGw58nGJVRZLCGAR/9K0GjzrGMnV2B342FU3H8BaHmeSwR5BWsAAAAASUVORK5CYII=';
      //this.$set(this.order,'signStream',this.HWPenSign.HWGetBase64Stream(2));
      //this.order.signStream = this.HWPenSign.HWGetBase64Stream(2);
      alert(signStream);
      console.log(this.$refs.PrintBox1);
      this.$refs.PrintBox1.setSignImage(signStream);
      //this.HWPenSign.HWFinalize();
      this.showBtns = false;
      this.signing = false;
      this.printOrder();
    },
    signRestart() {
      //alert(1);
      this.HWPenSign.HWClearPenSign();
    },
    pageSetup() {
      let hkey_root, hkey_path, hkey_key;
      hkey_root = 'HKEY_CURRENT_USER';
      hkey_path = '\\Software\\Microsoft\\Internet Explorer\\PageSetup\\';
      try {
        let RegWsh = new ActiveXObject('WScript.Shell');
        hkey_key = 'header'; //页眉
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '');
        hkey_key = 'footer'; //页脚
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '');
        hkey_key = 'margin_left'; //左边距
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '0');
        hkey_key = 'margin_bottom'; //下边距
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '0');
        hkey_key = 'margin_top'; //上边距
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '0');
        hkey_key = 'margin_right'; //右边距
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '0');
      } catch (e) {}
    },
    // 打印预览
    printView() {
      this.WebBrowser.ExecWB(7, 1);
    },
    //打印需要选择打印机
    print() {
      this.WebBrowser.ExecWB(6, 6);
    },
    //直接打印不需要选择打印机
    printD() {
      this.WebBrowser.ExecWB(6, 2);
    },
  },
  created() {
    this.getOrders();
  },
  mounted() {
    this.SmartCard = document.getElementById('SmartCard1');
    this.WebBrowser = document.getElementById('WebBrowser');
    this.pageSetup();
  },
};
</script>
>
<style lang="scss" scoped>
@media screen {
  .noVisable {
    display: none;
  }
}
@media print {
  .noPrint {
    display: none;
  }
}
.signinput {
  margin: 50px 50px 10px 50px;
  h3 {
    font-size: 24px;
    text-align: center;
    margin-top: 20px;
  }
}
.scan {
  height: 390px;
  overflow: auto;
  img {
    margin-top: 30px;
  }
  p {
    margin-bottom: 20px;
  }
  .text {
    display: inline-block;
    margin-bottom: 20px;
  }
  i {
    font-size: 28px;
    margin: 0 18px;
  }
  span {
    font-size: 24px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 60px;
  }
  .text-success {
    color: #52c41a;
  }
  .text-error {
    color: #ff4d4f;
  }
}
.table-box {
  padding: 30px;
}
table {
  white-space: normal;
  margin-bottom: 30px;
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  td {
    font-size: 20px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    background: #ffffff;
    line-height: 28px;
    padding: 13px 0 19px 30px;
    border: none;
    word-break: break-all;
    &:nth-of-type(odd) {
      width: 200px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      background: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>
