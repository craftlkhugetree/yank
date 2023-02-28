<template>
  <div>
    <router-view />
    <!-- <tab-bar ref="tabBar" :class="{ 'select-open': !isShowTabBar, 'select-close': isShowTabBar }"></tab-bar> -->
    <!-- <tab-bar ref="tabBar" class="is-show" :class="{ hide: !isShowTabBar }"></tab-bar> -->
    <tab-bar v-show="false" ref="tabBar"></tab-bar>
  </div>
</template>

<script>
import TabBar from './tabBar';
import { mapState } from 'vuex';
export default {
  components: {
    TabBar,
  },
  computed: mapState({
    isShowTabBar: state => state.isShowTabBar,
  }),
};
</script>

<style scoped lang="scss">
.is-show {
  visibility: visible;
  &.hide {
    visibility: hidden;
  }
}
@keyframes slide-down {
  0% {
    transform: scale(1, 0);
  }
  25% {
    transform: scale(1, 1.2);
  }
  50% {
    transform: scale(1, 0.85);
  }
  75% {
    transform: scale(1, 1.05);
  }
  100% {
    transform: scale(1, 1);
  }
}
.select-open {
  animation: slide-down 0.5s ease-in;
  transition: 0.3s ease-in;
  transform-origin: 50% 0;
}
.select-close {
  transform: scaleY(0);
  transition: transform 0.2s;
  transform-origin: bottom center;
}
</style>
