<template>
  <div>
    <van-nav-bar
      ref="navBar"
      title="科教资源"
      :border="false"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <!-- Tab页 -->
    <van-tabs
      ref="tabs"
      v-model="activeTab"
      :border="false"
      color="#00b09b"
      title-active-color="#00b09b"
      @click="changeTab"
    >
      <!-- <van-tab title="资源类型" name="type"></van-tab> -->
      <van-tab title="资源入驻管理" name="manage"></van-tab>
      <van-tab title="资源审批" name="audit"></van-tab>
      <!-- <van-tab title="资源维修" name="repair"></van-tab> -->
      <van-tab title="费用管理" name="fee"></van-tab>
    </van-tabs>
    <!-- <res-type v-if="activeTab === 'type'"></res-type> -->
    <res-manage v-if="activeTab === 'manage'"></res-manage>
    <res-audit v-if="activeTab === 'audit'" operDev="bm"></res-audit>
    <!-- <res-repair v-if="activeTab === 'repair'"></res-repair> -->
    <fee v-if="activeTab === 'fee'" :identity="'bm'"></fee>
  </div>
</template>

<script>
// import ResType from './resType';
import ResManage from './resManage';
import ResAudit from './resAudit';
// import ResRepair from './resRepair';
export default {
  components: {
    // ResType,
    ResManage,
    ResAudit,
    // ResRepair,
    Fee: () => import('./resApply/fee'),
  },
  data() {
    return {
      activeTab: sessionStorage.getItem('curEduTab') || 'type',
    };
  },
  methods: {
    changeTab(name) {
      sessionStorage.setItem('curEduTab', name);
    },
  },
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
