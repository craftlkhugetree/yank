<template>
  <div class="statistic-box" v-loading="loading">
    <!---------------------------- tab页 ---------------------------->
    <overview :totalData="totalData" :title="title"></overview>
    <data-chart
      :title="title"
      :ref="yycs"
      headName="总预约次数趋势分析"
      @timeChange="centerBypass"
      :name="yycs"
      subtitle="总预约次数变化趋势"
    ></data-chart>
    <data-chart
      :title="title"
      :ref="yycsdb"
      headName="资源预约次数对比分析"
      @timeChange="centerBypass"
      :name="yycsdb"
      subtitle="预约次数对比分析"
    ></data-chart>
    <data-chart
      :title="title"
      :ref="yysc"
      headName="总预约时长趋势分析"
      @timeChange="centerBypass"
      :name="yysc"
      subtitle="总预约时长变化趋势"
    ></data-chart>
    <data-chart
      :title="title"
      :ref="top"
      headName="预约排行TOP10"
      @timeChange="centerBypass"
      :name="top"
      :topData="topData"
      :cancelData="cancelData"
      :unCheckedData="unCheckedData"
    ></data-chart>
  </div>
</template>

<script>
import {
  dataOverview,
  datayycsqsfx,
  datayyscqsfx,
  datacancelTop10,
  dataorderTop10,
  dataunCheckinTop10,
  datayycsdbfx,
} from '@/api/admin/statistic';
export default {
  components: {
    Overview: () => import('./count'),
    DataChart: () => import('./systemChart.vue'),
  },
  data() {
    return {
      title: '系统统计（所有资源）',
      loading: false,
      totalData: {},
      tableData: [],
      yycs: 'yycs',
      yysc: 'yysc',
      yycsdb: 'yycsdb',
      top: 'top',
      cancel: 'cancel',
      unChecked: 'unChecked',
      topData: [],
      cancelData: [],
      unCheckedData: [],
      timeType: 'month',
      time: this.util.formatTime(this.util.formatMYD(), 'yyyyMM'),
      tableLoading: false,
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
  methods: {
    // 获取报修量总计数据
    getTotalData() {
      this.loading = true;
      const params = {};
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
    centerBypass(name, timetype = this.timeType, time = this.time, resId) {
      const all = {};
      const text = {};
      all[this.yycs] = datayycsqsfx;
      all[this.yycsdb] = datayycsdbfx;
      all[this.yysc] = datayyscqsfx;
      all[this.top] = dataorderTop10;
      all[this.cancel] = datacancelTop10;
      all[this.unChecked] = dataunCheckinTop10;
      text[this.yycs] = '预约次数';
      text[this.yysc] = '预约时长';
      text[this.yycsdb] = '预约次数';
      const fun = all[name];
      const data = {
        timetype,
        time,
      };
      fun(data)
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            if ([this.top, this.cancel, this.unChecked].includes(name)) {
              this[name + 'Data'] = data.map(d => {
                let name_id = d.applyername + '(' + d.applyerid + ')';
                return { name_id, ...d };
              });
              return;
            }
            // 设置横坐标Data和提示
            let arr = [];
            let legendData = [text[name]];
            let xAxisData = data.map(i => {
              let obj = {};
              obj[text[name]] = i.num || 0;
              arr.push(obj);
              if (this.yycs === name || this.yysc === name) {
                if (timetype === 'month') {
                  return time.slice(0, 4) + '年' + time.substr(-2) + '月' + i.timesp + '日';
                } else {
                  return time + '年' + i.timesp + '月';
                }
              } else if (this.yycsdb === name) {
                return i.resname;
              }
            });
            const tmp = data.map((d, index) => {
              return { name_time: xAxisData[index], ...d };
            });
            let seriesData;
            // 预约次数对比
            if (this.yycsdb === name) {
              // 资源多选框
              let num = 0;
              this.$refs[name].excelData = tmp.map((e, index) => {
                if (!resId || (resId && resId.includes(e.resid))) {
                  e.checked = true;
                } else {
                  xAxisData.splice(index - num, 1);
                  data.splice(index - num++, 1);
                  e.checked = false;
                }
                return e;
              });
              //   console.log(tmp, this.$refs[name].excelData, data, resId);
              legendData = [];
              seriesData = [
                {
                  name: text[this.yycsdb],
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
                  data: data.map(a => a.num || 0),
                },
              ];
            } else if (this.yycs === name || this.yysc === name) {
              this.$refs[name].excelData = tmp;
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
    ifExist_run(str) {
      let timer = setInterval(() => {
        if (this.$refs[str] && this.$refs[str].timeChange) {
          this.$refs[str].timeChange();
          clearInterval(timer);
        }
      }, 500);
    },
  },
  mounted() {
    this.getTotalData();
    this.ifExist_run(this.yycs);
    this.ifExist_run(this.yysc);
    this.ifExist_run(this.yycsdb);
    this.ifExist_run(this.top);
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
