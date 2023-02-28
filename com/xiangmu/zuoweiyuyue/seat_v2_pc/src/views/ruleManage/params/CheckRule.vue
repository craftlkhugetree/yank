<template>
  <section class="form-section">
    <div class="search-box clearfix">
      <h3>签到参数管理</h3>
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
      <el-form-item label="签到方式" prop="B01">
        <el-radio-group v-model="editForm.B01" size="small">
          <el-radio label="1">混合签到</el-radio>
          <el-radio label="2">按教室区间签到</el-radio>
          <el-radio label="3">固定二维码签到</el-radio>
          <el-radio label="4">阶段二维码签到</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="开放选座时间" prop="B02">
        当时时间
        <el-time-picker
          value-format="HHmmss"
          v-model="editForm.B02"
          placeholder="请选择"
          style="width:120px;margin:0 12px"
          size="small"
        ></el-time-picker>开放选座。
      </el-form-item>

      <el-form-item label="举报签到" prop="B03">
        <span class="mg-rt">被举报后</span>
        <el-input-number
          controls-position="right"
          v-model.number="editForm.B03"
          size="small"
          style="width:96px;"
          :min="0"
        ></el-input-number>
        <span class="mg-lf">分钟内签到。</span>
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
    return {
      editForm: {
        B01: "", //签到方式1混合签到2区间签到3固定二维码4阶段二维码
        B02: "", //当日开放选座时间
        B03: "" //举报签到分钟内
      },
      rules: {
        B01: [
          {
            required: true,
            message: "请选择签到方式",
            trigger: ["blur"]
          }
        ],
        B02: [
          {
            required: true,
            message: "请选择选座时间",
            trigger: ["blur"]
          }
        ],
        B03: [
          {
            required: true,
            message: "举报签到规则不能为空",
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