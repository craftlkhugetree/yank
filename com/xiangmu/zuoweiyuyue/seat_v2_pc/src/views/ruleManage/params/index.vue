<template>
  <div class="form-box">
    <break-rule ref="breakRule" :allConfigs="allConfigs"></break-rule>
    <check-rule ref="checkRule" :allConfigs="allConfigs"></check-rule>
    <section class="form-section">
      <div class="search-box clearfix">
        <h3>默认开放时间段模板</h3>
        <div class="search-box-right">
          <span class="go-back" @click="reset">
            <i class="el-icon-refresh-right">&nbsp;&nbsp;重置</i>
          </span>
        </div>
      </div>
      <time-table ref="timeTable" :tableTimes="tableTimes"></time-table>
    </section>
    <vacation ref="vacation" :allConfigs="allConfigs"></vacation>
    <leave-set ref="leaveSet" :allConfigs="allConfigs"></leave-set>
    <div class="btn-footer">
      <el-button class="btn" :loading="saveLoading" type="primary" size="middle" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { queryConfigtimes } from "@/api/manage/params";
import { fetchConfigs, saveConfig } from "@/api/manage/params";
import { saveSection, getSectionDetail } from "@/api/manage/section";
import TimeTable from "@/components/TimeTable";
// import TimeTable from "@/components/OpenTimes";
import BreakRule from "./BreakRule";
import CheckRule from "./CheckRule";
import vacation from "./Vacation";
import LeaveSet from "./LeaveSet";
export default {
  components: {
    TimeTable,
    BreakRule,
    CheckRule,
    vacation,
    LeaveSet
  },
  props: {
    id: String
  },
  data() {
    return {
      saveLoading: false,
      tableTimes: [],
      initTableTimes: [],
      allConfigs: [],
      check: {
        start: 1,
        end: 1,
        success: 0
      },
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      orderweekno: null,
      endweekday: null,
      weekList: [
        { id: "1", name: "周一" },
        { id: "2", name: "周二" },
        { id: "3", name: "周三" },
        { id: "4", name: "周四" },
        { id: "5", name: "周五" },
        { id: "6", name: "周六" },
        { id: "7", name: "周日" }
      ],
      selectMod: "第一列",
      rules: {
        name: [
          { required: true, message: "请输入规则名称！", trigger: "blur" }
        ],
        resgroupid: [
          { required: true, message: "请选择资源集！", trigger: "blur" }
        ],
        templateid: [
          { required: true, message: "请选择模板！", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getConfigs();
  },

  methods: {
    //保存所有参数，逐一校验表单必填
    save() {
      let breakV = this.$refs.breakRule.valid();
      let checkV = this.$refs.checkRule.valid();
      let vacationV = this.$refs.vacation.valid();
      let leaveV = this.$refs.leaveSet.valid();
      if (breakV || checkV || vacationV || leaveV) {
        return false;
      }

      // let breakForms = _.cloneDeep(this.$refs.breakRule.editForm);
      let breakForms = this.$refs.breakRule.editForm;
      let checkForms = _.cloneDeep(this.$refs.checkRule.editForm);
      //寒暑假时间特殊处理
      let vacationForms = _.cloneDeep(this.$refs.vacation.editForm);
      let newVacForm = {
        C01: vacationForms.summerTime[0],
        C02: vacationForms.summerTime[1],
        C03: vacationForms.winterTime[0],
        C04: vacationForms.winterTime[1]
      };
      //暂离时间特殊处理
      let leaveForms = _.cloneDeep(this.$refs.leaveSet.editForm);
      let newlefTime = {
        D04: leaveForms.lunchTime[0],
        D05: leaveForms.lunchTime[1],
        D06: leaveForms.dinnerTime[0],
        D07: leaveForms.dinnerTime[1]
      };

      let allForms = Object.assign(
        breakForms,
        checkForms,
        newVacForm,
        newlefTime,
        leaveForms
      );
      let configs = [];
      let keys = Object.keys(allForms);
      this.allConfigs.forEach(item => {
        if (keys.includes(item.identifycode)) {
          configs.push({
            codeval: allForms[item.identifycode],
            description: item.description,
            id: item.id,
            identifycode: item.identifycode
          });
        }
      });

      let openTimes = _.cloneDeep(this.$refs.timeTable.openTimes);
      openTimes.forEach(item => {
        item.starttime = item.starttime.replace(/:/gi, "");
        item.endtime = item.endtime.replace(/:/gi, "");
      });
      let paramData = {
        configs: configs,
        times: openTimes
      };

      this.saveLoading = true;
      saveConfig(paramData).then(res => {
        this.saveLoading = false;
        if (res.success) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
        } else {
          this.$message({
            type: "error",
            message: "提交失败：" + res.data.message
          });
        }
      });
    },

    getConfigs() {
      fetchConfigs({}).then(res => {
        if (res.success) {
          this.allConfigs = res.data.configs;
          this.tableTimes = res.data.times;
          this.initTableTimes = _.cloneDeep(this.tableTimes);
        }
      });
    },
    reset() {
      this.tableTimes = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-footer {
  display: block;
  width: 100%;
  background: #fff;
  padding: 20px;
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.06);
  position: fixed;
  bottom: 0;
  text-align: center;
  .btn {
    margin-left: -140px;
    width: 70px;
    height: 38px;
    border-radius: 3px;
  }
}
</style>