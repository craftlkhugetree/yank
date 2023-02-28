<template>
  <!---------------------------- 头信息 ---------------------------->
  <div class="base-tab" ref="baseTab">
    <div class="base-search-table">
      <div class="header-box">
        <span class="back" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>返回
        </span>
        <el-divider direction="vertical"></el-divider>
        <h3 v-if="kpiData">{{ summaryRecord }}绩效清单</h3>
        <el-tag class="blue-tag" v-if="kpiData && kpiData.grantstatus == '3'"
          >已发放</el-tag
        >
        <el-tag class="orange-tag" v-else>未发放</el-tag>
      </div>
      <div class="search-box clearfix">
        <div class="search-box-left">
          <p>
            <label>汇总记录：</label>
            {{ summaryRecord }}
          </p>
          <p v-show="isEdit !== '1'">
            <label>
              绩效合计：
              <el-tag class="blue-tag">{{ alltotal }}元</el-tag>
            </label>
          </p>
        </div>
      </div>
      <!---------------------------- 导出Excel ---------------------------->
      <div style="position: relative">
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
            prop="joblvname"
            label="领导岗位级别"
            show-overflow-tooltip
            :formatter="common.defaultFormat"
          ></el-table-column>
          <el-table-column
            prop="rylxm"
            label="人员类型"
            show-overflow-tooltip
            :formatter="common.defaultFormat"
          ></el-table-column>
          <el-table-column
            prop="specialsalary"
            :label="title + '金额(元)'"
            :formatter="common.defaultFormat"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.specialsalary"
                @keyup.native="
                  common.moneyInput($event, scope.row.specialsalary)
                "
                placeholder="请输入"
                v-if="isEdit == '1'"
              ></el-input>
              <i v-else>{{ scope.row.specialsalary }}</i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="btn-footer" v-show="isEdit == '1'">
      <label>发放合计：</label>
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
      submitLoading: false,
      kpiData: null,
      tableLoading: false,
      tableData: [],
      initTableData: [],
      summaryRecord: "",
      title: "",
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
    };
  },
  computed: {
    alltotal() {
      let sum = 0;
      this.tableData.forEach((item) => {
        let specialsalary = this.common.filterInput(item.specialsalary);
        sum = this.common.add(sum, specialsalary, 2);
      });
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
      let filterVal = ["username", "userid", "orgname", "specialsalary"];

      let list = exportTable;
      let priceList = exportTable.map((i) => i.specialsalary);
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
        specialsalary: totalPrice,
      });
      let data = this.common.formatJson(filterVal, list);
      // tHeader 表头，data对应表数据，excelTitle导出的表文件名
      let excelTitle = `${this.title}${this.activeTab}人员绩效清单`;
      export_json_to_excel(tHeader, data, excelTitle);
    },
    exportExcel() {
      this.popperVisible = false;
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
      // 导出时是否 勾选了money
      this.tableData.forEach((item) => {
        if (sortArr.includes("specialsalary")) {
          item.rowTotal = item.specialsalary;
        } else {
          item.rowTotal = 0;
        }
      });
      let list = this.tableData;
      let data = this.common.formatJson(filterVal, list);
      // tHeader 表头，data对应表数据，excelTitle导出的表文件名
      let excelTitle = `${this.title}绩效清单`;
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
          this.title = `${kpiItmes.yeardate}年${kpiItmes.name}`;
          this.colList = [
            { propdata: "userNameId", labelText: "姓名" },
            { propdata: "orgname", labelText: "部门" },
            { propdata: "groupname", labelText: "考核分组" },
            { propdata: "joblvname", labelText: "领导岗位级别" },
            { propdata: "rylxm", labelText: "人员类型" },
            { propdata: "specialsalary", labelText: `${this.title}金额(元)` },
            { propdata: "rowTotal", labelText: "合计" },
          ];
          this.checkList = this.colList.map((v) => v.propdata);
          this.summaryRecord = kpiItmes.name;
        } else {
          this.tableLoading = false;
        }
      });
    },

    handleSubmit() {
      let newArr = [];
      this.tableData.forEach((item) => {
        newArr.push({
          kpiid: item.kpiid || null,
          id: item.id || null,
          userid: item.userid,
          username: item.username,
          totalsalary: item.specialsalary - 0 || 0,
          specialsalary: item.specialsalary - 0 || 0,
          joblvname: item.joblvname,
          orgname: item.orgname,
          rylxm: item.rylxm,
          groupid: item.groupid,
          groupname: item.groupname,
        });
      });
      let data = {
        attachment: this.kpiData.attachment,
        name: this.kpiData.name,
        details: newArr,
        id: (this.kpiData && this.kpiData.id) || null,
        monthdate: "",
        savetype: 2, // 1录入 2 提交
        totalfee: this.alltotal - 0,
        totalman: this.tableData.length,
        type: 3, // 1 月度绩效 2年度绩效 3特殊发放 4系统生成
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
              message: `提交失败！`,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.submitLoading = false;
        });
    },

    // 打开历史记录弹窗
    openDrawer(row) {
      let historyDrawer = this.$refs.historyDrawer;
      historyDrawer.drawer = true;
      historyDrawer.title = `『 ${row.username}（${row.userid}）』绩效历史记录`;
      historyDrawer.userid = row.userid;
      historyDrawer.getTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
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
}
.base-search-table .search-box {
  padding-bottom: 0px;
}
.el-form-item {
  margin-bottom: 0px !important;
}

.base-search-table {
  margin-bottom: 80px !important;
}
</style>
