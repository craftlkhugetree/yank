<template>
  <div id="app">
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {

  },
  mounted() {
    // this.common.requestFullScreen();
  },
  created() {
    window.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
    // 禁用双指放大
    document.documentElement.addEventListener(
      'touchstart',
      function(event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      {
        passive: false,
      }
    );

    // 禁用双击放大
    var lastTouchEnd = 0;
    document.documentElement.addEventListener(
      'touchend',
      function(event) {
        var now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      {
        passive: false,
      }
    );
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
}
</style>
