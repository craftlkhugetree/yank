<template>
  <div class="select-box">
    <div class="select-box-title" :class="{'gray-background': selectPopup}" @click="showPopup">
      <span v-show="!value" style="color:#8c8e95">{{title}}</span>
      <span v-show="value">{{value}}</span>
      <van-icon name="arrow-down" v-show="!selectPopup" />
      <van-icon name="arrow-up" v-show="selectPopup" />
    </div>
    <!-- <van-calendar
      v-model="selectPopup"
      :show-confirm="false"
      @confirm="chooseDate"
      :default-date="defaultDate"
      :min-date="new Date(2001,1,1)"
      :max-date="new Date(2050,1,1)"
    />-->
    <van-popup v-model="selectPopup" position="bottom">
      <van-datetime-picker
        type="date"
        v-model="currentDate"
        @confirm="chooseDate"
        @cancel="chooseDate('')"
        cancel-button-text="清空"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectPopup: false,
      currentDate: new Date(),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2050, 1, 1)
    };
  },
  props: {
    title: String,
    value: String
  },
  methods: {
    // 出现日历弹出层
    showPopup() {
      if (this.value) {
        let date = new Date(Date.parse(this.value));
        this.currentDate = date;
      }
      this.selectPopup = true;
    },
    // 选择日期
    chooseDate(date) {
      this.selectPopup = !this.selectPopup;
      this.$emit("chooseDate", date);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/mixin.scss";
</style>