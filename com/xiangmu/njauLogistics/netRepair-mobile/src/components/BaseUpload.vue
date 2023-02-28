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
      accept="image/*"
    />
  </div>
</template>

<script>
import axios from "axios";
import * as imageConversion from "image-conversion";
import { compressImage } from "@/assets/js/compressImageUtils";
import { Toast } from "vant";
let loadingToast;
export default {
  name: "upload",
  data() {
    return {
      fileList: [],
      conversionFileList: []
    };
  },
  methods: {
    getCookie(name) {
      let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    // 压缩图片
    // conversionFile(file) {
    //   return new Promise((resolve, reject) => {
    //     imageConversion.compressAccurately(file, this.conversionSize).then(res => {
    //         let data = new File([res], file.name, {
    //           type: res.type,
    //           lastModified: Date.now()
    //         });
    //         resolve(data);
    //       });
    //   })
    // },
    // 压缩图片
    conversionFile(file) {
      return new Promise((resolve, reject) => {
        compressImage(file).then(res => {
          let newfile = res.file;
          let data = new File([newfile], file.name, {
            type: newfile.type,
            lastModified: Date.now()
          });
          let now = new Date();
          resolve(data);
        });
      });
    },
    async getFile(e) {
      this.conversionFileList = [];
      this.fileList = e.target.files;
      if (!this.fileList || this.fileList.length === 0) {
        return false;
      }
      let exts = this.exts.split("|");

      for (let i = 0; i < this.fileList.length; i++) {
        let item = this.fileList[i];
        let fileNameArr = item.name.split(".");
        let fileext = fileNameArr[fileNameArr.length - 1];
        if (exts.indexOf(fileext) === -1) {
          // this.$alert("上传文件的格式必须为：" + "\n" + this.exts, "提示", {
          //   type: "error",
          //   callback: (action) => {
          //     return;
          //   },
          // });
          Toast.fail("上传文件的格式不正确！");
          this.$refs.uploaddom.value = null;
          throw "上传了不符合后缀的文件！";
        }
        if (this.size) {
          let limitFileSize = this.size * 1024;
          if (item.size > limitFileSize) {
            // this.$alert("上传文件超过限制大小！", "提示", {
            //   type: "error",
            //   callback: (action) => {
            //     return;
            //   },
            // });
            Toast.fail("上传文件超过限制大小！");
            this.$refs.uploaddom.value = null;
            throw "上传文件超过限制大小！";
          }
        }
        // 是否需要压缩
        if (this.conversion) {
          let file = await this.conversionFile(item);
          this.conversionFileList.push(file);
        }
      }
      let list = this.conversion ? this.conversionFileList : this.fileList
      this.$emit("choose", list);
      let formData = new FormData();
      for (let i = 0; i < list.length; i++) {
        formData.append("file", list[i]);
      }
      loadingToast = Toast.loading({
        message: "上传中...",
        forbidClick: true,
        duration: 0,
      });
      let axiosSettings = {
        url: this.url,
        method: "POST",
        headers: {
          IDSTGC: this.getCookie("IDSTGC") || this.util.IDSTGC ,
          // IDSTGC: this.getCookie("IDSTGC") || "d74a7ddee72a461ebcac31d08c34ab5a",
        },
        data: formData,
      };
      axios(axiosSettings).then((data) => {
        // debugger
        let res = data.data;
        if (res !== null && !res.success) {
          if (res.hasOwnProperty("login") && !res.login) {
            let pathName = window.document.location.pathname;
            let projectName = pathName.substring(
              0,
              pathName.substr(1).indexOf("/") + 1
            );
            let url = projectName + "/";
            let purl = document.location.href; //
            location.href =
              url +
              "rest/Idsclient/reqLogin?reqUrl=" +
              encodeURIComponent(purl);
          } else {
            this.$alert(res.errInf.shortBusInf, "提示", {
              type: "error",
              callback: (action) => {
                return;
              },
            });
            this.$emit("done", res);
            loadingToast.clear();
          }
        } else {
          this.$emit("done", res);
          loadingToast.clear();
        }
        this.$refs.uploaddom.value = null;
      });
    },
    toupload() {
      this.$refs.uploaddom.click();
    },
    Toast(message) {
      let _div = document.createElement("div");
      let divCss = {
        position: "fixed",
        top: "50%",
        width: "100%",
      };
      for (let i in divCss) {
        _div.style[i] = divCss[i];
      }
      let _message = document.createElement("sapn");
      _message.innerText = message;
      let spanCss = {
        "background-color": "rgba(0,0,0,0.5)",
        padding: "15px 15px",
        "border-radius": "5px",
        color: "#FFF",
        "margin-left": "auto",
        "margin-right": "auto",
        "max-width": "300px",
        "font-size": "1rem",
        display: "block",
        "text-align": "center",
      };
      for (let i in spanCss) {
        _message.style[i] = spanCss[i];
      }
      _div.appendChild(_message);
      let _body = document.getElementsByTagName("body")[0];
      _body.appendChild(_div);
      setTimeout(function () {
        _body.removeChild(_div);
      }, 3000);
    },
  },
  watch: {},
  props: {
    url: String,
    exts: String,
    size: [String, Number],
    multiple: Boolean !== false,
    choose: Function,
    filelist: Array,
    beforeupload: Function,
    done: Function,
    autoupload: Boolean !== false,
    // carmera:Boolean !== false
    conversion: {
      type: false,
      default: true
    },
    conversionSize: {
      type: Number,
      default: 400
    }
  },
  mounted() {
    var u = navigator.userAgent;
    if (u.indexOf("iPhone") > -1) {
      this.$refs["uploaddom"].removeAttribute("capture");
    }
  },
  created() {
    this.exts = this.exts ? this.exts : "jpg|png|jpeg|bmp|gif|txt|JPG|JPEG|PNG";
    // this.carmera = this.carmera ? 'image/*' : '';
  },
};
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
