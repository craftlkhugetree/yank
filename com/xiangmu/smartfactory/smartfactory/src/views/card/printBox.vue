<template>
  <div>
    <div id="print" class="noVisable">
      <p>三江化工发货单</p>
      <table border="1">
        <tr>
          <td class="title">单号</td>
          <td class="pvalue">{{order.billNo}}</td>
          <td class="title">客户</td>
          <td class="pvalue">{{order.consignee}}</td>
        </tr>
        <tr>
          <td class="title">应发量</td>
          <td class="pvalue">{{order.quantity ? order.quantity + "KG" : "--"}}</td>
          <td class="title">实发量</td>
          <td class="pvalue">{{order.actQty ? order.actQty + "KG" : "--"}}</td>
        </tr>
		
        <tr>
		  <td class="title">品名</td>
		  <td class="pvalue">{{order.goodsName}}</td>
          <td class="title">车牌号</td>
          <td class="pvalue">{{order.shipname}}</td>
        </tr>
		
		<tr>
			<td class="title">取货日期</td>
			<td class="pvalue">{{order.loadTime}}</td>
			<td class="title">司机</td>
			<td class="pvalue">{{getName(0) + (order.drivers && order.drivers.length && order.drivers.length > 1 ? '，' + getName(1) : '')}}</td>
		</tr>
      </table>
    </div>
    <object
      id="WebBrowser"
      width="0"
      height="0"
      classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"
    ></object>
  </div>
</template>

<script>
export default {
  props: {
    order: Object
  },
  data() {
    return {
      WebBrowser: null
    }
  },
  computed: {
    getName() {
      return function(num) {
        this.order && this.order.drivers && this.order.drivers[num] && this.order.drivers[num].name || ''
      }
    }
  },
  methods: {
    pageSetup() {
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
		this.WebBrowser=this.WebBrowser?this.WebBrowser:document.getElementById("WebBrowser");
		this.WebBrowser.ExecWB(7,1);
	},
	//打印需要选择打印机
	print(){
		this.WebBrowser=this.WebBrowser?this.WebBrowser:document.getElementById("WebBrowser");
		this.WebBrowser.ExecWB(6,6);
	},
	//直接打印不需要选择打印机
	printD(){
		this.WebBrowser=this.WebBrowser?this.WebBrowser:document.getElementById("WebBrowser");
		this.WebBrowser.ExecWB(6,2);
	}
  },
  mounted() {
      this.pageSetup();
	  this.WebBrowser = document.getElementById("WebBrowser");
  }
}
</script >

<style lang="scss" scoped>
@media screen {
	.noVisable{display:none;}
}
.title {
  font-weight: bolder;
  width:150px;
  font-size:18px;
}
.pvalue{
  width:500px;
  font-size:18px;
}
table {
  margin:10px 20px;
  border: 0;
  border-collapse: collapse;
  width: 1100px;
}
td {
  padding: 15px;
  border: 1px solid #888;
}
p {
  margin: 10px 20px;
}
</style>