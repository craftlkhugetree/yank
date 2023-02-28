<template>
  <div class="card">
      <progress-bar :list="progressList"></progress-bar>
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
              {id:1,title:"扫描身份证"},
              {id:2,title:"查询订单"},
              {id:3,title:"确认取卡"},
          ]
      }
  }
}
</script>

<style>
</style>