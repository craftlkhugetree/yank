<template>
  <div id="app" style="overflow-x: hidden;">
    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
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
      if (to.name === "search") {
        this.transitionName = "fade-size";
      } else {
        this.transitionName =
          toDepth < fromDepth ? "slide-right" : "slide-left";
      }
    },
    "$route.path"(val, old) {
      if (val.indexOf("/report") > -1 && old.indexOf(val + "-") > -1) {
        this.$store.commit("setIsBack2Report", true);
      } else {
        this.$store.commit("setIsBack2Report", false);
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
          if (moveY > this.startY && scrollTop <= 0) {
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
    this.$store.dispatch("getUserInfo");
    this.$store.dispatch("getUserDepts");
    this.$store.dispatch("getUserRoles");
    this.$store.dispatch("getDepartments");
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  background: #f3f3f3;
}
</style>
