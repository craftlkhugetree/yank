<template>
  <div class="examing">
    <van-sticky>
      <van-nav-bar title="入馆考试" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <span class="hh2">{{ curExam.name }}</span>

    <!-------------------------------------- 题目 -------------------------------------->
    <div class="exam-body">
      <span class="time-tip" v-if="curExam.duration >= 0 && isExam">
        剩余时间
        <strong>{{ common.formatNeedTime(lasttime) }}</strong>
      </span>
      <span class="time-tip" v-if="!isExam">
        答题用时
        <strong>{{ common.formatNeedTime(curExamResult.passedtime) }}</strong>
      </span>
      <div class="circle" @click.stop="$refs.answerPop.isPopShow = true">
        <div class="block2">
          <span
            class="txt5"
            >{{ (pageNum &lt;= 0) ? "00" : (pageNum &lt; 10) ? "0" + pageNum : pageNum  }}</span
          >
          <span class="word8"
            >&nbsp;/&nbsp;{{
              (total &lt;= 0) ? "00" : (total &lt; 10) ? "0" + total : total
            }}</span
          >
        </div>
      </div>
      <answer-pop
        ref="answerPop"
        :dataList="dataList"
        :curTypeIndex="curTypeIndex"
        :curIndex="curIndex"
        :isExam="isExam"
        @choose="chooseQuestion"
      ></answer-pop>

      <div style="padding: 0 10px">
        <div class="title">
          <h3>
            ({{ curTypeInfo.typename }})
            <!-- <span>每题{{ curTypeInfo.score }}分</span> -->
          </h3>
        </div>
        <div class="content" v-if="curQuestion && curQuestion.id">
          <p>{{ pageNum }}. {{ curQuestion.subject }}</p>
          <van-image
            fit="cover"
            width="60%"
            height="100"
            v-for="img in curQuestion.photoList"
            :key="img"
            :src="img"
            :preview-src-list="curQuestion.photoList"
            ><template v-slot:error>图片加载失败</template></van-image
          >

            <!-- v-if="curTypeIndex == '0'" -->
          <van-radio-group
            v-if="curQuestion.type == '3'"
            v-model="curQuestion.isTrue"
            @change="doneQuestion"
            :disabled="!isExam"
          >
            <van-radio
              :name="1"
              :style="
                curQuestion.isTrue == '1' ? { background: '#8289F1' } : ''
              "
              >对<template #icon="props">
                <img  class="img-icon"
                  :src="
                    props.checked
                      ? activeIconR
                      : inactiveIconR
                  "
                /> </template
            ></van-radio
            >
            <van-radio
              checked-color="#fff"
              :name="0"
              :style="
                curQuestion.isTrue == '0' ? { background: '#8289F1' } : ''
              "
              >错<template #icon="props">
                <img  class="img-icon"
                  :src="
                    props.checked
                      ? activeIconR
                      : inactiveIconR
                  "
                /> </template
            ></van-radio
            >
          </van-radio-group>
            <!-- v-else-if="curTypeIndex == '1'" -->
          <van-radio-group
          v-else-if="curQuestion.type == '1'"
            v-model="curQuestion.chooseOptionId"
            @change="doneQuestion"
            :disabled="!isExam"
          >
            <van-radio
              checked-color="#fff"
              v-for="op in curQuestion.options"
              :key="op.id"
              :name="op.id"
              :style="
                op.id === chooseOpId[pageNum] ? { background: '#8289F1' } : ''
              "
              >{{ op.itemInfo }}
              <template #icon="props">
                <img  class="img-icon"
                  :src="
                    props.checked
                      ? activeIconR
                      : inactiveIconR
                  "
                /> </template
            ></van-radio>
          </van-radio-group>
          <van-checkbox-group
            v-else
            v-model="curQuestion.chooseOptionIds"
            @change="checkQuestion"
            :disabled="!isExam"
          >
            <!-- checked-color="#fff" -->
            <van-checkbox
              shape="square"
              v-for="op in curQuestion.options"
              :key="op.id"
              :name="op.id"
              :style="
                chooseOpId[pageNum] &&
                chooseOpId[pageNum].includes &&
                chooseOpId[pageNum].includes(op.id)
                  ? { background: '#8289F1' }
                  : ''
              "
              >{{ op.itemInfo }}<template #icon="props">
                <img  class="img-icon"
                  :src="
                    props.checked
                      ? activeIcon
                      : inactiveIcon
                  "
                /> </template></van-checkbox
            >
          </van-checkbox-group>
        </div>

        <exam-result
          v-if="!isExam"
          :curTypeIndex="curTypeIndex"
          :curIndex="curIndex"
          :dataList="dataList"
        ></exam-result>

        <div class="footer">
          <div class="right-btn">
            <van-button
              v-if="curTypeIndex > 0 || curIndex > 0"
              size="big"
              @click.stop="goQuestion('pre')"
              style="
                width: 150px;
                float: left;
                background: #ffffff;
                border-radius: 44px;
                border: 1px solid #8289f1;
                margin: 10px 0 50px 0;
                color: #8289f1;
              "
              round
              >上一题</van-button
            >
            <van-button
              v-if="
                curTypeIndex !== dataList.length - 1 ||
                curIndex !== curTypeInfo.total - 1
              "
              type="primary"
              size="big"
              @click.stop="goQuestion('next')"
              style="width: 150px; float: right; margin: 10px 0 50px 0"
              color="#8289F1"
              round
              >下一题</van-button
            >
            <van-button
              v-if="
                curTypeIndex == dataList.length - 1 &&
                curIndex == curTypeInfo.total - 1 &&
                isExam
              "
              type="primary"
              color="#8289F1"
              round
              size="big"
              style="width: 150px; float: right; margin: 10px 0 50px 0"
              @click.stop="wantSubmit"
              >我要交卷</van-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-------------------------------------- 确认弹窗 -------------------------------------->
    <confirm
      ref="confirmSubmit"
      title="确认交卷？"
      text="一旦交卷后便不可再作答和修改答案，确定交卷吗？"
      cancelText="取消"
      confirmText="确定"
      @doConfirm="submitExam"
    ></confirm>
    <!-------------------------------------- 交卷中 -------------------------------------->
    <confirm
      ref="submitting"
      title
      :text="submittingText"
      align="center"
      :showButton="false"
    ></confirm>
    <!-------------------------------------- 通过考试 -------------------------------------->
    <result
      ref="pass"
      :score="score"
      cancelText="返回主页"
      confirmText="查看考试"
      @doCancel="$router.push('/exam')"
      @doConfirm="goReview"
    ></result>
    <!-------------------------------------- 通过部分闯关考试 -------------------------------------->
    <result
      ref="passModel"
      :score="score"
      cancelText="查看考试"
      confirmText="学习下一关"
      @doCancel="goReview"
      @doConfirm="learnNext"
    ></result>
    <!-------------------------------------- 未通过 -------------------------------------->
    <result
      ref="nopass"
      type="fail"
      :score="score"
      cancelText="查看考试"
      confirmText="继续学习"
      @doCancel="goReview"
      @doConfirm="$router.push('/exam/learn')"
    ></result>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Notify } from "vant";
