<template>
  <div>
    <van-nav-bar title="评价" left-arrow @click-left="goback" />
    <div class="basic-box">
      <h4>对我们的答复满意吗</h4>
      <van-rate @change="changeScore" class="bounce-size" :size="25" color="#FD7D18" v-model="markscore"></van-rate>
    </div>
    <div style="margin: 24px;">
      <van-button size="large" type="info" icon="checked" :loading="loading" @click="doScore">提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    version:String
  },
  data() {
    return {
      loading: false,
      markscore: null
    };
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    // 改变评分，兼容动效
    changeScore(val) {
      this.markscore = 0;
      setTimeout(() => {
        this.markscore = val;
      },10)
    },
    // 提交
    doScore() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/markscore",
          isRep: true,
          data: {
            applyid: this.id,
            version: this.version,
            markscore: this.markscore
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$toast.success("提交成功！");
            this.goback();
          } else {
            this.$toast.fail("提交失败！" + res.data.message);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$toast.fail("提交失败！" + err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.basic-box {
  padding: 24px 16px;
  h4 {
    color: #2a2e2e;
    margin-bottom: 16px;
  }
}
</style>