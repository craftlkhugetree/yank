<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0">
      <h3 style="width: 120px">用户管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right" style="max-width: 100%">
        <el-select
          v-model="grade"
          size="small"
          placeholder="选择年级"
          clearable
          style="width: 100px"
          @change="getTableData(1, pageSize)"
        >
          <el-option
            v-for="item in gradeList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          v-model="status"
          size="small"
          placeholder="选择状态"
          clearable
          style="width: 100px"
          @change="getTableData(1, pageSize)"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入姓名或证件号查询"
          size="small"
          clearable
          style="width: 190px"
          @clear="getTableData(1, pageSize)"
          @keyup.enter.native="getTableData(1, pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1, pageSize)"
        >查询</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" size="small" @click="activeUsers('all')">批量激活</el-button>
        <el-dropdown @command="downTemplate">
          <el-button class="bule-border" size="small">
            模板下载
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="new">新生导入模板</el-dropdown-item>
            <el-dropdown-item command="sync">同步导入模板</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="upload">
          <el-button class="bule-border" size="small">
            导入用户
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="new">新生导入</el-dropdown-item>
            <el-dropdown-item command="sync">同步导入</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="bule-border" size="small" @click="exportData">导出</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        header-row-class-name="table-header"
        v-loading="loading"
        @selection-change="selectRows"
      >
        <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
        <el-table-column type="index" label="序号" width="60" fixed></el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip width="100" fixed></el-table-column>
        <el-table-column
          prop="readerid"
          label="证件号"
          show-overflow-tooltip
          width="120"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="barcode"
          label="条码"
          show-overflow-tooltip
          width="120"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column prop="idcard" label="身份证号" show-overflow-tooltip width="180"></el-table-column>
        <el-table-column
          prop="grade"
          label="年级"
          show-overflow-tooltip
          width="120"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="dept"
          label="所属"
          show-overflow-tooltip
          width="120"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column prop="campusname" label="校区" show-overflow-tooltip width="120"></el-table-column>
        <el-table-column
          prop="qqcard"
          label="QQ"
          show-overflow-tooltip
          width="120"
          v-if="openNewbornLogin"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          show-overflow-tooltip
          width="120"
          v-if="openNewbornLogin"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          show-overflow-tooltip
          width="120"
          v-if="openNewbornLogin"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          show-overflow-tooltip
          width="120"
          :formatter="common.defaultFormat"
        >
          <template slot-scope="scope">{{scope.row.sex == "0" ? "男" : "女"}}</template>
        </el-table-column>
        <el-table-column prop="usertypename" label="用户类型" show-overflow-tooltip width="120"></el-table-column>
        <el-table-column prop="readerflag" label="状态" show-overflow-tooltip width="120">
          <template slot-scope="scope">
            <span
              class="status"
              :class="`status-${scope.row.readerflag}`"
            >{{scope.row.statusObj && scope.row.statusObj.label}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="120" fixed="right">
          <template slot-scope="scope">
            <span v-show="scope.row.status == '2'" @click="activeUsers('one',scope.row)">激活</span>
            <span style="float:right;" @click="toRecord(scope.row)">考试记录</span>
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
          :page-sizes="[10, 20, 50, 100]"
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
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="xls|XLS|xlsx|XLSX"
      @done="uploaded"
      @choose="loading=true"
      :url="uploadUrl"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchUserList, activeUsers } from '@/api/users'
import Upload from '@/components/BaseUpload'
export default {
  components: {
    Upload
  },
  data() {
    return {
      grade: null,
      status: null,
      keyword: null,
      tableData: [],
      loading: false,
      selectArr: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null,
      uploadUrl: window.g.url + 'user/importNewStu'
    }
  },
  computed: mapState({
    statusList: state => state.userStatusList,
    gradeList: state => state.gradeList,
    openNewbornLogin: state => state.newbornLogin
  }),
  methods: {
    // 可选的行
    selectable(row, index) {
      return row.status == '2'
    },

    // 选中的行
    selectRows(rows) {
      this.selectArr = rows
    },

    // 批量激活
    activeUsers(type, row) {
      if (type == 'all' && this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请选择需要激活的用户！'
        })
        return
      }
      this.loading = true
      let param = type == 'all' ? this.selectArr.map(i => i.id) : [row.id]
      activeUsers(param)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '激活成功！'
            })
            this.getTableData(this.currentPage, this.pageSize)
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '激活失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '激活失败：' + err
          })
        })
    },

    // 下载模板
    downTemplate(command) {
      let url = command == 'new' ? `${window.g.url}user/downloadNewStuTemplate` : `${window.g.url}user/downloadSyncStuTemplate`
      window.open(url, '_blank')
    },

    // 上传
    upload(command) {
      this.uploadUrl = command == "new" ? `${window.g.url}user/importNewStu` : `${window.g.url}user/importSyncStu`
      this.$refs.upload.toupload()
    },
    // 上传完成
    uploaded(res) {
      this.loading = false
      if (res.code == '000000') {
        let data = res.data
        if (data.importFlag || data.flag) {
          this.$message({
            showClose: true,
            message: '导入成功！',
            type: 'success'
          })
          this.getTableData(1, this.pageSize)
        } else {
          let msg = ''
          let errors = data.errors || {}
          for (let key in errors) {
            msg += `第${key}行：${errors[key]}` + '\n'
          }
          this.$message({
            showClose: true,
            message: '导入失败：' + '\n' + msg,
            type: 'error'
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '导入失败：' + res.msg,
          type: 'error'
        })
      }
    },

    // 导出
    exportData() {
      let params = {}
      this.util.exportFile('user/exportUsers', false, params, '导出用户', 'xlsx')
    },

    // 考试记录
    toRecord(row) {
      this.$router.push(`/sys-setting/users/record/${row.id}`)
      sessionStorage.setItem('curRecordUserName', row.name)
    },

    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        filter: {
          grade: this.grade || null,
          readerflag: this.status || null,
          keyword: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      }
      fetchUserList(param)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.tableData = res.data || []
            this.total = res.total
            this.currentPage = page || 1
            this.tableData.forEach(i => {
              let obj = this.statusList.find(j => j.value == i.readerflag)
              this.$set(i, 'statusObj', obj)
            })
            // 记录查询参数
            let params = {
              ...param.filter,
              limit: pageSize,
              page: page || 1
            }
            sessionStorage.setItem('userParams', JSON.stringify(params))
          }
        })
        .catch(err => {
          this.loading = false
        })
    },

    // 初始化参数
    initParams() {
      let data = sessionStorage.getItem('userParams')
      if (data) {
        let params = JSON.parse(data)
        this.grade = params.grade
        this.status = params.readerflag
        this.keyword = params.keyword
        this.pageSize = params.limit
        this.currentPage = params.page
      }
    }
  },
  created() {
    this.initParams()
    this.getTableData(this.currentPage, this.pageSize)
    if (this.gradeList.length == 0) {
      this.$store.dispatch('getGradeList')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.search-box-right {
  .el-input,
  .el-select {
    margin-right: 5px !important;
  }
  .el-button {
    margin-right: 5px;
    padding: 9px 10px;
  }
}
.el-table {
  .status {
    color: $normal-color !important;
    &::before {
      display: inline-block;
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background-color: $normal-color;
      margin-right: 8px;
    }
  }
  .status-2,
  .status-3 {
    color: $error-color !important;
    &::before {
      background-color: $error-color;
    }
  }
  .status-0 {
    color: $disabled-color !important;
    &::before {
      background-color: $disabled-color;
    }
  }
}
</style>