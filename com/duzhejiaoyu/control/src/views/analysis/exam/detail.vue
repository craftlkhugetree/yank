<template>
  <div class="base-search-table">
    <!------------------------------------- 检查点信息 ------------------------------------->
    <div class="search-box">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      {{examname}}
    </div>
    <!------------------------------ 列表 ------------------------------>
    <div class="data-box">
      <h3>年级统计信息</h3>
      <div class="table-content">
        <el-table
          :data="gradeTableData"
          style="width: 100%; margin-top: 10px"
          header-row-class-name="table-header"
          v-loading="gradeTableLoading"
        >
          <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
          <el-table-column prop="grade" label="年级" show-overflow-tooltip width="300" fixed></el-table-column>
          <el-table-column sortable prop="answerNum" label="总人数" show-overflow-tooltip></el-table-column>
          <el-table-column sortable prop="answerNum" label="考试人数" show-overflow-tooltip></el-table-column>
          <el-table-column sortable prop="passNum" label="通过人数" show-overflow-tooltip></el-table-column>
          <el-table-column sortable prop="unpassNum" label="未通过人数" show-overflow-tooltip></el-table-column>
          <el-table-column sortable prop="passRate" label="通过率" show-overflow-tooltip>
            <template
              slot-scope="scope"
            >{{scope.row.answerNum ? common.multiply(scope.row.passRate , 100, 2) + "%" : "--"}}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!------------------------------ 列表 ------------------------------>
    <div class="data-box">
      <h3>班级统计信息</h3>
      <div class="table-content">
        <el-tabs v-model="grade" @tab-click="getDeptTableData(1,pageSize)">
          <el-tab-pane v-for="tab in gradeList" :key="tab" :label="tab" :name="tab"></el-tab-pane>
        </el-tabs>
        <el-table
          :data="deptTableData"
          style="width: 100%; margin-top: 10px"
          header-row-class-name="table-header"
          v-loading="deptTableLoading"
          @sort-change="sortBy"
        >
          <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
          <el-table-column prop="dept" label="所属" show-overflow-tooltip width="300" fixed></el-table-column>
          <el-table-column sortable="custom" prop="answerNum" label="总人数" show-overflow-tooltip></el-table-column>
          <el-table-column sortable="custom" prop="answerNum" label="考试人数" show-overflow-tooltip></el-table-column>
          <el-table-column sortable="custom" prop="passNum" label="通过人数" show-overflow-tooltip></el-table-column>
          <el-table-column sortable="custom" prop="unpassNum" label="未通过人数" show-overflow-tooltip></el-table-column>
          <el-table-column sortable="custom" prop="passRate" label="通过率" show-overflow-tooltip>
            <template
              slot-scope="scope"
            >{{scope.row.answerNum ? common.multiply(scope.row.passRate , 100, 2) + "%" : "--"}}</template>
          </el-table-column>
        </el-table>
        <!---------------------------- 分页 ---------------------------->
        <div class="pagination-box" v-if="deptTotal > 0">
          <el-pagination
            background
            layout="sizes, prev, pager, next"
            :total="deptTotal"
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchExamByGrade, fetchExamByDept } from '@/api/analysis'
export default {
  props: {
    examid: String
  },
  data() {
    return {
      examname: sessionStorage.getItem('cunAnalysisExamName'),
      gradeTableData: [],
      gradeTableLoading: false,
      gradeSort: null,
      gradeOrderBy: null,
      grade: null,
      deptTableData: [],
      deptTableLoading: false,
      deptTotal: 0,
      currentPage: 1,
      pageSize: 20,
      deptSort: null,
      deptOrderBy: null
    }
  },
  computed: mapState({
    gradeList: state => state.gradeList,
    deptList: state => state.deptList
  }),
  methods: {
    // 排序
    sortBy(obj) {
      this.orderBy = obj.prop
      this.sort = obj.order == 'ascending' ? 'asc' : 'desc'
      this.getDeptTableData(1, this.pageSize)
    },
    // 获取年级列表
    getGradeTableData() {
      this.gradeTableLoading = true
      let param = {
        examId: this.examid
      }
      fetchExamByGrade(param)
        .then(res => {
          this.gradeTableLoading = false
          if (res.code == '000000') {
            this.gradeTableData = res.data || []
          }
        })
        .catch(err => {
          this.gradeTableLoading = false
        })
    },
    // 获取班级列表
    getDeptTableData(page, pageSize) {
      this.deptTableLoading = true
      let param = {
        filter: {
          examId: this.examid,
          grade: this.grade
        },
        sort: this.sort || null,
        orderBy: this.orderBy || null,
        limit: pageSize,
        page: page || 1
      }
      fetchExamByDept(param)
        .then(res => {
          this.deptTableLoading = false
          if (res.code == '000000') {
            this.deptTableData = res.data || []
            this.deptTotal = res.total
            this.currentPage = page || 1
          }
        })
        .catch(err => {
          this.deptTableLoading = false
        })
    },

    initDeptData() {
      this.grade = this.gradeList[0]
      this.getDeptTableData(this.currentPage, this.pageSize)
    }
  },
  created() {
    this.getGradeTableData()
    if (this.gradeList.length == 0) {
      this.$store.dispatch('getGradeList').then(() => {
        this.initDeptData()
      })
    } else {
      this.initDeptData()
    }
  }
}
</script>

<style lang="scss" scoped>
.base-search-table {
  padding: 20px 0 20px 20px;
}
.search-box {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  padding: 0 20px !important;
  border-bottom: 1px solid #dbdbdb;
  background: #ffffff;
  margin-bottom: 20px;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}
.data-box {
  position: relative;
  margin-bottom: 20px;
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #2a2e2e;
    line-height: 22px;
    margin-bottom: 10px;
  }
}
</style>