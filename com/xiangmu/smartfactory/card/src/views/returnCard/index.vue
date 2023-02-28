<template>
  <div class="card">
    <progress-bar class="noPrint" :list="progressList"></progress-bar>
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
export default {
  components: {
    ProgressBar
  },
  data() {
    return {
      progressList: [
        { id: 1, title: '插入卡片' },
        { id: 2, title: '查询订单' },
        { id: 3, title: '打印订单' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
	@media print {
		.noPrint{display:none;}
	}
</style>