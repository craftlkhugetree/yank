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
        <el-form-item label="用户：" prop="INFO" required>
          <el-select
            v-model="editForm.INFO"
            filterable
            remote
            placeholder="请输入工号查询"
            :loading="userloading"
            @change="(val) => changeUser(val)"
            :remote-method="debounceRemote"
            size="small"
            style="width:300px"
          >
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.name + '--' + user.id"
              :value="JSON.stringify({ID:user.id,NAME:user.name})"
            ></el-option>
          </el-select>
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
import { saveUser, fetchThirdUserList } from '@/api/admin'
import commonJs from '@/assets/js/common'
export default {
  data() {
    return {
      title: '新增管理员',
      drawer: false,
      drawerLoading: false,
      userloading: false,
      editForm: {
        INFO: null,
        ID: null, // 修改时添加
        NAME: null, // 姓名
        LOGINNAME: null, // 登录名
        PWD: '123456' // 密码
      },
      userList: []
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
          let data = { ...this.editForm }
          delete data.INFO
          let param = {
            d: JSON.stringify({
              ...data,
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
    },
    debounce(fn, delay) {
      let timer = null
      return function () {
        var contex = this
        clearTimeout(timer)
        timer = setTimeout(function () {
          fn.apply(contex, arguments)
        })
      }
    },

    debounceRemote: commonJs.debounce(function (query) {
      this.remoteMethod(query)
    }, 1000),
    // 搜索用户列表
    remoteMethod(query) {
      if (query !== '') {
        this.userloading = true
        let param = {
          readerid: query
        }
        fetchThirdUserList(param)
          .then(res => {
            this.userloading = false
            if (res.code == '000000') {
              this.userList = res.data ? [res.data] : []
            } else {
              this.userList = []
            }
          })
          .catch(err => {
            this.userloading = false
            this.userList = []
          })
      } else {
        this.userList = []
      }
    },

    // 选择用户
    changeUser(val) {
      let data = JSON.parse(val)
      this.editForm.NAME = data.NAME
      this.editForm.LOGINNAME = data.ID
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 20px;
}
</style>
