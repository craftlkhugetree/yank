<template>
  <div class="text">
    {{ text }}
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GTitle',
  props: {
    text: {
      type: String,
      default: '',
      required: true,
    },
  },

  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.text {
  width: 100%;
  line-height: 38rem;
  height: 38rem;
  text-align: center;
  margin-top: 40rem;
  margin-bottom: 15rem;
  @include fz(28rem, #000);
}
</style>
