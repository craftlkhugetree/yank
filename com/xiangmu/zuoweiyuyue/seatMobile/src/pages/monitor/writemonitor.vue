<template>
  <div class="writemonitor_content">
    <div class="monitor_select" @click="selectRoom">
      <i></i>
      <input type="text" v-model="roomname" placeholder="请选择教室" readonly />
      <span></span>
    </div>
    <div class="monitor_img clearfix">
      <div class="img" v-for="(v,i) in files" :key="i">
        <img preview="1" :src="fileUrl+'/'+v.ID" width="100%" height="100%" alt />
        <i @click="delImg(i)"></i>
      </div>
      <div class="add" @click="addupload">
        <div></div>
        <upload
          class="upload"
          :multiple="false"
          ref="upload"
          exts="png|jpg|bmp|gif|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF"
          v-on:choose="choosefiel"
          v-on:done="finish"
          :url="uploadUrl"
        ></upload>
      </div>
    </div>
    <div class="line"></div>
    <van-field
      v-model="message"
      rows="5"
      autosize
      type="textarea"
      maxlength="100"
      placeholder="请填写描述～"
      show-word-limit
      @change.native="changemessage"
    />
    <div class="bottom" v-if="!submitBtn">提 交</div>
    <div class="bottom bottomact" v-else @click="submitMonitor">提 交</div>
    <!-- 举报成功弹窗 -->
    <van-overlay :show="monitorSucc" v-if="monitorSucc">
      <successMeng :ismonitor="ismonitor"></successMeng>
    </van-overlay>
    <!-- 上传图片的蒙层 -->
    <van-overlay :show="showpic" @click="showpic = false">
      <div class="picwrapper" @click.stop>
        <div class="picblock">图片上传中...</div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import upload from "@/components/upload";
