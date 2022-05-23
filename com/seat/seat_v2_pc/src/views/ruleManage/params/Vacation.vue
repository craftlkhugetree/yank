<template>
  <section class="form-section">
    <div class="search-box clearfix">
      <h3>寒暑假时间设置</h3>
      <div class="search-box-right">
        <span class="go-back" @click="reset">
          <i class="el-icon-refresh-right">&nbsp;&nbsp;重置</i>
        </span>
      </div>
    </div>
    <el-form
      ref="editForm"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="200px"
      class="rule-content"
    >
      <el-form-item label="暑假时间段" prop="summerTime">
        <el-date-picker
          size="small"
          v-model="editForm.summerTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="寒假时间段" prop="winterTime">
        <el-date-picker
          size="small"
          v-model="editForm.winterTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
        ></el-date-picker>
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
        summerTime: [], //暑假时间 C01- C02
        winterTime: [] //寒假时间 C03 - C04
      },
      rules: {
        summerTime: [
          { required: true, message: "请选择关闭时间段！", trigger: "change" }
        ],
        winterTime: [
          { required: true, message: "请输入关闭说明！", trigger: "change" }
        ]
      }
    };
  },

  computed: {},
  watch: {
    allConfigs() {
      this.allConfigs.forEach(item => {
        if (["C01", "C02"].includes(item.identifycode)) {
          this.editForm.summerTime.push(item.codeval);
        }
        if (["C03", "C04"].includes(item.identifycode)) {
          this.editForm.winterTime.push(item.codeval);
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