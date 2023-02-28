<template>
  <div class="qrcode">
    <div class="code fullscreen" ref="wrapper">
      <!-- decode是扫描结果的函数，torch用于是否需要打开手电筒，init用于检查该设备是否能够调用摄像头的权限，camera可用于打开前面或者后面摄像头  -->
      <qrcode-drop-zone @decode="onDecode">
        <qrcode-stream
          @decode="onDecode"
          :torch="torchActive"
          @init="onInit"
          :camera="camera"
        />
      </qrcode-drop-zone>
      <!-- <div class="code-button">
        <button @click="switchCamera">相机反转</button>
        <button @click="ClickFlash">打开手电筒</button>
        <button @click="turnCameraOff">关闭相机</button>
      </div> -->
    </div>
  </div>
</template>

<script>
// 引用vue-qrcode-reader插件
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";

export default {
  name: "Approve",
  props: {
    camera: {
      type: String,
      default: "rear"
    },
    torchActive: {
      type: Boolean,
      default: false
    },
    qrcode: {
      type: Boolean,
      default: false
    },
    noStreamApiSupport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    };
  },
  created() {},

  components: {
    // 注册组件
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  methods: {
    // 扫码结果回调
    onDecode(result) {
      this.$emit("onDecode", result);
    },
    // 相机反转
    switchCamera() {
      this.$emit("switchCamera");
    },
    // 关闭相机？？？？？？
    turnCameraOff() {
      this.$emit("turnCameraOff");
      // this.exitFullscreen()
    },
    // 打开手电筒
    ClickFlash() {
      this.$emit("ClickFlash");
    },
    // 检查是否调用摄像头
    async onInit(promise) {
      this.loading = true;
      this.$toast.loading({
        message: "打开中",
        forbidClick: true,
        overlay: true,
        duration: 0
      });
      try {
        await this.$emit("onInit", promise);
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
        this.$toast.clear();
        // this.$nextTick(() => this.requestFullscreen());
      }
    },
    requestFullscreen() {
      const elem = this.$refs.wrapper;

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },

    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.fullscreen {
  position: fixed;
  z-index: 1000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  height: 100vh;
}
</style>
