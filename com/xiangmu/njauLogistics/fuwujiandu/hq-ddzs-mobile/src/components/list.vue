<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <!-- <van-list
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
    </van-list> -->
    <slot />
    <div class="font-s tips" @click.stop="void 0">
      <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
      <p v-show="!finished && !loading" @click="onLoad(curPage)">
        点击加载更多
      </p>
      <p v-show="finished && total > 0" style="cursor:none;">
        到底啦
      </p>
    </div>
  </van-pull-refresh>
</template>
<script>
export default {
  name: "List",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 6
    },
    page: {
      type: Number,
      default: 1
    },
    sort: {
      type: String,
      default: "desc"
    },
    orderBy: {
      type: String,
      default: ""
    },
    getList: {
      type: Function,
      required: true,
      default: () => Promise.resolve()
    },
    params: {
      type: Object,
      default: () => ({})
    },
    isPage: {
      type: Boolean,
      default: true
    },
    resHook: Function,
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      error: false,
      curPage: 1
    };
  },
  computed: {
    oneTrigger() {
      return {
        gl: this.getList,
        p: this.params
      };
    }
  },
  watch: {
    oneTrigger: {
      handler() {
        this.onLoad(this.page);
      },
      immediate: false,
      deep: true
    }
    // params: {
    //   handler() {
    //     this.onLoad(this.page);
    //   },
    //   deep: true
    // },
    // getList: {
    //   handler() {
    //     this.onLoad(this.page);
    //   },
    //   deep: true
    // }
  },
  methods: {
    onLoad(pageNum) {
      this.loading = true;
      let params = {
        sort: this.sort,
        orderBy: this.orderBy
      };
      if (this.isPage) {
        params = {
          ...params,
          limit: this.limit,
          ...this.params,
          page: pageNum || this.curPage
        };
        if (pageNum) this.curPage = pageNum;
      } else {
        params = { ...params, ...this.params };
      }
      this.getList(params)
        // (this.params.fun || this.getList)(params)
        .then(res => {
          this.resHook({ curPage: this.curPage, ...res });
          if (this.isPage) {
            this.curPage++;
            this.$nextTick(() => {
              this.finished = this.total >= res.total;
            });
          } else {
            this.finished = true;
          }
          this.close();
        })
        .catch(e => {
          // this.resHook({ curPage: this.curPage, ...res, data: [] });
          this.close();
        });
      // this.$emit("update:data", res);
    },
    close() {
      this.loading = false;
      this.refreshing = false;
      this.error = true;
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.curPage = 1;
      this.onLoad(1);
    }
  },
  mounted() {
    this.curPage = this.page;
    this.onLoad();
  }
};
</script>
<style lang="scss" scoped>
.tips {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: $fixed_mb 0;
  color: #bfbfbf;
  // font-size: 16px;
}
</style>
