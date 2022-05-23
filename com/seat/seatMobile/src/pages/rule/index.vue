<template>
  <div class="rule_content">
    <h3>{{ruleInfo.name}}</h3>
    <div class="line"></div>
    <div class="content" v-html="ruleInfo.content"></div>
    <div class="bottom">
      <div @click="gohome">返 回</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleInfo: ""
    };
  },
  methods: {
    gohome() {
      this.$router.push("/");
    },
    getruleinfo() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.ruleinfo,
          data: {
            status: "1"
          },
          isRep: true
        })
        .then(res => {
          if (res.success) {
            this.ruleInfo = res.data;
          } else {
            this.Toast(res.data.message);
          }
        });
    }
  },
  created() {
    this.getruleinfo();
  }
};
</script>
<style scoped>
.rule_content {
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 30px;
  padding-bottom: 3.5rem;
  box-sizing: border-box;
  background: #fff;
  top: 0;
  left: 0;
  overflow: auto;
}
.rule_content > h3 {
  font-size: 36px;
}
.rule_content > h3 > div {
  font-size: 26px;
}
.rule_content > .line {
  width: 100%;
  height: 0.03rem;
  background: #eeeeee;
  margin: 30px auto;
}
.rule_content > .bottom {
  width: 100%;
  height: 132px;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.rule_content > .bottom > div {
  width: calc(100% - 60px);
  height: 84px;
  background: #ffffff;
  border-radius: 44px;
  border: 2px solid #cccccc;
  position: fixed;
  bottom: 24px;
  left: 30px;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 84px;
  text-align: center;
}
.rule_content > h3 {
  text-align: center;
}
</style>