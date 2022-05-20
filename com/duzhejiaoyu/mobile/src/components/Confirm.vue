<template>
  <van-dialog
    class="confirm-dialog"
    v-model="visible"
    width="90%"
    show-cancel-button
    :confirmButtonText="confirmText"
    :cancelButtonText="cancelText"
    :showConfirmButton="showButton"
    :showCancelButton="showButton"
    confirmButtonColor="#3A78FC"
    @confirm="$emit('doConfirm')"
    @cancel="
      visible = false;
      $emit('doCancel');
    "
  >
    <div class="confirm">
      <img src="@/assets/img/confirm-bg.png" alt />
      <div class="content" :style="{ 'text-align': align }">
        <h3>{{ title }}</h3>
        <p>{{ text }}</p>
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
      default: "left",
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
};
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
    font-weight: 500!important;
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
<style lang="scss" scoped>
.confirm-dialog {
  border-radius: 40px;
  box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03),
    0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 6px 16px -8px rgba(0, 0, 0, 0.08);
}
/deep/ .van-dialog__footer {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
/deep/ .van-dialog__cancel {
  margin: 0 20px;
  width: 300px;
  height: 72px;
  background: #ffffff;
  border-radius: 36px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .van-button__text {
    height: 36px;
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 36px;
  }
}
/deep/ .van-dialog__confirm {
  margin: 0 20px;
  width: 300px;
  height: 72px;
  background: #3a78fc;
  border-radius: 36px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .van-button__text {
    height: 36px;
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 36px;
  }
}
</style>
