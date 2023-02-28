<template>
  <!----------------------------绩效发放 tab页 ---------------------------->
  <div class="base-tab" ref="baseTab" v-loading="loading">
    <p v-if="tabList.length == 0" style="padding: 60px 20px">暂无数据</p>
    <span class="header-box" v-show="activeTab == '1'">
      <el-button type="primary" size="small" @click="creatRecord"
        >生成汇总记录</el-button
      >
    </span>
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabList" :key="tab.id" :name="tab.id">
        <!---------------------------- 标签 ---------------------------->
        <span slot="label">{{ tab.name }}</span>
      </el-tab-pane>
    </el-tabs>
    <!---------------------------- 内容 ---------------------------->
    <div class="tab-content">
      <div class="base-search-table">
        <!---------------------------- 表格 ---------------------------->
        <el-table
          :data="tableData"
          style="width: 100%"
          header-row-class-name="table-header"
          v-loading="tableLoading"
          @selection-change="selectRows"
        >
          <el-table-column
            type="selection"
            width="55"
            v-if="activeTab == '1'"
          ></el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="title"
            label="绩效清单"
            show-overflow-tooltip
            width="300"
          ></el-table-column>
          <el-table-column
            prop="totalfee"
            label="发放总金额(元)"
          ></el-table-column>
          <el-table-column prop="orignal" label="来源">
            <template slot-scope="scope">
              <i>{{ getOrignal(scope.row) }}</i>
            </template>
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="时间"
            :formatter="common.timeFormat"
          ></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <span @click="lookDetail(scope.row, '0')">查看</span>
              <!-- <span v-show="activeTab=='1'" @click="downloadFile(scope.row)">下载</span> -->
              <span v-show="activeTab == '1'">
                <span @click="handleSend(scope.row)">确认发放</span>
                <span v-if="scope.row.grantstatus == '2'" class="gray-text"
                  >暂不发放</span
                >
                <el-popover
                  placement="bottom"
                  width="400"
                  trigger="click"
                  :visible-arrow="false"
                  v-else
                >
                  <div>
                    <h3 class="popover-dialog-title">暂不发放</h3>
                    <div class="popover-dialog-content">
                      <el-input
                        class="input-box"
                        v-model="reason"
                        placeholder="暂不发放原因"
                        size="small"
                        clearable
                      ></el-input>
                    </div>
                    <div class="popover-dialog-footer">
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleUnsend(scope.row)"
                        >保存</el-button
                      >
                    </div>
                  </div>
                  <span
                    :class="{ 'gray-text': scope.row.grantstatus == '2' }"
                    slot="reference"
                    >暂不发放</span
                  >
                </el-popover>

                <span
                  v-show="isEdit(scope.row)"
                  @click="editDetail(scope.row, '1')"
                  >编辑</span
                >
                <span
                  v-show="scope.row.orignal == 'collect'"
                  @click="handleCancel(scope.row)"
                  >取消汇总</span
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!---------------------------- 操作记录 ---------------------------->
    <operate-drawer ref="operateDrawer" @doFunc="doRefresh()"></operate-drawer>
  </div>
