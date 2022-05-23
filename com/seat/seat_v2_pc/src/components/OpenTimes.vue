<template>
  <div class="time-table">
    <el-button class="setTime" type="primary" size="small" @click="handleSet">设置开放时间段</el-button>
    <!-- 可拖拽选择的时间表格 -->
    <ul class="time-ul">
      <li v-for="item in openTimesData" :key="item.label">
        <label class="time-ul-title">{{item.label}}</label>
        <span class="time-ul-content" v-for="(t,i) in item.times" :key="i">
          <span>{{t.starttime}} ~ {{t.endtime}}</span>
        </span>
      </li>
    </ul>
    <!---------------------------- 弹窗 ---------------------------->
    <el-dialog
      class="base-dialog"
      title="时间设定"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      v-if="dialogVisible"
      width="1200px"
    >
      <div class="date-table">
        <table>
          <!--------------------------- 表格标题行 --------------------------->
          <thead>
            <tr align="center">
              <th></th>
              <th v-for="(item) in dateLabels" :key="item.label">{{item.label}}</th>
            </tr>
          </thead>
          <!--------------------------- 表格内容 --------------------------->
          <tbody>
            <tr v-for="(item,index) in times" :key="index">
              <th>{{item.starttime}}</th>
              <th
                class="drag-th"
                v-for="(date,i) in openTimeList"
                :key="i"
                :class="{'selected': date.times.map(j => j.starttime).includes(item.starttime), 'range': date.spanArr[index].val > 1}"
                :rowspan="date.spanArr[index].val"
                v-show="date.spanArr[index].val"
                @mousedown="setDragStart(item,date,$event)"
                @mouseenter="dragMove(item,date,$event)"
                @mouseup="setDragEnd(item,date,$event)"
              >
                <span
                  v-if="date.times.map(j => j.starttime).includes(item.starttime)"
                >{{date.spanArr[index].start}} ~ {{date.spanArr[index].end}}</span>
                <i
                  v-if="date.times.map(j => j.starttime).includes(item.starttime)"
                  class="el-icon-close"
                  @click="removeTime(index,date)"
                ></i>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="handleSure">确定</el-button>
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    tableTimes: Array
  },
  data() {
    return {
      closeTimes: [],
      condition: {},
      cancel: {},
      dialogVisible: false,
      editForm: {
        startTime: "",
        endTime: ""
      },
      rules: {
        startTime: [
          { required: true, message: "请输入开始时间！", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "请输入结束时间！", trigger: "change" }
        ]
      },
      curCol: null,
      isEdit: false,
      dateLabels: [
        { id: 1, label: "周一" },
        { id: 2, label: "周二" },
        { id: 3, label: "周三" },
        { id: 4, label: "周四" },
        { id: 5, label: "周五" },
        { id: 6, label: "周六" },
        { id: 7, label: "周日" }
      ],
      times: [], // 一天的时间
      isMouseDown: false,
      openTimes: [] // 最终合并的时间
    };
  },

  computed: {
    // 一周每天的开放时间数组 弹框
    openTimeList() {
      let arr = [];
      this.dateLabels.forEach(i => {
        let obj = {
          id: i.id,
          label: i.label,
          times: this.openTimes.length
            ? this.openTimes.filter(j => j.weekno == i.id)
            : []
        };
        arr.push(obj);
      });
      return arr;
    },
    // 一周开放时间 外层
    openTimesData() {
      let arr = [];
      this.dateLabels.forEach(i => {
        let times = this.openTimes.filter(j => j.weekno == i.id);
        times.sort((a, b) => {
          return a.starttime > b.starttime ? 1 : -1;
        });
        let obj = {
          weekno: i.id,
          label: i.label,
          times: times
        };
        arr.push(obj);
      });

      return arr;
    }
  },
  watch: {
    tableTimes() {
      let timesArr = _.cloneDeep(this.tableTimes);
      timesArr.forEach(item => {
        item.starttime = this.moment(item.starttime, "HHmm").format("HH:mm");
        item.endtime = this.moment(item.endtime, "HHmm").format("HH:mm");
      });
      this.openTimes = timesArr;
    }
  },

  methods: {
    // 计算一天的时间（0:00 ~ 23:00)
    getTimes() {
      let arr = [];
      let time = this.moment()
        .hour(0)
        .minute(0);
      for (let i = 0; i < 48; i++) {
        let starttime = this.moment(time)
          .add(30 * i, "m")
          .format("HH:mm");
        let endtime = this.moment(time)
          .add(30 * (i + 1), "m")
          .format("HH:mm");
        arr.push({
          starttime: starttime,
          endtime: endtime
        });
      }
      this.times = arr;
    },
    handleSet() {
      this.getTimes();
      this.setRowSpan();
      this.dialogVisible = true;
    },
    // 开始拖拽
    setDragStart(time, date) {
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
      this.isMouseDown = false;
    },
    // 添加已选择的时间
    addChooseTime(time, date) {
      let t = {
        weekno: date.id,
        starttime: time.starttime,
        endtime: time.endtime
      };
      let isExit = this.openTimes.some(
        i =>
          i.weekno == t.weekno &&
          i.starttime <= t.starttime &&
          i.endtime >= t.endtime
      );
      if (isExit) {
        return;
      } else {
        this.openTimes.push(t);
        this.openTimes = this.mergeTimes(this.openTimes);
        this.setRowSpan();
      }
    },

    // 合并时间
    mergeTimes(timeArr) {
      let arr = [];
      timeArr.forEach(i => {
        let s_index = arr.findIndex(
          j => j.weekno == i.weekno && j.endtime == i.starttime
        );
        let e_index = arr.findIndex(
          j => j.weekno == i.weekno && j.starttime == i.endtime
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

    // 设置表格每行的合并列
    setRowSpan() {
      this.openTimeList.forEach((i, index) => {
        let spanArr = [];
        let position = 0;
        let timeArr = i.times.sort((a, b) => {
          return a.starttime > b.starttime ? 1 : -1;
        });
        this.times.forEach((j, j_index) => {
          let start = j.starttime;
          let end = j.endtime;
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
    removeTime(time_index, date) {
      let weekno = date.id;
      let starttime = date.spanArr[time_index].start;
      // 从openTimes中移除该时间
      let findIndex = this.openTimes.findIndex(
        i => i.weekno == weekno && i.starttime == starttime
      );
      if (findIndex > -1) {
        this.openTimes.splice(findIndex, 1);
        this.setRowSpan();
      }
    },

    // 保存时间
    handleSure() {
      this.openTimes = this.mergeTimes(this.openTimes);
      this.dialogVisible = false;
    },

    //删除时间段
    deleteTime(item, t) {
      let newList = this.openTimes.filter(
        v =>
          !(
            v.weekno == t.weekno &&
            v.starttime == t.starttime &&
            v.endtime == t.endtime
          )
      );
      this.openTimes = _.cloneDeep(newList);
    }
  }
};
</script>

<style lang="scss" scoped>
.time-table {
  background: #ffffff;
  .setTime {
    margin-top: 24px;
    margin-left: 24px;
  }
  ul.time-ul {
    background: #ffffff;
    padding: 20px 24px 40px 24px;
    border-radius: 4px 4px 0px 0px;
    min-width: 1180px;
    li {
      display: inline-table;
      width: 156px;
      border: 1px solid #ebebeb;
      margin-left: -1px;
      label,
      span {
        text-align: center;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        display: inline-block;
        width: 100%;
      }
      .time-ul-title {
        font-size: 16px;
        color: #666666;
        line-height: 40px;
        background: #fafafa;
        border-bottom: 1px solid #eeeeee;
      }
      .time-ul-content {
        position: relative;
        line-height: 56px;
        border-bottom: 1px solid #eeeeee;
        span {
          position: relative;
        }
        i.el-icon-plus {
          font-size: 24px;
          color: #999999;
        }
        i.el-icon-edit {
          position: absolute;
          color: #3d7fff;
          top: 70%;
          left: 25%;
          cursor: pointer;
        }
        i.el-icon-delete {
          position: absolute;
          color: #3d7fff;
          top: 70%;
          left: 50%;
          cursor: pointer;
        }
      }
    }
  }
  .mg-10 {
    margin: 0 10px;
  }
}

.date-table {
  margin-top: 10px;
  border-top: 1px solid #ebebeb;
  user-select: none;
  th {
    width: 150px;
    border: 1px solid #ebebeb;
    border-width: 0 1px;
    color: rgba(0, 0, 0, 0.65);
    padding: 4px 0;
    font-weight: normal;
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
    c &:hover,
    &.selected {
      background: #d9e6ff;
    }
    &.selected {
      position: relative;
      span {
        position: absolute;
        top: 4px;
        right: 30px;
        color: #3d7fff;
      }
    }
    &.range {
      span {
        position: absolute;
        top: 8px;
        right: 30px;
        color: #3d7fff;
      }
    }
    i {
      cursor: pointer;
      position: absolute;
      top: 4px;
      right: 2px;
      font-size: 8px;
      color: #333;
    }
  }
}
</style>