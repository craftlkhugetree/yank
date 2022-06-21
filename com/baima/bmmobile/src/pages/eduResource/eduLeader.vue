<template>
  <div>
    <van-nav-bar ref="navBar" title="科教资源" :border="false"       right-text="功能首页"
      @click-right="$router.push('/fun-module')"/>
    <!-- Tab页 -->
    <van-tabs
      ref="tabs"
      v-model="activeTab"
      :border="false"
      color="#00b09b"
      title-active-color="#00b09b"
      @click="changeTab"
    >
      <van-tab title="我的资源" name="myres"></van-tab>
      <van-tab title="空闲资源" name="freeres"></van-tab>
      <van-tab title="申请记录" name="apply"></van-tab>
      <van-tab title="资源审批" name="audit"></van-tab>
      <van-tab title="报修记录" name="repair"></van-tab>
    </van-tabs>

    <res-list :key="1" v-if="activeTab === 'myres'" usestatus="3"></res-list>
    <res-list :key="2" v-if="activeTab === 'freeres'" usestatus="1"></res-list>
    <apply-list v-if="activeTab === 'apply'"></apply-list>
    <res-audit v-if="activeTab === 'audit'" operDev="leader"></res-audit>
    <repair v-if="activeTab === 'repair'" :applyerid="userInfo.ID"></repair>
  </div>
</template>

<script>
import ResList from "./resApply/resList";
import ApplyList from "./resApply/applyList";
import ResAudit from "./resAudit";
import Repair from "./resRepair"
export default {
  components: {
    ResList,
    ApplyList,
    ResAudit,
    Repair
  },
  data() {
    return {
      activeTab: sessionStorage.getItem("curEduTab") || "myres"
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  methods: {
    changeTab(name) {
      sessionStorage.setItem("curEduTab", name);
    }
  }
};
</script>

<style lang="scss">
/deep/ .van-nav-bar__text {
  color: #00b09b;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>