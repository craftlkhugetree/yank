<template>
  <div id="app">
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user";
import { mapState } from "vuex";
export default {
  name: "App",
  computed: mapState({
    userInfo: (state) => state.userInfo,
  }),
  created() {
    if (!this.userInfo.ID) {
      getUserInfo().then((res) => {
        if (res.success) {
          let curUser = res.item || {};
          this.$store.commit("setUserInfo", curUser);
        }
      });
    }
  },
};
</script>


<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
