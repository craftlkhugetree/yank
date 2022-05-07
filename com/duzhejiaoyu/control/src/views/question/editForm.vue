<template>
  <div class="base-search-table" v-loading="loading">
    <!------------------------------------- 检查点信息 ------------------------------------->
    <div class="search-box clearfix">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      {{editForm.id ? "编辑题目" : "新增题目"}}
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
        label-position="right"
        label-width="100px"
        label-suffix="："
        size="small"
      >
        <el-form-item label="题目形式" prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio
              v-for="item in questionTypeList"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目内容" prop="subject">
          <el-input
            v-model="editForm.subject"
            type="textarea"
            rows="8"
            resize="none"
            style="width:538px;"
            placeholder="请输入题目内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="题目图片" prop="photos" style="margin-bottom:16px;">
          <div class="upload-box">
            <p class="img-des">建议尺寸为1000*300，大小不超过10M，支持格式 png、jpg、gif</p>
            <img-upload
              ref="imgUpload"
              :url="imgUploadUrl"
              @done="imgUploaded"
              :onlyOne="false"
              :multiple="false"
              :size="10"
            ></img-upload>
          </div>
        </el-form-item>
        <!-------------------------- 判断题题目答案 -------------------------->
        <el-form-item
          v-if="editForm.type == '3'"
          label="题目答案"
          prop="isTrue"
          :rules="[{required: editForm.type == '3', trigger: 'change', message: '请选择题目答案'}]"
        >
          <el-radio-group v-model="editForm.isTrue">
            <el-radio :label="1">对</el-radio>
            <el-radio :label="0">错</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-------------------------- 题目选项 -------------------------->
        <el-form-item
          v-if="['1','2'].includes(editForm.type)"
          label="题目选项"
          prop="options"
          style="margin-bottom:16px"
          :rules="[{required: ['1','2'].includes(editForm.type), trigger: 'change', validator: checkOptions}]"
        >
          <div class="option" v-for="(item,index) in editForm.options" :key="item.id">
            <input
              v-if="editForm.type == '1'"
              type="radio"
              v-model="optionIndex"
              :name="editForm.type"
              :value="index"
              @change="changeRadio"
            />
            <input
              v-if="editForm.type == '2'"
              type="checkbox"
              v-model="optionIndexList"
              :name="editForm.type"
              :value="index"
              @change="changeCheck"
            />
            <el-input placeholder="请输入" v-model="item.itemInfo" style="width:480px;"></el-input>
            <i class="el-icon-delete" @click="deleteOption(index)"></i>
          </div>
          <div class="add-btn" @click="addOption">+ 新增选项</div>
        </el-form-item>
        <el-form-item label="题目分析" prop="analysis">
          <el-input
            v-model="editForm.analysis"
            type="textarea"
            rows="8"
            resize="none"
            style="width:538px;"
            placeholder="请输入题目分析"
          ></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <h3>其他设置</h3>
        <el-form-item label="所属模块" prop="modelIds">
          <el-checkbox-group v-model="editForm.modelIds">
            <el-checkbox v-for="item in moduleList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="所属校区" prop="campusIds">
          <el-checkbox-group v-model="editForm.campusIds">
            <el-checkbox v-for="item in campusList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="用户类型" prop="usertypeCodes">
          <el-checkbox-group v-model="editForm.usertypeCodes">
            <el-checkbox
              v-for="item in userTypeList"
              :key="item.code"
              :label="item.code"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否必考" prop="isImportant">
          <div class="switch">
            <el-switch
              ref="switch"
              :width="42"
              v-model="editForm.isImportant"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <span class="on" v-show="editForm.isImportant==1" @click="editForm.isImportant=0">是</span>
            <span class="off" v-show="editForm.isImportant==0" @click="editForm.isImportant=1">否</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveQuestion, fetchDetail } from '@/api/question'
