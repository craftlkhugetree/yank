<template>
  <div class="form-box">
    <div class="search-box clearfix">
      <h3>编辑规则</h3>
      <div class="search-box-right">
        <span class="go-back" @click="reset">
          <i class="el-icon-refresh-right">&nbsp;&nbsp;重置</i>
        </span>
      </div>
    </div>
    <div class="form-content">
      <el-form ref="editForm" :model="editForm" label-position="right" label-width="150px">
        <el-form-item
          label="规则名称"
          prop="name"
          :rules="[{ required: true, message: '请输入规则名称', trigger: 'blur' }]"
        >
          <el-input
            :maxlength="40"
            show-word-limit
            v-model="editForm.name"
            size="small"
            style="width:600px;max-width:90%;"
            placeholder="不能超过40个字符"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="当日选座"
          prop="pickendtime"
          :rules="[{ required: true, message: '请输入当日选座', trigger: 'blur' }]"
        >
          <span class="mg-rt">每个时间段结束前</span>
          <el-input-number
            controls-position="right"
            v-model.number="editForm.pickendtime"
            size="small"
            style="width:100px;"
            :min="0"
          ></el-input-number>
          <span class="mg-lf">分钟停止选座。</span>
        </el-form-item>
        <el-form-item
          label="提前预约"
          prop="orderunit"
          :rules="[{ required: true, validator: validateAppoint, trigger: 'blur' }]"
        >
          <el-radio-group v-model="editForm.orderunit" size="small">
            <el-radio label="day" class="radio-col">
              按日
              <span>当日</span>
              <el-time-picker
                value-format="HHmmss"
                v-model="editForm.dayordertime"
                placeholder="任意时间点"
                class="time-picker"
                size="small"
              ></el-time-picker>&nbsp;预约次日。
            </el-radio>
            <el-radio label="week" class="radio-col">
              按周
              <el-select
                v-model="editForm.orderweekno"
                size="small"
                clearable
                style="width:100px;"
                placeholder="选择周几"
              >
                <el-option
                  v-for="item in weekList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-time-picker
                value-format="HHmmss"
                v-model="editForm.weekordertime "
                placeholder="请选择"
                class="time-picker"
                size="small"
              ></el-time-picker>预约下一周。
            </el-radio>
            <el-radio label="none" v-model="editForm.orderunit" class="radio-col">不可提前预约</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="editForm.orderunit !='none'"
          label="取消预约时间"
          prop="cancelorder"
          :rules="[{ required: true, message: '请输入取消预约时间', trigger: 'blur' }]"
        >
          <span class="mg-rt">每个开放时间段开始前</span>
          <el-input-number
            controls-position="right"
            v-model.number="editForm.cancelorder"
            size="small"
            style="width:100px;"
            :min="0"
          ></el-input-number>
          <span class="mg-lf">分钟，可以取消预约。</span>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item
          label="签到时间"
          prop="ordercheckstart"
          :rules="[{ required: true, validator: validateCheck, trigger: 'blur' }]"
        >
          <section class="gray-bg">
            <div>
              <span class="mg-rt">每个开放时间段开始前</span>
              <el-input-number
                controls-position="right"
                v-model.number="editForm.ordercheckstart"
                size="small"
                style="width:100px;"
                :min="0"
              ></el-input-number>
              <span class="mg-lf">分钟开始签到；</span>
            </div>
            <div>
              <span class="mg-rt">每个开放时间段开始后</span>
              <el-input-number
                controls-position="right"
                v-model.number="editForm.ordercheckend"
                size="small"
                style="width:100px;"
                :min="0"
              ></el-input-number>
              <span class="mg-lf">分钟停止签到，未签到将释放本时段的座位预约；</span>
            </div>
            <div>
              <span class="mg-rt">每个开放时间段内选座的，需在选座成功</span>
              <el-input-number
                controls-position="right"
                v-model.number="editForm.pickcheck"
                size="small"
                style="width:100px;"
                :min="0"
              ></el-input-number>
              <span class="mg-lf">分钟内签到。</span>
            </div>
          </section>
        </el-form-item>
        <el-form-item
          label="柜子使用权"
          prop="lockerstype"
          :rules="[{ required: true, message: '请选择柜子使用权', trigger: 'blur' }]"
        >
          <el-radio-group v-model="editForm.lockerstype" size="small" style="margin-top: 10px">
            <el-radio label="1" class="radio-col">同座位</el-radio>
            <el-radio label="2" class="radio-col">同一个预约周期内，属于第一个预约人，只有当全部取消预约时释放</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="btn-footer">
        <el-button type="primary" size="middle" @click="submitRules">提交</el-button>
        <el-button size="middle" @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { saveRule, fetchRuleById } from "@/api/manage/rule";

