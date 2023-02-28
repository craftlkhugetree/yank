<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>业务领域</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input class="input-box" v-model="keyword" placeholder="请输入名称" size="small" clearable></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1,pageSize)"
        >查询</el-button>
        <el-divider v-if="isAdmin" direction="vertical"></el-divider>
        <el-button
          v-if="isAdmin" 
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
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="NAME" label="业务领域" show-overflow-tooltip></el-table-column>
        <el-table-column prop="users" label="人员" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.users.map(i => i.NAME).join(",") || "--"}}</template>
        </el-table-column>
        <el-table-column
          prop="questtypenames"
          label="问题分类"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="areanames"
          label="区域"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column label="排序" align="center" width="180" v-if="isAdmin">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="sort(scope.$index,'up')">
                <i class="el-icon-top"></i>上移
              </span>
              <span @click="sort(scope.$index,'down')">
                <i class="el-icon-bottom"></i>下移
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ISLOCK" label="状态" width="100">
          <template slot-scope="scope">
            <div class="switch">
              <el-switch
                ref="switch"
                :width="54"
                :value="scope.row.ISLOCK"
                active-value="0"
                inactive-value="1"
                @change="changeStatus(scope.row)"
              ></el-switch>
              <span class="on" v-show="scope.row.ISLOCK==0" @click="changeStatus(scope.row)">开启</span>
              <span class="off" v-show="scope.row.ISLOCK==1" @click="changeStatus(scope.row)">关闭</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="openDrawer('edit',scope.row)">编辑</span>
              <span v-if="isAdmin" @click="deleteRow(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!---------------------------- 分页 ---------------------------->
    <!-- <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5,10,15,20]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="size => getTableData(currentPage, size)"
      ></el-pagination>
    </div> -->

    <!---------------------------- 弹窗 ---------------------------->
    <areaDrawer ref="areaDrawer" @doFunc="getTableData(currentPage,pageSize)"></areaDrawer>
  </div>
</template>

<script>
import areaDrawer from './areaDrawer'
export default {
  components: {
    areaDrawer
  },
  data() {
    return {
      keyword: null,
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  computed: {
    userRoleIds() {
      return this.$store.state.userRoles.map(i => i.ID);
    },
    // 是否后勤管理员
    isAdmin() {
      return this.userRoleIds.includes("20230203-1")
    },
    // 当前用户的业务领域
    userOrgs() {
      let userInfo = this.$store.state.userInfo || {}
      let orgs = userInfo.userOrgId || []
      return orgs.map(i => i.ID)
    }
  },
  methods: {
    // 打开弹窗
    openDrawer(type, row) {
      let areaDrawer = this.$refs.areaDrawer
      areaDrawer.saveNameSuccess = false
      if (type == 'add') {
        areaDrawer.title = '新增业务领域'
      } else if (type == 'edit') {
        areaDrawer.title = '编辑业务领域-' + row.NAME
        areaDrawer.areaName = row.NAME
        areaDrawer.editForm.id = row.ID
        areaDrawer.editForm.name = row.NAME
      }
      areaDrawer.drawer = true
    },
    // 获取数据
    getTableData(page, pageSize) {
      this.loading = true
      this.util
        .postAjax({
          code: this.global.authCode,
          url: 'rest/UserGroup/getList',
          data: {
            filter: JSON.stringify({
              APPID: this.$store.state.GROUPID,
              NAME: this.keyword
            }),
            // limit: pageSize || this.pageSize,
            limit: 100,
            page: page || 1,
            withUser: '1', // 需要返回该业务领域的用户
            ISDELETE: '0'
          }
        })
        .then(res => {
          this.loading = false
          if (res.success) {
            this.tableData = res.items || []
            // 如果不是管理员，只能获取自己的业务领域
            if(!this.isAdmin) {
              this.tableData = this.tableData.filter(i => this.userOrgs.includes(i.ID))
            }
            // 转换数据
            this.tableData.forEach(i => {
              let arr = i.userinfos ? i.userinfos.split(',') : []
              i.users = arr.map(j => {
                return {
                  ID: j.split('|')[0],
                  NAME: j.split('|')[1]
                }
              })
            })
            this.total = res.total || 0
            // 获取问题类型
            this.getQuestTypes().then(types => {
              this.tableData.forEach(i => {
                let arr = types.filter(j => j.deptid == i.ID)
                this.$set(i, 'questtypenames', arr.map(k => k.name).join('，'))
              })
            })
            // 获取区域
            this.getAreas().then(areas => {
              this.tableData.forEach(i => {
                let arr = areas.filter(j => j.deptid == i.ID)
                this.$set(i, 'areanames', arr.map(k => k.name).join('，'))
              })
            })
          }
          this.currentPage = page
          this.pageSize = pageSize
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除该业务领域？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          this.util
            .postAjax({
              code: this.global.authCode,
              url: 'rest/UserGroup/deleteGroup',
              data: {
                ID: row.ID
              }
            })
            .then(res => {
              this.loading = false
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `删除成功！`
                })
                this.$store.dispatch('getDepartments')
                this.getTableData(this.currentPage, this.pageSize)
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `删除失败：${res.data.message}`
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
    // 排序
    sort(index, type) {
      let id1 = '',
        id2 = ''
      if (type == 'up') {
        if (index == 0) {
          return
        } else {
          id1 = this.tableData[index - 1].ID
          id2 = this.tableData[index].ID
        }
      } else {
        if (index == this.tableData.length - 1) {
          return
        } else {
          id1 = this.tableData[index].ID
          id2 = this.tableData[index + 1].ID
        }
      }
      this.loading = true
      this.util
        .postAjax({
          code: this.global.authCode,
          url: 'rest/UserGroup/changeLevel',
          data: {
            id1: id1,
            id2: id2
          }
        })
        .then(res => {
          this.loading = false
          if (res.success) {
            this.getTableData(this.currentPage, this.pageSize)
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 获取所有问题类型
    getQuestTypes() {
      return new Promise((resolve, reject) => {
        this.util
          .postAjax({
            code: this.global.code,
            url: '/questtype/types',
            isRep: true,
            data: {}
          })
          .then(res => {
            if (res.success) {
              resolve(res.data)
            } else {
              reject(res.data.message)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取所有区域
    getAreas() {
      return new Promise((resolve, reject) => {
        this.util
          .postAjax({
            code: this.global.code,
            url: '/area/areas',
            isRep: true,
            data: {}
          })
          .then(res => {
            if (res.success) {
              resolve(res.data)
            } else {
              reject(res.data.message)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 开启/关闭
    changeStatus(row) {
      let msg = row.ISLOCK == 0 ? '关闭' : '开启'
      this.$confirm(`是否确认${msg}业务领域『 ${row.NAME} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          this.util
            .postAjax({
              code: this.global.authCode,
              url: "rest/UserGroup/saveGroup",
              data: {
                data: JSON.stringify({
                  ID: row.ID,
                  NAME: row.NAME,
                  APPID: this.$store.state.GROUPID,
                  ISLOCK: row.ISLOCK == 1 ? 0 : 1
                })
              }
            })
            .then(res => {
              this.loading = false
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `${msg}成功！`
                })
                this.$store.dispatch("getDepartments");
                this.getTableData(this.currentPage, this.pageSize)
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `${msg}失败：${res.data.errInf.shortBusInf}`
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: `${msg}失败：${err}`
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

<style lang="scss">
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
      color: #ffffff !important;
      left: 6px;
    }
    &.off {
      color: #999 !important;
      right: 8px;
    }
  }
}
.el-table {
  margin-bottom: 100px;
}
</style>