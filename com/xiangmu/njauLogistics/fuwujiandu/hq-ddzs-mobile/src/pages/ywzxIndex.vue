<template>
  <div>
    <role-bar></role-bar>
    <div class="title-bg">
      <!-------------------------- 共性标签 -------------------------->
      <common-label></common-label>
    </div>
    <search-bar
      :tabs="tabs"
      @changeTab="changeTab"
      @onKey="onKey"
      @onDate="onDate"
    ></search-bar>
    <item :params="params" ref="photoItems"></item>
  </div>
</template>

<script>
import { workOrder_query, workOrder_movedList } from "@/assets/js/api";
export default {
  name: "YWZX",
  components: {
    commonLabel: () => import("@/components/commonLabel"),
    item: () => import("@/components/photoItems"),
    searchBar: () => import("@/components/searchBar")
  },
  data() {
    return {
      tabs: [
        {
          name: "dcl",
          title: "待处理",
          fun: () => {
            let f = { ...this.params.filter };
            f[this.global.handleNode] = this.global.YWZX;
            this.params = {
              filter: f,
              fun: workOrder_query,
              roleName: this.global.YWZX,
              sort: "asc",
              orderBy: "handleStartTime"
            };
          }
        },
        {
          name: "yzy",
          title: "已转移",
          fun: () => {
            let f = { ...this.params.filter };
            delete f[this.global.handleNode];
            this.params = {
              filter: f,
              fun: workOrder_movedList,
              funTab: "yzy",
              roleName: this.global.YWZX,
              sort: "desc",
              orderBy: "handleStartTime"
            };
          }
        },
        {
          name: "qb",
          title: "全部",
          fun: () => {
            let f = { ...this.params.filter };
            delete f[this.global.handleNode];
            this.params = {
              filter: f,
              fun: workOrder_query,
              roleName: this.global.YWZX
            };
          }
        }
      ],
      keyword: "",
      params: {
        filter: {
          keyword: "",
          handleNode: `${this.global.YWZX}`
        },
        roleName: this.global.YWZX,
        sort: "asc",
        orderBy: "handleStartTime"
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    userId() {
      return this.userInfo.ID || this.common.getUserInfo().ID;
    },
    // 图片地址
    fileUrl() {
      return this.$store.state.fileUrl;
    }
  },
  methods: {
    resetPage() {
      if (this.$refs.photoItems && this.$refs.photoItems.$refs.list)
        this.$refs.photoItems.$refs.list.curPage = 1;
    },
    changeTab(tabName) {
      this.resetPage();
      let obj = this.tabs.find(t => t.name === tabName);
      if (obj && obj.fun) obj.fun();
    },
    onKey(key) {
      this.resetPage();
      this.$set(this.params.filter, "keyword", key);
    },
    onDate(d1, d2) {
      this.resetPage();
      if (d1 && d2) {
        this.$set(this.params.filter, this.global.ST, d1.replace(/-/g, ""));
        this.$set(this.params.filter, this.global.ET, d2.replace(/-/g, ""));
      } else {
        this.$delete(this.params.filter, this.global.ST);
        this.$delete(this.params.filter, this.global.ET);
      }
    }
  },
  beforeCreate() {
    this.common.setStore(this.global.roleName, this.global.YWZX);
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.title-bg {
}
</style>
