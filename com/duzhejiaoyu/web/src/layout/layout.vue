<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header height="80px">
      <header-bar></header-bar>
    </el-header>
    <!------------------------------ 主要内容 ------------------------------>
    <el-main>
      <transition name="el-fade-in-linear" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-main>
    <!------------------------------ 底部 ------------------------------>
    <footer>Copyright © 2022 南京昂克软件 All Rights Reserved</footer>
  </el-container>
</template>

<script>
import HeaderBar from './components/HeaderBar'
export default {
  components: {
    HeaderBar
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-width: 1200px;
  width: 100%;
  overflow: hidden;
  background: #fafafc;
  .el-header {
    background: #1957fb;
    padding: 0 30px;
  }
  .el-main {
    background: #ffffff;
    padding: 0;
  }
  footer {
    background: #ffffff;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 60px;
    text-align: center;
  }
}
</style>