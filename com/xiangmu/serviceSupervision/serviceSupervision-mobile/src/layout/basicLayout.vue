<template>
  <div>
    <transition name="slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
    <div v-if="isAdmin" style="height:52px;"></div>
    <van-tabbar route v-if="isAdmin" active-color="#2A2E2E" inactive-color="#999">
      <van-tabbar-item replace :to="item.path" v-for="item in menu" :key="item.id">
        <span>{{ item.name }}</span>
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
      menu: [
        {
          id: 1,
          name: "首页",
          path: "/index",
          icon: "@/../static/images/tabbar-home.png",
          iconA: "@/../static/images/tabbar-home-active.png"
        },
        {
          id: 2,
          name: "回复管理",
          path: "/reply",
          icon: "@/../static/images/tabbar-reply.png",
          iconA: "@/../static/images/tabbar-reply-active.png"
        }
      ]
    };
  },
  computed: {
    // 是否后勤管理员 或者 部门管理员
    isAdmin() {
      let userRoleIds = this.$store.state.userRoles.map(i => i.ID);
      return (
        userRoleIds.includes("9100003-1") || userRoleIds.includes("9100003-2")
      );
    }
  }
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
</style>