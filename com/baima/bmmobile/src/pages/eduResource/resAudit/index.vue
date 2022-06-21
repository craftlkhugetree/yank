<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <!-- <basic-select
        title="学院"
        :value="orgName"
        :list="orgList"
        optionName="name"
        optionValue="id"
        top="188px"
        @chooseItem="chooseOrg"
        v-if="operDev === 'bm'"
        @click.stop="showOrgPicker = !showOrgPicker"
      />-->
      <basic-select-org
        :showPicker.sync="showOrgPicker"
        title="学院"
        :value="orgName"
        top="188px"
        v-if="operDev === 'bm'"
        @selectItem="chooseOrg"
        @click.stop="showOrgPicker = !showOrgPicker"
      ></basic-select-org>
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
        :class="{'active': activeTableTab === item.value}"
        v-for="item in tabs"
        :key="item.value"
        @click="activeTableTab = item.value;tableData = [];"
      >{{item.text}}</li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight">
      <el-table-column
        prop="usetype"
        label="申请类型"
        align="center"
        show-overflow-tooltip
        :formatter="common.resApplyTypeFormatter"
      ></el-table-column>
      <el-table-column prop="typename" label="资源类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rescodes" label="资源编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orgname" label="学院名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="classleadername" label="负责教师" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="usecycle" label="时长" align="center" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{scope.row.usecycle || "--"}}{{common.chargecycleFormatter(scope.row.chargecycle)}}</template>
      </el-table-column>
      <el-table-column
        prop="applystatus"
        label="审批状态"
        align="center"
        show-overflow-tooltip
        :formatter="common.processFormatter"
      ></el-table-column>
      <el-table-column
        prop="actionstatus"
        label="状态"
        align="center"
        :formatter="common.applyLiveStatusFormatter"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">详情</span>
          <span
            v-if="['1','2'].includes(scope.row.usetype) && scope.row.actionstatus === '0' && scope.row.applystatus === '3'"
            style="color:#814ef5;padding:0 5px;font-weight:bold"
            @click="toCheck(scope.row,'in')"
          >入驻</span>
          <span
            v-if="(scope.row.applystatus === '1' && operDev === 'leader') || (scope.row.applystatus === '2' && operDev === 'bm')"
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="toAudit(scope.row)"
          >审批</span>
          <span
            v-if="scope.row.usetype === '3' && scope.row.actionstatus === '0' && scope.row.applystatus === '3' "
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="toCheck(scope.row,'out')"
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
    <!-- 是否确定办理入驻或退出 -->
    <van-action-sheet
      v-model="showConfirmCheck"
      :actions="checkActions"
      @select="confirmCheck"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import BasicSelectCalendar from "../../../components/BasicSelectCalendar";
import BasicSelect from "../../../components/BasicSelect";
import BasicSelectOrg from "../../../components/BasicSelectOrg";
export default {
  components: {
    BasicSelect,
    BasicSelectCalendar,
    BasicSelectOrg
  },
  data() {
    return {
      keyword: "",
      orgId: "",
      orgName: "",
      activeTableTab: "2",
      tabs: [
        { text: "全部", value: "1" },
        { text: "待审批", value: "2" },
        { text: "已审批", value: "3" }
      ],
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
      curRow: "",
      checkType: "",
      checkActions: [],
      showConfirmCheck: false,
      showOrgPicker: false
    };
  },
  props: {
    operDev: String // leader单位领导 bm白马办
  },
  // computed: {
  //   orgList() {
  //     let list = this.$store.state.orgList;
  //     let data = [
  //       {
  //         name: "全部学院",
  //         id: ""
  //       }
  //     ];
  //     return data.concat(list);
  //   }
  // },
  watch: {
    orgId() {
      this.getList(1);
    },
    activeTableTab() {
      this.getList(1);
    }
  },
  methods: {
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择学院
    chooseOrg(item) {
      this.orgId = item.id;
      this.orgName = item.name;
    },
    // 详情页面
    toDetail(row) {
      this.$router.push("/edures/res-apply/detail/" + row.id);
    },
    // 审批页面
    toAudit(row) {
      this.$router.push(`/edures-${this.operDev}/res-audit/${row.id}`);
    },
    // 办理入驻或退出
    toCheck(row, type) {
      this.checkType = type;
      this.curRow = row;
      this.checkActions =
        type === "in"
          ? [{ name: "确定入驻", color: "#00b09b" }]
          : [{ name: "确定退出", color: "#fe3e61" }];
      this.showConfirmCheck = true;
    },
    // 确定办理
    confirmCheck() {
      this.$toast.loading({
        message: "办理中...",
        forbidClick: true,
        duration: 0
      });
      this.showConfirmCheck = false;
      let url =
        this.checkType === "in" ? "/spapply/checkIn" : "/spapply/checkOut";
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: url,
          data: {
            id: this.curRow.id
          }
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success("办理成功");
            this.getList(1);
          } else {
            this.$toast.fail("办理失败" + "\n" + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("办理失败" + "\n" + err);
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
          applytype: this.activeTableTab,
        };
        if(this.keyword) {
          params.rescode = this.keyword
        }
        if(this.orgId) {
          params.orgid = this.orgId
        }
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: "/spapply/pageList?date=" + new Date().getTime(),
            data: {
              params: JSON.stringify(params)
            }
          })
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let leaderList = res.item ? res.item.leaderList || {} : {};
              let bmList = res.item ? res.item.bmList || {} : {};
              let list =
                this.operDev === "leader"
                  ? leaderList.list || []
                  : bmList.list || [];
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
        let domHeight = document.documentElement.clientHeight;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight;
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight;
        let searchBarHeight = this.$refs.searchBar.offsetHeight;
        let tableTabsHeigth = this.$refs.tableTabs.offsetHeight;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight;
        this.tableHeight =
          domHeight -
          navBarHeight -
          tabsHeight -
          searchBarHeight -
          tableTabsHeigth -
          tabBarHeight -
          20;
      });
    }
  },
  created() {
    // 获取学院列表
    // if (this.orgList.length === 0) {
    //   this.$sotre.dispatch("getOrgList").then(res => {
    //     this.orgList = res.unshift({
    //       name: "全部学院",
    //       id: ""
    //     });
    //   });
    // }
    // 获取列表
    this.getList(1);
  },
  mounted() {
    // 设置表格高度
    this.setTableHeight();
  }
};
</script>

<style lang="scss" scoped>
</style>