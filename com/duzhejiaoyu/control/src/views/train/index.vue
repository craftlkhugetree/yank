<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0">
      <h3 style="width: 120px">培训资料</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right" style="max-width: 100%">
        <el-select
          class="no-wrap"
          multiple
          v-model="type"
          size="small"
          placeholder="资料形式"
          clearable
          style="width: 120px"
          @change="getTableData(1, pageSize)"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          class="no-wrap"
          multiple
          v-model="module"
          size="small"
          placeholder="所属模块"
          clearable
          style="width: 120px"
          @change="getTableData(1, pageSize)"
        >
          <el-option v-for="item in moduleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          class="no-wrap"
          multiple
          v-model="campus"
          size="small"
          placeholder="所属校区"
          clearable
          style="width: 120px"
          @change="getTableData(1, pageSize)"
        >
          <el-option v-for="item in campusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select
          class="no-wrap"
          multiple
          v-model="userType"
          size="small"
          placeholder="用户类型"
          clearable
          style="width: 120px"
          @change="getTableData(1, pageSize)"
        >
          <el-option
            v-for="item in userTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入资料名称"
          size="small"
          clearable
          style="width: 160px"
          @clear="getTableData(1, pageSize)"
          @keyup.enter.native="getTableData(1, pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1, pageSize)"
        >查询</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="$router.push('/train/add')"
        >新增</el-button>
        <el-button type="primary" size="small" @click="setBatch">批量设置</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        header-row-class-name="table-header"
        v-loading="loading"
        @selection-change="selectRows"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="60" fixed></el-table-column>
        <el-table-column prop="name" label="资料名称" show-overflow-tooltip width="100" fixed></el-table-column>
        <el-table-column
          prop="type"
          label="资料形式"
          show-overflow-tooltip
          width="100"
          :formatter="(r,c,v,i) => common.learnTypeFormat(v)"
        ></el-table-column>
        <el-table-column
          prop="modelNames"
          label="所属模块"
          show-overflow-tooltip
          width="120"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="campusNames"
          label="所属校区"
          show-overflow-tooltip
          width="140"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="usertypeNames"
          label="用户类型"
          show-overflow-tooltip
          width="140"
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column prop="isDownload" label="下载开启" width="120">
          <template slot-scope="scope">{{scope.row.isDownload == "1" ? "是" : "否"}}</template>
        </el-table-column>
        <el-table-column prop="fileSize" label="资料大小" show-overflow-tooltip width="120">
          <template slot-scope="scope">
            <span class="status-tag pending" v-if="scope.row.formatStatus == '1'">转码中</span>
            <span class="status-tag error" v-if="scope.row.formatStatus == '3'">转码失败</span>
            <span
              v-if="scope.row.formatStatus == '2'"
              style="color: #606266"
            >{{common.learnSizeFormat(scope.row.fileSize)}}</span>
            <span v-else style="color: #606266">--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
          width="160"
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column prop="watchCount" label="浏览量" :formatter="common.defaultFormat"></el-table-column>
        <el-table-column label="排序" align="center" width="124" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.id">
              <span v-if="currentPage == 1 && scope.$index == 0" class="disabled">
                <i class="el-icon-top"></i>上移
              </span>
              <span v-else @click="move('up',scope.row)">
                <i class="el-icon-top"></i>上移
              </span>
              <span v-if="((currentPage-1) * pageSize) + scope.$index == total-1" class="disabled">
                <i class="el-icon-bottom"></i>下移
              </span>
              <span v-else @click="move('down',scope.row)">
                <i class="el-icon-bottom"></i>下移
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <span v-show="scope.row.formatStatus == '2' || scope.row.type == '3'" @click="toDetail(scope.row)">查看</span>
            <span @click="deleteRow(scope.row)">删除</span>
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
    </div>
    <!---------------------------- 批量设置弹窗 ---------------------------->
    <set-drawer ref="setDrawer" @doFunc="getTableData(currentPage,pageSize)"></set-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fetchLearnList, deleteLearn, upLearn, downLearn } from '@/api/train'
