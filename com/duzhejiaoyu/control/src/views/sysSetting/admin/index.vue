<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>管理员管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openDrawer('add')"
        >新增</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="NAME" label="姓名"></el-table-column>
        <el-table-column prop="LOGINNAME" label="登录账号"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <div class="more-span">
              <!-- <span @click="openDrawer('edit',scope.row)">编辑</span> -->
              <span @click="resetPwd(scope.row)" v-if="authType=='local'">重置密码</span>
              <span @click="deleteAccount(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total > 0">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[5,10,15,20]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
    </div>
    <!---------------------------- 新增 ---------------------------->
    <account-drawer ref="accountDrawer" @doFunc="getTableData(1,pageSize)"></account-drawer>
    <third-drawer ref="thirdDrawer" @doFunc="getTableData(1,pageSize)"></third-drawer>
  </div>
</template>

<script>
import AccountDrawer from './accountDrawer'
import ThirdDrawer from './thirdDrawer.vue'
import { fetchUserList, saveUser, saveUserPwd } from '@/api/admin'
export default {
  components: {
    AccountDrawer,
    ThirdDrawer
  },
  data() {
    return {
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      authType: window.g.authType,  // 本地认证 或者 第三方认证
    }
  },
  methods: {
    // 打开弹窗
    openDrawer(type, row) {
      let drawer = this.authType == "local" ? this.$refs.accountDrawer : this.$refs.thirdDrawer
      if (type == 'add') {
        drawer.title = '新增管理员'
      } 
      // if (type == 'edit') {
      //   drawer.title = '编辑管理员-' + row.NAME
      //   drawer.editForm = {
      //     ID: row.ID,
      //     NICKNAME: row.NICKNAME,
      //     NAME: row.NAME,
      //     LOGINNAME: row.LOGINNAME,
      //     PWD: row.PWD
      //   }
      // }
      drawer.drawer = true
    },
    // 获取账号列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        page: page || 1,
        limit: pageSize || this.pageSize,
        filter: JSON.stringify({
          STATUS: '1',
          // TID: this.$store.state.appId,
          ROLEID: this.$store.state.adminRoleId
        })
      }
      fetchUserList(param)
        .then(res => {
          this.loading = false
          this.tableData = res.items || []
          this.total = res.total
          this.currentPage = page || 1
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 删除
    deleteAccount(row) {
      this.$confirm(`是否确认删除账号『 ${row.NAME} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          let param = {
            d: JSON.stringify({
              ID: row.ID,
              STATUS: '0' // 0删除 1在用 2停用
            })
          }
          saveUser(param)
            .then(res => {
              this.loading = false
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `删除成功！`
                })
                this.getTableData()
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `删除失败：${res.data.errInf.shortBusInf}`
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: `删除失败：${err}`
              })
            })
        })
        .catch(() => {
          return
        })
    },
    // 重置密码
    resetPwd(row) {
      let msg = `确定重置用户『 ${row.NAME} 』的密码吗？` + '\n' + '系统默认登录密码为『 123456 』'
      this.$confirm(`${msg}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        let param = {
          data: JSON.stringify({
            ID: row.ID,
            PWD: '123456'
          })
        }
        saveUserPwd(param)
          .then(res => {
            this.loading = false
            if (res.success) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '重置密码成功！'
              })
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: '重置密码失败：' + res.data.message
              })
            }
          })
          .catch(err => {
            this.loading = false
            this.$message({
              showClose: true,
              type: 'error',
              message: '重置密码失败：' + err
            })
          })
      }).catch(() => {return;})
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize)
  }
}
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
}
</style>