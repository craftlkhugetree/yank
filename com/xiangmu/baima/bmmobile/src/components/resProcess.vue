<template>
  <div class="basic-process">
    <el-alert
      v-if="applyInfoForm.status == '9'"
      title="该申请已被撤回,进程结束"
      type="error"
      center
      :closable="false"
      style="margin-bottom: 15px"
    ></el-alert>
    <el-alert
      v-if="applyInfoForm.status == '8'"
      title="该申请已被驳回"
      type="error"
      center
      :closable="false"
      style="margin-bottom: 15px"
    ></el-alert>
    <div
      class="step"
      v-for="(item, index) in processData"
      :class="{ success: item.status === 'success', fail: item.status === 'fail' }"
      :style="{'width': 100/processData.filter(d => !d.rearService).length + '%'}"
      :key="index"
    >
      <div class="step-head">
        <!-- <div class="title-line"></div> -->
        <div class="title-line" v-if="index !== 0"></div>
        <div class="title-icon" v-show="!item.active"></div>
        <van-icon v-show="item.text && item.status === 'success'" name="checked"></van-icon>
        <van-icon v-show="item.text && item.status === 'fail'" name="clear"></van-icon>
      </div>
      <div class="step-content">
        <h3 class="title">{{ item.text }}</h3>
        <p>{{ item.date }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'process',
  props: {
    processData: Array,
    applyInfoForm: Object,
  },

  created() {
    /* if(this.applyInfoForm.usetype =='3'){
          this.processData[1].hideLine=true
        }*/
  },
};
</script>

<style scoped lang="scss">
@import '../assets/css/mixin.scss';
.basic-process {
  @include clearfix;
  margin: 0 0 10px;
  background: #ffffff;
  padding: 20px 0;
  .step {
    text-align: center;
    float: left;
    .step-head {
      position: relative;
    }
    .title-icon {
      width: 22px;
      height: 22px;
      line-height: 22px;
      background: #ffffff;
      border: 5px solid #b6bdc6;
      border-radius: 50%;
      position: relative;
      margin-left: calc(50% - 15px);
      z-index: 100;
    }
    .van-icon {
      background: #ffffff;
      z-index: 100;
    }
    .title-line {
      height: 2px;
      width: 100%;
      background: #e7e9ef;
      position: absolute;
      left: -50%;
      right: 50%;
      top: 10px;
    }
    p {
      margin-top: 10px;
      color: #8c8e96;
      font-size: 10px;
    }
    .step-content {
      margin-top: 16px;
      h3 {
        color: #1f232f;
        font-size: 12px;
      }
    }
    &.success {
      h3 {
        color: #00b09b;
      }
      .van-icon-checked {
        font-size: 24px;
        color: #00b09b;
      }
      .title-line {
        background: #00b09b;
      }
    }
    &.fail {
      h3 {
        color: #fe3e61;
      }
      .van-icon-clear {
        font-size: 24px;
        color: #fe3e61;
      }
      .title-line {
        background: #fe3e61;
      }
    }
    // &:nth-of-type(1) {
    //   .title-line {
    //     display: none !important;
    //   }
    // }
  }
}
</style>
