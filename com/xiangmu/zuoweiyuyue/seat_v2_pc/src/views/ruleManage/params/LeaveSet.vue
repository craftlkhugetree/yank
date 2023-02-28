<template>
  <section class="form-section">
    <div class="search-box clearfix">
      <h3>暂离时间设置</h3>
      <div class="search-box-right">
        <span class="go-back" @click="reset">
          <i class="el-icon-refresh-right">&nbsp;&nbsp;重置</i>
        </span>
      </div>
    </div>

    <el-form
      class="rule-content"
      ref="editForm"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="200px"
    >
      <el-form-item label="临时暂离" prop="templeave">
        <span class="mg-rt">每天最多临时暂离</span>
        <el-input-number
          controls-position="right"
          v-model.number="editForm.D01"
          style="width:100px;"
          size="small"
          :min="0"
        ></el-input-number>
        <span class="mg-lf mg-rt">次，每次</span>
        <el-input-number
          controls-position="right"
          v-model.number="editForm.D02"
          style="width:100px;"
          size="small"
          :min="0"
        ></el-input-number>
        <span class="mg-lf">分钟。</span>
      </el-form-item>

      <el-form-item label="就餐暂离" prop="lunchleave" style="margin-bottom:48px">
        <section class="gray-bg">
          <div>
            <span class="mg-rt mg-bt10">每次可离开</span>
            <el-input-number
              controls-position="right"
              v-model.number="editForm.D03"
              size="small"
              style="width:100px;"
              :min="0"
            ></el-input-number>
            <span class="mg-lf">分钟。</span>
          </div>
          <div>
            <span class="mg-rt mg-bt10">午餐时间段</span>
            <el-time-picker
              is-range
              v-model="editForm.lunchTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              value-format="HHmmss"
              size="small"
            ></el-time-picker>
          </div>
          <div>
            <span class="mg-rt">晚餐时间段</span>
            <el-time-picker
              is-range
              v-model="editForm.dinnerTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              value-format="HHmmss"
              size="small"
            ></el-time-picker>
          </div>
        </section>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { fetchConfigs, saveConfig } from "@/api/manage/params";
export default {
  props: {
    allConfigs: Array
  },
  data() {
    let validateTemp = (rule, value, callback) => {
      var num = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
      if (!num.test(this.editForm.D01) || !num.test(this.editForm.D02)) {
        return callback(new Error("请设置临时暂离！"));
      } else {
        callback();
      }
    };
    let validateLunch = (rule, value, callback) => {
      var num = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
      if (
        !num.test(this.editForm.D03) ||
        !this.editForm.lunchTime ||
        !this.editForm.dinnerTime
      ) {
        return callback(new Error("请设置就餐暂离！"));
      } else {
        callback();
      }
    };
    return {
      editForm: {
        D01: "", //每日临时暂离次数
        D02: "", //每次暂离时间
        D03: "", //就餐可暂离时间
        lunchTime: [], //  午饭开始 D04  午饭结束  D04
        dinnerTime: [] //  晚饭开始 D06  晚饭结束  D06
      },
      rules: {
        templeave: [
          {
            required: true,
            validator: validateTemp,
            trigger: ["blur"]
          }
        ],
        lunchleave: [
          {
            required: true,
            validator: validateLunch,
            trigger: ["blur"]
          }
        ]
      }
    };
  },

  computed: {},

  watch: {
    allConfigs() {
      let keys = Object.keys(this.editForm);
      this.allConfigs.forEach(item => {
        if (keys.includes(item.identifycode)) {
          this.editForm[item.identifycode] = item.codeval;
        }
        if (["D04", "D05"].includes(item.identifycode)) {
          this.editForm.lunchTime.push(item.codeval);
        }
        if (["D06", "D07"].includes(item.identifycode)) {
          this.editForm.dinnerTime.push(item.codeval);
        }
      });
    }
  },

  mounted() {},
  methods: {
    valid() {
      let isValid = false;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          isValid = false;
        } else {
          isValid = true;
        }
      });
      return isValid;
    },
    reset() {
      this.editForm = {};
    }
  }
};
</script>

<style lang="scss" scoped>
</style>