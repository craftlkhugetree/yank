<template>
  <div>
    <role-bar title="我要督查"></role-bar>
    <div class="bg all">
      <div class="title">请选择业务领域</div>
      <div class="div_flex list">
        <div
          v-for="item in tableList"
          :key="item.ID"
          class="font-s item"
          @click="choose(item)"
          :class="item.choose ? 'choose' : ''"
        >
          <span>{{ item.NAME }}</span>
        </div>
      </div>
    </div>
    <div class="div_flex bottom_btn">
      <van-button round class="btn pre" @click.stop="back">
        返回上一步</van-button
      >
      <van-button round class="btn" :disabled="canBtn" @click.stop="next">
        下一步</van-button
      >
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
      this.common.back();
    },
    next() {
      this.common.setStore(this.global.FORM, this.form);
      this.$router.push("/report-handleDeptId-jz");
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
  min-height: 100vh;
  //   padding-left: $fixed_side;
  //   padding-right: $fixed_side;
  .title {
    margin: $fixed_side 0;
    height: 24px;
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 24px;
    color: #121212;
  }
  .list {
    flex-wrap: wrap;
    .item {
      margin: 0 $fixed_mb $fixed_mb 0;
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: #595959;
      background: #f5f5f5;
      border-radius: 24px;
      span {
        padding: 0 $fixed_side;
      }
    }
    .choose {
      background: rgba(0, 100, 87, 0.08) !important;
      border: 1px solid #006457 !important;
      border-radius: 24px !important;
      color: #006457 !important;
    }
  }
}
.bottom_btn {
  position: absolute;
  width: 100%;
  bottom: 42px;
  justify-content: space-around;
  .btn {
    width: 45%;
    background: #006457;
    font-size: 16px;
    color: #ffffff;
    margin-top: $fixed_side;
  }
  .pre {
    background: #ffffff;
    color: #595959;
  }
}
</style>
