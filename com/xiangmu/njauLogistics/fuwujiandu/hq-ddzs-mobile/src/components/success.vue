<template>
  <div>
    <role-bar title="我要督查"></role-bar>
    <div class="title-bg all">
      <img :src="require('../../static/images/success.svg')" />
      <span class="font-s tijiao">提交成功！</span>
      <div class="div_flex bottom_btn">
        <van-button round class="btn pre" @click.stop="back">
          继续检查</van-button
        >
        <van-button round class="btn" @click.stop="next">查看记录</van-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "depList",
  data() {
    return {
      tableList: [],
      form: {}
    };
  },
  computed: {
    canBtn() {
      return !this.form[this.global.handleDeptId];
    }
  },
  methods: {
    back() {
      this.$router.push("/report");
    },
    next() {
      this.$router.push("/index");
    },
    choose(item) {
      this.$set(this.form, this.global.handleDeptId, item.ID);
      this.transColor();
    },
    transColor() {
      this.tableList.forEach(t => {
        if (t.ID === this.form[this.global.handleDeptId]) {
          this.$set(t, "choose", true);
        } else {
          this.$set(t, "choose", false);
        }
      });
    }
  },
  mounted() {
    this.form = this.common.getStore(this.global.FORM);
    this.tableList = this.$store.state.departments;
    this.transColor();
  }
};
</script>
<style lang="scss" scoped>
.all {
  height: 100vh;
  padding-left: $fixed_side;
  padding-right: $fixed_side;
  margin: $fixed_side 0;
  img {
    display: block;
    margin: 0 auto;
  }
  .tijiao {
    display: block;
    margin: 32px auto;
    width: 100%;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    height: 22px;
    text-align: center;
    color: #595959;
  }
}
.bottom_btn {
  width: 100%;
  justify-content: space-around;
  .btn {
    color: #ffffff;
    width: 45%;
    background: #006457;
    font-size: 16px;
    margin-top: $fixed_side;
  }
  .pre {
    background: #ffffff;
    color: #595959;
  }
}
</style>
