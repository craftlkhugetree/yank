<template>
  <table
    cellspacing="0"
    cellpadding="0"
    class="el-date-table"
    @click="handleClick"
    @mousemove="handleMouseMove"
  >
    <tbody>
      <tr class="el-date-table__row" v-for="(row,index) in rows" :key="index">
        <td
          class="available"
          v-for="(cell,key) in row"
          :key="key"
          :class="{'start-date': cell.start, 'in-range': cell.inRange, 'end-date': cell.end}"
        >
          <div>
            <span>{{cell.text}}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    curMonth: String,
    minDate: {},
    maxDate: {},
    rangeState: {
      default() {
        return {
          endDate: null,
          selecting: false
        };
      }
    }
  },
  data() {
    return {
      rows: [],
      monthDays: [
        {
          months: "01,03,05,07,08,10,12",
          days: 31
        },
        {
          months: "02",
          days: 28
        },
        {
          months: "04,06,09,11",
          days: 30
        }
      ]
    };
  },
  watch: {
    curMonth() {
      this.setRows();
      this.markRange(this.minDate, this.maxDate);
    },

    "rangeState.endDate"(newVal) {
      this.markRange(this.minDate, newVal);
    },
    minDate(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.markRange(this.minDate, this.maxDate);
      }
    },
    maxDate(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.markRange(this.minDate, this.maxDate);
      }
    }
  },
  methods: {
    handleClick(event) {
      let target = event.target;
      if (target.tagName === "SPAN") {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === "DIV") {
        target = target.parentNode;
      }

      if (target.tagName !== "TD") return;
      const row = target.parentNode.rowIndex;
      const column = target.cellIndex;
      const cell = this.rows[row][column];

      const day = cell.text < 10 ? "0" + cell.text : cell.text;
      const newDate = this.curMonth + day;

      if (!this.rangeState.selecting) {
        this.$emit("pick", { minDate: newDate, maxDate: null });
        this.rangeState.selecting = true;
      } else {
        if (newDate >= this.minDate) {
          this.$emit("pick", { minDate: this.minDate, maxDate: newDate });
        } else {
          this.$emit("pick", { minDate: newDate, maxDate: this.minDate });
        }
        this.rangeState.selecting = false;
      }
    },

    markRange(minDate, maxDate) {
      const rows = this.rows;
      for (let i = 0, k = rows.length; i < k; i++) {
        const row = rows[i];
        for (let j = 0, l = row.length; j < l; j++) {
          const cell = row[j];
          const day = cell.text < 10 ? "0" + cell.text : cell.text;
          const time = this.curMonth + day;

          cell.inRange = minDate && time >= minDate && time <= maxDate;
          cell.start = minDate && time === minDate;
          cell.end = maxDate && time === maxDate;
        }
      }
    },

    handleMouseMove(event) {
      if (!this.rangeState.selecting) return;

      let target = event.target;
      if (target.tagName === "SPAN") {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === "DIV") {
        target = target.parentNode;
      }
      if (target.tagName !== "TD") return;

      const row = target.parentNode.rowIndex;
      const column = target.cellIndex;


      const cell = this.rows[row][column];
      const day = cell.text < 10 ? "0" + cell.text : cell.text;
      const newDate = this.curMonth + day;

      this.$emit("changerange", {
        minDate: this.minDate,
        maxDate: this.maxDate,
        rangeState: {
          selecting: true,
          endDate: newDate
        }
      });
    },

    // 初始化table
    setRows() {
      // 获取当月的天数
      let days = this.monthDays.filter(i => i.months.includes(this.curMonth))[0]
        .days;
      let rows = [[], [], [], [], []];
      let day = 1;
      for (let i = 0; i < 5; i++) {
        let row = rows[i];
        for (let j = 0; j < 7; j++) {
          if (day <= days) {
            let cell = {
              text: day,
              inRange: false,
              start: false,
              end: false
            };
            day += 1;
            this.$set(row, j, cell);
          }
        }
      }
      this.rows = rows;
    }
  },
  created() {
    this.setRows();
    this.markRange(this.minDate, this.maxDate);
  }
};
</script>

<style>
</style>