import {
  getLoginUserExamQuestion,
  submitNormalExam,
  submitPointExam,
} from "@/api/exam";
export default {
  components: {
    Confirm: () => import("@/components/Confirm"),
    Result: () => import("@/components/Result"),
    AnswerPop: () => import("@/components/AnswerPop"),
    ExamResult: () => import("@/views/exam/examResult"),
  },
  data() {
    return {
      // examing：1，review：0
      isExam: 1,
      // reverse color of chosen options
      chooseOpId: {},
      // current question num
      pageNum: 1,
      imgViewUrl: window.g.viewUrl,
      questions: [],
      total: 0,
      curTypeIndex: 0,
      curIndex: 0,
      dataList: [
        {
          type: "3",
          typename: "判断题",
          score: 0,
          total: 0,
          questions: [],
        },
        {
          type: "1",
          typename: "单选题",
          score: 0,
          total: 0,
          questions: [],
        },
        {
          type: "2",
          typename: "多选题",
          score: 0,
          total: 0,
          questions: [],
        },
      ],
      lasttime: 0, // 剩余时间
      timer: null,
      passedtime: 0, // 已考时间
      dialogVisible: true,
      dialogTitle: "确认开始考试？",
      dialogText: "",
      score: 0,
      submittingText: "交卷完成，成绩计算中…",
      activeIcon: require("@/assets/img/kuanggou.png"),
      inactiveIcon: require("@/assets/img/kuang.png"),
      activeIconR: require("@/assets/img/yuangou.png"),
      inactiveIconR: require("@/assets/img/yuan.png"),
    };
  },
  computed: mapState({
    // 当前试卷
    curExam: (state) => state.curExam,
    curExamResult: (state) => state.curExamResult,
    tbHeight: (state) => state.tabbarHeight,
    content() {
      return this.curExam.content;
    },
    // 当前学习模块index及资料index
    curLearn: (state) => state.curLearn,
    // 当前题目类型信息
    curTypeInfo() {
      return this.dataList[this.curTypeIndex];
    },
    // 当前题目
    curQuestion() {
      return this.curTypeInfo.questions[this.curIndex];
    },
    // 已做题目数量
    doneNum() {
      return this.questions.filter((i) => i.done).length;
    },
    percent() {
      return parseInt((this.doneNum / this.total) * 100) || 0;
    },
  }),
  watch: {
    lasttime(val) {
      if (val <= 0 && this.curExam.duration > 0) {
        this.submittingText = "考试时间结束，自动交卷，成绩计算中…";
        this.submitExam();
      }
    },
  },
  methods: {
    goReview() {
      this.isExam = 0;
      this.curTypeIndex = 0;
      this.curIndex = 0;
      this.pageNum = 1;
      this.stickTop();
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    stickTop() {
      const right = document.getElementsByTagName("html");
      if (right && right[0]) {
        right[0].scrollTop = 0;
      }
    },
    // 选择题目
    chooseQuestion(typeIndex, index, pageNum) {
      this.curTypeIndex = typeIndex;
      this.curIndex = index;
      this.pageNum = pageNum;
      this.$refs.answerPop.isPopShow = false;
    },
    // 上一题/下一题
    goQuestion(goType) {
      this.stickTop();
      // 上一题 如果是该类型的第一题，则上一题是上个类型的最后一题
      if (goType == "pre") {
        if (this.curIndex == 0 && this.curTypeIndex > 0) {
          this.curTypeIndex -= 1;
          this.curIndex = this.curTypeInfo.total - 1;
        } else {
          this.curIndex -= 1;
        }
        this.pageNum ? this.pageNum-- : null;
      }
      // 下一题 如果是该类型的最后一题，则下一题是下个类型的第一题
      if (goType == "next") {
        if (
          this.curIndex == this.curTypeInfo.total - 1 &&
          this.curTypeIndex < this.dataList.length - 1
        ) {
          this.curTypeIndex += 1;
          this.curIndex = 0;
        } else {
          this.curIndex += 1;
        }
        this.pageNum++;
      }
    },
    // 做题
    doneQuestion(e) {
      if (e || e === 0) {
        this.chooseOpId[this.pageNum] = e;
        this.curQuestion.done = true;
      }
      this.$forceUpdate();
    },
    // 多选题做题
    checkQuestion(val) {
      this.chooseOpId[this.pageNum] = val;
      this.curQuestion.done = val.length > 0 ? true : false;
      this.$forceUpdate();
    },
    // 我要交卷
    wantSubmit() {
      // 考试开始多少分钟后可交卷
      let beforeSubmitTime = this.curExam.beforeSubmitTime * 60;
      if (beforeSubmitTime && this.passedtime < beforeSubmitTime) {
        let message = `考试开始${this.curExam.beforeSubmitTime}分钟后方可交卷！`;
        Notify({ type: "warning", message });
      } else {
        this.$refs.confirmSubmit.visible = true;
      }
    },
    // 确定交卷
    submitExam() {
      clearInterval(this.timer);
      this.$refs.confirmSubmit.visible = false;
      let submitting = this.$refs.submitting;
      submitting.visible = true;
      let questions = this.questions.map((i) => {
        return {
          id: i.id,
          type: i.type,
          isTrue: i.isTrue,
          chooseOptionIds:
            i.type == "1" ? [i.chooseOptionId] : i.chooseOptionIds,
        };
      });
      let param = {
        examId: this.curExam.id,
        agent: "2", // 1-pc , 2-mobile
        questions,
      };
      let func = submitNormalExam;
      if (this.curExam.type == "2") {
        param.modelId = this.content.modelId;
        func = submitPointExam;
      }
      func(param)
        .then((res) => {
          submitting.visible = false;
          if (res.code == "000000") {
            let data = res.data || {};
            this.score = data.userScore;
            if (data.isPass || data.isPassAll) {
              this.$refs.pass.visible = true;
            } else if (!data.isPassAll && data.isPassCurrent) {
              this.$refs.passModel.visible = true;
            } else {
              this.$refs.nopass.visible = true;
            }
            // 设置答题结果
            this.setExamResult(data);
          } else {
            let message = "交卷失败：" + res.msg;
            Notify({ type: "warning", message });
          }
        })
        .catch((err) => {
          submitting.visible = false;
          let message = "交卷失败：" + err;
          Notify({ type: "warning", message });
        });
    },
    // 设置答题结果
    setExamResult(data) {
      let list = data.resultQuesions;
      this.dataList.forEach((i) => {
        i.questions.forEach((j) => {
          let obj = list.find((k) => k.id == j.id);
          j.answerResult = obj.answerResult;
          j.trueOptionIds = obj.trueOptionIds;
          j.analysis = obj.analysis;
        });
      });
      this.$store.commit("setCurExamResult", {
        isPass: data.isPass,
        score: data.userScore,
        totalNum: this.total,
        passNum: list.filter((i) => i.answerResult).length,
        wrongNum: list.filter((i) => !i.answerResult).length,
        passedtime: this.passedtime,
        dataList: this.dataList,
      });
    },
    // 学习下一关
    learnNext() {
      this.$store.commit("setCurLearn", {
        modelIndex: this.curLearn.modelIndex + 1,
        learnIndex: 0,
      });
      this.$router.push("/exam/learn");
    },
    // 获取试题
    getExamQuestion() {
      getLoginUserExamQuestion({
        examId: this.curExam.id,
        modelId: this.curExam.type == "1" ? null : this.content.modelId,
      })
        .then((res) => {
          if (res.code == "000000") {
            this.questions = res.data || [];
            this.total = this.questions.length;
            this.setQuestions();
          } else {
            this.questions = [];
            this.total = 0;
            let message = "获取试题失败：" + res.msg;
            Notify({ type: "warning", message });
          }
        })
        .catch((err) => {
          this.questions = [];
          this.total = 0;
          let message = "获取试题失败：" + err;
          Notify({ type: "warning", message });
        });
    },
    // 设置题目
    setQuestions() {
      this.dataList.forEach((i) => {
        i.questions = this.questions.filter((j) => j.type == i.type) || [];
        i.questions.forEach((j) => {
          this.$set(j, "done", false);
          j.photoList = j.photos
            ? j.photos.split(",").map((id) => id && this.imgViewUrl + id)
            : [];
          if (j.type == "1") {
            this.$set(j, "chooseOptionId", "");
          }
          if (j.type == "2") {
            this.$set(j, "chooseOptionIds", []);
          }
        });
      });
    },
    // 初始化
    initDataList() {
      let {
        judgeNum,
        judgeScore,
        singleNum,
        singleScore,
        multipleNum,
        multipleScore,
      } = this.content;
      this.dataList.forEach((i) => {
        switch (i.type) {
          case "3":
            i.total = judgeNum;
            i.score = judgeScore;
            break;
          case "1":
            i.total = singleNum;
            i.score = singleScore;
            break;
          case "2":
            i.total = multipleNum;
            i.score = multipleScore;
            break;
        }
      });
      this.dataList = this.dataList.filter((i) => i.total);
    },
    // 设置时间
    setTime() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.lasttime -= 1;
        this.passedtime += 1;
      }, 1000);
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  created() {
    this.initDataList();
    this.getExamQuestion();
    this.lasttime = this.curExam.duration * 60 || 30 * 60;
    this.setTime();
  },
};
</script>

