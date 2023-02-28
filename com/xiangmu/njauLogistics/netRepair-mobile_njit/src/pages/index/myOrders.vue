<template>
  <div>
    <div class="tabs">
      <span
        class="tabitems"
        :class="{ active: tabs === '1' }"
        @click="changeTab('1')"
      >
        <!-- <i class="iconfont iconyibaoxiu2"></i> -->
        <img
          class="icons"
          src="../../../static/images/baoxiu1.png"
          width="17px"
          height="17px"
          alt=""
          v-show="tabs === '1'"
        />
        <img
          class="icons"
          src="../../../static/images/baoxiu2.png"
          width="17px"
          height="17px"
          alt=""
          v-show="tabs !== '1'"
        />
        已报修
      </span>
      <span
        class="tabitems"
        :class="{ active: tabs === '2' }"
        @click="changeTab('2')"
      >
        <i class="iconfont iconcaogaoxiang2"></i>草稿
      </span>
    </div>
    <div class="lists">
      <!-- 我的报修列表 -->
      <div class="itemlist" v-if="tabs === '1'">
        <van-list
          v-model="loading1"
          :finished="activeFinish"
          @load="loadOrdersList"
          class="list"
          key="1"
        >
          <listItem
            class="listitem"
            v-for="(item, index) in activeOrders"
            :key="item.id"
            :info="item"
            @click.native="toDetail(item.id)"
            :showApplyer="false"
            :class="`animation-${index + 1}`"
          >
            <div slot="states">
              <div class="orderbtns clearfix">
                <!-- <span class="orderstate"> {{ item.statusname }} </span> -->
                <div class="btns">
                  <span
                    class="btn gray"
                    v-if="item.applystatus === '4'"
                    @click="toRate(item.id, item.version)"
                    >评价</span
                  >
                  <span
                    class="btn blue"
                    v-if="item.applystatus < '4'"
                    @click.stop="toContinue(item.id)"
                    >我要续报</span
                  >
                  <span class="btn" @click.stop="toDetail(item.id)"
                    >查看更多</span
                  >
                </div>
              </div>
            </div>
          </listItem>
          <emptyList
            class="emptylist animation-1"
            v-show="!activeOrders.length"
          ></emptyList>
        </van-list>
      </div>
      <!-- 草稿列表 -->
      <div class="itemlist" v-if="tabs === '2'">
        <van-list
          v-model="loading2"
          :finished="draftFinish"
          @load="loadDraftsList"
          class="list"
          key="2"
        >
          <listItem
            class="listitem"
            v-for="(item, index) in drafts"
            :key="item.id"
            :info="item"
            @click.native="toEdit(item.id)"
            :showApplyer="false"
            :class="`animation-${index + 1}`"
          >
            <div slot="states">
              <div class="orderbtns clearfix">
                <div class="btns">
                  <span class="btn gray" @click.stop="delDraft(item.id, index)"
                    >删除</span
                  >
                  <span class="btn" @click.stop="toEdit(item.id)"
                    >编辑报修</span
                  >
                </div>
              </div>
            </div>
          </listItem>
          <emptyList
            class="emptylist animation-1"
            v-show="!drafts.length"
          ></emptyList>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import emptyList from "@/components/emptyList.vue";
