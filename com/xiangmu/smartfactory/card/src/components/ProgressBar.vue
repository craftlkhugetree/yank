<template>
  <div class="progress">
    <div class="step" v-for="(item,index) in list" :key="item.id">
      <span class="tag">{{item.id}}</span>
      <span class="title">{{item.title}}</span>
      <span class="line" v-if="index < list.length - 1"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array
  }
}
</script>

<style lang="scss" scoped>
.progress {
  width: 100%;
  text-align: center;
  padding-top: 60px;
}
@media print {
	.progress{ padding-top: 0px;}
}
.step {
  display: inline-block;
  span {
    display: inline-block;
    font-weight: 400;
    line-height: 60px;
    margin-right: 20px;
    vertical-align: middle;
  }
  .tag {
    width: 60px;
    height: 60px;
    background: #e7eefe;
    border-radius: 30px;
    font-size: 36px;
    color: #3870ff;
    text-align: center;
  }
  .title {
    font-size: 24px;
    color: #373b4b;
  }
  .line {
    width: 80px;
    height: 8px;
    background: #c3d6fe;
    border-radius: 6px;
  }
}
</style>