<template>
  <div>
    <!-- <div class="img" :style="isVideo(img.fileType) ? { background: '#000' } : ''"> -->
    <div class="img">
      <div v-if="isVideo(img.fileType)" class="imgPos" @click="openImg(img)">
        <img class="video_class" :src="img.cover" alt="" :style="{ height }" />
        <img class="videoplay_class" :src="require('@/assets/img/play.jpeg')" alt="" />
        <div class="videoplay_bot">
          <span class="fname ellipsis">{{ img.name }}</span>
          <span class="fleft ellipsis">{{ img.duration }}</span>
        </div>
      </div>
      <div v-else-if="isAudit(img.fileType)" class="imgPos" @click="openImg(img)">
        <el-image
          class="video_class"
          :style="{ height }"
          :src="''"
          :preview-src-list="['']"
          fit="cover"
        ></el-image>
        <img class="videoplay_class" :src="require('@/assets/img/play.jpeg')" alt="" />
      </div>
      <el-image
        v-else
        class="video_class"
        :style="{ height }"
        :src="img.viewUrl"
        :preview-src-list="[img.viewUrl]"
        fit="cover"
      ></el-image>
    </div>
    <el-dialog
      v-if="dVisible"
      :visible.sync="dVisible"
      :close-on-click-modal="true"
      :modal-append-to-body="true"
      :modal="true"
      :show-close="true"
      :title="vTitle"
      width="100%"
      :before-close="close"
    >
      <div class="dialog">
        <video
          v-if="isVideo(img.fileType)"
          :src="vSrc"
          controls
          autoplay
          controlslist="nodownload nofullscreen"
        ></video>
        <audio
          v-if="isAudit(img.fileType)"
          :src="vSrc"
          controls
          autoplay
          controlslist="nodownload nofullscreen"
        ></audio>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mvType, auditType } from '@/assets/js/options';
export default {
  name: 'Cover',
  props: {
    img: Object,
    height: {
      type: String,
      default: '250rem',
    },
  },
  data() {
    return {
      dVisible: false,
      vSrc: '',
      vTitle: '',
    };
  },
  watch: {},
  computed: {
    genSize() {
      return function(obj) {
        if (
          obj &&
          Object.prototype.hasOwnProperty.call(obj, 'w') &&
          Object.prototype.hasOwnProperty.call(obj, 'h')
        ) {
          console.log(obj);
          if (obj.w / obj.h < 532 / 256) {
            return { height: '100%', width: 'auto' };
          }
        }
      };
    },
    isVideo() {
      return function(type) {
        return mvType.indexOf(type) > -1;
      };
    },
    isAudit() {
      return function(type) {
        return auditType.indexOf(type) > -1;
      };
    },
  },
  methods: {
    click() {
      this.$emit('jump', this.route, this.data.name);
    },
    openImg(obj) {
      this.vSrc = obj.viewUrl;
      this.vTitle = obj.fileName;
      this.dVisible = true;
      // if (this.isVideo(obj.fileType)) {
      // } else {
      //   window.open(obj.viewUrl, obj.fileName);
      // }
    },
    close() {
      this.vSrc = '';
      this.vTitle = '';
      this.dVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.img {
  // margin-bottom: 15rem;
  .imgPos {
    cursor: pointer;
    position: relative;
  }
  .video_class {
    width: 100%;
    // height: 250rem;
    // object-fit: contain;
    object-fit: cover;
  }
  .videoplay_class {
    width: 50rem;
    height: 50rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 11;
    opacity: 0.8;
  }
  .videoplay_bot {
    width: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 16rem;
    z-index: 12;
    opacity: 0.9;
    span {
      @include fz(12rem, #fff);
      padding: 0 16rem;
      height: $arq * 14rem;
      line-height: $arq * 14rem;
    }
    .fleft {
      margin-left: auto;
      width: $arq * 80rem;
      text-align: right;
    }
    .fname {
      text-align: left;
      width: 50%;
    }
  }
}
.dialog {
  background: #000;
  width: 100%;
  display: flex;
  justify-content: space-around;
  video {
    width: 100%;
    max-height: 100vh;
  }
}
/deep/ .el-dialog__body {
  padding: 0;
}
/deep/ .el-dialog__header {
  display: none;
}
</style>
