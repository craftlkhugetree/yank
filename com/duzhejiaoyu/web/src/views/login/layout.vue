<template>
  <div class="login clearfix">
    <div class="login-left"></div>
    <div class="login-right">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 760px;
  position: relative;
}
.login-left {
  float: left;
  width: 65%;
  height: 100%;
  background: url('~@/assets/img/login-bg.png') no-repeat;
  background-size: cover;
}
.login-right {
  float: left;
  width: 35%;
  height: 100%;
  position: relative;
}
</style>