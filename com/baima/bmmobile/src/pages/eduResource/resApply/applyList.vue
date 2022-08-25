<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <basic-select
        title="选择资源类型"
        :value="eduTypeName"
        :list="resTypeList"
        optionName="name"
        optionValue="id"
        top="146px"
        @chooseItem="chooseResType"
      />
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-top:10px;"
      :height="tableHeight"
      ref="recordTable"
    >
      <el-table-column
        prop="useType"
        label="申请类型"
        align="center"
        :formatter="common.useTypeFormatter"
      ></el-table-column>
      <el-table-column prop="eduTypeName" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="resName" label="资源编号" width="200" align="center"></el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        align="center"
        width="300"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="useCycle" label="使用时长" align="center">
        <template slot-scope="scope">
          {{ common.cycleUnit(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="approver" label="审批人" align="center" width="120">
        <template slot-scope="scope">
          <!-- {{ (leaderList.find(l => l.id === scope.row.approver) || {}).name || '--' }} -->
          {{ charger(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="120" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">
            详情
          </span>
          <span
            v-if="scope.row.status == 1 && scope.row.useType != 3"
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="withDraw(scope.row)"
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
    <!-- 是否确定撤回 -->
    <van-action-sheet
      v-model="showConfirmCheckOut"
      :actions="[{ name: '确定撤回', color: '#fe3e61' }]"
      @select="confirmCheckOut"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import BasicSelect from '../../../components/BasicSelect';
import { eduApplyWithdraw, eduApplyPageQuery, eduTypeList } from '@/assets/js/api';
export default {
  name: 'MyRecord',
  components: {
    BasicSelect,
  },
  computed: {
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
  data() {
    return {
      keyword: '',
      eduTypeName: '',
      eduTypeId: '',
      resTypeList: [],
      leaderList: [],
      showConfirmCheckOut: false,
      total: 0,
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
    };
  },
  methods: {
    withDraw(row) {
      this.row = row;
      this.showConfirmCheckOut = true;
    },
    // 撤回
    confirmCheckOut() {
      this.$toast.loading({
        message: '提交中...',
        forbidClick: true,
        duration: 0,
      });
      eduApplyWithdraw({ eduApplyId: this.row.id })
        .then(res => {
          if (res && res.success === true) {
            this.$toast.success('已提交撤回');
            this.showConfirmCheckOut = false;
            this.getList(1);
          } else {
            this.$toast.fail({ message: res.message || '内部错误', duration: 3000 });
          }
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail(err || '内部错误');
        });
    },
    // 选择类型
    chooseResType(item) {
      this.eduTypeName = item.name;
      this.eduTypeId = item.id;
      this.getList(1);
    },
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 详情页面
    toDetail(row) {
      this.$router.push(`/edures/res-apply/detail/${row.id}/${0}/${0}`);
    },
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
        this.finishTable = this.tableData.length === this.total;
      });
    },
    // 获取列表
    getList(page) {
      return new Promise((resolve, reject) => {
        const filter = {
          resName: this.keyword || undefined,
          eduTypeId: this.eduTypeId || undefined,
          classfeeLeader: this.$store.state.userInfo.ID,
        };
        const params = {
          page: page || this.currentPage,
          limit: this.limit,
          filter,
        };
        this.loading = true;
        eduApplyPageQuery(params)
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              this.total = res.total;
              this.currentPage = page;
              let list = res.data || [];
              list.forEach(r => {
                let chargecycle = r.billingCycle + '';
                let chargetype = r.billingMethod + '';
                this.common.chargecycleFormatter(chargecycle, r);
                this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');

                const obj = this.resTypeList.find(item => item.id === r.eduTypeId) || {};
                r.rules = obj.rules;
                r.typeName = r.eduTypeName;
                r.areas = (r.resources.map(item => item.eduResourceArea) || []).join(',');
                const tmp = r.resources;
                if (tmp && tmp.length) {
                  const arrTmp = tmp.map(t => ({
                    ...t,
                    useCycle: r.useCycle,
                    cost:
                      this.common.moneyFormatter('', '', r.billingMethod == 1
                        ? t.eduResourcePrice * r.useCycle * t.eduResourceArea
                        : t.eduResourcePrice * r.useCycle),
                  }));
                  // 总消费、行合计需要灵活合并单元格
                  let cost = arrTmp.reduce((pre, item) => {
                    return pre + parseFloat(item.cost);
                  }, 0);
                  let summary = {};
                  for (let p in tmp[0]) {
                    summary[p] = '';
                  }
                  summary.eduResourceName = '合计';
                  summary.cost = cost;
                  arrTmp.push(summary);
                  r.resArr = arrTmp;
                }
              });

              if (page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.limit || list.length === res.total;
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
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight || 0;
        let searchBarHeight = this.$refs.searchBar.offsetHeight || 0;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight || 0;
        this.tableHeight =
          domHeight - navBarHeight - tabsHeight - searchBarHeight - tabBarHeight - 10;
      });
    },
    //获取资源类型列表
    getResTypeList() {
      eduTypeList({}).then(res => {
        if (res.success == true) {
          this.resTypeList = res.data;
          this.resTypeList.forEach(r => {
            let chargecycle = r.billingCycle + '';
            let chargetype = r.billingMethod + '';
            this.common.chargecycleFormatter(chargecycle, r);
            this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');
          });
          this.getList(this.currentPage);
        }
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
    this.getResTypeList();
    // 获取审批人列表
    this.getLeaderList();
  },
  mounted() {
    // 设置表格高度
    this.setTableHeight();
  },
};
</script>

<style lang="scss" scoped></style>
