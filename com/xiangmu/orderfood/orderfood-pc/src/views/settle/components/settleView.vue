<template>
  <div class="base-search-table" v-loading="loading" v-if="settleDetail.id">
    <!----------------- 查看结算记录  顶部 ----------------->
    <div class="search-box clearfix" style="padding: 15px 20px 10px;">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      订单结算 #{{id}}
      <span
        :class="settleDetail.status == '2' ? 'blue-tag' : 'orange-tag'"
        style="margin-left:10px;"
      >{{settleDetail.status == '2' ? '已转账' : '待转账'}}</span>
      <div class="search-box-right">
        <i class="el-icon-circle-close" v-if="settleDetail.status !== '2'" @click="toCancel">取消结算</i>
        <i class="el-icon-printer" @click="toPrint">下载转账凭证</i>
      </div>
    </div>

    <!----------------- 详情 ----------------->
    <div class="settleDetail">
      <div class="item">
        <label>结算信息</label>
        <span>结算人： {{settleDetail.creatername}}（{{settleDetail.createrid}}）</span>
        <br />
        <span
          style="margin-left:84px;"
        >结算时间： {{moment(settleDetail.settletime,"YYYYMMDDhhmmss").format("YYYY-MM-DD HH:mm:ss")}}</span>
      </div>
      <div class="item">
        <label>转账凭证</label>
        <table class="voucher-table" cellspacing="0">
          <tr align="center">
            <th rowspan="2" class="min-title">
              <span class="col-title">收方</span>
            </th>
            <th>单位</th>
            <th>项目编号</th>
            <th>经费科目编号</th>
            <th rowspan="2" class="min-title">
              <span class="col-title">付方</span>
            </th>
            <th>单位</th>
            <th>项目编号</th>
            <th>经费科目编号</th>
          </tr>
          <tr align="center">
            <td>{{settleDetail.shopname}}</td>
            <td>{{settleDetail.skjfh}}</td>
            <td>{{settleDetail.jfbh}}</td>
            <td>{{settleDetail.settleorgname }}</td>
            <td>{{settleDetail.projectno ||'——'}}</td>
            <td>{{settleDetail.fundsno}}</td>
          </tr>
          <tr align="left">
            <th colspan="8">
              <i style="margin-left:20px">转账内容：</i>
              <i style="font-weight:400">工作餐</i>
            </th>
          </tr>
          <tr align="left">
            <th colspan="2">
              <i style="margin-left:20px">转账金额（大写）</i>
            </th>
            <td colspan="6">
              <i style="margin-left:20px">{{settleDetail.totalfeechinese}}</i>
              <span class="money">￥{{settleDetail.totalfee}}</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!---------------------------- 订单信息 ---------------------------->
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id" class="tab-content">
        <span slot="label">订单 {{tab.tid}}</span>
        <order-detail :id="tab.id"></order-detail>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import orderDetail from "./orderDetail";
import { fetchSettleDetail, cancelSettle } from "@/api/admin/settle";
export default {
  components: {
    orderDetail
  },
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      settleDetail: {},
      activeTab: "",
      tabs: []
    };
  },
  methods: {
    // 打印
    toPrint() {
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
          let query = `?id=${this.id}`;
          window.open(url + query, "_blank");
        })
        .catch(() => {
          return;
        });
    },
    handleClick(event) {
      this.activeTab = event.name;
    },
    // 获取详情
    getDetail() {
      this.loading = true;
      let param = {
        id: this.id
      };
      fetchSettleDetail(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let detailData = res.data || {};
            this.settleDetail = detailData;
            this.tabs = detailData.list || [];
            if (this.tabs.length) {
              this.tabs.forEach(item => {
                item.id = item.id.toString();
                let l = item.id.length;
                item.tid = "T" + Array(9 - l).join("0") + item.id;
              });
              this.activeTab = this.tabs[0].id;
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 取消结算
    toCancel() {
      this.$confirm(`是否确认取消订单结算？`, "结算", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            id: this.id
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
                this.$router.go(-1);
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
.settleDetail {
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

.voucher-table {
  margin-top: 10px;
  th {
    height: 46px;
    border: 1px solid #dbdbdb;
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.65);
    line-height: 46px;
    width: 210px;
    position: relative;
  }
  td {
    height: 46px;
    border: 1px solid #dbdbdb;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 46px;
    position: relative;
  }
  span.col-title {
    position: absolute;
    left: 15px;
    top: 25px;
    width: 10px;
  }
  span.money {
    font-size: 16px;
    font-weight: 600;
    color: #3a78fc;
    position: absolute;
    right: 125px;
    top: 12px;
  }
  .min-title {
    width: 60px !important;
  }
}
</style>