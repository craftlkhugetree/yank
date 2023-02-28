<template>
  <div class="main">
    <!--------------------------- 资源的不可用日期 --------------------------->
    <div class="item">
      <h3 class="title">资源的不可用日期</h3>
      <div class="content close-times">
        <span class="time" v-for="(time, index) in closeTimesList" :key="index">
          {{ time.start == time.end ? time.start : time.start + ' ~ ' + time.end }}
          <i class="el-icon-close" @click="deleteCloseTime(index)"></i>
        </span>
        <el-popover
          popper-class="popover-dialog"
          placement="bottom-start"
          width="300"
          :visible-arrow="false"
          v-model="visible"
        >
          <div>
            <h3 class="popover-dialog-title">
              不可用日期
              <i class="el-icon-close" @click="visible = false"></i>
            </h3>
            <div class="popover-dialog-content">
              <el-date-picker
                v-show="closeTimesType === 'daterange'"
                v-model="dateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                style="width: 200px;"
                format="MM-dd"
                value-format="yyyyMMdd"
              ></el-date-picker>
              <el-date-picker
                v-show="closeTimesType === 'date'"
                v-model="date"
                type="date"
                placeholder="选择日期"
                size="small"
                style="width: 190px;"
                format="yyyy-MM-dd"
                value-format="yyyyMMdd"
              ></el-date-picker>
              <span class="time-text" @click="changeTimesType">
                {{ closeTimesType === 'daterange' ? '选择日期' : '选择时间段' }}
              </span>
            </div>
            <div class="popover-dialog-footer">
              <el-button type="primary" size="small" @click="addCloseTime">保存</el-button>
            </div>
          </div>
          <span class="add" slot="reference">
            <i class="el-icon-plus"></i>
            添加
          </span>
        </el-popover>
      </div>
    </div>
    <!--------------------------- 资源的开放时间 --------------------------->
    <div class="item">
      <h3 class="title">资源的开放时间</h3>
      <div class="content open-times clearfix">
        <el-button type="primary" size="small" @click="showOpenTimeDrawer">设置</el-button>
        <!-- 表格 -->
        <ul class="time-ul" v-if="openTimes.length > 0">
          <li v-for="item in openTimesData" :key="item.label">
            <div class="time-ul-title">{{ item.label }}</div>
            <div class="time-ul-content" v-for="(t, i) in item.times" :key="i">
              {{ t.starttime }} ~ {{ t.endtime }}
            </div>
          </li>
        </ul>
        <!-- 设置弹窗 -->
        <open-time-drawer ref="openTimeDrawer" @setOpenTimes="setOpenTimes"></open-time-drawer>
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
      <h3 class="title div_flex">
        多人预约

        <el-switch
          style="margin-left: auto"
          v-model="multiplePeople"
          active-color="#3F86F7"
          inactive-color="#c3c3c3"
        ></el-switch>
      </h3>
      <div class="content conditions">
        <div class="el_radio" :disabled="!multiplePeople">
          最少添加
          <el-input-number
            :disabled="!multiplePeople"
            size="mini"
            v-model="leastPeople"
            :controls="false"
            :min="1"
            :max="10000"
          ></el-input-number>
          人
        </div>
        <!-- <el-radio-group v-model="multiplePeople" class="el_radio" :disabled="!multiplePeople">
          <el-radio label="0">不限制</el-radio>
          <el-radio :label="true">

          </el-radio>
        </el-radio-group> -->
      </div>
      <div class="content conditions" v-if="multiplePeople">
        <el-radio-group v-model="isNeedAll" class="el_radio" style="padding-top: 5px">
          <el-radio label="1">只需要预约人签到</el-radio>
          <el-radio label="2">所有人都需要签到</el-radio>
        </el-radio-group>
      </div>
    </div>
    <!--------------------------- 预约限制条件 --------------------------->
    <div class="item">
      <h3 class="title">预约限制条件</h3>
      <div class="content conditions">
        <div class="conditions-item">
          <span>在资源使用时间前</span>
          <el-input-number
            controls-position="right"
            v-model.number="condition.days"
            size="small"
            style="width:80px;"
            :min="0"
          ></el-input-number>
          <span>天的</span>
          <el-time-select
            v-model="condition.time"
            :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }"
            placeholder="选择时间"
            size="small"
            style="width:100px;margin:0 5px;"
          ></el-time-select>
          <span>停止预约</span>
        </div>
        
		<div class="conditions-item">
		  <span>每次预约时间段最多</span>
		  <el-input-number
		    controls-position="right"
		    v-model.number="condition.maxNum"
		    size="small"
		    style="width:80px;"
		    :min="1"
		  ></el-input-number>
		  <span>个</span>
		</div>
		<div class="conditions-item">
		  <span>每人每月最多预约</span>
		  <el-input-number
		    controls-position="right"
		    v-model.number="condition.maxMonNum"
		    size="small"
		    style="width:80px;"
		    :min="1"
		  ></el-input-number>
		  <span>次</span>
		</div>
        <div class="conditions-item clearfix">
          <span>可选限制条件：</span>
          <div class="right">
            <el-checkbox v-model="condition.mustFinish">
              完成当前预约才可以再次预约
              <span class="tip">
                <i class="el-icon-warning"></i>
                未选中即表示有未完成预约单也可预约
              </span>
            </el-checkbox>
            <el-checkbox v-model="condition.mustContinue">预约的时间段必须连续</el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <!--------------------------- 取消预约 --------------------------->
    <div class="item">
      <h3 class="title">取消预约</h3>
      <div class="content conditions">
        <div class="conditions-item">
          <span>资源使用时间开始前</span>
          <el-input-number
            controls-position="right"
            v-model.number="cancel.cancelval"
            size="small"
            style="width:80px;"
            :min="0"
          ></el-input-number>
          <el-select
            v-model="cancel.cancelunit"
            size="small"
            placeholder="请选择"
            style="width:90px;margin:0 5px;"
          >
            <el-option
              v-for="item in unitList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span>可以取消预约</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OpenTimeDrawer from './openTimeDrawer';
