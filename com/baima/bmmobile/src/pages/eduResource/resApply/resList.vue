<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
    </div>
    <!-- tab标签页 -->
    <div class="tabs more-tabs" ref="tableTabs">
      <li
        class="ellipsis"
        :class="{'active': activeTab === item.id}"
        v-for="(item,index) in tabs"
        :key="item.id"
        @click="changeTab(item,index)"
      >{{item.name}}</li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight" :border="false">
      <!-- <el-table-column type="selection" width="45" align="center" fixed="left"></el-table-column> -->
      <el-table-column prop="rescode" label="资源编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="area" label="面积(m²)" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="price"
        :label="'单价(元/'+common.chargecycleFormatter(curResTypeDetail.chargecycle)+'/'+common.chargetypeFormatter(curResTypeDetail.chargetype)+')'"
        align="center"
        show-overflow-tooltip
        :formatter="common.moneyFormatter"
        min-width="120"
      ></el-table-column>
      <el-table-column
        prop="liveinfo"
        v-if="usestatus === '3'"
        label="入驻信息"
        align="center"
        show-overflow-tooltip
      >
        <el-table-column
          prop="liveinfo.orgname"
          label="学院名称"
          align="center"
          :formatter="common.defaultFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.projectname"
          label="项目名称"
          align="center"
          :formatter="common.defaultFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.classleadername"
          label="负责人"
          align="center"
          :formatter="common.defaultFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.classleadermobile"
          label="联系方式"
          align="center"
          :formatter="common.defaultFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.applyendtime"
          label="退出时间"
          align="center"
          :formatter="common.dateFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.waterFee"
          label="待缴费用(元)"
          align="center"
          show-overflow-tooltip
          :formatter="common.moneyFormatter"
          min-width="100"
        >
          <template slot-scope="scope">
            水费：{{scope.row.liveinfo ? common.money(scope.row.liveinfo.waterFee) : "0"}},
            电费：{{scope.row.liveinfo ? common.money(scope.row.liveinfo.eleFee) : "0"}}
          </template>
        </el-table-column>
        <el-table-column
          prop="liveinfo.limitDay"
          label="剩余使用时间(天)"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
          <template slot-scope="scope">
            <span
              :style="{'color': (scope.row.liveinfo && scope.row.liveinfo.limitDay <= 30) ? '#fe3e61' : '#1c2026'}"
            >{{scope.row.liveinfo ? scope.row.liveinfo.limitDay : "--"}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="usestatus"
        label="入驻状态"
        v-if="usestatus === '3'"
        align="center"
        show-overflow-tooltip
        :formatter="common.useStateFormatter"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="110" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">详情</span>
          <span
            v-if="scope.row.resstatus === '1' && usestatus === '1'"
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="toApply(scope.row)"
          >申请</span>
          <span
            v-if="scope.row.usestatus === '3'"
            style="color:#faac16;padding:0 5px;font-weight:bold"
            @click="toRepair(scope.row)"
          >报修</span>
          <!-- 续租：已入驻 并且 没有续租申请 并且 没有 退出申请 并且 剩余时间小于30天 -->
          <span
            v-if="scope.row.usestatus === '3' && (!scope.row.hasXuzApply && !scope.row.hasExitApply) && (scope.row.liveinfo && scope.row.liveinfo.limitDay <= 30)"
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="toExtend(scope.row)"
          >续租</span>
          <!-- 退出：已入驻 并且 没有续租申请 并且 没有 退出申请 -->
          <span
            v-if="scope.row.usestatus ==='3' && (!scope.row.hasXuzApply && !scope.row.hasExitApply)"
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="toCheckOut(scope.row)"
          >退出</span>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>
    <!-- 合计待缴费用 -->
    <div class="btns big-line" v-if="usestatus === '3'">
      <van-cell title="合计待缴费用:" :value="common.money(totalFee) + ' 元'"></van-cell>
    </div>
    <!-- 新增申请 -->
    <div class="btns" v-if="usestatus === '1'">
      <van-button :disabled="!activeTab" icon="plus" round type="primary" @click="toApply">新增申请</van-button>
    </div>

    <!-- 是否确定退出 -->
    <van-action-sheet
      v-model="showConfirmCheckOut"
      :actions="[{name: '确定退出', color: '#fe3e61'}]"
      @select="confirmCheckOut"
      cancel-text="取消"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      activeTab: "",
      curResTypeDetail: {},
      tabs: [],
      tableHeight: 0,
      currentPage: 1,
      limit: 10,
      tableData: [],
      loading: false,
      finishTable: false,
      totalFee: 0,
      showConfirmCheckOut: false,
      checkOutRow: ""
    };
  },
  props: {
    id: String,
    usestatus: String // 我的资源（已入驻"3"）、空闲资源（空闲"1"）
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  watch: {
    usestatus() {
      this.getList(1);
    },
    activeTab() {
      this.getList(1);
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 切换tab
    changeTab(item, index) {
      this.activeTab = item.id;
      this.curResTypeDetail = item;
      this.scrollToTab(index);
      sessionStorage.setItem("curEduResType", JSON.stringify(item));
      sessionStorage.setItem("curEduResTab" + this.usestatus, this.activeTab);
    },
    // 新增申请
    toApply(row) {
      let resid = row.id || null;
      let rescode = row.rescode || "";
      this.$router.push(
        `/edures-staff/res-apply/1/${this.activeTab}/${resid}/?rescode=${rescode}`
      );
    },
    // 续租
    toExtend(row) {
      // let liveInfo = {
      //   ...row.liveinfo,
      //   rescodes: row.rescode
      // }
      // sessionStorage.setItem("liveInfo",JSON.stringify(liveInfo));
      let resid = row.id || null;
      sessionStorage.setItem("lastEndTime", row.liveinfo.applyendtime);
      this.$router.push(
        `/edures-staff/res-apply/2/${this.activeTab}/${resid}/?rescode=${row.rescode}`
      );
    },
    // 详情页面
    toDetail(row) {
      this.$router.push(
        `/edures-staff/res-list/${this.activeTab}/detail-res/${row.id}`
      );
    },
    // 报修
    toRepair(row) {
      let repairMsg = {
        orgid: row.liveinfo.orgid,
        sprestypeid: row.restypeid,
        rescode: row.rescode
      };
      sessionStorage.setItem("repairMsg", JSON.stringify(repairMsg));
      this.$router.push(`/edures-staff/res-list/call-repair-res/${row.id}`);
    },
    // 退出
    toCheckOut(row) {
      this.showConfirmCheckOut = true;
      this.checkOutRow = row;
    },
    // 确认退出
    confirmCheckOut() {
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
        duration: 0
      });
      this.showConfirmCheckOut = false;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spres/saveCheckOut",
          data: {
            resId: this.checkOutRow.id
          }
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success("已提交退出申请，请等待白马办审核");
            this.getList(1);
          } else {
            this.$toast.fail("退出失败" + "\n" + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("退出失败" + "\n" + err);
        });
    },

    // 滚动Tab
    scrollToTab(index) {
      let clientWidth = document.documentElement.offsetWidth;
      let tabs = this.$refs.tableTabs;
      let curLi = tabs.getElementsByTagName("li")[index];
      let curWidth = curLi.offsetWidth + curLi.offsetLeft;
      if (
        curWidth > clientWidth - 50 &&
        curLi.offsetLeft >= tabs.scrollLeft + 50
      ) {
        // 当前tab左侧距离+自身宽度 > 屏幕宽度 并且 当前tab左侧距离 > tabs滚动距离 时，tabs向左滚动
        tabs.scrollLeft += curLi.offsetWidth;
      } else if (curLi.offsetLeft <= tabs.scrollLeft + 50) {
        // 当前tab左侧距离 < tabs滚动距离，tabs向左滚动
        tabs.scrollLeft -= curLi.offsetWidth;
      }
      sessionStorage.setItem("tabScroll" + this.usestatus, tabs.scrollLeft);
    },

    // 获取合计待缴费用
    getTotalFee() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spreselec/needPayAll"
        })
        .then(res => {
          if (res.success) {
            this.totalFee = res.item.needAllPay || 0;
          }
        });
    },
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
      });
    },
    // 获取列表
    getList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let params = {
          page: page,
          limit: this.limit,
          usestatus: this.usestatus,
          resstatus: "1" // 开启的资源
        };
        if (this.activeTab) {
          params.restypeid = this.activeTab;
        }
        if (this.keyword) {
          params.rescode = this.keyword;
        }
        if (this.usestatus === "3") {
          params.userid = this.userInfo.ID;
        }
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: "/spres/pageList?date=" + new Date().getTime(),
            data: {
              params: JSON.stringify(params)
            }
          })
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let list = res.items || [];
              if (page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.limit ? true : false;
              this.currentPage = page;
              resolve(list);
            } else {
              // this.finishTable = true;
              this.$toast.fail("获取数据失败" + "\n" + res.message);
              reject(res);
            }
          })
          .catch(err => {
            this.loading = false;
            // this.finishTable = true;
            // this.$toast.fail("获取数据失败" + "\n" + err);
            reject(err);
          });
      });
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight || 0;
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight || 0;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight || 0;
        let searchBarHeight = this.$refs.searchBar.offsetHeight || 0;
        let tableTabsHeigth = this.$refs.tableTabs.offsetHeight || 0;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight || 0;
        this.tableHeight =
          domHeight -
          tabsHeight -
          navBarHeight -
          searchBarHeight -
          tableTabsHeigth -
          tabBarHeight -
          20;
      });
    }
  },
  created() {
    // 获取资源类型列表
    this.common
      .getEduResTypeList()
      .then(res => {
        this.tabs = res;
        this.$nextTick(() => {
          // 判断是否存在当前tab的缓存
          let curEduResTab = sessionStorage.getItem(
            "curEduResTab" + this.usestatus
          );
          if (curEduResTab && curEduResTab !== undefined) {
            this.activeTab = curEduResTab;
            this.curResTypeDetail =
              res.filter(i => i.id === curEduResTab)[0] || {};
          } else {
            this.activeTab = res[0] ? res[0].id : "";
            this.curResTypeDetail = res[0] || {};
          }
          sessionStorage.setItem(
            "curEduResTab" + this.usestatus,
            this.activeTab
          );
          sessionStorage.setItem(
            "curEduResType",
            JSON.stringify(this.curResTypeDetail)
          );

          // tab滚动到当前tab
          if (this.$refs.tableTabs) {
            this.$refs.tableTabs.scrollLeft =
              sessionStorage.getItem("tabScroll" + this.usestatus) || 0;
          }

          // 获取列表
          this.getList(1);

          // 设置表格高度
          this.setTableHeight();
        });
      })
      .catch(() => {});

    // 获取合计待缴费用
    if (this.usestatus === "3") {
      this.getTotalFee();
    }
  }
};
</script>

<style lang="scss" scoped>
.big-line {
  width: 100%;
  margin: 0;
  padding: 0 15px;
  text-align: left;
  opacity: 1;
  .van-cell {
    background: #fff3dc;
    box-shadow: 0 2px 2px 0 rgba(182, 189, 198, 0.3);
    border-radius: 5px;
    .van-cell__value {
      color: #faac16;
      font-weight: bold;
    }
  }
}
</style>