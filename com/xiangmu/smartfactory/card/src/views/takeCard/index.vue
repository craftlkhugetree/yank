<template>
  <div class="card">
    <div class="header" v-if="type > 0">
      <div class="page">{{ text }}</div>
    </div>
    <progress-bar :list="progressList"></progress-bar>
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar';
export default {
  components: {
    ProgressBar,
  },
  data: function() {
    return {
      text: '当前为【装车步骤】',
      type: sessionStorage.getItem('loadType'),
      progressList: [
        { id: 1, title: '扫描身份证' },
        { id: 2, title: '查询订单' },
        { id: 3, title: '确认取卡' },
      ],
    };
  },
  created: function() {
    if (this.type == 1) {
      this.text = '当前为【装车步骤】';
    } else if (this.type == 2) {
      this.text = '当前为【卸车步骤】';
    }
  },
};
</script>

<style lang="scss" scoped>
.card {
  .header {
    float: left;
    height: 60px;
    width: 900px;
    background: url('~@/assets/img/pwrapper.png') 100% no-repeat;
    background-size: 100% 100%;
    .page {
      height: 40px;
      background: url('~@/assets/img/page.png') 100% no-repeat;
      background-size: 100% 100%;
      width: 320px;
      margin: 0 auto;
      text-align: center;
      overflow-wrap: break-word;
      color: rgba(56, 112, 255, 1);
      font-size: 20px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      white-space: nowrap;
      line-height: 40px;
    }
  }
}
</style>
