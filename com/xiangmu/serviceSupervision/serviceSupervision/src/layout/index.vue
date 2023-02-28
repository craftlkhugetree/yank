<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header height="60px">
      <header-bar></header-bar>
    </el-header>
    <el-container class="main-container" >
      <!------------------------------ 主要内容 ------------------------------>
      <el-main class="mainsection" >
        <router-view></router-view>
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
    SideBar,
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-width: 1200px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f6f7fe;
  .el-header {
    background: #3a78fc;
    padding: 0 30px;
  }
  .main-container {
    overflow: auto;
  }
  .el-aside {
    background: #ffffff;
  }
  .el-main {
    margin: 0;
    padding: 0;
    height: 100%;
  }
}
.mainsection {
  width: 1200px;
  margin: 0 auto;
}
</style>