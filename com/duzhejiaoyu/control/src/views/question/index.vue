<template>
  <div class="base-search-table">
    <div class="search-box">
      <!---------------------------- 查询条件 ---------------------------->
      <el-select
        class="no-wrap"
        v-model="isImportant"
        size="small"
        placeholder="是否必考"
        clearable
        style="width: 100px"
        @change="getTableData(1, pageSize)"
      >
        <el-option
          v-for="item in isImportantList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        class="no-wrap"
        multiple
        v-model="module"
        size="small"
        placeholder="所属模块"
        clearable
        style="width: 120px"
        @change="getTableData(1, pageSize)"
      >
        <el-option v-for="item in moduleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select
        class="no-wrap"
        multiple
        v-model="campus"
        size="small"
        placeholder="所属校区"
        clearable
        style="width: 120px"
        @change="getTableData(1, pageSize)"
      >
        <el-option v-for="item in campusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select
        class="no-wrap"
        multiple
        v-model="userType"
        size="small"
        placeholder="用户类型"
        clearable
        style="width: 120px"
        @change="getTableData(1, pageSize)"
      >
        <el-option v-for="item in userTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
      <el-input
        class="input-box"
        v-model="keyword"
        placeholder="请输入题目内容"
        size="small"
        clearable
        style="width: 160px"
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
      <el-button class="bule-border" size="small" @click="downTemplate">模板下载</el-button>
      <el-button class="bule-border" size="small" @click="upload">题库上传</el-button>
      <el-button class="bule-border" size="small" @click="exportData">导出题库</el-button>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-tabs v-model="questionType" @tab-click="handleClick">
        <el-tab-pane
          v-for="tab in questionTypeList"
          :key="tab.value"
          :label="tab.label"
          :name="tab.value"
        ></el-tab-pane>
      </el-tabs>
      <div class="tab-box">
        <span>总计{{total}}条</span>
        <div class="right-btn">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="$router.push('/question/add')"
          >新增</el-button>
          <el-button type="primary" size="small" @click="setBatch">批量设置</el-button>
          <el-button class="bule-border" size="small" @click="deleteBatch">批量删除</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        header-row-class-name="table-header"
        v-loading="loading"
        @selection-change="selectRows"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
        <el-table-column prop="subject" label="题目内容" show-overflow-tooltip width="500" fixed></el-table-column>
        <el-table-column
          v-if="questionType=='3'"
          prop="isTrue"
          label="答案"
          show-overflow-tooltip
          width="70"
        >
          <template slot-scope="scope">{{scope.row.isTrue == "1" ? "对" : "错"}}</template>
        </el-table-column>
        <el-table-column
          v-if="questionType=='1' || questionType=='2'"
          prop="options"
          label="选项"
          show-overflow-tooltip
          min-width="160"
        >
          <template slot-scope="scope">
            <div v-for="item in scope.row.options" :key="item.id">
              <input v-if="questionType == '1'" type="radio" :checked="item.isReal==1" />
              <input v-if="questionType == '2'" type="checkbox" :checked="item.isReal==1" />
              <span style="color: #5f6464;">{{item.itemInfo}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="modelNames"
          label="所属模块"
          show-overflow-tooltip
          min-width="140"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="campusNames"
          label="所属校区"
          show-overflow-tooltip
          min-width="140"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="usertypeNames"
          label="用户类型"
          show-overflow-tooltip
          min-width="140"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column prop="isImportant" label="是否必考" width="80">
          <template slot-scope="scope">{{scope.row.isImportant == "1" ? "是" : "否"}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <span @click="toEdit(scope.row)">编辑</span>
            <span @click="deleteRow(scope.row)">删除</span>
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
    <!---------------------------- 批量设置弹窗 ---------------------------->
    <set-drawer ref="setDrawer" @doFunc="getTableData(currentPage,pageSize)"></set-drawer>
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
import { fetchQuestionList, deleteQuestion, batchDelete } from '@/api/question'
import SetDrawer from './setDrawer.vue'
import Upload from '@/components/BaseUpload'
export default {
  components: {
    SetDrawer,
    Upload
  },
  data() {
    return {
      isImportant: null,
      isImportantList: [
        { id: 1, name: '是' },
        { id: 0, name: '否' }
      ],
      module: [],
      campus: [],
      userType: [],
      keyword: null,
      questionType: '3',
      tableData: [],
      loading: false,
      selectArr: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null,
      uploadUrl: window.g.url + 'question/importQuestions'
    }
  },
  computed: mapState({
    moduleList: state => state.moduleList,
    campusList: state => state.campusList,
    userTypeList: state => state.userTypeList,
    questionTypeList: state => state.questionTypeList
  }),
  methods: {
    // 下载模板
    downTemplate() {
      let url = `${window.g.url}question/downloadTemplate`
      window.open(url, '_blank')
    },
    // 上传
    upload() {
      this.$refs.upload.toupload()
    },
    // 上传完成
    uploaded(res) {
      this.loading = false
      if (res.code == '000000') {
        let data = res.data || {}
        let flag = data.importFlag || true
        if (!flag) {
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
        } else {
          this.$message({
            showClose: true,
            message: '导入成功！',
            type: 'success'
          })
          this.getTableData(1, this.pageSize)
          this.getGradeList()
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
      this.util.exportFile('question/exportQuestions', false, params, '导出题库', 'xlsx')
    },
    // 切换tab
    handleClick(tab) {
      this.getTableData(this.currentPage, this.pageSize)
    },
    // 编辑
    toEdit(row) {
      this.$router.push(`/question/edit/${row.id}`)
    },
    // 选中的行
    selectRows(rows) {
      this.selectArr = rows
    },
    // 批量设置
    setBatch() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请选择需要设置的题目！'
        })
        return
      }
      let drawer = this.$refs.setDrawer
      drawer.editForm.questionIds = this.selectArr.map(i => i.id)
      drawer.drawer = true
    },
    // 批量删除
    deleteBatch() {
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请选择需要删除的题目！'
        })
        return
      }
      this.$confirm(`是否确认删除所选择的题目？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          batchDelete(this.selectArr.map(i => i.id))
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
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除该题目？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteQuestion(row.id)
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
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        filter: {
          type: this.questionType || null,
          isImportant: [0,1].includes(this.isImportant) ? this.isImportant : null,
          modelIds: this.module.join(',') || null,
          campusIds: this.campus.join(',') || null,
          usertypeCodes: this.userType.join(',') || null,
          subject: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      }
      fetchQuestionList(param)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.tableData = res.data || []
            this.total = res.total
            this.currentPage = page || 1
            // 记录查询参数
            let params = {
              ...param.filter,
              limit: pageSize,
              page: page || 1
            }
            sessionStorage.setItem('questionParams', JSON.stringify(params))
          }
        })
        .catch(err => {
          this.loading = false
        })
    },

    // 初始化参数
    initParams() {
      let data = sessionStorage.getItem('questionParams')
      if (data) {
        let params = JSON.parse(data)
        let { type, isImportant, moduleIds, campusIds, usertypeCodes, subject, limit, page } = params
        this.questionType = type
        this.isImportant = isImportant
        this.module = moduleIds ? moduleIds.split(',') : []
        this.campus = campusIds ? campusIds.split(',') : []
        this.userType = usertypeCodes ? usertypeCodes.split(',') : []
        this.keyword = subject
        this.pageSize = limit
        this.currentPage = page
      }
    }
  },
  created() {
    this.initParams()
    this.getTableData(this.currentPage, this.pageSize)
    if (this.moduleList.length == 0) {
      this.$store.dispatch('getModuleList')
    }
    if (this.campusList.length == 0) {
      this.$store.dispatch('getCampusList')
    }
    if (this.userTypeList.length == 0) {
      this.$store.dispatch('getUserTypeList')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.search-box {
  margin: 20px 0 20px 20px;
  background: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
  .el-select,
  .el-input {
    margin-right: 5px;
  }
}
.table-content {
  padding-bottom: 20px;
  margin: 20px 0 20px 20px;
  background: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
}
.tab-box {
  padding: 0 20px;
  margin-top: -5px;
  span {
    color: #999999;
    line-height: 32px;
  }
  .right-btn {
    float: right;
  }
}
.el-table {
  .cell {
    span.disabled {
      color: rgba(0, 0, 0, 0.25);
      cursor: auto;
    }
    span.status-tag {
      &::before {
        display: inline-block;
        content: '';
        width: 8px;
        height: 8px;
        margin-right: 4px;
        border-radius: 6px;
        background: #dbdbdb;
      }
      &.pending {
        color: #faad14 !important;
        &::before {
          background: #faad14;
        }
      }
      &.error {
        color: #ff4d4f;
        &::before {
          background: #ff4d4f;
        }
      }
    }
  }
  input[type='radio'],input[type='checkbox'] {
    margin-right: 5px;
  }
}
</style>