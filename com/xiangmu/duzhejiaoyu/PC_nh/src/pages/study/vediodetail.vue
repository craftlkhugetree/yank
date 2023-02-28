<template>
  <div>
    <div class="vediodetail_">
      <div class="vediodetail_auto">
        <div class="vediodetail_btns">
          <el-button @click="goback" v-if="isneedvideocontrol == '1'"
            >返回</el-button
          >
          <el-button @click="goBack_1" v-else>返回</el-button>
          <span class="study_time"
            >已在线学习<i>{{ formatonlineTime[0] }}</i
            >:<i>{{ formatonlineTime[1] }}</i
            >:<i>{{ formatonlineTime[2] }}</i></span
          >
          <el-button
            v-if="vediodetail.showdown == 1"
            type="primary"
            style="
              float: right;
              background: linear-gradient(
                90deg,
                rgba(45, 171, 255, 1) 0%,
                rgba(20, 114, 255, 1) 100%
              );
            "
            icon="mydown"
            @click="downvedio(vediodetail.url)"
          >
            <!-- <a :href="domain+vediodetail.url" style="color: #fff;text-align: left;" download="视频下载">下载</a> -->
            <a style="color: #fff; text-align: left" download="视频下载"
              >下载</a
            >
          </el-button>
        </div>
        <div class="vediodetail_title">
          <div class="vediodetail_title_">
            <h3>{{ vediodetail.name }}</h3>
            <p>
              <span class="see"><i></i> {{ vediodetail.watchCount }}</span
              ><span class="down"><i></i> {{ vediodetail.downloadCount }}</span>
            </p>
          </div>
        </div>
        <div class="vediodetail_vedio">
          <!-- <video id="vedio" :src="vediodetail.url" autoplay style="width:100%;height:100%;object-fit: fill;" @click="playvideo">
                    </video> -->
          <video
            id="vedio"
            class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
            style="width: 100%; height: 100%; object-fit: fill; padding-top: 0"
          ></video>
        </div>
        <div class="vediodetail_title">
          <h4>视频简介:</h4>
          <p v-html="vediodetail.description"></p>
        </div>
      </div>
      <!-- 视频弹窗 -->
      <div class="closevedio_box" v-if="closevedio">
        <div class="closevedio_">
          <div class="closevedio_top"></div>
          <p>
            还有{{
              formatSeconds(vedioduration - vediocurr)
            }}观看完视频，确定退出吗？
          </p>
          <div class="vediobtns">
            <button class="cancel" @click="cancel">取消</button>
            <button class="sure" @click="close">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import code from "../../util/code";
