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
          <p class="tablabel">待派单</p>
          <div class="activelabel"></div>
        </div>
        <div
          class="tabitem"
          :class="{ active: tabs === '3' }"
          @click="changeTab('3')"
        >
          <p class="tablabel">已派单</p>
          <div class="activelabel"></div>
        </div>
        <div class="searchbtn" @click="$router.push('/distributerSearch')">
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
          >
            <listItem
              class="listitem"
              v-for="(item,index) in status1List"
              :key="item.id"
              :info="item"
              @click.native="toHandle(item.id)"
              :class="`animation-${index + 1}`"
            >
              <div slot="states">
                <div class="orderbtns clearfix">
                  <!-- <span class="orderstate"> {{ item.statusname }} </span> -->
                  <div class="btns">
                    <!-- <span class="btn gray">评价</span> -->
                    <span class="btn" @click.stop="toHandle(item.id)">查看更多</span>
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
          <div class="orderstatus">
            <div
              class="status"
              v-for="(item, index) in orderstatus"
              :key="item.name"
              :class="{ statusselected: selectedIndex === index }"
              @click="setStatus(index)"
            >
              <span class="num">{{ item.num }}</span>
              <img
                width="24px"
                height="24px"
                :src="
                  selectedIndex === index
                    ? item.img + '-active.png'
                    : item.img + '.png'
                "
                alt=""
              />

              <p>{{ item.name }}</p>
            </div>
          </div>
          <van-list
            v-model="loading2"
            :finished="finish2"
            @load="loadStatus2List"
            class="list"
          >
            <listItem
              class="listitem"
              v-for="(item,index) in status2List"
              :key="item.id"
              :info="item"
              @click.native="toHandle(item.id)"
              :class="`animation-${index + 1}`"
            >
              <div slot="states">
                <div class="orderbtns clearfix">
                  <!-- <span class="orderstate"> {{ item.statusname }} </span> -->
                  <div class="btns">
                    <!-- <span class="btn gray">评价</span> -->
                    <span class="btn" @click.stop="toHandle(item.id)">查看更多</span>
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
import listItem from "@/components/listItem.vue";
import { setListInfo } from "@/assets/js/global";
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
      orderstatus: [
        {
          name: "全部",
          img: "@/../static/images/quanbu",
          status: "3,4,5",
          num: 0,
        },
        {
          name: "维修中",
          img: "@/../static/images/repair",
          selected: false,
          status: "3",
          num: 0,
        },
        {
          name: "维修完工",
          img: "@/../static/images/done",
          selected: false,
          status: "4",
          num: 0,
        },
        {
          name: "维修结束",
          img: "@/../static/images/finish",
          selected: false,
          status: "5",
          num: 0,
        },
      ],
      selectedIndex: 0,
    };
  },
  components: { emptyList, listItem },
  methods: {
    toHandle(id) {
      this.$router.push({
        name: "distributeView",
        params: { id: id },
      });
    },
    //切换一层标签
    changeTab(key) {
      this.tabs = key;
      sessionStorage.setItem("dispagekey", key);
    },
    //加载列表
    loadStatus1List() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              applystatus: "2",
              repairdeptid: this.$store.state.userInfo.userOrgId || "",
              repairleaderid: this.$store.state.userInfo.userId || "",
            },
            limit: this.size,
            page: this.page1,
          },
        })
        .then((res) => {
          this.loading1 = false;
          let results = _.map(res.data, (item) => {
            return setListInfo(item);
          });
          this.status1List =
            this.page1 === 1 ? results : this.status1List.concat(results);
          this.finish1 = results.length < this.size ? true : false;
          if (!this.finish1) {
            this.page1++;
          }
        });
    },
    setStatus(index) {
      this.selectedIndex = index;
      // this.loading2 = false;
      // this.finish2 = false;
      this.status2List = [];
      this.page2 = 1;
      this.loadStatus2List();
    },
    loadStatus2List() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              applystatus: this.orderstatus[this.selectedIndex].status,
              repairdeptid: this.$store.state.userInfo.userOrgId || "",
              repairleaderid: this.$store.state.userInfo.userId || "",
            },
            limit: this.size,
            page: this.page2,
          },
        })
        .then((res) => {
          this.orderstatus[this.selectedIndex].num = res.total;
          this.loading2 = false;
          let results = _.map(res.data, (item) => {
            return setListInfo(item);
          });
          this.status2List =
            this.page2 === 1 ? results : this.status2List.concat(results);
          this.finish2 = results.length < this.size ? true : false;
          if (!this.finish2) {
            this.page2++;
          }
        });
    },
  },
  created() {
    // this.loadStatus2List();
    // this.loadStatus2List();
    // this.loadStatus1List();
    this.tabs = sessionStorage.getItem("dispagekey") || "2";
    _.forEach(this.orderstatus, (status) => {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              applystatus: status.status,
              repairdeptid: this.$store.state.userInfo.userOrgId || "",
              repairleaderid: this.$store.state.userInfo.userId || "",
            },
            limit: this.size,
            page: this.page2,
          },
        })
        .then((res) => {
          status.num = res.total;
        });
    });
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
  color: #666666;
}
.lists {
  margin-top: 12px;
  background-color: rgba(246, 246, 246, 1);
  // height: 500px;
  // overflow-y: scroll;
}

.orderstatus {
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
  .status {
    position: relative;
    display: inline;
    width: 20%;
    color: rgba(153, 153, 153, 1);
    & img {
      display: block;
      margin: 8px auto;
      // margin-bottom: 8px;
    }
    & > p {
      text-align: center;
    }
    & > .num {
      position: absolute;
      padding: 0px 4px;
      height: 16px;
      line-height: 16px;
      font-size: 14px;
      border: 1px solid rgba(204, 204, 204, 1);
      text-align: center;
      border-radius: 8px;
      right: 15px;
      background-color: #fff;
    }
    &.statusselected > .num {
      border: 1px solid rgba(253, 125, 24, 1);
      color: rgba(253, 125, 24, 1);
    }
  }
  &.statusselected {
    color: rgba(102, 102, 102, 1);
  }
}
</style>