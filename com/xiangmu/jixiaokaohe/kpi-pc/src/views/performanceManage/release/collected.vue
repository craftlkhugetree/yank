<template>
  <!---------------------------- 头信息 ---------------------------->
  <div class="base-tab" ref="baseTab">
    <div class="base-search-table">
      <div class="header-box">
        <span class="back" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>返回
        </span>
        <el-divider direction="vertical"></el-divider>
        <h3 v-if="kpiData">{{kpiData.name}}</h3>
        <el-tag class="blue-tag" v-if="kpiData&&kpiData.grantstatus=='3'">已发放</el-tag>
        <el-tag class="orange-tag" v-else>未发放</el-tag>
      </div>
      <div class="search-box clearfix">
        <div class="search-box-left">
          <el-form label-position="right" label-width="100px">
            <el-form-item label="汇总记录：" prop="title">
              <div :class="{'noexpend':!isOpen}">
                <div v-for="(record,index) in summaryRecord" :key="index">
                  <p>
                    {{record}}
                    <span class="record-btn" @click="isOpen = !isOpen" v-show="index==0">
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
            <el-form-item label="绩效合计：" prop="title">
              <el-tag class="blue-tag">{{alltotal}}元</el-tag>
            </el-form-item>
          </el-form>
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
                    v-for="checkItem in  setcolList"
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
          <el-table-column type="index" label="序号" width="80" fixed></el-table-column>
          <el-table-column prop="username" label="姓名" show-overflow-tooltip fixed>
            <template slot-scope="scope">{{scope.row.username}}（{{scope.row.userid}}）</template>
          </el-table-column>
          <el-table-column
            prop="orgname"
            label="部门"
            show-overflow-tooltip
            :formatter="common.defaultFormat"
            fixed
          ></el-table-column>
          <el-table-column
            prop="groupname"
            label="考核分组"
            show-overflow-tooltip
            :formatter="common.defaultFormat"
            fixed
          ></el-table-column>
          <template v-for="(col) in colList">
            <el-table-column
              :show-overflow-tooltip="true"
              :prop="col.propdata"
              :label="col.labelText"
              :key="col.propdata"
              :formatter="common.defaultFormat"
              width="300px"
            ></el-table-column>
          </template>
          <el-table-column prop="allRowTotal" label="总计(元)" fixed="right"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { reviewKpi } from "@/api/kpi/manage";
