<template>
  <div class="count-box">
    <div class="count-box-title">
      <span>{{ headName }}</span>
      <div class="right-btns">
        <el-select
          v-model="resId"
          filterable
          placeholder="请选择"
          size="small"
          v-if="name === 'yycsdb'"
          style="width: 200px"
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in excelData"
            :key="item.resid"
            :label="item.resname"
            :value="item.resid"
          ></el-option>
        </el-select>
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
      <el-row :gutter="10">
        <el-col :span="8">
          <p class="p_center">{{ t1 }}</p>
          <el-table
            :data="topData"
            style="width:100%"
            stripe
            :header-cell-style="{ background: 'rgba(0,0,0,0.02)' }"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name_id" label="姓名"></el-table-column>
            <el-table-column prop="num" label="预约次数" width="150"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <p class="p_center">{{ t2 }}</p>
          <el-table
            :data="cancelData"
            style="width:100%"
            stripe
            :header-cell-style="{ background: 'rgba(0,0,0,0.02)' }"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name_id" label="姓名"></el-table-column>
            <el-table-column prop="num" label="取消次数" width="150"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <p class="p_center">{{ t3 }}</p>
          <el-table
            :data="unCheckedData"
            style="width:100%"
            stripe
            :header-cell-style="{ background: 'rgba(0,0,0,0.02)' }"
          >
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name_id" label="姓名"></el-table-column>
            <el-table-column prop="num" label="未签到次数" width="150"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
  name: 'SysChart',
  props: {
    headName: String,
    name: String,
    subtitle: String,
    title: String,
    topData: Array,
    cancelData: Array,
    unCheckedData: Array,
  },
  data() {
    return {
      timeType: 'month',
      time: moment().format('yyyyMM'),
      chart: null,
      excelData: [],
      resId: [],
      t1: '预约次数排行TOP10',
      t2: '取消次数排行TOP10',
      t3: '未签到次数排行TOP10',
    };
  },
  watch: {
    resId(neww) {
      //   this.excelData.forEach(e => {
      //     if (!neww.includes(e.id)) {
      //       e.checked = false;
      //     }
      //   });
      //   console.log('resId:', neww);
      this.$emit('timeChange', this.name, this.timeType, this.time, neww);
    },
  },
  methods: {
    timeChange() {
      if (this.name === 'top') {
        this.$emit('timeChange', 'cancel', this.timeType, this.time);
        this.$emit('timeChange', 'unChecked', this.timeType, this.time);
      }
      this.$emit('timeChange', this.name, this.timeType, this.time);
    },
    genData(obj, str) {
      return (obj && obj[str]) || '';
    },
    // 导出报修方式数据
    exportTypeData() {
      const arr = [];
      if (this.name === 'top') {
        arr.push(['序号', '姓名', this.t1, '序号', '姓名', this.t2, '序号', '姓名', this.t3]);
        const ten = Array.from({ length: 10 });
        ten.forEach((e, index) => {
          arr.push([
            index + 1,
            this.genData(this.topData[index], 'name_id'),
            this.genData(this.topData[index], 'num'),
            index + 1,
            this.genData(this.cancelData[index], 'name_id'),
            this.genData(this.cancelData[index], 'num'),
            index + 1,
            this.genData(this.unCheckedData[index], 'name_id'),
            this.genData(this.unCheckedData[index], 'num'),
          ]);
        });
      } else if (this.name === 'yysc') {
        arr.push(['时间', '预约时长']);
        this.excelData.forEach(e => {
          arr.push([e.name_time, e.num]);
        });
      } else if (this.name === 'yycsdb') {
        arr.push(['资源名称', '预约次数']);
        this.excelData.forEach(e => {
          if (e.checked) arr.push([e.name_time, e.num]);
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
      if (this.name === 'yycsdb') {
        op.legend.itemHeight = 10;
      }
      this.chart.setOption(op);
      let tmp = window.onresize;
      window.onresize = () => {
        if (this.chart) {
          this.chart.resize();
        }
        if (tmp) {
          tmp();
        }
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.p_center {
  width: 100%;
  text-align: center;
  display: inline-block;
  margin: auto 0;
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #595959;
  line-height: 22px;
  margin-bottom: 20px;
}
</style>
