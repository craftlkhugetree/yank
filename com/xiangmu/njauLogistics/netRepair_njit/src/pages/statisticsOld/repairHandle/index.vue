<template>
  <div class="statistic-box" v-loading="loading">
    <div class="count-box">
      <div class="count-box-title">
        <span>报修处理总计</span>
      </div>
      <div class="count-box-content clearfix">
        <div class="num-box">
          <label>报修总量</label>
          <!-- <p>{{totalData.all}}</p> -->
          <countTo class="counttospan" :startVal='0' :endVal='totalData.all' :duration='1000'></countTo>
        </div>
        <div class="num-box">
          <label>处理结束量</label>
          <p>
            <!-- {{totalData.over}} -->
            <countTo class="counttospan" :startVal='0' :endVal='totalData.over' :duration='1000'></countTo>

            <span style="margin-left:6px;">今日处理结束 {{totalData.todayOver}}</span>
          </p>
        </div>
        <div class="num-box">
          <label>处理未结束量</label>
          <countTo class="counttospan" :startVal='0' :endVal='totalData.noOver' :duration='1000'></countTo>
          <!-- <p>{{totalData.noOver}}</p> -->
        </div>
        <div class="num-box" style="border:none;">
          <label>平均处理时长</label>
          <p>
            <!-- {{totalData.avgtime}} -->
            <countTo class="counttospan" :startVal='0' :endVal='totalData.avgtime' :duration='1000'></countTo>
            <span style="margin-left:6px;">天</span>
          </p>
        </div>
      </div>
    </div>
    <div class="count-box">
      <div class="count-box-title">
        <span>处理时长趋势分析</span>
        <div class="right-btns">
          <!-- <el-select v-model="timeType" style="width:80px;">
            <el-option value="year" label="按年">按年</el-option>
            <el-option value="month" label="按月">按月</el-option>
          </el-select> -->
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
          <!-- <el-date-picker
            v-if="timeType==='month'"
            v-model="month"
            type="month"
            placeholder="选择月"
            value-format="yyyyMM"
            format="yyyy年MM月"
            style="width:140px;"
            clearable
          ></el-date-picker>-->
          <span @click="exportData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <p>平均处理时长变化趋势（天）</p>
        <!---------------------------- 曲线图 ---------------------------->
        <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
        <!---------------------------- 表格 ---------------------------->
        <p>处理时长变化详细</p>
        <div class="base-search-table">
          <!---------------------------- 表格 ---------------------------->
          <div class="table-content">
            <el-table
              :data="tableData.data"
              class="chart-table"
              header-row-class-name="table-header"
            >
              <el-table-column
                v-for="prop in tableData.header"
                :key="prop"
                :prop="prop"
                :label="prop"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import countTo from 'vue-count-to';
export default {
  components:{
    countTo
  },
  data() {
    return {
      loading: false,
      totalData: {
        all: 0,
        over: 0,
        todayOver: 0,
        noOver: 0,
        avgtime: 0
      },
      timeType: "year",
      time: new Date().getFullYear().toString(),
      chart: null,
      tableData: []
    };
  },
  computed: {
    // 用户部门
    userDept() {
      return this.$store.state.userDept;
    },
    xAxisData() {
      let arr = this.chartData.map(i =>
        this.common.timeFormat(i.date + "01", "M月")
      );
      return arr;
    }
  },
  watch: {
    userDept() {
      if (this.userDept.ID) {
        this.getTotalData();
        this.getTimeData();
      }
    }
  },
  methods: {
    // 导出数据
    exportData() {
      let url = `${window.g.url}dataHandle/exportDeptOneBottom`;
      let query = `?timetype=${this.timeType}&time=${this.time}&repairdeptid=${this.userDept.ID}`;
      window.open(url + query, "_blank");
    },

    // 初始化图表
    initCharts(legendData, xAxisData, seriesData) {
      this.chart = echarts.init(document.getElementById("charts"));
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
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#3A78FC"
                },
                {
                  offset: 1,
                  color: "#fff"
                }
              ]),
              opacity: 0.25
            }
          }
        ]
      });
    },

    // 设置seriesData
    setSeriesData(legendData, dataArr) {
      let name = legendData[0];
      let arr = [];
      dataArr.forEach(i => {
        arr.push(i[name]);
      });
      return arr;
    },

    // 获取报处理总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataHandle/topAll",
          data: {
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              if (i.isover == "all") {
                this.totalData.all = i.num;
              } else if (i.isover == "1") {
                if (i.timetype == "today") {
                  this.totalData.todayOver = i.num;
                } else {
                  this.totalData.over = i.num;
                }
              } else if (i.isover == "time") {
                this.totalData.avgtime = i.avgtime;
              }
            });
            this.totalData.noOver = this.totalData.all - this.totalData.over;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 获取处理时长数据
    getTimeData() {
      this.deptLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataHandle/deptOneBottom",
          data: {
            timetype: this.timeType,
            time: this.time,
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.deptLoading = false;
          if (res.success) {
            let data = res.data || [];
            // 设置表格数据
            let header = data.header || [];
            let body = data.body || [];
            this.tableData = this.common.setTableData(header, body);
            // 设置legendData
            let legendData = header.filter((i, index) => index > 0);
            // 设置横坐标Data
            let xAxisData = body.map(i => i[0]);
            // 设置系列Data
            let seriesData = this.setSeriesData(
              legendData,
              this.tableData.data
            );
            this.initCharts(legendData, xAxisData, seriesData);
          }
        })
        .catch(err => {
          this.deptLoading = false;
        });
    }
  },
  created() {
    if (this.userDept.ID) {
      this.getTotalData();
      this.getTimeData();
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
</style>