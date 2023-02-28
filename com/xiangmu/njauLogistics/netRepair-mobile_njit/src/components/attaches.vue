<template>
  <div>
    <div class="uploadimgs">
      <div class="attachimgs" v-for="(item, index) in attaches" :key="item">
        <img :src="$store.state.fileUrl + item" alt="" @click="showimgs" />
        <van-icon class="deletimg" name="clear" @click="deleteImg(index)" />
      </div>
      <div class="attachimgs" @click="toUpload" v-show="attaches.length < 3">
        <img src="../../static/images/upload.png" alt="" />
      </div>
    </div>
    <upload
      ref="upload"
      v-show="false"
      :multiple="false"
      :size="20 * 1024"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @done="uploaded"
      :url="$store.state.uploadUrl"
    ></upload>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import upload from "./BaseUpload";
export default {
  data() {
    return {};
  },
  props: {
    attaches: Array,
    default: function () {
      return [];
    },
  },
  components: { upload },

  methods: {
    showimgs() {
      let imgs = _.map(this.attaches, (item) => {
        return this.$store.state.fileUrl + item;
      });
      ImagePreview(imgs);
    },
    //上传完成回调
    uploaded(res) {
      if (res.success && this.attaches.length < 3) {
        this.attaches.push(res.data[0].ID);
      }
    },
    deleteImg(index) {
      this.attaches.splice(index, 1);
    },
    toUpload() {
      this.$refs["upload"].toupload();
    },
    getAttaches() {
      return this.attaches;
    },
  },
};
</script>
<style lang='scss' scoped>
.uploadimgs {
  margin-top: 23px;
  margin-left: 16px;
  .attachimgs {
    width: 80px;
    height: 80px;
    display: inline-block;
    margin-right: 16px;
    position: relative;
    background-color: rgba(246, 246, 246, 1);
    .deletimg {
      position: absolute;
      top: -7px;
      right: -8px;
      // background-color: red;
      width: 16px;
      height: 16px;
      text-align: center;
      color: red;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>