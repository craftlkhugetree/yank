<!-- <template>
    <div>
        <upload :url="uploadUrl" ref="child" exts="png|PNG|jpg|JPG|gif|GIF" @done="finishImg" @choose="choosefile"></upload>
    </div>
</template>

<script>
import upload from '../components/BaseUpload3'
export default {
    components:{
        upload
    },
    data(){
        return{
            uploadUrl:""
        }
    },

    methods: {
        //获取上传的url
        getUploadFile(){
            this.util.getUrlByCode(this.global.code,"/upload/add").then(res => {
                this.uploadUrl = res;
            })
        },
        
        
        choosefile(res){
            console.log(res);
        },
      

        finishImg(res){
           
            console.log(res);
           
            this.$forceUpdate();
            
        },
    },

    created() {
        // this.getUploadFile();
    },
}
</script> -->



<template>
  <div class="common-content">
    <label
      class="btn btn-orange"
      for="uploads"
      style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px;"
    >选择图片</label>

    <input
      type="file"
      id="uploads"
      :value="imgFile"
      style="position:absolute; clip:rect(0 0 0 0);"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      @change="uploadImg($event, 1)"
    />

    <img :src="domain+photourl" style="width:150px;height:150px;object-fit:cover" />
    <!--     <input type="button" class="oper" style="height:30px;width:33px;font-size:20px;margin:3px 5px;" value="+" title="放大" @click="changeScale(1)">
    <input type="button" class="oper" style="height:30px;width:33px;font-size:20px;margin:3px 5px;" value="-" title="缩小" @click="changeScale(-1)">
    <input type="button" class="oper" style="height:30px;width:33px;font-size:20px;margin:3px 5px;" value="↺" title="左旋转" @click="rotateLeft">
    <input type="button" class="oper" style="height:30px;width:33px;font-size:20px;margin:3px 5px;" value="↻" title="右旋转" @click="rotateRight">
    <input type="button" class="oper" style="height:30px;width:33px;font-size:20px;margin:3px 5px;" value="↓" title="下载" @click="down('blob')">-->

    <div
      v-show="isClip"
      class="info-item"
      style="position:fixed;left:0;bottom:0;background:rgba(0,0,0,0.8);width:100%;height:50%;z-index:10000;text-align:center;padding:50px;box-sizing:border-box"
    >
      <!-- <input type="button" class="btn btn-blue" value="上传头像" @click="finish('blob')">  -->
      <el-button type="primary" size="small" @click="finish('blob')">保存图片</el-button>
      <div style="margin-top:30px">
        <div class="cropper-content">
          <div class="cropper" style="display:inline-block;margin-right:50px">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="true"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixedBox="option.fixedBox"
              @realTime="realTime"
              @imgLoad="imgLoad"
            ></vueCropper>
          </div>

          <div style="display:inline-block;">
            <div
              class="show-preview"
              :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}"
            >
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--上传组件-->
    <!-- <baseUpload :url="uploadUrl" ref="child" exts="png|PNG|jpg|JPG|gif|GIF" @done="finishImg"></baseUpload> -->
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
// import baseUpload from "../components/BaseUpload3"
import axios from "axios";

