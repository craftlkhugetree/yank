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

    <!-- tab标签页 -->
    <div class="tabs more-tabs" ref="tableTabs">
      <li
        class="ellipsis"
        :class="{ active: activeName === item.id }"
        v-for="(item, index) in tabs"
        :key="item.id"
        @click="changeTab(item, index)"
      >
        {{ item.name }}
      </li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-top:10px;"
      :height="tableHeight"
      ref="checkinTable"
    >
      <!-- <el-table-column
        type="selection"
        width="55"
        align="center"
        fixed="left"
        :selectable="selectable"
      ></el-table-column> -->
      <el-table-column prop="typeName" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="resName" label="资源编号" align="center"></el-table-column>

      <el-table-column
        prop="area"
        label="面积(㎡)"
        align="center"
        v-if="activeName == 2"
        key="mianji"
      ></el-table-column>

      <el-table-column
        prop="price"
        :label="'单价'"
        align="center"
        width="150"
        v-if="activeName == 2"
        key="danjjia"
      >
        <template slot-scope="scope">
          {{
            common.moneyFormatter('', '', scope.row.price) +
              ((scope.row.billingCycle && scope.row.billingMethod) ||
              (scope.row.eduType &&
                scope.row.eduType.billingCycle &&
                scope.row.eduType.billingMethod)
                ? '元/' + scope.row.chargecycle + '/' + scope.row.ct2
                : '元/' + '--' + '/' + '--')
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="资源状态"
        align="center"
        v-if="activeName == 2"
        key="zyzt"
      >
        <template slot-scope="scope">
          <span :class="scope.row.status == 0 ? 'status-grey' : 'status-blue'">
            {{ common.resStateFormatterJump('', '', scope.row.status) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="liveinfo" label="入驻信息" align="center" v-if="activeName != 2">
        <el-table-column
          prop="liveinfo.orgName"
          label="学院名称"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.projectName"
          label="项目名称"
          width="200"
          show-overflow-tooltip
        >
          <!-- <template slot-scope="scope">
              <el-tooltip v-if="scope.row.liveinfo.projectname" class="item" effect="dark" :content="scope.row.liveinfo.projectname" placement="right">
                <div style="width: 100%;" class="ellipsis">{{scope.row.liveinfo.projectname}}</div>
              </el-tooltip>
            </template>-->
        </el-table-column>
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
          label="退租时间"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            {{
              (scope.row.expectCheckoutTime &&
                common.formatTime(scope.row.expectCheckoutTime, 'yyyy-MM-dd HH:mm:ss')) ||
                ''
            }}
          </template>
        </el-table-column>

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
                scope.row.liveinfo &&
                (scope.row.liveinfo.limitday || scope.row.liveinfo.limitday == 0)
                  ? scope.row.liveinfo.limitday
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column prop="useState" label="入驻状态" align="center" v-if="activeName == 1">
        <template slot-scope="scope">
          <span :class="scope.row.useState == 1 ? 'status-blue' : 'status-grey'">
            {{ scope.row.useState == 1 ? '占用' : '空闲' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="150" align="center" key="caozuo">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">
            详情
          </span>
          <span
            style="color:#047184;padding:0 5px;font-weight:bold"
            @click="changeStatus('1', 'single', scope.row.id)"
            v-if="scope.row.status == 0 && scope.row.useState == 0"
          >
            开放
          </span>
          <span
            style="color:#047184;padding:0 5px;font-weight:bold"
            @click="changeStatus('2', 'single', scope.row.id)"
            v-if="scope.row.status == 1 && scope.row.useState == 0"
          >
            关闭
          </span>
          <span
            v-if="scope.row.useState == '1'"
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="changeStatus('3', 'single', scope.row.id)"
          >
            强制退租
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
    <!-- 是否确定关闭 -->
    <van-action-sheet
      v-model="showConfirmCheckOut"
      :actions="[{ name: '确定关闭', color: '#fe3e61' }]"
      @select="confirmCheckOut"
      cancel-text="取消"
    />
    <confirm-dialog
      :diagTitle="diagTitle"
      :diagBody="diagBody"
      :dVisible="dVisible"
      :hasCancel="true"
      v-if="dVisible"
      @confirm="doSubmit"
      @dropdown="dVisible = false"
    ></confirm-dialog>
  </div>
</template>

<script>
import BasicSelect from '../../../components/BasicSelect';
// import BasicSelectOrg from "../../../components/BasicSelectOrg";
import {
  eduTypeList,
  eduResourceResourceCheckList,
  batchOpen,
  batchClose,
  forceCheckoutBatch,
} from '@/assets/js/api';
export default {
  name: 'CheckinList',
  components: {
    BasicSelect,
    confirmDialog: () => import('@/components/confirmDialog'),
    // BasicSelectOrg
  },
  data() {
    return {
      showConfirmCheckOut: false,
      dVisible: false,
      diagTitle: '',
      diagBody: '',
      loading: false,
      total: 0,
      currentPage: 1,
      limit: 10,
      tableData: [],
      finishTable: false,
      resTypeList: [],
      eduTypeName: '',
      eduTypeId: '',
      activeName: '1',
      tabs: [
        { name: '全部', id: '1' },
        { name: '空闲', id: '2' },
        { name: '占用', id: '3' },
      ],
      keyword: '',
      showOrgPicker: false,
      tableHeight: 0,
      selectedIds: '',
      ids: '',
      type: '',
    };
  },
  computed: {},
  methods: {
    // 关闭
    confirmCheckOut() {
      this.changeStatusInner(2, this.type, this.ids);
    },
    // 详情页面
    toDetail(row) {
      this.$router.push(`/edures-staff/res-list/${row.eduTypeId}/detail-res/${row.id}/${'manage'}`);
    },

    //资源状态开放和关闭
    changeStatus(resstatus, num, id) {
      if (resstatus == 2) {
        this.ids = id;
        this.type = num;
        this.showConfirmCheckOut = true;
      } else if (resstatus == 1) {
        this.changeStatusInner(resstatus, num, id);
      } else if (resstatus == 3) {
        let ids = '';
        switch (num) {
          case 'more':
            ids = this.selectedIds;
            break;
          case 'single':
            ids = id + '';
            break;
        }
        this.ids = ids;
        if (!this.ids) {
          this.$toast.fail({
            message: '请先选择资源',
          });
          return;
        }
        const idArr = ids.split(',');
        let resArr = this.tableData.filter(r => idArr.includes(r.id + ''));
        let str = '';
        resArr.forEach(r => {
          str += `#${r.resName},${r.typeName || ''} `;
        });
        this.diagBody = `确定要强制退租资源 ${str} 吗？`;
        this.diagTitle = '确认要强制退租吗？';
        this.dVisible = true;
      }
    },
    // 强制退租,对话框确定按钮
    doSubmit() {
      forceCheckoutBatch({ ids: this.ids }).then(res => {
        if (res.success === true) {
          this.$toast.success({
            message: '强制退租完成',
          });
          this.dVisible = false;
          this.getList(this.currentPage);
        } else {
          this.$toast.fail({
            message: res.message,
          });
        }
      });
    },
    // 表格操作
    changeStatusInner(resstatus, num, id) {
      let ids = '';
      switch (num) {
        case 'more':
          ids = this.selectedIds;
          break;
        case 'single':
          ids = id;
          break;
      }
      const batchOp = resstatus == 1 ? batchOpen : batchClose;
      if (!ids) {
        this.$toast.fail({ message: '请先选择资源' });
      } else {
        this.$toast.loading({
          message: '...',
          forbidClick: true,
          duration: 0,
        });
        batchOp({ ids }).then(res => {
          if (res.success == true) {
            this.getList(this.currentPage);

            if (res.errorList && res.errorList.length > 0) {
              let arr = [];
              res.errorList.forEach(v => {
                arr.push(v.name);
              });
              arr = arr.join(',');
              let text = resstatus == '1' ? '资源已开放' : '资源已关闭';
              this.$toast.success({
                message: '除' + arr + '资源外,其它资源均' + text,
              });
            } else {
              this.$toast.success({
                message: resstatus == '1' ? '资源已开放' : '资源已关闭',
              });

              this.showConfirmCheckOut = false;
            }
          } else {
            this.$toast.fail({
              message: res.data.message,
            });
          }
        });
        this.$toast.clear();
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择类型
    chooseResType(item) {
      this.eduTypeName = item.name;
      this.eduTypeId = item.id;
      this.getList(1);
    },
    // 切换tab
    changeTab(item, index) {
      if(this.activeName === item.id) return
      this.activeName = item.id;
      this.scrollToTab(index);
      sessionStorage.setItem('curEduResTab', this.activeName);
      this.getList(1);
    },
    // 滚动Tab
    scrollToTab(index) {
      let clientWidth = document.documentElement.offsetWidth;
      let tabs = this.$refs.tableTabs;
      let curLi = tabs.getElementsByTagName('li')[index];
      let curWidth = curLi.offsetWidth + curLi.offsetLeft;
      if (curWidth > clientWidth - 50 && curLi.offsetLeft >= tabs.scrollLeft + 50) {
        // 当前tab左侧距离+自身宽度 > 屏幕宽度 并且 当前tab左侧距离 > tabs滚动距离 时，tabs向左滚动
        tabs.scrollLeft += curLi.offsetWidth;
      } else if (curLi.offsetLeft <= tabs.scrollLeft + 50) {
        // 当前tab左侧距离 < tabs滚动距离，tabs向左滚动
        tabs.scrollLeft -= curLi.offsetWidth;
      }
      sessionStorage.setItem('tabScroll', tabs.scrollLeft);
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight || 0;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight || 0;
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight || 0;
        let searchBarHeight = this.$refs.searchBar.offsetHeight || 0;
        let tableTabsHeight = this.$refs.tableTabs.offsetHeight || 0;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight || 0;
        this.tableHeight =
          domHeight -
          navBarHeight -
          tabsHeight -
          searchBarHeight -
          tableTabsHeight -
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
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
        this.finishTable = this.tableData.length === this.total;
      });
    },
    //获取列表
    getList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const filter = {
          name: this.keyword || undefined,
          eduTypeId: this.eduTypeId || undefined,
        };
        if (1 == this.activeName) {
          // filter.allNode = 'BM'
        } else if (2 == this.activeName) {
          filter.useState = 0;
        } else if (3 == this.activeName) {
          filter.useState = 1;
        }
        const params = {
          page: page || this.currentPage,
          limit: this.limit,
          filter,
        };
        eduResourceResourceCheckList(params)
          .then(res => {
            this.loading = false;
            if (res.success === true) {
              this.total = res.total;
              this.currentPage = page;
              let list = res.data || [];

              list.forEach(r => {
                const obj = this.resTypeList.find(t => t.id === r.eduTypeId) || {};
                r.typeName = obj.name || '';
                r.resName = r.name;

                let chargecycle = (r.billingCycle || (r.eduType && r.eduType.billingCycle)) + '';
                let chargetype = (r.billingMethod || (r.eduType && r.eduType.billingMethod)) + '';
                this.common.chargecycleFormatter(chargecycle, r);
                this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');

                r.liveinfo = r;
                if (page === 1) {
                  this.tableData = list;
                }
                this.finishTable = list.length < this.limit || list.length === res.total;
                this.$refs.checkinTable.doLayout();
                resolve(list);
              });
            } else {
              this.$toast.fail('获取数据失败' + '\n' + res.message);
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
            this.loading = false;
          });
      });
    },
  },
  created() {
    this.getResTypeList();
  },
  mounted() {
    this.setTableHeight();
  },
};
</script>

<style lang="scss" scoped></style>
