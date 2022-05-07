<template>
  <div class="base-search-table detail">
    <div class="search-box clearfix">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      <!----------------- 学院 ----------------->
      <el-popover
        placement="bottom-start"
        width="200"
        trigger="manual"
        v-model="showPopover"
        :visible-arrow="false"
      >
        <div class="popover-select-box">
          <el-input
            placeholder="请输入"
            size="small"
            suffix-icon="el-icon-search"
            v-model="query"
            clearable
            @clear="getExamList"
            @keyup.enter.native="getExamList"
          ></el-input>
          <ul>
            <li
              v-for="item in examList"
              :key="item.id"
              :class="{'active': curExamId == item.id}"
              @click="chooseExam(item)"
            >{{item.name}}</li>
            <li v-if="examList.length == 0">暂无考试</li>
          </ul>
        </div>
        <el-button
          size="small"
          slot="reference"
          class="popover-btn"
          @click="showPopover=!showPopover"
        >
          {{curExamName}}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
      </el-popover>
    </div>
    <div class="tab-box">
      <span>2598参与 · 1936 合格 / 636 不合格 · 88.8% 通过率</span>
      <div class="right-btn">
        <el-select
          v-model="grade"
          size="small"
          placeholder="年级"
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
          v-model="dept"
          size="small"
          placeholder="所属"
          clearable
          style="width:100px"
          @change="getTableData(1,pageSize)"
        >
          <el-option
            v-for="item in deptList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-select
          v-model="status"
          size="small"
          placeholder="考试状态"
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
          placeholder="请输入姓名"
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
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      header-row-class-name="table-header"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="60" fixed></el-table-column>
      <el-table-column prop="name" label="姓名" show-overflow-tooltip width="100" fixed></el-table-column>
      <el-table-column
        prop="readerid"
        label="证件号"
        show-overflow-tooltip
        width="100"
        :formatter="common.defaultFormat"
      ></el-table-column>
      <el-table-column
        prop="barcode"
        label="条码"
        show-overflow-tooltip
        width="100"
        :formatter="common.defaultFormat"
      ></el-table-column>
      <el-table-column prop="idcard" label="身份证号" show-overflow-tooltip min-width="180"></el-table-column>
      <el-table-column
        prop="grade"
        label="年级"
        show-overflow-tooltip
        :formatter="common.defaultFormat"
      ></el-table-column>
      <el-table-column
        prop="dept"
        label="所属"
        show-overflow-tooltip
        :formatter="common.defaultFormat"
      ></el-table-column>
      <el-table-column prop="campusName" label="校区" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="考试时间" show-overflow-tooltip min-width="140" :formatter="common.timeFormat"></el-table-column>
      <el-table-column prop="score" label="考试分数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isPass" label="考试状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            class="status"
            :class="`status-${scope.row.isPass}`"
          >{{scope.row.isPass=="1" ? "合格" : "不合格"}}</span>
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
import { fetchExamList, fetchExamRecords } from '@/api/exam'
export default {
  data() {
    return {
      curExamId: null,
      curExamName: null,
      examList: [],
      showPopover: false,
      query: null,
      keyword: null,
      grade: null,
      dept: null,
      status: null,
      statusList: [
        { value: 0, label: '不合格' },
        { value: 1, label: '合格' }
      ],
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
    gradeList: state => state.gradeList,
    deptList: state => state.deptList
  }),
  methods: {
    // 选择考试
    chooseExam(item) {
      this.curExamId = item.id
      this.curExamName = item.name
      this.showPopover = false
      this.getTableData(1, this.pageSize)
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        filter: {
          examId: this.curExamId,
          grade: this.grade || null,
          dept: this.dept || null,
          isPass: this.status === "" ? null : this.status,
          name: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      }
      fetchExamRecords(param)
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
    },
    // 获取考试列表
    getExamList() {
      this.userLoading = true
      let param = {
        filter: {
          name: this.query || null
        },
        limit: 1000,
        page: 1
      }
      fetchExamList(param)
        .then(res => {
          this.userLoading = false
          if (res.code == '000000') {
            this.examList = res.data || []
          } else {
            this.examList = []
          }
        })
        .catch(err => {
          this.userLoading = false
          this.examList = []
        })
    },

    // 初始化
    initExam() {
      let exam = sessionStorage.getItem('curExam')
      if (exam) {
        let curExam = JSON.parse(exam)
        this.curExamId = curExam.id
        this.curExamName = curExam.name
      }
    }
  },
  created() {
    this.getExamList()
    this.initExam()
    this.getTableData(this.currentPage, this.pageSize)
    if (this.gradeList.length == 0) {
      this.$store.dispatch('getGradeList')
    }
    if (this.deptList.length == 0) {
      this.$store.dispatch('getDeptList')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.search-box {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  padding: 0 20px !important;
  border-bottom: 1px solid #dbdbdb;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}

.tab-box {
  padding: 10px 20px 0;
  span {
    color: #999999;
    line-height: 32px;
  }
  .right-btn {
    float: right;
    .el-select,
    .el-input {
      margin-right: 10px;
    }
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
  .status-0 {
    color: $error-color !important;
    &::before {
      background-color: $error-color;
    }
  }
}

.popover-select-box {
  ul {
    height: 188px;
    margin: 5px -12px 0;
    overflow-y: auto;
    li {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      padding: 5px 12px;
      cursor: pointer;
      &.active {
        background: rgba(0, 0, 0, 0.06);
      }
    }
  }
}
.popover-btn.el-button {
  background: #f0f0f0;
  font-size: 16px;
  font-weight: 600;
  color: #2a2e2e;
  padding: 6px 10px !important;
}
</style>
<style lang="scss">
.title.el-select {
  .el-input__inner {
    background: #f0f0f0;
    font-size: 16px;
    font-weight: 600;
    color: #2a2e2e;
    line-height: 22px;
  }
}
</style>