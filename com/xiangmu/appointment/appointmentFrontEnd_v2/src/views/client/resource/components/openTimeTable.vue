<template>
  <div class="table-container">
    <!--------------------------- 近一周时间 --------------------------->
    <div class="date-head">
      <span class="month-arrow">
        <i class="el-icon-arrow-left" @click="getRangeWeek('-')" v-show="isShowLeft"></i>
        {{formatYMD(start)}} - {{formatYMD(end)}}
        <i
          class="el-icon-arrow-right"
          @click="getRangeWeek('+')"
        ></i>
      </span>
    </div>
    <div class="date-table">
      <table>
        <!--------------------------- 表格标题行 --------------------------->
        <thead>
          <tr align="center">
            <th></th>
            <th v-for="(item) in dateLabels" :key="item.label" :rowspan="1">{{item.label}}</th>
          </tr>
          <tr align="center">
            <th></th>
            <th v-for="(item) in dateLabels" :key="item.label">{{item.week}}</th>
          </tr>
        </thead>
        <!--------------------------- 表格内容 --------------------------->
        <tbody>
          <tr v-for="(time,index) in dayTimes" :key="index">
            <!-- 第一列时间段 -->
            <th>{{time.st}}</th>
            <!-- 判断是否在开放时间区域内  -->
            <template v-for="(date,i) in appointTimeList">
              <th
                v-if="isFull(time,date)"
                class="drag-th closed"
                :key="i"
                :class="{
               'range-full': date.spanArr &&date.spanArr[index].val > 1}"
                :rowspan=" date.spanArr &&date.spanArr[index].val"
                v-show="date.spanArr &&date.spanArr[index].val"
              >
                <span>已约满</span>
              </th>
              <th
                v-else-if="isOpentime(time,date)"
                class="drag-th"
                :key="i"
                @mousedown="setDragStart(time,date,$event)"
                @mouseenter="dragMove(time,date,$event)"
                @mouseup="setDragEnd(time,date,$event)"
                :rowspan="date.spanArr &&date.spanArr[index].val"
                :class="{'selected': date.selectTimes&&date.selectTimes.map(j => j.starttime).includes(time.st), 'range': date.spanArr && date.spanArr[index].val > 1}"
                v-show="date.spanArr &&date.spanArr[index].val"
              >
                <span
                  v-if="date.selectTimes&&date.selectTimes.map(j => j.starttime).includes(time.st)"
                >{{date.spanArr[index].start}} ~ {{date.spanArr[index].end}}</span>
                <i
                  v-if="date.selectTimes&& date.selectTimes.map(j => j.starttime).includes(time.st)"
                  class="el-icon-close"
                  @click.stop="removeTime(date.spanArr &&date.spanArr[index].start,date.label)"
                ></i>
              </th>
              <th
                v-else
                class="drag-th closed"
                :key="i"
                :class="{
               'range': date.spanArr &&date.spanArr[index].val > 1}"
                :rowspan=" date.spanArr &&date.spanArr[index].val"
                v-show="date.spanArr &&date.spanArr[index].val"
              >
                <span>不可约</span>
              </th>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="center-btn">
      <el-button class="big-btn" type="primary" size="small" @click="applyAppoint">立即预约</el-button>
    </div>
    <!---------------------------- 预约申请弹窗 ---------------------------->
    <appoint-apply-dialog
      v-if="applyVisible"
      :dialogVisible.sync="applyVisible"
      class="fixed-dialog"
      :opointData="mergedDate"
      :resDetail="resDetailData"
      :applyFields="resDetailData.fields"
      ref="applyDialog"
      @doRemoveTime="removeTime"
      @doRefresh="refreshTable"
    ></appoint-apply-dialog>
  </div>
</template>

<script>
import appointApplyDialog from "./appointApplyDialog";
import { fetchResDetail, fetchHasAppoint } from "@/api/client/resources.js";
import { fetchAppointList } from "@/api/client/appoint";

