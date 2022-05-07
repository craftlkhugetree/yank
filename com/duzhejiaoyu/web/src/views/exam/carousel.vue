<template>
  <el-carousel indicator-position="outside" height="200px" :autoplay="false" trigger="click">
    <el-carousel-item v-for="index in pages" :key="index">
      <div class="learn-container">
        <div class="learn-box" v-for="(learn,learnIndex) in list.slice((index-1)*4,index*4)" :key="learn.id" @click="toLearn(learnIndex)">
          <img v-if="learn.cover" :src="fileUrl + learn.cover" alt />
          <img v-else src="@/assets/img/no-photo.png" alt />
          <p>{{learn.name}}</p>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  props: {
    modelIndex: Number,
    list: Array
  },
  data() {
    return {
      fileUrl: window.g.viewUrl
    }
  },
  computed: {
    pages() {
      return Math.ceil(this.list.length / 4)
    }
  },
  methods: {
    toLearn(index) {
      this.$store.commit("setCurLearn",{
        modelIndex: this.modelIndex,
        learnIndex: index
      })
      this.$router.push(`/exam/learn`)
    }
  }
}
</script>

<style lang="scss">
.learn-container {
  display: flex;
  justify-content: flex-start;
}
.learn-box {
  width: 215px;
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(3, 27, 78, 0.06);
  border: 1px solid #e5e8ed;
  margin-right: 20px;
  cursor: pointer;
  transition: all 1s;
  &:hover {
    transform: scale(1.05);
  }
  &:last-child {
    margin-right: 0;
  }
  img {
    width: 100%;
    height: 133px;
    object-fit: cover;
  }
  p {
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 26px;
    padding: 16px;
  }
}
</style>