<template>
  <div v-loading="loading" class="common-content">
    <!-- <div class="resource-title">全部资源类型</div>

      <div class="resource-list-box" v-loading="loading">
        <div class="resource-item" v-for="item in resTypeList" :key="item.id">
          <div class="top">
            <span class="name ellipsis">{{item.name}}</span>
            <div class="my-button blue round" style="float: right" @click="goResInfo(item.id)">资源管理</div>
          </div>
          <div class="middle">
            <div class="left">
              <img style="width: 32px;height: 32px;margin-bottom: 5px" src="../../../../static/images/bm-resource-price.png" alt="">
              <div style="color: #383A48">单价</div>
            </div>
            <div class="right">
                <div>计费周期:&nbsp;&nbsp;&nbsp; {{item.chargecyclename}}</div>
                <div>计费方式:&nbsp;&nbsp;&nbsp; {{item.chargetype == "1" ? "面积" : "房间"}}</div>
            </div>
          </div>

          <div class="bottom">
            <div class="my-button " @click="openDialog('edit',item.id)">编辑</div>
            <div class="my-button plain-red" @click="deleteRes(item.id)">删除</div>
          </div>
        </div>
        <div class="resource-item-add" @click="openDialog('add',null)">
          <div class="img-text">
            <img style="width: 44px;height: 44px;margin-bottom: 15px" src="../../../../static/images/bm-resource-add.png" alt="">
            <div>新增资源类型</div>
          </div>
        </div>
      </div> -->

    <div class="search-group title-line">
      <h3>资源库维护</h3>
      <div class="my-button green add-class" @click="openDialog('add', null)">
        <i class="el-icon-plus"></i>
        <span>新增资源类型</span>
      </div>
    </div>

    <!--表格-->
    <el-table class="my-table" :data="resTypeList" style="width: 100%" stripe>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="资源类型"
        align="center"
        width="300"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="chargecyclename, chargetype"
        label="资源属性"
        align="center"
      >
        <template slot-scope="scope">
          计费周期：{{ scope.row.chargecyclename }}；&nbsp; 计费方式：{{
            scope.row.chargetype == "1" ? "面积" : "房间"
          }}；&nbsp; 最大使用时长：{{
            scope.row.maxUse + scope.row.chargecyclename
          }}；&nbsp; 设施：{{ scope.row.infrastructure }}；&nbsp;
          {{
            scope.row.extraAttrKey
              ? "自定义属性：" + scope.row.extraAttrKey
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <div
            class="table-btn green"
            @click="openDialog('edit', scope.row.id)"
          >
            编辑
          </div>
          <div class="table-btn pink" @click="deleteRes(scope.row.id)">
            删除
          </div>
          <div class="table-btn blue" @click="goResInfo(scope.row)">
            资源管理
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit">
      <span>显示{{ limit }}条，共{{ totalPage }}条</span>
      <el-pagination
        class="my-el-pagination"
        background
        layout="prev, pager, next"
        :total="totalPage"
        :page-size="limit"
        :current-page="currentPage"
        small
        @current-change="getCurrentChange"
      ></el-pagination>
    </div>
    <div class="no-data" v-show="!resTypeList.length">
      <img src="@/../static/images/nodata.png" alt />
      <!-- <span>没有找到记录</span> -->
    </div>

    <!--弹框-->
    <el-dialog
      class="res-apply-dialog"
      :title="dialogTitle"
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <apply-form
        ref="child"
        :form="form"
        :formLabelWidth="formLabelWidth"
        v-loading="dialogLoading"
        :dialogType="dialogType"
      ></apply-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="dialogFormVisible = false">取 消</div>
        <div
          class="my-button green"
          @click="submit"
          v-loading.fullscreen.lock="fullscreenLoading"
        >
          提 交
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import applyForm from "./resDialog";
import { eduTypePageQuery, find } from "@/assets/js/api";
export default {
  name: "index",
  components: {
    applyForm
  },
  data() {
    return {
      limit: 10,
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      totalPage: 1,
      dialogFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      resTypeList: [], //资源类型列表
      loading: false,
      dialogLoading: false,
      dialogType: "", //弹框类型
      dialogTitle: "", //弹框标题
      fullscreenLoading: false
    };
  },
  methods: {
    //跳转资源列表页面
    goResInfo(row) {
      this.$router.push({
        path: `resource-type-management/jump`,
        query: {
          id: row.id,
          typeName: row.name,
          currentPage: this.currentPage
        }
      });
    },

    //删除
    deleteRes(id) {
      this.$confirm("此操作将永久删除该资源类型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.util
            .postAjax({
              code: this.global.code,
              url: "/eduType/delete/" + id,
              isGet: true
            })
            .then(res => {
              if (res && res.success) {
                //刷新列表
                this.getList(1);
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            });
        })
        .catch(() => {});
    },

    //提交
    submit() {
      this.$refs.child.$refs.form.validate(valid => {
        if (valid) {
          this.fullscreenLoading = true;
          // console.log(this.$refs.child.form);
          // return false;
          const form = this.$refs.child.form;
          form.extraAttrKey =
            (form.attrList.length &&
              form.attrList.map(a => a.name).join(",")) ||
            "";
          form.infrastructure =
            (form.baseList.length &&
              form.baseList.map(a => a.name).join(",")) ||
            "";
          let url = "/eduType/save";
          let message = "";
          switch (this.dialogType) {
            case "add":
              // url = "/sprestype/add";
              message = "新增成功";
              break;
            case "edit":
              // url = "/sprestype/update";
              message = "编辑成功";
              break;
          }
          this.util
            .postAjax({
              code: this.global.code,
              url: url,
              isRep: true,
              data: form
            })
            .then(res => {
              this.fullscreenLoading = false;
              if (res.success == true) {
                this.dialogFormVisible = false;
                this.getList();
                this.$message({
                  type: "success",
                  message: message
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            });
        }
      });
    },

    //打开弹框
    openDialog(type, id) {
      this.dialogType = type;
      this.dialogFormVisible = true;
      this.form = {
        attrList: [],
        baseList: []
      };
      switch (type) {
        case "add":
          this.dialogTitle = "资源类型新增";
          break;
        case "edit":
          this.dialogTitle = "资源类型编辑";
          this.dialogLoading = true;
          find(id).then(res => {
            if (res.success == true) {
              this.form = res.data;
              const baseList = this.common.comma(this.form, "infrastructure");
              this.form.baseList = baseList.map(b => ({ name: b }));
              const attrList = this.common.comma(this.form, "extraAttrKey");
              this.form.attrList = attrList.map(b => ({ name: b }));
              this.dialogLoading = false;
            }
          });
          break;
        case "detail":
          this.dialogTitle = "资源类型详情";
          break;
      }
    },

    //获取资源类型列表
    // getList(page){
    //   this.loading = true;
    //   this.util.postAjax({
    //     code:this.global.code,
    //     url:"/sprestype/list",
    //   }).then(res => {
    //     this.loading = false;
    //     if(res.success == true){
    //       this.resTypeList =res.items;
    //       this.common.chargecycleFormatter2(this.resTypeList);
    //       // console.log(res);
    //       this.totalPage=res.total
    //     }
    //   })
    // }
    getList(page) {
      this.loading = true;
      const params = {
        page: page || this.currentPage,
        limit: this.limit
      };
      eduTypePageQuery(params)
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.resTypeList = res.data;
            this.common.chargecycleFormatter2(this.resTypeList);
            this.totalPage = res.total;
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },
    //点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    }
  },
  created() {
    this.getList();
  },
  beforeDestroy() {
    sessionStorage.removeItem("currentPage");
  }
};
</script>

<style scoped lang="scss">
.title-line {
  height: 30px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  .add-class {
    width: 120px !important;
    margin-left: auto;
  }
}
.no-data {
  width: 100%;
  padding: 30px 0;
  border-radius: 5px;
  border: 1px dashed #dbdbdb;
  text-align: center;
  img {
    width: 100px;
    height: 100px;
    vertical-align: middle;
  }
}
</style>
