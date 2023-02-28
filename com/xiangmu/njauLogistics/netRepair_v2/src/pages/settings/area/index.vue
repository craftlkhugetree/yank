<template>
  <el-row :gutter="38">
    <!--------------------------- 学生公寓 --------------------------->
    <el-col :span="12">
      <table-list title="学生公寓" type="1"></table-list>
    </el-col>
    <!--------------------------- 校园其他楼宇 --------------------------->
    <el-col :span="12">
      <table-list title="校园其他楼宇" type="2"></table-list>
    </el-col>
  </el-row>
</template>

<script>
import tableList from "./table";
export default {
  components: {
    tableList
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  min-height: 800px;
}
</style>