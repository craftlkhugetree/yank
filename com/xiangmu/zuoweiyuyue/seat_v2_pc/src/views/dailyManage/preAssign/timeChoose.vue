<template>
  <el-dialog
    class="common-dialog"
    title="选择时间段"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="dialogVisible = false"
    width="auto"
    
    :show-close="false"
  >
    <el-tabs v-if="isToday || isDay" v-model="activeName" @tab-click="nth">
      <el-tab-pane :name="isToday ? 'today' : startdate">
        <span slot="label" v-if="isToday">
          <h4>今天</h4>
          <p>{{ nowMonthDay }}</p>
        </span>
        <span slot="label" v-if="isDay">
          <h4>
            周{{
              v0.weekno == "1"
                ? "一"
                : v0.weekno == "2"
                ? "二"
                : v0.weekno == "3"
                ? "三"
                : v0.weekno == "4"
                ? "四"
                : v0.weekno == "5"
                ? "五"
                : v0.weekno == "6"
                ? "六"
                : "日"
            }}
          </h4>
          <p>{{ startdate }}</p>
        </span>
        <ul class="timeDetail clearfix" id="timeDetail">
          <li
            class="li-box"
            @click="selectAll('')"
            :class="{ selected: isAll }"
          >
            全选
          </li>
          <li
            v-for="(v, i) in canCancleTime"
            :key="i"
            @click="selectSingle(v)"
            class="li-box"
            :class="{ selected: v.selected }"
          >
            {{ v.starttime.substring(0, 2) }}:{{
              v.starttime.substring(2, 4)
            }}～{{ v.endtime.substring(0, 2) }}:{{ v.endtime.substring(2, 4) }}
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-else @tab-click="tabChange" v-model="activeName">
      <el-tab-pane
        :label="v[0].weekno + ''"
        :name="i + ''"
        v-for="(v, i) in weekTime"
        :key="i"
      >
        <span slot="label">
          <h4>
            周{{
              v[0].weekno == "1"
                ? "一"
                : v[0].weekno == "2"
                ? "二"
                : v[0].weekno == "3"
                ? "三"
                : v[0].weekno == "4"
                ? "四"
                : v[0].weekno == "5"
                ? "五"
                : v[0].weekno == "6"
                ? "六"
                : "日"
            }}
          </h4>
          <p>{{ v[0].weekday }}</p>
        </span>
        <ul class="timeDetail clearfix" id="timeDetail">
          <li
            @click="selectAll('appoint')"
            :class="{ selected: isAll }"
            class="li-box"
          >
            全选
          </li>
          <li
            class="li-box"
            v-for="(d, j) in v"
            :key="j"
            @click="selectSingle(d, 'appoint')"
            :class="{ selected: d.selected }"
          >
            {{ d.starttime.substring(0, 2) }}:{{
              d.starttime.substring(2, 4)
            }}～{{ d.endtime.substring(0, 2) }}:{{ d.endtime.substring(2, 4) }}
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitTime">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { queryOpenTime } from "@/api/manage/section";
export default {
  props: {
    startdate: String,
    enddate: String,
    selectTimes: Array,
  },
  data() {
    return {
      activeName: "",
      dialogVisible: false,
      nowMonthDay: "",
      canCancleTime: [],
      isAll: false,
      timeLis: [], //预约tab切换的时间数组
      weekTime: [],
      row: null,
      seat: null,
      v0: {},
    };
  },
  computed: {
    isToday() {
      let today = new Date();
      return this.transTime(today, "YYYY-MM-DD") === this.startdate;
    },
    isDay() {
      return this.startdate === this.enddate;
    },
  },
  methods: {
    cancel() {
      this.timeLis = [];
      this.dialogVisible = false;
      this.activeName = "";
      this.weekTime = [];
      this.canCancleTime = [];
      this.isAll = false;
    },
    submitTime() {
      this.canCancleTime =
        this.weekTime.length > 0 ? this.weekTime.flat() : this.canCancleTime;
      this.$emit("submit", _.cloneDeep(this.canCancleTime));
      this.cancel();
    },
    nth(tab) {},
    setActive() {
      this.activeName = this.isToday
        ? "today"
        : this.isDay
        ? this.startdate
        : "0";
    },
    transTime(date, fmt) {
      return this.moment(date).format(fmt);
    },
    queryOpenTime(row, seat, startdate, enddate) {
      this.row = row;
      this.seat = seat;
      const param = {
        enddate,
        sectionid: row.id,
        seatid: seat && seat.id,
        startdate,
        type: "1",
      };
      queryOpenTime(param).then((res) => {
        if (res && res.success) {
          if (res.data.length === 0) {
            this.$message({
              type: "warning",
              message: "暂无可预约的时间段",
            });
          } else {
            this.dialogVisible = true;
            this.genData();
            if (this.row.orderunit === "week") {
              this.weekTime = [];
              let d = new Date();
              let gap = (7 - d.getDay()) % 7;
              res.data.forEach((r) => {
                r.weekday = this.moment(d)
                  .add("days", gap + r.weekno)
                  .format("YYYY-MM-DD");
                this.weekTime[r.weekno - 1]
                  ? this.weekTime[r.weekno - 1].push(r)
                  : (this.weekTime[r.weekno - 1] = [r]);
              });
              this.weekTime.forEach((arr) => {
                arr.forEach((r) => {
                  for (let s of this.selectTimes) {
                    if (s.id === r.id && s.selected) {
                      r.selected = true;
                      break;
                    }
                  }
                });
              });
              this.weekTime = _.cloneDeep(this.weekTime);
              this.timeLis = this.weekTime[0] || [];
              this.isAll = this.timeLis.every(t => t.selected);
            } else {
              let num = 0;
              this.canCancleTime = res.data.map((r) => {
                for (let s of this.selectTimes) {
                  if (s.id === r.id && s.selected) {
                    r.selected = true;
                    num++;
                    break;
                  }
                }
                return r;
              });
              if (num === this.canCancleTime.length) {
                this.isAll = true;
              }
              this.v0 = { ...this.canCancleTime[0] };
            }
          }
        } else {
          this.$message({
            type: "warning",
            message: res.message || res.data.message,
          });
        }
      });
    },
    selectAll(type) {
      if (!type) {
        this.isAll = !this.isAll;
        this.canCancleTime.forEach((e) => {
          if (this.isAll) {
            e.selected = true;
          } else {
            e.selected = false;
          }
        });
      } else {
        this.isAll = !this.isAll;
        this.timeLis.forEach((e) => {
          if (this.isAll) {
            e.selected = true;
          } else {
            e.selected = false;
          }
        });
      }
    },
    selectSingle(item, type) {
      if (!type) {
        item.selected = !item.selected;
        var index = this.canCancleTime.findIndex((item) => !item.selected);
        if (index == -1) {
          //表示全选
          this.isAll = true;
        } else {
          this.isAll = false;
        }
        this.$forceUpdate();
      } else {
        //预约
        item.selected = !item.selected;
        var index = this.timeLis.findIndex((item) => !item.selected);
        if (index == -1) {
          //表示全选
          this.isAll = true;
        } else {
          this.isAll = false;
        }
        this.$forceUpdate();
      }
    },
    tabChange(ob) {
      this.timeLis = this.weekTime[ob.name];
      var index = this.timeLis.findIndex((item) => !item.selected);
      if (index == -1) {
        //表示全选
        this.isAll = true;
      } else {
        this.isAll = false;
      }
      this.$forceUpdate()
    },
    genData() {
      this.nowMonthDay = this.moment(new Date()).format("YYYY-MM-DD");
      this.setActive();
    },
  },
};
</script>
<style scoped lang="scss">
.timeDetail {
  width: 100%;
  padding: 60px 30px;
  box-sizing: border-box;
  margin-bottom: 80px;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
}

.li-box {
  width: 150px;
  height: 40px;
  background: #eeeeee;
  border-radius: 8px;
  border: 1px solid #eeeeee;
  font-size: 15px;
  font-weight: 400;
  color: #333333;
  line-height: 40px;
  text-align: center;
  float: left;
  margin-right: 30px;
  margin-bottom: 30px;
  cursor: pointer;
}
.selected {
  background: #ffecd6;
  border: 1px solid #ffa033;
  color: #ffa033;
}

/deep/ .el-tabs__active-bar {
  background-color: #ffa033;
}
/deep/ .el-tabs__nav {
  span {
    text-align: center;
  }
}
</style>
