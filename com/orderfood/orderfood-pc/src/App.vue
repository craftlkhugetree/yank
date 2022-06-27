<template>
  <div id="app" ref="app" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/admin/user";
import { getNoSettleNnum } from "@/api/admin/settle";
export default {
  name: "App",
   computed: {
    loading: function() {
     return this.$store.state.loading
    }
  },
  created() {
    // 获取用户信息
    getUserInfo().then(res => {
      if (res.success) {
        let curUser = res.item || {};
        this.$store.commit("setUserInfo", curUser);
      }
    });
    // 获取超过30天未结算订单数量
    getNoSettleNnum().then(res => {
      if (res.success) {
        let data = res.data || 0;
        let isNoticed = sessionStorage.getItem("isNoticed")
        if (data > 0 && !isNoticed) {
          sessionStorage.setItem("isNoticed", true);
          this.$confirm(`还有订单未结算，请尽快结算！`, "提示", {
            confirmButtonText: "去结算",
            cancelButtonText: "继续订餐",
            type: "warning"
          }).then(() => {
            this.$router.push("/settle");
          }).catch(() => {
            return;
          });
        }
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
