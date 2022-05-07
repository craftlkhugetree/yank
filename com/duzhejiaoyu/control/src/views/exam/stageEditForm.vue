<template>
  <div class="base-search-table" v-loading="loading">
    <!------------------------------------- 检查点信息 ------------------------------------->
    <div class="search-box clearfix">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      {{editForm.id ? "编辑闯关考试" : "新增闯关考试"}}
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right" style="max-width: 100%">
        <el-button type="primary" size="small" @click="save" v-loading="loading">保存</el-button>
      </div>
    </div>
    <!---------------------------- 表单 ---------------------------->
    <div class="form-box">
      <el-form
        class="edit-form"
        :model="editForm"
        ref="editForm"
        :rules="rules"
        label-position="left"
        label-width="100px"
        label-suffix="："
        size="small"
      >
        <div style="width:640px;margin:0 auto;">
          <el-form-item label="考试名称" prop="name">
            <el-input v-model="editForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <h3>考试配置</h3>
          <el-form-item label="考试时间" prop="examDate">
            <el-date-picker
              v-model="editForm.examDate"
              type="daterange"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyyMMdd"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="IP限制" prop="isOpenip">
                <el-radio-group v-model="editForm.isOpenip" @change="changeIpOpen">
                  <el-radio :label="0">不限制</el-radio>
                  <el-radio :label="1">开启限制</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="editForm.isOpenip == '1'">
              <div class="ip-box">
                <el-form-item prop="ipStart">
                  <el-input v-model="editForm.ipStart" placeholder="IP地址" size="small"></el-input>
                </el-form-item>
                <span>~</span>
                <el-form-item prop="ipEnd">
                  <el-input v-model="editForm.ipEnd" placeholder="IP地址" size="small"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <h3 style="margin-top:30px;">适用对象</h3>
          <el-form-item label="适用校区" prop="campusIds">
            <el-checkbox-group v-model="editForm.campusIds" @change="debounceContentsPoolData">
              <el-checkbox v-for="item in campusList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="适用用户" prop="usertypeCodes">
            <el-checkbox-group v-model="editForm.usertypeCodes" @change="debounceContentsPoolData">
              <el-checkbox
                v-for="item in userTypeList"
                :key="item.code"
                :label="item.code"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-divider></el-divider>
          <div class="stage-title">
            <h3>
              关卡信息
              <span class="tips">
                <i class="el-icon-warning"></i>
                通过所有关卡后激活借书证
              </span>
            </h3>
            <el-form-item prop="isOrder" class="right-item">
              <div class="switch">
                <el-switch
                  ref="switch"
                  :width="54"
                  v-model="editForm.isOrder"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
                <span class="on" v-show="editForm.isOrder==1" @click="editForm.isOrder=0">开启</span>
                <span class="off" v-show="editForm.isOrder==0" @click="editForm.isOrder=1">关闭</span>
              </div>
              <span style="color: #5F6464;margin-left:10px;">按关卡顺序闯关</span>
            </el-form-item>
          </div>
        </div>
        <!---------------------------------------------- 关卡 ---------------------------------------------->
        <div class="stage-table" v-loading="questionLoading">
          <el-row class="head" :gutter="6">
            <el-col :span="1">关卡</el-col>
            <el-col :span="6">判断题</el-col>
            <el-col :span="6">单选题</el-col>
            <el-col :span="6">多选题</el-col>
            <el-col :span="2">合格分</el-col>
            <el-col :span="3">需要学习</el-col>
          </el-row>
          <el-row class="body" :gutter="6" v-for="(item,index) in contents" :key="item.modelId">
            <el-col :span="1">{{index + 1}}</el-col>
            <!------------------------------ 判断题 ------------------------------>
            <el-col :span="6">
              <question-tips ref="judgePool" :data="item.poolData" type="3">
                <span style="margin-right:10px;">{{item.modelName}}</span>
              </question-tips>
              <div class="input-number half" style="margin-right:10px;">
                <el-input-number
                  v-model="item.judgeNum"
                  controls-position="right"
                  :min="0"
                  :max="item.maxJudgeNum"
                  size="small"
                  @change="calcTotalScore(index)"
                ></el-input-number>
                <span class="mm">题</span>
              </div>
              <div class="input-number half">
                <el-input-number
                  v-model="item.judgeScore"
                  controls-position="right"
                  :min="0"
                  size="small"
                  @change="calcTotalScore(index)"
                ></el-input-number>
                <span class="mm">分/题</span>
              </div>
            </el-col>
            <!------------------------------ 单选题 ------------------------------>
            <el-col :span="6">
              <question-tips ref="singlePool" :data="item.poolData" type="1"></question-tips>
              <div class="input-number half" style="margin-right:10px;">
                <el-input-number
                  v-model="item.singleNum"
                  controls-position="right"
                  :min="0"
                  :max="item.maxSingleNum"
                  size="small"
                  @change="calcTotalScore(index)"
                ></el-input-number>
                <span class="mm">题</span>
              </div>
              <div class="input-number half">
                <el-input-number
                  v-model="item.singleScore"
                  controls-position="right"
                  :min="0"
                  size="small"
                  @change="calcTotalScore(index)"
                ></el-input-number>
                <span class="mm">分/题</span>
              </div>
            </el-col>
            <!------------------------------ 多选题 ------------------------------>
            <el-col :span="6">
              <question-tips ref="multiplePool" :data="item.poolData" type="2"></question-tips>
              <div class="input-number half" style="margin-right:10px;">
                <el-input-number
                  v-model="item.multipleNum"
                  controls-position="right"
                  :min="0"
                  :max="item.maxMultipleNum"
                  size="small"
                  @change="calcTotalScore(index)"
                ></el-input-number>
                <span class="mm">题</span>
              </div>
              <div class="input-number half">
                <el-input-number
                  v-model="item.multipleScore"
                  controls-position="right"
                  :min="0"
                  size="small"
                  @change="calcTotalScore(index)"
                ></el-input-number>
                <span class="mm">分/题</span>
              </div>
            </el-col>
            <!------------------------------ 合格分 ------------------------------>
            <el-col :span="5">
              <p style="color:#999;">总分：{{item.totalScore}}</p>
              <div class="input-number half" style="margin-right:10px;">
                <el-input-number
                  v-model="item.qualifiedScore"
                  controls-position="right"
                  :min="0"
                  :max="item.totalScore"
                  size="small"
                ></el-input-number>
                <span class="mm">分</span>
              </div>
              <!------------------------------ 需要学习 ------------------------------>
              <div class="input-number half">
                <el-input-number
                  v-model="item.needLearn"
                  controls-position="right"
                  :min="0"
                  size="small"
                ></el-input-number>
                <span class="mm">分钟</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveExam, fetchDetail } from '@/api/exam'
