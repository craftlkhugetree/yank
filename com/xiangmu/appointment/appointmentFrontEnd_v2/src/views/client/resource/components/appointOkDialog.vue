<template>
  <el-dialog
    class="base-dialog"
    title
    :visible.sync="okVisible"
    :modal="false"
    :close-on-click-modal="false"
    width="600px"
    center
    :before-close="cancelDialog"
  >
    <div class="success-box my-scrollbar">
      <img src="@/assets/img/appoint-ok.png" class="image" />
      <p class="tip-text">恭喜，预约成功！</p>
      <div>
        <el-button class="suc-btn" plain @click="jumperAppoint">查看记录</el-button>
        <el-button class="return-btn" type="primary" @click="jumperHome">返回首页</el-button>
      </div>
      <!------------------------- 预约单列表 ------------------------->
      <el-divider class="hr-line" content-position="center">
        <span class="tip-text">预约单</span>
      </el-divider>
      <div class="content">
        <el-tooltip :content="resDetail.name">
          <h1 class="title" :class="{'approve':resDetail.approves.length}">
            <span class="ellipsis">{{resDetail.name}}</span>
          </h1>
        </el-tooltip>
        <img
          src="@/assets/img/wait-approve.png"
          class="wait-image"
          v-show="resDetail.approves.length"
        />
        <!--预约时间段 -->
        <div class="item-box" v-for="(item,index) in successData" :key="index">
          <h3 class="item-title">
            <span class="blue-bg">{{index+1}}</span>
            <span>{{formatDate(item.usedate)}}</span>
            <span class="right-text">申请时间：{{formatAllTimeStr(item.createtime)}}</span>
          </h3>
          <div class="time-content">
            <span class="hour">
              {{formatTime(item.starttime)}}
              <i class="start">开始</i>
            </span>
            <el-divider class="hour-line" content-position="center">
              <span
                class="hr-text"
                :class="{'widther':isMoreWidth}"
              >{{timeDifference(item.starttime,item.endtime)}}</span>
            </el-divider>
            <span class="hour">
              {{formatTime(item.endtime)}}
              <i class="end">结束</i>
            </span>
          </div>
          <div class="right-btn">
            <el-button class="suc-btn" plain @click="doCancel(item)" v-show="cancelBtn(item)">取消预约</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { saveAppoint, cancelAppoint } from "@/api/client/appoint";
