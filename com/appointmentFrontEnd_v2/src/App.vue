<template>
  <div id="app">
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/admin/user";
export default {
  name: "App",
  created() {
    // let ids = this.util.getCookieByName('IDSTGC') || location.host.indexOf('localhost') > -1

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
}
</style>
