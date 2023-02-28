<template>
  <div>
    <el-tabs class="card-tabs" v-model="activeTab" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="tab in userDeptList" :key="tab.ID" :label="tab.NAME" :name="tab.ID"></el-tab-pane>
    </el-tabs>

    <div class="statistic-box">
      <!---------------------------- 区域对比分析 ---------------------------->
      <div class="count-box" v-loading="areaLoading">
        <div class="count-box-title">
          <span>问题区域对比分析</span>
          <div class="right-btns">
            <el-date-picker
              v-model="areaTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyyMMdd"
              format="yyyy-MM-dd"
              style="width:280px;"
              @change="getAreaData"
            ></el-date-picker>
            <span @click="exportAreaData">
              <i class="el-icon-upload2"></i>导出数据
            </span>
          </div>
        </div>
        <div class="count-box-content" style="padding-top:5px;">
          <el-tabs v-model="activeAreaTab" @tab-click="handleClickArea" class="chart-tab">
            <el-tab-pane v-for="tab in allAreaList" :key="tab.id" :label="tab.name" :name="tab.id"></el-tab-pane>
          </el-tabs>
          <p>提问量对比</p>
          <div id="areaCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
        </div>
      </div>
      <!---------------------------- 分类对比分析 ---------------------------->
      <div class="count-box" v-loading="typeLoading">
        <div class="count-box-title">
          <span>问题分类对比分析</span>
          <div class="right-btns">
            <el-date-picker
              v-model="typeTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyyMMdd"
              format="yyyy-MM-dd"
              style="width:280px;"
              @change="getTypeData"
            ></el-date-picker>
            <span @click="exportTypeData">
              <i class="el-icon-upload2"></i>导出数据
            </span>
          </div>
        </div>
        <div class="count-box-content">
          <el-tabs v-model="activeTypeTab" @tab-click="handleClickType" class="chart-tab">
            <el-tab-pane v-for="tab in allTypeList" :key="tab.id" :label="tab.name" :name="tab.id"></el-tab-pane>
          </el-tabs>
          <p>提问量对比</p>
          <div id="typeCharts" style="height:450px;width:100%;margin-bottom:20px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
