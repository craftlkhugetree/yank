<template>
  <el-dialog
    class="common-dialog"
    title="座位详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="dialogVisible = false"
  >
    <slot></slot>
    <seat ref="seatSet" :detailData="seatData" :curRow="row"></seat>
    <!---------------------------- 表格 ---------------------------->
    <div class="base-search-table" style="overflow: auto;">
      <div class="search-div">
        <span class="title">
          <i class="iconfont icon-menu-yygl" style="margin-right:8px"></i>
          <span>签到学生信息</span>
        </span>
        <!-- <div class="search-box-right"> -->
        <el-button
          class="btn-right"
          style="float:right"
          type="primary"
          size="middle"
          icon="el-icon-upload2"
          @click="downloadTemp"
        >导出</el-button>
        <!-- </div> -->
      </div>
      <el-table
        :data="tableData"
        style="width:100%;padding:0px 0px 24px 0"
        header-row-class-name="table-header"
        v-loading="loading"
        :row-style="{height:'10px'}"
        :cell-style="{padding:'26px 0px'}"
        empty-text=" "
        @sort-change="sortChange"
      >
        <el-table-column prop="userid" label="学号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="seatname" label="座位号"></el-table-column>
        <el-table-column prop="signtime " label="签到时间" width="250" sortable="custom">
          <template
            slot-scope="scope"
          >{{moment(scope.row.signtime, "YYYYMMDDhhmmss").format("YYYY-MM-DD HH:mm:ss")}}</template>
        </el-table-column>
      </el-table>
      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total > 0">
        <el-pagination
          background
          :hide-on-single-page="true"
          layout="sizes, prev, pager, next,jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10,20,50,100]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
      <!---------------------------- 无数据 ---------------------------->
      <div class="nodata" v-if="total == 0">
        <img src="@/assets/img/nofind.png" alt />
        <p>暂无签到学生信息</p>
      </div>
    </div>
    <span slot="footer">
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { closeSection, getSectionDetail } from "@/api/manage/section";
import { queryOrderBySeatid } from "@/api/manage/order";
import seat from "./seat";
export default {
  components: {
    seat
  },
  data() {
    return {
      dialogVisible: false,
      row: {},
      name: "",
      loading: false,
      seatData: {},
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      orderBy: "",
      sort: ""
    };
  },
  mounted() {},
  methods: {
    // 下载模板
    downloadTemp() {
      let url = `${window.g.url}/order/exportOrderUsers`;
      let sectionid = this.row.sectionid,
        orderdate = this.row.orderdate,
        starttime = this.row.starttime,
        endtime = this.row.endtime;
      let query = `?sectionid=${sectionid}&starttime=${starttime}&endtime=${endtime}&orderdate=${orderdate}`;
      window.open(url + query, "_blank");
    },
    getSeatDetail() {
      let param = {
        id: this.row.sectionid
      };
      getSectionDetail(param).then(res => {
        if (res.success) {
          this.seatData = _.cloneDeep(res.data);
        }
      });
    },
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.orderBy = "";
        this.sort = "";
      } else {
        this.orderBy = column.prop;
        this.sort = column.order.replace(/ending/gi, "");
      }
      this.getTableData();
    },

    // 获取座位列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        id: this.row.seatid,
        startdate: this.row.orderdate,
        enddate: this.row.orderdate,
        orderBy: this.orderBy,
        sort: this.sort //asc
      };
      queryOrderBySeatid(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = 1;
          this.currentPage = page;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  margin-left: 125px;
  font-size: 14px;
  color: #f9784a;
  text-align: left;
  text-indent: 140px;
}
.search-div {
  height: 80px;
  line-height: 80px;
  position: relative;
  .title {
    font-weight: 500;
    color: #333333;
    font-size: 16px;
  }
  .btn-right {
    width: 82px;
    height: 40px;
    position: absolute;
    right: 0px;
    top: 24px;
  }
}
</style>