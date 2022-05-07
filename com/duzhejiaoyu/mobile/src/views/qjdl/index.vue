<template>
  <div class="qjdl">
    <!-- <iframe :src="qjdl.val" frameborder="0" scrolling="auto" height="1040px" width="100%"></iframe> -->
    <iframe :src="qjdl.val" frameborder="0" scrolling="auto" :height="tbHeight" width="100%"></iframe>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      height: 600,
      that: this,
    }
  },
  computed: mapState({
    qjdl: state => state.qjdl,
    tbHeight: state => state.tabbarHeight || that.height,
  }),
  methods: {
    resetHeight() {
      this.height = document.body.clientHeight - 120
    }
  },
  created() {
    // this.resetHeight()
    // window.addEventListener('resize', () => {
    //   this.resetHeight()
    // })
  }
}
</script>

<style lang="scss" scoped>
.qjdl {
  width: 100%;
  height: 100%;
}
</style>