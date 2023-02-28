<template>
  <div class="main-box">
    <el-tabs v-model="activeTab" @tab-click="getTableData(1,pageSize)">
      <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id">
        <span slot="label">{{tab.name}} {{tab.num}}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="base-search-table">
      <div class="search-box clearfix" style="padding:0 20px 10px;">
        <!---------------------------- 查询条件 ---------------------------->
        <!-- <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入订单号"
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
        </div>-->
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        v-loading="tableLoading"
      >
        <el-table-column prop="tid" label="订单号" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column prop="shopname" label="餐厅" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="info" label="菜品信息" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column
          prop="totalfee"
          label="合计（元)"
          show-overflow-tooltip
          width="120"
          class-name="total"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column prop="orderstatus" label="配送状态" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <span
              :class="{'blue-tag':scope.row.orderstatus == '3', 'orange-tag': ['0','1','2'].includes(scope.row.orderstatus), 'gray-tag': scope.row.orderstatus == '4'}"
            >{{common.statusFormat(scope.row.orderstatus, activeTab)}}</span>
            <span class="pay-time" v-if="scope.row.orderstatus == '0'">剩余{{scope.row.lastpaytime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="下单时间"
          show-overflow-tooltip
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <span @click="toDetail(scope.row,'view')">查看</span>
            <span
              v-if="activeTab=='group' && scope.row.orderstatus == '1'"
              @click="toDetail(scope.row,'edit')"
            >修改订单</span>
            <span
              v-if="activeTab=='self' && ['1','0'].includes(scope.row.orderstatus)"
              @click="cancelOrder(scope.row)"
            >取消订单</span>
            <span
              v-if="scope.row.orderstatus == '2'"
              @click="sign(scope.row)"
            >{{activeTab=="group" ? "确认送达" : "确认取餐"}}</span>
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
import {
  fetchOrderList,
  cancelOrders,
  signOrder,
  fetchOrderDetail
} from "@/api/admin/order";
export default {
  data() {
    return {
      activeTab: "group",
      tabs: [
        {
          id: "group",
          name: "单位订餐",
          num: 0
        },
        {
          id: "self",
          name: "个人订餐",
          num: 0
        }
      ],
      keyword: null,
      tableData: [],
      tableLoading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 获取数量
    getNums(ordertype) {
      return new Promise((resolve, reject) => {
        let param = {
          filter: {
            createrid: "myself",
            ordertype
          },
          limit: 5,
          page: 1
        };
        fetchOrderList(param)
          .then(res => {
            if (res.success) {
              resolve(res.total);
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let param = {
        filter: {
          id: this.keyword || null,
          createrid: "myself",
          ordertype: this.activeTab
        },
        limit: pageSize,
        page: page || 1
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
              // 计算等待支付的剩余时间
              if (i.orderstatus == "0") {
                let time = this.moment(i.createtime, "YYYYMMDDHHmmss").add(
                  15,
                  "m"
                );
                this.$set(i, "lastpaytime", "15:00");
                this.calcTime(time, i);
                setInterval(() => {
                  this.calcTime(time, i);
                }, 1000);
              }
            });
            this.total = res.total;
            this.currentPage = page || 1;
            // 记录参数
            let recordParams = {
              keyword: this.keyword || null,
              ordertype: this.activeTab,
              pageSize: pageSize,
              currentPage: page || 1
            };
            sessionStorage.setItem(
              "recordParams",
              JSON.stringify(recordParams)
            );
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },

    // 计算
    calcTime(time, order) {
      let diff = time.diff(this.moment());
      if (diff > 0) {
        order.lastpaytime = this.moment(diff).format("mm:ss");
      } else {
        order.lastpaytime = "00:00";
        order.orderstatus = "4";
      }
    },
    // 查看
    toDetail(row, type) {
      let path =
        type == "view" ? `/record/view/${row.id}` : `/record/edit/${row.id}`;
      this.$router.push(path);
    },

    // 取消
    cancelOrder(row) {
      let param = {
        ids: JSON.stringify([row.id])
      };
      this.$confirm(`是否确认取消订单『 ${row.tid} 』？`, `确定取消订单吗？`, {
        confirmButtonText: "确认取消",
        cancelButtonText: "我再想想",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          cancelOrders(param)
            .then(res => {
              this.tableLoading = false;
              if (res.success) {
                let data = res.data[0];
                if (data.returncode == "SUCCESS") {
                  let msg =
                    row.orderstatus == "0"
                      ? "您的订单已取消。"
                      : "您的订单已取消，系统将自动退款至原账户。";
                  this.$confirm(msg, "订单已取消", {
                    confirmButtonText: "查看订单",
                    cancelButtonText: "关闭",
                    type: "success"
                  })
                    .then(() => {
                      this.$router.push(`/record/view/${row.id}`);
                    })
                    .catch(() => {
                      this.getTableData(this.currentPage, this.pageSize);
                    });
                } else {
                  this.$confirm(data.returnmsg, "订单取消失败", {
                    confirmButtonText: "确定",
                    showCancelButton: false,
                    type: "error"
                  }).then(() => {});
                }
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `取消失败！${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.tableLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `取消失败！${err}`
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 确认送达
    sign(row) {
      let msg = this.activeTab == "group" ? "已送达" : "已取餐";
      this.$confirm(`是否确认订单『 ${row.tid} 』${msg}？`, `确定${msg}吗`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchOrderDetail({ id: row.id }).then(res => {
            if (res.success) {
              let data = res.data || {};
              let orderstatus = res.data.orderstatus;
              let ordertype = res.data.ordertype;
              // 只有在待取餐的时候才能提交
              if (orderstatus == "2") {
                this.tableLoading = true;
                let data = {
                  ids: JSON.stringify([row.id])
                };
                signOrder(data)
                  .then(res => {
                    this.tableLoading = false;
                    if (res.success) {
                      this.$message({
                        showClose: true,
                        type: "success",
                        message: `确认成功！`
                      });
                      this.getTableData(this.currentPage, this.pageSize);
                    } else {
                      this.$message({
                        showClose: true,
                        type: "error",
                        message: `确认失败：${res.data.message}`
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
              } else {
                let msg = null;
                switch (orderstatus) {
                  case "2":
                    msg =
                      ordertype == "group"
                        ? "订单正在配送中"
                        : "订单正在等待取餐";
                    break;
                  case "3":
                    msg = ordertype == "group" ? "订单已送达" : "订单已取餐";
                    break;
                  case "4":
                    msg = "订单已取消";
                    break;
                }
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `${msg}，无法确认！`
                });
                this.getTableData(this.currentPage, this.pageSize);
                return;
              }
            }
          });
        })
        .catch(() => {
          return;
        });
    },
    // 初始化参数
    initParams() {
      let params = sessionStorage.getItem("recordParams");
      let data = params ? JSON.parse(params) : {};
      this.keyword = data.keyword || null;
      this.activeTab = data.ordertype || "group";
      this.pageSize = data.pageSize || 10;
      this.currentPage = data.currentPage || 1;
    }
  },
  created() {
    this.initParams();
    this.getNums("group").then(res => {
      this.tabs[0].num = res;
    });
    this.getNums("self").then(res => {
      this.tabs[1].num = res;
    });
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
.pay-time {
  font-size: 12px;
  color: #999999 !important;
}
</style>