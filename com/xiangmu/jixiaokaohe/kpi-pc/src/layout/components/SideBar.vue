<template>
  <el-menu
    :default-active="'/' + $route.path.split('/')[1]"
    text-color="#6e7384"
    active-text-color="#3f86f7"
    active-background-color="#1B2032"
    router
    v-loading="loading"
  >
    <template v-for="item in menuData">
      <el-submenu v-if="item.ISLEAF=='0'" :key="item.ID" :index="item.ID">
        <template slot="title">
          <i class="iconfont" :class="item.ICONCLS"></i>
          <span slot="title">{{item.NAME}}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.ID"
          :index="child.DISPLAYURL"
          :class="{'is-active':child.DISPLAYURL.split('/')[2] === $route.path.split('/')[2]}"
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
      //     NAME: "绩效管理",
      //     ISLEAF: "0",
      //     ICONCLS: "icon-menu-zygl",
      //     children: [
      //       {
      //         ID: "1-1",
      //         NAME: "月度绩效录入",
      //         DISPLAYURL: "/performance-manage/month-input"
      //       },
      //       {
      //         ID: "1-2",
      //         NAME: "年终奖录入",
      //         DISPLAYURL: "/performance-manage/annual-bonus-input"
      //       },
      //       {
      //         ID: "1-3",
      //         NAME: "历史记录",
      //         DISPLAYURL: "/performance-manage/history"
      //       },
      //       {
      //         ID: "1-4",
      //         NAME: "绩效奖励查看",
      //         DISPLAYURL: "/performance-manage/award-view"
      //       },

      //       {
      //         ID: "1-6",
      //         NAME: "考核组信息查看",
      //         DISPLAYURL: "/performance-manage/group-view"
      //       },
      //       {
      //         ID: "1-5",
      //         NAME: "绩效考核文件",
      //         DISPLAYURL: "/performance-manage/check-files"
      //       },
      //       {
      //         ID: "1-7",
      //         NAME: "绩效考核文件管理",
      //         DISPLAYURL: "/performance-manage/check-files-manage"
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
      //         NAME: "人员管理",
      //         DISPLAYURL: "/sys-setting/users"
      //       },
      //       {
      //         ID: "2-4",
      //         NAME: "考核分组设置",
      //         DISPLAYURL: "/sys-setting/group"
      //       },
      //       {
      //         ID: "2-5",
      //         NAME: "领导岗位级别设置",
      //         DISPLAYURL: "/sys-setting/leader-level"
      //       },
      //       {
      //         ID: "2-6",
      //         NAME: "外挂工资管理",
      //         DISPLAYURL: "/sys-setting/salary"
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

          // 普通用户可以看到”绩效奖励查询、绩效考核文件“菜单
          if (this.menuData.length == 0) {
            this.menuData = [
              {
                DISPLAYURL: "/award-detail",
                ICONCLS: "icon-menu-grcx",
                ID: "20210604-1",
                ISLEAF: "1",
                LEVELCODE: "jxk001",
                NAME: "个人查询",
                PID: "20210604",
                URL: "",
                iconCls: "icon-menu-grcx",
                leaf: true,
                text: "个人查询"
              },
              {
                DISPLAYURL: "/check-files",
                ICONCLS: "icon-menu-khwjck",
                ID: "20210604-2",
                ISLEAF: "1",
                LEVELCODE: "jxk002",
                NAME: "考核文件查看",
                PID: "20210604",
                URL: "",
                iconCls: "icon-menu-khwjck",
                leaf: true,
                text: "考核文件查看"
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
    padding-left: 12px !important;
    &.is-active {
      color: #3f86f7 !important;
      background: #f5f6fd;
    }
  }
  .el-submenu {
    .el-menu-item {
      padding-left: 43px !important;
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