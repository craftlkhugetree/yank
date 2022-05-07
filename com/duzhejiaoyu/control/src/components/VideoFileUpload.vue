<template>
  <div>
    <el-button icon="el-icon-upload2" size="small" @click="clickInput" :loading="loading">上传文件</el-button>
    <span class="file">{{file.name}}</span>
    <span v-if="loading" class="percent">{{percent}}%</span>
    <i v-if="result == '1'" class="el-icon-success"></i>
    <i v-if="result == '0'" class="el-icon-error"></i>
    <input ref="fileInput" type="file" style="display:none;" :accept="accept" @change="select" />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    size: Number, // 大小限制 单位为MB
    url: String, // 文件上传地址
    type: String // video, file
  },
  data() {
    return {
      loading: false,
      file: {},
      percent: 0,
      result: null,
      accept: this.type == 'video' ? 'video/*' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
    }
  },
  methods: {
    // 重置
    reset() {
      this.loading = false
      this.file = {}
      this.percent = 0
      this.result = null
    },
    // 获取cookie
    getCookie(name) {
      let arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      if ((arr = document.cookie.match(reg))) return unescape(arr[2])
      else return null
    },
    // 点击
    clickInput() {
      this.$refs.fileInput.click()
    },
    // 选择文件
    select(e) {
      const file = e.target.files[0]
      // 视频格式校验
      if (this.type == 'video' && ['video/mpeg', 'video/mpg', 'video/dat', 'video/mp4', 'video/mkv'].indexOf(file.type) == -1) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请上传正确的视频格式文件！'
        })
        return false
      }
      // 文档格式校验
      if (this.type == 'file') {
        let fileNameArr = file.name.split('.')
        let fileext = fileNameArr[fileNameArr.length - 1].toLowerCase()
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].indexOf(fileext) == -1) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请上传正确的格式文件！'
          })
          return false
        }
      }
      // 大小校验
      if (this.size) {
        let limitFileSize = this.size * 1024 * 1024
        if (file.size > limitFileSize) {
          this.$message({
            showClose: true,
            type: 'error',
            message: `视频大小不能超过${this.size}MB！`
          })
          return false
        }
      }
      // 上传视频
      this.file = file
      this.loading = true
      const formData = new FormData()
      formData.append('file', file)
      let axiosSettings = {
        url: this.url,
        method: 'POST',
        headers: {
          IDSTGC: this.getCookie("IDSTGC")
          // IDSTGC: this.getCookie('IDSTGC') || '705316b9a658494f90b08c76b8b09cc2'
        },
        data: formData,
        // 进度
        onUploadProgress: e => {
          if (e.lengthComputable) {
            this.percent = ((e.loaded / e.total) * 100).toFixed(0)
          }
        }
      }
      axios(axiosSettings)
        .then(data => {
          this.loading = false
          let res = data.data
          if (res.code == '000000') {
            this.result = '1'
            this.$message({
              showClose: true,
              type: 'success',
              message: '上传成功！'
            })
            this.$emit('done', res)
          } else {
            this.result = '0'
            this.$message({
              showClose: true,
              type: 'error',
              message: '上传失败：' + res.msg
            })
          }
          this.$refs.fileInput.value = null
        })
        .catch(err => {
          this.result = '0'
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '上传失败：' + err
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.file,
.percent {
  margin-left: 20px;
  color: #999;
}
i {
  margin-left: 20px;
}
i.el-icon-success {
  color: #52c41a;
}
i.el-icon-error {
  color: #ff4d4f;
}
</style>