export default {
  props: {
    id: String,
    ended: Boolean,
    islearnnum: Boolean || String,
  },
  data() {
    return {
      vediodetail: "",
      // domain:' http://seat.dev.angke.cn/',
      timer: null,
      formatonlineTime: "",
      singletime: 0, //刚进来恢复0,用于计时2分钟的
      closevedio: false,
      vedioduration: 0, //视频的总时长
      vediocurr: 0, //视频当前时长
      myvedio: "",
      passpage: "",
      domain: window.base.mainURL,
      playend: false, //播放结束
      isneedvideocontrol: "0",
    };
  },
  methods: {
    // playvideo(){
    //     this.myvedio = document.getElementById('vedio');
    //     this.myvedio.play();
    // },
    downloadFile(url) {
      var downurl = this.domain + url;
      var a = document.createElement("a");
      a.setAttribute("href", downurl);
      a.setAttribute("target", "_blank");
      a.setAttribute("id", "camnpr");
      document.body.appendChild(a);
      a.click();
    },
    cancel() {
      this.closevedio = false;
      this.myvedio.play();
    },
    close() {
      this.$router.push("study");
    },
    //视频详情
    gostudydetail(id) {
      this.util
        .postAjax({
          code: code.base,
          url: code.getstudydetail,
          data: { id: id },
        })
        .then((res) => {
          if (res.success) {
            this.vediodetail = res.item;
            this.vediodetail.createTime = this.util.formatTime(
              this.vediodetail.createTime,
              "YYYY-MM-DD hh:ss"
            );
            var controlBar;
            if (this.isneedvideocontrol == "1") {
              controlBar = {
                // 设置控制条组件
                /* 使用children的形式可以控制每一个控件的位置，以及显示与否 */
                children: [
                  { name: "playToggle" }, // 播放按钮
                  { name: "currentTimeDisplay" }, // 当前已播放时间
                  //   {name: 'progressControl'}, // 播放进度条
                  { name: "durationDisplay" }, // 总时间
                  //   { // 倍数播放
                  //     name: 'playbackRateMenuButton',
                  //     'playbackRates': [0.5, 1, 1.5, 2, 2.5]
                  //   },
                  {
                    name: "volumePanel", // 音量控制
                    inline: false, // 不使用水平方式
                  },
                  { name: "FullscreenToggle" }, // 全屏
                ],
              };
            } else {
              controlBar = {
                // 设置控制条组件
                /* 使用children的形式可以控制每一个控件的位置，以及显示与否 */
                children: [
                  { name: "playToggle" }, // 播放按钮
                  { name: "currentTimeDisplay" }, // 当前已播放时间
                  { name: "progressControl" }, // 播放进度条
                  { name: "durationDisplay" }, // 总时间
                  {
                    // 倍数播放
                    name: "playbackRateMenuButton",
                    playbackRates: [0.5, 1, 1.5, 2, 2.5],
                  },
                  {
                    name: "volumePanel", // 音量控制
                    inline: false, // 不使用水平方式
                  },
                  { name: "FullscreenToggle" }, // 全屏
                ],
              };
            }

            this.myvedio = this.$video(
              document.getElementById("vedio"),
              {
                preload: "auto",
                autoplay: true,
                controls: true,
                fluid: true, // 自适应宽高
                language: "zh-CN", // 设置语言
                muted: false, // 是否静音
                inactivityTimeout: false,
                controlBar: controlBar,
                sources: [
                  // 视频源
                  {
                    src: this.domain + this.vediodetail.url,
                    type: "video/mp4",
                  },
                ],
              },
              () => {
                setTimeout(() => {
                  this.vedioduration = Math.floor(this.myvedio.cache_.duration);
                  this.vediocurr = Math.floor(this.myvedio.cache_.currentTime);
                }, 500);
              }
            );
          }
        });
    },
    //获取视频总时长
    getTitalTimes() {
      this.myvedio = document.getElementById("vedio");
      this.vedioduration = Math.floor(this.myvedio.duration);
    },
    //隔2分钟调取一次接口
    interval() {
      this.util
        .postAjax({
          code: code.base,
          url: code.onlineadd,
          // data:{type:2}
        })
        .then((res) => {
          // this.util.postAjax({
          //     code:code.base,
          //     url:code.onlineadd,
          //     data:{type:1}
          // }).then(res => {
          console.log("加1", res);
          // });
        });
    },
    //刚进来查看+1
    readadd(id) {
      this.util
        .postAjax({
          code: code.base,
          url: code.readnum,
          data: { resId: id },
        })
        .then((res) => {
          this.singletime = 0; //刚进来恢复0,用于计时2分钟的
          //刚进来调取已经学习的分钟数
          this.util
            .postAjax({
              code: code.base,
              url: code.onlineadd,
              data: { action: "init" },
            })
            .then((data) => {
              this.util
                .postAjax({
                  code: code.base,
                  url: code.lrecordqueryUserRecord,
                })
                .then((res) => {
                  if (res.success) {
                    if (!res.studytime) {
                      res.studytime = 0;
                    }
                    this.onlineTime = parseInt(res.studytime) * 60;
                    this.formatonlineTime = this.util
                      .formatSeconds(this.onlineTime)
                      .split(":");
                    this.timer = setInterval(() => {
                      this.onlineTime++;
                      this.singletime++;
                      this.formatonlineTime = this.util
                        .formatSeconds(this.onlineTime)
                        .split(":");
                      if (this.singletime == 61) {
                        //及时到2分钟，调取type=2的接口
                        this.singletime = 0;
                        this.interval();
                      }
                    }, 1000);
                  } else {
                    this.$message.error(res.message);
                  }
                });
            });
        });
    },
    //返回
    goback() {
      this.vedioduration = Math.floor(this.myvedio.cache_.duration);
      this.vediocurr = Math.floor(this.myvedio.cache_.currentTime);
      if (!this.playend) {
        if (this.vedioduration - this.vediocurr == 0) {
          this.$router.push("study");
          return;
        } else {
          this.myvedio.pause();
          this.closevedio = true;
        }
      } else {
        this.$router.push("study");
        return;
      }
    },
    //下载
    downvedio(url) {
      this.util
        .postAjax({
          code: code.base,
          url: code.downloadnum,
          data: {
            resId: this.id,
          },
        })
        .then(() => {
          var downurl = this.domain + url;
          var a = document.createElement("a");
          a.setAttribute("href", downurl);
          a.setAttribute("target", "_blank");
          a.setAttribute("id", "camnpr");
          document.body.appendChild(a);
          a.click();
          this.util
            .postAjax({
              code: code.base,
              url: code.onlineadd,
              data: {
                type: 1,
              },
            })
            .then(() => {
              // console.log("刷新本页面！");
            });
        });
    },
    //进来就调取学完的接口
    endstudy(id) {
      this.util
        .postAjax({
          code: code.base,
          url: code.saveStudyed,
          data: { id: id },
        })
        .then((res) => {
          console.log("end", res);
        });
    },
    goBack_() {
      console.log(this.isneedvideocontrol);
      this.vedioduration = Math.floor(this.myvedio.cache_.duration);
      // this.vediocurr = Math.floor(this.myvedio.currentTime);
      this.vediocurr = Math.floor(this.myvedio.cache_.currentTime);
      if (!this.playend) {
        if (this.vedioduration - this.vediocurr == 0) {
          this.$router.push("study");
          return;
        } else {
          this.myvedio.pause();
          this.closevedio = true;
          if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener("popstate", this.goBack_, false);
          }
          // this.myvedio.pause();
          // this.closevedio = true;
        }
      } else {
        this.$router.push("study");
        return;
      }
    },
    goBack_1() {
      this.$router.push("study");
    },
    //将秒转成时分秒
    formatSeconds(value) {
      let result = parseInt(value);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);

      let res = "";
      if (h !== "00") res += `${h}时`;
      if (m !== "00") res += `${m}分`;
      res += `${s}秒`;
      return res;
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  //页面销毁时，取消监听。否则其他vue路由页面也会被监听
  destroyed() {
    window.removeEventListener("popstate", this.goBack_, false);
  },
  created() {
    this.isneedvideocontrol = window.sessionStorage.getItem(
      "isneedvideocontrol"
    )
      ? window.sessionStorage.getItem("isneedvideocontrol")
      : false;
    this.gostudydetail(this.id);
    this.readadd(this.id);
    // setTimeout(()=>{
    //     this.getTitalTimes();
    // },1000)
  },
  mounted() {
    if (this.isneedvideocontrol == "1") {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener("popstate", this.goBack_, false);
      }
      var md = document.getElementsByTagName("video")[0];
      md.loop = false
      md.addEventListener("ended", () => {
        this.playend = true;
        if (this.islearnnum || this.islearnnum == "true") {
          if (!this.ended || this.ended == "false") {
            this.endstudy(this.id);
          }
        }
        // clearInterval(this.timer);
        console.log("结束");
      });
      console.log(md);
    } else {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener("popstate", this.goBack_1, false);
      }
    }
  },
};
</script>
<style scoped>
.video-js {
  /* 给.video-js设置字体大小以统一各浏览器样式表现，因为video.js采用的是em单位 */
  font-size: 14px;
}
.video-js button {
  outline: none;
}
.video-js.vjs-fluid,
.video-js.vjs-16-9,
.video-js.vjs-4-3 {
  /* 视频占满容器高度 */
  height: 100%;
  background-color: #161616;
}
.vjs-poster {
  background-color: #161616;
}
.video-js .vjs-big-play-button {
  /* 中间大的播放按钮 */
  font-size: 2.5em;
  line-height: 2.3em;
  height: 2.5em;
  width: 2.5em;
  -webkit-border-radius: 2.5em;
  -moz-border-radius: 2.5em;
  border-radius: 2.5em;
  background-color: rgba(115, 133, 159, 0.5);
  border-width: 0.12em;
  margin-top: -1.25em;
  margin-left: -1.75em;
}
.video-js.vjs-paused .vjs-big-play-button {
  /* 视频暂停时显示播放按钮 */
  display: block;
}
.video-js.vjs-error .vjs-big-play-button {
  /* 视频加载出错时隐藏播放按钮 */
  display: none;
}
.vjs-loading-spinner {
  /* 加载圆圈 */
  font-size: 2.5em;
  width: 2em;
  height: 2em;
  border-radius: 1em;
  margin-top: -1em;
  margin-left: -1.5em;
}
.video-js .vjs-current-time,
.vjs-no-flex .vjs-current-time {
  display: block;
}
.video-js .vjs-control-bar {
  /* 控制条默认显示 */
  display: flex;
}
.video-js .vjs-duration {
  display: block;
}
.video-js .vjs-time-control,
.video-js .vjs-current-time {
  display: block !important;
}
.video-js .vjs-remaining-time {
  display: block;
}

