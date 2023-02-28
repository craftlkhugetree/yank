<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <!-- <h3>物品类型</h3> -->
      <span class="select-label">维修类型：</span>
      <el-select v-model="faulttype" placeholder="维修类型" size="small" style="width:160px;">
        <el-option
          v-for="item in repairTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入物品类型"
          size="small"
          clearable
          style="width:200px;"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getTableData(1,pageSize)"
        >查询</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="openDrawer('add')"
        >新增物品类型</el-button>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          plain
          style="margin-left:2px;padding:9px 10px;"
          @click="downloadTemp"
        >下载模板</el-button>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          plain
          style="margin-left:2px;padding:9px 10px;"
          @click="upload"
        >导入</el-button>
      </div>
    </div>
    <!---------------------------- 表格 ---------------------------->
    <div class="table-content">
      <el-table
        :data="tableData"
        style="width:100%"
        header-row-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="物品类型" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="childrens" label="物品名称" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.childrens.join(",") || "--"}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="openDrawer('edit',scope.row)">编辑</span>
              <span @click="openGoodsDrawer(scope.row)">物品管理</span>
              <span @click="deleteRow(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5,10,15,20]"
        :current-page.sync="currentPage"
        @current-change="page => getTableData(page, pageSize)"
        @size-change="size => {pageSize = size; getTableData(1, size)}"
      ></el-pagination>
    </div>
    <!---------------------------- 弹窗 ---------------------------->
    <el-drawer
      class="base-drawer"
      :title="drawerTitle"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      @close="closeDrawer"
      v-loading="drawerLoading"
      size="660"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        style="padding:30px;"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="维修类型" prop="faulttype">
          <el-select
            v-model="editForm.faulttype"
            placeholder="维修类型"
            size="small"
            style="width:300px;"
          >
            <el-option
              v-for="item in repairTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品类型" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入" size="small" style="width:300px;"></el-input>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
        <el-button size="small" @click="drawer = false">取消</el-button>
      </div>
    </el-drawer>
    <!---------------------------- 物品管理弹窗 ---------------------------->
    <goods-drawer ref="goodsDrawer" @doFunc="getTableData(currentPage,pageSize)"></goods-drawer>
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="xls|XLS|xlsx|XLSX"
      @done="uploaded"
      @choose="loading=true"
      :url="uploadUrl"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import GoodsDrawer from "./goodsDrawer"
import upload from "../../../components/BaseUpload";
export default {
  components: {
    GoodsDrawer,
    upload
  },
  data() {
    return {
      faulttype: "2",
      loading: false,
      keyword: null,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      drawer: false,
      drawerTitle: "",
      drawerLoading: false,
      editForm: {
        id: null,
        faulttype: null,
        name: null
      },
      rules: {
        faulttype: [
          { required: true, message: "请选择维修类型", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入物品类型", trigger: "change" }]
      },
      uploadUrl: window.g.url + "item/importData"
    };
  },
  computed: {
    // 维修类型列表
    repairTypeList() {
      return this.$store.state.repairTypeList;
    }
  },
  methods: {
    // 下载模板
    downloadTemp() {
      let url = `${window.g.url}item/exportTemplate`;
      window.open(url, "_blank");
    },
    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.loading = false;
      if (res.success) {
        this.$message({
          showClose: true,
          message: "导入成功！",
          type: "success"
        });
        this.getTableData();
      } else {
        this.$message({
          showClose: true,
          message: "导入失败！",
          type: "error"
        });
      }
    },

    // 打开弹窗
    openDrawer(type, row) {
      this.drawerTitle = type === "add" ? "新增物品类型" : `编辑-${row.name}`;
      if (row) {
        this.editForm.id = row.id;
        this.editForm.faulttype = row.faulttype;
        this.editForm.name = row.name;
      }
      this.drawer = true;
    },

    // 关闭弹窗
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        faulttype: null,
        name: null
      };
    },

    // 打开物品管理弹窗
    openGoodsDrawer(row) {
      let goodsDrawer = this.$refs.goodsDrawer;
      goodsDrawer.drawerTitle = `物品管理-${row.name}`;
      goodsDrawer.faulttype = this.faulttype;
      goodsDrawer.goodsTypeId = row.id;
      goodsDrawer.drawer = true;
      goodsDrawer.getTableData(1, 10);
    },

    // 提交
    doSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "item/save",
              isRep: true,
              data: {
                id: this.editForm.id,
                name: this.editForm.name,
                faulttype: this.faulttype,
                pid: "-1"
              }
            })
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `提交成功！`
                });
                this.drawer = false;
                this.getTableData(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `提交失败！` + res.data.message
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `提交失败！` + err
              });
            });
        }
      });
    },

    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除该物品类型？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "item/delete",
              data: {
                id: row.id
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getTableData(this.currentPage, this.pageSize);
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
    // 获取数据
    getTableData(page, pageSize) {
      this.loading = true;
      this.currentPage = page;
      this.util
        .postAjax({
          code: this.global.code,
          url: "item/pageQuery",
          isRep: true,
          data: {
            filter: {
              name: this.keyword,
              pid: "-1"
            },
            limit: pageSize || this.pageSize,
            page: page || 1
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            this.total = res.total || 0;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch(err => {
          this.loading = false;
          this.tableData = [];
          this.total = 0;
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
}
.select-label {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
}
</style>