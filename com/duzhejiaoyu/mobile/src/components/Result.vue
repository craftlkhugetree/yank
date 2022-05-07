<template>
  <van-dialog
    class="result-dialog"
    v-model="visible"
    width="100%"
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
      <img
        :src="
          type == 'success'
            ? require('@/assets/img/result-bg.png')
            : require('@/assets/img/result-fail-bg.png')
        "
        alt
      />
      <div class="content">
        <h3>{{ type == "success" ? "恭喜通过考试！" : "遗憾未通过考试！" }}</h3>
        <p>
          本次成绩为：<span class="score">{{ score }}分</span>
        </p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <van-button
        @click="
          visible = false;
          $emit('doCancel');
        "
        >{{ cancelText }}</van-button
      >
      <van-button type="primary" @click="$emit('doConfirm')">{{
        confirmText
      }}</van-button>
    </span>
  </van-dialog>
</template>

<script>
export default {
  name: "resultDialog",
  props: {
    score: Number,
    cancelText: String,
    confirmText: String,
    type: {
      type: String,
      default: "success",
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
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 45px;
    margin-bottom: 12px;
  }
  p {
    font-size: 28px;
    font-weight: 400;
    color: #666666;
    line-height: 42px;
  }
  .score {
    color: #3a78fc;
    font-weight: bold;
  }
}
</style>
<style lang="scss">
.result-dialog {
  border-radius: 4px;
  box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03),
    0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 6px 16px -8px rgba(0, 0, 0, 0.08);
}
</style>
