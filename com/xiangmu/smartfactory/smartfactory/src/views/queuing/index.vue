<template>
  <!---------------------------- tab页 ---------------------------->
  <div class="base-tab" ref="baseTab" v-loading="loading">
    <p v-if="goodsList.length == 0" style="padding:60px 20px;">暂无数据</p>
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in goodsList" :key="tab.id" :name="tab.id">
        <!---------------------------- 标签 ---------------------------->
        <span slot="label">{{tab.name}}</span>
        <!---------------------------- 内容 ---------------------------->
        <div class="tab-content">
          <div class="base-search-table">
            <div class="search-box clearfix" style="padding: 0 10px 15px;">
              <el-button
                class="yellow-btn"
                size="small"
                @click="toggleCall(tab)"
              >{{tab.isSuspended == "1" ? "恢复叫号" : "暂停"}}</el-button>
              <el-button type="primary" size="small" @click="chooseCall">选叫</el-button>
              <i class="el-icon-refresh" @click="getTableData">刷新</i>
              <!---------------------------- 状态展示 ---------------------------->
              <div class="search-box-right">
                <!-- <span class="status-item">
                  <label>待装区容量：</label>
                  <span>{{tab.receivedarea}}</span>
                </span>-->
                <span class="status-item">
                  <label>总排号：</label>
                  <span>{{total1 + total2 + total3}}</span>
                </span>
                <span class="status-item">
                  <label>已叫号：</label>
                  <span>{{total2 + total3}}</span>
                </span>
                <span class="status-item">
                  <label>等候中：</label>
                  <span>{{total1}}</span>
                </span>
              </div>
            </div>
            <!---------------------------- 表格 ---------------------------->
            <el-row>
              <el-col :span="6">
                <h3 class="table-title">等待叫号</h3>
                <el-table
                  :data="tableData1"
                  style="width:100%"
                  header-row-class-name="table-header"
                  v-loading="table1Loading"
                  :height="tableHeight"
                >
                  <el-table-column prop="orderNo" label="序号" width="50"></el-table-column>
                  <el-table-column prop="shipname" label="车牌号" min-width="90" show-overflow-tooltip></el-table-column>
                  <el-table-column
                    prop="location"
                    label="罐号"
                    show-overflow-tooltip
                    :formatter="common.defaultFormat"
                  ></el-table-column>
                  <el-table-column
                    prop="outportName"
                    label="鹤位"
                    show-overflow-tooltip
                    :formatter="common.defaultFormat"
                  ></el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12" style="border: 1px solid #e5e8ed;border-width:0 1px;">
                <h3 class="table-title">叫号中</h3>
                <el-table
                  :data="tableData2"
                  style="width:100%"
                  header-row-class-name="table-header"
                  v-loading="table2Loading"
                  :height="tableHeight"
                >
                  <el-table-column prop="orderNo" label="序号" width="50"></el-table-column>
                  <el-table-column prop="shipname" label="车牌号" min-width="90" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="location" label="罐号" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="outportName" label="鹤位" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="status" label="状态" align="center" width="120">
                    <template slot-scope="scope">
                      <span style="margin-right:2px;">{{statusFormat(scope.row)}}</span>
                      <span v-if="scope.row.isFault == '1'" style="color:red;">(故障)</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="160">
                    <template slot-scope="scope">
                      <div v-if="scope.row.status == '2'">
                        <el-popover
                          placement="right-start"
                          width="108"
                          trigger="click"
                          @show="getOutPortList(scope.row)"
                          popper-class="no-padding-popover"
                        >
                          <ul class="popover-list" v-loading="outportLoading">
                            <li
                              v-for="item in outPortList.filter(i => i.name !== scope.row.outportName)"
                              :key="item.id"
                              @click="changeOutport(scope.row,item)"
                            >{{item.name}}</li>
                          </ul>
                          <span slot="reference">重新分配</span>
                        </el-popover>
                        <span v-if="scope.row.isFault == '0'" @click="doFault(scope.row)">故障</span>
                        <span @click="cancelOrder(scope.row)">取消</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="isTest" label="测试用操作" align="center" width="120">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == '2'" @click="weight('1',scope.row)">称皮重</span>
                      <span v-if="scope.row.status == '3'" @click="load(scope.row)">装车</span>
                      <span v-if="scope.row.status == '4'" @click="weight('2',scope.row)">称毛重</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="6">
                <h3 class="table-title">已结束</h3>
                <el-table
                  :data="tableData3"
                  style="width:100%"
                  header-row-class-name="table-header"
                  v-loading="table3Loading"
                  :height="tableHeight"
                >
                  <el-table-column prop="orderNo" label="序号" width="50"></el-table-column>
                  <el-table-column prop="shipname" label="车牌号" min-width="90" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="location" label="罐号" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="outportName" label="鹤位" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="status" label="状态" align="center" width="70">
                    <template slot-scope="scope">
                      <span style="margin-right:2px;">{{statusFormat(scope.row)}}</span>
                      <span v-if="scope.row.isFault == '1'" style="color:red;">(故障)</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!------------------------- 选叫弹窗 ------------------------->
    <call-drawer ref="callDrawer" @doFunc="getTableData"></call-drawer>
  </div>
