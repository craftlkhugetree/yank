<template>
  <div class="base-search-table">
    <!------------------------------------- 检查点信息 ------------------------------------->
    <div class="search-box noPrint clearfix" style="padding:0 20px;">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>{{isUnload ? '卸车记录' : '装车记录'}}
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right" style="max-width: 100%">
        <el-button class="blue-border" size="small" @click="printOrder">打印订单</el-button>
      </div>
    </div>
    <!---------------------------- 详情 ---------------------------->
    <div class="content noPrint">
      <table border="1" width="100%">
        <tr style="border-bottom:none;">
          <td class="title" colspan="8">{{isUnload ? '卸货单信息' : '提货单信息'}}</td>
        </tr>
        <tr>
          <td>{{isUnload ? '卸货单号' : '提货单号'}}</td>
          <td><span class="ellipsis" :title="detail.billNo" style="max-width: 266px">{{detail.billNo}}</span></td>
          <td>物料名称</td>
          <td>{{detail.goodsName}}</td>
          <td>{{isUnload ? '应卸量' : '应装量'}}</td>
          <td>{{detail.quantity ? detail.quantity + "KG" : "--"}}</td>
          <td>客户名称</td>
          <td>{{detail.consignee}}</td>
        </tr>
        <tr style="border-bottom:none;">
          <td class="title" colspan="8">司机信息</td>
        </tr>
        <tr>
          <td>车牌号</td>
          <td>{{detail.shipname}}</td>
          <template v-for="(item,index) in detail.drivers">
            <td :key="item.id">司机{{index + 1}}</td>
            <td :key="item.id">{{item.name}}</td>
          </template>
        </tr>
        <tr style="border-bottom:none;">
          <td class="title" colspan="8">
            开卡
            <span class="time">{{common.defaultTimeFormat(detail.createTime)}}</span>
          </td>
        </tr>
        <tr>
          <td>开卡方式</td>
          <td>{{detail.openCardType == "1" ? "自助开卡" : "人工开卡"}}</td>
          <td>卡号</td>
          <td>{{detail.cardNo}}</td>
          <td colspan="4" style="background:none;"><el-popover placement="bottom-start" width="340" trigger="manual" v-model="visible">
            <div class="popover-content" v-loading="popoverloading">
              <h4>
                重新绑卡
                <i class="el-icon-close" @click="visible=false;"></i>
              </h4>
              <div class="content-box">
                <div class="tips">
                  <i class="el-icon-question"></i>
                  重新绑卡后需重新进厂称重装车
                </div>
                <el-input
                  v-model="cardnumber"
                  size="small"
                  placeholder="正确插入卡片后自动读取卡号"
                  style="width:214px"
                ></el-input>
                <el-button
                  size="small"
                  :loading="readLoading"
                  @click="readCard"
                  style="width: 90px;"
                >读取卡号</el-button>
              </div>
              <div class="footer">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="!cardnumber"
                  @click="bindCard"
                >确定绑卡</el-button>
              </div>
            </div>
            <el-button slot="reference" type="primary" size="small" @click="visible=true">重新绑卡</el-button>
          </el-popover>
          </td>
        </tr>
        <tr style="border-bottom:none;">
          <td class="title" colspan="8">
            皮重
            <span class="time">{{common.defaultTimeFormat(piWeight.createTime)}}</span>
          </td>
        </tr>
        <tr>
          <td>磅房编号</td>
          <td>{{piWeight.roomcode || "--"}}</td>
          <td>磅房名称</td>
          <td>{{piWeight.roomname || "--"}}</td>
          <td>皮重</td>
          <td>{{piWeight.weight ? piWeight.weight + "KG" : "--"}}</td>
          <td>司机体重</td>
          <td>{{piWeight.driverWeight ? piWeight.driverWeight + "KG" : "--"}}</td>
        </tr>
        <tr style="border-bottom:none;" v-if="!isUnload">
          <td class="title" colspan="8">
            定量装车
            <span class="time">{{common.defaultTimeFormat(detail.loadTime)}}</span>
          </td>
        </tr>
        <tr v-if="!isUnload">
          <td>装车重量</td>
          <td>{{detail.factqty ? detail.factqty + "KG" : "--"}}</td>
        </tr>
        <tr style="border-bottom:none;">
          <td class="title" colspan="8">
            毛重
            <span class="time">{{common.defaultTimeFormat(maoWeight.createTime)}}</span>
          </td>
        </tr>
        <tr>
          <td>磅房编号</td>
          <td>{{maoWeight.roomcode || "--"}}</td>
          <td>磅房名称</td>
          <td>{{maoWeight.roomname || "--"}}</td>
          <td>毛重</td>
          <td>{{maoWeight.weight ? maoWeight.weight + "KG" : "--"}}</td>
          <td>司机体重</td>
          <td>{{maoWeight.driverWeight ? maoWeight.driverWeight + "KG" : "--"}}</td>
        </tr>
        <tr style="border-bottom:none;">
          <td class="title" colspan="8">
            称重对比
            <span class="time">{{common.defaultTimeFormat("")}}</span>
          </td>
        </tr>
        <tr>
          <td>{{isUnload ? '卸车重量' : '装车重量' }}</td>
          <td>{{isNum(maoWeight.weight) && isNum(piWeight.weight) ? Math.abs(maoWeight.weight - piWeight.weight) + 'KG' : "--"}}</td>
        </tr>
      </table>
    </div>
    <!---------------------------- 读卡 -------------------------->
    <read-card ref="readCard"></read-card>
    <!---------------------------- 打印 -------------------------->
    <print-box ref="printBox" :order="detail"></print-box>
  </div>
