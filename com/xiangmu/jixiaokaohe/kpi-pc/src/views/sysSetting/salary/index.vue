<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3>外挂工资管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入姓名或工号查询"
          size="small"
          clearable
          style="width:200px;"
          prefix-icon="el-icon-search"
          @clear="getTableData(1,pageSize)"
          @keyup.enter.native="getTableData(1,pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1,pageSize)"
        >查询</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" size="small" icon="el-icon-edit" @click="batchEdit">批量编辑</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%;margin-top:10px;"
        header-row-class-name="table-header"
        @selection-change="selectRows"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.username}}（{{scope.row.userid}}）</template>
        </el-table-column>
        <el-table-column
          prop="orgname"
          label="部门"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column prop="rylxm" label="人员类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="salary" label="外挂工资（元）" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit"
              v-model="scope.row.editSalary"
              size="small"
              :class="{'is-error': !scope.row.editSalary}"
              @keyup.native="moneyLimit($event, scope.row)"></el-input>
            <span v-else style="color:#606266;">{{common.moneyFormat(scope.row.salary)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <!--  非租赁人员 可以 设置外挂 -->
            <div v-if="!scope.row.id && scope.row.rylx !== '2024'">
              <!--------------------------- 快速设置 --------------------------->
              <el-popover
                popper-class="popover-dialog big-popover-dialog"
                placement="bottom-start"
                width="250"
                :visible-arrow="false"
                v-model="scope.row.visible"
              >
                <div>
                  <h3 class="popover-dialog-title">
                    设置外挂工资
                    <i class="el-icon-close" @click="scope.row.visible=false;"></i>
                  </h3>
                  <div class="popover-dialog-content">
                    <div class="edit-box">
                      <el-input
                        v-model="scope.row.editSalary"
                        size="small"
                        :class="{'is-error': !scope.row.editSalary}"
                        @keyup.native="moneyLimit($event, scope.row)"
                      ></el-input>
                    </div>
                  </div>
                  <div class="popover-dialog-footer">
                    <el-button type="primary" size="small" @click="editRow(scope.row,true)">确定</el-button>
                  </div>
                </div>
                <span slot="reference">设置外挂</span>
              </el-popover>
            </div>
            <!--  租赁人员 或已设置外挂的非租赁人员 可以 编辑 -->
            <div v-else>
              <div v-if="!scope.row.isEdit">
                <span @click="scope.row.isEdit = true">编辑</span>
                <span @click="openDrawer(scope.row)">操作记录</span>
              </div>
              <div v-else style="margin-right:65px;">
                <span @click.stop="editRow(scope.row,true)">保存</span>
                <span @click.stop="editRow(scope.row,false)">取消</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!---------------------------- 分页 ---------------------------->
      <div class="pagination-box" v-if="total > 0">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[5,10,15,20]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
    </div>
    <!-------------------------- 批量编辑弹窗 -------------------------->
    <batch-drawer ref="batchDrawer" @doFunc="getTableData(1,pageSize)"></batch-drawer>
    <!-------------------------- 操作记录弹窗 -------------------------->
    <record-drawer ref="recordDrawer"></record-drawer>
  </div>
</template>

<script>
import { fetchSalaryList, saveSalary } from "@/api/admin/salary.js";
import batchDrawer from "./batchDrawer";
import recordDrawer from "./recordDrawer";
export default {
  components: {
    batchDrawer,
    recordDrawer
  },
  data() {
    return {
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      selectData: []
    };
  },
  methods: {
    // 打开弹窗
    openDrawer(row) {
      let drawer = this.$refs.recordDrawer;
      drawer.title = `『 ${row.username}(${row.userid}) 』外挂工资操作记录`;
      drawer.id = row.id;
      drawer.drawer = true;
    },
    // 选中的行
    selectRows(rows) {
      this.selectData = rows;
    },

    // 批量编辑
    batchEdit() {
      if (this.selectData.length > 0) {
        let batchDrawer = this.$refs.batchDrawer;
        batchDrawer.tableData = _.cloneDeep(this.selectData);
        batchDrawer.drawer = true;
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择需要编辑的人员！"
        });
      }
    },

    // 限制金额输入（整数或两位小数）
    moneyLimit(e, row) {
      this.common.moneyInput(e);
      row.editSalary = e.target.value;
    },

    // 编辑 （保存、取消）
    editRow(row, isSave) {
      if (isSave) {
        if (!row.editSalary) {
          return false;
        } else if (row.salary == row.editSalary) {
          row.isEdit = false;
        } else {
          let params = [
            {
              id: row.id,
              userid: row.userid,
              username: row.username,
              salary: row.editSalary.toString().replace(/\.$/, "")
            }
          ];
          this.doSave(params);
        }
      } else {
        row.isEdit = false;
        row.editSalary = row.salary;
      }
    },

    // 保存
    doSave(params) {
      this.loading = true;
      saveSalary(params)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: `保存成功！`
            });
            this.getTableData();
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `保存失败：${res.data.message}`
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: `保存失败：${err}`
          });
        });
    },

    // 获取表格数据
    getTableData(page, pageSize) {
      this.loading = true;
      let param = {
        page: page || 1,
        limit: pageSize || this.pageSize,
        filter: {
          rylx: this.keyword ? null : "2024",
          keyword: this.keyword
        }
      };
      fetchSalaryList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.total = res.total;
            this.currentPage = page || 1;
            this.tableData.forEach(i => {
              this.$set(i, "isEdit", false);
              this.$set(i, "editSalary", i.salary);
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
}
</style>
<style>
.el-input.is-error .el-input__inner {
  border-color: #f56c6c;
}
</style>