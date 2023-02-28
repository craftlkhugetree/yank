<template>
  <div class="main">
    <van-nav-bar title="智慧校园预约平台" fixed :border="false" left-arrow @click-left="$router.go(-1)">
      <template #right>
        <van-icon name="search" size="18" @click="toSearch" />
      </template>
    </van-nav-bar>
    <!-------------------------- 列表 -------------------------->
    <div class="main-content">
      <van-tabs
        v-model="activeTab"
        color="#3F86F7"
        title-active-color="#3F86F7"
        title-inactive-color="#999999"
      >
        <van-tab title="待审核" name="1">
          <list :activeTab="'1'"></list>
        </van-tab>
        <van-tab title="已审核" name="2">
          <list :activeTab="'2'"></list>
        </van-tab>
      </van-tabs>
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
      activeTab: sessionStorage.getItem("auditTab") || "1"
    };
  },
  methods: {
    // 查询页面
    toSearch() {
      sessionStorage.setItem("auditTab", this.activeTab);
      this.$router.push(`/audit-manage/search/${this.activeTab}`);
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
  padding: 88px 0;
  background: #f6f6f6;
}
.van-list {
  padding: 12px;
  background: #f6f6f6;
}
</style>