<template>
  <el-drawer
    class="base-drawer"
    title="添加人员"
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
        label-width="130px"
        label-position="right"
        :show-message="false"
      >
        <el-form-item label="选择人员：" prop="user" required>
          <el-select
            v-model="editForm.user"
            filterable
            remote
            placeholder="请输入姓名或工号"
            :remote-method="remoteMethod"
            :loading="userloading"
            size="small"
            style="width:300px;"
            @change="changeSelect"
          >
            <el-option
              v-for="item in userList"
              :key="item.ID"
              :label="item.NAME"
              :value="JSON.stringify(item)"
            >
              <span>{{item.NAME + '--' + item.ID}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领导岗位级别：" prop="joblvid">
          <el-select v-model="editForm.joblvid" placeholder="请选择" size="small" style="width:300px;">
            <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考核分组：" prop="groupid">
          <el-select
            v-model="editForm.groupid"
            placeholder="选择考核分组"
            size="small"
            style="width:300px;"
            clearable
          >
            <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员类型：" prop="rylxm">
          <el-select
            v-model="editForm.rylxm"
            placeholder="请选择"
            size="small"
            style="width:300px;"
            disabled
          ></el-select>
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
import { addUser } from "@/api/admin/users.js";
import { fetchUserList } from "@/api/admin/roles.js";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      title: "",
      editForm: {
        user: null,
        id: null,
        name: null,
        joblvid: null,
        groupid: null,
        orgid: null,
        orgname: null,
        rylx: null,
        rylxm: null
      },
      userList: [],
      userloading: false
    };
  },
  computed: {
    groupList() {
      return this.$store.state.groupList;
    },
    levelList() {
      return this.$store.state.levelList;
    }
  },
  methods: {
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      (this.editForm = {
        user: null,
        id: null,
        name: null,
        joblvid: null,
        groupid: null,
        orgid: null,
        rylx: null,
        rylxm: null
      }),
        this.$emit("doFunc");
    },

    // 选择人员
    changeSelect(val) {
      let user = JSON.parse(val);
      this.editForm.id = user.ID;
      this.editForm.name = user.NAME;
      this.editForm.rylx = user.RYLX;
      this.editForm.rylxm = user.RYLXM;
      this.editForm.orgid = user.ORGID;
      this.editForm.orgname = user.ORGNAME;
      this.editForm.user = `${user.NAME}(${user.ID})`;
    },

    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        let param = {
          page: 1,
          limit: 1000,
          filter: JSON.stringify({
            KEYWORD: query
          })
        };
        fetchUserList(param)
          .then(res => {
            this.userloading = false;
            if (res.success) {
              this.userList = res.items || [];
            }
          })
          .catch(err => {
            this.userloading = false;
            this.userList = [];
          });
      } else {
        this.userList = [];
      }
    },
    // 保存
    doSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = [{
            ...this.editForm
          }];
          delete param.user;
          addUser(param)
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功！"
                });
                this.drawer = false;
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "保存失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + err
              });
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 12px;
}
</style>