<style lang="scss" scoped>
.examing {
  width: 750px;
  margin: 0 auto;
  position: relative;
  // min-height: 1400px;
  min-height: calc(100vh + 220);
  // height: 100%;
  background-color: #fff5da;
  .hh2 {
    background-size: contain !important;
    background: url("~@/assets/img/exam-bg-3.png") no-repeat;
    display: inline-block;
    padding-top: 20px;
    width: 100%;
    height: 220px;
    font-size: 35px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #373b4b;
    line-height: 30px;
    text-align: center;
  }

  .exam-body {
    height: 100%;
    min-height: 1000px;
    overflow-y: scroll;
    margin: 0 20px;
    background: #ffffff;
    box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
    border-radius: 8px;
    border: 1px solid #e5e8ed;
    .time-tip {
      display: inline-block;
      position: absolute;
      margin-top: -40px;
      margin-right: 20px;
      right: 0;
      font-size: 28px;
      color: #7e8081;
      strong {
        font-weight: 600;
        color: #3a78fc !important;
        letter-spacing: 2px;
      }
    }
    .circle {
      position: absolute;
      width: 136px;
      height: 136px;
      background: linear-gradient(180deg, #97a1fd 0%, #7b82f8 100%);
      border-radius: 50%;
      margin-top: -68px;
      margin-left: calc(50% - 68px);
      line-height: 136px;
      box-shadow: 0 0 8px 8px rgba(3, 27, 78, 0.12);
      .block2 {
        width: 98px;
        height: 62px;
        margin: 0 auto;
      }
      .txt5 {
        width: 45px;
        height: 62px;
        display: inline-block;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 44px;
        white-space: nowrap;
        line-height: 62px;
        text-align: right;
      }
      .word8 {
        width: 41px;
        height: 33px;
        display: inline-block;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 24px;
        white-space: nowrap;
        line-height: 33px;
        text-align: left;
        margin-top: 22px;
        // padding-left: 10px;
      }
    }
  }
}

.title {
  float: right;
  height: 40px;
  font-size: 28px;
  margin: 32px 60px 0 0;
  font-weight: 400;
  color: #7e8081;
}
.content {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #373b4b;
  line-height: 36px;
  p {
    font-size: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #373b4b;
    line-height: 54px;
    padding: 20px 0;
  }
  .img-in {
    margin: auto auto;
    overflow: hidden;
    border-radius: 5px;
    border: 1px solid rgba(229, 232, 237, 1);
  }
}
</style>
<style lang="scss" scoped>
/deep/.van-radio,
.van-checkbox {
  width: 100%;
  min-height: 80px;
  margin: 10px 0;
  vertical-align: center;
  background: #f3f5f9;
  border-radius: 47px;
  .van-radio__icon {
    margin-left: 20px;
  }
}
/deep/ .van-checkbox {
  .van-checkbox__icon {
    margin-left: 20px;
  }
}
/deep/ .van-image {
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
}
/deep/ .van-radio__icon {
  // background-size: contain !important;
  // background: url("~@/assets/img/yuan.png") no-repeat;
  // background-color: rgb(196, 210, 228);
}
/deep/ .van-checkbox__icon {
  // background-size: contain !important;
  // background: url("~@/assets/img/kuang.png") no-repeat;
  // background-color: rgb(196, 210, 228);
}
/deep/ .van-icon-success {
  // background-size: contain !important;
  // background: url("~@/assets/img/yuangou.png") no-repeat;
  // color: rgb(130, 137, 241) !important;
}
.img-icon {
  height: 40px;
  width: 40px;
}
</style>