</template>

<script>
import {
  fetchWaitList,
  fetchCallList,
  fetchEndList,
  changeGoodsStatus,
  fetchOutPortList,
  changeOutport,
  cancelOrder,
  isFault,
  weight,
  load
} from '@/api/queuing.js'
import CallDrawer from './callDrawer'
export default {
  components: {
    CallDrawer
  },
  data() {
    return {
      loading: false,
      activeTab: null,
      goodsList: [],
      tableHeight: 535,
      tableData1: [],
      total1: 0,
      table1Loading: false,
      tableData2: [],
      total2: 0,
      table2Loading: false,
      tableData3: [],
      total3: 0,
      table3Loading: false,
      // 1已开卡2已叫号3已称皮重4已装车5已称毛重6已还卡7故障8已过号9已取消
      statusList: [
        { id: '1', name: '已开卡' },
        { id: '2', name: '已叫号' },
        { id: '3', name: '已称皮重' },
        { id: '4', name: '已装车' },
        { id: '5', name: '已称毛重' },
        { id: '6', name: '已还卡' },
        { id: '7', name: '故障' },
        { id: '8', name: '已过号' },
        { id: '9', name: '已取消' }
      ],
      outPortList: [],
      outportLoading: false,
      timer: null
    }
  },
  computed: {
    // 是否测试环境
    isTest() {
      return window.isTest
    }
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.status == '2') {
        return 'cur-call-row'
      } else {
        return ''
      }
    },

    // 状态格式
    statusFormat(row) {
      let data = this.statusList.filter(i => i.id == row.status)[0]
      return data ? data.name : '--'
    },

    // 暂停/恢复叫号
    toggleCall(tab) {
      let msg = tab.isSuspended == '1' ? '恢复叫号' : '暂停叫号'
      this.$confirm(`确认要${msg}吗？`, `确认要${msg}吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          changeGoodsStatus(tab.id)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `${msg}成功！`
                })
                tab.isSuspended = tab.isSuspended == '1' ? '0' : '1'
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `${msg}失败：${res.msg}`
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: `${msg}失败：${err}`
              })
            })
        })
        .catch(() => {
          return
        })
    },

    // 选叫
    chooseCall() {
      let callDrawer = this.$refs.callDrawer
      callDrawer.goodsid = this.activeTab
      callDrawer.licenseList = this.tableData1
      callDrawer.drawer = true
    },

    // 称重
    weight(type, row) {
      let param = {
        billId: row.id,
        cardNo: row.cardNo,
        driverWeight: '60',
        roomcode: '磅房编号',
        roomname: '磅房名称',
        weighType: type,
        weight: '1000'
      }
      // 称重
      weight(param)
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '称毛重成功'
            })
            this.getCallData()
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '称毛重失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            type: 'error',
            message: '称毛重失败：' + err
          })
        })
    },

    // 装车
    load(row) {
      // 装车
      load(`${row.id}?factqty=300`)
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '装车成功'
            })
            this.getCallData()
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '装车失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            type: 'error',
            message: '装车失败：' + err
          })
        })
    },

    // 重新分配
    changeOutport(row, zct) {
      this.$confirm(`确认要重新分配到『 ${zct.name} 』吗？`, '确认要重新分配吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          changeOutport(`${row.id}?outportName=${zct.name}`)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `重新分配成功！`
                })
                this.getTableData()
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `重新分配失败：${res.msg}`
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: `重新分配失败：${err}`
              })
            })
        })
        .catch(() => {
          return
        })
    },

    // 故障
    doFault(row) {
      this.$confirm(`车牌『 ${row.shipname} 』确认故障吗？`, '确认要取消吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          isFault(row.id)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `已设置故障！`
                })
                this.getTableData()
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `设置故障失败：${res.msg}`
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: `设置故障失败：${err}`
              })
            })
        })
        .catch(() => {
          return
        })
    },

    // 取消
    cancelOrder(row) {
      this.$confirm(`确认要取消分配，自动呼叫下一号吗？`, '确认要取消吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          cancelOrder(row.id)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `取消成功！`
                })
                this.getTableData()
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `取消失败：${res.msg}`
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: `取消失败：${err}`
              })
            })
        })
        .catch(() => {
          return
        })
    },

    // 点击tab
    handleClick(tab, event) {
      this.getTableData()
    },

    // 获取物料
    getGoodsList() {
      this.loading = true
      this.$store
        .dispatch('getGoodsList')
        .then(res => {
          this.loading = false
          this.goodsList = res || []
          if (this.goodsList.length > 0) {
            let ids = this.goodsList.map(i => i.id)
            if (!ids.includes(this.activeTab)) {
              this.activeTab = this.goodsList[0].id
              this.getTableData()
            }
          }
        })
        .catch(err => {
          this.loading = false
        })
    },

    // 等待叫号列表
    getWaitData() {
      this.table1Loading = true
      fetchWaitList({
        goodsId: this.activeTab
      })
        .then(res => {
          if (res.code == '000000') {
            this.table1Loading = false
            this.tableData1 = res.data || []
            this.total1 = this.tableData1.length
          }
        })
        .catch(err => {
          this.table1Loading = false
        })
    },

    // 叫号中列表
    getCallData() {
      this.table2Loading = true
      fetchCallList({
        goodsId: this.activeTab
      })
        .then(res => {
          if (res.code == '000000') {
            this.table2Loading = false
            this.tableData2 = res.data || []
            this.total2 = this.tableData2.length
          }
        })
        .catch(err => {
          this.table2Loading = false
        })
    },

    // 结束列表
    getEndData() {
      this.table3Loading = true
      fetchEndList({
        goodsId: this.activeTab
      })
        .then(res => {
          if (res.code == '000000') {
            this.table3Loading = false
            this.tableData3 = res.data || []
            this.total3 = this.tableData3.length
          }
        })
        .catch(err => {
          this.table3Loading = false
        })
    },

    // 获取表格数据
    getTableData() {
      this.getWaitData()
      this.getCallData()
      this.getEndData()
    },

    // 获取鹤位
    getOutPortList(row) {
      let params = {
        goodsid: this.activeTab,
        location: row.location
      }
      this.outportLoading = true
      fetchOutPortList(params)
        .then(res => {
          this.outportLoading = false
          if (res.code == '000000') {
            this.outPortList = res.data || []
          }
        })
        .catch(err => {
          this.outportLoading = false
        })
    },

    // 滚动到当前叫号的行
    scrollToCurCallRow() {
      let curCallRowIndex = null
      try {
        this.tableData.forEach((row, index) => {
          // if (row.status == '1' && row.calltime) {
          if (row.status == '2') {
            curCallRowIndex = index
            throw Error()
          }
        })
      } catch (e) {}
      if (curCallRowIndex !== null) {
        this.$refs.elTable.bodyWrapper.scrollTop = 48 * curCallRowIndex
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  mounted() {
    this.tableHeight = this.$refs.baseTab.clientHeight - 152
  }
}
</script>

<style lang="scss" scoped>
.tab-content {
  position: relative;
  min-height: 500px;
}
.search-box {
  border-bottom: 1px solid #dbdbdb;
  .el-button {
    margin-right: 10px;
  }
  .el-icon-refresh {
    color: #999999;
    margin-left: 20px;
    cursor: pointer;
    &::before {
      margin-right: 5px;
    }
  }
}
.search-box-right {
  line-height: 32px;
  .status-item {
    margin-right: 30px;
    &:last-child {
      margin-right: 20px;
    }
    label {
      color: #999999;
    }
    span {
      color: #333333;
    }
  }
}
.popover-list {
  height: 200px;
  li {
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    padding: 7px 0 7px 12px;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }
  }
}
.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  line-height: 36px;
  text-align: center;
}
.el-table {
  margin-top: 5px !important;
}
</style>
<style lang="scss">
.base-tab {
  height: 100%;
  .el-tabs__header .el-tabs__item {
    padding: 5px 15px 10px;
  }
}
.no-padding-popover.el-popover {
  padding: 2px 0;
}
.el-table tr.cur-call-row {
  background: #f0f9eb;
}
</style>