<template>
  <div class="div_flex imgs" :style="{ '--unit': unit }">
    <div v-for="(item, id) in fileList" :key="item.id" class="photo clearfix">
      <!-- <img class="img" :src="viewUrl + item.id" /> -->
      <van-image
        class="img"
        :src="global.viewUrl + item.id"
        fit="cover"
        @click="openImg(id)"
      />
      <!-- <van-icon name="cross" class="badge-icon" /> -->
      <!-- <i class="iconfont icon-delete cross" @click.stop="delList(item)"></i> -->
      <img
        class="cross"
        :src="require('@static/images/cross.png')"
        @click.stop="delList(item)"
      />
    </div>
    <div class="camera clearfix" @click="uploadFile">
      <div>
        <i class="iconfont iconpaizhao"></i>
        <span class="font-s">拍照</span>
      </div>
    </div>
    <upload
      v-show="false"
      ref="upload"
      :url="uploadUrl"
      :multiple="false"
      :exts="global.imgType"
      @choose="chooseFile"
      @done="finish"
      :capture="capture"
    ></upload>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  // name: Map_Card,
  props: {
    unit: String,
    asFinish: Function
  },
  components: {
    upload: () => import("@/components/BaseUpload")
  },
  data() {
    return {
      uploadUrl: window.g.uploadUrl,
      capture: "",
      fileList: []
    };
  },
  methods: {
    openImg(id) {
      ImagePreview({
        images: this.fileList.map(f => this.global.viewUrl + f.id),
        startPosition: id,
        closeable: true
      });
    },
    delList(item) {
      this.fileList = this.fileList.filter(f => f.id !== item.id);
    },
    //点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    chooseFile(f) {
      this.common.genLoading(this);
      console.log(f);
    },
    finish(res) {
      this.common.dealRes(res, () => {
        let data = { ...res.data };
        this.fileList.push(data);
        this.$forceUpdate();
        this.asFinish();
        this.$toast.clear();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$size: var(--unit);
.imgs {
  padding-top: 8px;
  flex-wrap: wrap;
  .photo {
    padding-right: 16px;
    padding-bottom: 16px;
    position: relative;
    .img {
      // object-fit: cover;
      width: $size;
      height: $size;
    }
    .cross {
      font-style: normal;
      position: absolute;
      // border-radius: 50%;
      top: 0;
      right: 0;
      transform: translate(-50%, -50%);
      // background: #ee3f15;
      // color: #fff;
    }
  }
  .camera {
    width: $size;
    height: $size;
    background: #f6f6f6;
    position: relative;
    margin-bottom: 16px;
    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      i {
        color: #bfbfbf;
        display: block;
        // width: 17.5px;
        // height: 15.31px;
      }
      span {
        font-size: 12px;
        line-height: 16px;
        width: 100%;
        color: #bfbfbf;
      }
    }
  }
}
</style>
