<template>
  <div>
    <van-nav-bar title="常用故障" left-arrow fixed @click-left="$router.go(-1)">
    </van-nav-bar>
    <div class="bgc">
      <h1 class="title">常用故障判断</h1>
      <img
        class="problemimg"
        src="../../../static/images/problems.png"
        alt=""
        @click="showImg"
      />
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  data() {
    return {};
  },

  components: {},

  methods: {
    showImg() {
      ImagePreview(["../../../static/images/problems.png"]);
    },
  },
};
</script>
<style lang='scss' scoped>
.bgc {
  height: 100%;
  background-color: #fff;
  margin-top: 56px;
  padding-bottom: 50%;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #464032;
  line-height: 24px;
  text-align: center;
  padding: 12px 0;
}
.problemimg {
  width: 100%;
}
</style>