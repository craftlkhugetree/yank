<template>
  <van-list
    v-model="loading"
    :finished="finished"
    @load="loadList"
    class="list"
  >
    <listItem
      class="listitem"
      v-for="(item, index) in results"
      :key="item.id"
      :info="item"
      :class="`animation-${index + 1}`"
    >
    </listItem>
    <emptyList class="emptylist animation-1" v-show="!results.length"></emptyList>
  </van-list>
</template>

<script>
import emptyList from "@/components/emptyList.vue";
import listItem from "@/components/listItem.vue";
export default {
  data() {
    return {
      searchInput: "",
      loading: false,
      finished: true,
    };
  },
  props: {
    results: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  components: { emptyList, listItem },
  methods: {
    loadList() {
      this.loading = true;
      this.$emit("loadList");
    },
    finishLoading(flag) {
      this.loading = false;
      this.finished = flag;
    },
  },
};
</script>
<style lang='scss' scoped>
.listitem {
  margin-bottom: 12px;
}
.list /deep/ .van-list__finished-text {
  display: none;
}
</style>