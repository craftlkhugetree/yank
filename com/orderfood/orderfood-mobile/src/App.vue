<template>
  <div id="app" style="overflow-x: hidden;">
    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/admin/user";

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
          if (moveY > this.startY && scrollTop <= 0) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
    }
  },
  mounted() {
    // this.stopPullDown();
  },
  created() {
    // 获取用户信息
    getUserInfo().then(res => {
      if (res.success) {
        let data = res.item || {};
        this.$store.commit("setUserInfo", data);
      }
    });
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  font-size: 24px;
  color: #474d51;
}
//确认弹框
.tipsmini-dialog {
  height: 261px;
  padding: 60px 48px;
  .h1-title {
    width: 100%;
    text-align: center;
    height: 39px;
    font-size: 28px;
    font-weight: 600;
    color: #474d51;
    line-height: 39px;
    margin-bottom: 30px;
  }
  .bottom-btn {
    // display: flex;
    text-align: center;
  }
  .cancel-btn {
    width: 240px;
    height: 72px;
    background: #ffffff;
    border-radius: 36px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.65) !important;
    margin-right: 24px;
  }
  .clear-btn {
    width: 240px;
    height: 72px;
    background: #3a78fc;
    border-radius: 36px;
    border: none;
  }
}
</style>
