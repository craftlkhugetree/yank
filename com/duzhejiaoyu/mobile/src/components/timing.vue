<template>
  <div class="mod9">
    <div class="block6">
      <img class="label3" referrerpolicy="no-referrer" :src="clock" />
      <!-- src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnge53c5671ad9e5c44460c2c7f40ab20c0081a411f57d08d4599939727846fb91e" -->
      <div class="bd5 flex-col justify-between">
        <div class="group9 flex-row justify-between">
          <span class="txt7"
            >{{ exam.type === "1" ? "学习总时长" : "本关卡已学" }}&nbsp;</span
          >
          <span class="word13"
            >&nbsp;{{ common.formatNeedTime(nowLearnTime) }}</span
          >
        </div>
        <span class="word14"
          >还需学习&nbsp;{{ common.formatNeedTime(lastNeedLearn) }}</span
        >
      </div>

      <div
        class="bd6"
        :class="canClick ? 'op_disable' : 'op_able'"
        @click="canClick ? void 0 : showConfirm(curModel.id)"
      >
        <span class="txt8">立即考试</span>
      </div>
    </div>
    <confirm
      ref="confirm"
      title="确认开始考试？"
      :text="confirmText"
      cancelText="我再想想"
      confirmText="立即开始"
      @doConfirm="toExam"
    ></confirm>
  </div>
</template>

<script>
import clock from "@/assets/img/clock.png";
import confirmDg from "@/mixins/confirmDialog.vue";
import { mapState } from "vuex";
export default {
  name: "timing",
  mixins: [confirmDg],
  data() {
    return {
      clock,
    };
  },
  components: {
    confirm: () => import("@/components/Confirm"),
  },
  computed: mapState({
    nowLearnTime: (state) => state.time.now,
    lastNeedLearn: (state) => state.time.need,
    exam: (state) => state.curExam,
    examLearnData: (state) => state.examLearnData,
    curLearn: (state) => state.curLearn, // 当前模块id及资料id
    curModel() {
      // 当前模块详情
      return this.examLearnData[this.curLearn.modelIndex];
    },
    canClick() {
      return (
        this.lastNeedLearn > 0 ||
        this.exam.isPass == "1" ||
        this.curModel.isPass == "1"
      );
    },
  }),
  methods: {
    toExam() {
      // 当前考试内容：闯关考试为当前模块考试内容，普通考试为第一个考试内容
      let content = this.exam.type == '1' ? this.exam.contents[0] :
      this.curModel
        ? this.exam.contents.find((i) => i.modelId == this.curModel.id)
        : this.exam.contents[0];
      this.$store.commit("setCurExam", {
        ...this.exam,
        content,
      });
      this.$router.push("/exam/examing");
    },
  },
};
</script>

<style lang="scss" scoped>
.mod9 {
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.05);
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 20;
}
.block3 {
  z-index: 75;
  opacity: 0.1;
  position: absolute;
  left: 232px;
  top: 290px;
  width: 144px;
  height: 6px;
  border-radius: 3px;
  background-color: rgba(58, 120, 252, 1);
}

.block6 {
  width: 686px;
  height: 100px;
  display: flex;
  justify-content: space-between;
}

.label3 {
  width: 32px;
  height: 32px;
  margin-top: 8px;
  display: inline-block;
  //   float: left;
}

.bd5 {
  width: 246px;
  height: 74px;
  margin: 4px 0 0 12px;
  float: left;
}

.group9 {
  width: 246px;
  height: 40px;
  display: flex;
}

.txt7 {
  width: 140px;
  height: 40px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(126, 128, 129, 1);
  font-size: 28px;
  white-space: nowrap;
  line-height: 40px;
  text-align: left;
}

.word13 {
  width: 94px;
  height: 40px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(58, 120, 252, 1);
  font-size: 28px;
  white-space: nowrap;
  line-height: 40px;
  text-align: left;
}

.word14 {
  width: 180px;
  height: 34px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(223, 77, 46, 1);
  font-size: 24px;
  white-space: nowrap;
  line-height: 34px;
  text-align: left;
}

.bd6 {
  height: 80px;
  border-radius: 40px;
  margin-left: 52px;
  width: 344px;
  display: flex;
  float: right;
}
.op_able {
  background-color: #f68447;
}
.op_disable {
  background-color: rgba(250, 201, 165, 1);
}

.txt8 {
  width: 104px;
  height: 38px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 26px;
  font-family: PingFangSC-Semibold;
  white-space: nowrap;
  line-height: 38px;
  margin: auto;
  text-align: center;
}
</style>
