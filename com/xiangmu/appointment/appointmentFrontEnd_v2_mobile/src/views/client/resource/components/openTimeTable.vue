<template>
  <div class="time-table">
    <!--------------------------- 近一周时间 --------------------------->
    <van-tabs class="nav-tab">
      <van-tab v-for="(date,index) in dateLabels" :key="'van-tab'+index">
        <div class="tab-title" slot="title">
          <span :class="index==0 ?'today':'tab-date'">{{ date.title }}</span>
          <span class="tab-week">{{ date.week }}</span>
        </div>
        <div class="date-icon" @click="jumpDate()">
          <i class="iconfont iconrili"></i>
        </div>

        <div class="tab-content">
          <template v-for="(time,timeIndex) in dayTimes">
            <van-button
              @click="clickTime(time,date)"
              v-if="isOpentime(time,date)"
              :class="{'selected':isSelectedtime(time,date) }"
              type="default"
              :key="'time'+timeIndex"
            >{{time.st}} ~ {{time.et}}</van-button>
            <template v-else>
              <van-button
                custom-style="border: 1px dashed #CCCCCC;"
                disabled
                dtype="default"
                :key="'time'+timeIndex"
                v-show="isLaterTime(time,date)"
              >{{time.st}} ~ {{time.et}}</van-button>
            </template>
          </template>
        </div>
      </van-tab>
    </van-tabs>

    <van-button class="big-btn" type="info" @click="applyAppoint">立即预约</van-button>
  </div>
</template>

