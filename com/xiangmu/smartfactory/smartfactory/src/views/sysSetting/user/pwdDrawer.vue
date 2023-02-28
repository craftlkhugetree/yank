<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <!-------------------- 保存 -------------------->
      <el-form ref="editForm" :model="editForm" label-width="100px" label-position="right">
        <el-form-item
          prop="PWD"
          label="新密码："
          style="margin-bottom:16px;"
          :rules="[{required:true, trigger:'change', message: '请输入新密码'}]"
        >
          <el-input
            show-password
            v-model="editForm.PWD"
            placeholder="请输入新密码"
            size="small"
            style="width:360px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="CONFIRMPWD"
          label="确认密码："
          style="margin-bottom:16px;"
          :rules="[{required:true, validator: checkPwd, trigger:'change'}]"
        >
          <el-input
            show-password
            v-model="editForm.CONFIRMPWD"
            placeholder="请再次输入新密码"
            size="small"
            style="width:360px;"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="savePwd">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { resetPwd } from "@/api/admin/user.js";
export default {
  data() {
    return {
      title: null,
      drawer: false,
      drawerLoading: false,
      editForm: {
        id: null,
        PWD: null,
        CONFIRMPWD: null
      }
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        PWD: null,
        CONFIRMPWD: null
      };
    },

    checkPwd(rule, value, callback) {
      if(!value) {
        return callback(new Error("请再次输入新密码!"));
      }else if (value !== this.editForm.PWD) {
        return callback(new Error("输入的确认密码与新密码不一致！"));
      } else {
        callback();
      }
    },

    // 保存
    savePwd() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = {
              userId: this.editForm.id,
              newPwd: this.editForm.PWD
          };
          resetPwd(param)
            .then(res => {
              this.drawerLoading = false;
              if (res.code == "000000") {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功！"
                });
                this.drawer = false;
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "保存失败：" + res.msg
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
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

<style lang="scss" scoped>
.drawer-container {
  padding: 30px;
}
</style>
