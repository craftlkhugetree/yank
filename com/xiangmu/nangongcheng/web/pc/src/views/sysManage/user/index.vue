<template>
  <div class="base-search-table bg-white" style="height: auto">
    <search-bar
      :h3="'用户管理'"
      @openAdd="openDrawer('add')"
      @search="search"
      :ph="'请输入用户姓名查询'"
      nodown
      noupload
    ></search-bar>
    <!-- down
      upload -->
    <!---------------------------- 表格 ---------------------------->
    <s-table ref="appMtable" index :params="params" :getList="fetchUserList" :injFun="genRole">
      <el-table-column prop="NAME" label="用户姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="LOGINNAME" label="登录账号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ROLENAME" label="用户角色" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="left" width="180" fixed="right">
        <template slot-scope="scope">
          <div class="more-span">
            <span @click="openDrawer('edit', scope.row)">编辑</span>
            <span @click="resetPwd(scope.row)">重置密码</span>
            <span @click="deleteAccount(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </s-table>
    <!---------------------------- 新增 ---------------------------->
    <account-drawer ref="accountDrawer" @doFunc="refGet"></account-drawer>
  </div>
</template>

<script>
import { fetchUserList, delUser, saveUser, saveUserPwd } from '@/api/roles';
export default {
  components: {
    searchBar: () => import('@/components/SearchBar'),
    accountDrawer: () => import('./AccountDrawer'),
  },
  data() {
    return {
      loading: false,
      tableLoading: false,
      tableData: [],
      keyword: null,
      fetchUserList,
    };
  },
  computed: {
    params() {
      return {
        withRole: true,
        filter: JSON.stringify({
          KEYWORD: this.keyword || null,
          STATUS: '1',
        }),
      };
    },
  },
  methods: {
    // inject
    genRole(arr) {
      arr.forEach(a => {
        if (a.roles && a.roles.length) {
          a.ROLENAME = a.roles[0].NAME;
          a.ROLEID = a.roles[0].ID;
        } else {
          a.ROLENAME = '--';
        }
      });
    },
    // 打开弹窗
    openDrawer(type, row) {
      let drawer = this.$refs.accountDrawer;
      if (type == 'add') {
        drawer.title = '新增用户';
      }
      if (type == 'edit') {
        drawer.title = '编辑用户-' + row.NAME;
        drawer.editForm = {
          ID: row.ID,
          NICKNAME: row.NICKNAME,
          NAME: row.NAME,
          LOGINNAME: row.LOGINNAME,
          PWD: row.PWD,
          ROLEID: row.ROLEID,
        };
      }
      drawer.drawer = true;
    },
    // 重置密码
    resetPwd(row) {
      let msg = `确定重置用户『 ${row.NAME} 』的密码吗？` + '\n' + '系统默认登录密码为『 123456 』';
      this.$confirm(`${msg}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.loading = true;
          let param = {
            data: JSON.stringify({
              ID: row.ID,
              PWD: '123456',
            }),
          };
          saveUserPwd(param)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '重置密码成功！',
                });
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '重置密码失败：' + res.data.message,
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: '重置密码失败：' + err,
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 删除
    deleteAccount(row) {
      const obj = {
        _this: this,
        txt: `是否确认删除账号『 ${row.NAME} 』？`,
        tips: '提示',
        type: 'warning',
      };
      obj.fun = () => {
        this.loading = true;
        let param = {
          d: JSON.stringify({
            ID: row.ID,
            STATUS: '0', // 0删除 1在用 2停用
          }),
        };
        saveUser(param)
          .then(res => {
            this.loading = false;
            if (res && res.success) {
              this.$message({
                showClose: true,
                type: 'success',
                message: `删除成功！`,
              });
              delUser({ userId: row.ID }).then(res => {
                if (res && res.success) this.refGet();
              });
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
    },
    // useEffect
    search(str) {
      if (this.keyword === str) {
        this.refGet();
      }
      this.keyword = str;
    },
    refGet() {
      this.$refs.appMtable.getData && this.$refs.appMtable.getData();
    },
  },
};
</script>

<style lang="scss" scoped></style>
