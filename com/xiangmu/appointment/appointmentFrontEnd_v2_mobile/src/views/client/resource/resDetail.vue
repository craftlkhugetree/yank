<template>
  <div class="main-wapper">
    <van-nav-bar
      title="查看详情"
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

    <div class="swiper-box">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in imgUrls" :key="index">
          <img class="swiper-img" :src="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!---------------------------- 资源详情---------------------------->
    <div class="title-box">
      <h1 class="h1-title van-ellipsis">{{resData.name}}</h1>
      <p class="group-des">
        <span class="group-title van-ellipsis">{{resData.resgroupname}}</span>
        <span class="van-ellipsis">
          <van-icon name="location" />
          {{resData.location}}
        </span>
      </p>
      <p class="note">{{resData.note}}</p>
    </div>

    <!---------------------------- 预约时间表格---------------------------->
    <div class="item">
      <h3 class="title">选择时间</h3>
      <span class="rules" @click="jumpRule()">查看规则</span>
    </div>
    <open-time-table ref="openTimeTable" @setOpenTimes="setOpenTimes"></open-time-table>
  </div>
</template>
<script>
import openTimeTable from "./components/openTimeTable";
import { fetchResDetail } from "@/api/client/resources.js";
export default {
  data() {
    return {
      activeId: "",
      openTimes: [],
      resData: {}
    };
  },
  components: {
    openTimeTable
  },
  created() {},
  computed: {
    resDetailData() {
      return this.$store.state.currentResDetail;
    },
    imgUrls() {
      let imgIds = this.resDetailData.icon
        ? this.resDetailData.icon.split(",")
        : [];
      return imgIds.map(i => window.g.viewUrl + i);
    }
  },
  mounted() {
    if (this.resDetailData && this.resDetailData.id) {
      this.activeId = this.resDetailData.id;
    }
    this.getResDetail();
  },
  methods: {
    jumpRule() {
      this.$router.push({
        name: "appoint-rule"
      });
    },
    //跳转到搜索
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },
    // 设置开放时间
    setOpenTimes(data) {
      this.openTimes = data;
    },

    //获取资源详情
    getResDetail() {
      let params = {
        id: this.activeId
      };
      fetchResDetail(params).then(res => {
        if (res.success) {
          this.resData = res.data;
          this.$store.commit("setCurrentResDetail", res.data);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-wapper {
  margin: 0 auto;
  margin-top: 50px;
}
.swiper-box {
  height: 400px;
}
.swiper-img {
  height: 400px;
  width: 750px;
}
.title-box {
  color: #474d51;
  padding: 32px;
  background: #f6f8fe;
  border-radius: 20px 20px 0px 0px;
  position: relative;
  top: -12px;
  .h1-title {
    height: 48px;
    font-size: 34px;
    font-weight: blod;
    line-height: 48px;
    margin-bottom: 24px;
  }
  i.el-icon-location {
    color: #cccccc;
  }
  .group-des {
    height: 42px;
    line-height: 42px;
    display: flex;
  }
  .group-title {
    display: inline-block;
    color: #ffffff;
    padding: 3px 16px;
    min-width: 120px;
    background: #f56323;
    border-radius: 2px;
    margin-right: 30px;
  }
  .van-icon {
    font-size: 20px;
    color: #cccccc;
    vertical-align: top;
  }
}
.image-view {
  .el-image {
    margin-right: 20px;
    margin-bottom: 12px;
  }
}

.note {
  margin-top: 32px;
  min-height: 72px;
  font-size: 20px;
  line-height: 40px;
  font-weight: 400;
  color: #7d7d80;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  //超出多少行显示省略号
  -webkit-line-clamp: 6;
}

.item {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 32px;
  .title {
    height: 33px;
    font-size: 28px;
    font-weight: blod;
    color: #51575c;
    line-height: 33px;
    position: relative;
    padding: 32px 0 64px 68px;
    &::before {
      display: inline-block;
      content: "";
      width: 12px;
      height: 12px;
      border: 6px solid #3f86f7;
      border-radius: 12px;
      position: absolute;
      left: 32px;
      top: 36px;
    }
  }

  .rules {
    color: #3f86f7;
    font-size: 28px;
  }
}
</style>
