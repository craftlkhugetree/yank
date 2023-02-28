<template>
  <div class="bgc">
    <p class="title">系统热门提问</p>
    <div class="toplist clearfix">
      <div class="leftlist">
        <p class="tabletitle marginbottom">提问热词排行</p>
        <p class="indexitem" v-for="(item, index) in topList" :key="item.value">
          <span class="index">{{ index + 1 }}</span>
          <span class="indexname">{{ item.name }}</span>
          <span class="indexnum">{{ formatNum(item.value) }}</span>
        </p>
      </div>
      <div class="rightchart">
        <p class="tabletitle">提问热词云</p>
        <div class="chart" ref="chart"></div>
      </div>
    </div>
    <p class="title">各业务领域提问热词排行</p>
    <div class="deptcharts clearfix">
      <chart1
        class="deptchart"
        v-for="item in $store.state.departments"
        :key="item.ID"
        :id="item.ID"
        :deptname="item.NAME"
      ></chart1>
    </div>
  </div>
</template>

<script>
let option = {
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
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
      sizeRange: [12, 60],
      rotationRange: [0, 0],
      rotationStep: 0,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        normal: {
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: function() {
            // Random color
            return (
              "rgb(" +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(",") +
              ")"
            );
          }
        }
        // emphasis: {
        //   shadowBlur: 10,
        //   shadowColor: "#333",
        // },
      },
      data: []
    }
  ]
};
import echarts from "echarts";
require("echarts-wordcloud");
import chart1 from "./chart1";
export default {
  data() {
    return {
      topList: [],
      allList: []
    };
  },

  components: { chart1 },
  mounted() {
    this.getHotWords();
  },
  methods: {
    formatNum(num) {
      return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
    },
    getHotWords() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataKeyword/keyword",
          data: {}
        })
        .then(res => {
          if (res.success) {
            this.allList = _.map(res.data, item => {
              return {
                name: item.word,
                value: item.num
              };
            });
            option.series[0].data = this.allList;
            let chart = echarts.init(this.$refs["chart"]);
            chart.setOption(option);
            this.topList = this.allList.splice(0, 10);
          }
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.bgc {
  padding: 0 20px;
  background: #f6f6f6;
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: #2a2e2e;
}
.toplist {
  background-color: #fff;
  padding: 20px;
  margin-top: 10px;
  height: 540px;
  margin-bottom: 20px;
}
.leftlist {
  width: 50%;
  float: left;
}
.rightchart {
  width: 50%;
  float: left;
  height: 100%;
}
.tabletitle {
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
}
.marginbottom {
  margin-bottom: 20px;
}
.chart {
  height: 100%;
}
.indexitem {
  height: 46px;
  line-height: 46px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 14px;
  font-weight: 400;
  width: 93%;
  color: rgba(0, 0, 0, 0.65);
  & > span {
    display: inline-block;
  }
  .index {
    width: 50px;
    text-align: center;
  }
  .indexnum {
    float: right;
    margin-right: 30px;
  }
}
.indexitem:nth-child(2) .index {
  color: rgba(249, 78, 76, 1);
}
.indexitem:nth-child(3) .index {
  color: rgba(255, 145, 15, 1);
}
.indexitem:nth-child(4) .index {
  color: rgba(255, 190, 0, 1);
}
.deptcharts {
  margin-top: 10px;
}
.deptchart {
  width: 24%;
  height: 310px;
  float: left;
  margin-right: 11px;
  padding: 20px;
  margin-bottom: 11px;
  background-color: #fff;
}
</style>
