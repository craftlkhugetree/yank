<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
      <span>
        <label>学院</label>
        <org-select ref="orgSelect" @doFunc="changeOrg"></org-select>
      </span>
      <span>
        <el-input
          v-model="searchForm.rescode"
          placeholder="请输入资源编号"
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
    <el-table class="my-table" :data="applyList" style="width: 100%" stripe v-loading="loading">
      <el-table-column
        prop="usetype"
        label="申请类型"
        align="center"
        :formatter="common.useTypeFormatter"
      ></el-table-column>
      <el-table-column prop="typename" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="rescodes" label="资源编号" align="center"></el-table-column>
      <el-table-column prop="orgname" label="学院名称" align="center"></el-table-column>
      <el-table-column prop="classleadername" label="负责教师" align="center"></el-table-column>
      <el-table-column prop="usecycle" label="时长" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.usecycle ? scope.row.usecycle : "--"}}{{scope.row.chargecyclename}}</template>
      </el-table-column>
      <el-table-column prop="applystatus" label="审批状态" align="center">
        <template slot-scope="scope">
          <span
            :class="common.statusColor('','',scope.row.applystatus)"
          >{{common.processFormatter("","",scope.row.applystatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="actionstatus"
        label="状态"
        align="center"
        :formatter="common.applyLiveStatusFormatter"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
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
  name: "index",
  components: {
      OrgSelect
  },
  data() {
    return {
      totalPage: 0,
      limit: 10,
      currentPage: 1,
      searchForm: {},
      applyList: [], //申请列表
      applyStatus: this.options.applyStatus, //状态列表
      loading: false,
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

    //查询
    search() {
      this.getList(1);
    },

    //重置
    reSet() {
      this.searchForm = {};
      this.$refs.orgSelect.orgname = "";
      this.getList(1);
    },

    //点击分页
    getCurrentChange(currentPage) {
      this.getList(currentPage);
    },

    //跳转详情
    goDetail(row) {
      this.$router.push({
        path: `/search/resourceApply/${row.id}`
      });
    },

    //获取列表
    getList(page) {
      this.loading = true;
      let params = {
        filter: {
          rescode: this.searchForm.rescode || null,
          orgid: this.searchForm.orgid || null
        },
        page: page,
        limit: this.limit
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "/allapply/spapplys",
          isRep: true,
          data: params
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.applyList = res.data || [];
            this.totalPage = res.total || 0;
            this.currentPage = page;
            this.common.chargecycleFormatter2(this.applyList);
            params.orgname = this.$refs.orgSelect.orgname;
            sessionStorage.setItem("resSearchParams", JSON.stringify(params));
          }
        });
    },
    // 初始化查询参数
    initParams() {
      let storageParams = sessionStorage.getItem("resSearchParams");
      if (storageParams) {
        let params = JSON.parse(storageParams);
        this.currentPage = params.page;
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
