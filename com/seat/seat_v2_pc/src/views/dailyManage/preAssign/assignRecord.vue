<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>预约记录：{{ name }}</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-date-picker
          v-model="date"
          size="middle"
          placeholder="请选择日期"
          style="width: 175px; margin-right: 16px"
          clearable
          @change="getTableData(1, pageSize)"
        >
        </el-date-picker>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入学号或姓名"
          size="middle"
          clearable
          @clear="getTableData(1, pageSize)"
          @keyup.enter.native="getTableData(1, pageSize)"
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
        prop="orderdate"
        label="日期"
        show-overflow-tooltip
        width="200"
      >
        <template slot-scope="scope">
          {{ moment(scope.row.orderdate).format("YYYY-MM-DD") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="starttime, endtime"
        label="时间段"
        show-overflow-tooltip
        width="200"
      >
        <template slot-scope="scope">
          {{ insertStr(scope.row.starttime, 2, ":", checkTimeStr) }}-{{
            insertStr(scope.row.endtime, 2, ":", checkTimeStr)
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="seatname"
        label="座位号"
        width="100"
      ></el-table-column>
      <el-table-column prop="username, userid" label="预约人">
        <template slot-scope="scope">
          {{ scope.row.username }} ({{ scope.row.userid }})
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="210">
        <template slot-scope="scope">
          {{ moment(scope.row.createtime.slice(0, 8)).format("YYYY-MM-DD") }}
          {{
            insertStr(scope.row.createtime.slice(8, 12), 2, ":", checkTimeStr)
          }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <span @click="cancelAssign(scope.row)">取消预约</span>
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
</template>

<script>
import { adminOrderRecords, adminCancel } from "@/api/manage/order";
export default {
  props: {
    id: String,
    name: String,
  },
  data() {
    return {
      date: "",
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: "",
      status: null,
      flag: 1,
    };
  },

  computed: {
    beAbleToMove() {},
    statusList() {
      return this.$store.state.statusList;
    },
  },

  methods: {
    // 取消预约
    cancelAssign(row) {
      const h = this.$createElement;
      let _this = this;
      let t = document.getElementsByClassName("el-message-box__title");
      function cb() {
        let img = document.createElement("img");
        let timer = setInterval(() => {
          if (t && t.length > 0) {
            let last = t[0].lastChild;
            last.style = "vertical-align: middle";
            img.src = require("@/assets/img/gantan.png");
            img.style = "width: 18px; height: 18px; vertical-align: middle";
            t[0].insertBefore(img, last);
            clearInterval(timer);
            _this.flag = false;
          }
        }, 10);
        return null;
      }
      if (this.flag && !(t && t.length > 0)) {
        cb();
      }
      this.$confirm("", "确认要取消此条预约吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        message: h("p", null, [
          //   h("span", { style: "font: 20px bold" }, "确认要取消此条预约吗?\n"),
          h("span", null, `预约人：${row.username} (${row.userid})\n`),
          h("span", null, `${_this.name || ''} ${row.seatname}号座\n`),
          h(
            "span",
            null,
            `${this.moment(row.orderdate).format(
              "YYYY-MM-DD"
            )} ${this.insertStr(
              row.starttime,
              2,
              ":",
              this.checkTimeStr
            )}-${this.insertStr(row.endtime, 2, ":", this.checkTimeStr)}\n`
          ),
        ]),
      })
        .then(() => {
          adminCancel({ ids: row.id })
            .then((res) => {
              if (res && res.success) {
                this.$message({
                  type: "success",
                  message: "取消成功!",
                });
                this.getTableData(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  type: "warning",
                  message: "取消失败!",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "返回错误，未能取消。",
              });
            });
        })
        .catch(() => {});
    },
    // 字符串插入
    insertStr(source, start, newStr, callback) {
      let judge = callback && callback(source);
      if (judge) {
        return judge;
      }
      return source.slice(0, start) + newStr + source.slice(start);
    },
    checkTimeStr(source) {
      if (!source || source.length < 4) {
        return "00:00";
      }
      return 0;
    },
    // 获取座位列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          orderdate: this.date
            ? this.moment(this.date).format("YYYYMMDD")
            : null,
          keyword: this.keyword || null,
          sectionid: this.id,
          type: "1",
        },
        // orderBy: "level",
        sort: "asc", //asc
        page: page || 1,
        limit: pageSize || this.pageSize,
      };
      adminOrderRecords(data)
        .then((res) => {
          if (res && res.success) {
            this.tableData = res.data || [];
            this.total = res.total;
            this.currentPage = page;
            this.pageSize = pageSize;
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
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
</style>
