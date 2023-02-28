<template>
  <div>
    <transition name="slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
    <div style="height:52px;"></div>
    <van-tabbar route active-color="#2A2E2E" inactive-color="#999" v-model="active">
      <van-tabbar-item replace :to="item.path" v-for="item in menu" :key="item.id">
        <span class="tabbar-title">{{ item.name }}</span>
        <template #icon="props">
          <img :src="props.active ? item.iconA : item.icon" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      menu: [
        {
          id: 1,
          name: "首页",
          path: "/index",
          icon: require("@/assets/img/home.png"),
          iconA: require("@/assets/img/home-active.png")
        },
        {
          id: 2,
          name: "我的预约",
          path: "/appoint",
          icon: require("@/assets/img/appoint.png"),
          iconA: require("@/assets/img/appoint-active.png")
        },
        {
          id: 3,
          name: "个人中心",
          path: "/center",
          icon: require("@/assets/img/center.png"),
          iconA: require("@/assets/img/center-active.png")
        }
      ]
    };
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.van-tabbar {
  height: 51px;
  img {
    width: 28px;
    height: 28px;
  }

  .tabbar-title {
    color: #474d51;
  }
}
</style>