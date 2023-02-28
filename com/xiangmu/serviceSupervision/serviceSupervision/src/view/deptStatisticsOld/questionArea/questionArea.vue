<template>
  <div class="bgc">
    <el-tabs
      v-model="activeDept"
      type="card"
      class="statictab"
      @tab-click="clicktab"
    >
      <el-tab-pane
        v-for="item in $store.state.userInfo.userOrgId"
        :key="item.ID"
        :label="item.NAME"
        :name="item.ID"
      ></el-tab-pane>
    </el-tabs>
    <chart1 ref="chart1"></chart1>
    <chart2 ref="chart2"></chart2>
  </div>
</template>

<script>
import chart1 from "./chart1";
import chart2 from "./chart2";
export default {
  data() {
    return {
      total: 0,
      topNums: [],
      activeDept: "",
    };
  },

  components: { chart1, chart2 },
  mounted() {},
  methods: {
    clicktab() {
      console.log(this.activeDept);
      this.$refs["chart1"].changeActiveType(this.activeDept);
      this.$refs["chart2"].changeActiveType(this.activeDept);
    },
    formatNum(num) {
      return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
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
  height: 200px;
  padding: 20px;
  border-top: 1px solid transparent;
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
}
.detpnums {
  width: calc(100% - 272px);
  height: 100%;
  float: left;
}
.deptnums {
  width: 270px;
  height: 100px;
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
</style>