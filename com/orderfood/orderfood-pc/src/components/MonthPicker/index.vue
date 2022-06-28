<template>
  <el-popover
    ref="popover"
    popper-class="el-picker-panel el-date-range-picker no-padding"
    placement="bottom-start"
    width="650"
    trigger="click"
  >
    <!-------------------- 选择input -------------------->
    <div
      slot="reference"
      class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange el-range-editor--small"
      @mouseenter="handleMouseEnter"
      @mouseleave="haveTrigger = false"
    >
      <i class="el-input__icon el-range__icon el-icon-date"></i>
      <input
        autocomplete="off"
        placeholder="开始日期"
        :value="displayValue && displayValue[0]"
        :readonly="true"
        class="el-range-input"
      />
      <slot name="range-separator">
        <span class="el-range-separator">至</span>
      </slot>
      <input
        autocomplete="off"
        placeholder="结束日期"
        :value="displayValue && displayValue[1]"
        :readonly="true"
        class="el-range-input"
      />
      <i
        v-if="haveTrigger"
        @click.stop="handleClickIcon"
        class="el-input__icon el-range__close-icon el-icon-circle-close"
      ></i>
    </div>
    <!-------------------- 下拉框 -------------------->
    <div class="el-picker-panel__body-wrapper">
      <div class="el-picker-panel__body">
        <div class="el-picker-panel__content el-date-range-picker__content is-left">
          <div class="el-date-range-picker__header">
            <button
              type="button"
              class="el-picker-panel__icon-btn el-icon-arrow-left"
              @click="toPreMonth"
            ></button>
            <!---->
            <!---->
            <div>{{curMonthName}}</div>
          </div>

          <date-table
            :curMonth="curMonth"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            @pick="handleRangePick"
            @changerange="handleChangeRange"
          ></date-table>
        </div>
        <div class="el-picker-panel__content el-date-range-picker__content is-right">
          <div class="el-date-range-picker__header">
            <!---->
            <!---->
            <button
              type="button"
              class="el-picker-panel__icon-btn el-icon-arrow-right"
              @click="toNextMonth"
            ></button>
            <div>{{nextMonthName}}</div>
          </div>
          <date-table
            :curMonth="nextMonth"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            @pick="handleRangePick"
            @changerange="handleChangeRange"
          ></date-table>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script>
import dateTable from "./dateTable";
export default {
  components: {
    dateTable
  },
  props: {
    value: Array
  },
  data() {
    return {
      haveTrigger: false,
      curMonth: this.moment().format("MM"),
      minDate: null,
      maxDate: null,
      rangeState: {
        endDate: null,
        selecting: false
      }
    };
  },
  computed: {
    displayValue() {
      if (this.value && this.value.length > 0) {
        let st = this.value[0];
        let et = this.value[1];
        return [
          this.moment(st, "MMDD").format("MM月DD日"),
          this.moment(et, "MMDD").format("MM月DD日")
        ];
      } else {
        return [];
      }
    },
    curMonthName() {
      return this.moment(this.curMonth, "MM").format("M月");
    },
    nextMonth() {
      return this.moment(this.curMonth, "MM")
        .add(1, "months")
        .format("MM");
    },
    nextMonthName() {
      return this.moment(this.nextMonth, "MM").format("M月");
    }
  },
  methods: {
    handleMouseEnter() {
      if (this.value && this.value.length > 0) {
        this.haveTrigger = true;
      }
    },
    handleClickIcon() {
      this.minDate = null;
      this.maxDate = null;
      this.$emit("input", null);
    },
    toPreMonth() {
      if (this.curMonth > "01") {
        this.curMonth = this.moment(this.curMonth, "MM")
          .subtract(1, "months")
          .format("MM");
      }
    },
    toNextMonth() {
      if (this.curMonth < "11") {
        this.curMonth = this.moment(this.curMonth, "MM")
          .add(1, "months")
          .format("MM");
      }
    },
    handleRangePick(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      if (this.maxDate) {
        this.$emit("input", [this.minDate, this.maxDate]);
        this.$refs.popover.showPopper = false;
      }
    },
    handleChangeRange(val) {
      this.minDate = val.minDate;
      this.maxDate = val.maxDate;
      this.rangeState = val.rangeState;
    }
  },
  created() {
    if (this.value && this.value.length > 0) {
      this.curMonth = this.moment(this.value[0], "MMDD").format("MM");
      this.minDate = this.value[0];
      this.maxDate = this.value[1];
    }
  }
};
</script>
