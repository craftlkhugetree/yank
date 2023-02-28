<template>
  <div>
    <van-nav-bar title="服务监督" fixed />
    <div class="bg">
      <img src="../../static/images/bg.png" width="100%" alt />
    </div>
    <!-------------------------- 我要说 -------------------------->
    <div class="basic-box">
      <div class="basic-box-title">我要说</div>
      <div class="basic-box-content clearfix">
        <div class="type-item" v-for="item in serviceTypes" :key="item.type" @click="toTalk(item)">
          <img :src="item.image" alt />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-------------------------- 我的/全部 Tab -------------------------->
    <div class="basic-box" style="margin-bottom: 0">
      <div class="tabs basic-box-title clearfix">
        <div
          class="tabs-item"
          v-for="item in tabs"
          :key="item.id"
          :class="{ active: activeTab == item.id }"
          @click="changeTab(item)"
        >
          <i :class="item.icon" v-if="item.icon"></i>
          <span>{{ item.name }}</span>
        </div>
        <div class="right-btns" @click="toSearch">
          <i class="iconfont iconchaxun"></i>
        </div>
      </div>
    </div>
    <!-------------------------- 我的/全部 Tab内容 -------------------------->
    <my-apply-list v-if="activeTab == 1"></my-apply-list>
    <all-apply-list v-if="activeTab == 2"></all-apply-list>

    <!-------------------------- 我要问 -------------------------->
    <div class="ask" style="bottom: 105px;">
      <a href="https://njau.campusphere.net/wec-amp-boya/mobile/index.html#/chat">
        <img src="../../static/images/ask.png" alt />
        <span>我要问</span>
      </a>
    </div>
    <div class="ask" style="bottom: 60px;">
      <a :href="fwzxUrl">
        <img src="../../static/images/fwzx.png" alt />
        <span>服务中心</span>
      </a>
    </div>
  </div>
</template>

<script>
import myApplyList from "./myApplyList";
import allApplyList from "./allApplyList";
export default {
  components: {
    myApplyList,
    allApplyList
  },
  data() {
    return {
      activeTab: sessionStorage.getItem("activeTab") || 1,
      tabs: [
        { id: 1, name: "我的", icon: "iconfont iconquanbu" },
        { id: 2, name: "全部", icon: "" }
      ]
    };
  },
  computed: {
    // 图片地址
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    // 服务中心地址
    fwzxUrl() {
      return window.g.fwzxUrl;
    },
    // 用户id
    applyerid() {
      return this.$store.state.userInfo.ID;
    },
    // 服务类型
    serviceTypes() {
      return this.$store.state.serviceTypes;
    }
  },
  methods: {
    // 我要说
    toTalk(item) {
      sessionStorage.setItem("talkType", item.type);
      this.$router.push("/talk");
    },
    // 切换tab
    changeTab(tab) {
      this.activeTab = tab.id;
      sessionStorage.setItem("activeTab", this.activeTab);
    },
    // 查询
    toSearch() {
      let params = {};
      let isMy = "0";
      if (this.activeTab == 1) {
        params = {
          applyerid: this.applyerid
        };
        isMy = "1";
      } else {
        params = {
          applystatus: "2,3",
          isopen: 1
        };
        isMy = "0";
      }
      sessionStorage.setItem("searchParams", JSON.stringify(params));
      sessionStorage.setItem("isMy", isMy);
      sessionStorage.setItem("searchOperType", "view");
      this.$router.push("/search");
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  padding-top: 46px;
  margin-bottom: 12px;
}
.type-item {
  float: left;
  width: 20%;
  padding: 12px 0;
  text-align: center;
  img {
    width: 46px;
    height: 46px;
  }
  p {
    font-size: 12px;
    color: #5f6464;
  }
}
.right-btns {
  float: right;
  margin-right: 16px;
}
.ask {
  position: fixed;
  right: 20px;
  width: 100px;
  height: 36px;
  background: #ffffff;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.12);
  border-radius: 18px;
  text-align: center;
  padding-top: 4px;
  img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
  span {
    color: #2a2e2e;
  }
}
</style>