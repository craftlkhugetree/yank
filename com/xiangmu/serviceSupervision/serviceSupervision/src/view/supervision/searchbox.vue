<template>
  <div>
    <p class="labels">选择时间段</p>
    <el-date-picker
      v-model="dates"
      type="daterange"
      range-separator="→"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      class="daterange"
      size="small"
    >
    </el-date-picker>
    <p class="labels">监督类型</p>
    <el-select
      v-model="serviceType"
      placeholder="监督类型"
      class="selects"
      size="small"
    >
      <el-option
        v-for="item in serviceTypes"
        :key="item.type"
        :label="item.name"
        :value="item.type"
      >
      </el-option>
    </el-select>
    <p class="labels">标题</p>
    <el-input
      v-model="title"
      placeholder="请输入标题"
      size="small"
      class="inputs"
    ></el-input>
    <el-button
      type="primary"
      icon="el-icon-search"
      size="small"
      class="btn"
      @click="search"
      >查询</el-button
    >
    <el-button
      icon="el-icon-refresh-right"
      size="small"
      class="btn"
      @click="reset"
      >重置</el-button
    >
  </div>
</template>

<script>
export default {
  name: "supervision",
  data() {
    return {
      dates: null,
      serviceType: null,
      title: "",
      serviceTypes: [
        { type: null, name: "全部" },
        { type: 1, name: "咨询" },
        { type: 2, name: "投诉" },
        { type: 3, name: "表扬" },
        { type: 4, name: "反馈" },
        { type: 5, name: "其他" },
      ],
    };
  },
  components: {},
  methods: {
    reset() {
      this.dates = null;
      this.serviceType = "";
      this.title = "";
      this.$emit("reset");
    },
    search() {
      let searchData = {
        dates: this.dates,
        type: this.serviceType,
        title: this.title,
      };
      this.$emit("search");
    },
    getForm() {
      return {
        dates: this.dates,
        type: this.serviceType,
        title: this.title,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.labels {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  line-height: 20px;
  margin-bottom: 10px;
}
.daterange,
.selects,
.inputs {
  width: 100%;
  margin-bottom: 20px;
}
.btn {
  width: 130px;
}
.el-button + .el-button {
  margin-left: 15px;
}
</style>