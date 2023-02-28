<template>
  <div class="main">
    <van-nav-bar title="智慧校园预约平台" fixed :border="false" @click-right="jumpSearch">
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div class="header-icon">
      <div class="img-box">
        <img src="@/assets/img/logo.png" width="100%" alt />
      </div>
    </div>
    <!---------------------------- 资源列表---------------------------->
    <div class="main-content">
      <van-list v-model="loading" :finished="finished" @load="getResGrouptList">
        <template v-for="group in resGroupData">
          <div class="title-box" :key="'group'+group.id" v-show="group.ress.length">
            <h1 class="title-h1">{{group.name}}</h1>
            <div class="right-btn">
              <span class="manage" @click="jumpManageInfo(group)">管理办法</span>
              <span class="col-line"></span>
              <span class="more" @click="lookMore(group)">更多</span>
              <van-icon class="van-cell__right-icon" name="arrow" />
            </div>
          </div>
          <template v-for="(res,index) in group.ress">
            <div
              class="res-card"
              :class="`animation-${index + 1}`"
              :key="'res'+res.id"
              :body-style="{ padding: '0px' }"
              v-show="index<=1 && res.status=='1' "
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
        </template>
        <div slot="finished" :class="`animation-${ resGroupData.length + 1}`">
          <van-divider
            :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
          >没有更多了</van-divider>
        </div>
      </van-list>
      <!-------------------------- 扫一扫 -------------------------->
      <div class="scan" @click="jumpHome">
        <img src="@/assets/img/function.png" alt />
        功能首页
      </div>
    </div>
  </div>
</template>
<script>
import { fetchResGrouptList } from "@/api/client/resources.js";
import { getUserInfo, getUserGroups } from "@/api/admin/user";

export default {
  data() {
    return {
      resGroupData: [],
      loading: false,
      finished: false
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  components: {},
  created() {},
  mounted() {
    this.getResGrouptList();
  },
  //过滤掉html标签
  filters: {
    filterHtml(val) {
      if (val) {
        val = val.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
        val = val.replace(/&nbsp;/gi, "");
        val = val.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
        val = val.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
        val = val.replace(/ /gi, ""); //去掉
      }
      return val;
    }
  },
  methods: {
    // 默认展示资源下的第一个图片
    reviewImg(icon) {
      let firstIcon = icon.split(",")[0];
      return `${window.g.viewUrl}${firstIcon}`;
    },
    //跳转到搜索
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },
    //跳转到详情页
    jumpDetail(curRes) {
      this.$store.commit("setCurrentResDetail", curRes);
      this.$router.push({
        name: "res-detail"
      });
    },
    //跳转到个人中心
    jumpCenter() {
      this.$router.push({
        name: "center",
        params: { type: "message" }
      });
    },
    // 获取资源集
    getResGrouptList() {
      // 获取用户信息
      this.loading = true;
      getUserInfo().then(res => {
        if (res.success) {
          let data = res.item || {};
          this.$store.commit("setUserInfo", data);
          let param = {
            filter: JSON.stringify({ ID: data.ID }),
            withUserGroup: "1",
            appid: this.$store.state.GROUPID
          };
          getUserGroups(param).then(res => {
            if (res.success) {
              let groups = res.items[0].groups.map(item => item.ID);
              let params = {
                ugroupid: `${this.$store.state.ScoolGROUPID},${groups.join()}`
              };
              fetchResGrouptList(params).then(res => {
                if (res.success) {
                  // 加载状态结束
                  this.loading = false;
                  this.resGroupData = res.data;
                  // 数据全部加载完成
                  this.finished = true;
                }
              });
            }
          });
        }
      });
    },
    //跳转到管理办法
    jumpManageInfo(group) {
      this.$router.push({
        name: "manage-info",
        params: { managerinfo: group.managerinfo }
      });
    },

    lookMore(items) {
      this.$router.push({
        name: "res-list",
        params: { currentItems: items, resGroupData: this.resGroupData }
      });
    },

    //跳转到启时页
    jumpHome() {
      this.$router.push({
        name: "start"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header-icon {
  padding-top: 20px;
  margin-top: 90px;
  background: url("~@/assets/img/header-icon.png") no-repeat right;
  background-size: cover;
  height: 280px;
  display: flex;
  justify-content: center;
  .img-box {
    width: 452px;
    height: 64px;
    margin-top: 50px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.main-content {
  padding: 0px 24px 24px;
}
.main {
  margin-bottom: 100px;
  position: relative;
  margin: 0 auto;
  width: 750px;
}

.title-box {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right-btn {
    display: flex;
    align-items: flex-end;
  }
  .title-h1 {
    height: 33px;
    font-size: 28px;
    font-weight: blod;
    color: #474d51;
  }
  .col-line {
    height: 32px;
    background: #3f86f7;
    width: 1px;
    margin-bottom: 5px;
  }
  .manage {
    height: 36px;
    font-size: 24px;
    font-weight: 400;
    color: #3f86f7;
    padding-right: 15px;
  }
  .more {
    height: 36px;
    font-size: 24px;
    font-weight: 400;
    color: #7d7d80;
    padding-left: 15px;
  }
}
.scan {
  position: fixed;
  bottom: 120px;
  right: 60px;
  width: 200px;
  height: 74px;
  line-height: 74px;
  background: #ffffff;
  box-shadow: 2px 8px 12px 2px rgba(0, 0, 0, 0.12);
  border-radius: 74px;
  font-size: 26px;
  color: #2a2e2e;
  padding-left: 70px;
  img {
    width: 70px;
    height: 72px;
    position: absolute;
    left: 10px;
  }
}
</style>
