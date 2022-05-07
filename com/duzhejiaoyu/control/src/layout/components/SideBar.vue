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
          :class="{'is-active':$route.path.includes(child.DISPLAYURL)}"
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
import { getUserMenu } from "@/api/user";
export default {
  data() {
    return {
      loading: false,
      menuData: [],
      urls: [],
      menuData: [],
      // menuData: [
      //   {
      //     ID: "0",
      //     NAME: "培训资料",
      //     ISLEAF: "1",
      //     ICONCLS: "icon-menu-train",
      //     DISPLAYURL: "/train"
      //   },
      //   {
      //     ID: "1",
      //     NAME: "题库管理",
      //     ISLEAF: "1",
      //     ICONCLS: "icon-menu-question",
      //     DISPLAYURL: "/question"
      //   },
      //   {
      //     ID: "3",
      //     NAME: "入馆考试",
      //     ISLEAF: "1",
      //     ICONCLS: "icon-menu-exam",
      //     DISPLAYURL: "/exam"
      //   },
      //   {
      //     ID: "2",
      //     NAME: "系统配置",
      //     ISLEAF: "0",
      //     ICONCLS: "icon-menu-xtgl",
      //     children: [
      //       {
      //         ID: "2-1",
      //         NAME: "用户管理",
      //         DISPLAYURL: "/sys-setting/users"
      //       },
      //       {
      //         ID: "2-2",
      //         NAME: "参数配置",
      //         DISPLAYURL: "/sys-setting/params"
      //       },
      //       {
      //         ID: "2-3",
      //         NAME: "模块管理",
      //         DISPLAYURL: "/sys-setting/modules"
      //       },
      //       {
      //         ID: "2-4",
      //         NAME: "管理员管理",
      //         DISPLAYURL: "/sys-setting/admin"
      //       }
      //     ]
      //   },
      //   {
      //     ID: "4",
      //     NAME: "统计分析",
      //     ISLEAF: "0",
      //     ICONCLS: "icon-menu-chart",
      //     children: [
      //       {
      //         ID: "4-1",
      //         NAME: "题目分析",
      //         DISPLAYURL: "/analysis/question"
      //       },
      //       {
      //         ID: "4-2",
      //         NAME: "考试分析",
      //         DISPLAYURL: "/analysis/exam"
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