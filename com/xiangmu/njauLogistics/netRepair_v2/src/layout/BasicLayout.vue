<template>
  <el-container v-if="userInfo.NAME">
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
          >
            {{item.NAME}}
            <i></i>
          </router-link>
        </div>
        <div class="header-right">
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
    <el-footer>南京工程学院版权所有 Copyright © 2020</el-footer>
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
    userRoles() {
      return this.$store.state.userRoles;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    menu() {
      let data = this.$store.state.userMenu || [];
      let arr = [];
      if (data.length > 0) {
        arr = data.map(item => {
          return {
            NAME: item.NAME,
            DISPLAYURL:
              item.ISLEAF === "1"
                ? item.DISPLAYURL
                : item.children[0].DISPLAYURL
          };
        });
      } else {
        arr = [
          {
            NAME: "首页",
            DISPLAYURL: "/index"
          },
          {
            NAME: "常用故障",
            DISPLAYURL: "/common-faults"
          }
        ];
      }
      return arr;
    }
  },
  watch: {
    "$route.path"() {
      this.hasPath();
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
    },

    // 根据角色进入不同的页面
    setPath() {
      let roleIds = this.userRoles.map(i => i.ID);
      let url = "";
      // 接报修人员 打开维修办理页面
      if (roleIds.includes("9100002-2")) {
        url = "/repair-manage/handle";
        // 维修责任人 打开派单管理页面
      } else if (roleIds.includes("9100002-3")) {
        url = "/repair-manage/dispatch";
        // 全校师生 打开我要报修页面
      } else if (roleIds.includes("9100002-1")) {
        url = "/repair-apply";
      } else {
        let urls = sessionStorage.getItem("urls");
        url = urls ? JSON.parse(urls)[0] : "";
      }
      if (url) {
        this.$router.push(url);
      } else {
        alert("该用户没有访问权限！");
      }
    },

    // 判断要进入的页面是否在菜单中
    hasPath() {
      let urls = sessionStorage.getItem("urls");
      urls = urls ? JSON.parse(urls) : [];
      let path = this.$route.path;

      // 如果是刚进入页面  或者 进入的页面不在菜单中
      if (path == "/" || !urls.some(i => path.includes(i))) {
        // 通过用户角色判断进入系统时所进的页面
        this.setPath();
      }
    }
  },

  mounted() {
    // 获取用户角色和菜单
    Promise.all([
      this.$store.dispatch("getUserRoles"),
      this.$store.dispatch("getUserMenu")
    ]).then(() => {
      this.hasPath();
    });
    // 获取用户部门
    this.$store.dispatch("getUserDept");
    // 获取维修单位列表
    this.$store.dispatch("getDeptList");
  },

  beforeCreate() {
    // 获取用户信息
    this.$store.dispatch("getUserInfo");
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
        margin-right: 40px;
        padding: 0 10px;
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
        position: relative;
        i {
          display: inline-block;
          height: 4px;
          background: #fd7d18;
          width: 0;
          margin: 0 auto;
          position: absolute;
          bottom: -4px;
          left: 0px;
          right: 0px;
          transition: width 0.3s linear;
        }
        &.router-link-active {
          border-bottom: 4px solid #fd7d18;
          color: #fd7d18;
        }
        &:hover i {
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