<template>
  <div class="bgc">
    <p class="title">提问量总计</p>
    <div class="figuertotal">
      <div class="figuers">
        <p class="label">提问总量</p>
        <!-- <div class="figuernum">{{ formatNum(total) }}</div> -->
        <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(totalData.all))' :duration='1000'></countTo>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">今日提问</p>
        <div class="figuernum">
          <!-- {{ formatNum(day) }} -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(totalData.today))' :duration='1000'></countTo>
          <span class="diff"
            >昨日 {{ totalData.yesterday }}
          </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">本月提问</p>
        <div class="figuernum">
          <!-- {{ formatNum(month) }} -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(totalData.month))' :duration='1000'></countTo>

          <span class="diff"
            >上月 {{ totalData.lastmonth }}
          </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">本年提问</p>
        <div class="figuernum">
          <!-- {{ formatNum(year) }} -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(totalData.year))' :duration='1000'></countTo>

          <span class="diff"
            >去年 {{ totalData.lastyear }}
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
      <p class="tabletitle">提问量对比</p>
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
  series: [],
};
export default {
  data() {
    return {
      totalData: {
        all: 0,
        today: 0,
        yesterday: 0,
        month: 0,
        lastmonth: 0,
        year: 0,
        lastyear: 0
      },
      timeType: "month",
      selectValue: "",
      tableData: {
        body: [],
        header: [],
      },
    };
  },

  components:{
    countTo
  },

  methods: {
    exportData() {
      let val = this.selectValue;
      let data = {
        timetype: this.timeType,
        time: "",
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
        window.g.url + "/dataAmounts/exportAmountsBottom?" + str.join("&")
      );
    },
    formatNum(num) {
      return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
    },
    changeTimeType() {
      this.selectValue = new Date();
      this.getData(this.selectValue);
    },
    getData(val) {
      let data = {
        timetype: this.timeType,
        time: "",
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
          url: "dataAmounts/amountsBottom",
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
            let color = 100;
            _.forEach(optionLegendData, (legend, index) => {
              color = color - 100 / optionLegendData.length;
              let objTotal = 0;
              let objData = _.map(res.data.body, (bodyData) => {
                return bodyData[index + 2];
              });
              let seriesObj = {
                name: legend,
                type: "bar",
                stack: "总量",
                barMaxWidth: 50,
                itemStyle: {
                  borderRadius: [5, 5, 5, 5],
                  color: `rgba(58, 120, 252, ${index ? color / 100 + 0.1 : 1})`,
                },
                data: objData,
              };
              seriesData.push(seriesObj);
            });
            let lineData = _.map(seriesData[0].data, (item) => {
              return 0;
            });
            _.forEach(seriesData, (series) => {
              _.forEach(series.data, (data, index) => {
                lineData[index] += parseInt(data);
              });
            });
            seriesData.push({
              name: "总计",
              type: "line",
              data: lineData,
              itemStyle: {
                
                color: "#3a78fc",
              },
            });
            option.legend.data = optionLegendData;
            option.xAxis.data = optionXAxisData;
            option.series = seriesData;
            console.log(seriesData)
            let chart = this.$echarts.init(this.$refs["chart"]);
            chart.setOption(option);
          }
        });
    },
    //获取总计
    getNums() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataAmounts/amountsTop",
          data: {},
        })
        .then((res) => {
          if (res.success) {
            let data = res.data;
            data.forEach(i => {
              this.totalData[i.timetype] = i.num;
            })
          }
        });
    },
  },
  mounted() {
    this.selectValue = new Date();
    this.getNums();
    this.getData(this.selectValue);
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
  padding: 20px 0;
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
  padding: 0px 30px;
  &:not(:last-child) {
    border-right: 1px solid #F0F0F0;
  }
  .label {
    font-size: 16px;
    font-weight: 400;
    color: #5f6464;
  }
  .figuernum {
    font-size: 30px;
    font-weight: 600;
    color: #2a2e2e;
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