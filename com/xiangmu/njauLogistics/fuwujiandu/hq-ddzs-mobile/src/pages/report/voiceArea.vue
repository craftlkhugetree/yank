<template>
  <div class="div_flex voice_area" v-if="canInit">
    <v-bar ref="vbar" v-show="isPress" :sec="sec"></v-bar>
    <span v-show="!isPress" class="font-s tips not">按住说话</span>
    <div
      class="btn not"
      @touchstart.stop="goStart"
      @touchmove="void 0"
      @touchend="goTouchEnd"
      @touchcancel="goTouchEnd"
    >
      <img :src="isPress ? btn2 : btn" />
    </div>
  </div>
</template>

<script>
import map from "@/assets/js/map"; //引入刚才的js文件
import wx from "weixin-js-sdk";
import { pushVoice } from "@/assets/js/api";
export default {
  components: {
    vBar: () => import("@/components/vBar")
  },
  watch: {
    time(v) {
      if (v >= this.sec) {
        this.voiceStop();
      }
    },
    isPress(val) {
      let vb = this.$refs.vbar;
      if (!val) {
        vb.time = 0;
        clearInterval(vb.timer);
      } else {
        vb.start();
      }
    }
  },
  data() {
    return {
      canInit: true,
      btn: require("../../../static/images/btn.svg"),
      btn2: require("../../../static/images/press.svg"),
      isPress: false,
      timer: null,
      time: 0,
      sec: 55,
      sha1: null,
      baidu: null,
      str: "",
      localId: "",
      voiceServerId: "",
      pointLat: null, // 纬度，浮点数，范围为90 ~ -90
      pointLng: null // 经度，浮点数，范围为180 ~ -180。
    };
  },
  methods: {
    getPosition() {
      // if (this.util.isWeiXin()) {
      //   let that = this;
      //   wx.getLocation({
      //     success: function(res) {
      //       that.pointLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
      //       that.pointLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
      //       var accuracy = res.accuracy;
      //       alert("wx:" + JSON.stringify(res));
      //       that.$emit("getPosition", this.pointLat, this.pointLng);
      //     },
      //     cancel: function(res) {
      //       that.useMap();
      //       alert("用户拒绝授权获取地理位置");
      //     },
      //     fail: function(res) {
      //       that.useMap();
      //       alert("出现故障，请联系管理员");
      //     }
      //   });
      // } else {
      // }
      this.useMap();
    },
    voiceEnd() {
      let that = this;
      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: async res => {
          that.localId = res.localId;
          await that.upVoice();
          await that.translateResult();
        },
        fail: res => {
          that.isPress = false;
          that.$toast.clear();
        },
        cancel: res => {
          that.$toast.clear();
          that.isPress = false;
        }
      });
    },
    // 单次位置请求执行的函数
    getLocation(BMap) {
      const _this = this;
      const geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r) {
        if (r && r.point && r.point.lng && r.point.lat) {
          let myGeo = new BMap.Geocoder();
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(
            result
          ) {
            if (
              result &&
              result.point &&
              result.point.lat &&
              result.point.lng
            ) {
              _this.pointLat = result.point.lat;
              _this.pointLng = result.point.lng;
              _this.$emit("getPosition", _this.pointLat, _this.pointLng);
            }
          });
        } else {
          _this.$toast.fail("定位失败");
        }
      });
    },
    //  上传语音
    upVoice() {
      let that = this;
      that.common.genLoading(that);
      wx.uploadVoice({
        localId: that.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: res => {
          that.voiceServerId = res.serverId; // 返回音频的服务器端ID
          that.isPress = false;
          pushVoice(that.voiceServerId).then(res => {
            that.common.dealRes(res, () => {
              res.data && that.$emit("getId", res.data.id);
            });
          });
        },
        fail: error => {
          that.isPress = false;
          that.$toast.clear();
          alert("语音上传失败");
        }
      });
    },
    // 语音转换结果
    translateVoice() {
      let that = this;
      clearInterval(that.timer);
      wx.translateVoice({
        localId: that.localId, // 需要识别的音频的本地Id，由录音相关接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function(res) {
          that.str = res.translateResult;
          that.$toast.clear();
          that.$emit("getTranslate", that.str);
        }
      });
    },
    // 松开
    goTouchEnd(e) {
      e.preventDefault();
      this.voiceStop();
    },
    // 停止录音
    voiceStop() {
      let that = this;
      wx.stopRecord({
        success: async res => {
          that.localId = res.localId;
          await that.upVoice();
          await that.translateVoice();
        },
        fail: error => {
          that.isPress = false;
          alert("语音停止失败");
        }
      });
    },
    goStart(event) {
      this.isPress = true;
      event.preventDefault();
      this.time = 0;
      let that = this;
      wx.startRecord({
        success: () => {
          that.timer = setInterval(() => {
            that.time++;
          }, 1000);
          that.voiceEnd();
        },
        cancel: () => {
          that.isPress = false;
          alert("用户拒绝授权录音");
        }
      });
    },
    getRandomNum() {
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < 16; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    initWx() {
      this.util
        .postAjax({
          code: this.global.service,
          url: "portal/getTicket"
          // isRep:true
        })
        .then(res => {
          if (res.success) {
            var str = this.getRandomNum();
            //生成签名
            var timeSign = Date.parse(new Date());
            var url = window.location.href.split("#")[0];
            var signature =
              "jsapi_ticket=" +
              res.data.ticket +
              "&noncestr=" +
              str +
              "&timestamp=" +
              timeSign +
              "&url=" +
              url;
            wx.config({
              debug: false, // 开启调试模式。
              appId: res.data.appid, // 必填，公众号的唯一标识
              timestamp: timeSign, // 必填，生成签名的时间戳
              nonceStr: str, // 必填，生成签名的随机串
              signature: this.sha1(signature), // 必填，签名
              // jsApiList: [ "startRecord", "stopRecord", "translateVoice", "onVoicePlayEnd", "stopVoice", "pauseVoice", "playVoice", "onVoiceRecordEnd", "openLocation" ] // 必填，需要使用的JS接口列表
              jsApiList: [
                "startRecord",
                "stopRecord",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "uploadVoice",
                "translateVoice",
                "onVoiceRecordEnd",
                "openLocation",
                "getLocation"
              ] // 必填，需要使用的JS接口列表
            });
            wx.ready(() => {
              // 成功后使用wx,checkJSapI测试你要用的API是否可以用
              wx.checkJsApi({
                // jsApiList: [ "startRecord", "stopRecord", "translateVoice", "onVoicePlayEnd", "stopVoice", "pauseVoice", "playVoice", "onVoiceRecordEnd", "openLocation" ],
                jsApiList: [
                  "startRecord",
                  "stopRecord",
                  "playVoice",
                  "pauseVoice",
                  "stopVoice",
                  "uploadVoice",
                  "translateVoice",
                  "onVoiceRecordEnd",
                  "openLocation",
                  "getLocation"
                ], // 必填，需要使用的JS接口列表

                success(res) {
                  this.canInit = true;
                  // alert("jsApi识别成功" + JSON.stringify(res));
                  // 以键值对的形式返回，可用的api值true，不可用为false
                  // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                  // 如果这里成功了就改变一个标记下方你就正常调用方法，如果没成功那就改变为false，下方调用API的时候给个友情提示。
                },
                error(res) {
                  this.canInit = false;
                  this.$toast.fail("wxJsApi失败");
                }
              });
              //注册微信播放录音结束事件【一定要放在wx.ready函数内】
              // wx.onVoicePlayEnd({
              //   success: function(res) {
              //     this.offOrNo = false;
              //   }
              // });
            });
            wx.error(res => {
              this.canInit = false;
              this.$toast.fail("wxConfig失败");
            });
          } else {
            this.$toast.fail("getTicket失败");
          }
        });
    },
    useMap() {
      map.init().then(BMap => {
        //在这里调用BMap的方法
        this.baidu = BMap;
        this.getLocation(BMap);
      });
    }
  },
  mounted() {
    if (this.util.isWeiXin()) {
      this.sha1 = require("js-sha1");
      this.initWx();
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
.voice_area {
  padding-top: 20px;
  flex-direction: column;

  .tips {
    color: #bfbfbf;
    padding: $fixed_side 0;
  }
  img {
    pointer-events: none;
  }
  .not {
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
}
</style>
