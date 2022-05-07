<template>
  <div class="login-layout">
    <img class="bg" src="@/assets/img/login-bg.png" alt />
    <div class="login-main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.login-layout {
  .bg {
    width: 750px;
    height: 486px;
    object-fit: cover;
  }
}
.login-main {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 70%;
  min-height: 680px;
  padding: 80px 40px 20px;
  background: url("~@/assets/img/login-bg-2.png") no-repeat;
  background-size: cover;
}
</style>