<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>绩效考核文件管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入名称"
          size="small"
          clearable
          @clear="getTableData(1,pageSize)"
          @keyup.enter.native="getTableData(1,pageSize)"
          style=" margin-right:10px"
        ></el-input>

        <div style="display:inline-block;">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="getTableData(1,pageSize)"
          >查询</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button size="small" type="primary" icon="el-icon-upload2" @click="handleUpload">上传</el-button>
        </div>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <el-table
      :data="tableData"
      style="width:100%;"
      header-row-class-name="table-header"
      v-loading="tableLoading"
    >
      <el-table-column prop="username" label="序号" width="80">
        <template slot-scope="scope">
          <div>{{scope.$index+1}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文件名称" min-width="400" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="common.reviewFile(scope.row.fileid)" class="blue-text">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="发布时间" width="180">
        <template
          slot-scope="scope"
        >{{moment(scope.row.createtime, "YYYYMMDDhhmmss").format("YYYY-MM-DD HH:mm:ss")}}</template>
      </el-table-column>
      <el-table-column prop="isvisible" label="是否可见">
        <template slot-scope="scope">
          <div class="switch">
            <el-switch
              :width="54"
              :value="scope.row.isvisible"
              :active-value="1"
              :inactive-value="0"
              @change="v => changeSwitch(scope.row,v)"
            ></el-switch>
            <span class="on" v-if="scope.row.isvisible=='1'" @click="changeSwitch(scope.row,0)">开启</span>
            <span class="off" v-else @click="changeSwitch(scope.row,1)">关闭</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="140">
        <template slot-scope="scope">
          <span @click="doUp(scope.row)">
            <i class="el-icon-top"></i>上移
          </span>
          <span @click="doDown(scope.row)">
            <i class="el-icon-bottom"></i>下移
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="100">
        <template slot-scope="scope">
          <span @click="handleDelete(scope.row)">删除</span>
          <span @click="common.downloadFile(scope.row.fileid)">下载</span>
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
        :page-sizes="[10,20,50,100]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="size => {pageSize = size; getTableData(1, size)}"
      ></el-pagination>
    </div>
    <!---------------------------- 无数据 ---------------------------->
    <div class="nodata" v-if="total == 0">
      <!-- <img src="@/assets/img/nofind.png" alt /> -->
    </div>

    <!---------------------------- 新增文件弹窗 ---------------------------->
    <add-file-drawer ref="addFileDrawer" @doFunc="afterAdd"></add-file-drawer>
  </div>
</template>

<script>
import addFileDrawer from './addFileDrawer'
import { fetchFileList, deleteById, downFile, upFile, changeIsvisible } from '@/api/kpi/file'
export default {
  components: {
    addFileDrawer
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      keyword: ''
    }
  },

  computed: {},
  created() {
    this.getTableData(this.currentPage, this.pageSize)
  },
  methods: {
    handleUpload() {
      let addFile = this.$refs.addFileDrawer
      addFile.drawer = true
    },
    // 新增文件之后
    afterAdd() {
      this.$refs.addFileDrawer.drawer = false
      this.getTableData(1, this.pageSize)
    },
    // 开启/关闭
    changeSwitch(row, val) {
      this.tableLoading = true
      let msg = `${val == '1' ? '开启' : '关闭'}`
      console.log(row)
      changeIsvisible({
        id: row.id
      })
        .then(res => {
          this.tableLoading = false
          if (res.success) {
            this.$message({
              showClose: true,
              type: 'success',
              message: `${msg}成功`
            })
            this.getTableData(this.currentPage, this.pageSize)
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: `${msg}失败：` + res.data.message
            })
          }
        })
        .catch(err => {
          this.tableLoading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: `${msg}失败：` + err
          })
        })
    },

    doUp(row) {
      let param = {
        id: row.id
      }
      upFile(param).then(res => {
        if (res.success) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '上移成功'
          })
          this.getTableData(this.currentPage, this.pageSize)
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: '上移失败' + res.data.message
          })
        }
      })
    },

    doDown(row) {
      let param = {
        id: row.id
      }
      downFile(param).then(res => {
        if (res.success) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '下移成功'
          })
          this.getTableData(this.currentPage, this.pageSize)
        } else {
          this.$message({
            showClose: true,
            type: 'error',
            message: '下移失败' + res.data.message
          })
        }
      })
    },

    // 获取列表
    getTableData(page, pageSize) {
      this.tableLoading = true
      let data = {
        filter: {
          name: this.keyword
        },
        orderBy: 'level',
        sort: 'asc', //asc
        page: page || 1,
        limit: pageSize || this.pageSize
      }
      fetchFileList(data)
        .then(res => {
          this.tableLoading = false
          this.tableData = res.data || []
          this.total = res.total
          this.currentPage = page
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    handleDelete(row) {
      this.$confirm(`确认删除该文件吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            id: row.id
          }
          deleteById(param).then(res => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '文件删除成功'
              })
              this.getTableData()
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: '文件删除失败' + res.data.message
              })
            }
          })
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.graybtn {
  color: #d5d5d5 !important;
}
.search-box {
  h3 {
    line-height: 30px;
  }
}
.switch {
  display: inline-block;
  position: relative;
  width: 54px;
  height: 22px;
  line-height: 22px;
  margin-top: -2px;
  span {
    position: absolute;
    font-size: 12px;
    padding-top: 1px;
    top: 0;
    cursor: pointer;
    &.on {
      color: #ffffff !important;
      left: 6px;
    }
    &.off {
      color: #999 !important;
      right: 8px;
    }
  }
}
</style>