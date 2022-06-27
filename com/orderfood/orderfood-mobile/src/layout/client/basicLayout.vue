<template>
  <div class="app">
    <transition name="slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.app {
  height: 100%;
}
</style>