<template>
  <div class="header">
    <img class="logo" src="@/assets/img/logo-white.png" alt />
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <img src="@/assets/img/headpic.png" alt="头像" />
          <span>Hi，{{userInfo.NAME}}</span>
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="exit">
            <i class="el-icon-switch-button"></i>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  methods: {
    handleCommand(command) {
      if (command === "exit") {
        this.exit();
      }
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
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  line-height: $height;
  color: #ffffff;
  .logo {
    width: 202px;
    height: 28px;
    vertical-align: middle;
  }
  .header-right {
    height: 100%;
    line-height: $height;
    float: right;
    img {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-right: 10px;
    }
    span {
      font-size: 14px;
      color: #ffffff;
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
}
.el-dropdown-menu {
  padding: 0;
  margin-top: -10px !important;
  .el-dropdown-menu__item {
    padding: 0 18px 0 10px;
    font-size: 12px;
    color: #999999;
    i {
      font-size: 16px;
    }
  }
}
</style>