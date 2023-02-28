<template>
  <div class="statistic-box">
    <div class="count-box" v-loading="loading">
      <div class="count-box-title">
        <span>维修总计</span>
      </div>
      <div class="count-box-content clearfix">
        <div class="num-box" style="width: 34%">
          <label>报修总量</label>
          <!-- <p>{{totalData["all-1"]}}</p> -->
          <countTo class="counttospan" :startVal="0" :endVal="totalData['all-1']" :duration="1000"></countTo>
        </div>
        <div class="num-box" style="width: 33%">
          <label>维修派单量</label>
          <!-- <p>{{totalData["all-2"]}}</p> -->
          <countTo class="counttospan" :startVal="0" :endVal="totalData['all-2']" :duration="1000"></countTo>
        </div>
        <div class="num-box" style="width: 33%;border:none;">
          <label>维修工作量</label>
          <p>
            <!-- {{totalData["all-3"]}} -->
            <countTo
              class="counttospan"
              :startVal="0"
              :endVal="totalData['all-3']"
              :duration="1000"
            ></countTo>

            <span style="margin-left:6px;">今日维修 {{totalData["today"]}}</span>
          </p>
        </div>
        <div class="total-box">
          <h3>各单位维修工作总量</h3>
          <ul>
            <li v-for="item in deptTotalData" :key="item.dept">
              <label>{{item.name}}</label>
              <p class="li-p">{{item.num}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="count-box" v-loading="deptLoading">
      <div class="count-box-title">
        <span>各单位维修工作量对比</span>
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
            @change="getDeptData"
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
            @change="getDeptData"
          ></el-date-picker>
          <span @click="exportDeptData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <p>维修工作量对比</p>
        <!---------------------------- 堆叠图 ---------------------------->
        <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
        <!---------------------------- 表格 ---------------------------->
        <p>维修工作量对比详细</p>
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
        "all-1": 0,
        "all-2": 0,
        "all-3": 0,
        today: 0
      },
      deptTotalData: [],

      // 维修工数据
      deptLoading: false,
      timeType: "month",
      time: moment().format("yyyyMM"),
      chart: null,
      chartOptions: {},
      tableData: {}
    };
  },
  computed: {
    deptList() {
      return this.$store.state.deptList;
    }
  },
  watch: {
    deptList: {
      handler: function() {
        this.getTotalData();
      },
      immediate: true
    }
  },
  methods: {
    // 导出数据
    exportDeptData() {
      let url = `${window.g.url}dataRepair/exportBottom`;
      let query = `?timetype=${this.timeType}&time=${this.time}`;
      window.open(url + query, "_blank");
    },
    // 初始化图表
    initCharts() {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chartOptions.legend.itemHeight = 10;
      this.chart.setOption(this.chartOptions);
    },
    // 获取维修总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepair/top"
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              this.totalData[i.type] = i.num;
            });
            let deptData = data.filter(i => i.type === "dept");
            // this.deptTotalData.forEach(i => {
            //   let index = this.deptList.findIndex(j => j.id === i.repairdeptid);
            //   if (index > -1) {
            //     i.name = this.deptList[index].name;
            //   }
            // });

            let arr = this.deptList.map(i => {
              let num = 0;
              let index = deptData.findIndex(
                j => j.repairdeptid === i.ID
              );
              if (index > -1) {
                num = deptData[index].num;
              }
              return {
                name: i.NAME,
                num: num
              };
            });
            this.deptTotalData = arr.sort((a, b) => {
              return a.num > b.num ? -1 : 1;
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取各单位数据
    getDeptData() {
      this.deptLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepair/bottom",
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
            let legendData = header.filter((i, index) => index > 1);
            // 设置横坐标Data
            let xAxisData = body.map(i => i[0]);
            // 设置系列Data
            let seriesData = this.common.setSeriesData(
              legendData,
              this.tableData.data,
              "bar"
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
          this.deptLoading = false;
        });
    }
  },
  created() {
    this.getDeptData();
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.total-box {
  clear: both;
  padding: 30px 30px 0;
  overflow: hidden;
  h3 {
    font-size: 16px;
    color: #5f6464;
    font-weight: 400;
    padding: 20px 0;
    border-top: 1px solid #f0f0f0;
  }
  ul {
    margin-left: -31px;
  }
  li {
    float: left;
    width: 12.5%;
    min-width: 140px;
    border-left: 1px solid #f0f0f0;
    padding-left: 30px;
    margin-bottom: 10px;
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
      color: #999999;
      font-size: 14px;
    }
    p.li-p {
      text-align: left;
      margin-top: 10px;
      font-size: 16px;
      color: #2a2e2e;
      padding-left: 16px;
      line-height: 22px;
    }
  }
}
</style>