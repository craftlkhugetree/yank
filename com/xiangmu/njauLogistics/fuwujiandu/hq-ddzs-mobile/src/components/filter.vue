<template>
  <div class="title-bg">
    <div class="search fixed_mb div_flex">
      <i class="iconfont icontopic c-orange" v-if="isLabel"></i>
      <i class="iconfont iconlocal c-orange" v-else></i>
      <span class="no-wrap font-s name">{{
        isLabel ? query.name : query.areaName
      }}</span>
      <span v-if="isLabel" class="font-s count">{{ query.count }}</span>
      <div class="div_flex filter" @click="filter">
        <span>筛选</span>
        <i class="iconfont iconshaixuan"></i>
      </div>
    </div>

    <van-popup
      v-model="showDate"
      round
      position="bottom"
      class="date"
      @close="closeDate"
    >
      <div class="font-s filter-title">全部筛选</div>
      <div class="choose">
        <div class="tip-title">督察时间</div>
        <div class="div_flex">
          <van-field
            v-model="date1"
            placeholder="开始时间"
            readonly
            @focus="openRange"
            @click="openRange"
          />
          <span class="dash">——</span>
          <van-field
            v-model="date2"
            placeholder="结束时间"
            readonly
            @focus="openRange"
            @click="openRange"
          />
        </div>
        <div class="div_flex large">
          <div
            class=" font-s month"
            @click.stop="large('oneWeek')"
            :class="isChoose('oneWeek') ? 'is_choose' : ''"
          >
            近一周
          </div>
          <div
            class=" font-s month"
            @click.stop="large('oneMonth')"
            :class="isChoose('oneMonth') ? 'is_choose' : ''"
          >
            近一个月
          </div>
          <div
            class=" font-s month"
            @click.stop="large('threeMonth')"
            :class="isChoose('threeMonth') ? 'is_choose' : ''"
          >
            近三个月
          </div>
        </div>
      </div>

      <div class="btn div_flex">
        <div class="reset" @click.stop="reset">重置</div>
        <div class="submit" @click.stop="submit">确定</div>
      </div>
    </van-popup>

    <!-- :show-confirm="false" -->
    <van-calendar
      v-model="showRange"
      type="range"
      @confirm="onConfirm"
      :min-date="minDate"
      allow-same-day
      color="#006457"
    />
  </div>
</template>
<script>
export default {
  props: {
    obj: Object
  },
  data() {
    return {
      date1: "",
      date2: "",
      minDate: new Date("2020", "01", "01"),
      showRange: false,
      showDate: false,
      largeStr: ""
    };
  },
  watch: {
    // 切换tab
    // activeName(tab) {
    //   console.log(tab);
    //   this.onSearch();
    //   this.$emit("changeTab", tab);
    // }
  },
  computed: {
    query() {
      return this.$route.query;
    },
    isChoose() {
      return function(str) {
        return str === this.largeStr;
      };
    },
    isLabel() {
      return this.query.title === "共性标签";
    }
  },
  methods: {
    filter() {
      this.showDate = true;
    },
    openRange() {
      this.showRange = true;
    },
    closeDate() {
      this.showRange = false;
      //   this.date1 = "";
      //   this.date2 = "";
    },
    trans(d) {
      let obj = d || new Date();
      return this.util.formatTime(this.util.format14(obj), "yyyy-MM-dd");
    },
    onConfirm(val) {
      if (val && val.length) {
        this.date1 = this.trans(val[0]);
        this.date2 = this.trans(val[1]);
      }
      this.showRange = false;
    },
    large(str) {
      this.largeStr = str;
      this.date2 = this.trans();
      if (str === "oneWeek") {
        this.date1 = this.moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD");
      } else if (str === "oneMonth") {
        this.date1 = this.moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD");
      } else if (str === "threeMonth") {
        this.date1 = this.moment()
          .subtract(90, "days")
          .format("YYYY-MM-DD");
      }
    },
    reset() {
      this.date1 = "";
      this.date2 = "";
      this.largeStr = "";
    },
    submit() {
      this.$emit("onDate", this.date1, this.date2);
      this.showDate = false;
      //   this.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  background: #ffffff;
  padding: 16px;
  width: 100%;
  .filter {
    height: 22px;
    margin-left: auto;
    font-size: 12px;
    line-height: 22px;
    height: 22px;
    display: inline-block;
    color: #8c8c8c;
    span {
      margin-right: 5px;
    }
  }
  .name {
    max-width: 60%;
    margin: 0 8px;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    height: 22px;
    color: #595959;
  }
  .count {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    color: #8c8c8c;
  }
}
.date {
  min-height: 30%;
  .filter-title {
    font-weight: 400;
    font-size: 19px;
    line-height: 28px;
    height: 28px;
    padding: 16px 0;
    text-align: center;
    color: #121212;
  }
  .choose {
    padding: 16px;
    .tip-title {
      font-size: 17px;
      line-height: 24px;
      height: 24px;
      color: #121212;
    }
    /deep/ .van-cell {
      width: 46%;
      padding-left: 0;
      padding-right: 0;
    }
    /deep/ .van-field__control {
      text-align: center;
      height: 44px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .dash {
      padding: 0 5px;
    }
    .large {
      justify-content: space-between;
      .month {
        width: 30%;
        height: 36px;
        border-radius: 24px;
        text-align: center;
        line-height: 36px;
        border: 1px solid #dddddd;
        color: #595959;
        background: #f5f5f5;
      }
      .is_choose {
        background: rgba(0, 100, 87, 0.08);
        border: 1px solid #006457;
        color: #006457;
      }
    }
  }
  .btn {
    margin: 0 16px 16px;
    box-sizing: border-box;
    background: #ffffff;
    font-size: 16px;
    line-height: 46px;
    color: #595959;
    text-align: center;
    .reset {
      border: 1px solid #dddddd;
      border-right: none;
      border-radius: 24px 0 0 24px;
      height: 46px;
      flex-basis: 50%;
    }
    .submit {
      border: 1px solid #dddddd;
      flex-basis: 50%;
      height: 46px;
      border-radius: 0 24px 24px 0;
      background: #006457;
      color: #ffffff;
    }
  }
}
</style>
