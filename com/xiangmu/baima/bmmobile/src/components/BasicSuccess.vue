<template>
  <div>
    <van-nav-bar :title="title" :border="false" />
    <div class="success-box">
      <van-icon name="checked" />
      <h2>{{title}}</h2>
      <span>{{des}}</span>
      <van-button round plain type="primary" @click="toHome">返回首页</van-button>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        title: String,
        des: String,
        path: String
    },
    methods: {
        toHome() {
            this.$router.push(this.path)
        }
    }
};
</script>

<style lang="scss" scoped>
.success-box {
    width: 100%;
    text-align: center;
    padding: 30px 0;
    background: #ffffff;
    .van-icon {
        font-size: 65px;
        color: #00b09b;
    }
    h2 {
        font-size: 20px;
        margin: 20px 0 15px 0;
        color: #333333;
    }
    span {
        display: block;
        font-size: 14px;
        color: #888888;
        // margin-bottom: 60px;
    }
    /deep/ .van-button {
        width: 160px;
        margin-top: 60px;
    }
}
</style>