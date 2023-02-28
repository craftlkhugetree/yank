<template>
  <div class="tb">
    <div class="content">
      <div class="title div_flex">
        <div>
          <img src="@/assets/img/touxiang.svg" />
          <span>&nbsp;&nbsp;{{ name }}</span>
        </div>
        <img class="img" src="@/assets/img/wuxing.svg" />
      </div>
      <el-divider></el-divider>
      <p class="pre">{{ profile }}</p>
      <!-- <p class="pre">{{ profile.replace(/\s+/g, '\n\r') }}</p> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  props: {
    profile: {
      type: String,
      default: '',
    },
    name: {
      type: String,
    },
  },
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.tb {
  width: 100%;
  background: #ffffff;
  box-shadow: 0rem 10rem 30rem #f3effa;
  border-radius: 4rem;
  .content {
    border-bottom: 1rem solid rgba(204, 204, 204, 0.4);
    padding: 32rem 40rem;
    .title {
      img {
        width: 15rem;
      }
      line-height: 32rem;
      height: 32rem;
      @include fz(24rem, #333, 700);
    }
    .img {
      width: 27rem;
      margin-left: auto;
    }
    .pre {
      @include fz();
      height:  140rem;
      line-height: 120%;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0;
      }
      white-space: pre-wrap;
      word-break: break-all;
      text-align: justify;
      color: #333333;
    }
  }
}
</style>
