<template>
  <div class="noticeDetailbox">
    <h3>{{noticeDetailText.title}}</h3>
    <p>
      {{noticeDetailText.showtime}}
      <i>{{noticeDetailText.readnum}}阅读</i>
    </p>
    <div class="line"></div>
    <div class="noticecontent" v-html="$xss(noticeDetailText.content)"></div>
    <div class="bottom" @click="goback">
      <div>返 回</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: String
  },
  data() {
    return {
      noticeDetailText: ""
    };
  },
  methods: {
    getDetail() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.noticedetail,
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            this.noticeDetailText = res.data;
            this.noticeDetailText.showtime =
              res.data.createtime.substring(0, 4) +
              "/" +
              res.data.createtime.substring(4, 6) +
              "/" +
              res.data.createtime.substring(6, 8);
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    goback() {
      this.$router.push("notice");
    }
  },
  created() {
    this.getDetail();
  }
};
</script>
<style scoped>
.noticeDetailbox {
  width: 100%;
  padding: 30px 1rem 4rem;
  box-sizing: border-box;
  background: #fff;
}
.noticeDetailbox > h3 {
  text-align: center;
  width: 100%;
  font-size: 36px;
  font-weight: 550;
  color: #333333;
  line-height: 50px;
  letter-spacing: 1px;
}
.noticeDetailbox > p {
  width: 100%;
  height: 24px;
  font-size: 26px;
  font-weight: 400;
  color: #999999;
  line-height: 24px;
  margin-top: 0.63rem;
}
.noticeDetailbox > p > i {
  float: right;
  font-style: normal;
}
.noticeDetailbox > .line {
  width: 100%;
  height: 1px;
  background: rgba(238, 238, 238, 1);
  margin: 24px 0;
}
.noticeDetailbox > .noticecontent {
  width: 100%;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 44px;
  letter-spacing: 1px;
}
</style>