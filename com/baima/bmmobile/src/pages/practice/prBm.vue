<template>
  <div>
    <van-nav-bar
      ref="navBar"
      title="实习审批"
      :border="false"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <audit operDev="bm"></audit>
  </div>
</template>

<script>
import Audit from './prAudit/index';
export default {
  components: {
    Audit,
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
