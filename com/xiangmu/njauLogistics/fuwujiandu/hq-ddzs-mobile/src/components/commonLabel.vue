<template>
  <div class="basic-box">
    <div class="basic-box-title div_flex">
      <div>共性标签</div>
      <div class="more" @click="jump">查看更多</div>
    </div>
    <div class="basic-box-content div_flex">
      <div
        class="div_flex no-wrap type-item"
        v-for="item in label"
        :key="item.id"
      >
        <i class="iconfont icontopic c-orange"></i>
        <div class="ellipsis name font-s " @click="goDetail(item)">
          {{ item.name }}
        </div>
        <span class="no-wrap">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { workLabel_query } from "@/assets/js/api";
export default {
  data() {
    return {
      label: []
    };
  },
  methods: {
    jump() {
      this.$router.push("/moreLabel");
    },
    goDetail(item) {
      this.$router.push({
        path: "/labelDetail",
        query: { ...item, title: "共性标签" }
      });
    },
    getLabel() {
      workLabel_query({
        limit: 10,
        page: 1
      }).then(res => {
        this.common.dealRes(res, () => {
          let label = res.data || [];
          label = label.map(b => ({
            count: "半年 " + this.util.bc(b.useCount),
            ...b
          }));
          this.label = label.slice(0, 4);
        });
      });
    }
  },
  mounted() {
    this.getLabel();
  }
};
</script>
<style lang="scss" scoped>
.basic-box-content {
  max-height: 75px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: $fixed_mb;
  .type-item {
    height: 20px;
    flex-basis: 47%;
    padding: 14px 0;
    text-align: left;
    .name {
      max-width: 70%;
      min-width: 50%;
      margin-left: 3px;
      color: #595959;
    }
    span {
      text-align: right;
      display: block;
      width: 50%;
      font-size: 12px;
      height: 16px;
      line-height: 16px;
      color: #8c8c8c;
      margin-left: auto;
    }
  }
}
</style>
