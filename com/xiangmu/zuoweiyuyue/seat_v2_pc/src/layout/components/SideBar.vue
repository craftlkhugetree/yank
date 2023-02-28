<template>
  <el-menu
    :default-active="'/' + $route.path.split('/')[1]"
    text-color="#787C84"
    active-text-color="#fff"
    active-background-color="#3d7fff"
    router
    v-loading="loading"
  >
    <template v-for="item in menuData">
      <el-submenu
        v-if="item.ISLEAF=='0'"
        :key="item.ID"
        :index="item.ID"
        :class="{'is-active':activeSub(item)}"
      >
        <template slot="title">
          <i class="iconfont" :class="item.ICONCLS"></i>
          <span slot="title" class="name">{{item.NAME}}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.ID"
          :index="child.DISPLAYURL"
          :class="$route.path==child.DISPLAYURL?'is-active':''"
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
      menuData: []
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
          //  用户菜单的所有链接
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
          if (!this.urls.length) {
            this.$router.push("/no-right");
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    //子菜单选中时，二级菜单为激活状态
    activeSub(item) {
      let flag = false;
      let subUrls = item.children.map(v => v.DISPLAYURL);
      if (subUrls.includes(this.$route.path)) {
        flag = true;
      }
      return flag;
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
    &:hover {
      color: #fff;
    }
  }
  .el-menu-item {
    &.is-active {
      background: #3d7fff !important;
      span {
        font-weight: 600;
      }
    }
  }
  .el-submenu {
    .el-menu-item {
      padding-left: 58px !important;
      background: #0b1322;

      &.is-active {
        background: #3d7fff;
        color: #fff !important;
        span {
          // font-weight: 600;
          &::before {
            content: "";
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

.el-submenu.is-active.is-opened {
  .iconfont,
  .name {
    color: #fff !important;
    font-weight: 600;
  }
}
</style>