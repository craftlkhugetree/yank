<template>
  <el-drawer
    class="base-drawer"
    title="批量退回"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="600"
  >
    <div style="padding: 30px 80px 30px 30px;">
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="退回说明：" prop="note" :rules="[{required: true,message:'请填写说明信息'}]">
          <el-input
            v-model="editForm.note"
            type="textarea"
            maxlength="200"
            rows="5"
            resize="none"
            placeholder="请输入说明，不超过200字"
          ></el-input>
        </el-form-item>
        <common-reply type="1" @doFunc="chooseReturnReply"></common-reply>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import CommonReply from "../../../components/CommonReply";
export default {
  components: {
    CommonReply
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      editForm: {
        note: ""
      },
      selectArr: []
    };
  },
  methods: {
    closeDrawer() {
      this.$refs.editForm.resetFields();
    },

    // 选择退回回复
    chooseReturnReply(content) {
      this.editForm.note = content;
    },

    // 退回
    doSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let arr = this.selectArr.map(i => {
            return {
              type: "3",
              applyid: i.id,
              version: i.version,
              note: this.editForm.note
            };
          });
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/backBatch",
              isRep: true,
              data: arr
            })
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `退回成功`
                });
                this.drawer = false;
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `退回失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `退回失败：${err}`
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