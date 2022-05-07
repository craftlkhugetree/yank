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
        <el-option
          v-for="item in userTypeList"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        ></el-option>
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
      <el-button class="bule-border" size="small" @click="exportData">导出分析</el-button>
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
      </div>
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        header-row-class-name="table-header"
        v-loading="loading"
        @sort-change="sortBy"
      >
        <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
        <el-table-column prop="subject" label="题目内容" show-overflow-tooltip width="500" fixed></el-table-column>
        <el-table-column
          prop="modelNames"
          label="所属模块"
          show-overflow-tooltip
          width="140"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="campusNames"
          label="所属校区"
          show-overflow-tooltip
          width="140"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="usertypeNames"
          label="所属用户类型"
          show-overflow-tooltip
          width="140"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column sortable="custom" prop="answerNum" label="被答次数" show-overflow-tooltip></el-table-column>
        <el-table-column sortable="custom" prop="passNum" label="正确次数" show-overflow-tooltip></el-table-column>
        <el-table-column sortable="custom" prop="unpassNum" label="错误次数" show-overflow-tooltip></el-table-column>
        <el-table-column sortable="custom" prop="passRate" label="正确率" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.answerNum ? common.multiply(scope.row.passRate , 100, 2) + "%" : "--"}} 
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchQuestionList } from '@/api/analysis'
export default {
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
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null
    }
  },
  computed: mapState({
    moduleList: state => state.moduleList,
    campusList: state => state.campusList,
    userTypeList: state => state.userTypeList,
    questionTypeList: state => state.questionTypeList
  }),
  methods: {
    // 导出
    exportData() {
      let params = {}
      this.util.exportFile('analysisQuestion/exportAnalysis', false, params, '导出分析', 'xlsx')
    },
    // 切换tab
    handleClick(tab) {
      this.getTableData(this.currentPage, this.pageSize)
    },
    // 排序
    sortBy(obj) {
      this.orderBy = obj.prop
      this.sort = obj.order == 'ascending' ? 'asc' : 'desc'
      this.getTableData(1, this.pageSize)
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        filter: {
          type: this.questionType || null,
          isImportant: [0, 1].includes(this.isImportant) ? this.isImportant : null,
          modelIds: this.module.join(',') || null,
          campusIds: this.campus.join(',') || null,
          usertypeCodes: this.userType.join(',') || null,
          subject: this.keyword || null,
        },
        sort: this.sort || null,
        orderBy: this.orderBy || null,
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
          }
        })
        .catch(err => {
          this.loading = false
        })
    }
  },
  created() {
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
  input[type='radio'],
  input[type='checkbox'] {
    margin-right: 5px;
  }
}
</style>