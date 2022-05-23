<template>
  <div>
    <div class="base-search-table">
      <div class="search-box clearfix">
        <h3>座位预分配</h3>

        <!---------------------------- 查询条件 ---------------------------->
        <div class="search-box-right">
          <el-input
            class="input-box"
            v-model="keyword"
            placeholder="请输入区间名称"
            size="middle"
            clearable
            @clear="getTableData(1, pageSize)"
            @keyup.enter.native="getTableData(1, pageSize)"
            style="margin-right: 20px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getTableData(1, pageSize)"
            ></el-button>
          </el-input>
        </div>
      </div>
      <!---------------------------- 表格 ---------------------------->
      <el-table
        :data="tableData"
        style="width: 100%"
        header-row-class-name="table-header"
        v-loading="tableLoading"
        :row-style="{ height: '10px' }"
        :cell-style="{ padding: '26px 0px' }"
        empty-text=" "
      >
        <el-table-column
          prop="name"
          label="区间名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="location"
          label="开放地点"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="seatnum"
          label="座位数量"
          width="110"
        ></el-table-column>
        <el-table-column prop="islocakers " label="储存柜" width="110">
          <template slot-scope="scope">{{
            scope.row.islocakers == "1" ? "有" : "无"
          }}</template>
        </el-table-column>
        <el-table-column prop="status " label="状态" width="110">
          <template slot-scope="scope">
            <i
              :class="
                scope.row.status == '1'
                  ? 'blue-budge'
                  : scope.row.status == '2'
                  ? 'red-budge'
                  : 'orange-budge'
              "
            ></i>
            {{
              scope.row.status == "1"
                ? "开放"
                : scope.row.status == "2"
                ? "关闭"
                : "临时关闭"
            }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <span @click="assignSeats(scope.row)">分配座位</span>
            <el-divider direction="vertical"></el-divider>
            <span @click="appRecord(scope.row)">预约记录</span>
          </template>
        </el-table-column>
      </el-table>
      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total > 0">
        <el-pagination
          background
          :hide-on-single-page="false"
          layout="sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="currentPage"
          @current-change="(page) => getTableData(page, pageSize)"
          @size-change="
            (size) => {
              pageSize = size;
              getTableData(1, size);
            }
          "
        ></el-pagination>
      </div>
      <!---------------------------- 无数据 ---------------------------->
      <div class="nodata" v-if="total == 0">
        <img src="@/assets/img/nofind.png" alt />
        <p>暂无区间座位信息</p>
      </div>
    </div>
  </div>
</template>

<script>
import { queryOrderSections } from "@/api/manage/section";

export default {
  components: {
    assignDialog: () => import("./assignDialog.vue"),
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: "",
      row: {},
    };
  },

  methods: {
    // 获取座位列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          name: this.keyword,
        },
        orderBy: "level",
        sort: "asc", //asc
        page: page || 1,
        limit: pageSize || this.pageSize,
      };
      queryOrderSections(data)
        .then((res) => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
          this.currentPage = page;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },

    // 预约记录
    appRecord(row) {
      this.$router.push({
        path: `/daily-manage/preAssign/${row.id}`,
        query: { id: row.id, name: row.name },
      });
    },

    // 分配座位
    assignSeats(row) {
        this.$router.push({
        name: 'assignMap',
        query: {row},
      });
    },
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  },
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
  color: #999999 !important;
}
</style>
