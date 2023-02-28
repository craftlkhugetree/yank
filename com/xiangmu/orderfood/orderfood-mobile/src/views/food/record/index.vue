<template>
  <div class="main">
    <van-nav-bar title="订餐记录" fixed :border="false" left-arrow @click-left="$router.push('/home')"></van-nav-bar>
    <!-------------------------- 列表 -------------------------->
    <div class="main-list">
      <van-tabs
        class="nav-tab"
        @click="onClick"
        v-model="activeTab"
        color="#3F86F7"
        title-active-color="#3F86F7"
        title-inactive-color="#999999"
      >
        <van-tab title="单位订餐" name="group">
          <list :activeTab="'group'" v-show="activeTab=='group'"></list>
        </van-tab>
        <van-tab title="个人订餐" name="self">
          <list :activeTab="'self'" v-show="activeTab=='self'"></list>
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
      activeTab: sessionStorage.getItem("recordTab") || "group"
    };
  },
  methods: {
    onClick(name, title) {
      this.activeTab = name;
      sessionStorage.setItem("recordTab", name);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background: #f6f6f6;
}
.main-list {
  min-height: 1300px;
  padding-top: 82px;
  padding-bottom: 88px;
  background: #f6f6f6;
}
.van-list {
  background: #f6f6f6;
}

/deep/ .nav-tab {
  color: #7d7d80;
  .van-tab__text {
    padding: 6px;
  }
  .van-tab--active .van-tab__text {
    border-bottom: 4px solid #3f86f7;
    font-weight: 600;
  }
  .van-tabs__line {
    height: 0;
  }
}
</style>