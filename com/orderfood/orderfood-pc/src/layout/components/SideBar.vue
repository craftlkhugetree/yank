<template>
  <el-menu
    :default-active="$route.path"
    text-color="#6e7384"
    active-text-color="#3f86f7"
    active-background-color="#1B2032"
    router
    v-loading="loading"
  >
    <template v-for="item in menuData">
      <el-submenu v-if="item.ISLEAF=='0'" :key="item.ID" :index="item.ID">
        <template slot="title">
          <i class="iconfont" :class="item.ICONCLS" style="padding-left:12px"></i>
          <span slot="title">{{item.NAME}}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.ID"
          :index="child.DISPLAYURL"
          :class="{'is-active':$route.path == child.DISPLAYURL}"
        >
          <span slot="title">{{child.NAME}}</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else :key="item.ID" :index="item.DISPLAYURL" style="padding-left:30px;">
        <span slot="title">
          <i class="iconfont" :class="item.ICONCLS"></i>
          <span slot="title">{{item.NAME}}</span>
        </span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { getUserMenu } from "@/api/admin/user";
export default {
  data() {
    return {
      loading: false,
      menuData: [],
      urls: [],
      menuData: []
      // menuData: [
      //   {
      //     ID: "1",
      //     NAME: "餐厅配置",
      //     ISLEAF: "0",
      //     ICONCLS: "icon-menu-zygl",
      //     children: [
      //       {
      //         ID: "1-1",
      //         NAME: "菜品配置",
      //         DISPLAYURL: "/cafe-setting/food"
      //       },
      //       {
      //         ID: "1-2",
      //         NAME: "餐厅配置",
      //         DISPLAYURL: "/cafe-setting/cafe"
      //       }
      //     ]
      //   },
      //   {
      //     ID: "2",
      //     NAME: "系统配置",
      //     ISLEAF: "0",
      //     ICONCLS: "icon-menu-xtgl",
      //     children: [
      //       {
      //         ID: "2-1",
      //         NAME: "角色权限",
      //         DISPLAYURL: "/sys-setting/roles"
      //       },
      //       {
      //         ID: "2-2",
      //         NAME: "餐厅管理",
      //         DISPLAYURL: "/sys-setting/cafe"
      //       },
      //       {
      //         ID: "2-4",
      //         NAME: "楼宇管理",
      //         DISPLAYURL: "/sys-setting/building"
      //       }
      //     ]
      //   }
      // ]
    };
  },
  watch: {
    urls() {
      this.redirect();
    },
    "$route.path"() {
      this.redirect();
    }
  },
  methods: {
    redirect() {
      // 如果当前链接不在菜单中 则跳转到第一个菜单
      if (this.urls.length > 0) {
        if (!this.urls.some(i => this.$route.path.includes(i))) {
          this.$router.push(this.urls[0]);
        }
      } else {
        this.$router.push("/no-right");
      }
    },
    // 获取用户菜单
    getUserMenu() {
      this.loading = true;
      getUserMenu()
        .then(res => {
          this.loading = false;
          this.menuData = res || [];

          // 用户菜单的所有链接
          this.urls = [];

          // 普通用户可以看到”我要订餐、订餐记录、订单结算“菜单
          if (this.menuData.length == 0) {
            this.menuData = [
              {
                DISPLAYURL: "/order",
                ICONCLS: "icon-menu-dingcan",
                ID: "20210729-1",
                ISLEAF: "1",
                LEVELCODE: "729001",
                NAME: "我要订餐",
                PID: "20210729",
                URL: "",
                iconCls: "icon-menu-dingcan",
                leaf: true
              },
              {
                DISPLAYURL: "/record",
                ICONCLS: "icon-search1",
                ID: "20210729-2",
                ISLEAF: "1",
                LEVELCODE: "729002",
                NAME: "订餐记录",
                PID: "20210729",
                URL: "",
                iconCls: "icon-search1",
                leaf: true
              },
              {
                DISPLAYURL: "/settle",
                ICONCLS: "icon-menu-shgl",
                ID: "20210729-3",
                ISLEAF: "1",
                LEVELCODE: "729003",
                NAME: "订单结算",
                PID: "20210729",
                URL: "",
                iconCls: "icon-menu-shgl",
                leaf: true
              }
            ];
          }

          this.menuData.forEach(i => {
            if (i.ISLEAF == "1") {
              this.urls.push(i.DISPLAYURL);
            } else {
              i.children.forEach(j => {
                this.urls.push(j.DISPLAYURL);
              });
            }
          });
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getUserMenu();
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
    padding-left: 24px !important;
    &.is-active {
      color: #3f86f7 !important;
      background: #f5f6fd;
    }
  }
  .el-submenu {
    .el-menu-item {
      padding-left: 50px !important;
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