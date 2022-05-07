<template>
  <div class="login-form">
    <h2>完善信息</h2>
    <div class="edit-box">
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        :show-message="false"
        label-position="top"
      >
        <el-form-item label="校区：" prop="campusId" required>
          <el-select v-model="editForm.campusId" placeholder="请选择校区" size="big" style="width:100%;">
            <el-option
              v-for="item in campusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="isNh">
          <el-form-item label="手机号：" prop="mobile" required>
            <el-input v-model="editForm.mobile" placeholder="请输入手机号" style="width:100%;" size="big"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email" required>
            <el-input v-model="editForm.email" placeholder="请输入邮箱" style="width:100%;" size="big"></el-input>
          </el-form-item>
          <el-form-item label="QQ：" prop="qq" required>
            <el-input v-model="editForm.qq" placeholder="请输入QQ" style="width:100%;" size="big"></el-input>
          </el-form-item>
        </div>
        <el-button type="primary" :loading="loading" @click="bindCampus" size="big">绑定</el-button>
      </el-form>
      <p>Copyright © 2022 南京昂克软件 All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import { bindCampus } from '@/api/login'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isNh: window.base.isNh, // 是否南航
      editForm: {
        campusId: null,
        mobile: null,
        email: null,
        qq: null
      },
      rules: {
        mobile: [{ required: true, pattern: /^1\d{10}$/, trigger: 'change', message: '请输入手机号' }],
        email: [{ required: true, pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, trigger: 'change', message: '请输入邮箱' }],
        qq: [{ required: true, pattern: /^[1-9]\d{4,19}$/, trigger: 'change', message: '请输入QQ' }]
      },
      loading: false
    }
  },
  computed: mapState({
    campusList: state => state.campusList
  }),
  methods: {
    // 绑定校区
    bindCampus() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true
          let param = { ...this.editForm }
          bindCampus(param)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$router.push('/')
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '绑定失败：' + res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: '绑定失败：' + err
              })
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  position: absolute;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  padding: 40px;
  background: #ffffff;
  border-radius: 10px;
  .el-form-item--small.el-form-item {
    margin-bottom: 15px;
  }
  h2 {
    font-size: 42px;
    font-weight: 600;
    color: #424242;
    line-height: 60px;
    letter-spacing: 10px;
    text-align: center;
    padding-left: 10px;
  }
  .edit-box {
    margin-top: 20px;
    .el-button {
      width: 100%;
      margin: 30px 0;
      font-size: 16px;
      letter-spacing: 10px;
      background: #1472ff;
      padding-left: 30px;
      box-shadow: 0 0 10px 0 #cde2ff;
    }
    p {
      font-size: 12px;
      color: #999999;
      line-height: 20px;
      text-align: center;
    }
  }
}
</style>