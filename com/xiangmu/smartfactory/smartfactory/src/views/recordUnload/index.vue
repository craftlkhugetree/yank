<template>
  <div class="base-search-table">
    <!-- <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="tab in goodsList" :key="tab.id" :label="tab.name" :name="tab.id"></el-tab-pane>
    </el-tabs>-->
    <div class="search-box clearfix">
      <h3>卸车单录单</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          class="date-range"
        ></el-date-picker>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入关键词查询"
          size="small"
          clearable
          style="width: 160px; margin-right: 10px"
          @clear="getTableData(1, pageSize)"
          @keyup.enter.native="getTableData(1, pageSize)"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1, pageSize)"
        >
          查询
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openDrawer('add')">
          新增
        </el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      header-row-class-name="table-header"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="billNo" label="订单编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="consignee" label="客户名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="shipname" label="车牌号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="drivers" label="司机" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ driverName(scope.row.drivers) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="drivers" label="身份证" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ driverId(scope.row.drivers) }}
        </template>
      </el-table-column> -->
      <el-table-column prop="goodsName" label="物料名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.goodsName || '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="unloadDate" label="卸车时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.unloadDate || '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="卸车重量" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.quantity ? scope.row.quantity + 'KG' : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <span @click="openDrawer('edit', scope.row)" style="margin-right: 30px">编辑</span>
          <span @click="deleteRow(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="
          size => {
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
import { pageQueryUnload, deleteUnload } from '@/api/order';
import AddDrawer from './addDrawer';
import { mapState } from 'vuex';
export default {
  name: 'RecordUnload',
  components: {
    AddDrawer,
  },
  data() {
    return {
      keyword: null,
      value1: null,
      tableData: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sort: null,
      orderBy: null,
    };
  },
  computed: mapState({
    goodsList: state => state.goodsList,
    driverName: () => arr => {
      let name = '';
      arr &&
        arr.forEach((a, id) => {
          if (id === arr.length - 1) {
            name += a.name;
          } else {
            name += a.name + '、';
          }
        });
      return name || '--';
    },
    driverId: () => arr => {
      let name = '';
      arr &&
        arr.forEach((a, id) => {
          if (id === arr.length - 1) {
            name += a.idcard;
          } else {
            name += a.idcard + '，';
          }
        });
      return name || '--';
    },
  }),
  methods: {
    // 打开弹窗
    openDrawer(type, row) {
      let drawer = this.$refs.addDrawer;
      if (type == 'add') {
        drawer.title = '新增卸车单';
      } else {
        drawer.title = '编辑卸车单';
        drawer.editForm = Object.assign({}, row);
        drawer.value1 = new Date(row.unloadDate)
      }
      drawer.drawer = true;
      let timer = setInterval(() => {
        let iptLen = document.getElementById('mobile');
        if (iptLen) {
          console.log(iptLen.clientWidth);
          drawer.iptLen = iptLen.clientWidth + 2 + 'px';
          clearInterval(timer);
        }
      }, 500);
    },

    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除订单『 ${row.billNo} 』？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.loading = true;
          deleteUnload(row.id)
            .then(res => {
              this.loading = false;
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `删除成功！`,
                });
                this.getTableData();
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `删除失败：${res.msg}`,
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: `删除失败：${err}`,
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true;
      let param = {
        filter: {
          keyword: this.keyword || null,
        },
        limit: pageSize || this.pageSize,
        page: page || 1,
      };
      if (this.value1 && this.value1.length) {
        let start = (this.value1[0] && this.util.ymd(this.value1[0])) || '';
        let end = (this.value1[1] && this.util.ymd(this.value1[1])) || '';
        param.filter.startTime = start;
        param.filter.endTime = end;
      }
      pageQueryUnload(param)
        .then(res => {
          this.loading = false;
          if (res.code == '000000') {
            this.tableData = res.data || [];
            this.total = res.total;
            this.currentPage = page || 1;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
    if (!this.goodsList.length) {
      this.$store.dispatch('getGoodsList');
    }
  },
};
</script>

<style lang="scss" scoped>
.date-range {
  width: 300px;
  margin-right: 10px;
}
</style>
