<template>
  <div class="page">
  <!-- <div class="page" :style="{ height: sH }"> -->
    <van-sticky>
      <div class="model">
        <van-nav-bar title="入馆考试" left-arrow @click-left="onClickLeft" />
        <!---------------------------- 模块步骤条 ---------------------------->
        <model-step
          :list="examLearnData"
          :exam="curExam"
          @doFunc="getLoginUserRecords"
        ></model-step>
      </div>
    </van-sticky>
    <div class="card">
      <card-step
        :list="examLearnData[curLearn.modelIndex].learns"
        :modelIndex="curLearn.modelIndex"
        @getRecords="getLoginUserRecords"
      ></card-step>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLoginUserRecords } from "@/api/exam";
export default {
  name: "examLearn",
  components: {
    ModelStep: () => import("@/components/ModelStep.vue"),
    CardStep: () => import("@/components/CardStep.vue"),
  },
  data() {
    return {
      modelId: null,
      learnId: null,
      fileViewUrl: window.g.fileViewUrl,
      imgViewUrl: window.g.viewUrl,
      timer: null,
      learnTimes: 0, // 已学习时长:分钟
      nowLearnTime: 0,
      nowTimer: null,
      lastNeedLearn: 0, // 还需学习时长
      records: [],
      loading: false,
      sH: "auto",
    };
  },
  computed: mapState({
    curExam: (state) => state.curExam,
    examLearnData: (state) => state.examLearnData,
    curLearn: (state) => state.curLearn, // 当前模块id及资料id
    curModel() {
      // 当前模块详情
      return this.examLearnData[this.curLearn.modelIndex];
    },
    modelLearnList() {
      return this.curModel.learns;
    },
    detail() {
      let data = this.modelLearnList[this.curLearn.learnIndex];
      return data;
    },
  }),
  methods: {
    // goback previousTab
    onClickLeft() {
      this.$router.go(-1);
    },
    // 考试
    toExam() {
      // 当前考试内容：闯关考试为当前模块考试内容，普通考试为第一个考试内容
      let exam = this.curExam;
      let content =
        exam.type == "2"
          ? exam.contents.find((i) => i.modelId == this.curModel.id)
          : exam.contents[0];
      this.$store.commit("setCurExam", {
        ...exam,
        content,
      });
      this.$router.push("/exam/examing");
    },

    // 切换学习资料
    changeLearn(index) {
      this.$store.commit("setCurLearn", {
        modelIndex: this.curLearn.modelIndex,
        learnIndex: index,
      });
      this.getLoginUserRecords();
    },

    // 获取登录人学习记录
    getLoginUserRecords() {
      this.loading = true;
      return getLoginUserRecords()
        .then((res) => {
          this.loading = false;
          if (res.code == "000000") {
            let data = res.data || [];
            this.records = data;
            this.setLastNeedLearn();
            return Promise.resolve(data);
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          return Promise.reject(err);
        });
    },

    // 设置需要学习时间--普通考试1,闯关考试2
    setLastNeedLearn() {
      let diff = 0;

      // 普通考试
      if (this.curExam.type == "1") {
        this.nowLearnTime = this.records.reduce((sum, cur) => {
          return sum + cur.duration * 60;
        }, 0);
        diff = this.curExam.needLearn * 60 - this.nowLearnTime;
      }

      // 闯关考试
      if (this.curExam.type == "2") {
        let moduleRecords = this.records.filter((j) => {
          // j.modelIds.includes(this.curModel.id)
          let t = j.modelIds || [];
          if (typeof t === "string") {
            t = t.split(",");
          }
          t.forEach((c, id) => {
            t[id] = c + "";
          });
          return t.includes(this.curModel.id + "");
        });
        // 当前模块的学习时间
        this.nowLearnTime = this.curModel.learnTimes = moduleRecords.reduce(
          (sum, cur) => {
            return sum + cur.duration * 60;
          },
          0
        );
        diff = this.curModel.needLearn * 60 - this.nowLearnTime;
      }

      this.lastNeedLearn = diff > 0 ? diff : 0;
      this.$store.commit("setTime", {
        now: this.nowLearnTime,
        need: this.lastNeedLearn,
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.nowTimer);
  },
  created() {
    this.getLoginUserRecords();
  },
  // mounted() {
  //   setTimeout(() => {
  //     let h = document.body.scrollHeight;
  //     if (h > 1040) {
  //       this.sH = h + 'px';
  //     }
  //   }, 2000);
  // },
};
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 750px;
  // max-height: 1334px;
  background-color: rgba(255, 255, 255, 1);
  .model {
    position: sticky;
  }
  .card {
    min-height: 1040px;
    margin-bottom: 120px;
    // max-height: 1334px;
    // overflow-y: auto;
  }
}
</style>
