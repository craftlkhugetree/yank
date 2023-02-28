<template>
  <div>
    <van-nav-bar title="服务监督查询" left-arrow fixed @click-left="goback" />
    <div style="width:100%;height:46px;"></div>
    <van-search v-model="keyword" placeholder="请输入关键字搜索" shape="round" @search="search" />
    <!-------------------------- 列表 -------------------------->
    <van-list
      ref="list"
      v-model="loading"
      :finished="finished"
      @load="getList(currentPage,limit)"
      :immediate-check="false"
    >
      <list-item
        v-for="(item, index) in list"
        :key="item.id"
        :item="item"
        :operType="operType"
        :isMy="isMy"
        :class="`animation-${index + 1}`"
      ></list-item>
      <div class="nodata animation-1" v-if="list.length === 0 && !loading">
        <img src="../../static/images/nodata.png" width="100%" alt />
        <p>没有找到相关记录</p>
      </div>
    </van-list>
  </div>
</template>

<script>
import listItem from "../components/SimpleListItem";
export default {
  components: {
    listItem
  },
  data() {
    return {
      keyword: sessionStorage.getItem("searchKeyword") || null,
      list: [],
      currentPage: 1,
      limit: 10,
      loading: false,
      finished: false,
      isMy: sessionStorage.getItem("isMy") || "0",
      operType: sessionStorage.getItem("searchOperType") || "view"
    };
  },
  watch: {
    isMy() {
      this.getList(1, this.limit);
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    // 查询
    search() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      this.getList(1, this.limit);
    },
    // 获取列表数据
    getList(page, limit) {
      let params = sessionStorage.getItem("searchParams");
      let filter = params ? JSON.parse(params) : {};
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: {
            filter: { ...filter, keyword: this.keyword },
            limit: limit,
            page: page
          }
        })
        .then(res => {
          this.$toast.clear();
          this.loading = false;
          let list = res.data || [];
          list.forEach(i => {
            i.markscore = parseInt(i.markscore);
          });
          this.list = page === 1 ? list : this.list.concat(list);
          this.finished = list.length < this.limit ? true : false;
          this.currentPage = page + 1;
          sessionStorage.setItem("searchKeyword", this.keyword);
        })
        .catch(err => {
          this.$toast.clear();
          this.loading = false;
          this.finished = true;
        });
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.list.check();
    }, 600);
  }
};
</script>

<style lang="scss" scoped>
.nodata {
  width: 100%;
  height: calc(100vh - 100px);
  background: #ffffff;
  text-align: center;
  img {
    width: 80px;
    height: 80px;
    margin: 60px 0 12px;
  }
  p {
    font-size: 12px;
    color: #999999;
  }
}
</style>