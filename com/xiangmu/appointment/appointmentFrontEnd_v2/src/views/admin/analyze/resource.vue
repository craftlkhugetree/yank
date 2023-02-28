<template>
  <div class="statistic-box" v-loading="loading">
    <!---------------------------- tab页 ---------------------------->
    <div
      class="bg-white"
      style="padding:0 10px;"
      :style="tableData.length ? '' : { padding: '10px' }"
    >
      <div v-if="resGroupList.length" class="div_flex">
        <el-select v-model="curResGroupId" filterable placeholder="请选择" size="small">
          <el-option
            v-for="item in resGroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-divider direction="vertical" v-if="tableData.length"></el-divider>
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane
            v-for="tab in tableData"
            :key="tab.id"
            :name="tab.id"
            :label="tab.name"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <p v-else style="padding:80px 20px;">该用户所属部门暂无资源集</p>
    </div>
    <overview :totalData="totalData" :title="title"></overview>
    <data-chart
      :title="title"
      :ref="yycs"
      headName="预约次数趋势分析"
      @timeChange="centerBypass"
      :name="yycs"
      subtitle="预约次数变化趋势"
    ></data-chart>
    <data-chart
      :title="title"
      :ref="yysc"
      headName="预约时长趋势分析"
      @timeChange="centerBypass"
      :name="yysc"
      subtitle="预约时长变化趋势"
    ></data-chart>
    <el-row :gutter="20">
      <el-col :span="12">
        <!---------------------------- 时间段预约 ---------------------------->
        <data-chart
          :title="title"
          :ref="sjdyy"
          headName="时间段预约次数分布"
          @timeChange="centerBypass"
          :name="sjdyy"
          subtitle="时间段预约次数对比"
        ></data-chart>
      </el-col>
      <el-col :span="12">
        <!---------------------------- 时间段预约 ---------------------------->
        <data-chart
          :title="title"
          :ref="top"
          headName="预约次数排行TOP10"
          @timeChange="centerBypass"
          :name="top"
          subtitle="预约次数排行TOP10"
          :topData="topData"
        ></data-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { resgroupItemsFillRes, fetchResList } from '@/api/admin/res';
import {
  dataOverview,
  datayycsqsfx,
  datayyscqsfx,
  datasjdyycsfb,
  dataorderTop10,
} from '@/api/admin/statistic';
export default {
  components: {
    Overview: () => import('./count'),
    DataChart: () => import('./resourceChart.vue'),
  },
  data() {
    return {
      title: '资源统计（所选资源）',
      loading: false,
      totalData: {},
      tableData: [],
      yycs: 'yycs',
      yysc: 'yysc',
      sjdyy: 'sjdyy',
      top: 'top',
      topData: [],
      timeType: 'month',
      time: this.util.formatTime(this.util.formatMYD(), 'yyyyMM'),
      resGroupList: [],
      activeTab: '',
      tableLoading: false,
      curResGroup: {},
      curResGroupId: '',
      lastActiveTab: '',
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    orgId() {
      return this.userInfo.ORGID;
    },
  },
  watch: {
    curResGroupId() {
      this.getTableData();
    },
    activeTab(neww) {
      this.$refs[this.yycs].timeChange();
      this.$refs[this.yysc].timeChange();
      this.$refs[this.sjdyy].timeChange();
      this.$refs[this.top].timeChange();
      const obj = this.tableData.find(t => t.id === neww) || {};
      this.title = `资源统计（${obj.name || '所选资源'}）`;
    },
  },
  methods: {
    // 点击tab
    handleClick(tab) {
      if (this.lastActiveTab !== tab.name) {
        this.lastActiveTab = this.activeTab;
        this.getTotalData();
      }
    },
    // 获取资源集
    getResGroupList() {
      this.loading = true;
      let data = {
        orgid: this.orgId,
      };
      resgroupItemsFillRes(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.resGroupList = (res.data || []).filter(r => r.ress && r.ress.length) || [];
            if (this.resGroupList.length) {
              this.curResGroup = this.resGroupList[0];
              this.curResGroupId = this.curResGroup.id;
              this.getTableData();
            }
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取资源
    getTableData(page = 1) {
      this.tableLoading = true;
      let data = {
        filter: {
          resgroupid: this.curResGroupId,
        },
        limit: 200,
        page,
      };
      fetchResList(data)
        .then(res => {
          if (res.success) {
            this.tableLoading = false;
            this.tableData = res.data || [];
            if (this.tableData.length) {
              this.activeTab = this.tableData[0].id;
              this.getTotalData();
            }
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 获取报修量总计数据
    getTotalData() {
      this.loading = true;
      const params = { resid: this.activeTab };
      dataOverview(params)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || {};
            for (let key in data) {
              this.$set(this.totalData, key, parseFloat(data[key] || 0));
            }
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          this.loading = false;
        });
    },

    // 总线
    centerBypass(name, timetype = this.timeType, time = this.time) {
      const all = {};
      const text = {};
      all[this.yycs] = datayycsqsfx;
      all[this.yysc] = datayyscqsfx;
      all[this.sjdyy] = datasjdyycsfb;
      all[this.top] = dataorderTop10;
      text[this.yycs] = '预约次数';
      text[this.yysc] = '预约时长';
      text[this.sjdyy] = '时间段';
      const fun = all[name];
      const data = {
        timetype,
        time,
        resid: this.activeTab,
      };
      fun(data)
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            if (this.top === name) {
              this.topData = data.map(d => {
                let name_id = d.applyername + '(' + d.applyerid + ')';
                return { name_id, ...d };
              });
              this.$refs[name].excelData = this.topData;
              return;
            }
            // 设置横坐标Data和提示
            let arr = [];
            let legendData = [text[name]];
            let xAxisData = data.map(i => {
              let obj = {};
              arr.push(obj);
              obj[text[name]] = i.num || 0;
              if (this.yycs === name || this.yysc === name) {
                if (timetype === 'month') {
                  return time.slice(0, 4) + '年' + time.substr(-2) + '月' + i.timesp + '日';
                } else {
                  return time + '年' + i.timesp + '月';
                }
              } else if (this.sjdyy === name) {
                return i.time;
              }
            });
            this.$refs[name].excelData = data.map((d, index) => {
              return { num: d.num, name_time: xAxisData[index] };
            });
            // 设置系列Data
            let seriesData;
            if (this.sjdyy === name) {
              legendData = [];
              seriesData = [
                {
                  name: text[this.yycs],
                  type: 'bar',
                  barMaxWidth: 50,
                  itemStyle: {
                    color: '#3A78FC',
                  },
                  labelLine: {
                    show: true,
                  },
                  label: {
                    show: true,
                    position: 'top',
                  },
                  data: res.data.map(a => a.num || 0),
                },
              ];
            } else if (this.yycs === name || this.yysc === name) {
              seriesData = this.common.setSeriesData(legendData, arr, 'line', true);
            }
            // 设置图表配置项
            let chartOptions = this.common.setOptions(legendData, xAxisData, seriesData);
            this.$refs[name].initCharts(chartOptions);
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {});
    },
  },
  mounted() {
    this.getResGroupList();
  },
};
</script>
<style lang="scss" scoped>
.num-box {
  width: 20% !important;
}
.div_flex {
  display: flex;
  align-items: center;
  /deep/ .el-divider--vertical {
    height: 1.5em;
  }
  /deep/ .el-tabs__nav-wrap::after {
    display: none;
  }
  /deep/ .el-tabs__header.is-top {
    margin: 0;
  }
}
</style>
