<template>
  <div class="main-div" ref="mainDiv">
    <div class="left-div base-search-table">
      <div class="search-box clearfix" style="padding-right:0">
        <h3>角色</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">新增</el-button>
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
        <el-table-column prop="NAME" label="角色"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.CODE !=='default'" @click.stop="editRole(scope.row)">编辑</span>
            <span @click.stop="openAuthDrawer(scope.row)">菜单配置</span>
            <span v-if="scope.row.CODE !=='default'" @click.stop="deleteRole(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="right-div base-search-table">
      <div class="search-box clearfix">
        <h3>{{selectRoleName}}用户</h3>
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
            @click="openUserDrawer"
          >新增</el-button>
          <el-button class="orange-btn" size="small" icon="el-icon-close" @click="deleteUser">删除</el-button>
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
          <el-table-column
            prop="ORGNAME"
            sortable="custom"
            label="部门"
            :formatter="common.defaultFormat"
          ></el-table-column>
          <!-- <el-table-column prop="USERTYPE" sortable="custom" label="用户类型" :formatter="common.defaultFormat"></el-table-column> -->
          <el-table-column prop="SEX" label="性别">
            <template slot-scope="scope">
              <p v-if="scope.row.SEX == 0">男</p>
              <p v-if="scope.row.SEX == 1">女</p>
              <p v-if="!scope.row.SEX">--</p>
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
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
    </div>
    <!---------------------------- 弹窗 ---------------------------->
    <el-dialog
      class="base-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="400px"
      @close="cancelDialog"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules">
        <el-form-item prop="name" label="角色">
          <el-input v-model="editForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="saveRole">提交</el-button>
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!---------------------------- 权限维护弹窗 ---------------------------->
    <auth-drawer ref="authDrawer" @doFunc="getTableData(1,pageSize)"></auth-drawer>
    <!---------------------------- 添加用户弹窗 ---------------------------->
    <user-drawer ref="userDrawer" @doFunc="getTableData(currentPage,pageSize)"></user-drawer>
  </div>
</template>

