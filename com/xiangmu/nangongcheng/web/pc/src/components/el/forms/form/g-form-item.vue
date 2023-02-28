<template>
  <div>
    <!-- 普通输入框 -->
    <s-col v-if="type === 'input'" v-bind="$attrs">
      <el-form-item :label="realLabel" :prop="prop">
        <s-input
          :value="formInfo[prop]"
          :placeholder="realPlaceholder()"
          @update="val => (formInfo[prop] = val)"
        ></s-input>
      </el-form-item>
    </s-col>
    <!-- 下拉搜索框 -->
    <s-col v-if="type === 'select'" v-bind="$attrs">
      <el-form-item :label="realLabel" :prop="prop">
        <s-select
          :value.sync="formInfo[prop]"
          v-bind="$attrs"
          :placeholder="realPlaceholder('sel')"
        ></s-select>
      </el-form-item>
    </s-col>
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';
import { cutLastComma } from '../rules';
export default defineComponent({
  name: 'FormItem',
  props: {
    /**
     * 表单组件类型 input select date daterange text
     */
    type: {
      type: String,
      default: 'input',
    },
    /**
     * 文案
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * placeholder
     */
    placeholder: {
      type: String,
      default: '',
    },
    /**
     * 绑定参数的字段名称
     */
    prop: {
      type: [String],
      default: '',
    },
    //=====================================快捷规则====================================//
    /**
     * 必填校验
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * 最大长度
     */
    maxLength: {
      type: Number,
      default: null,
    },
    /**
     * 最小长度
     */
    minLength: {
      type: Number,
      default: null,
    },
    /**
     * 长度恰好等于
     */
    length: {
      type: Number,
      default: null,
    },
    /**
     * 手机号校验
     */
    phone: {
      type: Boolean,
      default: false,
    },
  },
  // inject:['formInfo'],
  setup() {
    const formInfo = inject('formInfo', {});
    return {
      formInfo,
    };
  },
  data() {
    return {};
  },
  methods: {
    changeForm(val) {
      this.$set(this.formInfo, this.prop, val);
    },
  },
  computed: {
    realLabel() {
      //实际label值，自动拼接
      if (this.label.endsWith('：')) {
        return this.label;
      }
      if (this.label.endsWith(':')) {
        return this.label.replace(':', '：');
      }
      return `${this.label}：`;
    },
    realPlaceholder() {
      //实际placeholder值
      return function(type = 'ipt') {
        var str = '';
        if (type === 'ipt') {
          str = '请输入';
        } else if (type === 'sel') {
          str = '请选择';
        }
        return this.placeholder ? this.placeholder : str + cutLastComma(this.label);
      };
    },
  },
});
</script>

<style lang="scss"></style>
