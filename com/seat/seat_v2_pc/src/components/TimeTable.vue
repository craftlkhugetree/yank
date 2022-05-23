<template>
  <div class="time-table">
    <!-- 点击选择的不合并的时间表格 -->
    <ul class="time-ul">
      <li v-for="item in openTimesData" :key="item.label">
        <label class="time-ul-title">{{item.label}}</label>
        <span class="time-ul-content" v-for="(t,i) in item.times" :key="i">
          <span>{{moment(t.starttime, "HHmm").format("HH:mm")}} ~ {{moment(t.endtime, "HHmm").format("HH:mm")}}</span>
          <i class="el-icon-edit" @click="updateTime(item,t)"></i>
          <i class="el-icon-delete" @click="deleteTime(item,t)"></i>
        </span>
        <span class="time-ul-content">
          <i class="el-icon-plus" @click="updateTime(item,null)"></i>
        </span>
      </li>
    </ul>
    <!---------------------------- 弹窗 ---------------------------->
    <el-dialog
      class="base-dialog"
      title="时间设定"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="400px"
      @close="cancelDialog"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules">
        <el-time-select
          placeholder="起始时间"
          style="width:120px"
          v-model="editForm.startTime"
          :picker-options="{
            start: '00:00',
            step: '00:01',
            end: '23:30'
          }"
        ></el-time-select>
        <span class="mg-10">至</span>
        <el-time-select
          placeholder="结束时间"
          style="width:120px"
          v-model="editForm.endTime"
          :picker-options="{
            start: '00:00',
            step: '00:01',
            end: '23:30',
            minTime: editForm.startTime
            }"
        ></el-time-select>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="save">保存</el-button>
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
      openTimes: [],
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
      curEdit: null
    };
  },

  computed: {
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
      this.openTimes = this.tableTimes;
    }
  },

  mounted() {},
  methods: {
    //更新时间段
    updateTime(item, t) {
      this.dialogVisible = true;
      if (t) {
        this.editForm.startTime = this.moment(t.starttime, "HHmm").format(
          "HH:mm"
        );
        this.editForm.endTime = this.moment(t.endtime, "HHmm").format("HH:mm");
        this.isEdit = true;
        this.curEdit = t;
        this.curCol = t;
      } else {
        this.editForm.startTime = "";
        this.editForm.endTime = "";
        this.isEdit = false;
        this.curCol = item;
      }
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
    },
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();

      // this.editForm = {
      //   id: null,
      //   name: null
      // };
    },
    // 保存
    save() {
      let editTime = {
        id: (this.curCol && this.curCol.id) || "",
        weekno: this.curCol.weekno,
        starttime: this.editForm.startTime.replace(/:/gi, ""),
        endtime: this.editForm.endTime.replace(/:/gi, "")
      };
      let isExit = false;
      //编辑时判断
      let findIndex = -1;
      if (this.isEdit) {
        //编辑,获得当前编辑的index
        let oldEdit = this.curEdit;
        findIndex = this.openTimes.findIndex(
          i =>
            i.weekno == oldEdit.weekno &&
            i.starttime == oldEdit.starttime &&
            i.endtime == oldEdit.endtime
        );
        let newData = _.cloneDeep(this.openTimes);
        //编辑时，判断去掉当前编辑的值
        let list = newData.splice(findIndex, 1);
        let newlist = newData.filter(i => i.weekno == editTime.weekno);
        isExit = newlist.some(i => {
          (editTime.starttime >= i.starttime &&
            editTime.endtime <= i.endtime) ||
            (i.starttime < editTime.endtime && editTime.endtime < i.endtime) ||
            (i.starttime < editTime.starttime &&
              editTime.starttime < i.endtime);
        });
      } else {
        let newData = _.cloneDeep(this.openTimes);
        let newlist = newData.filter(i => i.weekno == editTime.weekno);
        isExit = newlist.some(
          i =>
            (editTime.starttime >= i.starttime &&
              editTime.endtime <= i.endtime) ||
            (i.starttime < editTime.endtime && editTime.endtime < i.endtime) ||
            (i.starttime < editTime.starttime && editTime.starttime < i.endtime)
        );
      }
      if (isExit) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "时间段已被选中，请勿重复设定！"
        });
        return false;
      }

      //编辑替换
      if (this.isEdit && findIndex > -1) {
        this.openTimes.splice(findIndex, 1, editTime);
      } else {
        this.openTimes.push(editTime);
      }
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.time-table {
  background: #ffffff;

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
        line-height: 84px;
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
</style>