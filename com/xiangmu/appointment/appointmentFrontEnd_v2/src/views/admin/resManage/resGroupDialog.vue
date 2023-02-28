<template>
  <el-dialog
    class="base-small-dialog"
    title="新增资源集"
    :visible.sync="dialogVisible"
    :modal="false"
    :close-on-click-modal="false"
    width="300px"
    center
    @close="cancelDialog"
  >
    <slot></slot>
    <el-form ref="editForm" :model="editForm" :rules="rules">
      <el-form-item prop="name">
        <el-input v-model="editForm.name" placeholder="资源集名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" size="small" @click="saveResGroup" :loading="loading">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveResGroup } from "@/api/admin/res";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      editForm: {
        name: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入资源集名称！", trigger: "change" }
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
    saveResGroup() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = {
            id: "",
            name: this.editForm.name
          };
          saveResGroup(data)
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