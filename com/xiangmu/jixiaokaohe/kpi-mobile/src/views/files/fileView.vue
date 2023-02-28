<template>
  <div class="file">
    <van-nav-bar ref="navBar" title="文件预览" :border="false" left-arrow @click-left="$router.goBack()" />
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
      <van-button type="info" @click="common.downloadFile(fileid)">下载</van-button>
    </div>
  </div>
</template>

<script>
import Pdfh5 from "pdfh5";
import "pdfh5/css/pdfh5.css";
export default {
  components: {
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
  methods: {
    // 返回
    goBack() {
      this.$router.goBack();
    }
  },
  created() {
    this.$nextTick(() => {
      // 如果不是图片、pdf，则获取pdf预览地址
      let types = [...this.fileTypes, "pdf", "PDF"];
      if (!types.includes(this.ftype)) {
        this.$toast.loading({
          message: "正在生成预览文件，请耐心等待...",
          forbidClick: true
        });
        this.common
          .getPreviewUrl(this.fileid)
          .then(res => {
            this.$toast.clear();
            this.pdf = new Pdfh5("#demo", {
              pdfurl: res
            });
          })
          .catch(err => {
            this.$toast.clear();
            this.$toast.fail("此文件不支持预览，请下载后查看...");
          });
      } else {
        this.filePreviewUrl = window.g.viewUrl + this.fileid;
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

<style scoped lang="scss">
.file {
  width: 100%;
  min-height: 100%;
  background: #ffffff;
}
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
.form-btns {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;

  .van-button {
    width: 50%;
    float: left;
    border-left: none;
  }

  &.more-btns {
    display: flex;
  }
}
</style>