<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <!-------------------- 保存角色 -------------------->
      <el-form ref="editForm" :model="editForm" :rules="rules" style="margin-bottom:20px;">
        <el-form-item prop="name" label="角色：" style="margin-bottom:16px;" :show-message="false">
          <el-input
            v-model="editForm.name"
            placeholder="请输入角色名称"
            size="small"
            style="width:360px;"
            @input="saveRoleSuccess = false"
          ></el-input>
        </el-form-item>
        <el-button
          v-if="!saveRoleSuccess"
          :type="!editForm.name ? 'info' : 'primary'"
          size="small"
          :disabled="!editForm.name || editForm.name == roleName"
          @click="saveRole"
          style="margin-left:65px;"
          :loading="roleLoading"
        >
          保存角色
        </el-button>
        <el-button
          v-else
          type="info"
          size="small"
          style="margin-left:65px;"
          disabled
          icon="el-icon-success"
        >
          保存成功
        </el-button>
      </el-form>
      <!-------------------- 保存菜单、用户 -------------------->
      <el-tabs v-model="activeTab">
        <!-------------------- 访问菜单 -------------------->
        <el-tab-pane label="访问菜单" name="menu" v-if="canSetMenu">
          <div class="no-role" v-if="!editForm.id">
            <i class="el-icon-warning"></i>
            请先保存角色
          </div>
          <div class="auth-box" v-else v-for="item in authList" :key="item.ID">
            <el-checkbox
              class="auth-box-title"
              v-model="item.checked"
              :indeterminate="item.ISPART"
              @change="val => checkAll(val, item)"
              :disabled="item.ISDEFAULT"
            >
              {{ item.NAME }}
            </el-checkbox>
            <div class="auth-box-content">
              <el-checkbox
                v-for="auth in item.items"
                v-model="auth.checked"
                :label="auth.RESID"
                :key="auth.RESID"
                @change="val => checkChange(val, item)"
                :disabled="auth.ISDEFAULT"
              >
                {{ auth.NAME }}
              </el-checkbox>
            </div>
          </div>
        </el-tab-pane>
        <!-- ------------------ 用户 ------------------
        <el-tab-pane label="用户" name="user">
          <div class="no-role" v-if="!editForm.id">
            <i class="el-icon-warning"></i>
            请先保存角色
          </div>
          <div v-else>
            <el-button v-if="type !== 'view'" type="primary" size="small" @click="addUser">添加用户</el-button>
            <div style="float:right;">
              <el-input
                class="input-box"
                v-model="keyword"
                placeholder="请输入用户"
                size="small"
                clearable
                style="width:200px;"
                prefix-icon="el-icon-search"
              ></el-input>
            </div>
            <el-table
              :data="filterTableData"
              style="width:100%;margin-top:10px;"
              header-row-class-name="table-header"
            >
              <el-table-column prop="USERNAME" label="用户">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.USER"
                    filterable
                    remote
                    placeholder="请输入姓名或工号"
                    :remote-method="remoteMethod"
                    :loading="userloading"
                    @change="val => changeUser(scope.row, val)"
                    size="small"
                    style="width:100%;"
                    v-if="type !== 'view'"
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="JSON.stringify({ID:item.ID,NAME:item.NAME})"
                    >
                      <span>{{item.NAME + '--' + item.ID}}</span>
                    </el-option>
                  </el-select>
                  <span v-else style="color:#666;">{{scope.row.USER}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="res" label="业务领域" show-overflow-tooltip v-if="canSetArea">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.group"
                    filterable
                    placeholder="请选择业务领域"
                    value-key="ID"
                    style="width:100%;"
                    size="small"
                    v-if="type !== 'view'"
                  >
                    <el-option
                      v-for="item in areaList"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="item"
                    >
                      <span>{{item.NAME}}</span>
                    </el-option>
                  </el-select>
                  <span v-else style="color:#666;">{{scope.row.group ? scope.row.group.NAME || "--" : "--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="120" v-if="type !== 'view'">
                <template slot-scope="scope">
                  <div class="more-span">
                    <span @click="deleteUser(scope.$index)">删除</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div class="drawer-footer" v-if="type !== 'view'">
      <el-button type="primary" size="small" :disabled="!editForm.id" @click="saveAll">
        保存
      </el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import {
  saveRole,
  fetchRoleAuth,
  fetchRoleUserAndGroups,
  saveRoleAuth,
  saveRoleUserAndGroups,
  fetchUserList,
} from '@/api/roles';
import { fetchGroupList } from '@/api/roles';
export default {
  data() {
    return {
      type: null, // 类型： 查看、新增、编辑
      title: '新增角色',
      roleName: null,
      drawer: false,
      drawerLoading: false,
      roleLoading: false,
      saveRoleSuccess: false,
      editForm: {
        id: null,
        name: null,
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称！', trigger: 'change' }],
      },
      activeTab: 'menu',
      authList: [],
      tableData: [],
      userList: [],
      userloading: false,
      keyword: null,
      areaList: [],
    };
  },
  computed: {
    // 是否需要设置菜单
    canSetMenu() {
      // 检查人员、企业责任人员不需要菜单
      if (['20211029-3', '20211029-4'].includes(this.editForm.id)) {
        this.activeTab = 'user';
        return false;
      } else {
        return true;
      }
    },
    // 是否需要设置业务领域
    canSetArea() {
      // 系统管理员不需要业务领域
      if (['20211029-1'].includes(this.editForm.id)) {
        return false;
      } else {
        return true;
      }
    },
    // 筛选的tableData
    filterTableData() {
      return this.keyword
        ? this.tableData.filter(i => i.USER.includes(this.keyword))
        : this.tableData;
    },
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      if (this.editForm.id) {
        this.getAuthList();
        this.getUserList();
      }
      this.getAreaList();
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.keyword = null;
      (this.editForm = {
        id: null,
        name: null,
      }),
        (this.roleName = null);
      this.authList = [];
      this.$emit('doFunc');
    },
    // 保存角色
    saveRole() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.roleLoading = true;
          let param = {
            data: JSON.stringify({
              ID: this.editForm.id,
              NAME: this.editForm.name,
              ISUSE: 1,
              DES: '',
              ISDELETE: 0,
              GROUPID: this.$store.state.GROUPID,
            }),
          };
          saveRole(param)
            .then(res => {
              this.roleLoading = false;
              if (res.success) {
                this.saveRoleSuccess = true;
                this.editForm.id = res.item.ID;
                this.roleName = res.item.NAME;
                this.getAuthList();
                if (this.canSetUser) {
                  this.getUserList();
                }
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败：' + res.data.errInf.shortBusInf,
                });
              }
            })
            .catch(err => {
              this.roleLoading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败：' + err,
              });
            });
        }
      });
    },
    // 当前权限组全选
    checkAll(val, item) {
      item.ISPART = false;
      item.items.forEach(i => (i.checked = val));
    },
    // 当前权限组改变选择
    checkChange(val, item) {
      let selectLength = item.items.filter(i => i.checked).length;
      item.checked = selectLength === item.items.length;
      item.ISPART = selectLength > 0 && selectLength < item.items.length;
    },
    // 获取当前角色的权限,MENUPID为当前应用id
    getAuthList() {
      let param = {
        ROLEID: this.editForm.id,
        MENUPID: this.$store.state.GROUPID,
      };
      fetchRoleAuth(param).then(res => {
        this.authList = res.data;
        this.authList.forEach((i, index) => {
          // 2个角色默认权限不可取消
          // 系统管理员220211029-1：系统配置下20211029-4的角色权限20211029-4-1,业务领域管理20211029-4-2
          if (this.editForm.id === '20211029-1' && i.ID === '20211029-4') {
            i.ISDEFAULT = true;
            i.items.forEach((j, index) => {
              if (['20211029-4-1', '20211029-4-2'].includes(j.ID)) j.ISDEFAULT = true;
            });
          }
          // 业务管理员20211029-2：常规检查、专项检查、随机检查
          if (
            this.editForm.id === '20211029-2' &&
            ['20211029-1', '20211029-2', '20211029-3'].includes(i.ID)
          ) {
            i.ISDEFAULT = true;
            i.items.forEach((j, index) => {
              j.ISDEFAULT = true;
            });
          }
          // 业务管理员20211029-2：系统配置下的检查表配置、负责企业管理、检查点管理
          if (this.editForm.id === '20211029-2' && ['20211029-4'].includes(i.ID)) {
            i.ISDEFAULT = true;
            i.items.forEach((j, index) => {
              if (['20211029-4-3', '20211029-4-4', '20211029-4-5'].includes(j.ID))
                j.ISDEFAULT = true;
            });
          }

          // 如果只有一级菜单，则其items添加该一级菜单
          if (i.items.length === 0) {
            i.items.push({
              NAME: i.NAME,
              RESID: i.RESID,
              checked: i.checked,
              ISDEFAULT: i.ISDEFAULT,
            });
          }
          // 设置一级菜单是否全部选中 或者 部分选中
          let selectLength = i.items.filter(j => j.checked).length;
          i.checked = selectLength === i.items.length;
          i.ISPART = selectLength > 0 && selectLength < i.items.length;
        });
      });
    },
    // 添加用户
    addUser() {
      this.tableData.unshift({
        USER: null,
        USERID: null,
        USERNAME: null,
        group: [],
      });
    },
    // 选择用户
    changeUser(row, val) {
      let user = JSON.parse(val);
      if (this.tableData.some(i => i.USERID == user.ID)) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '该用户已存在！',
        });
        row.USER = null;
      } else {
        row.USERID = user.ID;
        row.USERNAME = user.NAME;
        row.USER = `${user.NAME}(${user.ID})`;
      }
    },
    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        let param = {
          page: 1,
          limit: 1000,
          filter: JSON.stringify({
            KEYWORD: query,
          }),
        };
        fetchUserList(param)
          .then(res => {
            this.userloading = false;
            this.userList = res.items || [];
          })
          .catch(err => {
            this.userloading = false;
            this.userList = [];
          });
      } else {
        this.userList = [];
      }
    },
    // 删除用户
    deleteUser(index) {
      this.tableData.splice(index, 1);
    },
    // 获取当前角色的用户
    getUserList() {
      let param = {
        roleId: this.editForm.id,
        appid: this.$store.state.GROUPID,
      };
      fetchRoleUserAndGroups(param).then(res => {
        if (res.success) {
          this.tableData = res.items || [];
          this.tableData.forEach(i => {
            let user = `${i.USERNAME} (${i.USERID})`;
            this.$set(i, 'USER', user);
            i.group.forEach(j => {
              j.ID = j.GROUPID;
              j.NAME = j.GROUPNAME;
              delete j.GROUPID;
              delete j.GROUPNAME;
            });
            i.group = i.group[0];
          });
        }
      });
    },
    // 获取业务领域列表
    getAreaList() {
      this.loading = true;
      let param = {
        filter: JSON.stringify({
          NAME: this.keyword || null,
          APPID: this.$store.state.GROUPID,
        }),
        ISDELETE: 0,
        limit: 1000,
        page: 1,
      };
      fetchGroupList(param).then(res => {
        if (res.success) {
          this.areaList = res.items || [];
        }
      });
    },
    // 保存菜单
    saveAuth() {
      return new Promise((resolve, reject) => {
        // 转换数据
        let checkList = [];
        this.authList.forEach(i => {
          let arr = i.items.filter(j => j.checked);
          checkList = checkList.concat(arr.map(k => k.RESID));
        });
        let param = {
          data: JSON.stringify({
            ROLEID: this.editForm.id,
            RESID: checkList,
          }),
        };
        saveRoleAuth(param)
          .then(res => {
            if (res.success) {
              resolve(res);
            } else {
              reject('菜单保存失败：' + res.data.errInf.shortBusInf);
            }
          })
          .catch(err => {
            reject('菜单保存失败：' + err);
          });
      });
    },
    // 保存用户
    saveUser() {
      return new Promise((resolve, reject) => {
        // 转换数据
        let arr = [];
        this.tableData.forEach(i => {
          if (i.USERID) {
            let groupIds = i.group ? (i.group.ID ? [i.group.ID] : []) : [];
            let obj = {
              USERID: i.USERID,
              GROUPIDs: groupIds,
            };
            arr.push(obj);
          }
        });
        let param = {
          roleId: this.editForm.id,
          appid: this.$store.state.GROUPID,
          arr: JSON.stringify(arr),
        };
        saveRoleUserAndGroups(param)
          .then(res => {
            if (res.success) {
              resolve(res);
            } else {
              reject('用户保存失败：' + res.data.errInf.shortBusInf);
            }
          })
          .catch(err => {
            reject('用户保存失败：' + err);
          });
      });
    },
    // 最终保存
    saveAll() {
      this.drawerLoading = true;
      Promise.all([this.saveAuth(), this.saveUser()])
        .then(res => {
          if (res) {
            this.drawerLoading = false;
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功！',
            });
            this.drawer = false;
          }
        })
        .catch(err => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: 'error',
            message: err,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 30px;
  h4 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border-left: 3px solid #38adff;
    padding-left: 10px;
    line-height: 20px;
    height: 20px;
    margin-bottom: 20px;
  }
  .no-role {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    padding: 9px 0 9px 15px;
    i {
      color: #faad14;
    }
  }
  .auth-box {
    margin-bottom: 10px;
    .el-checkbox {
      width: 145px;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 10px;
    }
    .auth-box-title {
      display: block;
      background: rgba(0, 0, 0, 0.04);
      padding: 8px 10px;
      width: 100%;
      border-radius: 2px;
    }
    .auth-box-content {
      padding: 0 10px;
    }
  }
}
</style>
<style lang="scss">
.drawer-container {
  .el-tabs__header .el-tabs__nav-wrap {
    padding: 0;
  }
  .el-tabs__item.is-active {
    color: #3a78fc !important;
  }
  .el-tabs__active-bar {
    background-color: #3a78fc !important;
  }
}
</style>
  