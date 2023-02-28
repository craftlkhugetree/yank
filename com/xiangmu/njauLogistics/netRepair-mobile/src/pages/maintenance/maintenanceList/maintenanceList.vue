<template>
  <div>
    <van-nav-bar title="网上报修" fixed/>
    <div style="width:100%;height:46px;"></div>
    <div class="orderlists">
      <div class="tabs clearfix">
        <div
          class="tabitem"
          :class="{ active: tabs === '2' }"
          @click="changeTab('2')"
        >
          <p class="tablabel">待维修</p>
          <div class="activelabel"></div>
        </div>
        <div
          class="tabitem"
          :class="{ active: tabs === '3' }"
          @click="changeTab('3')"
        >
          <p class="tablabel">已维修</p>
          <div class="activelabel"></div>
        </div>
        <div class="searchbtn" @click="$router.push('/repairSearch')">
          <i class="iconfont iconchaxun"></i>
          查询
        </div>
      </div>
      <div class="lists">
        <!-- 待派单 -->
        <div class="status1list" v-if="tabs === '2'">
          <van-list
            v-model="loading1"
            :finished="finish1"
            @load="loadStatus1List"
            class="list"
            v-if="deptId"
          >
            <listItem
              class="listitem"
              v-for="(item,index) in status1List"
              :key="item.id"
              :info="item"
              @click.native="toRepairFinish(item.id)"
              :class="`animation-${index + 1}`"
            >
              <div slot="states">
                <div class="orderbtns clearfix">
                  <span class="orderstate">
                    <i class="iconfont iconshijianzhongbiao2"></i>
                    维修时间 ：{{
                      util.formatTime(item.starttime, "YYYY-MM-DD")
                    }}
                  </span>
                  <div class="btns">
                    <!-- <span class="btn gray">评价</span> -->
                    <span class="btn" @click.stop="toRepairFinish(item.id)"
                      >维修完工</span
                    >
                  </div>
                </div>
              </div>
            </listItem>
            <emptyList
              class="emptylist animation-1"
              v-show="!status1List.length"
            ></emptyList>
          </van-list>
        </div>
        <!-- 已派单 -->
        <div class="status2list" v-if="tabs === '3'">
          <van-list
            v-model="loading2"
            :finished="finish2"
            @load="loadStatus2List"
            class="list"
            v-if="deptId"
          >
            <listItem
              class="listitem"
              v-for="(item,index) in status2List"
              :key="item.id"
              :info="item"
              @click.native="toView(item)"
              :class="`animation-${index + 1}`"
            >
              <div slot="states">
                <div class="orderbtns clearfix">
                  <span class="orderstate"> 维修完工 </span>
                  <div class="btns">
                    <!-- <span class="btn gray">评价</span> -->
                    <span class="btn" @click.stop="toView(item)">查看更多</span>
                  </div>
                </div>
              </div>
            </listItem>
            <emptyList
              class="emptylist animation-1"
              v-show="!status2List.length"
            ></emptyList>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emptyList from "@/components/emptyList.vue";
