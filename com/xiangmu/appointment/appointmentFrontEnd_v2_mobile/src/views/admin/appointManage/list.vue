<template>
  <van-list
    v-model="loading"
    :finished="finished"
    @load="getList(currentPage,limit)"
    ref="list"
    v-if="orgId"
    :immediate-check="immediateCheck"
  >
    <list-item
      :isAppointManage="isAppointManage"
      class="list-item"
      v-for="(item, index) in list"
      :key="item.id"
      :item="item"
      :class="`animation-${index + 1}`"
      @click.native="toDetail(item)"
    ></list-item>
    <div slot="finished" :class="`animation-${list.length + 1}`">
      <van-divider
        :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
      >没有更多了</van-divider>
    </div>
  </van-list>
</template>

<script>
import { fetchApplyList } from "@/api/admin/appoint";
import ListItem from "../listItem";
export default {
  components: {
    ListItem
  },
  props: {
    keyword: String,
    immediateCheck: {
      type: Boolean,
      default: true
    },
    // 是否预约管理
    isAppointManage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      currentPage: 1,
      limit: 10
    };
  },
  computed: {
    orgId() {
      return this.$store.state.userInfo.ORGID;
    }
  },
  methods: {
    // 详情
    toDetail(item) {
      this.$router.push(`/appoint-manage/detail/${item.id}`);
    },
    // 获取列表数据
    getList(page, limit) {
      let data = {
        filter: {
          orgid: this.orgId,
          keyword: this.keyword
        },
        page: page,
        limit: limit || this.limit
      };
      fetchApplyList(data)
        .then(res => {
          this.$toast.clear();
          this.loading = false;
          let list = res.data || [];
          list.forEach(i => {
            let imgs = i.resicon;
            imgs = imgs ? imgs.split(",") : [];
            i.imgs = imgs.map(i => window.g.viewUrl + i);
          });
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
  },
  mounted() {
    // 如果不是立即加载，则延迟加载
    if (!this.immediateCheck) {
      setTimeout(() => {
        this.$refs.list.check();
      }, 600);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>