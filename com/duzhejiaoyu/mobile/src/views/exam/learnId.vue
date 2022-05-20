<template>
  <div class="page" id="pages">
    <!-- <div class="page" :style="{ height: sH }" id="pages"> -->
    <van-sticky>
      <van-nav-bar title="入馆考试" left-arrow @click-left="onClickLeft" />
    </van-sticky>

    <div class="learn-content">
      <!---------------------------- 标题和信息 ---------------------------->
      <div class="content-left">
        <h3 v-if="!(detail.type == '1')">{{ detail.name }}</h3>
        <div class="sub" v-if="!(detail.type == '1')">
          <p class="w">
            {{ detail.watchCount }}阅读
            {{
              detail.type == "2" ? " . " + detail.downloadCount + "下载" : ""
            }}
            <!-- {{
              detail.type == "2"
                ? common.learnSizeFormat(detail.fileSize) + " ·"
                : ""
            }}
            {{ common.defaultTimeFormat(detail.createTime) }} -->
          </p>
          <p v-if="detail.type == '2'" class="download" @click="downloadF">
            <img src="@/assets/img/download.png" />下载
          </p>
        </div>

        <!---------------------------- 视频和文档 ---------------------------->
        <div class="video-box" v-if="detail.id">
          <video
            v-if="detail.type == '1'"
            ref="video"
            :src="fileViewUrl + detail.id"
            controls
            x5-video-player-type="h5"
            webkit-playsinline
            playsinline
          >
            您的浏览器不支持HTML5 video标签
          </video>
          <!-- <iframe
            v-if="detail.type == '2'"
            ref="pdf"
            :src="fileViewUrl + detail.id"
            width="100%"
            height="450px"
          ></iframe> -->
          <iframe
            v-if="detail.type == '2'"
            :src="
              './static/pdf/web/viewer.html?file=' + fileViewUrl + detail.id
            "
            class="iframepdf"
            frameborder="0"
            id="pdfContainer"
            name="pdfContainer"
            ref="pdf"
            width="100%"
            height="450px"
          ></iframe>
        </div>
        <h3 v-if="detail.type == '1'" style="margin: 5px 0">
          {{ detail.name }}
        </h3>
        <div class="sub" v-if="detail.type == '1'">
          <p class="w">
            {{ detail.watchCount }}阅读 ·
            {{ detail.type == "1" ? detail.downloadCount + "下载" : "" }}
          </p>
          <p v-if="detail.type == '1'" class="download" @click="downloadF">
            <img src="@/assets/img/download.png" />下载
          </p>
        </div>

        <!---------------------------- 封面和简介 ---------------------------->
        <div class="desc-box">
          <img :src="imgViewUrl + detail.cover" alt />
          <div class="desc" :class="{ hide: !isActive, act: isActive }">
            <button
              class="btn"
              @click="isActive = !isActive"
              v-if="detail.desc && detail.desc.length > 70"
            >
              {{ isActive ? "收起" : "展开" }}
            </button>
            {{ detail.desc }}
          </div>
        </div>
        <!---------------------------- 在线文章 ---------------------------->
        <div
          class="dhtml"
          v-if="detail.type == '3'"
          v-html="detail.dhtml"
        ></div>
      </div>
      <!---------------------------- 其他学习 ---------------------------->

      <div class="content-right" id="content-right">
        <div class="section4" @click="toLearnId">
          <span class="infoBox2">学<br />习<br />更<br />多</span>
        </div>
        <div class="learn-list">
          <h3>接下来学习</h3>
          <ul>
            <li
              v-for="(item, index) in modelLearnList"
              :key="index"
              :class="{ active: item.id == detail.id }"
              @click="changeLearn(index)"
            >
              <i :class="`iconfont icon-learn-${item.type}`"></i>
              <span class="title ellipsis"
                >{{ item.name }}
                <span class="size" v-if="item.type != 3">{{
                  common.learnSizeFormat(item.fileSize)
                }}</span>
              </span>
              <p class="ellipsis">{{ item.desc }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLoginUserRecords, startLearn } from "@/api/exam";