.vjs-button > .vjs-icon-placeholder:before {
  /* 控制条所有图标，图标字体大小最好使用px单位，如果使用em，各浏览器表现可能会不大一样 */
  font-size: 22px;
  line-height: 1.9;
}
.video-js .vjs-playback-rate .vjs-playback-rate-value {
  line-height: 2.4;
  font-size: 18px;
}
/* 进度条背景色 */
.video-js .vjs-play-progress {
  color: #ffb845;
  background-color: #ffb845;
}
.video-js .vjs-progress-control .vjs-mouse-display {
  background-color: #ffb845;
}
.vjs-mouse-display .vjs-time-tooltip {
  padding-bottom: 6px;
  background-color: #ffb845;
}
.video-js .vjs-play-progress .vjs-time-tooltip {
  display: none !important;
}

.vediobtns {
  width: 100%;
  height: 38px;
  border-radius: 3px;
  margin-top: 40px;
  text-align: center;
}
.cancel,
.sure {
  width: 83px;
  height: 38px;
  border-radius: 3px;
  border: 1px solid rgba(184, 187, 190, 1);
  font-size: 14px;
  font-weight: 400;
  color: rgba(98, 101, 109, 1);
  background: #fff;
  line-height: 38px;
  text-align: center;
  outline: none;
}
.sure {
  background: rgba(20, 114, 255, 1);
  color: #fff;
  border: none;
  margin-left: 20px;
}
.closevedio_top {
  width: 36px;
  height: 36px;
  background: url(../../../static/img/exit.png) no-repeat center center;
  background-size: cover;
  /* border:1px solid rgba(254,62,97,1); */
  margin: 0 auto;
  margin-bottom: 17px;
}
.closevedio_ > p {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: rgba(31, 35, 47, 1);
  line-height: 20px;
}
.closevedio_box {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
}
.closevedio_ {
  width: 383px;
  height: 211px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 30px;
  box-sizing: border-box;
}
.vediodetail_auto,
.vediodetail_ {
  width: 1100px;
  height: 100%;
  background: #fff;
  margin: 0 auto;
}
.vediodetail_auto {
  height: calc(100% - 60px);
  overflow-y: scroll;
}
.vediodetail_vedio {
  width: 100%;
  height: 567px;
  background: rgba(132, 147, 168, 1);
}
.vediodetail_title {
  width: 1100px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  padding: 30px 20px;
  box-sizing: border-box;
}
.vediodetail_title > h4 {
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(31, 35, 47, 1);
  line-height: 20px;
  margin-top: 20px;
}
.vediodetail_title > p {
  width: 1040px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(31, 35, 47, 1);
  line-height: 20px;
  margin-top: 10px;
}
.vediodetail_title_ {
  width: 100%;
  margin: 0 auto;
  /* border-bottom: 1px solid #E8EBEF; */
  padding-bottom: 20px;
  box-sizing: border-box;
}
.vediodetail_title_ > h3 {
  width: 80%;
  height: 25px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(31, 35, 47, 1);
  line-height: 25px;
  float: left;
}
.vediodetail_title_ > p {
  width: 20%;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(184, 187, 190, 1);
  line-height: 20px;
  text-align: right;
  float: right;
}
.vediodetail_title_ > p > .see > i,
.vediodetail_title_ > p > .down > i {
  display: inline-block;
  width: 15px;
  height: 11px;
  background: url(../../../static/img/see.png) no-repeat center center;
  background-size: cover;
  margin-right: 5px;
  margin-top: 3px;
}
.vediodetail_title_ > p > .down > i {
  background: url(../../../static/img/down.png) no-repeat center center;
  background-size: contain;
  margin-left: 20px;
}
.study_time {
  display: inline-block;
  width: calc(100% - 200px);
  font-size: 14px;
  font-weight: 400;
  color: rgba(26, 119, 255, 1);
  text-align: center;
}
.study_time > i {
  display: inline-block;
  /* width:17px; */
  height: 20px;
  background: rgba(205, 225, 255, 1);
  border-radius: 3px;
  line-height: 20px;
  text-align: center;
  margin: 0 2px;
  font-style: normal;
}
.study_time > i:first-of-type {
  margin-left: 10px;
}
/* .vediodetail_title_>p>.down{
        margin-left: 16px;
    } */
.vediodetail_btns {
  margin: 15px;
}
</style>
