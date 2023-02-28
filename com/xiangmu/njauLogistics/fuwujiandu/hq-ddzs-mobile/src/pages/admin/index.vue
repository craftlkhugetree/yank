<template>
  <div>
    <role-bar></role-bar>
    <div class="title-bg">
      <tab-list :tabs="tabs" @signal="changeTab" :actN="actN"></tab-list>
    </div>
    <my v-if="actN == '0'"></my>
    <all v-else></all>
  </div>
</template>
<script>
export default {
  name: "admin",
  components: {
    tabList: () => import("@/components/tabList"),
    my: () => import("./my"),
    all: () => import("./all")
  },
  data() {
    return {
      actN: sessionStorage.getItem(this.global.TAB.tab1) + "" || "0",
      tabs: [
        {
          name: "0",
          title: "我的督查"
        },
        {
          name: "1",
          title: "全部督察"
        }
      ]
    };
  },
  methods: {
    changeTab(str) {
      this.actN = str;
      console.log(this.actN);
    }
  },
  beforeDestroy() {
    sessionStorage.setItem(this.global.TAB.tab1, this.actN);
  }
};
</script>
<style lang="scss" scoped>
.title-bg {
  margin-bottom: 0;
}
</style>
