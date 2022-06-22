<template>
  <div style="background:#fff;">
    <van-nav-bar ref="navBar" title="文件预览" :border="false" left-arrow @click-left="goBack" />
    <div class="file-content">
      <h3>{{title}}</h3>
      <!-- 图片预览 -->
      <img v-if="fileTypes.includes(ftype)" :src="filePreviewUrl" />
      <!-- pdf预览 -->
      <!-- <pdf v-else :src="filePreviewUrl"></pdf> -->
      <div v-else id="demo"></div>
    </div>
    <div class="form-btns">
      <van-button type="default" @click="goBack">返回</van-button>
      <van-button type="primary" @click="common.downloadFile(fileid)">下载</van-button>
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
      filePreviewUrl: "",
      fileTypes: ["jpg", "png", "JPG", "PNG", "jpeg", "JPEG", "gif", "GIF"]
    };
  },
  props: {
    fileid: String,
    ftype: String,
    title: String
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    this.$nextTick(() => {
      // 如果不是图片、pdf，则获取pdf预览地址
      let types = [...this.fileTypes, "pdf", "PDF"];
      if (!types.includes(this.ftype)) {
        this.$toast.loading({
          message: "正在生成预览文件，请耐心等待...",
          forbidClick: true,
          duration: 0
        });
        this.common
          .getPreviewUrl(this.fileid)
          .then(res => {
            this.$toast.clear();
            // this.filePreviewUrl = pdf.createLoadingTask(res);
            this.pdf = new Pdfh5("#demo", {
              pdfurl: res
            });
          })
          .catch(err => {
            this.$toast.clear();
            this.$toast.fail("此文件暂不支持预览，请下载后查看...");
          });
      } else {
        this.filePreviewUrl = this.fileUrl + this.fileid;
        if (["pdf", "PDF"].includes(this.ftype)) {
          this.pdf = new Pdfh5("#demo", {
            pdfurl: this.filePreviewUrl
          });
        }
      }
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