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
      <van-tab title="待处理" name="pending"></van-tab>
      <van-tab title="已处理" name="processed"></van-tab>
      <van-tab title="已转移" name="transfered"></van-tab>
    </van-tabs>
    <repaired :activeTab="activeTab"></repaired>
  </div>
</template>

<script>
export default {
  components: {
    Repaired: () => import('./repaired'),
  },
  data() {
    return {
      activeTab: sessionStorage.getItem('repairTab') || 'pending',
    };
  },
  methods: {
    changeTab(name) {
      sessionStorage.setItem('repairTab', name);
    },
  },
  created() {
   sessionStorage.setItem('repairTab', 'pending'); 
  },
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
