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

    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table
      ref="resTable"
      :data="resList"
      style="width: 100%;"
      :height="tableHeight"
      :border="false"
      @selection-change="handleSelectionChange"
      empty-text="当前无空闲资源，请及时关注。"
    >
      <el-table-column type="selection" align="center" fixed="left"></el-table-column>
      <el-table-column prop="typeName" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="name" label="资源编号" align="center"></el-table-column>
      <el-table-column prop="area" label="面积(㎡)" width="100" align="center"></el-table-column>

      <el-table-column prop="price" :label="'单价'" align="center" width="150">
        <template slot-scope="scope">
          {{
            common.moneyFormatter('', '', scope.row.price) +
              (scope.row.billingCycle && scope.row.billingMethod
                ? '元/' + scope.row.chargecycle + '/' + scope.row.ct2
                : '元/' + '--' + '/' + '--')
          }}
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="110" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">
            详情
          </span>
          <span
            v-if="usestatus === '1'"
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="toApply([scope.row])"
          >
            申请
          </span>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && resList.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>
    <!-- 批量申请 -->
    <div class="btns" v-if="usestatus === '1'">
      <van-button :disabled="!selectedIds" :icon="batchPng" round type="primary" @click="batch">
        批量申请
      </van-button>
    </div>

    <confirm-dialog
      :diagTitle="diagTitle"
      :diagBody="diagBody"
      :dVisible="dVisible"
      :hasCancel="false"
      v-if="dVisible"
      @confirm="doSubmit"
      @dropdown="dVisible = false"
    ></confirm-dialog>
  </div>
</template>

<script>
import { eduResourcePageQuery, eduTypeList } from '@/assets/js/api';

export default {
  name: "IdleRes",
  components: {
    basicSelect: () => import('@/components/BasicSelect'),
    confirmDialog: () => import('@/components/confirmDialog'),
  },
  data() {
    return {
      dVisible: false,
      diagTitle: '',
      diagBody: '',
      batchPng: require(`st@tic/imgs/batch_approve.png`),
      selectedIds: '', //多选框值
      selected: [], //多选框值
      keyword: '',
      eduTypeId: '',
      eduTypeName: '',
      resTypeList: [],
      tabs: [],
      tableHeight: 0,
      currentPage: 1,
      total: 0,
      limit: 10,
      resList: [],
      loading: false,
      finishTable: false,
    };
  },
  props: {
    id: String,
    usestatus: String, // 我的资源（已入驻"3"）、空闲资源（空闲"1"）
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  watch: {
    usestatus() {
      this.getList(1);
    },
  },
  methods: {
    // 对话框确定按钮
    doSubmit() {
      this.dVisible = false;
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

    // 批量申请
    batch() {
      if (!this.selectedIds) {
        this.$toast.fail('请先选择资源');
        return;
      }
      if (!this.normalize(this.selected)) {
        this.diagTitle = '请选择同一类型资源';
        this.diagBody = '批量申请时，请选择同一类型资源进行申请。';
        this.dVisible = true;
        return;
      }
      this.toApply(this.selected);
    },

    // 单个申请
    toApply(arr) {
      let eduResourceIds = arr.map(r => r.id);
      let resid = eduResourceIds.join(',')
      this.$router.push(`/edures-staff/res-apply/1/${arr[0].eduTypeId}/${resid}`);
    },

    // 类型是否唯一
    normalize(arr) {
      if (arr && arr.length) {
        const obj = {};
        arr.forEach(a => {
          if (obj[a.eduTypeId]) {
            obj[a.eduTypeId]++;
          } else {
            obj[a.eduTypeId] = 1;
          }
        });
        return Object.keys(obj).length === 1;
      }
      return false;
    },

    // 详情页面
    toDetail(row) {
      this.$router.push(`/edures-staff/res-list/${row.eduTypeId}/detail-res/${row.id}/${'idle'}`);
    },

    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.resList = this.resList.concat(list);
        this.finishTable = this.resList.length == this.total;
      });
    },
    //获取资源列表
    getList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const filter = {
          useState: 0,
          status: 1,
          name: this.keyword || undefined,
          eduTypeId: this.eduTypeId || undefined,
        };
        const params = {
          page: page || this.currentPage,
          limit: this.limit,
          filter,
        };
        eduResourcePageQuery(params)
          .then(res => {
            this.loading = false;
            if (res && res.success === true) {
              this.total = res.total;
              this.currentPage = page;
              let list = res.data || [];

              list.forEach(r => {
                const obj = this.resTypeList.find(t => t.id === r.eduTypeId) || {};
                r.typeName = obj.name || '';
                r.rules = obj.rules || '';

                let chargecycle = r.billingCycle + '';
                let chargetype = r.billingMethod + '';
                this.common.chargecycleFormatter(chargecycle, r);
                this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');
              });
              if (page === 1) {
                this.resList = list;
              }
              this.finishTable = list.length < this.limit || list.length === res.total;
              this.$nextTick(() => {
                this.$refs.resTable.doLayout();
              });
              resolve(list);
            } else {
              this.$toast.fail('获取数据失败' + '\n' + (res.message || '内部错误'));
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
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight || 0;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight || 0;
        let searchBarHeight = this.$refs.searchBar.offsetHeight || 0;
        // let tableTabsHeigth = this.$refs.tableTabs.offsetHeight || 0;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight || 0;
        this.tableHeight =
          domHeight -
          tabsHeight -
          navBarHeight -
          searchBarHeight -
          // tableTabsHeigth -
          tabBarHeight -
          20;
      });
    },

    //多选框
    handleSelectionChange(val) {
      let arr = [];
      val.forEach(v => {
        arr.push(v.id);
      });
      this.selected = val;
      this.selectedIds = arr.join(',').toString();
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
  },
  created() {
    this.getResTypeList();
    // 设置表格高度
    this.setTableHeight();
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #00b09b;
  border-color: #00b09b;
}
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #00b09b;
  border-color: #00b09b;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #00b09b;
}
/deep/ .el-checkbox.is-bordered.is-checked {
  border-color: #00b09b;
}
/deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #00b09b;
}
</style>
