<template>
  <div>
    <van-nav-bar title="服务监督" fixed />
    <div style="width:100%;height:46px;"></div>
    <!-------------------------- 待回复/已回复 Tab -------------------------->
    <div class="basic-box" style="margin-bottom:0;">
      <div class="tabs basic-box-title clearfix" v-if="deptIds">
        <div
          class="tabs-item"
          v-for="item in tabs"
          :key="item.id"
          :class="{'active': activeTab == item.id}"
          @click="changeTab(item)"
        >
          <span>{{item.name}}</span>
          <span class="tabs-item-num">{{item.num}}</span>
        </div>
        <div class="right-btns" @click="toSearch">
          <i class="iconfont iconchaxun"></i>
        </div>
      </div>
    </div>
    <!-------------------------- 待回复/已回复 Tab内容 -------------------------->
    <!-- <transition name="slide-size" mode="out-in"> -->
    <no-reply-list v-if="activeTab == 1 && deptIds"></no-reply-list>
    <!-- </transition> -->
    <!-- <transition name="slide-size" mode="out-in"> -->
    <reply-list v-if="activeTab == 2 && deptIds"></reply-list>
    <!-- </transition> -->
  </div>
</template>

<script>
import noReplyList from "./noReplyList";
import replyList from "./replyList";
export default {
  components: {
    noReplyList,
    replyList
  },
  data() {
    return {
      activeTab: sessionStorage.getItem("reply-activeTab") || 1,
      tabs: [
        { id: 1, name: "待回复", icon: "", num: "" },
        { id: 2, name: "已回复", icon: "", num: "" }
      ]
    };
  },
  computed: {
    // 是否后勤管理员
    isAdmin() {
      let userRoleIds = this.$store.state.userRoles.map(i => i.ID);
      return userRoleIds.includes("9100003-1");
    },
    // 管理部门
    deptIds() {
      let userOrgIds = this.$store.state.userDepts.map(i => i.ID) || [];
      return userOrgIds.join(",");
    }
  },
  watch: {
    deptIds() {
      this.getTabData();
    }
  },
  methods: {
    // 切换tab
    changeTab(tab) {
      this.activeTab = tab.id;
      sessionStorage.setItem("reply-activeTab", this.activeTab);
      this.getTabData();
    },
    // 查询
    toSearch() {
      let params = {};
      if (this.activeTab == 1) {
        params = {
          applystatus: "1",
          // handledeptids: this.isAdmin ? null : this.deptIds
          handledeptids: this.deptIds
        };
      } else {
        params = {
          applystatus: "2,3",
          // handledeptids: this.isAdmin ? null : this.deptIds
          handledeptids: this.deptIds
        };
      }
      sessionStorage.setItem("searchParams", JSON.stringify(params));
      sessionStorage.setItem("isMy", "0");
      sessionStorage.setItem("searchOperType", "edit");
      this.$router.push("/search");
    },

    // 获取数据
    getData(status) {
      return new Promise((resolve, reject) => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "apply/pageQuery",
            isRep: true,
            data: {
              filter: {
                applystatus: status,
                handledeptids: this.deptIds
              },
              limit: 5,
              page: 1
            }
          })
          .then(res => {
            if (res.success) {
              resolve(res.total);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(res);
          });
      });
    },

    // 获取待回复、已回复数据
    getTabData() {
      this.getData("1").then(res => (this.tabs[0].num = res));
      this.getData("2,3").then(res => (this.tabs[1].num = res));
    }
  },
  created() {
    if (this.deptIds) {
      this.getTabData();
    }
  }
};
</script>

<style lang="scss" scoped>
.right-btns {
  float: right;
  margin-right: 16px;
}
.tabs-item-num {
  margin-left: 5px !important;
}
</style>