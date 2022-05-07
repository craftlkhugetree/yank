<template>
  <div class="login-form">
    <h2>完善信息</h2>
    <div class="edit-box">
      <van-form ref="editForm" :show-error-message="false">
        <van-field
          readonly
          clickable
          name="campusName"
          :value="editForm.campusName"
          label="校区:"
          placeholder="请选择校区"
          @click="showPicker = true"
          :rules="[{ required: true, message: '请选择校区' }]"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="campusList"
            value-key="name"
            @confirm="onConfirmCampus"
            @cancel="showPicker = false"
          />
        </van-popup>
        <div v-if="isNh">
          <van-field
            v-model="editForm.mobile"
            name="mobile"
            label="手机号:"
            placeholder="请输入手机号"
            :rules="[{ required: true, pattern: /^1\d{10}$/, message: '请输入手机号' }]"
          ></van-field>
          <van-field
            v-model="editForm.email"
            name="email"
            label="邮箱:"
            placeholder="请输入邮箱"
            :rules="[{ required: true, pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '请输入邮箱' }]"
          ></van-field>
          <van-field
            v-model="editForm.qq"
            name="qq"
            label="QQ:"
            placeholder="请输入QQ"
            :rules="[{ required: true, pattern: /^[1-9]\d{4,19}$/, message: '请输入QQ' }]"
          ></van-field>
        </div>
        <van-button
          class="login-btn"
          :loading="loading"
          loading-text="绑定中..."
          @click="bindCampus"
          size="middle"
        >绑定</van-button>
      </van-form>
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
        campusName: null,
        campusId: null,
        mobile: null,
        email: null,
        qq: null
      },
      showPicker: false,
      loading: false
    }
  },
  computed: mapState({
    campusList: state => state.campusList
  }),
  methods: {
    onConfirmCampus(value) {
      const { id, name } = value
      this.editForm.campusId = id
      this.editForm.campusName = name
      this.showPicker = false
    },
    // 绑定校区
    bindCampus() {
      this.$refs.editForm.validate().then(() => {
          this.loading = true
          let param = { ...this.editForm }
          bindCampus(param)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$router.push('/')
              } else {
                this.$toast.fail('绑定失败：' + res.msg)
              }
            })
            .catch(err => {
              this.loading = false
              this.$toast.fail('绑定失败：' + err)
            })
      }).catch(err => {return})
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  padding: 20px 40px;
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
    width: 120px;
  }
}
</style>