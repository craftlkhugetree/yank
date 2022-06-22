<template>
  <div class="base-switch">
    <label>{{label}}</label>
    <img v-if="isOn === '1'" src="../../static/imgs/bm-switch-on.png" style="margin-right:-15px;">
    <img v-else src="../../static/imgs/bm-switch-off.png">
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    isOn: String
  }
};
</script>

<style lang="scss" scoped>
.base-switch {
    label {
        font-size: 10px;
        color: #5b5e67;
        margin-right: 10px;
    }
    img {
        height: 64px;
        vertical-align: middle;
        margin-top: 14px;
    }
}
</style>