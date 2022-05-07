<template>
  <div class="login-form">
    <h2>新生登录</h2>
    <div class="edit-box">
      <van-form ref="editForm" :show-error-message="false">
        <van-field
          v-model="editForm.idcard"
          name="idcard"
          label="身份证号:"
          placeholder="请输入身份证号"
          :rules="[{ required: true, pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入身份证号' }]"
        ></van-field>
        <van-field
          v-model="editForm.name"
          name="name"
          label="姓名:"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
        ></van-field>
        <van-row>
          <van-col span="16">
            <van-field
              v-model="editForm.vxcode"
              name="vxcode"
              label="验证码:"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入密码' }]"
            ></van-field>
          </van-col>
          <van-col span="8">
            <img class="yzm" :src="yzmUrl" alt="验证码" @click="getYzm" />
          </van-col>
        </van-row>
        <van-button
          class="login-btn"
          :loading="loading"
          loading-text="登录中..."
          @click="doLogin"
          size="middle"
        >登 录</van-button>
      </van-form>
      <van-button class="link-btn" plain round size="middle" @click="$router.push('/login')">
        证件号登录
        <van-icon name="share-o"></van-icon>
      </van-button>
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
      this.$refs.editForm.validate().then(() => {
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
              this.$toast.fail(res.data.msg)
            }
          })
          .catch(err => {
            this.loading = false
            this.getYzm()
            this.$toast.fail(err)
          })
      }).catch(err => {return})
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
            this.$toast.fail('绑定校区失败:' + res.msg)
          }
        })
        .catch(err => {
          this.loading = false
          this.$toast.fail('绑定校区失败:' + err)
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
  padding: 20px 30px;
  h2 {
    font-size: 42px;
    font-weight: 500;
    color: #424242;
    line-height: 60px;
    text-align: center;
  }
  .edit-box {
    text-align: center;
    margin-top: 30px;
    .yzm {
      width: 100%;
      vertical-align: middle;
      margin-left: 10px;
      cursor: pointer;
    }
    .login-btn {
      width: 90%;
      margin: 30px auto;
      font-size: 32px;
      color: #fff;
      background: #1472ff;
      box-shadow: 0 0 10px 0 #cde2ff;
    }
    .link-btn {
      width: 90%;
      display: block;
      margin: 10px auto;
    }
  }
}
</style>
<style lang="scss">
.edit-box {
  .van-field__label {
    width: 140px;
  }
}
</style>