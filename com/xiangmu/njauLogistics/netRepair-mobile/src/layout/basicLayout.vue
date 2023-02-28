<template>
  <!-- <div style="overflow-x: hidden"> -->
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <div class="ask" style="bottom: 110px">
      <a @click="$router.push('/index')">
        <img src="../../static/images/gnsy.png" alt />
        <span>功能首页</span>
      </a>
    </div>
    <div class="ask" style="bottom: 60px">
      <a :href="serviceCenterUrl">
        <img src="../../static/images/fwzx.png" alt />
        <span>服务中心</span>
      </a>
    </div>

    <!-- <div style="height: 52px" v-if="menu.length"></div>
    <van-tabbar
      v-if="menu.length"
      route
      active-color="#2A2E2E"
      inactive-color="#999"
    >
      <van-tabbar-item
        replace
        :to="item.path"
        v-for="item in menu"
        :key="item.id"
      >
        <span>{{ item.name }}</span>
        <template #icon="props">
          <img :src="props.active ? item.iconA : item.icon" />
        </template>
      </van-tabbar-item>
    </van-tabbar> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [],
    };
  },
  computed: {
    serviceCenterUrl: function () {
      return window.g.serviceCenterUrl;
    },
  },
  methods: {
    getMenu(val) {
      switch (val) {
        case "9100002-1":
          this.menu = [];
          break;
        case "9100002-2":
          this.menu = [
            {
              id: 1,
              name: "首页",
              path: "/index",
              icon: "@/../static/images/index.png",
              iconA: "@/../static/images/index-active.png",
            },
            {
              id: 2,
              name: "维修办理",
              path: "/reportedOrderList",
              icon: "@/../static/images/report.png",
              iconA: "@/../static/images/report-active.png",
            },
            {
              id: 3,
              name: "报修录单",
              path: "/createdOrderList",
              icon: "@/../static/images/addorder.png",
              iconA: "@/../static/images/addorder-active.png",
            },
          ];
          break;
        case "9100002-3":
          this.menu = [
            {
              id: 1,
              name: "首页",
              path: "/index",
              icon: "@/../static/images/index.png",
              iconA: "@/../static/images/index-active.png",
            },
            {
              id: 2,
              name: "派单办理",
              path: "/distributeList",
              icon: "@/../static/images/report.png",
              iconA: "@/../static/images/report-active.png",
            },
          ];
          break;
        case "9100002-4":
          this.menu = [
            {
              id: 1,
              name: "维修管理",
              path: "/maintenanceList",
              icon: "@/../static/images/report.png",
              iconA: "@/../static/images/report-active.png",
            },
            {
              id: 2,
              name: "维修统计",
              path: "/maintenanceStatistics",
              icon: "@/../static/images/calc.png",
              iconA: "@/../static/images/calc-active.png",
            },
          ];
          break;
      }
    },
  },
  watch: {
    "$store.state.userInfo.userType": function (val) {
      this.getMenu(val);
    },
  },
  created() {
    this.getMenu(this.$store.state.userInfo.userType);
  },
};
</script>

<style lang="scss" scoped>
.van-tabbar {
  height: 51px;
  img {
    width: 28px;
    height: 28px;
  }
  span {
    font-size: 10px;
  }
}
.ask {
  position: fixed;
  right: 20px;
  width: 100px;
  height: 36px;
  background: #ffffff;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.12);
  border-radius: 18px;
  text-align: center;
  padding-top: 4px;
  img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
  span {
    color: #2a2e2e;
  }
}
</style>