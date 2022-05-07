<template>
  <div class="step">
    <div
      class="step-box"
      :class="{'last': index == list.length-1,'active': index == curLearn.modelIndex}"
      v-for="(item,index) in list"
      :key="item.id"
    >
      <!-------------- 普通考试 -------------->
      <div class="step-item" v-if="exam.type=='1'" @click="changeModel(index)">
        <img src="@/assets/img/learn-color.png" alt />
        <p>{{item.name}}</p>
      </div>
      <!-------------- 闯关考试 -------------->
      <div class="step-item" v-else @click="changeModel(index)">
        <img v-if="item.isPass=='1'" class="tag" src="@/assets/img/learn-finish.png" alt />
        <img v-if="canClick(index)" src="@/assets/img/learn-color.png" alt />
        <img v-else src="@/assets/img/learn-gray.png" alt />
        <p>{{item.name}}</p>
      </div>
      <img class="line" v-if="index < list.length-1" src="@/assets/img/learn-arrow-color.png" alt />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    exam: Object, // type :1-普通考试，2-闯关考试, isOrder: 是否顺序闯关
    list: Array
  },
  computed: mapState({
    curLearn: state => state.curLearn
  }),
  methods: {
    // 闯关考试是否可以点击： 不按顺序闯关 || 第一个模块 || 前一个模块已通过
    canClick(index) {
      return this.exam.isOrder == '0' || index == 0 || this.list[index - 1].isPass == '1'
    },
    // 点击模块
    changeModel(index) {
      let model = this.list[index]
      // 可以点击的情况： 普通考试 || 不按顺序闯关 || 第一个模块 || 前一个模块已通过
      if (this.exam.type == '1' || this.canClick(index)) {
        this.$store.commit('setCurLearn', {
          modelIndex: index,
          learnIndex: 0
        })
        this.$emit('doFunc')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step {
  overflow-x: auto;
  display: flex;
  justify-content: space-between;
  width: 1200px;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
  border-radius: 5px;
}
.step-box {
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  &.last {
    flex: 1;
  }
  &.active {
    .step-item {
      border-bottom: 4px solid #3a78fc;
      border-radius: 2px;
    }
  }
  .line {
    width: 60px;
    height: 20px;
  }
}
.step-item {
  padding: 20px;
  display: inline-block;
  position: relative;
  img {
    width: 60px;
    height: 60px;
  }
  .tag {
    width: 14px;
    height: 29px;
    position: absolute;
    top: 0;
    left: 0;
  }
  p {
    margin-top: 10px;
    color: #373b4b;
    line-height: 20px;
  }
}
</style>