import listItem from "./listItem.vue";
// import { setListInfo } from "@/assets/js/global";
export default {
  data() {
    return {
      tabs: "2",
      loading1: false,
      finish1: false,
      status1List: [],
      page1: 1,
      size: 10,
      loading2: false,
      finish2: false,
      status2List: [],
      page2: 1,
    };
  },
  components: { emptyList, listItem },
  computed: {
    deptId() {
      return this.$store.state.userInfo.userOrgId;
    }
  },
  methods: {
    toRepairFinish(id) {
      this.$router.push({
        name: "repairHandle",
        params: { id: id },
      });
    },
    toView(item) {
      let id = "";
      for (let i = 0; i < item.relationApplys.length; i++) {
        if (item.relationApplys[i].title === item.title) {
          id = item.relationApplys[i].id;
          break;
        }
      }
      this.$router.push({
        name: "userOrderView",
        params: { id: id },
      });
    },
    //切换一层标签
    changeTab(key) {
      this.tabs = key;
      sessionStorage.setItem("maintenance-pagekey", key);
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
              url: "rest/User/userDetail",
            })
            .then((res) => {
              reslove(res.item.ID);
            })
            .catch(() => {
              reject("");
            });
        }
      });
    },
    //加载列表
    loadStatus1List() {
      this.getUserId().then((ID) => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "/repair/pageQuery",
            isRep: true,
            data: {
              filter: {
                status: "1",
                repairdeptid: this.$store.state.userInfo.userOrgId || "",
                repairerid: ID,
              },
              limit: this.size,
              page: this.page1,
            },
          })
          .then((res) => {
            this.loading1 = false;
            let results = _.map(res.data, (item) => {
              if (item.relationApplys.length) {
                for (let i = 0; i < item.relationApplys.length; i++) {
                  if (item.relationApplys[i].title === item.title) {
                    item.note = item.relationApplys[i].note;
                    item.photos = item.relationApplys[i].photos;
                    break;
                  }
                }
              }
              return item;
            });
            this.status1List =
              this.page1 === 1 ? results : this.status1List.concat(results);
            this.finish1 = results.length < this.size ? true : false;
            if (!this.finish1) {
              this.page1++;
            }
          });
      });
    },
    loadStatus2List() {
      this.getUserId().then((ID) => {
        this.util
          //   console.log(2)
          .postAjax({
            code: this.global.code,
            url: "/repair/pageQuery",
            isRep: true,
            data: {
              filter: {
                status: "2,3,4",
                repairdeptid: this.$store.state.userInfo.userOrgId || "",
                repairerid: ID,
              },
              limit: this.size,
              page: this.page2,
            },
          })
          .then((res) => {
            this.loading2 = false;
            let results = _.map(res.data, (item) => {
              if (item.relationApplys.length) {
                for (let i = 0; i < item.relationApplys.length; i++) {
                  if (item.relationApplys[i].title === item.title) {
                    item.note = item.relationApplys[i].note;
                    item.photos = item.relationApplys[i].photos;
                    break;
                  }
                }
              }
              return item;
            });
            this.status2List =
              this.page2 === 1 ? results : this.status2List.concat(results);
            this.finish2 = results.length < this.size ? true : false;
            if (!this.finish2) {
              this.page2++;
            }
          });
      });
    },
  },
  created() {
    // this.loadStatus2List();
    this.tabs = sessionStorage.getItem("maintenance-pagekey") || "2";
    // this.loadStatus2List();
    // this.loadStatus1List();
  },
};
</script>
<style lang='scss' scoped>
.repirnums {
  height: 128px;
  background-color: #fff;
}
.num1,
.num2 {
  float: left;
  margin-top: 14px;
  .label {
    font-size: 12px;
    font-weight: 400;
    color: #aaaaaa;
  }
  .value {
    font-size: 16px;
    font-weight: 400;
    color: #464032;
    line-height: 24px;
  }
}
.num1 {
  margin-left: 24px;
}
.num2 {
  margin-left: 30px;
}
.startorderbtn {
  width: 190px;
  margin-top: 8px;
  margin-left: 18px;
  height: 40px;
  background: #fd7d18;
  box-shadow: 0px 7px 4px 0px rgba(255, 112, 0, 0.12),
    0px 14px 4px -10px rgba(255, 112, 0, 0.24);
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
}
.orderlists {
  padding: 0 12px;
  padding-bottom: 12px;
  margin-top: 16px;
  background-color: rgba(246, 246, 246, 1);
}
.searchbtn {
  width: 75px;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 30px;
  float: right;
  padding: 0px 13px;
  margin-top: -7px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: #666666;
}
.lists {
  margin-top: 12px;
  background-color: rgba(246, 246, 246, 1);
  // min-height: 500px;
  // overflow-y: scroll;
}
.orderbtns .orderstate {
  margin-top: 3px;
  font-size: 12px;
  font-weight: 400;
  color: #fd7d18;
  padding: 0 8px;
  height: 26px;
  line-height: 26px;
}
</style>