<template>
  <div>
    <div class="exam-account-box">
      <div class="top">
        <span class="name">年级统计</span>
        <!-- <span class="num">考试总人数 {{totalObj.totals?totalObj.totals:'--'}}人</span> -->
        <el-button type="primary" size="small" style="width:100px;float:right" @click="exportFile">
          <i class="el-icon-download" style="margin-right:10px"></i>导出
        </el-button>

        <el-date-picker
          style="float:right;width: 300px;margin-right:10px"
          v-model="selectDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changedate"
          value-format="yyyyMMdd"
          size="small"
          clearable
        ></el-date-picker>
      </div>

      <div v-show="hasData" id="main" style="width:100%;height:450px"></div>
      <div v-show="!hasData" style="text-align:center;">
        <img src="../../../static/images/no-data.png" />
        <div style="margin-top:20px">暂无数据</div>
      </div>
    </div>
    <div class="common-content" style="box-shadow:none;padding-bottom:50px">
      <!-- <el-row> -->
      <!-- <el-col :span="16" class="centent-left"> -->
      <!-- 搜索框查询 -->
      <!-- <div class="search-box">
                <span class="item">
                    <label>年级</label>
                    <el-select v-model="searchForm.grade" placeholder="请选择" size="small" style="width:160px">
                        <el-option v-for="(k,i) in years" :key="i" :label="k" :value="k">
                        </el-option>
                    </el-select>
                </span>

                <el-button plain size="small" style="width:80px" @click="search">搜索</el-button>
                <el-button plain size="small" style="width:80px" icon="el-icon-refresh-right" @click="reset">重置</el-button>

      </div>-->

      <!--表格-->
      <el-table
        class="my-table"
        :data="tableList"
        style="width: 100%"
        stripe
        v-loading="loading"
        @sort-change="getSort"
      >
        <el-table-column prop="grade" label="年级" align="center" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="ksrs" label="考试人数" align="center" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="tgrs" label="通过人数" align="center" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="wtgrs" label="未通过人数" align="center" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="tgl" label="通过率" align="center" sortable show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.tgl+"%"}}</template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <!-- <div class="my-pagination">
                <span>显示{{limit}}条，共{{totalPage}}条</span>
                <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit" 
                :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
      </div>-->
      <!-- </el-col> -->

      <!-- </el-row> -->
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "index",
  components: {},
  data() {
    let toYear = new Date().getFullYear(); //今年
    return {
      tableList: [],
      loading: false,
      totalPage: 1,
      limit: 10,
      currentPage: 1,
      classifyList: [], //题目分类列表
      searchForm: {},
      orderSort: null,
      orderBy: null,
      years: new Set([toYear, toYear - 1, toYear - 2, toYear - 3, toYear - 4]), //查询5内年级列表
      totalObj: {},
      totalObjChart: {},
      charts: "",
      opinion: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
      xopinion: [], //x轴类型
      opinionData: [],
      currentCount: {},
      currentData: [], //用于环形图

      starttime: toYear + "0101",
      endtime: toYear + "1231",
      selectDate: [],
      hasData: false
    };
  },

  methods: {
    // 点击时间选择器
    changedate() {
      // console.log(this.selectDate);
      if (this.selectDate) {
        this.starttime = this.selectDate[0];
        this.endtime = this.selectDate[1];
      } else {
        this.starttime = "";
        this.endtime = "";
      }

      this.getList();
    },

    // 图表(当前)
    drawPieCurrent(id) {
      this.charts = echarts.init(document.getElementById(id));
      // this.charts.setOption({},true);

      this.charts.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["通过考试", "未通过考试"], //'未参加考试'
          x: "left",
          icon: "circle",
          left: "5%",
          top: "1%",
          itemWidth: 9,
          itemHeight: 9
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "6%",
          containLabel: true
        },
        yAxis: [
          {
            type: "category",
            data: this.xopinion,
            name: "年级",
            nameLocation: "center",
            nameGap: 50,
            axisLabel: {
              interval: 0
            }
          }
        ],
        xAxis: [
          {
            type: "value",
            name: "考试人数(人)",
            nameLocation: "center",
            nameGap: 30,
            minInterval: 1
          }
        ],
        series: this.opinionData,
        color: ["#6ADFAF", "#F7C122", "#6D7FA1"]
      });
    },

    // 点击排序
    getSort: function(column, prop, order) {
      let data = column.prop;

      this.orderBy = data.toUpperCase();

      let sort = column.order;
      switch (sort) {
        case "ascending":
          this.orderSort = "asc";
          break;
        case "descending":
          this.orderSort = "desc";
          break;
      }

      this.currentPage = 1;
      this.getList();
    },

    //导出
    exportFile() {
      var str1 = "?";
      str1 += this.searchForm.grade
        ? "grade=" + this.searchForm.grade + "&"
        : "";
      str1 +=
        this.starttime && this.starttime.length > 0
          ? "starttime=" + this.starttime + "&"
          : "";
      str1 +=
        this.endtime && this.endtime.length > 0
          ? "endtime=" + this.endtime
          : "";

      this.util
        .getUrlByCode(this.global.code, "/dataGrade/exportBottom" + str1)
        .then(res => {
          window.open(res, "_target");
        });
    },

    // 搜索和重置
    search() {
      this.currentPage = 1;
      this.getList();
    },

    reset() {
      this.searchForm = {};
      this.search();
    },

    // 点击分页
    getCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    // 获取列表
    getList() {
      this.loading = true;

      this.util
        .postAjax({
          code: this.global.code,
          url: "/dataGrade/bottom",
          // isRep:true,
          data: {
            starttime: this.starttime,
            endtime: this.endtime
          }
          // }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableList = res.data;
            this.totalPage = res.total;

            this.selectDate = [this.starttime, this.endtime];

            let arr = [];
            let tgrsArr = [];
            let wtgrsArr = [];
            let wksrsArr = [];
            this.tableList.forEach(v => {
              arr.push(v.grade);
              tgrsArr.push(v.tgrs);
              wtgrsArr.push(v.wtgrs);
              wksrsArr.push(v.zrs - v.ksrs);
            });

            this.xopinion = arr;
            // console.log(arr);
            this.opinionData = [
              {
                name: "通过考试",
                type: "bar",
                barWidth: 20,
                label: {
                  show: true,
                  position: "insideLeft"
                },
                stack: "总人数",
                data: tgrsArr
              },
              {
                name: "未通过考试",
                type: "bar",
                stack: "总人数",
                data: wtgrsArr,
                label: {
                  show: true,
                  position: "insideLeft"
                }
              }
              // {
              //     name: '未参加考试',
              //     type: 'bar',
              //     stack: '总人数',
              //     data: wksrsArr,
              //     label: {
              //         show: true,
              //         position: 'insideLeft'
              //     },
              // },
            ];

            if (this.tableList.length > 0) {
              this.hasData = true;
              this.$nextTick(function() {
                this.drawPieCurrent("main");
                //图表宽度自适应
                window.addEventListener("resize", () => {
                  this.charts.resize();
                });
              });
            } else {
              this.hasData = false;
            }

            // console.log(this.tableList)
          }

          // this.isShowPage();
        });
    }
  },

  created() {
    this.getList();
  },

  //调用
  mounted() {}
};
</script>

