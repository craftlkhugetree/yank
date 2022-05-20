<template>
  <div class="examing clearfix">
    <h2>{{curExam.name}}</h2>
    <!-------------------------------------- 答题卡 -------------------------------------->
    <div class="left">
      <div class="title">
        <h3>{{curExam.type == "1" ? "答题卡" : content.modelName}}</h3>
        <span>共{{curExamResult.totalNum}}题，满分{{content.totalScore}}分</span>
      </div>
      <div class="progress">
        <p>
          考试得分：
          <strong>{{curExamResult.score}}</strong>
        </p>
        <div class="result-box">
          <div class="result-item">
            <label>答对</label>
            <p>{{curExamResult.passNum}}题</p>
          </div>
          <div class="result-item">
            <label>答错</label>
            <p>{{curExamResult.wrongNum}}题</p>
          </div>
          <div class="result-item">
            <label>正确率</label>
            <p>{{(curExamResult.passNum / curExamResult.totalNum * 100).toFixed(1)}}%</p>
          </div>
        </div>
      </div>
      <div v-for="(item,itemIndex) in dataList" :key="item.id">
        <div class="question" v-if="item.total > 0">
          <p>{{item.typename}}</p>
          <span
            v-for="(q,index) in item.questions"
            :key="index"
            :class="{'is-error': !q.answerResult}"
            @click="chooseQuestion(itemIndex, index)"
          >{{index + 1}}</span>
        </div>
      </div>
    </div>
    <!-------------------------------------- 题目 -------------------------------------->
    <div class="right">
      <div class="title">
        <h3>
          {{curTypeInfo.typename}}
          <span>每题{{curTypeInfo.score}}分</span>
        </h3>
        <span class="time-tip">
          答题用时
          <strong>{{common.formatNeedTime(curExamResult.passedtime)}}</strong>
        </span>
      </div>
      <div class="content" v-if="curQuestion && curQuestion.id">
        <p>{{+curIndex + 1}}. {{curQuestion.subject}}</p>
        <el-image
          v-for="img in curQuestion.photoList"
          :key="img"
          :src="img"
          :preview-src-list="curQuestion.photoList"
        ></el-image>
        <el-radio-group  v-model="curQuestion.isTrue" disabled v-if="curQuestion.type == '3'">
          <!-- v-if="curTypeIndex=='0'" -->
          <el-radio :label="1" disabled>对</el-radio>
          <el-radio :label="0" disabled>错</el-radio>
        </el-radio-group>
        <el-radio-group v-else-if="curQuestion.type == '1'" v-model="curQuestion.chooseOptionId"  disabled>
          <el-radio v-for="op in curQuestion.options" :key="op.id" :label="op.id">{{op.itemInfo}}</el-radio>
        </el-radio-group>
        <el-checkbox-group v-else v-model="curQuestion.chooseOptionIds" disabled>
          <el-checkbox v-for="op in curQuestion.options" :key="op.id" :label="op.id">{{op.itemInfo}}</el-checkbox>
        </el-checkbox-group>
      </div>
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
          <h3>
            <img src="@/assets/img/answer-bg.png" alt />正确答案
          </h3>
          <p v-if="curQuestion.type == '3'">{{curQuestion.isTrue == "1" ? "错" : "对"}}</p>
          <p v-for="item in trueOptions" :key="item.id">{{item.itemInfo}}</p>
          <el-divider></el-divider>
          <h3>
            <img src="@/assets/img/answer-bg.png" alt />题目解析
          </h3>
          <p>{{curQuestion.analysis || "暂无"}}</p>
        </div>
      </div>
      <div class="footer">
        <div class="right-btn">
          <el-button
            v-if="curTypeIndex >0 || curIndex > 0"
            class="bule-border"
            size="big"
            @click="goQuestion('pre')"
          >上一题</el-button>
          <el-button
            v-if="curTypeIndex !== dataList.length - 1 || curIndex !== curTypeInfo.total - 1"
            type="primary"
            size="big"
            @click="goQuestion('next')"
          >下一题</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      imgViewUrl: window.g.viewUrl,
      curTypeIndex: 0,
      curIndex: 0
    }
  },
  computed: mapState({
    // 当前试卷
    curExam: state => state.curExam,
    content() {
      return this.curExam.content
    },
    // 当前考试结果 题目及答案
    curExamResult: state => state.curExamResult,
    dataList() {
      return this.curExamResult.dataList
    },
    // 当前题目类型信息
    curTypeInfo() {
      return this.dataList[this.curTypeIndex]
    },
    // 当前题目
    curQuestion() {
      return this.curTypeInfo.questions[this.curIndex]
    },
    // 正确的选项
    trueOptions() {
      let q = this.curQuestion
      if(q.type == "3") {
        return []
      } else {
        return q.options.filter(i => q.trueOptionIds.includes(i.id))
      }
    }
  }),
  methods: {
    // 选择题目
    chooseQuestion(typeIndex, index) {
      this.curTypeIndex = typeIndex
      this.curIndex = index
    },
    // 上一题/下一题
    goQuestion(goType) {
      // 上一题 如果是该类型的第一题，则上一题是上个类型的最后一题
      if (goType == 'pre') {
        if (this.curIndex == 0 && this.curTypeIndex > 0) {
          this.curTypeIndex -= 1
          this.curIndex = this.curTypeInfo.total - 1
        } else {
          this.curIndex -= 1
        }
      }
      // 下一题 如果是该类型的最后一题，则下一题是下个类型的第一题
      if (goType == 'next') {
        if (this.curIndex == this.curTypeInfo.total - 1 && this.curTypeIndex < this.dataList.length - 1) {
          this.curTypeIndex += 1
          this.curIndex = 0
        } else {
          this.curIndex += 1
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.examing {
  width: 1200px;
  margin: 20px auto;
}
h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  line-height: 34px;
  margin-bottom: 20px;
}
.left,
.right {
  height: 100%;
  min-height: 600px;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
  border-radius: 8px;
  border: 1px solid #e5e8ed;
}

.title {
  position: relative;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #dfe1e6;
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    line-height: 28px;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
  }
}
.left {
  width: 300px;
  float: left;
  .title {
    span {
      font-size: 12px;
      position: absolute;
      top: 5px;
      right: 0;
    }
  }
}
.progress {
  position: relative;
  background: #ebf1fe;
  border-radius: 3px;
  padding: 15px 20px;
  margin-bottom: 30px;
  p {
    color: #1f232f;
    line-height: 20px;
  }
  strong {
    color: #3a78fc;
    font-size: 16px;
    font-weight: 600;
  }
  .result-box {
    display: flex;
    margin: 15px 0 0;
  }
  .result-item {
    flex: 1;
    label {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      margin-bottom: 4px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
  }
}
.question {
  margin-bottom: 10px;
  p {
    color: #1f232f;
    line-height: 20px;
    margin-bottom: 10px;
  }
  span {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #1f232f;
    text-align: center;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #d8dadb;
    margin: 0 10px 10px 0;
    cursor: pointer;
    &.active,
    &:hover {
      color: #3a78fc;
      background: #ebf1fe;
      border-radius: 3px;
      border: 1px solid #92b4fc;
    }
    &.done {
      color: #ffffff;
      background: #3a78fc;
    }
    &.is-error {
      color: #ff4d4f;
      background: #fff1f0;
      border: 1px solid #ffa5a0;
    }
  }
}
.right {
  width: 880px;
  float: right;
  position: relative;
  .title {
    span {
      line-height: 28px;
      vertical-align: top;
    }
    .time-tip {
      position: absolute;
      right: 20px;
      top: 0;
      strong {
        font-size: 16px;
        font-weight: 600;
        color: #3a78fc;
        letter-spacing: 2px;
      }
    }
  }
  .content {
    color: #1f232f;
    line-height: 20px;
    padding: 0 10px 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dfe1e6;
    p {
      margin-bottom: 20px;
    }
    .el-image {
      width: auto;
      height: 232px;
      padding: 12px 16px;
      border: 1px solid #e5e8ed;
      border-radius: 5px;
      margin: 0 10px 10px 0;
    }
    .el-radio-group {
      width: 100%;
      margin-top: 10px;
    }
    .el-radio {
      display: block;
      width: 100%;
      padding: 10px;
      border-radius: 3px;
      border: 1px solid #e5e8ed;
      margin-bottom: 10px;
      &.is-checked {
        border-color: #92b4fc;
      }
    }
  }
  .answer {
    padding: 0 10px;
    margin-bottom: 80px;
  }
  .answer-right,
  .answer-wrong {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 10px;
    img {
      width: 24px;
      height: 24px;
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
      font-size: 16px;
      font-weight: 400;
      color: #1f232f;
      line-height: 24px;
      margin-bottom: 10px;
      img {
        width: 26px;
        height: 24px;
        vertical-align: bottom;
        margin-right: 10px;
      }
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #777777;
      line-height: 22px;
    }
    .el-divider {
      background: #FFE58F;
    }
  }
  .footer {
    position: absolute;
    left: 20px;
    bottom: 20px;
    width: calc(100% - 40px);
    .right-btn {
      float: right;
      .el-button {
        width: 128px;
      }
    }
  }
}
</style>

<style lang="scss">
.el-radio__input.is-disabled.is-checked .el-radio__inner {
  background: #3f86f7 !important;
  border-color: #3f86f7 !important;
}
.el-radio__input.is-disabled.is-checked + span.el-radio__label {
  color: #3f86f7;
}
</style>