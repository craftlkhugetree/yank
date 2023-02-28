<template>
  <!---------------------------- 头信息 ---------------------------->
  <div class="base-tab" ref="baseTab" v-loading="loading">
    <div class="base-search-table">
      <div class="header-box">
        <span class="back" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>返回
        </span>
        <el-divider direction="vertical"></el-divider>
        <h3 v-if="kpiData">
          <template v-if="kpiData.type=='2'">『 {{kpiData.groupname}} 』{{kpiData.yeardate}}年终绩效清单</template>
          <template
            v-else
          >『 {{kpiData.groupname}} 』{{kpiData.yeardate}}年{{kpiData.monthdate&&kpiData.monthdate+'月'}}绩效清单</template>
        </h3>
        <el-tag class="blue-tag" v-if="kpiData&&kpiData.grantstatus=='3'">已发放</el-tag>
        <el-tag class="orange-tag" v-else>未发放</el-tag>
      </div>
      <div class="search-box clearfix">
        <div class="search-box-left">
          <p>
            <label>汇总记录：</label>
            {{summaryRecord}}绩效清单
          </p>
          <p>
            <label>
              绩效合计：
              <el-tag class="blue-tag">{{alltotal}}元</el-tag>
            </label>
          </p>
        </div>
      </div>
      <!---------------------------- 导出Excel ---------------------------->
      <div style="position: relative;">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane v-for="tab in tabList" :key="tab.id" :name="tab.name">
            <!---------------------------- 标签 ---------------------------->
            <span slot="label">{{tab.name}}</span>
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
                <i class="el-icon-close" @click="popperVisible=false;"></i>
              </h3>
              <div class="popover-dialog-content">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    style="display:block"
                    v-for="checkItem in colList"
                    :key="checkItem.propdata"
                    :label="checkItem.propdata"
                  >{{checkItem.labelText}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="popover-dialog-footer">
                <el-button type="primary" size="small" @click="exportExcel">确定导出</el-button>
              </div>
            </div>
            <span slot="reference">
              <el-button type="primary" size="small">筛选导出</el-button>
            </span>
          </el-popover>
          <el-button type="primary" style="margin-left:20px" size="small" @click="downExcel">实发下载</el-button>
        </div>
        <!---------------------------- 表格 ---------------------------->
        <el-table
          :data="tableData"
          style="width:100%"
          header-row-class-name="table-header"
          v-loading="tableLoading"
        >
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="username" label="姓名" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.username}}（{{scope.row.userid}}）</template>
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
          <template v-if="kpiData&&kpiData.type=='1'">
            <el-table-column
              prop="allowance"
              :label="title+'领导岗位津贴(元)'"
              :formatter="common.defaultFormat"
            ></el-table-column>
            <el-table-column
              prop="outsalary"
              :label="title+'外挂工资(元)'"
              :formatter="common.defaultFormat"
            ></el-table-column>
            <el-table-column
              prop="monthsalary"
              :label="title+'月度考核奖(元)'"
              :formatter="common.defaultFormat"
            ></el-table-column>
            <el-table-column prop="othersalary" :label="title+'其他(元)'"></el-table-column>
            <el-table-column prop="totalsalary" label="合计(元)"></el-table-column>
          </template>
          <template v-else>
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
              prop="yearsalary"
              :label="title+'终考核奖(元)'"
              :formatter="common.defaultFormat"
            ></el-table-column>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { findCollectById } from "@/api/kpi/collect";
