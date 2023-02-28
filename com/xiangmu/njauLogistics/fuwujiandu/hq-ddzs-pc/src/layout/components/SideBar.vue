<template>
  <el-menu
    :default-active="$route.path"
    text-color="#6e7384"
    active-text-color="#068358"
    active-background-color="#F2F9F6"
    router
  >
    <template v-for="item in menuData">
      <el-submenu v-if="item.ISLEAF === false" :key="item.ID" :index="item.ID">
        <template slot="title">
          <i class="iconfont" :class="item.ICON"></i>
          <span slot="title">{{item.NAME}}</span>
        </template>
        <el-menu-item
          class="submenu-item"
          v-for="child in item.children"
          :key="child.ID"
          :index="child.URL"
        >
          <span slot="title">{{child.NAME}}</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-if="item.ISLEAF" :key="item.ID" :index="item.URL">
        <i class="iconfont" :class="item.ICON"></i>
        <span slot="title">{{item.NAME}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {
          ID: "1",
          NAME: "应用管理",
          ISLEAF: true,
          ICON: "icon-app",
          URL: "/pc-admin/index",
          // children: [
          //   { ID: "1-1", NAME: "应用模板", URL: "/pc-admin/index" },
          //   { ID: "1-2", NAME: "应用类别", URL: "/appcenter/appType" },
          //   { ID: "1-3", NAME: "应用管理", URL: "/appcenter/appManage" },
          //   { ID: "1-4", NAME: "所有应用", URL: "/appcenter/appAll" },
          // ]
        }
      ]
    };
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
      background: #f2f9f6;
      span {
        font-weight: 600;
      }
    }
    &.submenu-item {
      padding-left: 58px !important;
      &.is-active {
        span::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #068358;
          margin-right: 10px;
          margin-left: -18px;
        }
      }
    }
  }
}
</style>