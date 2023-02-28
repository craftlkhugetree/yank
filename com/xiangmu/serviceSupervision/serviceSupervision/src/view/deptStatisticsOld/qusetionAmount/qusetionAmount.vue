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
    <p class="title">提问量总计</p>
    <div class="figuertotal">
      <div class="figuers">
        <p class="label">提问总量</p>
        <!-- <div class="figuernum">{{ formatNum(total) }}</div> -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(total))' :duration='1000'></countTo>

      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">今日提问</p>
        <div class="figuernum">
          <!-- {{ formatNum(day) }} -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(day))' :duration='1000'></countTo>

          <span class="diff"
            >昨日 {{ dayDiff }}
            <i class="el-icon-caret-top up" v-show="dayDiff >= 0"></i>
            <i class="el-icon-caret-bottom down" v-show="dayDiff < 0"></i>
          </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">本月提问</p>
        <div class="figuernum">
          <!-- {{ formatNum(month) }} -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(month))' :duration='1000'></countTo>

          <span class="diff"
            >上月 {{ monthDiff }}
            <i class="el-icon-caret-top up" v-show="monthDiff >= 0"></i>
            <i class="el-icon-caret-bottom down" v-show="monthDiff < 0"></i>
          </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">本年提问</p>
        <div class="figuernum">
          <!-- {{ formatNum(year) }} -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(year))' :duration='1000'></countTo>

          <span class="diff"
            >去年 {{ yearDiff }}
            <i class="el-icon-caret-top up" v-show="yearDiff >= 0"></i>
            <i class="el-icon-caret-bottom down" v-show="yearDiff < 0"></i>
          </span>
        </div>
      </div>
    </div>
    <p class="title title2">
      提问量对比
      <span class="changebar">
        <el-select v-model="timeType" id="timetype" @change="changeTimeType">
          <el-option label="按年" value="year"> </el-option>
          <el-option label="按月" value="month"> </el-option>
        </el-select>
        <el-date-picker
          v-model="selectValue"
          :type="timeType"
          id="timerange"
          @change="getData"
        >
        </el-date-picker>
        <span class="export" @click="exportData">
          <i class="el-icon-upload2"></i>
          导出数据
        </span>
      </span>
    </p>
    <div class="figuerchart">
      <p class="tabletitle">提问量变化趋势</p>
      <div class="chart" ref="chart"></div>
      <p class="tabletitle">提问量变化详细</p>
      <div class="datatable">
        <el-table :data="tableData.body" style="width: 100%">
          <el-table-column
            v-for="item in tableData.header"
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
import countTo from 'vue-count-to';
let option = {
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
  series: [
    {
      itemStyle: {
        color: "rgba(58, 120, 252, 1)",
      },
      data: [],
      type: "line",
    },
  ],
};
export default {
  data() {
    return {
      total: 0,
      day: 0,
      dayDiff: 0,
      month: 0,
      monthDiff: 0,
      year: 0,
      yearDiff: 0,
      timeType: "month",
      selectValue: "",
      tableData: {
        body: [],
        header: [],
      },
      activeDept: "",
    };
  },

  components: {countTo},

  methods: {
    changeTimeType() {
      this.selectValue = new Date();
      this.getData(this.selectValue);
    },
    clickTab() {
      this.getData(new Date());
      this.getNums();
    },
    exportData() {
      let val = this.selectValue;
      let data = {
        timetype: this.timeType,
        time: "",
        handledeptid: this.activeDept,
      };
      if (this.timeType === "year") {
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
        window.g.url + "/dataAmounts/exportDeptOneBottom?" + str.join("&")
      );
    },
    formatNum(num) {
      return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
    },
    getData(val) {
      let data = {
        timetype: this.timeType,
        time: "",
        handledeptid: this.activeDept,
      };
      if (this.timeType === "year") {
        data.time = val.getFullYear();
      } else {
        let month = val.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        data.time = val.getFullYear() + "" + month;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "/dataAmounts/deptOneBottom",
          data: data,
        })
        .then((res) => {
          if (res.success) {
            //整理表格所需要的数据
            this.tableData.header = res.data.header;
            let tableDataArr = [];
            _.forEach(res.data.body, (body) => {
              let dataObj = {};
              _.forEach(body, (data, index) => {
                dataObj[res.data.header[index]] = data;
              });
              tableDataArr.push(dataObj);
            });
            this.tableData.body = tableDataArr;
            //整理echarts所需要的数据
            //整理横坐标的日期时间
            let optionXAxisData = _.map(res.data.body, (data) => {
              return data[0];
            });
            //整理图列
            let optionLegendData = [];
            _.forEach(res.data.header, (head, index) => {
              index > 1 && optionLegendData.push(head);
            });
            //整理图表数据
            let seriesData = [];
            // _.forEach(optionLegendData, (legend, index) => {

            // });
            seriesData = _.map(res.data.body, (bodyData) => {
              return bodyData[1];
            });
            option.legend.data = optionLegendData;
            option.xAxis.data = optionXAxisData;
            option.series[0].data = seriesData;
            let chart = this.$echarts.init(this.$refs["chart"]);
            chart.setOption(option);
          }
        });
    },
    //获取总计
    getNums() {
      this.total = 0;
      this.day = 0;
      this.dayDiff = 0;
      this.month = 0;
      this.monthDiff = 0;
      this.year = 0;
      this.yearDiff = 0;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataAmounts/amountsTop",
          data: { handledeptid: this.activeDept },
        })
        .then((res) => {
          if (res.success) {
            let data = res.data;
            this.total = data[0].num;
            this.day = data[2].num;
            this.dayDiff = data[2].num - data[1].num;
            this.month = data[4].num;
            this.monthDiff = data[4].num - data[3].num;
            this.year = data[6].num;
            this.yearDiff = data[6].num - data[5].num;
          }
        });
    },
  },
  mounted() {
    this.selectValue = new Date();
    this.getNums();
    this.getData(this.selectValue);
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
  width: 24%;
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
    // margin-top: 20px;
  }
}
.figuernum.counttospan{
    display: block;
    margin-top: 20px;
  }
  .figuernum>.counttospan{
    display: inline-block;
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
.title2 {
  margin-top: 20px;
}
.figuerchart {
  background-color: #fff;
  margin-top: 10px;
  border-top: 1px solid transparent;
}
.chart {
  width: 100%;
  height: 507px;
}
.tabletitle {
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  margin: 20px auto;
  text-align: center;
}
.table {
}
</style>