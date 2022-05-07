<template>
  <div class="analysis-exam">
    <!------------------------------ 概览 ------------------------------>
    <div class="data-box" v-loading="totalLoading">
      <h3>考试统计</h3>
      <div class="data-div">
        <div class="data-item width-33">
          <p>考试人数</p>
          <p>
            <countTo class="num" :startVal="0" :endVal="totalnum" :duration="1000"></countTo>
          </p>
        </div>
        <div class="data-item width-33">
          <p>PC端考试</p>
          <p>
            <countTo class="num" :startVal="0" :endVal="pcnum" :duration="1000"></countTo>
            <span>占比{{pcpercent}}%</span>
          </p>
        </div>
        <div class="data-item width-33">
          <p>移动端考试</p>
          <p>
            <countTo class="num" :startVal="0" :endVal="mobilenum" :duration="1000"></countTo>
            <span>占比{{mobilepercent}}%</span>
          </p>
        </div>
      </div>
    </div>
    <!------------------------------ 列表 ------------------------------>
    <div class="data-box">
      <h3>考试分析</h3>
      <div class="base-search-table">
        <div class="right-box">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入考试名称"
            size="small"
            clearable
            style="width: 160px;margin-right: 10px;"
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
        <div class="table-content">
          <el-table
            :data="tableData"
            style="width: 100%; margin-top: 10px"
            header-row-class-name="table-header"
            v-loading="tableLoading"
            @sort-change="sortBy"
          >
            <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
            <el-table-column prop="name" label="题目内容" show-overflow-tooltip width="300" fixed></el-table-column>
            <el-table-column sortable="custom" prop="answerNum" label="考试人数" show-overflow-tooltip></el-table-column>
            <el-table-column sortable="custom" prop="passNum" label="通过人数" show-overflow-tooltip></el-table-column>
            <el-table-column sortable="custom" prop="unpassNum" label="未通过人数" show-overflow-tooltip></el-table-column>
            <el-table-column sortable="custom" prop="passRate" label="通过率" show-overflow-tooltip>
              <template
                slot-scope="scope"
              >{{scope.row.answerNum ? common.multiply(scope.row.passRate , 100, 2) + "%" : "--"}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180" fixed="right">
              <template slot-scope="scope">
                <span @click="toDetail(scope.row)">查看</span>
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
    </div>
  </div>
</template>

<script>
import { fetchExamOverride, fetchExamList } from '@/api/analysis'
import countTo from 'vue-count-to'
export default {
  components: {
    countTo
  },
  data() {
    return {
      totalLoading: false,
      totalnum: 0,
      pcnum: 0,
      mobilenum: 0,
      pcpercent: 0,
      mobilepercent: 0,
      keyword: null,
      tableData: [],
      tableLoading: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null
    }
  },
  methods: {
    // 计算
    calcData(data, totalData) {
      let v = this.common.divide(data, totalData)
      let newV = this.common.multiply(v, 100, 2)
      return newV
    },
    // 获取概览数据
    getTopData() {
      this.totalLoading = true
      fetchExamOverride()
        .then(res => {
          this.totalLoading = false
          if (res.code == '000000') {
            let data = res.data || {}
            this.totalnum = data.totalnum || 0
            this.pcnum = data.pcnum || 0
            this.mobilenum = data.mobilenum || 0
            this.pcpercent = this.calcData(this.pcnum, this.totalnum)
            this.mobilepercent = this.calcData(this.mobilenum, this.totalnum)
          }
        })
        .catch(err => {
          this.totalLoading = false
        })
    },
    // 查看
    toDetail(row) {
      sessionStorage.setItem('cunAnalysisExamName', row.name)
      this.$router.push(`/analysis/exam/${row.id}`)
    },
    // 排序
    sortBy(obj) {
      this.orderBy = obj.prop
      this.sort = obj.order == 'ascending' ? 'asc' : 'desc'
      this.getTableData(1, this.pageSize)
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.tableLoading = true
      let param = {
        filter: {
          name: this.keyword || null
        },
        sort: this.sort || null,
        orderBy: this.orderBy || null,
        limit: pageSize,
        page: page || 1
      }
      fetchExamList(param)
        .then(res => {
          this.tableLoading = false
          if (res.code == '000000') {
            this.tableData = res.data || []
            this.total = res.total
            this.currentPage = page || 1
            // 记录查询参数
            let params = {
              ...param.filter,
              orderBy: this.orderBy,
              sort: this.sort,
              limit: pageSize,
              page: page || 1
            }
            sessionStorage.setItem('analysisExamParams', JSON.stringify(params))
          }
        })
        .catch(err => {
          this.tableLoading = false
        })
    },

    // 初始化参数
    initParams() {
      let data = sessionStorage.getItem('analysisExamParams')
      if (data) {
        let params = JSON.parse(data)
        let { name, limit, page, sort, orderBy } = params
        this.keyword = name
        this.pageSize = limit
        this.currentPage = page
        this.sort = sort
        this.orderBy = orderBy
      }
    }
  },
  created() {
    this.initParams()
    this.getTopData()
    this.getTableData(this.currentPage, this.pageSize)
  }
}
</script>

<style lang="scss" scoped>
.data-box {
  position: relative;
  margin: 20px 0 20px 20px;
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #2a2e2e;
    line-height: 22px;
    margin-bottom: 10px;
  }
  .data-div {
    background: #ffffff;
    padding: 20px 0;
  }
  .data-item {
    display: inline-block;
    text-align: center;
    &:not(:last-child) {
      border-right: 1px solid #f0f0f0;
    }
    p {
      font-size: 16px;
      color: #5f6464;
      line-height: 24px;
      span {
        font-size: 13px;
        color: #5f6464;
        line-height: 18px;
      }
      .num {
        display: inline-block;
        font-size: 30px;
        font-weight: 600;
        color: #2a2e2e;
        line-height: 32px;
        margin: 20px 20px 0 0;
      }
    }
  }
  .width-33 {
    width: 33%;
  }
  .right-box {
    position: absolute;
    right: 20px;
    top: -8px;
  }
}
</style>