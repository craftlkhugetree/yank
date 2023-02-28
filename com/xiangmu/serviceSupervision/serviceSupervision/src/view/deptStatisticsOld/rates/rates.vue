<template>
  <div class="bgc">
    <el-tabs
      v-model="activeDept"
      type="card"
      @tab-click="clickTab"
      class="statictab"
    >
      <el-tab-pane
        v-for="item in $store.state.userInfo.userOrgId"
        :key="item.ID"
        :label="item.NAME"
        :name="item.ID"
      ></el-tab-pane>
    </el-tabs>
    <p class="title">评价总计</p>
    <div class="figuertotal">
      <div class="figuers">
        <p class="label">评价总量</p>
        <div class="figuernum">
          {{ formatNum(numdata.total1) }}
          <span class="diff">提问量 {{ numdata.total2 }} </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">一星评价</p>
        <div class="figuernum">
          {{ formatNum(numdata.all1) }}
          <span class="diff">今日 {{ numdata.today1 }} </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">二星评价</p>
        <div class="figuernum">
          {{ formatNum(numdata.all2) }}
          <span class="diff">今日 {{ numdata.today2 }} </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">三星评价</p>
        <div class="figuernum">
          {{ formatNum(numdata.all3) }}
          <span class="diff">今日 {{ numdata.today3 }} </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">四星评价</p>
        <div class="figuernum">
          {{ formatNum(numdata.all4) }}
          <span class="diff">今日 {{ numdata.today4 }} </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">五星评价</p>
        <div class="figuernum">
          {{ formatNum(numdata.all5) }}
          <span class="diff">今日 {{ numdata.today5 }} </span>
        </div>
      </div>
    </div>
    <p class="title title2">
      用户评价趋势分析<span class="changebar">
        <el-select v-model="timeType1" id="timetype" @change="changeTimeType">
          <el-option label="按年" value="year"> </el-option>
          <el-option label="按月" value="month"> </el-option>
        </el-select>
        <el-date-picker
          v-model="selectValue1"
          :type="timeType1"
          id="timerange"
          @change="getData1"
        >
        </el-date-picker>
        <span class="export" @click="exportData">
          <i class="el-icon-upload2"></i>
          导出数据
        </span>
      </span>
    </p>
    <div class="chartandtable">
      <div class="chart1">
        <p class="tabletitle">星级评价变化趋势</p>
        <div class="echart1" ref="chart1"></div>
      </div>
      <div class="chart2">
        <p class="tabletitle">星级评价占比</p>
        <div class="echart2" ref="chart2"></div>
      </div>
      <div class="datatable">
        <p class="tabletitle">星级评价变化详细</p>
        <el-table :data="tableData1.body" style="width: 100%">
          <el-table-column
            v-for="item in tableData1.header"
            :key="item"
            :prop="item"
            :label="item"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
