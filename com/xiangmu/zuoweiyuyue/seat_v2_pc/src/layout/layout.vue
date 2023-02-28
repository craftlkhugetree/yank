<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header height="60px">
      <header-bar></header-bar>
    </el-header>
    <el-container class="main-container">
      <!------------------------------ 左侧菜单  v-if="isAdmin"------------------------------>
      <el-aside width="200px">
        <side-bar ref="sideBar"></side-bar>
      </el-aside>
      <!------------------------------ 主要内容 ------------------------------>
      <el-main>
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
      <!------------------------------ 没有权限  v-else------------------------------>
      <!-- <el-main class="no-right" >
        <img src="@/assets/img/noright.png" alt />
        <p>抱歉，您没有权限查看</p>
      </el-main>-->
    </el-container>
  </el-container>
</template>

<script>
import HeaderBar from "./components/HeaderBar";
import SideBar from "./components/SideBar";
import { getUserInfo, getUserGroups } from "@/api/admin/user";
export default {
  components: {
    HeaderBar,
    SideBar
  },
  computed: {
    isAdmin() {
      return this.$store.state.isAdmin;
    }
  },
  created() {
    getUserInfo().then(res => {
      if (res.success) {
        let data = res.item || {};
        this.$store.commit("setUserInfo", data);
      }
    });
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
    background: url("~@/assets/img/top-bg.png") no-repeat center;
    background-size: cover;
    // background: #22355f;
    padding: 0 30px;
  }
  .main-container {
    overflow: auto;
  }
  .el-aside {
    background: #182645;
    .el-menu {
      background: #182645;
    }
  }
  .el-main {
    margin: 20px;
    padding: 0;
    background: #ffffff;
  }
  .el-main.no-right {
    background: #ffffff;
    margin: 20px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
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