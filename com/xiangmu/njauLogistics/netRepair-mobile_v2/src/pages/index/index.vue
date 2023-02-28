<template>
  <div>
    <van-nav-bar title="网上报修" fixed>
      <!-- <span slot="right" style="color: #638dec" @click="toask">常用故障</span> -->
    </van-nav-bar>
    <div style="width: 100%; height: 46px"></div>
    <div class="repirnums">
      <div class="clearfix">
        <div class="num1">
          <p class="label">报修量</p>
          <p class="value">
            <countTo
              :startVal="0"
              :endVal="reportNum"
              :duration="2000"
            ></countTo>
          </p>
        </div>
        <div class="num2">
          <p class="label">完成量</p>
          <p class="value">
            <countTo
              :startVal="0"
              :endVal="finishNum"
              :duration="2000"
            ></countTo>
          </p>
        </div>
      </div>
      <div class="startorderbtn" @click="toStartRepair">我要报修 →</div>
    </div>
    <div class="orderlists">
      <div class="tabs clearfix">
        <div
          class="tabitem"
          :class="{ active: tabs === '1' }"
          @click="changeTab('1')"
        >
          <p class="tablabel">我的报修</p>
          <div class="activelabel"></div>
        </div>
        <div
          class="tabitem"
          :class="{ active: tabs === '2' }"
          @click="changeTab('2')"
        >
          <p class="tablabel">全部报修</p>
          <div class="activelabel"></div>
        </div>
        <div class="searchbtn" @click="search">
          <i class="iconfont iconchaxun"></i>
          查询
        </div>
      </div>
      <div class="lists">
        <myOrders v-if="tabs === '1'"></myOrders>
        <allOrders v-if="tabs === '2'"></allOrders>
      </div>
    </div>
    <!-------------------------- 我要问 -------------------------->
  </div>
</template>

<script>
import myOrders from "./myOrders";
import allOrders from "./allOrders";
import countTo from "vue-count-to";
export default {
  data() {
    return {
      reportNum: 0,
      finishNum: 0,
      tabs: "1",
    };
  },

  components: { myOrders, allOrders, countTo },
  methods: {
    toask() {
      this.$router.push("/problems");
    },
    //创建维修
    toStartRepair() {
      this.$router.push("/reportOrder/0");
    },
    search() {
      this.$router.push(`/search?tab=${this.tabs}`);
    },
    //切换一层标签
    changeTab(key) {
      this.tabs = key;
      sessionStorage.setItem("pagekey_index", key);
    },
  },
  created() {
    this.tabs = sessionStorage.getItem("pagekey_index") || "1";
    this.util
      .postAjax({
        code: this.global.code,
        url: "/apply/callAndOver",
      })
      .then((res) => {
        if (res.success) {
          this.reportNum = res.data[1].num;
          this.finishNum = res.data[0].num;
        }
      });
  },
};
</script>
<style lang='scss' scoped>
.repirnums {
  height: 128px;

  background: url(../../../static/images/bgc.png) no-repeat;
  background-size: 135px 100%;
  background-color: #fff;
  background-position: 100% 0;
}
.num1,
.num2 {
  float: left;
  margin-top: 14px;
  .label {
    font-size: 12px;
    font-weight: 400;
    color: #aaaaaa;
  }
  .value {
    font-size: 16px;
    font-weight: 400;
    color: #464032;
    line-height: 24px;
  }
}
.num1 {
  margin-left: 24px;
}
.num2 {
  margin-left: 30px;
}
.startorderbtn {
  width: 190px;
  margin-top: 8px;
  margin-left: 18px;
  height: 40px;
  background: #fd7d18;
  box-shadow: 0px 7px 4px 0px rgba(255, 112, 0, 0.12),
    0px 14px 4px -10px rgba(255, 112, 0, 0.24);
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
}
.orderlists {
  padding: 0 12px;
  padding-bottom: 12px;
  margin-top: 16px;
  background-color: rgba(246, 246, 246, 1);
}
.searchbtn {
  width: 75px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 30px;
  float: right;
  padding: 0px 13px;
  margin-top: -7px;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
}
.lists {
  margin-top: 12px;
}
</style>