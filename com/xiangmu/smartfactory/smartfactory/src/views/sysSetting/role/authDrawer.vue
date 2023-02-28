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
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        style="margin-bottom: 20px"
      >
        <el-form-item
          prop="name"
          label="角色名称："
          style="margin-bottom: 16px"
          :show-message="false"
        >
          <el-input
            v-model="editForm.name"
            placeholder="请输入角色名称"
            size="small"
            style="width: 360px"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="code"
          label="唯一标识："
          style="margin-bottom: 16px"
          :show-message="false"
        >
          <el-input
            v-model="editForm.code"
            placeholder="请输入唯一标识"
            size="small"
            style="width: 360px"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-------------------- 保存菜单、用户 -------------------->
      <el-tabs v-model="activeTab">
        <!-------------------- 访问菜单 -------------------->
        <el-tab-pane label="访问菜单" name="menu">
          <el-tree
            ref="tree"
            :data="menuList"
            node-key="id"
            :props="{ label: 'name', children: 'children' }"
            show-checkbox
            :default-checked-keys="menuIds"
          ></el-tree>
        </el-tab-pane>
        <!-------------------- 用户 -------------------->
        <el-tab-pane label="用户" name="user">
          <div>
            <el-button type="primary" size="small" @click="addUser"
              >添加用户</el-button
            >
            <div style="float: right">
              <el-input
                class="input-box"
                v-model="keyword"
                placeholder="请输入用户"
                size="small"
                clearable
                style="width: 200px"
                prefix-icon="el-icon-search"
              ></el-input>
            </div>
            <el-table
              :data="filterTableData"
              style="width: 100%"
              header-row-class-name="table-header"
            >
              <el-table-column prop="name" label="用户">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.user"
                    filterable
                    remote
                    placeholder="请输入姓名或登录名"
                    :remote-method="remoteMethod"
                    :loading="userloading"
                    @change="(val) => changeUser(scope.row, val)"
                    size="small"
                    style="width: 350px"
                  >
                    <el-option
                      v-for="item in userList"
                      :key="item.ID"
                      :label="item.name"
                      :value="
                        JSON.stringify({
                          id: item.id,
                          loginname: item.loginname,
                          name: item.name,
                        })
                      "
                    >
                      <span>{{ item.name + "--" + item.loginname }}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                  <div class="more-span">
                    <span @click="deleteUser(scope.$index)">删除</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveRole">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { saveRole } from "@/api/admin/role";
import { fetchUserList } from "@/api/admin/user";
import { fetchAllMenuList } from "@/api/admin/menu";
export default {
  data() {
    return {
      title: "新增角色",
      drawer: false,
      drawerLoading: false,
      editForm: {
        id: null,
        name: null,
        code: null,
      },
      rules: {
        name: [
          { required: true, message: "请输入角色名称！", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入唯一标识！", trigger: "change" },
        ],
      },
      activeTab: "menu",
      menuIds: [],
      menuList: [],
      tableData: [],
      userList: [],
      userloading: false,
      keyword: null,
    };
  },
  computed: {
    // 筛选的tableData
    filterTableData() {
      return this.keyword
        ? this.tableData.filter(i => i.user && i.user.includes(this.keyword))
        : this.tableData;
    },
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      this.getMenuList();
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.keyword = null;
      (this.editForm = {
        id: null,
        name: null,
        code: null,
      }),
      this.menuIds = [];
      this.menuList = [];
      this.userList = [];
      this.tableData = [];
      this.$emit("doFunc");
    },
    // 获取选中的节点
    getCheckedMenu(arr) {
      arr.forEach(i => {
        let index = this.menuIds.findIndex(id => i.id == id)
        if(index >= 0) {
          if(i.children) {
            this.getCheckedMenu(i.children)
            if(i.children.some(j => !this.menuIds.includes(j.id))) {
              this.menuIds.splice(index, 1)
            }
          }
        }
      })
    },
    // 保存角色
    saveRole() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let menuIds = this.$refs.tree.getCheckedKeys();
          this.roleLoading = true;
          let param = {
            id: this.editForm.id,
            name: this.editForm.name,
            code: this.editForm.code,
            menuIds: menuIds,
            userIds: this.tableData.map(i => i.id)
          };
          saveRole(param)
            .then((res) => {
              this.roleLoading = false;
              if (res.code == "000000") {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功！",
                });
                this.drawer = false;
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "保存失败：" + res.msg,
                });
              }
            })
            .catch((err) => {
              this.roleLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + err,
              });
            });
        }
      });
    },
    // 添加用户
    addUser() {
      this.keyword = null;
      this.tableData.unshift({
        id: null,
        loginname: null,
        name: null,
      });
    },
    // 选择用户
    changeUser(row, val) {
      let user = JSON.parse(val);
      if (this.tableData.some((i) => i.id == user.id && i.id !== row.id)) {
        this.$message({
          showClose: true,
          type: "error",
          message: "该用户已存在！",
        });
        row.user = null;
      } else {
        row.id = user.id;
        row.loginname = user.loginname;
        row.name = user.name;
        row.user = `${user.name}(${user.loginname})`;
      }
    },
    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        let param = {
          page: 1,
          limit: 1000,
          filter: {
            keyword: query,
          },
        };
        fetchUserList(param)
          .then((res) => {
            this.userloading = false;
            if (res.code == "000000") {
              this.userList = res.data;
            } else {
              this.userList = [];
            }
          })
          .catch((err) => {
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
    // 获取菜单
    getMenuList() {
      fetchAllMenuList({}).then((res) => {
        if (res.code == "000000") {
          this.menuList = res.data || [];
          this.getCheckedMenu(this.menuList)
        }
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
