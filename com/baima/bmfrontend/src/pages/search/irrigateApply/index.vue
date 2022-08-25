<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group" style>
      <span style="display: inline-block">
        <label>灌溉日期</label>
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="searchForm.irdate"
          value-format="yyyyMMdd000000"
          size="small"
          style="width: 150px;"
        ></el-date-picker>
      </span>
      <span>
        <label>类型</label>
        <el-select
          v-model="searchForm.irrestypeid"
          placeholder="请选择"
          size="small"
          style="width: 150px"
          clearable
        >
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.typename"
            :value="item.id"
          ></el-option>
        </el-select>
      </span>
      <span>
        <label>学院</label>
        <org-select ref="orgSelect" @doFunc="changeOrg"></org-select>
      </span>
      <span>
        <label>状态</label>
        <el-select
          v-model="searchForm.applystatus"
          placeholder="请选择"
          size="small"
          style="width: 150px"
          clearable
        >
          <el-option v-for="item in applyStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
      <span class="reset-icon" @click="reset">
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
      v-loading="loading"
    >
      <el-table-column
        prop="irdate"
        label="灌溉日期"
        align="center"
        sortable
        :formatter="dateFormatter"
      ></el-table-column>
      <el-table-column prop="orgname" label="学院名称" align="center"></el-table-column>
      <el-table-column prop="typename" label="灌溉类型" align="center"></el-table-column>
      <el-table-column prop="rescodes" label="资源编号" align="center"></el-table-column>
      <el-table-column prop="applyername" label="申请人" align="center"></el-table-column>
      <el-table-column prop="applytime" label="申请时间" align="center" width="200">
        <template slot-scope="scope">
              {{common.formatTime(scope.row.applytime, 'yyyy-MM-dd hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column prop="applystatus" label="状态" align="center">
        <template slot-scope="scope">
          <span
            :class="common.statusColor('','',scope.row.applystatus)"
          >{{common.statusFormatter("","",scope.row.applystatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="approver" label="审批人" align="center">
        <template slot-scope="scope">
          {{ charger(scope.row) }}
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
  name: "index",
  components: {
      OrgSelect
  },
  data() {
    return {
      loading: false,
      totalPage: 0,
      limit: 10,
      currentPage: 1,
      sort: null,
      orderBy: null,
      auditList: [], //申请列表
      applyStatus: this.options.applyStatus.filter(i => i.id !== "0"), //状态列表
      searchForm: {},
    };
  },
  computed: {
    //资源类型列表
    typeList() {
      return this.$store.state.irrtypeList;
    },
    charger() {
      return function(row) {
        let obj =
          this.$store.state.leaderList.find(l => l.id === row.approver) || {};
        let name
        if (row && row.events && row.events.length && row.events[0].eventtype != 1  && row.events[0].eventtype != 2) {
          name = row.events[0].eventername || name;
        } else if (row.events[0].eventtype == 5) {
          name = row.events[1] && row.events[1].eventername;
        }
        return name || "--";
      };
    }
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

    //搜索
    search() {
      this.getList(1);
    },

    //清空
    reset() {
      this.searchForm = {};
      this.$refs.orgSelect.orgname = "";
      this.getList(1);
    },

    //表格内日期格式转化
    dateFormatter(row, column, cellValue) {
      if (cellValue && cellValue.length == 14) {
        return this.util.formatTime(cellValue, "yyyy.MM.dd");
      } else {
        return cellValue;
      }
    },

    //点击分页
    getCurrentChange(currentPage) {
      this.getList(currentPage);
    },

    //跳转详情
    goDetail(row) {
      this.$router.push({
        path: `/search/irrigateApply/${row.id}`
      });
    },

    //获取列表
    getList(page) {
      let params = {
        filter: {
          irdate: this.searchForm.irdate || null,
          applystatus: this.searchForm.applystatus || null,
          orgid: this.searchForm.orgid || null,
          rescode: this.searchForm.rescode || null,
          irrestypeid: this.searchForm.irrestypeid || null
        },
        page: page,
        limit: this.limit,
        sort: this.sort,
        orderBy: this.orderBy
      };
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/allapply/irapplys",
          isRep: true,
          data: params
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.auditList = res.data || [];
            this.totalPage = res.total || 0;
            this.currentPage = page;
            params.orgname = this.$refs.orgSelect.orgname;
            sessionStorage.setItem("irrSearchParams", JSON.stringify(params));
          }
        })
        .catch(err => {
          return false;
        });
    },
    // 初始化查询参数
    initParams() {
      let storageParams = sessionStorage.getItem("irrSearchParams");
      if (storageParams) {
        let params = JSON.parse(storageParams);
        this.currentPage = params.page;
        this.sort = params.sort;
        this.orderBy = params.orderBy;
        this.$refs.orgSelect.orgname = params.orgname;
        this.searchForm = params.filter;
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
