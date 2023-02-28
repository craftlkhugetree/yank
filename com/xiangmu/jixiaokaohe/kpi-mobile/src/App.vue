<template>
  <div id="app" style="overflow-x: hidden;">
    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { getUserInfo, getUserRole } from "@/api/admin/user";
import { fetchUserDetail } from "@/api/admin/users";
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
      // const toDepth = to.path.split("/").length;
      // const fromDepth = from.path.split("/").length;
      if (to.meta.isSearch) {
        this.transitionName = "fade-size";
      } else {
        this.transitionName = this.$router.isBack
          ? "slide-left"
          : "slide-right";
      }
      this.$router.isBack = false;
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
    // 获取用户信息
    getUserInfo().then(res => {
      if (res.success) {
        let data = res.item || {};
        this.$store.commit("setUserInfo", data);
        fetchUserDetail({
          id: data.ID
        }).then(res => {
          if (res.success) {
            this.$store.commit("setUserDetail", res.data);
            if(!res.data && this.$route.path !== "/") {
              this.$router.push("/");
            }
          }
        });
      }
    });
    // 获取用户角色
    getUserRole().then(res => {
      if (res.success) {
        let data = res.data || [];
        this.$store.commit("setUserRoles", data);
      }
    });
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
</style>
