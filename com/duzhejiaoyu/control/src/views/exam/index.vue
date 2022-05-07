<template>
  <div class="base-search-table">
    <!---------------------------- 表格 ---------------------------->
    <div class="search-box">
      <!---------------------------- 查询条件 ---------------------------->
      <el-input
        class="input-box"
        v-model="keyword"
        placeholder="请输入考试名称"
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
    </div>
    <el-tabs v-model="examType" @tab-click="handleClick">
      <el-tab-pane
        v-for="tab in examTypeList"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
      ></el-tab-pane>
    </el-tabs>
    <div class="tab-box">
      <span>总计{{total}}条</span>
      <div class="right-btn">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      header-row-class-name="table-header"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
      <el-table-column prop="name" label="考试名称" show-overflow-tooltip width="260" fixed>
        <template slot-scope="scope">
          <h3>{{scope.row.name}}</h3>
          <p
            v-if="examType=='1'"
          >判断（{{scope.row.content.judgeNum || 0}}）、单选（{{scope.row.content.singleNum || 0}}）、多选（{{scope.row.content.multipleNum || 0}}）</p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="examType=='2'"
        prop="modelNames"
        label="考试模块"
        show-overflow-tooltip
        min-width="340"
      >
        <template slot-scope="scope">
          <p
            v-for="item in scope.row.contents"
            :key="item.id"
          >{{item.modelName}}：判断（{{item.judgeNum || 0}}）、单选（{{item.singleNum || 0}}）、多选（{{item.multipleNum || 0}}）</p>
        </template>
      </el-table-column>
      <el-table-column prop="examDate" label="参加考试时间" show-overflow-tooltip width="240">
      </el-table-column>
      <el-table-column
        v-if="examType=='1'"
        prop="modelNames"
        label="题目模块"
        show-overflow-tooltip
        min-width="160"
        :formatter="common.defaultFormat"
      ></el-table-column>
      <el-table-column prop="usertypeNames" label="适用对象" show-overflow-tooltip min-width="300">
        <template slot-scope="scope">
          <p style="margin-bottom:6px;">适用校区：{{scope.row.campusNames}}</p>
          <p>适用用户：{{scope.row.usertypeNames}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="isUse" label="状态" width="100">
        <template slot-scope="scope">
          <div class="switch">
            <el-switch
              ref="switch"
              :width="54"
              v-model="scope.row.isUse"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus(scope.row)"
            ></el-switch>
            <span class="on" v-show="scope.row.isUse==1" @click="changeStatus(scope.row)">开启</span>
            <span class="off" v-show="scope.row.isUse==0" @click="changeStatus(scope.row)">关闭</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope">
          <span @click="toEdit(scope.row)">编辑</span>
          <span @click="deleteRow(scope.row)">删除</span>
          <span @click="toRecord(scope.row)">考试记录</span>
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
</template>

<script>
import { mapState } from 'vuex'
import { fetchExamList, deleteExam, changeStatus } from '@/api/exam'
export default {
  data() {
    return {
      keyword: null,
      examType: '1',
      tableData: [],
      loading: false,
      selectArr: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null
    }
  },
  computed: mapState({
    examTypeList: state => state.examTypeList
  }),
  methods: {
    // 切换tab
    handleClick(tab) {
      this.getTableData(this.currentPage, this.pageSize)
    },
    // 新增
    toAdd() {
      let type = this.examType == '1' ? 'common' : 'stage'
      this.$router.push(`/exam/${type}-add`)
    },
    // 编辑
    toEdit(row) {
      let type = this.examType == '1' ? 'common' : 'stage'
      this.$router.push(`/exam/${type}-edit/${row.id}`)
    },
    // 考试记录
    toRecord(row) {
      let exam = { id: row.id, name: row.name }
      sessionStorage.setItem('curExam', JSON.stringify(exam))
      this.$router.push(`/exam/record`)
    },
    // 开启/关闭
    changeStatus(row) {
      let msg = row.isUse == 1 ? '关闭' : '开启'
      this.$confirm(`是否确认${msg}考试『 ${row.name} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          changeStatus(row.id)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `${msg}成功！`
                })
                this.getTableData()
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `${msg}失败：${res.msg}`
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
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除考试『 ${row.name} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteExam(row.id)
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
          type: this.examType || null,
          name: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      }
      fetchExamList(param)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.tableData = res.data || []
            this.tableData.forEach(i => {
              i.examDate = `${this.moment(i.startDate,"YYYYMMDD").format("YYYY-MM-DD")} 至 ${this.moment(i.endDate,"YYYYMMDD").format("YYYY-MM-DD")}` 
              i.content = i.contents[0] || {}
            })
            this.total = res.total
            this.currentPage = page || 1
            // 记录查询参数
            let params = {
              ...param.filter,
              limit: pageSize,
              page: page || 1
            }
            sessionStorage.setItem('examParams', JSON.stringify(params))
          }
        })
        .catch(err => {
          this.loading = false
        })
    },

    // 初始化参数
    initParams() {
      let data = sessionStorage.getItem('examParams')
      if (data) {
        let params = JSON.parse(data)
        let { type, name, limit, page } = params
        this.examType = type
        this.keyword = name
        this.pageSize = limit
        this.currentPage = page
      }
    }
  },
  created() {
    this.initParams()
    this.getTableData(this.currentPage, this.pageSize)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.search-box {
  position: absolute;
  right: 0;
  padding: 8px 20px !important;
  z-index: 100;
  .el-select,
  .el-input {
    margin-right: 5px;
  }
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
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 6px;
  }
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
  input[type='radio'],
  input[type='checkbox'] {
    margin-right: 5px;
  }
}
</style>