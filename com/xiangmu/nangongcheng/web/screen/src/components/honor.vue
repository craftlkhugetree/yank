<template>
  <div class="main">
    <div class="content div_flex">
      <el-image
        class="video_class"
        :style="{ '--height': height }"
        :src="data.url"
        :preview-src-list="[data.url]"
        fit="contain"
      ></el-image>
      <div class="mid" :style="{ '--height': height }">
        <span :title="data.name" class="title" :style="{ '--line': titleLine }">
          {{ data.name }}
        </span>
        <div v-for="item in keyArr" :key="item.key">
          <span class="ellipsis">
            {{ item.label }} {{ item.key === 'date' ? genDate(data) : data[item.key] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Honor',
  props: {
    data: Object,
    keyArr: Array,
    titleLine: {
      type: Number,
      default: 1,
    },
    height: {
      type: String,
      default: '217rem',
    },
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
  .content {
    padding: 24rem;
    .video_class {
      width: 146rem;
      height: var(--height);
    }
    .mid {
      text-align: left;
      margin-left: 20rem;
      height: var(--height);
      width: 60%;
      .title {
        width: 100%;
        @include fz(20rem, #333, 700);
        @include moreEllipsis(var(--line));
        line-height: 150%;
        word-break: break-all;
      }
      > div {
        margin-top: 5%;
        line-height: $arq * 14rem;
        span {
          width: 100%;
          margin-bottom: 2%;
          display: block;
          @include fz(14rem, #333);
        }
      }
    }
  }
}
</style>