import { mapState } from 'vuex'
import QuestionTips from '@/components/QuestionTips'
import { fetchQuestionPool } from '@/api/question'
import CommonJs from '@/assets/js/common'
export default {
  components: {
    QuestionTips
  },
  props: {
    id: String
  },
  data() {
    let reg =/^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
    let validateIp = (rule, val, callback) => {
      if(!val) {
        return callback(new Error("请输入IP地址!"))
      } else if(!reg.test(val)) {
        return callback(new Error("请输入正确的IP地址!"))
      } else if (this.editForm.ipEnd && this.editForm.ipStart) {
        let startArr = this.editForm.ipStart.split(".")
        let endArr = this.editForm.ipEnd.split(".")
        let startStr = startArr.slice(0,3).join(".")
        let endStr = endArr.slice(0,3).join(".")
        if(startStr !== endStr || startArr[3] > endArr[3]) {
          return callback(new Error("IP地址范围不符合规范!"))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    return {
      loading: false,
      editForm: {
        id: this.id || null,
        type: '2',
        name: null,
        examDate: null,
        isOpenip: 0,
        ipStart: null,
        ipEnd: null,
        campusIds: [],
        usertypeCodes: [],
        isOrder: 1
      },
      rules: {
        name: [{ required: true, trigger: 'change', message: '请输入考试名称' }],
        examDate: [{ required: true, trigger: 'change', message: '请选择考试时间' }],
        isOpenip: [{ required: true, trigger: 'change', message: '请选择IP限制' }],
        ipStart: [{ required: true, validator: validateIp, trigger: 'change' }],
        ipEnd: [{ required: true, validator: validateIp, trigger: 'change' }],
        campusIds: [{ required: true, trigger: 'change', message: '请选择适用校区' }],
        usertypeCodes: [{ required: true, trigger: 'change', message: '请选择适用用户' }]
      },
      detail: {},
      questionLoading: false,
      content: {
        maxJudgeNum: 0,
        judgeNum: 0,
        judgeScore: 0,
        maxMultipleNum: 0,
        multipleNum: 0,
        multipleScore: 0,
        maxSingleNum: 0,
        singleNum: 0,
        singleScore: 0,
        totalScore: 0,
        qualifiedScore: 0,
        needLearn: 0,
        poolData: []
      },
      contents: []
    }
  },
  computed: mapState({
    moduleList: state => state.moduleList,
    campusList: state => state.campusList,
    userTypeList: state => state.userTypeList
  }),
  methods: {
    changeIpOpen(val) {
      if(val == 0) {
        this.editForm.ipStart = null
        this.editForm.ipEnd = null
      }
    },
    // 保存
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true
          let param = { ...this.editForm }
          param.startDate = this.editForm.examDate[0]
          param.endDate = this.editForm.examDate[1]
          param.contents = []
          this.contents.forEach(i => {
            if (i.judgeNum + i.multipleNum + i.singleNum > 0) {
              let obj = {}
              for (let key in i) {
                if (key !== 'poolData') {
                  obj[key] = i[key]
                }
              }
              param.contents.push(obj)
            }
          })
          saveExam(param)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                if (this.editForm.id) {
                  this.$message({
                    showClose: true,
                    type: 'success',
                    message: '保存成功！'
                  })
                } else {
                  this.$confirm('闯关考试保存成功！', '保存成功', {
                    confirmButtonText: '返回',
                    cancelButtonText: '继续新增',
                    showCancelButton: !this.id,
                    type: 'success'
                  })
                    .then(() => {
                      this.$router.go(-1)
                    })
                    .catch(() => {
                      this.$refs.editForm.resetFields()
                      this.resetData()
                    })
                }
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败：' + res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败：' + err
              })
            })
        }
      })
    },
    // 重置数据
    resetData() {
      this.editForm.examDate = null
      this.initContents()
    },
    // 默认全选校区
    chooseAllCampus() {
      this.editForm.campusIds = this.campusList.map(i => i.id)
    },
    // 默认全选用户类型
    chooseAllUsertype() {
      this.editForm.usertypeCodes = this.userTypeList.map(i => i.code)
    },
    // 题目池数量
    getPoolData(modelId) {
      this.questionLoading = true
      return new Promise((resolve, reject) => {
        let param = {
          campusIds: this.editForm.campusIds,
          modelIds: [modelId],
          usertypeCodes: this.editForm.usertypeCodes
        }
        fetchQuestionPool(param)
          .then(res => {
            this.questionLoading = false
            if (res.code == '000000') {
              let data = res.data || []
              resolve(data)
            } else {
              reject([])
            }
          })
          .catch(err => {
            this.questionLoading = false
            reject([])
          })
      })
    },
    // 初始化关卡
    initContents() {
      this.contents = []
      for (let i = 0; i < this.moduleList.length; i++) {
        let item = this.moduleList[i]
        this.contents.push({
          modelId: item.id,
          modelName: item.name,
          ...this.content
        })
      }
      this.resetContentsPoolData()
    },
    // 防抖模式  重新获取题池数量
    debounceContentsPoolData: CommonJs.debounce(function () {
      this.resetContentsPoolData()
    }, 1000),
    // 重新获取题池数量
    async resetContentsPoolData() {
      for (let i = 0; i < this.contents.length; i++) {
        let item = this.moduleList[i]
        let poolData = await this.getPoolData(item.id)
        this.contents[i].poolData = poolData
        this.$nextTick(() => {
          this.contents[i].maxJudgeNum = this.$refs.judgePool[i].minNum
          this.contents[i].maxSingleNum = this.$refs.singlePool[i].minNum
          this.contents[i].maxMultipleNum = this.$refs.multiplePool[i].minNum
        })
      }
    },
    // 计算总分
    calcTotalScore(index) {
      let { judgeNum, judgeScore, singleNum, singleScore, multipleNum, multipleScore } = this.contents[index]
      this.contents[index].totalScore =
        parseInt(this.common.multiply(judgeNum, judgeScore)) +
        parseInt(this.common.multiply(singleNum, singleScore)) +
        parseInt(this.common.multiply(multipleNum, multipleScore))
    },
    // 获取详情
    getDetail() {
      this.loading = true
      fetchDetail(this.id)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            let data = res.data || {}
            this.initDetail(data)
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '获取详情失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '获取详情失败：' + err
          })
        })
    },
    // 初始化详情数据
    initDetail(data) {
      for (let key in data) {
        this.editForm[key] = data[key]
      }
      this.editForm.examDate = [data.startDate, data.endDate]
      this.editForm.campusIds = data.campuss ? data.campuss.map(i => i.id) : []
      this.editForm.usertypeCodes = data.usertypes ? data.usertypes.map(i => i.code) : []
      this.contents = data.contents.map(i => {
        return {
          ...i,
          poolData: []
        }
      })
      this.resetContentsPoolData()
    }
  },
  created() {
    if (this.moduleList.length == 0) {
      this.$store.dispatch('getModuleList')
    }
    if (this.campusList.length == 0) {
      this.$store.dispatch('getCampusList')
    }
    if (this.userTypeList.length == 0) {
      this.$store.dispatch('getUserTypeList')
    }
    if (!this.editForm.id) {
      this.chooseAllCampus()
      this.chooseAllUsertype()
      this.initContents()
    } else {
      this.getDetail()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.search-box {
  position: fixed;
  width: calc(100% - 220px);
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  padding: 0 20px !important;
  border-bottom: 1px solid #dbdbdb;
  background: #ffffff;
  z-index: 1000;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}
.form-box {
  width: 1000px;
  margin: 0 auto;
  padding: 80px 0;
  .el-radio {
    margin-right: 30px;
    color: rgba(0, 0, 0, 0.65);
  }
  .el-checkbox {
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
    line-height: 22px;
    vertical-align: middle;
    margin-right: 10px;
  }
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #373b4b;
    margin-bottom: 15px;
  }
}
.switch {
  display: inline-block;
  position: relative;
  width: 54px;
  height: 22px;
  line-height: 22px;
  margin-top: -2px;
  span {
    position: absolute;
    font-size: 12px;
    padding-top: 1px;
    top: 0;
    cursor: pointer;
    &.on {
      color: #ffffff;
      left: 8px;
    }
    &.off {
      color: #999;
      right: 8px;
    }
  }
}

.input-number {
  position: relative;
  margin-top: 10px;
  .el-input-number--small {
    width: 100%;
  }
  .mm {
    font-size: 13px;
    position: absolute;
    top: 10px;
    right: 36px;
    color: #999999;
  }
  &.half {
    display: inline-block;
    width: 45%;
  }
}
.stage-title {
  position: relative;
  .right-item {
    position: absolute;
    right: 0;
    top: -10px;
  }
}
.tips {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  i {
    font-size: 14px;
    color: #faad14;
  }
}
.stage-table {
  .head {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    background: rgba(0, 0, 0, 0.02);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
    line-height: 22px;
  }
  .el-col {
    padding: 16px 10px;
  }
}
</style>


<style lang="scss">
.ip-box {
  width: 100%;
  height: 34px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  .el-form-item {
    display: inline-block;
    margin-left: -100px;
    width: 245px;
    margin-bottom: 0 !important;
  }
  .el-form-item--small .el-form-item__content {
    line-height: 30px;
  }
  .el-input__inner {
    border: none;
  }
}
.input-number.half {
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 10px;
    text-align: left;
  }
}
</style>