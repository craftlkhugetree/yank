<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3>模块管理</h3>
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
        <el-table-column prop="name" label="模块名称" show-overflow-tooltip>
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
        <el-table-column label="排序" align="center" width="250">
          <template slot-scope="scope">
            <div v-if="scope.row.id">
              <span v-if="scope.$index == 0" class="disabled">
                <i class="el-icon-top"></i>上移
              </span>
              <span v-else @click="move('up',scope.row)">
                <i class="el-icon-top"></i>上移
              </span>
              <span v-if="scope.$index == total-1" class="disabled">
                <i class="el-icon-bottom"></i>下移
              </span>
              <span v-else @click="move('down',scope.row)">
                <i class="el-icon-bottom"></i>下移
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <div v-if="!scope.row.isEdit">
              <span @click="scope.row.isEdit = true">编辑</span>
              <span @click="deleteRow(scope.row)">删除</span>
            </div>
            <div v-else>
              <span @click.stop="editRow(scope.row,true)">保存</span>
              <span @click.stop="editRow(scope.row,false,scope.$index)">取消</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { saveModule, deleteModule, upModule, downModule } from '@/api/modules'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0
    }
  },
  methods: {
    // 新增
    addRow() {
      let obj = {
        id: null,
        name: null,
        editName: null,
        isEdit: true
      }
      this.tableData.push(obj)
    },

    // 编辑 （保存、取消）
    editRow(row, isSave, index) {
      if (isSave) {
        if (!row.editName) {
          return false
        } else if (row.name == row.editName) {
          row.isEdit = false
        } else {
          let params = {
            id: row.id,
            name: row.editName
          }
          this.doSave(params)
        }
      } else {
        row.isEdit = false
        row.editName = row.name
        if (!row.id) {
          this.tableData.splice(index, 1)
        }
      }
    },

    // 保存
    doSave(params) {
      this.loading = true
      saveModule(params)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: `保存成功！`
            })
            this.getTableData()
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: `保存失败：${res.msg}`
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: `保存失败：${err}`
          })
        })
    },

    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除模块『 ${row.name} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteModule(row.id)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `删除成功！`
                })
                this.getTableData()
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `删除失败：${res.msg}`
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: `删除失败：${err}`
              })
            })
        })
        .catch(() => {
          return
        })
    },

    // 上移下移
    move(type, row) {
      let fn = type == 'up' ? upModule : downModule
      let msg = type == "up" ? "模块上移" : "模块下移"
      console.log(fn,msg)
      this.loading = true
      fn({ id: row.id }).then(res => {
        this.loading = false
        if (res.code == '000000') {
          this.getTableData();
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: `${msg}失败：${res.msg}`
          })
        }
      }).catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: `${msg}失败：${err}`
          })
      })
    },

    // 获取表格数据
    getTableData() {
      this.loading = true
      this.$store
        .dispatch('getModuleList')
        .then(res => {
          this.loading = false
          this.tableData = res
          this.tableData.forEach(i => {
            this.$set(i, 'isEdit', false)
            this.$set(i, 'editName', i.name)
          })
          this.total = this.tableData.length
        })
        .catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '获取模块列表失败：' + err
          })
        })
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
  padding-bottom: 20px;
}
.el-table {
  .cell {
    span:not(:last-child) {
      margin-right: 40px !important;
    }
    span.disabled {
      color: rgba(0, 0, 0, 0.25);
      cursor: auto;
    }
  }
}
</style>
<style>
.el-input.is-error .el-input__inner {
  border-color: #f56c6c;
}
</style>