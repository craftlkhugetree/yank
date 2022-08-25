<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入班级名称" @search="onSearch" />
      <!-- <basic-select
        title="学院"
        :value="orgName"
        :list="orgList"
        optionName="name"
        optionValue="id"
        top="188px"
        @chooseItem="chooseOrg"
      />-->
      <basic-select-calendar
        title="申请日期"
        :value="applytimeFormat"
        @chooseDate="chooseApplytime"
      />
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs" id="prAuditTabs">
      <li
        :class="{ active: activeTableTab === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @click="changeTab(item)"
      >
        {{ item.text }}
      </li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight" ref="multipleTable">
      <el-table-column
        prop="orgname"
        label="学院名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="classname"
        label="班级名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="leadername"
        label="负责教师"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="prpersonnum"
        label="实习人数"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="prstarttime"
        label="实习日期"
        align="center"
        :formatter="common.dateFormatter"
        width="150"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        label="申请表"
        align="center"
        show-overflow-tooltip
        v-if="activeTableTab == '3'"
        width="150"
      >
        <!-- <template slot-scope="scope" v-if="scope.row.applystatus === '3' && operDev === 'bm'"> -->
        <template slot-scope="scope">
          <img :src="require('st@tic/imgs/attachment-icon.png')" style="width:14px; height:14px;" />
          <span
            style="color:#00b09b;padding:0 5px;font-weight:bold"
            @click.stop="downloadForm(scope.row)"
          >
            <!-- @click.stop="common.downloadApplyForm(scope.row.id)" -->
            申请表
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="学生信息表"
        align="center"
        v-if="activeTableTab == '3'"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="scope" v-if="scope.row.students && scope.row.students.length">
          <img :src="require('st@tic/imgs/attachment-icon.png')" style="width:14px; height:14px;" />
          <span
            style="color:#00b09b;padding:0 5px;font-weight:bold"
            @click.stop="downStd(scope.row)"
          >
            学生信息表
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="applystatus"
        label="审批进度"
        align="center"
        :formatter="common.processFormatterPractice"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">
            详情
          </span>
          <span
            v-if="operDev === 'bm' && scope.row.applystatus != '3'"
            style="color:#faac16;padding:0 5px;font-weight:bold"
            @click="toEdit(scope.row)"
          >
            编辑
          </span>
          <span
            v-if="
              (scope.row.applystatus === '1' && operDev === 'leader') ||
                (scope.row.applystatus == '3' && isRearService) ||
                (scope.row.applystatus === '2' && operDev === 'bm')
            "
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="toAudit(scope.row)"
          >
            审批
          </span>
          <!-- <span
            v-if="scope.row.applystatus === '3' && operDev === 'bm'"
            style="color:#814ef5;padding:0 5px;font-weight:bold"
            @click="common.downloadApplyForm(scope.row.id)"
          >申请表</span> -->
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>
    <div id="tmpTable" v-show="isDomShow">
      <h2>本科生实习申请</h2>
      <table border="1" class="normal-table">
        <thead>
          <tr>
            <th v-for="(h, i) in tableTitle" :key="i">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tr, i) in studentList" :key="tr.idcard + i" class="trClassFlag">
            <td>{{ tr.classname }}</td>
            <td>{{ tr.username }}</td>
            <td>{{ tr.userid }}</td>
            <td>{{ tr.idcard }}</td>
            <td>{{ tr.sex }}</td>
            <td>{{ tr.national }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <student-apply
      style="margin-left: -2000px"
      v-show="stdApply"
      :form="resDDetail"
    ></student-apply>
  </div>
</template>

<script>
import BasicSelectCalendar from '../../../components/BasicSelectCalendar';
import BasicSelect from '../../../components/BasicSelect';
import { roleId } from '@/assets/js/options';
export default {
  components: {
    BasicSelectCalendar,
    BasicSelect,
    studentApply: () => import('@/components/stdApplyInfo'),
  },
  computed: {
    curRole() {
      return sessionStorage.getItem('curRole') || '';
    },
    isRearService() {
      return roleId.hq === this.curRole;
    },
  },
  data() {
    return {
      stdApply: false,
      isDomShow: false,
      tableTitle: ['班级', '姓名', '学号', '身份证号', '性别', '民族'],
      studentList: [],
      keyword: '',
      orgId: '',
      orgName: '',
      applytime: '',
      applytimePopup: false,
      applytimeFormat: '',
      activeTableTab: '2',
      tabs:
        this.operDev === 'bm'
          ? [
              // { text: "全部", value: "1" },
              { text: '待审批', value: '2' },
              { text: '已审批', value: '3' },
            ]
          : [
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
      resDDetail: {},
    };
  },
  props: {
    operDev: String, // 审批单位：单位领导leader、基地bm
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
    applytime() {
      this.getList(1);
    },
    activeTableTab() {
      this.getList(1);
    },
  },
  methods: {
    downloadForm(row) {
      this.resDDetail = row;
      //开始：早中晚餐转换
      let eatstarttype = this.resDDetail.eatstarttype;
      if (eatstarttype) {
        switch (eatstarttype) {
          case '1':
            this.resDDetail.eatstarttype = '含早、中、晚餐';
            break;
          case '2':
            this.resDDetail.eatstarttype = '含中、晚餐';
            break;
          case '3':
            this.resDDetail.eatstarttype = '含晚餐';
        }
      }
      //结束：早中晚餐转换
      let eatendtype = this.resDDetail.eatendtype;
      if (eatendtype) {
        switch (eatendtype) {
          case '1':
            this.resDDetail.eatendtype = '含早餐';
            break;
          case '2':
            this.resDDetail.eatendtype = '含早、中餐';
            break;
          case '3':
            this.resDDetail.eatendtype = '含早、中、晚餐';
        }
      }
      this.stdApply = true;
      let that = this;
      this.$toast.loading({
        message: '下载中...',
        forbidClick: true,
        duration: 0,
      });
      // this.common.outPutPdfFn(that, 'stdApply', 'normal-table', row.classname + '申请表');
      this.$nextTick(() => that.common.transToPdf(row.classname + '申请表', 'stdApply', that));
    },
    changeTab(item) {
      this.activeTableTab = item.value;
      this.tableData = [];
    },
    // 下载学生信息表
    downStd(row) {
      let stdList = row.students || [];
      stdList.forEach(s => {
        s.sex = s.sex == '1' ? '男' : '女';
      });
      this.studentList = stdList;
      // this.studentList = stdList.concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList).concat(stdList)
      this.isDomShow = true;
      this.$toast.loading({
        message: '下载中...',
        forbidClick: true,
        duration: 0,
      });
      // this.$nextTick(() => this.common.transToPdf('学生信息表', 'tmpTable', this));
      this.common.outPutPdfFn(this, 'tmpTable', 'trClassFlag', '学生信息表', true);
    },
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择学院
    chooseOrg(item) {
      this.orgId = item.id;
      this.orgName = item.name;
    },
    // 选择日期
    chooseApplytime(date) {
      if (date) {
        this.applytimeFormat = this.common.formatTime(date.getTime(), 'YYYY.MM.DD');
        this.applytime = this.common.formatTime(date.getTime(), 'YYYYMMDD000000');
      } else {
        this.applytimeFormat = '';
        this.applytime = '';
      }
      this.applytimePopup = false;
    },
    // 详情页面
    toDetail(row) {
      this.$router.push('/practice/detail/' + row.id);
    },
    // 编辑页面
    toEdit(row) {
      this.$router.push(`/practice-audit-${this.operDev}/edit/` + row.id);
    },
    // 审批页面
    toAudit(row) {
      this.$router.push(`/practice-audit-${this.operDev}/audit/` + row.id);
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
        if (this.keyword) {
          params.classname = this.keyword;
        }
        if (this.applytime) {
          params.applytime = this.applytime;
        }
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: '/prapply/pageList?date=' + new Date().getTime(),
            data: {
              params: JSON.stringify(params),
            },
          })
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let leaderList = res.item ? res.item.leaderList || {} : {};
              let bmList = res.item
                ? (this.isRearService ? res.item.hqList : res.item.bmList) || {}
                : {};
              let list = this.operDev === 'leader' ? leaderList.list || [] : bmList.list || [];
              if (page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.limit ? true : false;
              this.currentPage = page;
              this.$nextTick(() => {
                this.$refs.multipleTable.doLayout();
              });
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
        let tabsHeight = this.$parent.$refs.tabs
          ? this.$parent.$refs.tabs.$el.offsetHeight || 0
          : 0;
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
    setWidth() {
      let dom = document.getElementById('prAuditTabs');
      if (this.operDev === 'bm' && dom) {
        let nodes = dom.childNodes;
        var arr = Array.prototype.slice.call(nodes, 0);
        let li = (arr && arr.filter(n => n.nodeName === 'LI')) || [];
        li.forEach(l => {
          l.style.width = '50%';
        });
      }
    },
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
    this.setWidth();
  },
};
</script>

<style lang="scss" scoped>
#tmpTable {
  padding: 60px 20px;
  width: 800px;
  h2 {
    font-weight: bolder;
    font-size: 100%;
    margin: 20px;
    text-align: center;
  }
  table {
    width: 100%;
    margin: 0 auto;
  }
  th,
  td {
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    border: 1px solid black;
    padding: 8px;
    font-size: 60%;
  }
}
</style>