<template>
  <div>
    <van-nav-bar ref="navBar" title="本科生实习" :border="false"       right-text="功能首页"
      @click-right="$router.push('/fun-module')"/>
    <!-- Tab页 -->
    <!-- <van-tabs
      ref="tabs"
      v-model="activeTab"
      :border="false"
      color="#00b09b"
      title-active-color="#00b09b"
      @click="changeTab"
    >
      <van-tab title="实习申请" name="apply"></van-tab>
      <van-tab title="实习审批" name="audit"></van-tab>
    </van-tabs> -->
    <!-- <apply v-if="activeTab === 'apply'"></apply> -->
    <audit operDev="leader"></audit>
  </div>
</template>

<script>
// import Apply from "./prApply/index"
import Audit from "./prAudit/index"
export default {
  components: {
    // Apply,
    Audit
  },
  data() {
    return {
      // activeTab: sessionStorage.getItem("curPrTab") || "apply"
    };
  },
  methods: {
    changeTab(name) {
      sessionStorage.setItem("curPrTab", name)
    }
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