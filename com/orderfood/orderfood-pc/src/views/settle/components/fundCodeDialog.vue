<template>
  <el-dialog
    class="base-small-dialog"
    title="新增经费科目编号"
    :visible.sync="dialogVisible"
    :modal="false"
    :close-on-click-modal="false"
    width="300px"
    center
    @close="cancelDialog"
  >
    <slot></slot>
    <el-form ref="editForm" :model="editForm" :rules="rules">
      <el-form-item prop="fundsno">
        <el-input size="small" v-model="editForm.fundsno" placeholder="经费科目编号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" size="small" @click="saveFundCode" :loading="loading">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveFundCode } from "@/api/admin/settle";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      editForm: {
        fundsno: ""
      },
      rules: {
        fundsno: [
          { required: true, message: "请输入经费科目编号！", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();
    },
    // 保存
    saveFundCode() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = {
            fundsno: this.editForm.fundsno
          };
          saveFundCode(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功！"
                });
                this.dialogVisible = false;
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "保存失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + err
              });
            });
        }
      });
    }
  }
};
</script>

<style>
</style>