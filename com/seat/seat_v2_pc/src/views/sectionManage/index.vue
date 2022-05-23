<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>区间座位列表</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入区间名称"
          size="middle"
          clearable
          @clear="getTableData(1,pageSize)"
          @keyup.enter.native="getTableData(1,pageSize)"
          style=" margin-right:20px"
        >
          <el-button slot="append" icon="el-icon-search" @click="getTableData(1,pageSize)"></el-button>
        </el-input>

        <el-select
          v-model="status"
          size="middle"
          placeholder="请选择状态"
          style="width:175px;margin-right:16px;"
          clearable
          @change="getTableData(1,pageSize)"
        >
          <el-option
            v-for="item in statusList"
            :key="item.text"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-divider direction="vertical"></el-divider>
        <el-button
          style="margin-left:16px;"
          class="orange-btn"
          type="primary"
          size="middle"
          icon="el-icon-plus"
          @click="handleUpdate"
        >新增</el-button>
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
      empty-text=" "
    >
      <el-table-column prop="name" label="区间名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="location" label="开放地点" show-overflow-tooltip></el-table-column>
      <el-table-column prop="seatnum" label="座位数量" width="110"></el-table-column>
      <el-table-column prop="islocakers " label="储存柜" width="110">
        <template slot-scope="scope">{{scope.row.islocakers =='1'? '有':'无'}}</template>
      </el-table-column>
      <el-table-column prop="status " label="状态" width="110">
        <template slot-scope="scope">
          <i
            :class="scope.row.status =='1'?'blue-budge':(scope.row.status =='2'?'red-budge':'orange-budge')"
          ></i>
          {{scope.row.status =='1'? '开放':(scope.row.status =='2'?'关闭':'临时关闭')}}
        </template>
      </el-table-column>

      <el-table-column prop="stepMove" label="排序" width="150">
        <template slot-scope="scope">
          <div class="mod16 flex-row justify-between">
              <span :class="beAbleToMove(scope.$index, UP) ? 'disable-span' : ''" @click="beAbleToMove(scope.$index, UP) ? void 0 : moveOneLine(scope.row.id, UP)">↑&nbsp;上移</span>
              <span :class="beAbleToMove(scope.$index, DOWN) ? 'disable-span' : ''" @click="beAbleToMove(scope.$index, DOWN) ? void 0 : moveOneLine(scope.row.id, DOWN)">↓&nbsp;下移</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <span @click="lookDetail(scope.row)">查看</span>
          <el-divider direction="vertical"></el-divider>
          <span v-if="scope.row.status =='2'" @click="handleDel(scope.row)">删除</span>
          <span
            v-show="scope.row.status =='1' ||scope.row.status =='3' "
            @click="handleClose(scope.row)"
          >临时关闭</span>

          <el-divider direction="vertical"></el-divider>
          <span v-show="scope.row.status !=='2'">
            <span @click="handleStatus(scope.row,'2')">关闭</span>
            <el-divider direction="vertical"></el-divider>
          </span>

          <span v-show="scope.row.status !=='1'">
            <span @click="handleStatus(scope.row,'1')">开放</span>
            <el-divider direction="vertical"></el-divider>
          </span>

          <span v-show="scope.row.status !=='1'" @click="handleUpdate(scope.row)">编辑</span>
          <span
            v-show="scope.row.isinterval =='0' && scope.row.status <'2' "
            class="green"
            @click="openIntervalSeat(scope.row)"
            title="开启疫情座位"
          >疫情座位</span>
          <span
            v-show="scope.row.isinterval =='1'  && scope.row.status !=='3'"
            @click="closeIntervalSeat(scope.row)"
            title="恢复正常座位"
          >恢复座位</span>
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
      <p>暂无区间座位信息</p>
    </div>
    <!---------------------------- 临时关闭弹窗 ---------------------------->
    <close-dialog class="fixed-dialog" ref="closeDialog" @doFunc="getTableData(1,pageSize)"></close-dialog>
    <!---------------------------- 查看座位弹窗 ---------------------------->
    <look-dialog class="fixed-dialog" ref="lookDialog"></look-dialog>
    <!---------------------------- 疫情座位弹窗 ---------------------------->
    <interval-dialog class="fixed-dialog" ref="intervalDialog" @doFunc="getTableData(1,pageSize)"></interval-dialog>
  </div>
