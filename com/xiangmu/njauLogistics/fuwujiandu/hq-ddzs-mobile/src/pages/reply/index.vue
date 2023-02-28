<template>
  <van-popup
    v-model="replyShow"
    position="right"
    :style="{ height: '100%', width: '95%' }"
    @close="close"
  >
    <!-- @click-overlay="close" -->
    <role-bar title="事件"></role-bar>
    <div class="bg">
      <tab-list :tabs="tabs" @signal="changeTab"></tab-list>
      <van-search
        @search="onSearch"
        :clearable="false"
        v-model="keyword"
        placeholder="请输入"
        maxlength="20"
        class="v_search wind"
        :autocomplete="false"
      />
      <list
        ref="list"
        :data.sync="label"
        :resHook="resHook"
        :getList="getList"
        :params="params"
        :total="total"
      >
        <van-cell v-for="item in label" :key="item.id" @click="doChoose(item)">
          <div class="div_flex font-s type-item">
            <div class="name ellipsis">{{ item.content }}</div>
          </div>
        </van-cell>
      </list>
    </div>
  </van-popup>
</template>
<script>
import { commonReply_query, historyReply_query } from "@/assets/js/api";
export default {
  name: "ReplyList",
  props: {
    replyShow: Boolean
  },
  components: {
    tabList: () => import("@/components/tabList"),
    list: () => import("@/components/list")
  },
  data() {
    return {
      label: [],
      form: {},
      keyword: "",
      params: { limit: 20, page: 1, filter: { keyword: "" } },
      total: 0,
      getList: commonReply_query,
      tabs: [
        {
          name: "0",
          title: "常用回复",
          fun: commonReply_query
        },
        {
          name: "1",
          title: "历史回复",
          fun: historyReply_query
        }
      ]
    };
  },
  watch: {
    // keyword(val) {
    //   this.params.filter.keyword = val;
    // }
  },
  methods: {
    onSearch() {
      this.resetPage();
      this.params.filter.keyword = this.keyword;
    },
    changeTab(str) {
      let obj = this.tabs.find(t => t.name === str);
      this.resetPage();
      this.getList = obj.fun;
    },
    resetPage() {
      this.$refs.list.curPage = 1;
    },
    doChoose(item) {
      //   this.common.setStore(this.global.REPLY, item.content);
      //   this.common.back();
      this.$emit("cho", item);
      this.close();
    },
    close() {
      this.$emit("update:replyShow", false);
    },
    resHook(res) {
      this.common.dealRes(res, () => {
        let label = res.data || [];
        this.label = label;
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
