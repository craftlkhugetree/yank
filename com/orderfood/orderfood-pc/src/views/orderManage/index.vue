<template>
  <div class="main-box" ref="orderManage">
    <p v-if="!shopid" style="padding:30px;">您暂无管理的餐厅</p>
    <!---------------------------- 订餐tab -------------------------->
    <el-tabs v-if="shopid" v-model="activeTab" @tab-click="getTableData(1,pageSize);getNums()">
      <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id">
        <span slot="label">{{tab.name}} {{tab.num}}</span>
      </el-tab-pane>
    </el-tabs>
    <div v-if="shopid" class="base-search-table">
      <div class="tags">
        <span
          v-for="item in tagList"
          :key="item.id"
          :class="{'active': activeTag == item.id}"
          @click="changeTag(item)"
        >{{activeTab == "group" ? item.groupname : item.selfname}} {{item.num}}</span>
      </div>
      <div class="search-box clearfix" style="padding:0 20px 10px;">
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-select
            v-if="activeTab == 'group'"
            v-model="area"
            filterable
            placeholder="请选择楼宇"
            style="width:130px;"
            size="small"
            clearable
            @change="getTableData(1,pageSize)"
          >
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-date-picker
            v-if="['1','2'].includes(activeTag)"
            v-model="date"
            type="date"
            :placeholder="activeTab =='group' ? '送达时间' : '取餐时间'"
            value-format="yyyyMMdd"
            size="small"
            style="width:130px;margin-right:10px;"
            @change="getTableData(1,pageSize)"
          ></el-date-picker>
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
          <el-button
            v-if="activeTab =='group'"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="openDrawer('add')"
          >单位订餐</el-button>
          <el-button
            v-if="activeTag !=='3' && activeTag !== '4'"
            type="primary"
            size="small"
            icon="el-icon-printer"
            @click="print('more')"
          >打印</el-button>
          <el-button
            v-if="activeTab =='self' && activeTag == '2'"
            type="primary"
            size="small"
            icon="el-icon-check"
            @click="sign('more')"
          >确认取餐</el-button>
          <el-button
            v-if="activeTag !=='3' && activeTag !== '4'"
            class="white-btn"
            type="primary"
            plain
            size="small"
            icon="el-icon-close"
            @click="cancelOrder('more')"
          >取消订餐</el-button>
          <el-button
            v-if="activeTag == '4'"
            class="white-btn"
            type="danger"
            plain
            size="small"
            icon="el-icon-close"
            @click="deleteOrder('more')"
          >删除订单</el-button>
        </div>
      </div>
      <!---------------------------- 待确认/配送中 表格 ---------------------------->
      <el-table
        v-if="['1','2'].includes(activeTag)"
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        @selection-change="selectRows"
        v-loading="tableLoading"
        @sort-change="sortBy"
        :key="activeTag"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tid" label="订单号" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column prop="info" label="菜品信息" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column
          prop="totalfee"
          label="合计（元)"
          show-overflow-tooltip
          class-name="total"
          width="100"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column prop="creatername" label="订餐人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.creatername}}（{{scope.row.createrid}}）</template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="订餐时间"
          sortable
          show-overflow-tooltip
          :formatter="this.common.timeFormat"
        ></el-table-column>
        <el-table-column prop="mobile" label="联系手机" show-overflow-tooltip></el-table-column>
        <el-table-column
          v-if="activeTab =='group'"
          prop="address"
          label="配送地址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="time"
          :label="activeTab =='group' ? '期望送达时间' : '期望取餐时间'"
          sortable
          show-overflow-tooltip
        >
          <template
            slot-scope="scope"
          >{{scope.row.isToday ? "今天 " + (scope.row.sendtime || '') : scope.row.time || ''}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" :width="240">
          <template slot-scope="scope">
            <span @click="toDetail(scope.row)">查看</span>
            <span
              v-if="scope.row.orderfrom == '2' && activeTag == '1'"
              @click="openDrawer('edit',scope.row)"
            >修改</span>
            <span @click="print('one',scope.row)">打印</span>
            <span
              v-if="activeTag == '2'"
              @click="sign('one',scope.row)"
            >{{activeTab =='group' ? '确认送达' : '确认取餐'}}</span>
            <span @click="cancelOrder('one',scope.row)">取消订餐</span>
          </template>
        </el-table-column>
      </el-table>
      <!---------------------------- 已送达/已取消 表格 ---------------------------->
      <el-table
        v-if="['3','4'].includes(activeTag)"
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        @selection-change="selectRows"
        v-loading="tableLoading"
        @sort-change="sortBy"
        :key="activeTag"
      >
        <el-table-column v-if="['4'].includes(activeTag)" type="selection" width="55"></el-table-column>
        <el-table-column prop="tid" label="订单号" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column prop="info" label="菜品信息" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column
          prop="totalfee"
          label="合计（元)"
          show-overflow-tooltip
          class-name="total"
          width="100"
          :formatter="(row, column, val) => common.moneyFormat(val)"
        ></el-table-column>
        <el-table-column prop="creatername" label="订餐人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.creatername}}（{{scope.row.createrid}}）</template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="订餐时间"
          sortable
          show-overflow-tooltip
          :formatter="this.common.timeFormat"
        ></el-table-column>
        <el-table-column prop="mobile" label="联系手机" show-overflow-tooltip></el-table-column>
        <el-table-column
          v-if="activeTab =='group'"
          prop="address"
          label="配送地址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          v-if="activeTag == '3'"
          prop="signtime"
          :label="activeTab =='group' ? '送达时间' : '签收时间'"
          sortable="custom"
          show-overflow-tooltip
          :formatter="this.common.timeFormat"
        ></el-table-column>
        <el-table-column
          v-if="activeTag == '3'"
          prop="signername"
          label="签收人"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.signername}}（{{scope.row.signerid}}）</template>
        </el-table-column>
        <el-table-column label="操作" align="center" :width="100">
          <template slot-scope="scope">
            <span @click="toDetail(scope.row)">查看</span>
            <span
              style="color:#F56C6C"
              v-if="['4'].includes(activeTag)"
              @click="deleteOrder('one',scope.row)"
            >删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total > 0 && ['3','4'].includes(activeTag)">
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
    <!---------------------------- 录入单位订餐 -------------------------->
    <add-drawer ref="addDrawer" @doFunc="getTableData(currentPage,pageSize)"></add-drawer>
    <!---------------------------- 打印 -------------------------->
    <print-box ref="printBox"></print-box>
  </div>
