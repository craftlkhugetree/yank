<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
      <span>
          <label>申请时间</label>
          <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.applytime" value-format="yyyyMMdd" size="small" style="width: 150px;"></el-date-picker>
      </span>
      <!--<span>
        <label>学院</label>
        <el-select
          v-model="searchForm.orgid"
          placeholder="请选择"
          size="small"
          style="width: 150px"
        >
          <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </span>-->
      <span>
        <el-input
          v-model="searchForm.classname"
          placeholder="请输入班级名称"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 220px"
        ></el-input>
        <el-button size="small" style="width: 100px" @click="search">搜索</el-button>
      </span>
      <span class="reset-icon" @click="reSet">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>
    </div>

    <!--tab切换-->
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
<!--        <el-tab-pane label="全部" name="1"></el-tab-pane>-->
        <el-tab-pane label="待审批" name="2"></el-tab-pane>
        <el-tab-pane label="已审批" name="3"></el-tab-pane>
        <el-tab-pane label="已撤回" name="4"></el-tab-pane>
      </el-tabs>

      <!-- <div class="my-button green" style="float: right;margin-top: 3px;">
        <i class="el-icon-download"></i>
        <span>批量导出</span>
      </div>-->
    </div>

    <el-divider style></el-divider>

    <!--表格-->
    <el-table class="my-table" :data="auditList" style="width: 100%" stripe @sort-change="sortChange" v-loading="loading">
      <!-- <el-table-column prop="name" label="申请编号" width="180"></el-table-column> -->
      <el-table-column prop="orgname" label="学院名称" align="center"></el-table-column>
      <el-table-column prop="classname" label="班级名称" align="center"></el-table-column>
      <el-table-column prop="leadername" label="负责教师" align="center"></el-table-column>
      <el-table-column prop="prpersonnum" label="实习人数" align="center"></el-table-column>
      <el-table-column prop="prstarttime" label="实习日期" align="center" min-width="150">
        <template slot-scope="scope">
          {{scope.row.prstarttime ? util.formatTime(scope.row.prstarttime, "yyyy.MM.dd") : "--"}}
          ~
          {{scope.row.prendtime ? util.formatTime(scope.row.prendtime, "yyyy.MM.dd") : "--"}}
        </template>
      </el-table-column>
      <el-table-column prop="applystatus" label="审批状态" align="center">
        <template slot-scope="scope">
          <span :class="common.statusColor('','',scope.row.applystatus)">{{common.processFormatter("","",scope.row.applystatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <div class="table-btn green" @click="goDetail(scope.row)">详情</div>
          <div class="table-btn blue" @click="auditOperate(scope.row)" v-if="scope.row.applystatus === '1'">审批</div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit">
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
export default {
  data() {
    return {
      totalPage: 1,
      limit: 10,
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      orderBy:null,
      sort:null,
      activeName: sessionStorage.getItem("activeName") || "2",
      groupList: JSON.parse(sessionStorage.getItem("groupList")), //学院列表
      searchForm: {
        owngroup: "",
        rescode: ""
      },
      auditList: [],
      loading:false
    };
  },
  watch: {
    'searchForm.orgid'() {
      this.getList(1)
    }
  },

  methods: {
    //排序
    sortChange(column, prop, order){
      this.orderBy=column.prop.toUpperCase();
      // console.log(this.orderBy);
      switch (column.order) {
        case "ascending":
          this.sort="asc";
          break;
        case "descending":
          this.sort="desc";
          break;
      }
      this.currentPage=1;
      this.getList(this.currentPage);
    },

    // 查询
    search() {
      this.getList(1);
    },
    // 重置
    reSet() {
      this.searchForm={};
      this.getList(1);
    },
    // 点击分页
    getCurrentChange(currentPage) {
      this.getList(currentPage);
    },
    //tab切换
    handleClick() {
      this.currentPage = 1;
      this.getList(1);
    },
    // 跳转详情
    goDetail(row) {
      this.$router.push({
        path: `practive-leader-audit/audit-detail/${row.id}`,
        query:{
                activeName:this.activeName,
                currentPage:this.currentPage
              }
      });
    },
    // 审批
    auditOperate(row) {
      this.$router.push({
        path: `practive-leader-audit/audit-operate/${row.id}`,
        query:{
                activeName:this.activeName,
                currentPage:this.currentPage
              }
      });
    },
    // 获取列表
    getList(page) {
      this.loading=true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/prapply/pageList",
          data: {
            params: JSON.stringify({
              page: page,
              limit: this.limit,
              applytype: this.activeName,
              orgid: this.searchForm.orgid,
              classname: this.searchForm.classname,
              applytime:this.searchForm.applytime ? this.util.formatTime(this.searchForm.applytime,"yyyyMMdd000000") : null,
              orderBy:this.orderBy,
              sort:this.sort,
            })
          }
        })
        .then(res => {
          this.loading=false;
          if (res.success == true) {
            this.auditList = res.item.leaderList.list;
            this.totalPage = res.item.leaderList.total;
            this.currentPage = page;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "获取列表失败！"
            });
          }
        })
        /*.catch(err => {
          this.$message({
            showClose: true,
            type: "error",
            message: "获取列表失败！" + err
          });
        });*/
    }
  },
  created() {
    this.getList(1);
  },
  beforeDestroy() {
        sessionStorage.removeItem("currentPage");
        sessionStorage.removeItem("activeName");
      },
};
</script>

<style scoped>
</style>
