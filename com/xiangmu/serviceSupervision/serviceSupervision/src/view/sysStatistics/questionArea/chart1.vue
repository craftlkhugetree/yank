<template>
  <div>
    <!-- 各业务领域提问类型对比 -->
    <p class="title title2">
      问题区域提问量排行
      <span class="changebar">
        <el-select v-model="timeType" id="timetype" @change="changeTimeType">
          <el-option label="按年" value="year"></el-option>
          <el-option label="按月" value="month"></el-option>
        </el-select>
        <el-date-picker v-model="selectValue" :type="timeType" id="timerange" @change="getData"></el-date-picker>
        <span class="export" @click="exportData">
          <i class="el-icon-upload2"></i>
          导出数据
        </span>
      </span>
    </p>
    <div class="wbgc">
      <el-tabs v-model="activeType" @tab-click="clicktab">
        <el-tab-pane
          v-for="item in $store.state.departments"
          :key="item.ID"
          :label="item.NAME"
          :name="item.ID"
        ></el-tab-pane>
      </el-tabs>
      <p class="tabletitle">区域提问数量排行</p>
      <div class="chart" ref="chart"></div>
      <p class="tabletitle">区域提问数量详情</p>
      <div class="datatable">
        <el-table :data="tableData.body" style="width: 100%">
          <el-table-column v-for="item in tableData.header" :key="item" :prop="item" :label="item"></el-table-column>
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
      color: "rgba(0, 0, 0, 1)"
    },
    extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);"
  },
  legend: {
    left: "3%",
    itemWidth: 14,
    data: [] //图列
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: [] //日期
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
      type: "bar",
      barMaxWidth: 50
    }
  ]
};
export default {
  data() {
    return {
      selectValue: "",
      timeType: "month",
      activeType: "1",
      tableData: {
        body: [],
        header: []
      }
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
        handledeptid: this.activeType
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
      window.open(window.g.url + "/dataArea/exportArea?" + str.join("&"));
    },
    formatNum(num) {
      return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
    },
    clicktab() {
      this.getData(this.selectValue);
    },
    //获取各业务领域提问类型对比
    getData(val) {
      let data = {
        timetype: this.timeType,
        time: "",
        handledeptid: this.activeType
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
          url: "dataArea/area",
          data: data
        })
        .then(res => {
          //整理表格所需要的数据
          this.tableData.header = res.data.header;
          let tableDataArr = [];
          _.forEach(res.data.body, body => {
            let dataObj = {};
            _.forEach(body, (data, index) => {
              dataObj[res.data.header[index]] = data;
            });
            tableDataArr.push(dataObj);
          });
          this.tableData.body = tableDataArr;
          //整理echarts所需要的数据
          //整理横坐标的日期时间
          let optionXAxisData = _.map(res.data.body, data => {
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
            let value = 0;
            _.map(res.data.body, bodyData => {
              value += parseInt(bodyData[index + 1]);
            });
            seriesData.push({
              value: value,

              itemStyle: {
                color: "rgba(58, 120, 252, 1)"
              }
            });
          });
          option.legend.data = optionXAxisData;
          option.xAxis.data = optionLegendData;
          option.series[0].data = seriesData;
          let chart = this.$echarts.init(this.$refs["chart"]);
          chart.setOption(option);
        });
    }
  }
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
  padding-top: 20px;
  box-sizing: border-box;
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