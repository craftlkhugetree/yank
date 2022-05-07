<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header height="80px">
      <header-bar></header-bar>
    </el-header>
    <el-container class="main-container">
      <!------------------------------ 左侧菜单 ------------------------------>
      <el-aside width="200px">
        <side-bar ref="sideBar"></side-bar>
      </el-aside>
      <!------------------------------ 主要内容 ------------------------------>
      <el-main :class="{'no-bg': noBg}">
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HeaderBar from "./components/HeaderBar";
import SideBar from "./components/SideBar";
export default {
  components: {
    HeaderBar,
    SideBar
  },
  computed: {
    noBg() {
      return this.$route.meta.noBg || false
    }
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-width: 1200px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fafafc;
  .el-header {
    background: #1957fb;
    padding: 0 30px;
  }
  .main-container {
    overflow: auto;
  }
  .el-aside {
    background: #ffffff;
  }
  .el-main {
    height: calc(100% - 20px);
    background: #ffffff;
    margin: 20px 0 0 20px;
    padding: 0;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
    &.no-bg {
      height: 100%;
      margin: 0;
      background: none;
      box-shadow: none;
    }
  }
}
</style>