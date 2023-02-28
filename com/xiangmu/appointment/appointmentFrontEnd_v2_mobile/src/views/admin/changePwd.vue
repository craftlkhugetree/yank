<template>
  <div class="wrapper">
    <van-nav-bar
      title="修改密码"
      fixed
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="jumpSearch"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <section class="main-wapperr">
      <van-form @submit="onSubmit" ref="form">
        <van-field
          label="原密码："
          v-model="user.OLDPWD"
          name="OLDPWD"
          maxlength="100"
          type="password"
          :rules="rules.OLDPWD"
          placeholder="请输入"
        ></van-field>
        <van-field
          label="新密码："
          v-model="user.NEWPWD"
          name="NEWPWD"
          maxlength="100"
          type="password"
          :rules="rules.NEWPWD"
          placeholder="请输入"
        ></van-field>
        <van-field
          label="确认密码："
          v-model="user.RNEWPWD"
          name="RNEWPWD"
          maxlength="100"
          type="password"
          :rules="rules.RNEWPWD"
          placeholder="请输入"
        ></van-field>
        <!-- <el-form-item label="新密码：" prop="NEWPWD">
          <el-input maxlength="100" v-model="user.NEWPWD" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="RNEWPWD">
          <el-input maxlength="100" v-model="user.RNEWPWD" show-password></el-input>
        </el-form-item> -->
        <div style="margin: 16px">
          <van-button block type="primary" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </section>
  </div>
</template>
<script>
import { savePwd } from '@/api/admin/roles';

export default {
  name: 'onChangePwd',
  data() {
    return {
      title: '修改密码',
      user: {
        OLDPWD: '',
        NEWPWD: '',
        RNEWPWD: '',
      },
      pwdMsg: '请输入新密码',
      rules: {
        OLDPWD: [{ required: true, message: '请输入原密码', trigger: 'onChange' }],
        NEWPWD: [
          {
            pattern: /^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9]{6,}$/,
            message: '密码至少6位，包含数字、大小写字母!',
            trigger: 'onChange',
          },
          {
            validator: value => this.isSame(value),
            message: '两次输入密码需一致，且新密码与原密码不能相同',
            trigger: 'onChange',
          },
        ],
        RNEWPWD: [
          {
            pattern: /^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9]{6,}$/,
            message: '密码至少6位，包含数字、大小写字母!',
            trigger: 'onChange',
          },
          {
            validator: value => this.isSame(value),
            message: '两次输入密码需一致，且新密码与原密码不能相同',
            trigger: 'onChange',
          },
          //   {
          //     validator: value => this.notSame(value),
          //     message: '两次输入密码不一致',
          //     trigger: 'onChange',
          //   },
          //   {
          //     validator: value => this.validateReg(value),
          //     message: '密码至少6位，包含数字、大小写字母!',
          //     trigger: 'ononChange',
          //   },
        ],
      },
    };
  },
  computed: {},
  methods: {
    isSame(val) {
      return val !== this.user.OLDPWD && val === this.user.NEWPWD;
    },
    notSame(val) {
      return val === this.user.NEWPWD;
    },
    validateReg(val) {
      let reg = /^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9]{6,}$/;
      return reg.test(val);
    },
    validatePass(value, rule) {
      let reg = /^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9]{6,}$/;
      if (value === '') {
        this.rules.RNEWPWD.message = '请再次输入密码';
      } else if (value === this.user.OLDPWD) {
        this.rules.RNEWPWD.message = '新密码与原密码相同!';
      } else if (value !== this.user.NEWPWD) {
        this.rules.RNEWPWD.message = '两次输入密码不一致!';
      } else if (!reg.test(value)) {
        this.rules.RNEWPWD.message = '密码至少6位，包含数字、大小写字母!';
      } else {
        this.$forceUpdate();
        return true;
      }
      this.$forceUpdate();
      return false;
    },
    jumpSearch() {
      this.$router.push({
        name: 'res-search',
      });
    },
    // 保存
    onSubmit() {
      this.$refs.form.validate().then(valid => {
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
              this.$toast.success(`保存成功！`);
              this.$router.push('/center');
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
            this.$toast.fail('修改失败：');
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wapperr {
  //   background: #f6f6f6;
  margin-top: 88px;
}
/deep/ .van-cell__title.van-field__label {
  font-size: 28px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #474d51;
  vertical-align: middle;
}
// /deep/ .van-field__value {
//   &::before {
//     content: '\A';
//     white-space: pre;
//   }
// }
/deep/ .van-button--primary {
  background-color: #3f86f7;
}
</style>
