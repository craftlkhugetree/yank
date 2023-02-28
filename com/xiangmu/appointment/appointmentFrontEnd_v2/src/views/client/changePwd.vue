<template>
  <div style="padding:0 0 18px;">
    <el-form
      ref="form"
      :model="user"
      label-width="98px"
      class="userForm"
      size="small"
      :rules="rules1"
    >
      <el-alert class="alert" type="warning" show-icon :closable="false">
        <slot name="title">
          <p class="tips">
            <!-- <i class="el-icon-info"></i> -->
            密码至少6位，包含数字、大小写字母
          </p>
        </slot>
      </el-alert>
      <el-form-item label="原密码：" prop="OLDPWD">
        <el-input maxlength="100" v-model="user.OLDPWD" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="NEWPWD">
        <el-input maxlength="100" v-model="user.NEWPWD" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="RNEWPWD">
        <el-input maxlength="100" v-model="user.RNEWPWD" show-password></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { savePwd } from '@/api/admin/roles';

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      let reg = /^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9]{6,}$/;
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value === this.user.OLDPWD) {
        callback(new Error('新密码与原密码相同!'));
      } else if (value !== this.user.NEWPWD) {
        callback(new Error('两次输入密码不一致!'));
      } else if (!reg.test(value)) {
        callback(new Error('密码至少6位，包含数字、大小写字母!'));
      } else {
        callback();
      }
    };
    return {
      title: '修改密码',
      user: {
        OLDPWD: '',
        NEWPWD: '',
        RNEWPWD: '',
      },
      rules1: {
        OLDPWD: [{ required: true, message: '请输入原密码', trigger: 'change' }],
        NEWPWD: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          { min: 6, max: 100, message: '密码至少6位', trigger: 'change' },
          { validator: validatePass, trigger: 'change' },
        ],
        RNEWPWD: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          { min: 6, max: 100, message: '密码至少6位', trigger: 'change' },
          { validator: validatePass, trigger: 'change' },
        ],
      },
    };
  },
  computed: {},
  methods: {
    // 保存
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
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
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `保存成功！`,
                });
                this.$emit('finish')
              }
              //    else {
              //     if (res.message) {
              //       this.$message({
              //         showClose: true,
              //         type: 'error',
              //         message: '修改失败,' + res.message,
              //       });
              //     }
              //   }
            })
            .catch(err => {
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
  //   background: #e6f7ff !important;
  border-radius: 2px;
  //   border: 1px solid #91d5ff;
  /deep/ .el-alert__icon.is-big {
    font-size: 14px;
    line-height: 40px;
  }
  .tips {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 40px;
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      color: #1890ff;
      line-height: 40px;
      margin-left: 6px;
    }
    // .el-icon-info {
    //   display: inline-block;
    //   margin-right: 8px;
    //   color: #1890ff;
    // }
  }
}
/deep/ .el-alert__description {
  margin: 0;
}
</style>