let type = {
  1: "一星",
  2: "二星",
  3: "三星",
  4: "四星",
  5: "五星",
};
let typeColor = [
  "rgba(58, 120, 252, 1)",
  "rgba(90, 216, 166, 1)",
  "rgba(93, 112, 146, 1)",
  "rgba(246, 189, 22, 1)",
  "rgba(232, 104, 74, 1)",
];
let typeColor2 = [
  "rgba(58, 120, 252, 1)",
  "rgba(58, 120, 252, .8)",
  "rgba(58, 120, 252, .6)",
  "rgba(58, 120, 252, .4)",
  "rgba(58, 120, 252, .2)",
];
let chart1Option = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "#FFF",
    textStyle: {
      color: "rgba(0, 0, 0, 1)",
    },
    extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
  },
  legend: {
    left: "3%",
    itemWidth: 14,
    data: [], //图列
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: [], //日期
  },
  yAxis: {
    type: "value",
  },
  series: [],
};
let chart2Option = {
  legend: {
    orient: "horizontal",
    left: 10,
    itemWidth: 5,
    itemHeight: 5,
    itemGap: 85,
    icon: "circle",
    data: [],
  },
  series: [
    {
      type: "pie",
      radius: ["30%", "50%"],
      labelLine: {
        show: true,
      },
      label: {
        show: true,
        formatter: "{b}  {d}%",
      },
      data: [],
    },
  ],
};
export default {
  data() {
    return {
      numdata: {
        total1: 0,
        total2: 0,
        all1: 0,
        today1: 0,
        all2: 0,
        today2: 0,
        all3: 0,
        today3: 0,
        all4: 0,
        today4: 0,
        all5: 0,
        today5: 0,
      },
      total: 0,
      num1all: 0,
      num1today: 0,
      num2all: 0,
      num2today: 0,
      num3all: 0,
      num3today: 0,
      num4all: 0,
      num4today: 0,
      num5all: 0,
      num5today: 0,
      timeType1: "month",
      selectValue1: "",
      timeType2: "month",
      tableData1: {
        head: [],
        body: [],
      },
      activeDept: "",
    };
  },

  components: {},
  mounted() {
    this.selectValue1 = new Date();
    this.getTypeTop();
    this.getData1(this.selectValue1);
  },
  methods: {
    changeTimeType() {
      this.selectValue1 = new Date();
      this.getData1(this.selectValue1);
    },
    clickTab() {
      this.getTypeTop();
      this.getData1(this.selectValue1);
    },
    exportData() {
      let val = this.selectValue1;
      let data = {
        timetype: this.timeType1,
        time: "",
        handledeptid: this.activeDept,
      };
      if (this.timeType1 === "year") {
        data.time = val.getFullYear();
      } else {
        let month = val.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        data.time = val.getFullYear() + "" + month;
      }
      let str = [];
      for (let i in data) {
        str.push(`${i}=${data[i]}`);
      }
      window.open(
        window.g.url + "/dataMark/exportMarkAllBottom?" + str.join("&")
      );
    },
    //获取提问类型趋势分析
    getData1(val) {
      let data = {
        timetype: this.timeType1,
        time: "",
        handledeptid: this.activeDept,
      };
      if (this.timeType1 === "year") {
        data.time = val.getFullYear();
      } else {
        let month = val.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        data.time = val.getFullYear() + "" + month;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataMark/markAllBottom",
          data: data,
        })
        .then((res) => {
          //整理表格所需要的数据
          this.tableData1.header = res.data.header;
          let tableDataArr = [];
          _.forEach(res.data.body, (body) => {
            let dataObj = {};
            _.forEach(body, (data, index) => {
              dataObj[res.data.header[index]] = data;
            });
            tableDataArr.push(dataObj);
          });
          this.tableData1.body = tableDataArr;
          //整理图标所需数据
          //整理横坐标的日期时间
          let optionXAxisData = _.map(res.data.body, (data) => {
            return data[0];
          });
          //整理图列
          let optionLegendData = [];
          _.forEach(res.data.header, (head, index) => {
            index > 0 && optionLegendData.push(head);
          });
          //整理图表数据
          let seriesData = [];
          _.forEach(optionLegendData, (legend, index) => {
            let objData = _.map(res.data.body, (bodyData) => {
              return bodyData[index + 1];
            });
            let seriesObj = {
              name: legend,
              type: "line",
              // stack: "总量",
              itemStyle: {
                color: typeColor[index],
              },
              data: objData,
            };
            seriesData.push(seriesObj);
          });
          chart1Option.legend.data = optionLegendData;
          chart1Option.xAxis.data = optionXAxisData;
          chart1Option.series = seriesData;
          let chart1 = this.$echarts.init(this.$refs["chart1"]);
          chart1.setOption(chart1Option);
          //整理提问类型占比饼图数据
          chart2Option.legend.data = optionLegendData;
          let seriesData2 = _.map(_.cloneDeep(seriesData), (data, index) => {
            let chart2data = {
              value: 0,
              name: optionLegendData[index],
              itemStyle: {
                color: typeColor2[index],
              },
            };
            _.forEach(data.data, (num) => {
              chart2data.value += parseInt(num);
            });
            return chart2data;
          });
          chart2Option.series[0].data = seriesData2;
          let chart2 = this.$echarts.init(this.$refs["chart2"]);
          chart2.setOption(chart2Option);
        });
    },
    formatNum(num) {
      return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
    },
    getTypeTop() {
      for (let i in this.numdata) {
        this.numdata[i] = 0;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataMark/markTop",
          data: {
            handledeptid: this.activeDept,
          },
        })
        .then((res) => {
          if (res.success) {
            _.forEach(res.data, (data) => {
              if (data.markscore === "all-1") {
                this.numdata.total1 = data.num;
              } else if (data.markscore === "all-2") {
                this.numdata.total2 = data.num;
              } else {
                this.numdata[`${data.timetype}${data.markscore}`] = data.num;
              }
            });
          }
        });
    },
  },
  created() {
    this.activeDept = this.$store.state.userInfo.userOrgId[0].ID;
  },
};
</script>
<style lang='scss' scoped>
.bgc {
  margin: 0 20px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: #2a2e2e;
}
.title2 {
  margin-top: 20px;
}
.figuertotal {
  margin-top: 10px;
  width: 100%;
  background: #fff;
  height: auto;
  border-top: 1px solid transparent;
}
.figuertotal:after {
  display: block;
  content: "";
  clear: both;
}
.figuers {
  display: inline-block;
  width: 16%;
  padding: 20px 30px;
  .label {
    font-size: 16px;
    font-weight: 400;
    color: #5f6464;
  }
  .figuernum {
    font-size: 30px;
    font-weight: 600;
    color: #2a2e2e;
    margin-top: 20px;
  }
}
.divider {
  width: 1px;
  display: inline-block;
  height: 60%;
  margin-top: 20px;
  border-left: 1px solid rgba(240, 240, 240, 1);
}
.diff {
  display: inline-block;
  margin-left: 20px;
  font-size: 13px;
  font-weight: 400;
  color: #5f6464;
  .up {
    color: rgba(255, 111, 75, 1);
  }
  .down {
    color: rgba(58, 120, 252, 1);
  }
}
.tabletitle {
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  margin: 20px auto;
  text-align: center;
}
.title2 {
  margin-top: 20px;
}
.chart1 {
  float: left;
  width: 60%;
  height: 467px;
}
.chart2 {
  float: left;
  width: 40%;
  height: 467px;
}
.echart1 {
  width: 100%;
  height: 400px;
}
.echart2 {
  width: 100%;
  height: 400px;
}
.chartandtable {
  margin-top: 10px;
  background-color: #fff;
}
</style>