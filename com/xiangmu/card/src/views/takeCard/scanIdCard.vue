<template>
  <div class="scan">
    <img class="bg" src="@/assets/img/scan.png" alt />
    <p>请把身份证放在屏幕下感应区</p>
    <div class="text">身份证号：{{idcard}}</div>
    <img v-if="!idcard" class="btn" src="@/assets/img/next-btn-gray.png" alt />
    <img v-else class="btn" src="@/assets/img/next-btn.png" alt @click="next" />
  </div>
</template>

<script>
import { readIdCard } from '@/api/card'
export default {
  data() {
    return {
      idcard: null,
      timer: null
    }
  },
  methods: {
    // 下一步
    next() {
      sessionStorage.setItem('idcard', this.idcard)
      this.$router.push('/takecard/searchorder')
    },
    // 读取身份证
    readIdCard() {
      readIdCard().then(res => {
          //console.log("读取身份证结果",res)
          let data = res.certNumber || ''
          if (data) {
            this.idcard = data
          } else {
            this.idcard = "";
          }
      }).catch(err => {
          console.log("读取身份证错误：" + err)
          this.idcard = "";
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
    // 每隔一秒读取身份证号
    this.timer = setInterval(() => {
      this.readIdCard()
    }, 3000)
  }
}
</script>

<style lang="scss" scoped>
</style>