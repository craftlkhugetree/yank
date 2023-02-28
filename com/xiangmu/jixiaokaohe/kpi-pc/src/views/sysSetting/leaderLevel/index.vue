<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3>领导岗位级别管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addRow">新增</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%;margin-top:10px;"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" show-overflow-tooltip width="80"></el-table-column>
        <el-table-column prop="name" label="领导岗位级别" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit"
              v-model="scope.row.editName"
              size="small"
              :class="{'is-error': !scope.row.editName}"
            ></el-input>
            <span v-else style="color:#606266;">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="领导岗位津贴（元）" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit"
              v-model="scope.row.editAllowance"
              size="small"
              :class="{'is-error': !scope.row.editAllowance}"
              @keyup.native="moneyLimit($event, scope.row)"
            ></el-input>
            <span v-else style="color:#606266;">{{common.moneyFormat(scope.row.allowance)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <div v-if="!scope.row.isEdit">
              <span @click="scope.row.isEdit = true">编辑</span>
              <span @click="deleteRow(scope.row)">删除</span>
              <span @click="openDrawer(scope.row)">操作记录</span>
            </div>
            <div v-else style="margin-right:65px;">
              <span @click.stop="editRow(scope.row,true)">保存</span>
              <span @click.stop="editRow(scope.row,false,scope.$index)">取消</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-------------------------- 操作记录弹窗 -------------------------->
    <record-drawer ref="recordDrawer"></record-drawer>
  </div>
</template>

<script>
import {
  fetchLevelList,
  saveLevel,
  deleteLevel
} from "@/api/admin/leaderLevel.js";
import recordDrawer from "./recordDrawer";
export default {
  components: {
    recordDrawer
  },
  data() {
    return {
      loading: false,
      tableData: []
    };
  },
  methods: {
    // 打开弹窗
    openDrawer(row) {
      let drawer = this.$refs.recordDrawer;
      drawer.title = `『 ${row.name} 』领导岗位津贴操作记录`;
      drawer.levelId = row.id;
      drawer.drawer = true;
    },

    // 新增
    addRow() {
      let obj = {
        id: null,
        name: null,
        money: null,
        editName: null,
        editMoney: null,
        isEdit: true
      };
      this.tableData.push(obj);
    },

    // 限制金额输入（整数或两位小数）
    moneyLimit(e, row) {
      this.common.moneyInput(e);
      row.editAllowance = e.target.value;
    }, 

    // 编辑 （保存、取消）
    editRow(row, isSave, index) {
      if (isSave) {
        if (!row.editName || !row.editAllowance) {
          return false;
        } else if (row.name == row.editName && row.allowance == row.editAllowance) {
          row.isEdit = false;
        } else {
          let params = {
            id: row.id,
            name: row.editName,
            allowance: row.editAllowance.toString().replace(/\.$/, "")
          };
          this.doSave(params);
        }
      } else {
        row.isEdit = false;
        row.editName = row.name;
        row.editAllowance = row.allowance;
        if (!row.id) {
          this.tableData.splice(index, 1);
        }
      }
    },

    // 保存
    doSave(params) {
      this.loading = true;
      saveLevel(params)
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

    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除领导岗位级别『 ${row.name} 』？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            id: row.id
          };
          deleteLevel(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getTableData();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `删除失败：${err}`
              });
            });
        })
        .catch(() => {
          return;
        });
    },

    // 获取表格数据
    getTableData() {
      this.loading = true;
      fetchLevelList()
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.$store.commit("setLevelList", this.tableData);
            this.tableData.forEach(i => {
              this.$set(i, "isEdit", false);
              this.$set(i, "editName", i.name);
              this.$set(i, "editAllowance", i.allowance);
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getTableData();
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