export default {
  props: ["resDetail", "successData", "okVisible"],
  data() {
    return {
      loading: false,
      isMoreWidth: false
    };
  },
  components: {},
  methods: {
    //计算时间差
    timeDifference(start, end) {
      let startS = start.slice(0, 2),
        startF = start.slice(2, 4);
      let endS = end.slice(0, 2),
        endF = end.slice(2, 4);
      let startAll = parseInt(startS * 60) + parseInt(startF);
      let endAll = parseInt(endS * 60) + parseInt(endF);
      let diff = endAll - startAll; //计算相差的分钟数
      let hour = Math.floor(diff / 60); //相差的小时数
      let mm = diff % 60; //计算相差小时后余下的分钟数

      let str = "";
      if (hour) {
        str = `${hour} 小时`;
        this.isMoreWidth = false;
      }
      if (mm) {
        str += `${mm} 分钟`;
        this.isMoreWidth = false;
      }
      if (hour && mm) {
        this.isMoreWidth = true;
      }
      return str;
    },
    //格式化成  hh:mm
    formatTime(time) {
      let ftime = this.moment(time, "hhmm").format("HH:mm");
      return ftime;
    },
    //格式化成 YYYY-MM-DD
    formatDate(date) {
      let fdate = this.moment(date).format("YYYY-MM-DD");
      return fdate;
    },
    //格式化成 YYYY-MM-DD  hh:mm:ss
    formatAllTimeStr(str) {
      let strTime = this.moment(str, "YYYYMMDDhhmmss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return strTime;
    },
    //跳转到预约列表
    jumperAppoint() {
      this.$router.push({
        name: "center"
      });
    },
    //跳转到首页
    jumperHome() {
      this.$router.push({
        name: "home"
      });
    },

    // 关闭弹窗
    cancelDialog() {
      this.$emit("doFunc");
    },

    cancelBtn(item) {
      let appointTime = this.moment(
        `${item.usedate}${item.starttime}`,
        "YYYYMMDDhhmm"
      ).format("YYYY-MM-DD HH:mm");
      let nowTime = this.moment().format("YYYY-MM-DD HH:mm");
      //计算时间差并转换成标准时间单位
      let dura =
        this.moment(appointTime).format("x") - this.moment(nowTime).format("x");
      let tempTime = this.moment.duration(dura);
      let days = tempTime.days() || 0,
        hours = tempTime.hours() || 0,
        mins = tempTime.minutes() || 0;
      let diffHours = parseInt(hours) + parseInt(days * 24);
      let diffMins =
        parseInt(mins) + parseInt(hours * 60) + parseInt(days * 24 * 60);
      let isShowCancel = true;
      if (item.canceltimeunit == "minute" && diffMins < item.canceltimeval) {
        isShowCancel = false;
      }
      if (item.canceltimeunit == "hour" && diffHours < item.canceltimeval) {
        isShowCancel = false;
      }
      return isShowCancel;
    },

    // 取消预约
    doCancel(item) {
      this.$confirm(`是否确认取消该预约单吗?`, "确认取消预约", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            ids: item.id,
            note: ""
          };
          cancelAppoint(data)
            .then(res => {
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "取消预约成功！"
                });
                let newData = this.successData.filter(it => item.id !== it.id);
                this.$emit('update:successData', newData)
                // this.successData = newData;
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "取消预约失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "取消预约失败：" + err
              });
            });
        })
        .catch(() => {
          return;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.base-dialog /deep/ .el-dialog__header {
  border: none;
}
.base-dialog /deep/ .el-dialog__body {
  padding: 10px 0px;
}

.success-box {
  text-align: center;
  overflow-y: auto;
  max-height: 700px;
  .image {
    width: 105px;
    height: 100px;
  }
  .tip-text {
    height: 22px;
    font-size: 16px;
    color: #7d7d80;
    line-height: 22px;
    margin: 20px 0px;
  }
  .suc-btn,
  .return-btn {
    width: 100px;
    height: 32px;
    line-height: 6px;
    border-radius: 28px;
    margin-left: 20px;
    margin-bottom: 10px;
  }
  .suc-btn {
    border: 1px solid #d6d6d6;
  }
  .hr-line {
    width: 300px;
    height: 1px;
    background: #e5e8ed;
    border-radius: 1px;
    margin: 30px auto;
  }
}

.content {
  width: 480px;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
  border-radius: 5px;
  border: 1px solid #e5e8ed;
  margin: 0 auto;
  margin-bottom: 40px;
  position: relative;
  .title {
    text-indent: 10px;
    text-align: left;
    font-weight: 600;
    color: #474d51;
    line-height: 25px;
    font-size: 18px;
    padding: 10px 0;
    border-bottom: 1px solid #e5e8ed;

    span.ellipsis {
      width: 368px;
    }
  }
  .approve:before {
    display: inline-block;
    content: "等待审核";
    position: absolute;
    top: 10px;
    right: 20px;
    color: #fff;
    font-size: 14px;
    z-index: 99;
    font-weight: 400;
  }
  .wait-image {
    position: absolute;
    top: 5px;
    right: -2px;
  }
}
.item-box {
  margin: 0 20px;
  padding: 20px 0px 5px 0px;
  border-bottom: 1px solid #dbdbdb;
  .item-title {
    text-align: left;
    line-height: 24px;
  }
  .blue-bg {
    width: 24px;
    height: 24px;
    color: #ffffff;
    background: #3f86f7;
    border-radius: 5px;
    margin-right: 10px;
    display: inline-block;
    text-align: center;
  }
  .right-text {
    float: right;
    font-weight: 400;
    color: #7d7d80;
    font-size: 13px;
  }
  .time-content {
    margin: 20px 0px;

    .hour {
      width: 57px;
      height: 40px;
      font-size: 28px;
      font-weight: 600;
      color: #474d51;
      line-height: 40px;
      position: relative;
      .start {
        position: absolute;
        left: 5px;
        top: 30px;
        color: #7d7d80;
        font-size: 14px;
      }
      .end {
        position: absolute;
        right: 5px;
        top: 30px;
        color: #7d7d80;
        font-size: 14px;
      }
    }
    .hour-line {
      display: inline-block;
      width: 200px;
      margin: 0 10px;
      .el-divider__text {
        padding: 0px;
      }
      .hr-text {
        width: 72px;
        height: 24px;
        border-radius: 26px;
        border: 1px solid #dbdbdb;
        color: #7d7d80;
        display: inline-block;
        line-height: 24px;
        font-size: 13px;
        padding: 0 5px;
      }
      .widther {
        width: 100px;
      }
    }
  }
  .right-btn {
    text-align: right;
    padding-top: 20px;
  }
}
.item-box:last-child {
  border: none;
}
</style>