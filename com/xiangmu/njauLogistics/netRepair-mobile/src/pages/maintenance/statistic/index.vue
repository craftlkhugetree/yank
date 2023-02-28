<template>
  <div>
    <van-nav-bar title="网上报修" fixed />
    <div style="width:100%;height:46px;"></div>
    <!------------------------------ 统计数据 ------------------------------>
    <div class="data-box">
      <van-row>
        <van-col span="8" class="data-item">
          <p>
            <countTo :startVal="0" :endVal="totalData.week" :duration="2000"></countTo>
            <span :class="totalData.dWeek >= 0 ? 'up' : 'down'">{{Math.abs(totalData.dWeek)}}</span>
          </p>
          <label>本周维修</label>
        </van-col>
        <van-col span="8" class="data-item" style="text-align:center;">
          <p>
            <countTo :startVal="0" :endVal="totalData.month" :duration="2000"></countTo>
            <span :class="totalData.dMonth >= 0 ? 'up' : 'down'">{{Math.abs(totalData.dMonth)}}</span>
          </p>
          <label>本月维修</label>
        </van-col>
        <van-col span="8" class="data-item" style="text-align:right;">
          <p>
            <countTo :startVal="0" :endVal="totalData.year" :duration="2000"></countTo>
          </p>
          <label>本年维修</label>
        </van-col>
      </van-row>
    </div>
    <!------------------------------ 近7天统计 ------------------------------>
    <div class="data-box" style="padding-bottom:2px;">
      <div class="title">
        <span>近7天统计</span>
        <span class="title-right" @click="$router.push('/myStatistics')">
          查看所有
          <van-icon name="arrow"></van-icon>
        </span>
      </div>
      <div
        v-if="chartData.length > 0"
        id="charts"
        style="height:240px;width:100%;margin-bottom:20px;"
      ></div>
      <div v-else class="nodata">
        <img src="../../../../static/images/nodata.png" width="100%" alt />
        <p>没有找到相关记录</p>
      </div>
    </div>
    <!------------------------------ 月度排行 ------------------------------>
    <div class="data-box">
      <div class="title">
        <span>月度排行</span>
      </div>
      <div class="data-table" v-if="rankData.length > 0">
        <van-row class="header" gutter="20">
          <van-col span="8">{{new Date().getMonth() + 1}}月排名</van-col>
          <van-col span="10">姓名</van-col>
          <van-col span="6" style="text-align:right;">本月维修</van-col>
        </van-row>
        <div class="body">
          <van-row v-for="(item,index) in rankData" :key="index" gutter="20">
            <van-col span="8" class="rank-index">
              <img v-if="index == 0" src="../../../../static/images/rank-1.png" alt />
              <img v-else-if="index == 1" src="../../../../static/images/rank-2.png" alt />
              <img v-else-if="index == 2" src="../../../../static/images/rank-3.png" alt />
              <span v-else>{{index + 1}}</span>
            </van-col>
            <van-col span="10">{{item.name}}</van-col>
            <van-col span="6" class="rank-num">
              <countTo :startVal="0" :endVal="item.num" :duration="2000"></countTo>
            </van-col>
          </van-row>
        </div>
      </div>
      <div v-if="rankData.length == 0" class="nodata">
        <img src="../../../../static/images/nodata.png" width="100%" alt />
        <p>没有找到相关记录</p>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import countTo from "vue-count-to";
