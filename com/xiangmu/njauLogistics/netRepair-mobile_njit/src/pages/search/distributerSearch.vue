<template>
  <div>
    <van-nav-bar
      title="报修查询"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div style="width:100%;height:46px;"></div>
    <div class="reslutlist">
      <van-field
        v-model="searchInput"
        placeholder="请输入关键字查询"
        left-icon="search"
        class="searchinput"
        @keypress.native.enter="search"
      />
      <van-list
        v-model="loading"
        :finished="finished"
        @load="loadList"
        class="list"
        ref="list"
        :immediate-check="false"
      >
        <listItem
          class="listitem"
          v-for="(item, index) in results"
          :key="item.id"
          :info="item"
          @click.native="toDetail(item.id)"
          :class="`animation-${index + 1}`"
        >
          <div slot="states">
            <div class="orderbtns clearfix">
              <!-- <span class="orderstate"> {{ item.statusname }} </span> -->
              <div class="btns">
                <!-- <span class="btn gray">评价</span> -->
                <span class="btn" @click.stop="toDetail(item.id)"
                  >查看更多</span
                >
              </div>
            </div>
          </div>
        </listItem>
        <emptyList
          class="emptylist animation-1"
          v-show="!results.length && !loading"
        ></emptyList>
      </van-list>
    </div>
  </div>
</template>

<script>
import emptyList from "@/components/emptyList.vue";
import listItem from "@/components/listItem.vue";
import { setListInfo } from "@/assets/js/global";
import { Notify } from "vant";
export default {
  data() {
    return {
      searchInput: "",
      loading: false,
      finished: false,
      results: [],
      page: 1,
      size: 10
    };
  },

  components: { emptyList, listItem },

  methods: {
    //搜索框搜索
    search() {
      this.page = 1;
      this.loadList(this.page, this.size);
    },
    toDetail(id) {
      this.$router.push({
        name: "distributeView",
        params: { id: id }
      });
      // 判断当前用户
      // switch (this.$store.state.userInfo.userType) {
      //   case "9100002njit2-4":
      //   case "9100002njit2-1":
      //     this.$router.push({
      //       name: "userOrderView",
      //       params: { id: id },
      //     });
      //     break;
      //   case "9100002njit2-2":
      //     this.$router.push({
      //       name: "handleOrder",
      //       params: { id: id },
      //     });
      //     break;
      //   case "9100002njit2-3":
      //     this.$router.push({
      //       name: "distributeView",
      //       params: { id: id },
      //     });
      //     break;
      // }
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
    loadList() {
      this.getUserId().then(ID => {
        this.loading = true;
        let filter = {
          keyword: this.searchInput,
          // applyerid:ID
          repairleaderid: ID
        };
        // switch (this.$store.state.userInfo.userType) {
        //   case "9100002njit2-1":
        //     filter.applyerid = ID;
        //     break;
        //   case "9100002njit2-2":
        //     filter.repairdeptid = this.$store.state.userInfo.userOrgId;
        //     break;
        //   case "9100002njit2-3":
        //     filter.repairleaderid = ID;
        //     break;
        // }
        this.util
          .postAjax({
            code: this.global.code,
            url: "/apply/pageQuery",
            isRep: true,
            data: {
              filter: filter,
              limit: this.size,
              page: this.page
            }
          })
          .then(res => {
            if (res.success) {
              this.loading = false;
              let results = _.map(res.data, item => {
                return setListInfo(item);
              });
              this.results =
                this.page === 1 ? results : this.results.concat(results);
              this.finished = results.length < this.size ? true : false;
              this.page++;
            }
          });
      });
    }
  },
  created() {
    // this.loadList();
    setTimeout(() => {
      this.$refs.list.check();
    }, 600);
  }
};
</script>
<style lang="scss" scoped>
.reslutlist {
  padding: 0 16px;
  background-color: #f6f6f6;
}
.searchinput {
  margin-top: 16px;
  width: 100%;
  height: 30px;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.06);
  padding: 3px 13px;
}
.list {
  margin-top: 16px;
}
</style>
