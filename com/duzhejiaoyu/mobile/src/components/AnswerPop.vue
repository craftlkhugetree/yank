<template>
  <div>
    <van-popup
      v-model="isPopShow"
      closeable
      position="bottom"
      round
      :style="{ height: '70%' }"
    >
      <div class="answer-box">
        <span class="answer-text">答题卡</span>
      </div>
      <div
        v-for="(item, itemIndex) in dataList"
        :key="item.id"
        class="question"
      >
        <div class="q-card" v-if="item.total > 0">
          <p>{{ item.typename }}</p>
          <span
            v-for="(q, index) in item.questions"
            :key="index"
            :class="{
              active: itemIndex == curTypeIndex && index == curIndex,
              done: isExam && q.done,
              'done-hover': isExam && q.done && itemIndex == curTypeIndex && index == curIndex,
              wrong: !isExam && !q.answerResult,
            }"
            @click="
              $emit('choose', itemIndex, index, orderInAll(itemIndex, index))
            "
            >{{ orderInAll(itemIndex, index) }}</span
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "answerPop",
  props: {
    dataList: Array,
    curTypeIndex: Number,
    curIndex: Number,
    isExam: Number
  },
  data() {
    return {
      isPopShow: false,
    };
  },
  computed: {
    // 当前总题号
    orderInAll() {
      return (typeIndex, cIndex) => {
        let num = 0;
        const arr = this.dataList.slice(0, typeIndex);
        if (arr.length > 0) {
          arr.forEach((a) => {
            a.total > 0 ? (num += a.total) : null;
          });
        }
        num += cIndex + 1;
        return num;
      };
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
/deep/ .van-popup {
  // border-radius: 60px 60px 0 0;
  overflow-y: auto;
  .answer-box {
    height: 93px;
    width: 100%;
    background: #fff5da;
    display: flex;
    justify-content: center;
    align-items: center;
    .answer-text {
      display: block;
      width: 96px;
      height: 45px;
      font-size: 32px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #f68447;
      line-height: 45px;
    }
  }
  .question {
    margin: 60px 60px auto 60px;
    .q-card {
      width: 100%;
    }
    p {
      margin-bottom: 10px;
      width: 84px;
      height: 40px;
      display: block;
      overflow-wrap: break-word;
      color: rgba(31, 35, 47, 1);
      font-size: 28px;
      white-space: nowrap;
      line-height: 40px;
      text-align: left;
    }
    span {
      display: inline-block;
      width: 80px;
      height: 80px;
      line-height: 80px;
      font-size: 32px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1f232f;
      text-align: center;
      background: #ffffff;
      border-radius: 50%;
      border: 1px solid #d8dadb;
      margin: 0 10px 10px 0;
      cursor: pointer;
      &.active,
      &:hover {
        color: #3a78fc;
        background: #EDEEFD;
        border-radius: 50%;
        border: 1px solid #92b4fc;
      }
      &.done {
        color: #ffffff;
        background: #8289F1;
      }
      &.done-hover {
        color: #ffffff;
        background: #8289F1;
      }
      &.wrong {
        background: #FFF1F0;
        border: 1px solid #FFA5A0;
      }
    }
  }
}
</style>