</template>

<script>
import CloseDialog from "./closeDialog";
import LookDialog from "./lookDialog";
import IntervalDialog from "./intervalDialog";
import {
  fetchSectionList,
  closeInterval,
  getSectionDetail,
  deleteSection,
  changeStatus,
  moveStep,
} from "@/api/manage/section";

export default {
  components: { CloseDialog, LookDialog, IntervalDialog },
  data() {
    return {
      UP: 'up',
      DOWN: 'down',
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: "",
      status: null
    };
  },

  computed: {
    beAbleToMove() {
      return (index, str) => (str === this.DOWN) ? (this.pageSize * (this.currentPage - 1) + index + 1) === this.total 
      : (this.currentPage == '1' && index === 0);
    },
    statusList() {
      return this.$store.state.statusList;
    }
  },

  methods: {
    throttle(fun, time) {
      _.throttle(() => fun, time)
    },
    // move up,down
    moveOneLine(id, direction) {
      moveStep({id}, direction).then(res => {
        if (res && res.success) {
          this.getTableData(this.currentPage, this.pageSize);
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: "调整区间座位失败" + (res.data && res.data.message || '')
          });
        }
      })
    },
    //开启疫情模式
    openIntervalSeat(row) {
      let intervalDialog = this.$refs.intervalDialog;
      intervalDialog.dialogVisible = true;
      intervalDialog.id = row.id;
      intervalDialog.getSeatDetail();
    },
    //关闭疫情模式
    closeIntervalSeat(row) {
      this.$confirm(`确认恢复正常座位吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            id: row.id
          };
          closeInterval(param).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "关闭疫情座位成功！"
              });
              this.getTableData(this.currentPage, this.pageSize);
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "关闭疫情座位失败" + res.data.message
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
          status: this.status || null,
          name: this.keyword
        },
        orderBy: "level",
        sort: "asc", //asc
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchSectionList(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
          this.currentPage = page;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },

    //新增、编辑
    handleUpdate(section) {
      let id = section.id ? section.id : "create";
      this.$router.push(`/section-manage/update/${id}`);
    },
    // 临时关闭
    handleClose(row) {
      let closeDialog = this.$refs.closeDialog;
      closeDialog.dialogVisible = true;
      closeDialog.formdata = row;
      closeDialog.handleFormVal();
    },

    handleStatus(row, type) {
      let data = {
        id: row.id,
        status: type
      };
      let typeArr = ["", "开放", "关闭"];

      this.$confirm(`确认${typeArr[type]}区间座位吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          changeStatus(data).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: `${typeArr[type]}成功`
              });
              this.getTableData(this.currentPage, this.pageSize);
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: `${typeArr[type]}失败 ${res.data.message}`
              });
            }
          });
        })
        .catch(err => {});
    },

    handleDel(row) {
      this.$confirm(`确认删除这个区间吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            id: row.id
          };
          deleteSection(data).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "删除区间座位成功！"
              });
              this.getTableData(this.currentPage, this.pageSize);
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "删除区间座位失败" + res.data.message
              });
            }
          });
        })
        .catch(err => {});
    },

    lookDetail(row) {
      let lookDialog = this.$refs.lookDialog;
      lookDialog.dialogVisible = true;
      lookDialog.id = row.id;
      lookDialog.getSeatDetail();
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: calc(100% - 20px);
  margin: 0 20px 20px 0;
  background: #ffffff;
}
.search-box-right {
  position: relative;
}

.tab-content {
  position: relative;
  min-height: 500px;
}
.opent-status {
  color: #333333;
  margin-left: 8px;
}
.blue-budge,
.orange-budge,
.red-budge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #3d7fff;
  display: inline-block;
  margin-right: 4px;
}
.orange-budge {
  background-color: #ffa033;
}
.red-budge {
  background-color: red;
}

.switch-text-left,
.switch-text-right {
  position: absolute;
  font-size: 12px;
  color: #ffffff !important;
}
.switch-text-left {
  left: 16px;
  top: 12px;
}
.switch-text-right {
  right: 6px;
  top: 12px;
}
.green {
  color: #1dc192 !important;
}
.disable-span {
  pointer-events: none;
  color: #999999!important;
}
</style>