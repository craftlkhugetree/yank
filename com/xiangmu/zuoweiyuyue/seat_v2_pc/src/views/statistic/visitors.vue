<template>
  <!---------------------------- tab页 ---------------------------->
  <div class="main-div">
    <p v-if="tabList.length == 0" style="padding:60px 20px;">暂无数据</p>
    <div class="right-btn"></div>
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabList" :key="tab.id" :name="tab.id">
        <span slot="label" class="tab-name">{{tab.name}}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="search-box-right">
      <el-button
        style="float:right"
        class="exportBtn"
        type="default"
        size="small"
        icon="el-icon-upload2"
        @click="exportData"
      >导出</el-button>
    </div>
    <!---------------------------- 内容 ---------------------------->
    <div class="tab-content">
      <div class="base-search-table">
        <div class="search-box clearfix">
          <h3>总人数：{{allNum}}人</h3>
          <!---------------------------- 查询条件  ---------------------------->
          <div class="search-box-right">
            <span v-if="activeTab=='month'">
              <el-date-picker
                v-model="yearValue"
                type="year"
                placeholder="选择年"
                size="middle"
                value-format="yyyy"
                format="yyyy年"
                style="width:160px"
                @change="changeYear"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </span>
            <el-date-picker
              v-if="activeTab=='day'"
              v-model="dayValue"
              type="daterange"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              style="width:240px"
              placeholder="选择日期"
              @change="changeDay"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </div>
        <div class="left-div" v-if="tableData.length">
          <el-table
            :data="tableData"
            style="width:100%"
            header-row-class-name="table-header"
            v-loading="tableLoading"
            :row-style="{height:'10px'}"
            :cell-style="{padding:'20px 0px'}"
            empty-text=" "
            :default-sort="sortObj" 
          >
            <el-table-column prop="orderdate" label="日期" v-if="activeTab=='day'" key="vDay" sortable>
              <template
                slot-scope="scope"
              >{{ moment(scope.row.orderdate, "YYYYMMDDhhmmss").format("YYYY-MM-DD" ) }}</template>
            </el-table-column>
            <el-table-column prop="monthdate" label="月份" v-if="activeTab=='month'" sortable key="vMonth">
              <template slot-scope="scope">{{ scope.row.monthdate}}</template>
            </el-table-column>
            <el-table-column prop="yeardate" label="年份" v-if="activeTab=='year'" key="vYear" sortable>
              <template slot-scope="scope">{{ scope.row.yeardate+"年" }}</template>
            </el-table-column>
            <el-table-column prop="username" label="入馆人数" sortable>
              <template slot-scope="scope">
                <i>{{scope.row.num}}人</i>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="上座率（%）" show-overflow-tooltip>
              <template slot-scope="scope">
                <i>{{common.toPercent(scope.row.szl)}}</i>
              </template>
            </el-table-column>
          </el-table>
          <!---------------------------- 分页 ---------------------------->
          <!-- <div class="pagination-box" v-if="tableData.length >10 ">
            <el-pagination
              background
              :hide-on-single-page="true"
              layout="total, prev, pager, next,jumper"
              :total="tableData.length"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="page => {urrentPage = page}"
              @size-change="size => {pageSize = size; currentPage = 1;}"
            ></el-pagination>
          </div> -->
          <!---------------------------- 无数据 ---------------------------->
        </div>
        <!--为echarts准备一个具备大小的容器dom -->
        <div class="right-div" v-show="tableData.length ">
          <h4 class="h4-title">入馆人次曲线图</h4>
          <div id="allVisitor" style="height:650px;width:100%;"></div>
        </div>
      </div>
      <div class="nodata" v-if="tableData.length == 0">
        <img src="@/assets/img/nofind.png" alt />
        <p>暂无统计信息</p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  queryByDate,
  queryByMonth,
  queryByYear
} from "@/api/manage/person-statistic";
import { fetchNotice } from "@/api/manage/notice";
import * as echarts from "echarts";
export default {
  components: {},
  data() {
    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    let startStr = this.moment(start).format("yyyy-MM-DD");
    let endStr = this.moment(end).format("yyyy-MM-DD");
    let dayForX = this.common.getRangeDay(start, end);
    return {
      activeTab: "day",
      yearValue: this.moment().format("YYYY"),
      monthvalue: "",
      dayValue: [startStr, endStr],
      tabList: [
        {
          id: "day",
          name: "日期"
        },
        {
          id: "month",
          name: "月份"
        },
        {
          id: "year",
          name: "年份"
        }
      ],
      tableLoading: false,
      tableData: [],
      keyword: "",
      total: 0,
      pageSize: 10,
      currentPage: 1,
      chart: null,
      chartOptions: {},
      xData: dayForX,
      yData: [],
      choiceDate0: "",
      pickerOptions: {
        // 设置不能选择的日期
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate0 = minDate.getTime();
          if (maxDate) {
            this.choiceDate0 = "";
          }
        },
        disabledDate: time => {
          let choiceDateTime = new Date(this.choiceDate0).getTime();
          const minTime = new Date(choiceDateTime).setMonth(
            new Date(choiceDateTime).getMonth() - 6
          );
          const maxTime = new Date(choiceDateTime).setMonth(
            new Date(choiceDateTime).getMonth() + 6
          );
          const min = minTime;
          const newDate =
            new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1;
          const max = newDate < maxTime ? newDate : maxTime;
          //如果已经选中一个日期 则 返回 该日期前后一个月时间可选
          if (this.choiceDate0) {
            return time.getTime() < min || time.getTime() > max;
          }
          //若一个日期也没选中 则 返回 当前日期以前日期可选
          return time.getTime() > newDate;
        },
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    allNum() {
      let sum = 0;
      this.tableData.forEach(row => {
        sum = sum + row.num;
      });
      return sum;
    },
    sortObj() {
      if (this.activeTab === 'day') {
        return {prop: 'orderdate', order: 'descending'}
      } else if(this.activeTab === 'month') {
        return {prop: 'monthdate', order: 'descending'}
      } else {
        return {prop: 'yeardate', order: 'descending'}
      }
    }
  },
  created() {
    this.getTableData();
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
  },
  mounted() {
    this.chart = echarts.init(document.getElementById("allVisitor"));
  },
  methods: {
    // 导出
    exportData() {
      let yearurl = `${window.g.url}/dataPerson/exportQueryByYear`;
      let monthurl = `${window.g.url}/dataPerson/exportQueryByMonth`;
      let dayurl = `${window.g.url}/dataPerson/exportQueryByDate`;
      let sectionid = "",
        query;
      if (this.activeTab == "year") {
        query = `?sectionid=${sectionid}`;
        window.open(yearurl + query, "_blank");
      }
      if (this.activeTab == "month") {
        query = `?sectionid=${sectionid}&year=${this.yearValue}`;
        window.open(monthurl + query, "_blank");
      }
      if (this.activeTab == "day") {
        let start = this.dayValue
          ? this.moment(this.dayValue[0]).format("yyyyMMDD")
          : "";
        let end = this.dayValue
          ? this.moment(this.dayValue[1]).format("yyyyMMDD")
          : "";
        query = `?sectionid=${sectionid}&starttime=${start}&endtime=${end}`;
        window.open(dayurl + query, "_blank");
      }
    },
    changeYear() {
      this.getTableData();
    },
    changeMonth() {
      this.xData = [this.monthValue];
      this.getTableData();
    },
    changeDay() {
      let start = this.dayValue ? this.common.getDate(this.dayValue[0]) : "";
      let end = this.dayValue ? this.common.getDate(this.dayValue[1]) : "";
      let dayForX = start && end ? this.common.getRangeDay(start, end) : [];
      this.xData = dayForX;
      this.getTableData();
    },
    // 切换tab
    handleClick(tab, event) {
      this.getTableData();
    },

    getDataByYear() {
      this.tableLoading = true;
      let data = {
        sectionid: ""
      };
      queryByYear(data).then(res => {
        this.tableLoading = false;
        let dataList = res.data;
        this.tableData = res.data;
        let yearArr = dataList.map(v => v.yeardate);
        let numArr = dataList.map(v => v.num);
        this.xData = yearArr;
        this.yData = numArr;
        this.initCharts(this.xData, this.yData);
      });
    },

    getDataByMonth() {
      this.tableLoading = true;
      let data = {
        sectionid: "",
        year: this.yearValue
      };
      queryByMonth(data).then(res => {
        this.tableLoading = false;
        let dataList = res.data;
        // dataList.forEach(x => {
        //   dataList.forEach(y => {
        //     if(x.monthdate > y.monthdate) {
        //       let tmp = x;
        //       x = y;
        //       y = tmp;
        //     }
        //   })
        // })
        dataList.forEach(item => {
          let mm = this.moment(item.monthdate, "YYYYMMDDhhmmss").format("M月");
          item.monthdate = mm;
        });
        this.tableData = dataList;
        let monthArr = dataList.map(v => v.monthdate);
        let numArr = dataList.map(v => v.num);
        this.xData = monthArr;
        this.yData = numArr;
        this.initCharts(this.xData, this.yData);
      });
    },

    getDataByDate() {
      let start = this.dayValue
        ? this.moment(this.dayValue[0]).format("yyyyMMDD")
        : "";
      let end = this.dayValue
        ? this.moment(this.dayValue[1]).format("yyyyMMDD")
        : "";
      this.tableLoading = true;
      let data = {
        sectionid: "",
        starttime: start,
        endtime: end
      };
      queryByDate(data).then(res => {
        this.tableLoading = false;
        let dataList = res.data;
        dataList.forEach(item => {
          let day = this.moment(item.orderdate, "YYYYMMDDhhmmss").format(
            "MM-DD"
          );
          item.day = day;
        });
        this.tableData = dataList;
        let monthArr = dataList.map(v => v.day);
        let numArr = dataList.map(v => v.num);
        this.xData = monthArr;
        this.yData = numArr;
        this.total = res.total;
        this.initCharts(this.xData, this.yData);
      });
    },

    getTableData(page, pageSize) {
      if (this.activeTab == "year") {
        this.getDataByYear();
      }
      if (this.activeTab == "month") {
        this.getDataByMonth();
      }
      if (this.activeTab == "day") {
        this.getDataByDate();
      }
    },
    // 初始化图表
    initCharts(xAxisData, seriesData) {
      let that = this;
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(255,255,255,0.95)",
          padding: [5, 12],
          axisPointer: {
            type: "line",
            lineStyle: {
              color: "#000000",
              opacity: 0.1,
              width: 1
            }
          },
          formatter(value) {
            let name = value[0].name;
            if (that.activeTab == "year") {
              name = `${name}年`;
            }
            if (that.activeTab == "month") {
              name = `${that.moment().format("YYYY年")}${name}`;
            }
            if (that.activeTab == "day") {
              name = `${that.moment().format("YYYY-")}${name}`;
            }

            let str = name + "<br/>";
            value.forEach(item => {
              if (item.seriesType == "line") {
                str += item.marker + item.data + "人";
              }
            });
            return str;
          },
          textStyle: {
            fontSize: 12,
            lineHeight: 30,
            color: "#000000"
          },
          extraCssText:
            "box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);"
        },
        grid: {
          left: "20px",
          right: "20px",
          bottom: "20px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            color: "#999999",
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: "rgba(65,97,128,0.45)"
            }
          },
          axisPointer: {
            label: {
              color: "#cccccc",
              fontWeight: "bold"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#999999",
            fontSize: 12
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#e2e2e2"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#e2e2e2"
            }
          }
        },
        series: [
          {
            data: seriesData,
            type: "line",
            itemStyle: {
              color: "#3A78FC"
            }
          }
        ]
      });
      this.$nextTick(() => {
        this.chart.resize();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  position: relative;
}
/deep/.el-tabs__item {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}
/deep/.el-tabs__header {
  margin: 0px;
}

.tab-content {
  position: relative;
  min-height: 500px;
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

.base-search-table {
  position: relative;
  .el-table {
    padding: 0 0px 16px 0 !important;
  }
}
.left-div {
  width: 40%;
  float: left;
  background: #fff;
}
.right-div {
  width: 58%;
  margin-right: 2px;
  margin-bottom: 2px;
  float: right;
  box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.2);
  border-radius: 4px;
  padding-top: 24px;
  padding-left: 24px;
  background: #fff;
  .h4-title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 16px;
  }
}

.search-box {
  padding: 0px !important;
  h3 {
    font-size: 18px !important;
    line-height: 40px !important;
  }
  .search-box-left {
    float: left;
  }
  label {
    color: #5f6464;
  }
  .tips {
    margin-left: 10px;
    color: rgba(0, 0, 0, 0.65);
  }
}

.pagination-box {
  margin-top: 24px;
}
.exportBtn {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
