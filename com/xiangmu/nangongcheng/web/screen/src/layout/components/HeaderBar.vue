<template>
  <div class="header div_flex">
    <img class="logo" src="@/assets/img/logo.svg" alt />
    <div class="tab_flex" :style="isFull ? {'margin-right': 'auto'} : ''">
      <div
        v-for="(tab, index) of tabs"
        :key="tab.route + index"
        :class="isBot(tab) ? 'bot-line' : ''"
        @click="tabClick(tab)"
      >
        {{ tab.label }}
      </div>
    </div>
    <el-button type="primary" round size="small" @click="changeFull" v-show="isFull">
      <i class="el-icon-full-screen"></i>
    </el-button>
  </div>
</template>

<script>
import { tabs } from '@/assets/js/options';
export default {
  watch: {
    '$route.path'(n) {
      this.activeTab = n;
      const html = document.getElementsByTagName('html');
      html[0] && (html[0].scrollTop = 0);
    },
  },
  computed: {
    isBot() {
      return function(tab) {
        return this.activeTab === tab.route || this.$route.path.indexOf(tab.route) > -1;
      };
    },
  },
  data() {
    return {
      tabs,
      activeTab: '/',
      // isFull: false,
      isFull: true,
    };
  },
  methods: {
    changeFull() {
      this.common.requestFullScreen();
      this.isFull = false;
    },
    tabClick(tab) {
      this.activeTab = tab.route;
      this.$router.push(tab.route);
    },
  },
  mounted() {
    // setTimeout(() => {
    //   this.changeFull();
    // }, 1000);
    window.onresize = () => {
      // console.log(this.isFull, document.fullscreenElement, document.fullscreen);
      if (!document.fullscreen) {
        this.isFull = true;
      }
    };
  },
  beforeDestroy() {
    window.onresize = null;
  },
};
</script>

<style lang="scss" scoped>
$height: $home-head;
.header {
  z-index: 9;
  position: fixed;
  top: 0;
  background: #ffffff;
  box-shadow: 0rem 1rem 0rem rgba(204, 204, 204, 0.25);
  backdrop-filter: blur(2rem);
  width: 100%;
  height: $height;
  line-height: $height;
  .logo {
    margin-left: $m-left;
    vertical-align: middle;
    width: 147rem;
  }
  .tab_flex {
    min-width: 68%;
    margin-right: $m-right;
    margin-left: auto;
    // margin-left: 130rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bot-line {
      border-bottom: 4rem solid $color-purple;
    }
    div {
      height: $height;
      line-height: $height;
      cursor: pointer;
      @include fz(16rem);
    }
  }
}
</style>