export default {
  name: "examLearnId",
  data() {
    return {
      modelId: null,
      learnId: null,
      fileViewUrl: window.g.fileViewUrl,
      imgViewUrl: window.g.viewUrl,
      timer: null,
      learnTimes: 0, // 已学习时长:分钟
      nowLearnTime: 0,
      nowTimer: null,
      lastNeedLearn: 0, // 还需学习时长
      records: [],
      loading: false,
      // sH: "auto",
      top: "751px",
      isActive: false,
    };
  },
  computed: mapState({
    curExam: (state) => state.curExam,
    examLearnData: (state) => state.examLearnData,
    curLearn: (state) => state.curLearn, // 当前模块id及资料id
    curModel() {
      // 当前模块详情
      return this.examLearnData[this.curLearn.modelIndex];
    },
    modelLearnList() {
      return this.curModel.learns;
    },
    detail() {
      let data = this.modelLearnList[this.curLearn.learnIndex];
      return data;
    },
  }),
  methods: {
    downloadF() {
      let f = this.detail.fileName;
      let a = f.split(".") || [];
      let len = a.length;
      let ext = len && a[len - 1];
      let left = f.indexOf("." + ext);
      let name = f.substring(0, left);
      this.util.exportFile(
        "learn/download/" + this.detail.id,
        true,
        {},
        name,
        'pdf'
      );
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    toLearnId() {
      this.$store.commit("setCurLearn", {
        modelIndex: this.curLearn.modelIndex,
        learnIndex: 0,
      });
      this.$router.push(`/exam/learn`);
    },
    // 考试
    toExam() {
      // 当前考试内容：闯关考试为当前模块考试内容，普通考试为第一个考试内容
      let exam = this.curExam;
      let content =
        exam.type == "2"
          ? exam.contents.find((i) => i.modelId == this.curModel.id)
          : exam.contents[0];
      this.$store.commit("setCurExam", {
        ...exam,
        content,
      });
      this.$router.push("/exam/examing");
    },
    // 开始学习,每隔一分钟调一次学习接口
    startLearn(learnid) {
      startLearn({ id: learnid });
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        startLearn({ id: learnid });
      }, 60 * 1000);
    },

    // 切换学习资料
    changeLearn(index) {
      this.$store.commit("setCurLearn", {
        modelIndex: this.curLearn.modelIndex,
        learnIndex: index,
      });
      this.startLearn(this.modelLearnList[index].id);
      this.getLoginUserRecords();
    },

    // 获取登录人学习记录
    getLoginUserRecords() {
      this.loading = true;
      return getLoginUserRecords()
        .then((res) => {
          this.loading = false;
          if (res.code == "000000") {
            let data = res.data || [];
            this.records = data;
            this.setLastNeedLearn();
            return Promise.resolve(data);
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          return Promise.reject(err);
        });
    },

    // 设置需要学习时间--普通考试1,闯关考试2
    setLastNeedLearn() {
      let diff = 0;

      // 普通考试
      if (this.curExam.type == "1") {
        this.nowLearnTime = this.records.reduce((sum, cur) => {
          return sum + cur.duration * 60;
        }, 0);
        diff = this.curExam.needLearn * 60 - this.nowLearnTime;
      }

      // 闯关考试
      if (this.curExam.type == "2") {
        let moduleRecords = this.records.filter((j) => {
          // j.modelIds.includes(this.curModel.id)
          let t = j.modelIds || [];
          if (typeof t === "string") {
            t = t.split(",");
          }
          t.forEach((c, id) => {
            t[id] = c + "";
          });
          return t.includes(this.curModel.id + "");
        });
        // 当前模块的学习时间
        this.nowLearnTime = this.curModel.learnTimes = moduleRecords.reduce(
          (sum, cur) => {
            return sum + cur.duration * 60;
          },
          0
        );
        diff = this.curModel.needLearn * 60 - this.nowLearnTime;
      }

      this.lastNeedLearn = diff > 0 ? diff : 0;
      clearInterval(this.nowTimer);
      this.nowTimer = setInterval(() => {
        this.nowLearnTime += 1;
        this.lastNeedLearn =
          this.lastNeedLearn > 0 ? this.lastNeedLearn - 1 : 0;
        this.$store.commit("setTime", {
          now: this.nowLearnTime,
          need: this.lastNeedLearn,
        });
      }, 1000);
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.nowTimer);
  },
  created() {
    this.getLoginUserRecords();
    this.startLearn(this.detail.id);
  },
  // mounted() {
  //   setTimeout(() => {
  //     let h = document.body.scrollHeight;
  //     let d = document.getElementById("content-right");
  //     if (h > 1040) {
  //       this.sH = h + d.scrollHeight + "px";
  //     }
  //     this.top = d.getBoundingClientRect().top + "px";
  //   }, 1000);
  // },
};
</script>

<style lang="scss" scoped>
.page {
  width: 750px;
  min-height: 1040px;
  // max-height: 1334px;
  background-color: rgba(255, 255, 255, 1);
  position: relative;
  .model {
    position: sticky;
  }
}
.section4 {
  height: 152px;
  border-radius: 20px 0 0 20px;
  background-color: rgba(46, 56, 76, 0.5);
  margin-top: 0;
  width: 46px;
  position: absolute;
  right: 0;
}

