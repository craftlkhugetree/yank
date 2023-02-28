<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>黑名单列表</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入学号或姓名"
          size="middle"
          clearable
          @clear="getTableData(1,pageSize)"
          @keyup.enter.native="getTableData(1,pageSize)"
        >
          <el-button slot="append" icon="el-icon-search" @click="getTableData(1,pageSize)"></el-button>
        </el-input>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <el-table
      :data="tableData"
      style="width:100%;"
      header-row-class-name="table-header"
      v-loading="tableLoading"
      :row-style="{height:'10px'}"
      :cell-style="{padding:'26px 0px'}"
      empty-text=" "
    >
      <el-table-column prop="username" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="userid" label="学号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="iscancel" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.iscancel=="1"?'已撤销':"未撤销"}}</template>
      </el-table-column>
      <el-table-column prop="createtime " label="纳入时间">
        <template slot-scope="scope">
          {{
          moment(scope.row.createtime, "YYYYMMDDhhmmss").format(
          "YYYY-MM-DD HH:mm:ss"
          ) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span @click="handleDelete(scope.row)">撤销</span>
        </template>
      </el-table-column>
    </el-table>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        :hide-on-single-page="true"
        layout="sizes, prev, pager, next,jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10,20,50,100]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="size => {pageSize = size; getTableData(1, size)}"
      ></el-pagination>
    </div>
    <!---------------------------- 无数据 ---------------------------->
    <div class="nodata" v-else>
      <img v-if="total == 0" src="@/assets/img/nofind.png" alt />
      <p>暂无黑名单信息</p>
    </div>
  </div>
</template>

<script>
import { fetchBlacklist, deleteBlackList } from "@/api/manage/blacklist";
export default {
  data() {
    return {
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: ""
    };
  },

  computed: {},
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  },
  methods: {
    handleDelete(row) {
      this.$confirm(`确认撤销该黑名单吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            id: row.id
          };
          deleteBlackList(param).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "黑名单撤销成功"
              });
              this.getTableData();
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "黑名单撤销失败" + res.data.message
              });
            }
          });
        })
        .catch(err => {});
    },
    // 获取座位列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          keyword: this.keyword
        },
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchBlacklist(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
          this.currentPage = page;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  // min-height: calc(100% - 20px);
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
}
.search-box-right {
  position: relative;
}
.fixed-dialog {
  position: absolute;
  top: 25%;
}
.tab-content {
  position: relative;
  min-height: 500px;
}
</style>