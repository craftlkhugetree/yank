<template>
  <div class="main">
    <div class="content div_flex">
      <el-image
        class="video_class"
        :src="data.url"
        :preview-src-list="[data.url]"
        fit="contain"
      ></el-image>
      <div class="mid">
        <span class="title ellipsis" :title="data.name">{{ data.name }}</span>
        <div>
          <span class="ellipsis">
            {{ notPaper ? '作者：' + data.author : '署名：' + data.studentName }}
          </span>
          <span class="ellipsis" v-if="notPaper">日期：{{ genDate(data) }}</span>
          <span class="ellipsis" v-if="notPaper">出版：{{ data.publisher }}</span>
          <span class="ellipsis" v-if="notPaper">ISBN：{{ data.isbn }}</span>
        </div>
      </div>
      <div class="right">
        <div class="text">
          <span :title="data.summary">{{ data.summary }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublishBook',
  props: {
    data: Object,
    notPaper: Boolean,
  },
  computed: {
    genDate() {
      return function(row) {
        let month = row.publishMonth ? row.publishMonth + '月' : '';
        let day = row.publishDay ? row.publishDay + '日' : '';
        return row.publishYear + '年' + month + day;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  background: #ffffff;
  border-radius: 4rem;
  //   margin: 20rem 0;
  .content {
    padding: 24rem;
    .video_class {
      width: 146rem;
      height: 217rem;
    }
    .mid {
      text-align: left;
      margin-left: 20rem;
      height: 217rem;
      width: 30%;
      .title {
        width: 100%;
        line-height: 150%;
        @include fz(20rem, #333, 700);
      }
      > div {
        margin-top: 24rem;
        line-height: $arq * 14rem;
        span {
          width: 100%;
          margin-bottom: 10rem;
          display: block;
          @include fz(14rem, #333);
        }
      }
    }
    .right {
      margin-left: auto;
      background: #f9f9f9;
      opacity: 0.8;
      width: 436rem;
      height: 217rem;
      .text {
        padding: 24rem 24rem 46rem;
        height: 133rem;
        span {
          line-height:  $arq * 21rem;
          word-break: break-all;
          @include fz(14rem, #333333);
          @include moreEllipsis(6);
        }
      }
    }
  }
}
</style>
