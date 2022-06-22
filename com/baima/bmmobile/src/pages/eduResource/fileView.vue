<template>
  <div style="background:#fff;">
    <van-nav-bar ref="navBar" title="文件预览" :border="false" left-arrow @click-left="goBack" />
    <div class="file-content">
      <h3>{{title}}</h3>
      <!-- pdf预览 -->
      <!-- <pdf :src="filePreviewUrl"></pdf> -->
      <div id="demo"></div>
    </div>
    <div class="form-btns">
      <van-button type="default" @click="goBack">返回</van-button>
      <van-button type="primary" @click="downFile">下载</van-button>
    </div>
  </div>
</template>

<script>
// import pdf from "vue-pdf";
import Pdfh5 from "pdfh5";
export default {
  components: {
    // pdf,
    Pdfh5
  },
  data() {
    return {
      pdf: "",
      title: "",
      filePreviewUrl: ""
    };
  },
  props: {
    resid: String,
    filetype: String // 申请表applyForm   租用协议applyRules
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 下载
    downFile() {
      let url = `${window.g.bm}/spapply/${this.filetype}?id=${this.resid}&type=1`;
      window.open(url, "_blank");
    }
  },
  created() {
    this.$nextTick(() => {
      let url = `${window.g.bm}/spapply/${this.filetype}?id=${this.resid}&type=2`;
      // this.filePreviewUrl = pdf.createLoadingTask(url);
      this.pdf = new Pdfh5("#demo", {
        pdfurl: url
      });
      this.title = this.filetype === "applyForm" ? "申请表" : "租用协议";
    });
  }
};
</script>

<style lang="scss">
@import "pdfh5/css/pdfh5.css";
.file-content {
  width: 100%;
  padding: 30px 20px;
  background: #ffffff;
  text-align: center;
  h3 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  img {
    max-width: 100%;
  }
}
</style>