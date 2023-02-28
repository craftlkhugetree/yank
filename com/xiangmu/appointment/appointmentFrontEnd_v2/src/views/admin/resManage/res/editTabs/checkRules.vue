<template>
  <div class="main">
    <!--------------------------- 签到 --------------------------->
    <div class="item">
      <h3 class="title">签到</h3>
      <el-switch v-model="isCheckIn" active-color="#3F86F7" inactive-color="#c3c3c3"></el-switch>
      <div class="content check-content">
        <!--------------------------- 签到方式 --------------------------->
        <div class="check-item clearfix">
          <label>签到方式:</label>
          <div class="right">
            <el-radio
              v-model="checkTypeCode"
              label="1"
              style="width:100%;"
              :disabled="!isCheckIn"
            >用户扫描资源二维码</el-radio>
            <!-- <el-radio v-model="checkTypeCode" label="2" :disabled="!isCheckIn">管理员扫描用户二维码</el-radio> -->
          </div>
        </div>
        <!--------------------------- 签到时间 --------------------------->
        <div class="check-item clearfix" :class="{'disabled': !isCheckIn}">
          <label>签到时间:</label>
          <div class="right">
            <span>资源使用时间开始前</span>
            <el-input-number
              controls-position="right"
              v-model.number="checkIn.checkTime"
              size="small"
              style="width:80px;margin:0 10px;"
              :min="1"
              :disabled="!isCheckIn"
            ></el-input-number>
            <span>分钟可以签到</span>
          </div>
        </div>
        <!--------------------------- 停止签到 --------------------------->
        <div class="check-item clearfix" :class="{'disabled': !isCheckIn}">
          <label>停止签到:</label>
          <div class="right">
              <span>资源使用时间开始后</span>
              <el-input-number
                controls-position="right"
                v-model.number="checkIn.stopCheckTime"
                size="small"
                style="width:80px;margin:0 10px;"
                :min="0"
                :disabled="!isCheckIn"
              ></el-input-number>
              <span>分钟停止签到</span>
          </div>
        </div>
        <!--------------------------- 释放资源 --------------------------->
        <div class="check-item clearfix" :class="{'disabled': !isCheckIn}">
          <label>释放资源:</label>
          <div class="right">
            <span>资源使用时间开始后</span>
            <el-input-number
              controls-position="right"
              v-model.number="checkTimeOut"
              size="small"
              style="width:80px;margin:0 10px;"
              :min="1"
              :disabled="!isCheckIn"
            ></el-input-number>
            <span>分钟未签到，则释放资源</span>
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
      checkIn: {
        checkTime: 30,
        stopCheckTime: 30
      },
      checkTimeOut: 30
    };
  },
  computed: {
    checkType() {
      let obj = {};
      if (this.checkTypeCode == "1") {
        obj = {
          code: "1",
          note: "用户扫描资源二维码"
        };
      } else {
        obj = {
          code: "2",
          note: "管理员扫描用户二维码"
        };
      }
      return obj;
    }
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
    & > label {
      width: 90px;
      float: left;
      line-height: 32px;
      color: #595959;
    }
    .right {
      float: left;
      width: calc(100% - 100px);
      color: rgba(0, 0, 0, 0.65);
    }
    .el-radio {
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 10px;
      line-height: 32px;
    }
  }
}

.check-item-content {
  background: #fafafa;
  padding: 10px;
  font-size: 14px;
  color: #595959;
}

.tip {
  display: inline-block;
  min-width: 224px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  margin-bottom: 10px;
  i {
    color: #3f86f7;
    font-size: 14px;
  }
}

.disabled {
  span,
  .tip i {
    color: #c0c4cc;
  }
}
</style>