import successMeng from "@/components/successMeng";
export default {
  props: {
    roomname: String,
    roomid: String,
    seatname: String,
    seatid: String,
    type: String,
    orderid: String
  },
  components: {
    upload,
    successMeng
  },
  data() {
    return {
      message: "",
      submitBtn: false,
      uploadUrl: window.base.uploadUrl,
      fileUrl: window.base.fileUrl,
      files: [],
      monitorSucc: false,
      ismonitor: true,
      showpic: false
    };
  },
  methods: {
    addupload() {
      this.$refs.upload.toupload();
    },
    choosefiel(file) {
      this.showpic = true;
      console.log("上传后回调");
    },
    finish(res) {
      console.log("结束后", res);
      this.showpic = false;
      res.data.forEach(element => {
        this.files.push(element);
      });
      this.$previewRefresh();
      if (this.message && this.files.length > 0 && this.roomname) {
        this.submitBtn = true;
      } else {
        this.submitBtn = false;
      }
    },
    delImg(index) {
      this.files.splice(index, 1);
      if (this.message && this.files.length > 0 && this.roomname) {
        this.submitBtn = true;
      } else {
        this.submitBtn = false;
      }
      this.$previewRefresh();
    },
    selectRoom() {
      window.sessionStorage.setItem("monotorText", this.message);
      window.sessionStorage.setItem("monotorFiles", JSON.stringify(this.files));
      this.$router.push({
        path: "selectmonitor",
        query: {
          roomname: this.roomname,
          roomid: this.roomid,
          seatname: this.seatname,
          seatid: this.seatid,
          orderid: this.orderid,
          type: this.type
        }
      });
    },
    gohome() {
      this.monitorSucc = false;
      this.$router.push("/");
    },
    submitMonitor() {
      var idString = "";
      this.files.forEach(e => {
        idString += e.ID + ",";
      });
      // console.log(this.files,idString.substring(0,idString.length-1))
      this.Dialog.confirm({
        message: "确认提交？"
      }).then(() => {
        this.util
          .postAjax({
            code: this.code.base,
            url: this.code.reportsave,
            data: {
              isneed: this.type,
              note: this.message,
              orderid: this.orderid,
              photo: idString.substring(0, idString.length - 1)
            },
            isRep: true
          })
          .then(res => {
            if (res.success) {
              this.monitorSucc = true;
            }
          });
      });
      // this.monitorSucc = true;
    },
    changemessage() {
      if (this.message && this.files.length > 0 && this.roomname) {
        this.submitBtn = true;
      } else {
        this.submitBtn = false;
      }
    }
  },
  created() {
    if (window.sessionStorage.getItem("monotorText")) {
      this.message = window.sessionStorage.getItem("monotorText");
    }
    if (window.sessionStorage.getItem("monotorFiles")) {
      this.files = JSON.parse(window.sessionStorage.getItem("monotorFiles"));
    }
    if (this.message && this.files.length > 0 && this.roomname) {
      this.submitBtn = true;
    } else {
      this.submitBtn = false;
    }
  }
};
</script>
<style scoped>
.picwrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.picblock {
  width: 100%;
  height: 80px;
  line-height: 80px;
  color: #fff;
  font-size: 28px;
  text-align: center;
}
.writemonitor_content {
  width: 100%;
  background: #fafaf9;
  padding: 24px 0;
  box-sizing: border-box;
}
.monitor_select {
  height: 104px;
  background: #ffffff;
  padding: 0 30px;
  box-sizing: border-box;
  line-height: 104px;
}
.monitor_select > i {
  display: inline-block;
  width: 27px;
  height: 28px;
  background: url(../../../static/img/selectroom.png) no-repeat center center;
  background-size: cover;
  float: left;
  margin-top: 36px;
  margin-right: 10px;
}
.monitor_select .van-cell {
  width: calc(100% - 1.04rem);
  float: left;
  padding: 0;
  border: none;
}
.monitor_select input::-webkit-input-placeholder {
  text-indent: 10px;
  border: none;
  font-size: 28px;
}
.monitor_select > span {
  display: inline-block;
  width: 14px;
  height: 26px;
  background: url(../../../static/img/rightarr_b.png) no-repeat center center;
  background-size: cover;
  float: right;
  margin-top: 36px;
}
.monitor_select > input {
  width: calc(100% - 1.03rem);
  border: none;
  font-size: 28px;
  font-weight: 500;
  color: #333333;
  text-indent: 10px;
}
.monitor_img {
  width: 100%;
  margin-top: 24px;
  background: #fff;
  padding: 30px;
  padding-bottom: 0;
  box-sizing: border-box;
}
.monitor_img > div {
  /* width: calc(calc(100% -88px) / 3); */
  margin-right: 40px;
  margin-bottom: 40px;
  float: left;
}
.monitor_img > div::before {
  content: "";
  padding-top: 100%;
  display: block;
}
.monitor_img > div:nth-of-type(3) {
  margin-right: 0;
}
.monitor_img > div.img {
  background: #fff;
  width: 200px;
  height: 200px;
  border-radius: 15px;
  position: relative;
}
.monitor_img > div.img > img {
  position: absolute;
  top: 0;
  left: 0;
}
.monitor_img > div.img > i {
  display: inline-block;
  width: 36px;
  height: 36px;
  background: url(../../../static/img/close.png) no-repeat center center;
  background-size: cover;
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
}
.monitor_img > div.add {
  width: 200px;
  height: 200px;
  border-radius: 15px;
  border: 1px solid rgba(204, 204, 204, 0.5);
  position: relative;
}
.monitor_img > div.add > .upload {
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;
}
.monitor_img > div.add > div {
  width: 39px;
  height: 39px;
  background: url(../../../static/img/add.png) no-repeat center center;
  background-size: cover;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.writemonitor_content > .line {
  width: calc(100% - 60px);
  height: 1pt;
  background: #eee;
  margin: 0 auto;
}
.writemonitor_content > .bottom {
  width: calc(100% - 60px);
  height: 84px;
  background: #dddddd;
  border-radius: 42px;
  position: fixed;
  bottom: 40px;
  left: 30px;
  font-size: 36px;
  font-weight: 400;
  color: #999999;
  line-height: 84px;
  text-align: center;
}
.writemonitor_content > .bottomact {
  background: #ffa033;
  color: #ffffff;
}
</style>