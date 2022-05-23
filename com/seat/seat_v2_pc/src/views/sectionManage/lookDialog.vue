<template>
  <el-dialog
    class="common-dialog"
    title="区间座位详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="1120px"
    @close="dialogVisible = false"
  >
    <slot></slot>
    <h3 class="h3-title">常规信息</h3>
    <div class="look-content">
      <div class="look-box">
        <label>区间名称</label>
        <span class="text">{{seatData.name}}</span>
      </div>
      <div class="look-box">
        <label>是否开放预约</label>
        <span class="text">{{appointStatus[seatData.status]}}</span>
      </div>
      <div class="look-box">
        <label>是否有柜子</label>
        <span class="text">{{seatData.islocakers=='1'?'是':'否'}}</span>
      </div>

      <div class="look-box">
        <label>开放地点</label>
        <span class="text">{{seatData.location}}</span>
      </div>
      <div class="look-box">
        <label>是否寒暑假开放</label>
        <span class="text">{{seatData.isvacationopen=='1'?'是':'否'}}</span>
      </div>
      <div class="look-box">
        <label>预约规则</label>
        <span class="text">{{seatData.ruleName}}</span>
      </div>
    </div>
    <section class="section">
      <h3 class="h3-title">开放时间段设置</h3>
      <time-table ref="timeSet" :tableTimes="seatData.opentimes"></time-table>
    </section>
    <section class="section">
      <h3 class="h3-title">座位信息</h3>
      <look-seat ref="seatSet" :detailData="seatData"></look-seat>
    </section>

    <span slot="footer">
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getSectionDetail } from "@/api/manage/section";
import { fetchRules } from "@/api/manage/rule";
import { queryOrderBySeatid } from "@/api/manage/order";
import lookSeat from "./seat/lookSeat";
import TimeTable from "./seat/TimeTable";
export default {
  components: {
    lookSeat,
    TimeTable
  },
  data() {
    return {
      appointStatus: ["", "开放", "关闭", "临时关闭"], // 1 开放 2 关闭  3临时关闭
      dialogVisible: false,
      seatData: {},
      rulesData: []
    };
  },
  mounted() {
    this.getRules();
  },
  methods: {
    //获取全部的规则
    getRules() {
      fetchRules({}).then(res => {
        if (res.success) {
          this.rulesData = res.data;
        }
      });
    },
    getSeatDetail() {
      let param = {
        id: this.id
      };
      getSectionDetail(param).then(res => {
        if (res.success) {
          this.seatData = _.cloneDeep(res.data);
          let rule = this.rulesData.filter(v => v.id == this.seatData.ruleid);
          this.seatData.ruleName = rule[0] ? rule[0].name : "";
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.h3-title {
  margin-top: 24px;
  margin-bottom: 16px;
  color: #333333;
  font-size: 14px;
}
.look-content {
  .look-box {
    display: inline-block;
    width: 350px;
    margin-bottom: 16px;
    white-space: nowrap;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  label {
    margin-right: 24px;
    height: 22px;
    font-size: 14px;
    color: #666666;
    line-height: 22px;
    display: inline-block;
  }
  .text {
    color: #333333;
    line-height: 22px;
  }
}
</style>