import AppointTime from './appointTime';
export default {
  components: {
    OpenTimeDrawer,
    AppointTime,
  },
  props: {
    resDetail: Object,
  },
  data() {
    return {
      leastPeople: 1,
      multiplePeople: false,
      isNeedAll: '1',
      visible: false,
      closeTimes: [],
      closeTimesType: 'daterange',
      dialogVisible: false,
      dateRange: [],
      date: null,
      openTimes: [],
      condition: {
        days: null,
        time: '00:00',
        maxNum: 100,
		maxMonNum: 100,
        mustFinish: false,
        mustContinue: false,
      },
      cancel: {
        cancelunit: 'minute',
        cancelval: 0,
      },
      unitList: [
        { id: 'minute', name: '分钟' },
        { id: 'hour', name: '小时' },
      ],
    };
  },
  computed: {
    // 关闭时间
    closeTimesList() {
      return this.closeTimes.map(i => {
        return {
          start: this.util.formatTime(i.starttime, 'MM-dd'),
          end: this.util.formatTime(i.endtime, 'MM-dd'),
        };
      });
    },
    // 一周开放时间
    openTimesData() {
      let labels = [
        { id: 1, label: '周一' },
        { id: 2, label: '周二' },
        { id: 3, label: '周三' },
        { id: 4, label: '周四' },
        { id: 5, label: '周五' },
        { id: 6, label: '周六' },
        { id: 7, label: '周日' },
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
          times: times,
        };
        arr.push(obj);
      });
      return arr;
    },

    // 限制条件
    conditions() {
      return [
        {
          conditioncode: '01',
          conditionval: JSON.stringify({
            days: this.condition.days,
            time: this.condition.time || '00:00',
          }),
          description: '在资源使用时间前多少天的多少时间点停止预约',
        },
        {
          conditioncode: '02',
          conditionval: this.condition.maxNum,
          description: '每次预约时间段的最大数量',
        },
        {
          conditioncode: '03',
          conditionval: this.condition.mustFinish,
          description: '完成当前预约才可以再次预约',
        },
        {
          conditioncode: '04',
          conditionval: this.condition.mustContinue,
          description: '预约的时间段必须连续',
        },
		{
		  conditioncode: '05',
		  conditionval: this.condition.maxMonNum,
		  description: '每人每月预约次数的最大数量',
		},
      ];
    },
  },
  watch: {
    resDetail() {
      this.closeTimes = this.resDetail.closetimes;
      this.openTimes = this.resDetail.opentimes;
      this.setYyTime();
      this.setCondition();
      this.cancel = this.resDetail.cancel || {};
      let rule = this.resDetail.rulePerson;
      if (rule && Object.keys(rule).length) {
        this.multiplePeople = true;
        this.leastPeople = rule.minPerson || 1;
        this.isNeedAll = rule.checkinType || '1';
      }
    },
  },
  methods: {
    // 改变不可用日期类型
    changeTimesType() {
      this.closeTimesType = this.closeTimesType == 'daterange' ? 'date' : 'daterange';
      this.dateRange = [];
      this.date = null;
    },
    // 添加不可用日期
    addCloseTime() {
      let starttime = null;
      let endtime = null;
      if (this.closeTimesType == 'daterange' && this.dateRange.length > 0) {
        starttime = this.dateRange[0];
        endtime = this.dateRange[1];
      } else if (this.closeTimesType == 'date' && this.date) {
        starttime = this.date;
        endtime = this.date;
      }
      if (starttime && endtime) {
        this.closeTimes.push({
          starttime: starttime + '000000',
          endtime: endtime + '235959',
        });
      }
      this.visible = false;
      this.dateRange = [];
      this.date = null;
    },
    // 删除不可用日期
    deleteCloseTime(index) {
      this.closeTimes.splice(index, 1);
    },
    // 打开开放时间弹窗
    showOpenTimeDrawer() {
      let drawer = this.$refs.openTimeDrawer;
      drawer.drawer = true;
      drawer.openTimes = _.cloneDeep(this.openTimes);
      drawer.setRowSpan();
    },
    // 设置开放时间
    setOpenTimes(data) {
      this.openTimes = data;
    },
    // 初始设置预约时间
    setYyTime() {
      let time = this.resDetail.yytime;
      if (time) {
        let yy = this.$refs.yyTime;
        let type = time.timetype;
        if (type !== 'none') {
          yy[`start${type}day`] = time.startday;
          yy[`end${type}day`] = time.endday;
          let st = time.starttime;
          yy[`start${type}time`] = st ? this.moment(st, 'hhmm').format('HH:mm') : null;
          let et = time.endtime;
          yy[`end${type}time`] = et ? this.moment(et, 'hhmm').format('HH:mm') : null;
        }
        yy.timetype = time.timetype;
      }
    },
    // 初始设置限制条件
    setCondition() {
      let data = this.resDetail.conditions;
      data.forEach(i => {
        switch (i.conditioncode) {
          case '01':
            let data = i.conditionval ? JSON.parse(i.conditionval) : {};
            this.condition.days = data.days;
            this.condition.time = data.time;
            break;
          case '02':
            this.condition.maxNum = i.conditionval;
            break;
          case '03':
            this.condition.mustFinish = i.conditionval == 'true' ? true : false;
            break;
          case '04':
            this.condition.mustContinue = i.conditionval == 'true' ? true : false;
            break;
		  case '05':
		    this.condition.maxMonNum = i.conditionval;
		    break;
        }
      });
    },
  },
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
      content: '';
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
  .add {
    background: #ffffff;
    border: 1px dashed rgba(0, 0, 0, 0.15);
    font-size: 12px;
    cursor: pointer;
    &:hover {
      background: #f8f8f8;
    }
    i {
      font-size: 10px;
      margin-right: 10px;
      font-weight: bold;
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
    span {
      margin: 0 10px;
    }
    .right {
      width: calc(100% - 120px);
      float: right;
    }
    .tip {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.35);
      i {
        color: #3f86f7;
        font-size: 14px;
      }
    }
    .el-checkbox {
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 10px;
    }
  }
}
.el_radio {
  padding: 0 10px;
  color: rgba(0, 0, 0, 0.65);
}
.div_flex {
  display: flex;
  align-items: center;
}
</style>
