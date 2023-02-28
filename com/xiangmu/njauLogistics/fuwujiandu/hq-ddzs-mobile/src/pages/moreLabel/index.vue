<template>
  <div>
    <role-bar title="共性标签"></role-bar>
    <div class="title-bg all">
      <list
        ref="list"
        :data.sync="label"
        :resHook="resHook"
        :getList="workLabel_query"
        :params="params"
        :total="total"
      >
        <van-cell v-for="item in label" :key="item.id" @click="goDetail(item)">
          <div class="type-item div_flex">
            <i class="iconfont icontopic c-orange"></i>
            <div class="name font-s ellipsis">{{ item.name }}</div>
            <span class="font-s">{{ item.count }}</span>
          </div>
        </van-cell>
      </list>
    </div>
  </div>
</template>
<script>
import { workLabel_query } from "@/assets/js/api";
export default {
  name: "MoreLabel",
  components: {
    list: () => import("@/components/list")
  },
  data() {
    return {
      workLabel_query,
      label: [],
      params: { limit: 20, page: 1 },
      total: 0
    };
  },
  methods: {
    goDetail(item) {
      this.$router.push({
        path: "/labelDetail",
        query: { ...item, title: "共性标签" }
      });
    },
    resHook(res) {
      this.common.dealRes(res, () => {
        let label = res.data || [];
        label = label.map(b => ({
          count: "半年 " + this.util.bc(b.useCount),
          ...b
        }));
        if (res.curPage === 1) {
          this.label = label;
        } else {
          this.label = this.label.concat(label);
        }
        this.total = this.label.length;
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.all {
  min-height: 100vh;
}
.type-item {
  height: 20px;
  padding: 8px 0;
  text-align: left;
  .name {
    flex-basis: 70%;
    margin-left: 3px;
    color: #595959;
  }
  span {
    margin-left: auto;
    color: #8c8c8c;
  }
}
</style>
