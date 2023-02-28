<template>
  <el-select
    v-model="selValue"
    v-bind="$attrs"
    :placeholder="placeholder"
    :multiple="multi"
    filterable
    :size="inputSize || config.renderConfig.layout.size"
    :class="className"
    clearable
    :remote="!!getList"
    :remote-method="getSelectEnum"
    @change="handleChange"
  >
    <el-option
      v-for="(item, index) in realSelectEnum"
      :key="index"
      :label="item[selectProps.name]"
      :value="item[selectProps.id]"
    ></el-option>
  </el-select>
</template>

<script>
import { defineComponent } from 'vue';
import config from '@/assets/js/default_config';

export default defineComponent({
  inject: ['inputSize'],
  props: {
    /**
     * 参数值
     */
    value: {
      type: [String, Number],
      default: '',
    },
    /**
     * 是否多选
     */
    multi: {
      type: Boolean,
      default: false,
    },
    /**
     * 下拉菜单值
     */
    selectEnum: {
      type: Array,
      default: () => [],
    },
    /**
     * 下拉菜单props   用于id 和 name 映射
     */
    selectProps: {
      type: Object,
      default: () => ({
        id: 'id',
        name: 'name',
      }),
    },
    /**
     * 是否返回原始数据
     */
    rawResult: {
      type: Boolean,
      default: false,
    },
    /**
     * 自定义className
     */
    className: {
      type: String,
      default: 'w-300',
    },
    /**
     * 自定义placeholder
     */
    placeholder: {
      type: String,
      default: '',
    },
    getList: {
      type: Promise,
    },
  },
  data() {
    return {
      realSelectEnum: [...this.selectEnum],
      config,
      selValue: this.value,
    };
  },
  watch: {
    selectEnum: {
      handler(val) {
        if (val && val.length) {
          this.realSelectEnum = [...val];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    //获取下拉菜单枚举值
    getSelectEnum() {
      this.getList &&
        this.getList.then(res => {
          if (res && res.success) {
            this.realSelectEnum = res.data || res.items;
          }
        });
    },
    //数据改变
    handleChange(val) {
      // console.log(val, this.selValue);
      if (this.rawResult && this.multi) {
        //多选返回原始数据
        this.$emit('change', val);
        this.$emit('update:value', val);
      } else if (!this.multi) {
        //单选
        if (val === '') {
          //如果是空字符，则返回null
          this.$emit('change', null);
          this.$emit('update:value', null);
        } else {
          this.$emit('change', val);
          this.$emit('update:value', val);
        }
      }
    },
  },
});
</script>

<style lang="scss"></style>
