<template>
  <van-dialog
    class="confirm-dialog"
    v-model="visible"
    width="100%"
    show-cancel-button
    :confirmButtonText="confirmText"
    :cancelButtonText="cancelText"
    :showConfirmButton="showButton"
    :showCancelButton="showButton"
    confirmButtonColor="#3A78FC"
    @confirm="$emit('doConfirm')"
    @cancel="visible = false; $emit('doCancel')"
  >
    <div class="confirm">
      <img src="@/assets/img/confirm-bg.png" alt />
      <div class="content" :style="{'text-align': align}">
        <h3>{{title}}</h3>
        <p>{{text}}</p>
      </div>
    </div>
  </van-dialog>
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
      default: 'left'
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
    width: 100%;
    height: 274px;
    border-radius: 4px;
    object-fit: cover;
  }
  .content {
    padding: 20px 30px;
  }
  h3 {
    font-size: 32px;
    font-weight: 500;
    color: rgba(55, 59, 75, 0.85);
    line-height: 45px;
    margin-bottom: 12px;
  }
  p {
    font-size: 28px;
    font-weight: 400;
    color: #7e8081;
    line-height: 42px;
  }
}
</style>
<style lang="scss">
.confirm-dialog {
  border-radius: 40px;
  box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03), 0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 6px 16px -8px rgba(0, 0, 0, 0.08);
}
</style>