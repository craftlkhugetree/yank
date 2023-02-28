<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>一卡通管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
          size="small"
          style="width: 240px;margin-right:10px;"
          @change="getTableData(1,pageSize)"
        ></el-date-picker>
        <el-select
          v-model="cardtype"
          size="small"
          placeholder="请选择开卡方式"
          clearable
          style="width: 140px"
          @change="getTableData(1, pageSize)"
        >
          <el-option
            v-for="item in cardtypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入关键词查询"
          size="small"
          clearable
          style="width: 160px;margin-right:10px;"
          @clear="getTableData(1, pageSize)"
          @keyup.enter.native="getTableData(1, pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1, pageSize)"
        >查询</el-button>
        <el-button type="primary" size="small" @click="$router.push('/card/add')">人工开卡</el-button>
        <el-button type="primary" size="small" @click="toBack">卡片归还</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      header-row-class-name="table-header"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="billNo" label="单号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="driversName" label="司机" show-overflow-tooltip></el-table-column>
      <el-table-column prop="shipname" label="车牌号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsName" label="物料名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="quantity" label="重量" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.quantity ? scope.row.quantity + "KG" : "--"}}</template>
      </el-table-column>
      <el-table-column prop="consignee" label="客户名称" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="createTime"
        label="开卡时间"
        show-overflow-tooltip
        :formatter="common.timeFormat"
      ></el-table-column>
      <el-table-column prop="status" label="当前进度" width="190">
        <template slot-scope="scope">
          <div class="progress">
            <el-progress
              :percentage="common.percentage(scope.row.status)"
              :color="v => customColorMethod(v, scope.row.status)"
              :show-text="false"
            ></el-progress>
            <span>{{common.statusFormat(scope.row.status)}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.loadType == '1'" @click="toRecord(scope.row)">装车记录</span>
          <span v-else @click="toRecord(scope.row)">卸车记录</span>
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
import { fetchCardList } from '@/api/card'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      keyword: null,
      time: null,
      cardtype: null,
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
    cardtypeList: state => state.cardtypeList
  }),
  methods: {
    // 还卡
    toBack() {
      sessionStorage.removeItem("backInfo");
      this.$router.push('/card/back')
    },
    // 进度条颜色
    customColorMethod(percentage,status) {
      let val = status.toString()
      if (['7','8','9'].includes(val)) {
        return '#FF4D4F'
      }
      if (percentage < 100) {
        return '#3A78FC'
      } else {
        return '#52C41A'
      }
    },
    // 装车记录
    toRecord(row) {
      this.$router.push(`/card/record/${row.id}`)
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        filter: {
          starttime: this.time ? this.time[0] + "000000" : null,
          endtime: this.time ? this.time[1] + "235959" : null,
          openCardType: this.cardtype,
          keyword: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      }
      fetchCardList(param)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.tableData = res.data || []
            this.tableData.forEach(i => {
              let drivers = i.drivers || []
              i.driversName = drivers.map(i => i.name).join('，')
            })
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
  }
}
</script>

<style lang="scss" scoped>
.progress {
  .el-progress {
    display: inline-block;
    width: 100px;
    margin-right: 7px;
  }
  span {
    color: rgba(0, 0, 0, 0.45) !important;
  }
}
</style>