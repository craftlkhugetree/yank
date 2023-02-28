<template>
  <div class="yy-times">
    <div v-if="timetype == 'none'">
      <span>不限制</span>
    </div>
    <div v-else>
      <p>
        <span v-if="timetype == 'day'">开始时间：{{sd}} {{st}} 开始</span>
        <span v-if="timetype == 'week'">开始时间：在每 {{sd}} {{st}} 开始预约下周</span>
        <span v-if="timetype == 'month'">开始时间：在每月 {{sd}} 日 {{st}} 开始预约下月</span>
      </p>
      <p>
        <span v-if="timetype == 'day'">截止时间：{{ed}} {{et}} 截止</span>
        <span v-if="timetype == 'week'">截止时间：在每 {{ed}} {{et}} 停止预约下周</span>
        <span v-if="timetype == 'month'">截止时间：在每月 {{ed}} 日 {{et}} 停止预约下月</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timetype: "none",
      startday: null,
      endday: null,
      starttime: null,
      endtime: null,
      weekList: [
        { id: "1", name: "周一" },
        { id: "2", name: "周二" },
        { id: "3", name: "周三" },
        { id: "4", name: "周四" },
        { id: "5", name: "周五" },
        { id: "6", name: "周六" },
        { id: "7", name: "周日" }
      ]
    };
  },
  computed: {
    sd() {
      if (this.startday) {
        if (this.timetype == "day") {
          return this.moment(this.startday, "YYYYMMDD").format("YYYY-MM-DD");
        } else if (this.timetype == "week") {
          return this.weekList.filter(i => i.id == this.startday)[0].name;
        } else if (this.timetype == "month") {
          return this.startday;
        }
      } else {
        return "--";
      }
    },
    ed() {
      if (this.endday) {
        if (this.timetype == "day") {
          return this.moment(this.endday, "YYYYMMDD").format("YYYY-MM-DD");
        } else if (this.timetype == "week") {
          return this.weekList.filter(i => i.id == this.endday)[0].name;
        } else if (this.timetype == "month") {
          return this.endday;
        }
      } else {
        return "--";
      }
    },
    st() {
      if (this.startday && this.starttime) {
        return this.moment(this.starttime, "hhmm").format("HH:mm");
      } else return "";
    },
    et() {
      if (this.endday && this.endtime) {
        return this.moment(this.endtime, "hhmm").format("HH:mm");
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.yy-times {
  padding: 20px 10px 0;
  font-size: 14px;
  color: #595959;
}
p {
  margin-bottom: 10px;
}
</style>