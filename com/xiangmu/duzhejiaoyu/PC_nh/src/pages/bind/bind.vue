<template>
  <div class="bind_content clearfix">
    <div class="bind_left"></div>
    <div class="bind_right">
      <div class="bind_right_">
        <h3>登 录</h3>
        <p v-if="isCZ" class="czp">常州大学图书馆教育培训系统</p>
        <p>
          证件号
          <span v-if="isCZ">(学号)</span>
        </p>
        <el-input :placeholder="placeholderCardText" v-model="loginname">
          <i slot="prefix" class="el-input__icon el-icon-mypostcard"></i>
        </el-input>
        <p class="pwd">
          密码
          <span v-if="isCZ">(初始密码为身份证后六位)</span>
        </p>
        <el-input :placeholder="nh?'默认身份证后6位':placeholderPassText" show-password v-model="pwd">
          <i slot="prefix" class="el-input__icon el-icon-password"></i>
        </el-input>
        <p class="pwd">图形验证码</p>
        <div class="validnum_">
          <el-input class="validnum_input" placeholder="请输入算式结果" v-model="vxcode"></el-input>
          <img :src="img_" alt @click="getpic" />
        </div>
        <el-button type="primary" class="loginbtn" id="bindlogin" @click="bind">{{nh?"登录":"登录"}}</el-button>
        <p
          v-if="nh&&isnewlogin"
          class="bind_info"
          style="font-size:14px;text-align: center;margin-top: 10px;color: red;"
        >({{nhLoginInfo}})</p>
        <p
          v-if="tips_status"
          v-html="tips"
          class="bind_info"
          style="font-size:14px;text-align: center;margin-top: 10px;color: red;"
        >({{tips}})</p>
        <div class="now_login" v-popover:popover1 @click="gonewlogin" v-show="isnewlogin">
          本科新生登录
          <i></i>
        </div>
        <div class="bottom_fix">Copyright © 2020 南京昂克软件 All Rights Reserved</div>
      </div>
    </div>
    <el-popover ref="popover1" placement="bottom-start" title="登录方式选择" width="200" trigger="hover">
      <p>有通知书未入校新生可用身份证登录</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible2 = false">完成</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>
import code from "../../util/code";
import Base from "js-base64";
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      visible2: false,
      Domain: window.base.mainDomain,
      nhLoginInfo: window.base.nhLoginInfo,
      TID: "",
      loginname: "", //用户名
      pwd: "", //
      vxcode: "", //验证码
      img_: "", //图片验证码
      sessionid: "",
      isnewlogin: false,
      isCZ: window.base.cz,
      nh: window.base.nh,
      placeholderCardText: window.base.placeholderCardText,
      placeholderPassText: window.base.placeholderPassText,
      ysu: window.base.ysu,
      tips:window.base.tips,
      tips_status: window.base.tips_status,
    };
  },
  methods: {
    hover1() {
      console.log(111);
    },
    //获取验证码图片
    getpic() {
      this.img_ = "/idsweb/rest/captcha/get?id=" + new Date().getTime();
      // axios.get(window.base.idsURL+this.ysu?'':'captcha/sessionid?validateKey=FRONT_IDSTGC').then(response=>{
      //     this.sessionid = response.data;
      //     this.img_ = window.base.idsURL+'captcha/get?id='+response.data+new Date().getTime();
      //     this.$forceUpdate()
      // console.log(this.img_)
      // })
    },
    hasnewlogin() {
      this.util
        .postAjax({
          code: code.base,
          url: code.ruleslist,
          data: {
            code: "ISNEWLOGIN" //是否开启新生登录
          }
        })
        .then(res => {
          if (res.item.rval == "1") {
            this.isnewlogin = true;
          } else {
            this.isnewlogin = false;
          }
           //this.$router.push("campus");
        });
    },
    //新生登录
    gonewlogin() {
      this.$router.push("newbind");
    },
    bind() {
      if (!this.loginname) {
        this.$message({
          message: "请输入证件号！！",
          type: "warning"
        });
      } else if (!this.pwd) {
        this.$message({
          message: "请输入密码！！",
          type: "warning"
        });
      } else if (!this.vxcode) {
        this.$message({
          message: "请输入验证码！！",
          type: "warning"
        });
      } else {
        document.getElementById("bindlogin").setAttribute("disabled", true);
        document.getElementById("bindlogin").style.background = "#ccc";
        this.util
          .postAjax({
            code: code.base4,
            url: code.frontLogin,
            data: {
              loginname: this.loginname,
              pwd: this.pwd,
              vxcode: this.vxcode,
              sessionid: this.sessionid
            }
          })
          .then(res => {
            if (res.success) {
              this.$router.push("campus");
              // window.sessionStorage.setItem(
              //   "userdata",
              //   JSON.stringify(res.data)
              // );
              document.getElementById("bindlogin").removeAttribute("disabled");
              document.getElementById("bindlogin").style.background =
                "rgba(0,109,255,1)";
            } else {
              this.$message.error(res.msg);
              document.getElementById("bindlogin").removeAttribute("disabled");
              document.getElementById("bindlogin").style.background =
                "rgba(0,109,255,1)";
              this.getpic();
            }
          })
          .catch(error => {
            // this.$message.error('用户名或密码错误！');
            this.getpic();
            document.getElementById("bindlogin").removeAttribute("disabled");
            document.getElementById("bindlogin").style.background =
              "rgba(0,109,255,1)";
          });
      }
    }
  },
  created() {

    if(window.base.isFysf&&this.util.getCookieByName('IDSTGC')){
      var flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      if(flag){
        window.location.href=window.base.mainURL+'/lres/mobile';
      }else{
        this.$router.push("campus");
      }
    }
    this.hasnewlogin();
    this.getpic();
  }
};
</script>

