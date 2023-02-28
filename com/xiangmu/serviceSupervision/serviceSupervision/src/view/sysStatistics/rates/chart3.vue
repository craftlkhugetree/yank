<template>
  <div>
    <!-- 各业务领域提问类型对比 -->
    <p class="title title2">
      各业务领域星级评价对比<span class="changebar">
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
    <div class="wbgc">
      <el-tabs v-model="activeType" @tab-click="clicktab">
        <el-tab-pane label="一星评价" name="1"></el-tab-pane>
        <el-tab-pane label="二星评价" name="2"></el-tab-pane>
        <el-tab-pane label="三星评价" name="3"></el-tab-pane>
        <el-tab-pane label="四星评价" name="4"></el-tab-pane>
        <el-tab-pane label="五星评价" name="5"></el-tab-pane>
      </el-tabs>
      <p class="tabletitle">星级评价对比</p>
      <div class="chart" ref="chart"></div>
      <p class="tabletitle">星级评价对比详细</p>
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
      selectValue: "",
      timeType: "month",
      activeType: "1",
      tableData: {
        body: [],
        header: [],
      },
    };
  },

  components: {},
  mounted() {
    this.selectValue = new Date();
    this.getData(this.selectValue);
  },
  methods: {
    changeTimeType() {
      this.selectValue = new Date();
      this.getData(this.selectValue);
    },
    exportData() {
      let val = this.selectValue;
      let data = {
        timetype: this.timeType,
        time: "",
        markscore: this.activeType,
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
        window.g.url + "/dataMark/exportMarkDeptBottom?" + str.join("&")
      );
    },
    clicktab() {
      this.getData(this.selectValue);
    },
    //获取各业务领域提问类型对比
    getData(val) {
      let data = {
        timetype: this.timeType,
        time: "",
        markscore: this.activeType,
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
          url: "dataMark/markDeptBottom",
          data: data,
        })
        .then((res) => {
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
            index > 0 && optionLegendData.push(head);
          });
          //整理图表数据
          let seriesData = [];
          let color = 100;
          _.forEach(optionLegendData, (legend, index) => {
            color = color - 100 / optionLegendData.length;
            let objData = _.map(res.data.body, (bodyData) => {
              return bodyData[index + 1];
            });
            let seriesObj = {
              name: legend,
              type: "bar",
              stack: "总量",
              barMaxWidth: 50,
              itemStyle: {
                color: `rgba(58, 120, 252, ${index ? color / 100 + 0.1 : 1})`,
              },
              data: objData,
            };
            seriesData.push(seriesObj);
          });
          option.legend.data = optionLegendData;
          option.xAxis.data = optionXAxisData;
          option.series = seriesData;
          let chart = this.$echarts.init(this.$refs["chart"]);
          chart.setOption(option);
        });
    },
  },
};
</script>
<style lang='scss' scoped>
.title {
  font-size: 16px;
  font-weight: 600;
  color: #2a2e2e;
}
.title2 {
  margin-top: 20px;

  margin-bottom: 20px;
}
.tabletitle {
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  margin: 20px auto;
  text-align: center;
}
.chart {
  width: 100%;
  height: 507px;
}
.wbgc {
  background-color: #fff;
  padding: 0 20px;
}
</style>