import { mapState } from 'vuex'
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    ImgUpload
  },
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      imgUploadUrl: window.g.uploadUrl,
      editForm: {
        id: this.id || null,
        type: '3',
        subject: null,
        photos: [],
        isTrue: '1',
        options: [
          { itemInfo: null, isReal: 1 },
          { itemInfo: null, isReal: 0 }
        ],
        analysis: null,
        modelIds: [],
        campusIds: [],
        usertypeCodes: [],
        isImportant: 1
      },
      rules: {
        type: [{ required: true, trigger: 'change', message: '请选择题目形式' }],
        subject: [{ required: true, trigger: 'change', message: '请输入题目内容' }]
      },
      detail: {},
      optionIndex: null,
      optionIndexList: []
    }
  },
  computed: mapState({
    typeList: state => state.trainTypeList,
    moduleList: state => state.moduleList,
    campusList: state => state.campusList,
    userTypeList: state => state.userTypeList,
    questionTypeList: state => state.questionTypeList
  }),
  methods: {
    // 校验题目选项
    checkOptions(rule, value, callback) {
      if (value.length < 2) {
        callback(new Error('至少需要两个题目选项'))
      } else {
        if (value.some(i => !i.itemInfo)) {
          callback(new Error('题目选项内容不能为空'))
        } else {
          callback()
        }
      }
    },
    // 新增选项
    addOption() {
      this.editForm.options.push({ itemInfo: null, isReal: 0 })
    },
    // 删除选项
    deleteOption(index) {
      this.editForm.options.splice(index, 1)
    },
    // 图片上传
    imgUploaded(data) {
      if (data) {
        this.editForm.photos = data.map(i => i.ID)
      } else {
        this.editForm.photos = []
      }
    },
    // 改变选项
    changeRadio() {
      this.editForm.options.forEach(i => (i.isReal = 0))
      this.editForm.options[this.optionIndex].isReal = 1
    },
    changeCheck() {
      this.editForm.options.forEach((i, index) => {
        if (this.optionIndexList.includes(index)) {
          i.isReal = 1
        } else {
          i.isReal = 0
        }
      })
    },
    // 保存
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true
          let param = { ...this.editForm }
          param.photos = this.editForm.photos.join(',')
          saveQuestion(param)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$confirm('您的题目已保存成功！', '保存成功', {
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
                    this.$refs.imgUpload.reset()
                  })
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
    // 默认全选校区
    chooseAllCampus() {
      this.editForm.campusIds = this.campusList.map(i => i.id)
    },
    // 默认全选用户类型
    chooseAllUsertype() {
      this.editForm.usertypeCodes = this.userTypeList.map(i => i.code)
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
      for (let key in this.editForm) {
        this.editForm[key] = data[key] || null
      }
      if (data.type == '1') {
        this.optionIndex = data.options.findIndex(i => i.isReal == 1)
      }
      if (data.type == '2') {
        this.optionIndexList = data.options.filter(i => i.isReal == 1).map((i,index) => index)
      }
      this.editForm.modelIds = data.models ? data.models.map(i => i.id) : []
      this.editForm.campusIds = data.campuss ? data.campuss.map(i => i.id) : []
      this.editForm.usertypeCodes = data.usertypes ? data.usertypes.map(i => i.code) : []
      this.editForm.photos = data.photos ? data.photos.split(',') : []
      this.$refs.imgUpload.photos = this.editForm.photos.map(i => {
        return { ID: i }
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
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  padding: 0 20px !important;
  border-bottom: 1px solid #dbdbdb;
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
  padding: 20px 0;
  .el-radio {
    margin-right: 50px;
    color: rgba(0, 0, 0, 0.65);
  }
  .el-checkbox {
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
    line-height: 22px;
    vertical-align: middle;
    margin-right: 10px;
  }
  .img-des {
    color: #7e8081;
    line-height: 32px;
  }
  h3 {
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
.is-error {
  .editor {
    border: 1px solid #f56c6c;
    border-radius: 4px;
  }
}
.option {
  margin-bottom: 14px;
  input[type='radio'],
  input[type='checkbox'] {
    margin-right: 10px;
    cursor: pointer;
  }
  i {
    color: rgba(0, 0, 0, 0.45);
    margin-left: 12px;
    cursor: pointer;
  }
}
.add-btn {
  border: 1px dashed rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;
  width: 480px;
  margin-left: 26px;
}
</style>