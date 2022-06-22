<template>
  <div class="header-menu" v-loading="loading">
    <!-- <el-badge is-dot>
      <i class="el-icon-bell"></i>
    </el-badge>-->
    <span class="header-icon" @click="syncUser" v-if="isAdmin">
      <i class="el-icon-refresh"></i>
      同步用户
    </span>
    <img src="../../../static/images/man.png" />
    <span>{{userInfo.NAME}}</span>
    <span class="header-menu-exit" @click="exit">退出</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    }
  },
  methods: {
    // 同步用户
    syncUser() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/Data/syncJZRoleUser"
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$alert("同步用户成功！", "提示", {
              type: "success",
              callback: () => {
                return;
              }
            });
          } else {
            this.$alert(
              "同步用户失败！",
              "提示",
              {
                type: "error",
                callback: () => {
                  return;
                }
              }
            );
          }
        })
        .catch(err => {
          this.loading = false;
          this.$alert("同步用户失败！" + "\n" + err, "提示", {
            type: "error",
            callback: () => {
              return;
            }
          });
        });
    },
    // 退出
    exit() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/User/cleanNowLoginUser"
        })
        .then(res => {
          if (res.success == true) {
            location.href =
              location.protocol +
              "//" +
              location.host +
              "/appportalweb/rest/Idsclient/reqLogout?reqUrl=" +
              window.location.href;
          }
        });
    }
  }
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
  .header-icon {
    cursor: pointer;
    margin-right: 30px;
    i {
      // margin-right: 10px;
      font-size: 16px;
      color: #1a7ff1;
    }
    color: #1a7ff1;
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
