<template>
  <el-drawer
    class="base-drawer"
    title="资源的开放时间"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    v-loading="drawerLoading"
    size="840px"
  >
    <div class="drawer-container">
      <!--------------------------- 快速设置 --------------------------->
      <el-popover
        popper-class="popover-dialog big-popover-dialog"
        placement="bottom-start"
        width="500"
        :visible-arrow="false"
        v-model="visible"
      >
        <div>
          <h3 class="popover-dialog-title">
            批量设置
            <i class="el-icon-close" @click="visible=false;"></i>
          </h3>
          <div class="popover-dialog-content">
            <div class="edit-box">
              <el-form
                ref="editForm"
                :model="editForm"
                :rules="rules"
                label-position="left"
                label-width="90px"
              >
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="使用时间:" prop="startTime">
                      <el-time-select
                        placeholder="开始时间"
                        v-model="editForm.startTime"
                        :picker-options="{start: '07:00',step: '00:30',end: '22:30'}"
                        size="small"
                        style="width:100%;"
                        @change="changStartTime"
                      ></el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1" style="text-align:center;line-height:40px;">~</el-col>
                  <el-col :span="6">
                    <el-form-item prop="endTime" label-width="0px">
                      <el-time-select
                        placeholder="结束时间"
                        v-model="editForm.endTime"
                        :picker-options="{start: '07:00',step: '00:30',end: '23:00',minTime: editForm.startTime}"
                        size="small"
                        style="width:100%;"
                      ></el-time-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="时间长度:" prop="long">
                  <el-select
                    v-model="editForm.long"
                    placeholder="请选择"
                    size="small"
                    style="width:268px;"
                  >
                    <el-option
                      v-for="item in longList.slice(1)"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <span class="select-suffix">分钟</span>
                </el-form-item>
                <el-form-item label="间隔时间:" prop="interval">
                  <el-select
                    v-model="editForm.interval"
                    placeholder="请选择"
                    size="small"
                    style="width:268px;"
                  >
                    <el-option v-for="item in longList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <span class="select-suffix">分钟</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="popover-dialog-footer">
            <el-button class="white-btn" type="info" plain size="small" @click="visible=false;">取消</el-button>
            <el-button type="primary" size="small" @click="quickSetTimes">一键设置</el-button>
          </div>
        </div>
        <span slot="reference">
          <el-button type="primary" size="small">快速设置</el-button>
        </span>
      </el-popover>
      <div class="date-table">
        <table>
          <!--------------------------- 表格标题行 --------------------------->
          <thead>
            <tr align="center">
              <th></th>
              <th v-for="(item, index) in dateLabels" :key="item.label">
                {{item.label}}
                <el-popover
                  popper-class="popover-dialog"
                  placement="bottom-start"
                  width="180"
                  :visible-arrow="false"
                  v-model="item.visible"
                >
                  <div>
                    <h3 class="popover-dialog-title">
                      复制设置
                      <i class="el-icon-close" @click="item.visible=false;"></i>
                    </h3>
                    <div class="popover-dialog-content">
                      <p>快速复制到：</p>
                      <el-checkbox-group v-model="item.checkList">
                        <el-checkbox
                          v-for="checkItem in dateLabels.filter(i => i.label !== item.label) "
                          :key="checkItem.label"
                          :label="checkItem.label"
                        ></el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <div class="popover-dialog-footer">
                      <el-button type="primary" size="small" @click="copyTimes(item,index)">确定</el-button>
                    </div>
                  </div>
                  <span slot="reference">
                    <img src="@/assets/img/copy.png" />
                  </span>
                </el-popover>
              </th>
            </tr>
          </thead>
          <!--------------------------- 表格内容 --------------------------->
          <tbody>
            <tr v-for="(item,index) in times" :key="index">
              <th>{{item.st}}</th>
              <th
                class="drag-th"
                v-for="(date,i) in openTimeList"
                :key="i"
                :class="{'selected': date.times.map(j => j.starttime).includes(item.st), 'range': date.spanArr[index].val > 1}"
                :rowspan="date.spanArr[index].val"
                v-show="date.spanArr[index].val"
                @mousedown="setDragStart(item,date,$event)"
                @mouseenter="dragMove(item,date,$event)"
                @mouseup="setDragEnd(item,date,$event)"
              >
                <span
                  v-if="date.times.map(j => j.starttime).includes(item.st)"
                >{{date.spanArr[index].start}} ~ {{date.spanArr[index].end}}</span>
                <i
                  v-if="date.times.map(j => j.starttime).includes(item.st)"
                  class="el-icon-close"
                  @click="removeTime(index,date)"
                ></i>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveTimes">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    resDetail: Object
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      visible: false,
      editForm: {
        startTime: "07:00",
        endTime: "23:00",
        long: "60",
        interval: "30"
      },
      longList: [],
      rules: {
        startTime: [
          { required: true, message: "请选择开始时间！", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间！", trigger: "change" }
        ],
        long: [
          { required: true, message: "请选择时间长度！", trigger: "change" }
        ],
        interval: [
          { required: true, message: "请选择间隔时间！", trigger: "change" }
        ]
      },
      dateLabels: [
        { id: "1", label: "周一", visible: false, checkList: [] },
        { id: "2", label: "周二", visible: false, checkList: [] },
        { id: "3", label: "周三", visible: false, checkList: [] },
        { id: "4", label: "周四", visible: false, checkList: [] },
        { id: "5", label: "周五", visible: false, checkList: [] },
        { id: "6", label: "周六", visible: false, checkList: [] },
        { id: "7", label: "周日", visible: false, checkList: [] }
      ],
      times: [], // 一天的时间
      isMouseDown: false,
      openTimes: [] // 最终合并的时间
    };
  },
  computed: {
    // 一周每天的开放时间数组
    openTimeList() {
      let arr = [];
      this.dateLabels.forEach(i => {
        let obj = {
          id: i.id,
          label: i.label,
          times: this.openTimes.filter(j => j.cycleval == i.id)
        };
        arr.push(obj);
      });
      return arr;
    }
  },
  methods: {
    // 设置时间长度下拉列表
    setLongList() {
      let arr = [];
      for (let i = 0; i < 11; i++) {
        arr.push(i * 30);
      }
      this.longList = arr;
    },
    // 改变开始时间
    changStartTime(val) {
      if (this.editForm.endTime && val > this.editForm.endTime) {
        this.editForm.endTime = null;
      }
    },

    // 快速设置时间
    quickSetTimes() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // 计算时间
          let time = this.moment(this.editForm.startTime, "HH:mm");
          let arr = [];
          for (let i = 0; i < 32; i++) {
            let s = time.format("HH:mm");
            let et = time.add(this.editForm.long, "m");
            let e = et.format("HH:mm");
            if (
              s < this.editForm.startTime ||
              s >= this.editForm.endTime ||
              e > this.editForm.endTime ||
              e < s
            ) {
              break;
            }
            arr.push({
              s: s,
              e: e
            });
            time = et.add(this.editForm.interval, "m");
          }
          console.log(arr);
          // 设置openTimes
          let newArr = [];
          this.dateLabels.forEach(i => {
            arr.forEach(j => {
              let obj = {
                cycletype: "week",
                cycleval: i.id,
                starttime: j.s,
                endtime: j.e
              };
              newArr.push(obj);
            });
          });
          this.openTimes = this.mergeTimes(newArr);
          this.setRowSpan();
          this.visible = false;
        }
      });
    },

    // 复制时间
    copyTimes(item, index) {
      let times = _.cloneDeep(this.openTimeList[index].times);
      this.openTimeList.forEach(i => {
        let label = i.label;
        if (item.checkList.includes(label)) {
          i.times = times.map(j => {
            let obj = Object.assign({}, j);
            obj.cycleval = i.id;
            return obj;
          });
        }
      });
      // 重新计算openTimes
      this.openTimes = this.openTimeList.map(i => i.times).flat();
      this.setRowSpan();
      item.visible = false;
      item.checkList = [];
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
      this.times = arr;
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
        cycletype: "week",
        cycleval: date.id,
        starttime: time.st,
        endtime: time.et
      };
      let isExit = this.openTimes.some(
        i =>
          i.cycleval == t.cycleval &&
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
          j => j.cycleval == i.cycleval && j.endtime == i.starttime
        );
        let e_index = arr.findIndex(
          j => j.cycleval == i.cycleval && j.starttime == i.endtime
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
    removeTime(time_index, date) {
      let cycleval = date.id;
      let st = date.spanArr[time_index].start;
      // 从openTimes中移除该时间
      let findIndex = this.openTimes.findIndex(
        i => i.cycleval == cycleval && i.starttime == st
      );
      if (findIndex > -1) {
        this.openTimes.splice(findIndex, 1);
        this.setRowSpan();
      }
    },

    // 保存时间
    saveTimes() {
      this.$emit("setOpenTimes", this.openTimes);
      this.drawer = false;
    }
  },
  created() {
    this.setLongList();
    this.getTimes();
    this.setRowSpan();
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 0 20px;
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
  margin-top: 10px;
  border-top: 1px solid #ebebeb;
  user-select: none;
  th {
    width: 100px;
    border: 1px solid #ebebeb;
    border-width: 0 1px;
    color: rgba(0, 0, 0, 0.65);
    padding: 4px 0;
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
      background: #e6f7ff;
    }
    &.selected {
      position: relative;
      span {
        position: absolute;
        top: 4px;
        right: 14px;
      }
    }
    &.range {
      span {
        position: absolute;
        top: 8px;
        right: 14px;
      }
    }
    i {
      cursor: pointer;
      position: absolute;
      top: 4px;
      right: 2px;
      font-size: 8px;
      color: #2e91ce;
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
  .popover-dialog-footer {
    text-align: right;
    .el-button {
      width: auto;
    }
  }
}
.select-suffix {
  position: absolute;
  left: 232px;
  background: #fff;
  font-size: 12px;
  height: 26px;
  top: 8px;
  line-height: 26px;
}
</style>