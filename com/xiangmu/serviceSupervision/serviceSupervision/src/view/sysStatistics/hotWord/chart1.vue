<template>
  <div>
    <p class="tabletitle">{{ deptname }}</p>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
let option = {
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  series: [
    {
      type: "wordCloud",
      shape: "circle",
      // maskImage: maskImage,
      left: "center",
      top: "center",
      width: "100%",
      height: "90%",
      right: null,
      bottom: null,
      sizeRange: [12, 45],
      rotationRange: [0, 0],
      rotationStep: 0,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        normal: {
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: function () {
            // Random color
            return (
              "rgb(" +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(",") +
              ")"
            );
          },
        },
        // emphasis: {
        //   shadowBlur: 10,
        //   shadowColor: "#333",
        // },
      },
      data: [],
    },
  ],
};
import echarts from "echarts";
require("echarts-wordcloud");
export default {
  data() {
    return {
      allList: [],
    };
  },
  props: { id: String, deptname: String },
  components: {},
  mounted() {
    this.util
      .postAjax({
        code: this.global.code,
        url: "dataKeyword/keyword",
        data: {
          handledeptid: this.id,
        },
      })
      .then((res) => {
        if (res.success) {
          this.allList = _.map(res.data, (item) => {
            return {
              name: item.word,
              value: item.num,
            };
          });
          option.series[0].data = this.allList;
          let chart = echarts.init(this.$refs["chart"]);
          chart.setOption(option);
        }
      });
  },
  methods: {},
};
</script>
<style lang='scss' scoped>
.tabletitle {
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
}
.chart {
  // margin-top: 20px;
  // margin-left: 15px;
  width: 100%;
  height: 100%;
}
</style>