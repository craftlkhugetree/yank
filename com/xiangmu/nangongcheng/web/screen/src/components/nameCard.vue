<template>
  <div class="namecard" :style="{ height }">
    <slot />
    <div class="content">
      <div class="left">
        <div class="title div_flex">
          <img src="@/assets/img/touxiang.svg" />
          <span>&nbsp;&nbsp;{{ data.name }}</span>
        </div>
        <div class="div_flex num">
          <div v-for="item in genNum" :key="item.key">
            <span class="big">{{ item.data }}</span>
            <span class="small">{{ item.title }}</span>
          </div>
        </div>
        <div class="summary">
          <div class="text">
            <span :title="data.profile">{{ data.profile }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <cover :img="img"></cover>
        <div style="height:15rem"></div>
        <s-tips text="查看详细" @inheritClick="click"></s-tips>
      </div>
    </div>
  </div>
</template>

<script>
import { title, key } from '@/assets/js/options';
export default {
  name: 'NameCard',
  props: {
    data: Object,
    route: String,
    height: {
      type: String,
      default: '375rem',
    },
    nozhuanli: {
      type: Boolean,
      default: false
    }
  },
  components: {
    cover: () => import('@/components/cover'),
  },
  data() {
    return {
      fileList: [],
      img: {},
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
    genNum() {
      let dataCount = this.data.dataCount || {};
      let arr = [];
      title.forEach((t, id) => {
        if(!(this.nozhuanli && t === '专利')) {
          arr.push({ title: t, key: key[id], data: dataCount[key[id]] });
        }
      });
      return arr;
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
  .content {
    padding: 44rem 40rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      width: 45%;
      overflow: hidden;
      .title {
        line-height:  $arq * 20rem;
        height:  $arq * 20rem;
        @include fz(18rem, #333333, 700);
        img {
          width: 15rem;
        }
      }
      .num {
        margin: 20rem 0;
        justify-content: space-between;
        .big {
          display: block;
          text-align: center;
          font-family: 'D-DIN';
          font-style: normal;
          font-weight: 700;
          font-size: 20rem;
          line-height: 22rem;
          height: 22rem;
          color: #000000;
        }
        .small {
          margin-top: 6rem;
          display: block;
          text-align: center;
          line-height: 16rem;
          height: 16rem;
          @include fz(12rem);
        }
      }
      .summary {
        height: 186rem;
        background: #f9f9f9;
        opacity: 0.8;
        .text {
          padding: 24rem;
          height: 133rem;
          span {
            line-height: $arq * 19rem;
            word-break: break-all;
            @include fz(14rem, #333333);
            @include moreEllipsis(6);
          }
        }
      }
    }
    .right {
      width: 52%;
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
