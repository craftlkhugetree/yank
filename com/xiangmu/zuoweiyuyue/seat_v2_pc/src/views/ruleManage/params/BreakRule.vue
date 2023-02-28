<template>
  <section class="form-section">
    <div class="search-box clearfix">
      <h3>违规处理规则设置</h3>
      <div class="search-box-right">
        <!-- <span class="go-back" @click="save">
          <i class="el-icon-refresh-right">&nbsp;保存</i>
        </span>-->
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
      <el-form-item label="物品可滞留天数" prop="S01">
        <span class="mg-rt">物品可滞留</span>
        <el-input-number
          controls-position="right"
          v-model.number="editForm.S01"
          size="small"
          class="input-width"
          :min="0"
        ></el-input-number>
        <span class="mg-lf">天。</span>
      </el-form-item>
      <el-form-item label="滞留物品领取地点" prop="S02">
        <el-input
          :maxlength="40"
          show-word-limit
          v-model="editForm.S02"
          size="small"
          style="width:560px;"
          placeholder="不能超过40个字符"
        ></el-input>
      </el-form-item>

      <el-form-item label="累计违规处理" prop="balckList">
        <section class="gray-bg">
          <div>
            <span class="mg-rt">累计</span>
            <el-input-number
              controls-position="right"
              v-model.number="editForm.A01"
              size="small"
              class="input-width mg-bt"
            ></el-input-number>
            <span class="mg-lf">次未签到，纳入普通黑名单并取消预约资格，</span>
            <el-input-number
              controls-position="right"
              v-model.number="editForm.A02"
              size="small"
              class="input-width"
            ></el-input-number>
            <span class="mg-lf">天后，自动恢复；</span>
          </div>
          <div>
            <span class="mg-rt">累计</span>
            <el-input-number
              controls-position="right"
              v-model.number="editForm.A03"
              size="small"
              class="input-width"
            ></el-input-number>
            <span class="mg-lf">
              次纳入黑名单取消预约资格。
              <span class="tips">(0不受限制)</span>
            </span>
          </div>
        </section>
      </el-form-item>
      <el-form-item label="取消预约资格清除时间设置" prop="A04">
        <el-radio-group v-model="editForm.A04" size="small">
          <el-radio label="1">学年</el-radio>
          <el-radio label="2">学期</el-radio>
          <el-radio label="3">月</el-radio>
          <el-radio label="4">从不</el-radio>
        </el-radio-group>
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
    let validateRule = (rule, value, callback) => {
      var num = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
      if (
        !num.test(this.editForm.A01) ||
        !num.test(this.editForm.A01) ||
        !num.test(this.editForm.A01)
      ) {
        return callback(new Error("请设置违规处理！"));
      } else {
        callback();
      }
    };
    return {
      editForm: {
        S01: "", //物品滞留天数
        S02: "", // 物品领取地点
        A01: "", //累计几次未签到，记黑名单1次
        A02: "", //计入黑名单，几天后恢复
        A03: "", //累计几次黑名单取消预约资格
        A04: "" //清除永久黑名单时间：1学年2学期3月4从不
      },
      rules: {
        balckList: [
          {
            required: true,
            validator: validateRule,
            trigger: ["blur"]
          }
        ],
        S01: [
          {
            required: true,
            message: "请输入物品可滞留天数",
            trigger: ["blur"]
          }
        ],
        S02: [
          {
            required: true,
            message: "请输入滞留物品领取地点",
            trigger: ["blur"]
          }
        ],
        A04: [
          {
            required: true,
            message: "请设置清除时间",
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