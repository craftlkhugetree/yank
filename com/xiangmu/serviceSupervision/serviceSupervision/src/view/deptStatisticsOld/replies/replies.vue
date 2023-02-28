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
    <p class="title">回复总计</p>
    <div class="figuertotal">
      <div class="figuers">
        <p class="label">提问总量</p>
        <!-- <div class="figuernum">{{ formatNum(total) }}</div> -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(total))' :duration='1000'></countTo>

      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">已回复数</p>
        <div class="figuernum">
          <!-- {{ formatNum(replied) }} -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(replied))' :duration='1000'></countTo>

          <span class="diff">昨日 {{ dayReplied }} </span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">未回复数</p>
        <div class="figuernum">
          <!-- {{ formatNum(unReplied) }} -->
          <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(unReplied))' :duration='1000'></countTo>

        </div>
      </div>
      <div class="divider"></div>
      <div class="figuers">
        <p class="label">平均回复时长</p>
        <div class="figuernum figuernum1">
          {{ formatNum(avatime) }}
          <!-- <countTo class="counttospan figuernum" :startVal='0' :endVal='Number(formatNum(avatime))' :duration='1000'></countTo> -->

        </div>
      </div>
    </div>
    <p class="title title2">
      回复时长趋势分析
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
      <p class="tabletitle">平均回复时长变化趋势(天)</p>
      <div class="chart" ref="chart"></div>
      <p class="tabletitle">回复量变化详细</p>
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
let typeColor = [
  "rgba(91, 143, 249, 1)",
  "rgba(90, 216, 166, 1)",
  "rgba(93, 112, 146, 1)",
  "rgba(246, 189, 22, 1)",
  "rgba(232, 104, 74, 1)",
  "rgba(144, 19, 254, 1)",
  "rgba(95, 157, 24, 1)",
  "rgba(74, 207, 226, 1)",
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
export default {
  data() {
    return {
      total: 0,
      replied: 0,
      dayReplied: 0,
      unReplied: 0,
      avatime: 0,
      timeType: "month",
      selectValue: "",
      tableData: {
        body: [],
        header: [],
      },
      tableData1: {
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
        window.g.url + "/dataReply/exportDeptOneBottom?" + str.join("&")
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
          url: "/dataReply/deptOneBottom",
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
            let chart1 = this.$echarts.init(this.$refs["chart"]);
            console.log(chart1Option);
            chart1.setOption(chart1Option);
          }
        });
    },
    //获取总计
    getNums() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataReply/topAll",
          data: {
            handledeptid: this.activeDept,
          },
        })
        .then((res) => {
          if (res.success) {
            let data = res.data;
            _.forEach(data, (item) => {
              if (item.isreply === "all") {
                this.total = item.num;
              }
              if (item.isreply === "1") {
                item.timetype === "today"
                  ? (this.dayReplied = item.num)
                  : (this.replied = item.num);
              }
              if (item.isreply === "time") {
                this.avatime = item.avgtime;
              }
            });
            this.unReplied = this.total - this.replied;
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
  .figuernum1{
    margin-top: 20px;
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
.toptable {
  padding: 0 20px;
}
</style>