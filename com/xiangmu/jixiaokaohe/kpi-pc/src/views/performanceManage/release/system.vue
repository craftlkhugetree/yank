<template>
  <!---------------------------- 头信息 ---------------------------->
  <div class="base-table" ref="baseTab">
    <div class="base-search-table">
      <div class="header-box">
        <span class="back" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>返回
        </span>
        <el-divider direction="vertical"></el-divider>
        <h3 v-if="kpiData">
          『 {{ kpiData.groupname }} 』{{ kpiData.yeardate }}年{{
            kpiData.monthdate && kpiData.monthdate + "月"
          }}绩效清单
        </h3>
        <el-tag class="blue-tag" v-if="kpiData && kpiData.grantstatus == '3'"
          >已发放</el-tag
        >

        <el-tag class="orange-tag" v-else>未发放</el-tag>
      </div>
      <div class="search-box clearfix">
        <div class="search-box-left">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="计算记录：" prop="title">
              <div :class="{ noexpend: !isOpen }">
                <div v-for="(record, index) in summaryRecord" :key="index">
                  <p>
                    {{ record }}
                    <span
                      class="record-btn"
                      @click="isOpen = !isOpen"
                      v-show="index == 0"
                    >
                      <span v-if="isOpen">
                        <i class="el-icon-arrow-up"></i>收起记录
                      </span>
                      <span v-else>
                        <i class="el-icon-arrow-down"></i>展开记录
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!---------------------------- 导出Excel ---------------------------->
      <div style="position: relative" class="table-div">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane v-for="tab in tabList" :key="tab.id" :name="tab.name">
            <!---------------------------- 标签 ---------------------------->
            <span slot="label">{{ tab.name }}</span>
          </el-tab-pane>
        </el-tabs>
        <div class="excel-btn">
          <el-popover
            popper-class="popover-dialog"
            placement="bottom-start"
            min-width="180"
            :visible-arrow="false"
            v-model="popperVisible"
          >
            <div>
              <h3 class="popover-dialog-title">
                选择导出字段
                <i class="el-icon-close" @click="popperVisible = false"></i>
              </h3>
              <div class="popover-dialog-content">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    style="display: block"
                    v-for="checkItem in colList"
                    :key="checkItem.propdata"
                    :label="checkItem.propdata"
                    >{{ checkItem.labelText }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
              <div class="popover-dialog-footer">
                <el-button type="primary" size="small" @click="exportExcel"
                  >确定导出</el-button
                >
              </div>
            </div>
            <span slot="reference">
              <el-button type="primary" size="small">筛选导出</el-button>
            </span>
          </el-popover>
          <el-button
            type="primary"
            style="margin-left: 20px"
            size="small"
            @click="downExcel"
            >实发下载</el-button
          >
        </div>
        <!---------------------------- 表格 ---------------------------->
        <el-table
          class="table-list"
          :data="tableData"
          style="width: 100%"
          header-row-class-name="table-header"
          v-loading="tableLoading"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column prop="username" label="姓名" show-overflow-tooltip>
            <template slot-scope="scope"
              >{{ scope.row.username }}（{{ scope.row.userid }}）</template
            >
          </el-table-column>
          <el-table-column
            prop="orgname"
            label="部门"
            show-overflow-tooltip
            :formatter="common.defaultFormat"
          ></el-table-column>
          <el-table-column
            prop="groupname"
            label="考核分组"
            show-overflow-tooltip
            :formatter="common.defaultFormat"
          ></el-table-column>
          <el-table-column
            prop="allowance"
            label="领导岗位津贴(元)"
            :formatter="common.defaultFormat"
          ></el-table-column>
          <el-table-column
            prop="outsalary"
            label="外挂工资(元)"
            :formatter="common.defaultFormat"
          ></el-table-column>
          <el-table-column
            prop="monthsalary"
            label="月度考核奖(元)"
            :formatter="common.defaultFormat"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.monthsalary"
                @keyup.native="common.moneyInput($event, scope.row.monthsalary)"
                :placeholder="scope.row.monthsalary"
                v-if="isEdit == '1'"
              ></el-input>
              <i v-else>{{ scope.row.monthsalary }}</i>
            </template>
          </el-table-column>
          <el-table-column prop="othersalary" label="其他(元)">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.othersalary"
                @keyup.native="common.moneyInput($event, scope.row.othersalary)"
                :placeholder="scope.row.othersalary"
                v-if="isEdit == '1'"
              ></el-input>
              <i v-else>{{ scope.row.othersalary }}</i>
            </template>
          </el-table-column>
          <el-table-column prop="totalsalary" label="月绩效合计(元)">
            <template slot-scope="scope">{{ getcurMount(scope.row) }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="isEdit == '1'">
            <template slot-scope="scope">
              <span @click="openDrawer(scope.row)">历史记录</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="btn-footer" v-show="isEdit == '1'">
      <label>本月合计：</label>
      <span class="mg-r20">{{ alltotal }}元</span>
      <el-button
        :disabled="alltotal == 0"
        :loading="submitLoading"
        type="primary"
        size="small"
        @click="handleSubmit"
        >提交确认</el-button
      >
    </div>
    <!---------------------------- 历史记录 ---------------------------->
    <history-drawer ref="historyDrawer"></history-drawer>
  </div>
</template>
<script>
import historyDrawer from "../components/historyDrawer";
import { findCollectById } from "@/api/kpi/collect";
import { saveKpi } from "@/api/kpi/manage";
import { export_json_to_excel } from "@/vendor/Export2Excel";
export default {
  props: {
    kpiId: String,
    isEdit: String,
    orignal: String,
  },
  components: {
    historyDrawer,
  },
  data() {
    return {
      isOpen: false,
      submitLoading: false,
      kpiData: null,
      monthquota: "",
      tableLoading: false,
      tableData: [],
      initTableData: [],
      summaryRecord: [],
      totalfee: "",
      activeTab: "全部",
      tabList: [
        { id: "1", name: "全部" },
        { id: "2", name: "在编" },
        { id: "3", name: "非编" },
        { id: "4", name: "租赁" },
      ],
      popperVisible: false,
      checkList: [],
      colList: [],
      exportTable: [],
    };
  },
  computed: {
    alltotal() {
      //本月考核列合计
      let sum = 0,
        fee = 0;
      this.tableData.forEach((item) => {
        fee = this.common.add(fee, item.rowTotal, 2);
        sum = this.common.add(sum, item.onlyMonth, 2);
      });
      this.totalfee = fee;
      return sum;
    },
  },
  created() {},
  mounted() {
    this.getDetailData();
  },
  methods: {
    //实发下载
    downExcel() {
      const tHeader = ["姓名", "工号", "部门", "实发合计"];
      let exportTable = _.cloneDeep(this.tableData);
      let filterVal = ["username", "userid", "orgname", "rowTotal"];

      let list = exportTable;
      let priceList = exportTable.map((i) => i.rowTotal);
      let totalPrice = priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
      list.forEach((item) => {
        item.userid = `userid${item.userid}`;
      });
      list.push({
        username: "合计",
        userid: "",
        orgname: "",
        rowTotal: totalPrice,
      });
      let data = this.common.formatJson(filterVal, list);
      // tHeader 表头，data对应表数据，excelTitle导出的表文件名
      let excelTitle = `『 ${this.kpiData.groupname} 』${this.title}${this.activeTab}人员绩效清单`;
      export_json_to_excel(tHeader, data, excelTitle);
    },
    //筛选导出
    exportExcel() {
      this.popperVisible = false;
      // 导出时是否 勾选了money ,未勾选的不计算,头部去掉该列
      let exportTable = _.cloneDeep(this.tableData);
      exportTable.forEach((item) => {
        let moenyArr = ["allowance", "outsalary", "monthsalary", "othersalary"];
        moenyArr.forEach((m) => {
          if (!this.checkList.includes(m)) {
            item[m] = 0;
          }
        });
        this.getcurMount(item);
      });
      // // 导出表格的表头设置
      // let tHeader = []; //表字段中文
      // let filterVal = this.checkList; //表字段英文
      // this.colList.forEach(item => {
      //   if (filterVal.includes(item.propdata)) {
      //     tHeader.push(item.labelText);
      //   }
      // });
      // 导出表格的表头设置
      let tHeader = []; //表字段中文
      let sortArr = [];
      this.colList.forEach((col) => {
        if (this.checkList.includes(col.propdata)) {
          sortArr.push(col.propdata);
          tHeader.push(col.labelText);
        }
      });
      let filterVal = sortArr; //表字段英文
      let list = exportTable;
      let data = this.common.formatJson(filterVal, list);
      // tHeader 表头，data对应表数据，excelTitle导出的表文件名
      let excelTitle = `『 ${this.kpiData.groupname} 』${this.title}绩效清单`;
      export_json_to_excel(tHeader, data, excelTitle);
    },
    // 切换tab
    handleClick(tab, event) {
      let dataList = JSON.parse(JSON.stringify(this.initTableData));
      let newArr = dataList.filter((item) =>
        item.rylxm ? item.rylxm.indexOf(tab.name) != -1 : false
      );
      if (tab.name == "全部") {
        this.tableData = dataList;
      } else {
        this.tableData = newArr;
      }
    },
    // 根据id查询数据
    getDetailData() {
      let param = {
        id: this.kpiId,
        orignal: this.orignal,
      };

      this.tableLoading = true;
      findCollectById(param).then((res) => {
        if (res.success) {
          this.tableLoading = false;
          let kpiItmes = res.data;
          this.kpiData = kpiItmes;
          let kpiArr = kpiItmes.kpidetails || [];
          kpiArr.forEach((item) => {
            item.userNameId = `${item.username}（${item.userid}）`;
          });
          this.tableData = kpiArr;
          this.initTableData = kpiArr;
          this.title = `${kpiItmes.yeardate}年${
            kpiItmes.monthdate && kpiItmes.monthdate + "月"
          }`;
          this.colList = [
            // { propdata: "index", labelText: "序号" },
            { propdata: "userNameId", labelText: "姓名" },
            { propdata: "orgname", labelText: "部门" },
            { propdata: "groupname", labelText: "考核分组" },
            { propdata: "allowance", labelText: "领导岗位津贴(元)" },
            { propdata: "outsalary", labelText: "外挂工资(元)" },
            { propdata: "monthsalary", labelText: "月度考核奖(元)" },
            { propdata: "othersalary", labelText: "其他(元)" },
            { propdata: "totalsalary", labelText: "月绩效合计(元)" },
            { propdata: "rowTotal", labelText: "合计" },
          ];
          this.checkList = this.colList.map((v) => v.propdata);

          let kpis = kpiItmes.kpis || [];
          let num = 0,
            sumMoney = 0;
          kpis.forEach((item) => {
            num = num + item.totalman;
            sumMoney = this.common.add(sumMoney, item.totalmonthfee, 2);
            let str = `『 ${item.groupname} 』${item.yeardate}年${item.monthdate}月度考核奖发放清单，考核人数${item.totalman}人，月度考核奖合计${item.totalmonthfee}元`;
            this.summaryRecord.push(str);
          });
          let sumStr = `总人数${num}人，月度考核奖总计${sumMoney}元`;
          this.summaryRecord.unshift(sumStr);
        } else {
          this.tableLoading = false;
        }
      });
    },

    //月绩效累计 列
    getcurMount(row) {
      let monthsalary = this.common.filterInput(row.monthsalary); //单个月
      let othersalary = this.common.filterInput(row.othersalary);
      let monthMoney = this.common.add(othersalary, monthsalary, 2); //月+ 其他
      let salary = this.common.add(row.allowance, row.outsalary, 2); //津贴+ 外挂薪资
      let curmonth = this.common.add(monthMoney, salary, 2);
      this.$set(row, "rowTotal", curmonth);
      this.$set(row, "onlyMonth", monthsalary);
      return curmonth;
    },

    // 打开历史记录弹窗
    openDrawer(row) {
      let historyDrawer = this.$refs.historyDrawer;
      historyDrawer.drawer = true;
      historyDrawer.title = `『 ${row.username}（${row.userid}）』绩效历史记录`;
      historyDrawer.userid = row.userid;
      historyDrawer.type = "4";
      historyDrawer.getTableData();
    },
    handleSubmit() {
      let newArr = [];
      this.tableData.forEach((item) => {
        newArr.push({
          kpiid: item.kpiid || null,
          id: item.id || null,
          userid: item.userid,
          username: item.username,
          outsalary: item.outsalary || 0,
          allowance: item.allowance || 0,
          monthsalary: item.monthsalary - 0 || 0,
          othersalary: item.othersalary - 0 || 0,
          totalsalary: item.rowTotal - 0 || 0,
          joblvname: item.joblvname,
          orgname: item.orgname,
          rylxm: item.rylxm,
          groupid: this.kpiData.groupid,
          groupname: this.kpiData.groupname,
        });
      });
      let data = {
        attachment: this.kpiData.attachment,
        details: newArr,
        id: (this.kpiData && this.kpiData.id) || null,
        monthdate: this.kpiData.monthdate,
        savetype: 2, // 1录入 2 提交
        totalfee: this.totalfee - 0,
        totalmonthfee: this.alltotal - 0,
        totalman: this.tableData.length,
        type: 4, // 1 月度绩效 2年度绩效 3特殊发放 4系统生成
        yeardate: this.kpiData.yeardate,
      };
      this.submitLoading = true;
      saveKpi(data)
        .then((res) => {
          this.submitLoading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              message: `提交成功！`,
              type: "success",
            });
            this.$router.go(-1);
          } else {
            this.$message({
              showClose: true,
              message: `提交成功！`,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.submitLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-content {
  position: relative;
  min-height: 500px;
}
.search-box {
  .search-box-left {
    float: left;
    line-height: 40px;
  }
  label {
    color: #5f6464;
  }
}
.search-box-right {
  & > div {
    display: inline-block;
  }
}
.header-box {
  padding: 20px;
  border-bottom: 1px solid #d8d8d8;
  .back {
    color: #3f86f7;
    cursor: pointer;
  }
  h3 {
    display: inline-block;
  }
  .el-tag {
    margin-left: 10px;
  }
  .tips {
    color: #999999;
    font-size: 13px;
    display: inline-block;
    margin-left: 10px;
  }
}

.noexpend {
  height: 40px;
  overflow: hidden;
}
.record-btn {
  cursor: pointer;
  margin-left: 20px;
  color: #999999;
  font-size: 12px;
  line-height: 40px;
  i {
    font-size: 18px;
    margin-right: 8px;
  }
}
.base-search-table .search-box {
  padding-left: 0px;
}
.el-form-item {
  margin-bottom: 0px !important;
}

.base-search-table {
  margin-bottom: 80px !important;
}
</style>
