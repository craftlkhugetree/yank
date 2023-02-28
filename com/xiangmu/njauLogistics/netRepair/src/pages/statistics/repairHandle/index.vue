<template>
  <div class="statistic-box" v-loading="loading">
    <div class="count-box">
      <div class="count-box-title">
        <span>报修处理总计</span>
      </div>
      <div class="count-box-content clearfix">
        <div class="num-box" style="width:20%">
          <label>报修总量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.bxzl" :duration="1000"></countTo>
        </div>
        <div class="num-box" style="width:20%">
          <label>办理总量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.blzl" :duration="1000"></countTo>
        </div>
        <div class="num-box" style="width:30%">
          <label>处理结束量</label>
          <p>
            <countTo class="counttospan" :startVal="0" :endVal="totalData.cljsl" :duration="1000"></countTo>
            <span style="margin-left:6px;">今日处理结束 {{totalData.jtcljsl}}</span>
          </p>
        </div>
        <div class="num-box" style="width:18%">
          <label>处理未结束量</label>
          <countTo class="counttospan" :startVal="0" :endVal="totalData.clwjsl" :duration="1000"></countTo>
        </div>
        <div class="num-box" style="border:none;width:12%">
          <label>平均处理时长</label>
          <p>
            <countTo
              class="counttospan"
              :startVal="0"
              :decimals="1"
              :endVal="totalData.pjclsc"
              :duration="1000"
            ></countTo>
            <span style="margin-left:6px;">天</span>
          </p>
        </div>
      </div>
    </div>
    <div class="count-box">
      <div class="count-box-title">
        <span>处理时长趋势分析</span>
        <div class="right-btns">
          <el-date-picker
            v-if="timeType==='year'"
            v-model="time"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
            format="yyyy年"
            clearable
            suffix-icon="el-icon-arrow-up"
            style="width:140px;"
            @change="getTimeData();getAvgtimeData()"
          ></el-date-picker>
          <span @click="exportData">
            <i class="el-icon-upload2"></i>导出数据
          </span>
        </div>
      </div>
      <div class="count-box-content">
        <p>处理时长变化趋势（天）</p>
        <span class="avg-tips">平均时长：{{avgtime}}分钟</span>
        <!---------------------------- 曲线图 ---------------------------->
        <div id="charts" style="height:450px;width:100%;margin-bottom:20px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import countTo from 'vue-count-to'
export default {
  components: {
    countTo
  },
  data() {
    return {
      loading: false,
      totalData: {
        bxzl: 0,
        blzl: 0,
        cljsl: 0,
        jtcljsl: 0,
        clwjsl: 0,
        pjclsc: 0
      },
      timeType: 'year',
      time: new Date().getFullYear().toString(),
      chart: null,
      tableData: [],
      avgtime: 0
    }
  },
  computed: {
    // 用户部门
    userDept() {
      return this.$store.state.userDept
    },
    xAxisData() {
      let arr = this.chartData.map(i => this.common.timeFormat(i.date + '01', 'M月'))
      return arr
    }
  },
  watch: {
    userDept() {
      if (this.userDept.ID) {
        this.getTotalData()
        this.getTimeData()
      }
    }
  },
  methods: {
    // 导出数据
    exportData() {
      let url = `${window.g.url}dataHandle/exportDeptOneBottom`
      let query = `?timetype=${this.timeType}&time=${this.time}&repairdeptid=${this.userDept.ID}`
      window.open(url + query, '_blank')
    },

    // 初始化图表
    initCharts(legendData, xAxisData, seriesData) {
      this.chart = echarts.init(document.getElementById('charts'))
      this.chart.setOption(this.chartOptions)
    },

    // 设置seriesData
    setSeriesData(legendData, dataArr) {
      let name = legendData[0]
      let arr = []
      dataArr.forEach(i => {
        arr.push(i[name])
      })
      return arr
    },

    // 获取报处理总计数据
    getTotalData() {
      this.loading = true
      this.util
        .postAjax({
          code: this.global.code,
          url: 'dataHandle/topAll',
          data: {
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.loading = false
          if (res.success) {
            let data = res.data || []
            data.forEach(i => {
              this.totalData[i.type] = parseInt(i.num)
            })
            this.totalData.clwjsl = this.totalData.blzl - this.totalData.cljsl
            this.totalData.pjclsc = parseFloat((this.totalData.pjclsc / 60 / 24).toFixed(1))
          }
        })
        .catch(err => {
          this.loading = false
        })
    },

    // 获取处理时长数据
    getTimeData() {
      this.deptLoading = true
      this.util
        .postAjax({
          code: this.global.code,
          url: 'dataHandle/bottom',
          data: {
            timetype: this.timeType,
            time: this.time,
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.deptLoading = false
          if (res.success) {
            let data = res.data || []
            // 设置表格数据
            let header = data.header || []
            let body = data.body || []
            this.tableData = this.common.setTableData(header, body)
            // 当前tab所在的index
            let curIndex = header.findIndex(i => i == this.userDept.NAME)
            // 设置legendData
            let legendData = header.filter((i, index) => index == curIndex)
            // 设置横坐标Data
            let xAxisData = body.map(i => i[0])
            // 设置系列Data
            let seriesData = this.common.setSeriesData(legendData, this.tableData.data, 'line', true)
            // this.initCharts(legendData, xAxisData, seriesData);
            // 设置图表配置项
            this.chartOptions = this.common.setOptions([], xAxisData, seriesData)
            this.initCharts()
          }
        })
        .catch(err => {
          this.deptLoading = false
        })
    },

    // 获取平均处理时长数据
    getAvgtimeData() {
      this.deptLoading = true
      this.util
        .postAjax({
          code: this.global.code,
          url: 'dataHandle/avgHandleTime',
          data: {
            starttime: this.time + "0101",
            endtime: this.time + "1231",
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          this.deptLoading = false
          if (res.success) {
            this.avgtime = res.data.avgtime || 0
          }
        })
        .catch(err => {
          this.deptLoading = false
        })
    }
  },
  created() {
    if (this.userDept.ID) {
      this.getTotalData()
      this.getTimeData()
      this.getAvgtimeData()
    }
    window.onresize = () => {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.count-box-content {
  position: relative;
}
.avg-tips {
  color: #5f6464;
  line-height: 20px;
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>