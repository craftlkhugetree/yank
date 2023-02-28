<template>
  <div>
    <div class="title-bg">
      <div class="img" @click="$router.push('/report')"></div>
      <div class="num_tip div_flex">
        <div v-for="item in numTip" :key="item.text" class="num">
          <div
            class="value ellipsis"
            :class="item.highLight ? 'highLight' : ''"
          >
            {{ common.dashVal(item.value) }}
          </div>
          <div class="text">{{ item.text }}</div>
        </div>
      </div>
    </div>
    <!-------------------------- 共性标签 -------------------------->
    <common-label></common-label>
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
import { workOrder_overview } from "@/assets/js/api";
export default {
  components: {
    commonLabel: () => import("@/components/commonLabel"),
    item: () => import("@/components/photoItems"),
    searchBar: () => import("@/components/searchBar")
  },
  data() {
    return {
      tabs: [
        {
          name: "dfc",
          title: "待复查",
          fun: () => {
            this.params.sort = "asc";
            this.$set(this.params.filter, this.global.handleNode, this.combine);
          }
        },
        {
          name: "wddc",
          title: "我的督查",
          fun: () => {
            this.params.sort = "desc";
            this.$delete(this.params.filter, this.global.handleNode);
          }
        }
      ],
      keyword: "",
      params: {
        filter: {
          keyword: "",
          handleNode: `${this.global.DCJC},${this.global.YWZX}`
        },
        roleName: this.global.DCJC,
        sort: "asc"
      },
      numTip: [
        {
          text: "待复查",
          value: "",
          highLight: true
        },
        { text: "当月督查", value: "", highLight: false },
        { text: "累计督查", value: "", highLight: false }
      ]
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
    },
    combine() {
      return `${this.global.DCJC},${this.global.YWZX}`;
    }
  },
  methods: {
    resetPage() {
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
    },
    getOverview() {
      workOrder_overview(this.userId).then(res => {
        this.common.dealRes(res, () => {
          let data = res.data || {};
          this.$set(this.numTip[0], "value", data.dfc);
          this.$set(this.numTip[1], "value", data.dyfc);
          this.$set(this.numTip[2], "value", data.ljfc);
        });
      });
    }
  },
  beforeCreate() {
    this.common.setStore(this.global.roleName, this.global.DCJC);
  },
  mounted() {
    let timer = setInterval(() => {
      if (this.userId !== undefined) {
        this.getOverview();
        clearInterval(timer);
      }
    }, 500);
  }
};
</script>

<style lang="scss" scoped>
.title-bg {
  padding: 0;
  .img {
    padding: 10px 0px -5px;
    height: 118px;
    background: url("~@static/images/woyaoducha.svg") no-repeat center;
    background-size: cover;
  }
  .num_tip {
    padding-bottom: 16px;
    margin: 0 39px;
    justify-content: space-between;
    .num {
      width: 30%;
      div {
        font-weight: 400;
        color: #8c8c8c;
        text-align: center;
      }
      .highLight {
        font-weight: 500;
        font-size: 16px;
        color: #006457;
      }
      .value {
        padding-bottom: 4px;
        font-size: 16px;
        line-height: 22px;
        height: 22px;
      }
      .text {
        font-size: 12px;
        line-height: 16px;
        height: 16px;
      }
    }
  }
}
</style>
