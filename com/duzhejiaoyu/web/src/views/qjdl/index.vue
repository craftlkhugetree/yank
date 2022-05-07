<template>
  <div class="qjdl">
    <iframe :src="qjdl.val" frameborder="0" scrolling="auto" :height="height" width="100%"></iframe>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      height: 600
    }
  },
  computed: mapState({
    qjdl: state => state.qjdl
  }),
  methods: {
    resetHeight() {
      this.height = document.body.clientHeight - 140
    }
  },
  created() {
    this.resetHeight()
    window.addEventListener('resize', () => {
      this.resetHeight()
    })
  }
}
</script>

<style lang="scss" scoped>
.qjdl {
  width: 100%;
  height: 100%;
}
</style>