<template>
  <div class="params">
    <!---------------------------------- 校区管理 ---------------------------------->
    <school></school>
    <!---------------------------------- 用户类型 ---------------------------------->
    <div class="params-box">
      <h3>用户类型</h3>
      <div class="params-box-content" v-loading="userTypeLoading">
        <div class="item show-item" v-for="item in userTypeList" :key="item.id">{{item.name}}</div>
        <div class="item add-item" @click="asyncData">
          <i class="el-icon-refresh"></i> 同步数据
        </div>
      </div>
    </div>
    <!---------------------------------- 其他参数 ---------------------------------->
    <div class="params-box">
      <h3>其他参数</h3>
      <div class="params-box-content" v-loading="otherLoading">
        <label>新生身份证登录：</label>
        <div class="switch">
          <el-switch
            :width="54"
            :value="newbornLogin.val"
            active-value="1"
            inactive-value="0"
            @change="changeSwitch"
          ></el-switch>
          <span class="on" v-if="newbornLogin.val=='1'" @click="changeSwitch(false)">开启</span>
          <span class="off" v-else @click="changeSwitch(true)">关闭</span>
        </div>
      </div>
    </div>
    <!---------------------------------- 全景导览 ---------------------------------->
    <div class="params-box">
      <h3>全景导览地址配置</h3>
      <div class="params-box-content" v-loading="qjdlLoading">
        <label>全景导览：</label>
        <el-input
          v-model="qjdlEditVal"
          placeholder="请输入全景导览地址"
          size="small"
          style="width:300px;margin-right:10px;"
          :class="{'is-error': !qjdlEditVal || !qjdlReg.test(qjdlEditVal)}"
        ></el-input>
        <el-button
          type="primary"
          v-loading="urlLoading"
          size="small"
          :disabled="qjdlEditVal == qjdl.val || !qjdlEditVal || !qjdlReg.test(qjdlEditVal)"
          @click="saveQjdl"
        >保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import school from './school'
import { fetchUserTypeList, asyncUserTypeList, fetchOtherParams, saveOtherParams } from '@/api/params'
export default {
  components: { school },
  data() {
    return {
      userType: null,
      userTypeList: [
        { id: '1', name: '本科生' },
        { id: '2', name: '研究生' }
      ],
      userTypeLoading: false,
      otherLoading: false,
      urlLoading: false,
      qjdl: {},
      qjdlEditVal: null,
      qjdlLoading: false,
      qjdlReg: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/
    }
  },
  computed: {
    newbornLogin() {
      return this.$store.state.newbornLogin
    }
  },
  methods: {
    // 获取用户类型列表
    getUserTypeList() {
      this.userTypeLoading = true
      this.$store.dispatch("getUserTypeList")
        .then(res => {
          this.userTypeLoading = false
          this.userTypeList = res
        })
        .catch(err => {
          this.userTypeLoading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '获取用户类型失败：' + err
          })
        })
    },
    // 同步用户类型
    asyncData() {
      this.userTypeLoading = true
      asyncUserTypeList({})
        .then(res => {
          this.userTypeLoading = false
          if (res.code == '000000') {
            this.getUserTypeList()
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '数据同步失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.userTypeLoading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '数据同步失败：' + err
          })
        })
    },
    // 获取其他参数
    getOhterParams() {
      this.otherLoading = true
      fetchOtherParams({})
        .then(res => {
          this.otherLoading = false
          if (res.code == '000000') {
            let data = res.data || []
            let newbornLogin = data.find(i => i.code == 'A2') || {}
            this.$store.commit('setNewbornLogin', newbornLogin)
            this.qjdl = data.find(i => i.code == 'A1') || {}
            this.qjdlEditVal = this.qjdl.val || null
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '获取其他参数失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.otherLoading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '获取其他参数失败：' + err
          })
        })
    },

    // 保存全景导览
    saveQjdl() {
      this.qjdlLoading = true
      let msg = '保存全景导览地址'
      let parms = { ...this.qjdl }
      parms.val = this.qjdlEditVal
      this.saveParams(parms, msg, () => {
        this.qjdl.val = this.qjdlEditVal
      })
    },

    // 开启/关闭新生登录
    changeSwitch(val) {
      this.otherLoading = true
      let msg = `${val ? '开启' : '关闭'}新生身份证登录`
      let params = { ...this.newbornLogin }
      params.val = val ? '1' : '0'
      this.saveParams(params, msg, () => {
        this.$store.commit('setNewbornLogin', params)
      })
    },

    // 保存参数
    saveParams(params, msg, fn) {
      saveOtherParams(params)
        .then(res => {
          this.otherLoading = false
          this.qjdlLoading = false
          if (res.code == '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: `${msg}成功！`
            })
            if (fn) {
              fn()
            }
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: `${msg}失败：${res.msg}`
            })
          }
        })
        .catch(err => {
          this.otherLoading = false
          this.qjdlLoading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: `${msg}失败：${err}`
          })
        })
    }
  },
  created() {
    this.getUserTypeList()
    this.getOhterParams()
  }
}
</script>

<style lang="scss">
.params-box {
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
  margin-left: 20px;
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #373b4b;
    line-height: 22px;
  }
}
.params-box-content {
  padding-top: 30px;
  margin-right: -20px;
  .item {
    display: inline-block;
    width: 252px;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
    color: #5f6464;
    line-height: 40px;
    border-radius: 4px;
    margin-right: 20px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .show-item {
    position: relative;
    background: #f5f6fd;
    padding: 0 8px 0 12px;
  }
  .add-item {
    background: #ffffff;
    color: rgba(0, 0, 0, 0.65);
    text-align: center;
    border: 1px dashed rgba(0, 0, 0, 0.2);
    cursor: pointer;
    &:hover {
      color: rgba(0, 0, 0, 0.8);
      border-color: rgba(0, 0, 0, 0.3);
    }
  }
  label {
    color: #5f6464;
  }
}
.switch {
  display: inline-block;
  position: relative;
  width: 54px;
  height: 22px;
  line-height: 22px;
  margin-top: -2px;
  span {
    position: absolute;
    font-size: 12px;
    padding-top: 1px;
    top: 0;
    cursor: pointer;
    &.on {
      color: #ffffff;
      left: 6px;
    }
    &.off {
      color: #999;
      right: 8px;
    }
  }
}
</style>

