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
      <!-------------------- 保存 -------------------->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="100px"
        :show-message="false"
        label-position="right"
      >
        <el-form-item prop="loginname" label="登录名：" style="margin-bottom: 16px" required>
          <el-input
            v-model="editForm.loginname"
            placeholder="请输入登录名"
            size="small"
            style="width: 360px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名：" style="margin-bottom: 16px" required>
          <el-input v-model="editForm.name" placeholder="请输入姓名" size="small" style="width: 360px"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!editForm.id"
          prop="password"
          label="登录密码："
          style="margin-bottom: 16px"
          required
        >
          <el-input
            show-password
            v-model="editForm.password"
            placeholder="请输入登录密码"
            size="small"
            style="width: 360px"
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
import { saveUser } from '@/api/admin/user.js'
export default {
  data() {
    return {
      title: '新增账号',
      drawer: false,
      drawerLoading: false,
      editForm: {
        id: null, // 修改时添加
        name: null, // 姓名
        loginname: null, // 登录名
        password: null // 密码
      }
    }
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields()
      this.editForm = {
        id: null,
        name: null,
        loginname: null,
        password: null
      }
    },
    // 保存
    saveAccount() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true
          let param = {
            ...this.editForm
          }
          saveUser(param)
            .then(res => {
              this.drawerLoading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '保存成功！'
                })
                this.drawer = false
                this.$emit('doFunc')
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败：' + res.msg
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
</style>
