<template>
  <van-overlay :show="true">
    <div class="loading" @click.stop>
      <van-loading size="36px" vertical>加载中...</van-loading>
    </div>
  </van-overlay>
</template>

<script>
export default {
  name: "loading",
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
};
</script>

<style scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  padding-top: 5.333333rem;
  z-index: 9999;
}
</style>
