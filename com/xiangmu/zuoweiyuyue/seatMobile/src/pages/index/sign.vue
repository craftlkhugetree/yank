<template>
  <div>
    <div style="height:64px"></div>
    <!-- 不符合签到传参规则时 -->
    <div class="noimgwrapper" v-if="!flagSign">
      <div class="noimg"></div>
      <p class="noimginfo">请扫描正确的二维码！</p>
    </div>
    <div class="load-box">
      <van-loading v-show="isLoading" size="32px">签到中...</van-loading>
    </div>
    <!-- 签到成功弹窗 -->
    <van-overlay :show="signSuccess" v-if="signSuccess">
      <div class="monitorwrapper">
        <div class="bigimg"></div>
        <p class="info" v-show="isSigned">暂无签到信息！</p>
        <h3 v-show="!isSigned" class="h3-title">签到成功！</h3>
        <span class="back-btn" @click="gohome">返回首页</span>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  props: {
    signData: String
  },

  data() {
    return {
      flagSign: false,
      timestamp: "",
      SECTIONID: "",
      sign: {},
      isLoading: false,
      signSuccess: false,
      isSigned: false
    };
  },

  methods: {
    gohome() {
      this.$router.push("/index");
    },
    //获取要签到的信息
    getsignRemind() {
      this.isLoading = true;
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.signRemind,
          isRep: true
        })
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.isSigned = false;
              if (this.sign.codeval !== "2") {
                this.doSignin(res.data);
              } else if (res.data.sectionid === this.SECTIONID) {
                this.doSignin(res.data);
              } else {
                this.isSigned = true;
                this.signSuccess = true;
              }
            } else {
              this.isSigned = true;
              this.signSuccess = true;
            }
          }
          this.isLoading = false;
        })
        .catch(err => {});
    },
    //签到
    doSignin(res) {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.sign,
          data: {
            id: res.id
          }
        })
        .then(res => {
          if (res.success) {
            this.signSuccess = true;
          } else {
            this.signSuccess = false;
          }
        });
    },
    // 获取配置
    getConfig() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.configitems,
          isRep: true
        })
        .then(res => {
          if (res && res.success) {
            var configs = (res.data && res.data.configs) || [];
            this.sign = configs.find(c => c.identifycode === "B01") || {};
            switch (this.sign.codeval) {
              case "1":
                this.judgeTimeRange(10 * 60 * 1000);
                break;
              case "2":
                this.judgeTimeRange(10 * 60 * 1000);
                break;
              case "3":
                this.judgeTimeRange(Infinity);
                break;
              case "4":
                this.judgeTimeRange(30 * 24 * 60 * 60 * 1000);
                break;
            }
          }
        });
    },
    // 判断时刻范围
    judgeTimeRange(unit) {
      if (this.timestamp) {
        let now = new Date().getTime();
        this.flagSign = Math.abs(now - this.timestamp) < unit ? true : false;
      }
      // 二维码正确，再调是否有签到信息
      if (this.flagSign) {
        this.getsignRemind();
      }
    }
  },

  created() {
    let Base64 = require("js-base64").Base64;
    if (this.signData) {
      let newdata = Base64.decode(this.signData);
      let resdata = JSON.parse(newdata);
      console.log("rrr", resdata);
      let signType = resdata.signType ? resdata.signType : "";
      this.timestamp = resdata.timestamp ? resdata.timestamp : "";
      this.SECTIONID = resdata.SECTIONID ? resdata.SECTIONID : "";
      this.flagSign = signType == "seatV2" ? true : false;
    }
    this.getConfig();
  }
};
</script>

<style scoped>
.load-box {
  text-align: center;
  height: 200px;
  margin: 200px auto;
}
.monitorwrapper {
  height: 100%;
  width: 100%;
  padding: 40px 0;
  position: relative;
  width: 580px;
  border-radius: 16px;
  height: 720px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: url("../../../static/img/mengBack.png") no-repeat center center;
  background-size: cover;
}

.bigimg {
  width: 317px;
  height: 223px;
  margin: 40px auto;
  display: block;
}
.h3-title {
  width: 100%;
  height: 59px;
  font-size: 42px;
  font-weight: 550;
  color: #ffffff;
  line-height: 59px;
  padding-top: 45px;
  margin-bottom: 8px;
  text-align: center;
}

.back-btn {
  display: inline-block;
  width: calc(100% - 80px);
  height: 84px;
  background: #ffffff;
  border-radius: 44px;
  border: 2px solid #cccccc;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 84px;
  text-align: center;
  position: absolute;
  bottom: 60px;
  left: 40px;
}
.info {
  width: 100%;
  height: 42px;
  font-size: 30px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 42px;
  text-align: center;
  margin-top: 60px;
}

.noimg {
  width: 6rem;
  height: 5rem;
  margin: auto;
  background: url(../../../static/img/emptytime.png) no-repeat center center;
  background-size: cover;
  margin-top: 5rem;
}
.noimginfo {
  width: 100%;
  font-size: 30px;
  font-weight: 400;
  color: #999999;
  line-height: 42px;
  text-align: center;
  margin-top: 30px;
}
</style>
