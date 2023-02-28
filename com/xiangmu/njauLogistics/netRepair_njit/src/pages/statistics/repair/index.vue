<template>
  <div class="statistic-box">
    <div class="count-box" v-loading="loading">
      <div class="count-box-title">
        <span>报修量总计</span>
      </div>
      <div class="count-box-content clearfix">
        <div class="num-box">
          <label>报修总量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.bxzl" :duration="1000"></countTo>
        </div>
        <div class="num-box no-border">
          <label>网上报修总量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.wsbxzl" :duration="1000"></countTo>
        </div>
        <div class="num-box">
          <label>电话报修总量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.dhbxzl" :duration="1000"></countTo>
        </div>
        <div class="num-box no-border">
          <label>办理总量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.blzl" :duration="1000"></countTo>
        </div>
        <div class="num-box">
          <label>未办理总量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.wblzl" :duration="1000"></countTo>
        </div>
      </div>
    </div>
    <el-row>
      <el-col :span="16">
        <!---------------------------- 报修方式趋势分析 ---------------------------->
        <div class="count-box" v-loading="typeLoading">
          <div class="count-box-title">
            <span>报修方式趋势分析</span>
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
                @change="getRepairTypeData"
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
                @change="getRepairTypeData"
              ></el-date-picker>
              <span @click="exportTypeData">
                <i class="el-icon-upload2"></i>导出数据
              </span>
            </div>
          </div>
          <div class="count-box-content">
            <p>报修方式变化趋势</p>
            <!---------------------------- 曲线图 ---------------------------->
            <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <!---------------------------- 未办理排行 ---------------------------->
        <div class="count-box" v-loading="wblRankLoading">
          <div class="count-box-title">
            <span style="padding-left:40px;">未办理排行TOP10</span>
          </div>
          <div class="count-box-content">
            <p>未办理排行TOP10</p>
            <div id="wblRankCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import echarts from "echarts/lib/echarts";
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
      loading: false,
      totalData: {
        bxzl: 0,
        wsbxzl: 0,
        dhbxzl: 0,
        lastmonth: 0,
        blzl: 0,
        wblzl: 0
      },
      // 方式数据
      typeLoading: false,
      timeType: "month",
      time: moment().format("yyyyMM"),
      chart: null,
      chartOptions: {},
      tableData: {},
      // 未办理数据
      wblRankLoading: false,
      wblRankData: [],
      WblRankChart: null,
      WblRankChartOptions: {}
    };
  },
  computed: {
    // 用户部门
    userDept() {
      return this.$store.state.userDept;
    }
  },
  watch: {
    userDept() {
      if (this.userDept.ID) {
        this.getTotalData();
        this.getRepairTypeData();
        this.getWblRank();
      }
    }
  },
  methods: {
    // 导出报修方式数据
    exportTypeData() {
      let url = `${window.g.url}dataApply/exportBxfsqsfx`;
      let query = `?timetype=${this.timeType}&time=${this.time}&repairdeptid=${this.userDept.ID}`;
      window.open(url + query, "_blank");
    },

    // 初始化图表
    initCharts(legendData, xAxisData, seriesData) {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chart.setOption(this.chartOptions);
    },
    // 初始化未办理10图表
    initWblRankCharts() {
      this.wblRankChart = echarts.init(
        document.getElementById("wblRankCharts")
      );
      this.wblRankChartOptions.legend.itemHeight = 10;
      this.wblRankChart.setOption(this.wblRankChartOptions);
    },

    // 获取报修量总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataApply/bxlzj",
          data: {
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              this.totalData[i.type] = parseInt(i.num);
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 获取报修方式数据
    getRepairTypeData() {
      this.typeLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataApply/bxfsqsfx",
          data: {
            timetype: this.timeType,
            time: this.time,
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.typeLoading = false;
          if (res.success) {
            let data = res.data || [];
            // 设置表格数据
            let header = data.header || [];
            let body = data.body || [];
            this.tableData = this.common.setTableData(header, body);
            // 设置legendData
            let legendData = header.filter((i, index) => index > 1);
            // 设置横坐标Data
            let xAxisData = body.map(i => i[0]);
            // 设置系列Data
            let seriesData = this.common.setSeriesData(
              legendData,
              this.tableData.data,
              "line"
            );
            // 设置图表配置项
            this.chartOptions = this.common.setOptions(
              legendData,
              xAxisData,
              seriesData
            );
            this.initCharts();
          }
        })
        .catch(err => {
          this.typeLoading = false;
        });
    },

    // 获取未办理排行TOP10
    getWblRank() {
      this.wblRankLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataApply/wblphTop10",
          data: {
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.wblRankLoading = false;
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              i.days = parseFloat((i.wbltime / 60 / 24).toFixed(1));
            });
            data.sort((a, b) => {
              return a.wbltime > b.wbltime ? 1 : -1;
            });
            this.wblRankData = data;
            this.wblRankChartOptions = {
              tooltip: {
                trigger: "axis",
                backgroundColor: "rgba(255,255,255,0.95)",
                padding: [5, 12],
                formatter: params => {
                  let data = this.wblRankData[params[0].dataIndex];
                  let htmlText = `<div class="chart-tips"><p style="color:rgba(0,0,0,0.45);">${this.common.timeFormat(
                    data.createtime
                  )}</p><p>${data.title}</p><p>${data.note}</p></div>`;
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
                  data: data.map(i => i.days)
                }
              ]
            };
            this.initWblRankCharts();
          }
        })
        .catch(err => {
          this.wblRankLoading = false;
        });
    }
  },
  created() {
    if (this.userDept.ID) {
      this.getTotalData();
      this.getRepairTypeData();
      this.getWblRank();
    }
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.num-box {
  width: 20% !important;
}
</style>
<style lang="scss">
.chart-tips {
  max-width: 450px;
  p {
    font-size: 12px;
    text-align: left !important;
    white-space: normal;
    line-height: 20px;
    margin-bottom: 5px;
  }
}
</style>