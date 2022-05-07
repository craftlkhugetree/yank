<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <div class="tips">
        <i class="el-icon-warning"></i>
        <span>新增账号的默认登录密码为</span>
        <span class="bold">123456</span>
      </div>
      <!-------------------- 保存 -------------------->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="100px"
        :show-message="false"
        label-position="right"
      >
        <el-form-item prop="NAME" label="姓名：" style="margin-bottom:16px;" required>
          <el-input v-model="editForm.NAME" placeholder="请输入姓名" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item prop="LOGINNAME" label="登录账号：" style="margin-bottom:16px;" required>
          <el-input
            v-model="editForm.LOGINNAME"
            placeholder="请输入登录账号"
            size="small"
            style="width:300px;"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="saveAccount">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { saveUser } from '@/api/admin'
export default {
  data() {
    return {
      title: '新增管理员',
      drawer: false,
      drawerLoading: false,
      editForm: {
        ID: null, // 修改时添加
        NAME: null, // 姓名
        LOGINNAME: null, // 登录名
        PWD: '123456' // 密码
      }
    }
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields()
      this.editForm = {
        ID: null,
        NAME: null,
        LOGINNAME: null,
        PWD: '123456'
      }
    },
    // 保存
    saveAccount() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true
          let param = {
            d: JSON.stringify({
              ...this.editForm,
              TID: this.$store.state.appId,
              ROLEID: this.$store.state.adminRoleId
            })
          }
          saveUser(param)
            .then(res => {
              this.drawerLoading = false
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '保存成功！'
                })
                this.drawer = false
                this.$emit('doFunc')
              } else {
                let msg = res.data.message
                msg = msg.replace(/LOGINNAME/g, '登录名')
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败：' + msg
                })
              }
            })
            .catch(err => {
              this.drawerLoading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败：' + err
              })
            })
        }
      })
    }
  }
}
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
    margin:0 5px;
  }
  .bold,i {
    color: #1890ff;
    font-weight: 600;
  }
}
</style>
