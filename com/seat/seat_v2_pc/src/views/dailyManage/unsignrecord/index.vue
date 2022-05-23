<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <el-button
        class="orange-btn"
        type="primary"
        size="middle"
        icon="el-icon-delete"
        @click="batchDel"
        v-show="isShowBtn"
      >批量撤销</el-button>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-select
          v-model="section"
          size="middle"
          placeholder="请选择区间"
          style="width:200px;margin-right:20px;"
          clearable
          @change="handleSelect"
        >
          <el-option v-for="item in sectionData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span v-show="section" style="margin-right:20px;">
          <el-time-select
            placeholder="起始时间"
            style="width:120px"
            v-model="startTime"
            :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
          }"
          ></el-time-select>
          <span class="mg-10">至</span>
          <el-time-select
            placeholder="结束时间"
            style="width:120px"
            v-model="endTime"
            :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            minTime:startTime
            }"
          ></el-time-select>
        </span>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入学号或姓名"
          size="middle"
          clearable
          @change="inputChange"
          @clear="getTableData(1,pageSize)"
          @keyup.enter.native="getTableData(1,pageSize)"
        >
          <el-button slot="append" icon="el-icon-search" @click="getTableData(1,pageSize)"></el-button>
        </el-input>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <el-table
      :data="tableData"
      style="width:100%;"
      header-row-class-name="table-header"
      v-loading="tableLoading"
      :row-style="{height:'10px'}"
      :cell-style="{padding:'26px 0px'}"
      @selection-change="handleSelectionChange"
      empty-text=" "
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userid" label="学号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="username" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createtime " label="未签到时间">
        <template slot-scope="scope">
          {{
          moment(scope.row.createtime, "YYYYMMDDhhmmss").format(
          "YYYY-MM-DD HH:mm:ss"
          ) }}
        </template>
      </el-table-column>
      <el-table-column prop="sectionname" label="座位信息" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.sectionname}} {{scope.row.seatname}}号座位</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span @click="handleDelete(scope.row.id)">撤销</span>
        </template>
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
      <p>暂无未签到信息</p>
    </div>
  </div>
</template>

<script>
import { fetchUnsignrecord, deleteByIds } from "@/api/manage/unsignrecord";
import { fetchSections } from "@/api/manage/section";
export default {
  data() {
    return {
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: null,
      times: "",
      startTime: null,
      endTime: null,
      section: null,
      sectionData: [],
      multipleSelection: [],
      isShowBtn: false
    };
  },

  computed: {},
  mounted() {
    this.getSections();
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  },
  methods: {
    inputChange() {
      this.section = null;
      this.times = "";
      this.isShowBtn = false;
      this.getTableData();
    },

    handleSelect() {
      this.keyword = null;
      this.isShowBtn = this.section ? true : false;
      this.startTime = this.section ? this.startTime : null;
      this.endTime = this.section ? this.endTime : null;
      this.getTableData();
    },

    //获取全部的区间
    getSections() {
      fetchSections({}).then(res => {
        if (res.success) {
          this.sectionData = res.data;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    batchDel() {
      let ids = this.multipleSelection.length
        ? this.multipleSelection.map(v => v.id).join(",")
        : "";
      if (!ids) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请先选择要撤销的行！"
        });
        return false;
      }
      this.handleDelete(ids);
    },

    handleDelete(ids) {
      this.$confirm(`确认撤销该未签到记录吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            ids: ids
          };
          deleteByIds(param).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "未签到记录删除成功"
              });
              this.getTableData();
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "未签到记录删除失败" + res.data.message
              });
            }
          });
        })
        .catch(err => {});
    },
    // 获取座位列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          keyword: this.keyword || null,
          sectionid: this.section || null,
          starttime: this.startTime ? this.startTime.replace(/:/gi, "") : null,
          endtime: this.endTime ? this.endTime.replace(/:/gi, "") : null
        },
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchUnsignrecord(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
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
.base-search-table {
  height: 100%;
  min-width: 1200px;
  overflow-y: auto;
  background: #ffffff;
}
.search-box-right {
  position: relative;
}
.fixed-dialog {
  position: absolute;
  top: 25%;
}
.tab-content {
  position: relative;
  min-height: 500px;
}
</style>