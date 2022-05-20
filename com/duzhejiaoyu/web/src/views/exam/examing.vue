<template>
  <div class="examing clearfix">
    <h2>{{curExam.name}}</h2>
    <!-------------------------------------- 答题卡 -------------------------------------->
    <div class="left">
      <div class="title">
        <h3>{{curExam.type == "1" ? "答题卡" : content.modelName}}</h3>
        <span>共{{total}}题，满分{{content.totalScore}}分</span>
      </div>
      <div class="progress">
        <p>答题进度</p>
        <span class="num">
          <strong>{{doneNum}}</strong>
          /{{total}}
        </span>
        <el-progress :percentage="percent" :stroke-width="4" :show-text="false" color="#3A78FC"></el-progress>
      </div>
      <div v-for="(item,itemIndex) in dataList" :key="item.id">
        <div class="question" v-if="item.total > 0">
          <p>{{item.typename}}</p>
          <span
            v-for="(q,index) in item.questions"
            :key="index"
            :class="{'active': itemIndex == curTypeIndex && index == curIndex, 'done': q.done}"
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
        <span class="time-tip" v-if="curExam.type == '1' && curExam.duration > 0">
          剩余时间
          <strong>{{common.formatNeedTime(lasttime)}}</strong>
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
          <!-- v-if="curTypeIndex=='0'" -->
        <el-radio-group
                      v-if="curQuestion.type == '3'"
          v-model="curQuestion.isTrue"
          @change="doneQuestion"
        >
          <el-radio :label="1">对</el-radio>
          <el-radio :label="0">错</el-radio>
        </el-radio-group>
          <!-- v-else-if="curTypeIndex=='1'" -->
        <el-radio-group
                  v-else-if="curQuestion.type == '1'"
          v-model="curQuestion.chooseOptionId"
          @change="doneQuestion"
        >
          <el-radio v-for="op in curQuestion.options" :key="op.id" :label="op.id">{{op.itemInfo}}</el-radio>
        </el-radio-group>
        <el-checkbox-group v-else v-model="curQuestion.chooseOptionIds" @change="checkQuestion">
          <el-checkbox v-for="op in curQuestion.options" :key="op.id" :label="op.id">{{op.itemInfo}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="footer">
        <el-button type="primary" size="big" style="width:176px;" @click="wantSubmit">我要交卷</el-button>
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
      @doConfirm="$router.push('/exam/result')"
    ></result>
    <!-------------------------------------- 通过部分闯关考试 -------------------------------------->
    <result
      ref="passModel"
      :score="score"
      cancelText="查看考试"
      confirmText="学习下一关"
      @doCancel="$router.push('/exam/result')"
      @doConfirm="learnNext"
    ></result>
    <!-------------------------------------- 未通过 -------------------------------------->
    <result
      ref="nopass"
      type="fail"
      :score="score"
      cancelText="查看考试"
      confirmText="继续学习"
      @doCancel="$router.push('/exam/result')"
      @doConfirm="$router.push('/exam/learn')"
    ></result>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getLoginUserExamQuestion, submitNormalExam, submitPointExam } from '@/api/exam'
