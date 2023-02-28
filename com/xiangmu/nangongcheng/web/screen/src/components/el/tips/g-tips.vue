<template>
  <div @click="click">
    <div class="text">
      {{ text }}
      <span v-if="hasArrow">&nbsp;&gt;</span>
    </div>
    <div class="arrow"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GTips',
  props: {
    text: {
      type: String,
      default: '',
      required: true,
    },
    hasArrow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    click() {
      this.$emit('inheritClick');
    },
  },
});
</script>

<style lang="scss" scoped>
.text {
  line-height: 19rem;
  height: 19rem;
  cursor: pointer;
  @include fz(14rem, $color-purple);
}
</style>