import { export_json_to_excel } from "@/vendor/Export2Excel";
export default {
  props: {
    kpiId: String,
    isCheck: String,
    orignal: String
  },

  data() {
    return {
      loading: false,
      kpiData: null,
      tableLoading: false,
      tableData: [],
      initTableData: [],
      summaryRecord: "",
      title: "",
      totalfee: "",
      activeTab: "全部",
      tabList: [
        { id: "1", name: "全部" },
        { id: "2", name: "在编" },
        { id: "3", name: "非编" },
        { id: "4", name: "租赁" }
      ],
      popperVisible: false,
      checkList: [],
      colList: [],
      exportTable: []
    };
  },
  computed: {
    alltotal() {
      let sum = 0;
      this.tableData.forEach(item => {
        sum = this.common.add(sum, item.totalsalary, 2);
      });
      return sum;
    }
  },
  mounted() {
    this.getDetailData();
  },
  methods: {
    //实发下载
    downExcel() {
      const tHeader = ["姓名", "工号", "部门", "实发合计"];
      let exportTable = _.cloneDeep(this.tableData);
      let filterVal = ["username", "userid", "orgname", "totalsalary"];

      let list = exportTable;
      let priceList = exportTable.map(i => i.totalsalary);
      let totalPrice = priceList.reduce((sum, num) => {
        return this.common.add(sum, num);
      }, 0);
      list.forEach(item => {
        item.userid = `userid${item.userid}`;
      });
      list.push({
        username: "合计",
        userid: "",
        orgname: "",
        totalsalary: totalPrice
      });
      let data = this.common.formatJson(filterVal, list);
      // tHeader 表头，data对应表数据，excelTitle导出的表文件名
      let excelTitle = `${this.summaryRecord}${this.activeTab}人员绩效清单`;
      export_json_to_excel(tHeader, data, excelTitle);
    },

    exportExcel() {
      this.popperVisible = false;
      // 导出表格的表头设置
      let tHeader = []; //表字段中文
      let sortArr = [];
      this.colList.forEach(col => {
        if (this.checkList.includes(col.propdata)) {
          sortArr.push(col.propdata);
          tHeader.push(col.labelText);
        }
      });
      let filterVal = sortArr; //表字段英文
      // 导出时是否 勾选了money ,未勾选的不计算,头部去掉该列
      let exportTable = _.cloneDeep(this.tableData);
      exportTable.forEach(item => {
        if (this.kpiData.type == "1") {
          let moenyArr = [
            "allowance",
            "outsalary",
            "monthsalary",
            "othersalary"
          ];
          moenyArr.forEach(m => {
            if (!this.checkList.includes(m)) {
              item[m] = 0;
            }
          });
          this.getcurMount(item);
        }
        if (this.kpiData.type == "2") {
          item.rowTotal = this.checkList.includes("yearsalary")
            ? item.yearsalary
            : 0;
        }
      });

      let list = exportTable;
      let data = this.common.formatJson(filterVal, list);
      // tHeader 表头，data对应表数据，excelTitle导出的表文件名
      let excelTitle = `${this.summaryRecord}绩效清单`;
      export_json_to_excel(tHeader, data, excelTitle);
    },
    // 切换tab
    handleClick(tab, event) {
      let dataList = JSON.parse(JSON.stringify(this.initTableData));
      let newArr = dataList.filter(item =>
        item.rylxm ? item.rylxm.indexOf(tab.name) != -1 : false
      );
      if (tab.name == "全部") {
        this.tableData = dataList;
      } else {
        this.tableData = newArr;
      }
    },

    //月绩效累计 列
    getcurMount(row) {
      let monthMoney = this.common.add(row.othersalary, row.monthsalary, 2);
      let salary = this.common.add(row.allowance, row.outsalary, 2);
      let curmonth = this.common.add(monthMoney, salary, 2);
      this.$set(row, "curtotal", curmonth);
      this.$set(row, "monthMoney", monthMoney);
      this.$set(row, "rowTotal", curmonth);
      return curmonth;
    },
    // 根据id查询数据
    getDetailData() {
      let param = {
        id: this.kpiId,
        orignal: this.orignal
      };
      this.tableLoading = true;
      findCollectById(param).then(res => {
        if (res.success) {
          this.tableLoading = false;
          let kpiItmes = res.data;
          this.kpiData = kpiItmes;
          let kpiArr = kpiItmes.kpidetails || [];
          kpiArr.forEach(item => {
            item.userNameId = `${item.username}（${item.userid}）`;
          });
          this.tableData = kpiArr;
          this.initTableData = kpiArr;
          this.title = `${kpiItmes.yeardate}年${kpiItmes.monthdate &&
            kpiItmes.monthdate + "月"}`;
          this.summaryRecord = `『 ${kpiItmes.groupname} 』${
            kpiItmes.yeardate
          }年${kpiItmes.monthdate && kpiItmes.monthdate + "月"}`;
          if (kpiItmes.type == "1") {
            //正常月绩效
            this.colList = [
              { propdata: "userNameId", labelText: "姓名" },
              { propdata: "orgname", labelText: "部门" },
              { propdata: "groupname", labelText: "考核分组" },
              {
                propdata: "allowance",
                labelText: `${this.title}领导岗位津贴(元)`
              },
              { propdata: "outsalary", labelText: `${this.title}外挂工资(元)` },
              {
                propdata: "monthsalary",
                labelText: `${this.title}月度考核奖(元)`
              },
              { propdata: "othersalary", labelText: `${this.title}其他(元)` },
              {
                propdata: "totalsalary",
                labelText: `${this.title}月绩效合计(元)`
              },
              { propdata: "rowTotal", labelText: "合计" }
            ];
          } else if (kpiItmes.type == "2") {
            this.title = `${kpiItmes.yeardate}年`;
            this.summaryRecord = `『 ${kpiItmes.groupname} 』${kpiItmes.yeardate}年终`;
            //正常年绩效
            this.colList = [
              { propdata: "userNameId", labelText: "姓名" },
              { propdata: "orgname", labelText: "部门" },
              { propdata: "groupname", labelText: "考核分组" },
              {
                propdata: "yearsalary",
                labelText: `${this.title}终考核奖(元)`
              },
              { propdata: "rowTotal", labelText: "合计" }
            ];
          }
          this.checkList = this.colList.map(v => v.propdata);
        } else {
          this.tableLoading = false;
        }
      });
    }
  }
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
.base-search-table .search-box {
  padding-bottom: 0px;
}
.el-form-item {
  margin-bottom: 0px !important;
}
</style>
