<template>
  <div class="base-search-table" v-loading="loading" v-if="detail.id">
    <!----------------- 查看结算记录  顶部 ----------------->
    <div class="search-box clearfix" style="padding: 15px 20px 10px;">
      <i class="el-icon-arrow-left" @click="goBack">返回</i>
      <el-divider direction="vertical"></el-divider>
      订单 {{tid}}
      <span
        v-show="hasTag=='yes'"
        :class="detail.settlefrom == '2' ? 'orange-tag' : ' blue-tag'"
        style="margin-left:10px;"
      >{{detail.settlefrom=='2'?'授权结算单':"自订单"}}</span>
      <div class="search-box-right">
        <i class="el-icon-edit" v-if="detail.orderstatus == '1'" @click="toEdit">修改订单</i>
        <i
          class="el-icon-circle-check"
          v-if="detail.orderstatus == '2'"
          @click="sign"
        >{{detail.ordertype == "group" ? "确认送达" : "确认取餐"}}</i>
      </div>
    </div>
    <!----------------- 详情 ----------------->
    <div class="detail">
      <span class="tips" v-if="detail.ordertype == 'self' && detail.orderstatus == '2'">
        <i class="el-icon-warning"></i>
        您的订单已经打包完成，请尽快到{{detail.shopname}}取餐~
      </span>
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
        >期望送达： {{moment(detail.senddate,"YYYYMMDD").format("YYYY-MM-DD")}} {{detail.sendtime}}</span><br />
        <span
          style="margin-left:84px;"
        >订餐事由： {{detail.reason || "--"}}</span>
      </div>
      <div class="item" v-else>
        <label>取餐信息</label>
        <span>联系手机： {{detail.mobile}}</span>
        <br />
        <span
          style="margin-left:84px;"
        >期望取餐： {{moment(detail.senddate,"YYYYMMDD").format("YYYY-MM-DD")}} {{detail.sendtime}}</span>
      </div>
      <div class="item">
        <label>订单信息</label>
        <span>订餐人： &nbsp;&nbsp; {{detail.creatername}}（{{detail.createrid}}）</span>
        <br />
        <span style="margin-left:84px;">下单时间： {{common.defaultTimeFormat(detail.createtime)}}</span>
        <br />
        <span style="margin-left:84px;">签收人： &nbsp;&nbsp; {{detail.signername}}（{{detail.signerid}}）</span>
        <br />
        <span style="margin-left:84px;">签收时间： {{common.defaultTimeFormat(detail.signtime)}}</span>
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
          <el-table-column
            prop="price"
            label="单价（元)"
            show-overflow-tooltip
          >
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
  </div>
</template>

<script>
import { fetchOrderDetail, signOrder } from "@/api/admin/order";
export default {
  props: {
    id: String,
    hasTag: String
  },
  data() {
    return {
      loading: false,
      detail: {}
    };
  },
  computed: {
    tid() {
      let l = this.id.toString().length;
      return "T" + Array(9 - l).join("0") + this.id;
    }
  },
  methods: {
    goBack() {
      if (this.$route.query.hasTag == "no") {
        let activeTab = "1";
        this.$router.push(`/checkout?curActiveTab=${activeTab}`);
      } else {
        this.$router.go("-1");
      }
    },
    // 修改
    toEdit() {
      this.$router.push(`/record/edit/${this.id}`);
    },
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
    // 确认送达
    sign() {
      this.$confirm(`是否确认订单已送达？`, "确定已送达吗", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            id: this.id
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
  height: calc(100% - 100px);
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