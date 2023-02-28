<template>
  <div>
    <el-tabs class="card-tabs" v-model="activeTab" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="tab in userDeptList" :key="tab.ID" :label="tab.NAME" :name="tab.ID"></el-tab-pane>
    </el-tabs>
    <div class="statistic-box">
      <div class="count-box" v-loading="loading">
        <div class="count-box-title">
          <span>回复总计</span>
        </div>
        <div class="count-box-content clearfix">
          <div class="num-box">
            <label>提问总量</label>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.all" :duration="1000"></countTo>
          </div>
          <div class="num-box">
            <label>已回复数</label>
            <p>
              <countTo class="counttospan" :startVal="0" :endVal="totalData['1']" :duration="1000"></countTo>
              <span style="margin-left:6px;">今日回复 {{totalData['1today']}}</span>
            </p>
          </div>
          <div class="num-box">
            <label>未回复数</label>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.noreply" :duration="1000"></countTo>
          </div>
          <div class="num-box" style="border:none;">
            <label>平均回复时长</label>
            <p>
              <countTo
                class="counttospan"
                :startVal="0"
                :decimals="1"
                :endVal="totalData.time"
                :duration="1000"
              ></countTo>
              <span style="margin-left:6px;">天</span>
            </p>
          </div>
        </div>
      </div>

      <el-row>
          <!---------------------------- 趋势 ---------------------------->
          <div class="count-box flex-div" v-loading="timeLoading">
            <div class="count-box-title left-title">
              <span>回复时长趋势分析</span>
              <div class="right-btns" style="margin-top: 0px;">
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
                <span @click="exportTimeData">
                  <i class="el-icon-upload2"></i>导出数据
                </span>
              </div>
            </div>
          <!---------------------------- 趋势 ---------------------------->
            <div class="count-box-title flex-div">
              <span>未回复排行TOP10</span>
              <div class="right-btns" style="margin-top: 0px;">
                <el-date-picker
                v-model="areaTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyyMMdd"
                format="yyyy-MM-dd"
                style="width:280px;"
                @change="getAreaData"
              ></el-date-picker>
              </div>
            </div>
          </div>
      </el-row>
      <el-row>
        <el-col :span="16">
          <div class="count-box" v-loading="timeLoading">
          <div class="count-box-content">
              <p>平均回复时长变化趋势（天）</p>
              <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="count-box" v-loading="timeLoading">
          <div class="count-box-content">
              <p>未回复排行TOP10</p>
              <!---------------------------- 柱形图 ---------------------------->
              <div id="whfRankCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
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
      areaTime: null,
      loading: false,
      totalData: {
        all: 0,
        "1": 0,
        "1today": 0,
        noreply: 0,
        time: 0
      },
      totalTable: [],
      // 时长对比
      activeTab: "all",
      activeTabName: "总量",
      timeLoading: false,
      timeType: "year",
      time: new Date().getFullYear().toString(),
      chart: null,
      chartOptions: {},
      tableData: [],
      // 未回复数据
      deptWhfLoading: false,
      deptWhfChart: null,
      deptWhfChartOptions: {},
      // 未回复排行10
      whfRankData: [],
      whfRankChart: null,
      whfRankChartOptions: {}
    };
  },
  computed: {
    userDeptList() {
      return this.$store.state.userInfo.userOrgId;
    }
  },
  watch: {
    userDeptList: {
      handler: function(val) {
        if (val.length > 0) {
          this.activeTab = val[0].ID;
          this.activeTabName = val[0].NAME;
          this.getTotalData();
          this.getTimeData();
          this.getWhfRank();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取区域数据
    getAreaData() {
      this.getWhfRank();
      this.getTimeData();
    },
    // 切换tab
    handleClick(tab) {
      this.activeTabName = this.userDeptList[tab.index].NAME;
      this.getTotalData();
      this.getTimeData();
      this.getWhfRank();
    },
    // 导出时长数据
    exportTimeData() {
      let url = `${window.g.url}dataReply/exportDeptOneBottom`;
      let query = `?timetype=${this.timeType}&time=${this.time}&handledeptid=${this.activeTab}`;
      window.open(url + query, "_blank");
    },
    // 初始化图表
    initCharts() {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chart.setOption(this.chartOptions);
    },
    // 初始化未回复排行图表
    initWhfRankCharts() {
      this.whfRankChart = echarts.init(
        document.getElementById("whfRankCharts")
      );
      this.whfRankChartOptions.legend.itemHeight = 10;
      this.whfRankChart.setOption(this.whfRankChartOptions);
    },
    // 获取总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataReply/topAll",
          data: {
            handledeptid: this.activeTab
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              if (i.isreply == "time") {
                this.totalData.time = i.avgtime;
              } else {
                this.totalData[i.isreply + i.timetype] = parseInt(i.num);
              }
            });
            this.totalData.noreply = this.totalData.all - this.totalData["1"];
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取时长数据
    getTimeData() {
      this.timeLoading = true;
      let param = {
        timetype: this.timeType,
        time: this.time,
        handledeptid: this.activeTab,
        starttime: this.areaTime ? this.areaTime[0] : undefined,
        endtime: this.areaTime ? this.areaTime[1] : undefined,
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataReply/deptOneBottom",
          data: param
        })
        .then(res => {
          this.timeLoading = false;
          if (res.success) {
            let data = res.data || [];
            // 设置表格数据
            let header = data.header || [];
            let body = data.body || [];
            this.tableData = this.common.setTableData(header, body);
            // 设置legendData
            let legendData = ["平均处理时长"];
            // 设置横坐标Data
            let xAxisData = body.map(i => i[0]);
            // 设置系列Data
            let seriesData = this.common.setSeriesData(
              legendData,
              this.tableData.data,
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

    // 获取未办理排行TOP10
    getWhfRank() {
      this.deptWhfLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataReply/whfTop10",
          data: {
            handledeptid: this.activeTab,
            starttime: this.areaTime ? this.areaTime[0] : undefined,
            endtime: this.areaTime ? this.areaTime[1] : undefined,
          }
        })
        .then(res => {
          this.deptWhfLoading = false;
          if (res.success) {
            let data = res.data || [];
            data.sort((a, b) => {
              return a.whftime > b.whftime ? 1 : -1;
            });
            this.whfRankData = data;
            this.whfRankChartOptions = {
              tooltip: {
                trigger: "axis",
                backgroundColor: "rgba(255,255,255,0.95)",
                padding: [5, 12],
                formatter: params => {
                  let data = this.whfRankData[params[0].dataIndex];
                  let htmlText = `<div class="chart-tips"><p style="color:rgba(0,0,0,0.45);">${this.common.timeFormat(
                    data.createtime
                  )}</p><p>${data.title}</p><p>${data.content}</p></div>`;
                  return htmlText;
                },
                axisPointer: {
                  type: "line",
                  lineStyle: {
                    color: "#000000",
                    opacity: 0.1,
                    width: 1
                  }
                },
                textStyle: {
                  fontSize: 12,
                  lineHeight: 30,
                  color: "#000000"
                },
                extraCssText:
                  "box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);"
              },
              legend: {
                show: false
              },
              grid: {
                containLabel: true,
                show: false
              },
              xAxis: {
                show: false,
                type: "value",
                boundaryGap: [0, 0]
              },
              yAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: data.map(i =>
                    this.common.timeFormat(i.createtime, "YYYY-MM-DD")
                  ),
                  axisLabel: {
                    color: "#999999",
                    fontSize: 12
                  },
                  axisLine: {
                    show: false
                  },
                  splitLine: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  type: "bar",
                  itemStyle: {
                    color: "#5B8FF9"
                  },
                  barMaxWidth: 50,
                  label: {
                    show: true,
                    formatter: "{c}天",
                    position: "insideLeft"
                  },
                  data: data.map(i => i.whftime)
                }
              ]
            };
            this.initWhfRankCharts();
          }
        })
        .catch(err => {
          this.deptWhfLoading = false;
        });
    }
  },
  created() {
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize();
      }
      if (this.whfRankChart) {
        this.whfRankChart.resize();
      }
    };
  }
};
</script>

<style lang="scss">
.chart-tips {
  max-width: 500px;
  p {
    font-size: 12px;
    text-align: left !important;
    white-space: normal;
    line-height: 20px;
    margin-bottom: 5px;
  }
}
.flex-div {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  span {
    display: inline-block;
  }
  .left-title {
    flex-basis: 66.6%;
    // flex-grow: 2;
    justify-content: space-between;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
}
</style>