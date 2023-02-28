<template>
  <el-drawer
    class="base-drawer"
    title="新增考核分组"
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
        :show-message="false"
      >
        <!-------------------------------- 考核分组 -------------------------------->
        <el-form-item label="考核分组名称：" prop="groupName" required>
          <el-input
            v-model="editForm.groupName"
            placeholder="请输入"
            size="small"
            style="width:300px;"
            @input="saveGroupSuccess=false;"
          ></el-input>
          <el-button
            v-if="!saveGroupSuccess"
            size="small"
            :type="!editForm.groupName || editForm.groupName == groupName ? 'info' : 'primary'"
            :disabled="!editForm.groupName || editForm.groupName == groupName"
            style="margin-left:10px;"
            :loading="groupLoading"
            @click="saveGroup"
          >保存分组</el-button>
          <el-button
            v-else
            type="info"
            size="small"
            style="margin-left:10px;"
            disabled
            icon="el-icon-success"
          >保存成功</el-button>
        </el-form-item>
        <!-------------------------------- 分管领导 -------------------------------->
        <el-form-item label="分管领导：" prop="leaders" required>
          <div class="select-box" v-for="(leader,index) in leadersArr" :key="index">
            <el-select
              v-model="editForm.leaders[index]"
              filterable
              remote
              placeholder="请输入姓名或工号"
              :remote-method="remoteMethod"
              :loading="userloading"
              size="small"
              style="width:300px;"
              @change="val => changeSelect('leaders', index, val)"
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
            <i class="el-icon-delete" @click="deleteSelect('leaders', index)"></i>
          </div>
          <div class="add" :class="{'disabled': !editForm.groupId}" @click="addSelect('leaders')">
            <i class="el-icon-plus"></i>
            添加分管领导
          </div>
          <el-button
            size="small"
            :type="editForm.leaders.length == 0 ? 'info' : 'primary'"
            :disabled="editForm.leaders.length == 0"
          >保存分管领导</el-button>
          <span class="tips" v-if="!editForm.groupId">
            <i class="el-icon-warning"></i>请先保存考核分组
          </span>
        </el-form-item>
        <!-------------------------------- 考核工作组 -------------------------------->
        <el-form-item label="考核工作组成员：" prop="workers" required>
          <div class="select-box" v-for="(worker,index) in workersArr" :key="index">
            <el-select
              v-model="editForm.workers[index]"
              filterable
              remote
              placeholder="请输入姓名或工号"
              :remote-method="remoteMethod"
              :loading="userloading"
              size="small"
              style="width:300px;"
              @change="val => changeSelect('workers', index, val)"
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
            <i class="el-icon-delete" @click="deleteSelect('workers', index)"></i>
          </div>
          <div class="add" :class="{'disabled': !editForm.groupId}" @click="addSelect('workers')">
            <i class="el-icon-plus"></i>
            添加考核工作组
          </div>
          <el-button
            size="small"
            :type="editForm.workers.length == 0 ? 'info' : 'primary'"
            :disabled="editForm.workers.length == 0"
          >保存考核工作组</el-button>
          <span class="tips" v-if="!editForm.groupId">
            <i class="el-icon-warning"></i>请先保存考核分组
          </span>
        </el-form-item>
        <!-------------------------------- 被考核人 -------------------------------->
        <el-form-item label="被考核人：" prop="users" required>
          <div class="select-box" v-for="(user,index) in usersArr" :key="index">
            <el-select
              v-model="editForm.users[index]"
              filterable
              remote
              placeholder="请输入姓名或工号"
              :remote-method="remoteMethod"
              :loading="userloading"
              size="small"
              style="width:300px;"
              @change="val => changeSelect('users', index, val)"
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
            <i class="el-icon-delete" @click="deleteSelect('users', index)"></i>
          </div>
          <div class="add" :class="{'disabled': !editForm.groupId}" @click="addSelect('users')">
            <i class="el-icon-plus"></i>
            添加被考核人
          </div>
          <el-button
            size="small"
            :type="editForm.users.length == 0 ? 'info' : 'primary'"
            :disabled="editForm.users.length == 0"
          >保存被考核人</el-button>
          <span class="tips" v-if="!editForm.groupId">
            <i class="el-icon-warning"></i>请先保存考核分组
          </span>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSave">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div> -->
  </el-drawer>
</template>

<script>
import { saveGroup } from "@/api/admin/userGroup.js";
import { fetchUserList } from "@/api/admin/roles.js";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      groupLoading: false,
      editForm: {
        groupId: null,
        groupName: null,
        leaders: [],
        workers: [],
        users: []
      },
      groupName: null,
      saveGroupSuccess: false,
      leadersArr: [],
      userloading: false,
      userList: [],
      workersArr: [],
      usersArr: []
    };
  },
  methods: {
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.keyword = null;
      (this.editForm = {
        groupId: null,
        groupName: null,
        leaders: [],
        workers: [],
        users: []
      }),
        this.$emit("doFunc");
    },

    // 保存工作组
    saveGroup() {
      this.groupLoading = true;
      let param = {
        data: JSON.stringify({
          ID: this.editForm.groupId,
          NAME: this.editForm.groupName,
          APPID: this.$store.state.GROUPID
        })
      };
      saveGroup(param)
        .then(res => {
          this.groupLoading = false;
          if (res.success) {
            this.editForm.groupId = res.item.ID;
            this.groupName = res.item.NAME;
            this.saveGroupSuccess = true;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message:
                "保存失败：" + res.data.message || res.data.errInf.shortBusInf
            });
          }
        })
        .catch(err => {
          this.groupLoading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: `保存失败:${err}`
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
      if (this[`${type}Arr`].some(i => i.ID == user.ID)) {
        this.$message({
          showClose: true,
          type: "error",
          message: "该用户已存在！"
        });
        this.editForm[`${type}`][index] = null;
      } else {
        this[`${type}Arr`][index].ID = user.ID;
        this[`${type}Arr`][index].NAME = user.NAME;
        this.editForm[`${type}`][index] = `${user.NAME}(${user.ID})`;
      }
    },

    // 删除选择框（分管领导、工作组、被考核人）
    deleteSelect(type, index) {
      this[`${type}Arr`].splice(index, 1);
      this.editForm[`${type}`].splice(index, 1);
    },

    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        let param = {
          filter: JSON.stringify({
            KEYWORD: query
          }),
          page: 1,
          limit: 1000
        };
        fetchUserList(param)
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
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 12px;
}
.add {
  width: 300px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  border: 1px dashed #d0d0d0;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  cursor: pointer;
  margin-bottom: 12px;
  &.disabled {
    background: #f5f5f5;
    color: #b7b7b7;
    cursor: not-allowed;
    pointer-events: none;
  }
}
.tips {
  margin-left: 10px;
  color: #999999;
  i {
    color: #faad14;
    margin-right: 5px;
  }
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