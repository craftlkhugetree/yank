<template>
  <div class="main-div">
    <div class="left-div">
      <el-menu
        :default-active="$route.path"
        text-color="#464032"
        active-text-color="#3A78FC"
        active-background-color="#F0F5FF"
        router
      >
        <template v-for="item in statsMenu">
          <el-submenu v-if="item.ISLEAF === '0'" :key="item.ID" :index="item.ID">
            <template slot="title">
              <i class="iconfont" :class="item.ICONCLS"></i>
              <span slot="title">{{item.NAME}}</span>
            </template>
            <el-menu-item
              class="submenu-item"
              v-for="child in item.children"
              :key="child.ID"
              :index="child.DISPLAYURL"
            >
              <span slot="title">{{child.NAME}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-if="item.ISLEAF === '1'" :key="item.ID" :index="item.DISPLAYURL">
            <i class="iconfont" :class="item.ICONCLS"></i>
            <span slot="title">{{item.NAME}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="right-div">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    statsMenu() {
      return this.$store.state.statsMenu;
    }
  }
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 20px 0 0;
  .left-div {
    width: 200px;
    height: 100%;
    overflow: auto;
    background: #ffffff;
    float: left;
    padding: 10px 0;
    border-right: 1px solid rgba(0,0,0,0.15);
    .el-menu {
      border: none;
      .el-menu-item {
        &.is-active {
          font-weight: bold;
          background: #f0f5ff;
          border-right: 3px solid #3a78fc;
        }
      }
    }
  }
  .right-div {
    width: calc(100% - 200px);
    height: 100%;
    overflow: auto;
    float: right;
    background: #f6f6f6;
  }
}
</style>