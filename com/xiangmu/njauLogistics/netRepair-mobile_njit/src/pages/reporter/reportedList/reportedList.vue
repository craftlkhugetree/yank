<template>
  <div>
    <van-nav-bar title="网上报修" fixed />
    <div style="width:100%;height:46px;"></div>
    <div class="orderlists">
      <div class="tabs clearfix">
        <div
          class="tabitem"
          :class="{ active: tabs === '1' }"
          @click="changeTab('1')"
        >
          <p class="tablabel">
            待办理
            <span>{{ num1 }}</span>
          </p>
          <div class="activelabel"></div>
        </div>
        <div
          class="tabitem"
          :class="{ active: tabs === '2' }"
          @click="changeTab('2')"
        >
          <p class="tablabel">
            已办理
            <span>{{ num2 }}</span>
          </p>
          <div class="activelabel"></div>
        </div>
        <div
          class="tabitem"
          :class="{ active: tabs === '3' }"
          @click="changeTab('3')"
        >
          <p class="tablabel">
            已转移
            <span>{{ num3 }}</span>
          </p>
          <div class="activelabel"></div>
        </div>
        <!-- <div class="searchbtn" @click="$router.push('/reporterSearch')">
          <i class="iconfont iconchaxun"></i>
          查询
        </div>-->
      </div>
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="请输入搜索关键词"
        background="#f6f6f6"
        @search="search"
        :class="{ small: tabs == '1' }"
      />
      <van-button
        v-if="tabs == '1'"
        class="search-btn"
        round
        type="info"
        @click="isBatch = !isBatch"
        >{{ isBatch ? "取消批量" : "批量操作" }}</van-button
      >

      <div class="lists">
        <!-- 带办理 -->
        <div class="status1list" v-if="tabs === '1'">
          <van-list
            v-model="loading1"
            :finished="finish1"
            @load="loadStatus1List"
            class="list"
            key="1"
            v-if="deptId"
          >
            <div v-if="!isBatch">
              <listItem
                class="listitem"
                v-for="(item, index) in status1List"
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
                      <span class="btn" @click.stop="toHandle(item.id)"
                        >查看更多</span
                      >
                    </div>
                  </div>
                </div>
              </listItem>
            </div>
            <!-------------------- 可选择 -------------------->
            <div v-else>
              <listItemCheck
                class="listitem"
                v-for="(item, index) in status1List"
                :key="item.id"
                :info="item"
                :class="`animation-${index + 1}`"
              >
                <div slot="states">
                  <div class="orderbtns clearfix">
                    <!-- <span class="orderstate"> {{ item.statusname }} </span> -->
                    <div class="btns">
                      <!-- <span class="btn gray">评价</span> -->
                      <span class="btn" @click.stop="toHandle(item.id)"
                        >查看更多</span
                      >
                    </div>
                  </div>
                </div>
              </listItemCheck>
            </div>
            <emptyList
              class="emptylist animation-1"
              v-show="!status1List.length"
            ></emptyList>
          </van-list>
        </div>
        <!-- 已办理 -->
        <div class="status2list" v-if="tabs === '2'">
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
                alt
              />

              <p>{{ item.name }}</p>
            </div>
          </div>
          <van-list
            v-model="loading2"
            :finished="finish2"
            @load="loadStatus2List"
            class="list"
            key="2"
            v-if="deptId"
          >
            <listItem
              class="listitem"
              v-for="(item, index) in status2List"
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
                    <span class="btn" @click.stop="toHandle(item.id)"
                      >查看更多</span
                    >
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
        <!-- 已转移 -->
        <div class="status1list" v-if="tabs === '3'">
          <van-list
            v-model="loading3"
            :finished="finish3"
            @load="loadStatus3List"
            class="list"
            key="3"
            v-if="deptId"
          >
            <listItem
              class="listitem"
              v-for="(item, index) in status3List"
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
                    <span class="btn" @click.stop="toHandle(item.id)"
                      >查看更多</span
                    >
                  </div>
                </div>
              </div>
            </listItem>
            <emptyList
              class="emptylist animation-1"
              v-show="!status3List.length"
            ></emptyList>
          </van-list>
        </div>
      </div>
      <!---------------------------- 底部按钮 ---------------------------->
      <div class="footer" v-if="isBatch && tabs == '1'">
        <van-checkbox
          v-model="allChecked"
          shape="square"
          icon-size="16"
          @click="changeAll"
          >全选</van-checkbox
        >
        <div class="right-btn">
          <van-button
            class="search-btn"
            round
            type="info"
            @click="handleBatch('takeout')"
            >批量办理</van-button
          >
          <van-button
            class="search-btn"
            round
            type="info"
            plain
            @click="handleBatch('move')"
            >批量转移</van-button
          >
        </div>
      </div>
    </div>
    <!-- 接报修人员选择维修负责人弹窗 -->
    <van-popup
      v-model="handleVis"
      position="bottom"
      :style="{ height: '30%' }"
      :close-on-click-overlay="false"
      class="reportform"
    >
      <div class="popuptitle">
        <span class="cancel" @click="handleVis = false">取消</span>
        维修办理
        <span class="save" @click="takeoutBatch">确认</span>
      </div>
      <van-form ref="handleForm" :show-error-message="false">
        <van-field
          class="selectfiled"
          clickable
          @click="repairleaderPick = true"
          v-model="repairleadername"
          label="维修负责人："
          :rules="[{ required: true, message: '请选择维修负责人' }]"
        />
        <van-field
          readonly
          clickable
          v-model="repairleadername"
          @click="repairleaderPick = true"
          class="fieldbottom"
          placeholder="请选择维修负责人"
          :rules="[{ required: true, message: '请选择维修负责人' }]"
        />
        <van-field v-show="false" v-model="repairleaderid" />
      </van-form>
    </van-popup>
    <!-- 维修负责人选择 -->
    <van-popup
      v-model="repairleaderPick"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-picker
        value-key="NAME"
        show-toolbar
        @confirm="onRepairleaderConfirm"
        :columns="repairLeaders"
        @cancel="repairleaderPick = false"
      />
    </van-popup>
    <!-- 接报修人员转移弹窗 -->
    <van-popup
      v-model="moveVis"
      position="bottom"
      :style="{ height: '67%' }"
      :close-on-click-overlay="false"
      class="reportform"
    >
      <div class="popuptitle">
        <span class="cancel" @click="moveVis = false">取消</span>
        转移
        <span class="save" @click="moveBatch">确认</span>
      </div>
      <van-form ref="moveForm" :show-error-message="false">
        <van-field
          class="selectfiled"
          clickable
          @click="movePick = true"
          v-model="repairdeptname"
          label="维修单位："
          :rules="[{ required: true, message: '请选择单位' }]"
        />
        <van-field
          readonly
          clickable
          v-model="repairdeptname"
          @click="movePick = true"
          class="fieldbottom"
          placeholder="请选择单位"
          :rules="[{ required: true, message: '请选择单位' }]"
        />
        <van-field v-show="false" v-model="repairdeptid" />
        <van-field
          v-model="note"
          label="转移描述"
          :rules="[{ required: true, message: '请输入说明，不超过200字' }]"
        />
        <van-field
          type="textarea"
          :rows="3"
          v-model="note"
          class="fieldbottom"
          placeholder="请输入说明，不超过200字"
          :maxlength="200"
          :rules="[{ required: true, message: '请输入说明，不超过200字' }]"
        />
        <van-field v-model="photosid" label="上传图片" />
        <upload :attaches="photos"></upload>
      </van-form>
    </van-popup>
    <!-- 维修单位选择 -->
    <van-popup v-model="movePick" position="bottom" :style="{ height: '40%' }">
      <van-picker
        value-key="NAME"
        show-toolbar
        @confirm="onMoveConfirm"
        :columns="depts"
        @cancel="movePick = false"
      />
    </van-popup>
  </div>
