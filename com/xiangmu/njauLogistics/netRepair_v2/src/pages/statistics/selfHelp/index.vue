<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>自助解决查询</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyyMMdd"
          size="small"
          style="width:250px;"
          clearable
        ></el-date-picker>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1,pageSize)"
        >查询</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="process" v-html="formatProcess(props.row.process)"></div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="creatername" label="报修人" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="createtime"
          label="报修时间"
          show-overflow-tooltip
          width="250"
          :formatter="timeFormat"
        ></el-table-column>
        <el-table-column prop="process" label="操作过程" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5,10,15,20]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="size => {pageSize = size; getTableData(1, size)}"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      loading: false,
      dateTime: null,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 转换操作过程格式
    formatProcess(val) {
      let arr = val ? val.split("->") : [];
      let newVal = "";
      arr.forEach(i => {
        newVal += i + "\n";
      });
      return newVal;
    },
    // 转换时间格式
    timeFormat(row, column, val) {
      return moment(val, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
    },
    // 获取数据
    getTableData(page, pageSize) {
      this.loading = true;
      this.currentPage = page;
      this.util
        .postAjax({
          code: this.global.code,
          url: "helpself/pageQuery",
          isRep: true,
          data: {
            filter: {
              starttime: this.dateTime ? this.dateTime[0] + "000000" : null,
              endtime: this.dateTime ? this.dateTime[1] + "235959" : null
            },
            limit: pageSize || this.pageSize,
            page: page || 1
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.total = res.total || 0;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch(err => {
          this.loading = false;
          this.tableData = [];
          this.total = 0;
        });
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
}
.select-label {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
}
.process {
  padding-left: 68px;
  white-space: pre-wrap;
  line-height: 24px;
}
</style>