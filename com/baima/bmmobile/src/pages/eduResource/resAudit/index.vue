<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <!-- <basic-select-org
        :showPicker.sync="showOrgPicker"
        title="学院"
        :value="orgName"
        top="188px"
        v-if="operDev === 'bm'"
        @selectItem="chooseOrg"
        @click.stop="showOrgPicker = !showOrgPicker"
      ></basic-select-org> -->
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
        style="width:33%;"
        :class="{ active: activeTableTab === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @click="
          activeTableTab = item.value;
          tableData = [];
        "
      >
        {{ item.text }}
      </li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight" ref="refresh">
      <el-table-column
        prop="useType"
        label="申请类型"
        align="center"
        :formatter="common.useTypeFormatter"
      ></el-table-column>
      <el-table-column prop="eduTypeName" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="resName" label="资源编号" align="center"></el-table-column>
      <el-table-column prop="orgName" label="学院名称" align="center"></el-table-column>
      <el-table-column
        width="120"
        prop="classfeeLeaderName"
        label="负责教师"
        align="center"
      ></el-table-column>
      <el-table-column prop="useCycle" label="使用时长" align="center">
        <template slot-scope="scope">
          {{ common.cycleUnit(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="审批状态" align="center" width="120">
        <template slot-scope="scope">
          <span
            :class="
              common.actionColor2(
                operDev === 'bm' ? 'BM' : 'LD',
                scope.row.handleNode,
                scope.row.historyNode,
                scope.row
              )
            "
          >
            {{
              common.processFormatter2(
                operDev === 'bm' ? 'BM' : 'LD',
                scope.row.handleNode,
                scope.row.historyNode,
                scope.row
              )
            }}
          </span>
        </template>
      </el-table-column>
      <!-- 领导审批人是自己，基地看到 -->
      <el-table-column prop="approver" label="审批人" align="center" width="120">
        <template slot-scope="scope">
          {{ charger(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">
            详情
          </span>
          <span
            v-if="
              (operDev === 'leader' && scope.row.handleNode == 'LD' && scope.row.status == 1) ||
                (operDev === 'bm' && scope.row.handleNode == 'BM' && scope.row.status == 1)
            "
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="toAudit(scope.row)"
          >
            审批
          </span>
        </template>
      </el-table-column>

      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>
  </div>
</template>

<script>
// import BasicSelectCalendar from '../../../components/BasicSelectCalendar';
// import BasicSelect from '../../../components/BasicSelect';
// import BasicSelectOrg from '../../../components/BasicSelectOrg';
import { eduApplyPageQuery } from '@/assets/js/api';

export default {
  name: 'ResAuditList',
  // components: {
  //   BasicSelect,
  //   BasicSelectCalendar,
  //   BasicSelectOrg,
  // },
  data() {
    return {
      keyword: '',
      activeTableTab: '1',
      tabs: [
        { text: '全部', value: '0' },
        { text: '待审批', value: '1' },
        { text: '已审批', value: '2' },
      ],
      leaderList: [],
      currentPage: 1,
      total: 0,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
    };
  },
  props: {
    operDev: String, // leader单位领导 bm基地
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    charger() {
      return function(row) {
        let obj = this.leaderList.find(l => l.id === row.approver) || {};
        let name;
        if (row && row.events && row.events.length && row.events[0].eventType != 1) {
          name = row.events[0].createName || name;
        }
        return name || '--';
      };
    },
  },
  watch: {
    activeTableTab() {
      this.getList(1);
    },
  },
  methods: {
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 详情页面
    toDetail(row) {
      this.$router.push(
        `/edures/res-apply/detail/${row.id}/${this.operDev}/${this.activeTableTab}`
      );
    },
    // 审批页面
    toAudit(row) {
      this.$router.push(`/edures-${this.operDev}/res-audit/${row.id}`);
    },
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
        this.finishTable = this.tableData.length == this.total;
      });
    },
    // 获取列表
    getList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const filter = {
          // 申请列表使用status状态，节点则使用handleNode和historyNode
          status: '1,2,8',
          // 去掉续租和退出申请时的单位领导审核过程
          useType: this.operDev === 'leader' ? 1 : undefined,
          resName: this.keyword || undefined,
          // eduTypeId: this.searchForm.eduTypeId || undefined,
          // 基地不需要个人ID
          approver: this.operDev === 'leader' ? this.userInfo.ID : undefined,
        };
        if (0 == this.activeTableTab && this.operDev === 'bm') {
          filter.allNode = 'BM';
        } else if (1 == this.activeTableTab) {
          filter.handleNode = this.operDev === 'leader' ? 'LD' : 'BM';
          filter.status = '1';
        } else if (2 == this.activeTableTab) {
          filter.historyNode = this.operDev === 'leader' ? 'LD' : 'BM';
          filter.status = this.operDev === 'leader' ? '1,2,8' : '2,8';
        }
        const params = {
          page: page || this.currentPage,
          limit: this.limit,
          filter,
        };
        eduApplyPageQuery(params)
          .then(res => {
            this.loading = false;
            if (res && res.success === true) {
              this.total = res.total;
              this.currentPage = page;

              let list = res.data;
              list.forEach(r => {
                let chargecycle = r.billingCycle + '';
                let chargetype = r.billingMethod + '';
                this.common.chargecycleFormatter(chargecycle, r);
                this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');
              });

              if (page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.limit || list.length === res.total;
              this.$refs.refresh.doLayout();
              resolve(list);
            } else {
              this.$toast.fail('获取数据失败' + '\n' + res.message);
              reject(res);
            }
          })
          .catch(err => {
            this.loading = false;
            reject(err);
          });
      });
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight || 0;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight || 0;
        // let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight || 0;
        let searchBarHeight = this.$refs.searchBar.offsetHeight || 0;
        let tableTabsHeigth = this.$refs.tableTabs.offsetHeight || 0;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight || 0;
        this.tableHeight =
          domHeight -
          navBarHeight -
          // tabsHeight -
          searchBarHeight -
          tableTabsHeigth -
          tabBarHeight -
          20;
      });
    },
    // 获取审批人列表
    getLeaderList() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/user/userLeaderList',
        })
        .then(res => {
          if (res.success) {
            this.leaderList = res.items;
          } else {
            this.$toast.fail('获取审批人列表失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取审批人列表失败" + "\n" + err);
        });
    },
  },
  created() {
    this.getList(1);
    this.getLeaderList();
  },
  mounted() {
    // 设置表格高度
    this.setTableHeight();
  },
};
</script>

<style lang="scss" scoped></style>
