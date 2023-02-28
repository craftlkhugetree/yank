<template>
  <el-input
    ref="ipt"
    v-bind="$attrs"
    v-model="iptValue"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :size="inputSize || config.renderConfig.layout.size"
    :class="className"
    clearable
    @change="handleInput"
  ></el-input>
</template>

<script>
import { defineComponent } from 'vue';
import config from '@/assets/js/default_config';
export default defineComponent({
  inject: ['inputSize'],
  props: {
    /**
     * v-model绑定的值
     */
    value: {
      type: [String, Number],
      default: '',
    },
    /**
     * 自定义class值
     */
    className: {
      type: String,
      default: 'w-300',
    },
    /**
     * placeholder(翻译为占位符)
     */
    placeholder: {
      type: String,
      default: '',
    },
    maxlength: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      config, //全局配置
      iptValue: this.value,
    };
  },
  methods: {
    handleInput(val) {
      this.$emit('update', val);
    },
  },
});
</script>

<style lang="scss">
.w-300 {
  width: 300px;
}
</style>
