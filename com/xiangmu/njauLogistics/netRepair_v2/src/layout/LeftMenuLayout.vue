<template>
  <div class="main-div">
    <div class="left-div">
      <el-menu
        :default-active="$route.path"
        text-color="#464032"
        active-text-color="#FD7D18"
        router
      >
        <template v-for="item in menuData">
          <el-menu-item :key="item.ID" :index="item.DISPLAYURL">
            <i class="iconfont" :class="item.ICON"></i>
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
  props: {
    menuType: String
  },
  computed: {
    menuData() {
      try {
        return JSON.parse(sessionStorage.getItem(this.menuType));
      } catch (err) {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 100%;
  margin: 0 auto;
  padding: 20px 0 0;
  .left-div,
  .right-div {
    height: 100%;
    background: #ffffff;
  }
  .left-div {
    width: 200px;
    float: left;
    padding: 0 0 10px;
    border-right: 1px solid rgba(0, 0, 0, 0.15);
    .el-menu {
      border: none;
      .el-menu-item {
        &.is-active {
          font-weight: bold;
          background: #fef2e7;
          border-right: 3px solid #fd7d18;
        }
        &:hover,
        &:focus {
          background: #fff9f4;
        }
      }
    }
  }
  .right-div {
    width: calc(100% - 200px);
    float: right;
  }
}
</style>