<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <div class="select-group small-padding">
        <basic-select-calendar
          style="width: 34%"
          title="灌溉日期"
          :value="irdateFormat"
          @chooseDate="chooseIrdate"
        />
        <basic-select
          style="width: 34%"
          title="灌溉类型"
          :value="resTypeName"
          :list="resTypes"
          optionName="typename"
          optionValue="id"
          top="188px"
          @chooseItem="chooseResType"
        />
        <basic-select-org
          style="width: 32%"
          :showPicker.sync="showOrgPicker"
          title="选择学院"
          :value="orgName"
          top="188px"
          @selectItem="chooseOrg"
          @click.stop="showOrgPicker = !showOrgPicker"
        ></basic-select-org>
      </div>
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
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
    <el-table
      :data="tableData"
      style="width: 100%;"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="activeTableTab == '2'" type="selection"></el-table-column>
      <el-table-column
        prop="irdate"
        label="灌溉日期"
        align="center"
        :formatter="common.dateFormatter"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="orgname"
        label="学院名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="projectname"
        label="项目名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="typename"
        label="灌溉类型"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="rescodes"
        label="资源编号"
        width="120"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="applyername"
        label="申请人"
        align="center"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="applystatus" label="状态" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="common.statusColor('', '', scope.row.applystatus)">
            {{ common.statusFormatter('', '', scope.row.applystatus) }}
          </span>
        </template>
      </el-table-column>
      <!-- :formatter="common.statusFormatter" -->
      <el-table-column label="操作" fixed="right" width="140" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">
            详情
          </span>
          <span
            v-if="scope.row.applystatus === '0' || scope.row.applystatus === '1'"
            style="color:#faac16;padding:0 5px;font-weight:bold"
            @click="toEdit(scope.row)"
          >
            编辑
          </span>
          <span
            v-if="scope.row.applystatus === '0' || scope.row.applystatus === '1'"
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
    <!-- 批量审批 -->
    <div class="btns">
      <van-button
        :icon="batchPng"
        round
        type="primary"
        @click="toAudit()"
        v-if="activeTableTab == '2'"
        :disabled="!checkedList.length"
      >
        批量审批
      </van-button>
    </div>
  </div>
</template>

<script>
import BasicSelectCalendar from '../../../../components/BasicSelectCalendar';
import BasicSelect from '../../../../components/BasicSelect';
import BasicSelectOrg from '../../../../components/BasicSelectOrg';
export default {
  components: {
    BasicSelect,
    BasicSelectCalendar,
    BasicSelectOrg,
  },
  data() {
    return {
      batchPng: require(`st@tic/imgs/batch_approve.png`),
      checkedList: [],
      activeTab: 'manage',
      keyword: '',
      irdate: '',
      irdatePopup: false,
      irdateFormat: '',
      resType: '',
      resTypeName: '',
      resTypes: [],
      orgId: '',
      orgName: '',
      showOrgPicker: false,
      activeTableTab: '2',
      tabs: [
        // { text: "全部", value: "1" },
        { text: '待审批', value: '2' },
        { text: '已审批', value: '3' },
        { text: '已撤回', value: '4' },
      ],
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
      total: 0
    };
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
    irdate() {
      this.getList(1);
    },
    resType() {
      this.getList(1);
    },
    orgId() {
      this.getList(1);
    },
    activeTableTab() {
      this.getList(1);
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.checkedList = val;
    },
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择日期
    chooseIrdate(date) {
      if (date) {
        this.irdateFormat = this.common.formatTime(date.getTime(), 'YYYY.MM.DD');
        this.irdate = this.common.formatTime(date.getTime(), 'YYYYMMDD000000');
      } else {
        this.irdateFormat = '';
        this.irdate = '';
      }
      this.irdatePopup = false;
    },
    // 选择灌溉类型
    chooseResType(item) {
      this.resType = item.id;
      this.resTypeName = item.typename;
    },
    // 选择学院
    chooseOrg(item) {
      this.orgId = item.id;
      this.orgName = item.name;
    },
    // 详情页面
    toDetail(row) {
      this.$router.push('/irrgate-manage/audit/detail/' + row.id);
    },
    // 编辑页面
    toEdit(row) {
      this.$router.push('/irrgate-manage/audit/edit/' + row.id);
    },
    // 审批页面
    toAudit(row) {
      if (row) {
        this.$router.push('/irrgate-manage/audit/audit/' + row.id);
      } else {
        this.$router.push({
          path: '/irrgate-manage/audit/audit/batch',
          query: { data: JSON.stringify(this.checkedList) },
        });
      }
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
        let params = {
          page: page,
          limit: this.limit,
          applytype: this.activeTableTab,
        };
        if (this.irdate) {
          params.irdate = this.irdate;
        }
        if (this.resType) {
          params.irrestypeid = this.resType;
        }
        if (this.keyword) {
          params.rescode = this.keyword;
        }
        if (this.orgId) {
          params.orgid = this.orgId;
        }
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: '/irapply/pageList?date=' + new Date().getTime(),
            data: {
              params: JSON.stringify(params),
            },
          })
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let bmList = res.item ? res.item.bmList || {} : {};
              let list = bmList.list || [];
              this.total = bmList.total || 0
              if (page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.limit || list.length == this.total;
              this.currentPage = page;
              resolve(list);
            } else {
              // this.finishTable = true;
              this.$toast.fail('获取数据失败' + '\n' + res.message);
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
  },
  created() {
    // 获取灌溉类型列表
    this.common.getResTypeList().then(res => {
      this.resTypes = res;
      this.resTypes.unshift({
        typename: '全部类型',
        id: '',
      });
    });
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
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table th.el-table__cell > .cell {
  padding-left: 0.37333rem;
}


/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color:#00B09B;
      border-color:#00B09B;
     }
/deep/ .el-checkbox__input.is-indeterminate  .el-checkbox__inner {
      background-color:#00B09B;
      border-color:#00B09B; 
}
/deep/  .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #00B09B;
     }
/deep/  .el-checkbox.is-bordered.is-checked{
      border-color: #00B09B;
     }
/deep/  .el-checkbox__input.is-focus .el-checkbox__inner{
      border-color:  #00B09B;
     }
</style>
