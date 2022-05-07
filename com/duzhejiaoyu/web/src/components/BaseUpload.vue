<!--使用方法-->
<!--<upload-->
    <!--:url="this.util.getUploadUrl()"--><!--绑定url  必须-->

    <!--exts="png|jpg|bmp|gif"--><!--指定文件后缀  必须-->

    <!--v-on:choose="choosefiel"--><!--选择文件后的回调 -->

    <!--v-on:done="finish"--><!--完成上传后的回调-->

    <!--:carmera:"true"--><!--是否可以支持拍照上传，true是可以支持-->

<!--&gt;-->

<template>
  <div>
    <span class="uploadbtn" @click="toupload">上传文件</span>
    <!--<span>（单张不得超过3M）</span>-->
    <input
      type="file"
      rel="files"
      :multiple="multiple"
      @change="getFile"
      title="上传文件"
      ref="uploaddom"
      class="uploadinput"
    />
  </div>
</template>

<script>
import axios from 'axios'
import { compressImage } from '@/assets/js/compressImageUtils'
export default {
  name: 'upload',
  data() {
    return {
      fileList: [],
      conversionFileList: []
    }
  },
  methods: {
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
    async getFile(e) {
      this.conversionFileList = []
      this.fileList = e.target.files
      if (!this.fileList || this.fileList.length === 0) {
        return false
      }
      let exts = this.exts.split('|')

      for (let i = 0; i < this.fileList.length; i++) {
        let item = this.fileList[i]
        let fileNameArr = item.name.split('.')
        let fileext = fileNameArr[fileNameArr.length - 1].toLowerCase()
        if (exts.indexOf(fileext.toLowerCase()) === -1) {
          this.$alert('上传文件的格式必须为：' + '\n' + this.exts, '提示', {
            type: 'error',
            callback: action => {
              return
            }
          })
          this.$refs.uploaddom.value = null
          throw '上传了不符合后缀的文件！'
        }
        if (this.size) {
          let limitFileSize = this.size * 1024
          if (item.size > limitFileSize) {
            this.$alert('上传文件超过限制大小！', '提示', {
              type: 'error',
              callback: action => {
                return
              }
            })
            this.$refs.uploaddom.value = null
            throw '上传文件超过限制大小！'
          }
        }
        // 是否需要压缩
        if (this.conversion) {
          let file = await this.conversionFile(item)
          this.conversionFileList.push(file)
        }
      }
      let list = this.conversion ? this.conversionFileList : this.fileList
      this.$emit('choose', list)
      let formData = new FormData()
      for (let i = 0; i < list.length; i++) {
        formData.append('file', list[i])
      }
      // 如果有传入额外的参数
      if (this.extraParams) {
        for (let key in this.extraParams) {
          formData.append(key, this.extraParams[key])
        }
      }
      let axiosSettings = {
        url: this.url,
        method: 'POST',
        headers: {
          IDSTGC: this.getCookie("IDSTGC")
          // IDSTGC: this.getCookie('IDSTGC') || 'a9d9437ce2664ac4a76905db0484b328'
        },
        data: formData
      }
      axios(axiosSettings)
        .then(data => {
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
          } else {
            this.$emit('done', res)
          }
          this.$refs.uploaddom.value = null
        })
        .catch(err => {
          this.$message({
            showClose: true,
            type: 'error',
            message: '上传失败：' + err
          })
        })
    },
    toupload() {
      this.$refs.uploaddom.click()
    }
  },
  watch: {},
  props: {
    url: String,
    exts: String,
    size: [String, Number],
    multiple: Boolean !== false,
    choose: Function,
    beforeupload: Function,
    done: Function,
    autoupload: Boolean !== false,
    extraParams: Object,
    // carmera:Boolean !== false
    conversion: {
      type: false,
      default: false
    },
    conversionSize: {
      type: Number,
      default: 400
    }
  },
  created() {
    this.exts = this.exts ? this.exts : 'jpg|png|jpeg|bmp|gif|txt|doc|xlsx|xls|ppt|rar|zip'
    // this.carmera = this.carmera ? 'image/*' : '';
  }
}
</script>

<style scoped>
.uploadbtn {
  width: 80px;
  height: 16px;
  background: rgba(0, 106, 229, 1);
  border-radius: 5px;
  color: #fff;
  padding: 4px 10px;
  cursor: pointer;
}
.uploadinput {
  display: none;
}
</style>
