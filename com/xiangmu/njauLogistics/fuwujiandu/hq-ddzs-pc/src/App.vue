<template>
  <div id="app">
    <router-view v-if="$store.state.userInfo.userID" />
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$store.dispatch("getUserInfo");
    this.$store.dispatch("getUserRoles");
    this.$store.dispatch("getDepartments");
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
