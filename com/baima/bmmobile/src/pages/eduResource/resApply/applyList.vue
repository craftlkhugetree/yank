<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <basic-select
        title="选择状态"
        :value="applystatusName"
        :list="resApplyStatus"
        optionName="name"
        optionValue="id"
        top="188px"
        @chooseItem="chooseStatus"
      />
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;margin-top:10px;" :height="tableHeight">
      <el-table-column
        prop="usetype"
        label="申请类型"
        align="center"
        show-overflow-tooltip
        :formatter="common.resApplyTypeFormatter"
      ></el-table-column>
      <el-table-column prop="typename" label="资源类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rescodes" label="资源编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="projectname" label="项目名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="usecycle" label="时长" align="center" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{scope.row.usecycle || "--"}}{{common.chargecycleFormatter(scope.row.chargecycle)}}</template>
      </el-table-column>
      <el-table-column
        prop="applystatus"
        label="审批状态"
        align="center"
        show-overflow-tooltip
        :formatter="common.processFormatter"
      ></el-table-column>
      <el-table-column
        prop="actionstatus"
        label="状态"
        align="center"
        :formatter="common.applyLiveStatusFormatter"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">详情</span>
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
import BasicSelect from "../../../components/BasicSelect";
export default {
  components: {
    BasicSelect
  },
  data() {
    return {
      keyword: "",
      applystatusName: "",
      applystatus: "",
      currentPage: 1,
      limit: 5,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false
    };
  },
  computed: {
    resApplyStatus() {
      let data = [{ name: "全部", id: "" }];
      return data.concat(this.$store.state.resApplyStatus);
    }
  },
  watch: {
    applystatus() {
      this.getList(1);
    }
  },
  methods: {
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择状态
    chooseStatus(item) {
      this.applystatus = item.id;
      this.applystatusName = item.name;
    },
    // 详情页面
    toDetail(row) {
      this.$router.push("/edures/res-apply/detail/" + row.id);
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
        let params = {
                page: page,
                limit: this.limit
              }
        if(this.keyword) {
          params.rescode = this.keyword
        }
        if(this.applystatus) {
          params.applystatus = this.applystatus
        }
        this.loading = true;
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: "/spapply/pageList?date=" + new Date().getTime(),
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
              this.$toast.fail("获取数据失败" + '\n' + res.message);
              reject(res);
            }
          })
          .catch(err => {
            this.loading = false;
            // this.finishTable = true;
            // this.$toast.fail("获取数据失败" + '\n' + err);
            reject(err);
          });
      });
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight;
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight;
        let searchBarHeight = this.$refs.searchBar.offsetHeight;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight;
        this.tableHeight =
          domHeight -
          navBarHeight -
          tabsHeight -
          searchBarHeight -
          tabBarHeight -
          10;
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