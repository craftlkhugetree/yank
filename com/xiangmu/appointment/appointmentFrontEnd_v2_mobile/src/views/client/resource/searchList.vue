<template>
  <div class="wrapper">
    <van-nav-bar
      class="nav-bar"
      title="资源列表"
      :border="false"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    ></van-nav-bar>
    <section class="main-wapper">
      <van-search v-model="searchText" placeholder="请输入关键字搜索" shape="round" @search="getResList" />

      <van-tabs @click="toggle" class="nav-tab">
        <van-tab
          v-for="(group, index) in resGroupData"
          :name="group.id"
          :title="group.name"
          :key="index"
        >
          <div>
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
                    <h1 class="name ellipsis" v-html="ruleTitle(res.name)"></h1>
                    <p class="res-des">{{res.note}}</p>
                  </div>
                </div>
              </template>
              <!---------------------------- 无资源 ---------------------------->
              <div class="nodata" v-if="resData.length== 0">
                <img src="@/assets/img/nofind.png" alt />
                <p>没有找到</p>
              </div>
              <div slot="finished" :class="`animation-${resData.length + 1}`" v-else>
                <van-divider
                  :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
                >没有更多了</van-divider>
              </div>
            </van-list>
          </div>
        </van-tab>
      </van-tabs>
    </section>
  </div>
</template>
<script>
import { fetchResGrouptList, fetchResList } from "@/api/client/resources.js";
export default {
  data() {
    return {
      resData: [],
      activeId: "",
      total: 0,
      pageSize: 12,
      currentPage: 1,
      searchText: "",
      loading: false,
      finished: false,
      immediateCheck: false,
      resGroupData: []
    };
  },
  components: {},
  created() {},
  computed: {},
  mounted() {
    // 如果不是立即加载，则延迟加载
    if (!this.immediateCheck) {
      setTimeout(() => {
        this.getResGrouptList();
      }, 600);
    }
  },
  methods: {
    ruleTitle(name) {
      let titleString = name;
      if (!titleString) {
        return "";
      }
      if (this.searchText && this.searchText.length > 0) {
        // 匹配关键字正则
        let replaceReg = new RegExp(this.searchText, "g");
        // 高亮替换v-html值
        let replaceString = `<font color='#F56323'>${this.searchText}</font>`;
        // '<span class="search-text">' + this.searchText + "</span>";
        // 开始替换
        titleString = titleString.replace(replaceReg, replaceString);
      }
      return titleString;
    },
    //跳转到详情页
    jumpDetail(curRes) {
      this.$store.commit("setCurrentResDetail", curRes);
      this.$router.push({
        name: "res-detail"
      });
    },
    // 切换 tab
    toggle(groupId, title) {
      this.activeId = groupId;
      this.currentPage = 1;
      this.pageSize = 12;
      this.getResList();
    },
    // 默认展示资源下的第一个图片
    reviewImg(icon) {
      let firstIcon = icon.split(",")[0];
      return `${window.g.viewUrl}${firstIcon}`;
    },
    // 获取全部资源集名称
    getResGrouptList() {
      fetchResGrouptList({}).then(res => {
        if (res.success) {
          this.resGroupData = res.data;
          this.activeId = res.data.length && res.data[0].id;
          this.getResList();
        }
      });
    },
    //根据搜索文字和资源集 搜索资源
    getResList() {
      let params = {
        filter: {
          name: this.searchText,
          resgroupid: this.activeId,
          status: "1"
        },
        limit: this.pageSize,
        page: this.currentPage
      };
      fetchResList(params).then(res => {
        if (res.success) {
          this.loading = false;
          if (this.resData.length >= 0) {
            this.finished = true;
          }
          this.resData = res.data;
          this.total = res.total;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-wapper {
  padding: 32px;
  margin-top: 64px;
}
.search-filed {
  height: 60px;
  background: #fafafa;
  border-radius: 40px;
  font-size: 28px;
  color: #7d7d80;
}
.title-h4 {
  font-size: 20px;
  font-weight: blod;
  color: #474d51;
  line-height: 30px;
  margin-left: 40px;
  margin-bottom: 20px;
}
.res-name {
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
i.van-icon.van-icon-search {
  color: #ccc !important;
}
</style>
