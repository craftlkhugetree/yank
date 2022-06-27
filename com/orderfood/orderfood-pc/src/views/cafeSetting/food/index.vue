<template>
  <div class="food">
    <p v-if="!shopid">您暂无管理的餐厅</p>
    <!---------------------------- 分类列表 -------------------------->
    <div class="left-box" v-if="shopid">
      <div class="title">
        <h3>分类列表</h3>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addType">新增</el-button>
      </div>
      <div class="list" v-loading="loading">
        <ul>
          <li
            :class="{'active': item.id == activeTypeId}"
            v-for="(item,index) in typeList"
            :key="item.id"
            @click="clickType(item.id)"
          >
            <div v-if="!item.isEdit">
              <span>{{item.name}}</span>
              {{item.itemnum}}
              <div class="icon-btns" v-if="item.id !== 'all'">
                <i class="iconfont icon-edit" @click.stop="item.isEdit=true;"></i>
                <i class="el-icon-close" @click.stop="deleteType(item)"></i>
              </div>
              <div class="note">
                <!-- <p
                  v-if="item.preparetime"
                >备餐时间：{{item.preparetime}} {{common.unitFormat(item.prepareunit)}}</p> -->
                <p>{{item.note}}</p>
              </div>
            </div>
            <div v-else>
              <el-input
                v-model="item.editName"
                size="small"
                style="width:94%;margin-bottom:10px;"
                placeholder="请输入分类名称"
                :class="{'is-error': !item.editName}"
              >
                <!-- <i slot="suffix" class="el-input__icon el-icon-check" @click.stop="saveType(item)"></i> -->
              </el-input>
              <!-- <el-input
                v-model="item.editPreparetime"
                size="small"
                placeholder="请输入备餐时间"
                style="width:94%;margin-bottom:10px;"
                :class="{'is-error': !/^[1-9][0-9]*$/.test(item.editPreparetime)}"
              >
                <el-select v-model="item.editPrepareunit" slot="append">
                  <el-option label="分钟" value="minute"></el-option>
                  <el-option label="小时" value="hour"></el-option>
                  <el-option label="天" value="day"></el-option>
                </el-select>
              </el-input> -->
              <el-input
                v-model="item.editNote"
                size="small"
                type="textarea"
                placeholder="请输入分类说明"
                style="width:94%;"
                resize="none"
              ></el-input>
              <div class="btns">
                <i
                  class="el-icon-top"
                  style="width:28%"
                  v-show="item.id"
                  @click.stop="sortType(item,'up')"
                >上移</i>
                <i
                  class="el-icon-bottom"
                  style="width:28%"
                  v-show="item.id"
                  @click.stop="sortType(item,'down')"
                >下移</i>
                <div class="clearfix" style="float:right;width:44%;">
                  <i class="el-icon-closew" style="width:50%" @click.stop="saveType(item,index)">确定</i>
                  <i
                    class="el-icon-closew"
                    style="width:50%"
                    @click.stop="cancelEdit(item,index)"
                  >取消</i>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!---------------------------- 菜品表格 -------------------------->
    <div class="right-box" v-if="shopid">
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id">
          <span slot="label">{{tab.name}} {{tab.num}}</span>
        </el-tab-pane>
      </el-tabs>
      <div class="tab-content">
        <div class="base-search-table">
          <div class="search-box clearfix" style="padding:0 20px 10px;">
            <!---------------------------- 查询条件 ---------------------------->
            <div class="search-box-right">
              <el-input
                class="input-box"
                v-model="keyword"
                placeholder="请输入菜品名称"
                size="small"
                clearable
                style="width:170px;"
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
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="openDrawer('add')"
              >新增</el-button>
            </div>
          </div>
          <!---------------------------- 表格 ---------------------------->
          <el-table
            :data="tableData"
            style="width:100%"
            header-row-class-name="table-header"
            v-loading="tableLoading"
          >
            <el-table-column type="index" label="序号" show-overflow-tooltip width="80"></el-table-column>
            <el-table-column prop="name" label="菜品名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <img
                  v-if="!scope.row.photo || scope.row.photo == -1"
                  src="@/assets/img/nodata.png"
                  alt
                />
                <img v-else :src="scope.row.url" alt />
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column prop="shopitemtypename" label="分类" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column
              prop="note"
              label="描述"
              show-overflow-tooltip
              :formatter="common.defaultFormat"
            ></el-table-column>
            <el-table-column prop="price" label="价格（元)" show-overflow-tooltip width="100">
              <template slot-scope="scope">
                <span class="bold" v-if="scope.row.promotionprice">
                  {{common.moneyFormat(scope.row.promotionprice)}}
                  <span class="delete">{{common.moneyFormat(scope.row.price)}}</span>
                </span>
                <span class="bold" v-else>{{common.moneyFormat(scope.row.price)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240">
              <template slot-scope="scope">
                <span @click="sort('up',scope.row)">上移</span>
                <span @click="sort('down',scope.row)">下移</span>
                <span @click="openDrawer('edit',scope.row)">编辑</span>
                <span @click="deleteRow(scope.row)">删除</span>
                <span @click="changeRow(scope.row)">{{activeTab=="1" ? "下架" : "恢复上架"}}</span>
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
              :page-sizes="[5,10,15,20,50,100]"
              :current-page.sync="currentPage"
              @current-change="page => getTableData(page, pageSize)"
              @size-change="size => {pageSize = size; getTableData(1, size)}"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!---------------------------- 新增菜品 -------------------------->
    <add-drawer ref="addDrawer" @doFunc="getTypeList"></add-drawer>
  </div>
</template>

<script>
import addDrawer from "./addDrawer";
import { fetchMyCafe } from "@/api/admin/cafe";
import {
  fetchTypeList,
  fetchTypeNums,
  saveType,
  deleteType,
  sortTypeUp,
  sortTypeDown,
  fetchFoodList,
  deleteFood,
  changeFoodStatus,
  sortFoodUp,
  sortFoodDown
} from "@/api/admin/food";
export default {
  components: {
    addDrawer
  },
  data() {
    return {
      shopid: null,
      loading: false,
      activeTypeId: null,
      typeList: [],
      activeTab: "1",
      tabs: [
        {
          id: "1",
          name: "在售",
          num: 0
        },
        {
          id: "2",
          name: "已下架",
          num: 0
        }
      ],
      tableLoading: false,
      keyword: null,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  methods: {
    // 点击分类
    clickType(id) {
      this.activeTypeId = id;
      this.setTabNum("1");
      this.setTabNum("2");
      this.getTableData(1, this.pageSize);
    },
    // 添加分类
    addType() {
      this.typeList.push({
        id: null,
        name: null,
        editName: null,
        // preparetime: 30,
        // editPreparetime: 30,
        // prepareunit: "minute",
        // editPrepareunit: "minute",
        note: null,
        editNote: null,
        isEdit: true
      });
    },
    // 取消修改
    cancelEdit(item, index) {
      item.isEdit = false;
      item.editName = item.name;
      if (!item.editName) {
        this.typeList.splice(index, 1);
      }
    },
    // 删除分类
    deleteType(item) {
      this.$confirm(`是否确认删除分类『 ${item.name} 』？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          let data = {
            id: item.id
          };
          deleteType(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getTypeList();
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
    // 保存分类
    saveType(item) {
      // if (item.editName && item.editPreparetime) {
      if (item.editName) {
        if (
          item.editName == item.name &&
          // item.editPreparetime == item.preparetime &&
          // item.editPrepareunit == item.prepareunit &&
          item.editNote == item.note
        ) {
          item.isEdit = false;
        } else {
          let param = {
            id: item.id,
            name: item.editName,
            // preparetime: item.editPreparetime,
            // prepareunit: item.editPrepareunit,
            note: item.editNote,
            shopid: this.shopid
          };
          this.loading = true;
          saveType(param)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `保存成功！`
                });
                this.getTypeList();
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
                message: `删除失败：${err}`
              });
            });
        }
      }
    },
    // 排序
    sortType(item, type) {
      let msg = type == "up" ? "上移" : "下移";
      let func = type == "up" ? sortTypeUp : sortTypeDown;
      let param = {
        id: item.id
      };
      func(param)
        .then(res => {
          if (res.success) {
            this.getTypeList();
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `${msg}失败：${res.data.message}`
            });
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            type: "error",
            message: `${msg}失败：${err}`
          });
        });
    },
    // 获取分类列表
    getTypeList() {
      this.loading = true;
      let param = {
        shopid: this.shopid
      };
      fetchTypeList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || [];
            this.$store.commit("setTypeList", data);
            data.forEach(i => {
              this.$set(i, "isEdit", false);
              this.$set(i, "editName", i.name);
              // this.$set(i, "editPreparetime", i.preparetime);
              this.$set(i, "editNote", i.note);
              // this.$set(i, "editPrepareunit", i.prepareunit);
            });
            data.sort((a, b) => {
              return a.level > b.level ? 1 : -1;
            });
            // this.typeList = arr.concat(data);
            this.typeList = data;
            this.activeTypeId = this.activeTypeId || data[0].id;
            this.clickType(this.activeTypeId);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 获取我的餐厅
    getMyCafe() {
      fetchMyCafe().then(res => {
        if (res.success) {
          let data = res.data[0] || {};
          this.shopid = data.id;
          this.getTypeList();
        }
      });
    },

    // 获取菜品列表
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let param = {
        filter: {
          name: this.keyword || null,
          shopid: this.shopid,
          shopitemtypeid: this.activeTypeId,
          status: this.activeTab
        },
        limit: pageSize,
        page: page || 1,
        sort: this.sort,
        orderBy: this.orderBy
      };
      fetchFoodList(param)
        .then(res => {
          this.tableLoading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.tableData.forEach(i => {
              i.url = i.photo
                ? window.g.viewUrl + i.photo
                : "@/assets/img/nodata.png";
            });
            this.total = res.total;
            this.currentPage = page || 1;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 设置数量
    setTabNum(status) {
      let param = {
        filter: {
          shopid: this.shopid,
          shopitemtypeid: this.activeTypeId,
          status
        },
        limit: 5,
        page: 1
      };
      fetchFoodList(param).then(res => {
        if (res.success) {
          let index = status == "1" ? 0 : 1;
          this.tabs[index].num = res.total;
        }
      });
    },
    // 删除菜品
    deleteRow(row) {
      this.$confirm(`是否确认删除菜品『 ${row.name} 』？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableLoading = true;
          let data = {
            id: row.id
          };
          deleteFood(data)
            .then(res => {
              this.tableLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getTypeList();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.tableLoading = false;
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
    // 排序
    sort(type, row) {
      let func = type == "up" ? sortFoodUp : sortFoodDown;
      func({
        id: row.id
      }).then(res => {
        this.$message({
          showClose: true,
          type: "success",
          message: `排序成功`
        });
        this.getTableData(this.currentPage, this.pageSize);
      });
    },
    // 上下架菜品
    changeRow(row) {
      let msg = this.activeTab == "1" ? "下架" : "恢复上架";
      let status = this.activeTab == "1" ? "2" : "1";
      let param = {
        id: row.id,
        status
      };
      this.tableLoading = true;
      changeFoodStatus(param)
        .then(res => {
          this.tableLoading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: `${msg}成功`
            });
            this.setTabNum("1");
            this.setTabNum("2");
            this.getTableData(this.currentPage, this.pageSize);
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `${msg}失败：${res.data.message}`
            });
          }
        })
        .catch(err => {
          this.tableLoading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: `${msg}失败：${err}`
          });
        });
    },
    // 点击tab
    handleClick(tab) {
      this.getTableData(1, this.pageSize);
    },
    // 新增/编辑菜品
    openDrawer(type, item) {
      let drawer = this.$refs.addDrawer;
      drawer.editForm.shopid = this.shopid;
      if (type == "add") {
        drawer.title = "新增菜品";
        drawer.editForm.shopitemtypeid = this.activeTypeId;
      } else {
        drawer.title = `编辑菜品『 ${item.name} 』`;
        // drawer.editForm = {
        //   id: item.id,
        //   photo: item.photo,
        //   name: item.name,
        //   shopitemtypeid: item.shopitemtypeid,
        //   price: item.price,
        //   note: item.note,
        //   promotionprice: item.promotionprice
        // };
        drawer.editForm = Object.assign({},item);
        drawer.status = item.status;
      }
      drawer.drawer = true;
    }
  },
  created() {
    this.getMyCafe();
  }
};
</script>

<style lang="scss" scoped>
.food {
  width: 100%;
  height: 100%;
  overflow: hidden;
  & > p {
    padding: 30px;
  }
  .left-box,
  .right-box {
    height: 100%;
    float: left;
    overflow: hidden;
  }
  .left-box {
    width: 200px;
    border-right: 1px solid #dbdbdb;
  }
  .title {
    border-bottom: 2px solid #e4e7ed;
    h3 {
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      color: #373b4b;
      line-height: 22px;
      padding: 16px 0 10px 20px;
    }
    .el-button {
      float: right;
      margin: 10px 10px 0 0;
    }
  }
  .list {
    height: calc(100% - 50px);
    overflow-y: auto;
    li {
      color: #6e7384;
      font-size: 14px;
      line-height: 20px;
      padding: 15px 0 15px 20px;
      cursor: pointer;
    }
    .active {
      background: #f5f6fd;
      span {
        color: #3f86f7;
        font-weight: 600;
      }
    }
    .icon-btns {
      float: right;
      // display: none;
      i {
        color: #999999;
        font-size: 14px;
        font-weight: 600;
        margin-right: 10px;
      }
    }
    li:hover {
      .icon-btns {
        display: block;
      }
    }
    .el-icon-check {
      color: #3f86f7;
      font-weight: 500;
    }
    .btns {
      margin: 15px 0 0 -20px;
      i {
        display: inline-block;
        color: #1890ff;
        text-align: center;
      }
    }
    .note {
      margin-top: 10px;
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
    }
  }
  .right-box {
    width: calc(100% - 200px);
  }
}
.tab-content {
  margin-top: -10px;
  padding: 0 10px 20px;
  height: calc(100% - 50px);
  overflow-y: auto;
}
.el-table {
  img {
    height: 45px;
    width: auto;
    vertical-align: middle;
    margin-right: 10px;
  }
  .bold {
    font-weight: 600;
  }
}
.delete {
  text-decoration: line-through;
  color: #999999 !important;
  font-weight: 400;
}
</style>
<style lang="scss">
.list {
  .el-input__inner {
    padding: 0 5px;
  }
  .el-textarea__inner {
    padding: 5px;
  }
  .el-input-group__append {
    width: 54px;
    .el-input__icon {
      width: 15px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
  }
}
</style>