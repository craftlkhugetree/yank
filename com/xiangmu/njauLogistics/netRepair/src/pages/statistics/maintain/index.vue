<template>
  <div class="statistic-box">
    <div class="count-box" v-loading="loading">
      <div class="count-box-title">
        <span>维修总计</span>
      </div>
      <div class="count-box-content clearfix">
        <div class="clearfix" style="float:left;width:50%;">
          <div class="num-box" style="width: 34%">
            <label>报修总量</label>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.bxzl" :duration="1000"></countTo>
          </div>
          <div class="num-box" style="width: 33%">
            <label>办理总量</label>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.blzl" :duration="1000"></countTo>
          </div>
          <div class="num-box" style="width: 33%">
            <label>处理结束量</label>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.cljsl" :duration="1000"></countTo>
          </div>
        </div>
        <div class="clearfix" style="float:right;width:50%;">
          <div class="num-ul clearfix" style="margin-bottom: 30px;">
            <li>
              <label>维修工作量</label>
              <countTo class="counttospan" :startVal="0" :endVal="totalData.wxgzl" :duration="1000"></countTo>
            </li>
          </div>
          <div class="num-ul clearfix">
            <li>
              <label>重复报修量</label>
              <countTo class="counttospan" :startVal="0" :endVal="totalData.cfbxl" :duration="1000"></countTo>
            </li>
            <li>
              <label>暂不维修量</label>
              <countTo class="counttospan" :startVal="0" :endVal="totalData.zbwxl" :duration="1000"></countTo>
            </li>
            <li>
              <label>已维修量</label>
              <countTo class="counttospan" :startVal="0" :endVal="totalData.ywxl" :duration="1000"></countTo>
            </li>
            <li>
              <label>不维修量</label>
              <countTo class="counttospan" :startVal="0" :endVal="totalData.bwxl" :duration="1000"></countTo>
            </li>
          </div>
        </div>
      </div>
    </div>
    <!---------------------------- 趋势图 ---------------------------->
    <div class="count-box" v-loading="timeLoading">
      <div class="count-box-title">
        <span>维修工作量趋势分析</span>
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
          <span @click="exportData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <p>维修工作量变化趋势</p>
        <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
      </div>
    </div>
    <!---------------------------- 各人员 ---------------------------->
    <div class="count-box" v-loading="deptUserLoading">
      <div class="count-box-title">
        <span>各维修人员工作量对比分析</span>
        <div class="right-btns">
          <el-date-picker
            v-model="userTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            format="yyyy-MM-dd"
            style="width:280px;"
            @change="getDeptUserData"
          ></el-date-picker>
          <span @click="exportDeptUserData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <p>维修工作量对比</p>
        <div id="deptUserCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
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
      loading: false,
      totalData: {
        bxzl: 0,
        blzl: 0,
        cljsl: 0,
        wxgzl: 0,
        cfbxl: 0,
        zbwxl: 0,
        ywxl: 0,
        bwxl: 0
      },
      deptTotalData: [],

      // 趋势数据
      timeLoading: false,
      timeType: "month",
      time: moment().format("yyyyMM"),
      chart: null,
      chartOptions: {},
      tableData: {},

      // 各单位人员
      deptUserLoading: false,
      userTime: null,
      deptUserChart: null,
      deptUserChartOptions: null
    };
  },
  computed: {
    // 用户部门
    userDept() {
      return this.$store.state.userDept;
    }
  },
  watch: {
    userDept: {
      handler: function(val) {
        if (val.ID) {
          this.getTotalData();
          this.getTimeData();
          this.getDeptUserData();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 导出趋势数据
    exportData() {
      let url = `${window.g.url}dataRepair/exportWxgzlqsfxDeptOne`;
      let query = `?timetype=${this.timeType}&time=${this.time}&repairdeptid=${this.userDept.ID}`;
      window.open(url + query, "_blank");
    },
    // 导出各单位人员数据
    exportDeptUserData() {
      let url = `${window.g.url}dataRepair/exportMangzlDb`;
      let starttime = this.userTime ? this.userTime[0] : "";
      let endtime = this.userTime ? this.userTime[1] : "";
      let query = `?starttime=${starttime}&endtime=${endtime}&repairdeptid=${this.userDept.ID}`;
      window.open(url + query, "_blank");
    },
    // 初始化图表
    initCharts() {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chartOptions.legend.itemHeight = 10;
      this.chart.setOption(this.chartOptions);
    },
    // 初始化各单位图表
    initDeptUserCharts() {
      this.deptUserChart = echarts.init(
        document.getElementById("deptUserCharts")
      );
      this.deptUserChartOptions.legend.itemHeight = 10;
      this.deptUserChart.setOption(this.deptUserChartOptions);
    },
    // 获取维修总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepair/wxzj1",
          data: {
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              this.totalData[i.type] = i.num;
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
        time: this.time,
        repairdeptid: this.userDept.ID
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepair/bottom",
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
            let curIndex = header.findIndex(i => i == this.userDept.NAME);
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
    // 获取各单位人员数据
    getDeptUserData() {
      this.deptUserLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepair/mangzlDb",
          data: {
            repairdeptid: this.userDept.ID,
            starttime: this.userTime ? this.userTime[0] : null,
            endtime: this.userTime ? this.userTime[1] : null
          }
        })
        .then(res => {
          this.deptUserLoading = false;
          if (res.success) {
            let arr = res.data || [];
            // 设置legendData
            let legendData = [];
            // 设置横坐标Data
            let xAxisData = arr.map(i => i.repairername);
            // 设置系列Data
            let seriesData = [
              {
                name: "工作量",
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
            this.deptUserChartOptions = this.common.setOptions(
              legendData,
              xAxisData,
              seriesData
            );
            this.initDeptUserCharts();
          }
        })
        .catch(err => {
          this.deptUserLoading = false;
        });
    }
  },
  created() {
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.num-box > .counttospan {
  text-align: left !important;
}
.num-ul {
  width: 100%;
  li {
    float: left;
    list-style: none;
    margin-right: 24px;
    line-height: 22px;
    &::before {
      display: inline-block;
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #3a78fc;
      margin-right: 10px;
    }
    label {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
    }
    .counttospan {
      font-size: 16px;
      font-weight: 400;
      color: #2a2e2e;
      line-height: 22px;
    }
  }
}
</style>