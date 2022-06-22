<template>
  <div id="app">
    <router-view />
    <!-- 消息弹窗 -->
    <van-popup v-model="noticeDialogShow" class="notice-dialog" :close-on-click-overlay="false">
      <!-- 消息内容 -->
      <div class="notice-box">
        <div class="notice-title">
          <h4>{{curNotice.title}}</h4>
          <span>{{common.dateFormatter("","",curNotice.updatetime)}}</span>
        </div>
        <div class="notice-content">{{curNotice.content}}</div>
      </div>
      <!-- 关闭按钮 -->
      <div class="notice-footer" v-if="noticeDialogShow">
        <van-icon name="close" color="#ffffff" size="30" @click="noticeDialogShow = false;"></van-icon>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      noticeDialogShow: false,
      curNotice: {}
    };
  },
  created() {
    // 获取学院列表
    // this.$store.dispatch("getOrgList");
    // 获取用户信息
    this.$store.dispatch("getUserInfo");
  }
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
  .notice-dialog {
    padding: 0 10px;
    width: calc(100% - 40px);
    background: none;
    .notice-box {
      max-height: 70%;
      background: #ffffff;
      border-radius: 12px;
      padding: 20px 15px;
    }
  }
  .notice-title {
    h4,
    span {
      display: inline-block;
    }
    h4 {
      width: calc(100% - 70px);
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      text-align: left;
    }
    span {
      width: 65px;
      color: rgba(51, 51, 51, 0.5);
      font-size: 12px;
    }
  }
  .notice-content {
    margin-top: 20px;
    font-size: 14px;
    line-height: 20px;
    max-height: 300px;
    overflow: auto;
  }
  .notice-footer {
    margin-top: 30px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
