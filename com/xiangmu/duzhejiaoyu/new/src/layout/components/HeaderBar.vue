<template>
  <div class="header-menu">
    <!-- <el-badge is-dot>
      <i class="el-icon-bell"></i>
    </el-badge>-->
    <img src="../../../static/images/man.png" />
    <span>{{userInfo.NAME}}</span>

    <el-button type="text" @click="exit">退出</el-button>

    <!-- <el-dropdown>
      <span class="el-dropdown-link">
        设置<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click="exit">退出</el-dropdown-item>
        <el-dropdown-item @click="toPassword">修改密码</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
    <!-- <span class="header-menu-exit" @click="exit">退出</span>

    <i class="el-icon-s-tools"></i> -->
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
    // 退出
    exit() {
      // this.util
      //   .postAjax({
      //     code: this.global.authCode,
      //     url: "/User/cleanNowLoginUser"
      //   })
      //   .then(res => {
      //     if (res.success == true) {
      //       location.href =
      //         location.protocol +
      //         "//" +
      //         location.host +
      //         "/appportalweb/rest/Idsclient/reqLogout?reqUrl=" +
      //         window.location.href;
      //     }
          location.href =
            location.protocol +
            "//" +
            location.host +
            "/idsweb/rest/Idsclient/reqLogout?reqUrl=" +
            window.g.loginToUrl;
        // });
    },

    // 跳转到修改密码页面
    toPassword(){

      // console.log("111");
      this.$router.push({
        path:"/password"
      })
    }
  },

  created() {
    // console.log("userInfo",this.userInfo)
  },


};
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
.header-menu {
  float: right;
  font-size: $font-size-large-x;
  color: #999999;
  .el-badge {
    margin-right: 40px;
    line-height: 22px;
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    vertical-align: middle;
  }
  span {
    display: inline-block;
    font-size: $font-size-medium;
    vertical-align: middle;
    margin-right: 5px;

    &.header-menu-exit {
      margin-right: 40px;
      color: #fe3e61;
      cursor: pointer;
    }
  }
}
</style>
