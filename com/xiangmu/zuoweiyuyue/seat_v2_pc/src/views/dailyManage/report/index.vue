<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <!---------------------------- 查询条件 ---------------------------->
      <div>
        <span>区间：</span>
        <el-select
          v-model="section"
          size="middle"
          placeholder="请选择区间"
          style="width:200px;margin-right:20px;"
          clearable
        >
          <el-option v-for="item in sectionData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入学号"
          style="width:300px;"
          size="middle"
          clearable
          @clear="getTableData(1,pageSize)"
          @keyup.enter.native="getTableData(1,pageSize)"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>

        <div class="search-box-right">
          <el-button
            style="margin-left:16px;"
            class="orange-btn"
            type="default"
            size="middle"
            @click="getTableData(1, pageSize)"
          >查询</el-button>
          <el-button
            style="margin-left:16px;"
            class="orange-btn"
            type="default"
            size="middle"
            @click="reset()"
          >重置</el-button>
        </div>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <el-table
      :data="tableData"
      style="width:100%;"
      header-row-class-name="table-header"
      v-loading="tableLoading"
      :row-style="{height:'10px'}"
      :cell-style="{padding:'26px 0px'}"
      empty-text=" "
    >
      <el-table-column prop="sectionname" label="位置" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{scope.row.sectionname}} - 座位号{{scope.row.seatname}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="时间">
        <template slot-scope="scope">
          {{
          moment(scope.row.createtime, "YYYYMMDDhhmmss").format(
          "YYYY-MM-DD HH:mm:ss"
          ) }}
        </template>
      </el-table-column>
      <el-table-column prop="bjbr" label="被举报人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="jbr" label="举报人" show-overflow-tooltip></el-table-column>

      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <span @click="handleDelete(scope.row.id)">删除</span>
        </template>
      </el-table-column>-->
    </el-table>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        :hide-on-single-page="true"
        layout="sizes, prev, pager, next,jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10,20,50,100]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="size => {pageSize = size; getTableData(1, pageSize)}"
      ></el-pagination>
    </div>
    <!---------------------------- 无数据 ---------------------------->
    <div class="nodata" v-if="total == 0">
      <img src="@/assets/img/nofind.png" alt />
      <p>暂无举报信息</p>
    </div>
  </div>
</template>

<script>
import { fetchReport, deleteByIds } from "@/api/manage/report";
import { fetchSections } from "@/api/manage/section";
export default {
  data() {
    return {
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: null,
      section: null,
      sectionData: []
    };
  },

  computed: {},
  mounted() {
    this.getSections();
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  },
  methods: {
    //获取全部的区间
    getSections() {
      fetchSections({}).then(res => {
        if (res.success) {
          this.sectionData = res.data;
        }
      });
    },

    reset() {
      this.keyword = null;
      this.section = null;
      this.getTableData();
    },

    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          userid: this.keyword || null,
          sectionid: this.section || null
        },
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchReport(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
          this.currentPage = page;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  // min-height: calc(100% - 20px);
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
}
.search-box-right {
  position: relative;
}
.fixed-dialog {
  position: absolute;
  top: 25%;
}
.tab-content {
  position: relative;
  min-height: 500px;
}
</style>