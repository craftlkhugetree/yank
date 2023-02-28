<template>
  <div>
    <!-- <van-search
      style="width:100%"
      v-model="keyword"
      placeholder="请输入订单号"
      shape="round"
      @input="doSearch"
      @clear="doSearch"
    />-->
    <van-list
      class="list-box"
      v-model="loading"
      :finished="finished"
      @load="getList(currentPage,limit)"
      ref="list"
      v-if="activeTab=='self'"
    >
      <personal-item
        class="list-item"
        v-for="(item, index) in list"
        :key="item.id"
        :item="item"
        :class="`animation-${index + 1}`"
        @click.native="toDetail(item)"
      ></personal-item>
      <div slot="finished" :class="`animation-${list.length + 1}`">
        <van-divider
          :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
        >没有更多了</van-divider>
      </div>
    </van-list>

    <van-list
      v-model="loading"
      :finished="finished"
      @load="getList(currentPage,limit)"
      ref="list"
      v-else
    >
      <company-item
        class="list-item"
        v-for="(item, index) in list"
        :key="item.id"
        :item="item"
        :class="`animation-${index + 1}`"
        @click.native="toDetail(item)"
      ></company-item>
      <div slot="finished" :class="`animation-${list.length + 1}`">
        <van-divider
          :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
        >没有更多了</van-divider>
      </div>
    </van-list>
  </div>
</template>

<script>
import { fetchRecordList } from "@/api/client/record";
import CompanyItem from "./companyItem";
import PersonalItem from "./personalItem";

export default {
  components: {
    CompanyItem,
    PersonalItem
  },
  props: {
    activeTab: String
  },
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      currentPage: 1,
      limit: 10,
      keyword: null
    };
  },
  methods: {
    // 详情 订单类型 1个人 2团体group
    toDetail(item) {
      if (this.activeTab == "self") {
        this.$router.push(`/personalOrder/${item.id}`);
      } else {
        this.$router.push(`/companyOrder/${item.id}`);
      }
    },

    doSearch() {
      this.currentPage = 1;
      this.getList(this.currentPage, this.limit);
    },

    // 获取列表数据
    getList(page, limit) {
      let data = {
        filter: {
          createrid: "myself",
          id: this.keyword ? this.keyword : null,
          ordertype: this.activeTab
        },
        page: page,
        limit: limit || this.limit
      };
      fetchRecordList(data)
        .then(res => {
          this.$toast.clear();
          this.loading = false;
          let list = res.data || [];
          this.list = page === 1 ? list : this.list.concat(list);
          this.finished = list.length < this.limit ? true : false;
          this.currentPage = page + 1;
        })
        .catch(err => {
          this.$toast.clear();
          this.loading = false;
          this.finished = true;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.van-search {
  background: none;
}
.van-search__content--round {
  background: #fff;
}
.van-list {
  padding: 24px;
}
</style>