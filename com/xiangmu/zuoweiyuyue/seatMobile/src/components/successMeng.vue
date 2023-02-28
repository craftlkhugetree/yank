<template>
  <div class="monitorwrapper" @click.stop>
    <div>
      <div class="img"></div>
      <h3 v-if="ismonitor">举报提交成功！</h3>
      <h3 v-else>座位预约成功！</h3>
      <p v-if="ismonitor">系统审核中…</p>
      <p v-else>正在为您配置座位…</p>
      <span @click="gohome">返回首页</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ismonitor: Boolean
  },
  data() {
    return {};
  },
  methods: {
    gohome() {
      this.$router.push("/");
    }
  },
  created() {
    // console.log(this.ismonitor)
  }
};
</script>
<style scoped>
.monitorwrapper {
  height: 100%;
  width: 100%;
  position: relative;
}
.monitorwrapper > div {
  width: 580px;
  height: 720px;
  border-radius: 16px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: url(../../static/img/mengBack.png) no-repeat center center;
  background-size: cover;
}

.monitorwrapper > div > .img {
  width: 317px;
  height: 223px;
  margin: 80px auto 40px;
}
.monitorwrapper > div > h3 {
  width: 100%;
  height: 59px;
  font-size: 42px;
  font-weight: 500;
  color: #ffffff;
  line-height: 59px;
  margin-bottom: 8px;
  text-align: center;
}
.monitorwrapper > div > p {
  width: 100%;
  height: 42px;
  font-size: 30px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 42px;
  text-align: center;
}
.monitorwrapper > div > span {
  display: inline-block;
  width: calc(100% - 60px);
  height: 84px;
  background: #ffffff;
  border-radius: 44px;
  border: 2px solid #cccccc;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 84px;
  text-align: center;
  position: absolute;
  bottom: 60px;
  left: 30px;
}
</style>