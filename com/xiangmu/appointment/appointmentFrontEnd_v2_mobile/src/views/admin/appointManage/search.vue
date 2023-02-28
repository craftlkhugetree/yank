<template>
  <div class="main">
    <van-nav-bar title="预约管理查询" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <van-search v-model="keyword" placeholder="请输入关键字搜索" shape="round" @search="doSearch" />
    <!-------------------------- 列表 -------------------------->
    <div class="main-content">
      <list ref="listComp" :keyword="keyword" :immediateCheck="false"></list>
    </div>
  </div>
</template>

<script>
import list from "./list";
export default {
  components: {
    list
  },
  data() {
    return {
      keyword: null
    };
  },
  methods: {
    doSearch() {
      this.$refs.listComp.getList(1);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background: #f6f6f6;
}
.main-content {
  padding: 24px;
  background: #f6f6f6;
}
</style>