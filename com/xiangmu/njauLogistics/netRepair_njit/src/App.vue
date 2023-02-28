<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    userRoles() {
      return this.$store.state.userRoles;
    }
  },
  methods: {
    // 根据角色进入不同的页面
    setPath() {
      let roleIds = this.userRoles.map(i => i.ID);
      let url = "";
      // 接报修人员 打开维修办理页面
      if (roleIds.includes(`${this.util.webUserID}-2`)) {
        url = "/repair-manage/handle";
        // 维修责任人 打开派单管理页面
      } else if (roleIds.includes(`${this.util.webUserID}-3`)) {
        url = "/repair-manage/dispatch";
        // 全校师生 打开我要报修页面
      } else if (roleIds.includes(`${this.util.webUserID}-1`)) {
        url = "/repair-apply";
      } else {
        let urls = sessionStorage.getItem("urls")
        url = urls ? JSON.parse(urls)[0] : "";
      }
      if(url) {
        this.$router.push(url);
      } else {
        alert("该用户没有访问权限！");
      }
    }
  },
  mounted() {
    // this.$router.push('/map')
    // return
    let ids = this.util.getCookieByName('IDSTGC') || location.host.indexOf('localhost') > -1
    if (ids) {
    // 获取用户信息
    this.$store.dispatch("getUserInfo");
    // 获取用户部门
    this.$store.dispatch("getUserDept");
    // 获取用户角色和菜单
    Promise.all([
      this.$store.dispatch("getUserRoles"),
      this.$store.dispatch("getUserMenu")
    ]).then(() => {
      // 通过用户角色判断进入系统时所进的页面
      let path = this.$route.path;
      if (path === "/") {
        this.setPath();
      }
    });
    // 获取维修单位列表
    this.$store.dispatch("getDeptList");
  }}
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  min-width: 1400px;
}
</style>
