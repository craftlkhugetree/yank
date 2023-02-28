<template>
  <div class="select-box">
    <div
      class="select-box-title"
      :class="{'gray-background': !selectCollapse}"
      @click="selectCollapse = !selectCollapse;"
    >
      <span v-show="!value" style="color:#8c8e95">{{title}}</span>
      <span v-show="value" class="ellipsis">{{value}}</span>
      <van-icon name="arrow-down" v-show="selectCollapse" />
      <van-icon name="arrow-up" v-show="!selectCollapse" />
    </div>

    <div class="select-box-popup" v-show="!selectCollapse" :style="{'top': top}">
      <div class="select-box-content">
        <li
          :class="{'selected': value === item[optionName]}"
          v-for="item in list"
          :key="item[optionValue]"
          @click="chooseItem(item)"
        >{{item[optionName]}}</li>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectCollapse: true
    };
  },
  props: {
    title: String,
    value: String,
    optionName: String,
    optionValue: String,
    list: Array,
    top: String
  },
  methods: {
    chooseItem(item) {
      this.selectCollapse = !this.selectCollapse;
      this.$emit("chooseItem", item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/mixin.scss";
</style>