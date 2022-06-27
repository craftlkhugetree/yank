<template>
  <div class="statistic" v-loading="loading">
    <p v-if="!shopid" style="padding:30px;">您暂无管理的餐厅</p>
    <div v-else>
      <div class="statistic-box" v-loading="totalLoading">
        <div class="title">
          <h3>{{shopname}}</h3>
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
                  <countTo
                    :startVal="0"
                    :endVal="totalData.sumGroup"
                    :decimals="2"
                    :duration="1000"
                  ></countTo>
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
            <el-button size="small" @click="exportData">导出数据</el-button>
          </div>
        </div>
        <!---------------------------- 表格 ---------------------------->
        <div class="base-search-table">
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
  </div>
</template>

<script>
import { fetchMyCafe } from "@/api/admin/cafe";
import { fetchTotalData, fetchFoodData } from "@/api/admin/statistic";
import countTo from "vue-count-to";
export default {
  components: {
    countTo
  },
  data() {
    return {
      loading: false,
      shopid: null,
      shopname: null,
      totalData: {
        numAll: 0,
        numGroup: 0,
        numSelf: 0,
        sumAll: 0,
        sumGroup: 0,
        sumSelf: 0
      },
      totalLoading: false,
      time: [this.moment().format("YYYYMMDD"),this.moment().format("YYYYMMDD")],
      tableLoading: false,
      tableTime: [this.moment().add(1,"days").format("YYYYMMDD"),this.moment().add(1,"days").format("YYYYMMDD")],
      tableData: []
    };
  },
  methods: {
    // 获取我的餐厅
    getMyCafe() {
      this.loading = true;
      fetchMyCafe()
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data[0] || {};
            this.shopid = data.id;
            this.shopname = data.name;
            this.getTotalData();
            this.getTableData();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 总数据
    getTotalData() {
      let params = {
        shopid: this.shopid,
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
          }
        })
        .catch(err => {
          this.totalLoading = false;
        });
    },
    // 菜品数据
    getTableData() {
      let params = {
        shopid: this.shopid,
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
    exportData() {
      let url = `${window.g.url}statistic/orderItemStatistic_export`;
      let queryTime = (this.tableTime && this.tableTime.length > 0) ? `&startdate=${this.tableTime[0]}&enddate=${this.tableTime[1]}` : "";
      let query = `?shopid=${this.shopid}${queryTime}`
      window.open(url + query, "_blank");
    }
  },
  created() {
    this.getMyCafe();
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
</style>