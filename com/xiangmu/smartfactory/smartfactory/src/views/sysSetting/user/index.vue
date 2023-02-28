<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>用户管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入登录名或姓名查询"
          size="small"
          style="width: 190px"
          clearable
          @clear="getTableData(1, pageSize)"
          @keyup.enter.native="getTableData(1, pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1, pageSize)"
        >查询</el-button>
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
        style="width: 100%"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="loginname" label="登录名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="openDrawer('edit', scope.row)">编辑</span>
              <span @click="openPwdDrawer(scope.row)">重置密码</span>
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
          :page-sizes="[5, 10, 15, 20]"
          :current-page.sync="currentPage"
          @current-change="(page) => getTableData(page, pageSize)"
          @size-change="
            (size) => {
              pageSize = size;
              getTableData(1, size);
            }
          "
        ></el-pagination>
      </div>
    </div>
    <!---------------------------- 新增角色 ---------------------------->
    <account-drawer ref="accountDrawer" @doFunc="getTableData(1, pageSize)"></account-drawer>
    <!---------------------------- 重置密码 ---------------------------->
    <pwd-drawer ref="pwdDrawer"></pwd-drawer>
  </div>
</template>

<script>
import AccountDrawer from './accountDrawer'
import PwdDrawer from './pwdDrawer'
import { fetchUserList, deleteUser } from '@/api/admin/user.js'
export default {
  components: {
    AccountDrawer,
    PwdDrawer
  },
  data() {
    return {
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    // 打开弹窗
    openDrawer(type, row) {
      let accountDrawer = this.$refs.accountDrawer
      if (type == 'add') {
        accountDrawer.title = '新增用户'
      } else if (type == 'edit') {
        accountDrawer.title = '编辑用户-' + row.loginname
        accountDrawer.editForm = {
          id: row.id,
          loginname: row.loginname,
          name: row.name
        }
      }
      accountDrawer.drawer = true
    },
    // 打开重置密码弹窗
    openPwdDrawer(row) {
      let pwdDrawer = this.$refs.pwdDrawer
      pwdDrawer.title = '重置密码-' + row.loginname
      pwdDrawer.editForm.id = row.id
      pwdDrawer.drawer = true
    },
    // 获取账号列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        page: page || 1,
        limit: pageSize || this.pageSize,
        filter: {
          keyword: this.keyword || null
        }
      }
      fetchUserList(param)
        .then(res => {
          if (res.code == '000000') {
            this.loading = false
            this.tableData = res.data || []
            this.total = res.total
            this.currentPage = page || 1
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 删除
    deleteAccount(row) {
      this.$confirm(`是否确认删除账号『 ${row.loginname} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteUser(row.id)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
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
                  message: `删除失败：${res.msg}`
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