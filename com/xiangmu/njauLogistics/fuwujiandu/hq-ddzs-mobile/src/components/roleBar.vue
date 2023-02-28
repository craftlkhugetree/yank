<template>
  <van-nav-bar
    :title="title"
    fixed
    v-if="global.showNav"
    :right-text="hasRight ? '' : global.barRight"
    @click-right="hasRight ? void 0 : $router.push('/choose-role')"
  />
</template>
<script>
export default {
  name: "RoleBar",
  props: {
    title: { type: String, default: "督导助手" },
    noRight: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasRight() {
      let aim = this.common.getStore("userRoles");
      return this.noRight || aim.length === 1;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .van-nav-bar__text {
  color: $c-green;
}
</style>
