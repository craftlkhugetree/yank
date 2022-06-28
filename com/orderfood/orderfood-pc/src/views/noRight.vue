<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header height="80px">
      <header-bar></header-bar>
    </el-header>
    <!------------------------------ 主要内容 ------------------------------>
    <el-main>
      <img src="@/assets/img/noright.png" alt="">
      <p>抱歉，您没有权限查看</p>
    </el-main>
  </el-container>
</template>

<script>
import HeaderBar from "@/layout/components/HeaderBar";
export default {
  components: {
    HeaderBar
  }
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
    background: #1957FB;
    padding: 0 30px;
  }
  .main-container {
    overflow: auto;
  }
  .el-aside {
    background: #ffffff;
  }
  .el-main {
    background: #ffffff;
    margin: 20px ;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.05);
    text-align: center;
    img {
      margin: 40px 0 20px;
      width: 160px;
      height: 120px;
    }
    p {
      color: #999;
    }
  }
}
</style>