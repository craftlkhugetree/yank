<template>
  <div class="searching">
    <img :src="src" alt />
    <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: require("@/assets/img/nodata.png")
    },
    text: {
      type: String,
      default: '正在查询订单信息，请稍后…'
    }
  }
}
</script>

<style lang="scss" scoped>
.searching {
  text-align: center;
  margin-top: 60px;
  img {
    width: 226px;
    height: 200px;
    margin-bottom: 30px;
  }
  p {
    font-size: 24px;
    color: rgba(55, 59, 75, 0.6);
    line-height: 33px;
    margin-bottom: 60px;
  }
}
</style>