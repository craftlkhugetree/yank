<template>
  <div class="time-table">
    <!-- 表格 -->
    <ul class="time-ul">
      <li v-for="item in openTimesData" :key="item.label">
        <label class="time-ul-title">{{item.label}}</label>
        <span class="time-ul-content" v-for="(t,i) in item.times" :key="i">
          <span>{{moment(t.starttime, "HHmm").format("HH:mm")}} ~ {{moment(t.endtime, "HHmm").format("HH:mm")}}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    tableTimes: Array
  },
  data() {
    return {
      openTimes: []
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
  methods: {}
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
    border-radius: 4px 4px 0px 0px;
    min-width: 1090px;
    li {
      display: inline-table;
      width: 153px;
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
</style>