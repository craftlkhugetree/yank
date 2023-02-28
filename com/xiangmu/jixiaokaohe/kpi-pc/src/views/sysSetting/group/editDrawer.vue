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
      <el-form
        ref="editForm"
        :model="editForm"
        style="padding:0 30px;"
        label-width="140px"
        label-position="right"
        :rules="rules"
      >
        <!-------------------------------- 分管领导 -------------------------------->
        <el-form-item label="分管领导：" prop="leaders" v-if="type == 'leaders'">
          <div class="select-box" v-for="(leader,index) in leadersArr" :key="index">
            <base-user-select
              :vmodel.sync="editForm.leaders[index]"
              @doFunc="val => changeSelect('leaders', index, val)"
            ></base-user-select>
            <i class="el-icon-delete" @click="deleteSelect('leaders', index)"></i>
          </div>
          <div class="add" @click="addSelect('leaders')">
            <i class="el-icon-plus"></i>
            添加分管领导
          </div>
        </el-form-item>
        <!-------------------------------- 考核工作组 -------------------------------->
        <el-form-item label="考核工作组成员：" prop="workers" required v-if="type == 'workers'">
          <div class="select-box" v-for="(worker,index) in workersArr" :key="index">
            <base-user-select
              :vmodel.sync="editForm.workers[index]"
              @doFunc="val => changeSelect('workers', index, val)"
            ></base-user-select>
            <i class="el-icon-delete" @click="deleteSelect('workers', index)"></i>
          </div>
          <div class="add" @click="addSelect('workers')">
            <i class="el-icon-plus"></i>
            添加考核工作组
          </div>
        </el-form-item>
        <!-------------------------------- 被考核人 -------------------------------->
        <el-form-item label="被考核人：" prop="users" required v-if="type == 'users'">
          <div class="select-box" v-for="(user,index) in usersArr" :key="index">
            <base-user-select
              :vmodel.sync="editForm.users[index]"
              :noGroup="true"
              @doFunc="val => changeSelect('users', index, val)"
            ></base-user-select>
            <i class="el-icon-delete" @click="deleteSelect('users', index)"></i>
          </div>
          <div class="add" @click="addSelect('users')">
            <i class="el-icon-plus"></i>
            添加被考核人
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSave">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import {
  saveGroupLeader,
  saveGroupWorker,
  saveGroupUser,
  getUserLeaderGroups,
  getUserWorkGroups
} from "@/api/admin/group.js";
import {
  fetchRoleUserAndGroups,
  addRoleUser,
  deleteRoleUser
} from "@/api/admin/roles";
import { fetchAllUserList } from "@/api/admin/users.js";
import BaseUserSelect from "@/components/BaseUserSelect";
export default {
  components: {
    BaseUserSelect
  },
  data() {
    let validateArr = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      type: null, // 分管领导leaders、工作组workers、被考核人users
      drawer: false,
      drawerLoading: false,
      title: null,
      groupId: null,
      editForm: {
        leaders: [],
        workers: [],
        users: []
      },
      rules: {
        leaders: [
          { required: true, validator: validateArr, message: "请添加分管领导" }
        ],
        workers: [
          {
            required: true,
            validator: validateArr,
            message: "请添加考核工作组成员"
          }
        ],
        users: [
          { required: true, validator: validateArr, message: "请添加被考核人" }
        ]
      },
      leadersArr: [],
      workersArr: [],
      usersArr: [],
      initArr: [] // 初始时的用户列表
    };
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      if (this.type == "users") {
        // 获取所有被考核人
        fetchAllUserList({
          groupid: this.groupId
        })
          .then(res => {
            if (res.success) {
              let data = res.data || [];
              this.editForm.users = data.map(i => `${i.name}(${i.id})`);
              this.usersArr = data.map(i => {
                return {
                  userid: i.id,
                  username: i.name
                };
              });
            }
          })
          .catch(err => {});
      }
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.keyword = null;
      (this.editForm = {
        leaders: [],
        workers: [],
        users: []
      }),
        this.$emit("doFunc");
    },

    // 保存
    doSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = {
            id: this.groupId
          };
          let func = null;
          let role = null;
          let data = [];
          switch (this.type) {
            case "leaders":
              param.leaders = this.leadersArr.filter(i => i.userid);
              func = saveGroupLeader;
              role = "20210604-3";
              data = this.leadersArr.filter(i => i.userid);
              break;
            case "workers":
              param.workers = this.workersArr.filter(i => i.userid);
              func = saveGroupWorker;
              role = "20210604-2";
              data = this.workersArr.filter(i => i.userid);
              break;
            case "users":
              param.users = this.usersArr.filter(i => i.userid);
              func = saveGroupUser;
              break;
          }
          // 删除掉的用户
          let deleteArr = this.initArr.filter(
            i => data.findIndex(j => j.userid == i) < 0
          );
          func(param)
            .then(res => {
              if (res.success) {
                // 给用户添加角色
                if (role) {
                  this.saveUserRole(role, data)
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
                        message: "角色保存失败！"
                      });
                    });
                } else {
                  this.drawerLoading = false;
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: "保存成功！"
                  });
                  this.drawer = false;
                }
                // 删除掉的用户要删掉其角色
                if (deleteArr.length > 0) {
                  this.deleteUserRole(role, deleteArr);
                }
              } else {
                this.drawerLoading = false;
                this.$message({
                  showClose: true,
                  type: "error",
                  message:
                    "保存失败：" + res.data.message ||
                    res.data.errInf.shortBusInf
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `保存失败:${err}`
              });
            });
        }
      });
    },

    // 获取当前角色的用户
    getRoleUserList(role) {
      return new Promise((resolve, reject) => {
        let param = {
          roleId: role,
          appid: this.$store.state.GROUPID
        };
        fetchRoleUserAndGroups(param)
          .then(res => {
            if (res.success) {
              let data = res.items || [];
              data = data.map(i => i.USERID);
              resolve(data);
            } else {
              reject(res.data.errInf.shortBusInf);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 保存用户角色
    saveUserRole(role, data) {
      return new Promise((resolve, reject) => {
        // 过滤掉已经是该角色的用户
        this.getRoleUserList(role).then(res => {
          let arr = data.filter(i => !res.includes(i.userid));
          if (arr.length > 0) {
            // 转换数据
            let param = {
              data: JSON.stringify({
                ROLEID: role,
                USERID: arr.map(i => i.userid)
              })
            };
            addRoleUser(param)
              .then(res => {
                if (res.success) {
                  resolve(res);
                } else {
                  reject("用户角色保存失败：" + res.data.errInf.shortBusInf);
                }
              })
              .catch(err => {
                reject("用户角色保存失败：" + err);
              });
          } else {
            resolve("用户已存在角色中");
          }
        });
      });
    },

    // 用户所管理的分组
    getUserManageGroups(role, userid) {
      return new Promise((resolve, reject) => {
        let func = null;
        switch (role) {
          case "20210604-3":
            func = getUserLeaderGroups;
            break;
          case "20210604-2":
            func = getUserWorkGroups;
            break;
        }
        let param = {
          userid: userid
        };
        func(param)
          .then(res => {
            if (res.success) {
              let data = res.data || [];
              data = data.map(i => i.groupid);
              resolve(data);
            } else {
              reject(res.data.errInf.shortBusInf);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 删除用户角色
    deleteUserRole(role, data) {
      // 查找每个用户所管理的用户组
      data.forEach(i => {
        this.getUserManageGroups(role, i).then(res => {
          let data = res.filter(j => j !== this.groupId);
          // 如果还在其他用户组则不需要删除其角色
          if (data.length > 0) {
            return;
          } else {
            // 如果不在其他用户组则删除其角色
            let param = {
              data: JSON.stringify({
                ROLEID: role,
                USERID: [i]
              })
            };
            deleteRoleUser(param)
              .then(res => {
                if (!res.success) {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "用户角色删除失败！"
                  });
                }
              })
              .catch(err => {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "用户角色删除失败！"
                });
              });
          }
        });
      });
    },

    // 新增选择框（分管领导、工作组、被考核人）
    addSelect(type) {
      this[`${type}Arr`].push({});
    },

    // 改变选择值（分管领导、工作组、被考核人）
    changeSelect(type, index, val) {
      let user = JSON.parse(val);
      if (this[`${type}Arr`].some(i => i.userid == user.id)) {
        this.$message({
          showClose: true,
          type: "error",
          message: "该用户已存在！"
        });
        this.editForm[`${type}`][index] = null;
      } else {
        this[`${type}Arr`][index].userid = user.id;
        this[`${type}Arr`][index].username = user.name;
        this.editForm[`${type}`][index] = `${user.name}(${user.id})`;
      }
    },

    // 删除选择框（分管领导、工作组、被考核人）
    deleteSelect(type, index) {
      this[`${type}Arr`].splice(index, 1);
      this.editForm[`${type}`].splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.add {
  width: 300px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  border: 1px dashed #d0d0d0;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  cursor: pointer;
}
.select-box {
  margin-bottom: 12px;
  i {
    margin-left: 10px;
    color: #666;
    cursor: pointer;
  }
}
</style>