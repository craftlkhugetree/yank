<template>
  <div class="main">
    <van-nav-bar :title="title" left-arrow fixed @click-left="$router.go(-1)" />
    <div style="width:100%;height:46px;"></div>
    <van-search v-model="keyword" placeholder="请输入关键字搜索" shape="round" @search="doSearch" />
    <!-------------------------- 列表 -------------------------->
    <div class="main-content">
      <list ref="listComp" :keyword="keyword" :activeTab="activeTab" :immediateCheck="false"></list>
    </div>
  </div>
</template>

<script>
import list from "./list";
export default {
  components: {
    list
  },
  props: {
    activeTab: String
  },
  data() {
    return {
      keyword: null
    };
  },
  computed: {
    title() {
      return this.activeTab=="1" ? "预约待审核查询" : "预约已审核查询"
    }
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