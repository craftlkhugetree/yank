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
    size="660"
  >
    <div class="drawer-container">
      <!-------------------- 保存角色 -------------------->
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        style="margin-bottom:20px;"
      >
        <el-form-item
          prop="name"
          label="角色："
          style="margin-bottom:16px;"
          :show-message="false"
        >
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
          >保存角色</el-button
        >
        <el-button
          v-else
          type="info"
          size="small"
          style="margin-left:65px;"
          disabled
          icon="el-icon-success"
          >保存成功</el-button
        >
      </el-form>
      <!-------------------- 保存菜单、用户 -------------------->
      <el-tabs v-model="activeTab">
        <!-------------------- 访问菜单 -------------------->
        <el-tab-pane label="访问菜单" name="menu">
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
              >{{ item.NAME }}</el-checkbox
            >
            <div class="auth-box-content">
              <el-checkbox
                v-for="auth in item.items"
                v-model="auth.checked"
                :label="auth.RESID"
                :key="auth.ID"
                @change="val => checkChange(val, item)"
                :disabled="auth.ISDEFAULT"
                >{{ auth.NAME }}</el-checkbox
              >
            </div>
          </div>
        </el-tab-pane>
        <!-------------------- 用户 -------------------->
        <el-tab-pane label="用户" name="user">
          <div class="no-role" v-if="!editForm.id">
            <i class="el-icon-warning"></i>
            请先保存角色
          </div>
          <div v-else>
            <el-button type="primary" size="small" @click="addUser"
              >添加用户</el-button
            >
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
              style="width:100%"
              header-row-class-name="table-header"
            >
              <el-table-column prop="USERNAME" label="用户" width="200">
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
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="JSON.stringify({ ID: item.ID, NAME: item.NAME })"
                    >
                      <span>{{ item.NAME + "--" + item.ID }}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="res"
                label="业务领域"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.group"
                    multiple
                    filterable
                    placeholder="请选择业务领域"
                    value-key="ID"
                    style="width:100%;"
                    size="small"
                    @remove-tag="removeTag($event, scope.row)"
                  >
                    <el-option
                      v-for="item in deptList"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="item"
                    >
                      <span>{{ item.NAME }}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <div class="more-span">
                    <span @click="deleteUser(scope.$index, scope.row)"
                      >删除</span
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="drawer-footer">
      <el-button
        type="primary"
        size="small"
        :disabled="!editForm.id"
        @click="saveAll"
        >保存</el-button
      >
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      title: "新增角色",
      roleName: null,
      drawer: false,
      drawerLoading: false,
      roleLoading: false,
      saveRoleSuccess: false,
      editForm: {
        id: null,
        name: null
      },
      rules: {
        name: [
          { required: true, message: "请输入角色名称！", trigger: "change" }
        ]
      },
      activeTab: "menu",
      authList: [],
      tableData: [],
      userList: [],
      userloading: false,
      keyword: null
    };
  },
  computed: {
    // 业务领域列表
    deptList() {
      return this.$store.state.departments;
    },
    // 筛选的tableData
    filterTableData() {
      return this.keyword
        ? this.tableData.filter(i => i.USER && i.USER.includes(this.keyword))
        : this.tableData;
    }
  },
  methods: {
    // 移除单个标签
    deleteGroupUsers(id) {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/deleteGroupUsers",
          data: {
            IDs: id
          }
        })
        .then(res => {});
    },
    // 移除单个标签
    removeTag(val, row) {
      const obj =
        (row && row.groupBK && row.groupBK.find(g => g.ID === val.ID)) || {};
      obj && obj.delID && this.deleteGroupUsers(obj.delID);
    },
    // 打开抽屉
    openDrawer() {
      if (this.editForm.id) {
        this.getAuthList();
        this.getUserList();
      }
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.keyword = null;
      (this.editForm = {
        id: null,
        name: null
      }),
        (this.roleName = null);
      this.authList = [];
      this.$emit("doFunc");
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
                this.saveRoleSuccess = true;
                this.editForm.id = res.item.ID;
                this.roleName = res.item.NAME;
                this.getAuthList();
                this.getUserList();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "保存失败：" + res.data.errInf.metailBusInf
                });
              }
            })
            .catch(err => {
              this.roleLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + err
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
      this.util
        .postAjax({
          code: "auth",
          url: "rest/Role/getRoleByMenupid",
          data: {
            ROLEID: this.editForm.id,
            MENUPID: this.$store.state.GROUPID
          }
        })
        .then(res => {
          this.authList = res.data;
          this.authList.forEach((i, index) => {
            // 三个角色默认权限不可取消
            // 后勤管理员 部门管理员 默认菜单 回复管理 9100003-2
            if (
              ["9100003-1", "9100003-2"].includes(this.editForm.id) &&
              i.RESID === "9100003-2"
            ) {
              i.ISDEFAULT = true;
            }
            // 全校师生 默认菜单 首页
            if (this.editForm.id === "9100003-3" && i.RESID === "9100003-1") {
              i.ISDEFAULT = true;
            }
            // 统计分析
            if (i.ID == "9100003-3") {
              i.items.forEach(j => {
                // 分析维度、业务领域
                if (["9100003-3-2", "9100003-3-3"].includes(j.ID)) {
                  if (j.items.every(k => k.checked)) {
                    this.$set(j, "checked", true);
                  } else {
                    this.$set(j, "checked", false);
                  }
                }
              });
            }

            // 如果只有一级菜单，则其items添加该一级菜单
            if (i.items.length === 0) {
              i.items.push({
                NAME: i.NAME,
                RESID: i.RESID,
                checked: i.checked,
                ISDEFAULT: i.ISDEFAULT
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
      this.keyword = "";
      this.tableData.unshift({
        USER: null,
        USERID: null,
        USERNAME: null,
        group: []
      });
    },
    // 选择用户
    changeUser(row, val) {
      let user = JSON.parse(val);
      if (this.tableData.some(i => i.USERID == user.ID)) {
        this.$message({
          showClose: true,
          type: "error",
          message: "该用户已存在！"
        });
        row.USER = null;
      } else {
        row.USERID = user.ID;
        row.USERNAME = user.NAME;
        row.USER = `${user.NAME}(${user.ID})`;
        this.getUserGroup(row);
      }
    },
    // 获取单个用户业务领域
    getUserGroup(row) {
      let appId = this.deptList.find(d => d.APPID) || {};
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/getUserGroup",
          data: {
            appid: appId.APPID,
            userid: row.USERID
          }
        })
        .then(res => {
          if (res && res.success) {
            const tmp = res.items;
            this.tableData.some(t => {
              if (t.USERID === row.USERID) {
                t.group = [];
                t.groupBK = [];
                tmp.forEach(i => {
                  const obj = { delID: i.GROUPUSERID, ID: i.ID, NAME: i.NAME };
                  t.group.push(obj);
                  t.groupBK.push({ ...obj });
                });
              }
            });
          }
        });
    },
    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        this.common
          .getUserList(1, query)
          .then(res => {
            this.userloading = false;
            this.userList = res.items;
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
    deleteUser(index, row) {
      //console.log('index'+index);
      //console.log(row);

      let newSet = new Set(this.tableData);
      newSet.delete(row);
      this.tableData = [...newSet];
      //console.log(this.tableData);

      //this.tableData.filter(i => i.USER && i.USER.includes(this.keyword))
      //this.tableData.splice(index, 1);
    },
    // 获取当前角色的用户
    getUserList() {
      this.util
        .postAjax({
          code: "auth",
          url: "rest/Role/getRoleUsers2groups",
          data: {
            roleId: this.editForm.id,
            appid: this.$store.state.GROUPID
          }
        })
        .then(res => {
          if (res.success) {
            this.tableData = res.items || [];
            this.tableData.forEach(i => {
              let user = `${i.USERNAME}(${i.USERID})`;
              this.$set(i, "USER", user);
              i.group.forEach(j => {
                j.delID = j.GROUPUSERID;
                j.ID = j.GROUPID;
                j.NAME = j.GROUPNAME;
                delete j.GROUPID;
                delete j.GROUPNAME;
              });
              i.groupBK = [...i.group];
            });
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
          arr.forEach(k => {
            if (k.RESID) {
              checkList.push(k.RESID);
            } else {
              // 如果勾选了分析维度
              if (k.ID == "9100003-3-2") {
                checkList = checkList.concat([
                  "9100003-4",
                  "9100003-5",
                  "9100003-6",
                  "9100003-7",
                  "9100003-8"
                ]);
                // 如果勾选了业务领域分析
              } else if (k.ID == "9100003-3-3") {
                checkList = checkList.concat([
                  "9100003-9",
                  "9100003-a",
                  "9100003-b",
                  "9100003-c",
                  "9100003-d",
                  "9100003-e"
                ]);
              }
            }
          });
        });
        this.util
          .postAjax({
            code: "auth",
            url: "rest/Role/saveAuth",
            data: {
              data: JSON.stringify({
                ROLEID: this.editForm.id,
                RESID: checkList
              })
            }
          })
          .then(res => {
            if (res.success) {
              resolve(res);
            } else {
              reject("菜单保存失败：" + res.data.errInf.shortBusInf);
            }
          })
          .catch(err => {
            reject("菜单保存失败：" + err);
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
            let obj = {
              USERID: i.USERID,
              GROUPIDs: i.group.map(j => j.ID)
            };
            arr.push(obj);
          }
        });
        this.util
          .postAjax({
            code: "auth",
            url: "rest/Role/saveRoleUser2Group",
            data: {
              roleId: this.editForm.id,
              appid: this.$store.state.GROUPID,
              arr: JSON.stringify(arr)
            }
          })
          .then(res => {
            if (res.success) {
              resolve(res);
            } else {
              reject("用户保存失败：" + res.data.errInf.shortBusInf);
            }
          })
          .catch(err => {
            reject("用户保存失败：" + err);
          });
      });
    },
    // 最终保存
    saveAll() {
      this.drawerLoading = true;
      Promise.all([this.saveAuth(), this.saveUser()])
        .then(res => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功！"
          });
          this.drawer = false;
        })
        .catch(err => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: err
          });
        });
    }
  }
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
    .auth-box-title {
      display: block;
      background: rgba(0, 0, 0, 0.04);
      padding: 8px 10px;
      width: 100%;
      border-radius: 2px;
    }
    .el-checkbox {
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 10px;
      margin-right: 60px;
    }
    .auth-box-content {
      padding: 0 10px;
    }
  }
}
</style>
<style lang="scss">
.drawer-container {
  .el-tabs__item.is-active {
    color: #3a78fc !important;
  }
  .el-tabs__active-bar {
    background-color: #3a78fc !important;
  }
}
</style>
