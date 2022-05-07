<template>
  <el-dialog
    custom-class="result-dialog"
    :visible.sync="visible"
    width="400px"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="confirm">
      <img :src="type == 'success' ? require('@/assets/img/result-bg.png') : require('@/assets/img/result-fail-bg.png')" alt />
      <div class="content">
        <h3>{{type=="success" ? "恭喜通过考试！" : "遗憾未通过考试！"}}</h3>
        <p>本次成绩为：<span class="score">{{score}}</span></p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false; $emit('doCancel')">{{cancelText}}</el-button>
      <el-button type="primary" @click="$emit('doConfirm')">{{confirmText}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    score: Number,
    cancelText: String,
    confirmText: String,
    type: {
      type: String,
      default: "success"
    }
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm {
  img {
    width: 400px;
    height: 160px;
    border-radius: 4px;
  }
  .content {
    padding: 20px 30px;
  }
  h3 {
    font-size: 18px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 26px;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 22px;
  }
  .score {
    color: #3A78FC;
    font-weight: bold;
  }
}
</style>
<style lang="scss">
.result-dialog {
  border-radius: 4px;
  box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03), 0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 6px 16px -8px rgba(0, 0, 0, 0.08);
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>