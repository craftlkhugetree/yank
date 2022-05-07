<template>
  <div class="all clearfix">
    <!-------------------------------------- 答题卡 -------------------------------------->

    <!-------------------------------------- 题目 -------------------------------------->
    <div class="right">
      <div class="answer">
        <h3 v-if="curQuestion.answerResult" class="answer-right">
          <img src="@/assets/img/answer-right.png" alt />
          回答正确
        </h3>
        <h3 v-if="!curQuestion.answerResult" class="answer-wrong">
          <img src="@/assets/img/answer-wrong.png" alt />
          回答错误
        </h3>
        <div v-if="!curQuestion.answerResult" class="answer-box">
          <h3><img src="@/assets/img/answer-bg.png" alt />正确答案</h3>
          <p v-if="curQuestion.type == '3'">
            {{ curQuestion.isTrue == "1" ? "错" : "对" }}
          </p>
          <p v-for="item in trueOptions" :key="item.id">{{ item.itemInfo }}</p>
          <van-divider></van-divider>
          <h3><img src="@/assets/img/answer-bg.png" alt />题目解析</h3>
          <p>{{ curQuestion.analysis || "暂无" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "examResult",
  props: {
    dataList: Array,
    curTypeIndex: Number,
    curIndex: Number,
  },
  data() {
    return {
    };
  },
  computed: mapState({
    // 当前试卷
    curExam: (state) => state.curExam,
    content() {
      return this.curExam.content;
    },
    // 当前考试结果 题目及答案
    curExamResult: (state) => state.curExamResult,

    // 当前题目类型信息
    curTypeInfo() {
      return this.dataList[this.curTypeIndex];
    },
    // 当前题目
    curQuestion() {
      return this.curTypeInfo.questions[this.curIndex];
    },
    // 正确的选项
    trueOptions() {
      let q = this.curQuestion;
      if (q.type == "3") {
        return [];
      } else {
        return q.options.filter((i) => q.trueOptionIds.includes(i.id));
      }
    },
  }),
  methods: {},
};
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  margin: 10px;
}
.right {
  width: 100%;
  position: relative;

  .answer {
    padding: 0 10px;
    margin-bottom: 80px;
  }
  .answer-right,
  .answer-wrong {
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 32px;
    margin-bottom: 10px;
    img {
      width: 32px;
      height: 32px;
      vertical-align: bottom;
    }
  }
  .answer-right {
    color: #48be74;
  }
  .answer-wrong {
    color: #ff3946;
  }
  .answer-box {
    padding: 20px;
    background: #fffbe6;
    border-radius: 5px;
    border: 1px solid #ffe58f;
    h3 {
      font-size: 26px;
      font-weight: 400;
      color: #1f232f;
      line-height: 24px;
      margin-bottom: 20px;
      img {
        width: 26px;
        height: 24px;
        vertical-align: bottom;
        margin-right: 10px;
      }
    }
    p {
      font-size: 22px;
      font-weight: 400;
      color: #777777;
      line-height: 32px;
    }
    .van-divider {
      background: #ffe58f;
    }
  }
}
</style>
