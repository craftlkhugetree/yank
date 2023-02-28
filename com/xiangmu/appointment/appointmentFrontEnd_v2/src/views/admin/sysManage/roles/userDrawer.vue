<template>
  <el-drawer
    class="base-drawer"
    title="添加用户"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="1000px"
  >
    <div class="drawer-container">
      <el-row :gutter="10">
        <el-col :span="11" class="base-search-table">
          <div class="search-box clearfix">
            <h3>用户列表</h3>
            <!---------------------------- 查询条件 ---------------------------->
            <div class="search-box-right">
              <el-input
                class="input-box"
                v-model="keywordA"
                placeholder="请输入名称"
                size="small"
                clearable
                style="margin-right:0"
                @clear="getUserList(1,pageSizeA)"
                @keyup.enter.native="getUserList(1,pageSizeA)"
              >
                <el-button slot="append" icon="el-icon-search" @click="getUserList(1,pageSizeA)"></el-button>
              </el-input>
            </div>
          </div>
          <!---------------------------- 表格 ---------------------------->
          <div class="table-content">
            <el-table
              :data="userList"
              ref="userList"
              style="width:100%;margin-top:10px;"
              header-row-class-name="table-header"
              v-loading="loading"
              @selection-change="rows=>selectRows('A',rows)"
            >
              <el-table-column type="selection" width="55" :selectable="canSelect"></el-table-column>
              <el-table-column prop="LOGINNAME" sortable="custom" label="工号"></el-table-column>
              <el-table-column prop="NAME" sortable="custom" label="姓名" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ORGNAME" sortable="custom" label="部门" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
          <!---------------------------- 分页 ---------------------------->
          <div class="pagination-box" v-if="totalA > 0">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="totalA"
              :page-size="pageSizeA"
              :page-sizes="[5,10,15,20]"
              :current-page.sync="currentPageA"
              @current-change="page => getUserList(page, pageSizeA)"
              @size-change="size => {pageSizeA = size; getUserList(1, size)}"
            ></el-pagination>
          </div>
        </el-col>
        <el-col :span="2" class="shuttle">
          <el-button type="primary" icon="el-icon-arrow-right" @click="toChoose"></el-button>
          <el-button type="info" plain icon="el-icon-arrow-left" @click="leaveChoose"></el-button>
        </el-col>
        <el-col :span="11" class="base-search-table">
          <div class="search-box clearfix">
            <h3>选中用户</h3>
            <!---------------------------- 查询条件 ---------------------------->
            <div class="search-box-right">
              <el-input
                class="input-box"
                v-model="keywordB"
                placeholder="请输入名称"
                size="small"
                clearable
                @clear="searchSelect"
                @keyup.enter.native="searchSelect"
              >
                <el-button slot="append" icon="el-icon-search" @click="searchSelect"></el-button>
              </el-input>
            </div>
          </div>
          <!---------------------------- 表格 ---------------------------->
          <div class="table-content">
            <el-table
              :data="filterSelectList"
              style="width:100%;margin-top:10px;"
              header-row-class-name="table-header"
              @selection-change="rows=>selectRows('B',rows)"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="LOGINNAME" sortable="custom" label="工号"></el-table-column>
              <el-table-column prop="NAME" sortable="custom" label="姓名" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ORGNAME" sortable="custom" label="部门" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveUser">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { fetchUserList, addRoleUser } from "@/api/admin/roles";
export default {
  data() {
    return {
      roleId: null,
      drawer: false,
      drawerLoading: false,
      loading: false,
      userList: [], // 用户列表
      selectList: [], // 选中列表
      filterSelectList: [],
      selectRowsA: [], // 选中的行
      selectRowsB: [],
      keywordA: null,
      keywordB: null,
      totalA: 0,
      totalB: 0,
      currentPageA: 1,
      currentPageB: 1,
      pageSizeA: 10,
      pageSizeB: 10
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.selectList = [];
      this.filterSelectList = [];
      this.keywordA = null;
      this.keywordB = null;
    },
    // 搜索选中用户
    searchSelect() {
      if (this.keywordB) {
        this.filterSelectList = this.selectList.filter(
          i => i.NAME && i.NAME.includes(this.keywordB)
        );
      } else {
        this.filterSelectList = this.selectList.map(i => Object.assign({}, i));
      }
    },
    // 该行是否可以选择
    canSelect(row) {
      let selectIds = this.selectList.map(i => i.ID);
      return !selectIds.includes(row.ID);
    },
    // 选中的行
    selectRows(type, rows) {
      this[`selectRows${type}`] = rows;
    },
    // 点击选中用户
    toChoose() {
      this.selectList = this.selectList.concat(this.selectRowsA);
      this.filterSelectList = this.selectList.map(i => Object.assign({}, i));
      this.$refs.userList.clearSelection();
    },
    // 去掉选中用户
    leaveChoose() {
      this.selectRowsB.forEach(i => {
        let index = this.selectList.findIndex(j => j.ID === i.ID);
        if (index !== -1) {
          this.selectList.splice(index, 1);
        }
      });
      this.totalB = this.selectList.length;
      this.filterSelectList = this.selectList.map(i => Object.assign({}, i));
    },
    // 获取用户列表
    getUserList(page, pageSize) {
      this.loading = true;
      this.currentPageA = page;
      let data = {
        filter: JSON.stringify({
          NOTINROLEID: this.roleId,
          KEYWORD: this.keywordA
        }),
        page: page || 1,
        limit: pageSize || this.pageSizeA
      };
      fetchUserList(data)
        .then(res => {
          this.loading = false;
          this.userList = res.items;
          this.totalA = res.total;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 保存
    saveUser() {
      this.drawerLoading = true;
      let data = {
        data: JSON.stringify({
          ROLEID: this.roleId,
          USERID: this.selectList.map(i => i.ID)
        })
      };
      addRoleUser(data)
        .then(res => {
          this.drawerLoading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "保存成功！"
            });
            this.drawer = false;
            this.$emit("doFunc");
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "保存失败！" + res.data.errInf.shortBusInf
            });
          }
        })
        .catch(err => {
          this.drawerLoading = true;
          this.$message({
            showClose: true,
            type: "error",
            message: "保存失败！" + err
          });
        });
    }
  },
  mounted() {
    this.getUserList(this.currentPageA, this.pageSizeA);
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  padding: 20px 0 10px 10px;
  h3 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
}
.el-row,
.el-col {
  height: 100%;
}
.shuttle {
  padding-top: 200px;
  .el-button {
    display: block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    padding: 0;
    margin: 0 30px 10px;
  }
}
</style>