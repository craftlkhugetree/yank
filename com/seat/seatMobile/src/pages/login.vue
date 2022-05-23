<template>
  <div>
    <div class="bindcontent">
      <div class="login-box">
        <h3>用户绑定</h3>
        <p>
          <i>
            <van-icon name="manager" color="#B8BBBE" size="20" />
          </i>
          <input type="text" v-model="loginname" placeholder="请输入用户名" value id="loginname" />
        </p>
        <p>
          <i>
            <van-icon name="lock" color="#B8BBBE" size="20" />
          </i>
          <input placeholder="请输入密码" type="password" v-model="pwd" value id="name" />
        </p>

        <button class="userbind_bottom" @click="login" id="bindlogin">绑定并登录</button>
      </div>
    </div>
  </div>
</template>
<script>
let Base64 = require("js-base64").Base64;
import Base from "js-base64";

export default {
  data() {
    return {
      loginname: "", //用户名
      pwd: "", //密码
      sessionid: ""
    };
  },
  methods: {
    login() {
      if (this.loginname == "") {
        this.Toast("请输入用户名！！");
      } else if (this.pwd == "") {
        this.Toast("请输入密码！！");
      } else {
        document.getElementById("bindlogin").setAttribute("disabled", true);
        document.getElementById("bindlogin").style.background = "#ccc";
        this.util
          .postAjax({
            data: {
              name: this.loginname,
              password: this.pwd
            },
            isRep: true,
            code: this.code.authbase,
            url: this.code.frontLogin
          })
          .then(res => {
            let params11 = Base64.encode(JSON.stringify(res));
            console.log("rrr", res, params11);
            if (res.success) {
              if (window.base.IsLocalLogin) {
                this.$router.push("index");
              } else {
                let params = Base64.encode(JSON.stringify(res.item));
                window.location.href =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  "/seat_v2/mobile/index.jsp?authType=hwwx&param=" +
                  params;
              }
              document.getElementById("bindlogin").removeAttribute("disabled");
              document.getElementById("bindlogin").style.background =
                "rgba(0,109,255,1)";
            } else {
              this.Toast(res.message || "登录失败");
              document.getElementById("bindlogin").removeAttribute("disabled");
              document.getElementById("bindlogin").style.background =
                "rgba(0,109,255,1)";
            }
          })
          .catch(error => {
            document.getElementById("bindlogin").removeAttribute("disabled");
            document.getElementById("bindlogin").style.background =
              "rgba(0,109,255,1)";
          });
      }
    }
  },
  created() {},
  mounted() {
    let keyTimer = null;
    document.body.addEventListener("focusin", () => {
      //软键盘弹起事件
      clearTimeout(keyTimer);
    });
    document.body.addEventListener("focusout", () => {
      // 软键盘关闭事件
      window.scrollTo(0, 0);
      keyTimer = setTimeout(() => {
        if (window.pageYOffset > 0) {
          window.scrollTo(0, 0);
        }
      }, 200);
    });
  }
};
</script>
<style scoped>
.bindcontent {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1000;
  background: url(../../static/img/login-bg.png) no-repeat center center;
  background-size: cover;
}

.bindcontent > div.login-box {
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
  background: #fff;
  width: 100%;
  height: 730px;
  background: #ffffff;
  border-radius: 60px 60px 0px 0px;
}

.bindcontent > div > p {
  width: 84%;
  height: 80px;
  margin: 0 auto;
  position: relative;
  margin-top: 40px;
}
.bindcontent > div > p > i {
  position: absolute;
  top: 20px;
  left: 36px;
  font-size: 32px;
  font-weight: 400;
  color: rgba(32, 36, 47, 1);
  font-style: normal;
  background: #fff;
}
.bindcontent > div > h3 {
  width: 100%;
  height: 62px;
  font-size: 44px;
  font-weight: 500;
  color: #030303;
  line-height: 56px;
  text-align: center;
  margin-top: 60px;
  line-height: 62px;
}
#loginname,
#name {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  border-bottom: 2px solid #e8ebef;
  text-indent: 100px;
  border-radius: 8px;
  font-size: 34px;
  margin: 0 auto;
}
.userbind_bottom {
  width: 84%;
  height: 88px;
  line-height: 88px;
  text-align: center;
  background: #f39f1b;
  border-radius: 20px;
  border: none;
  color: #fff;
  font-size: 32px;
  outline: none;
  margin-top: 175px;
}
</style>
