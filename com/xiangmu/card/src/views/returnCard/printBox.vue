<template>
  <div>
    <div id="print" class="noVisable">
      <p>三江化工发货单</p>
      <table border="1">
        <tr>
          <td class="title">单号</td>
          <td class="pvalue">{{ order.billNo }}</td>
          <td class="title">客户</td>
          <td class="pvalue">{{ order.consignee }}</td>
        </tr>
        <tr>
          <td class="title">应发量</td>
          <td class="pvalue">{{ order.quantity ? order.quantity + 'KG' : '--' }}</td>
          <td class="title">实发量</td>
          <td class="pvalue">{{ order.factqty ? order.factqty + 'KG' : '--' }}</td>
        </tr>

        <tr>
          <td class="title">品名</td>
          <td class="pvalue">{{ order.goodsName }}</td>
          <td class="title">车牌号</td>
          <td class="pvalue">{{ order.shipname }}</td>
        </tr>

        <tr>
          <td class="title">取货日期</td>
          <td class="pvalue">{{ order.loadTime }}</td>
          <td class="title">司机</td>
          <td class="pvalue">
            {{
              order.drivers[0].name + (order.drivers.length > 1 ? '，' + order.drivers[1].name : '')
            }}
          </td>
        </tr>
      </table>
      <label class="signlabel">
        签名：
        <img :src="'data:image/png;base64,' + signStream" />
      </label>
      <p>测试：{{ signStream }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: Object,
    //signStream:String
  },

  data() {
    return {
      signStream: '',
    };
  },
  methods: {
    /**
     * 签名更新
     */
    setSignImage(val) {
      this.signStream = val;
    },
    /* pageSetup() {
      let hkey_root, hkey_path, hkey_key
      hkey_root = 'HKEY_CURRENT_USER'
      hkey_path = '\\Software\\Microsoft\\Internet Explorer\\PageSetup\\'
      try {
        let RegWsh = new ActiveXObject('WScript.Shell')
        hkey_key = 'header' //页眉
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '')
        hkey_key = 'footer' //页脚
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '')
        hkey_key = 'margin_left' //左边距
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '0')
        hkey_key = 'margin_bottom' //下边距
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '0')
        hkey_key = 'margin_top' //上边距
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '0')
        hkey_key = 'margin_right' //右边距
        RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '0')
      } catch (e) {}
    },
  // 打印预览
	printView(){
		this.WebBrowser.ExecWB(7,1);
	},
	//打印需要选择打印机
	print(){
		this.WebBrowser.ExecWB(6,6);
	},
	//直接打印不需要选择打印机
	printD(){
		this.WebBrowser.ExecWB(6,2);
	} */
  },
  mounted() {
    /* this.WebBrowser = document.getElementById("WebBrowser")
      this.pageSetup() */
  },
};
</script>

<style lang="scss" scoped>
@media screen {
  .noVisable {
    display: none;
  }
}
.title {
  font-weight: bolder;
  width: 80px;
}
.pvalue {
  width: 298px;
}
table {
  margin: 10px 20px;
  border: 0;
  border-collapse: collapse;
  width: 756px;
}
td {
  padding: 10px;
  border: 1px solid #888;
}
p {
  margin: 20px 20px 10px 20px;
}
.signlabel {
  float: left;
  margin-left: 550px;
  line-height: 60px;
  align-items: center;
  img {
    width: 160px;
  }
}
</style>
