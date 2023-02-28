<template>
  <div class="base-search-table" v-loading="loading">
    <!------------------------------------- 人工开卡 ------------------------------------->
    <div class="search-box clearfix">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>卡片归还
    </div>
    <!---------------------------- 表单 ---------------------------->
    <div class="form-box noPrint">
      <el-form
        class="edit-form"
        :model="editForm"
        ref="editForm"
        label-position="left"
        label-width="100px"
        label-suffix="："
        size="small"
        @submit.native.prevent
      >
        <h3>绑定卡片</h3>
        <el-form-item
          label="卡号信息"
          prop="cardNo"
          :rules="[{required: true, trigger: 'change', message: '请读取卡号信息'}]"
        >
          <el-input
            v-model="editForm.cardNo"
            style="width:468px;margin-right:10px;"
            size="small"
            placeholder="正确插入卡片后自动读取卡号"
            @keyup.enter.native="searchOrder"
          ></el-input>
          <el-button size="small" :loading="readLoading" @click="readCard">读取卡号</el-button>
        </el-form-item>
        <h3 v-if="searched">订单信息</h3>
        <div class="nodata" v-if="searched && !order.id">
          <img src="@/assets/img/nodata.png" alt />
          <p>没有查到订单信息，请联系管理员</p>
        </div>
        <div class="order-table" v-if="searched && order.id">
          <table border="1" width="100%">
            <tr>
              <td>提货单号</td>
              <td>{{order.billNo}}</td>
            </tr>
            <tr>
              <td>物料名称</td>
              <td>{{order.goodsName}}</td>
            </tr>
            <tr>
              <td>实装量</td>
              <td>{{order.actQty ? order.actQty + "KG" : "--"}}
                <span style="color:#3A78FC;cursor:pointer;" @click="toRecord">查看装车记录</span>
              </td>
            </tr>
            <tr>
              <td>客户名称</td>
              <td>{{order.consignee}}</td>
            </tr>
            <tr>
              <td>车牌号</td>
              <td>{{order.shipname}}</td>
            </tr>
            <tr v-for="(item,index) in order.drivers" :key="item.idcard">
              <td>司机{{index + 1}}</td>
              <td>{{item.name}}</td>
            </tr>
          </table>
        </div>
      </el-form>
    </div>
    <div class="footer noPrint" v-if="order.id">
      <el-button class="blue-border" :disabled="!order.id" @click="printOrder">打印订单</el-button>
      <el-button type="primary" @click="backCard">确定还卡</el-button>
    </div>
    <!-- 读卡 -->
    <read-card class="noPrint" ref="readCard"></read-card>
    <!---------------------------- 打印 -------------------------->
    <print-box ref="printBox" :order="order"></print-box>
  </div>
</template>

