<template>
  <div class="statistic-box">
    <div class="count-box" v-loading="loading">
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
          <!-- <p>{{totalData.noOver}}</p> -->
          <countTo class="counttospan" :startVal='0' :endVal='totalData.noOver' :duration='1000'></countTo>

        </div>
        <div class="num-box" style="border:none;">
          <label>平均处理时长</label>
          <p>
            <!-- {{totalData.avgtime}} -->
            <countTo class="counttospan" :startVal='0' :endVal='totalData.avgtime' :duration='1000'></countTo>
            <span style="margin-left:6px;">天</span>
          </p>
        </div>
        <div class="base-search-table" style="clear:both;padding-top:20px;">
          <!---------------------------- 表格 ---------------------------->
          <div class="table-content">
            <el-table
              :data="totlaTableData.data"
              class="chart-table"
              header-row-class-name="table-header"
            >
              <el-table-column
                v-for="item in totlaTableData.header"
                :key="item"
                :prop="item"
                :label="item === 'title' ? '' : item"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="count-box" v-loading="deptLoading">
      <div class="count-box-title">
        <span>各单位处理时长对比</span>
        <div class="right-btns">
          <!-- <el-select v-model="timeType" style="width:80px;">
            <el-option value="year" label="按年">按年</el-option>
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
          <span @click="exportDeptData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <p>处理时长对比（天）</p>
        <!---------------------------- 曲线图 ---------------------------->
        <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
        <!---------------------------- 表格 ---------------------------->
        <p>处理时长对比详细</p>
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
      totlaTableData: {},
      // 单位处理时长对比
      deptLoading: false,
      timeType: "year",
      time: new Date().getFullYear().toString(),
      chart: null,
      chartOptions: {},
      tableData: {}
    };
  },
  methods: {
    // 导出部门数据
    exportDeptData() {
      let url = `${window.g.url}dataHandle/exportBottom`;
      let query = `?timetype=${this.timeType}&time=${this.time}`;
      window.open(url + query, "_blank");
    },
    // 初始化图表
    initCharts() {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chart.setOption(this.chartOptions);
    },
    // 获取报处理总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataHandle/topAll"
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
    // 获取处理总量表格数据
    getTotalTableData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataHandle/topDept"
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            // 设置表格数据
            let header = data.header || [];
            let body = data.body || [];
            this.totlaTableData = this.common.setTableData(header, body);
            this.totlaTableData.header.unshift("title");
            this.totlaTableData.data[0].title = "处理结束量";
            this.totlaTableData.data[1].title = "处理未结束量";
            this.totlaTableData.data[2].title = "平均处理时长(天)";
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
          url: "dataHandle/bottom",
          data: {
            timetype: this.timeType,
            time: this.time
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
            let seriesData = this.common.setSeriesData(
              legendData,
              this.tableData.data,
              "line"
            );
            // 设置图表配置项
            this.chartOptions = this.common.setOptions(legendData, xAxisData, seriesData);
            this.initCharts();
          }
        })
        .catch(err => {
          this.deptLoading = false;
        });
    }
  },
  created() {
    this.getTotalData();
    this.getTotalTableData();
    this.getTimeData();
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