<template>
  <div class="main-div" ref="mainDiv">
    <div class="left-div base-search-table">
      <div class="search-box clearfix">
        <h3>角色</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-button type="primary" size="small" icon="el-icon-plus">新增</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        ref="roleTable"
        :data="roleData"
        style="width:100%"
        row-key="id"
        header-row-class-name="table-header"
        v-loading="roleLoading"
        @row-click="rowClick"
        :height="tableHeight"
        :highlight-current-row="true"
      >
        <el-table-column prop="name" label="角色"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <span @click="editType(scope.row)">编辑</span>
            <span @click="deleteType(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="right-div base-search-table">
      <div class="search-box clearfix">
        <h3>用户</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input class="input-box" v-model="keyword" placeholder="请输入名称" size="small" clearable></el-input>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="getTableData(1,pageSize)"
          >查询</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            class="orange-btn"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="dialogVisible=true"
          >新增</el-button>
          <el-button
            class="orange-btn"
            size="small"
            icon="el-icon-close"
            @click="dialogVisible=true"
          >删除</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <div class="table-content">
        <el-table
          :data="tableData"
          style="width:100%"
          header-row-class-name="table-header"
          v-loading="loading"
          @selection-change="selectRows"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="LOGINNAME" sortable="custom" label="工号"></el-table-column>
          <el-table-column prop="NAME" sortable="custom" label="姓名"></el-table-column>
          <el-table-column prop="ORGNAME" sortable="custom" label="部门"></el-table-column>
          <el-table-column prop="USERTYPE" sortable="custom" label="用户类型"></el-table-column>
          <el-table-column prop="SEX" label="性别">
            <template slot-scope="scope">
              <p v-if="scope.row.SEX == 1">男</p>
              <p v-else>女</p>
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
          :page-sizes="[5,10,15,20]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => getTableData(currentPage, size)"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeight: "500px",
      selectRoleId: null,
      roleData: [],
      keyword: null,
      tableData: [
        {
          id: 1,
          LOGINNAME: "1980032",
          NAME: "张三",
          ORGNAME: "信息网络中心",
          USERTYPE: "教师",
          SEX: 1
        },
        {
          id: 2,
          LOGINNAME: "1980032",
          NAME: "张三",
          ORGNAME: "信息网络中心",
          USERTYPE: "教师",
          SEX: 1
        }
      ],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 点击角色
    rowClick(row) {
      this.$refs.roleTable.setCurrentRow(row);
      this.selectRoleId = row.id;
      this.getTableData(1, this.pageSize);
    },
    // 获取角色
    getRoleData() {
      this.util
        .postAjax({
          code: "auth",
          url: "rest/Role/list",
          data: {
            filter: JSON.stringify({
              ISUSE: 1,
              ISDELETE: 0
            })
          }
        })
        .then(res => {
          if (res.success) {
            this.roleData = res.items || [];
          }
        });
    },
    // 获取用户
    getTableData(page, pageSize) {
      this.util
        .postAjax({
          code: "auth",
          url: "rest/User/simpleList",
          isRep: true,
          data: {
            filter: {
              KEYWORD: this.keyword
            },
            page: page,
            limit: pageSize
          }
        })
        .then(res => {
          this.tableData = res.items;
          this.total = res.total;
        });
    },
    // 初始化表格高度
    initTableHeight() {
      this.tableHeight = this.$refs.mainDiv.offsetHeight - 92;
      console.log(this.tableHeight);
    }
  },
  created() {
    this.getRoleData();
    this.getTableData(this.currentPage, this.pageSize);
    this.$nextTick(() => {
      this.initTableHeight();
    });
  }
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 20px 0 0;
  .left-div,
  .right-div {
    height: 100%;
    background: #ffffff;
  }
  .left-div {
    width: 300px;
    float: left;
    .el-menu {
      border: none;
      .el-menu-item {
        margin-bottom: 10px;
        &.is-active,
        &:hover {
          font-weight: bold;
          background: #f0f5ff;
        }
      }
    }
  }
  .right-div {
    width: 880px;
    float: right;
  }
}
</style>