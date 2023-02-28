<template>
  <div>
    <transition name="slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
    <div class="tabbar-height"></div>
    <van-tabbar route active-color="#3A78FC " inactive-color="#999" v-model="active">
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
          name: "我要订餐",
          path: "/home",
          icon: require("@/assets/img/noshop.png"),
          iconA: require("@/assets/img/blue-wan.png")
        },
        {
          id: 2,
          name: "扫码取餐",
          path: "/doScan",
          icon: require("@/assets/img/scan.png"),
          iconA: require("@/assets/img/scan-active.png")
        },
        {
          id: 3,
          name: "订餐记录",
          path: "/record",
          icon: require("@/assets/img/record.png"),
          iconA: require("@/assets/img/record-active.png")
        }
      ]
    };
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.van-tabbar {
  height: 120px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.05);
  img {
    width: 40px;
    height: 36px;
  }

  .tabbar-title {
    line-height: 28px;
    font-size: 20px;
  }
}
</style>