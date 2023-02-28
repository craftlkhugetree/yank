<template>
  <el-dialog
    class="common-dialog"
    title="查看规则"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="dialogVisible = false"
  >
    <slot></slot>
    <el-form
      ref="editForm"
      :model="editForm"
      label-position="right"
      label-width="100px"
      style="margin-right:60px"
    >
      <el-form-item label="规则名称">
        <span>{{editForm.name}}</span>
      </el-form-item>
      <el-form-item label="当日选座">
        <span class="mg-rt">每个时间段结束前</span>
        <span>{{editForm.pickendtime}}</span>
        <span class="mg-lf">分钟停止选座。</span>
      </el-form-item>

      <el-form-item label="提前预约">
        <p v-show="editForm.orderunit=='day'">
          <span class="mg-rt">按日</span>
          <span>{{moment(editForm.ordertime, "HHmmss").format("HH:mm:ss")}}</span>
          <span class="mg-lf">预约次日。</span>
        </p>
        <p v-show="editForm.orderunit=='week'">
          <span class="mg-rt">按</span>
          <span>{{weekList[editForm.orderweekno-1]}} {{moment(editForm.ordertime, "HHmmss").format("HH:mm:ss")}}</span>
          <span class="mg-lf">&nbsp;预约下一周。</span>
        </p>
        <p v-show="editForm.orderunit=='none'">
          <span>不可提前预约</span>
        </p>
      </el-form-item>
      <el-form-item label="签到时间" prop="istop">
        <p>
          <span class="mg-rt">每个开放时间段开始前</span>
          {{editForm.ordercheckstart}}
          <span class="mg-lf">分钟开始签到；</span>
        </p>
        <p>
          <span class="mg-rt">每个开放时间段开始后</span>
          {{editForm.ordercheckend}}
          <span class="mg-lf">分钟停止签到，未签到将释放本时段的座位预约；</span>
        </p>
        <p>
          <span class="mg-rt">每个开放时间段内选座的，需在选座成功 {{editForm.pickcheck}} 分钟内签到。</span>
        </p>
      </el-form-item>
      <el-form-item label="柜子使用权">
        <span v-show="editForm.lockerstype=='1'">同座位</span>
        <span v-show="editForm.lockerstype=='2'">同一个预约周期内，属于第一个预约人，只有当全部取消预约时释放</span>
        <!-- <span v-show="editForm.lockerstype=='3'">没有柜子</span> -->
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fetchRuleById } from "@/api/manage/rule";
export default {
  data() {
    return {
      dialogVisible: false,
      row: {},
      weekList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      editForm: {
        id: "",
        name: "",
        cancelorder: "",
        ordertime: "",
        orderweekno: "",
        pickcheck: "",
        pickendtime: "",
        ordercheckstart: "",
        ordercheckend: "",
        lockerstype: ""
      }
    };
  },
  mounted() {},
  methods: {
    getDetail() {
      let param = {
        id: this.row.id
      };
      fetchRuleById(param).then(res => {
        if (res.success) {
          this.editForm = _.cloneDeep(res.data);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  margin-left: 125px;
  font-size: 14px;
  color: #f9784a;
  text-align: left;
  text-indent: 140px;
}
.el-form-item {
  margin-bottom: 5px;
}
</style>