export default {
  props: ["resId"],
  data() {
    return {
      dateLabels: [],
      start: this.moment().format("YYYY-MM-DD"),
      end: this.moment()
        .add(6, "days")
        .format("YYYY-MM-DD"),
      dayTimes: [], // 一天的时间
      isMouseDown: false,
      opointTimes: [], //选择预约的时间段
      applyVisible: false,
      resDetailData: {},
      mergedDate: [], // 弹框展示的合并后的时间段
      fullAppointList: [], //该资源下已经被约的时间段
      limitNum: 0, //每次预约时间段最多几个
      isFinish: false, //是否完成当前预约才可以再次预约
      isContinue: false, //预约时间段是否是连续的
      hasOpointed: false, //已经约的还在进行中的资源
      showMessage: ""
    };
  },
  components: {
    appointApplyDialog
  },
  computed: {
    isShowLeft() {
      let flag = this.start == this.moment().format("YYYY-MM-DD");
      return !flag;
    },
    //选中的预约时间
    appointTimeList() {
      let arr = [];
      this.dateLabels.forEach(table => {
        let obj = {
          label: table.label,
          selectTimes: this.opointTimes.filter(j => j.usedate == table.label)
        };
        arr.push(obj);
      });
      return arr;
    }
  },

  mounted() {
    let weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let dateArr = [];
    weekArr.forEach((item, index) => {
      dateArr.push({
        label: this.moment()
          .add(index, "days")
          .format("YYYY-MM-DD"),
        week:
          weekArr[
            this.moment()
              .add(index, "days")
              .weekday()
          ]
      });
    });
    this.dateLabels = dateArr;
    this.getResDetail();
    this.getTimes();
    this.getCenterAppoint();
  },

  methods: {
    //关闭预约成功弹框页面时，刷新表格
    refreshTable() {
      this.getHasAppointed();
      this.opointTimes = [];
    },
    //获取资源详情
    getResDetail() {
      let newRes = JSON.parse(sessionStorage.getItem("resData"));
      let params = {
        id: this.resId
      };
      fetchResDetail(params).then(res => {
        if (res.success) {
          this.resDetailData = res.data;
          this.getHasAppointed();
        }
      });
    },
    //格式化年月日
    formatYMD(day) {
      return this.moment(day).format("YYYY年MM月DD日");
    },

    //取得一周的时间
    getRangeWeek(type) {
      let weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let dateArr = [],
        fmStart,
        fmEnd,
        flagDay;
      //上一周
      if (type == "-") {
        fmStart = this.moment(this.start)
          .subtract(6, "days")
          .format("YYYY-MM-DD");
        fmEnd = this.moment(this.end)
          .subtract(6, "days")
          .format("YYYY-MM-DD");
        this.start = fmStart;
        this.end = fmEnd;
        flagDay = fmStart;
      } else {
        //下一周
        fmStart = this.moment(this.start)
          .add(6, "days")
          .format("YYYY-MM-DD");
        fmEnd = this.moment(this.end)
          .add(6, "days")
          .format("YYYY-MM-DD");
        this.start = fmStart;
        this.end = fmEnd;
        flagDay = fmStart;
      }
      weekArr.forEach((item, index) => {
        dateArr.push({
          label: this.moment(flagDay)
            .add(index, "days")
            .format("YYYY-MM-DD"),
          week:
            weekArr[
              this.moment()
                .add(index, "days")
                .weekday()
            ]
        });
      });
      this.dateLabels = dateArr;
      this.getHasAppointed();
    },

    //查询已被约的时间段 展示已约满
    getHasAppointed() {
      let arrLabels = [];
      this.dateLabels.forEach(item => {
        arrLabels.push(item.label.replace(/-/g, ""));
      });

      let id = this.resDetailData.id;
      let appointParam = {
        id: id,
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
          this.setRowSpan();
        }
      });
    },
    //是否已经约满
    isFull(time, date) {
      let flag = false;
      this.fullAppointList.map(full => {
        if (
          date.label == full.usedate &&
          time.st >= full.starttime &&
          time.et <= full.endtime
        ) {
          flag = true;
        }
      });
      return flag;
    },

    // 开放可预约的时间区域
    isOpentime(time, date) {
      let nowTime = parseInt(this.moment().format("YYYYMMDDHHmm"));
      let resTime = `${this.moment(date.label).format(
        "YYYYMMDD"
      )}${time.st.replace(/:/g, "")}`;
      //超过当前时间不可约
      if (nowTime > resTime) {
        return false;
      }

      let openT = this.resDetailData.opentimes || [];
      let colseT = this.resDetailData.closetimes || [];
      let iSOpenTime = false,
        disableFlag = false;
      //是否在不可约日期内
      colseT.map(close => {
        let colDay = this.moment(date.label).format("YYYYMMDDHHmmss");
        if (colDay >= close.starttime && colDay <= close.endtime) {
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
    // 开始拖拽
    setDragStart(time, date, event) {
      if (event.target.tagName == "I") return false;
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
        // this.$message({
        //   showClose: true,
        //   type: "warning",
        //   message: `在资源使用时间前${condition.days}天${condition.time}停止预约`
        // });
        this.showMessage = `在资源使用时间前${condition.days}天${condition.time}停止预约`;
        return false;
      }

      // 是否完成当前资源的预约才可以预约
      if (this.isFinish && this.hasOpointed) {
        // this.$message({
        //   showClose: true,
        //   type: "warning",
        //   message: `完成当前预约才可以再次预约`
        // });
        this.showMessage = `完成当前预约才可以再次预约`;
        return false;
      }
      // debugger;

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
          // this.$message({
          //   showClose: true,
          //   type: "warning",
          //   message: "不在预约时间范围！"
          // });
          this.showMessage = `不在预约时间范围！`;
          return false;
        }
      }
      //周 是否可以约下周的资源 周几去约下周一到周日的资源
      if (yytime.timetype == "week") {
        let nowWeek = this.moment().isoWeekday();
        let weekTime = this.moment().format("HHmm");
        let nowWeekTime = `${nowWeek}${weekTime}`;
        let dow = this.moment(tapDate).day();
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
          // this.$message({
          //   showClose: true,
          //   type: "warning",
          //   message: "请预约下周的时间段"
          // });
          this.showMessage = `请预约下周的时间段`;
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
          this.showMessage = `在每${startWStr} ${ws} ~ ${endWStr} ${wf} 预约下周哦`;

          // let weekTips = `在每${startWStr} ${ws} ~ ${endWStr} ${wf} 预约下周哦`;
          // this.$message({
          //   showClose: true,
          //   type: "warning",
          //   message: weekTips
          // });
          return false;
        }
      }
      //月 是否可以约下月的资源 几号去约下月的资源
      if (yytime.timetype == "month") {
        let today = parseInt(`${this.moment().format("DDHHmm")}`); //今天是几号

        let next_stM = this.moment()
          .month(this.moment().month() + 1)
          .startOf("month")
          .format("YYYYMMDD");
        let next_endM = this.moment()
          .month(this.moment().month() + 1)
          .endOf("month")
          .format("YYYYMMDD");
        if (today < appointSt || today > appointEnd) {
          this.showMessage = `请在每月${yytime.startday}日 ~ ${yytime.endday}日内预约下月`;
          // this.$message({
          //   showClose: true,
          //   type: "warning",
          //   message: `请在每月${yytime.startday}日 ~ ${yytime.endday}日内预约下月`
          // });
          return false;
        }

        if (tapDate < next_stM || tapDate > next_endM) {
          this.showMessage = `请选择${this.moment(next_stM).format(
            "YYYY-MM-DD"
          )} ~ ${this.moment(next_endM).format("YYYY-MM-DD")}范围内时间预约`;
          // this.$message({
          //   showClose: true,
          //   type: "warning",
          //   message: `请选择${this.moment(next_stM).format(
          //     "YYYY-MM-DD"
          //   )} ~ ${this.moment(next_endM).format("YYYY-MM-DD")}范围内时间预约`
          // });
          return false;
        }
      }

      this.isMouseDown = true;
      this.addChooseTime(time, date);
    },
    // 拖拽
    dragMove(time, date) {
      if (this.isMouseDown) {
        this.addChooseTime(time, date);
      }
    },
    // 停止拖拽
    setDragEnd(time, date) {
      console.log("1111stend");
      if (this.showMessage) {
        this.$message({
          showClose: true,
          type: "warning",
          message: `${this.showMessage}`
        });
      }
      this.showMessage = "";
      this.isMouseDown = false;
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
      //判断是否是连续的预约时间段
      let notContinue = false;
      let mergeList = this.mergeTimes(this.opointTimes);
      mergeList.forEach(item => {
        if (
          item.usedate !== t.usedate ||
          t.starttime > item.endtime ||
          t.endtime < item.starttime
        ) {
          notContinue = true;
        }
      });
      if (this.isContinue && notContinue) {
        this.showMessage = `预约的时间段必须连续`;
        // this.$message({
        //   showClose: true,
        //   type: "warning",
        //   message: `预约的时间段必须连续`
        // });
        return false;
      }

      //每次预约时间段最多
      if (this.opointTimes.length + 1 > this.limitNum) {
        this.showMessage = `每次预约时间段的最多为${this.limitNum}个`;
        // this.$message({
        //   showClose: true,
        //   type: "warning",
        //   message: `每次预约时间段的最多为${this.limitNum}个`
        // });
        return false;
      }

      if (isExit) {
        return;
      } else {
        this.opointTimes.push(t);
        this.setRowSpan();
      }
    },

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
        this.hasOpointed = hasOpointedList.some(i => i.resid == this.resId);
      });
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

    // 展示表格每行的时间合并情况
    setRowSpan() {
      this.appointTimeList.forEach((i, index) => {
        let spanArr = [];
        let position = 0;
        let timeArr = i.selectTimes.sort((a, b) => {
          return a.starttime > b.starttime ? 1 : -1;
        });
        this.dayTimes.forEach((j, j_index) => {
          let start = j.st;
          let end = j.et;
          if (timeArr.some(t => t.starttime <= start && t.endtime >= end)) {
            spanArr.push({
              val: 0,
              start: start,
              end: end
            });
            spanArr[position].end =
              spanArr[position + spanArr[position].val].end;
            spanArr[position].val += 1;
          } else {
            spanArr.push({
              val: 1,
              start: start,
              end: end
            });
            position = j_index + 1;
          }
        });
        i.spanArr = spanArr;
      });
    },

    // 移除时间
    removeTime(startTime, day) {
      let st = startTime;
      let findIndex = this.opointTimes.findIndex(
        i => i.usedate == day && i.starttime == st
      );
      if (findIndex > -1) {
        this.opointTimes.splice(findIndex, 1);

        this.setRowSpan();
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
        this.applyVisible = true;
      } else {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请先选择预约时间！"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table-container {
  padding: 0 20px;
  margin: 30px 0;
}
.date-head {
  width: 100%;
  height: 40px;
  background: #fafafa;
  display: block;
  text-align: center;
  line-height: 40px;
}
.month-arrow {
  cursor: pointer;
}
.popover-dialog-content {
  padding: 10px 0 10px 20px !important;
  p {
    margin-bottom: 10px;
  }
  .el-checkbox {
    display: block;
    margin-bottom: 10px;
  }
}
.date-table {
  margin-top: 20px;
  border-top: 1px solid #ebebeb;
  user-select: none;
  th {
    width: 130px;
    border: 1px solid #ebebeb;
    border-width: 0 1px;
    color: rgba(0, 0, 0, 0.65);
    padding: 4px 0;
    line-height: 22px;
  }
  tr:nth-child(even) {
    border-bottom: 1px solid #ebebeb;
  }
  thead {
    border-bottom: 1px solid #ebebeb;
    th {
      font-size: 14px;
      line-height: 22px;
      padding: 5px 0;
      img {
        width: 18px;
        height: 18px;
        vertical-align: sub;
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
  .drag-th {
    font-size: 12px;
    font-weight: 400;
    &.closed {
      background: #fafafa;
      border: 1px dashed #cccccc;
      span {
        color: #cccccc;
      }
    }

    &.selected {
      background: #f4f8ff;
    }
    &.selected {
      color: #3f86f7;
      position: relative;
      span {
        position: absolute;
        top: 6px;
        left: 6px;
      }
    }
    &.opened {
      background: #e6f7ff;
    }
    &.opened {
      position: relative;
      span {
        position: absolute;
        top: 6px;
        left: 6px;
      }
    }
    &.range {
      span {
        position: absolute;
        top: 6px;
        left: 6px;
      }
    }
    &.range-full {
      span {
        text-align: center;
        display: inline-block;
      }
    }
    i {
      cursor: pointer;
      position: absolute;
      top: 4px;
      right: 2px;
      font-size: 8px;
      color: #3f86f7;
    }
  }
}
.big-popover-dialog {
  .popover-dialog-title {
    text-align: left;
    padding-left: 24px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
}

.big-btn {
  width: 240px;
  height: 60px;
  background: #3f86f7;
  box-shadow: 0px 8px 16px 0px rgba(63, 134, 247, 0.24);
  border-radius: 30px;
  margin-bottom: 90px;
  margin-top: 30px;
}
.center-btn {
  text-align: center;
}
</style>