<template>
  <div id="app">
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  // mounted() {
  //   this.$router.push('/map')
  // }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
