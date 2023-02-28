<template>
  <div>
    <el-drawer
      class="base-drawer"
      :title="title"
      :visible="drawer"
      direction="rtl"
      :wrapperClosable="false"
      @close="closeDrawer"
      v-loading="drawerLoading"
      size="660px"
      v-if="drawer"
    >
      <slot />
      <div class="drawer-footer">
        <el-button type="primary" size="small" @click="saveAccount">保存</el-button>
        <el-button size="small" @click="closeDrawer">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GDrawer',
  props: {
    drawerLoading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
    drawer: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data() {
    return {
    };
  },
  methods: {
    saveAccount() {
      this.$emit('save');
    },
    closeDrawer() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss" scoped></style>
