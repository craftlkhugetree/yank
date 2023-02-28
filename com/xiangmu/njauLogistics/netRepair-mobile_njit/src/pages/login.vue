<template>
  <div class="login clearfix">
    <div class="login-left">
      <div class="login-form">
        <h2>欢迎登录</h2>
        <div class="edit-box">
          <el-form ref="editForm" :model="editForm" :show-message="false">
            <el-form-item prop="loginname" required>
              <el-input
                v-model="editForm.loginname"
                placeholder="请输入登录账号"
                style="width: 70%"
              ></el-input>
            </el-form-item>
            <el-form-item prop="pwd" required>
              <el-input
                type="password"
                v-model="editForm.pwd"
                placeholder="请输入登录密码"
                style="width: 70%"
              ></el-input>
            </el-form-item>
            <el-form-item prop="yzm" required>
              <el-input
                v-model="editForm.yzm"
                placeholder="请输入验证码"
                style="width: 35%"
                @keyup.enter.native="doLogin"
              ></el-input>
              <img class="yzm" :src="yzmUrl" alt="验证码" @click="getYzm2" />
            </el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="doLogin"
              style="width: 70%"
              >登录</el-button
            >
          </el-form>
          <!-- <p>版权所有 ©️ 2022 南京昂克软件有限公司</p> -->
        </div>
      </div>
    </div>
    <div class="logo"></div>
  </div>
</template>

<script>
import { doLogin, getOpenId, getYzm2 } from "@/assets/js/api";
let Base64 = require("js-base64").Base64;
export default {
  data() {
    return {
      editForm: {
        loginname: null,
        pwd: null,
        yzm: null,
      },
      yzmUrl: null,
      vkey: null,
      loading: false,
      openId: "",
      code: '',
    };
  },
  computed: {
    userRoles() {
      return this.$store.state.userRoles;
    },
  },
  methods: {
    // 获取验证码
    getYzm() {
      this.yzmUrl =
        window.g.idsUrl + "captcha/get?time=" + new Date().getTime();
    },

    // 登录
    doLogin() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let data = JSON.stringify({ vkey: this.vkey, openid: this.openId, ...this.editForm });
          let params = { user: Base64.encode(data) };
          doLogin(params)
            .then((res) => {
              this.loading = false;
              if (res.success) {
                this.setPath();
              } else {
                this.getYzm2();
              }
            })
            .catch((err) => {
              this.loading = false;
              this.getYzm2();
              this.$$toast.fail(err);
            });
        }
      });
    },
    // 根据角色进入不同的页面
    setPath() {
      let ids = this.util.getCookieByName("IDSTGC");
      let userInfo = this.$store.state.userInfo;
      let flag = userInfo.ID;
      if (ids) {
        if (flag) {
          this.toPath();
        } else {
          Promise.all([this.$store.dispatch("getUserInfo")]).then(() => {
            this.toPath();
          });
        }
      }
    },
    toPath() {
      let nowUrl = location.href;
      sessionStorage.setItem("angkeNowUrl", nowUrl);
      this.$router.push("/index");
    },
    getOpenId() {
      getOpenId(this.code)
        .then((res) => {
          if (res && res.openid) {
            this.openId = res.openid;
            let data = JSON.stringify({ openid: this.openId });
            let params = { user: Base64.encode(data) };
            doLogin(params).then((res) => {
              if (res && res.success) {
                this.setPath();
              } else {
                // this.getYzm2();
              }
            });
          }
        })
        .catch((e) => {
          this.$toast.fail("openid获取失败", e);
        });
    },
    getYzm2() {
      getYzm2().then((res) => {
        if (res && res.code === "000000") {
          this.yzmUrl = res.data.image;
          this.vkey = res.data.vkey;
        }
      });
    },
    GetRequest() {
      var url = location.search;
      //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
  },
  created() {
    this.getYzm2();
    let obj = this.GetRequest()
    if(obj.code) {
      this.code = obj.code
      this.getOpenId();
    }
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: calc(100vw);
  height: calc(100vh);
  position: relative;
  background: #ffffff;
  overflow-y: auto;
  .logo {
    position: absolute;
    width: 100%;
    height: 56.5%;
    background: url("../../static/images/njit_login.png") no-repeat;
    background-size: cover;
    bottom: 0;
  }
  .login-left {
    z-index: 99;
    width: 100%;
    position: relative;
    margin-top: 240px;
    .login-form {
      margin: 0 calc(15vw);
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ffffff;
      h2 {
        display: inline-block;
        width: 70%;
        text-align: center;
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
}
/deep/ .el-input__inner {
  background: #f7f5fb;
  border-radius: 40px;
}
</style>