export default {
  data() {
    return {
      activeTab: "",
      // 区域
      areaLoading: false,
      areaTime: null,
      activeAreaTab: "",
      areaList: [],
      areaChart: null,
      areaChartOptions: null,
      // 类型
      typeLoading: false,
      typeTime: null,
      activeTypeTab: "",
      typeList: [],
      typeChart: null,
      typeChartOptions: null
    };
  },
  computed: {
    userDeptList() {
      return this.$store.state.userInfo.userOrgId;
    },
    allAreaList() {
      let arr = [
        {
          id: "all",
          name: "提问总量"
        }
      ];
      return arr.concat(this.areaList);
    },
    allTypeList() {
      let arr = [
        {
          id: "all",
          name: "提问总量"
        }
      ];
      return arr.concat(this.typeList);
    }
  },
  watch: {
    userDeptList: {
      handler: function(val) {
        if (val.length > 0) {
          this.activeTab = val[0].ID;
          this.getAreaList();
          this.getTypeList();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 切换tab
    handleClick(tab) {
      this.getAreaList();
      this.getTypeList();
    },
    handleClickArea(tab) {
      this.getAreaData();
    },
    handleClickType(tab) {
      this.getTypeData();
    },
    // 初始化图表
    initAreaCharts() {
      this.areaChart = echarts.init(document.getElementById("areaCharts"));
      this.areaChartOptions.legend.itemHeight = 10;
      this.areaChart.setOption(this.areaChartOptions);
    },
    initTypeCharts() {
      this.typeChart = echarts.init(document.getElementById("typeCharts"));
      this.typeChartOptions.legend.itemHeight = 10;
      this.typeChart.setOption(this.typeChartOptions);
    },
    // 导出数据
    exportAreaData() {
      let url = `${window.g.url}dataArea/exportAreaVs`;
      let starttime = this.areaTime ? this.areaTime[0] : "";
      let endtime = this.areaTime ? this.areaTime[1] : "";
      let areaid = this.activeAreaTab == "all" ? "" : this.activeAreaTab;
      let query = `?starttime=${starttime}&endtime=${endtime}&handledeptid=${this.activeTab}&areaid=${areaid}`;
      window.open(url + query, "_blank");
    },
    exportTypeData() {
      let url = `${window.g.url}dataArea/exportQuesttypeVs`;
      let starttime = this.typeTime ? this.typeTime[0] : "";
      let endtime = this.typeTime ? this.typeTime[1] : "";
      let questtypeid = this.activeTypeTab == "all" ? "" : this.activeTypeTab;
      let query = `?starttime=${starttime}&endtime=${endtime}&handledeptid=${this.activeTab}&questtypeid=${questtypeid}`;
      window.open(url + query, "_blank");
    },
    // 获取区域列表
    getAreaList() {
      return new Promise((resolve, reject) => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "area/areas",
            isRep: true,
            data: {
              deptid: this.activeTab
            }
          })
          .then(res => {
            if (res.success) {
              this.areaList = res.data;
              this.activeAreaTab = this.allAreaList[0].id;
              resolve(res.data);
              this.getAreaData();
            } else {
              this.areaList = [];
              reject();
            }
          })
          .catch(err => {
            this.areaList = [];
            reject();
          });
      });
    },
    // 获取类型列表
    getTypeList() {
      return new Promise((resolve, reject) => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "questtype/types",
            isRep: true,
            data: {
              deptid: this.activeTab
            }
          })
          .then(res => {
            if (res.success) {
              this.typeList = res.data;
              this.activeTypeTab = this.allTypeList[0].id;
              resolve(res.data);
              this.getTypeData();
            } else {
              this.typeList = [];
              reject();
            }
          })
          .catch(err => {
            this.typeList = [];
            reject();
          });
      });
    },
    // 获取区域数据
    getAreaData() {
      this.areaLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataArea/areaVs",
          data: {
            starttime: this.areaTime ? this.areaTime[0] : null,
            endtime: this.areaTime ? this.areaTime[1] : null,
            handledeptid: this.activeTab,
            areaid: this.activeAreaTab == "all" ? null : this.activeAreaTab
          }
        })
        .then(async res => {
          this.areaLoading = false;
          if (res.success) {
            let list = [];
            if (this.typeList.length > 0) {
              list = this.typeList;
            } else {
              list = await this.getTypeList();
            }
            let data = res.data;
            list.forEach(i => {
              i.num = 0;
              data.forEach(j => {
                if (i.id == j.questtypeid) {
                  i.num = j.num;
                }
              });
            });
            // 设置legendData
            let legendData = [];
            // 设置横坐标Data
            let xAxisData = list.map(i => i.name);
            // 设置系列Data
            let seriesData = [
              {
                name: "提问量",
                type: "bar",
                barMaxWidth: 50,
                itemStyle: {
                  color: "#3A78FC"
                },
                labelLine: {
                  show: true
                },
                label: {
                  show: true,
                  position: "top"
                },
                data: list.map(i => i.num)
              }
            ];
            // 设置图表配置项
            this.areaChartOptions = this.common.setOptions(
              legendData,
              xAxisData,
              seriesData
            );
            this.initAreaCharts();
          }
        })
        .catch(err => {
          this.areaLoading = false;
        });
    },
    // 获取类型数据
    getTypeData() {
      this.typeLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dataArea/questtypeVs",
          data: {
            starttime: this.typeTime ? this.typeTime[0] : null,
            endtime: this.typeTime ? this.typeTime[1] : null,
            handledeptid: this.activeTab,
            questtypeid: this.activeTypeTab == "all" ? null : this.activeTypeTab
          }
        })
        .then(async res => {
          this.typeLoading = false;
          if (res.success) {
            let list = [];
            if (this.areaList.length > 0) {
              list = this.areaList;
            } else {
              list = await this.getAreaList();
            }
            let data = res.data;
            list.forEach(i => {
              i.num = 0;
              data.forEach(j => {
                if (i.id == j.areaid) {
                  i.num = j.num;
                }
              });
            });
            // 设置legendData
            let legendData = [];
            // 设置横坐标Data
            let xAxisData = list.map(i => i.name);
            // 设置系列Data
            let seriesData = [
              {
                name: "提问量",
                type: "bar",
                barMaxWidth: 50,
                itemStyle: {
                  color: "#3A78FC"
                },
                labelLine: {
                  show: true
                },
                label: {
                  show: true,
                  position: "top"
                },
                data: list.map(i => i.num)
              }
            ];
            // 设置图表配置项
            this.typeChartOptions = this.common.setOptions(
              legendData,
              xAxisData,
              seriesData
            );
            this.initTypeCharts();
          }
        })
        .catch(err => {
          this.typeLoading = false;
        });
    }
  },
  created() {
    window.onresize = () => {
      if (this.areaChart) {
        this.areaChart.resize();
      }
      if (this.typeChart) {
        this.typeChart.resize();
      }
    };
  }
};
</script>

<style>
</style>