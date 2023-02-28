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
        <!-- <el-tabs v-model="activeTab" @tab-click="handleClick" class="chart-tab">
          <el-tab-pane v-for="tab in deptList" :key="tab.ID" :label="tab.NAME" :name="tab.ID"></el-tab-pane>
        </el-tabs>-->
        <p>报修量变化趋势</p>
        <!---------------------------- 曲线图 ---------------------------->
        <div id="charts" style="height:450px;width:100%;"></div>
      </div>
    </div>
    <!---------------------------- 各维修单位报修量对比 ---------------------------->
    <div class="count-box" v-loading="deptLoading">
      <div class="count-box-title">
        <span>各维修单位报修量对比分析</span>
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
            @change="getDeptRepairData"
          ></el-date-picker>
          <span @click="exportDeptData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <p>报修量对比</p>
        <!---------------------------- 柱形图 ---------------------------->
        <div id="deptCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
      </div>
    </div>
    <!---------------------------- 各维修单位未办理量对比 ---------------------------->
    <div class="count-box" v-loading="deptWblLoading">
      <div class="count-box-title">
        <span>各维修单位未办理量对比分析</span>
        <div class="right-btns">
          <span @click="exportDeptWblData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <el-row>
          <el-col :span="16">
            <p>未办理量对比</p>
            <!---------------------------- 柱形图 ---------------------------->
            <div id="deptWblCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
          </el-col>
          <el-col :span="8">
            <p>未办理排行TOP10</p>
            <!---------------------------- 柱形图 ---------------------------->
            <div id="wblRankCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
          </el-col>
        </el-row>
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
        bxzl: 0,
        wsbxzl: 0,
        dhbxzl: 0,
        lastmonth: 0,
        blzl: 0,
        wblzl: 0
      },
      // activeTab: null,
      // 方式数据
      typeLoading: false,
      timeType: "month",
      time: moment().format("yyyyMM"),
      chart: null,
      chartOptions: {},
      // 部门数据
      deptLoading: false,
      deptTime: null,
      deptChart: null,
      deptChartOptions: {},
      // 未办理数据
      deptWblLoading: false,
      deptWblChart: null,
      deptWblChartOptions: {},
      // 未办理排行10
      wblRankData: [],
      wblRankChart: null,
      wblRankChartOptions: {}
    };
  },
  computed: {
    // 维修单位列表
    deptList() {
      return this.$store.state.deptList;
    }
  },
  watch: {
    deptList: {
      handler: function(val) {
        if (val.length > 0) {
          this.getDeptRepairData();
          this.getDetpWblData();
          this.getWblRank();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 切换tab
    handleClick() {
      this.getRepairTypeData();
    },
    // 导出报修方式数据
    exportTypeData() {
      let url = `${window.g.url}dataApply/exportBxfsqsfx`;
      let query = `?timetype=${this.timeType}&time=${this.time}`;
      window.open(url + query, "_blank");
    },
    // 导出部门数据
    exportDeptData() {
      let url = `${window.g.url}dataApply/exportGwxdwbxldbfx`;
      let starttime = this.deptTime ? this.deptTime[0] : "";
      let endtime = this.deptTime ? this.deptTime[1] : "";
      let query = `?starttime=${starttime}&endtime=${endtime}`;
      window.open(url + query, "_blank");
    },
    // 导出部门未办理数据
    exportDeptWblData() {
      let url = `${window.g.url}dataApply/exportGwxdwwblldbfx`;
      window.open(url, "_blank");
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

    // 初始化单位未办理图表
    initDeptWblCharts() {
      this.deptWblChart = echarts.init(
        document.getElementById("deptWblCharts")
      );
      this.deptWblChartOptions.legend.itemHeight = 10;
      this.deptWblChart.setOption(this.deptWblChartOptions);
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
          url: "dataApply/bxlzj"
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
            time: this.time
          }
        })
        .then(res => {
          this.typeLoading = false;
          if (res.success) {
            let data = res.data || [];
            // 设置表格数据
            let header = data.header || [];
            let body = data.body || [];
            let tableData = this.common.setTableData(header, body);
            // 设置legendData
            let legendData = ["网上报修", "电话报修"];
            // 设置横坐标Data
            let xAxisData = body.map(i => i[0]);
            // 设置系列Data
            let seriesData = this.common.setSeriesData(
              legendData,
              tableData.data,
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

    // 获取维修单位报修数据
    getDeptRepairData() {
      this.deptLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataApply/gwxdwbxldbfx",
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
                repairdeptid: dept.ID,
                repairdeptname: dept.NAME,
                "报修量": 0,
                "办理量": 0
              };
              data.forEach(i => {
                if (dept.ID == i.repairdeptid) {
                  if (i.type == "bxl") {
                    obj["报修量"] = i.num;
                  } else {
                    obj["办理量"] = i.num;
                  }
                }
              });
              arr.push(obj);
            });
            // 设置legendData
            let legendData = ["报修量", "办理量"];
            // 设置横坐标Data (去重)
            let xAxisData = [...new Set(arr.map(i => i.repairdeptname))];
            // 设置系列Data
            let seriesData = this.common.setBarSeriesData(
              legendData,
              arr,
              "bar",
              true
            );
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

    // 获取维修单位未办理数据
    getDetpWblData() {
      this.deptWblLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataApply/gwxdwwblldbfx"
        })
        .then(res => {
          this.deptWblLoading = false;
          if (res.success) {
            let data = res.data || [];
            let arr = [];
            this.deptList.forEach(dept => {
              let obj = {
                repairdeptid: dept.ID,
                repairdeptname: dept.NAME,
                num: 0
              };
              data.forEach(i => {
                if (dept.ID == i.repairdeptid) {
                  obj.num = i.num;
                }
              });
              arr.push(obj);
            });
            // 设置legendData
            let legendData = [];
            // 设置横坐标Data
            let xAxisData = arr.map(i => i.repairdeptname);
            // 设置系列Data
            let seriesData = [
              {
                name: "未办理量",
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
            this.deptWblChartOptions = this.common.setOptions(
              legendData,
              xAxisData,
              seriesData
            );
            this.initDeptWblCharts();
          }
        })
        .catch(err => {
          this.deptWblLoading = false;
        });
    },

    // 获取未办理排行TOP10
    getWblRank() {
      this.deptWblLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataApply/wblphTop10"
        })
        .then(res => {
          this.deptWblLoading = false;
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              let obj =
                this.deptList.filter(j => j.ID == i.repairdeptid)[0] || {};
              i.repairdeptname = obj.NAME || null;
              i.days = parseFloat((i.wbltime / 60 / 24).toFixed(1));
            });
            // data = data.filter(i => i.repairdeptname);
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
                },
                {
                  type: "category",
                  boundaryGap: false,
                  data: data.map(i => i.repairdeptname),
                  axisLabel: {
                    color: "#999999",
                    fontSize: 12
                  },
                  axisLine: {
                    show: false
                  },
                  axisTick: {
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
          this.deptWblLoading = false;
        });
    }
  },
  created() {
    this.getTotalData();
    this.getRepairTypeData();
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize();
      }
      if (this.deptChart) {
        this.deptChart.resize();
      }
      if (this.deptWblChart) {
        this.deptWblChart.resize();
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.num-box {
  width: 20% !important;
}
.no-border {
  border: none !important;
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