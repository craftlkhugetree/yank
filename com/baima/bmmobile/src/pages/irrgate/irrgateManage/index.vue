<template>
  <div>
    <van-nav-bar
      ref="navBar"
      title="水资源审批"
      :border="false"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <!-- Tab页 -->
    <!-- <van-tabs
      ref="tabs"
      v-model="activeTab"
      :border="false"
      color="#00b09b"
      title-active-color="#00b09b"
      @click="changeTab"
    >
      <van-tab title="灌溉资源管理" name="manage"></van-tab>
      <van-tab title="水资源审批" name="audit"></van-tab>
    </van-tabs> -->
    <manage v-if="activeTab === 'manage'"></manage>
    <audit v-else></audit>
  </div>
</template>

<script>
import Manage from './manage/index';
import Audit from './audit/index';
export default {
  components: {
    Manage,
    Audit,
  },
  data() {
    return {
      // activeTab: sessionStorage.getItem('curIrrTab') || 'audit',
      activeTab: 'audit',
    };
  },
  methods: {
    onClickRight() {
      this.$store.commit('setIsShowTabBar');
    },
    changeTab(name) {
      sessionStorage.setItem('curIrrTab', name);
    },
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
