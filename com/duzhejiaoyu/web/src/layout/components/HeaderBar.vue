<template>
  <div class="header">
    <div class="header-main">
      <img class="logo" src="@/assets/img/logo-white.png" alt />
      <div class="menu">
        <span
          v-for="item in menuList"
          :key="item.id"
          :class="{'active': item.path == $route.path}"
          @click="toPath(item.path)"
        >{{item.name}}</span>
      </div>
      <div class="header-right" v-if="userInfo.id">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <img :src="require(`@/assets/img/headpic-${userInfo.sex}.png`)" alt="头像" />
            <span>Hi，{{userInfo.name}}</span>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    userInfo: state => state.userInfo,
    qjdl: state => state.qjdl,
    menuList() {
      let data = [
        { id: 2, name: '入馆考试', path: '/exam' },
        { id: 3, name: '个人中心', path: '/usercenter' }
      ]
      let qjdl = { id: 1, name: '全景导览', path: '/qjdl' }
      if (this.qjdl && this.qjdl.val) {
        return [qjdl, ...data]
      } else {
        return data
      }
    }
  }),
  methods: {
    // 菜单
    toPath(path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    handleCommand(command) {
      if (command === 'exit') {
        this.exit()
      }
    },
    // 退出
    exit() {
      sessionStorage.clear()
      location.href = location.protocol + '//' + location.host + '/appportalweb/rest/Idsclient/reqLogout?reqUrl=' + window.location.href
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 80px;
.header {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  line-height: $height;
  color: #ffffff;
  text-align: center;
  .header-main {
    min-width: 1200px;
    max-width: 1400px;
    margin: 0 auto;
  }
  .logo {
    width: 236px;
    height: 36px;
    vertical-align: middle;
    float: left;
    margin-top: 20px;
  }
  .menu {
    display: inline-block;
    // width: 1000px;
    text-align: center;
    span {
      line-height: 22px;
      padding: 13px 18px;
      border-radius: 5px;
      color: rgba(255, 255, 255, 0.85);
      cursor: pointer;
      &.active {
        color: rgba(255, 255, 255, 1);
        background: rgba(255, 255, 255, 0.15);
      }
      &:hover {
        color: rgba(255, 255, 255, 1);
      }
    }
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
      margin-right: 5px;
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