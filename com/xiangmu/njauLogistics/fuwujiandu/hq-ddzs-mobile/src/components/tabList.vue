<template>
  <van-tabs
    style="margin-right: auto"
    v-model="activeName"
    line-width="20"
    color="#006457"
    :ellipsis="false"
  >
    <van-tab
      v-for="t in tabs"
      :key="t.name"
      :title="t.title"
      :name="t.name"
      :title-class="activeName === t.name ? 'tab_choose' : 'tab_not_choose'"
    ></van-tab>
  </van-tabs>
</template>
<script>
export default {
  name: "TabList",
  props: {
    tabs: Array,
    actN: String
  },
  data() {
    return {
      activeName: this.actN || "0"
    };
  },
  watch: {
    activeName(val) {
      this.$emit("signal", val);
    }
  }
};
</script>
<style lang="scss" scoped></style>
