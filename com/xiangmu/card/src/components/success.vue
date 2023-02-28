<template>
  <div class="scan">
    <img class="bg" src="@/assets/img/success.png" alt />
    <p>{{text}}</p>
    <img class="btn" src="@/assets/img/back-btn.png" alt @click="backHome" />
  </div>
</template>

<script>
export default {
  props: {
    backUrl: String,
    text: String
  },
  data() {
    return {
      timer: null
    }
  },
  methods: {
    backHome() {
      this.$router.push(this.backUrl)
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  created() {
    this.timer = setTimeout(() => {
      this.backHome()
    }, 10 * 1000)
  }
}
</script>

<style lang="scss" scoped>
</style>