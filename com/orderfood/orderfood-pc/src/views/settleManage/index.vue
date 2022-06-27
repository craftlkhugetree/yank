<template>
  <div class="main-box">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id">
        <span slot="label">{{tab.name}} {{tab.num}}</span>
      </el-tab-pane>
    </el-tabs>
    <unsettled ref="unsettled" v-show="activeTab==1"></unsettled>
    <div class="base-search-table" v-show="activeTab!=1">
      <div class="search-box clearfix" style="padding:0 20px 10px;">
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入结算单号"
            size="small"
            clearable
            style="width:210px;"
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
          <span v-show="activeTab==2">
            <el-divider direction="vertical"></el-divider>
            <el-button type="primary" size="small" icon="el-icon-printer" @click="print">打印</el-button>
          </span>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        v-loading="tableLoading"
        @selection-change="selectRows"
        :key="activeTab"
      >
        <el-table-column type="selection" v-if="activeTab=='2'" width="55"></el-table-column>
        <el-table-column prop="id" label="结算单号" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          class-name="code"
          prop="tids"
          label="结算订单"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="totalfee"
          label="结算金额（元)"
          show-overflow-tooltip
          class-name="total"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column
          prop="settletime"
          :formatter="common.timeFormat"
          label="结算时间"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column v-if="activeTab=='2'" prop="creatername" label="结算人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.creatername}}（{{scope.row.createrid}}）</template>
        </el-table-column>
        <el-table-column v-if="activeTab=='3'" prop="creatername" label="转账人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.creatername}}（{{scope.row.createrid}}）</template>
        </el-table-column>
        <el-table-column
          v-if="activeTab=='3'"
          prop="checkouttime"
          :formatter="common.timeFormat"
          label="转账时间"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span @click="toDetail(scope.row)">查看</span>
            <span v-if="activeTab=='2'" @click="doAccount(scope.row)">确认转账</span>
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
import unsettled from "./unsettled";
import { fetchAccountNums } from "@/api/admin/settle";
import {
  fetchSettleList,
  confirmSettle,
  fetchAllSettleList
} from "@/api/admin/settle";
export default {
  components: {
    unsettled
  },
  props: {
    curActiveTab: String
  },
  data() {
    return {
      activeTab: "2",
      tabs: [
        {
          id: "1",
          name: "未结算订单",
          num: 0
        },
        {
          id: "2",
          name: "待转账",
          num: 0
        },
        {
          id: "3",
          name: "已转账",
          num: 0
        }
      ],
      keyword: null,
      tableData: [],
      tableLoading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectData: []
    };
  },
  methods: {
    // 选中的行
    selectRows(rows) {
      this.selectData = rows;
    },
    // 打印
    print() {
      if (this.selectData.length == 0) {
        this.$message({
          showClose: true,
          type: "error",
          message: `请选择要打印的转账单！`
        });
        return;
      }
      let ids = this.selectData.map(i => i.id).join(",");
      let url = `${window.g.url}/settle/printToTransferList`;
      let query = `?ids=${ids}`;
      window.open(url + query, "_blank");
    },

    handleClick(event) {
      this.activeTab = event.name;
      // 记录参数
      let params = sessionStorage.getItem("accountedActiveParams");
      let data = params ? JSON.parse(params) : {};
      data.status = this.activeTab;
      sessionStorage.setItem(
        "accountedActiveParams",
        JSON.stringify(data)
      );
      if (this.activeTab == "1") {
        this.$refs.unsettled.getTableData(1,this.pageSize);
      } else {
        this.getTableData(1, this.pageSize);
      }
      this.getNums();
    },
    // 未结算单获取统计数字
    getNums() {
      let params = {
        setterid: null
      };
      fetchAccountNums(params).then(res => {
        if (res.success) {
          let countData = res.data || [];
          this.tabs[0].num = countData.noSettleOrder || 0;
          this.tabs[1].num = countData.status1 || 0;
          this.tabs[2].num = countData.status2 || 0;
        }
      });
    },

    // 获取分页列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let param = {
        filter: {
          id: this.keyword || null,
          status: this.activeTab == "2" ? "1" : "2",
          orderstatus: "3", //已配送
          ordertype: "group" //单位的才结算
        },
        limit: pageSize,
        page: page || 1
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
            let accountedActiveParams = {
              keyword: this.keyword || null,
              status: this.activeTab,
              pageSize: pageSize,
              currentPage: page || 1
            };
            sessionStorage.setItem(
              "accountedActiveParams",
              JSON.stringify(accountedActiveParams)
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
        path: `checkout/accountView/${row.id}`
      });
      // this.$router.push(`checkout/accountView/${row.id}`);
    },
    // 确认转账
    doAccount(row) {
      this.$confirm(`是否确认转账？`, "转账", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          let data = {
            id: row.id
          };
          confirmSettle(data)
            .then(res => {
              this.tableLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `转账成功！`
                });
                this.getNums();
                this.getTableData(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `转账失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.tableLoading = false;
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
    // // 初始化参数
    // initParams() {
    //   let params = sessionStorage.getItem("accountedActiveParams");
    //   let data = params ? JSON.parse(params) : {};
    //   this.activeTab = data.status || "2";
    // },


    // 初始化参数
    initParams() {
      let params = sessionStorage.getItem("accountedActiveParams");
      let data = params ? JSON.parse(params) : {};
      this.keyword = data.keyword || null;
      this.activeTab = data.status || "2";
      this.pageSize = data.pageSize || 10;
      this.currentPage = data.currentPage || 1;
    },

    // 获取数据
    initData() {
      this.getNums();
      this.initParams();
      this.getTableData(this.currentPage, this.pageSize);
    }
  },
  created() {
    if (this.curActiveTab) {
      this.activeTab = this.curActiveTab;
    }
    this.initData();
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
.tags {
  float: left;
  span {
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    padding: 0 30px 0 20px;
    margin-top: 5px;
    cursor: pointer;
    &:not(:last-child) {
      border-right: 1px solid rgba(0, 0, 0, 0.15);
    }
    &.active {
      font-weight: 500;
      color: #3f86f7;
    }
  }
}
</style>