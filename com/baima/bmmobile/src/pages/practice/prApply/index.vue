<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入班级名称" @search="onSearch" />
      <div class="select-group">
        <basic-select-calendar
          style="width: 50%"
          title="申请日期"
          :value="applytimeFormat"
          @chooseDate="chooseApplytime"
        />
        <basic-select
          style="width: 50%"
          title="状态"
          :value="applystatusname"
          :list="processStatus"
          optionName="name"
          optionValue="id"
          top="145px"
          @chooseItem="chooseStatus"
        />
      </div>
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
        style="width:50%;"
        :class="{'active': activeTableTab === item.value}"
        v-for="item in tabs"
        :key="item.value"
        @click="activeTableTab = item.value;tableData = [];"
      >{{item.text}}</li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight">
      <el-table-column prop="orgname" label="学院名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="classname" label="班级名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="leadername" label="负责教师" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prpersonnum" label="实习人数" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="prstarttime"
        label="实习日期"
        align="center"
        :formatter="common.dateFormatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="applystatus"
        label="审批进度"
        align="center"
        :formatter="common.processFormatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="110" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.applystatus == 0"
            style="color:#faac16;padding:0 5px;font-weight:bold"
            @click="toEdit(scope.row)"
          >编辑</span>
          <span
            v-if="scope.row.applystatus != 0"
            style="color:#00b09b;padding:0 5px;font-weight:bold"
            @click="toDetail(scope.row)"
          >详情</span>
          <span
            v-if="scope.row.applystatus == 1 || scope.row.applystatus == 2"
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="reCall(scope.row)"
          >撤回</span>
          <span
            v-if="scope.row.applystatus === '3'"
            style="color:#814ef5;padding:0 5px;font-weight:bold"
            @click="common.downloadApplyForm(scope.row.id)"
          >申请表</span>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>
    <!-- 新增申请 -->
    <div class="btns">
      <van-button icon="plus" round type="primary" @click="toApply">新增申请</van-button>
    </div>

    <!-- 是否确定撤回 -->
    <van-action-sheet
      v-model="showConfirmRecall"
      :actions="[{name: '确定撤回', color: '#fe3e61'}]"
      @select="confirmRecall"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import BasicSelectCalendar from "../../../components/BasicSelectCalendar";
import BasicSelect from "../../../components/BasicSelect";
export default {
  components: {
    BasicSelectCalendar,
    BasicSelect
  },
  data() {
    return {
      keyword: "",
      applytime: "",
      applytimePopup: false,
      applytimeFormat: "",
      applystatus: "",
      applystatusname: "",
      activeTableTab: "1",
      tabs: [
        { text: "全部", value: "1" },
        { text: "已提交", value: "3" }
      ],
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
      recallRow: {},
      showConfirmRecall: false
    };
  },
  computed: {
    processStatus() {
      let data = [{ name: "全部", id: "" }];
      return data.concat(this.$store.state.processStatus);
    }
  },
  watch: {
    applytime() {
      this.getList(1);
    },
    applystatus() {
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
    // 选择日期
    chooseApplytime(date) {
      if (date) {
        this.applytimeFormat = this.common.formatTime(
          date.getTime(),
          "YYYY.MM.DD"
        );
        this.applytime = this.common.formatTime(
          date.getTime(),
          "YYYYMMDD000000"
        );
      } else {
        this.applytimeFormat = "";
        this.applytime = "";
      }
      this.applytimePopup = false;
    },
    // 选择状态
    chooseStatus(item) {
      this.applystatus = item.id;
      this.applystatusname = item.name;
    },
    // 申请页面
    toApply() {
      this.$router.push("/practice/apply");
    },
    // 详情
    toDetail(row) {
      this.$router.push("/practice/detail/" + row.id);
    },
    // 编辑
    toEdit(row) {
      this.$router.push("/practice/edit/" + row.id);
    },
    // 撤回
    reCall(row) {
      this.recallRow = row;
      this.showConfirmRecall = true;
    },
    // 确认撤回
    confirmRecall() {
      this.$toast.loading({
        message: "撤回中...",
        forbidClick: true,
        duration: 0
      });
      this.showConfirmRecall = false;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/prapply/saveEvent",
          isRep: true,
          data: {
            eventtype: 2,
            applyid: this.recallRow.id
          }
        })
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast.success("撤回成功");
            this.getList(1);
          } else {
            this.$toast.fail("撤回失败" + "\n" + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("撤回失败" + "\n" + err);
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
          applytype: this.activeTableTab
        };
        if(this.applytime) {
          params.applytime = this.applytime
        }
        if(this.applystatus) {
          params.applystatus = this.applystatus
        }
        if(this.keyword) {
          params.classname = this.keyword
        }
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: "/prapply/pageList?date=" + new Date().getTime(),
            data: {
              params: JSON.stringify(params)
            }
          })
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let applyerList = res.item ? res.item.applyerList || {} : {};
              let list = applyerList.list || [];
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
        let domHeight = document.documentElement.clientHeight || 0;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight || 0;
        let tabsHeight = this.$parent.$refs.tabs
          ? this.$parent.$refs.tabs.$el.offsetHeight
          : 0 || 0;
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
    }
  },
  created() {
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