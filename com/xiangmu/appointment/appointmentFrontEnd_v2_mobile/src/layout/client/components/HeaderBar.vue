<template>
  <div class="header">
    <img class="logo" src="@/assets/img/logo-blue.png" alt="智慧校园预约平台" @click="jumperHome" />
    <el-input
      class="header-input"
      placeholder="请输入关键词查询"
      prefix-icon="el-icon-search"
      v-model="searchText"
      @keyup.enter.native="enterSearch"
    ></el-input>
    <div class="right-box">
      <router-link target="_blank" :to="{path:'/admin'}">
        <span class="gray-text">进入管理后台</span>
      </router-link>
      <el-divider direction="vertical"></el-divider>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          Hi，{{userInfo.NAME}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="jumpCenter">个人中心</el-dropdown-item>
          <el-dropdown-item command="exit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
      resGroupData: [],
      resData: [],
      messageData: [],
      searchVisible: false,
      searchResList: []
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  methods: {
    //模糊搜索资源
    enterSearch() {
      this.$router.push({
        name: "res-search",
        params: { searchText: this.searchText }
      });
    },

    //跳转到首页
    jumperHome() {
      this.$router.push({
        name: "home"
      });
    },
    handleCommand(command) {
      if (command == "jumpCenter") {
        this.jumpCenter();
      } else if (command == "exit") {
        this.exit();
      }
    },
    //跳转到个人中心
    jumpCenter() {
      this.$router.push({
        name: "center",
        params: { type: "appoint" }
      });
    },
    // 退出
    exit() {
      sessionStorage.clear();
      location.href =
        location.protocol +
        "//" +
        location.host +
        "/appportalweb/rest/Idsclient/reqLogout?reqUrl=" +
        window.location.href;
    }
  }
};
</script>

<style lang="scss" scoped>
$height: 80px;
.header {
  height: 60px;
  background: #ffffff;
  box-shadow: 0px 8px 20px 0px rgba(98, 102, 130, 0.18);
  border-radius: 40px;
  padding: 0 40px;
  // position: fixed;
  position: absolute;
  top: 30px;
  z-index: 999;
  left: 200px;
  width: 1200px;
  .logo {
    width: 226px;
    height: 32px;
    vertical-align: middle;
    cursor: pointer;
  }
  .header-input {
    width: 360px;
    line-height: 60px;
    margin: 0 150px;
  }
  .header-input /deep/ input.el-input__inner {
    border: none !important;
    border-bottom: 1px solid #f2f2f2 !important;
  }
  .right-box {
    float: right;
    line-height: 60px;
    .el-dropdown-link {
      cursor: pointer;
    }
  }
  .gray-text {
    font-weight: 400;
    color: #7d7d80;
    font-size: 14px;
  }
}
</style>