<template>
  <div class="main-div" ref="mainDiv">
    <div class="left-div base-search-table">
      <div class="search-box clearfix div_flex">
        <h3 style="width: auto; min-width: auto">黑名单</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right" style="max-width: auto">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入工号或姓名"
            size="small"
            clearable
            @clear="getTableData(1, pageSize)"
            @keyup.enter.native="getTableData(1, pageSize)"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="getTableData(1, pageSize)"
          >
            查询
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            class="orange-btn"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="openBlackDrawer"
          >
            黑名单
          </el-button>
          <el-button type="primary" size="small" @click="openRuleDrawer">
            黑名单规则
          </el-button>
        </div>
      </div>

      <!---------------------------- 黑名单表格 ---------------------------->
      <div class="table-content">
        <el-table
          :data="tableData"
          style="width:100%"
          header-row-class-name="table-header"
          v-loading="loading"
          @selection-change="selectRows"
          stripe
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
              <span v-else @click.stop="selectRows(scope.row)">查看违规记录</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <span @click.stop="erase(scope.row)">清除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total > 0">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="
            size => {
              pageSize = size;
              getTableData(1, size);
            }
          "
        ></el-pagination>
      </div>
    </div>
    <div class="right-div base-search-table">
      <div class="search-box clearfix div_flex">
        <h3>违规记录</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword2"
            placeholder="请输入工号或姓名"
            size="small"
            clearable
            @clear="getTableData2(1)"
            @keyup.enter.native="getTableData2(1)"
          ></el-input>
          <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData2(1)">
            查询
          </el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <div class="table-content">
        <el-table
          :data="tableData2"
          style="width:100%"
          header-row-class-name="table-header"
          v-loading="loading"
          stripe
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
              <p class="text_m">{{scope.row.reason || '--'}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total2 > 0">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="total2"
          :page-size="pageSize2"
          :page-sizes="[5, 10, 15, 20]"
          :current-page.sync="currentPage2"
          @current-change="page => getTableData2(page)"
          @size-change="
            size => {
              pageSize2 = size;
              getTableData2(1);
            }
          "
        ></el-pagination>
      </div>
    </div>
    <!---------------------------- 规则弹窗 ---------------------------->
    <rule-drawer
      ref="ruleDrawer"
      v-if="isRuleDrawer"
      @close="isRuleDrawer = false"
      @query="
        getTableData(1);
        getTableData2(1);
      "
      :isRuleDrawer="isRuleDrawer"
    ></rule-drawer>
    <!---------------------------- 添加黑名单弹窗 ---------------------------->
    <black-drawer
      ref="blackDrawer"
      v-if="isBlackDrawer"
      :isBlackDrawer="isBlackDrawer"
      @close="isBlackDrawer = false"
      @query="getTableData(1)"
    ></black-drawer>
  </div>
</template>

<script>
import {
  apBlacklistPageQuery,
  apBlacklistDelete,
  apViolationRecordPageQuery,
} from '@/api/admin/sysman';
export default {
  components: {
    BlackDrawer: () => import('./blackDrawer.vue'),
    ruleDrawer: () => import('./ruleDrawer.vue'),
  },
  data() {
    return {
      tableHeight: '500px',
      loading: false,
      keyword: null,
      keyword2: null,
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
      isBlackDrawer: false,
      isRuleDrawer: false,
    };
  },
  methods: {
    // 获取黑名单用户
    getTableData(page, pageSize) {
      this.loading = true;
      let data = {
        page: page || 1,
        limit: pageSize || this.pageSize,
        orderBy: 'createTime',
        sort:'desc'
      };
      if (this.keyword) {
        data.filter = {
          keyword: this.keyword,
        };
      }
      apBlacklistPageQuery(data)
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
          this.total = res.total;
          this.currentPage = page;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 选择行
    selectRows(rows) {
      this.getTableData2(1, rows);
    },
    // 打开抽屉
    openBlackDrawer() {
      this.isBlackDrawer = true;
    },
    openRuleDrawer() {
      this.isRuleDrawer = true;
    },
    // 初始化表格高度
    initTableHeight() {
      this.tableHeight = this.$refs.mainDiv.offsetHeight - 92;
    },
    // 清除
    erase(row) {
      this.$confirm(`确认删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        apBlacklistDelete(row.id).then(res => {
          if (res.success) {
            this.$message({
              showClose: true,
              type: 'success',
              message: `删除成功！`,
            });
            this.getTableData(1);
          }
        });
      });
    },
    getTableData2(page, row) {
      this.loading = true;
      let data = {
        filter: {},
        page: page || 1,
        limit: this.pageSize2,
        orderBy: 'createTime',
        sort:'desc'
      };
      if (this.keyword2) {
        data.filter.keyword = this.keyword2;
      }
      if (row) {
        data.filter.userId = row.userId;
      }
      apViolationRecordPageQuery(data)
        .then(res => {
          this.loading = false;
          this.tableData2 = res.data;
          this.total2 = res.total;
          this.currentPage2 = page;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getTableData();
    this.getTableData2();
    this.$nextTick(() => {
      this.initTableHeight();
    });
  },
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 100%;
  height: 100%;
  min-height: 800px;
  margin: 0 auto;
  padding: 0;
  .left-div,
  .right-div {
    width: 49.5%;
    height: 100%;
    background: #ffffff;
  }
  .left-div {
    float: left;
  }
  .right-div {
    float: right;
  }
}
.div_flex {
  display: flex;
  align-items: center;
  div {
    margin-left: auto;
  }
}
.text_m {
  vertical-align: middle;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
