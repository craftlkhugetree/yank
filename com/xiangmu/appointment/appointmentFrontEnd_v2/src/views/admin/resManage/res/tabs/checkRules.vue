<template>
  <div class="main">
    <!--------------------------- 签到 --------------------------->
    <div class="item">
      <h3 class="title">签到</h3>
      <el-switch v-model="isCheckIn" active-color="#3F86F7" inactive-color="#c3c3c3" disabled></el-switch>
      <div class="content check-content">
        <span v-if="!isCheckIn">暂无签到规则</span>
        <!--------------------------- 签到方式 --------------------------->
        <div v-if="isCheckIn" class="check-item clearfix">
          <label>签到方式:</label>
          <div class="right">
            <span v-if="checkTypeCode == '1'">用户扫描资源二维码</span>
            <span v-if="checkTypeCode == '2'">管理员扫描用户二维码</span>
          </div>
        </div>
        <!--------------------------- 签到时间 --------------------------->
        <div v-if="isCheckIn" class="check-item clearfix">
          <label>签到时间:</label>
          <div class="right">
            <span>资源使用时间开始前 {{checkIn.checkTime}} 分钟可以签到</span>
          </div>
        </div>
        <!--------------------------- 停止签到 --------------------------->
        <div v-if="isCheckIn" class="check-item clearfix">
          <label>停止签到:</label>
          <div class="right">
            <span>资源使用时间开始后 {{checkIn.stopCheckTime}} 分钟停止签到</span>
          </div>
        </div>
        <!--------------------------- 释放资源 --------------------------->
        <div v-if="isCheckIn" class="check-item clearfix">
          <label>释放资源:</label>
          <div class="right">
            <span>资源使用时间开始后 {{checkTimeOut}} 分钟未签到，则释放资源</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resDetail: Object
  },
  data() {
    return {
      isCheckIn: false,
      isCheckOut: false,
      checkTypeCode: "1",
      checkTypeVal: 10,
      checkIn: {
        checkTime: 30,
        stopCheckTime: 30
      },
      checkTimeOut: 30
    };
  },
  watch: {
    resDetail() {
      this.setCheckInfo();
    }
  },
  methods: {
    setCheckInfo() {
      let checkInfo = this.resDetail.check;
      if (checkInfo) {
        let checkin = checkInfo.checkin;
        if (checkin) {
          this.isCheckIn = true;
          this.checkIn = JSON.parse(checkin);
          this.checkTimeOut = checkInfo.checktimeout;
          let checktype = JSON.parse(checkInfo.checktype);
          this.checkTypeCode = checktype.code;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  padding: 5px 0;
}
.item {
  margin-bottom: 30px;
  position: relative;
  .title {
    font-size: 16px;
    color: #474d51;
    line-height: 22px;
    position: relative;
    padding: 0 0 10px 36px;
    border-bottom: 1px dashed #dbdbdb;
    &::before {
      display: inline-block;
      content: "";
      width: 8px;
      height: 8px;
      border: 4px solid #3f86f7;
      border-radius: 8px;
      position: absolute;
      left: 10px;
      top: 3px;
    }
  }
  .el-switch {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.check-content {
  padding: 20px 10px;
  .check-item {
    margin-bottom: 10px;
    line-height: 30px;
    & > label {
      width: 90px;
      float: left;
      color: #595959;
    }
    .right {
      float: left;
      width: calc(100% - 100px);
      color: rgba(0, 0, 0, 0.65);
    }
  }
}


.disabled {
  span,
  .tip i {
    color: #c0c4cc;
  }
}
</style>