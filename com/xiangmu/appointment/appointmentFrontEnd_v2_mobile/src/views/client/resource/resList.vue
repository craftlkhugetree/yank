<template>
  <div class="wrapper">
    <van-nav-bar
      :title="resCollects.name"
      fixed
      :border="false"
      left-arrow
      @click-right="jumpSearch"
      @click-left="$router.go(-1)"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>

    <section class="main-wapper">
      <van-cell center class="head-title" @click="jumpManageInfo">
        <span class="custom-title">
          <img src="@/assets/img/manage-info.png" class="image" />
          查看管理办法
        </span>
        <template #right-icon>
          <van-icon name="arrow" style="color:red" class="arrow-icon" />
        </template>
      </van-cell>

      <van-list
        v-model="loading"
        :finished="finished"
        @load="getResList"
        :immediate-check="immediateCheck"
      >
        <template v-for="(res,index) in resData">
          <div
            class="res-card"
            :class="`animation-${index + 1}`"
            :key="'res'+res.id"
            :body-style="{ padding: '0px' }"
            @click="jumpDetail(res)"
          >
            <div class="img-box">
              <img :src="reviewImg(res.icon) " class="image" v-if="res.icon" />
              <img src="@/assets/img/no-img.png" class="image" v-else />
            </div>
            <div class="right-box">
              <h1 class="name ellipsis">{{res.name}}</h1>
              <p class="res-des">{{res.note}}</p>
            </div>
          </div>
        </template>
        <div slot="finished" :class="`animation-${resData.length + 1}`">
          <van-divider
            :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
          >没有更多了</van-divider>
        </div>
      </van-list>
    </section>
  </div>
</template>
<script>
import { fetchResGrouptList, fetchResList } from "@/api/client/resources.js";
import { log } from "util";
export default {
  data() {
    return {
      resData: [],
      activeId: "",
      total: 0,
      pageSize: 12,
      currentPage: 1,
      loading: false,
      finished: false,
      immediateCheck: false
    };
  },
  components: {},
  created() {},
  computed: {
    resCollects: function() {
      // F5刷新记录当前信息
      if (Object.keys(this.$route.params).length) {
        sessionStorage.setItem(
          "resCollects",
          JSON.stringify(this.$route.params.currentItems)
        );
      }
      let sessionRes = JSON.parse(sessionStorage.getItem("resCollects"));
      return sessionRes;
    }
  },
  mounted() {
    if (this.resCollects && this.resCollects.id) {
      this.activeId = this.resCollects.id;
    }
    // 如果不是立即加载，则延迟加载
    if (!this.immediateCheck) {
      setTimeout(() => {
        this.getResList();
      }, 600);
    }
  },
  methods: {
    //跳转到搜索
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },

    //跳转到管理办法
    jumpManageInfo() {
      this.$router.push({
        name: "manage-info",
        params: { managerinfo: this.resCollects.managerinfo }
      });
    },
    //跳转到详情页
    jumpDetail(curRes) {
      this.$store.commit("setCurrentResDetail", curRes);
      this.$router.push({
        name: "res-detail"
      });
    },

    // 默认展示资源下的第一个图片
    reviewImg(icon) {
      let firstIcon = icon.split(",")[0];
      return `${window.g.viewUrl}${firstIcon}`;
    },

    //获取资源列表
    getResList() {
      let params = {
        filter: { resgroupid: this.activeId, status: "1" },
        limit: this.pageSize,
        page: this.currentPage
      };
      fetchResList(params).then(res => {
        if (res.success) {
          this.loading = false;
          this.resData = res.data;
          this.total = res.total;
          if (this.resData.length >= 0) {
            this.finished = true;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-wapper {
  padding: 32px;
}
.head-title {
  margin-top: 80px;
  height: 68px;
  background: #fafafa;
  border-radius: 8px;
}
.custom-title {
  font-size: 24px;
  color: #3f86f7;
  .image {
    vertical-align: middle;
    margin-right: 10px;
    width: 48px;
    height: 48px;
  }
}

i.arrow-icon.van-icon.van-icon-arrow {
  color: #cccccc !important;
}
</style>
