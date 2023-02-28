<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <!---------------------------- 查询条件 ---------------------------->
      <label>选择年度：</label>
      <el-date-picker
        class="no-border date-select no-clear"
        v-model="year"
        type="year"
        placeholder="全部"
        size="small"
        value-format="yyyy"
        format="yyyy年"
        style="width:90px;"
        :clearable="false"
        @change="getTableData(1,pageSize);"
      ></el-date-picker>
      <i class="el-icon-arrow-down"></i>
      <label style="margin-left: 50px;">考核分组：</label>
      <el-select
        v-model="group"
        placeholder="选择考核分组"
        size="small"
        style="width:200px;"
        clearable
        @change="getTableData(1,pageSize)"
      >
        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <label style="margin-left: 50px;">考核人员：</label>
      <el-input
        class="input-box"
        v-model="keyword"
        placeholder="请输入姓名或工号查询"
        size="small"
        clearable
        style="width:200px;margin-right:10px;"
        prefix-icon="el-icon-search"
        @clear="getTableData(1,pageSize)"
        @keyup.enter.native="getTableData(1,pageSize)"
      ></el-input>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="getTableData(1,pageSize)"
      >查询</el-button>
      <el-button size="small" @click="exportData">导出数据</el-button>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%;margin-top:10px;"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" show-overflow-tooltip width="60" fixed></el-table-column>
        <el-table-column prop="username" label="姓名" show-overflow-tooltip fixed width="140">
          <template slot-scope="scope">{{scope.row.name}} ({{scope.row.id}})</template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="发放总金额 (元)"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="monthtotal"
          label="月考核奖总金额 (元)"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="yearsalaryTotal"
          label="年终考核奖总金额 (元)"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="allowanceTotal"
          label="领导岗位津贴总金额 (元)"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
          min-width="180"
        ></el-table-column>
        <el-table-column
          prop="outsalaryTotal"
          label="外挂工资总金额 (元)"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="othersalaryTotal"
          label="其他总金额 (元)"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="specialsalaryTotal"
          label="录入发放总金额 (元)"
          show-overflow-tooltip
          :formatter="(row, column, val) => common.moneyFormat(val)"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="orgname"
          label="部门"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="joblvname"
          label="领导岗位级别"
          show-overflow-tooltip
          min-width="110"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="groupname"
          label="考核分组"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="rylxm"
          label="人员类型"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
          width="110"
        ></el-table-column>

        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <span @click.stop="toDetail(scope.row)">查看</span>
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
          :page-sizes="[5,10,15,20]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUserKpiList } from "@/api/kpi/userKpi.js";
export default {
  data() {
    return {
      loading: false,
      year: this.moment().format("YYYY"),
      group: null,
      keyword: null,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    // 用户有权限查看的工作组
    groupList() {
      return this.$store.state.userRoleGroupList;
    }
  },
  watch: {
    groupList() {
      this.getTableData(this.currentPage, this.pageSize);
    }
  },
  methods: {
    // 详情
    toDetail(row) {
      this.$router.push({
        path: `/kpi/user-kpi-list/detail/${row.id}`,
        query: {
          year: this.year
        }
      });
    },

    // 获取人员列表
    getTableData(page, pageSize) {
      this.loading = true;
      let param = {
        filter: {
          yeardate: this.year,
          groupid: this.group || this.groupList.map(i => i.id).join(","),
          keyword: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      };
      fetchUserKpiList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.total = res.total;
            this.currentPage = page || 1;
            // 记录参数
            let params = {
              yeardate: this.year,
              group: this.group,
              keyword: this.keyword,
              page: page || 1,
              pageSize: pageSize
            };
            sessionStorage.setItem("userKpiParams", JSON.stringify(params));
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 初始化参数
    initParams() {
      let data = sessionStorage.getItem("userKpiParams");
      if (data) {
        let params = JSON.parse(data);
        this.year = params.yeardate;
        this.group = params.group;
        this.keyword = params.keyword;
        this.currentPage = params.page;
        this.pageSize = params.pageSize;
      }
    },

    // 导出数据
    exportData() {
      let url = `${window.g.url}kpi/personKpiDownload`;
      let yeardate = this.year || "";
      let groupid = this.group || this.groupList.map(i => i.id).join(",");
      let keyword = this.keyword || "";
      let query = `?yeardate=${yeardate}&groupid=${groupid}&keyword=${keyword}`
      window.open(url + query, "_blank");
    }
  },
  created() {
    this.initParams();
    if (this.groupList.length > 0) {
      this.getTableData(this.currentPage, this.pageSize);
    }
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
}
.search-box {
  label {
    color: #5f6464;
  }
}
</style>