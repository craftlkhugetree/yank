<template>
  <div class="common-content">

    <!--搜索框-->
    <div class="search-group">
      <span>
        <label>申请时间</label>
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="searchForm.applytime"
          value-format="yyyyMMdd000000"
          size="small"
          style="width: 150px;"
        ></el-date-picker>
      </span>
      <span>
        <label>学院</label>
        <org-select ref="orgSelect" @doFunc="changeOrg"></org-select>
      </span>
      <span>
        <el-input
          v-model="searchForm.classname"
          placeholder="请输入班级名称"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 220px"
          clearable
        ></el-input>
        <el-button size="small" style="width: 100px" @click="search">搜索</el-button>
      </span>
      <span class="reset-icon" @click="reSet">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>
    </div>

    <!--表格-->
    <el-table
      class="my-table"
      :data="auditList"
      style="width: 100%"
      stripe
      @sort-change="sortChange"
      v-loading="pageLoading"
    >
      <!-- <el-table-column prop="name" label="申请编号" width="180"></el-table-column> -->
      <el-table-column prop="orgname" label="学院名称" align="center"></el-table-column>
      <el-table-column prop="classname" label="班级名称" align="center"></el-table-column>
      <el-table-column prop="leadername" label="负责教师" align="center"></el-table-column>
      <el-table-column prop="prpersonnum" label="实习人数" align="center"></el-table-column>
      <el-table-column prop="prstarttime" label="实习日期" sortable align="center" min-width="150">
        <template slot-scope="scope">
          {{scope.row.prstarttime ? util.formatTime(scope.row.prstarttime, "yyyy.MM.dd") : "--"}}
          ~
          {{scope.row.prendtime ? util.formatTime(scope.row.prendtime, "yyyy.MM.dd") : "--"}}
        </template>
      </el-table-column>
      <el-table-column prop="applystatus" label="审批状态" align="center">
        <template slot-scope="scope">
          <span
            :class="common.statusColor('','',scope.row.applystatus)"
          >{{common.processFormatter("","",scope.row.applystatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <div class="table-btn green" @click="goDetail(scope.row)">详情</div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > 0">
      <span>显示{{limit}}条，共{{totalPage}}条</span>
      <el-pagination
        class="my-el-pagination"
        background
        layout="prev, pager, next"
        :total="totalPage"
        :page-size="limit"
        :current-page="currentPage"
        small
        @current-change="getCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import OrgSelect from "../../../components/orgSelect"
export default {
  components: {
      OrgSelect
  },
  data() {
    return {
      totalPage: 0,
      limit: 10,
      currentPage: 1,
      orderBy: null,
      sort: null,
      searchForm: {},
      auditList: [],
      pageLoading: false,
    };
  },
  methods: {
    // 选择学院
    changeOrg(value) {
      if (value) {
        this.searchForm.orgid = value.id;
      } else {
        this.searchForm.orgid = null;
      }
    },

    //排序
    sortChange(column, prop, order) {
      this.orderBy = column.prop.toUpperCase();
      switch (column.order) {
        case "ascending":
          this.sort = "asc";
          break;
        case "descending":
          this.sort = "desc";
          break;
      }
      this.getList(1);
    },

    // 查询
    search() {
      this.getList(1);
    },
    // 重置
    reSet() {
      this.searchForm = {};
      this.$refs.orgSelect.orgname = "";
      this.getList(1);
    },
    // 点击分页
    getCurrentChange(currentPage) {
      this.getList(currentPage);
    },
    // 跳转详情
    goDetail(row) {
      this.$router.push({
        path: `/search/practiveApply/${row.id}`
      });
    },
    // 获取列表
    getList(page) {
      this.pageLoading = true;
      let params = {
        filter: {
          orgid: this.searchForm.orgid || null,
          classname: this.searchForm.classname || null,
          applytime: this.searchForm.applytime || null
        },
        page: page,
        limit: this.limit,
        orderBy: this.orderBy,
        sort: this.sort
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "/allapply/prapplys",
          isRep: true,
          data: params
        })
        .then(res => {
          this.pageLoading = false;
          if (res.success == true) {
            this.auditList = res.data || [];
            this.totalPage = res.total || 0;
            this.currentPage = page;
            params.orgname = this.$refs.orgSelect.orgname;
            sessionStorage.setItem("prSearchParams", JSON.stringify(params));
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "获取列表失败！"
            });
          }
        })
        .catch(err => {
          return false;
        });
    },
    // 初始化查询参数
    initParams() {
      let storageParams = sessionStorage.getItem("prSearchParams");
      if (storageParams) {
        let params = JSON.parse(storageParams);
        this.currentPage = params.page;
        this.sort = params.sort;
        this.orderBy = params.orderBy;
        this.searchForm = params.filter;  
        this.$refs.orgSelect.orgname = params.orgname;      
      }
    }
  },
  mounted() {
    this.initParams();
    this.getList(this.currentPage);
  }
};
</script>

<style scoped>
</style>
