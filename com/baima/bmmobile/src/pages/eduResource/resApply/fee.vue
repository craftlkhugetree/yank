<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <basic-select
        title="选择支付状态"
        :value="payName"
        :list="payTypeList"
        optionName="name"
        optionValue="id"
        top="146px"
        @chooseItem="choosePayType"
      />
    </div>

    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
        style="width:25%;"
        :class="{ active: priceType === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @click="
          priceType = item.value;
          resList = [];
        "
      >
        {{ item.text }}
      </li>
    </div>
    <div class="tabs-bottom"></div>

    <!-- 租金/逾期租金表格 -->
    <el-table
      v-if="priceType == 1 || priceType == 2"
      :height="tableHeight"
      :data="resList"
      style="width: 100%"
      ref="multipleTable"
    >
      <el-table-column prop="eduTypeName" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="resName" label="资源编号" align="center"></el-table-column>

      <el-table-column
        prop="resArea"
        label="面积(㎡)"
        align="center"
        key="mianji"
      ></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center" width="200">
        <template slot-scope="scope">
          {{
            (scope.row.createTime &&
              common.formatTime(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss')) ||
              '--'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="resPrice" :label="'单价'" align="center" width="150" key="danjjia">
        <template slot-scope="scope">
          {{
            common.moneyFormatter('', '', scope.row.resPrice) +
              (scope.row.billingCycle && scope.row.billingMethod
                ? '元/' + scope.row.chargecycle + '/' + scope.row.ct2
                : '元/' + '--' + '/' + '--')
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="limitday"
        label="剩余使用时间(天)"
        width="150"
        align="center"
        key="shengyushiyong1"
      >
        <template slot-scope="scope">
          <span
            :style="{
              color:
                scope.row.limitday || scope.row.limitday == 0
                  ? scope.row.limitday <= 0
                    ? 'red'
                    : scope.row.limitday <= 30
                    ? 'orange'
                    : ''
                  : '',
            }"
          >
            {{ scope.row.limitday || scope.row.limitday == 0 ? scope.row.limitday : '--' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="priceType == 1 ? '租金(元)' : `逾期租金(元)`"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column prop="payerName" label="付方" align="center" width="120"></el-table-column>
      <el-table-column
        v-if="isBM && isPay == 0"
        label="操作"
        fixed="right"
        align="center"
        key="caozuo"
        width="80"
      >
        <template slot-scope="scope">
          <div
            v-show="scope.row.isPay == '0' && scope.row.amount != 0"
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="payment(scope.row)"
          >
            缴费
          </div>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && resList.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>

    <!-- 水电表格 -->
    <el-table v-else :data="resList" style="width: 100%" ref="multipleTable" :height="tableHeight">
      <el-table-column
        prop="createTime"
        label="记录时间"
        align="center"
        width="200"
        key="jilushijian"
      >
        <template slot-scope="scope">
          {{
            (scope.row.createTime &&
              common.formatTime(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss')) ||
              '--'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="eduTypeName" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="resName" label="资源编号" align="center"></el-table-column>
      <el-table-column
        prop="limitday"
        label="剩余使用时间(天)"
        width="150"
        align="center"
        key="shengyu"
      >
        <template slot-scope="scope">
          <span
            :style="{
              color:
                scope.row.limitday || scope.row.limitday == 0
                  ? scope.row.limitday <= 0
                    ? 'red'
                    : scope.row.limitday <= 30
                    ? 'orange'
                    : ''
                  : '',
            }"
          >
            {{ scope.row.limitday || scope.row.limitday == 0 ? scope.row.limitday : '--' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="priceNum"
        :label="'数值(' + (priceType == 3 ? '吨' : '度') + ')'"
        align="center"
        width="150"
        key="shuzhi"
      ></el-table-column>
      <el-table-column
        prop="price"
        :label="'单价(元/' + (priceType == 3 ? '吨' : '度') + ')'"
        align="center"
        width="150"
        key="danjjia"
        :formatter="common.moneyFormatter"
      ></el-table-column>

      <el-table-column prop="amount" label="费用(元)" align="center"></el-table-column>
      <el-table-column prop="payerName" label="付方" align="center" width="120"></el-table-column>

      <el-table-column prop="photos" label="图片" align="center" width="100" key="tupian">
        <template slot-scope="scope">
          <div v-if="!scope.row.photos">--</div>
          <el-image
            v-else
            :src="fileUrl + scope.row.photos"
            :preview-src-list="[fileUrl + scope.row.photos]"
            fit="contain"
            style="
                width: 50px;
                height: 50px;"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column
        v-if="isBM && isPay == 0"
        label="操作"
        fixed="right"
        align="center"
        key="caozuo"
        width="80"
      >
        <template slot-scope="scope">
          <div
            v-show="scope.row.isPay == '0' && scope.row.amount != 0"
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="payment(scope.row)"
          >
            缴费
          </div>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && resList.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>

    <!-- 是否确定缴费 -->
    <van-action-sheet
      v-model="showConfirmPay"
      :actions="[{ name: '确定缴费', color: '#1788fb' }]"
      @select="payFee"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import { eduTypeList, eduResourceAmountPageQuery, eduResourceAmountPay } from '@/assets/js/api';

export default {
  name: 'ResFee',
  props: {
    identity: String,
  },
  components: {
    basicSelect: () => import('@/components/BasicSelect'),
  },
  computed: {
    isBM() {
      return this.identity === 'bm';
    },
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    downUrl() {
      return this.$store.state.downUrl;
    },
  },
  watch: {
    priceType() {
      this.getList(1);
    },
  },
  data() {
    return {
      showConfirmPay: false,
      total: 1,
      limit: 10,
      currentPage: 1,
      resList: [], //申请列表
      row: {},
      priceType: '1',
      loading: false,
      resTypeList: [],
      isPay: '0',
      payName: '未支付',
      payTypeList: [
        { name: '未支付', id: '0' },
        { name: '已支付', id: '1' },
      ],
      tabs: [
        { text: '租金', value: '1' },
        { text: '逾期租金', value: '2' },
        { text: '水表', value: '3' },
        { text: '电表', value: '4' },
      ],
      tableHeight: 0,
      finishTable: false,
      keyword: '',
    };
  },
  methods: {
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择支付状态
    choosePayType(item) {
      this.payName = item.name;
      this.isPay = item.id;
      this.getList(1);
    },
    // 批量导出
    downTemp() {
      const filter = {
        name: this.keyword || undefined,
        isPay: this.isPay,
        priceType: this.priceType,
      };

      this.$toast.loading({
        message: '导出中...',
        forbidClick: true,
        duration: 0,
      });
      let url = '/eduResourceAmount/exportAmount';
      let fileName = this.isPay == 0 ? '未支付' : '已支付';
      switch (this.priceType) {
        case '1':
          fileName += '租金';
          break;
        case '2':
          fileName += '逾期租金';
          break;
        case '3':
          fileName += '水费';
          break;
        case '4':
          fileName += '电费';
          break;
        default:
          break;
      }
      this.util.exportFile(url, false, filter, fileName, 'xlsx');
      this.$toast.clear();
    },
    //下载转账单
    downForm() {
      this.util
        .postAjax({
          code: this.global.code,
          url: '/rules/findByCode',
          data: {
            code: 'BILLTEMPLATEID',
          },
        })
        .then(res => {
          if (res.success == true) {
            window.open(this.downUrl + res.item.rulevalue, '_blank');
          }
        });
    },
    //缴费
    payment(row) {
      this.row = row;
      this.showConfirmPay = true;
    },
    payFee() {
      this.$toast.loading({
        message: '缴费中...',
        forbidClick: true,
        duration: 0,
      });
      eduResourceAmountPay(this.row.id)
        .then(res => {
          if (res && res.success === true) {
            this.$toast.success({ message: '缴费成功' });
            this.showConfirmPay = false;
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
    //获取资源类型列表
    getResTypeList() {
      this.loading = true;
      eduTypeList({})
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.resTypeList = res.data;
            this.getList(this.currentPage);
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.resList = this.resList.concat(list);
        this.finishTable = this.resList.length == this.total;
      });
    },
    //获取列表
    getList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const filter = {
          resName: this.keyword || undefined,
          isPay: this.isPay,
          priceType: this.priceType,
        };

        const params = {
          page: page || this.currentPage,
          limit: this.limit,
          filter,
        };
        eduResourceAmountPageQuery(params)
          .then(res => {
            this.loading = false;
            if (res && res.success === true) {
              let list = res.data || [];
              this.currentPage = 1;
              this.total = res.total;

              list.forEach(r => {
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
                this.$refs.multipleTable.doLayout();
              });
              resolve(list);
            }
          })
          .catch(e => {
            this.loading = false;
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
        let tableTabsHeigth = this.$refs.tableTabs.offsetHeight || 0;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight || 0;
        this.tableHeight =
          domHeight -
          navBarHeight -
          tabsHeight -
          searchBarHeight -
          tableTabsHeigth -
          tabBarHeight -
          20;
      });
    },
  },
  created() {
    this.getResTypeList();
  },
  mounted() {
    // 设置表格高度
    this.setTableHeight();
  },
};
</script>

<style scoped lang="scss"></style>
