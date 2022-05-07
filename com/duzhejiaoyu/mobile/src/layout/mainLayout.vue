<template>
  <div style="overflow: hidden">
    <transition name="van-fade">
      <router-view />
    </transition>
    <div class="tabbar1" v-if="ifLearn">
      <timing></timing>
    </div>
    <van-tabbar
      class="tabbar"
      route
      active-color="#3A78FC "
      inactive-color="#999"
      v-model="active"
      :placeholder="true"
    >
      <van-tabbar-item
        replace
        :to="item.path"
        v-for="item in menu"
        :key="item.id"
      >
        <template #icon>
          <i :class="['iconfont', item.icon]"></i>
        </template>
        <span class="tabbar-title">{{ item.name }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      active: 2,
    };
  },
  components: {
    timing: () => import("@/components/timing.vue"),
  },
  computed: mapState({
    qjdl: (state) => state.qjdl,
    ifLearn() {
      return this.$route.path.indexOf("/exam/learn") > -1;
    },
    menu() {
      let data = [
        { id: 2, name: "入馆考试", path: "/exam", icon: "icon-rgks" },
        { id: 3, name: "个人中心", path: "/usercenter", icon: "icon-grzx" },
      ];
      let qjdl = { id: 1, name: "全景导览", path: "/qjdl", icon: "icon-qjdl" };
      if (this.qjdl && this.qjdl.val) {
        return [qjdl, ...data];
      } else {
        return data;
      }
    },
  }),
  mounted() {
    const tabbar = document.getElementsByClassName('van-tabbar');
    if (tabbar && tabbar[0] && tabbar[0].getBoundingClientRect) {
      const top = tabbar[0].getBoundingClientRect().top;
      this.$store.commit('setTabbarHeight', top);
    } else {
      this.$store.commit('setTabbarHeight', 0);
    }
  }
};
</script>

<style lang="scss">
.tabbar1 {
  height: 120px;
  bottom: 100px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.05);
  position: fixed;
  left: 0;
  z-index: 1;
  box-sizing: content-box;
  width: 100%;
}
// .tabbar.van-tabbar {
.tabbar.van-tabbar__placeholder {
  height: 120px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.05);
  .iconfont {
    font-size: 40px;
  }
  .tabbar-title {
    line-height: 28px;
    font-size: 20px;
  }
  .van-tabbar-item--active {
    .tabbar-title {
      font-weight: 600;
    }
  }
}
</style>
