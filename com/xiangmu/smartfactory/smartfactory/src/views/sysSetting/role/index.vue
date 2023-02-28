<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>角色</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openDrawer('add')"
          >新增</el-button
        >
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column
          prop="name"
          label="角色"
          show-overflow-tooltip
          width="150"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="唯一标识"
          show-overflow-tooltip
          width="150"
        ></el-table-column>
        <el-table-column prop="menus" label="访问菜单" show-overflow-tooltip>
          <template slot-scope="scope">{{
            scope.row.menus.map((i) => i.name).join("，") || "--"
          }}</template>
        </el-table-column>
        <el-table-column prop="users" label="用户" show-overflow-tooltip>
          <template slot-scope="scope">{{
            scope.row.users.map((i) => i.name).join("，") || "--"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="openDrawer('edit', scope.row)">编辑</span>
              <span @click="deleteRole(scope.row)">删除</span>
            </div>
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
          :page-sizes="[5, 10, 15, 20]"
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
    <!---------------------------- 新增角色 ---------------------------->
    <auth-drawer ref="authDrawer" @doFunc="getTableData"></auth-drawer>
  </div>
</template>

<script>
import AuthDrawer from "./authDrawer";
import { fetchRoleList, deleteRole } from "@/api/admin/role";
export default {
  components: {
    AuthDrawer,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    // 打开弹窗
    openDrawer(type, row) {
      let authDrawer = this.$refs.authDrawer;
      authDrawer.saveRoleSuccess = false;
      if (type == "add") {
        authDrawer.title = "新增角色";
      } else if (type == "edit") {
        authDrawer.title = "编辑角色-" + row.name;
        authDrawer.editForm.id = row.id;
        authDrawer.editForm.name = row.name;
        authDrawer.editForm.code = row.code;
        let users = row.users || [];
        authDrawer.tableData = users.map(i => {
          return {
            ...i,
            user:`${i.name} (${i.loginname})`
          }
        });
        let menus = row.menus || [];
        authDrawer.menuIds = menus.map((i) => i.id);
      }
      authDrawer.drawer = true;
    },
    // 获取角色列表
    getTableData(page, pageSize) {
      this.loading = true;
      let param = {
        page: page || 1,
        limit: pageSize || this.pageSize,
        filter: {},
      };
      fetchRoleList(param)
        .then((res) => {
          this.loading = false;
          if (res.code == "000000") {
            this.tableData = res.data || [];
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 删除
    deleteRole(row) {
      if (!row.users || row.users.length == 0) {
        this.$confirm(`是否确认删除该角色？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.loading = true;
            deleteRole(row.id)
              .then((res) => {
                this.loading = false;
                if (res.code == "000000") {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: `删除成功！`,
                  });
                  this.getTableData();
                } else {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: `删除失败：${res.msg}`,
                  });
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${err}`,
                });
              });
          })
          .catch(() => {
            return;
          });
      } else {
        this.$confirm("该角色包含用户，不可删除。", "角色不能删除", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning",
        });
      }
    },
  },
  created() {
    this.getTableData();
  },
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
}
</style>