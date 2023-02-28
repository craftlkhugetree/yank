<template>
  <div class="main-div">
    <div v-if="activeTab == '1'" class="table">
      <!---------------------------- 黑名单表格 ---------------------------->
      <el-table
        :data="tableData"
        class="table_class"
        header-row-class-name="tableheader"
        v-loading="loading"
        stripe
        ref="mainDiv"
        :height="tableHeight"
      >
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column
          prop="userId"
          sortable
          label="工号"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="userName"
          sortable
          label="姓名"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          width="180"
          show-overflow-tooltip
          prop="createTime"
          sortable
          label="黑名单时间"
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column prop="SEX" label="黑名单理由" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <p v-if="scope.row.opreaterType == '2'" class="text_m">
              {{ scope.row.reason || '--' }}
            </p>
            <span
              v-else
              style="color: #1788fb; padding: 0; font-weight: bold"
              @click.stop="selectRows(scope.row)"
            >
              查看违规记录
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <span
              @click.stop="erase(scope.row)"
              style="color: #1788fb; padding: 0; font-weight: bold"
            >
              清除
            </span>
          </template>
        </el-table-column>
        <!-- 无限加载 -->
        <div slot="append">
          <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
          <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
          <p v-show="finishTable && tableData.length" style="cursor: none">到底啦</p>
        </div>
      </el-table>
    </div>
    <div v-else class="table">
      <!---------------------------- 表格 ---------------------------->
      <el-table
        :data="tableData2"
        class="table_class"
        header-row-class-name="tableheader"
        v-loading="loading"
        stripe
        ref="mainDiv"
        :height="tableHeight"
      >
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="userId"
          sortable
          label="工号"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="userName"
          sortable
          label="姓名"
        ></el-table-column>
        <el-table-column
          width="180"
          show-overflow-tooltip
          prop="createTime"
          sortable
          label="违规时间"
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column prop="reason" label="违规内容" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <p class="text_m">{{ scope.row.reason || '--' }}</p>
          </template>
        </el-table-column>
        <div slot="append">
          <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
          <p v-show="!finishTable && !loading" @click="getMoreData2">点击加载更多</p>
          <p v-show="finishTable && tableData2.length" style="cursor: none">到底啦</p>
        </div>
      </el-table>
      <!---------------------------- 分页 ---------------------------->
    </div>
    <div class="btns" v-if="activeTab == '1'">
      <van-button icon="plus" round plain @click="openRuleDrawer">黑名单规则</van-button>
      <van-button icon="plus" round type="primary" @click="openBlackDrawer">新增黑名单</van-button>
    </div>
    <van-action-sheet
      v-model="showConfirmDelete"
      :actions="[{ name: '确定删除', color: '#fe3e61' }]"
      @select="confirmDelete"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import {
  apBlacklistPageQuery,
  apBlacklistDelete,
  apViolationRecordPageQuery,
} from '@/api/admin/sysman';
export default {
  name: 'BlackList',
  props: {
    activeTab: String,
    keyword: String,
  },
  data() {
    return {
      sel: null,
      showConfirmDelete: false,
      row: {},
      tableHeight: '500px',
      loading: false,
      tableData: [],
      tableData2: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      total2: 0,
      pageSize2: 10,
      currentPage2: 1,
      rules: {
        name: [{ required: true, message: '请输入角色名称！', trigger: 'change' }],
      },
      finishTable: false,
    };
  },
  watch: {
    activeTab(neww) {
      if (neww == '2') {
        this.getTableData2();
      } else {
        this.getTableData();
      }
    },
  },
  methods: {
    // 加载更多数据
    getMoreData() {
      this.getTableData(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
        this.finishTable = this.tableData.length == this.total;
      });
    },
    getMoreData2() {
      this.getTableData2(this.currentPage2 + 1).then(list => {
        this.tableData2 = this.tableData2.concat(list);
        this.finishTable = this.tableData2.length == this.total2;
      });
    },

    // 获取黑名单用户
    getTableData(page, pageSize) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let data = {
          page: page || 1,
          limit: pageSize || this.pageSize,
          orderBy: 'createTime',
          sort: 'desc',
        };
        if (this.keyword) {
          data.filter = {
            keyword: this.keyword,
          };
        }
        apBlacklistPageQuery(data)
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let list = res.data || [];
              this.total = res.total;
              this.currentPage = data.page;

              if (data.page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.pageSize || list.length === this.total;
              resolve(list);
            } else {
              // this.finishTable = true;
              this.$toast.fail('获取数据失败' + '\n' + res.message);
              reject(res);
            }
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      });
    },
    // 选择行
    selectRows(rows) {
      this.sel = rows;
      this.$emit('list2', rows);
    },
    // 跳转
    openBlackDrawer() {
      this.$router.push('/sys-manage/addblacklist');
    },
    openRuleDrawer() {
      this.$router.push('/sys-manage/blacklistrule');
    },
    // 初始化表格高度
    initTableHeight() {
      this.$nextTick(() => {
        let obj = this.$parent;
        while (!obj.isThisGrand) {
          obj = obj.$parent;
        }
        let domHeight = document.documentElement.clientHeight || 0;
        let tabsHeight = obj.$refs.tabs.$el.offsetHeight || 0;
        let navBarHeight = obj.$refs.navBar.$el.offsetHeight || 0;
        let searchBarHeight = obj.$refs.searchBar.offsetHeight || 0;
        // let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight || 0;
        this.tableHeight = domHeight - tabsHeight - navBarHeight - searchBarHeight - 20 + 'px';
        this.$refs.mainDiv.doLayout();
      });
    },
    // 清除
    erase(row) {
      this.row = row;
      this.showConfirmDelete = true;
    },
    confirmDelete() {
      apBlacklistDelete(this.row.id).then(res => {
        if (res.success) {
          this.showConfirmDelete = false;
          this.$toast.success('删除成功');
          this.getTableData(1);
        } else {
          this.$toast.fail('删除失败' + '\n' + res.message);
        }
      });
    },
    getTableData2(page, row) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let data = {
          filter: {},
          page: page || 1,
          limit: this.pageSize2,
          orderBy: 'createTime',
          sort: 'desc',
        };
        if (this.keyword) {
          data.filter.keyword = this.keyword;
        }
        let obj = this.sel || row;
        if (obj) {
          data.filter.userId = obj.userId;
        }
        apViolationRecordPageQuery(data)
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let list = res.data || [];
              this.total2 = res.total;
              this.currentPage2 = data.page;

              if (data.page === 1) {
                this.tableData2 = list;
              }
              this.finishTable = list.length < this.pageSize2 || list.length === this.total2;
              this.sel = null;
              resolve(list);
            } else {
              // this.finishTable = true;
              this.$toast.fail('获取数据失败' + '\n' + res.message);
              reject(res);
            }
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      });
    },
  },
  mounted() {
    this.getTableData(1);
    // this.getTableData2();
    this.initTableHeight();
  },
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 100%;
  height: 100%;
  // min-height: 800px;
  margin: 0 auto;
  padding: 0;
}
.div_flex {
  display: flex;
  align-items: center;
}
.text_m {
  vertical-align: middle;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.table_class {
  width: 100%;
  font-size: 24px;
}
.btns {
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
  z-index: 100;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  /deep/ .van-button {
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  }
  /deep/ .van-button--primary {
    background-color: #3f86f7;
    border: #3f86f7;
  }
}
.tableheader {
  background: rgba(0, 0, 0, 0.02);
  // height: 100px;
  // vertical-align: middle;
}
.table {
  margin-top: 10px;
}
/deep/ .el-table {
  thead .cell,
  tbody .cell {
    font-size: 28px;
    height: 56px;
    line-height: 56px;
  }
}
</style>
