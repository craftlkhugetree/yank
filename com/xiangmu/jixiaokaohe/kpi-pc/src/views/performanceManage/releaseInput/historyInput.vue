<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0">
      <h3>
        <span class="back-text" @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>返回</span
        >
        <el-divider direction="vertical"></el-divider>历史发放记录
      </h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-date-picker
          class="no-border date-select no-clear"
          v-model="kpiyear"
          type="year"
          placeholder="选择年"
          size="small"
          value-format="yyyy"
          format="yyyy年"
          style="width: 80px"
          :clearable="false"
          @change="getTableData(1, pageSize)"
        ></el-date-picker>
        <i class="el-icon-arrow-down" style="margin-right: 12px"></i>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入绩效清单名称"
          size="small"
          clearable
          style="width: 200px; margin-right: 12px"
          prefix-icon="el-icon-search"
          @clear="getTableData(1, pageSize)"
          @keyup.enter.native="getTableData(1, pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1, pageSize)"
          >查询</el-button
        >
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column
          type="index"
          label="序号"
          show-overflow-tooltip
          width="80"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="绩效清单"
          show-overflow-tooltip
          width="450"
        ></el-table-column>
        <el-table-column
          prop="totalfee"
          label="发放总金额（元）"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span style="color: #606266">{{
              common.moneyFormat(scope.row.totalfee)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="录入时间"
          show-overflow-tooltip
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column prop="grantstatus" label="发放状态">
          <template slot-scope="scope">
            <el-tag class="blue-tag" v-if="scope.row.grantstatus == '3'"
              >已发放</el-tag
            >
            <el-tag class="orange-tag" v-else>未发放</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span @click="openDrawer(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-------------------------- 操作记录弹窗 -------------------------->
    <record-drawer ref="recordDrawer"></record-drawer>
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
    <!---------------------------- 无数据 ---------------------------->
    <div class="nodata" v-if="total == 0"></div>
  </div>
</template>

<script>
import { fetchHistoryList } from "@/api/kpi/history.js";
import recordDrawer from "./recordDrawer";
export default {
  components: {
    recordDrawer,
  },
  data() {
    return {
      loading: false,
      keyword: null,
      kpiyear: null,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    // 打开弹窗
    openDrawer(row) {
      let drawer = this.$refs.recordDrawer;
      drawer.title = `『 ${row.name} 』发放记录`;
      drawer.id = row.id;
      drawer.drawer = true;
    },

    // 获取表格数据
    getTableData(page, pageSize) {
      this.loading = true;
      let param = {
        filter: {
          createrid: this.userInfo.ID,
          type: 3,
          keyword: this.keyword || null,
          yeardate: this.kpiyear,
        },
        page: page || 1,
        limit: pageSize || this.pageSize,
      };
      fetchHistoryList(param).then((res) => {
        this.loading = false;
        if (res.success) {
          this.tableData = res.data || [];
          this.total = res.total;
          this.currentPage = page;
        }
      });
    },
  },
  created() {
    this.kpiyear = this.moment().format("YYYY");
    this.getTableData(this.currentPage, this.pageSize);
  },
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
}
.el-icon-date {
  color: #606266;
}
.back-text {
  color: #3f86f7;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
}
.blue-tag {
  background: #ebf2fe;
  border-radius: 2px;
  border: 1px solid #85b2fa;
}
.orange-tag {
  font-size: 12px;
  font-weight: 400;
  color: #ff9f0a !important;
  line-height: 22px;
  background: #fff5e6;
  border-radius: 2px;
  border: 1px solid #ffc162;
}
</style>
<style lang="scss">
.el-input.is-error .el-input__inner {
  border-color: #f56c6c;
}
.no-border .el-input__inner {
  border: none;
  padding-left: 10px;
}
.no-clear.el-input--suffix .el-input__inner {
  padding-right: 0;
}
</style>