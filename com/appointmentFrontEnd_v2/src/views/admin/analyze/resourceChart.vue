<template>
  <div class="count-box">
    <div class="count-box-title">
      <span>{{ headName }}</span>
      <div class="right-btns">
        <el-select v-model="timeType" style="width:80px;" @change="time = null">
          <el-option value="year" label="按年">按年</el-option>
          <el-option value="month" label="按月">按月</el-option>
        </el-select>
        <el-date-picker
          v-if="timeType === 'year'"
          v-model="time"
          type="year"
          placeholder="选择年"
          value-format="yyyy"
          format="yyyy年"
          clearable
          suffix-icon="el-icon-arrow-up"
          style="width:140px;"
          @change="timeChange"
        ></el-date-picker>
        <el-date-picker
          v-if="timeType === 'month'"
          v-model="time"
          type="month"
          placeholder="选择月"
          value-format="yyyyMM"
          format="yyyy年MM月"
          style="width:140px;"
          clearable
          @change="timeChange"
        ></el-date-picker>
        <span @click="exportTypeData">
          <i class="el-icon-upload2"></i>
          导出数据
        </span>
      </div>
    </div>
    <div class="count-box-content" v-if="name === 'top'">
      <el-table :data="topData" style="width:100%" stripe :header-cell-style="{ background: 'rgba(0,0,0,0.02)' }">
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="name_id" label="姓名"></el-table-column>
        <el-table-column prop="num" label="预约次数"></el-table-column>
      </el-table>
    </div>
    <div class="count-box-content" v-else>
      <p>{{ subtitle }}</p>
      <!---------------------------- 曲线图 ---------------------------->
      <div :id="name" style="height:400px;width:100%;margin-bottom:20px;"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
// import echarts from 'echarts/lib/echarts';
import * as echarts from 'echarts/lib/echarts.js';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
export default {
  name: 'ResourceChart',
  props: {
    headName: String,
    name: String,
    subtitle: String,
    title: String,
    topData: Array,
  },
  data() {
    return {
      timeType: 'month',
      time: moment().format('yyyyMM'),
      chart: null,
      excelData: [],
    };
  },
  methods: {
    timeChange() {
      this.$emit('timeChange', this.name, this.timeType, this.time);
    },
    // 导出报修方式数据
    exportTypeData() {
      const arr = [];
      if (this.name === 'top') {
        arr.push(['序号', '姓名', '预约次数']);
        this.excelData.forEach((e, index) => {
          arr.push([index + 1, e.name_id, e.num]);
        });
      } else if (this.name === 'yysc') {
        arr.push(['时间', '预约时长']);
        this.excelData.forEach(e => {
          arr.push([e.name_time, e.num]);
        });
      } else {
        arr.push(['时间', '预约次数']);
        this.excelData.forEach(e => {
          arr.push([e.name_time, e.num]);
        });
      }
      this.common.exportExcel(arr, this.title + this.headName + `【${this.time}】.xlsx`);
    },

    // 初始化图表
    initCharts(op) {
      this.chart = echarts.init(document.getElementById(this.name));
      if (this.name === 'sjdyy') {
        op.legend.itemHeight = 10;
      }
      this.chart.setOption(op);
      let tmp = window.onresize;
      window.onresize = () => {
        if (this.chart) {
          this.chart.resize();
        }
        tmp && tmp()
      };
    },
  },
};
</script>
<style lang="scss" scoped></style>