<script>
import { fetchHasAppoint } from "@/api/client/resources.js";
import { fetchAppointList } from "@/api/client/appoint";
import { Dialog } from "vant";
export default {
  data() {
    return {
      dayTimes: [], // 一天的时间
      opointTimes: [], //已约好的时间段
      mergedDate: [], // 弹框展示的合并后的时间段
      fullAppointList: [], //该资源下已经被约的时间段
      limitNum: 0, //每次预约时间段最多几个
      isFinish: false, //是否完成当前预约才可以再次预约
      isContinue: false, //预约时间段是否是连续的
      hasOpointed: false, //已经约的还在进行中的资源
      isShowTime: true,
      showMessage: ""
    };
  },
  components: {},
  computed: {
    resDetailData() {
      return this.$store.state.currentResDetail;
    },
    appointDay() {
      return this.$store.state.appointDay;
    },
    //最近7天
    dateLabels() {
      let weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let dateArr = [];
      let selectDay = this.moment(this.appointDay).format("YYYY-MM-DD");
      let today = this.moment().format("YYYY-MM-DD");
      weekArr.forEach((item, index) => {
        let isToday = today == selectDay && index == 0;
        let title = isToday
          ? "今天"
          : this.moment(selectDay)
              .add(index, "days")
              .format("MM-DD");
        let day = this.moment(selectDay)
          .add(index, "days")
          .format("YYYY-MM-DD");
        let week =
          weekArr[
            this.moment(selectDay)
              .add(index, "days")
              .weekday()
          ];
        dateArr.push({
          title: title,
          label: day,
          week: week
        });
      });
      return dateArr;
    }
  },
  mounted() {
    this.getTimes();
    this.getResAppointed();
    this.getCenterAppoint();
  },

  methods: {
    //个人中心 获取已经约的还在进行中的资源
    getCenterAppoint() {
      let data = {
        filter: {
          starttime: null,
          endtime: null,
          applystatus: "1,2"
        },
        page: 1,
        limit: 10
      };
      fetchAppointList(data).then(res => {
        let hasOpointedList = res.data || [];
        this.hasOpointed = hasOpointedList.some(
          i => i.resid == this.resDetailData.id
        );
      });
    },

    //查询已被约的时间段
    getResAppointed() {
      let sessionRes = JSON.parse(sessionStorage.getItem("sessionRes"));
      let arrLabels = [];
      this.dateLabels.forEach(item => {
        arrLabels.push(item.label.replace(/-/g, ""));
      });
      let appointParam = {
        id: this.resDetailData.id,
        usedates: arrLabels.join(",")
      };
      fetchHasAppoint(appointParam).then(res => {
        if (res.success) {
          let arrData = [];
          res.data.forEach(item => {
            arrData.push({
              usedate: this.moment(item.usedate).format("YYYY-MM-DD"),
              endtime: this.moment(item.endtime, "hhmm").format("HH:mm"),
              starttime: this.moment(item.starttime, "hhmm").format("HH:mm")
            });
          });
          this.fullAppointList = arrData;
        }
      });
    },

    //选中时间段时   //如果已经选中 第二次点就取消
    clickTime(time, date) {
      let chooseTime = {
        usedate: date.label,
        starttime: time.st,
        endtime: time.et
      };
      let isSelected = this.isSelectedtime(time, date);
      if (!isSelected) {
        //预约限制条件
        let nowTime = parseInt(this.moment().format("YYYYMMDDHHmm"));
        let limitNum = 0;
        let last_day = "";
        let condition = {};
        let conditions = this.resDetailData.conditions;
        conditions.forEach(limit => {
          if (limit.conditioncode == "01") {
            condition = JSON.parse(limit.conditionval);
            if (condition.days) {
              last_day = `${this.moment(date.label)
                .subtract(condition.days, "days")
                .format("YYYYMMDD")}${
                condition.time ? condition.time.replace(/:/g, "") : "0000"
              }`;
            }
          }
          //每次预约时间段最多
          if (limit.conditioncode == "02") {
            this.limitNum = limit.conditionval;
          }
          //是否完成当前预约才可以再次预约
          if (limit.conditioncode == "03") {
            this.isFinish = limit.conditionval == "false" ? false : true;
          }
          //预约时间段是否是连续的
          if (limit.conditioncode == "04") {
            this.isContinue = limit.conditionval == "false" ? false : true;
          }
        });
        //资源使用的前几天停止预约
        if (condition.days && nowTime > last_day) {
          Dialog.alert({
            message: `在资源使用时间前${condition.days}天${condition.time}停止预约`
          }).then(() => {});
          return false;
        }
        // 是否完成当前预约才可以预约
        if (this.isFinish && this.hasOpointed) {
          Dialog.alert({
            message: `完成当前预约才可以再次预约`
          }).then(() => {});
          return false;
        }
        // 预约时间判断
        let st = time.st.replace(/:/g, ""),
          et = time.et.replace(/:/g, "");
        let yytime = this.resDetailData.yytime;
        let tapSt = `${date.label}${st}`,
          tapEnd = `${date.label}${et}`;
        let tapDate = date.label.replace(/-/g, "");
        let appointSt = `${yytime.startday}${yytime.starttime}`,
          appointEnd = `${yytime.endday}${yytime.endtime}`;
        //天  预约开始时间 结束时间
        if (yytime.timetype == "day") {
          if (nowTime < appointSt || nowTime > appointEnd) {
            Dialog.alert({
              message: `不在预约时间范围！`
            }).then(() => {});
            return false;
          }
        }
        //周 是否可以约下周的资源 周几去约下周一到周日的资源
        if (yytime.timetype == "week") {
          let nowWeek = this.moment().isoWeekday();
          let weekTime = this.moment().format("HHmm");
          let nowWeekTime = `${nowWeek}${weekTime}`;
          let monday1 = this.moment()
            .subtract(nowWeek - 1, "days")
            .format("YYYYMMDD"); //本周一
          let next_monday = this.moment(monday1)
            .subtract(-7, "days")
            .format("YYYYMMDD"); //下周一
          let next_sunday = this.moment(next_monday)
            .add(6, "days")
            .format("YYYYMMDD"); //周日日期
          if (tapDate < next_monday || tapDate > next_sunday) {
            Dialog.alert({
              message: `请预约下周的时间段`
            }).then(() => {});
            return false;
          }
          if (nowWeekTime < appointSt || nowWeekTime > appointEnd) {
            let weekArr = [
              "周一",
              "周二",
              "周三",
              "周四",
              "周五",
              "周六",
              "周日"
            ];

            let ws = this.moment(yytime.starttime, "hmm").format("HH:mm");
            let wf = this.moment(yytime.endtime, "hmm").format("HH:mm");
            let startWStr = weekArr[yytime.startday - 1],
              endWStr = weekArr[yytime.endday - 1];
            Dialog.alert({}).then(() => {});
            this.showMessage = `每次预约时间段的最多为${this.limitNum}个`;
            return false;
          }
        }
        //月 是否可以约下月的资源 几号去约下月的资源
        if (yytime.timetype == "month") {
          let today = parseInt(`${this.moment().format("DDHHmm")}`); //今天是几号
          let next_stM = this.moment()
            .month(this.moment().month() + 1)
            .startOf("month")
            .format("YYYYMMDD"); //下个月第一天
          let next_endM = this.moment()
            .month(this.moment().month() + 1)
            .endOf("month")
            .format("YYYYMMDD"); //下个月最后一天
          if (today < appointSt || today > appointEnd) {
            Dialog.alert({
              message: `请在每月${yytime.startday}日 ~ ${yytime.endday}日内预约下月`
            }).then(() => {});
            return false;
          }
          if (tapDate < next_stM || tapDate > next_endM) {
            Dialog.alert({
              message: `请选择${this.moment(next_stM).format(
                "YYYY-MM-DD"
              )} ~ ${this.moment(next_endM).format("YYYY-MM-DD")}范围内时间预约`
            }).then(() => {});

            return false;
          }
        }
        //判断是否是连续的预约时间段
        let notContinue = false;
        let mergeList = this.mergeTimes(this.opointTimes);
        mergeList.forEach(item => {
          if (
            item.usedate !== chooseTime.usedate ||
            chooseTime.starttime > item.endtime ||
            chooseTime.endtime < item.starttime
          ) {
            notContinue = true;
          }
        });
        if (this.isContinue && notContinue) {
          Dialog.alert({
            message: `预约的时间段必须连续`
          }).then(() => {});
          return false;
        }

        //每次预约时间段最多
        if (this.opointTimes.length + 1 > this.limitNum) {
          Dialog.alert({
            message: `每次预约时间段的最多为${this.limitNum}个`
          }).then(() => {});
          return false;
        }
      }
      let findIndex = this.opointTimes.findIndex(
        i =>
          i.usedate == chooseTime.usedate && i.starttime == chooseTime.starttime
      );
      if (findIndex > -1) {
        this.opointTimes.splice(findIndex, 1);
      } else {
        this.opointTimes.push(chooseTime);
      }
    },
    // 是否选中的状态
    isSelectedtime(time, date) {
      let isSelected = false;
      let t = {
        usedate: date.label,
        starttime: time.st,
        endtime: time.et
      };
      let isExit = this.opointTimes.some(
        i =>
          i.usedate == t.usedate &&
          i.starttime <= t.starttime &&
          i.endtime >= t.endtime
      );
      if (isExit) {
        isSelected = true;
      }
      return isSelected;
    },

    //资源时间比当前时间大的，不可约按钮展示
    isLaterTime(time, date) {
      let nowTime = parseInt(this.moment().format("YYYYMMDDHHmm"));
      let resTime = `${this.moment(date.label).format(
        "YYYYMMDD"
      )}${time.st.replace(/:/g, "")}`;
      if (nowTime <= resTime) {
        return true;
      }
    },

    // 可选择预约的时间区域
    isOpentime(time, date) {
      let openT = this.resDetailData.opentimes || [];
      let colseT = this.resDetailData.closetimes || [];
      let iSOpenTime = false,
        disableFlag = false;
      let nowTime = parseInt(this.moment().format("YYYYMMDDHHmm"));
      let resTime = `${this.moment(date.label).format(
        "YYYYMMDD"
      )}${time.st.replace(/:/g, "")}`;
      //超过当前时间置灰
      if (nowTime > resTime) {
        disableFlag = true;
      }
      //是否在不可约日期内
      colseT.map(close => {
        let colDay = this.moment(date.label).format("YYYYMMDDhhmmss");
        if (colDay >= close.starttime && colDay <= close.endtime) {
          disableFlag = true;
        }
      });
      //已经约满了 也不可选
      this.fullAppointList.map(full => {
        if (
          date.label == full.usedate &&
          time.st >= full.starttime &&
          time.et <= full.endtime
        ) {
          disableFlag = true;
        }
      });

      if (disableFlag) {
        return false;
      } else {
        openT.map(open => {
          //初始数据是周 判断日期 及对应时间
          if (open.cycletype == "week") {
            let weekday = this.moment(date.label).isoWeekday();
            if (
              open.cycleval == weekday &&
              open.starttime <= time.st &&
              open.endtime >= time.et
            ) {
              iSOpenTime = true;
            }
          }
        });
        return iSOpenTime;
      }
    },

    // 计算一天的时间（7:00 ~ 23:00)
    getTimes() {
      let arr = [];
      let time = this.moment()
        .hour(7)
        .minute(0);
      for (let i = 0; i < 32; i++) {
        let st = this.moment(time)
          .add(30 * i, "m")
          .format("HH:mm");
        let et = this.moment(time)
          .add(30 * (i + 1), "m")
          .format("HH:mm");
        arr.push({
          st: st,
          et: et
        });
      }
      this.dayTimes = arr;
    },

    // 添加已选择的时间
    addChooseTime(time, date) {
      let t = {
        usedate: date.label,
        starttime: time.st,
        endtime: time.et
      };
      let isExit = this.opointTimes.some(
        i =>
          i.usedate == t.usedate &&
          i.starttime <= t.starttime &&
          i.endtime >= t.endtime
      );
      if (isExit) {
        return;
      } else {
        this.opointTimes.push(t);
      }
    },

    // 合并时间
    mergeTimes(timeArr) {
      let arr = [];
      let sortArr = JSON.parse(JSON.stringify(timeArr));
      sortArr.sort((a, b) => {
        return a.starttime.replace(/:/g, "") > b.starttime.replace(/:/g, "")
          ? 1
          : -1;
      });
      sortArr.forEach(i => {
        let s_index = arr.findIndex(
          j => j.usedate == i.usedate && j.endtime == i.starttime
        );
        let e_index = arr.findIndex(
          j => j.usedate == i.usedate && j.starttime == i.endtime
        );
        if (s_index > -1) {
          arr[s_index].endtime = i.endtime;
        } else if (e_index > -1) {
          arr[e_index].starttime = i.starttime;
        } else {
          arr.push(Object.assign({}, i));
        }
      });
      return arr;
    },
    // 移除时间
    removeTime(startTime, day) {
      let st = startTime;
      let findIndex = this.opointTimes.findIndex(
        i => i.usedate == day && i.starttime == st
      );
      if (findIndex > -1) {
        this.opointTimes.splice(findIndex, 1);
      }
      let chooseTime = this.opointTimes;
      chooseTime = this.mergeTimes(chooseTime);
      this.mergedDate = chooseTime;
    },

    applyAppoint() {
      if (this.opointTimes.length) {
        let chooseTime = this.opointTimes;
        chooseTime = this.mergeTimes(chooseTime);
        this.mergedDate = chooseTime;
        this.$router.push({
          name: "appoint-apply",
          params: { opointData: this.mergedDate }
        });
      } else {
        Dialog.alert({
          message: "请先选择预约时间！"
        }).then(() => {});
        // this.$toast.fail("请先选择预约时间！");
      }
    },
    jumpDate() {
      this.$router.push({
        name: "select-calendar",
        params: { opointData: this.opointTimes }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-tab /deep/ .van-tabs__wrap.van-tabs__wrap--scrollable {
  margin-right: 32px;
}
.nav-tab /deep/ .van-tabs__content {
  margin-left: 8px;
}
.tab-title {
  display: flex;
  justify-content: center;
  flex-direction: column;

  .today {
    color: #3f86f7;
    font-weight: blod;
    font-size: 28px;
  }
  .tab-date {
    color: #474d51;
  }
  .tab-week {
    color: #7d7d80;
    text-align: center;
  }
}

.nav-tab /deep/ span.van-tab__text {
  padding-bottom: 12px;
  padding-top: 5px;
}
.van-tab__pane {
  margin-left: 10px;
}
.tab-content {
  margin-top: 24px;
  .selected {
    background: rgba(63, 134, 247, 0.06);
    border: 1px solid #3f86f7;
  }
  .van-button {
    width: 100px;
    padding: 0px !important;
    display: inline-block;
    border-radius: 10px;
    margin-bottom: 12px;
    margin-right: 10px;
  }
}
.time-table {
  padding: 0 20px;
  margin-bottom: 30px;
}

.big-btn {
  height: 88px;
  background: #3f86f7;
  margin: 32px 0;
  width: 100%;
}
.date-icon {
  position: absolute;
  right: 42px;
  top: -6px;
  width: 32px;
  height: 36px;
  i.iconfont {
    font-size: 96px;
    color: #999999;
  }
}
</style>