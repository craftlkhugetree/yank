<template>
  <div class="bgc">
    <van-nav-bar title="网上报修" fixed/>
    <div style="width:100%;height:46px;"></div>
    <h1 class="toptitle">Hello!</h1>
    <h1>欢迎来到网上报修系统</h1>
    <div
      class="routers color1"
      @click="go('/start')"
    >
      <img src="../../../static/images/user.png" alt="" />
      <span class="texts">我的报修</span>
      <span class="icons">→</span>
    </div>
    <div
      class="routers color2"
      @click="go('/reportedOrderList')"
      v-if="userType.indexOf('9100002-2') != -1"
    >
      <img src="../../../static/images/reporter.png" alt="" />
      <span class="texts">维修办理</span>
      <span class="icons">→</span>
    </div>
    <div
      class="routers color2"
      @click="go('/addOrder')"
      v-if="userType.indexOf('9100002-2') != -1"
    >
      <img src="../../../static/images/reporter.png" alt="" />
      <span class="texts">报修录单</span>
      <span class="icons">→</span>
    </div>
    <div
      class="routers color2"
      @click="go('/distributeList')"
      v-if="userType.indexOf('9100002-3') != -1"
    >
      <img src="../../../static/images/reporter.png" alt="" />
      <span class="texts">派单管理</span>
      <span class="icons">→</span>
    </div>
    <div
      class="routers color3"
      @click="go('/maintenanceList')"
      v-if="userType.indexOf('9100002-4') != -1"
    >
      <img src="../../../static/images/maintancer.png" alt="" />
      <span class="texts">我的维修</span>
      <span class="icons">→</span>
    </div>
    <div
      class="routers color3"
      @click="go('/maintenanceStatistics')"
      v-if="userType.indexOf('9100002-4') != -1"
    >
      <img src="../../../static/images/maintancer.png" alt="" />
      <span class="texts">维修统计</span>
      <span class="icons">→</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userType: [],
    };
  },

  components: {},

  methods: {
    go(path) {
      this.$router.push(path);
    },
  },
  created() {
    this.util
      .postAjax({
        code: this.global.authCode,
        url: "rest/AuthOut/getMyRoles",
        data: {
          local: true,
        },
        isRep: true,
      })
      .then((res) => {
        let usertype = [];
        for (let k = 0; k < res.data.length; k++) {
          if (res.data[k].GROUPID === "9100002") {
            usertype.push(res.data[k].ID);
          }
        }
        this.userType = usertype;
        this.$store.commit("setUserInfo", {
          userType: usertype,
        });
      });
  },
};
</script>
<style lang='scss' scoped>
.color1 {
  color: rgba(253, 125, 24, 1);
}
.color2 {
  color: rgba(99, 141, 236, 1);
}
.color3 {
  color: rgba(63, 162, 146, 1);
}
h1 {
  height: 33px;
  font-size: 22px;
  font-weight: 400;
  color: #464032;
  line-height: 33px;
}
.toptitle {
  margin-top: 30px;
}
.bgc {
  background-color: #fff;
  padding: 0 67px;
  padding-bottom: 30px;
  min-height: 100%;
  & /deep/.van-hairline--bottom::after {
    border: none;
  }
}
.routers {
  margin-top: 60px;
  width: 240px;
  height: 60px;
  background: #ffffff;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  & > img {
    height: 100%;
    float: left;
    margin-left: 15px;
  }
  & > .texts {
    float: left;
    font-size: 16px;
    font-weight: 600;
    line-height: 60px;
    margin-left: 25px;
  }
  & > .icons {
    float: left;
    font-size: 16px;
    font-weight: 600;
    line-height: 60px;
    margin-left: 25px;
  }
}
</style>