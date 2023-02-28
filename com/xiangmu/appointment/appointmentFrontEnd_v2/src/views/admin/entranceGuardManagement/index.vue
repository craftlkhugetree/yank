<template>
  <div class="base-search-table">
    <div class="bg-white" v-loading="loading" style="padding:0 0 18px;">
      <div class="tab-content" v-loading="tableLoading">
        <!---------------------------- 有资源数据 ---------------------------->
        <div class="base-search-table">
          <div class="search-box clearfix flex-div" style="padding: 20px 10px 0;">
            <h2>门禁管理</h2>
            <!---------------------------- 查询条件 ---------------------------->
            <div class="search-box-right">
              <el-input
                class="input-box"
                v-model="keyword"
                placeholder="请输入门禁或资源"
                size="small"
                clearable
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
            </div>
          </div>
          <!---------------------------- 表格 ---------------------------->
          <el-table
            :data="tableData"
            style="width:100%"
            stripe
            header-row-class-name="table-header"
            v-loading="tableLoading"
            empty-text=" "
          >
            <!-- <el-table-column type="index" label="序号" width="55"></el-table-column> -->
            <el-table-column
              prop="accLevelId"
              label="门禁ID"
              show-overflow-tooltip
              align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="accLevelName"
              align="center"
              label="门禁名称"
              :formatter="common.defaultFormat"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="resName" label="关联资源" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="!scope.row.isEdit" class="ellipsis" style="display: inherit">
                  {{ scope.row.resName || '--' }}
                </div>
                <el-select
                  v-else
                  v-model="form.name"
                  filterable
                  remote
                  placeholder="请选择资源"
                  :remote-method="remoteMethod"
                  :loading="selectLoading"
                  @change="val => dataFilter(val, scope.row.id)"
                  style="width: 100%"
                  size="small"
                  clearable
                  @clear="clearForm"
                >
                  <el-option
                    v-for="item in jzgList"
                    :label="item.name"
                    :value="JSON.stringify({ id: item.id, name: item.name })"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <span v-show="!scope.row.isEdit" @click="edit(scope.row)" style="margin-right: 0">
                  编辑
                </span>
                <span v-show="scope.row.isEdit" @click="save(scope.row)">保存</span>
                <span v-show="scope.row.isEdit" @click="cancel(scope.row)">取消</span>
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
              :page-sizes="[5, 10, 15, 20]"
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
        </div>
        <!---------------------------- 没有资源数据 ---------------------------->
        <div class="nodata" v-if="total == 0 && !tableLoading">
          <p>暂无数据</p>
          <img src="@/assets/img/nodata.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apAccLevelPageQuery, apAccLevelSave } from '@/api/admin/entGuard';
import { fetchResList } from '@/api/admin/res';
export default {
  name: 'EntranceGuard',
  data() {
    return {
      loading: false,
      keyword: '',
      tableLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      form: { id: '', name: '' },
      selectLoading: false,
      jzgList: [],
    };
  },
  methods: {
    clearForm() {
      this.form = {};
      this.$set(this.form, 'id', '');
      this.$set(this.form, 'name', '');
      // console.log(this.form);
      // this.form.id = '';
      // this.form.name = '';
    },
    // 改变行编辑状态
    changeRowEdit(id, bool) {
      this.tableData.forEach(t => {
        if (id === t.accLevelId) {
          this.$set(t, 'isEdit', bool);
        } else {
          this.$set(t, 'isEdit', 0);
        }
      });
    },
    edit(row) {
      this.form.name = row.resName || '';
      this.form.id = row.resId || '';
      this.changeRowEdit(row.accLevelId, 1);
    },
    save(row) {
      const params = {
        accLevelId: row.accLevelId, //  (string, optional): 门禁id ,
        accLevelName: row.accLevelName, //  (string, optional): 门禁名称 ,
        resId: this.form.id, //  (string, optional): 资源id ,
        resName: this.form.name, //  (string, optional): 资源名称
      };
      apAccLevelSave(params).then(res => {
        if (res.success) {
          this.form = {};
          this.changeRowEdit(row.accLevelId, 0);
          this.getTableData(this.currentPage, this.pageSize);
        }
      });
    },
    cancel(row) {
      this.form = {};
      this.changeRowEdit(row.accLevelId, 0);
    },
    // 搜索过滤
    dataFilter(val, id) {
      // this.form.rowid = id;
      // this.form.id = val ? JSON.parse(val).id : '';
      // this.form.name = val ? JSON.parse(val).name : '';
      this.$set(this.form, 'rowid', id);
      this.$set(this.form, 'id', val ? JSON.parse(val).id : '');
      this.$set(this.form, 'name', val ? JSON.parse(val).name : '');
      // console.log(val, this.form);
    },
    // 搜索资源
    remoteMethod(query) {
      this.selectLoading = true;
      if (query !== '') {
        const params = {
          page: 1,
          filter: {
            name: query,
          },
        };
        fetchResList(params)
          .then(res => {
            this.selectLoading = false;
            if (res.success) {
              this.jzgList = res.data;
            }
          })
          .catch(err => {
            console.log(err);
            this.selectLoading = false;
            this.jzgList = [];
          });
      } else {
        this.selectLoading = false;
        this.jzgList = [];
      }
    },
    // 获取资源
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let data = {
        filter: {
          keyword: this.keyword,
        },
        page,
        limit: pageSize || this.pageSize,
      };
      apAccLevelPageQuery(data)
        .then(res => {
          this.tableLoading = false;
          this.tableData = res.data || [];
          this.total = res.total;
          this.currentPage = page;
          this.tableData.forEach(t => {
            this.$set(t, 'isEdit', 0);
          });
        })
        .catch(err => {
          console.log(err);
          this.tableLoading = false;
        });
    },
  },
  created() {
    this.getTableData(1);
  },
};
</script>

<style lang="scss" scoped>
.search-box-right {
  margin-left: auto;
  position: relative;
}
.tab-content {
  position: relative;
  min-height: 500px;
}
.nodata {
  width: 800px;
  margin: 100px auto;
  padding: 60px 0;
  text-align: center;
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
  border-radius: 5px;
  img {
    width: 100px;
    height: 100px;
  }
  p {
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    margin: 20px 0 10px;
  }
}
.flex-div {
  display: flex;
  align-items: center;
  h2 {
    width: 64px;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #3f4356;
    line-height: 22px;
  }
}
// /deep/ .el-table .el-select .el-select__caret.el-input__icon {
//   transform: translateX(-50%);
//   &::after {
//     content: '\e778';
//     // transform: rotateZ(180deg);
//     position: absolute;
//     left: 50%;
//   }
// }
/deep/ .el-table__empty-block {
  display: none;
}
</style>