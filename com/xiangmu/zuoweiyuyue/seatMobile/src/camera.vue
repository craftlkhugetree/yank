<template>
  <div>
    <input
      type="file"
      accept="image/*"
      capture="camera"
      @change="inputCh"
      ref="ipc"
    />
    <input type="file" accept="image/*" @change="inputChange" ref="ipt" />
    <button @click="getPosition">获取地址</button>
    <!--开启摄像头-->
    <van-button size="mini" @click="openMedia">摄像头</van-button>
    <!--canvas截取流-->
    <canvas ref="canvas" v-show="false"></canvas>
    <video ref="video" class="video" autoplay v-if="isVideo"></video>
    <!--图片展示-->
    <div class="imgDiv">
      <img preview="1" :src="item" alt v-for="item in imgList" :key="item" />
    </div>
    <!--确认-->
    <div @click="capture" class="circle" v-if="isVideo"></div>
    <div>识别结果：：：：{{ str }}</div>
    <input v-model="voiceServerId" class="big" />
    <van-icon name="after-scale" color="#1989fa" />
    <van-icon name="upgrade" color="#1989fa" size="20" />
    <button
      class="btn"
      @touchstart="gostart"
      @touchmove="void 0"
      @touchend="gotouchend"
      @touchcancel="gotouchend"
    >
      按住说话
    </button>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-grid :column-num="2" :gutter="20">
          <van-grid-item v-for="(value, id) in imgList" :key="value">
            <van-image
              :src="value + ''"
              fit="cover"
              width="100"
              height="100"
              @click="openImg(id)"
            />
            <div>{{ list[id] }}</div>
          </van-grid-item>
        </van-grid>
        <!-- <div>
          <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
          <p v-show="!finished && !loading" @click="onLoad">
            点击加载更多
          </p>
          <p v-show="finished && total > 0" style="cursor:none;">
            到底啦
          </p>
        </div> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import { ImagePreview } from "vant";
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      error: false,

      sha1: "",
      imgList: [],
      isVideo: false,
      front: false,
      mediaStream: null,
      width: 750,
      height: 750,
      str: "img",
      timer: null,
      time: 0,
      localId: "",
      voiceServerId: "",
      second: 60,
      opts: {
        enableHighAcuracy: false, //位置是否精确获取
        timeout: 5000, //获取位置允许的最长时间
        maximumAge: 1000 //多久更新获取一次位置
      },
      pointY: null, // 纬度，浮点数，范围为90 ~ -90
      pointX: null // 经度，浮点数，范围为180 ~ -180。
    };
  },
  mounted() {
    if (this.isWeiXin()) {
      this.sha1 = require("js-sha1");
      this.initwx();
    } else if (this.supportsGeoLocation()) {
      this.getLocation();
    }
  },
  methods: {
    getPosition() {
      if (this.isWeiXin()) {
        wx.getLocation({
          success: function(res) {
            this.pointY = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            this.pointX = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var wxaccuracy = res.accuracy;
            alert("wx:" + JSON.stringify(res));
          },
          cancel: function(res) {
            alert("用户拒绝授权获取地理位置");
          },
          fail: function(res) {
            this.getLocation();
            alert("出现故障，请联系管理员");
          }
        });
      } else {
        this.getLocation();
      }
    },
    // 检测浏览器是否支持HTML5
    supportsGeoLocation() {
      return !!navigator.geolocation;
    },
    // 单次位置请求执行的函数
    getLocation() {
      navigator.geolocation.getCurrentPosition(
        position => {
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          alert("navigator:" + JSON.stringify(position));
          // 将不准确的经纬度信息做了转换
          convertor.translate([pointBak], 1, 5, function(resPoint) {
            if (resPoint && resPoint.points && resPoint.points.length > 0) {
              lng = resPoint.points[0].lng;
              lat = resPoint.points[0].lat;
              alert(lng + "" + lat);
            }
          });
        },
        this.locationError,
        this.opts
      );
    },
    // 定位失败时，执行的函数
    locationError(error) {
      console.log(error);
      switch (error.code) {
        case 0:
          alert("无法定位.");
          break;
        case 2:
          alert("位置信息不可用.");
          break;
        case 3:
          alert("请求超时.");
          break;
        case 1:
          alert("未知错误.");
          break;
      }
    },
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.imgList = [];
          this.list = [];
          this.refreshing = false;
        }

        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
          this.imgList.push(this.list.length + 1);
        }
        this.loading = false;

        if (this.list.length >= 12) {
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    openImg(id) {
      ImagePreview({
        images: this.imgList,
        startPosition: id,
        closeable: true
      });
    },
    voiceEnd() {
      let that = this;
      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: async res => {
          that.localId = res.localId;
          clearInterval(that.timer);
          await that.upVoice();
          await that.translateResult();
        }
      });
    },
    getBlob(serverId) {
      let xhr = new XMLHttpRequest();
      let url =
        "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESSTOKEN&media_id=MEDIAID";
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.onload = () => {
        alert(JSON.stringify(xhr.response));
      };
      xhr.send();
    },
    //  上传语音
    upVoice() {
      wx.uploadVoice({
        localId: this.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: res => {
          this.voiceServerId = res.serverId; // 返回音频的服务器端ID
          // this.getBlob(res.serverId);
          wx.downloadVoice({
            serverId: res.serverId,
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function(res) {
              alert(
                "downVoiceSuccess:" + res.localId + ":" + JSON.stringify(res)
              );
            }
          });
        },
        fail: error => {
          this.alert("语音上传失败");
        }
      });
    },
    // 语音转换结果
    translateVoice() {
      let that = this;
      wx.translateVoice({
        localId: that.localId, // 需要识别的音频的本地Id，由录音相关接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function(res) {
          that.str = res.translateResult;
          alert(res.translateResult); // 语音识别的结果
        }
      });
    },
    // 松开
    gotouchend(e) {
      e.preventDefault();
      this.voiceStop();
    },
    // 停止录音
    voiceStop() {
      wx.stopRecord({
        success: async res => {
          clearInterval(this.timer);
          this.localId = res.localId;
          await this.upVoice();
          await this.translateVoice();
        },
        fail: error => {
          alert("语音停止失败");
        }
      });
    },
    gostart(event) {
      event.preventDefault();
      this.time = 0;
      wx.startRecord({
        success: () => {
          this.timer = setInterval(() => {
            this.time++;
          }, 1000);
          this.voiceEnd();
        },
        cancel: () => {
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
    initwx() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.getTicket
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
                "downloadVoice",
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
                  "downloadVoice",
                  "translateVoice",
                  "onVoiceRecordEnd",
                  "openLocation",
                  "getLocation"
                ], // 必填，需要使用的JS接口列表

                success(res) {
                  console.log(res, "语音识别成功");
                  // 以键值对的形式返回，可用的api值true，不可用为false
                  // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                  // 如果这里成功了就改变一个标记下方你就正常调用方法，如果没成功那就改变为false，下方调用API的时候给个友情提示。
                },
                error(res) {
                  alert("失败");
                }
              });
              // wx.onVoiceRecordEnd({
              //   // 录音时间超过一分钟没有停止的时候会执行 complete 回调
              //   complete: function(res) {
              //     alert("录音停止");
              //     this.str = res;
              //     sessionStorage.setItem(
              //       "localId",
              //       JSON.stringify(res.localId)
              //     );
              //     this.localId = res.localId;
              //   }
              // });
              //注册微信播放录音结束事件【一定要放在wx.ready函数内】
              // wx.onVoicePlayEnd({
              //   success: function(res) {
              //     this.offOrNo = false;
              //   }
              // });
            });
            wx.error(res => {
              alert("失败");
            });
          } else {
            alert(res.success);
          }
        });
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    inputChange() {
      let file = this.$refs.ipt.files[0];
      this.uploadAttachImg(file);
    },
    inputCh() {
      let file = this.$refs.ipc.files[0];
      this.uploadAttachImg(file);
    },
    // 压缩图片
    uploadAttachImg(file) {
      let that = this;
      let _base64 = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        if (file.size / 1024 / 1024 <= 0.2) {
          // 小于 200k
          _base64 = e.target.result;
          that.getFaceResult(_base64); // 上传服务
        } else {
          let img = document.createElement("img");
          img.src = e.target.result;
          let scale = 0.9;
          img.onload = function() {
            var originWidth = that.width;
            var originHeight = that.height;
            var maxWidth = 900;
            var maxHeight = (originHeight / originWidth) * 900;
            var canvas = document.createElement("canvas");
            canvas.setAttribute("width", maxWidth);
            canvas.setAttribute("height", maxHeight);
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            _base64 = canvas.toDataURL("image/jpeg");
            while (_base64.length > 1024 * 1024 * 0.18) {
              scale -= 0.01;
              _base64 = canvas.toDataURL("image/jpeg", scale);
            }
            that.getFaceResult(_base64); // 上传服务
          };
        }
      };
    },

    getFaceResult(data) {
      this.str = data;
      this.imgList.push(data);
      this.$previewRefresh();
    },
    // 打开摄像头
    openMedia() {
      let constraints = {
        audio: true, //音频轨道
        video: {
          width: 1280,
          height: 720
          // facingMode: this.front ? "user" : "environment"
        } //视频轨道
      };
      // H5调用电脑摄像头API
      //navigator.mediaDevices.getUserMedia 调用后 会提示用户给予使用媒体输入的许可.返回一个 Promise 对象，
      //成功后会resolve回调一个 MediaStream 对象。
      //在H5设备上面调用摄像头也可以通过此种方式，如下的例子表示优先使用前置摄像头
      //{ audio: true, video: { facingMode: "user" } }前摄像头
      //{ audio: true, video: { facingMode: { exact: "environment" } } }强制使用后置摄像头
      //设置获取接近 1280x720 的相机分辨率
      //{ audio: true, video: { width: 1280, height: 720 } };
      const mediaPromise =
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      mediaPromise &&
        mediaPromise(constraints)
          .then(success => {
            this.isVideo = true;
            this.mediaStream = success;
            // 摄像头开启成功
            this.$refs["video"].srcObject = success; //srcObject 是实时流
            // 实时拍照效果
            this.$refs["video"].play();
          })
          .catch(error => {
            //摄像头开启失败
            alert("摄像头开启失败");
          });
    },
    // 拍照
    capture() {
      let photoInfo = this.$refs["canvas"].getContext("2d");
      // 把当前内容渲染到canvas上
      photoInfo.drawImage(this.$refs["video"], 0, 0, 1280, 720);
      //canvas图片 转base64格式、图片格式转换、图片质量压缩
      let imgBase64 = this.$refs["canvas"].toDataURL("image/jpeg", 0.7);
      this.imgList.push(imgBase64);
      let string = imgBase64.replace("data:image/jpeg;base64,", "");
      let strLgh = string.length;
      let fileLgh = parseInt(strLgh - (strLgh / 8) * 2); //
      let size = (fileLgh / 1024).toFixed(2); // 由字节转换为KB 判断大小
      this.isVideo = false;
      console.log(size); //图片大小
    },
    closeMedia() {
      return new Promise(resolve => {
        this.mediaStream.getTracks().forEach(async track => {
          await track.stop();
        });
        resolve();
      });
    },
    reversal() {
      this.closeMedia().then(() => {
        this.front = !this.front;
        this.openMedia();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.video {
  width: 400px;
  height: 400px;
  object-fit: cover;
  float: left;
  border: 1px solid #ccc;
  z-index: 9;
}
.canvas {
  width: 80px;
  height: 80px;
  border: 1px solid red;
}
.circle {
  position: absolute;
  bottom: 20;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #000;
  z-index: 10;
}
.imgDiv {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  img {
    margin: 0 20px;
    width: 80px;
    height: 80px;
  }
}
.btn {
  width: 100px;
  height: 200px;
  margin: 30px;
}
.big {
  width: 100%;
  height: 30px;
  display: block;
  padding: 20px;
}
</style>
