<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>菜单管理</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入菜单名称查询"
          size="small"
          style="width: 190px"
          clearable
          @clear="filterData"
          @keyup.enter.native="filterData"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="filterData"
          >查询</el-button
        >
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openDrawer('add')"
          >新增</el-button
        >
        <el-button type="primary" size="small" plain @click="downloadTemp"
          >菜单导出</el-button
        >
        <el-button type="primary" size="small" plain @click="upload"
          >菜单导入</el-button
        >
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        ref="elTable"
        :data="tableData"
        style="width: 100%"
        header-row-class-name="table-header"
        v-loading="loading"
        row-key="id"
        :tree-props="{ children: 'children' }"
        @select="selectRow"
        @select-all="selectAll"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column
          prop="name"
          label="菜单名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="path"
          label="菜单url"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="icon"
          label="菜单icon"
          :formatter="common.defaultFormat"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="visible" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">{{
            scope.row.visible == "1" ? "启用" : "不启用"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="openDrawer('edit', scope.row)">编辑</span>
              <span @click="deleteRow(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!---------------------------- 新增 ---------------------------->
    <edit-drawer ref="editDrawer" @doFunc="getTableData"></edit-drawer>
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="xls|XLS|xlsx|XLSX"
      @done="uploaded"
      @choose="loading = true"
      :url="uploadUrl"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import EditDrawer from "./editDrawer";
import Upload from "@/components/BaseUpload";
import { fetchAllMenuList, deleteMenu } from "@/api/admin/menu.js";
export default {
  components: {
    EditDrawer,
    Upload,
  },
  data() {
    return {
      loading: false,
      keyword: null,
      allData: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      uploadUrl: window.g.adminUrl + "sys-menu/menuImport",
      selectedRows: [],
      isAllSelected: false
    };
  },
  methods: {
    // 打开弹窗
    openDrawer(type, row) {
      let editDrawer = this.$refs.editDrawer;
      if (type == "add") {
        editDrawer.title = "新增菜单";
      } else if (type == "edit") {
        editDrawer.title = "编辑菜单-" + row.name;
        editDrawer.editForm = {
          ...row,
        };
      }
      editDrawer.drawer = true;
    },

    // 选择改变时
    selectionChange(val) {
      this.selectedRows = val;
      if (val.length == 0) {
        this.isAllSelected = false;
      }
    },

    // 全选
    selectAll(selection) {
      this.toggleSelection(this.tableData, !this.isAllSelected);
      this.isAllSelected = !this.isAllSelected;
    },

    // 选择行
    selectRow(selection, row) {
      let selected = selection.some((i) => i.id == row.id);
      if (row.children) {
        this.toggleSelection(row.children, selected);
      }
    },

    // 切换选择（递归）
    toggleSelection(rowArr, select) {
      if (rowArr && rowArr.length > 0) {
        this.$nextTick(() => {
          let table = this.$refs.elTable;
          rowArr.forEach((i) => {
            table.toggleRowSelection(i, select);
            if (i.children && i.children.length > 0) {
              this.toggleSelection(i.children, select);
            }
          });
        });
      }
    },

    // 菜单导出
    downloadTemp() {
      let params = this.selectedRows.map((i) => i.id);
      if (params.length > 0) {
        this.util.exportFile(
          "sys-menu/menuExport",
          false,
          params,
          "菜单导出",
          "xlsx"
        );
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择需要导出的菜单！",
        });
      }
    },

    // 上传
    upload() {
      this.$refs.upload.toupload();
    },

    // 上传完成
    uploaded(res) {
      this.loading = false;
      if (res.code == "000000") {
        this.$message({
          showClose: true,
          message: "导入成功！",
          type: "success",
        });
        this.getTableData();
      } else {
        this.$message({
          showClose: true,
          message: "导入失败！",
          type: "error",
        });
      }
    },

    // 设置ParentIds
    setParentIds(arr, parentIds) {
      let ids = parentIds || [];
      arr.forEach((i) => {
        i.parentIds = i.parentId ? ids.concat([i.parentId]) : i.parentIds;
        if (i.children && i.children.length > 0) {
          this.setParentIds(i.children, i.parentIds);
        }
      });
    },

    // 获取账号列表
    getTableData() {
      this.loading = true;
      let param = {};
      fetchAllMenuList(param)
        .then((res) => {
          if (res.code == "000000") {
            this.loading = false;
            this.allData = res.data || [];
            // 设置每个节点的parentId
            this.setParentIds(this.allData);
            // 给第一级节点 添加 该节点及其子节点的所有名称
            this.allData.forEach((i) => {
              let children = i.children || [];
              i.nameArr = this.getNodeNames(children, [i.name]);
            });
            this.filterData();
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    // 获取当前节点及其子节点的名称
    getNodeNames(arr, nameArr) {
      arr.forEach((i) => {
        nameArr.push(i.name);
        if (i.children && i.children.length > 0) {
          this.getNodeNames(i.children, nameArr);
        }
      });
      return nameArr.join(",");
    },

    // 过滤数据
    filterData() {
      if (this.keyword) {
        this.tableData = this.allData.filter((i) =>
          i.nameArr.includes(this.keyword)
        );
      } else {
        this.tableData = this.allData;
      }
    },

    // 删除
    deleteRow(row) {
      if (!row.children || row.children.length == 0) {
        this.$confirm(`是否确认删除账号『 ${row.name} 』？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.loading = true;
            deleteMenu(row.id)
              .then((res) => {
                this.loading = false;
                if (res.code == "000000") {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: `删除成功！`,
                  });
                  this.getTableData();
                } else {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: `删除失败：${res.msg}`,
                  });
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${err}`,
                });
              });
          })
          .catch(() => {
            return;
          });
      } else {
        this.$confirm("该菜单包含子菜单，不可删除。", "菜单不能删除", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning",
        });
      }
    },
  },
  created() {
    this.getTableData();
  },
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: 800px;
}
</style>