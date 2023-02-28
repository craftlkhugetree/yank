<template>
  <div class="login clearfix">
    <img class="logo" src="@/assets/img/logo-blue.png" alt />
    <!-- <h2 class="logo">智慧一卡通物流平台</h2> -->
    <div class="login-left">
      <div class="login-form">
        <h2>欢迎登录</h2>
        <h2>智慧一卡通物流平台</h2>
        <div class="edit-box">
          <el-form ref="editForm" :model="editForm" :show-message="false">
            <el-form-item prop="loginname" required>
              <el-input
                v-model="editForm.loginname"
                placeholder="请输入登录账号"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password" required>
              <el-input
                type="password"
                v-model="editForm.password"
                placeholder="请输入登录密码"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item prop="vcode" required>
              <el-input
                v-model="editForm.vcode"
                placeholder="请输入验证码"
                style="width: 150px"
                @keyup.enter.native="doLogin"
              ></el-input>
              <img class="yzm" :src="yzmUrl" alt="验证码" @click="getYzm" />
            </el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="doLogin"
            ></el-button>
          </el-form>
          <p>版权所有 ©️ 2022 南京昂克软件有限公司</p>
        </div>
      </div>
    </div>
    <div class="login-right"></div>
  </div>
</template>

<script>
import { doLogin, getVcode } from "@/api/login/login";
export default {
  data() {
    return {
      editForm: {
        loginname: null,
        password: null,
        vcode: null,
        vkey: null
      },
      yzmUrl: null,
      loading: false,
    };
  },
  methods: {
    // 获取验证码
    getYzm() {
      getVcode().then((res) => {
        if (res.code == "000000") {
          this.yzmUrl = res.data.image;
          this.editForm.vkey = res.data.vkey;
        }
      });
    },

    // 登录
    doLogin() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = { ...this.editForm };
          doLogin(params)
            .then((res) => {
              this.loading = false;
              if (res.code == "000000") {
                let access_token = res.data.access_token;
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("userInfo", JSON.stringify(res.data));
                this.$router.push("/");
              } else {
                this.getYzm();
                this.$message({
                  showClose: true,
                  type: "error",
                  message: res.msg,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.getYzm();
              this.$message({
                showClose: true,
                type: "error",
                message: err,
              });
            });
        }
      });
    },
  },
  created() {
    this.getYzm();
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 760px;
  position: relative;
  .logo {
    position: absolute;
    width: 226px;
    height: 32px;
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
        font-size: 32px;
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
          width: 316px;
          height: 64px;
          margin-bottom: 30px;
          background: url("~@/assets/img/login-btn.png") no-repeat;
          border: none;
          margin-left: -8px;
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
    background: url("~@/assets/img/login-bg.png") no-repeat;
    background-size: cover;
  }
}
</style>