<template>
  <div class="header">
    <span class="app-title">督导助手</span>
    <ul class="menus">
      <li
        :class="{ active: nowIndex === index }"
        v-for="(item, index) in menus"
        :key="index"
        @click="toPage(item.path, index)"
      >
      <i></i>
        {{ item.name }}
      </li>
    </ul>

    <div class="header-right">
      <el-popover placement="bottom-end" width="80" trigger="click">

        <span class="user-info" slot="reference"
          >Hi，{{
            $store.state.userInfo.userName
          }}
          <i class="el-icon-arrow-down"></i>
          </span>

        <span class="logout" @click="logout"
          ><i class="el-icon-switch-button "></i> 退出登录</span
        >
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: new Date().getHours(),
      nowIndex: 0,
      menus: [
      ],
    };
  },
  methods: {
    toHall() {
      window.open(window.g.serviceCenterUrl);
    },
    toIndex() {
      this.$router.push("/");
      this.nowIndex = 0;
    },
    toPage(path, index) {
      this.nowIndex = index;
      this.$router.push(path);
    },
    logout() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/User/cleanNowLoginUser",
        })
        .then((res) => {
          if (res.success == true) {
            sessionStorage.clear();
            location.href =
              location.protocol +
              "//" +
              location.host +
              "/appportalweb/rest/Idsclient/reqLogout?reqUrl=" +
              window.location.href;
          }
        });
    },
  },
  created() {
    this.util
      .postAjax({
        code: this.global.menuCode,
        url: "/rest/Portal/getUserMenu",
        data: {
          menupid: this.$store.state.GROUPID,
        },
      })
      .then((res) => {
        this.menus = _.map(res, (item) => {
          let leaf = item;
          while(leaf.ISLEAF=="0") {
            leaf = leaf.children[0];
          }
          let menu = {
            name: item.NAME,
            path: leaf.DISPLAYURL
          };
          return menu;
        });
        let nowPath = this.$route.path;
        if (this.$route.name === "reply") {
          nowPath = "/replyList";
        }
        this.nowIndex = _.findIndex(this.menus, { path: nowPath });
        // 如果存在系统配置（20230203-4）菜单
        let setIndex = res.findIndex((i) => i.ID === "20230203-4");
        if (setIndex >= 0) {
          let setMenu = res[setIndex].children;
          this.$store.commit("setSetMenu", setMenu);
        }
        // 如果存在统计分析（20230203-3）菜单
        let statsIndex = res.findIndex(i => i.ID === "20230203-3");
        if(statsIndex >= 0) {
          let statsMenu = res[statsIndex].children;
          this.$store.commit("setStatsMenu", statsMenu);
        }
      });
  },
};
</script>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  color: #ffffff;
  padding: 10px 0;
  margin: 0 auto;
  .app-title {
    margin-top: 15px;
    font-size: 24px;
    line-height: 35px;
    cursor: pointer;
  }
  .header-right {
    height: 40px;
    line-height: 40px;
    float: right;
    cursor: pointer;
    span {
      font-size: 12px;
      color: #ffffff;
    }
    .user-info{
      height: 48px;
      display: inline-block;
      background-image: url(../../../static/images/user.svg) ;
      background-repeat: no-repeat;
      padding-left: 40px;
    }
  }
}
.menus {
  display: inline-block;
  height: 48px;
  line-height: 22px;
  position: relative;
  top: 12px;
  z-index: 0;
  left: 33.3%;
  margin: -70px 0 0 -56px;
  li {
        display: inline-block;
        /* margin-right: 40px; */
        cursor: pointer;
        text-align: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        /* min-width: 64px; */
        color: #ffffff;
        padding: 13px 28px;
        position: relative;
    i{
      display: inline-block;
      height: 15px;
      // background: linear-gradient(to bottom, transparent 75%, #ff6f4b 25%);
      width: 0;
      margin:0 auto;
      position:absolute;
      bottom:1px;
      left:0px;
      right:0px;
      transition:width .3s linear;
      z-index: -1;
    }
    &:hover i{
      width: 100%;
    }
    &.active:hover i{
      width: 0;
    }
  }
  li.active {
    background: #FFFFFF;
    border-radius: 8px 8px 0px 0px;
    color: #006457;
  }
}
.logout {
  display: block;
  width: 100%;
  text-align: left;
  color: #006457;
  cursor: pointer;
  & /deep/ .el-icon-switch-button{
    display: inline-block;
    margin: 0 8px 0 0px;
  }
}
</style>
