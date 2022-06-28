<template>
  <div class="base-search-table" v-loading="loading" v-if="detail.id">
    <!----------------- 顶部 ----------------->
    <div class="search-box clearfix" style="padding: 15px 20px 10px;">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      订单 {{tid}} {{detail.orderstatus == "0" ? `等待支付，剩余${lastpaytime}` : ""}}
      <span
        :class="{'blue-tag':detail.orderstatus == '3', 'orange-tag': ['0','1','2'].includes(detail.orderstatus), 'gray-tag': detail.orderstatus == '4'}"
        style="margin-left:10px;"
      >{{common.statusFormat(detail.orderstatus, detail.ordertype)}}</span>
      <div class="search-box-right">
        <!---------------- 订单管理-查看 ---------------->
        <div v-if="viewType == 'manage'">
          <i class="el-icon-printer" v-if="detail.orderstatus == '1'" @click="print">打印订单</i>
          <i
            class="el-icon-circle-check"
            v-if="detail.orderstatus == '2'"
            @click="sign"
          >{{detail.ordertype == "group" ? "确认送达" : "确认取餐"}}</i>
        </div>
        <!---------------- 订餐记录-查看 ---------------->
        <div v-else>
          <i
            class="el-icon-edit"
            v-if="detail.ordertype == 'group' && detail.orderstatus == '1'"
            @click="toEdit"
          >修改订单</i>
          <i
            class="el-icon-circle-close"
            v-if="detail.ordertype == 'self' && ['1','0'].includes(detail.orderstatus)"
            @click="cancelOrder"
          >取消订单</i>
          <i
            class="el-icon-circle-check"
            v-if="detail.ordertype == 'self' && ['0'].includes(detail.orderstatus)"
            @click="openPayDialog"
          >确认支付</i>
          <i
            class="el-icon-circle-check"
            v-if="detail.orderstatus == '2'"
            @click="sign"
          >{{detail.ordertype == "group" ? "确认送达" : "确认取餐"}}</i>
        </div>
      </div>
    </div>
    <!----------------- 详情 ----------------->
    <div class="detail">
      <div class="tips" v-if="detail.ordertype == 'self' && detail.orderstatus == '2'">
        <i class="el-icon-warning"></i>
        <span v-if="shopDetail.orderway == 1">您的订单已经打包完成，请尽快到{{detail.shopname}}取餐~</span>
        <span v-if="shopDetail.orderway == 2">{{str0}}取餐期内{{common.pickupTimeText(shopDetail)}}</span>
        <span v-if="shopDetail.orderway == 3">{{str0}}取餐日期{{common.pickupTimeText(shopDetail)}}</span>
      </div>
      <div class="item">
        <label>餐厅名称</label>
        <span>{{detail.shopname}}</span>
      </div>
      <div class="item">
        <label>订餐类型</label>
        <span>{{detail.ordertype == "group" ? "单位订餐" : "个人订餐"}}</span>
      </div>
      <div class="item" v-if="detail.ordertype == 'group'">
        <label>配送信息</label>
        <span>配送地址： {{detail.creatername}}（{{detail.createrid}}）{{detail.mobile}}，{{detail.area}}{{detail.house}}</span>
        <br />
        <span
          style="margin-left:84px;"
        >期望送达： {{moment(detail.senddate,"YYYYMMDD").format("YYYY-MM-DD")}} {{detail.sendtime}}</span>
        <br />
        <span style="margin-left:84px;">订餐事由： {{detail.reason || "--"}}</span>
      </div>
      <div class="item" v-else>
        <label>取餐信息</label>
        <span>联系手机： {{detail.mobile}}</span>
        <br />
        <span
          style="margin-left:84px;"
        >期望取餐： {{moment(detail.senddate,"YYYYMMDD").format("YYYY-MM-DD")}} {{detail.sendtime}}</span>
        <br />
        <span style="margin-left:84px;" v-if="detail.flow">取餐序号： #{{detail.flow}}</span>
      </div>
      <div class="item">
        <label>订单信息</label>
        <span>订餐人： &nbsp;&nbsp; {{detail.creatername}}（{{detail.createrid}}）</span>
        <br />
        <span style="margin-left:84px;">下单时间： {{common.defaultTimeFormat(detail.createtime)}}</span>
        <br />
        <span
          v-if="detail.orderstatus == '3'"
          style="margin-left:84px;"
        >签收人： &nbsp;&nbsp; {{detail.signername}}（{{detail.signerid}}）</span>
        <br />
        <span
          v-if="detail.orderstatus == '3'"
          style="margin-left:84px;"
        >签收时间： {{common.defaultTimeFormat(detail.signtime)}}</span>
      </div>
      <div class="item">
        <label>菜品信息</label>
        <span class="right">
          共 {{detail.totalnum}} 份，合计：
          <span class="primary">{{detail.totalfee}}元</span>
        </span>
        <!---------------------------- 表格 ---------------------------->
        <el-table :data="tableData" style="width:100%" header-row-class-name="table-header">
          <el-table-column type="index" label="序号" show-overflow-tooltip width="80"></el-table-column>
          <el-table-column prop="itemname" label="菜品名称" show-overflow-tooltip min-width="150">
            <template slot-scope="scope">
              <img
                v-if="!scope.row.photo || scope.row.photo == -1"
                src="@/assets/img/nodata.png"
                alt
              />
              <img v-else :src="scope.row.url" alt />
              {{scope.row.itemname}}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价（元)" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.promotionprice">
                {{common.moneyFormat(scope.row.promotionprice)}}
                <span
                  class="delete"
                >{{common.moneyFormat(scope.row.price)}}</span>
              </span>
              <span v-else>{{common.moneyFormat(scope.row.price)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="itemnum" label="数量" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="totalPrice"
            label="价格（元)"
            show-overflow-tooltip
            width="150"
            class-name="total"
            :formatter="(row, column, val) => common.moneyFormat(val)"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <!---------------------------- 打印 -------------------------->
    <print-box ref="printBox"></print-box>
    <!---------------------------- 支付弹窗 -------------------------->
    <pay ref="payDialog" @doFunc="getDetail"></pay>
  </div>
</template>

<script>
import {
  fetchOrderDetail,
  cancelOrders,
  signOrder,
  printOrders
} from "@/api/admin/order";
import { fetchCafeConfig } from "@/api/admin/cafe";
import printBox from "../orderManage/printBox";
import pay from "../order/pay";
export default {
  components: {
    printBox,
    pay
  },
  props: {
    id: String,
    // 查看类型： manage订单管理, record订餐记录
    viewType: {
      type: String,
      default: "record"
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      detail: {},
      lastpaytime: "15:00",
      shopDetail: {},
      str0: '您的订单已接收，',
    };
  },
  computed: {
    tid() {
      let l = this.id.toString().length;
      return "T" + Array(9 - l).join("0") + this.id;
    }
  },
  methods: {
    // 获取详情
    getDetail() {
      this.loading = true;
      let param = {
        id: this.id
      };
      fetchOrderDetail(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.detail = res.data || {};
            this.detail.shopid && fetchCafeConfig({shopid: this.detail.shopid}).then(r => {
              if (r.success && r.data) {
                this.shopDetail = r.data
              }
            })
            this.setLastpaytime();
            this.detail.time = `${this.moment(
              this.detail.senddate,
              "YYYYMMDD"
            ).format("YYYY-MM-DD")} ${this.detail.sendtime}`;
            this.detail.address = `${this.detail.area}${this.detail.house}`;
            this.tableData = this.detail.items;
            let totalnum = 0;
            this.tableData.forEach(i => {
              i.url = i.photo
                ? window.g.viewUrl + i.photo
                : "@/assets/img/nodata.png";
              let price = i.promotionprice ? i.promotionprice : i.price;
              i.totalPrice = this.common.multiply(price, i.itemnum, 2);
              totalnum += i.itemnum;
            });
            this.detail.totalnum = totalnum;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 设置剩余支付时间
    setLastpaytime() {
      if (this.detail.orderstatus == "0") {
        let time = this.moment(this.detail.createtime, "YYYYMMDDHHmmss").add(
          15,
          "m"
        );
        this.calcTime(time);
        setInterval(() => {
          this.calcTime(time);
        }, 1000);
      }
    },
    // 计算
    calcTime(time) {
      let diff = time.diff(this.moment());
      if (diff > 0) {
        this.lastpaytime = this.moment(diff).format("mm:ss");
      } else {
        this.lastpaytime = "00:00";
        this.detail.orderstatus = "4";
      }
    },
    // 修改
    toEdit() {
      this.$router.push(`/record/edit/${this.id}`);
    },
    // 打印
    print() {
      this.loading = true;
      let data = {
        ids: JSON.stringify([this.id])
      };
      printOrders(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            this.detail.flow = data[0];
            let printBox = this.$refs.printBox;
            printBox.orderList = [this.detail];
            this.$nextTick(() => {
              printBox.print();
            });
            this.getDetail();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 取消
    cancelOrder(row) {
      let param = {
        ids: JSON.stringify([this.id])
      };
      this.$confirm(`是否确认取消订单『 ${this.tid} 』？`, `确定取消订单吗？`, {
        confirmButtonText: "确认取消",
        cancelButtonText: "我再想想",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          cancelOrders(param)
            .then(res => {
              this.loading = false;
              if (res.success) {
                let data = res.data[0];
                if (data.returncode == "SUCCESS") {
                  let msg =
                    this.detail.orderstatus == "0"
                      ? "您的订单已取消。"
                      : "您的订单已取消，系统将自动退款至原账户。";
                  this.$confirm(msg, "订单已取消", {
                    confirmButtonText: "查看订单",
                    cancelButtonText: "返回首页",
                    type: "success"
                  })
                    .then(() => {
                      // this.$router.push(`/record/view/${this.id}`);
                      this.getDetail();
                    })
                    .catch(() => {
                      // this.$router.go(-1);
                      this.$router.push("/order");
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
              this.loading = false;
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
    // 打开支付弹窗
    openPayDialog() {
      let msg = `您的订餐已成功提交！请于${this.moment(
        this.detail.senddate,
        "YYYYMMDD"
      ).format("YYYY-MM-DD")} ${this.detail.sendtime}前到${
        this.detail.shopname
      }取餐~`;
      let dialog = this.$refs.payDialog;
      dialog.id = this.id;
      dialog.totalfee = this.detail.totalfee;
      dialog.msg = msg;
      dialog.dialogVisible = true;
    },
    // 确认送达
    sign() {
      let msg = this.detail.ordertype == "group" ? "已送达" : "已取餐";
      this.$confirm(`是否确认订单『 #${this.id} 』${msg}？`, `确定${msg}吗`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetchOrderDetail({ id: this.id })
            .then(res => {
              if (res.success) {
                let data = res.data || {};
                let orderstatus = res.data.orderstatus;
                let ordertype = res.data.ordertype;
                // 只有在待取餐的时候才能提交
                if (orderstatus == "2") {
                  this.loading = true;
                  let data = {
                    ids: JSON.stringify([this.id])
                  };
                  signOrder(data)
                    .then(res => {
                      this.loading = false;
                      if (res.success) {
                        this.$message({
                          showClose: true,
                          type: "success",
                          message: `确认成功！`
                        });
                        this.getDetail();
                      } else {
                        this.$message({
                          showClose: true,
                          type: "error",
                          message: `确认失败：${res.data.message}`
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
                  return;
                }
              }
            })
            .catch(() => {
              return;
            });
        })
        .catch(() => {
          return;
        });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.search-box {
  width: 100%;
  border-bottom: 1px solid #d8d8d8;
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 22px;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
  .search-box-right {
    i {
      margin-right: 20px;
      &::before {
        margin-right: 5px;
      }
    }
  }
}
.detail {
  height: calc(100% - 70px);
  overflow-y: auto;
  padding: 20px;
  .tips {
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    padding: 8px 16px;
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    margin-bottom: 20px;
    i {
      font-size: 14px;
      color: #faad14;
      margin-right: 5px;
    }
  }
  .item {
    margin-bottom: 10px;
    label {
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      color: #373b4b;
      line-height: 22px;
      margin-right: 20px;
    }
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-bottom: 10px;
    }
    .right {
      float: right;
      margin-right: 20px;
    }
    .primary {
      color: #3f86f7;
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.el-table {
  img {
    height: 45px;
    width: auto;
    vertical-align: middle;
    margin-right: 10px;
  }
}
.delete {
  text-decoration: line-through;
  color: #999999 !important;
  font-weight: 400;
}
</style>