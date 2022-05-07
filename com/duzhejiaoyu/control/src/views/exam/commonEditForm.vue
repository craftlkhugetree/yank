<template>
  <div class="base-search-table" v-loading="loading">
    <!------------------------------------- 检查点信息 ------------------------------------->
    <div class="search-box clearfix">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      {{editForm.id ? "编辑普通考试" : "新增普通考试"}}
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
        <el-form-item label="考试名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <h3>考试配置</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="考试时间" prop="examDate" style="margin-bottom:0px;"></el-form-item>
            <el-form-item prop="examDate" style="margin-left:-100px;">
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
          </el-col>
          <el-col :span="6">
            <el-form-item label="考试时长" prop="duration" style="margin-bottom:0px;"></el-form-item>
            <el-form-item prop="duration" style="margin-left: -100px;">
              <div class="input-number">
                <el-input-number v-model="editForm.duration" controls-position="right"></el-input-number>
                <span class="mm">分钟</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="后可交卷" prop="beforeSubmitTime" style="margin-bottom:0px;"></el-form-item>
            <el-form-item prop="beforeSubmitTime" style="margin-left: -100px;">
              <div class="input-number">
                <el-input-number v-model="editForm.beforeSubmitTime" controls-position="right"></el-input-number>
                <span class="mm">分钟</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
        <el-form-item label="需要学习" prop="needLearn" style="margin-left:10px;">
          <div class="input-number" style="width:270px;">
            <el-input-number v-model="editForm.needLearn" controls-position="right"></el-input-number>
            <span class="mm">分钟</span>
          </div>
        </el-form-item>
        <h3 style="margin-top:30px;">适用对象</h3>
        <el-form-item label="适用校区" prop="campusIds">
          <el-checkbox-group v-model="editForm.campusIds" @change="debouncePoolData">
            <el-checkbox v-for="item in campusList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="适用用户" prop="usertypeCodes">
          <el-checkbox-group v-model="editForm.usertypeCodes" @change="debouncePoolData">
            <el-checkbox
              v-for="item in userTypeList"
              :key="item.code"
              :label="item.code"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-divider></el-divider>
        <h3>组卷信息</h3>
        <el-form-item label="题目模块" prop="modelIds">
          <el-checkbox-group v-model="editForm.modelIds" @change="debouncePoolData">
            <el-checkbox v-for="item in moduleList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row :gutter="6" v-loading="questionLoading">
          <!------------------------------ 判断题 ------------------------------>
          <el-col :span="8">
            <el-form-item
              label="判断题"
              prop="content.judgeNum"
              label-width="80px"
              required
              :show-message="false"
            >
              <question-tips ref="judgePool" :data="poolData" type="3"></question-tips>
            </el-form-item>
            <el-form-item prop="judgeNum" style="margin-left: -100px;">
              <div class="input-number half" style="margin-right:10px;">
                <el-input-number
                  v-model="editForm.content.judgeNum"
                  controls-position="right"
                  :min="0"
                  :max="judgePoolMax"
                  @change="calcTotalScore"
                ></el-input-number>
                <span class="mm">题</span>
              </div>
              <div class="input-number half">
                <el-input-number
                  v-model="editForm.content.judgeScore"
                  controls-position="right"
                  :min="0"
                  @change="calcTotalScore"
                ></el-input-number>
                <span class="mm">分/题</span>
              </div>
            </el-form-item>
          </el-col>
          <!------------------------------ 单选题 ------------------------------>
          <el-col :span="8">
            <el-form-item
              label="单选题"
              prop="content.singleNum"
              label-width="80px"
              required
              :show-message="false"
            >
              <question-tips ref="singlePool" :data="poolData" type="1"></question-tips>
            </el-form-item>
            <el-form-item prop="singleNum" style="margin-left: -100px;">
              <div class="input-number half" style="margin-right:10px;">
                <el-input-number
                  v-model="editForm.content.singleNum"
                  controls-position="right"
                  :min="0"
                  :max="singlePoolMax"
                  @change="calcTotalScore"
                ></el-input-number>
                <span class="mm">题</span>
              </div>
              <div class="input-number half">
                <el-input-number
                  v-model="editForm.content.singleScore"
                  controls-position="right"
                  :min="0"
                  @change="calcTotalScore"
                ></el-input-number>
                <span class="mm">分/题</span>
              </div>
            </el-form-item>
          </el-col>
          <!------------------------------ 多选题 ------------------------------>
          <el-col :span="8">
            <el-form-item
              label="多选题"
              prop="content.multipleNum"
              label-width="80px"
              required
              :show-message="false"
            >
              <question-tips ref="multiplePool" :data="poolData" type="2"></question-tips>
            </el-form-item>
            <el-form-item prop="multipleNum" style="margin-left: -100px;">
              <div class="input-number half" style="margin-right:10px;">
                <el-input-number
                  v-model="editForm.content.multipleNum"
                  controls-position="right"
                  :min="0"
                  :max="multiplePoolMax"
                  @change="calcTotalScore"
                ></el-input-number>
                <span class="mm">题</span>
              </div>
              <div class="input-number half">
                <el-input-number
                  v-model="editForm.content.multipleScore"
                  controls-position="right"
                  :min="0"
                  @change="calcTotalScore"
                ></el-input-number>
                <span class="mm">分/题</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!------------------------------ 总分 ------------------------------>
          <el-col :span="12">
            <el-form-item label="总分" prop="totalScore"></el-form-item>
            <el-form-item prop="totalScore" style="margin-left:-100px;">
              <el-input v-model="editForm.content.totalScore" disabled></el-input>
            </el-form-item>
          </el-col>
          <!------------------------------ 合格分 ------------------------------>
          <el-col :span="12">
            <el-form-item label="合格分" prop="qualifiedScore"></el-form-item>
            <el-form-item prop="qualifiedScore" style="margin-left:-100px;">
              <div class="input-number">
                <el-input-number
                  v-model="editForm.content.qualifiedScore"
                  controls-position="right"
                  :min="0"
                  :max="editForm.content.totalScore"
                ></el-input-number>
                <span class="mm">分</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
        type: '1',
        name: null,
        examDate: null,
        duration: 0,
        beforeSubmitTime: 0,
        isOpenip: 0,
        ipStart: null,
        ipEnd: null,
        needLearn: 0,
        campusIds: [],
        usertypeCodes: [],
        modelIds: [],
        content: {
          judgeNum: 0,
          judgeScore: 0,
          multipleNum: 0,
          multipleScore: 0,
          singleNum: 0,
          singleScore: 0,
          totalScore: 0,
          qualifiedScore: 0
        }
      },
      rules: {
        name: [{ required: true, trigger: 'change', message: '请输入考试名称' }],
        examDate: [{ required: true, trigger: 'change', message: '请选择考试时间' }],
        isOpenip: [{ required: true, trigger: 'change', message: '请选择IP限制' }],
        ipStart: [{ required: true, validator: validateIp, trigger: 'change' }],
        ipEnd: [{ required: true, validator: validateIp, trigger: 'change' }],
        campusIds: [{ required: true, trigger: 'change', message: '请选择适用校区' }],
        usertypeCodes: [{ required: true, trigger: 'change', message: '请选择适用用户' }],
        modelIds: [{ required: true, trigger: 'change', message: '请选择题目模块' }]
      },
      detail: {},
      poolData: [],
      questionLoading: false,
      judgePoolMax: 0,
      singlePoolMax: 0,
      multiplePoolMax: 0
    }
  },
  computed: mapState({
    typeList: state => state.trainTypeList,
    moduleList: state => state.moduleList,
    campusList: state => state.campusList,
    userTypeList: state => state.userTypeList,
    questionTypeList: state => state.questionTypeList,
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
          param.contents = [this.editForm.content]
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
                  this.$confirm('普通考试保存成功！', '保存成功', {
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
      this.poolData = []
      this.editForm.examDate = null
      this.editForm.content.judgeScore = 0
      this.editForm.content.singleScore = 0
      this.editForm.content.multipleScore = 0
      this.editForm.content.qualifiedScore = 0
    },
    // 默认全选校区
    chooseAllCampus() {
      this.editForm.campusIds = this.campusList.map(i => i.id)
    },
    // 默认全选用户类型
    chooseAllUsertype() {
      this.editForm.usertypeCodes = this.userTypeList.map(i => i.code)
    },
    // 防抖
    debouncePoolData: CommonJs.debounce(function(){
      this.getPoolData()
    }, 1000),
    // 题目池数量
    getPoolData() {
      this.questionLoading = true
      let param = {
        campusIds: this.editForm.campusIds,
        modelIds: this.editForm.modelIds,
        usertypeCodes: this.editForm.usertypeCodes
      }
      return fetchQuestionPool(param)
        .then(res => {
          this.questionLoading = false
          if (res.code == '000000') {
            this.poolData = res.data || []
            this.$nextTick(() => {
              this.judgePoolMax = this.$refs.judgePool.minNum || 0
              this.singlePoolMax = this.$refs.singlePool.minNum || 0
              this.multiplePoolMax = this.$refs.multiplePool.minNum || 0
            })
            return Promise.resolve()
          } else {
            this.poolData = []
            this.judgePool = 0
            this.singlePool = 0
            this.multiplePoolMax = 0
            return Promise.reject()
          }
        })
        .catch(err => {
          this.questionLoading = false
          this.poolData = []
          this.judgePool = 0
          this.singlePool = 0
          this.multiplePoolMax = 0
          return Promise.reject()
        })
    },
    // 计算总分
    calcTotalScore() {
      let { judgeNum, judgeScore, singleNum, singleScore, multipleNum, multipleScore } = this.editForm.content
      this.editForm.content.totalScore =
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
      this.editForm.modelIds = data.models ? data.models.map(i => i.id) : []
      this.editForm.campusIds = data.campuss ? data.campuss.map(i => i.id) : []
      this.editForm.usertypeCodes = data.usertypes ? data.usertypes.map(i => i.code) : []
      this.getPoolData().then(() => {
        let content = data.contents[0]
        if (content) {
          this.editForm.content = content
        }
      })
    }
  },
  created() {
    if (!this.editForm.id) {
      this.chooseAllCampus()
      this.chooseAllUsertype()
    } else {
      this.getDetail()
    }
    if (this.moduleList.length == 0) {
      this.$store.dispatch('getModuleList')
    }
    if (this.campusList.length == 0) {
      this.$store.dispatch('getCampusList')
    }
    if (this.userTypeList.length == 0) {
      this.$store.dispatch('getUserTypeList')
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
  width: 640px;
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
      left: 6px;
    }
    &.off {
      color: #999;
      right: 20px;
    }
  }
}

.input-number {
  position: relative;
  .el-input-number--small {
    width: 100%;
  }
  .mm {
    font-size: 12px;
    position: absolute;
    top: 0;
    right: 36px;
    color: #999999;
  }
  &.half {
    display: inline-block;
    width: 45%;
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