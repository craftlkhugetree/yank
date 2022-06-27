<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding: 15px 20px 0;">
      <h3 style="width:80px;">餐厅管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right" style="max-width:100%;">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入餐厅名称"
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
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openDrawer('add')">新增</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%;margin-top:10px;"
        header-row-class-name="table-header"
        v-loading="loading"
        @sort-change="sortBy"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
        <el-table-column prop="name" label="餐厅名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shopers" label="餐厅管理员" show-overflow-tooltip min-width="200">
          <!-- <template
            slot-scope="scope"
          >{{scope.row.shopers.map(i => `${i.name}（${i.id})`).join("，") || "--"}}</template>-->
        </el-table-column>
        <el-table-column prop="skjfh" label="项目编号" show-overflow-tooltip :formatter="common.defaultFormat"></el-table-column>
        <el-table-column prop="jfbh" label="经费科目编号" show-overflow-tooltip :formatter="common.defaultFormat"></el-table-column>
        <el-table-column prop="shoptypenames" label="餐厅类别" show-overflow-tooltip :formatter="common.defaultFormat"></el-table-column>
        <el-table-column prop="companyname" label="所属企业" show-overflow-tooltip :formatter="common.defaultFormat"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <span @click="sortRow('up',scope.row)">上移</span>
            <span @click="sortRow('down',scope.row)">下移</span>
            <span @click="openDrawer('edit', scope.row)">编辑</span>
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
          :page-sizes="[5,10,15,20,50,100]"
          :current-page.sync="currentPage"
          @current-change="page => getTableData(page, pageSize)"
          @size-change="size => {pageSize = size; getTableData(1, size)}"
        ></el-pagination>
      </div>
    </div>
    <!---------------------------- 添加 ---------------------------->
    <add-drawer ref="addDrawer" @doFunc="getTableData(1,pageSize);"></add-drawer>
  </div>
</template>

<script>
import { fetchCafeList, deleteCafe, fetchCafeDetail, sortCafeUp, sortCafeDown } from "@/api/admin/cafe";
import { deleteRoleUser } from "@/api/admin/roles";
import addDrawer from "./addDrawer";
export default {
  components: {
    addDrawer
  },
  data() {
    return {
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      sort: null,
      orderBy: null
    };
  },
  methods: {
    // 新增、编辑
    openDrawer(type, row) {
      let drawer = this.$refs.addDrawer;
      if (type == "add") {
        drawer.title = `新增餐厅`;
      } else if (type == "edit") {
        drawer.title = `编辑餐厅『 ${row.name} 』`;
        drawer.editForm.id = row.id;
        drawer.editForm.name = row.name;
        drawer.editForm.skjfh = row.skjfh;
        drawer.editForm.jfbh = row.jfbh;
        drawer.editForm.shoptypes = row.shoptypes.map(i => i.id);
        drawer.editForm.companyid = row.companyid;
        fetchCafeDetail({
          id: row.id
        }).then(res => {
          if (res.success) {
            let data = res.data;
            drawer.editForm.users = data.shopers.map(
              i => `${i.shopername}(${i.shoperid})`
            );
            drawer.usersArr = data.shopers;
            drawer.initArr = data.shopers.map(i => i.shoperid);
          }
        });
      }
      drawer.drawer = true;
    },

    // 删除
    deleteRow(row) {
      this.$confirm(`确认要删除餐厅『 ${row.name} 』吗？`, "确认要删除吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          let param = {
            id: row.id
          };
          this.loading = true;
          // 获取详情
          fetchCafeDetail({
            id: row.id
          }).then(res => {
            if (res.success) {
              let shopers = res.data.shopers || [];
              // 删除餐厅
              deleteCafe(param)
                .then(res => {
                  this.loading = false;
                  if (res.success) {
                    // 删除餐厅管理员角色
                    this.deleteUserRole("20210729-3", shopers);
                    this.$message({
                      showClose: true,
                      type: "success",
                      message: "删除成功！"
                    });
                    this.getTableData(this.currentPage, this.pageSize);
                  } else {
                    this.$message({
                      showClose: true,
                      type: "error",
                      message: "删除失败：" + res.data.message
                    });
                  }
                })
                .catch(err => {
                  this.loading = false;
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: "删除失败：" + err
                  });
                });
            }
          });
        })
        .catch(() => {
          return;
        });
    },

    // 删除用户角色
    deleteUserRole(role, data) {
      let param = {
        data: JSON.stringify({
          ROLEID: role,
          USERID: data.map(i => i.shoperid)
        })
      };
      deleteRoleUser(param)
        .then(res => {
          if (!res.success) {
            this.$message({
              showClose: true,
              type: "error",
              message: "用户角色删除失败！"
            });
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            type: "error",
            message: "用户角色删除失败！"
          });
        });
    },

    // 排序-上移下移
    sortRow(type, row) {
      let func = type == "up" ? sortCafeUp : sortCafeDown;
      this.loading = true;
      func({
        id: row.id
      })
        .then(res => {
          this.loading = false;
          this.getTableData(this.currentPage, this.pageSize);
        })
        .catch(err => {
          this.loading = false;
        });
    },

    // 表格排序
    sortBy(obj) {
      this.orderBy = obj.prop;
      this.sort = obj.order == "ascending" ? "asc" : "desc";
      this.getTableData(this.currentPage, this.pageSize);
    },

    // 获取列表
    getTableData(page, pageSize) {
      this.loading = true;
      let param = {
        filter: {
          name: this.keyword || null
        },
        limit: pageSize,
        page: page || 1,
        sort: this.sort,
        orderBy: this.orderBy
      };
      fetchCafeList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.tableData.forEach(i => {
              i.shoptypenames = i.shoptypes.map(j => j.name).join("，");
            });
            this.tableData.sort((a,b) => {
              return a.level > b.level ? 1 : -1;
            })
            this.total = res.total;
            this.currentPage = page || 1;
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
.search-box {
  h3 {
    span {
      font-size: 14px;
      color: #999;
      margin-left: 5px;
      strong {
        color: #3f86f7;
        font-weight: 600;
      }
    }
  }
}
.tips {
  background: #fffbe6;
  border-radius: 2px;
  border: 1px solid #ffe58f;
  margin: 15px 20px;
  padding: 8px 15px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  i {
    color: #faad14;
    margin-right: 5px;
  }
}
</style>
<style lang="scss">
.select-no-wrap {
  .el-select__tags {
    display: inline-block;
    height: 24px;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>