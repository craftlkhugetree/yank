<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header>
      <header-bar></header-bar>
    </el-header>
    <el-container class="main-container">
      <!------------------------------ 主要内容 ------------------------------>
      <el-main class="clearfix">
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
      <!-- <el-footer>
        <div class="footer">
          <span>
            ——&nbsp;&nbsp;南京理工大学特藏资源&nbsp;&nbsp;——
          </span>
        </div>
      </el-footer> -->
    </el-container>
  </el-container>
</template>

<script>
import HeaderBar from './components/HeaderBar';
export default {
  components: {
    HeaderBar,
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-width: $width-rem;
  width: 100%;
  overflow: hidden;
  .main-container {
    overflow: auto;
    min-height: 800rem;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  /deep/ .el-main {
    margin: 0;
    padding: 0;
    // background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #F9F4FE 100%)
  }
  .footer {
    z-index: 999;
    width: 100%;
    height: 233rem;
    background: url('../assets/img/footer.svg') no-repeat center;
    display: flex;
    align-items: center;
    span {
      display: block;
      width: 100%;
      font-family: 'zcoolwenyiti';
      font-style: normal;
      font-weight: 400;
      font-size: 12rem;
      line-height: 12rem;
      height: 12rem;
      text-align: center;
      letter-spacing: 0.04em;
      color: rgba(51, 51, 51, 0.2);
    }
  }
}
/deep/ .el-footer {
  height: 233rem !important;
}
/deep/ .el-header {
  padding: 0;
}
</style>
