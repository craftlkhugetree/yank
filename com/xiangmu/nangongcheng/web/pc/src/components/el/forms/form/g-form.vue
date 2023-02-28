<template>
  <el-form
    ref="form"
    v-bind="$attrs"
    :model="formInfo"
    :label-width="labelWidth"
    :rules="mergeRules"
    :show-message="true"
    :validate-on-rule-change="false"
  >
    <el-row>
      <slot />
    </el-row>
  </el-form>
</template>

<script>
import { defineComponent } from 'vue';

import config from '@/assets/js/default_config';
import { initRules } from '../rules';

export default defineComponent({
  name: 'GForm',
  provide() {
    return {
      formInfo: this.formInfo, //将formInfo注入到item中
      inputSize: this.inputSize,
    };
  },
  props: {
    inputSize: {
      type: String,
      default: '',
    },
    /**
     * 表单数据
     */
    editData: {
      type: Object,
      default: () => ({}),
    },
    labelWidth: {
      type: String,
      default: '100px', //-----------------------表单label宽度
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      formInfo: {}, //---搜索参数
      config, //------------------------------------配置信息
      mergeRules: {},
    };
  },
  watch: {
    editData: {
      handler(data) {
        Object.keys(data).forEach(key => {
          this.$set(this.formInfo, key, data[key]);
        });
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    const slots = this.$slots;
    const rules = initRules(slots);
    this.mergeRules = { ...rules, ...this.rules };
    this.initFormData(); //初始化表单数据绑定
  },
  methods: {
    //初始化表单参数
    initFormData() {
      // if (this.$slots.default) {
      //   const allSlots = this.$slots.default;
      //   forEachForest(allSlots, slot => {
      //     const slotType = slot.componentInstance || {};
      //     const props = slotType._props;
      //     if (props && props.prop && !this.formInfo[props.prop]) {
      //       this.formInfo[props.prop] = null;
      //     }
      //   });
      // }
      Object.keys(this.editData).forEach(key => {
        this.$set(this.formInfo, key, this.editData[key]);
      });
    },
    //手动校验
    validate(fn) {
      this.$refs.form.validate(fn);
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
  },
});
</script>

<style lang="scss"></style>
