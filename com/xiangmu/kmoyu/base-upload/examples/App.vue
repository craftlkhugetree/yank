<template>
  <div id="app">
    <button @click="upload">上传文件</button>
    <base-upload
      ref="upload"
      :url="uploadUrl"
      failed_redirectToUrl="www.baidu.com"
      :multiple="false"
      :exts="imgType"
      :axiosSettings="axiosSettings"
      @choose="choosefile"
      @done="finish"
      :genUploadPercent="changeProgress"
    ></base-upload>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      axiosSettings: {
        headers: {
          IDSTGC: 'cd8ec66023f6437fb2fa9d4dd8b69694',
        },
      },
      uploadUrl: 'http://app.dev.angke.com.cn/college-show/rest/attach/upload',
      uploadPercent: 0,
      fileList: [],
      fileName: '',
      imgType: 'jpg|png|jpeg|bmp|gif',
    };
  },
  methods: {
    upload() {
      // this.$refs.upload.$refs.uploaddom.click();
      this.$refs.upload.click_upload();
    },
    choosefile(f) {
      this.fileName = (f && f[0] && f[0].name) || '';
    },
    finish(res) {
      if (res && (res.code === '000000' || res.success === true)) {
        let data = { ...res.data };
        this.fileList.push(data);
        this.$forceUpdate();
      }
    },
    changeProgress(val) {
      this.uploadPercent = val;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
