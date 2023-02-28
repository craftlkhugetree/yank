<template>
  <div class="main">
    <van-nav-bar
      title="黑名单"
      fixed
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
      ref="navBar"
    ></van-nav-bar>
    <!-------------------------- 列表 -------------------------->
    <van-search
      v-model="keyword"
      shape="round"
      placeholder="请输入工号或姓名"
      @search="onSearch"
      ref="searchBar"
      style="margin-top: 50px"
    />

    <div class="main-content">
      <van-tabs
        ref="tabs"
        v-model="activeTab"
        color="#3F86F7"
        title-active-color="#3F86F7"
        title-inactive-color="#999999"
        style="font-size: 28px"
      >
        <van-tab title="黑名单" name="1"></van-tab>
        <van-tab title="违规记录" name="2"></van-tab>
      </van-tabs>
      <list ref="break" :activeTab="activeTab" :keyword="keyword" @list2="get2"></list>
    </div>
  </div>
</template>

<script>
import list from './list';
export default {
  components: {
    list,
  },
  data() {
    return {
      activeTab: '1',
      isThisGrand: true,
      keyword: '',
    };
  },
  watch: {
    keyword(neww) {
      if (!neww) {
        this.$nextTick(() => {
          this.onSearch();
        });
      }
    },
  },
  methods: {
    // 查询页面
    onSearch() {
      if (this.activeTab == '1') {
        this.$refs.break.getTableData();
      } else {
        this.$refs.break.getTableData2();
      }
    },
    get2(rows) {
      this.activeTab = '2';
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background: #f6f6f6;
}
.main-content {
  background: #f6f6f6;
}
.van-list {
  padding: 12px;
  background: #f6f6f6;
}
</style>
