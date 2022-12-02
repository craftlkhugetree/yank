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
      <el-submenu v-if="item.ISLEAF == '0'" :key="item.ID" :index="item.ID">
        <template slot="title">
          <i class="iconfont" :class="item.ICONCLS"></i>
          <span slot="title">{{ item.NAME }}</span>
        </template>
        <el-menu-item v-for="child in item.children" :key="child.ID" :index="child.DISPLAYURL">
          <span slot="title">{{ child.NAME }}</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else :key="item.ID" :index="item.DISPLAYURL" style="padding-left:30px;">
        <span slot="title">
          <i class="iconfont" :class="item.ICONCLS"></i>
          <span slot="title">{{ item.NAME }}</span>
        </span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { getUserMenu } from '@/api/admin/user';
export default {
  data() {
    return {
      loading: false,
      menuData: [],
      urls: [],
      // menuData: [
      //   {
      //     ID: "1",
      //     NAME: "模板管理",
      //     ISLEAF: "1",
      //     ICONCLS: "icon-menu-mbgl",
      //     DISPLAYURL: "/tpl-manage"
      //   },
      //   {
      //     ID: "2",
      //     NAME: "资源管理",
      //     ISLEAF: "1",
      //     ICONCLS: "icon-menu-zygl",
      //     DISPLAYURL: "/res-manage"
      //   },
      //   {
      //     ID: "3",
      //     NAME: "预约管理",
      //     ISLEAF: "1",
      //     ICONCLS: "icon-menu-yygl",
      //     DISPLAYURL: "/appoint-manage"
      //   },
      //   {
      //     ID: "4",
      //     NAME: "审核管理",
      //     ISLEAF: "1",
      //     ICONCLS: "icon-menu-shgl",
      //     DISPLAYURL: "/audit-manage"
      //   },
      //   {
      //     ID: "5",
      //     NAME: "用户组管理",
      //     ISLEAF: "1",
      //     ICON: "icon-menu-yhzgl",
      //     DISPLAYURL: "/usergroup-manage"
      //   },
      //   {
      //     ID: "6",
      //     NAME: "系统管理",
      //     ISLEAF: "0",
      //     ICON: "icon-menu-xtgl",
      //     children: [
      //       { ID: "2-1", NAME: "角色权限", DISPLAYURL: "/sys-manage/roles" },
      //       { ID: "2-2", NAME: "参数设置", DISPLAYURL: "/sys-manage/params" },
      //       { ID: "2-3", NAME: "黑名单管理", DISPLAYURL: "/sys-manage/blacklist" },
      //       { ID: "2-4", NAME: "消息配置", DISPLAYURL: "/sys-manage/notice" }
      //     ]
      //   }
      // ]
    };
  },
  watch: {
    urls() {
      this.redirect();
    },
    '$route.path'() {
      this.redirect();
    },
  },
  methods: {
    redirect() {
      // 如果当前链接不在菜单中 则跳转到第一个菜单
      if (this.urls.length > 0) {
        if (!this.urls.some(i => this.$route.path.includes(i))) {
          this.$router.push(this.urls[0]);
        }
      } else {
        this.$router.push('/no-right');
      }
    },
    // 获取用户菜单
    getUserMenu() {
      this.loading = true;
      getUserMenu()
        .then(res => {
          this.loading = false;
          this.menuData = res || [];

//           this.menuData.unshift({
//             LEVELCODE: '00i011',
//             ICONCLS: 'message-icon',
//             PID: '16000-033',
//             DISPLAYURL: '/analyze/resource',
//             ID: '16000-g33',
//             text: 'ld统计',
//             leaf: true,
//             iconCls: 'message-icon',
//             URL: '',
//             ISLEAF: '1',
//             NAME: '资源统计',
//           });
//           this.menuData.unshift({
//             LEVELCODE: '00i011',
//             ICONCLS: 'message-icon',
//             PID: '16000-033',
// DISPLAYURL: '/analyze/system',
//             ID: '16000-g3334',
//             text: 'ld统计',
//             leaf: true,
//             iconCls: 'message-icon',
//             URL: '',
//             ISLEAF: '1',
//             NAME: '系统统计',
//           });

          // 用户菜单的所有链接
          this.urls = [];
          this.menuData.forEach(i => {
            if (i.ISLEAF == '1') {
              this.urls.push(i.DISPLAYURL);
            } else {
              i.children.forEach(j => {
                this.urls.push(j.DISPLAYURL);
              });
            }
          });
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          this.loading = false;
        });
    },
  },
  created() {
    this.getUserMenu();
  },
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
      padding-left: 58px !important;
      &.is-active {
        background: #f5f6fd;
        span {
          font-weight: 600;
          &::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: #3f86f7;
            margin-right: 10px;
            margin-left: -18px;
          }
        }
      }
    }
  }
}
</style>