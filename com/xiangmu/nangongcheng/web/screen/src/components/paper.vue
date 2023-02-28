<template>
  <div class="main">
    <el-image
      class="video_class"
      :src="data.url"
      :preview-src-list="[data.url]"
      fit="contain"
    ></el-image>
    <div class="mid">
      <span class="title" :title="data.name">{{ data.name }}</span>
      <div>
        <span class="ellipsis">{{ date + genDate(data) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Paper',
  props: {
    data: Object,
    date: String,
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
  width: 215rem;
  height: 317rem;
  .video_class {
    width: 215rem;
    height: 160rem;
  }
  .mid {
    text-align: left;
    padding: 24rem;
    .title {
      width: 100%;
      word-break: break-all;
      line-height: 130%;
      @include fz(16rem, #333, 700);
      @include moreEllipsis(3);
    }
    > div {
      margin-top: 24rem;
      line-height: $arq * 14rem;
      span {
        word-break: break-all;
        width: 100%;
        margin-bottom: 10rem;
        display: block;
        @include fz(8rem, #333);
      }
    }
  }
}
</style>
