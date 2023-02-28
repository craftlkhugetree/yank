<template>
  <van-popup
    v-model="centerShow"
    position="right"
    :style="{ height: '100%', width: '95%' }"
    @close="close"
  >
    <role-bar title="整改反馈"></role-bar>
    <div class="bg">
      <van-search
        :clearable="false"
        @search="onSearch"
        v-model="keyword"
        placeholder="请输入"
        maxlength="20"
        class="v_search wind"
        :autocomplete="false"
      />
      <!-- <list
        ref="list"
        :data.sync="label"
        :resHook="resHook"
        :getList="getList"
        :params="params"
        :total="total"
      >
      </list> -->
      <van-cell v-for="item in label" :key="item.ID" @click="doChoose(item)">
        <div class="div_flex font-s type-item">
          <div class="name ellipsis">{{ item.NAME }}</div>
        </div>
      </van-cell>
    </div>
  </van-popup>
</template>
<script>
export default {
  name: "BusinessCenter",
  components: {
    list: () => import("@/components/list")
  },
  data() {
    return {
      centerShow: false,
      label: this.$store.state.departments || [],
      keyword: "",
      params: { limit: 100, page: 1, filter: { keyword: "" } },
      total: 0
    };
  },
  watch: {
    keyword(v) {
      this.label = this.tableList.filter(t => t.NAME.indexOf(v) > -1);
    }
  },
  computed: {
    tableList() {
      return this.$store.state.departments;
    }
  },
  methods: {
    onSearch() {
      this.label = this.tableList.filter(
        t => t.NAME.indexOf(this.keyword) > -1
      );
    },
    resetPage() {
      this.$refs.list.curPage = 1;
    },
    doChoose(item) {
      this.$emit("cho", item);
      this.close();
    },
    close() {
      this.centerShow = false;
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.all {
  height: 100vh;
}
.type-item {
  height: 20px;
  padding: 8px 0;
  text-align: left;
  color: #595959;
  &:hover {
    color: #ff9900;
  }
  &.on {
    color: #ff9900;
  }
  .name {
    flex-basis: 95%;
    margin-left: 3px;
  }
}
.v_search {
  width: 100%;
  /deep/ .van-search__action {
    color: #006457;
  }
}
/deep/ .van-search {
  //   padding-left: 0;
}
</style>
