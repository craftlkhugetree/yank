<template>
  <div class="item">

      <h2 class="title">
        {{ info.title }}
      </h2>
      

    <div class="orderinfos">
      <div class="leftinfo">
        <div class="ordercontent">
          {{ info.note }}
          <span class="more" v-if="info.note && info.note.length > 80"
            >...</span
          >
        </div>
        <p class="ordertime">
          {{ util.formatTime(info.createtime, "YYYY-MM-DD HH:MM:SS") }}
          <span class="ordertitlestate">{{ info.statusname }}</span>
        </p>
      </div>
      <div class="rightimg">
        <img
          src="../../../../static/images/noimg.png"
          v-if="!photos.length"
          alt=""
        />
        <img
          :src="$store.state.fileUrl + photos[0]"
          v-if="photos.length"
          alt=""
        />
        <span class="imgnum" v-if="photos.length">
          <span>{{ photos.length }}图</span></span
        >
      </div>
    </div>
    <slot name="states"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      photos: [],
    };
  },
  props: {
    info: Object,
  },
  components: {},

  methods: {
    toDetail() {
      this.$router.push("/OrderDetail:" + this.info.id);
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
.item {
  background-color: #fff;
  padding: 12px;
  border-radius: 5px;
}
.title {
  font-size: 14px;
  font-weight: 600;
  color: #464032;
  line-height: 21px;
  height: 21px;
  overflow: hidden;
  width: 98%;
  .ordertype {
    display: inline-block;
    background-color: rgba(246, 246, 246, 1);
    font-weight: 400;
    color: #a7a7a7;
    font-size: 12px;
    line-height: 18px;
    padding: 0 6px;
    margin-right: 8px;
  }
}
.orderinfos {
  margin-top: 12px;
  font-size: 12px;
  font-weight: 400;
  height: 60px;
  color: #93928e;
  .leftinfo,
  .rightimg {
    float: left;
  }
  .rightimg {
    width: 60px;
    height: 100%;
    margin-left: 12px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
    .imgnum {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.3);
      width: 24px;
      height: 18px;
      text-align: center;
      border-top-left-radius: 3px;
      border-bottom-right-radius: 3px;
      span {
        display: inline-block;
        -webkit-transform: scale(0.8);
        font-size: 10px;
        font-weight: 400;
        color: #ffffff;
        line-height: 18px;
      }
    }
  }
  .leftinfo {
    width: calc(100% - 72px);
    .ordercontent {
      height: 36px;
      max-height: 36px;
      font-size: 12px;
      font-weight: 400;
      color: #93928e;
      line-height: 18px;
      overflow: hidden;
      position: relative;
      .more {
        position: absolute;
        bottom: 0;
        right: 0;
        background: #fff;
        padding-left: 10px;
      }
    }
    .ordertime {
      margin-top: 6px;
    }
  }
}
</style>