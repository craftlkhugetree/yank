<template>
  <el-container>
    <!------------------------------ 顶部 ------------------------------>
    <el-header>
      <div class="header">
        <img src="@/../static/images/logo.png" alt />
        <div class="header-menu" v-if="menu.length > 1">
          <router-link
            :class="{'router-link-active': item.DISPLAYURL.split('/')[1] === $route.path.split('/')[1]}"
            v-for="item in menu"
            :key="item.ID"
            :to="item.DISPLAYURL"
          >{{item.NAME}}
          <i></i></router-link>
        </div>
        <div class="header-right">
          <a :href="fwzxUrl" target="_blank">进入服务中心</a>
          <span>{{ time > 12 ? "下午好" : "上午好" }}，</span>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{userInfo.NAME}}
              <i class="el-icon-arrow-down el-icon--right"></i>
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
    </el-header>
    <!------------------------------ 主要内容 ------------------------------>
    <router-view></router-view>
    <!------------------------------ 底部 ------------------------------>
    <el-footer>南京农业大学后勤保障部版权所有 Copyright © 2020</el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      time: new Date().getHours()
    };
  },
  computed: {
    fwzxUrl() {
      return window.g.fwzxUrl;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    menu() {
      let data = this.$store.state.userMenu;
      return data.map(item => {
        return {
          NAME: item.NAME,
          DISPLAYURL:
            item.ISLEAF === "1" ? item.DISPLAYURL : item.children[0].DISPLAYURL
        };
      });
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
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  width: 100%;
  background: #ffffff;
  padding: 0;
  .header {
    width: 1400px;
    margin: 0 auto;
    img {
      width: 262px;
      height: 40px;
      vertical-align: middle;
      margin-top: 10px;
    }
    .header-menu {
      display: inline-block;
      line-height: 56px;
      margin-left: 120px;
      a {
        text-decoration: none;
        display: inline-block;
        margin-right: 50px;
        padding: 0 10px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
        position: relative;
        i{
          display: inline-block;
          height: 4px;
          background: #fd7d18;
          width: 0;
          margin:0 auto;
          position:absolute;
          bottom:-4px;
          left:0px;
          right:0px;
          transition:width .3s linear;
        }
        &.router-link-active {
          border-bottom: 4px solid #fd7d18;
          color: #fd7d18;
        }
        &:hover i{
          color: #fd7d18;
          width: 100%;
        }
      }
    }
    .header-right {
      float: right;
      line-height: 60px;
      font-size: 12px;
      a {
        margin-right: 20px;
        color: #fd7d18;
        text-decoration: none;
        font-weight: 600;
      }
      span {
        color: #888888;
        font-size: 12px;
      }
    }
  }
}
.el-footer {
  margin: 0 auto;
  color: #999999;
  font-size: 12px;
  line-height: 60px;
}
.el-dropdown {
  .el-dropdown-link {
    cursor: pointer;
  }
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