import listItem from "@/components/listItem.vue";
import { setListInfo } from "@/assets/js/global";
import { Dialog } from "vant";
import { Notify } from "vant";
export default {
  data() {
    return {
      tabs: "1",
      loading1: false,
      activeOrders: [],
      activePage: 1,
      activeFinish: false,
      size: 10,
      loading2: false,
      drafts: [],
      draftsPage: 1,
      draftFinish: false
    };
  },

  components: { emptyList, listItem },

  methods: {
    changeTab(tab) {
      this.tabs = tab;
    },
    toRate(id, version) {
      this.$router.push({
        name: "rate",
        params: { id: id, version: version }
      });
    },
    // 我要续报
    toContinue(id) {
      this.$router.push({
        name: "continue",
        params: { id: id }
      });
    },
    //查看报修详情
    toDetail(id) {
      this.$router.push({
        name: "userOrderView",
        params: { id: id }
      });
      // 判断当前用户
      // switch (this.$store.state.userInfo.userType) {
      //   case "9100002njit2-1":
      //     this.$router.push({
      //       name: "userOrderView",
      //       params: { id: id },
      //     });
      //     break;
      //   case "9100002njit2-2":
      //     this.$router.push({
      //       name: "",
      //       params: { id: id },
      //     });
      //     break;
      //   case "9100002njit2-3":
      //     this.$router.push({
      //       name: "",
      //       params: { id: id },
      //     });
      //     break;
      //   case "9100002njit2-4":
      //     this.$router.push({
      //       name: "userOrderView",
      //       params: { id: id },
      //     });
      //     break;
      // }
    },
    //草稿打开编辑
    toEdit(id) {
      // this.$router.push("/reportOrder/" + id);
      this.$router.push({ name: "reportOrder", params: { id: id } });
    },
    //删除草稿
    delDraft(id, index) {
      Dialog.confirm({
        title: "删除确认",
        message: "是否删除这条草稿?"
      }).then(() => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "/applydraft/delete",
            data: {
              id: id
            }
          })
          .then(res => {
            if (res.success) {
              Notify({ type: "success", message: "删除成功" });
              this.drafts.splice(index, 1);
              // if (this.draftFinish) {
              //   this.draftsPage--;
              //   this.draftFinish = false;
              // }
              // this.loadDraftsList();
            }
          });
      });
    },
    //获取当前操作人id
    getUserId() {
      return new Promise((reslove, reject) => {
        // debugger
        if (this.$store.state.userInfo.userId) {
          reslove(this.$store.state.userInfo.userId);
        } else {
          this.util
            .postAjax({
              code: this.global.authCode,
              url: "rest/User/userDetail"
            })
            .then(res => {
              reslove(res.item.ID);
            })
            .catch(() => {
              reject("");
            });
        }
      });
    },
    //加载报修列表
    loadOrdersList() {
      if (this.activeFinished) {
        this.loading1 = false;
        return;
      }
      this.getUserId().then(ID => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "/apply/pageQuery",
            isRep: true,
            data: {
              filter: {
                applyerid: ID
              },
              limit: this.size,
              page: this.activePage
            }
          })
          .then(res => {
            this.loading1 = false;
            if (res.success) {
              let results = _.map(res.data, item => {
                return setListInfo(item);
              });
              this.activeOrders =
                this.activePage === 1
                  ? results
                  : this.activeOrders.concat(results);
              // debugger;
              this.activeFinished = results.length < this.size ? true : false;
              if (!this.activeFinished) {
                this.activePage++;
              }
            }
          });
      });
    },
    //加载草稿列表
    loadDraftsList() {
      if (this.draftFinish) {
        this.loading2 = false;
        return;
      }
      this.getUserId().then(ID => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "/applydraft/pageQuery",
            isRep: true,
            data: {
              filter: {
                applyerid: ID
              },
              limit: this.size,
              page: this.draftsPage
            }
          })
          .then(res => {
            this.loading2 = false;
            if (res.success) {
              let results = _.map(res.data, item => {
                return setListInfo(item);
              });
              this.drafts =
                this.draftsPage === 1 ? results : this.drafts.concat(results);
              this.draftFinish = results.length < this.size ? true : false;
              // this.draftsPage++;
              if (!this.draftFinish) {
                this.draftsPage++;
              }
            }
          });
      });
    }
  },
  created() {
    // this.loadOrdersList();
    // this.loadDraftsList();
  }
};
</script>
<style lang="scss" scoped>
.tabitems {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  display: inline-block;
  margin-right: 32px;
  .iconfont {
    display: inline-block;
    margin-right: 8px;
  }
}
.tabitems.active {
  color: #fd7d18;
}
.itemlist {
  margin-top: 9px;
}
.icons {
  float: left;
  margin-top: -3px;
  margin-right: 8px;
}
</style>
