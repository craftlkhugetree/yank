<template>
  <div class="header-menu" v-loading="loading">
    <!-- <el-badge is-dot>
      <i class="el-icon-bell"></i>
    </el-badge>-->
    <span
      class="header-icon help"
      @click="getManual"
      style="color:#00B09B"
      v-if="isUser"
    >
      <img :src="require('st@tic/images/manual.png')" />
      帮助手册
    </span>
    <span class="header-icon" @click="syncUser" v-if="isAdmin">
      <i class="el-icon-refresh"></i>
      同步用户
    </span>
    <img src="../../../static/images/man.png" />
    <span>{{ userInfo.NAME }}</span>
    <span class="header-menu-exit" @click="exit">退出</span>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    isUser() {
      return this.common.url4status().start == 1;
    }
  },
  methods: {
    // 帮助手册
    getManual() {
      const loading = this.$loading({
        lock: true,
        text: "导出中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = "../../../static/help.docx";
      let fileName = "白马基地科教资源管理系统--用户帮助手册";
      axios({
        url,
        responseType: "blob",
        data: {},
        method: "GET",
        headers: {
          IDSTGC:
            this.util.getCookieByName("IDSTGC") ||
            "7200a7709a904c5b9acbd2af59671d2bF"
        }
      })
        .then(res => {
          let url = window.URL.createObjectURL(res.data);
          let link = document.createElement("a");
          link.href = url;
          link.style.display = "none";
          link.setAttribute("download", fileName + "." + "docx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(e => {
          console.log(e);
        });
      loading.close();
    },
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
            this.$alert("同步用户失败！", "提示", {
              type: "error",
              callback: () => {
                return;
              }
            });
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
  // display: flex;
  // align-items: center;
  // vertical-align: middle;
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
.help {
  img {
    width: 16px;
    height: 16px;
    border-radius: 0;
    vertical-align: baseline;
  }
}
</style>