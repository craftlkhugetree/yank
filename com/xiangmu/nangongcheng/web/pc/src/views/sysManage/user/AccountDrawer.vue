<template>
  <s-drawer
    :title="title"
    :drawer="drawer"
    @close="closeDrawer"
    @save="saveAccount"
    :drawerLoading="drawerLoading"
  >
    <div class="drawer-container">
      <div class="tips">
        <i class="el-icon-warning"></i>
        <span>新增账号的默认登录密码为</span>
        <span class="bold">123456</span>
      </div>
      <s-form ref="editForm" :editData="editForm" inputSize="small">
        <s-form-item prop="NAME" label="姓名：" one-line required></s-form-item>
        <s-form-item prop="LOGINNAME" label="登录账号：" one-line required></s-form-item>
        <s-form-item
          prop="ROLEID"
          label="用户角色："
          type="select"
          required
          one-line
          :selectProps="{
            name: 'NAME',
            id: 'ID',
          }"
          :selectEnum="roleList"
        ></s-form-item>
        <!-- <s-col one-line>
          <el-form-item label="realLabel：" prop="PWD">
            <s-input
              :value="editForm.PWD"
              placeholder="aaaaaaaaaaaaaaaaaak"
              @update="val => (editForm = { ...editForm, PWD: val })"
            ></s-input>
          </el-form-item>
        </s-col> -->
      </s-form>
    </div>
  </s-drawer>
</template>

<script>
import { saveUser, fetchRoleList } from '@/api/roles';
export default {
  data() {
    return {
      title: '新增用户',
      drawer: false,
      drawerLoading: false,
      editForm: {
        ID: null, // 修改时添加
        NAME: null, // 姓名
        LOGINNAME: null, // 登录名
        PWD: '123456', // 密码
        ROLEID: '',
      },
      roleList: [],
      rules: {
        prop: [{ required: true, message: '请输入一个数字', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        ID: null,
        NAME: null,
        LOGINNAME: null,
        PWD: '123456',
        ROLEID: '',
      };
      this.drawer = false;
    },
    // 保存
    saveAccount() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = {
            d: JSON.stringify({
              // ...this.editForm,
              ...this.$refs.editForm.formInfo,
            }),
          };
          saveUser(param).then(res => {
            this.drawerLoading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功！',
              });
              this.closeDrawer();
              this.$emit('doFunc');
            }
          });
        }
      });
    },
    getRoles() {
      fetchRoleList().then(res => {
        if (res && res.success) {
          this.roleList = res.items;
        }
      });
    },
  },
  created() {
    this.getRoles();
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 30px;
}
.tips {
  width: 400px;
  background: #e6f7ff;
  border-radius: 2px;
  border: 1px solid #91d5ff;
  padding: 9px 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 16px;
  span {
    margin: 0 5px;
  }
  .bold,
  i {
    color: #1890ff;
    font-weight: 600;
  }
}
</style>
