<template>
  <div class="main">
    <!--------------------------- 资源的不可用日期 --------------------------->
    <div class="item">
      <h3 class="title">资源的不可用日期</h3>
      <div class="content close-times">
        <span v-if="closeTimesList.length == 0" style="color:#595959;">暂无不可用日期</span>
        <span class="time" v-for="(time,index) in closeTimesList" :key="index">
          {{ time.start == time.end ? time.start : time.start + " ~ " + time.end }}
        </span>
      </div>
    </div>
    <!--------------------------- 资源的开放时间 --------------------------->
    <div class="item">
      <h3 class="title">资源的开放时间</h3>
      <div class="content open-times clearfix">
        <span v-if="openTimes.length == 0" style="color:#595959;">暂无开放时间</span>
        <!-- 表格 -->
        <ul class="time-ul" v-if="openTimes.length > 0">
          <li v-for="item in openTimesData" :key="item.label">
            <div class="time-ul-title">{{item.label}}</div>
            <div
              class="time-ul-content"
              v-for="(t,i) in item.times"
              :key="i"
            >{{t.starttime}} ~ {{t.endtime}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!--------------------------- 预约时间 --------------------------->
    <div class="item">
      <h3 class="title">预约时间</h3>
      <div class="content">
        <appoint-time ref="yyTime"></appoint-time>
      </div>
    </div>
    <!--------------------------- 多人预约 --------------------------->
    <div class="item">
      <h3 class="title">多人预约</h3>
      <div class="content conditions">
        <div class="conditions-item">
          <p v-if="!hasRulePerson">未启用</p>
          <p v-else>最少添加{{rulePerson.minPerson}}人</p>
        </div>
        <div v-if="hasRulePerson" class="conditions-item">
          <p v-if="rulePerson.checkinType == '1'">只需要预约人签到</p>
          <p v-else>所有人都需要签到</p>
        </div>
      </div>
    </div>
    <!--------------------------- 预约限制条件 --------------------------->
    <div class="item">
      <h3 class="title">预约限制条件</h3>
      <div class="content conditions">
        <div class="conditions-item">
          <p>在资源使用时间前 {{condition.days}} 天的 {{condition.time}} 停止预约</p>
          <p>每次预约时间段最多 {{condition.maxNum}} 个</p>
          <p v-if="condition.mustFinish">完成当前预约才可以再次预约</p>
          <p v-if="condition.mustContinue">预约的时间段必须连续</p>
        </div>
      </div>
    </div>
    <!--------------------------- 取消预约 --------------------------->
    <div class="item">
      <h3 class="title">取消预约</h3>
      <div class="content conditions">
        <div class="conditions-item">
          <p>资源使用时间开始前 {{cancel.cancelval}}{{cancel.cancelunit == "minute" ? "分钟" : "小时"}} 可以取消预约</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppointTime from "./appointTime";
export default {
  components: {
    AppointTime
  },
  props: {
    resDetail: Object
  },
  data() {
    return {
      closeTimes: [],
      openTimes: [],
      condition: {},
      cancel: {},
      rulePerson: {},
    };
  },
  computed: {
    // 多人预约
    hasRulePerson() {
      return this.rulePerson && Object.keys(this.rulePerson).length
    },
    // 关闭时间
    closeTimesList() {
      return this.closeTimes.map(i => {
        return {
          start: this.util.formatTime(i.starttime, "MM-dd"),
          end: this.util.formatTime(i.endtime, "MM-dd")
        };
      });
    },
    // 一周开放时间
    openTimesData() {
      let labels = [
        { id: 1, label: "周一" },
        { id: 2, label: "周二" },
        { id: 3, label: "周三" },
        { id: 4, label: "周四" },
        { id: 5, label: "周五" },
        { id: 6, label: "周六" },
        { id: 7, label: "周日" }
      ];
      let arr = [];
      labels.forEach(i => {
        let times = this.openTimes.filter(j => j.cycleval == i.id);
        times.sort((a, b) => {
          return a.starttime > b.starttime ? 1 : -1;
        });
        let obj = {
          id: i.id,
          label: i.label,
          times: times
        };
        arr.push(obj);
      });
      return arr;
    }
  },
  watch: {
    resDetail() {
      this.closeTimes = this.resDetail.closetimes;
      this.openTimes = this.resDetail.opentimes;
      this.setYyTime();
      this.setCondition();
      this.cancel = this.resDetail.cancel;
      this.rulePerson = this.resDetail.rulePerson;
    }
  },
  methods: {
    // 初始设置预约时间
    setYyTime() {
      let time = this.resDetail.yytime;
      if (time) {
        let yy = this.$refs.yyTime;
        yy.timetype = time.timetype;
        yy.startday = time.startday;
        yy.endday = time.endday;
        yy.starttime = time.starttime;
        yy.endtime = time.endtime;
      }
    },
    // 初始设置限制条件
    setCondition() {
      let data = this.resDetail.conditions;
      data.forEach(i => {
        switch (i.conditioncode) {
          case "01":
            let data = i.conditionval ? JSON.parse(i.conditionval) : {};
            this.condition.days = data.days;
            this.condition.time = data.time;
            break;
          case "02":
            this.condition.maxNum = i.conditionval;
            break;
          case "03":
            this.condition.mustFinish = i.conditionval == "true" ? true : false;
            break;
          case "04":
            this.condition.mustContinue =
              i.conditionval == "true" ? true : false;
            break;
        }
      });
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
}
.close-times {
  padding: 20px 0 0 10px;
  .time,
  .add {
    display: inline-block;
    padding: 2px 8px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
    margin-bottom: 6px;
  }
  .time {
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 2px;
    margin-right: 10px;
    i {
      margin-left: 10px;
      font-size: 8px;
      cursor: pointer;
    }
  }
}
.time-text {
  margin-left: 10px;
  color: #3f86f7;
  cursor: pointer;
}

.open-times {
  padding: 10px 0 0 10px;
  ul.time-ul {
    margin: 10px 0 30px;
    li {
      float: left;
      width: 14.4%;
      border: 1px solid #ebebeb;
      border-width: 1px 1px 0 1px;
      margin-left: -1px;
      div {
        padding: 5px 0;
        text-align: center;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }
      .time-ul-title {
        font-size: 14px;
        border-bottom: 1px solid #ebebeb;
      }
      .time-ul-content {
        position: relative;
        border-bottom: 1px solid #ebebeb;
      }
    }
  }
}

.conditions {
  padding: 20px 0 0;
  .conditions-item {
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 10px;
    p {
      padding-left: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>