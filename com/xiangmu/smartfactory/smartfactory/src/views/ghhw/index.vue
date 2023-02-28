<template>
  <div class="base-search-table">
    <!-- <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in goodsList" :key="tab.id" :label="tab.name" :name="tab.id"></el-tab-pane>
    </el-tabs>-->
    <div class="search-box clearfix">
      <h3>罐号鹤位管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-select
          v-model="goodsId"
          size="small"
          placeholder="选择物料"
          clearable
          style="width: 120px"
          @change="getTableData(1, pageSize)"
        >
          <el-option v-for="item in goodsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入关键词查询"
          size="small"
          clearable
          style="width: 160px;margin-right:10px;"
          @clear="getTableData(1, pageSize)"
          @keyup.enter.native="getTableData(1, pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1, pageSize)"
        >查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openDrawer('add')">新增</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      header-row-class-name="table-header"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="鹤位" show-overflow-tooltip></el-table-column>
      <el-table-column prop="location" label="罐号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsName" label="装车物料" show-overflow-tooltip>
       <template slot-scope="scope"> 
         {{scope.row.goodsName || '--'}}
       </template>
      </el-table-column>
      <el-table-column prop="unloadGoodsName" label="卸车物料" show-overflow-tooltip>
       <template slot-scope="scope"> 
         {{scope.row.unloadGoodsName || '--'}}
       </template>
      </el-table-column>
      <el-table-column prop="isOpen" label="状态" width="120">
        <template slot-scope="scope">
          <div class="switch">
            <el-switch
              ref="switch"
              :width="54"
              :value="scope.row.isOpen"
              :active-value="1"
              :inactive-value="0"
              @change="val=>changeSwitch(scope.row,val)"
            ></el-switch>
            <span class="on" v-show="scope.row.isOpen==1" @click="changeSwitch(scope.row,false)">开启</span>
            <span class="off" v-show="scope.row.isOpen==0" @click="changeSwitch(scope.row,true)">关闭</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <span @click="openDrawer('edit',scope.row)" style="margin-right:30px;">编辑</span>
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
    <!------------------------- 新增弹窗 ------------------------->
    <add-drawer ref="addDrawer" @doFunc="getTableData"></add-drawer>
  </div>
</template>

<script>
import { fetchGhhwList, deleteGhhw, changeStatus } from '@/api/ghhw'
import AddDrawer from './addDrawer'
import { mapState } from 'vuex'
export default {
  components: {
    AddDrawer
  },
  data() {
    return {
      keyword: null,
      goodsId: null,
      tableData: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null
    }
  },
  computed: mapState({
      goodsList: state => state.goodsList,
  }),
  methods: {
    // 切换tab
    // handleClick(tab) {
    //   this.getTableData(1, this.pageSize)
    // },
    // 打开弹窗
    openDrawer(type,row) {
      let drawer = this.$refs.addDrawer
      if (type == 'add') {
        drawer.title = '新增罐号鹤位'
      } else {
        drawer.title = '编辑罐号鹤位'
        drawer.editForm = Object.assign({},row)
      }
      drawer.drawer = true
    },

    // 开启/关闭
    changeSwitch(row) {
      let msg = row.isOpen == 1 ? "关闭" : "开启"
      this.$confirm(`是否确认${msg}罐号鹤位『 ${row.name} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          changeStatus(row.name)
            .then(res => {
              this.loading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `${msg}成功！`
                })
                this.getTableData()
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
        })
        .catch(() => {
          return
        })
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除罐号鹤位『 ${row.name} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          deleteGhhw(row.name)
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
    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true
      let param = {
        filter: {
          goodsId: this.goodsId || null,
          keyword: this.keyword || null
        },
        limit: pageSize,
        page: page || 1
      }
      fetchGhhwList(param)
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.tableData = res.data || []
            this.total = res.total
            this.currentPage = page || 1
          }
        })
        .catch(err => {
          this.loading = false
        })
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize)
    if (this.goodsList.length == 0) {
      this.$store.dispatch('getGoodsList')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>