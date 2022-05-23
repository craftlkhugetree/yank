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
    <div class="uploadbtn" @click="toupload">上传文件</div>
    <!-- <input type="file" rel="files" :accept="carmeraStr" :capture="captureStr" :multiple="multiple" @change="getFile" title="上传文件" ref="uploaddom" class="uploadinput"> -->
    <input
      type="file"
      rel="files"
      :accept="this.carmera"
      :multiple="multiple"
      @change="getFile"
      title="上传文件"
      ref="uploaddom"
      class="uploadinput"
    />
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "upload",
  data() {
    return {
      fileList: [],
      carmeraStr: this.carmera ? "image/*" : ""
      // captureStr:this.carmera ? 'camera' : ''
    };
  },
  methods: {
    getCookie(name) {
      let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    getFile(e) {
      this.fileList = e.target.files;
      if (!this.fileList.length) {
        return false;
      }
      let exts = this.exts.split("|");
      for (let i = 0; i < this.fileList.length; i++) {
        let item = this.fileList[i];
        let fileNameArr = item.name.split(".");
        let fileext = fileNameArr[fileNameArr.length - 1];
        if (exts.indexOf(fileext) === -1) {
          this.Toast("上传了不符合后缀的文件！");
          throw "上传了不符合后缀的文件！";
        }
        if (this.size) {
          let limitFileSize = this.size * 1024;
          if (item.size > limitFileSize) {
            this.Toast("上传文件超过限制大小！");
            throw "上传文件超过限制大小！";
          }
        }
      }
      this.$emit("choose", this.fileList);
      let formData = new FormData();
      for (let i = 0; i < this.fileList.length; i++) {
        formData.append("file", this.fileList[i]);
      }
      let axiosSettings = {
        url: this.url,
        method: "POST",
        headers: {
          // "IDSTGC" : this.getCookie('IDSTGC'),
          IDSTGC: this.getCookie("IDSTGC") || "c11d376b4aed4581a3383af90061049d"
        },
        data: formData
      };
      axios(axiosSettings).then(data => {
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
            this.Toast(res.message);
          }
        } else {
          this.$emit("done", res);
        }
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
        width: "100%"
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
        "text-align": "center"
      };
      for (let i in spanCss) {
        _message.style[i] = spanCss[i];
      }
      _div.appendChild(_message);
      let _body = document.getElementsByTagName("body")[0];
      _body.appendChild(_div);
      setTimeout(function() {
        _body.removeChild(_div);
      }, 3000);
    }
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
    carmera: {
      type: String,
      default: "image/*"
    }
    // Boolean !== false
  },
  created() {
    this.exts = this.exts ? this.exts : "jpg|png|bmp|gif|txt";
    // this.carmeraStr = ;
  }
};
</script>

<style scoped>
.uploadbtn {
  width: 125px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  background-color: #42b983;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 5px;
}
.uploadinput {
  display: none;
}
</style>
