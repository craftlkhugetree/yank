<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <basic-select
        title="资源类型"
        :value="sprestypename"
        :list="sprestTypeList"
        optionName="name"
        optionValue="id"
        top="188px"
        @chooseItem="chooseSprestType"
      />
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
        :class="{'active': activeTableTab === item.value}"
        v-for="item in tabs"
        :key="item.value"
        @click="activeTableTab = item.value;tableData = [];"
      >{{item.text}}</li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight">
      <el-table-column prop="typename" label="资源类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rescodes" label="资源编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orgname" label="学院名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="applyername" label="申请人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="problemnote" label="问题描述" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="files" label="图片" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="viewPics(scope.row)">查看</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="repairstatus"
        label="维修状态"
        align="center"
        show-overflow-tooltip
        :formatter="common.repairStateFormatter"
      ></el-table-column>
      <el-table-column
        prop="applytime"
        label="报修时间"
        align="center"
        show-overflow-tooltip
        :formatter="common.dateFormatter"
      ></el-table-column>
      <el-table-column label="操作" v-if="!applyerid" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.repairstatus === '1'"
            style="color:#00b09b;padding:0 5px;font-weight:bold"
            @click="doRepair(scope.row)"
          >维修</span>
          <span v-else>已维修</span>
        </template>
      </el-table-column>

      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>
    <!-- 查看图片 -->
    <van-image-preview v-model="showPics" :images="images"></van-image-preview>
    <!-- 是否确定维修 -->
    <van-action-sheet
      v-model="showConfirmRepair"
      :actions="[{name: '确定维修', color: '#fe3e61'}]"
      @select="confirmRepair"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import BasicSelectCalendar from "../../../components/BasicSelectCalendar";
import BasicSelect from "../../../components/BasicSelect";
export default {
  components: {
    BasicSelect,
    BasicSelectCalendar
  },
  data() {
    return {
      keyword: "",
      sprestypeid: "",
      sprestypename: "",
      sprestTypeList: [],
      activeTableTab: "1",
      tabs: [
        { text: "全部", value: "0" },
        { text: "待维修", value: "1" },
        { text: "已维修", value: "2" }
      ],
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
      showPics: false,
      images: [],
      showConfirmRepair: false,
      curRow: ""
    };
  },
  props: {
    applyerid: String
  },
  watch: {
    sprestypeid() {
      this.getList(1);
    },
    activeTableTab() {
      this.getList(1);
    }
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    }
  },
  methods: {
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择资源类型
    chooseSprestType(item) {
      this.sprestypeid = item.id;
      this.sprestypename = item.name;
    },
    // 查看图片
    viewPics(row) {
      this.showPics = true;
      this.images = row.files.map(i => this.fileUrl + i.ID);
    },
    // 维修
    doRepair(row) {
      this.showConfirmRepair = true;
      this.curRow = row;
    },
    // 确认维修
    confirmRepair() {
      this.$toast.loading({
        message: "提交中...",
        forbidClick: true,
        duration: 0
      });
      this.showConfirmRepair = false;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/sprepair/repair",
          data: {
            id: this.curRow.id
          }
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success("提交成功");
            this.getList(1);
          } else {
            this.$toast.fail("提交失败" + "\n" + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("提交失败" + "\n" + err);
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
          repairstatus: this.activeTableTab
        };
        if(this.keyword) {
          params.rescode = this.keyword
        }
        if(this.sprestypeid) {
          params.sprestypeid = this.sprestypeid
        }
        if(this.applyerid) {
          params.applyerid = this.applyerid
        }
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: "/sprepair/pageList?date=" + new Date().getTime(),
            data: {
              params: JSON.stringify(params)
            }
          })
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let list = res.items || [];
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
        let domHeight = document.documentElement.clientHeight;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight;
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight;
        let searchBarHeight = this.$refs.searchBar.offsetHeight;
        let tableTabsHeigth = this.$refs.tableTabs.offsetHeight;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight;
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
    // 获取资源类型列表
    this.common
      .getEduResTypeList()
      .then(res => {
        this.sprestTypeList = res;
        this.sprestTypeList.unshift({
          name: "全部类型",
          id: ""
        });
      })
      .catch(() => {});
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