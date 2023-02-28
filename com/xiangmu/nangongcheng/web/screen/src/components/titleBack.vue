<template>
  <div class="tb div_flex">
    <span @click="$router.push(route)" class="title">{{ title }}&nbsp;&nbsp;></span>
    <span class="name">&nbsp;&nbsp;{{ name }}</span>
    <el-button plain @click="goBack" class="btn">返&nbsp;回</el-button>
  </div>
</template>

<script>
export default {
  name: 'TitleBack',
  props: {
    title: String,
    route: String,
    name: {
      type: String,
    },
  },
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.tb {
  width: 100%;
  .title {
    line-height: 36rem;
    height: 36rem;
    @include fz(14rem, #333);
    opacity: 0.4;
    cursor: pointer;
  }
  .name {
    line-height: 36rem;
    height: 36rem;
    @include fz(14rem, #333);
  }
  .btn {
    margin-left: auto;
    font-size: $arq *  14rem;
  }
}
</style>