</template>
<script>
import {
  fetchList,
  sendCollect,
  unsendCollect,
  cancelCollect,
} from "@/api/kpi/collect";
import operateDrawer from "./operateDrawer";
export default {
  components: {
    operateDrawer,
  },
  data() {
    return {
      loading: false,
      activeTab: "1",
      tabList: [
        {
          id: "1",
          name: "未发放",
        },
        {
          id: "3",
          name: "已发放",
        },
      ],
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: "",
      year: "",
      reason: "",
      selectedRows: [],
    };
  },
  computed: {},
  created() {
    this.initParams();
    this.getTableData(this.currentPage, this.pageSize);
  },
  mounted() {},
  methods: {
    // 初始化参数
    initParams() {
      let params = sessionStorage.getItem("ActiveTabParams");
      let data = params ? JSON.parse(params) : {};
      this.activeTab = data.status || "1";
    },
    isEdit(row) {
      let flag = false;
      if (
        row.orignal == "system" ||
        (row.orignal == "kpi" && row.type == "3")
      ) {
        flag = true;
      }
      return flag;
    },

    creatRecord() {
      if (!this.selectedRows.length) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请先勾选要汇总的绩效清单！",
        });
        return false;
      }
      let operateDrawer = this.$refs.operateDrawer;
      operateDrawer.drawer = true;
      operateDrawer.tableData = this.selectedRows;
    },
    // 选择行
    selectRows(rows) {
      this.selectedRows = rows;
    },

    doRefresh(row) {
      this.getTableData();
    },
    // orignal：kpi，collect  发放汇总，system    系统生成
    // kpi   type 1，2 考核组录入  3发放录入
    getOrignal(row) {
      let str;
      if (row.orignal == "kpi") {
        str = ["1", "2"].includes(row.type) ? "考核组录入" : "发放录入";
      } else {
        str = row.orignal == "collect" ? "发放汇总" : "系统生成";
      }
      return str;
    },
    //编辑详情页
    editDetail(row, type) {
      if (row.orignal == "system") {
        //部门领导
        this.$router.push({
          path: `/release/system/${row.id}`,
          query: {
            isEdit: type,
            orignal: row.orignal,
          },
        });
      } else {
        if (row.type == "3") {
          //特殊发放
          this.$router.push({
            path: `/release/special/${row.id}`,
            query: {
              isEdit: type,
              orignal: row.orignal,
            },
          });
        }
      }
    },

    //查看 详情页
    lookDetail(row, type) {
      if (row.iscollect == "0") {
        if (row.orignal == "system") {
          //部门领导
          this.$router.push({
            path: `/release/system/${row.id}`,
            query: {
              isCheck: type,
              orignal: row.orignal,
            },
          });
        } else if (row.type == "3") {
          //特殊发放
          this.$router.push({
            path: `/release/special/${row.id}`,
            query: {
              isCheck: type,
              orignal: row.orignal,
            },
          });
        } else {
          //普通的未汇总的
          this.$router.push({
            path: `/release/uncollect/${row.id}`,
            query: {
              isCheck: type,
              orignal: row.orignal,
            },
          });
        }
      } else {
        this.$router.push({
          //已汇总的
          path: `/release/collected/${row.id}`,
          query: {
            isCheck: type,
            orignal: row.orignal,
          },
        });
      }
    },
    // 点击tab
    handleClick(tab, event) {
      this.activeTab = tab.name;
      // 记录参数
      let ActiveTabParams = {
        status: this.activeTab,
      };
      sessionStorage.setItem(
        "ActiveTabParams",
        JSON.stringify(ActiveTabParams)
      );
      this.getTableData();
    },
    //暂不发放
    handleUnsend(row) {
      let data = {
        id: row.id,
        orignal: row.orignal,
        reason: this.reason,
      };
      unsendCollect(data).then((res) => {
        if (res.success) {
          this.getTableData();
          this.$message({
            showClose: true,
            type: "success",
            message: "暂不发放成功！",
          });
          this.reason = "";
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: "暂不发放失败",
          });
        }
      });
    },

    //发放
    handleSend(row) {
      this.$confirm(`确认发放吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            id: row.id,
            orignal: row.orignal,
          };
          sendCollect(data).then((res) => {
            if (res.success) {
              this.getTableData();
              this.$message({
                showClose: true,
                type: "success",
                message: "发放成功！",
              });
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "发放失败",
              });
            }
          });
        })
        .catch((err) => {});
    },

    //取消汇总
    handleCancel(row) {
      let data = {
        id: row.id,
      };
      cancelCollect(data).then((res) => {
        if (res.success) {
          this.getTableData();
          this.$message({
            showClose: true,
            type: "success",
            message: "取消汇总成功！",
          });
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: "取消汇总失败",
          });
        }
      });
    },

    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        grantstatus: this.activeTab == "1" ? "1,2" : "3", // 发放状态：1未发放2暂不发放3已发放
      };
      fetchList(data)
        .then((res) => {
          this.tableLoading = false;
          let newData = res.data || [];
          newData.forEach((item) => {
            if (item.type == "3" || item.orignal == "collect") {
              item.title = item.name;
            } else {
              if (item.type == "2") {
                item.title = `『 ${item.groupname} 』${item.yeardate}年终绩效清单`;
              } else {
                item.title = `『 ${item.groupname} 』${item.yeardate}年${
                  item.monthdate && item.monthdate + "月"
                }绩效清单`;
              }
            }
          });
          // 按时间排序
          newData.sort((a, b) => {
            return a.createtime < b.createtime ? 1 : -1;
          });
          this.tableData = newData;

          this.total = res.total;
          this.currentPage = page;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 下载
    downloadFile(row) {
      let url = `${window.g.url}/collect/download`;
      let { id, orignal } = row;
      let query = `?id=${id}&orignal=${orignal}`;
      window.open(url + query, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-content {
  position: relative;
  min-height: 500px;
}
.search-box {
  .search-box-left {
    float: left;
  }
  label {
    color: #5f6464;
  }
  .tips {
    margin-left: 10px;
    color: rgba(0, 0, 0, 0.65);
  }
}
.search-box-right {
  & > div {
    display: inline-block;
  }
}
.header-box {
  position: absolute;
  z-index: 999;
  line-height: 48px;
  right: 20px;
  label {
    color: #5f6464;
    margin-right: 30px;
  }
  .iconrili:before {
    font-size: 32px;
    position: absolute;
    right: 65px;
    bottom: 6px;
    display: inline-block;
  }
  .all {
    position: absolute;
    right: 40px;
    bottom: 6px;
    display: inline-block;
    z-index: 998;
  }
}

//日历
.year /deep/.el-input__inner {
  border: none;
  padding-right: 0px;
  padding-left: 0px;
}
.year /deep/.el-input__icon {
  display: none;
}

span.gray-text {
  color: #dddddd !important;
}

.base-tab {
  // padding-bottom: 80px;
  margin-bottom: 80px !important;
}
</style>

<style>
.excel-btn {
  text-align: right;
  margin-right: 20px;
  margin-bottom: 15px;
}
</style>