<script>
import { backCard, searchOrderByCard } from '@/api/card'
import ReadCard from '@/components/ReadCard'
import PrintBox from './printBox.vue'
export default {
  components: {
    ReadCard,
    PrintBox
  },
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      searched: false,
      searchLoading: false,
      readLoading: false,
      order: {},
      editForm: {
        cardNo: null
      }
    }
  },
  methods: {
    // 查询订单-根据卡号
    searchOrder() {
      this.$refs.editForm.validateField('cardNo', err => {
        if (!err) {
          const loading = this.$loading({
            lock: true,
            text: "正在查询订单信息",
            spinner: "el-icon-loading",
            background: "rgba(0,0,0,0.4)"
          })
          searchOrderByCard({
            cardNo: this.editForm.cardNo
          })
            .then(res => {
              loading.close()
              this.searched = true
              if (res.code == '000000') {
				  if(res.data.weights){
					let piWeight = res.data.weights.find(i => i.weighType == '1') || {weight:0}
					let maoWeight = res.data.weights.find(i => i.weighType == '2') || {weight:0}
					res.data.actQty = maoWeight.weight-piWeight.weight;
				  }else{
					res.data.actQty = 0;
				  }
                this.order = res.data || {}
              } else {
                this.order = {}
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '查询订单失败：' + res.msg
                })
              }
            })
            .catch(err => {
              loading.close()
              this.searched = true
              this.order = {}
              this.$message({
                showClose: true,
                type: 'error',
                message: '查询订单失败：' + err
              })
            })
        }
      })
    },

    // 读取卡号
    readCard() {
      this.readLoading = true
      this.$refs.readCard
        .readCard()
        .then(res => {
          this.readLoading = false
          this.editForm.cardNo = res
          this.searchOrder()
        })
        .catch(err => {
          this.readLoading = false
          this.editForm.cardNo = null
          this.$message({
            showClose: true,
            type: "error",
            duration: 5000,
            message: err
          })
        })
    },

    // 装车记录
    toRecord() {
      let backInfo = {
        cardNo: this.editForm.cardNo,
        order: this.order
      }
      sessionStorage.setItem("backInfo", JSON.stringify(backInfo))
      this.$router.push(`/card/record/${this.order.id}`)
    },


    // 打印订单
    printOrder() {
      this.$refs.printBox.print()
    },

    // 还卡
    backCard() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let msg = this.order.id ? "" : "没有查到订单信息，"
          this.$confirm(`${msg}确定还卡吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.loading = true
              backCard(this.order.id)
                .then(res => {
                  this.loading = false
                  if (res.code == '000000') {
                    this.$confirm('您已还卡成功！', '还卡成功', {
                      confirmButtonText: '返回',
                      cancelButtonText: '继续还卡',
                      type: 'success'
                    })
                      .then(() => {
                        sessionStorage.removeItem("backInfo")
                        this.$router.go(-1)
                      })
                      .catch(() => {
                        this.$refs.editForm.resetFields()
                        this.searched = false
                        this.order = {}
                        sessionStorage.removeItem("backInfo")
                      })
                  } else {
                    this.$message({
                      showClose: true,
                      type: 'error',
                      message: '还卡失败：' + res.msg
                    })
                  }
                })
                .catch(err => {
                  this.loading = false
                  this.$message({
                    showClose: true,
                    type: 'error',
                    message: '还卡失败：' + err
                  })
                })
            })
            .catch(() => {
              return
            })
        }
      })
    },

    // 初始化
    initData() {
      let data = sessionStorage.getItem("backInfo")
      if(data) {
        this.searched = true
        let backInfo = JSON.parse(data)
        this.editForm.cardNo = backInfo.cardNo
        this.order = backInfo.order
      }
    }
  },
  created() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
@media screen {
	.noVisable{display:none;}
}
@media print {
	.noPrint{display:none;}
}
.search-box {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  padding: 0 20px !important;
  border-bottom: 1px solid #dbdbdb;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}
.form-box {
  width: 680px;
  margin: 0 auto;
  padding: 20px 0;
  .el-radio {
    margin-right: 50px;
    color: rgba(0, 0, 0, 0.65);
  }
  .el-table {
    margin-bottom: 20px;
  }
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #373b4b;
    margin-bottom: 15px;
  }
  .tips {
    color: #999999;
    margin-bottom: 20px;
    p {
      margin-top: -5px;
      margin-bottom: 10px;
    }
    i {
      color: #faad14;
      margin-right: 5px;
    }
    .valid {
      color: rgba(0, 0, 0, 0.65);
    }
    .el-icon-success {
      color: #52c41a;
    }
    .el-icon-error {
      color: #ff4d4f;
    }
  }
}
.footer {
  width: 680px;
  margin: 0 auto;
  padding-top: 20px;
  text-align: center;
  border-top: 1px solid #dbdbdb;
  .el-button {
    width: 160px;
  }
}
table {
  white-space: normal;
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  td {
    width: 100%;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
    background: #ffffff;
    padding: 15px 0 15px 10px;
    border: none;
    &:nth-of-type(odd) {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      width: 120px;
      min-width: 130px;
      background: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>