<template>
  <el-breadcrumb separator="/" class="my-breadcrumb">
    <el-breadcrumb-item v-for="(item,index) in breadList" :key="index" :to="item.path">{{item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
    export default {
        name: "breadcrumb",
      props:{
        breadList:Array
      }
    }
</script>

<style scoped>

</style>
