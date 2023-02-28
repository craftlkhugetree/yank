<template>
  <div></div>
</template>

<script>
import { Notify } from "vant";
export default {
  methods: {
    // 企业微信登录
    bindQyLogin() {
      let query = this.$route.query || {};
      let key = query.key || null;
      this.util
        .postAjax({
          code: this.global.idsCode,
          url: "rest/NjitBxQyLogin/login",
          data: {
            key: key
          }
        })
        .then(res => {
          if (res.success) {
            this.$router.push("/index");
          } else {
            Notify({ type: "danger", message: res.data.message });
          }
        });
    }
  },
  created() {
    this.bindQyLogin();
  }
};
</script>

<style>
</style>