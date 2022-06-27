<template>
  <div class="main-box">
    <div class="base-search-table">
      <div class="search-box clearfix" style="padding:0 20px 10px;">
        <!---------------------------- 未结算 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="订餐人姓名或工号"
            size="small"
            clearable
            style="width:170px;"
            prefix-icon="el-icon-search"
            @clear="getTableData(1,pageSize)"
            @keyup.enter.native="getTableData(1,pageSize)"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="getTableData(1,pageSize)"
          >查询</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        v-loading="tableLoading"
        @sort-change="sortBy"
      >
        <el-table-column prop="tid" label="订单号" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column prop="shopname" label="餐厅" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="info" label="菜品信息" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column
          prop="totalfee"
          label="合计（元)"
          show-overflow-tooltip
          width="100"
          class-name="total"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column prop="creatername" label="订餐人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.creatername}}（{{scope.row.createrid}}）</template>
        </el-table-column>

        <el-table-column
          prop="signtime"
          label="送达时间"
          show-overflow-tooltip
          sortable="custom"
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <span @click="toDetail(scope.row,'view')">查看</span>
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
          :page-sizes="[5,10,15,20,50,100]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchOrderList, signOrder } from "@/api/admin/order";
import { fetchSettleList } from "@/api/admin/settle";

export default {
  components: {},
  data() {
    return {
      keyword: null,
      tableData: [],
      tableLoading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      sort: "desc"
    };
  },
  methods: {
    // 表格排序
    sortBy(obj) {
      this.sort = obj.order == "ascending" ? "asc" : "desc";
      this.getTableData(this.currentPage, this.pageSize);
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let param = {
        filter: {
          settlerid: null,
          settlestatus: "0", //未结算
          orderstatus: "3", //已配送
          ordertype: "group", //单位的才结算
          createrkeyword: this.keyword || null
        },
        orderBy: "signtime",
        sort: this.sort,
        limit: pageSize,
        page: page
      };
      fetchOrderList(param)
        .then(res => {
          this.tableLoading = false;
          if (res.success) {
            this.tableData = res.data || [];

            this.tableData.forEach(i => {
              let l = i.id.toString().length;
              i.tid = "T" + Array(9 - l).join("0") + i.id;
              i.info = i.items
                .map(j => `${j.itemname}x${j.itemnum}`)
                .join("，");
            });
            this.total = res.total;
            this.currentPage = page || 1;
            // 记录参数
            let allunsettledParams = {
              keyword: this.keyword || null,
              status: this.activeTab,
              pageSize: pageSize,
              currentPage: page || 1
            };
            sessionStorage.setItem(
              "allunsettledParams",
              JSON.stringify(allunsettledParams)
            );
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 查看
    toDetail(row) {
      this.$router.push({
        path: `settle/view/unsettled/${row.id}`,
        query: {
          hasTag: "no"
        }
      });
    },
    // 初始化参数
    initParams() {
      let params = sessionStorage.getItem("allunsettledParams");
      let data = params ? JSON.parse(params) : {};
      this.keyword = data.keyword || null;
      this.activeTab = data.status || "1";
      this.pageSize = data.pageSize || 10;
      this.currentPage = data.currentPage || 1;
    }
  },
  created() {
    this.initParams();
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.main-box {
  height: 100%;
  overflow: hidden;
}
.base-search-table {
  height: calc(100% - 100px);
  overflow-y: auto;
}
</style>