<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3>角色</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openDrawer('add')"
        >新增</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%;margin-top:10px;"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column prop="NAME" label="角色" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="res" label="访问菜单" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.res.map(i => i.RESNAME).join("，") || "--"}}</template>
        </el-table-column>
        <el-table-column prop="user" label="用户" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.user.map(i => i.USERNAME).join("，") || "--"}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span v-if="scope.row.ID !== '20210604-1'" @click="openDrawer('edit',scope.row)">编辑</span>
              <span v-if="scope.row.CODE !=='default'" @click="deleteRole(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!---------------------------- 新增角色 ---------------------------->
    <auth-drawer ref="authDrawer" @doFunc="getTableData"></auth-drawer>
  </div>
</template>

<script>
import AuthDrawer from "./authDrawer";
import { fetchRoleList, fetchUserList, deleteRole } from "@/api/admin/roles";
export default {
  components: {
    AuthDrawer
  },
  data() {
    return {
      loading: false,
      tableData: []
    };
  },
  methods: {
    // 打开弹窗
    openDrawer(type, row) {
      let authDrawer = this.$refs.authDrawer;
      authDrawer.saveRoleSuccess = false;
      authDrawer.activeTab = "menu";
      if (type == "add") {
        authDrawer.title = "新增角色";
      } else if (type == "edit") {
        authDrawer.title = "编辑角色-" + row.NAME;
        authDrawer.roleName = row.NAME;
        authDrawer.editForm.id = row.ID;
        authDrawer.editForm.name = row.NAME;
      }
      authDrawer.drawer = true;
    },
    // 获取角色列表
    getTableData(page, pageSize) {
      this.loading = true;
      fetchRoleList()
        .then(res => {
          this.loading = false;
          this.tableData = res.items || [];
          this.tableData.sort((a, b) => {
            if (a.CODE) {
              return -1;
            } else if (b.CODE) {
              return 1;
            }
          });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 删除
    deleteRole(row) {
      let data = {
        page: 1,
        limit: 10,
        filter: JSON.stringify({
          ROLEID: row.ID,
          NOTADMIN: "1"
        })
      };
      fetchUserList(data)
        .then(res => {
          if (res.success) {
            if (res.total === 0) {
              this.$confirm(`是否确认删除该角色？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.loading = true;
                  let param = {
                    data: JSON.stringify({ ID: [row.ID] })
                  };
                  deleteRole(param)
                    .then(res => {
                      this.loading = false;
                      if (res.success) {
                        this.$message({
                          showClose: true,
                          type: "success",
                          message: `删除成功！`
                        });
                        this.getTableData();
                      } else {
                        this.$message({
                          showClose: true,
                          type: "error",
                          message: `删除失败：${res.data.errInf.shortBusInf}`
                        });
                      }
                    })
                    .catch(err => {
                      this.loading = false;
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
          this.loading = false;
        });
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
}
</style>