<style scoped>
.bind_right_ > p.czp {
  text-align: center;
  margin-bottom: 40px;
  font-size: 16px;
  font-weight: 400;
  color: #62656d;
}
.bind_info {
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  color: red;
}
.now_login {
  width: 170px;
  height: 45px;
  background: rgba(20, 114, 255, 0.1);
  border-radius: 28px;
  margin: 40px auto 0;
  font-size: 16px;
  font-weight: 400;
  color: rgba(26, 119, 255, 1);
  line-height: 45px;
  text-align: center;
}
.now_login > i {
  display: inline-block;
  width: 16px;
  height: 14px;
  background: url(../../../static/img/new_login.png) no-repeat center center;
  background-size: cover;
}
.validnum_ {
  width: 100%;
  height: 49px;
}
.validnum_ > .validnum_input {
  width: calc(100% - 121px);
  height: 100%;
  background: pink;
}
.validnum_ > img {
  display: inline-block;
  width: 106px;
  height: 100%;
  float: right;
  margin-left: 15px;
}
.bind_content {
  position: fixed;
  width: 100%;
  height: 100% !important;
  top: 0;
  left: 0;
  padding: 0 !important;
}

.bind_left {
  width: 65%;
  height: 100%;
  background: url(../../../static/img/login.png) no-repeat center center;
  background-size: cover;
  float: left;
}

.bind_right {
  width: 35%;
  height: 100%;
  float: left;
  position: relative;
  background: #fff;
}
.bind_right_ {
  width: 70%;
  /* height: 80%; */
  /* margin-top: 20%; */
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 15%;
  bottom: 0;
}

.bind_right_ > h3 {
  margin: 0 auto;
  width: 270px;
  height: 59px;
  font-size: 42px;
  font-weight: 500;
  color: rgba(31, 35, 47, 1);
  line-height: 59px;
  letter-spacing: 10px;
  text-align: center;
  margin-bottom: 23px;
}

.bind_right_ > p {
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(98, 101, 109, 1);
  line-height: 20px;
  margin: 10px 0;
}
.bind_right_ > p > span {
  font-size: 12px;
}
.bind_right_ > p.pwd {
  margin-top: 30px;
}
.el-icon-password,
.el-icon-mypostcard {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(../../../static/img/lock_icon.png) no-repeat center center;
  background-size: contain;
  margin-top: 17.5px;
  margin-left: 5px;
}
.el-icon-mypostcard {
  background: url(../../../static/img/cardnum.png) no-repeat center center;
  background-size: contain;
}
.loginbtn {
  width: 100%;
  margin-top: 70px;
  background: rgba(20, 114, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(205, 226, 255, 1);
}
.bottom_fix {
  width: 100%;
  /* position: absolute; */
  /* bottom: 10px; */
  margin-top: 40px;
  text-align: center;
  left: 0;
  font-size: 12px;
  font-weight: 500;
  color: rgba(165, 173, 186, 1);
  line-height: 17px;
}
</style>
