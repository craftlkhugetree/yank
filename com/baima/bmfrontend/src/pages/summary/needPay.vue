<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
      <el-date-picker
        style="width: 300px"
        v-model="searchForm.daterange"
        type="daterange"
        range-separator="--"
        start-placeholder="缴费开始日期"
        end-placeholder="缴费结束日期"
        value-format="yyyyMMdd"
        @change="dateRangeChange"
        :clearable="false"
        size="small"
      ></el-date-picker>

      <span>
        <el-button size="small" style="width: 100px" @click="search"
          >搜索</el-button
        >
      </span>
      <span class="reset-icon" @click="reset">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>

      <div
        style="display:inline-block;float: right;margin-top: 3px;margin-bottom: 20px"
      >
        <div class="my-button green" style="" @click="download">
          <span>导出</span>
        </div>
      </div>
    </div>

    <!--表格-->
    <el-table
      class="my-table"
      :data="resList"
      style="width: 100%"
      stripe
      ref="multipleTable"
      v-loading="loading"
      :header-cell-style="{ background: '#F3F5F9' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="eduTypeName"
        label="资源类型"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="rescode"
        label="租金（元）"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ common.moneyFormatter("", "", scope.row.zujin) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rescode"
        label="逾期租金（元）"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ common.moneyFormatter("", "", scope.row.yuqijin) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rescode"
        label="水费（元）"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ common.moneyFormatter("", "", scope.row.shuifei) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rescode"
        label="电费（元）"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ common.moneyFormatter("", "", scope.row.dianfei) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rescode"
        label="合计（元）"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ common.moneyFormatter("", "", scope.row.all) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Arrears",
  data() {
    return {
      summary: {eduTypeName: "合计收费"},
      activeResType: "", //默认资源id
      totalPage: 1,
      limit: 10,
      currentPage: 1,
      activeName: "second",
      resList: [], //申请列表
      groupList: [], //学院列表
      searchForm: {},
      loading: false,
      tabLoading: false,
      typeDetail: {},
      selectedIds: "",
      resTypeDetail: {},
      resTypeList: [],
      viewUrl: window.g.ApiUrl3 + "rest/FileOut/view/", //预览地址
      selectLoading: false
    };
  },
  methods: {
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == this.resList.length - 1) {
        // console.log(row, rowIndex);
        return "last-line";
      }
      return "";
    },
    // 日期
    dateRangeChange(val) {
      console.log(val);
    },
    //导出
    download() {
      // let params = JSON.stringify({
      //   classname: this.searchForm.classname,
      //   sprestypeid: this.searchForm.sprestypeid,
      //   orgid: this.searchForm.orgid
      // });
      // this.util
      //   .getUrlByCode(this.global.code, "/data/exportNeedPay")
      //   .then(res => {
      //     window.open(res + "?params=" + encodeURI(params), "_blank");
      //   });
      this.loading = true;
      const data = [
        [
          "资源类型",
          "租金（元）",
          "逾期租金（元）",
          "水费（元）",
          "电费（元）",
          "合计（元）"
        ]
      ];
      this.resList.forEach(t => {
        let arr = [];
        for (let name in this.summary) {
          arr.push(t[name]);
        }
        data.push(arr);
      });
      try {
        this.common.exportExcel(data, "科教资源收费统计.xlsx");
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      } catch (e) {
        this.loading = false;
      }
    },

    //搜索
    search() {
      this.getList(1);
    },

    //清空
    reset() {
      this.searchForm = {};
      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    //获取列表
    getList(page) {
      this.loading = true;
      const data =
        this.searchForm.daterange && this.searchForm.daterange.length
          ? {
              starttime: this.searchForm.daterange[0],
              endtime: this.searchForm.daterange[1]
            }
          : {};
      this.util
        .postAjax({
          code: this.global.code,
          url: "/data/eduResAmounts",
          isRep: true,
          data
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.resList = res.data;
            if (this.resList && this.resList.length) {
              let obj = {
                zujin: 0,
                yuqijin: 0,
                shuifei: 0,
                dianfei: 0,
                all: 0
              };
              obj = this.resList.reduce((pre, r) => {
                r.all = parseFloat(
                  (r.zujin || 0) +
                    (r.yuqijin || 0) +
                    (r.shuifei || 0) +
                    (r.dianfei + 0)
                );
                for (let name in obj) {
                  pre[name] += r[name];
                }
                return pre;
              }, obj);
              this.summary = {...this.summary, ...obj}
              this.resList.push(this.summary);
            }
            this.totalPage = res.total;
          }
        });
    }
  },
  created() {
    this.getList(this.currentPage);
  }
};
</script>

<style scoped lang="scss">
/deep/ .last-line {
  font-weight: bolder !important;
}
</style>
