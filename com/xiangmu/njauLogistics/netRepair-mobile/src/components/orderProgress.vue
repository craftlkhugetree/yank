<template>
  <div class="progresslist">
    <div :class="fullViwe ? 'fulllist' : 'currentevent'">
      <transition-group name="list" tag="div">
        <progressItem
          v-for="(item, index) in list"
          :key="item.id"
          :active="!index"
          :event="item"
        ></progressItem>
      </transition-group>
      <p class="all" @click="fullViwe = !fullViwe" v-if="fullViwe">
        点击收起进展
        <van-icon name="arrow-up" />
      </p>
      <p class="all" @click="fullViwe = !fullViwe" v-if="!fullViwe && eventList.length > 1">
        点击展开进展
        <van-icon name="arrow-down" />
      </p>
    </div>
    <!-- <div class="fulllist" v-if="fullViwe">
      <transition-group name="list" tag="div">
        <progressItem
          v-for="(item, index) in eventList"
          :key="item.id"
          :active="!index"
          :event="item"
        ></progressItem>
      </transition-group>
      <p class="all" @click="fullViwe = !fullViwe" v-if="eventList.length > 1">
        点击收起进展
        <van-icon name="arrow-up" />
      </p>
    </div>
    <div class="currentevent" v-if="!fullViwe">
      <progressItem :event="eventList[0]" :active="true"></progressItem>
      <p class="all" @click="fullViwe = !fullViwe" v-if="eventList.length > 1">
        点击展开进展
        <van-icon name="arrow-down" />
      </p>
    </div> -->
  </div>
</template>

<script>
let eventtype = {
  0: "报修",
  1: "办理",
  2: "撤回",
  3: "退回",
  4: "维修中",
  // 41: "派单",
  // 42: "已维修",
  // 43: "暂不维修",
  // 44: "重复报修",
  6: "维修结束",
  9: "转移"
};
import progressItem from "./orderProgressItem";
export default {
  data() {
    return {
      eventList: [],
      fullViwe: false
    };
  },
  props: {
    events: Array
  },
  computed: {
    list() {
      return this.fullViwe ? this.events : [this.events[0]]
    }
  },
  components: { progressItem },
  methods: {},
  created() {
    this.eventList = this.events;
  }
};
</script>
<style lang='scss' scoped>
.all {
  margin-top: 12px;
  font-size: 10px;
  font-weight: 400;
  color: #999999;
  line-height: 24px;
  text-align: center;
}
</style>