</template>

<script>
import { fetchRecord, bindCard } from '@/api/card'
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
  computed: {
    isUnload() {
      return this.detail.loadType == '2'
    },
    isNum() {
      let reg = /^-?\d+(\.\d+|\d*)$/;
      return function(num) {
        return reg.test(num)
      }
    }
  },
  data() {
    return {
      loading: false,
      detail: {},
      visible: false,
      popoverloading: false,
      cardnumber: null,
      readLoading: false,
      piWeight: {},
      maoWeight: {}
    }
  },
  methods: {
    // 打印订单
    printOrder() {
      this.$refs.printBox.print();
    },
    // 读取卡号
    readCard() {
      this.readLoading = true
      this.$refs.readCard
        .readCard()
        .then(res => {
          this.readLoading = false
          this.cardnumber = res
        })
        .catch(err => {
          this.readLoading = false
          this.cardnumber = null
          this.$message({
            showClose: true,
            type: 'error',
            duration: 5000,
            message: err
          })
        })
    },

    // 重新绑卡
    bindCard() {
      this.popoverloading = true
      bindCard(`${this.id}?cardNo=${this.cardnumber}`)
        .then(res => {
          this.popoverloading = false
          if (res.code == '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '绑卡成功！'
            })
            this.detail.cardNo = this.cardnumber
            this.visible = false
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '重新绑卡失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.popoverloading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '重新绑卡失败：' + err
          })
        })
    },

    // 获取详情
    getDetail() {
      this.loading = true
      fetchRecord(this.id)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.detail = res.data || {}
            this.piWeight = this.detail.weights.find(i => this.isUnload ? i.weighType == '2' : i.weighType == '1') || {}
            this.maoWeight = this.detail.weights.find(i => this.isUnload ? i.weighType == '1' : i.weighType == '2') || {}
          }
        })
        .catch(err => {
          this.loading = false
        })
    }
  },
  created() {
    this.getDetail()
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  border-bottom: 1px solid #dbdbdb;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}
.content {
  padding: 0 20px 20px;
  h4 {
    font-weight: 600;
    color: #373b4b;
    line-height: 20px;
    margin: 20px 0 10px;
  }
  .time {
    // position: absolute;
    color: #999999;
    padding-left: 10px;
    font-weight: 400;
  }
}

table {
  white-space: normal;
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  td {
    width: 15%;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
    background: #ffffff;
    padding: 15px 0 15px 10px;
    border: none;
    &:nth-of-type(odd) {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      width: 10%;
      min-width: 130px;
      background: rgba(0, 0, 0, 0.02);
    }

    &.title {
      background: none;
      font-weight: 600;
      color: #373b4b;
      line-height: 20px;
      margin: 20px 0 10px;
    }
  }
}
.popover-content {
  h4 {
    font-size: 14px;
    font-weight: 400;
    color: #3a3a3a;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    margin: 0 -12px;
    i {
      font-size: 16px;
      color: #000;
      float: right;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .content-box {
    height: 90px;
    overflow: auto;
    padding: 20px 0 0;
    .tips {
      color: #999999;
      margin-bottom: 10px;
      i {
        color: #faad14;
      }
    }
    .el-input {
      margin-right: 8px;
    }
    .el-button--small {
      padding: 9px 10px;
    }
  }
  .footer {
    padding: 8px 12px 0;
    margin: 20px -12px 0;
    border-top: 1px solid #eeeeee;
    .el-button {
      width: 100%;
    }
  }
}
</style>