<script>
import authDrawer from "./authDrawer";
import userDrawer from "./userDrawer";
export default {
  components: {
    authDrawer,
    userDrawer
  },
  data() {
    return {
      roleLoading: false,
      tableHeight: "500px",
      selectRoleId: null,
      selectRoleName: null,
      roleData: [],
      loading: false,
      keyword: null,
      tableData: [],
      selectedRows: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      title: "新增角色",
      editForm: {
        id: null,
        name: null
      },
      rules: {
        name: [
          { required: true, message: "请输入角色名称！", trigger: "change" }
        ]
      },
      dialogVisible: false
    };
  },
  methods: {
    // 点击角色
    rowClick(row) {
      this.$refs.roleTable.setCurrentRow(row);
      this.selectRoleId = row.ID;
      this.selectRoleName = row.NAME;
      this.getTableData(1, this.pageSize);
    },
    // 获取角色
    getRoleData() {
      this.roleLoading = true;
      this.util
        .postAjax({
          code: "auth",
          url: "rest/Role/list",
          data: {
            filter: JSON.stringify({
              ISUSE: 1,
              ISDELETE: 0,
              GROUPID: this.$store.state.GROUPID
            })
          }
        })
        .then(res => {
          this.roleLoading = false;
          if (res.success) {
            this.roleData = res.items || [];
            this.roleData.sort((a, b) => {
              if (a.CODE) {
                return -1;
              } else if (b.CODE) {
                return 1;
              }
            });
            this.rowClick(this.roleData[0]);
          }
        })
        .catch(err => {
          this.roleLoading = false;
        });
    },
    // 获取用户
    getTableData(page, pageSize) {
      this.loading = true;
      this.currentPage = page;
      this.util
        .postAjax({
          code: "auth",
          url: "rest/User/simpleList",
          data: {
            filter: JSON.stringify({
              KEYWORD: this.keyword,
              ROLEID: this.selectRoleId || "none",
              STATUS: "1" // 固定必传
            }),
            page: page || 1,
            limit: pageSize || this.pageSize
          }
        })
        .then(res => {
          this.loading = false;
          this.tableData = res.items;
          this.total = res.total;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 选择行
    selectRows(rows) {
      this.selectedRows = rows;
    },
    // 编辑
    editRole(row) {
      this.editForm.id = row.ID;
      this.editForm.name = row.NAME;
      this.title = "编辑角色";
      this.dialogVisible = true;
    },
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        name: null
      };
      this.title = "新增角色";
    },
    // 保存角色
    saveRole() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.roleLoading = true;
          this.util
            .postAjax({
              code: "auth",
              url: "rest/Role/save",
              data: {
                data: JSON.stringify({
                  ID: this.editForm.id,
                  NAME: this.editForm.name,
                  ISUSE: 1,
                  DES: "",
                  ISDELETE: 0,
                  GROUPID: this.$store.state.GROUPID
                })
              }
            })
            .then(res => {
              this.roleLoading = false;
              if (res.success) {
                this.dialogVisible = false;
                this.getRoleData();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "提交失败：" + res.data.errInf.shortBusInf
                });
              }
            })
            .catch(err => {
              this.roleLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "提交失败：" + err
              });
            });
        }
      });
    },
    // 删除
    deleteRole(row) {
      this.util
        .postAjax({
          code: "auth",
          url: "rest/User/simpleList",
          data: {
            page: 1,
            limit: 10,
            filter: JSON.stringify({
              ROLEID: row.ID,
              NOTADMIN: "1"
            })
          }
        })
        .then(res => {
          if (res.success) {
            if (res.total === 0) {
              this.$confirm(`是否确认删除该角色？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.roleLoading = true;
                  this.util
                    .postAjax({
                      code: "auth",
                      url: "rest/Role/delete",
                      data: {
                        data: JSON.stringify({ ID: [row.ID] })
                      }
                    })
                    .then(res => {
                      this.roleLoading = false;
                      if (res.success) {
                        this.$message({
                          showClose: true,
                          type: "success",
                          message: `删除成功！`
                        });
                        this.getRoleData();
                      } else {
                        this.$message({
                          showClose: true,
                          type: "error",
                          message: `删除失败：${res.data.errInf.shortBusInf}`
                        });
                      }
                    })
                    .catch(err => {
                      this.roleLoading = false;
                      this.$message({
                        showClose: true,
                        type: "error",
                        message: `删除失败：${err}`
                      });
                    });
                })
                .catch(() => {
                  return;
                });
            } else {
              this.$confirm("该角色包含用户,不可删除。", "角色不能删除", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning"
              });
            }
          }
        })
        .catch(err => {
          this.roleLoading = false;
        });
    },
    // 打开权限弹窗
    openAuthDrawer(row) {
      this.$refs.authDrawer.roleId = row.ID;
      this.$refs.authDrawer.roleName = row.NAME;
      this.$refs.authDrawer.drawer = true;
      this.$refs.authDrawer.getAuthList();
    },
    // 打开添加用户弹窗
    openUserDrawer() {
      if (this.selectRoleId) {
        this.$refs.userDrawer.roleId = this.selectRoleId;
        this.$refs.userDrawer.drawer = true;
        this.$refs.userDrawer.getUserList();
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择一个角色！"
        });
      }
    },
    // 删除用户
    deleteUser() {
      if (this.selectedRows.length === 0) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择需要删除的用户！"
        });
        return;
      }
      this.$confirm(`是否确认删除该用户？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: "auth",
              url: "rest/Role/delUser",
              data: {
                data: JSON.stringify({
                  ROLEID: this.selectRoleId,
                  USERID: this.selectedRows.map(i => i.ID)
                })
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "删除成功！"
                });
                this.getTableData(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "删除失败！" + res.data.errInf.shortBusInf
                });
              }
            })
            .catch(err => {
              this.loading = true;
              this.$message({
                showClose: true,
                type: "error",
                message: "删除失败！" + err
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 初始化表格高度
    initTableHeight() {
      this.tableHeight = this.$refs.mainDiv.offsetHeight - 92;
    }
  },
  mounted() {
    this.getRoleData();
    this.$nextTick(() => {
      this.initTableHeight();
    });
  }
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 100%;
  height: 100%;
  min-height: 800px;
  margin: 0 auto;
  padding: 20px 0 0;
  .left-div,
  .right-div {
    height: 100%;
    background: #ffffff;
  }
  .left-div {
    width: 320px;
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
    width: calc(100% - 340px);
    float: right;
  }
}
</style>