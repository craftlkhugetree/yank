<template>
  <div>
    <div class="field-content">
      <div v-if="list.length == 0" style="color:#595959;">暂无申请表单</div>
      <div class="field-content-item" v-for="(item,index) in list" :key="index">
        <span><i v-if="item.isneed == '1'">*</i>{{item.name}}：</span>
        <el-button v-if="item.fieldtype == 'upload'" icon="el-icon-upload2" size="small">上传文件</el-button>
        <el-input
          v-else
          style="width: 300px;"
          size="small"
          v-model="item.placeholder"
          placeholder="输入提示内容"
          readonly
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resDetail: Object
  },
  data() {
    return {
      visible: false,
      list: []
    };
  },
  watch: {
    resDetail() {
      this.list = this.resDetail.fields;
    }
  }
};
</script>

<style lang="scss" scoped>
.field-content {
  padding: 20px 10px;
  .field-content-item {
    margin-bottom: 12px;
  }
  span {
    display: inline-block;
    margin-bottom: 4px;
    width: 100px;
    text-align: right;
    line-height: 20px;
    margin-right: 10px;
    vertical-align: middle;
  }
  .el-input {
    margin-bottom: 4px;
  }
  i {
    margin-right: 10px;
    color: #FF0000;
    font-size: 14px;
  }
}
</style>