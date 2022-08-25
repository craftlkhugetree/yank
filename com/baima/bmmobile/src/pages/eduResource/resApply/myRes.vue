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
    >
      <el-table-column prop="typeName" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="resName" label="资源编号" align="center"></el-table-column>
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

      <el-table-column prop="liveinfo" label="入驻信息" align="center">
        <el-table-column
          prop="liveinfo.orgName"
          label="学院名称"
          width="200"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="liveinfo.projectName"
          label="项目名称"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.contacterName"
          label="日常联系人"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="liveinfo.contacterMobile"
          label="联系方式"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="liveinfo.expectCheckoutTime"
          label="退出时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            {{ common.formatTime(scope.row.expectCheckoutTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="liveinfo.waterFee"
          label="待缴水费(元)"
          :formatter="common.moneyFormatter"
          align="center"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="liveinfo.eleFee"
          label="待缴电费(元)"
          :formatter="common.moneyFormatter"
          align="center"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="liveinfo.limitday"
          label="剩余使用时间(天)"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <span
              :style="{
                color:
                  scope.row.liveinfo && scope.row.liveinfo.limitday <= 0
                    ? 'red'
                    : scope.row.liveinfo && scope.row.liveinfo.limitday <= 30
                    ? 'orange'
                    : '',
              }"
            >
              {{
                scope.row.liveinfo && scope.row.liveinfo.limitday ? scope.row.liveinfo.limitday : ''
              }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">
            详情
          </span>

          <!-- 续租：已入驻 并且 没有续租申请 并且 没有 退出申请 并且 剩余时间小于30天 -->
          <span
            v-if="scope.row.useType != '3' && scope.row.useType != '2' && scope.row.limitday <= 30"
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="toExtend(scope.row)"
          >
            续租
          </span>
          <!-- 退出：已入驻 并且 没有续租申请 并且 没有 退出申请 -->
          <span
            v-if="scope.row.useType != '3' && scope.row.useType != '2'"
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="toCheckOut(scope.row)"
          >
            退出
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

    <!-- 是否确定退出 -->
    <van-action-sheet
      v-model="showConfirmCheckOut"
      :actions="[{ name: '一旦退出便不可再使用，确定退出吗？', color: '#fe3e61' }]"
      @select="confirmCheckOut"
      cancel-text="取消"
    />
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
import { eduResourceCheckoutApply, eduTypeList } from '@/assets/js/api';

export default {
  name: 'MyRes',
  components: {
    basicSelect: () => import('@/components/BasicSelect'),
    confirmDialog: () => import('@/components/confirmDialog'),
  },
  data() {
    return {
      row: {},
      showConfirmCheckOut: false,
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
    toCheckOut(row) {
      this.row = row;
      this.showConfirmCheckOut = true;
    },
    // 退出
    confirmCheckOut() {
      this.$toast.loading({
        message: '提交中...',
        forbidClick: true,
        duration: 0,
      });
      eduResourceCheckoutApply({ id: this.row.id })
        .then(res => {
          if (res && res.success === true) {
            this.$toast.success('已提交退出申请，请等待基地审核');
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

    // 续租
    toExtend(row) {
      this.$router.push(`/edures-staff/res-apply/2/${row.eduTypeId}/${row.id}`);
    },
    // 详情页面
    toDetail(row) {
      this.$router.push(`/edures-staff/res-list/${row.eduTypeId}/detail-res/${row.id}/${'my'}`);
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
          name: this.keyword || undefined,
          eduTypeId: this.eduTypeId || undefined,
        };
        const data = {
          page: page || this.currentPage,
          limit: this.limit,
          filter,
        };
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: '/eduResource/myResource',
            data,
            isRep: true,
          })
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
                r.resName = r.name;

                let chargecycle = r.billingCycle + '';
                let chargetype = r.billingMethod + '';
                this.common.chargecycleFormatter(chargecycle, r);
                this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');

                [r.waterFee, r.eleFee] = r.amounts.reduce(
                  (pre, item) => {
                    return [
                      pre[0] + (item.priceType == 3 && item.isPay == 0 ? item.amount : 0),
                      pre[1] + (item.priceType == 4 && item.isPay == 0 ? item.amount : 0),
                    ];
                  },
                  [0, 0]
                );

                r.liveinfo = r;
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

<style lang="scss" scoped></style>