import SetDrawer from "./setDrawer.vue"
export default {
  components: {
      SetDrawer
  },
  data() {
    return {
      type: [],
      module: [],
      campus: [],
      userType: [],
      keyword: null,
      tableData: [],
      loading: false,
      selectArr: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null
    }
  },
  computed: mapState({
    typeList: state => state.trainTypeList,
    moduleList: state => state.moduleList,
    campusList: state => state.campusList,
    userTypeList: state => state.userTypeList
  }),
  methods: {
    // 查看
    toDetail(row) {
        this.$router.push(`/train/view/${row.type}/${row.id}`)
    },
    // 选中的行
    selectRows(rows) {
      this.selectArr = rows
    },
    // 批量设置
    setBatch() {
        if(this.selectArr.length == 0) {
            this.$message({
                showClose: true,
                type: "error",
                message: "请选择需要设置的培训资料！"
            })
            return
        }
        let drawer = this.$refs.setDrawer
        drawer.editForm.learnIds = this.selectArr.map(i => i.id)
        drawer.drawer = true 
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除培训资料『 ${row.name} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteLearn(row.id)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `删除成功！`
                })
                this.getTableData(0, this.pageSize)
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
      let fn = type == 'up' ? upLearn : downLearn
      let msg = type == 'up' ? '培训资料上移' : '培训资料下移'
      this.loading = true
      fn({ id: row.id })
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.getTableData(this.currentPage, this.pageSize)
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: `${msg}失败：${res.msg}`
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            message: `${msg}失败：${err}`
          })
        })
    },

    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        filter: {
          types: this.type.join(',') || null,
          modelIds: this.module.join(',') || null,
          campusIds: this.campus.join(',') || null,
          usertypeCodes: this.userType.join(',') || null,
          name: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      }
      fetchLearnList(param)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.tableData = res.data || []
            this.total = res.total
            this.currentPage = page || 1
            this.tableData.sort((a, b) => {
              return a.level > b.level ? 1 : -1
            })
            // 记录查询参数
            let params = {
              ...param.filter,
              limit: pageSize,
              page: page || 1
            }
            sessionStorage.setItem('trainParams', JSON.stringify(params))
          }
        })
        .catch(err => {
          this.loading = false
        })
    },

    // 初始化参数
    initParams() {
      let data = sessionStorage.getItem('trainParams')
      if (data) {
        let params = JSON.parse(data)
        let { types, moduleIds, campusIds, usertypeCodes, name, limit, page } = params
        this.type = types ? types.split(',') : []
        this.module = moduleIds ? moduleIds.split(',') : []
        this.campus = campusIds ? campusIds.split(',') : []
        this.userType = usertypeCodes ? usertypeCodes.split(',') : []
        this.keyword = name
        this.pageSize = limit
        this.currentPage = page
      }
    }
  },
  created() {
    this.initParams()
    this.getTableData(this.currentPage, this.pageSize)
    if (this.moduleList.length == 0) {
      this.$store.dispatch('getModuleList')
    }
    if (this.campusList.length == 0) {
      this.$store.dispatch('getCampusList')
    }
    if (this.userTypeList.length == 0) {
      this.$store.dispatch('getUserTypeList')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.search-box-right {
  .el-input,
  .el-select {
    margin-right: 5px !important;
  }
  .el-button {
    padding: 9px 10px;
  }
  .el-button + .el-button {
    margin-left: 5px !important;
  }
}
.el-table {
  .cell {
    span.disabled {
      color: rgba(0, 0, 0, 0.25);
      cursor: auto;
    }
    span.status-tag {
      &::before {
        display: inline-block;
        content: '';
        width: 8px;
        height: 8px;
        margin-right: 4px;
        border-radius: 6px;
        background: #dbdbdb;
      }
      &.pending {
        color: #faad14 !important;
        &::before {
          background: #faad14;
        }
      }
      &.error {
        color: #ff4d4f;
        &::before {
          background: #ff4d4f;
        }
      }
    }
  }
}
</style>