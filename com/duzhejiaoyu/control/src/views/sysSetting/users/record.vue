<template>
  <div class="base-search-table">
    <!------------------------------------- 检查点信息 ------------------------------------->
    <div class="base-search-table">
      <div class="search-box clearfix" style="padding:0 20px;">
        <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
        <el-divider direction="vertical"></el-divider>
        {{userName}} 考试记录
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right" style="max-width: 100%">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始考试"
            end-placeholder="结束考试"
            value-format="yyyyMMdd"
            size="small"
            style="width: 240px;margin-right:10px;"
            @change="getTableData(1,pageSize)"
          ></el-date-picker>
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入关键字查询"
            size="small"
            clearable
            style="width: 190px"
            @clear="getTableData(1, pageSize)"
            @keyup.enter.native="getTableData(1, pageSize)"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="getTableData(1, pageSize)"
          >查询</el-button>
        </div>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 0px"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="60" fixed></el-table-column>
        <el-table-column prop="examTime" label="考试时间" show-overflow-tooltip :formatter="common.timeFormat"></el-table-column>
        <el-table-column prop="examName" label="考试名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="score" label="考试分数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isPass" label="考试状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              class="status"
              :class="`status-${scope.row.isPass}`"
            >{{(scope.row.isPass=='1' ? "合格" : "不合格") || "--"}}</span>
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
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="currentPage"
          @current-change="(page) => getTableData(page, pageSize)"
          @size-change="
            (size) => {
              pageSize = size;
              getTableData(1, size);
            }
          "
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUserRecordList } from '@/api/users'
export default {
  props: {
      userid: String
  },
  data() {
    return {
      time: null,
      keyword: null,
      tableData: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null,
      userName: sessionStorage.getItem("curRecordUserName")
    }
  },
  methods: {
    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        filter: {
          userId: this.userid,
          starttime: this.time ? this.time[0] + "000000" : null,
          endtime: this.time ? this.time[1] + "235959" : null,
          keyword: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      }
      fetchUserRecordList(param)
        .then(res => {
          this.loading = false
          if (res.code == "000000") {
            this.tableData = res.data || []
            this.total = res.total
            this.currentPage = page || 1
          }
        })
        .catch(err => {
          this.loading = false
        })
    }
  },
  created() {
      this.getTableData(this.currentPage, this.pageSize);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/color.scss";
.search-box {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}
.el-table {
  .status {
    color: $normal-color !important;
    &::before {
      display: inline-block;
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background-color: $normal-color;
      margin-right: 8px;
    }
  }
  .status-0 {
    color: $error-color !important;
    &::before {
      background-color: $error-color;
    }
  }
}
</style>