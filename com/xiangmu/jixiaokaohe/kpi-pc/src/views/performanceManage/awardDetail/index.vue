<template>
  <div class="base-search-table" v-loading="loading">
    <!---------------------------- 标题 ---------------------------->
    <div class="search-box clearfix" style="padding: 20px 20px 0;">
      <span class="title">绩效奖励查询</span>
      <span class="tag">合计：{{common.moneyFormat(total)}}元</span>
      <div class="search-box-right">
        <label>选择年度：</label>
        <el-date-picker
          class="no-border date-select no-clear"
          v-model="year"
          type="year"
          placeholder="全部"
          size="small"
          value-format="yyyy"
          format="yyyy年"
          style="width:90px;"
          :clearable="false"
          @change="getUserKpi"
        ></el-date-picker>
        <i class="el-icon-arrow-down"></i>
      </div>
    </div>
    <div class="content">
      <!---------------------------- 基本信息 ---------------------------->
      <table border="1" width="100%">
        <tr>
          <td>姓名</td>
          <td colspan="3">{{detail.name}}（{{detail.id}}）</td>
          <td>考核分组</td>
          <td>{{detail.groupname || "--"}}</td>
          <td>部门</td>
          <td>{{detail.orgname || "--"}}</td>
        </tr>
        <tr>
          <td>领导岗位级别</td>
          <td>{{detail.joblvname || "--"}}</td>
          <td>领导岗位津贴（元)</td>
          <td>{{common.moneyFormat(detail.allowance)}}</td>
          <td>人员类型</td>
          <td>{{detail.rylxm}}</td>
          <td>外挂工资（元）</td>
          <td>{{common.moneyFormat(detail.salary)}}</td>
        </tr>
      </table>
      <!---------------------------- kpi信息 ---------------------------->
      <div class="table-box" v-for="item in list" :key="item.id" v-show="false">
        <h4>
          {{item.title}}
          <span
            class="tag"
            :class="item.grantstatus == '3' ? 'status-yes' : 'status-no'"
          >{{statusFormat(item)}}</span>
        </h4>
        <!-- 月绩效 -->
        <table border="1" width="100%" v-if="['1','4'].includes(item.type)">
          <tr>
            <td>考核分组</td>
            <td>{{item.groupname || "--"}}</td>
            <td>领导岗位级别</td>
            <td>{{item.joblvname || "--"}}</td>
            <td>领导岗位津贴（元）</td>
            <td>{{common.moneyFormat(item.allowance)}}</td>
            <td>外挂工资（元）</td>
            <td>{{common.moneyFormat(item.outsalary)}}</td>
          </tr>
          <tr>
            <td>月度考核奖（元）</td>
            <td>{{common.moneyFormat(item.monthsalary)}}</td>
            <td>其他（元）</td>
            <td>{{common.moneyFormat(item.othersalary)}}</td>
            <td>合计（元）</td>
            <td colspan="3">{{common.moneyFormat(item.totalsalary)}}</td>
          </tr>
        </table>
        <!-- 年绩效 -->
        <table border="1" width="100%" v-if="['2'].includes(item.type)">
          <tr>
            <td>考核分组</td>
            <td>{{item.groupname || "--"}}</td>
            <td style="width:15%;">年终绩效奖励（元）</td>
            <td>{{common.moneyFormat(item.yearsalary)}}</td>
            <td>发放时间：</td>
            <td style="width:40%;">{{common.defaultTimeFormat(item.sendtime)}}</td>
          </tr>
        </table>
        <!-- 特殊发放 -->
        <table border="1" width="100%" v-if="['3'].includes(item.type)">
          <tr>
            <td>考核分组</td>
            <td>{{item.groupname || "--"}}</td>
            <td>发放金额（元）</td>
            <td>{{common.moneyFormat(item.specialsalary)}}</td>
            <td>发放时间：</td>
            <td style="width:45%;">{{common.defaultTimeFormat(item.sendtime)}}</td>
          </tr>
        </table>
      </div>
      <div class="base-search-table">
        <!---------------------------- 表格 ---------------------------->
        <el-table
          :data="tableData"
          style="width:100%"
          header-row-class-name="table-header"
          v-loading="loading"
        >
          <el-table-column prop="title" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="monthsalary"
            label="月度考核奖（元)"
            show-overflow-tooltip
            :formatter="(row, column, val) => common.moneyFormat(val)"
          ></el-table-column>
          <el-table-column
            prop="allowance"
            label="领导岗位津贴（元)"
            show-overflow-tooltip
            :formatter="(row, column, val) => common.moneyFormat(val)"
          ></el-table-column>
          <el-table-column
            prop="outsalary"
            label="外挂工资（元)"
            show-overflow-tooltip
            :formatter="(row, column, val) => common.moneyFormat(val)"
          ></el-table-column>
          <el-table-column
            prop="othersalary"
            label="其他（元)"
            show-overflow-tooltip
            :formatter="(row, column, val) => common.moneyFormat(val)"
          ></el-table-column>
          <el-table-column
            prop="totalsalary"
            label="合计（元)"
            show-overflow-tooltip
            :formatter="(row, column, val) => common.moneyFormat(val)"
          ></el-table-column>
          <el-table-column prop="grantstatus" label="发放时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                :class="{'tag status-no':scope.row.grantstatus !== '3'}"
                style="color:#606266;"
              >{{statusFormat(scope.row)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { findUserById } from "@/api/admin/users";
import { fetchMyKpi } from "@/api/kpi/manage.js";
export default {
  data() {
    return {
      loading: false,
      year: this.moment().format("YYYY"),
      list: []
    };
  },
  computed: {
    detail() {
      return this.$store.state.userDetail;
    },
    total() {
      let arr = this.list.map(i => i.totalsalary);
      return arr.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
    },
    // 表格排序
    tableData() {
      let list = [...this.list];
      list.sort((a,b) => b.sendtime - a.sendtime)
      return list
      // let yearList = list.filter(i => i.type == "2");
      // let otherList = list.filter(i => i.type !== "2");
      // otherList.sort((a, b) => {
      //   return a.time > b.time ? -1 : 1;
      // });
      // return yearList.concat(otherList);
    }
  },
  methods: {
    // 发放状态：1-未发放， 2-暂不发放，3-已发放
    statusFormat(row) {
      let data = "";
      switch (row.grantstatus) {
        case "1":
          data = "未发放";
          break;
        case "2":
          data = "暂不发放";
          break;
        case "3":
          // data = "已发放";
          data = this.common.defaultTimeFormat(row.sendtime, "YYYY年MM月");
          break;
      }
      return data;
    },

    // 获取kpi详情
    getUserKpi() {
      this.loading = true;
      let param = {
        year: this.year
      };
      fetchMyKpi(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            // 已通过审核的月绩效和年绩效，已发放的发放录入和领导绩效
            this.list = data.filter(
              i =>
                (["1", "2"].includes(i.type) && i.status == "4") ||
                (["3", "4"].includes(i.type) && i.grantstatus == "3")
            );
            this.list.forEach(i => {
              let title = "";
              let time = "";
              // type: 1-月绩效，2-年绩效，3-特殊发放，4-领导绩效
              if (i.type == "1" || i.type == "4") {
                title = `${i.yeardate}年${i.monthdate}月绩效清单`;
                time = i.monthdate;
              } else if (i.type == "2") {
                title = `${i.yeardate}年终绩效清单`;
              } else if (i.type == "3") {
                title = i.kpiname;
                time = this.moment(i.sendtime, "YYYYMMDDhhmmss").format("MM");
              }
              i.title = title;
              i.time = time;
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getUserKpi();
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  width: 100%;
  line-height: 22px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #373b4b;
  }
  label {
    color: #5f6464;
  }
}
.tag {
  font-size: 14px;
  color: #3f86f7;
  line-height: 20px;
  padding: 0 4px;
  background: #ebf2fe;
  border-radius: 2px;
  border: 1px solid #85b2fa;
  margin-left: 10px;
  &.status-no {
    color: #ff9f0a !important;
    background: #fff5e6;
    border-color: #ffc162;
  }
}
.content {
  padding: 0 20px;
}
table {
  margin: 10px 0 20px;
  white-space: normal;
  td {
    width: 15%;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
    background: #ffffff;
    padding: 15px 0 15px 10px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    &:nth-of-type(odd) {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      width: 10%;
      min-width: 130px;
      background: rgba(0, 0, 0, 0.02);
    }
  }
}
.table-box {
  h4 {
    font-size: 14px;
    font-weight: 400;
    color: #373b4b;
    line-height: 20px;
  }
}
</style>
