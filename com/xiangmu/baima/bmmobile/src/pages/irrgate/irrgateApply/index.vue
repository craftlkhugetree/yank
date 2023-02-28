<template>
  <div>
    <van-nav-bar
      ref="navBar"
      title="水资源申请"
      :border="false"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <basic-select
        title="选择灌溉类型"
        :value="resTypeName"
        :list="resTypes"
        optionName="typename"
        optionValue="id"
        top="146px"
        @chooseItem="chooseResType"
      />
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tabs">
      <li
        :class="{ active: activeTab === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @click="activeTab = item.value"
      >
        {{ item.text }}
      </li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight">
      <el-table-column
        prop="typename"
        label="灌溉类型"
        align="center"
        show-overflow-tooltip
        :formatter="common.defaultFormatter"
      ></el-table-column>
      <el-table-column
        prop="rescodes"
        label="资源编号"
        align="center"
        show-overflow-tooltip
        :formatter="common.defaultFormatter"
      ></el-table-column>
      <el-table-column
        prop="irdate"
        label="灌溉日期"
        align="center"
        show-overflow-tooltip
        width="90"
        :formatter="common.dateFormatter"
      ></el-table-column>
      <el-table-column
        prop="endtime"
        label="完成日期"
        align="center"
        show-overflow-tooltip
        width="90"
        :formatter="common.dateFormatter"
      ></el-table-column>
      <el-table-column
        prop="applystatus"
        label="状态"
        align="center"
        show-overflow-tooltip
        :formatter="common.statusFormatter"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="110">
        <template slot-scope="scope">
          <span
            v-if="scope.row.applystatus == 0"
            style="color:#faac16;padding:0 5px;font-weight:bold"
            @click="toEdit(scope.row)"
          >
            编辑
          </span>
          <span
            v-if="scope.row.applystatus != 0"
            style="color:#00b09b;padding:0 5px;font-weight:bold"
            @click="toDetail(scope.row)"
          >
            详情
          </span>
          <span
            v-if="scope.row.applystatus == 1 || scope.row.applystatus == 2"
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="reCall(scope.row)"
          >
            撤回
          </span>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length" style="cursor:none;">到底啦</p>
      </div>
    </el-table>

    <!-- 新增申请 -->
    <div class="btns">
      <van-button icon="plus" round type="primary" @click="toApply">新增申请</van-button>
    </div>

    <!-- 是否确定撤回 -->
    <van-action-sheet
      v-model="showConfirmRecall"
      :actions="[{ name: '确定撤回', color: '#fe3e61' }]"
      @select="confirmRecall"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import BasicSelect from '../../../components/BasicSelect';
export default {
  components: {
    BasicSelect,
  },
  computed: {
  
  },
  data() {
    return {
      keyword: '',
      resType: '',
      resTypeName: '',
      resTypes: [],
      activeTab: '1',
      tabs: [
        { text: '全部', value: '1' },
        { text: '已提交', value: '3' },
        { text: '草稿箱', value: '2' },
      ],
      currentPage: 1,
      limit: 10,
      total: 0,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
      recallRow: {},
      showConfirmRecall: false,
      latestId: '',
    };
  },
  watch: {
    resType() {
      this.getList(1);
    },
    activeTab() {
      this.getList(1);
    },
  },
  methods: {
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择灌溉类型
    chooseResType(item) {
      this.resType = item.id;
      this.resTypeName = item.typename;
    },
    // 申请页面
    toApply() {
      this.$router.push('/irrgate-apply/apply?id=' + this.latestId);
    },
    // 详情
    toDetail(row) {
      this.$router.push('/irrgate-apply/detail/' + row.id);
    },
    // 编辑
    toEdit(row) {
      this.$router.push('/irrgate-apply/edit/' + row.id);
    },
    // 撤回
    reCall(row) {
      this.recallRow = row;
      this.showConfirmRecall = true;
    },
    // 确认撤回
    confirmRecall() {
      this.$toast.loading({
        message: '撤回中...',
        forbidClick: true,
        duration: 0,
      });
      this.showConfirmRecall = false;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/irapply/saveEvent',
          isRep: true,
          data: {
            eventtype: 2,
            applyid: this.recallRow.id,
          },
        })
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast.success('撤回成功');
            this.getList(1);
          } else {
            this.$toast.fail('撤回失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('撤回失败' + '\n' + res.err);
        });
    },
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1)
        .then(list => {
          this.tableData = this.tableData.concat(list);
          this.finishTable = this.tableData.length === this.total;
        })
        .catch(() => {});
    },
    // 获取列表
    getList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let params = {
          page: page,
          limit: this.limit,
          applytype: this.activeTab,
          applyerid: this.$store.state.userInfo.ID,
        };
        if (this.resType) {
          params.irrestypeid = this.resType;
        }
        if (this.keyword) {
          params.rescode = this.keyword;
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
              this.total = res.total;
              let applyerList = res.item ? res.item.applyerList || {} : {};
              let list = applyerList.list || [];
              if (page === 1) {
                this.tableData = list;
                // 如果是全部，则保持最新一条的ID
                if (this.activeTab === '1') {
                  this.latestId = list[0] ? list[0].id : '';
                }
              }
              this.finishTable = list.length < this.limit || list.length === res.total;
              this.currentPage = page;
              resolve(list);
            } else {
              this.$toast.fail('获取数据失败' + '\n' + res.message);
              reject(res);
            }
          })
          .catch(err => {
            this.loading = false;
            // this.$toast.fail("获取数据失败" + "\n" + err);
            reject(err);
          });
      });
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight || 0;
        let navBarHeight = this.$refs.navBar.offsetHeight || 0;
        let searchBarHeight = this.$refs.searchBar.offsetHeight || 0;
        let tabsHeight = this.$refs.tabs.offsetHeight || 0;
        let tabBarHeight = this.$parent.$refs.tabBar.$el.offsetHeight || 0;
        this.tableHeight =
          domHeight - navBarHeight - searchBarHeight - tabsHeight - tabBarHeight - 20;
      });
    },
  },
  created() {
    // 获取灌溉类型列表
    this.common
      .getResTypeList()
      .then(res => {
        this.resTypes = res;
        this.resTypes.unshift({
          typename: '全部类型',
          id: '',
        });
      })
      .catch(() => {});
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
/deep/ .van-nav-bar__text {
  color: #00b09b;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>