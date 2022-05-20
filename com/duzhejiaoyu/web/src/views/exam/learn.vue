<template>
  <div class="user-learn">
    <!---------------------------- 模块步骤条 ---------------------------->
    <model-step
      :list="examLearnData"
      :exam="curExam"
      @doFunc="getLoginUserRecords"
    ></model-step>
    <div class="learn-content">
      <!---------------------------- 左侧内容 ---------------------------->
      <div class="content-left">
        <h3>{{ detail.name }}</h3>
        <div class="sub">
          <p class="w">
            <!-- {{ detail.watchCount }}阅读 · {{ detail.downloadCount }}下载 -->
            {{ detail.watchCount }}阅读 ·
            {{ !(detail.type == "3") ? detail.downloadCount + "下载 ·" : "" }}
            {{
              !(detail.type == "3")
                ? common.learnSizeFormat(detail.fileSize) + " ·"
                : ""
            }}
            {{ common.defaultTimeFormat(detail.createTime) }}
          </p>
          <p v-if="!(detail.type == '3')" class="download" @click="downloadF">
            <img src="@/assets/img/download.png" />下载
          </p>
        </div>
        <!---------------------------- 视频和文档 ---------------------------->
        <div class="video-box" v-if="detail.id">
          <video
            v-if="detail.type == '1'"
            ref="video"
            controls="controls"
            :src="fileViewUrl + detail.id"
          >
            您的浏览器不支持HTML5 video标签
          </video>
          <iframe
            v-if="detail.type == '2'"
            ref="pdf"
            :src="fileViewUrl + detail.id"
            width="100%"
            height="450px"
          ></iframe>
        </div>
        <!---------------------------- 封面和简介 ---------------------------->
        <div class="desc-box">
          <img :src="imgViewUrl + detail.cover" alt />
          <div class="desc">{{ detail.desc }}</div>
        </div>
        <!---------------------------- 在线文章 ---------------------------->
        <div
          class="dhtml"
          v-if="detail.type == '3'"
          v-html="detail.dhtml"
        ></div>
      </div>
      <!---------------------------- 右侧内容 ---------------------------->
      <div class="content-right">
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
              <span class="title ellipsis">{{ item.name }}</span>
              <span class="size" v-if="item.type != 3">{{
                common.learnSizeFormat(item.fileSize)
              }}</span>
              <p class="ellipsis">{{ item.desc }}</p>
            </li>
          </ul>
        </div>
        <div class="learn-time" v-loading="loading">
          <p>{{ curExam.type == "1" ? "学习总时长" : "本关卡已学习" }}</p>
          <div class="time">
            <span
              v-for="(time, index) in common.formatNeedTime(nowLearnTime)"
              :key="index"
              :class="{ split: time == ':' }"
              >{{ time }}</span
            >
          </div>
          <p
            v-if="curExam.isPass == '1' || curModel.isPass == '1'"
            style="color: #48be74; font-size: 16px"
          >
            <span v-if="curExam.isPass == '1'"
              >恭喜，考了{{ curExam.score }}分，考试已通过</span
            >
            <span v-if="curModel.isPass == '1'"
              >恭喜，考了{{ curModel.score }}分，本关卡已通过</span
            >
          </p>
          <div v-else-if="!curExam.id"></div>
          <div v-else>
            <el-button
              class="orange-btn"
              round
              size="big"
              :disabled="lastNeedLearn > 0"
              @click="toExam"
              >立即考试</el-button
            >
            <div v-if="lastNeedLearn > 0" class="tips">
              <span>还需学习 {{ common.formatNeedTime(lastNeedLearn) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ModelStep from "@/components/ModelStep";
import { getLoginUserRecords, startLearn } from "@/api/exam";
import { getIpAddress } from "@/api/user"
export default {
  components: {
    ModelStep,
  },
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
      localip: null,
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
    getIp() {
      getIpAddress().then((res) => {
        if (res && res.code === "000000") {
          this.localip = res.data && res.data.ip;
        }
      });
    },
    // 考试
    toExam() {
      if (this.curExam.isOpenip == "1") {
        let { ipStart, ipEnd } = this.curExam;
        if (this.localip < ipStart || this.localip > ipEnd || !this.localip) {
          this.$message({
            showClose: true,
            type: "error",
            message: "当前IP地址不在考试IP范围内！",
          });
          return;
        }
      }
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
    this.getIp();
  },
};
</script>

<style lang="scss" scoped>
.user-learn {
  width: 1200px;
  margin: 20px auto;
}
.learn-content {
  margin-top: 30px;
}
.content-left {
  float: left;
  width: 800px;
  margin: 0 auto;
  padding: 20px 0;
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #373b4b;
    line-height: 28px;
    margin-bottom: 10px;
  }
  .sub {
    font-size: 13px;
    font-weight: 400;
    color: #7e8081;
    line-height: 22px;
    margin-bottom: 10px;
    .w {
      display: inline-block;
    }
    .download {
      cursor: pointer;
      float: right;
      img {
        width: 13px;
        height: 13px;
      }
    }
  }
  video {
    width: 800px;
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
      width: auto;
      max-width: 168px;
      margin-right: 20px;
    }
    .desc {
      flex: 1;
      color: #7e8081;
      line-height: 22px;
      height: 90px;
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
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
    color: #5f6464;
    height: 450px;
    line-height: 24px;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
}
.content-right {
  float: right;
  width: 370px;
}
.learn-list {
  padding: 20px;
  background: #f5f6f9;
  border-radius: 5px;
  margin-bottom: 20px;
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #9ca1b1;
    line-height: 28px;
    margin-bottom: 20px;
  }
  ul {
    height: 347px;
    overflow-y: auto;
  }
  li {
    padding-bottom: 20px;
    border-bottom: 1px solid #dbdbdb;
    margin-bottom: 20px;
    cursor: pointer;
    i {
      font-size: 18px;
      line-height: 22px;
      vertical-align: top;
      margin-right: 10px;
    }
    .title {
      font-size: 16px;
      font-weight: 400;
      color: #373b4b;
      line-height: 22px;
      width: calc(100% - 80px);
    }
    .size {
      font-size: 13px;
      line-height: 22px;
      vertical-align: top;
      color: #7e8081;
    }
    p {
      width: calc(100% - 30px);
      font-size: 13px;
      color: #7e8081;
      line-height: 20px;
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
</style>
