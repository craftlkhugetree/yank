<template>
  <div class="main-box">
    <div class="base-search-table">
      <div class="search-box clearfix" style="padding:0 20px 10px;">
        <!---------------------------- 未结算 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-select
            v-model="origin"
            filterable
            placeholder="请选择订单来源"
            style="width:180px;"
            size="small"
            clearable
            @change="getTableData(1,pageSize)"
          >
            <el-option
              v-for="item in originList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
          <el-divider direction="vertical"></el-divider>
          <el-button type="primary" size="small" @click="hanldeSettled">订单结算</el-button>
          <el-button type="primary" size="small" @click="hanldeAuthed">授权结算人</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        v-loading="tableLoading"
        @selection-change="selectRows"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tid" label="订单号" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column prop="shopname" label="餐厅" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column
          prop="totalfee"
          label="合计（元)"
          show-overflow-tooltip
          width="120"
          class-name="total"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column prop="creatername" label="订餐人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.creatername}}（{{scope.row.createrid}}）</template>
        </el-table-column>
        <el-table-column prop="orderstatus" label="订餐来源" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <span
              :class="scope.row.settlefrom == '2' ? 'orange-tag' : 'blue-tag'"
            >{{scope.row.settlefrom=='2'?'授权结算单':"自订单"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="下单时间"
          show-overflow-tooltip
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <span @click="toDetail(scope.row,'view')">查看</span>
            <span @click="toSettled(scope.row)">订单结算</span>
            <span @click="doAuthed(scope.row)">授权结算人</span>
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
    <!---------------------------- 申请结算 ---------------------------->
    <settle-drawer ref="settleDrawer" @doFunc="doRefresh('settle')"></settle-drawer>
    <!---------------------------- 授权结算 ---------------------------->
    <auth-drawer ref="authDrawer" @doFunc="doRefresh"></auth-drawer>
  </div>
</template>

<script>
import { fetchOrderList, signOrder } from "@/api/admin/order";
import { fetchSettleList } from "@/api/admin/settle";
import settleDrawer from "./components/settleDrawer";
import authDrawer from "./components/authDrawer";

export default {
  components: {
    settleDrawer,
    authDrawer
  },
  data() {
    return {
      origin: null,
      originList: [
        { id: "1", name: "自订单" },
        { id: "2", name: "授权结算单" }
      ],
      keyword: null,
      tableData: [],
      tableLoading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectedRows: []
    };
  },
  methods: {
    //单个结算
    toSettled(row) {
      let rowArr = [row];
      this.selectedRows = rowArr;
      this.hanldeSettled();
    },

    //单个授权
    doAuthed(row) {
      let rowArr = [row];
      this.selectedRows = rowArr;
      this.hanldeAuthed();
    },

    //订单结算
    hanldeSettled() {
      if (!this.selectedRows.length) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请先勾选要结算的订单！"
        });
        return false;
      }
      let selectedArr = this.selectedRows.map(v => v.shopid);
      let selectedIds = [...new Set(selectedArr)];
      if (selectedIds.length > 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择相同的餐厅，进行订单结算！"
        });
        return false;
      }
      let settleDrawer = this.$refs.settleDrawer;
      settleDrawer.drawer = true;
      settleDrawer.tableData = this.selectedRows;
      settleDrawer.getCodeList();
    },

    //授权结算
    hanldeAuthed() {
      if (!this.selectedRows.length) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请先勾选要授权结算的订单！"
        });
        return false;
      }
      let authDrawer = this.$refs.authDrawer;
      authDrawer.drawer = true;
      authDrawer.tableData = this.selectedRows;
    },
    // 选择行
    selectRows(rows) {
      this.selectedRows = rows;
    },

    doRefresh(flag) {
      if (flag) {
        this.$emit("doJumper");
      }
      this.$emit("doNums");
      this.getTableData(1, 10);
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let param = {
        filter: {
          settlerid: "myself",
          settlestatus: "0", //未结算
          orderstatus: "3", //已配送
          settlefrom: this.origin || null,
          ordertype: "group", //单位的才结算
          createrkeyword: this.keyword || null
        },
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
            let unsettledParams = {
              keyword: this.keyword || null,
              status: this.activeTab,
              pageSize: pageSize,
              currentPage: page || 1
            };
            sessionStorage.setItem(
              "unsettledParams",
              JSON.stringify(unsettledParams)
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
          hasTag: "yes"
        }
      });
    },
    // 初始化参数
    initParams() {
      let params = sessionStorage.getItem("unsettledParams");
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