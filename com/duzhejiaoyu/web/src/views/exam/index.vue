<template>
  <div class="exam" v-loading="loading">
    <div v-if="userInfo.isPassExam == '1'">
      <div class="info">
        <p class="success">恭喜，读书证已激活！</p>
      </div>
    </div>
    <div v-else-if="!exam.id">
      <div class="info">
        <p>暂无入馆考试</p>
      </div>
    </div>
    <div v-if="!(userInfo.isPassExam == '1')">
      <div class="info" v-if="exam.id">
        <p>
          考试时间：{{
            moment(exam.startDate, "YYYYMMDD").format("YYYY-MM-DD")
          }}
          至 {{ moment(exam.endDate, "YYYYMMDD").format("YYYY-MM-DD") }}
        </p>
        <p>请学习资料并参加考试，考试通过即可激活借书证</p>
        <div>
          <div v-if="exam.isPass == '1'">
            <span class="success" v-if="exam.type == '1'"
              >真棒，考了{{ exam.score }}分，读书证已激活！</span
            >
            <span class="success" v-else>恭喜，读书证已激活！</span>
          </div>
          <div v-else>
            <el-button
              v-if="exam.type == '1'"
              class="orange-btn"
              round
              size="big"
              :disabled="lastNeedLearn > 0"
              @click="showConfirm(null, $event)"
              >立即考试</el-button
            >
            <div v-if="lastNeedLearn > 0" class="tips">
              <span>还需学习 {{ common.formatNeedTime(lastNeedLearn) }}</span>
            </div>
          </div>
        </div>
      </div>
      <!---------------------------- 普通考试 ----------------------->
      <div class="module" v-if="!exam.id || exam.type == '1'">
        <div
          class="module-box"
          v-for="(item, index) in learnData"
          :key="item.id"
        >
          <h3>{{ item.name }}</h3>
          <carousel :list="item.learns" :modelIndex="index"></carousel>
        </div>
      </div>
      <!---------------------------- 闯关考试 ----------------------->
      <div class="module" v-else>
        <div
          class="module-box"
          :class="{
            locked:
              index > 0 && exam.isOrder == 1 && !learnData[index - 1].isPass,
          }"
          v-for="(item, index) in learnData"
          :key="item.id"
        >
          <h3>{{ item.name }}</h3>
          <carousel :list="item.learns" :modelIndex="index"></carousel>
          <span v-if="item.isPass" class="module-score">
            <img src="@/assets/img/answer-right.png" alt />
            关卡得分：{{ item.score }}
          </span>
          <div v-else>
            <el-button
              class="orange-btn"
              round
              size="big"
              :disabled="item.lastNeedLearn > 0"
              @click="showConfirm(item.id, $event)"
              >立即考试</el-button
            >
            <div
              v-if="item.lastNeedLearn > 0"
              :class="{
                tips: !(
                  index > 0 &&
                  exam.isOrder == 1 &&
                  !learnData[index - 1].isPass
                ),
              }"
            >
              <span
                >还需学习 {{ common.formatNeedTime(item.lastNeedLearn) }}</span
              >
            </div>
          </div>
          <div
            v-if="
              index > 0 && exam.isOrder == 1 && !learnData[index - 1].isPass
            "
            class="locked-box"
          >
            通过上一关后解锁
          </div>
        </div>
      </div>
    </div>
    <!-------------------------------------- 确认弹窗 -------------------------------------->
    <confirm
      ref="confirm"
      title="确认开始考试？"
      :text="confirmText"
      cancelText="我再想想"
      confirmText="立即开始"
      @doConfirm="toExam"
    ></confirm>
  </div>
</template>

