<template>
  <div class="noPrint">
    <template v-for="item in menuData">
      <el-submenu
        v-if="item.visible && item.children && item.children.length > 0"
        :key="item.id"
        :index="item.name"
      >
        <template slot="title">
          <i class="iconfont" :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </template>
        <menu-list :menuData="item.children"></menu-list>
      </el-submenu>
      <el-menu-item
        v-if="item.visible && (!item.children || item.children.length == 0)"
        :key="item.path"
        :index="item.path"
      >
        <span slot="title">
          <i class="iconfont" :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
    name: "MenuList",
    props: {
        menuData: Array
    }
};
</script>

<style lang="scss" scoped>
.el-menu {
  margin-top: 20px;
  border: none;
  .iconfont {
    margin-right: 10px;
  }
  .el-menu-item {
    &.is-active {
      background: #f5f6fd;
    }
  }
  .el-submenu {
    .el-menu-item {
      &.is-active {
        background: #f5f6fd;
        span {
          font-weight: 600;
        }
      }
    }
  }
}
</style>
<style>
/* 左侧菜单 */
.el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
}
</style>