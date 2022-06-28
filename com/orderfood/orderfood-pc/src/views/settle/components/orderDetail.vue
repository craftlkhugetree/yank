<template>
  <div class="base-search-table" v-loading="loading" v-if="detail.id">
    <!----------------- 查看订单结算记录  订单信息详情 ----------------->
    <div class="detail">
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
    id: String
  },
  data() {
    return {
      loading: false,
      detail: {}
    };
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