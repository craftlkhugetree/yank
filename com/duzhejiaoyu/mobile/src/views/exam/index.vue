<template>
  <div>
    <van-sticky>
      <div class="exam1">
        <van-nav-bar
          title="入馆考试"
          class="nav-bar"
        ></van-nav-bar>
        <img class="title-bg" src="@/assets/img/exam-title.png" alt />
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
            <div v-if="exam.isPass == '1'">
              <span class="success" v-if="exam.type == '1'"
                >真棒，考了{{ exam.score }}分，读书证已激活！</span
              >
              <span class="success" v-else>恭喜，读书证已激活！</span>
            </div>
            <div v-else>
              <van-button
                v-if="exam.type == '1'"
                class="orange-btn"
                round
                size="big"
                :disabled="canClick"
                @click="showConfirm(null)"
                >立即考试</van-button
              >
              <p v-if="canClick" class="tips">
                还需学习 {{ common.formatNeedTime(lastNeedLearn) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </van-sticky>
    <div v-if="!(userInfo.isPassExam == '1')"  class="exam" :style="tbHeight < 700 ? {} : { height: tbHeight + 'px' }">
      <!---------------------------- 普通考试 ----------------------->
      <div class="module" v-if="exam.type == '1' || !exam.id">
        <div
          class="module-box"
          v-for="(item, index) in learnData"
          :key="item.id"
        >
          <div class="title">
            <div class="bg"></div>
            <h3>{{ item.name }}</h3>
          </div>
          <img src="@/assets/img/exam-model-bg-2.png" alt />
          <div class="count">
            <span v-if="item.videos.length > 0"
              >{{ item.videos.length }}视频</span
            >
            <span v-if="item.files.length > 0"
              >{{ item.files.length }}文档</span
            >
            <span v-if="item.articles.length > 0"
              >{{ item.articles.length }}文章</span
            >
          </div>
          <div class="right-btn" @click="toLearn(index)">前往</div>
        </div>
      </div>
      <!---------------------------- 闯关考试 ----------------------->
      <div class="module" v-if="exam.type == '2'">
        <div
          class="module-box"
          v-for="(item, index) in learnData"
          :key="item.id"
        >
          <div class="title">
            <div class="bg"></div>
            <h3>{{ item.name }}</h3>
          </div>
          <div
            v-if="
              index > 0 && exam.isOrder == 1 && !learnData[index - 1].isPass
            "
            class="locked-box"
          >
            <img src="@/assets/img/exam-model-bg-2-gray.png" alt />
            <span>未解锁</span>
          </div>
          <div v-else>
            <img src="@/assets/img/exam-model-bg-2.png" alt />
            <div class="module-score" v-if="item.isPass">
              <img src="@/assets/img/answer-right.png" alt />
              关卡得分：{{ item.score }}
            </div>
            <div class="count" v-else>
              <span v-if="item.videos.length > 0"
                >{{ item.videos.length }}视频</span
              >
              <span v-if="item.files.length > 0"
                >{{ item.files.length }}文档</span
              >
              <span v-if="item.articles.length > 0"
                >{{ item.articles.length }}文章</span
              >
            </div>
            <div class="right-btn" @click="toLearn(index)">前往</div>
          </div>
        </div>
      </div>
    </div>
    <div class="body-exam">&nbsp;</div>
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
import Confirm from "@/components/Confirm";
import confirmDialog from "@/mixins/confirmDialog";
import { mapState } from "vuex";
export default {
  components: {
    Confirm,
  },
  mixins: [confirmDialog],
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
    tbHeight: (state) => state.tabbarHeight,
    canClick() {
      return this.lastNeedLearn > 0;
    },
  }),
  methods: {
    // 考试
    toExam() {
      // 当前考试内容：闯关考试为当前模块考试内容，普通考试为第一个考试内容
      let content =
        this.exam.type == "1"
          ? this.exam.contents[0]
          : this.curModelId
          ? this.exam.contents.find((i) => i.modelId == this.curModelId)
          : this.exam.contents[0];
      this.$store.commit("setCurExam", {
        ...this.exam,
        content,
      });
      this.$router.push("/exam/examing");
    },
    // 前往学习
    toLearn(modelIndex) {
      this.$store.commit("setCurLearn", {
        modelIndex: modelIndex,
        learnIndex: 0,
      });
      this.$router.push(`/exam/learn`);
    },
    // 获取登录人试卷 只会存在一个考试
    getLoginUserExams() {
      this.loading = true;
      getLoginUserExams()
        .then(async (res) => {
          this.loading = false;
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

    // 获取登录人所有培训资料
    getLoginUserLearns() {
      return getLoginUserLearns()
        .then((res) => {
          if (res.code == "000000") {
            let data = res.data || [];
            this.userLearns = data;
            // 设置学习资料
            this.setLearnData();
            return Promise.resolve(data);
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
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
          videos: data.filter((i) => i.type == "1"),
          files: data.filter((i) => i.type == "2"),
          articles: data.filter((i) => i.type == "3"),
        };
      });
      this.learnData.sort((a, b) => a.level - b.level);
      this.learnData = this.learnData.filter((l) => l.learns.length);
      // 设置需要学习的时间
      this.setLastNeedLearn();
    },
    // 获取登录人学习记录
    getLoginUserRecords() {
      let that = this;
      return getLoginUserRecords()
        .then((res) => {
          that.getLoginUserExams();
          if (res.code == "000000") {
            let data = res.data || [];
            that.userLearnRecords = data;
            return Promise.resolve(data);
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
          that.getLoginUserExams();
          return Promise.reject(err);
        });
    },
    // 设置需要学习时间
    async setLastNeedLearn() {
      // ——普通考试
      if (this.exam.type == "1" && this.exam.needLearn > 0) {
        let learnTimes = this.userLearnRecords.reduce((sum, cur) => {
          return sum + cur.duration * 60;
        }, 0);
        let diff = this.exam.needLearn * 60 - learnTimes;
        this.lastNeedLearn = diff > 0 ? diff : 0;
        this.$store.commit("setTime", { need: this.lastNeedLearn });
      }
      // ——闯关考试
      if (this.exam.type == "2") {
        this.learnData.forEach((i) => {
          let moduleRecords = this.userLearnRecords.filter((j) => {
            // j.modelIds.includes(i.id)
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
          if (i.needLearn && i.needLearn > 0) {
            let diff = i.needLearn * 60 - i.learnTimes;
            lastNeedLearn = diff > 0 ? diff : 0;
          }
          this.$set(i, "lastNeedLearn", lastNeedLearn);
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
            let data = res.data || {};
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
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
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
      this.$store.commit("setExamLearnData", this.learnData);
      this.$store.commit("setCurExam", this.exam);
    },
  },
  created() {
    this.getLoginUserRecords();
    this.$store.dispatch("getUserInfo");
  },
};
</script>

<style lang="scss" scoped>
.exam {
  position: relative;
  width: 100%;
  min-height: calc(100vh + 120);
  overflow-y: auto;
  // background: url("~@/assets/img/exam-bg-1.png") no-repeat;
  background-color: #fff5da;
  background-size: contain;
  text-align: center;
}
.exam1 {
  position: relative;
  width: 100%;
  min-height: calc(100vh + 120);
  overflow-y: auto;
  background: url("~@/assets/img/exam-bg-1.png") no-repeat;
  background-color: #fff5da;
  background-size: contain;
  text-align: center;
}
.title-bg {
  width: 350px;
  height: 70px;
  margin-top: 60px;
}
.info {
  width: 650px;
  margin: 30px auto 20px;
  text-align: center;
  background: url("~@/assets/img/exam-title-bg.png") center 0 no-repeat;
  background-size: contain;
  padding-top: 20px;
  p {
    font-size: 22px;
    font-weight: 400;
    color: #ffffff;
    line-height: 40px;
    text-align: center;
  }

  .tips {
    font-size: 24px;
    color: #df4d2e;
    line-height: 33px;
    white-space: nowrap;
  }
  .van-button,
  .success {
    display: inline-block;
    width: 550px;
    height: 60px;
    margin-top: 30px;
    margin-bottom: 12px;
  }
  .success {
    font-size: 28px;
    font-weight: 400;
    line-height: 40px;
    color: #8289f1;
    background: #ffffff;
    border-radius: 30px;
    text-align: center;
    padding: 10px 0;
  }
}
.tips {
  font-size: 24px;
  color: #df4d2e;
  line-height: 33px;
  white-space: nowrap;
}
.module {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url("~@/assets/img/exam-bg-2.png") left repeat-y;
  background-size: 180px auto;
}
.module-box {
  background: url("~@/assets/img/exam-model-bg.png");
  background-size: contain;
  display: inline-block;
  position: relative;
  width: 560px;
  height: 300px;
  margin-left: 170px;
  margin-bottom: 20px;
  padding: 38px 20px 10px;
  .title {
    position: relative;
  }
  .bg {
    position: absolute;
    width: 456px;
    height: 64px;
    background: #d6dae4;
    border-radius: 6px;
    left: 32px;
    top: -26px;
  }
  h3 {
    position: absolute;
    top: -20px;
    left: 23px;
    display: inline-block;
    width: 474px;
    font-size: 32px;
    font-weight: 400;
    color: #fff;
    padding: 3px 0;
    line-height: 45px;
    background: linear-gradient(180deg, #97a1fd 0%, #7b82f8 100%);
    border-radius: 6px;
  }
  img {
    width: 520px;
    height: 172px;
  }
  .count {
    margin-top: 24px;
    text-align: left;
    span {
      font-size: 24px;
      font-weight: 400;
      color: #683534;
      line-height: 33px;
      &:not(:last-child)::after {
        display: inline-block;
        content: "";
        width: 4px;
        height: 4px;
        line-height: 33px;
        margin: 0 16px;
        vertical-align: middle;
        border-radius: 2px;
        background: #683534;
      }
    }
  }
  .module-score {
    margin-top: 24px;
    text-align: left;
    img {
      width: 32px;
      height: 32px;
      vertical-align: text-bottom;
    }
    font-size: 24px;
    font-weight: 400;
    color: #683534;
    line-height: 33px;
  }
  .right-btn {
    position: absolute;
    bottom: 14px;
    right: 20px;
    width: 140px;
    height: 60px;
    line-height: 60px;
    color: #fff;
    // background: url("https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnged378d3f1963654ad04b0a8b3aca42c3377c19ce545e1230ccebc8472bab64d6") no-repeat;
    background: url("~@/assets/img/exam-btn-bg.png") no-repeat;
    background-size: contain;
  }
}
.locked-box {
  text-align: center;
  span {
    position: absolute;
    top: 118px;
    left: 0;
    width: 100%;
    font-size: 30px;
    font-weight: 400;
    color: #616687;
    line-height: 42px;
  }
}
.body-exam{
  background-color: #FFF5DA;
  min-height: 1040px;
}
</style>
