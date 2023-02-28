<template>
  <div>
    <div class="div_flex log" :style="{ '--ddw': 2 * sec + 'px' }">
      <div
        v-for="item in arr"
        :key="item.key"
        class="bar"
        :class="item.key < time ? 'choose' : ''"
      ></div>
    </div>
    <div class="font-s time">{{ transTime }}</div>
  </div>
</template>
<script>
export default {
  props: {
    sec: Number
  },
  data() {
    return {
      arr: [],
      time: 0,
      timer: null
    };
  },
  computed: {
    transTime() {
      let t = this.time;
      if (t < 10) {
        t = "0" + t;
      }
      return "0:" + t;
    }
  },
  methods: {
    start() {
      this.timer = setInterval(() => {
        if (this.time < this.sec) {
          ++this.time;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    }
  },
  mounted() {
    for (let i = 0; i < this.sec; i++) {
      this.arr.push({
        key: i,
        reach: false
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
.log {
  width: var(--ddw);
  justify-content: space-between;
  padding: $fixed_side 0;
  background: #fff;
  .bar {
    // height: 20px;
    height: 14px;
    width: 0.1px;
    border: 0.5px solid #bfbfbf;
    // margin-right: 1px;
  }
  .choose {
    border: 0.5px solid #595959;
  }
}
.time {
  margin: -8px auto 8px;
  text-align: center;
}
</style>