export default {
  props: {
    id: String
  },
  data() {
    return {
      editForm: {
        id: null,
        name: null,
        cancelorder: null,
        dayordertime: null,
        weekordertime: null,
        orderweekno: null,
        pickcheck: null,
        pickendtime: null,
        ordercheckstart: null,
        ordercheckend: null,
        lockerstype: null
      },
      weekList: [
        { id: 1, name: "周一" },
        { id: 2, name: "周二" },
        { id: 3, name: "周三" },
        { id: 4, name: "周四" },
        { id: 5, name: "周五" },
        { id: 6, name: "周六" },
        { id: 7, name: "周日" }
      ]
    };
  },
  mounted() {
    if (this.id !== "create") {
      this.getDetail();
    }
  },

  methods: {
    validateCheck(rule, value, callback) {
      var num = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
      if (
        !num.test(this.editForm.ordercheckstart) ||
        !num.test(this.editForm.ordercheckend) ||
        !num.test(this.editForm.pickcheck)
      ) {
        return callback(new Error("请设置签到时间！"));
      } else {
        callback();
      }
    },
    validateAppoint(rule, value, callback) {
      let weekv = false,
        dayV = false;
      if (this.editForm.orderunit == "day" && !this.editForm.dayordertime) {
        dayV = true;
      }
      if (
        this.editForm.orderunit == "week" &&
        (!this.editForm.orderweekno || !this.editForm.weekordertime)
      ) {
        weekv = true;
      }
      if (!this.editForm.orderunit || dayV || weekv) {
        return callback(new Error("请设置提前预约！"));
      } else {
        callback();
      }
    },
    submitRules() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let paramData = _.cloneDeep(this.editForm);
          if (this.editForm.orderunit == "day") {
            paramData.ordertime = this.editForm.dayordertime;
          }
          if (this.editForm.orderunit == "week") {
            paramData.ordertime = this.editForm.weekordertime;
          }
          saveRule(paramData).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message({
                type: "success",
                message: "提交成功！"
              });
              this.$router.push("/rule-manage/rules");
            } else {
              this.$message({
                type: "error",
                message: "提交失败：" + res.data.message
              });
            }
          });
        }
      });
    },

    getDetail() {
      let param = {
        id: this.id
      };
      fetchRuleById(param).then(res => {
        if (res.success) {
          let detailData = res.data;
          this.editForm = _.cloneDeep(detailData);
          if (detailData.orderunit == "day") {
            this.$set(this.editForm, "dayordertime", detailData.ordertime);
          }
          if (detailData.orderunit == "week") {
            this.$set(this.editForm, "weekordertime", detailData.ordertime);
          }
          this.editForm.orderweekno = detailData.orderweekno
            ? detailData.orderweekno
            : "";
        }
      });
    },
    reset() {
      this.editForm = {};
      // this.$refs.editForm.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.form-box {
  padding: 0;
  background: #fff;
  .search-box {
    height: 60px;
    line-height: 60px;
    padding: 0px 24px;
    border-bottom: 1px solid #d7dbe0;
    h3 {
      display: inline-block;
      width: 20%;
      min-width: 150px;
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      font-weight: 500;
      color: #333333;
    }
    .search-box-right {
      float: right;
      max-width: 80%;
      .go-back {
        cursor: pointer;
      }
      span {
        color: #666666;
        line-height: 20px;
        font-size: 14px;
      }
    }
  }
  .form-content {
    font-size: 14px;
    color: #333333;
    font-weight: 400;
    margin: 0 auto;
    width: 860px;
    padding: 24px 0px 72px 0;
    .mg-rt {
      margin-right: 12px;
    }
    .mg-lf {
      margin-left: 12px;
    }
    .time-picker {
      width: 135px;
      margin: 0 12px;
    }
    .radio-col {
      width: 100%;
      padding-bottom: 26px;
    }
    .radio-col:nth-last-child(1) {
      width: 100%;
      padding-bottom: 0px;
    }
  }
  .btn-footer {
    margin-left: 150px;
    .el-button {
      height: 38px;
      width: 65px;
    }
    .el-button + .el-button {
      margin-left: 24px;
    }
  }
}
</style>