export default {
  components: {
    countTo
  },
  data() {
    return {
      totalData: {
        week: 0,
        lastweek: 0,
        dWeek: 0,
        month: 0,
        lastmonth: 0,
        dMonth: 0,
        year: 0,
        lastyear: 0
      },
      chart: null,
      chartData: [],
      rankData: []
    };
  },
  computed: {
    deptId() {
      return this.$store.state.userInfo.userOrgId;
    }
  },
  methods: {
    // 获取统计数据
    getTotalData() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepairer/top"
        })
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              this.totalData[i.type] = parseInt(i.num);
            });
            this.totalData.dWeek =
              this.totalData.week - this.totalData.lastweek;
            this.totalData.dMonth =
              this.totalData.month - this.totalData.lastmonth;
          }
        });
    },
    // 获取近7天数据
    getLast7Data() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepairer/last7day"
        })
        .then(res => {
          if (res.success) {
            this.chartData = res.data || [];
            if (this.chartData.length > 0) {
              let xAxisData = this.chartData.map(i =>
                this.util.formatTime(i.time, "MM-DD")
              );
              let seriesData = this.chartData.map(i => i.num);
              this.$nextTick(() => {
                this.initCharts(xAxisData, seriesData);
              });
            }
          }
        });
    },
    // 获取月度排行数据
    getRankData() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataRepairer/monthLevel",
          data: {
            repairdeptid: this.deptId
          }
        })
        .then(res => {
          if (res.success) {
            this.rankData = res.data || [];
            this.rankData.forEach(i => {
              i.name =
                i.repairername.substring(0, 1) +
                "*" +
                i.repairername.substring(2);
            });
          }
        });
    },

    // 初始化图表
    initCharts(xAxisData, seriesData) {
      this.chart = echarts.init(document.getElementById("charts"));
      this.chart.setOption({
        grid: {
          top: "20px",
          left: "0px",
          right: "0px",
          bottom: "0px",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            color: "#999999",
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: "rgba(65,97,128,0.15)"
            }
          },
          axisPointer: {
            label: {
              color: "#cccccc",
              fontWeight: "bold"
            }
          }
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLabel: {
            color: "#999999",
            fontSize: 12
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#e2e2e2"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#e2e2e2"
            }
          }
        },
        series: [
          {
            data: seriesData,
            type: "bar",
            barWidth: 30,
            label: {
              show: true,
              position: "top",
              color: "#93928E",
              fontSize: 12
            },
            itemStyle: {
              color: "#FD9746"
            }
          }
        ]
      });
    }
  },
  created() {
    this.getTotalData();
    this.getLast7Data();
    this.getRankData();
  }
};
</script>

<style lang="scss" scoped>
.data-box {
  background: #ffffff;
  padding: 12px 16px;
  margin-bottom: 12px;
}
.data-item {
  text-align: left;
  p {
    font-size: 24px;
    font-weight: 600;
    color: #464032;
    line-height: 36px;
    span.up,
    span.down {
      display: inline-block;
      font-size: 12px;
      font-weight: 400;
      margin-left: 4px;
      line-height: 18px;
      &.up {
        color: #fd9746;
        &::before {
          content: "\2191";
          display: inline-block;
          width: 12px;
        }
      }
      &.down {
        color: #638dec;
        &::before {
          content: "\2193";
          display: inline-block;
          width: 12px;
        }
      }
    }
  }
  label {
    font-size: 12px;
    color: #93928e;
    display: inline-block;
    line-height: 18px;
  }
}
.data-box {
  .title {
    margin-bottom: 12px;
    span {
      font-size: 16px;
      font-weight: 600;
      color: #464032;
      line-height: 24px;
    }
    .title-right {
      float: right;
      font-size: 12px;
      font-weight: 400;
      color: #93928e;
      .van-icon {
        margin-left: 2px;
        font-size: 14px;
        vertical-align: text-top;
      }
    }
  }
}
.data-table {
  .header {
    font-size: 14px;
    color: #93928e;
    line-height: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }
  .body {
    font-size: 16px;
    color: #464032;
    line-height: 20px;
    .van-row {
      padding: 16px 0;
    }
  }
  .rank-index {
    color: #e3c8b6;
    font-weight: 600;
    text-align: left;
    padding-left: 15px;
    img {
      width: 27px;
      height: 27px;
    }
    span {
      display: inline-block;
      width: 27px;
      text-align: center;
    }
  }
  .rank-num {
    font-weight: 600;
    text-align: right;
    span {
      display: inline-block;
      width: 60px;
      text-align: center;
    }
  }
}
.nodata {
  padding: 0 0 20px;
  text-align: center;
  img {
    width: 100px;
    height: 100px;
  }
  p {
    color: #999999;
    margin-top: 8px;
  }
}
</style>