export default {
  name: "HelloWorld",
  // components:{baseUpload},

  data() {
    return {
      isClip: false,

      headImg: "",
      uploadUrl: "http://app.dev.angke.com.cn/lres_nh/rest/upload/add",
      domain: this.global.domain, //域名
      photourl: "", //剪切图片上传

      crap: false,
      previews: {},
      option: {
        img: "",
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 150,

        autoCropHeight: 150,

        fixedBox: true
      },

      fileName: "", //本机文件地址
      downImg: "#",

      imgFile: "",

      uploadImgRelaPath: "" //上传后的图片的地址（不带服务器域名）
    };
  },

  components: {
    VueCropper
  },

  methods: {
    getCookie(name) {
      let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },

    // 图片上传完成后
    finishImg(res) {
      console.log("上传后回调", res);

      this.$forceUpdate();
    }, //放大/缩小

    changeScale(num) {
      console.log("changeScale");
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    }, //坐旋转

    rotateLeft() {
      console.log("rotateLeft");
      this.$refs.cropper.rotateLeft();
    }, //右旋转

    rotateRight() {
      console.log("rotateRight");
      this.$refs.cropper.rotateRight();
    }, //上传图片（点击上传按钮）

    finish(type) {
      console.log("finish");
      let _this = this;
      let formData = new FormData(); // 输出
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          let img = window.URL.createObjectURL(data);
          this.model = true;
          this.modelSrc = img;
          formData.append("file", data, this.fileName);
          console.log(formData); // 这里上传post
          let axiosSettings = {
            url: this.uploadUrl,
            method: "POST",
            headers: {
              IDSTGC:
                this.getCookie("IDSTGC") || "19a5798fea0e4c298f4797c417c018ff"
              // "IDSTGC" : this.getCookie('IDSTGC'),
            },
            data: formData
          };
          axios(axiosSettings)
            .then(data => {
              // debugger
              // loading.close();
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
                  this.$message("上传失败" + res.message);
                }
              } else {
                //   this.$emit('done', res);

                this.photourl = res.item.fileUrl;
                this.$message("上传成功");
                this.$forceUpdate();
              }
            })
            .catch(err => {
              let error = err + "";
              console.log("err", typeof error);

              // this.$emit("error")

              loading.close();
              this.$message({
                type: "error",
                message: "网络异常,上传失败"
              });
            });
          // e.target.value = '';
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true;

          this.modelSrc = data;
        });
      }

      console.log(this.modelSrc);
    }, // 实时预览函数

    realTime(data) {
      console.log("realTime");

      this.previews = data;
    }, //下载图片

    down(type) {
      console.log("down");

      var aLink = document.createElement("a");

      aLink.download = "author-img";

      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          this.downImg = window.URL.createObjectURL(data);

          aLink.href = window.URL.createObjectURL(data);

          aLink.click();
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.downImg = data;

          aLink.href = data;

          aLink.click();
        });
      }
    }, //选择本地图片

    uploadImg(e, num) {
      this.isClip = true;

      console.log("uploadImg");

      var _this = this; //上传图片

      var file = e.target.files[0];

      _this.fileName = file.name;

      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");

        return false;
      }

      var reader = new FileReader();

      reader.onload = e => {
        let data;

        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要

          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }

        if (num === 1) {
          _this.option.img = data;
        } else if (num === 2) {
          _this.example2.img = data;
        }
      }; // 转化为base64 // reader.readAsDataURL(file) // 转化为blob

      reader.readAsArrayBuffer(file);
    },

    imgLoad(msg) {
      console.log("imgLoad");

      console.log(msg);
    }
  }
};
</script>

<style scoped>
.show-preview {
  flex: 1;
   -webkit-flex: 1;
   display: flex;
   display: -webkit-flex;
   justify-content: center;
   -webkit-justify-content: center;
   background: blue;
}

.preview {
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #cccccc;
  background: #cccccc;
}

.info {
  width: 720px;
  margin: 0 auto;
}

.oper-dv {
  height: 20px;
  text-align: right;
  margin-right: 100px;
}

.oper-dv a {
  font-weight: 500;
}

.oper-dv a:last-child {
  margin-left: 30px;
}

.info-item {
  margin-top: 15px;
}

.info-item label {
  display: inline-block;
  width: 100px;
  text-align: right;
}

.sel-img-dv {
  position: relative;
}

.sel-file {
  position: absolute;
   width: 90px;
   height: 30px;
   opacity: 0;
   cursor: pointer;
   z-index: 2;
}

.sel-btn {
  position: absolute;
  cursor: pointer;
  z-index: 1;
}

.cropper-content {
}

.cropper {
  width: 260px;

  height: 260px;
}
</style>
