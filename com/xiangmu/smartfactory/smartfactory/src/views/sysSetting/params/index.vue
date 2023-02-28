<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>参数配置</h3>
    </div>
    <div class="params-content">
      <div class="params-item" v-loading="goodsLoading" v-if="showDzq">
        <h3>待装区配置</h3>
        <el-form
          ref="editForm"
          :model="editForm"
          label-width="80px"
          label-suffix="："
          :show-message="false"
          label-position="left"
        >
          <el-form-item
            v-for="item in list"
            :key="item.id"
            :prop="item.id"
            :label="item.name"
            required
          >
            <el-input-number
              v-model="editForm[item.id]"
              size="small"
              controls-position="right"
              :min="0"
            ></el-input-number>
            <span class="params-item-tip">个待装区</span>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="saveGoodsParams">保存</el-button>
      </div>
      <div class="params-item" v-loading="loading">
        <h3>叫号配置</h3>
        <el-form
          ref="editFormCall"
          :model="editFormCall"
          label-width="100px"
          label-suffix="："
          :show-message="false"
          label-position="left"
        >
          <el-form-item prop="val" label="叫号未到" required>
            <el-input-number
              v-model="editFormCall.val"
              size="small"
              controls-position="right"
              :min="0"
            ></el-input-number>
            <span class="params-item-tip">分钟未到自动过号</span>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="saveParams">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchParams, saveParams, fetchGoodsParams, saveGoodsParams } from '@/api/admin/params.js'
export default {
  data() {
    return {
      loading: false,
      goodsLoading: false,
      showDzq: false,
      list: [],
      editForm: {},
      editFormCall: {
        id: 1,
        code: "A01",
        desc: "叫号未到多少分钟过号",
        val: 20
      }
    }
  },
  methods: {
    // 获取叫号配置
    getParams() {
      this.loading = true
      fetchParams()
        .then(res => {
          this.loading = false
          if (res.code == "000000") {
            let data = res.data.filter(i => i.code == "A01")[0] || {}
            this.editFormCall.val = data.val || 20
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 保存叫号配置
    saveParams() {
      this.$refs.editFormCall.validate(valid => {
        if (valid) {
          let params = {
            ...this.editFormCall
          }
          this.loading = true
          saveParams(params)
            .then(res => {
              this.loading = false
              if (res.code == "000000") {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '保存成功！'
                })
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败：' + res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败：' + err
              })
            })
        }
      })
    },
    // 获取待装区配置
    getGoodsParams() {
      this.goodsLoading = true
      fetchGoodsParams()
        .then(res => {
          this.goodsLoading = false
          if (res.success) {
            this.list = res.data || []
            this.list.forEach(i => {
              this.$set(this.editForm, i.id, i.receivedarea)
            })
          }
        })
        .catch(err => {
          this.goodsLoading = false
        })
    },
    // 保存待装区配置
    saveGoodsParams() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let params = []
          for (let i in this.editForm) {
            let obj = {
              id: i,
              receivedarea: this.editForm[i]
            }
            params.push(obj)
          }
          this.goodsLoading = true
          saveGoodsParams(params)
            .then(res => {
              this.goodsLoading = false
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '保存成功！'
                })
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败：' + res.data.message || res.data.errInf.shortBusInf
                })
              }
            })
            .catch(err => {
              this.goodsLoading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败：' + err
              })
            })
        }
      })
    }
  },
  created() {
    this.getParams()
    // this.getGoodsParams();
  }
}
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
}
.params-content {
  margin: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  .params-item {
    margin-top: 20px;
    margin-bottom: 30px;
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #373b4b;
      margin-bottom: 20px;
    }
    .params-item-tip {
      color: #5f6464;
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss">
.params-item {
  .el-form-item__label {
    color: #5f6464;
  }
}
</style>