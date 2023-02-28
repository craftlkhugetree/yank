<template>
  <div class="base-search-table">
    <!---------------------------- tab页 ---------------------------->
    <div class="bg-white" v-loading="loading" style="padding: 0 0 18px">
      <p v-if="groupList.length == 0" style="padding: 20px 0 0 20px">暂无考核分组</p>
      <div class="right-btn">
        <label>选择年度：</label>
        <el-date-picker
          class="no-border date-select no-clear"
          v-model="year"
          type="year"
          placeholder="全部"
          size="small"
          value-format="yyyy"
          format="yyyy年"
          style="width: 90px"
          :clearable="false"
          @change="
            getTableData();
            getGroupQuota();
          "
        ></el-date-picker>
        <i class="el-icon-arrow-down"></i>
      </div>
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in groupList" :key="tab.id" :name="tab.id" :label="tab.name">
          <div class="tab-content" v-loading="tableLoading">
            <div class="total-box">
              <div class="total-box-left">
                <label>发放总金额合计</label>
                <span>{{ common.moneyFormat(totalFee) }}元</span>
              </div>
              <div class="total-box-right">
                <div class="total-box-item">
                  <el-progress
                    v-if="showProgress"
                    type="circle"
                    :width="64"
                    color="#1957FB"
                    :percentage="monthPercent"
                  ></el-progress>
                  <span class="progress-text">已用</span>
                  <div>
                    <label>月度考核奖发放合计</label>
                    <span>{{ common.moneyFormat(totalMonthFee) }}元</span>
                    <span class="tips">月度考核奖总额：{{ common.moneyFormat(monthQuota) }}元</span>
                  </div>
                </div>
                <div class="total-box-item">
                  <el-progress
                    v-if="showProgress"
                    type="circle"
                    :width="64"
                    color="#34C759"
                    :percentage="yearPercent"
                  ></el-progress>
                  <span class="progress-text">已用</span>
                  <div>
                    <label>年终考核奖发放合计</label>
                    <span>{{ common.moneyFormat(totalYearFee) }}元</span>
                    <span class="tips">年终考核奖总额：{{ common.moneyFormat(yearQuota) }}元</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="base-search-table">
              <!---------------------------- 表格 ---------------------------->
              <el-table
                :data="tableData"
                style="width: 100%"
                header-row-class-name="table-header"
                v-loading="tableLoading"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  show-overflow-tooltip
                  width="80"
                ></el-table-column>
                <el-table-column
                  prop="title"
                  label="绩效清单"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="totalman"
                  label="考核人数"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="totalfee"
                  label="发放总金额（元）"
                  show-overflow-tooltip
                  :formatter="(row, column, val) => common.moneyFormat(val)"
                ></el-table-column>
                <el-table-column
                  prop="totalmonthfee"
                  label="月考核奖总金额（元）"
                  :formatter="(row, column, val) => common.moneyFormat(val)"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="status" label="进度" show-overflow-tooltip width="350">
                  <!-- :formatter="(row, column, val) => statusFormat(row, tab)" -->
                  <template slot-scope="scope">
                    <div class="div_flex">
                      <div
                        :style="{ '--background': bg(scope.row[t]) }"
                        class="item"
                        v-for="t in Object.keys(text)"
                        :key="t"
                      >
                        <span class="text">
                          {{ text[t] }}
                        </span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="220">
                  <template slot-scope="scope">
                    <span @click="toDetail(scope.row)">查看</span>
                    <span v-if="tab.isdefault !== '1'" @click="openDrawer(scope.row)">
                      操作记录
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-------------------------- 操作记录弹窗 -------------------------->
    <record-drawer ref="recordDrawer"></record-drawer>
  </div>
</template>

