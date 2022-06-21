<template>
  <div>
    <van-nav-bar
      ref="navBar"
      title="在线报修"
      :border="false"
      right-text="功能首页"
        @click-right="$router.push('/fun-module')"
    />
    <!-- Tab页 -->
    <van-tabs
      ref="tabs"
      v-model="activeTab"
      :border="false"
      color="#00b09b"
      title-active-color="#00b09b"
      @click="changeTab"
    >
      <van-tab title="已报修" name="reported"></van-tab>
      <van-tab title="草稿" name="draft"></van-tab>
    </van-tabs>
    <reported :activeTab="activeTab"></reported>
  </div>
</template>

<script>
export default {
  components: {
    Reported: () => import("./reported"),
  },
  data() {
    return {
      activeTab: sessionStorage.getItem('reportTab') || 'reported',
    };
  },
  methods: {
    changeTab(name) {
      sessionStorage.setItem('reportTab', name);
    },
  },
  created() {
   sessionStorage.setItem('reportTab', 'reported'); 
  }
};
</script>

<style lang="scss" scoped>
/deep/ .van-nav-bar__text {
  color: #00b09b;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>
