<template>
  <div class="success-box">
    <img src="@/assets/img/appoint-ok.png" class="image" />
    <p class="tip-text">签到成功！</p>
    <div>
      <van-button class="suc-btn" type="default" @click="jumperAppoint">查看记录</van-button>
      <van-button class="suc-btn" type="default" @click="jumperHome">返回首页</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {
    //跳转到预约列表
    jumperAppoint() {
      this.$router.push({
        name: "appoint"
      });
    },
    //跳转到首页
    jumperHome() {
      this.$router.push({
        name: "index"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.success-box {
  background: #f6f6f6;
  padding: 24px;
  text-align: center;
  overflow-y: auto;
  max-height: 700px;
  .image {
    width: 105px;
    height: 100px;
  }
  .tip-text {
    height: 22px;
    font-size: 16px;
    color: #7d7d80;
    line-height: 22px;
    margin: 20px 0px;
  }
  .suc-btn {
    width: 200px;
    height: 60px;
    border-radius: 40px;
    border: 1px solid #d6d6d6;
    margin-left: 20px;
    margin-bottom: 20px;
  }
}
</style>