<script>
import {
  getLoginUserExams,
  getLoginUserLearns,
  getLoginUserRecords,
  getLoginUserExamRecords,
} from "@/api/exam";
import { getIpAddress } from "@/api/user"
import Carousel from "./carousel.vue";
import Confirm from "@/components/Confirm";
import { mapState } from "vuex";
export default {
  components: {
    Carousel,
    Confirm,
  },
  data() {
    return {
      loading: false,
      exam: {},
      moduleList: [], // 当前试卷包含的模块
      userLearns: [], // 当前登录人的所有学习资料
      userLearnRecords: [], // 当前登录人的所有学习记录
      learnData: [], // 当前试卷每个模块信息及学习资料
      lastNeedLearn: 0,
      confirmText: "",
      curModelId: null,
      localip: null,
    };
  },
  computed: mapState({
    userInfo: (state) => state.userInfo,
  }),
  watch: {
    // userLearns() {
    //   this.setLearnData();
    // },
  },
  methods: {
    // 弹窗
    showConfirm(modelId, e) {
      // 判断开启ip限制
      if (this.exam.isOpenip == "1") {
        let { ipStart, ipEnd } = this.exam;
        if (this.localip < ipStart || this.localip > ipEnd || !this.localip) {
          this.$message({
            showClose: true,
            type: "error",
            message: "当前IP地址不在考试IP范围内！",
          });
          return;
        }
      }
      // 设置考试提示内容
      if (modelId) {
        this.curModelId = modelId;
      }
      let text1 = "",
        text2 = "";
      let content = null;
      if (this.exam.type == "1") {
        content = this.exam.contents[0];
        text1 = `本次考试时间为${this.exam.duration}分钟，`;
        text2 =
          this.exam.beforeSubmitTime > 0
            ? `考试开始${this.exam.beforeSubmitTime}分钟后方可交卷。`
            : "";
      }
      if (this.exam.type == "2") {
        content = this.exam.contents.find((i) => i.modelId == modelId);
      }
      let text3 = `满分${content.totalScore}分，${content.qualifiedScore}分为合格分，`;
      this.confirmText = text1 + text2 + text3 + "准备好去考试了吗？";
      this.$nextTick(() => {
        // document.getElementsByClassName("el-dialog__wrapper")[0].scrollTop = 0;
        let timer = setInterval(() => {
          let t = document.getElementsByClassName("v-modal");
          if (t && t.length) {
            let h = document.body.scrollHeight;
            t[0].style = `height: ${h}px`; // !important`
            clearInterval(timer);
            document.body.scrollIntoView();
          }
        }, 100);
      });
      this.$refs.confirm.visible = true;
    },
    // 考试
    toExam() {
      // 当前考试内容：闯关考试为当前模块考试内容，普通考试为第一个考试内容
      let content = this.curModelId
        ? this.exam.contents.find((i) => i.modelId == this.curModelId)
        : this.exam.contents[0];
      this.$store.commit("setCurExam", {
        ...this.exam,
        content,
      });
      this.$router.push("/exam/examing");
    },
    // 获取登录人试卷 只会存在一个考试
    getLoginUserExams() {
      this.loading = true;
      getLoginUserExams()
        .then(async (res) => {
          // this.loading = false;
          if (res.code == "000000") {
            let data = res.data || {};
            let pointExams = data.pointExams || [];
            let normalExams = data.normalExams || [];
            if (pointExams.length > 0) {
              this.exam = pointExams[0];
              this.moduleList = this.exam.contents.map((i, index) => {
                return {
                  id: i.modelId,
                  name: i.modelName,
                  level: index,
                  needLearn: i.needLearn,
                };
              });
            }
            if (normalExams.length > 0) {
              this.exam = normalExams[0];
              // this.moduleList = this.exam.models;
              this.moduleList = await this.$store.dispatch("getModuleList");
            }
            if (!this.exam.id) {
              this.moduleList = await this.$store.dispatch("getModuleList");
            }
            this.getLoginUserLearns();
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    //获取本地ip
    getUserIP(onNewIP) {
      //  onNewIp - your listener function for new IPs
      //compatibility for firefox and chrome
      var myPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
          iceServers: [
            { urls: "stun:stun.services.mozilla.com" },
            { urls: "stun:stun.l.google.com:19302" },
          ],
        }),
        noop = function () {},
        localIPs = {},
        ipRegex =
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

      function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
      }

      //create a bogus data channel
      pc.createDataChannel("");

      // create offer and set local description
      pc.createOffer()
        .then(function (sdp) {
          sdp.sdp.split("\n").forEach(function (line) {
            if (line.indexOf("candidate") < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });

          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch(function (reason) {
          // An error occurred, so handle the failure to connect
        });
      //sten for candidate events
      pc.onicecandidate = function (ice) {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    },

    // 获取登录人所有培训资料
    getLoginUserLearns() {
      getLoginUserLearns()
        .then((res) => {
          if (res.code == "000000") {
            let data = res.data || [];
            this.userLearns = data;
            // 设置学习资料
            this.setLearnData();
            return Promise.resolve(data);
          } else {
            this.loading = false;
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          return Promise.reject(err);
        });
    },
    // 设置模块培训资料
    setLearnData() {
      this.learnData = this.moduleList.map((i) => {
        let data = this.userLearns.filter(
          (j) => j.modelIds && j.modelIds.includes(i.id)
        );
        return {
          ...i,
          learns: data,
        };
      });
      this.learnData.sort((a, b) => a.level - b.level);
      this.learnData = this.learnData.filter((l) => l.learns.length);
      this.getLoginUserRecords();
    },
    // 获取登录人学习记录
    getLoginUserRecords() {
      let _this = this;
      getLoginUserRecords()
        .then((res) => {
          if (res.code == "000000") {
            let data = res.data || [];
            _this.userLearnRecords = data;
            // 设置需要学习的时间
            _this.setLastNeedLearn();
            return Promise.resolve(data);
          } else {
            _this.loading = false;
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
          _this.loading = false;
          return Promise.reject(err);
        });
    },
    // 设置需要学习时间
    setLastNeedLearn() {
      // ——普通考试
      if (this.exam.type == "1" && this.exam.needLearn > 0) {
        let learnTimes = this.userLearnRecords.reduce((sum, cur) => {
          return sum + cur.duration * 60;
        }, 0);
        let diff = this.exam.needLearn * 60 - learnTimes;
        this.lastNeedLearn = diff > 0 ? diff : 0;
      }
      // ——闯关考试
      if (this.exam.type == "2") {
        let _this = this;
        this.learnData.forEach((i) => {
          let moduleRecords = _this.userLearnRecords.filter((j) => {
            let t = j.modelIds || [];
            if (typeof t === "string") {
              t = t.split(",");
            }
            t.forEach((c, id) => {
              t[id] = c + "";
            });
            return t.includes(i.id + "");
          });
          i.learnTimes = moduleRecords.reduce((sum, cur) => {
            return sum + cur.duration * 60;
          }, 0);
          let lastNeedLearn = 0;
          if (i && i.needLearn > 0) {
            let diff = i.needLearn * 60 - i.learnTimes;
            lastNeedLearn = diff > 0 ? diff : 0;
          }
          _this.$set(i, "lastNeedLearn", lastNeedLearn);
        });
      }
      // 设置考试记录
      this.setExamRecord();
    },
    // 获取登录人当前试卷的考试记录
    getLoginUserExamRecords() {
      return getLoginUserExamRecords(this.exam.id)
        .then((res) => {
          if (res.code == "000000") {
            const numTrans = (n) => {
              let reg = /[0-9]+/;
              if (reg.test(n)) {
                return parseFloat(n);
              }
              return 0;
            };
            let data = res.data || [];
            let result = data[0] || {};
            if (this.exam.id) {
              const tmp = data.filter((d) => d.examId === this.exam.id) || [];
              tmp.forEach((t) => {
                if (numTrans(result.createTime) < numTrans(t.createTime)) {
                  result = t;
                }
              });
            }
            this.$set(this.exam, "isPass", result.isPass);
            if (this.exam.type == "1") {
              this.$set(this.exam, "score", result.score || 0);
            }
            return Promise.resolve(result);
          } else {
            this.loading = false;
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          return Promise.reject(err);
        });
    },
    // 设置考试记录
    async setExamRecord() {
      let records = await this.getLoginUserExamRecords();
      if (this.exam.type == "2") {
        let recordModels = records.recordModels || [];
        this.learnData.forEach((i) => {
          let obj = recordModels.find((j) => j.modelId == i.id) || {};
          this.$set(i, "isPass", obj.isPass || 0);
          this.$set(i, "score", obj.score || 0);
        });
      }
      this.loading = false;
      this.$store.commit("setExamLearnData", this.learnData);
      this.$store.commit("setCurExam", this.exam);
    },
    getIp() {
      getIpAddress().then(res => {
        if (res && res.code === "000000") {
          this.localip = res.data && res.data.ip
        }
      })
    }
  },
  created() {
    this.getLoginUserExams();
    this.$store.dispatch("getUserInfo");
    this.getIp()
  },
};
</script>

<style lang="scss" scoped>
.exam {
  position: relative;
  min-width: 1252px;
  min-height: 1970px;
  background: url("~@/assets/img/exam-title.png") center 100px no-repeat,
    url("~@/assets/img/exam-title-bg.png") center 220px no-repeat,
    url("~@/assets/img/exam-bg-1.png") center 0 no-repeat,
    url("~@/assets/img/exam-bg-2.png") center 360px no-repeat,
    url("~@/assets/img/exam-bg-3.png") center 720px no-repeat,
    url("~@/assets/img/exam-bg-4.png") center 1080px no-repeat,
    url("~@/assets/img/exam-bg-5.png") center 1440px no-repeat,
    url("~@/assets/img/exam-bg-6.png") center bottom no-repeat;
  background-color: #fad489;
}
.info {
  position: absolute;
  top: 250px;
  left: 50%;
  transform: translate(-50%);
  p {
    color: #ffffff;
    line-height: 20px;
    text-align: center;
  }
  .el-button,
  .success {
    display: inline-block;
    width: 360px;
    margin-top: 12px;
  }
  .tips {
    top: 56px;
    left: 376px;
  }
  .success {
    font-size: 16px;
    font-weight: 600;
    color: #8289f1;
    background: #ffffff;
    border-radius: 21px;
    text-align: center;
    padding: 10px 0;
  }
}
.tips {
  position: absolute;
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
.module {
  width: 1040px;
  margin: 0 auto;
  padding: 380px 20px 20px;
}
.module-box {
  position: relative;
  width: 1000px;
  height: 360px;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
  border-radius: 8px;
  opacity: 0.9;
  border: 1px solid #e5e8ed;
  margin-bottom: 40px;
  padding: 40px;
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #6576e9;
    line-height: 34px;
    margin-bottom: 20px;
  }
  .el-button,
  .module-score {
    position: absolute;
    right: 40px;
    top: 36px;
    width: 160px;
  }
  .tips {
    top: 40px;
    right: -100px;
  }
  &.locked .el-button {
    background: #cccccc;
    border-color: #cccccc;
  }
  .module-score {
    width: auto;
    font-size: 16px;
    font-weight: 600;
    color: #48be74;
    line-height: 22px;
    img {
      width: 24px;
      height: 24px;
      vertical-align: bottom;
    }
  }
}
.locked-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  text-align: center;
  padding-top: 40px;
  font-size: 16px;
  color: #ffffff;
  z-index: 3000;
}
</style>