<template>
  <div id="app">
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { getUserInfo, getUserRole } from "@/api/admin/user";
import { findUserById } from "@/api/admin/users.js";
export default {
  name: "App",
  created() {
    // 获取用户信息
    getUserInfo().then(res => {
      if (res.success) {
        let curUser = res.item || {};
        this.$store.commit("setUserInfo", curUser);
        // 获取系统中该用户的信息
        findUserById({
          id: curUser.ID
        })
          .then(res => {
            if (res.success) {
              // 如果没有用户信息，则没有权限查看该系统
              if (!res.data) {
                this.$router.push("/no-right");
              } else {
                this.$store.commit("setUserDetail", res.data);
                // 获取用户负责的考核分组
                this.$store.dispatch("getUserRoleGroupList");
              }
            }
          })
          .catch(err => {});
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
