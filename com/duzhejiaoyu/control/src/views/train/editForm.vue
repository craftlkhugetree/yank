<template>
  <div class="base-search-table" v-loading="loading">
    <!------------------------------------- 检查点信息 ------------------------------------->
    <div class="search-box clearfix">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      {{editForm.id ? "编辑资料" : "新增资料"}}
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right" style="max-width: 100%">
        <el-button type="primary" size="small" @click="save" v-loading="loading">保存</el-button>
        <!-- <el-button size="small" class="bule-border">手机端预览</el-button>
        <el-button size="small" class="bule-border">网页端预览</el-button> -->
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
        <el-form-item label="资料形式" prop="type">
          <el-radio-group v-model="editForm.type" @change="resetFile">
            <el-radio v-for="item in typeList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="editForm.type == '1'"
          label="上传视频"
          prop="file"
          :rules="[{
            required: editForm.type == '1',
            trigger: 'change',
            message: '请上传文件'
          }]"
        >
          <div class="upload-box">
            <p class="img-des">支持格式 mpeg、mpg、dat、mp4、mkv</p>
            <video-file-upload
              @transLoading="load"
              key="video"
              ref="videoUpload"
              type="video"
              :url="videoUploadUrl"
              @done="videoUploaded"
            ></video-file-upload>
          </div>
        </el-form-item>
        <el-form-item
          v-show="editForm.type == '2'"
          label="上传文件"
          prop="file"
          :rules="[{
            required: editForm.type == '2',
            trigger: 'change',
            message: '请上传文件'
          }]"
        >
          <div class="upload-box">
            <p class="img-des">支持格式 pdf、doc、docx、xls、xlsx、ppt、pptx</p>
            <video-file-upload
              @transLoading="load"
              key="file"
              ref="fileUpload"
              type="file"
              :url="fileUploadUrl"
              @done="fileUploaded"
            ></video-file-upload>
          </div>
        </el-form-item>
        <el-form-item label="资料封面" prop="cover" style="margin-bottom:16px;">
          <div class="upload-box">
            <p class="img-des">支持格式 png、jpg、gif</p>
            <img-upload
              ref="imgUpload"
              :url="imgUploadUrl"
              @done="imgUploaded"
              :onlyOne="true"
              :multiple="false"
            ></img-upload>
          </div>
        </el-form-item>
        <el-form-item label="资料名称" prop="name" style="margin-bottom:16px;">
          <el-input v-model="editForm.name" size="small" style="width:538px;" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="资料简介" prop="desc">
          <el-input
            v-model="editForm.desc"
            type="textarea"
            maxlength="250"
            rows="8"
            resize="none"
            style="width:538px;"
            placeholder="请输入资料简介，不超过250字"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="editForm.type == '3'"
          label="资料内容"
          prop="dhtml"
          :show-message="false"
          :rules="[{ required: editForm.type == '3', trigger: 'change', message: '请输入资料内容' }]"
        ></el-form-item>
        <el-form-item v-show="editForm.type == '3'" prop="dhtml" style="margin-left:-100px;">
          <wang-editor class="editor" ref="editor" @change="changeHtml"></wang-editor>
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
         
        <el-form-item label="开启下载" prop="isDownload" v-if="!(editForm.type == '3')">
          <div class="switch">
            <el-switch
              ref="switch"
              :width="42"
              v-model="editForm.isDownload"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <span class="on" v-show="editForm.isDownload==1" @click="editForm.isDownload=0">开</span>
            <span class="off" v-show="editForm.isDownload==0" @click="editForm.isDownload=1">关</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveLearn, fetchDetail } from '@/api/train'
import { mapState } from 'vuex'
import VideoFileUpload from '@/components/VideoFileUpload'
import ImgUpload from '@/components/ImgUpload'
import WangEditor from '@/components/WangEditor'
// import Angkeeditor from 'angkeeditor';
// import Vue from 'vue';
// Vue.use(Angkeeditor)
export default {
  components: {
    VideoFileUpload,
    ImgUpload,
    WangEditor
  },
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      videoUploadUrl: window.g.videoUploadUrl,
      fileUploadUrl: window.g.fileUploadUrl,
      imgUploadUrl: window.g.uploadUrl,
      editForm: {
        id: this.id || null,
        name: null,
        cover: null,
        type: '1',
        file: null,
        desc: null,
        dhtml: null,
        modelIds: [],
        campusIds: [],
        usertypeCodes: [],
        isDownload: 1
      },
      rules: {
        type: [{ required: true, trigger: 'change', message: '请选择资料形式' }],
        name: [{ required: true, trigger: 'change', message: '请输入资料名称' }]
      },
      detail: {}
    }
  },
  computed: mapState({
    typeList: state => state.trainTypeList,
    moduleList: state => state.moduleList,
    campusList: state => state.campusList,
    userTypeList: state => state.userTypeList
  }),
  methods: {
    load(val) {
      this.loading = val
    },
    // 切换资料形式时  重置上传的文件
    resetFile() {
      this.$refs.videoUpload.reset()
      this.$refs.fileUpload.reset()
      this.editForm.file = null
      this.editForm.dhtml = null
    },
    videoUploaded(res) {
      this.editForm.file = res.data
      this.$refs.editForm.validateField('file')
    },
    fileUploaded(res) {
      this.editForm.file = res.data
      this.$refs.editForm.validateField('file')
    },
    imgUploaded(data) {
      if (data && data[0]) {
        this.editForm.cover = data[0].ID
      } else {
        this.editForm.cover = null
      }
    },
    // 文本编辑
    changeHtml(data) {
      this.editForm.dhtml = data
    },
    // 保存
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true
          let param = { ...this.editForm, ...this.editForm.file }
          delete param.file
          saveLearn(param)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                // this.$confirm('您的资料已保存成功！', '保存成功', {
                //   confirmButtonText: '查看资料',
                //   cancelButtonText: this.id ? '返回' : '继续新增',
                //   type: 'success'
                // })
                //   .then(() => {
                //     this.$router.push(`/train/view/${res.data}`)
                //   })
                //   .catch(() => {
                //     if(this.id) {
                //       this.$router.go(-1)
                //     } else {
                //       this.$refs.editForm.resetFields()
                //       this.resetFile()
                //     }
                //   })
                this.$message({
                 showClose: true,
                  type: 'success',
                  message: '保存成功：'
                })
                setTimeout(()=> {
                  this.$router.go(-1)
                }, 500)
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
      this.editForm.file = {
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileUrl: data.fileUrl,
        formatStatus: data.formatStatus
      }
      this.editForm.modelIds = data.models ? data.models.map(i => i.id) : []
      this.editForm.campusIds = data.campuss ? data.campuss.map(i => i.id) : []
      this.editForm.usertypeCodes = data.usertypes ? data.usertypes.map(i => i.code) : []
      if (data.cover) {
        this.$refs.imgUpload.photos = [{ ID: data.cover }]
      }
      if (data.type == '1') {
        this.$refs.videoUpload.file = { name: data.fileName }
      }
      if ((data.type = '2')) {
        this.$refs.fileUpload.file = { name: data.fileName }
      }
      if ((data.type = '3')) {
        this.$refs.editor.editor.txt.html(data.dhtml)
      }
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
</style>