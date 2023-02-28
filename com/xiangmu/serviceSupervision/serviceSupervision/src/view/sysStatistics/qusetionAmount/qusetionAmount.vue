<template>
  <div class="statistic-box">
    <div class="count-box" v-loading="loading">
      <div class="count-box-title">
        <span>提问量总计</span>
      </div>
      <div class="count-box-content clearfix">
        <div class="num-box">
          <label>提问总量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.all" :duration="1000"></countTo>
        </div>
        <div class="num-box no-border">
          <label>今日提问</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.today" :duration="1000"></countTo>
            <span style="margin-left:6px;">昨日提问 {{totalData.yesterday}}</span>
          </p>
        </div>
        <div class="num-box">
          <label>本月提问</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.month" :duration="1000"></countTo>
            <span style="margin-left:6px;">上月提问 {{totalData.lastmonth}}</span>
          </p>
        </div>
        <div class="num-box no-border">
          <label>本年提问</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.year" :duration="1000"></countTo>
            <span style="margin-left:6px;">去年提问 {{totalData.lastyear}}</span>
          </p>
        </div>
      </div>
    </div>
    <!---------------------------- 趋势分析 ---------------------------->
    <div class="count-box" v-loading="timeLoading">
      <div class="count-box-title">
        <span>提问量趋势分析</span>
        <div class="right-btns">
          <el-select v-model="timeType" style="width:80px;" @change="time = null">
            <el-option value="year" label="按年">按年</el-option>
            <el-option value="month" label="按月">按月</el-option>
          </el-select>
          <el-date-picker
            v-if="timeType==='year'"
            v-model="time"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
            format="yyyy年"
            clearable
            suffix-icon="el-icon-arrow-up"
            style="width:140px;"
            @change="getTimeData"
          ></el-date-picker>
          <el-date-picker
            v-if="timeType==='month'"
            v-model="time"
            type="month"
            placeholder="选择月"
            value-format="yyyyMM"
            format="yyyy年MM月"
            style="width:140px;"
            clearable
            @change="getTimeData"
          ></el-date-picker>
          <span @click="exportTimeData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content" style="padding-top:5px;">
        <el-tabs v-model="activeTab" @tab-click="handleClick" class="chart-tab">
          <el-tab-pane v-for="tab in allDeptList" :key="tab.ID" :label="tab.NAME" :name="tab.ID"></el-tab-pane>
        </el-tabs>
        <p>提问量变化趋势</p>
        <!---------------------------- 曲线图 ---------------------------->
        <div id="charts" style="height:450px;width:100%;"></div>
      </div>
    </div>
    <!---------------------------- 各单位提问量对比 ---------------------------->
    <div class="count-box" v-loading="deptLoading">
      <div class="count-box-title">
        <span>各业务领域提问量对比分析</span>
        <div class="right-btns">
          <el-date-picker
            v-model="deptTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            format="yyyy-MM-dd"
            style="width:280px;"
            @change="getDeptData"
          ></el-date-picker>
          <span @click="exportDeptData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <p>提问量对比</p>
        <!---------------------------- 柱形图 ---------------------------->
        <div id="deptCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
      </div>
    </div>
    <!---------------------------- 最关注后勤人员排行 ---------------------------->
    <div class="count-box" v-loading="peopleLoading">
      <div class="count-box-title">
        <span>最关注后勤人员排行</span>
        <div class="right-btns">
          <el-date-picker
            v-model="peopleTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            format="yyyy-MM-dd"
            style="width:280px;"
            @change="getPeopleData"
          ></el-date-picker>
          <!-- <span @click="exportDeptData">
            <i class="el-icon-upload2"></i>导出数据
          </span> -->
        </div>
      </div>
      <div class="count-box-content">
        <p>提问量对比</p>
        <!---------------------------- 柱形图 ---------------------------->
        <div id="peopleCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import countTo from "vue-count-to";
