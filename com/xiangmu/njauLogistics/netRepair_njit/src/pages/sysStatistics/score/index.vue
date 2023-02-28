<template>
  <div class="statistic-box">
    <div class="count-box" v-loading="loading">
      <div class="count-box-title">
        <span>维修总计</span>
      </div>
      <div class="count-box-content clearfix">
        <div class="num-box" style="width: 20%">
          <label>主动评价总量</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.zdpjzl" :duration="1000"></countTo>
            <span style="margin-left:6px;">默认评价 {{totalData.mrpj}}</span>
          </p>
        </div>
        <div class="num-box" style="width: 16%">
          <label>一星评价</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData['1']" :duration="1000"></countTo>
            <span style="margin-left:6px;">今日 {{totalData['today-1']}}</span>
          </p>
        </div>
        <div class="num-box" style="width: 16%">
          <label>二星评价</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData['2']" :duration="1000"></countTo>
            <span style="margin-left:6px;">今日 {{totalData['today-2']}}</span>
          </p>
        </div>
        <div class="num-box" style="width: 16%">
          <label>三星评价</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData['3']" :duration="1000"></countTo>
            <span style="margin-left:6px;">今日 {{totalData['today-3']}}</span>
          </p>
        </div>
        <div class="num-box" style="width: 16%">
          <label>四星评价</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData['4']" :duration="1000"></countTo>
            <span style="margin-left:6px;">今日 {{totalData['today-4']}}</span>
          </p>
        </div>
        <div class="num-box" style="width: 16%">
          <label>五星评价</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData['5']" :duration="1000"></countTo>
            <span style="margin-left:6px;">今日 {{totalData['today-5']}}</span>
          </p>
        </div>
      </div>
    </div>
    <!---------------------------- 趋势图 ---------------------------->
    <div class="count-box" v-loading="timeLoading">
      <div class="count-box-title">
        <span>用户主动评价趋势分析</span>
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
      <div class="count-box-content" style="padding-top:5px;">
        <el-tabs v-model="activeTab" @tab-click="handleClick" class="chart-tab">
          <el-tab-pane v-for="tab in allDeptList" :key="tab.ID" :label="tab.NAME" :name="tab.ID"></el-tab-pane>
        </el-tabs>
        <el-row>
          <el-col :span="16">
            <p>星级评价变化趋势</p>
            <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
          </el-col>
          <el-col :span="8">
            <p>星级评价占比</p>
            <div id="pieCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!---------------------------- 星级评价对比分析 ---------------------------->
    <div class="count-box" v-loading="scoreLoading">
      <div class="count-box-title">
        <span>星级评价对比分析</span>
        <div class="right-btns">
          <el-date-picker
            v-model="scoreTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            format="yyyy-MM-dd"
            style="width:280px;"
            @change="getScoreData"
          ></el-date-picker>
          <span @click="exportScoreData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content" style="padding-top:5px;">
        <el-tabs v-model="activeScoreTab" @tab-click="handleClickScore" class="chart-tab">
          <el-tab-pane v-for="tab in allScoreList" :key="tab.markscore" :label="tab.name" :name="tab.markscore"></el-tab-pane>
        </el-tabs>
        <p>星级评价对比分析</p>
        <div id="scoreCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
      </div>
    </div>
    <!---------------------------- 各单位星级评价对比分析 ---------------------------->
    <div class="count-box" v-loading="deptLoading">
      <div class="count-box-title">
        <span>各单位星级评价对比分析</span>
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
      <div class="count-box-content" style="padding-top:5px;">
        <el-tabs v-model="activeDeptTab" @tab-click="handleClickDept" class="chart-tab">
          <el-tab-pane v-for="tab in allDeptList" :key="tab.ID" :label="tab.NAME" :name="tab.ID"></el-tab-pane>
        </el-tabs>
        <p>星级评价对比分析</p>
        <div id="deptCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
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
        zdpjzl: 0,
        mrpj: 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "today-1": 0,
        "today-2": 0,
        "today-3": 0,
        "today-4": 0,
        "today-5": 0
      },

      // 趋势数据
      activeTab: "all",
      activeTabName: "评价总量",
      timeLoading: false,
      timeType: "month",
      time: moment().format("yyyyMM"),
      chart: null,
      chartOptions: {},
      tableData: {},
      pieChart: null,
      pieChartOptions: {},

      // 各星级
      scoreLoading: false,
      activeScoreTab: "all",
      activeScoreTabName: "评价总量",
      scoreTime: null,
      scoreChart: null,
      scoreChartOptions: null,

      // 各单位
      deptLoading: false,
      activeDeptTab: "all",
      activeDeptTabName: "评价总量",
      deptTime: null,
      deptChart: null,
      deptChartOptions: null,

      // 星级列表
      scoreList: [
        {
          markscore: "1",
          name: "一星评价"
        },
        {
          markscore: "2",
          name: "二星评价"
        },
        {
          markscore: "3",
          name: "三星评价"
        },
        {
          markscore: "4",
          name: "四星评价"
        },
        {
          markscore: "5",
          name: "五星评价"
        }
      ]
    };
  },
  computed: {
    deptList() {
      return this.$store.state.deptList;
    },
    // 星级列表 + 总量
    allScoreList() {
      let arr = [
        {
          markscore: "all",
          name: "评价总量"
        }
      ];
      return arr.concat(this.scoreList);
    },
    // 维修单位列表 + 总量
    allDeptList() {
      let arr = [
        {
          ID: "all",
          NAME: "评价总量"
        }
      ];
      let list = this.$store.state.deptList;
      return arr.concat(list);
    }
  },
  watch: {
    deptList: {
      handler: function(val) {
        if (val.length > 0) {
          this.getTimeData();
          this.getDeptData();
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
    // 切换tab
    handleClickScore(tab) {
      this.activeScoreTabName = this.allScoreList[tab.index].NAME;
      this.getScoreData();
    },
    // 切换tab
    handleClickDept(tab) {
      this.activeDeptTabName = this.allDeptList[tab.index].NAME;
      this.getDeptData();
    },
    // 导出趋势数据
    exportData() {
      let url = `${window.g.url}dataMark/exportYhzdpjqsfx`;
      let repairdeptid = this.activeTab == "all" ? "" : this.activeTab;
      let query = `?timetype=${this.timeType}&time=${this.time}&repairdeptid=${repairdeptid}`;
      window.open(url + query, "_blank");
    },
    // 导出星级评价数据
    exportScoreData() {
      let url = `${window.g.url}dataMark/exportDeptVs`;
      let starttime = this.scoreTime ? this.scoreTime[0] : "";
      let endtime = this.scoreTime ? this.scoreTime[1] : "";
      let markscore = this.activeScoreTab == "all" ? "" : this.activeScoreTab;
      let query = `?starttime=${starttime}&endtime=${endtime}&markscore=${markscore}`;
      window.open(url + query, "_blank");
    },
    // 导出各单位数据
    exportDeptData() {
      let url = `${window.g.url}dataMark/exportMarkVs`;
      let starttime = this.deptTime ? this.deptTime[0] : "";
      let endtime = this.deptTime ? this.deptTime[1] : "";
      let repairdeptid = this.activeDeptTab == "all" ? "" : this.activeDeptTab;
      let query = `?starttime=${starttime}&endtime=${endtime}&repairdeptid=${repairdeptid}`;
      window.open(url + query, "_blank");
    },
    // 初始化图表
    initCharts() {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chartOptions.legend.itemHeight = 10;
      this.chart.setOption(this.chartOptions);
    },
    // 初始化饼图
    initPieCharts() {
      this.pieChart = echarts.init(document.getElementById("pieCharts"));
      this.pieChartOptions.legend.itemHeight = 10;
      this.pieChart.setOption(this.pieChartOptions);
    },
    // 初始化各星级图表
    initScoreCharts() {
      this.scoreChart = echarts.init(document.getElementById("scoreCharts"));
      this.scoreChartOptions.legend.itemHeight = 10;
      this.scoreChart.setOption(this.scoreChartOptions);
    },
    // 初始化各单位图表
    initDeptCharts() {
      this.deptChart = echarts.init(document.getElementById("deptCharts"));
      this.deptChartOptions.legend.itemHeight = 10;
      this.deptChart.setOption(this.deptChartOptions);
    },
    // 获取总计数据
    getTotalData() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataMark/pjzj"
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
        time: this.time
      };
      if (this.activeTab !== "all") {
        param.repairdeptid = this.activeTab;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataMark/yhzdpjqsfx",
          data: param
        })
        .then(res => {
          this.timeLoading = false;
          if (res.success) {
            let data = res.data || [];
            // 设置表格数据
            let header = data.header || [];
            let body = data.body || [];
            let tableData = this.common.setTableData(header, body);
            // 当前tab所在的index
            let curIndex = header.findIndex(i => i == this.activeTabName);
            // 设置legendData
            let legendData = header.filter((i, index) => index > 0);
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
            // 设置饼图数据源
            this.setPieData(header, body);
          }
        })
        .catch(err => {
          this.timeLoading = false;
        });
    },
    // 设置饼图数据源
    setPieData(header, body) {
      let arr = [];
      header.forEach((head, index) => {
        if (index > 0) {
          let headData = body.map(data => data[index]);
          let total = headData.reduce((sum, num) => {
            return parseInt(sum) + parseInt(num);
          }, 0);
          let obj = {
            name: head,
            value: total
          };
          arr.push(obj);
        }
      });
      this.pieChartOptions = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          top: "5%",
          left: "center",
          icon: "circle",
          itemWidth: 6,
          formatter: name => {
            let obj = arr.filter(i => i.name == name)[0];
            return `${name}  ${obj.value}`;
          }
        },
        color: ["#3A78FC", "#6193FD", "#75A0FC", "#B0C9FE", "#D8E4FE"],
        series: [
          {
            name: "星级评价占比",
            type: "pie",
            radius: ["40%", "60%"],
            avoidLabelOverlap: false,
            label: {
              color: "#999999",
              formatter: "{b}: {d}%"
            },
            labelLine: {
              lineStyle: {
                color: "#999999"
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold"
              }
            },
            data: arr
          }
        ]
      };
      this.initPieCharts();
    },
    // 获取各星级数据
    getScoreData() {
      this.scoreLoading = true;
      let param = {
        starttime: this.scoreTime ? this.scoreTime[0] : null,
        endtime: this.scoreTime ? this.scoreTime[1] : null
      };
      if (this.activeScoreTab !== "all") {
        param.markscore = this.activeScoreTab;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataMark/deptVs",
          data: param
        })
        .then(res => {
          this.scoreLoading = false;
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
                name: "评价量",
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
            this.scoreChartOptions = this.common.setOptions(
              legendData,
              xAxisData,
              seriesData
            );
            this.initScoreCharts();
          }
        })
        .catch(err => {
          this.scoreLoading = false;
        });
    },
    // 获取各单位数据
    getDeptData() {
      this.deptLoading = true;
      let param = {
        starttime: this.deptTime ? this.deptTime[0] : null,
        endtime: this.deptTime ? this.deptTime[1] : null
      };
      if (this.activeDeptTab !== "all") {
        param.repairdeptid = this.activeDeptTab;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataMark/markVs",
          data: param
        })
        .then(res => {
          this.deptLoading = false;
          if (res.success) {
            let data = res.data || [];
            let arr = [];
            this.scoreList.forEach(i => {
              let obj = {...i};
              data.forEach(j => {
                if (i.markscore == j.markscore) {
                  obj.num = j.num;
                }
              });
              arr.push(obj);
            });
            // 设置legendData
            let legendData = [];
            // 设置横坐标Data
            let xAxisData = arr.map(i => i.name);
            // 设置系列Data
            let seriesData = [
              {
                name: "评价量",
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
    }
  },
  created() {
    this.getTotalData();
    this.getScoreData();
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.num-box p {
  text-align: left !important;
  .counttospan {
    margin-left: 0 !important;
  }
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