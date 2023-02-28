
<template>
  <div class="infos">
    <h1 class="title">{{ info.title }}</h1>
    <p class="applyerinfo" v-show="showApplyer">
      <span>报修人：{{ info.applyername }}</span>
      <span class="right">联系方式：{{ info.mobile }}</span>
    </p>
    <div class="content">物品类型：{{ info.itemname }}</div>
    <div class="content">
      {{ info.note }}
    </div>
    <div class="attaches" v-if="photos.length">
      <img
        :src="$store.state.fileUrl + item"
        v-for="item in photos"
        :key="item"
        alt=""
        @click="showimgs"
      />
    </div>
    <p class="timestate">
      <span class="time">{{
        util.formatTime(info.createtime, "YYYY-MM-DD HH:MM:SS")
      }}</span>
      <span class="state">{{ info.statusname }}</span>
    </p>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  name: "orderinfo",
  data() {
    return {
      photos: [],
    };
  },
  props: {
    info: Object,
    defautl: function () {
      return {};
    },
    showApplyer: {
      type: Boolean,
      default: true,
    },
  },
  components: {},

  methods: {
    showimgs() {
      let imgs = _.map(this.photos, (item) => {
        return this.$store.state.fileUrl + item;
      });
      ImagePreview(imgs);
    },
  },
  created() {
    if (this.info.photos) {
      this.photos = this.info.photos.split(",");
    }
  },
};
</script>
<style lang='scss' scoped>
.infos {
  background-color: #fff;
  padding-bottom: 1px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #464032;
    line-height: 24px;
    padding: 16px;
    border-bottom: 1px solid rgba(219, 219, 219, 1);
  }
  .content {
    font-size: 14px;
    font-weight: 400;
    color: #93928e;
    line-height: 21px;
    margin: 16px;
    margin-top: 12px;
  }
  .attaches {
    margin: 0 16px;
    img {
      width: 80px;
      height: 80px;
      margin-right: 8px;
    }
  }
  .timestate {
    margin: 16px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    .state {
      float: right;
      color: rgba(253, 125, 24, 1);
    }
  }
}
.applyerinfo {
  font-size: 12px;
  font-weight: 400;
  color: #999999;

  margin: 0 16px;
  margin-top: 12px;
  & .right {
    float: right;
  }
}
</style>