export default {
  components: {
    countTo
  },
  data() {
    return {
      loading: false,
      totalData: {
        all: 0,
        today: 0,
        yesterday: 0,
        month: 0,
        lastmonth: 0,
        year: 0,
        lastyear: 0
      },
      // 趋势数据
      activeTab: "all",
      activeTabName: "提问总量",
      timeLoading: false,
      timeType: "month",
      time: moment().format("yyyyMM"),
      chart: null,
      chartOptions: {},
      // 部门数据
      deptLoading: false,
      deptTime: null,
      deptChart: null,
      deptChartOptions: {},
      // 关注人员数据
      peopleLoading: false,
      peopleTime: null,
      peopleChart: null,
      peopleChartOptions: {}
    };
  },
  computed: {
    // 单位列表
    deptList() {
      return this.$store.state.departments;
    },
    // 单位列表 + 总量
    allDeptList() {
      let arr = [
        {
          ID: "all",
          NAME: "提问总量"
        }
      ];
      return arr.concat(this.deptList);
    },
  },
  watch: {
    deptList: {
      handler: function(val) {
        if (val.length > 0) {
          this.getTimeData();
          this.getDeptData();
          this.getPeopleData();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 切换tab
    handleClick(tab) {
      this.activeTabName = this.allDeptList[tab.index].NAME;
      this.getTimeData();
    },
    // 导出趋势数据
    exportTimeData() {
      let url = `${window.g.url}dataAmounts/exportAmountsBottom`;
      let query = `?timetype=${this.timeType}&time=${this.time}`;
      window.open(url + query, "_blank");
    },
    // 导出部门数据
    exportDeptData() {
      let url = `${window.g.url}dataAmounts/exportAmountDeptsVs`;
      let starttime = this.deptTime ? this.deptTime[0] : "";
      let endtime = this.deptTime ? this.deptTime[1] : "";
      let query = `?starttime=${starttime}&endtime=${endtime}`;
      window.open(url + query, "_blank");
    },

    // 初始化图表
    initCharts() {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chart.setOption(this.chartOptions);
    },

    // 初始化单位图表
    initDeptCharts() {
      this.deptChart = echarts.init(document.getElementById("deptCharts"));
      this.deptChartOptions.legend.itemHeight = 10;
      this.deptChart.setOption(this.deptChartOptions);
    },

    
    // 初始化人员图表
    initPeopleCharts() {
      this.peopleChart = echarts.init(document.getElementById("peopleCharts"));
      this.peopleChartOptions.legend.itemHeight = 10;
      this.peopleChart.setOption(this.peopleChartOptions);
    },

    // 获取总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataAmounts/amountsTop"
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              this.totalData[i.timetype] = parseInt(i.num);
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 获取趋势数据
    getTimeData() {
      this.timeLoading = true;
      let param = {
        timetype: this.timeType,
        time: this.time
      };
      if (this.activeTab !== "all") {
        param.handledeptid = this.activeTab;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataAmounts/amountsBottom",
          data: param
        })
        .then(res => {
          this.timeLoading = false;
          if (res.success) {
            let data = res.data || [];
            // 设置表格数据
            let header = data.header || [];
            let body = data.body || [];
            body.forEach(i => {
              i.forEach((j, index) => {
                if (index > 0) {
                  i[index] = j;
                }
              });
            });
            let tableData = this.common.setTableData(header, body);
            // 当前tab所在的index
            let curIndex = header.findIndex(i => i == this.activeTabName);
            // 设置legendData
            let legendData = header.filter((i, index) => index == curIndex);
            // 设置横坐标Data
            let xAxisData = body.map(i => i[0]);
            // 设置系列Data
            let seriesData = this.common.setSeriesData(
              legendData,
              tableData.data,
              "line",
              true
            );
            // 设置图表配置项
            this.chartOptions = this.common.setOptions(
              [],
              xAxisData,
              seriesData
            );
            this.initCharts();
          }
        })
        .catch(err => {
          this.timeLoading = false;
        });
    },

    // 获取单位数据
    getDeptData() {
      this.deptLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataAmounts/amountDeptsVs",
          data: {
            starttime: this.deptTime ? this.deptTime[0] : null,
            endtime: this.deptTime ? this.deptTime[1] : null
          }
        })
        .then(res => {
          this.deptLoading = false;
          if (res.success) {
            let data = res.data || [];
            let arr = [];
            this.deptList.forEach(dept => {
              let obj = {
                handledeptid: dept.ID,
                handledeptname: dept.NAME,
                num: 0
              };
              data.forEach(i => {
                if (dept.ID == i.handledeptid) {
                  obj.num = i.num;
                }
              });
              arr.push(obj);
            });
            // 设置legendData
            let legendData = [];
            // 设置横坐标Data
            let xAxisData = arr.map(i => i.handledeptname);
            // 设置系列Data
            let seriesData = [
              {
                name: "提问量",
                type: "bar",
                barMaxWidth: 50,
                itemStyle: {
                  color: "#3A78FC"
                },
                labelLine: {
                  show: true
                },
                label: {
                  show: true,
                  position: "top"
                },
                data: arr.map(i => i.num)
              }
            ];
            // 设置图表配置项
            this.deptChartOptions = this.common.setOptions(
              legendData,
              xAxisData,
              seriesData
            );
            this.initDeptCharts();
          }
        })
        .catch(err => {
          this.deptLoading = false;
        });
    },

    
    // 获取人员数据
    getPeopleData() {
      this.peopleLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/rankingTop20",
          data: {
            starttime: this.peopleTime ? this.peopleTime[0] : null,
            endtime: this.peopleTime ? this.peopleTime[1] : null
          }
        })
        .then(res => {
          this.peopleLoading = false;
          if (res.success) {
            let data = res.data || [];
            let arr = data;
            // 设置legendData
            let legendData = [];
            // 设置横坐标Data
            let xAxisData = arr.map(i => i.applyername);
            // 设置系列Data
            let seriesData = [
              {
                name: "提问量",
                type: "bar",
                barMaxWidth: 50,
                itemStyle: {
                  color: "#3A78FC"
                },
                labelLine: {
                  show: true
                },
                label: {
                  show: true,
                  position: "top"
                },
                data: arr.map(i => i.num)
              }
            ];
            // 设置图表配置项
            this.peopleChartOptions = this.common.setOptions(
              legendData,
              xAxisData,
              seriesData
            );
            this.initPeopleCharts();
          }
        })
        .catch(err => {
          this.peopleLoading = false;
        });
    }
  },
  created() {
    this.getTotalData();
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize();
      }
      if (this.deptChart) {
        this.deptChart.resize();
      }
      if (this.peopleChart) {
        this.peopleChart.resize();
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.no-border {
  border: none !important;
}
</style>
<style lang="scss">
.chart-tips {
  p {
    font-size: 12px;
    text-align: left !important;
  }
}
</style>