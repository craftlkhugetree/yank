<template>
  <div class="success-box">
    <van-nav-bar
      class="nav-bar"
      title="预约成功"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
      @click-right="jumpSearch"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div class="success-head">
      <img src="@/assets/img/appoint-ok.png" class="image" />
      <p class="tip-text">恭喜，预约成功！</p>
    </div>
    <div>
      <van-button class="jumper-btn" type="default" @click="jumperAppoint">查看记录</van-button>
      <van-button class="jumper-btn" type="default" @click="jumperHome">返回首页</van-button>
    </div>
    <!------------------------- 预约单列表 ------------------------->
    <div class="content">
      <div class="title-box">
        <h1
          class="h1-title van-ellipsis"
          :class="{'approve':resDetail.approves.length}"
        >{{resDetail.name}}</h1>
        <img
          src="@/assets/img/wait-approve.png"
          class="wait-image"
          v-show="resDetail.approves.length"
        />
      </div>
      <!--预约时间段 -->
      <div class="item-box" v-for="(item,index) in successData" :key="index">
        <h3 class="item-title">
          <span class="blue-bg">{{index+1}}</span>
          <span class="date-text">{{formatDate(item.usedate)}}</span>
          <span class="right-text">申请时间：{{formatAllTimeStr(item.createtime)}}</span>
        </h3>
        <div class="time-content">
          <span class="hour">
            {{formatTime(item.starttime)}}
            <i class="start">开始</i>
          </span>
          <el-divider class="hour-line" content-position="center">
            <span class="hr-text">{{timeDifference(item.starttime,item.endtime)}}</span>
          </el-divider>
          <span class="hour">
            {{formatTime(item.endtime)}}
            <i class="end">结束</i>
          </span>
        </div>
        <div class="right-btn">
          <van-button
            class="suc-btn"
            v-show="cancelBtn(item)"
            type="default"
            @click="doCancel(item)"
          >取消预约</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { saveAppoint, cancelAppoint } from "@/api/client/appoint";
export default {
  data() {
    return {
      successData: [],
      loading: false
    };
  },
  computed: {
    resDetail() {
      return this.$store.state.currentResDetail;
    }
  },
  components: {},
  mounted() {
    this.successData = this.$route.params.successData;
  },
  methods: {
    //跳转到预约列表
    jumperAppoint() {
      this.$router.push({
        name: "appoint"
      });
    },
    //跳转到首页
    jumperHome() {
      this.$router.push({
        name: "index"
      });
    },
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },
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
      }
      if (mm) {
        str += `${mm} 分钟`;
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
      Dialog.confirm({
        title: "确认取消预约",
        message: "是否确认取消该预约单吗?"
      })
        .then(() => {
          let data = {
            ids: item.id,
            note: ""
          };
          cancelAppoint(data).then(res => {
            if (res.success) {
              this.$toast.success("取消预约成功！");
              let newData = this.successData.filter(v => v.id !== item.id);
              this.successData = newData;
            } else {
              this.$toast.fail(`取消预约失败：${res.data.message}`);
            }
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
.success-box {
  background: #f6f6f6;
  padding: 24px;
  text-align: center;
  overflow-y: auto;
  height: 100%;
  .success-head {
    padding: 32px;
    margin-top: 64px;
    .image {
      width: 300px;
      height: 200px;
    }
    .tip-text {
      height: 43px;
      font-size: 36px;
      font-weight: blod;
      color: #474d51;
      line-height: 43px;
      margin: 20px 0px;
    }
  }
  .jumper-btn {
    width: 200px;
    height: 60px;
    border-radius: 40px;
    border: 1px solid #d6d6d6;
    margin-left: 20px;
    margin-bottom: 32px;
  }

  .suc-btn {
    margin-top: 32px;
    font-size: 24px;
    color: #686868;
    width: 160px;
    height: 56px;
    border-radius: 28px;
  }
  .hr-line {
    width: 300px;
    height: 1px;
    background: #e5e8ed;
    border-radius: 1px;
    margin: 24px auto;
  }
}

.content {
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 10px;
  margin: 0 auto;
  position: relative;
  font-size: 24px;
  .title-box {
    border-bottom: 1px solid #e5e8ed;
    padding: 10px 0;
  }
  .h1-title {
    width: 480px;
    height: 80px;
    font-size: 28px;
    line-height: 80px;
    text-indent: 24px;
    text-align: left;
    font-weight: blod;
    color: #474d51;
  }
  .approve:before {
    display: inline-block;
    content: "等待审核";
    position: absolute;
    top: 5px;
    right: 20px;
    color: #fff;
    font-size: 24px;
    z-index: 99;
    font-weight: 400;
  }
  .wait-image {
    position: absolute;
    top: 20px;
    right: -5px;
    width: 140px;
    height: 60px;
  }
}
.item-box {
  color: #474d51;
  margin: 0 20px;
  padding: 20px 0px;
  border-bottom: 1px solid #dbdbdb;
  .item-title {
    text-align: left;
    line-height: 40px;
    font-size: 24px;
  }
  .blue-bg {
    width: 40px;
    height: 40px;
    background: #3f86f7;
    border-radius: 5px;
    color: #ffffff;
    margin-right: 16px;
    display: inline-block;
    text-align: center;
  }
  .date-text {
    font-size: 24px;
    font-weight: blod;
    color: #474d51;
  }

  .right-text {
    float: right;
    font-weight: 400;
    color: #7d7d80;
  }
  .time-content {
    margin: 20px 0px;
    padding: 0 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .hour {
      width: 120px;
      height: 58px;
      font-size: 48px;
      font-weight: blod;
      color: #474d51;
      line-height: 58px;
      position: relative;
      .start {
        position: absolute;
        left: 5px;
        top: 64px;
        font-size: 26px;
      }
      .end {
        position: absolute;
        right: 5px;
        top: 64px;
        font-size: 26px;
      }
    }
    .hour-line {
      display: inline-block;
      width: 180px;
      margin: 0 60px;
      .el-divider__text {
        padding: 0px;
      }
      .hr-text {
        width: 119px;
        // height: 32px;
        border-radius: 26px;
        border: 1px solid #dbdbdb;
        color: #7d7d80;
        display: inline-block;
        line-height: 36px;
        font-size: 22px;
        padding: 5px 10px;
      }
    }
  }
  .right-btn {
    text-align: right;
    padding-top: 20px;
    height: 110px;
  }
}
.item-box:last-child {
  border: none;
}
</style>