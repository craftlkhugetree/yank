<template>
  <div class="bgc">
    <p class="title">提问类型总计</p>
    <div class="figuertotal">
      <div class="totaldiv">
        <p class="label">提问总量</p>
        <!-- <p class="num">{{ formatNum(total) }}</p> -->
        <countTo
          class="counttospan num"
          :startVal="0"
          :endVal="Number(formatNum(total))"
          :duration="1000"
        ></countTo>
      </div>
      <div class="detpnums">
        <div v-for="item in topNums" :key="item.id" class="deptnums">
          <div class="numleft">
            <p class="label">{{ item.name }}</p>
            <p class="num1">{{ formatNum(item.num) }}</p>
          </div>
          <div class="numright">
            <percent :per="item.per" v-if="item.per" :color="item.color" />
          </div>
        </div>
      </div>
    </div>
    <chart1></chart1>
    <chart2></chart2>
  </div>
</template>

<script>
import chart1 from "./chart1";
import chart2 from "./chart2";
import percent from "./percent";
import countTo from "vue-count-to";
export default {
  data() {
    return {
      total: 0,
      topNums: [],
    };
  },

  components: { chart1, chart2, percent, countTo },
  mounted() {
    this.getAreaTop();
  },
  methods: {
    formatNum(num) {
      return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
    },
    getAreaTop() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataArea/top",
        })
        .then((res) => {
          let deptObj = {};
          _.forEach(this.$store.state.departments, (dept) => {
            deptObj[dept.ID] = dept.NAME;
          });
          let colors = {
            1: "rgba(91, 143, 249, 1)",
            2: "rgba(90, 216, 166, 1)",
            3: "rgba(93, 112, 146, 1)",
            4: "rgba(246, 189, 22, 1)",
            5: "rgba(232, 104, 74, 1)",
            6: "rgba(144, 19, 254, 1)",
            7: "rgba(95, 157, 24, 1)",
            8: "rgba(74, 207, 226, 1)",
          };
          if (res.success) {
            this.total = res.data[0].num;
            res.data.splice(0, 1);
            this.topNums = _.map(res.data, (deptnum) => {
              deptnum.name = deptObj[deptnum.handledeptid];
              let range = parseInt((deptnum.num / this.total) * 100);
              deptnum.per = range === 0 ? 1 : range;
              deptnum.color = colors[deptnum.handledeptid]
                ? colors[deptnum.handledeptid]
                : colors[parseInt(Math.random() * 8)];
              return deptnum;
            });
          }
        });
    },
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
  padding: 20px;
  border-top: 1px solid transparent;
}
.figuertotal:after {
  clear: both;
  content: "";
  display: block;
}
.totaldiv {
  width: 272px;
  height: 100%;
  border-right: 1px solid rgba(240, 240, 240, 1);
  float: left;
  & .label {
    display: block;
    margin-top: 37px;
    text-align: center;
  }
  & .num {
    display: block;
    margin-top: 30px;
    text-align: center;
    font-weight: 600;
    color: #2a2e2e;
    font-size: 30px;
  }
  & .num.counttospan {
    display: block;
    margin-top: 30px;
    text-align: center;
    font-weight: 600;
    color: #2a2e2e;
    font-size: 30px;
  }
}
.detpnums {
  width: calc(100% - 272px);
  height: 100%;
  float: left;
}
.deptnums {
  width: 265px;
  height: 80px;
  float: left;
  padding-left: 30px;
}
.label {
  font-size: 16px;
  font-weight: 400;
  color: #5f6464;
}
.num1 {
  margin-top: 5px;
  font-size: 24px;
  font-weight: 400;
  color: #2a2e2e;
}
.numleft {
  width: 150px;
  float: left;
}
.numright {
  width: 60px;
  height: 60px;
  float: right;
  margin-right: 10px;
  transform: rotate(-90deg);
}
</style>