.infoBox2 {
  margin: 20px auto 0;
  width: 24px;
  height: 112px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
  line-height: 28px;
  text-align: justify;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 9999;
}
.learn-content {
  margin: 0 32px;
  overflow-y: auto;
}
.content-left {
  float: left;
  width: 100%;
  padding: 20px 0;
  h3 {
    font-size: 40px;
    font-weight: 600;
    color: #373b4b;
    line-height: 56px;
    margin-bottom: 10px;
    height: auto;
  }
  .sub {
    font-size: 22px;
    font-weight: 400;
    color: #7e8081;
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
    vertical-align: middle;
    .w {
      float: left;
    }
    .download {
      cursor: pointer;
      float: right;
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
  video {
    width: 100%;
    height: 450px;
  }
  .desc-box {
    border: 1px solid #dbdbdb;
    border-width: 1px 0;
    padding: 20px 0;
    margin: 20px 0;
    display: flex;
    img {
      height: 100px;
      width: 150px;
      margin-right: 20px;
    }
    .desc {
      flex: 1;
      color: #7e8081;
      line-height: 34px;
      font-size: 24px;
      text-overflow: ellipsis;
      &.hide {
        height: 136px;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
      &.act {
        height: "auto";
      }
      &::before {
        content: "";
        float: right;
        width: 0px;
        height: calc(100% - 24px); /*先随便设置一个高度*/
        background: red;
      }
      .btn {
        float: right;
        /*其他装饰样式*/
        clear: both;
        border: 0px;
      }
    }
  }
  .tag-box {
    label {
      color: #5f6464;
      line-height: 32px;
    }
    .tags {
      display: inline-block;
      width: calc(100% - 80px);
      vertical-align: top;
      margin-bottom: 10px;
    }
    span {
      display: inline-block;
      background: #f1f2f3;
      border-radius: 16px;
      color: #61666d;
      line-height: 22px;
      padding: 5px 12px;
      margin-right: 10px;
      margin-bottom: 10px;
      white-space: nowrap;
    }
  }
  .dhtml {
    overflow-y: auto;
    color: #5f6464;
    height: 450px;
    line-height: 24px;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
}
.content-right {
  float: left;
  width: 100%;
  margin-bottom: 120px;
}

.learn-list {
  max-height: 600px;
  padding: 20px;
  background: #f5f6f9;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow-y: auto;
  h3 {
    font-size: 28px;
    font-weight: 600;
    color: #9ca1b1;
    line-height: 28px;
    margin-bottom: 20px;
  }
  ul {
    min-height: 300;
    overflow-y: auto;
  }
  li {
    padding-bottom: 20px;
    border-bottom: 1px solid #dbdbdb;
    margin-bottom: 20px;
    cursor: pointer;
    font-size: 32px;
    i {
      height: 32px;
      line-height: 32px;
      vertical-align: top;
      margin-right: 10px;
    }
    .title {
      font-weight: 400;
      color: #373b4b;
      line-height: 32px;
      width: calc(100% - 80px);
    }
    .size {
      font-size: 13px;
      line-height: 26px;
      vertical-align: top;
      color: #7e8081;
      float: right;
    }
    p {
      width: calc(100% - 30px);
      font-size: 26px;
      color: #7e8081;
      line-height: 26px;
      margin-top: 10px;
      padding-left: 30px;
    }
    &.active .title,
    &.active i,
    &:hover .title,
    &:hover i {
      color: #3a78fc;
    }
  }
}
.learn-time {
  position: relative;
  height: 180px;
  background: #ebeef3;
  border-radius: 5px;
  text-align: center;
  padding: 20px 0;
  p {
    font-size: 14px;
    font-weight: 600;
    color: #9ca1b1;
    line-height: 20px;
  }

  .tips {
    position: absolute;
    top: 122px;
    left: 320px;
    font-size: 13px;
    color: #ffffff;
    line-height: 18px;
    padding: 6px 10px;
    background: #df4d2e;
    border-radius: 4px;
    white-space: nowrap;
    &::before {
      content: "";
      position: absolute;
      top: 10px;
      left: -12px;
      border: 6px solid #df4d2e;
      border-color: transparent #df4d2e transparent transparent;
    }
  }
}
.time {
  padding: 12px 0 20px;
  span {
    display: inline-block;
    background: #fafafa;
    border-radius: 5px;
    opacity: 0.8;
    color: #3a78fc;
    font-size: 20px;
    font-weight: 600;
    color: #3a78fc;
    line-height: 28px;
    padding: 10px;
    &:not(:last-child) {
      margin-right: 10px;
    }
    &.split {
      background: none;
    }
  }
}
.orange-btn {
  width: 250px;
}
.iframepdf {
  // width: 100%;
  // height: 450px;
  // overflow: hidden;
  /* background: red; */
  // position: relative;
}
</style>
