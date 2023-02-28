<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>业务领域</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-box-right">
        <el-input class="input-box" v-model="keyword" placeholder="请输入名称" size="small" clearable></el-input>
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
          @click="openDialog('add')"
        >新增</el-button>
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
        <el-table-column prop="name" label="业务领域" show-overflow-tooltip></el-table-column>
        <el-table-column prop="users" label="管理员" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.users.map(i => i.NAME).join(",")}}</template>
        </el-table-column>
        <el-table-column
          prop="questtypenames"
          label="问题分类"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="areanames"
          label="区域"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column label="排序" align="center" width="180">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="sort(scope.row,'up')" >
                <i class="el-icon-top"></i>上移
              </span>
              <span @click="sort(scope.row,'down')">
                <i class="el-icon-bottom"></i>下移
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="more-span">
              <span @click="openDialog('edit',scope.row)">编辑</span>
              <span @click="editRow(scope.row,'type')">问题分类</span>
              <span @click="editRow(scope.row,'area')">区域</span>
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
        @size-change="size => getTableData(currentPage, size)"
      ></el-pagination>
    </div>

    <!---------------------------- 业务领域弹窗 ---------------------------->
    <el-dialog
      class="base-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
      @close="cancelDialog"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" label-position="top">
        <el-form-item prop="name" label="业务领域">
          <el-input v-model="editForm.name" placeholder="请输入业务领域"></el-input>
        </el-form-item>
        <el-form-item prop="users" label="管理员">
          <el-select
            v-model="editForm.users"
            multiple
            filterable
            remote
            placeholder="请输入姓名或工号"
            :remote-method="remoteMethod"
            :loading="userloading"
            style="width:100%"
            value-key="ID"
          >
            <el-option
              v-for="item in userList"
              :key="item.ID"
              :label="item.NAME"
              :value="{ID:item.ID,NAME:item.NAME}"
            >
              <span>{{item.NAME + '--' + item.ID}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="saveData">提交</el-button>
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!---------------------------- 问题类型弹窗 ---------------------------->
    <questionTypeDrawer ref="typeDrawer" @doFunc="getTableData(currentPage,pageSize)"></questionTypeDrawer>
    <!---------------------------- 区域弹窗 ---------------------------->
    <areaDrawer ref="areaDrawer" @doFunc="getTableData(currentPage,pageSize)"></areaDrawer>
  </div>
</template>

<script>
import questionTypeDrawer from "./questionTypeDrawer";
import areaDrawer from "./areaDrawer";
export default {
  components: {
    questionTypeDrawer,
    areaDrawer
  },
  data() {
    return {
      keyword: null,
      tableData: [],
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      title: "新增业务领域",
      dialogVisible: false,
      editForm: {
        id: null,
        name: null,
        users: []
      },
      rules: {
        name: [{ required: true, message: "请输入业务领域", trigger: "change" }],
        users: [{ required: true, message: "请选择管理员", trigger: "change" }]
      },
      userloading: false,
      userList: [] // 用户列表
    };
  },
  methods: {
    // 打开业务领域弹窗
    openDialog(type, row) {
      if (type === "edit") {
        this.title = "编辑业务领域";
        this.editForm.id = row.id;
        this.editForm.name = row.name;
        this.editForm.users = row.users;
        this.userList = [].concat(this.editForm.users);
      }
      this.dialogVisible = true;
    },
    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        this.common
          .getUserList(1, query)
          .then(res => {
            this.userloading = false;
            this.userList = res.items;
          })
          .catch(err => {
            this.userloading = false;
            this.userList = [];
          });
      } else {
        this.userList = [];
      }
    },
    // 获取数据
    getTableData(page, pageSize) {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "dept/pageQuery",
          isRep: true,
          data: {
            filter: {
              name: this.keyword
            },
            limit: pageSize,
            page: page
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.tableData = res.data || [];
            // 转换数据
            this.tableData.forEach(i => {
              let arr = i.userinfos ? i.userinfos.split(",") : [];
              i.users = arr.map(j => {
                return {
                  ID: j.split("|")[0],
                  NAME: j.split("|")[1]
                };
              });
            });
            this.total = res.total || 0;
          }
          this.currentPage = page;
          this.pageSize = pageSize;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`是否确认删除该业务领域？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "dept/delete",
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
    // 排序
    sort(row, type) {
      this.loading = true;
      this.util.postAjax({
        code: this.global.code,
        url: `dept/${type}`,
        data: {
          id: row.id
        }
      }).then(res => {
        this.loading = false;
        if(res.success) {
          this.getTableData(this.currentPage, this.pageSize);
        }
      }).catch(err => {
        this.loading = false;
      });
    },
    // 编辑问题/区域类型
    editRow(row, type) {
      this.$refs[`${type}Drawer`].drawer = true;
      this.$refs[`${type}Drawer`].bussinessAreaId = row.id;
      this.$refs[`${type}Drawer`].getTableData(1, 10);
    },
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: null,
        name: null,
        users: []
      };
      this.title = "新增业务领域";
    },
    // 提交
    saveData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "dept/save",
              isRep: true,
              data: {
                id: this.editForm.id,
                name: this.editForm.name,
                userIds: this.editForm.users.map(i => i.ID),
                userNames: this.editForm.users.map(i => i.NAME)
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "提交成功！"
                });
                this.dialogVisible = false;
                this.getTableData(1, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "提交失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "提交失败：" + err
              });
            });
        }
      });
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style>
</style>