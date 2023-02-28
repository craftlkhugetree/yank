<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <el-form
        ref="form"
        :model="user"
        label-width="98px"
        class="userForm"
        size="small"
        :rules="rules1"
      >
        <el-alert class="alert" type="info" :show-icon="false" :closable="false">
          <slot name="title">
            <p class="tips">
              <i class="el-icon-info"></i>
              密码至少六位
            </p>
          </slot>
        </el-alert>
        <el-form-item label="原密码：" prop="OLDPWD">
          <el-input maxlength="100" v-model="user.OLDPWD" show-password></el-input>
        </el-form-item>
        <el-form-item label="修改密码：" prop="NEWPWD">
          <el-input v-model="user.NEWPWD" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="RNEWPWD">
          <el-input v-model="user.RNEWPWD" show-password></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button size="small" type="primary" @click="save">保存</el-button>
      <el-button size="small" @click="closeDrawer">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { savePwd } from '@/api/roles';

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.NEWPWD) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      drawer: false,
      drawerLoading: false,
      title: '修改密码',
      user: {
        OLDPWD: '',
        NEWPWD: '',
        RNEWPWD: '',
      },
      rules1: {
        OLDPWD: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        NEWPWD: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 100, message: '密码至少6位', trigger: 'blur' },
        ],
        RNEWPWD: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 100, message: '密码至少6位', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {},
  methods: {
    // 打开抽屉
    openDrawer() {
      this.drawer = true;
    },
    // 关闭抽屉
    closeDrawer() {
      this.drawer = false;
      this.$refs.form.resetFields();
      this.user = {
        OLDPWD: '',
        NEWPWD: '',
        RNEWPWD: '',
      };
    },

    // 保存
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let pwds = {
            auth: JSON.stringify({
              userid: this.$store.state.userInfo.ID,
            }),
            data: JSON.stringify({
              OLDPWD: this.user.OLDPWD,
              NEWPWD: this.user.NEWPWD,
              RNEWPWD: this.user.RNEWPWD,
            }),
          };
          savePwd(pwds)
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `保存成功！`,
                });
                this.closeDrawer()
              }
              //  else {
              //   this.$message({
              //     showClose: true,
              //     type: 'error',
              //     message: '修改失败：' + res.data.message,
              //   });
              // }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: '修改失败：' + err,
              });
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add {
  width: 300px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  border: 1px dashed #d0d0d0;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  cursor: pointer;
}
.userForm {
  margin-left: 24px;
  width: 388px;
  .el-form-item__label {
    color: #5f6464 !important;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 16px;
  }
}
.alert {
  margin-bottom: 16px;
  height: 40px;
  background: #e6f7ff !important;
  border-radius: 2px;
  border: 1px solid #91d5ff;
  .el-alert--info.is-light {
    color: #1890ff !important;
  }
  .tips {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      color: #1890ff;
      line-height: 22px;
      margin-left: 6px;
    }
    .el-icon-info {
      display: inline-block;
      margin-right: 8px;
      color: #1890ff;
    }
  }
}
</style>
