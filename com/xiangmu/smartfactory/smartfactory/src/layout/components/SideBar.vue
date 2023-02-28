<template>
  <el-menu
    :default-active="$route.path"
    text-color="#6e7384"
    active-text-color="#3f86f7"
    active-background-color="#1B2032"
    router
    v-loading="loading"
  >
    <menu-list :menuData="menuData"></menu-list>
  </el-menu>
</template>

<script>
import MenuList from './MenuList.vue';
import { fetchUserMenu } from '@/api/admin/menu.js';
export default {
  components: {
    MenuList,
  },
  data() {
    return {
      loading: false,
      menuData: [],
      urls: [],
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
    // 用户菜单的所有链接
    getAllUrls(arr, urls) {
      arr.forEach(i => {
        if (i.children && i.children.length > 0) {
          this.getAllUrls(i.children, urls);
        } else {
          urls.push(i.path);
        }
      });
      return urls;
    },
    // 获取用户菜单
    getUserMenu() {
      this.loading = true;
      fetchUserMenu()
        .then(res => {
          this.loading = false;
          if (res.code == '000000') {
            this.menuData = res.data || [];
            // this.menuData.push({
            //   id: 213,
            //   parentId: 0,
            //   icon: 'el-icon-edit',
            //   name: '卸车单录单',
            //   path: '/recordUnload',
            //   visible: 1,
            //   sort: 0,
            // });
            // 用户菜单的所有链接
            this.urls = this.getAllUrls(this.menuData, []);
            if (this.urls.length > 0) {
              this.urls.push('/sys-setting/edit-pwd');
            }
          }
        })
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
}
</style>
