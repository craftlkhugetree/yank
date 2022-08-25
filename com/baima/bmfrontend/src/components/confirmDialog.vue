<template>
  <el-dialog
    v-if="dVisible"
    :visible.sync="dVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="false"
    :show-close="false"
    width="50%"
  >
    <template #title>
      <div class="diag">
        <img :src="require('st@tic/images/dialog.png')" />
        <span class="diag-title">{{ diagTitle }}</span>
      </div>
    </template>
    <span class="info44">{{ diagBody }}</span>
    <div slot="footer" class="dialog-footer">
      <div class="my-button" @click="$parent.dVisible = false" v-if="hasCancel">
        取 消
      </div>
      <div class="my-button green" @click="submitDiag()">确 定</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    diagTitle: String,
    diagBody: String,
    dVisible: Boolean,
    hasCancel: Boolean
  },
  methods: {
    submitDiag() {
      this.$emit("confirm");
    }
  }
};
</script>

<style scoped lang="scss">
.info44 {
  width: 341px;
  height: 20px;
  overflow-wrap: break-word;
  color: rgba(31, 35, 47, 1);
  font-size: 14px;
  letter-spacing: -0.12098753452301025px;
  text-align: left;
  white-space: nowrap;
  line-height: 20px;
  display: block;
  margin: 20px 0 0 0;
}
.diag {
  width: 121px;
  height: 27px;
  text-align: left;
  img {
    vertical-align: middle;
    width: 29px;
    height: 27px;
  }
  .diag-title {
    vertical-align: middle;
    height: 25px;
    margin-top: 1px;
    width: 72px;
  }
}
</style>
