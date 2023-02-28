<template>
  <div class="noNav">
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <!-- <img :src="global.viewUrl + image" alt="" /> -->
        <van-image
          class="img"
          :src="global.viewUrl + image"
          fit="cover"
          @click="openImg(index)"
        />
      </van-swipe-item>
    </van-swipe>
    <div class="div_flex tips">
      <div class="green div_flex" @click.stop="jump(form)">
        <i class="iconfont iconlocal"></i><span>{{ form.areaName }}</span>
      </div>
      <div @click.stop="void 0">{{ handleDept }}</div>
    </div>
    <div class="rich_text">
      <span>{{ form.note }}</span>
      <span class="label">{{ labels }}</span>
    </div>
    <v-List :list="voiceList"></v-List>
    <div class="time div_flex">
      <span>{{ form.createTime || "--" }}</span>
      <span v-if="!isYWZX">{{ form.createName + `(${form.createId})` }}</span>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
export default {
  name: "Rotation",
  components: {
    vList: () => import("@/components/voiceList")
  },
  props: {
    form: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isYWZX() {
      return this.global.YWZX === this.common.getStore(this.global.roleName);
    }
  },
  watch: {
    form: {
      handler() {
        this.images = (this.form.photos && this.form.photos.split(",")) || [];
        let tableList = this.$store.state.departments;
        this.handleDept = (
          tableList.find(t => t.ID === this.form[this.global.handleDeptId]) ||
          {}
        ).NAME;
        let labelArr = this.form.labels ? this.form.labels.split(",") : [];
        labelArr.forEach(b => {
          this.labels += `#${b}# `;
        });
        this.voiceList =
          (this.form.voices && this.form.voices.split(",")) || [];
      },
      deep: true
    }
  },
  data() {
    return {
      images: [],
      handleDept: "",
      labels: "",
      voiceList: []
    };
  },
  methods: {
    jump(item) {
      this.$router.push({
        path: "/labelDetail",
        query: { ...item, title: "地点" }
      });
    },
    openImg(id) {
      ImagePreview({
        images: this.images.map(f => this.global.viewUrl + f),
        startPosition: id,
        closeable: true
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
/deep/ .van-swipe {
  height: 50vh;
}
/deep/ .van-swipe-item {
  .img {
    // object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
.tips {
  padding: $fixed_mb 0;
  div {
    text-align: left;
    margin-right: $fixed_side;
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    height: 18px;
    color: #8c8c8c;
    background: #f5f5f5;
    border-radius: 24px;
    padding: 0 $fixed_mb;
  }
  .green {
    color: $c-green;
    span {
      margin-left: $fixed_mb;
    }
  }
}
.rich_text {
  width: 100%;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  color: #595959;
  white-space: normal;
  word-wrap: break-word;
  .label {
    color: #ff9900;
  }
}
.time {
  margin-top: $fixed_mb;
  justify-content: space-between;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  height: 18px;
  color: #8c8c8c;
}
</style>
