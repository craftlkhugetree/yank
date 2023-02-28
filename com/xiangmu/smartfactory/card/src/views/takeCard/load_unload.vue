<template>
  <div class="card">
    <div class="title">请选择装车或卸车</div>
    <div class="imgs">
      <div class="left" @click="load(1)">
        <div class="load" v-if="loadType === 1"></div>
        <div class="unload" v-else></div>
        <div class="tip">装车</div>
      </div>
      <div class="right" @click="load(2)">
        <div class="load" v-if="loadType === 2"></div>
        <div class="unload" v-else></div>
        <div class="tip">卸车</div>
      </div>
    </div>
    <img v-if="!loadType" class="btn" src="@/assets/img/next-btn-gray.png" alt />
    <img v-else class="btn" src="@/assets/img/next-btn.png" alt @click="next" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadType: 0,
    };
  },
  methods: {
    // 下一步
    next() {
      sessionStorage.setItem('loadType', this.loadType);
      this.$router.push('/takecard');
    },
    load(val) {
      this.loadType = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 45px;
  margin-top: 68px;
  text-align: center;
  font-size: 32px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #373b4b;
  line-height: 45px;
}
.imgs {
  margin: 71px 180px 76px;
  display: flex;
  align-items: center;
  .left {
    cursor: pointer;
    width: 216px;
    .load {
      height: 208px;
      border: 4px solid #3870ff;
      border-radius: 50%;
      background: #d7e2ff url('~@/assets/img/blueload.png') center no-repeat;
    }
    .unload {
      height: 216px;
      border-radius: 50%;
      background: #f7f7f9 url('~@/assets/img/grayload.png') center no-repeat;
    }
  }
  .right {
    margin-left: auto;
    cursor: pointer;
    width: 216px;
    .load {
      height: 208px;
      border: 4px solid #3870ff;
      border-radius: 50%;
      background: #d7e2ff url('~@/assets/img/blueunload.png') center no-repeat;
    }
    .unload {
      height: 216px;
      border-radius: 50%;
      background: #f7f7f9 url('~@/assets/img/grayunload.png') center no-repeat;
    }
  }
}
.tip {
  margin-top: 20px;
  width: 100%;
  height: 33px;
  text-align: center;
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #373b4b;
  line-height: 33px;
}
</style>
