<template>
  <div class="login-form">
    <h2>新生登录</h2>
    <div class="edit-box">
      <el-form ref="editForm" :model="editForm" :show-message="false" label-position="top">
        <el-form-item
          label="身份证号："
          prop="idcard"
          :rules="[{required: true, pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, trigger: 'change', message: '请输入手机号'}]"
        >
          <el-input v-model="editForm.idcard" placeholder="请输入身份证号" style="width:100%;" size="big"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name" required>
          <el-input v-model="editForm.name" placeholder="请输入姓名" style="width:100%;" size="big"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="vxcode" required>
          <el-input
            v-model="editForm.vxcode"
            placeholder="请输入验证码"
            style="width:calc(100% - 140px);"
            size="big"
          ></el-input>
          <img class="yzm" :src="yzmUrl" alt="验证码" @click="getYzm" />
        </el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="loading"
          @click="doLogin"
          size="big"
        >登 录</el-button>
      </el-form>
      <el-button
        class="link-btn"
        type="primary"
        plain
        round
        size="big"
        @click="$router.push('/login')"
      >
        证件号登录
        <i class="el-icon-position"></i>
      </el-button>
      <p>Copyright © 2022 南京昂克软件 All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import { doLogin, bindCampus } from '@/api/login'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isNh: window.base.isNh, // 是否南航
      editForm: {
        idcard: null,
        name: null,
        vxcode: null
      },
      yzmUrl: null,
      loading: false
    }
  },
  computed: mapState({
    campusList: state => state.campusList
  }),
  methods: {
    // 获取验证码
    getYzm() {
      this.yzmUrl = window.g.idsUrl + 'captcha/get?id=' + new Date().getTime()
    },
    // 登录
    doLogin() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params = { ...this.editForm }
          doLogin(params)
            .then(res => {
              this.loading = false
              if (res.success) {
                // 获取是否第一次登录信息
                this.$store.dispatch('getIsFirstLogin')
                // 获取用户信息
                this.$store.dispatch('getUserInfo').then(res => {
                  // 如果是南航，并且没有绑定校区或者其他信息，则跳转到校区页面
                  if (this.isNh && (!res.campusId || !res.mobile || !res.email || !res.qqcard)) {
                    this.$router.push('/campus')
                  }
                  // 如果不是南航，并且没有绑定校区
                  if (!this.isNh && !res.campusId) {
                    // 校区数量不只一个，跳转到校区页
                    if (this.campusList.length > 1) {
                      this.$router.push('campus')
                    } else {
                      // 只有一个校区，自动绑定该校区
                      this.bindCampus()
                    }
                  }
                  // 其他情况，跳转到首页
                  this.$router.push('/')
                })
              } else {
                this.getYzm()
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.getYzm()
              this.$message({
                showClose: true,
                type: 'error',
                message: err
              })
            })
        }
      })
    },
    // 绑定校区
    bindCampus() {
      this.loading = true
      let param = {
        campusId: this.campusList[0].id
      }
      bindCampus(param)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.$router.push('/')
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '绑定校区失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '绑定校区失败：' + err
          })
        })
    }
  },
  created() {
    this.getYzm()
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  position: absolute;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  padding: 40px;
  background: #ffffff;
  border-radius: 10px;
  .el-form-item--small.el-form-item {
    margin-bottom: 22px;
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
    margin-top: 30px;
    .yzm {
      vertical-align: middle;
      margin-left: 10px;
      cursor: pointer;
    }
    .login-btn.el-button {
      width: 100%;
      margin: 30px 0;
      font-size: 16px;
      letter-spacing: 10px;
      background: #1472ff;
      padding-left: 30px;
      box-shadow: 0 0 10px 0 #cde2ff;
    }
    .link-btn.el-button {
      display: block;
      margin: 0 auto 30px;
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