<style scoped>
.exam-account-box {
  padding: 30px 20px;
  box-sizing: border-box;
  background: #ffffff;
}

.exam-account-box .top {
  margin-bottom: 25px;
}

.exam-account-box .top .name {
  font-size: 17px;
  border-bottom: 5px solid #cde1ff;
  font-weight: bold;
  display: inline-block;
  line-height: 12px;
  margin-right: 25px;
  margin-top: 12px;
}

.exam-account-box .top .num {
  color: #666666;
  font-size: 14px;
}

.exam-account-box .data .item {
  height: 120px;
  background: #ffffff;
  box-shadow: 0px 2px 15px 0px rgba(238, 238, 238, 0.5);
  padding: 24px 40px;
  box-sizing: border-box;
  white-space: nowrap;
}

.exam-account-box .image {
  display: inline-block;
  width: 80px;
  height: 80px;

  margin-right: 50px;
}

.exam-account-box .image img {
  width: 100%;
  height: 100%;
}

.exam-account-box .account {
  display: inline-block;
  vertical-align: top;
}

.exam-account-box .account .num {
  font-size: 26px;
  margin-bottom: 10px;
  margin-top: 15px;
}

.centent-left {
  border-right: 1px solid #f2f2f2;
  padding-right: 20px;
}

.content-right {
  padding-left: 30px;
}

.content-right .title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 30px;
}

.explain .item {
  display: inline-block;
}

.explain .item .circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 15px;
  color: #2c3542;
}

.explain .item .circle.green {
  background: #6adfaf;
  border: none;
  border-radius: 50%;
}

.explain .item .circle.yellow {
  background: #f7c122;
  border: none;
  border-radius: 50%;
}

.explain .item .circle.grey {
  background: #6d7fa1;
  border: none;
  border-radius: 50%;
}

.explain .item .bottom {
  margin-top: 10px;
  box-sizing: border-box;
  padding-left: 28px;
  font-size: 18px;
  font-weight: bold;
}
</style>
