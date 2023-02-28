<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header height="0px">
      <header-bar></header-bar>
    </el-header>
    <!------------------------------ 主要内容 ------------------------------>
    <el-main class="my-scrollbar">
      <transition name="el-fade-in-linear" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-main>
    <el-footer>
      <footer-bar></footer-bar>
    </el-footer>
  </el-container>
</template>

<script>
import HeaderBar from "./components/HeaderBar";
import FooterBar from "./components/FooterBar";
export default {
  components: {
    HeaderBar,
    FooterBar
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-width: 1200px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
  .el-header {
    background: transparent;
    padding: 0 30px;
  }
  .main-container {
    overflow: hidden;
  }
  .el-aside {
    background: #ffffff;
  }
  .el-main {
    background: #ffffff;
    padding: 0;
    margin: 0 auto;
    overflow-x: hidden;
    width: 100%;
  }
}
</style>