<script>
import { fetchKpiList } from '@/api/kpi/awardList.js';
import { fetchQuotaList } from '@/api/admin/quota.js';
import RecordDrawer from './recordDrawer';
import green from '@/assets/img/green.png';
import orange from '@/assets/img/orange.png';
import gray from '@/assets/img/gray.png';
import endgreen from '@/assets/img/endgreen.png';
import endorange from '@/assets/img/endorange.png';
import endgray from '@/assets/img/endgray.png';
export default {
  components: {
    RecordDrawer,
  },
  data() {
    return {
      loading: false,
      activeTab: null,
      year: this.moment().format('YYYY'),
      tableLoading: false,
      tableData: [],
      monthQuota: 0,
      yearQuota: 0,
      showProgress: false,
      text: {
        isCommit: '录入提交',
        isConfirm: '内部确认',
        isVerify: '领导审核',
        isGiveout: '发放',
      },
      green,
      orange,
      gray,
      endgreen,
      endorange,
      endgray,
    };
  },
  computed: {
    bg() {
      return function (url) {
        return `url('${this[url]}') 100% no-repeat`;
      };
    },
    // 用户有权限查看的工作组
    groupList() {
      return this.$store.state.userRoleGroupList;
    },
    // 总合计
    totalFee() {
      let arr = this.tableData.map(i => i.totalfee);
      return arr.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
    // 月合计
    totalMonthFee() {
      let arr = this.tableData
        .filter(i => i.type == '1' || i.type == '4')
        .map(i => i.totalmonthfee);
      return arr.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
    // 年合计
    totalYearFee() {
      let arr = this.tableData.filter(i => i.type == '2').map(i => i.totalfee);
      return arr.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
    // 月占比
    monthPercent() {
      if (this.monthQuota > 0 && this.totalMonthFee > 0) {
        let data = (this.totalMonthFee / this.monthQuota) * 100;
        return parseFloat(data.toFixed(1));
      } else {
        return 0;
      }
    },
    // 年占比
    yearPercent() {
      if (this.yearQuota > 0 && this.totalYearFee > 0) {
        let data = (this.totalYearFee / this.yearQuota) * 100;
        return parseFloat(data.toFixed(1));
      } else {
        return 0;
      }
    },
  },
  watch: {
    groupList() {
      this.init();
    },
  },
  methods: {
    // 点击tab
    handleClick(tab, event) {
      this.getGroupQuota();
      this.getTableData();
    },

    // 清单状态：1草稿 2已提交 3已确认 4已审核
    // "GRANTSTATUS" char(1) DEFAULT NULL COMMENT '发放状态：1未发放2暂不发放3已发放',
    statusFormat(row, tab) {
      let data = '';
      switch (row.status) {
        case '1':
          data = '草稿';
          break;
        case '2':
          if (tab.isdefault == '1') {
            data = this.grantstatusFromat(row.grantstatus);
          } else {
            data = '已提交';
          }
          break;
        case '3':
          data = '已确认';
          break;
        case '4':
          data = this.grantstatusFromat(row.grantstatus);
          break;
      }
      return data;
    },

    // 发放状态：1-未发放， 2-暂不发放，3-已发放
    grantstatusFromat(val) {
      let data = '';
      switch (val) {
        case '1':
          data = '未发放';
          break;
        case '2':
          data = '暂不发放';
          break;
        case '3':
          data = '已发放';
          break;
      }
      return data;
    },

    // 查看
    toDetail(row) {
      this.$router.push({
        path: `/kpi/award-list/detail/${row.id}`,
        query: {
          title: `『 ${row.groupname} 』${row.title}`,
        },
      });
    },

    // 打开弹窗
    openDrawer(row) {
      let drawer = this.$refs.recordDrawer;
      drawer.title = `『 ${row.groupname}${row.title} 』操作记录`;
      drawer.id = row.id;
      drawer.drawer = true;
    },

    // 获取考核组额度
    getGroupQuota() {
      let param = {
        groupid: this.activeTab,
        kpiyear: this.year,
      };
      fetchQuotaList(param).then(res => {
        if (res.success) {
          let data = res.data[0] || {};
          this.monthQuota = data.monthquota;
          this.yearQuota = data.yearquota;
        }
      });
    },

    // 获取表格数据
    getTableData() {
      this.tableLoading = true;
      let param = {
        filter: {
          groupid: this.activeTab,
          yeardate: this.year,
        },
        limit: 100,
        page: 1,
      };
      fetchKpiList(param)
        .then(res => {
          let data = res.data || [];
          // this.tableData = data.filter(i => i.grantstatus == "3");
          data.forEach(i => {
            let title = '';
            let time = '';
            let totalMoney = 0;
            // type: 1-月绩效，2-年绩效，3-特殊发放，4-领导绩效
            if (i.type == '1' || i.type == '4') {
              title = `${i.yeardate}年${i.monthdate}月绩效清单`;
              time = i.monthdate;
              totalMoney = i.totalmonthfee;
            } else if (i.type == '2') {
              title = `${i.yeardate}年终绩效清单`;
              totalMoney = i.totalfee;
            } else if (i.type == '3') {
              title = i.kpiname;
              time = this.moment(i.sendtime, 'YYYYMMDDhhmmss').format('MM');
            }
            i.title = title;
            i.time = time;
            i.totalMoney = totalMoney;
          });

          let yearList = data.filter(i => i.type == '2');
          let otherList = data.filter(i => i.type !== '2');
          otherList.sort((a, b) => {
            return a.time > b.time ? -1 : 1;
          });
          this.tableData = yearList.concat(otherList);
          this.showProgress = true;
          // 记录参数
          let params = {
            groupid: this.activeTab,
            yeardate: this.year,
          };
          sessionStorage.setItem('awardListParams', JSON.stringify(params));
          this.tableData.forEach(t => {
            t.isCommit = 'gray';
            t.isConfirm = 'gray';
            t.isVerify = 'gray';
            t.isGiveout = 'endgray';
            if (t.status == '1') {
              t.isCommit = 'orange';
            } else if (t.status == '2') {
              t.isCommit = 'green';
              t.isConfirm = 'orange';
            } else if (t.status == '3') {
              t.isCommit = 'green';
              t.isConfirm = 'green';
              t.isVerify = 'orange';
            } else if (t.status == '4') {
              t.isCommit = 'green';
              t.isConfirm = 'green';
              t.isVerify = 'green';
              if (t.grantstatus == '3') {
                t.isGiveout = 'endgreen';
              } else {
                t.isGiveout = 'endorange';
              }
            }
          });
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },

    // 初始化
    init() {
      if (this.groupList.length > 0) {
        let ids = this.groupList.map(i => i.id);
        let index = this.groupList.findIndex(i => i.id === this.activeTab);
        if (index < 0) {
          this.activeTab = this.groupList[0].id;
        }
        this.getGroupQuota();
        this.getTableData();
      }
    },

    // 初始化参数
    initParams() {
      let data = sessionStorage.getItem('awardListParams');
      let params = data ? JSON.parse(data) : {};
      if (data) {
        let params = JSON.parse(data);
        this.activeTab = params.groupid;
        this.year = params.yeardate || null;
      }
    },
  },
  created() {
    this.initParams();
    if (this.groupList.length > 0) {
      this.init();
    }
  },
};
</script>

<style lang="scss" scoped>
.bg-white {
  position: relative;
}
.right-btn {
  position: absolute;
  right: 20px;
  top: 8px;
  z-index: 200;
  label {
    color: #5f6464;
  }
}
.tab-content {
  position: relative;
  min-height: 500px;

  .total-box {
    padding: 10px 0;
    margin: 0 20px 10px;
    border: 1px solid #dbdbdb;
    label {
      display: block;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-bottom: 6px;
    }
    .total-box-left {
      display: inline-block;
      width: 35%;
      height: 80px;
      vertical-align: top;
      padding-left: 20px;
      border-right: 1px solid rgba(0, 0, 0, 0.08);
      span {
        font-size: 30px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 38px;
      }
    }
    .total-box-right {
      display: inline-block;
      width: 65%;
      .total-box-item {
        position: relative;
        display: inline-block;
        width: 50%;
        padding-left: 20px;
        .el-progress {
          float: left;
          margin-right: 15px;
        }
        span {
          display: block;
          font-size: 20px;
          color: #000000;
          line-height: 28px;
        }
        .tips {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
          line-height: 20px;
        }
        .progress-text {
          position: absolute;
          font-size: 12px;
          left: 40px;
          top: 8px;
        }
      }
    }
  }
  .div_flex {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;
    height: 28px;
    .item {
      height: 28px;
      background: var(--background);
      background-size: 100% 100%;
      width: 95px;
      margin-left: -9px;
      .text {
        width: 56px;
        height: 20px;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        text-align: left;
        white-space: nowrap;
        line-height: 20px;
        margin: auto 0 auto 19px;
        vertical-align: middle;
      }
      &:nth-child(3) {
        margin-left: -8px;
      }
      &:last-child {
        width: 55px;
      }
    }
  }
}
</style>
<style lang="scss">
.date-select {
  .el-input__prefix,
  .el-input__inner {
    color: #5f6464;
  }
  input::-webkit-input-placeholder {
    color: #5f6464;
  }
}
.el-progress.el-progress--circle {
  .el-progress__text {
    top: 62%;
  }
}
</style>