</template>

<script>
import emptyList from "@/components/emptyList.vue";
import listItem from "@/components/listItem.vue";
import listItemCheck from "@/components/listItemCheck.vue";
import { setListInfo } from "@/assets/js/global";
import upload from "@/components/attaches.vue";
export default {
  data() {
    return {
      num1: 0,
      num2: 0,
      num3: 0,
      tabs: "1",
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
          status: "2,3,4,5",
          num: 0
        },
        {
          name: "等待派单",
          img: "@/../static/images/wait",
          selected: false,
          status: "2",
          num: 0
        },
        {
          name: "维修中",
          img: "@/../static/images/repair",
          selected: false,
          status: "3",
          num: 0
        },
        {
          name: "维修完工",
          img: "@/../static/images/done",
          selected: false,
          status: "4",
          num: 0
        },
        {
          name: "维修结束",
          img: "@/../static/images/finish",
          selected: false,
          status: "5",
          num: 0
        }
      ],
      selectedIndex: 0,
      loading3: false,
      finish3: false,
      status3List: [],
      page3: 1,
      keyword: null,
      isBatch: false,
      allChecked: false,
      handleVis: false,
      repairleaderPick: false,
      repairleadername: null,
      repairleaderid: null,
      repairLeaders: [],
      moveVis: false,
      movePick: false,
      repairdeptname: null,
      repairdeptid: null,
      note: null,
      photosid: null,
      photos: [],
      depts: []
    };
  },
  components: { emptyList, listItem, listItemCheck, upload },
  computed: {
    deptId() {
      return this.$store.state.userInfo.userOrgId;
    },
    selectArr() {
      return this.status1List.filter(i => i.checked);
    }
  },
  watch: {
    deptId() {
      this.getTabNum();
    },
    selectArr() {
      if (this.selectArr.length == this.status1List.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    }
  },
  methods: {
    // 查询
    search() {
      switch (this.tabs) {
        case "1":
          this.page1 = 1;
          this.status1List = [];
          this.loadStatus1List();
          break;
        case "2":
          this.page2 = 1;
          this.status2List = [];
          this.loadStatus2List();
          break;
        case "3":
          this.page3 = 1;
          this.status3List = [];
          this.loadStatus3List();
          break;
      }
    },
    toHandle(id) {
      this.$router.push({
        name: "handleOrder",
        params: { id: id }
      });
    },
    //切换一层标签
    changeTab(key) {
      this.tabs = key;
      sessionStorage.setItem("pagekey", key);
    },
    // 全选
    changeAll() {
      if (this.allChecked) {
        this.status1List.forEach(i => (i.checked = true));
      } else {
        this.status1List.forEach(i => (i.checked = false));
      }
    },

    //获取当前部门的维修负责人
    getRepairLeaders() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/getUserByGroup2Role",
          data: {
            GROUPID: this.$store.state.userInfo.userOrgId,
            ROLEID: "9100002njit2-3"
          }
        })
        .then(res => {
          if (res.success) {
            this.repairLeaders = res.items;
            this.repairleadername = res.items[0].NAME;
            this.repairleaderid = res.items[0].ID;
          }
        });
    },

    //选择维修负责人
    onRepairleaderConfirm(leader) {
      this.repairleaderPick = false;
      this.repairleadername = leader.NAME;
      this.repairleaderid = leader.ID;
    },

    // 点击批量办理按钮
    handleBatch(type) {
      this.getRepairLeaders();
      this.getDepts();
      if (this.selectArr.length == 0) {
        this.$notify({ type: "danger", message: "请选择报修单！" });
      } else {
        if (type == "takeout") {
          this.handleVis = true;
        } else {
          this.moveVis = true;
        }
      }
    },

    // 批量办理
    takeoutBatch() {
      this.$refs["handleForm"].validate().then(() => {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          loadingType: "spinner"
        });
        let arr = this.selectArr.map(i => {
          return {
            applyid: i.id,
            version: i.version,
            repairleaderid: this.repairleaderid,
            repairleadername: this.repairleadername
          };
        });
        this.util
          .postAjax({
            code: this.global.code,
            url: "apply/takeoutBatch",
            isRep: true,
            data: arr
          })
          .then(res => {
            if (res.success) {
              this.$notify({ type: "success", message: "办理成功！" });
              this.handleVis = false;
              this.loadStatus1List();
              this.getTabNum();
            } else {
              this.$notify({ type: "danger", message: "办理失败！" });
            }
            this.$toast.clear();
          })
          .catch(err => {
            this.$notify({ type: "danger", message: "办理失败！" });
            this.$toast.clear();
          });
      });
    },

    //选择转移的维修单位
    onMoveConfirm(dept) {
      this.movePick = false;
      this.repairdeptname = dept.NAME;
      this.repairdeptid = dept.ID;
    },

    // 获取单位
    getDepts() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/getList",
          data: {
            filter: JSON.stringify({
              APPID: this.$store.state.GROUPID
            }),
            limit: 10000,
            page: 1,
            ISDELETE: "0"
          }
        })
        .then(res => {
          if (res.success) {
            this.depts = res.items.filter(i => i.ID !== this.deptId);
          }
        });
    },

    // 批量转移
    moveBatch() {
      this.$refs["moveForm"].validate().then(() => {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          loadingType: "spinner"
        });
        let arr = this.selectArr.map(i => {
          return {
            applyid: i.id,
            version: i.version,
            repairdeptid: this.repairdeptid,
            note: this.note,
            photos: this.photos.join(",")
          };
        });
        this.util
          .postAjax({
            code: this.global.code,
            url: "apply/moveBatch",
            isRep: true,
            data: arr
          })
          .then(res => {
            if (res.success) {
              this.$notify({ type: "success", message: "转移成功！" });
              this.moveVis = false;
              this.loadStatus1List();
              this.getTabNum();
            } else {
              this.$notify({ type: "danger", message: "转移失败！" });
            }
            this.$toast.clear();
          })
          .catch(err => {
            this.$notify({ type: "danger", message: "转移失败！" });
            this.$toast.clear();
          });
      });
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
              keyword: this.keyword || null,
              applystatus: "1",
              repairdeptid: this.$store.state.userInfo.userOrgId || ""
            },
            limit: 10000,
            page: this.page1,
            orderBy: 'createtime',
            sort: 'asc'
          }
        })
        .then(res => {
          this.loading1 = false;
          let results = _.map(res.data, item => {
            return setListInfo(item);
          });
          results.forEach(i => this.$set(i, "checked", false));
          this.status1List = results;
          this.finish1 = true;
          // this.status1List =
          //   this.page1 === 1 ? results : this.status1List.concat(results);
          // this.finish1 = results.length < this.size ? true : false;
          // if (!this.finish1) {
          //   this.page1++;
          // }
        });
    },
    setStatus(index) {
      this.selectedIndex = index;
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
              keyword: this.keyword || null,
              applystatus: this.orderstatus[this.selectedIndex].status,
              repairdeptid: this.$store.state.userInfo.userOrgId || ""
            },
            limit: this.size,
            page: this.page2
          }
        })
        .then(res => {
          this.orderstatus[this.selectedIndex].num = res.total;
          this.loading2 = false;
          let results = _.map(res.data, item => {
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
    loadStatus3List() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              keyword: this.keyword || null,
              eventtype: "9",
              repairdeptid: this.$store.state.userInfo.userOrgId || ""
            },
            limit: this.size,
            page: this.page3
          }
        })
        .then(res => {
          this.loading3 = false;
          let results = _.map(res.data, item => {
            return setListInfo(item);
          });
          this.status3List =
            this.page3 === 1 ? results : this.status3List.concat(results);
          this.finish3 = results.length < this.size ? true : false;
          if (!this.finish3) {
            this.page3++;
          }
        });
    },
    // 获取tab数字
    getTabNum() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/applycountByDept",
          data: {
            repairdeptid: this.$store.state.userInfo.userOrgId
          }
        })
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            this.num1 = 0;
            this.orderstatus[1].num = 0;
            this.orderstatus[2].num = 0;
            this.orderstatus[3].num = 0;
            this.orderstatus[4].num = 0;
            data.forEach(i => {
              switch (i.applystatus) {
                case "1":
                  this.num1 = i.num;
                  break;
                case "2":
                  this.orderstatus[1].num = i.num;
                  break;
                case "3":
                  this.orderstatus[2].num = i.num;
                  break;
                case "4":
                  this.orderstatus[3].num = i.num;
                  break;
                case "5":
                  this.orderstatus[4].num = i.num;
                  break;
              }
            });
            let nums = this.orderstatus
              .filter((item, index) => index > 0)
              .map(i => i.num);
            let total = nums.reduce((sum, num) => {
              return sum + num;
            }, 0);
            this.orderstatus[0].num = this.num2 = total;
          }
        })
        .catch(err => {});

      // 获取转移数据
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              eventtype: "9",
              repairdeptid: this.$store.state.userInfo.userOrgId || ""
            },
            limit: 5,
            page: 1
          }
        })
        .then(res => {
          if (res.success) {
            this.num3 = res.total;
          }
        });
    }
  },
  created() {
    this.tabs = sessionStorage.getItem("pagekey") || "1";
    if (this.deptId) {
      this.getTabNum();
    }
  }
};
</script>
<style lang="scss" scoped>
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
  margin-bottom: 60px;
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
.van-search {
  padding: 10px 0 0;
  .van-search__content {
    background: rgba(0, 0, 0, 0.06);
  }
  &.small {
    display: inline-block;
    width: 70%;
  }
}
.search-btn {
  margin-left: 10px;
  height: 32px;
  vertical-align: bottom;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.05);
  padding: 12px 12px 12px 24px;
  .van-checkbox {
    display: inline-flex;
    line-height: 32px;
    height: 32px;
    color: #464032;
    font-size: 14px;
  }
  .right-btn {
    float: right;
  }
}

.reportform {
  margin-top: 6px;
  background-color: #fff;
  padding-bottom: 40px;
  & /deep/ .van-cell__title + .van-cell__value.van-field__value {
    display: none;
  }
  & /deep/ .van-cell::after {
    border-bottom: 1px solid #fff;
  }
  .fieldbottom {
    padding: 0;
    margin: 0 16px;
    border-bottom: 1px solid rgba(219, 219, 219, 1);
    width: 90%;
  }
  .selectfiled {
    margin-top: 40px;
  }
}
</style>
