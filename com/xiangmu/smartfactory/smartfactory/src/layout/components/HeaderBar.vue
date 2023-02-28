<template>
  <div class="header noPrint">
    <!-- <h2 class="logo">公司内部管理系统</h2> -->
    <img class="logo" src="@/assets/img/logo-white.png" alt />
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <img src="@/assets/img/headpic.png" alt="头像" />
          <span>Hi, {{ userInfo.loginname }}</span>
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="editPwd">
            <i class="el-icon-unlock"></i>
            修改密码
          </el-dropdown-item>
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
      let data = localStorage.getItem("userInfo") || null;
      return data ? JSON.parse(data) : {};
    },
  },
  methods: {
    handleCommand(command) {
      if (command === "exit") {
        this.exit();
      } else if (command === "editPwd") {
        this.$router.push("/edit-pwd");
      }
    },

    // 退出
    exit() {
      sessionStorage.clear();
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
$height: 80px;
.header {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  line-height: $height;
  color: #fff;
  .logo {
      display: inline-block;
      width: 268px;
      height: 32px;
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