import { findCollectById } from "@/api/kpi/collect";
import { export_json_to_excel } from "@/vendor/Export2Excel";
export default {
  props: {
    kpiId: String,
    isCheck: String,
    orignal: String
  },
  components: {},
  data() {
    return {
      isOpen: false,
      kpiData: null,
      tableLoading: false,
      tableData: [],
      initTableData: [],
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
      setcolList: [], //选择导出字段
      summaryRecord: [],
      alltotal: "",
      exportTable: []
    };
  },
  computed: {
    collecttotal() {
      let sum = 0;
      this.tableData.forEach(item => {
        sum = this.common.add(sum, item.allRowTotal, 2);
      });
      return sum;
    }
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
      let filterVal = ["username", "userid", "orgname", "allRowTotal"];
      let list = exportTable;
      let priceList = exportTable.map(i => i.allRowTotal);
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
        allRowTotal: totalPrice
      });
      let data = this.common.formatJson(filterVal, list);
      // tHeader 表头，data对应表数据，excelTitle导出的表文件名

      let excelTitle = `${this.kpiData.name}${this.activeTab}人员绩效清单`;
      export_json_to_excel(tHeader, data, excelTitle);
    },
    exportExcel() {
      this.popperVisible = false;
      // 导出时是否 勾选了money ,未勾选的不计算,头部去掉该列
      this.exportTable = _.cloneDeep(this.tableData);
      let moenyArr = this.colList.map(v => v.propdata); //动态列头字段值
      let sortArr = [];
      this.setcolList.forEach(col => {
        if (this.checkList.includes(col.propdata)) {
          sortArr.push(col.propdata);
        }
      });
      this.exportTable.forEach(item => {
        moenyArr.forEach(m => {
          if (!sortArr.includes(m)) {
            item[m] = 0;
          }
        });
        this.getcurMount(item, moenyArr);
      });
      // 导出表格的表头设置
      let tHeader = []; //表字段中文
      let filterVal = sortArr; //表字段英文
      this.setcolList.forEach(item => {
        if (filterVal.includes(item.propdata)) {
          tHeader.push(item.labelText);
        }
      });
      let list = this.exportTable;
      let data = this.common.formatJson(filterVal, list);
      // tHeader 表头，data对应表数据，excelTitle导出的表文件名
      let excelTitle = `${this.kpiData.name}绩效清单`;
      export_json_to_excel(tHeader, data, excelTitle);
    },
    // 切换tab
    handleClick(tab) {
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
    //计算导出的合计列
    getcurMount(row, moenyArr) {
      let sum = 0;
      moenyArr.forEach(m => {
        sum = this.common.add(sum, row[m], 2);
      });
      this.$set(row, "rowTotal", sum);
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
          let kpidetails = kpiItmes.kpidetails || [];
          kpidetails.forEach(item => {
            item.userNameId = `${item.username}（${item.userid}）`;
          });

          // 汇总记录
          let kpis = kpiItmes.kpis || [];
          let sum = 0;
          kpis.forEach(item => {
            let str;
            if (item.type == "3") {
              str = item.name;
            } else {
              str = `${item.groupname ? "『 " + item.groupname + " 』" : ""}${
                item.yeardate
              }年${item.monthdate && item.monthdate + "月"}绩效清单`;
            }
            this.summaryRecord.push(str);
            sum = this.common.add(sum, item.totalfee, 2);
          });
          this.alltotal = sum;

          // 去重后，找对应userid 合并各字段
          let newArr = this.common.unique(kpidetails, "userid") || [];
          // this.tableData = newArr;
          this.initTableData = newArr;
          //已汇总数据列表
          this.setcolList = [
            { propdata: "userNameId", labelText: "姓名" },
            { propdata: "orgname", labelText: "部门" },
            { propdata: "groupname", labelText: "考核分组" }
          ];
          let colArr = [],
            yearColArr = [];
          newArr.forEach(user => {
            user.allRowTotal = 0;

            kpidetails.forEach(item => {
              if (user.userid == item.userid) {
                if (item.type == "2") {
                  //2 年度绩效
                  let obj = {
                    [`${item.yeardate}yearsalary`]: item.yearsalary
                  };
                  user = Object.assign(user, obj);
                  user[`${item.yeardate}yearsalary`] = item.yearsalary;
                  let col = {
                    propdata: `${item.yeardate}yearsalary`,
                    labelText: `${item.yeardate}年终考核奖`
                  };
                  let flag = yearColArr.findIndex(v => {
                    return v.propdata == `${item.yeardate}yearsalary`;
                  });
                  if (flag == "-1") {
                    yearColArr.push(col);
                  }
                  user.allRowTotal = this.common.add(
                    user.allRowTotal,
                    item.yearsalary,
                    2
                  );
                }

                if (item.type == "3") {
                  //3特殊发放
                  let obj = {
                    [`${item.yeardate}年${item.kpiname}specialsalary`]: item.specialsalary
                  };
                  user = Object.assign(user, obj);
                  let col = {
                    propdata: `${item.yeardate}年${item.kpiname}specialsalary`,
                    labelText: `${item.yeardate}年${item.kpiname}`
                  };
                  let flag = yearColArr.findIndex(v => {
                    // return v.propdata == `${item.yeardate}specialsalary`;
                    return v.labelText == `${item.yeardate}年${item.kpiname}`;
                  });
                  if (flag == "-1") {
                    yearColArr.push(col);
                  }

                  user.allRowTotal = this.common.add(
                    user.allRowTotal,
                    item.specialsalary,
                    2
                  );
                }

                if (["1", "4"].includes(item.type)) {
                  //月份 月绩效 和系统生成
                  let obj = {
                    [`${item.yeardate}${item.monthdate}allowance`]: item.allowance,
                    [`${item.yeardate}${item.monthdate}outsalary`]: item.outsalary,
                    [`${item.yeardate}${item.monthdate}monthsalary`]: item.monthsalary,
                    [`${item.yeardate}${item.monthdate}othersalary`]: item.othersalary
                  };
                  user = Object.assign(user, obj);
                  let onesalary = this.common.add(
                    item.outsalary,
                    item.allowance,
                    2
                  );
                  let twosalary = this.common.add(
                    item.monthsalary,
                    item.othersalary,
                    2
                  );
                  let allsalary = this.common.add(onesalary, twosalary, 2);
                  user.allRowTotal = this.common.add(
                    user.allRowTotal,
                    allsalary,
                    2
                  );
                  let unionList = colArr.map(v => v.propdata);
                  if (
                    !unionList.includes(
                      `${item.yeardate}${item.monthdate}allowance`
                    )
                  ) {
                    colArr = colArr.concat([
                      {
                        propdata: `${item.yeardate}${item.monthdate}allowance`,
                        labelText: `${item.yeardate}年${item.monthdate}月领导岗位津贴（元）`
                      },
                      {
                        propdata: `${item.yeardate}${item.monthdate}outsalary`,
                        labelText: `${item.yeardate}年${item.monthdate}月外挂工资（元）`
                      },
                      {
                        propdata: `${item.yeardate}${item.monthdate}monthsalary`,
                        labelText: `${item.yeardate}年${item.monthdate}月度考核奖（元）`
                      },
                      {
                        propdata: `${item.yeardate}${item.monthdate}othersalary`,
                        labelText: `${item.yeardate}年${item.monthdate}月其他（元）`
                      }
                    ]);
                  }
                }
              }
            });
          });
          // 按年排序
          yearColArr.sort((a, b) => {
            return a.propdata > b.propdata ? 1 : -1;
          });
          // 按月排序
          colArr.sort((a, b) => {
            return a.propdata > b.propdata ? 1 : -1;
          });

          this.colList = colArr.concat(yearColArr);
          // // 按年排序

          this.setcolList = this.setcolList.concat(this.colList);
          this.setcolList.push({ propdata: "rowTotal", labelText: "合计" });
          this.checkList = this.setcolList.map(v => v.propdata);
          this.tableData = newArr;
        } else {
          this.tableLoading = false;
        }
      });
    }
  }
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
</style>
