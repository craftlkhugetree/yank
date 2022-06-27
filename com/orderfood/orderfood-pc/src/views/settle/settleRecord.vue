<template>
  <div class="main-box">
    <div class="base-search-table">
      <div class="search-box clearfix" style="padding:0 20px 10px;">
        <!---------------------------- 结算记录 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-checkbox
            style="margin-right:10px;"
            @change="getTableData(1,pageSize)"
            v-model="checked"
          >全部显示</el-checkbox>
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入结算单号"
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
      >
        <el-table-column prop="id" label="结算单号" show-overflow-tooltip width="80"></el-table-column>
        <el-table-column prop="shopname" label="餐厅" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column
          prop="tids"
          label="结算订单"
          class-name="code"
          show-overflow-tooltip
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="totalfee"
          label="结算金额（元)"
          show-overflow-tooltip
          width="120"
          class-name="total"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column
          prop="settletime"
          label="结算时间"
          show-overflow-tooltip
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column prop="orderstatus" label="费用结算" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <span
              :class="scope.row.status == '2' ? 'blue-tag' : 'orange-tag'"
            >{{scope.row.status=='2'?'已转账':"待转账"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkouttime"
          label="转账时间"
          show-overflow-tooltip
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <span @click="toDetail(scope.row)">查看</span>
            <span @click="toCancel(scope.row)" v-if="scope.row.status !== '2'">取消结算</span>
            <span @click="toPrint(scope.row)">打印转账凭证</span>
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
import { fetchSettleList, cancelSettle } from "@/api/admin/settle";
export default {
  components: {},
  data() {
    return {
      checked: false,
      keyword: null,
      tableData: [],
      tableLoading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 取消结算
    toCancel(row) {
      this.$confirm(`是否确认取消订单结算？`, "结算", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            id: row.id
          };
          cancelSettle(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `取消成功！`
                });
                this.$emit("doNums");
                this.getTableData(1, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `取消失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `确认失败：${err}`
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 打印
    toPrint(row) {
      this.$confirm(
        `请打印内部转账凭证后，签字送到餐厅第一窗口，或联系餐厅管理员！`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let url = `${window.g.url}/settle/printTransferVoucher`;
          let query = `?id=${row.id}`;
          window.open(url + query, "_blank");
        })
        .catch(() => {
          return;
        });
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let param = {
        filter: {
          id: this.keyword || null,
          status: this.checked ? null : "1",
          createrid: "myself"
        },
        limit: pageSize,
        page: page
      };
      fetchSettleList(param)
        .then(res => {
          this.tableLoading = false;
          if (res.success) {
            this.tableData = res.data || [];
            if (this.tableData.length) {
              this.tableData.forEach(item => {
                let idsArr = item.orderids.split(",");
                let newArr = [];
                idsArr.forEach(ids => {
                  let l = ids.length;
                  let newids = "T" + Array(9 - l).join("0") + ids;
                  newArr.push(newids);
                });
                item.tids = newArr.join("，");
              });
            }
            this.total = res.total;
            this.currentPage = page || 1;
            // 记录参数
            let settledParams = {
              keyword: this.keyword || null,
              status: this.activeTab,
              pageSize: pageSize,
              currentPage: page || 1
            };
            sessionStorage.setItem(
              "settledParams",
              JSON.stringify(settledParams)
            );
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 查看
    toDetail(row) {
      this.$router.push(`settle/view/settled/${row.id}`);
    },
    // 初始化参数
    initParams() {
      let params = sessionStorage.getItem("settledParams");
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