import Confirm from '@/components/Confirm'
import Result from '@/components/Result'
export default {
  components: {
    Confirm,
    Result
  },
  data() {
    return {
      imgViewUrl: window.g.viewUrl,
      questions: [],
      total: 0,
      curTypeIndex: 0,
      curIndex: 0,
      dataList: [
        {
          type: '3',
          typename: '判断题',
          score: 0,
          total: 0,
          questions: []
        },
        {
          type: '1',
          typename: '单选题',
          score: 0,
          total: 0,
          questions: []
        },
        {
          type: '2',
          typename: '多选题',
          score: 0,
          total: 0,
          questions: []
        }
      ],
      lasttime: 0, // 剩余时间
      timer: null,
      passedtime: 0, // 已考时间
      dialogVisible: true,
      dialogTitle: '确认开始考试？',
      dialogText: '',
      score: 0,
      submittingText: "交卷完成，成绩计算中…"
    }
  },
  computed: mapState({
    // 当前试卷
    curExam: state => state.curExam,
    content() {
      return this.curExam.content
    },
    // 当前学习模块index及资料index
    curLearn: state => state.curLearn,
    // 当前题目类型信息
    curTypeInfo() {
      return this.dataList[this.curTypeIndex]
    },
    // 当前题目
    curQuestion() {
      return this.curTypeInfo.questions[this.curIndex]
    },
    // 已做题目数量
    doneNum() {
      return this.questions.filter(i => i.done).length
    },
    percent() {
      return parseInt((this.doneNum / this.total) * 100) || 0
    }
  }),
  watch: {
    lasttime(val) {
      if(val <= 0 && this.curExam.duration > 0) {
        this.submittingText = "考试时间结束，自动交卷，成绩计算中…"
        this.submitExam()
      }
    }
  },
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
    },
    // 做题
    doneQuestion() {
      this.curQuestion.done = true
    },
    // 多选题做题
    checkQuestion(val) {
      this.curQuestion.done = val.length > 0 ? true : false
    },
    // 我要交卷
    wantSubmit() {
      // 考试开始多少分钟后可交卷
      let beforeSubmitTime = this.curExam.beforeSubmitTime * 60
      if (beforeSubmitTime && this.passedtime < beforeSubmitTime) {
        this.$message({
          showClose: true,
          type: 'error',
          message: `考试开始${this.curExam.beforeSubmitTime}分钟后方可交卷！`
        })
      } else {
        this.$refs.confirmSubmit.visible = true
      }
    },
    // 确定交卷
    submitExam() {
      clearInterval(this.timer)
      this.$refs.confirmSubmit.visible = false
      let submitting = this.$refs.submitting
      submitting.visible = true
      let questions = this.questions.map(i => {
        return {
          id: i.id,
          type: i.type,
          isTrue: i.isTrue,
          chooseOptionIds: i.type == '1' ? [i.chooseOptionId] : i.chooseOptionIds
        }
      })
      let param = {
        examId: this.curExam.id,
        agent: '1', // 1-pc , 2-mobile
        questions
      }
      let func = submitNormalExam
      if (this.curExam.type == '2') {
        param.modelId = this.content.modelId
        func = submitPointExam
      }
      func(param)
        .then(res => {
          submitting.visible = false
          if (res.code == '000000') {
            let data = res.data || {}
            this.score = data.userScore
            if (data.isPass || data.isPassAll) {
              this.$refs.pass.visible = true
            } else if (!data.isPassAll && data.isPassCurrent) {
              this.$refs.passModel.visible = true
            } else {
              this.$refs.nopass.visible = true
            }
            // 设置答题结果
            this.setExamResult(data)
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '交卷失败：' + res.msg
            })
          }
        })
        .catch(err => {
          submitting.visible = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '交卷失败：' + err
          })
        })
    },
    // 设置答题结果
    setExamResult(data) {
      let list = data.resultQuesions
      this.dataList.forEach(i => {
        i.questions.forEach(j => {
          let obj = list.find(k => k.id == j.id)
          j.answerResult = obj.answerResult
          j.trueOptionIds = obj.trueOptionIds
        })
      })
      this.$store.commit('setCurExamResult', {
        isPass: data.isPass,
        score: data.userScore,
        totalNum: this.total,
        passNum: list.filter(i => i.answerResult).length,
        wrongNum: list.filter(i => !i.answerResult).length,
        passedtime: this.passedtime,
        dataList: this.dataList
      })
    },
    // 学习下一关
    learnNext() {
      this.$store.commit('setCurLearn', {
        modelIndex: this.curLearn.modelIndex + 1,
        learnIndex: 0
      })
      this.$router.push("/exam/learn")
    },
    // 获取试题
    getExamQuestion() {
      getLoginUserExamQuestion({
        examId: this.curExam.id,
        modelId: this.curExam.type == '1' ? null : this.content.modelId
      })
        .then(res => {
          if (res.code == '000000') {
            this.questions = res.data || []
            this.total = this.questions.length
            this.setQuestions()
          } else {
            this.questions = []
            this.total = 0
            this.$message({
              showClose: true,
              type: 'error',
              message: '获取试题失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.questions = []
          this.total = 0
          this.$message({
            showClose: true,
            type: 'error',
            message: '获取试题失败：' + err
          })
        })
    },
    // 设置题目
    setQuestions() {
      this.dataList.forEach(i => {
        i.questions = this.questions.filter(j => j.type == i.type)
        i.questions.forEach(j => {
          this.$set(j, 'done', false)
          j.photoList = j.photos ? j.photos.split(',').map(id => id && this.imgViewUrl + id) : []
          if (j.type == '1') {
            this.$set(j, 'chooseOptionId', '')
          }
          if (j.type == '2') {
            this.$set(j, 'chooseOptionIds', [])
          }
        })
      })
    },
    // 初始化
    initDataList() {
      let { judgeNum, judgeScore, singleNum, singleScore, multipleNum, multipleScore } = this.content
      this.dataList.forEach(i => {
        switch (i.type) {
          case '3':
            i.total = judgeNum
            i.score = judgeScore
            break
          case '1':
            i.total = singleNum
            i.score = singleScore
            break
          case '2':
            i.total = multipleNum
            i.score = multipleScore
            break
        }
      })
      this.dataList = this.dataList.filter(i => i.total > 0)
    },
    // 设置时间
    setTime() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.lasttime -= 1
        this.passedtime += 1
      }, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
    this.initDataList()
    this.getExamQuestion()
    this.lasttime = this.curExam.duration * 60
    this.setTime()
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
  .num {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 12px;
    color: #999999;
    line-height: 18px;
    strong {
      font-size: 14px;
      color: #1f232f;
    }
  }
  .el-progress {
    margin-top: 15px;
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
    padding: 0 10px;
    margin-bottom: 80px;
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
<style>
.progress .el-progress-bar__outer {
  background: #c8d8fd;
}
</style>