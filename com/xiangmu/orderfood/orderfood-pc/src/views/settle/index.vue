<template>
  <div class="main-box">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id" class="tab-content">
        <span slot="label">{{tab.name}} {{tab.count}}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="tips clearfix" v-show="totalFee">
      <i class="el-icon-warning"></i>
      <span v-if="activeTab=='noSettle'">
        未结算订单总额合计
        <i class="money">￥{{totalFee}}</i>
        元
      </span>
      <span v-if="activeTab=='settleRecord'">
        您有
        <i class="money">￥{{totalFee}}</i>
        元未报销
      </span>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="clearfix"></div>
    <unsettled
      v-if="activeTab=='noSettle'"
      @doNums="doRefresh"
      @doJumper="activeTab = 'settleRecord'"
    ></unsettled>
    <settle-record v-if="activeTab=='settleRecord'" @doNums="doRefresh"></settle-record>
  </div>
</template>

<script>
import { fetchSettleNum } from "@/api/admin/settle";
import unsettled from "./unsettled";
import SettleRecord from "./settleRecord";
export default {
  components: {
    unsettled,
    SettleRecord
  },
  data() {
    return {
      activeTab: "noSettle",
      totalFee: 0,
      tabs: [
        {
          id: "noSettle",
          name: "未结算",
          num: 0
        },
        {
          id: "settleRecord",
          name: "结算记录",
          num: 0
        }
      ],
      tableLoading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  computed: {},
  methods: {
    doRefresh() {
      this.getSettleNums();
    },

    getTotalFee() {
      let newTabs = this.tabs.filter(v => v.id == this.activeTab);
      let curtab = newTabs[0];
      this.totalFee = curtab.sum;
      // 记录参数
      let settledActiveParams = {
        status: this.activeTab
      };
      sessionStorage.setItem(
        "settledActiveParams",
        JSON.stringify(settledActiveParams)
      );
    },
    handleClick(event) {
      this.activeTab = event.name;
      this.getTotalFee();
    },

    // 获取统计数字
    getSettleNums() {
      let params = {
        settlerid: "myself"
      };
      fetchSettleNum(params).then(res => {
        if (res.success) {
          let countData = res.data || [];
          this.tabs.forEach(tab => {
            let obj = countData[tab.id];
            tab.count = obj.count;
            tab.sum = obj.sum;
          });
          this.$forceUpdate();
          this.getTotalFee();
        }
      });
    },

    // 初始化参数
    initParams() {
      let params = sessionStorage.getItem("settledActiveParams");
      let data = params ? JSON.parse(params) : {};
      console.log("data.status", data.status);
      this.activeTab = data.status || "noSettle";
    }
  },
  created() {
    this.initParams();
    this.getSettleNums();
  }
};
</script>

<style lang="scss" scoped>
.main-box {
  height: 100%;
  overflow: hidden;
  position: relative;
}
.base-search-table {
  height: calc(100% - 100px);
  overflow-y: auto;
}
.tab-content {
  position: relative;
}
.tips {
  height: 32px;
  background: #fffbe6;
  border-radius: 2px;
  border: 1px solid #ffe58f;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 32px;
  padding: 0 16px;
  position: absolute;
  left: 20px;
  .money {
    color: #faad14;
    font-weight: 600;
  }
  .el-icon-warning {
    color: #faad14;
    margin-right: 8px;
  }
}
</style>