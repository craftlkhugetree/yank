<template>
  <el-dialog
    custom-class="confirm-dialog"
    :visible.sync="visible"
    width="400px"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="confirm">
      <img src="@/assets/img/confirm-bg.png" alt />
      <div class="content" :style="{'text-align': align}">
        <h3>{{title}}</h3>
        <p>{{text}}</p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="showButton">
      <el-button @click="visible = false; $emit('doCancel')">{{cancelText}}</el-button>
      <el-button type="primary" @click="$emit('doConfirm')">{{confirmText}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
    cancelText: String,
    confirmText: String,
    align: {
        type: String,
        default: "left"
    },
    showButton: {
        type: Boolean,
        default: true
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
}
</style>
<style lang="scss">
.confirm-dialog {
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