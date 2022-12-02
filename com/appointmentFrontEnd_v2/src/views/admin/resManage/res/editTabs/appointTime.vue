<template>
  <div class="yy-times">
    <el-radio-group v-model="timetype">
      <el-radio label="day">天</el-radio>
      <el-radio label="week">周</el-radio>
      <el-radio label="month">月</el-radio>
      <el-radio label="none">不限制</el-radio>
    </el-radio-group>
    <div class="yy-times-content" v-if="timetype !== 'none'">
      <!-- 天 -->
      <div v-if="timetype == 'day'">
        <div style="margin-bottom:10px;">
          <span>开始时间：</span>
          <el-date-picker
            v-model="startdayday"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
            size="small"
            style="margin:0 5px;width: 160px;"
            @change="enddayday=null;"
          ></el-date-picker>
          <el-time-select
            v-model="startdaytime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45'}"
            placeholder="选择时间"
            size="small"
            style="width:100px;margin:0 5px;"
            @change="resetEndTime"
          ></el-time-select>
          <span>开始</span>
        </div>
        <div>
          <span>截止时间：</span>
          <el-date-picker
            v-model="enddayday"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
            size="small"
            style="margin:0 5px;width: 160px;"
            :picker-options="pickerOptions"
            @change="resetEndTime"
          ></el-date-picker>
          <el-time-select
            v-model="enddaytime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45', minTime: minDayTime}"
            placeholder="选择时间"
            size="small"
            style="width:100px;margin:0 5px;"
          ></el-time-select>
          <span>截止</span>
        </div>
      </div>
      <!-- 周 -->
      <div v-if="timetype == 'week'">
        <div style="margin-bottom:10px;">
          <span style="margin-right: 5px;">开始时间：在每</span>
          <el-select v-model="startweekday" size="small" @change="endweekday=null;" clearable>
            <el-option v-for="item in weekList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-time-select
            v-model="startweektime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45'}"
            placeholder="选择时间"
            size="small"
            style="width:100px;margin:0 5px;"
            @change="resetEndWeekTime"
          ></el-time-select>
          <span>开始预约下周</span>
        </div>
        <div>
          <span style="margin-right: 5px;">截止时间：在每</span>
          <el-select v-model="endweekday" size="small" @change="resetEndWeekTime" clearable>
            <el-option
              v-for="item in newWeekList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-time-select
            v-model="endweektime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45',minTime: minWeekTime}"
            placeholder="选择时间"
            size="small"
            style="width:100px;margin:0 5px;"
          ></el-time-select>
          <span>停止预约下周</span>
        </div>
      </div>
      <!-- 月 -->
      <div v-if="timetype == 'month'">
        <div style="margin-bottom:10px;">
          <span style="margin-right: 5px;">开始时间：在每月</span>
          <el-select v-model="startmonthday" size="small" @change="endmonthday=null;" clearable>
            <el-option v-for="item in dayList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-time-select
            v-model="startmonthtime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45'}"
            placeholder="选择时间"
            size="small"
            style="width:100px;margin:0 5px;"
            @change="resetEndMonthTime"
          ></el-time-select>
          <span>开始预约下月</span>
        </div>
        <div>
          <span style="margin-right: 5px;">截止时间：在每月</span>
          <el-select v-model="endmonthday" size="small" @change="resetEndMonthTime">
            <el-option
              v-for="item in newDayList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-time-select
            v-model="endmonthtime"
            :picker-options="{start: '00:00',step: '00:15',end: '23:45',minTime: minMonthTime}"
            placeholder="选择时间"
            size="small"
            style="width:100px;margin:0 5px;"
          ></el-time-select>
          <span>停止预约下月</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    identify: String
  },
  data() {
    return {
      timetype: "none",
      startdayday: null,
      enddayday: null,
      startdaytime: null,
      enddaytime: null,
      startweekday: null,
      endweekday: null,
      startweektime: null,
      endweektime: null,
      startmonthday: null,
      endmonthday: null,
      startmonthtime: null,
      endmonthtime: null,
      weekList: [
        { id: "1", name: "周一" },
        { id: "2", name: "周二" },
        { id: "3", name: "周三" },
        { id: "4", name: "周四" },
        { id: "5", name: "周五" },
        { id: "6", name: "周六" },
        { id: "7", name: "周日" }
      ],
      dayList: [],
      pickerOptions: {
        // 结束时间大于开始时间
        disabledDate: time => {
          let s = this.startdayday;
          if (s) {
            return (
              time.getTime() < new Date(this.moment(s, "YYYYMMDD")).getTime()
            );
          }
        }
      }
    };
  },
  computed: {
    // 最小时间点
    minDayTime() {
      if (this.startdayday == this.enddayday) {
        return this.startdaytime;
      }
    },
    // 周最小时间点
    minWeekTime() {
      if (this.startweekday == this.endweekday) {
        return this.startweektime;
      }
    },
    // 月最小时间点
    minMonthTime() {
      if (this.startmonthday == this.endmonthday) {
        return this.startmonthtime;
      }
    },
    newWeekList() {
      let arr = this.weekList;
      if (this.startweekday) {
        arr = this.weekList.filter(i => i.id >= this.startweekday);
      }
      return arr;
    },
    newDayList() {
      let arr = this.dayList;
      if (this.startmonthday) {
        arr = this.dayList.filter(
          i => parseInt(i.id) >= parseInt(this.startmonthday)
        );
      }
      return arr;
    }
  },
  methods: {
    // 改变截止时间点
    resetEndTime() {
      if (this.startdayday == this.enddayday) {
        this.enddaytime = null;
      }
    },
    // 改变周时间点
    resetEndWeekTime() {
      if (this.startweekday == this.endweekday) {
        this.endweektime = null;
      }
    },
    // 改变月时间点
    resetEndMonthTime() {
      if (this.startmonthday == this.endmonthday) {
        this.endmonthtime = null;
      }
    },
    // 获取每月31天
    getDayList() {
      let arr = [];
      for (let i = 1; i <= 31; i++) {
        arr.push({ id: `${i}`, name: `${i}日` });
      }
      this.dayList = arr;
    }
  },
  mounted() {
    this.getDayList();
  }
};
</script>

<style lang="scss" scoped>
.yy-times {
  padding: 20px 10px 0;
  .el-radio {
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 10px;
    margin-right: 20px;
  }
  .yy-times-content {
    background: #fafafa;
    padding: 10px;
    font-size: 14px;
    color: #595959;
  }
}
</style>