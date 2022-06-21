<template>
  <div>
    <van-nav-bar ref="navBar" title="本科生实习" :border="false"       right-text="功能首页"
      @click-right="$router.push('/fun-module')"/>
    <apply></apply>
  </div>
</template>

<script>
import Apply from "./prApply/index"
export default {
  components: {
    Apply
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