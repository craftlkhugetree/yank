<template>
  <div class="main-div" ref="mainDiv">
    <div class="base-search-table" style="overflow: auto;">
      <div class="search-box clearfix">
        <h3>疫情座位列表</h3>
        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入学号"
            size="middle"
            clearable
            @clear="getTableData(1,pageSize)"
            @keyup.enter.native="getTableData(1,pageSize)"
          >
            <el-button slot="append" icon="el-icon-search" @click="getTableData(1,pageSize)"></el-button>
          </el-input>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <div class="table-content">
        <el-table
          :data="tableData"
          style="width:100%"
          header-row-class-name="table-header"
          v-loading="loading"
          :row-style="{height:'10px'}"
          :cell-style="{padding:'26px 0px'}"
          empty-text=" "
          @sort-change="sortChange"
        >
          <el-table-column prop="sectionname" label="区间名称"></el-table-column>
          <el-table-column prop="seatname" label="座位号"></el-table-column>
          <el-table-column prop="signtime" label="签到时间" sortable="custom">
            <template
              slot-scope="scope"
            >{{moment(scope.row.signtime, "YYYYMMDDhhmmss").format("YYYY-MM-DD HH:mm:ss")}}</template>
          </el-table-column>
          <el-table-column prop="orderdate" label="预约日期" sortable="custom">
            <template slot-scope="scope">{{ moment(scope.row.orderdate).format("YYYY-MM-DD")}}</template>
          </el-table-column>
          <el-table-column prop="starttime" label="预约时间段" sortable="custom">
            <template
              slot-scope="scope"
            >{{moment(scope.row.starttime, "hhmm").format("HH:mm")}} ~ {{moment(scope.row.endtime, "hhmm").format("HH:mm") }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span @click.stop="lookUser(scope.row)">查看</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
        <p>暂无疫情座位信息</p>
      </div>
      <!---------------------------- 弹窗 ---------------------------->
      <seat-dialog class="fixed-dialog" ref="seatDialog" @doFunc="getTableData(1,pageSize)"></seat-dialog>
    </div>
  </div>
</template>

<script>
import { fetchOrder } from "@/api/manage/order";
import seatDialog from "./seatDialog";
export default {
  data() {
    return {
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      orderBy: "",
      sort: ""
    };
  },
  components: { seatDialog },
  computed: {},
  methods: {
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

    getTableData(page, pageSize) {
      this.loading = true;
      let data = {
        filter: { userid: this.keyword || null },
        page: page || 1,
        limit: pageSize || this.pageSize,
        orderBy: this.orderBy,
        sort: this.sort //asc
      };
      fetchOrder(data)
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
          this.total = res.total;
          this.currentPage = page;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    lookUser(row) {
      let seatDialog = this.$refs.seatDialog;
      seatDialog.dialogVisible = true;
      seatDialog.row = row;
      seatDialog.getSeatDetail();
      seatDialog.getTableData();
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>

<style lang="scss" scoped>
.main-div {
  width: 100%;
  height: 100%;
  min-height: 800px;
  margin: 0 auto;
  padding: 0;
  background: #fff;
}
</style>