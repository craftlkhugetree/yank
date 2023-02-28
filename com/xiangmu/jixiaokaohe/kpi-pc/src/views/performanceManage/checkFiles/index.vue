<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>绩效考核文件</h3>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <el-table
      :data="tableData"
      style="width:100%;"
      header-row-class-name="table-header"
      v-loading="tableLoading"
    >
      <el-table-column prop="username" label="序号" width="100">
        <template slot-scope="scope">
          <div>{{scope.$index+1}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文件名称">
        <template slot-scope="scope">
          <span @click="common.reviewFile(scope.row.fileid)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="发布时间" width="300">
        <template
          slot-scope="scope"
        >{{moment(scope.row.createtime, "YYYYMMDDhhmmss").format("YYYY-MM-DD HH:mm:ss" )}}</template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="100">
        <template slot-scope="scope">
          <span @click="common.downloadFile(scope.row.fileid)">下载</span>
        </template>
      </el-table-column>
    </el-table>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10,20,50,100]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="size => {pageSize = size; getTableData(1, size)}"
      ></el-pagination>
    </div>
    <!---------------------------- 无数据 ---------------------------->
    <div class="nodata" v-if="total == 0"></div>
  </div>
</template>

<script>
import { fetchFileList } from "@/api/kpi/file";
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
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          name: this.keyword,
          isvisible: 1
        },
        orderBy: "level",
        sort: "asc", //asc
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchFileList(data)
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
</style>