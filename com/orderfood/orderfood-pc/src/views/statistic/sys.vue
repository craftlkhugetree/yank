<template>
  <div class="statistic">
    <!----------------------------- 订餐统计 ----------------------------->
    <div class="statistic-box" v-loading="totalLoading">
      <div class="title">
        <h3>订餐统计</h3>
        <div class="right-search">
          <label>订餐日期：</label>
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyyMMdd"
            style="width:240px;margin-right:10px;"
            @change="getTotalData"
          ></el-date-picker>
          <el-button type="primary" size="small" icon="el-icon-search" @click="getTotalData">查询</el-button>
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="total-box">
            <div class="up">
              <label>总订单数</label>
              <countTo :startVal="0" :endVal="totalData.numAll" :duration="1000"></countTo>
            </div>
            <div class="down">
              <div>
                <label>单位订餐</label>
                <countTo :startVal="0" :endVal="totalData.numGroup" :duration="1000"></countTo>
              </div>
              <div>
                <label>个人订餐</label>
                <countTo :startVal="0" :endVal="totalData.numSelf" :duration="1000"></countTo>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="total-box">
            <div class="up">
              <label>总订单金额（元）</label>
              <countTo :startVal="0" :endVal="totalData.sumAll" :decimals="2" :duration="1000"></countTo>
            </div>
            <div class="down">
              <div>
                <label>单位订餐</label>
                <countTo :startVal="0" :endVal="totalData.sumGroup" :decimals="2" :duration="1000"></countTo>
              </div>
              <div>
                <label>个人订餐</label>
                <countTo :startVal="0" :endVal="totalData.sumSelf" :decimals="2" :duration="1000"></countTo>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!----------------------------- 订单分布统计 ----------------------------->
    <div class="statistic-box" v-loading="totalLoading">
      <div class="title">
        <h3>订单分布统计</h3>
        <div class="right-search">
          <el-button size="small" @click="exportTotalData">导出数据</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <div class="base-search-table">
        <el-table
          :data="companyTableData"
          row-key="name"
          style="width:100%"
          header-row-class-name="table-header"
          :tree-props="{children: 'shops', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="name" label="企业 / 餐厅" show-overflow-tooltip></el-table-column>
          <el-table-column prop="numAll" label="总订单数 / 订单金额（元）" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="num-sum-cell">{{scope.row.numAll}}</span>
              {{common.moneyFormat(scope.row.sumAll)}}
            </template>
          </el-table-column>
          <el-table-column prop="numGroup" label="单位订餐：订单数 / 订单金额（元）" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="num-sum-cell-more">{{scope.row.numGroup}}</span>
              {{common.moneyFormat(scope.row.sumGroup)}}
            </template>
          </el-table-column>
          <el-table-column prop="numSelf" label="个人订餐：订单数 / 订单金额（元）" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="num-sum-cell-more">{{scope.row.numSelf}}</span>
              {{common.moneyFormat(scope.row.sumSelf)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!----------------------------- 菜品统计 ----------------------------->
    <div class="statistic-box" v-loading="tableLoading">
      <div class="title">
        <h3>菜品统计</h3>
        <div class="right-search">
          <label>配送/取餐日期：</label>
          <el-date-picker
            v-model="tableTime"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyyMMdd"
            style="width:240px;margin-right:10px;"
            @change="getTableData"
          ></el-date-picker>
          <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData">查询</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="small" @click="exportTableData">导出数据</el-button>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <div class="base-search-table">
        <el-tabs v-model="activeTab" @tab-click="getTableData" class="big-font">
          <el-tab-pane v-for="tab in shopList" :key="tab.id" :name="tab.id" :label="tab.name"></el-tab-pane>
        </el-tabs>
        <el-table :data="tableData" style="width:100%" header-row-class-name="table-header">
          <el-table-column prop="name" label="菜品信息" show-overflow-tooltip></el-table-column>
          <el-table-column prop="note" label="描述" show-overflow-tooltip min-width="200" :formatter="common.defaultFormat"></el-table-column>
          <el-table-column prop="num" label="订单数" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="sum"
            label="订单金额（元)"
            show-overflow-tooltip
            :formatter="(row, column, val) => common.moneyFormat(val)"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAllCafeList } from "@/api/admin/cafe";
import { fetchTotalData, fetchFoodData } from "@/api/admin/statistic";
import countTo from "vue-count-to";
export default {
  components: {
    countTo
  },
  data() {
    return {
      totalLoading: false,
      time: [this.moment().format("YYYYMMDD"),this.moment().format("YYYYMMDD")],
      totalData: {
        numAll: 0,
        numGroup: 0,
        numSelf: 0,
        sumAll: 0,
        sumGroup: 0,
        sumSelf: 0
      },
      companyTableData: [],
      shopList: [],
      activeTab: null,
      tableLoading: false,
      tableTime: [this.moment().add(1,"days").format("YYYYMMDD"),this.moment().add(1,"days").format("YYYYMMDD")],
      tableData: []
    };
  },
  methods: {
    // 总数据
    getTotalData() {
      let params = {
        startdate: this.time ? this.time[0] : null,
        enddate: this.time ? this.time[1] : null
      };
      this.totalLoading = true;
      fetchTotalData(params)
        .then(res => {
          this.totalLoading = false;
          if (res.success) {
            let data = res.data || {};
            for (let i in this.totalData) {
              this.totalData[i] = data[i];
            }
            this.companyTableData = data.items || [];
            // 总计
            let obj = {
              numAll: 0,
              numGroup: 0,
              numSelf: 0,
              sumAll: 0,
              sumGroup: 0,
              sumSelf: 0
            };
            for (let i in obj) {
              let arr = this.companyTableData.map(j => j[i]);
              obj[i] = arr.reduce((prev, curr) => {
                let precision = i.includes("num") ? 0 : 2;
                return this.common.add(prev, curr, precision);
              }, 0);
            }
            this.companyTableData.push({name:"总计", ...obj});
          }
        })
        .catch(err => {
          this.totalLoading = false;
        });
    },
    // 获取所有餐厅
    getCafeList() {
      this.tableLoading = true;
      fetchAllCafeList({})
        .then(res => {
          this.tableLoading = false;
          if (res.success) {
            this.shopList = res.data || [];
            if (this.shopList.length > 0) {
              this.activeTab = this.shopList[0].id;
              this.getTableData();
            }
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 菜品数据
    getTableData() {
      let params = {
        shopid: this.activeTab,
        startdate: this.tableTime ? this.tableTime[0] : null,
        enddate: this.tableTime ? this.tableTime[1] : null
      };
      this.tableLoading = true;
      fetchFoodData(params)
        .then(res => {
          this.tableLoading = false;
          if (res.success) {
            let data = res.data || [];
            let curData = data[0] || {};
            this.tableData = curData.list || [];
          }
        })
        .catch(err => {
          this.tableLoading = false;
          this.tableData = [];
        });
    },
    // 导出数据
    exportTotalData() {
      let url = `${window.g.url}statistic/orderStatistic_export`;
      let query = (this.time && this.time.length > 0) ? `?startdate=${this.time[0]}&enddate=${this.time[1]}` : "";
      window.open(url + query, "_blank");
    },
    // 导出数据
    exportTableData() {
      let url = `${window.g.url}statistic/orderItemStatistic_export`;
      let query = (this.tableTime && this.tableTime.length > 0) ? `?startdate=${this.tableTime[0]}&enddate=${this.tableTime[1]}` : "";
      window.open(url + query, "_blank");
    }
  },
  created() {
    this.getTotalData();
    this.getCafeList();
  }
};
</script>

<style lang="scss" scoped>
.statistic {
  margin: 10px 0 20px 20px;
}
.statistic-box {
  margin-bottom: 10px;
  position: relative;
  .title {
    margin-bottom: 10px;
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #373b4b;
      line-height: 22px;
      padding: 5px 0;
    }
    .right-search {
      position: absolute;
      right: 20px;
      top: 0;
      label {
        color: #5f6464;
        line-height: 20px;
      }
    }
  }
  .total-box {
    padding: 30px;
    background: #ffffff;
    label {
      display: block;
      font-size: 16px;
      font-weight: 400;
      color: #5f6464;
      line-height: 24px;
      margin-bottom: 10px;
    }
    .up {
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 20px;
      span {
        font-size: 30px;
        font-weight: 600;
        color: #2a2e2e;
        line-height: 32px;
      }
    }
    .down {
      div {
        display: inline-block;
        width: 50%;
        text-align: left;
        span {
          font-size: 18px;
          font-weight: 600;
          color: #2a2e2e;
          line-height: 25px;
        }
      }
    }
  }
}
.base-search-table {
  background: #ffffff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
}
.num-sum-cell {
  display: inline-block;
  width: 60px;
  margin-right: 10px;
  color: #606266 !important;
}
.num-sum-cell-more {
  display: inline-block;
  width: 55px;
  margin-left: 70px;
  margin-right: 5px;
  color: #606266 !important;
}
</style>
<style lang="scss">
.big-font {
  .el-tabs__item {
    font-size: 16px;
    color: #595959;
    font-weight: 400;
    &.is-active {
      font-weight: 600;
    }
  }
}
</style>