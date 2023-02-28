<template>
  <div class="statistic-box">
    <div class="count-box" v-loading="loading">
      <div class="count-box-title">
        <span>报修量总计</span>
      </div>
      <div class="count-box-content clearfix">
        <div class="num-box">
          <label>报修总量</label>
          <!-- <p>{{totalData.all}}</p> -->
          <countTo class="counttospan" :startVal='0' :endVal='totalData.all' :duration='1000'></countTo>

        </div>
        <div class="num-box">
          <label>今日报修</label>
          <p>
            <countTo class="counttospan" :startVal='0' :endVal='totalData.today' :duration='1000'></countTo>
            <!-- {{totalData.today}} -->
            <span
              :class="totalData.today >= totalData.yesterday ? 'up' : 'down'"
            >昨日 {{totalData.yesterday}}</span>
          </p>
        </div>
        <div class="num-box">
          <label>本月报修</label>
          <p>
            <!-- {{totalData.month}} -->
            <countTo class="counttospan" :startVal='0' :endVal='totalData.month' :duration='1000'></countTo>
            <span
              :class="totalData.month >= totalData.lastmonth ? 'up' : 'down'"
            >上月 {{totalData.lastmonth}}</span>
          </p>
        </div>
        <div class="num-box">
          <label>今年报修</label>
          <p>
            <!-- {{totalData.year}} -->
            <countTo class="counttospan" :startVal='0' :endVal='totalData.year' :duration='1000'></countTo>
            <span
              :class="totalData.year > totalData.lastyear ? 'up' : 'down'"
            >去年 {{totalData.lastyear}}</span>
          </p>
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
        <p>报修方式变化趋势</p>
        <!---------------------------- 曲线图 ---------------------------->
        <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
        <!---------------------------- 表格 ---------------------------->
        <p>报修方式变化详细</p>
        <div class="base-search-table">
          <!---------------------------- 表格 ---------------------------->
          <div class="table-content">
            <el-table
              :data="tableData.data"
              class="chart-table"
              header-row-class-name="table-header"
            >
              <el-table-column
                v-for="item in tableData.header"
                :key="item"
                :prop="item"
                :label="item"
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
import moment from "moment";
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
        yesterday: 0,
        today: 0,
        lastmonth: 0,
        month: 0,
        lastyear: 0,
        year: 0
      },
      // 方式数据
      typeLoading: false,
      timeType: "month",
      time: moment().format("yyyyMM"),
      chart: null,
      chartOptions: {},
      tableData: {}
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
      }
    }
  },
  methods: {
    // 导出报修方式数据
    exportTypeData() {
      let url = `${window.g.url}dataApply/exportAllBottom`;
      let query = `?timetype=${this.timeType}&time=${this.time}&repairdeptid=${this.userDept.ID}`;
      window.open(url + query, "_blank");
    },

    // 初始化图表
    initCharts(legendData, xAxisData, seriesData) {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chart.setOption(this.chartOptions);
    },

    // 获取报修量总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataApply/top",
          data: {
            repairdeptid: this.userDept.ID
          }
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

    // 获取报修方式数据
    getRepairTypeData() {
      this.typeLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataApply/allBottom",
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
    }
  },
  created() {
    if (this.userDept.ID) {
      this.getTotalData();
      this.getRepairTypeData();
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