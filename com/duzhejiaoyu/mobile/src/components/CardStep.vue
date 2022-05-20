<template>
  <div class="learn-container">
    <div
      v-for="(learn, index) in list"
      :key="learn.id"
      @click="toLearnId(learn, index)"
      class="learn-box"
    >
      <img v-if="learn.cover" :src="fileUrl + learn.cover" alt />
      <img v-else :src="noPhoto" alt />
      <div class="learn-text">
        <span class="learn-title" :title="learn.name">{{ learn.name }}</span>
        <span class="learn-content" :title="learn.desc">{{ learn.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import noPhoto from "@/assets/img/no-photo.png";
export default {
  name: "cardStep",
  props: {
    modelIndex: Number,
    list: Array,
  },
  data() {
    return {
      fileUrl: window.g.viewUrl,
      noPhoto,
    };
  },
  computed: {},
  methods: {
    toLearnId(learn, index) {
      this.$store.commit("setCurLearn", {
        modelIndex: this.modelIndex,
        learnIndex: index,
      });
      this.$router.push(`/exam/learn/${learn.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.learn-container {
  width: 100%;
}
.learn-box {
  display: flex;
  justify-content: flex-start;
  background: #ffffff;
  border-bottom: 1px solid #e5e8ed;
  margin: 32px;
  cursor: pointer;
  transition: all 1s;
  &:hover {
    transform: scale(1.05);
  }
  img {
    width: 240px;
    height: 135px;
    margin-bottom: 32px;
    margin-right: 32px;
    float: left;
    object-fit: cover;
  }
  .learn-text {
    width: 422px;
    height: 131px;
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis; //...
    .learn-title {
      height: 45px;
      display: block;
      color: rgba(55, 59, 75, 1);
      font-size: 32px;
      white-space: nowrap;
      text-overflow: ellipsis; //...
      overflow: hidden;
      line-height: 45px;
      text-align: left;
    }
    .learn-content {
      height: 74px;
      display: block;
      color: rgba(126, 128, 129, 1);
      text-overflow: ellipsis; //...
      // overflow: hidden;
      font-size: 26px;
      line-height: 37px;
      text-align: left;
      margin-top: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;

      // &::before {
      //   content: '...';
      // }
    }
  }
}
</style>
