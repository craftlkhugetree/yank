<template>
  <div>
    <el-button icon="el-icon-upload2" size="small" @click="clickInput" :loading="loading">上传图片</el-button>
    <div class="upload-imgs" v-for="(item,index) in photos" :key="item.ID">
      <img :src="fileUrl + item.ID" alt />
      <i class="el-icon-close" @click="deletePhoto(index)"></i>
    </div>
    <input
      ref="fileInput"
      type="file"
      style="display:none;"
      accept="image/*"
      :multiple="multiple"
      @change="select"
    />
  </div>
</template>

<script>
import axios from 'axios'
import { compressImage } from '@/assets/js/compressImageUtils'
export default {
  props: {
    multiple: Boolean, // 是否可同时上传多个
    size: Number, // 大小限制 单位为MB
    conversion: Boolean, // 是否压缩
    onlyOne: Boolean,    // 是否仅上传一张图片
    url: String // 文件上传地址
  },
  data() {
    return {
      loading: false,
      fileUrl: window.g.viewUrl,
      fileList: [],
      conversionFileList: [],
      photos: []
    }
  },
  methods: {
    // 重置
    reset() {
      this.loading = false
      this.fileList = []
      this.conversionFileList = []
      this.photos = []
    },
    // 获取cookie
    getCookie(name) {
      let arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      if ((arr = document.cookie.match(reg))) return unescape(arr[2])
      else return null
    },
    // 压缩图片
    conversionFile(file) {
      return new Promise((resolve, reject) => {
        compressImage(file).then(res => {
          let newfile = res.file
          let data = new File([newfile], file.name, {
            type: newfile.type,
            lastModified: Date.now()
          })
          resolve(data)
        })
      })
    },
    // 点击
    clickInput() {
      this.$refs.fileInput.click()
    },
    // 选择图片
    async select(e) {
      this.fileList = e.target.files || []
      if (this.fileList.length == 0) {
        return
      }
      for (let i = 0; i < this.fileList.length; i++) {
        let file = this.fileList[i]
        // 格式校验
        if (['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].indexOf(file.type) == -1) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请上传正确格式的图片！'
          })
          return false
        }
        // 大小校验
        if (this.size) {
          let limitFileSize = this.size * 1024 * 1024
          if (file.size > limitFileSize) {
            this.$message({
              showClose: true,
              type: 'error',
              message: `图片大小不能超过${this.size}MB！`
            })
            return false
          }
        }
        // 是否需要压缩
        if (this.conversion) {
          let file = await this.conversionFile(item)
          this.conversionFileList.push(file)
        }
      }
      let list = this.conversion ? this.conversionFileList : this.fileList
      this.loading = true
      let formData = new FormData()
      for (let i = 0; i < list.length; i++) {
        formData.append('file', list[i])
      }
      let axiosSettings = {
        url: this.url,
        method: 'POST',
        headers: {
          IDSTGC: this.getCookie("IDSTGC")
          // IDSTGC: this.getCookie('IDSTGC') || '96ebb45ab0de4a3c944b0794cffd20fa'
        },
        data: formData
      }
      axios(axiosSettings)
        .then(data => {
          this.loading = false;
          let res = data.data
          if (res.login == false) {
            this.$message({
              showClose: true,
              type: 'error',
              message: '用户未登录，即将跳转登录页面！'
            })
            setTimeout(() => {
              let pathName = window.document.location.pathname
              let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1)
              let url = projectName + '/'
              let purl = document.location.href //
              location.href = url + 'rest/Idsclient/reqLogin?reqUrl=' + encodeURIComponent(purl)
            }, 3000)
          } else if (res.success) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '上传成功！'
            })
            if(this.onlyOne) {
              this.photos = res.data
            } else {
              this.photos = this.photos.concat(res.data)
            }
            this.$emit('done', this.photos)
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '上传失败：' + res.data.msg
            })
          }
          this.$refs.fileInput.value = null
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: 'error',
            message: '上传失败：' + err
          })
        })
    },
    // 删除图片
    deletePhoto(index) {
      this.photos.splice(index,1)
      this.$emit("done", this.photos)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  display: block;
}
.upload-imgs {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 120px;
  background: #f6f6f6;
  text-align: center;
  margin-top: 12px;
  margin-right: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  i {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    color: #ffffff;
    font-size: 10px;
    padding: 2px;
    cursor: pointer;
  }
}
</style>