</template>

<script>
import { fetchMyCafe } from "@/api/admin/cafe";
import { fetchAllBuildingList } from "@/api/admin/building";
import {
  fetchOrderList,
  signOrder,
  fetchOrderNum,
  printOrders,
  cancelOrders,
  deleteOrders
} from "@/api/admin/order";
import addDrawer from "./addDrawer";
import printBox from "./printBox";
export default {
  components: {
    addDrawer,
    printBox
  },
  data() {
    return {
      shopid: null,
      shopname: null,
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
      activeTag: "1",
      tagList: [
        {
          id: "1",
          groupname: "待确认",
          selfname: "待配餐",
          num: 0
        },
        {
          id: "2",
          groupname: "配送中",
          selfname: "待取餐",
          num: 0
        },
        {
          id: "3",
          groupname: "已送达",
          selfname: "已取餐",
          num: 0
        },
        {
          id: "4",
          groupname: "已取消",
          selfname: "已取消",
          num: 0
        }
      ],
      area: null,
      areaList: [],
      date: null,
      keyword: null,
      tableData: [],
      tableLoading: false,
      total: 0,
      pageSize: 50,
      currentPage: 1,
      selectData: [],
      orderBy: "signtime",
      sort: "desc",
      timer: null
    };
  },
  computed: {
    msgList() {
      return this.$store.state.msgList;
    }
  },
  watch: {
    msgList() {
      this.getTableData(1, this.pageSize);
      this.getNums();
    }
  },
  methods: {
    // 选择状态
    changeTag(tag) {
      this.activeTag = tag.id;
      if (["3", "4"].includes(this.activeTag)) {
        this.sort = "desc";
        this.orderBy = "signtime";
      }
      this.getNums();
      this.getTableData(1, this.pageSize);
    },
    // 获取数量
    getNums() {
      let param = {
        shopid: this.shopid,
        myself: false,
        isdelete: "0"
      };
      fetchOrderNum(param).then(res => {
        if (res.success) {
          let data = res.data || null;
          if (data) {
            let groupData = data.group;
            let selfData = data.self;
            this.tabs[0].num = groupData.all || 0;
            this.tabs[1].num = selfData.all || 0;
            let curData = this.activeTab == "group" ? groupData : selfData;
            this.tagList.forEach(i => (i.num = curData["status" + i.id]));
          }
        }
      });
    },

    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      let now = this.moment().format("HH:mm");
      if (row.isToday && ((now < "14:00" && row.sendtime < "14:00") || (now >= "14:00" && row.sendtime >= "14:00"))) {
        return "is-current";
      } else {
        return "";
      }
    },

    // 表格排序
    sortBy(obj) {
      this.orderBy = obj.prop;
      this.sort = obj.order == "ascending" ? "asc" : "desc";
      this.getTableData(this.currentPage, this.pageSize);
    },
    
    // 获取分页列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let param = {
        filter: {
          shopid: this.shopid,
          ordertype: this.activeTab,
          orderstatus: this.activeTag,
          area: this.area || null,
          senddate: ["1", "2"].includes(this.activeTag)
            ? this.date || null
            : null,
          createrkeyword: this.keyword || null,
          isdelete: this.activeTag == "4" ? "0" : null
        },
        limit: ["3", "4"].includes(this.activeTag) ? pageSize : 10000,
        page: page || 1
      };
      if (["3", "4"].includes(this.activeTag)) {
        (param.sort = this.sort), (param.orderBy = this.orderBy);
      }
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
              i.time = `${this.moment(i.senddate, "YYYYMMDD").format(
                "YYYY-MM-DD"
              )} ${i.sendtime || ''}`;
              i.isToday = this.moment().format("YYYYMMDD") == i.senddate;
              i.address = `${i.area}${i.house}`;
              i.items.forEach(j => {
                let price = j.promotionprice ? j.promotionprice : j.price;
                this.$set(
                  j,
                  "totalPrice",
                  this.common.multiply(price, j.itemnum, 2)
                );
              });
            });
            // 如果是待确认状态，按照订餐时间由近到远排序
            if (["1"].includes(this.activeTag)) {
              this.tableData.sort((a, b) => {
                return a.createtime > b.createtime ? 1 : -1;
              });
            }
            // 如果是配送中状态，按照期望送达时间由近到远排序
            if (["2"].includes(this.activeTag)) {
              this.tableData.sort((a, b) => {
                return a.time > b.time ? 1 : -1;
              });
            }
            this.total = res.total;
            this.currentPage = page || 1;
            if (this.activeTag !== "3" && this.activeTag !== "4") {
              delete param.limit;
            }
            sessionStorage.setItem("manageParams", JSON.stringify(param));
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 新增/修改订单
    openDrawer(type, row) {
      let drawer = this.$refs.addDrawer;
      drawer.shopid = this.shopid;
      drawer.shopname = this.shopname;
      if (type == "add") {
        drawer.title = "录入单位订餐";
      } else {
        drawer.title = `修改单位订餐『 ${row.tid} 』`;
        for (let key in drawer.editForm) {
          drawer.editForm[key] = row[key];
        }
        drawer.editForm.creater = `${row.creatername}(${row.createrid})`;
        drawer.typeid = row.shopitemtypeid;
        drawer.tableData = [...row.items];
        drawer.getFoodList();
        // drawer.tableData.forEach(i => {
        //   i.totalPrice = this.common.multiply(i.price, i.itemnum, 2);
        // });
      }
      drawer.drawer = true;
    },
    // 查看
    toDetail(row) {
      this.$router.push({
        path: `/manage/detail/${row.id}`
      });
    },
    // 选中的行
    selectRows(rows) {
      this.selectData = rows;
    },
    // 打印
    print(type, row) {
      if (type == "more" && this.selectData.length == 0) {
        this.$message({
          showClose: true,
          type: "error",
          message: `请选择要打印的订单！`
        });
        return;
      }
      let param = null;
      let printBox = this.$refs.printBox;
      if (type == "one") {
        param = { ids: JSON.stringify([row.id]) };
        printBox.orderList = [row];
      } else {
        param = { ids: JSON.stringify(this.selectData.map(i => i.id)) };
        printBox.orderList = this.selectData;
      }
      if (this.activeTag == 1) {
        this.tableLoading = true;
        printOrders(param)
          .then(res => {
            this.tableLoading = false;
            if (res.success) {
              this.getTableData(this.currentPage, this.pageSize);
              this.getNums();
              let data = res.data || [];
              printBox.orderList.forEach((order, index) => {
                order.flow = data[index];
              });
              this.$nextTick(() => {
                printBox.print();
              });
            }
          })
          .catch(err => {
            this.tableLoading = false;
          });
      } else {
        this.$nextTick(() => {
          printBox.print();
        });
      }
    },
    // 取消
    cancelOrder(type, row) {
      if (type == "more" && this.selectData.length == 0) {
        this.$message({
          showClose: true,
          type: "error",
          message: `请选择要取消的订单！`
        });
        return;
      }
      let ids = type == "more" ? this.selectData.map(i => i.id) : [row.id];
      let param = {
        ids: JSON.stringify(ids)
      };
      let tids = type == "more" ? this.selectData.map(i => i.tid) : [row.tid];
      let msg = tids.join(",");
      this.$confirm(`是否确认取消订单『 ${msg} 』？`, `确定取消订单吗？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          cancelOrders(param)
            .then(res => {
              this.tableLoading = false;
              if (res.success) {
                let arr = res.data;
                // 所有订单取消成功
                if (arr.every(i => i.returncode == "SUCCESS")) {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: `取消成功！`
                  });
                } else {
                  // 部分订单取消失败
                  let errArr = tids.map((item, index) => {
                    let msg = "";
                    if (arr[index].returncode == "ERROR") {
                      msg = `订单${item}取消失败：${arr[index].returnmsg}`;
                    }
                    return msg;
                  });
                  let errMsg = errArr.join(";");
                  this.$confirm(errMsg, "订单取消失败", {
                    confirmButtonText: "确定",
                    showCancelButton: false,
                    type: "error"
                  }).then(() => {});
                }
                this.getTableData(this.currentPage, this.pageSize);
                this.getNums();
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
    // 删除
    deleteOrder(type, row) {
      if (type == "more" && this.selectData.length == 0) {
        this.$message({
          showClose: true,
          type: "error",
          message: `请选择要删除的订单！`
        });
        return;
      }
      let ids = type == "more" ? this.selectData.map(i => i.id) : [row.id];
      let param = {
        ids: JSON.stringify(ids)
      };
      let tids = type == "more" ? this.selectData.map(i => i.tid) : [row.tid];
      let msg = tids.join(",");
      this.$confirm(`是否确认删除订单『 ${msg} 』？`, `确定删除订单吗？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          deleteOrders(param)
            .then(res => {
              this.tableLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getTableData(this.currentPage, this.pageSize);
                this.getNums();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败！${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.tableLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `删除失败！${err}`
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 确认送达
    sign(type, row) {
      if (type == "more" && this.selectData.length == 0) {
        this.$message({
          showClose: true,
          type: "error",
          message: `请选择需要确认取餐的订单！`
        });
        return;
      }
      let msg = this.activeTab == "group" ? "已送达" : "已取餐";
      let tids =
        type == "more" ? this.selectData.map(i => i.tid).join("，") : row.tid;
      this.$confirm(`是否确认订单『 ${tids} 』${msg}？`, `确定${msg}吗`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          let ids = type == "more" ? this.selectData.map(i => i.id) : [row.id];
          let data = {
            ids: JSON.stringify(ids)
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
                this.getNums();
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
        })
        .catch(() => {
          return;
        });
    },
    // 区域列表
    getAreaList(query) {
      fetchAllBuildingList({}).then(res => {
        this.areaList = res.data || [];
        this.areaList.push({
          id: "other",
          name: "其他"
        });
      });
    },
    // 获取我的餐厅
    getMyCafe() {
      fetchMyCafe().then(res => {
        if (res.success) {
          let data = res.data[0] || {};
          this.shopid = data.id;
          this.shopname = data.name;
          this.initData();
          // this.timer = setInterval(() => {
          //   this.initData();
          // }, 30000);
        }
      });
    },
    // 获取数据
    initData() {
      this.getNums();
      this.getTableData(this.currentPage, this.pageSize);
    },
    // 初始化参数
    initParams() {
      let params = sessionStorage.getItem("manageParams");
      let data = params ? JSON.parse(params) : {};
      let filter = data.filter || {};
      this.keyword = filter.createrkeyword || null;
      this.activeTab = filter.ordertype || "group";
      this.activeTag = filter.orderstatus || "1";
      this.area = filter.area || null;
      this.date = filter.senddate || null;
      this.pageSize = data.limit || 50;
      this.currentPage = data.page || 1;
    }
  },
  created() {
    this.initParams();
    this.getMyCafe();
    this.getAreaList();
  }
  // beforeDestroy() {
  //   clearInterval(this.timer);
  // }
};
</script>

<style lang="scss" scoped>
.main-box {
  height: 100%;
  overflow: hidden;
}
.base-search-table {
  height: calc(100% - 80px);
  overflow-y: auto;
}
.search-box-right {
  .input-box {
    margin-right: 0px !important;
  }
  .el-button--small {
    padding: 9px;
    margin-left: 5px;
  }
  .el-divider {
    margin: 0 0 0 4px;
  }
}
.tags {
  float: left;
  span {
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    padding: 0 15px 0 20px;
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
.el-table {
  tr.is-current {
    background-color: #3f86f7;
  }
}
</style>