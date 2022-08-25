<template>
  <van-dialog
    :value="dVisible"
    :closeOnClickOverlay="false"
    width="90%"
    @confirm="submitDiag"
    @cancel="$emit('dropdown')"
    :show-cancel-button="hasCancel"
  >
    <template #title>
      <div class="diag">
        <img :src="require('st@tic/imgs/dialog.png')" />
        <span class="diag-title">{{ diagTitle }}</span>
      </div>
    </template>
    <span class="info44">{{ diagBody }}</span>
  </van-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    diagTitle: String,
    diagBody: String,
    hasCancel: Boolean,
    dVisible: Boolean,
  },
  methods: {
    submitDiag() {
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="scss" scoped>
.info44 {
  width: 341px;
  height: auto;
  overflow-wrap: break-word;
  color: rgba(31, 35, 47, 1);
  font-size: 14px;
  letter-spacing: -0.12098753452301025px;
  text-align: center;
  white-space: normal;
  line-height: 20px;
  display: block;
  margin: 20px auto;
}
.diag {
  width: 100%;
  height: 27px;
  text-align: left;
  margin-left: 10px;
  img {
    vertical-align: middle;
    width: 29px;
    height: 27px;
  }
  .diag-title {
    font-weight: bolder;
    vertical-align: middle;
    height: 25px;
    margin-top: 1px;
    width: 100%;
  }
}

/deep/ .van-dialog {
  min-height: 20%;
}
/deep/ .van-dialog__footer {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
/deep/ .van-dialog__cancel {
  margin: 0 10px;
  width: 120px;
  height: 42px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .van-button__text {
    height: 33px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 33px;
  }
}
/deep/ .van-dialog__confirm {
  margin: 0 10px;
  width: 120px;
  height: 42px;
  background: #00b09b;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .van-button__text {
    height: 33px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 33px;
  }
}
</style>
