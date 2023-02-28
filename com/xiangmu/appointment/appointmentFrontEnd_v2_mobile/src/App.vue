<template>
  <div id="app" style="overflow-x: hidden;">
    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { getUserInfo, getUserRole } from "@/api/admin/user";
export default {
  name: "App",
  data() {
    return {
      transitionName: "slide-right",
      startY: 0 // 触摸起始点
    };
  },
  watch: {
    // 转场动画
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      if (to.meta.isSearch) {
        this.transitionName = "fade-size";
      } else {
        this.transitionName =
          toDepth < fromDepth ? "slide-right" : "slide-left";
      }
    }
  },
  methods: {
    // 禁止页面下拉橡皮筋效果
    stopPullDown() {
      // 记录触摸起始点
      document.body.addEventListener("touchstart", e => {
        this.startY = e.touches[0].pageY;
      });
      // 监听触摸滑动
      document.body.addEventListener(
        "touchmove",
        e => {
          let moveY = e.touches[0].pageY;
          let scrollTop = document.getElementById("app").scrollTop;
          // 如果向下滑动，并且滚动条已到顶部，则禁止下拉
          if (moveY > this.startY && scrollTop <= 0 && e.cancelable) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
    }
  },
  mounted() {
    this.stopPullDown();
  },
  created() {
    // 获取用户信息
    getUserInfo().then(res => {
      if (res.success) {
        let data = res.item || {};
        this.$store.commit("setUserInfo", data);
      }
    });
    // 获取用户角色
    getUserRole().then(res => {
      if (res.success) {
        let data = res.data || [];
        let roleIds = data.map(i => i.ID);
        // 资源管理员9200001-2拥有预约管理菜单 ， 审核领导9200001-3拥有预约管理菜单
        let isAppointAdmin = roleIds.includes("9200001-2");
        let isAuditAdmin = roleIds.includes("9200001-3");
        sessionStorage.setItem("isAppointAdmin", isAppointAdmin);
        sessionStorage.setItem("isAuditAdmin", isAuditAdmin);

        // 如果是刚进入系统
        if (this.$route.path == "/") {
          if (isAppointAdmin || isAuditAdmin) {
            this.$router.push("/start");
          } else {
            this.$router.push("/index");
          }
        }
      }
    });
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
