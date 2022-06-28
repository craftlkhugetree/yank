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
        <!-------------------------------- 餐厅名称 -------------------------------->
        <el-form-item label="餐厅名称：" prop="name" required>
          <el-input v-model="editForm.name" placeholder="请输入" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <!-------------------------------- 管理员 -------------------------------->
        <el-form-item label="餐厅管理员：" prop="users" required>
          <div class="select-box" v-for="(user,index) in usersArr" :key="index">
            <base-user-select
              roleId="20210729-3"
              :vmodel.sync="editForm.users[index]"
              @doFunc="val => changeSelect(index, val)"
            ></base-user-select>
            <i class="el-icon-delete" @click="deleteSelect(index)"></i>
          </div>
          <div class="add" @click="addSelect">
            <i class="el-icon-plus"></i>
            添加管理员
          </div>
        </el-form-item>
        <!-------------------------------- 收款经费号 -------------------------------->
        <el-form-item label="项目编号：" prop="skjfh">
          <el-input v-model="editForm.skjfh" placeholder="请输入" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <!-------------------------------- 经费本号 -------------------------------->
        <el-form-item label="经费科目编号：" prop="jfbh">
          <el-input v-model="editForm.jfbh" placeholder="请输入" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <!-------------------------------- 餐厅类别 -------------------------------->
        <el-form-item label="餐厅类别：" prop="shoptypes">
          <el-select
            v-model="editForm.shoptypes"
            placeholder="请选择"
            size="small"
            style="width:300px;"
            multiple
            filterable
          >
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-------------------------------- 所属企业 -------------------------------->
        <el-form-item label="所属企业：" prop="companyid">
          <el-select
            v-model="editForm.companyid"
            placeholder="请选择"
            size="small"
            style="width:300px;"
            filterable
          >
            <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import BaseUserSelect from "@/components/BaseUserSelect";
import { saveCafe } from "@/api/admin/cafe";
import { fetchAllCafeTypeList } from "@/api/admin/cafeType";
import { fetchAllCompanyList } from "@/api/admin/company";
import {
  addRoleUser,
  deleteRoleUser,
  fetchRoleUserAndGroups
} from "@/api/admin/roles";
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
      drawer: false,
      drawerLoading: false,
      title: "新增餐厅",
      name: "",
      editForm: {
        id: null,
        name: null,
        users: [],
        shoptypes: [],
        skjfh: null,
        jfbh: null,
        companyid: null
      },
      rules: {
        name: [{ required: true, message: "请输入餐厅名称" }],
        users: [
          { required: true, validator: validateArr, message: "请添加管理员" }
        ]
      },
      usersArr: [],
      initArr: [],
      typeList: [],
      companyList: []
    };
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      this.getCafeTypeList();
      this.getCompanyList();
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      (this.editForm = {
        id: null,
        name: null,
        users: [],
        skjfh: null,
        jfbh: null,
        shoptypes: [],
        companyid: null
      }),
        (this.usersArr = []);
      this.$emit("doFunc");
    },
    // 获取餐厅类别
    getCafeTypeList() {
      fetchAllCafeTypeList({}).then(res => {
        if (res.success) {
          let data = res.data || [];
          this.typeList = data.filter(i => i.status == "1");
          this.typeList.sort((a,b) => {
            return a.level > b.level ? 1 : -1;
          })
        }
      });
    },
    // 获取企业
    getCompanyList() {
      fetchAllCompanyList({}).then(res => {
        if (res.success) {
          let data = res.data || [];
          this.companyList = data.filter(i => i.status == "1");
        }
      });
    },

    // 保存
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let usersArr = this.usersArr.filter(i => i.shoperid);
          let param = {
            id: this.editForm.id,
            name: this.editForm.name,
            shopers: usersArr.map(i => {
              return {
                shoperid: i.shoperid,
                shopername: i.shopername
              };
            }),
            shoptypes: this.editForm.shoptypes.map(i => {
              return {
                id: i
              }
            }),
            skjfh: this.editForm.skjfh,
            jfbh: this.editForm.jfbh,
            companyid: this.editForm.companyid
          };
          // 删除掉的用户
          let deleteArr = this.initArr.filter(
            i => usersArr.findIndex(j => j.shoperid == i) < 0
          );
          saveCafe(param)
            .then(res => {
              if (res.success) {
                Promise.all([
                  this.saveUserRole(
                    "20210729-3",
                    usersArr.map(i => i.shoperid)
                  )
                ])
                  .then(res => {
                    this.drawerLoading = false;
                    this.$message({
                      showClose: true,
                      type: "success",
                      message: "保存成功！"
                    });
                    this.drawer = false;
                    // 删除掉的用户要删掉其角色
                    if (deleteArr.length > 0) {
                      this.deleteUserRole("20210729-3", deleteArr);
                    }
                  })
                  .catch(err => {
                    this.drawerLoading = false;
                    this.$message({
                      showClose: true,
                      type: "fail",
                      message: "用户角色保存失败！"
                    });
                  });
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

    // 保存用户角色
    saveUserRole(role, data) {
      return new Promise((resolve, reject) => {
        // 获取当前角色的用户
        let param = {
          roleId: role,
          appid: this.$store.state.GROUPID
        };
        fetchRoleUserAndGroups(param).then(res => {
          if (res.success) {
            let userList = res.items || [];
            // 排除掉已经是该角色的用户
            let newUser = data.filter(
              i => userList.findIndex(j => j.USERID == i) < 0
            );
            // 转换数据
            let param = {
              data: JSON.stringify({
                ROLEID: role,
                USERID: newUser
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
          }
        });
      });
    },

    // 删除用户角色
    deleteUserRole(role, data) {
      let param = {
        data: JSON.stringify({
          ROLEID: role,
          USERID: data
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
    },

    // 新增选择框
    addSelect() {
      this.usersArr.push({});
    },

    // 改变选择值
    changeSelect(index, val) {
      let user = JSON.parse(val);
      if (this.usersArr.some(i => i.shoperid == user.id)) {
        this.$message({
          showClose: true,
          type: "error",
          message: "该用户已存在！"
        });
        this.editForm.users[index] = null;
      } else {
        this.usersArr[index].shoperid = user.id;
        this.usersArr[index].shopername = user.name;
        this.editForm.users[index] = `${user.name}(${user.id})`;
      }
    },

    // 删除选择框
    deleteSelect(index) {
      this.usersArr.splice(index, 1);
      this.editForm.users.splice(index, 1);
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
.el-form-item {
  margin-bottom: 14px;
}
</style>