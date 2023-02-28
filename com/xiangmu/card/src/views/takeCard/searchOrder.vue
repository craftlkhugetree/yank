<template>
  <div class="order">
    <!----------------------------- 加载中。。。 ----------------------------->
    <searching v-if="loading" :text="loadingText"></searching>
    <!----------------------------- 有订单 ----------------------------->
    <div v-if="!loading && tableData.length > 0 && !cardError">
      <el-table
        :data="tableData"
        style="width: 100%;"
        header-row-class-name="table-header"
        height="360"
        v-if="step == 1"
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <input
              class="radio"
              type="radio"
              v-model="orderid"
              name="order"
              :value="scope.row.id"
              @change="changeRadio"
            />
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="billNo" label="提货单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsName" label="物料名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="quantity" label="应装量" width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.quantity ? scope.row.quantity + "KG" : "--"}}</template>
        </el-table-column>
        <el-table-column prop="consignee" label="客户名称" show-overflow-tooltip></el-table-column>
      </el-table>

      <!----------------------------- 补充身份信息 ----------------------------->
      <div class="scan" v-if="step == 2">
        <img class="bg" src="@/assets/img/scan.png" alt />
        <p>提货单 {{curOrder.billNo}} 需要 {{curOrder.drivers.length}} 名司机，请补充司机身份证号</p>
        <div v-for="(item, index) in idCards" :key="index">
          <span class="text">身份证号：{{item.idcard}}</span>
          <span class="text-success" v-if="item.idcard && item.flag">
            <i class="el-icon-success">身份正确</i>
          </span>
          <span class="text-error" v-if="item.idcard && !item.flag">
            <i class="el-icon-error">身份错误</i>
          </span>
        </div>
      </div>

      <!----------------------------- 按钮 ----------------------------->
      <div class="btns" v-show="showBtns">
        <img
          class="btn"
          src="@/assets/img/back-btn-white.png"
          alt
          @click="$router.push('/takecard')"
        />
        <img class="btn" src="@/assets/img/take-btn.png" alt @click="takeCard" />
      </div>
    </div>
    <!----------------------------- 无订单 / 无卡片 ----------------------------->
    <div v-if="!loading && (tableData.length=='0' || cardError)">
      <searching :text="errorText"></searching>
      <img class="btn" src="@/assets/img/back-btn.png" alt @click="$router.push('/takecard')" />
    </div>

    <!----------------------------- 卡片 ----------------------------->
    <object
      classid="clsid:0be4f795-6a71-4192-8900-0932acd6100a"
      id="SmartCard"
      width="0"
      height="0"
    ></object>
  </div>
</template>

<script>
import Searching from '@/components/Searching'
import { readIdCard, searchOrderByID, saveCard } from '@/api/card'
export default {
  components: {
    Searching
  },
  data() {
    return {
      loading: false,
      loadingText: '正在查询订单信息，请稍后…',
      errorText: '没有查到订单信息，请联系管理员',
      idcard: sessionStorage.getItem('idcard'),
      step: 1, // 1-订单表格，2-补充身份证
      tableData: [],
      /**tableData: [{
          id: 7,
          billNo: 'B2000002',
          consignee: '测试公司',
          goodsId: '0101',
          goodsName: '甲苯',
          shipname: '苏A0003',
          drivers: [{ id: null, billId: null, name: '王歌尧', idcard: '320304199503230818' },{ id: null, billId: null, name: '徐明华', idcard: '320924198910286513' }]
        },
        {
          id: 8,
          billNo: 'B2000002',
          consignee: '测试公司',
          goodsId: '0101',
          goodsName: '甲苯',
          shipname: '苏A0003',
          drivers: [{ id: null, billId: null, name: '', idcard: '' }]
        }],**/
      
      showBtns: false,
      orderid: null,
      curOrder: {},
      sjlist: [], // 司机列表
      idCards: [], // 读取的身份证号
      cardError: false, // 是否没有卡或者故障
      timer: null,
      SmartCard: null
    }
  },
  methods: {
    // 改变订单
    changeRadio() {
      this.curOrder = this.tableData.find(i => i.id == this.orderid)
      let drivers = this.curOrder.drivers || []
      this.sjlist = drivers.filter(i => i.idcard !== this.idcard)
      if (this.sjlist.length > 0) {
        this.step = 2
        this.idCards = this.sjlist.map(i => {
          return {
            idcard: null,
            flag: false
          }
        })
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.readIdCard()
        }, 1000)
      } else {
        this.showBtns = true
      }
    },
    // 查询订单
    getOrders() {
	  //this.changeRadio();
	  //return ;
      this.loading = true
      this.loadingText = '正在查询订单信息，请稍后…'
      searchOrderByID({
        idcard: this.idcard
      })
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.tableData = res.data || [];
			if(res.data){
				this.changeRadio();
			}
          } else {
            this.tableData = []
          }
        })
        .catch(err => {
          this.loading = false
          this.tableData = []
        })
    },

    // 读取身份证
    readIdCard() {
      readIdCard().then(res => {
		 // console.log(res);
        //if (res.success) {
          let data = res.certNumber || ''
          if (data) {
            let index = this.idCards.findIndex(i => i.idcard == data)
            let sjIndex = this.sjlist.findIndex(i => i.idcard == data)
            // 如果存在为空 或者错误 的数据
            let item = this.idCards.find(i => !i.idcard) || this.idCards.find(i => !i.flag) || null
            if (item) {
              item.idcard = data
              item.flag = sjIndex > -1 && index == -1
            } else {
              this.showBtns = true
            }
          }
        //}
      })
    },
    // 立即取卡
    takeCard() {
      clearInterval(this.timer)
      let data = ''
      try {
        console.log("SmartCard",this.SmartCard)
        data = this.SmartCard.getCradIDOnly() // 16进制
        console.log("16进制卡号",data)
      } catch (e) {
        console.log('读取卡号失败：' + e)
        data = -1
      }
      // 发卡箱没有卡或故障
      if (data == -1) {
        this.cardError = true
        this.errorText = '此终端卡片已发完或发生故障，请联系管理员'
      } else {
        let cardNumber = parseInt(data, 16) // 10进制
        console.log("10进制卡号",cardNumber)
        this.saveCard(cardNumber)
      }
    },
    // 保存数据
    saveCard(cardNumber) {
      this.loading = true
      this.loadingText = '正在发卡，请稍后。。。'
      let param = { ...this.curOrder, cardNo: cardNumber, openCardType: '1' }
      console.log("保存数据参数",param)
      saveCard(param)
        .then(res => {
          this.loading = false
          console.log("保存数据结果",res)
          // 发卡
          if (res.code == '000000') {
            try {
              this.SmartCard.getCard()
              this.$router.push('/takecard/success')
            } catch (e) {
              console.log('发卡失败：' + e)
            }
          } else {
            this.resetCard()
          }
        })
        .catch(err => {
          console.log("保存数据错误",res)
          this.loading = false
          this.resetCard()
        })
    },
    // 取卡机复位
    resetCard() {
      this.cardError = true
      this.errorText = '发卡失败，系统故障，请联系管理员'
      this.SmartCard.resetCard()
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
       this.getOrders()
  },
  mounted() {
      this.SmartCard = document.getElementById('SmartCard')
  }
}
</script>

<style lang="scss" scoped>
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
</style>