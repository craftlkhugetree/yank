<template>
  <div class="namecard" :style="{ height }">
    <slot />
    <div class="content">
      <div class="left">
        <div class="title div_flex">
          <img src="@/assets/img/touxiang.svg" />
          <span>&nbsp;&nbsp;{{ data.name }}</span>
          <s-tips text="查看详细" @inheritClick="click" class="stips"></s-tips>
        </div>
        <div class="summary">
          <div class="text">
            <span :title="data.profile">{{ data.profile }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <cover :img="img" height="182rem"></cover>
      </div>
      <div class="juanz"><span>&nbsp;&nbsp;捐赠图书</span></div>
      <div class="tushu">
        <el-image
          v-for="img in data.personDonateBooks || []"
          :key="img.id"
          class="video_class"
          :src="viewUrl + img.cover"
          :preview-src-list="[viewUrl + img.cover]"
          fit="cover"
        ></el-image>
        <div
          class="right"
          @click="click"
          v-if="data.personDonateBooks && data.personDonateBooks.length"
        >
          <img :src="require(`@/assets/img/right.svg`)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DonateCard',
  props: {
    data: Object,
    route: String,
    height: {
      type: String,
      default: '375rem',
    },
  },
  components: {
    cover: () => import('@/components/cover'),
  },
  data() {
    return {
      fileList: [],
      img: {},
      viewUrl: window.g.viewUrl,
    };
  },
  watch: {
    data(val) {
      this.genImg(val);
    },
  },
  computed: {
    genSize() {
      return function(obj) {
        if (
          obj &&
          Object.prototype.hasOwnProperty.call(obj, 'w') &&
          Object.prototype.hasOwnProperty.call(obj, 'h')
        ) {
          console.log(obj);
          if (obj.w / obj.h < 532 / 256) {
            return { height: '100%', width: 'auto' };
          }
        }
      };
    },
  },
  methods: {
    click() {
      this.$emit('jump', this.route, this.data);
    },
    openImg(obj) {
      window.open(obj.viewUrl, obj.fileName);
    },
    genImg(val) {
      if (val && Object.keys(val).length) {
        this.fileList = [];
        val.attachs &&
          val.attachs.forEach(a => {
            let obj = { ...a };
            obj.viewUrl = window.g.viewUrl + a.id;
            this.fileList.push(obj);
          });
        this.common.getVideoCanvas(
          this.fileList,
          () => {
            this.img = this.fileList[0] || {};
          },
          this
        );
      }
    },
  },
  created() {
    this.genImg(this.data);
  },
};
</script>

<style lang="scss" scoped>
.namecard {
  width: 100%;
  background: #ffffff;
  box-shadow: 0rem 10rem 30rem #f3effa;
  border-radius: 20rem;
  position: relative;
  min-height: 470rem;
  .content {
    padding: 44rem 40rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .left {
      width: 45%;
      overflow: hidden;
      .title {
        img {
          width: 15rem;
        }
        line-height:  $arq * 20rem;
        height:  $arq * 20rem;
        @include fz(18rem, #333333, 700);
        .stips {
          margin-left: auto;
        }
      }
      .summary {
        margin-top: 20rem;
        height: 129rem;
        background: #f9f9f9;
        opacity: 0.8;
        .text {
          padding: 24rem;
          height: 63rem;
          span {
            line-height:  $arq * 19rem;
            word-break: break-all;
            @include fz(14rem, #333333);
            @include moreEllipsis(3);
          }
        }
      }
    }
    .right {
      width: 52%;
    }
    .juanz {
      margin: 5rem 0;
      flex-basis: 100%;
      height: 22rem;
      line-height: 22rem;
      border-left: 2rem solid $color-purple;
      span {
        @include fz(16rem, #333);
        line-height: 22rem;
      }
    }
    .tushu {
      width: 100%;
      display: flex;
      align-items: center;
      .video_class {
        min-width: 18%;
        max-width: 20%;
        height: 146rem;
        margin-right: 1%;
      }
      .right {
        margin-left: auto;
        cursor: pointer;
        img {
          float: right;
        }
      }
    }
  }
  .next {
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: pointer;
  }
  .pre {
    position: absolute;
    bottom: 0;
    left: 0;
    cursor: pointer;
  }
}
</style>
