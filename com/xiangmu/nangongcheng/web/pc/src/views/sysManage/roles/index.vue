<template>
  <div class="base-search-table bg-white" style="height: auto">
    <search-bar :h3="'角色权限'" @openAdd="openDrawer('add')" nosearch nodown noupload></search-bar>
    <!---------------------------- 表格 ---------------------------->
    <s-table ref="appMtable" index :getList="fetchRoleList" :injFun="genRole">
      <el-table-column prop="NAME" label="角色" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="res" label="访问菜单" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.res.map(i => i.RESNAME).join('，') || '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="user" label="用户" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.user.map(i => i.USERNAME).join('、') || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="100" fixed="right">
        <template slot-scope="scope">
          <div class="more-span">
            <!-- <span v-if="scope.row.ID == '20211029-4'" @click="openDrawer('view', scope.row)">
              查看
            </span> -->
            <span @click="openDrawer('edit', scope.row)">编辑</span>
            <span @click="deleteRole(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </s-table>
    <!---------------------------- 新增角色 ---------------------------->
    <auth-drawer ref="authDrawer" @doFunc="refGet"></auth-drawer>
  </div>
</template>

<script>
import AuthDrawer from './authDrawer';
import { fetchRoleList, fetchUserList, deleteRole } from '@/api/roles';
export default {
  components: {
    AuthDrawer,
    searchBar: () => import('@/components/SearchBar'),
  },
  data() {
    return {
      loading: false,
      tableData: [],
      fetchRoleList,
    };
  },
  methods: {
    genRole(arr) {
      arr.sort((a, b) => {
        if (a.CODE) {
          return -1;
        } else if (b.CODE) {
          return 1;
        }
      });
    },
    refGet() {
      this.$refs.appMtable.getData && this.$refs.appMtable.getData();
    },
    // 打开弹窗
    openDrawer(type, row) {
      let authDrawer = this.$refs.authDrawer;
      authDrawer.saveRoleSuccess = false;
      authDrawer.activeTab = 'menu';
      if (type == 'add') {
        authDrawer.title = '新增角色';
      } else if (type == 'edit') {
        authDrawer.title = '编辑角色-' + row.NAME;
        authDrawer.roleName = row.NAME;
        authDrawer.editForm.id = row.ID;
        authDrawer.editForm.name = row.NAME;
      } else if (type == 'view') {
        authDrawer.title = '查看角色-' + row.NAME;
        authDrawer.roleName = row.NAME;
        authDrawer.editForm.id = row.ID;
        authDrawer.editForm.name = row.NAME;
      }
      authDrawer.type = type;
      authDrawer.drawer = true;
    },
    // 删除
    deleteRole(row) {
      let data = {
        page: 1,
        limit: 10,
        filter: JSON.stringify({
          ROLEID: row.ID,
          NOTADMIN: '1',
        }),
      };
      fetchUserList(data).then(res => {
        if (res.success) {
          if (res.total === 0) {
            const obj = {
              _this: this,
              txt: `是否确认删除该角色？`,
              tips: '提示',
              type: 'warning',
            };
            obj.fun = () => {
              this.loading = true;
              let param = {
                data: JSON.stringify({ ID: [row.ID] }),
              };
              deleteRole(param)
                .then(res => {
                  this.loading = false;
                  if (res.success) {
                    this.$message({
                      showClose: true,
                      type: 'success',
                      message: `删除成功！`,
                    });
                    this.refGet();
                  } else {
                    this.$message({
                      showClose: true,
                      type: 'error',
                      message: `删除失败`,
                    });
                  }
                })
                .catch(err => {
                  this.loading = false;
                  this.$message({
                    showClose: true,
                    type: 'error',
                    message: `删除失败：${err}`,
                  });
                });
            };
            this.common.showPopup(obj);
          } else {
            this.$confirm('该角色包含用户,不可删除。', '角色不能删除', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning',
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
}
</style>
