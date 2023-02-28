<template>
  <div class="login clearfix">
    <img class="logo" src="@/../static/images/logo-small.png" alt />
    <div class="login-left">
      <div class="login-form">
        <h2>欢迎登录</h2>
        <h2>网上报修平台</h2>
        <div class="edit-box">
          <el-form ref="editForm" :model="editForm" :show-message="false">
            <el-form-item prop="loginname" required>
              <el-input v-model="editForm.loginname" placeholder="请输入登录账号" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item prop="pwd" required>
              <el-input
                type="password"
                v-model="editForm.pwd"
                placeholder="请输入登录密码"
                style="width:300px;"
              ></el-input>
            </el-form-item>
            <el-form-item prop="yzm" required>
              <el-input v-model="editForm.yzm" placeholder="请输入验证码" style="width:150px;"></el-input>
              <img class="yzm" :src="yzmUrl" alt="验证码" @click="getYzm" />
            </el-form-item>
            <el-button class="orange-btn" type="primary" :loading="loading" @click="doLogin">登录</el-button>
          </el-form>
          <p>版权所有 ©️ 2021 南京工程学院</p>
        </div>
      </div>
    </div>
    <div class="login-right"></div>
  </div>
</template>

<script>
let Base64 = require("js-base64").Base64;
export default {
  data() {
    return {
      editForm: {
        loginname: null,
        pwd: null,
        yzm: null
      },
      yzmUrl: null,
      loading: false
    };
  },
  methods: {
    // 获取验证码
    getYzm() {
      this.yzmUrl =
        window.g.idsUrl + "captcha/get?time=" + new Date().getTime();
    },

    // 登录
    doLogin() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = JSON.stringify(this.editForm);
          let params = { user: Base64.encode(data) };
          this.util
            .postAjax({
              code: this.global.idsCode,
              url: "NjitBxLogin/authUser",
              data: params
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$router.push("/");
              } else {
                this.getYzm();
                this.$message({
                  showClose: true,
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.getYzm();
              this.$message({
                showClose: true,
                type: "error",
                message: err
              });
            });
        }
      });
    }
  },
  created() {
    this.getYzm();
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 760px;
  position: relative;
  background: #ffffff;
  .logo {
    position: absolute;
    width: 262px;
    height: 40px;
    top: 40px;
    left: 60px;
  }
  .login-left {
    width: 65%;
    height: 100%;
    float: left;
    position: relative;
    .login-form {
      position: absolute;
      width: 420px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 60px;
      background: #ffffff;
      box-shadow: 0px 0px 8px 6px rgba(88, 106, 221, 0.05);
      border-radius: 10px;
      h2 {
        font-size: 36px;
        font-weight: 600;
        color: #424242;
        line-height: 50px;
      }
      .edit-box {
        margin-top: 60px;
        .yzm {
          vertical-align: middle;
          margin-left: 10px;
          cursor: pointer;
        }
        .el-button {
          width: 300px;
          height: 48px;
          font-size: 18px;
          border-radius: 30px;
          letter-spacing: 5px;
          margin-bottom: 30px;
        }
        p {
          font-size: 14px;
          color: #999999;
          line-height: 20px;
          text-align: center;
        }
      }
    }
  }
  .login-right {
    width: 35%;
    height: 100%;
    float: right;
    background: url("~@/../static/images/login-bg.png") no-repeat;
    background-size: cover;
  }
}
</style>