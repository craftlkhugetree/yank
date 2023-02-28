<template>
  <div class="info-detail">
    <div class="back-box title-back">
      <div class="table-btn white" @click="back">返回</div>
      <span>{{ typeDetail.name }}</span>
    </div>
    <div class="info-content shadow">
      <div style="width:100%; height:20px"></div>
      <!--搜索框-->
      <div class="search-group gaparound">
        <span>
          <label>状态</label>
          <el-select
            v-model="searchForm.status"
            placeholder="请选择"
            size="small"
            style="width: 150px"
          >
            <el-option label="开放" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </span>
        <span>
          <el-input
            v-model.trim="searchForm.name"
            placeholder="请输入资源编号"
            prefix-icon="el-icon-search"
            size="small"
            style="width: 220px"
            maxlength="100"
          ></el-input>
          <el-button size="small" style="width: 100px" @click="search"
            >搜索</el-button
          >
        </span>
        <span class="reset-icon" @click="reset">
          <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
        </span>
      </div>

      <div class="search-group gaparound">
        <div
          class="my-button green"
          style="margin-right: 10px"
          @click.stop="addApply('add', null)"
        >
          <i class="el-icon-plus"></i>
          <span>新增资源</span>
        </div>

        <div
          class="my-button green"
          style="margin-right: 10px"
          @click="downloadTemp"
        >
          <i class="el-icon-download"></i>
          <span>下载模板</span>
        </div>

        <div
          class="my-button green"
          style="margin-right: 10px"
          @click="uploadTemp"
        >
          <img class="image" src="@/../static/images/importwhite.png" alt="" />
          <span>导入</span>
        </div>

        <div
          class="my-button plain-green"
          style="margin-right: 10px"
          @click="changeStatus(1, 'more', null)"
        >
          <img class="image" src="@/../static/images/bm-res-open.png" alt="" />
          <span>批量开放</span>
        </div>

        <div
          class="my-button plain-green"
          style="margin-right: 10px"
          @click="changeStatus(0, 'more', null)"
        >
          <img
            class="image"
            style="margin-top: 7px"
            src="@/../static/images/bm-res-close.png"
            alt=""
          />
          <span>批量关闭</span>
        </div>

        <div
          class="my-button plain-red"
          style=""
          @click="deleteRes('more', null)"
        >
          <img
            class="image"
            style="margin-top: 7px"
            src="../../../../static/images/bm-file-delete.png"
            alt=""
          />
          <span>批量删除</span>
        </div>
      </div>

      <div class="my-el-divider"></div>

      <!--表格-->
      <el-table
        class="my-table gaparound"
        :data="resList"
        style="width: 100%"
        stripe
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          fixed="left"
          :selectable="selectable"
        ></el-table-column>
        <el-table-column label="资源类型" align="center" prop="pname">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="area"
          label="面积(㎡)"
          align="center"
        ></el-table-column>
        <!--        <el-table-column prop="price" :label="'单价(元/'+typeDetail.chargetype" ></el-table-column>-->
        <el-table-column
          v-if="typeDetail.billingCycle && typeDetail.billingMethod"
          prop="price"
          :label="
            '单价（元/' + typeDetail.chargecycle + '/' + typeDetail.ct2 + '）'
          "
          align="center"
          width="150"
          :formatter="common.moneyFormatter"
        ></el-table-column>
        <el-table-column
          v-else
          prop="price"
          :label="'单价（元/' + '--' + '/' + '--' + '' + '）'"
          align="center"
          width="150"
        ></el-table-column>

        <el-table-column
          prop="ownInfrastructure"
          label="基础设施"
          show-overflow-tooltip
          align="center"
          width="400"
        >
        </el-table-column>
        <el-table-column prop="status" label="资源状态" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row.status == 0 ? 'status-grey' : 'status-blue'"
              >{{
                common.resStateFormatterJump("", "", scope.row.status)
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280" align="center">
          <template slot-scope="scope">
            <div class="table-btn green" @click="goDetail(scope.row.id)">
              详情
            </div>
            <div class="table-btn orange" @click="addApply('edit', scope.row)">
              编辑
            </div>
            <div
              v-if="scope.row.status == 1 && scope.row.useState == 0"
              class="table-btn blue"
              @click="changeStatus(0, 'single', scope.row.id)"
            >
              关闭
            </div>
            <div
              v-if="scope.row.status == 0 && scope.row.useState == 0"
              class="table-btn blue"
              @click="changeStatus(1, 'single', scope.row.id)"
            >
              开放
            </div>
            <div
              v-if="scope.row.useState == 0"
              class="table-btn pink"
              @click="deleteRes('single', scope.row.id)"
            >
              删除
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="my-pagination" v-if="totalPage > limit"  style="padding:0 20px">
        <span>显示{{ limit }}条，共{{ totalPage }}条</span>
        <el-pagination
          class="my-el-pagination"
          background
          layout="prev, pager, next"
          :total="totalPage"
          :page-size="limit"
          :current-page="parseInt(currentPage)"
          small
          @current-change="getCurrentChange"
        ></el-pagination>
      </div>

      <!--弹框-->
      <el-dialog
        class="res-apply-dialog"
        :title="dialogType == 'add' ? '资源新增' : '资源编辑'"
        v-if="dialogFormVisible"
        :visible.sync="dialogFormVisible"
        width="700px"
        :close-on-click-modal="false"
      >
        <res-form
          ref="child"
          :form0="form"
          :formLabelWidth="formLabelWidth"
          :typeDetail0="typeDetail"
          :newId="id"
          v-loading="dialogLoading"
          :disabled="disabled"
          :dialogType="dialogType"
        ></res-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible = false">取 消</div>
          <div class="my-button green" @click="submit()">提 交</div>
        </div>
      </el-dialog>

      <upload
        v-show="false"
        ref="upload"
        class="my-upload"
        :url="uploadUrl + id"
        :multiple="false"
        :exts="fileType"
        :activeResType="id"
        :isNew="true"
        @done="finish"
      ></upload>
    </div>
  </div>
</template>

<script>
import resForm from "./resDialogJump";
import upload from "../../../components/BaseUpload";
import {
  batchDel,
  batchOpen,
  batchClose,
  find,
  eduResourcePageQuery,
  eduResourceFind
} from "@/assets/js/api";
export default {
  name: "jump",
  components: {
    resForm,
    upload
  },
  data() {
    return {
      totalPage: 1,
      limit: 10,
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      resList: [], //申请列表
      dialogFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      searchForm: {},
      dialogType: "", //弹框类型
      dialogLoading: false,
      loading: false,
      typeDetail: {},
      selectedIds: "",
      disbaled: false,
      uploadUrl: window.g.ApiUrl2 + "/eduResource/importResource/",
      fileType: "xls|XLS|xlsx|XLSX"
    };
  },
  props: {
    id: String,
    typeName: String,
    indexCurrentPage: String | Number
  },
  methods: {
    /**
     * 根据条件禁用行复选框
     * 函数返回值为false则禁用选择(反之亦然)
     * @param {Object} row - 行数据
     * @param {String} index - 索引值
     * @return Boolean
     */
    selectable: function(row, index) {
      if (row.useState == 0) {
        return true;
      }

      // 函数必须有返回值且是布尔值
      // 页面刷新后该函数会执行 N 次进行判断(N 为表格行数)
      // 如果没有返回值则默认返回false(全部无法选中)
    },

    //返回
    back() {
      sessionStorage.setItem(
        "currentPage",
        JSON.stringify(this.indexCurrentPage)
      );
      this.common.back();
    },

    //下载模板
    downloadTemp() {
      this.util
        .getUrlByCode(this.global.code, "/eduResource/downloadTemplate")
        .then(res => {
          window.open(res + "/" + this.id, "_blank");
          // window.open(res + "?eduTypeId=" + this.id, "_blank");
        });
    },

    //导入
    uploadTemp() {
      this.$refs.upload.$refs.uploaddom.click();
    },

    //结束后返回
    finish(res) {
      if (res.success == true) {
        this.currentPage = 1;
        this.getList(this.currentPage);
        this.$message({
          type: "success",
          message: "导入成功!"
        });
      } else {
        this.$message({
          type: "warning",
          message: res.data.message
        });
      }
    },

    //跳转详情
    goDetail(id) {
      this.$router.push({
        path: `/jump/detail/${id}`,
        query: {
          restypeid: this.id,
          currentPage: this.currentPage,
          prevPage: "jump"
        }
      });
    },

    //删除
    deleteRes(num, id) {
      let ids = "";
      switch (num) {
        case "more":
          ids = this.selectedIds;
          break;
        case "single":
          ids = id;
          break;
      }

      if (!ids) {
        this.$message({
          type: "warning",
          message: "请先选择资源"
        });
      } else {
        this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            batchDel({ ids }).then(res => {
              if (res.success == true) {
                this.currentPage = 1;
                this.getList(this.currentPage);
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
      }
    },

    changeStatusInner(resstatus, num, id) {
      let ids = "";
      switch (num) {
        case "more":
          ids = this.selectedIds;
          break;
        case "single":
          ids = id;
          break;
      }
      const batchOp = resstatus == 1 ? batchOpen : batchClose;
      if (!ids) {
        this.$message({
          type: "warning",
          message: "请先选择资源"
        });
      } else {
        batchOp({ ids })
          .then(res => {
            if (res && res.success) {
              this.getList(this.currentPage);

              if (res.errorList && res.errorList.length > 0) {
                let arr = [];
                res.errorList.forEach(v => {
                  arr.push(v.name);
                });
                arr = arr.join(",");
                let text = resstatus == "1" ? "已开放" : "已关闭";
                this.$message({
                  type: "success",
                  message: "除" + arr + "资源外,其它资源均" + text
                });
              } else {
                this.$message({
                  type: "success",
                  message: resstatus == "1" ? "资源已开放" : "资源已关闭"
                });
              }
            } else {
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    },

    //资源状态开放和关闭
    changeStatus(resstatus, num, id) {
      if (resstatus == 0) {
        if (!this.selectedIds && num === "more") {
          this.$message({
            type: "warning",
            message: "请先选择资源"
          });
          return;
        }
        this.$confirm("此操作将关闭选中的资源, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.changeStatusInner(resstatus, num, id);
          })
          .catch(() => {});
      } else if (resstatus == 1) {
        this.changeStatusInner(resstatus, num, id);
      }
    },

    //多选框
    handleSelectionChange(val) {
      let arr = [];
      val.forEach(v => {
        arr.push(v.id);
      });
      this.selectedIds = arr.join(",").toString();
    },

    //点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    },

    //搜索
    search() {
      this.getList(1);
    },

    //清空
    reset() {
      this.searchForm = {};
      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    getList(page) {
      this.loading = true;
      const filter = { eduTypeId: parseFloat(this.id) };
      filter.status = this.searchForm.status;
      filter.name = this.searchForm.name;
      eduResourcePageQuery({
        page: page || this.currentPage,
        limit: this.limit,
        filter
      })
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.resList = res.data;
            this.totalPage = res.total;
            this.resList.forEach(r => {
              r.pname = this.typeName;
            });
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    //获取类型详情
    getTypeInfo() {
      find(this.id).then(res => {
        if (res && res.success) {
          this.typeDetail = res.data;

          const baseList = this.common.comma(this.typeDetail, "infrastructure");
          this.typeDetail.baseList = baseList.map(b => ({ name: b, id: b }));
          const attrList = this.common.comma(this.typeDetail, "extraAttrKey");
          this.typeDetail.attrList = attrList.map(b => ({ name: b }));

          let chargecycle = this.typeDetail.billingCycle + "";
          let chargetype = this.typeDetail.billingMethod + "";
          this.common.chargecycleFormatter(chargecycle, this.typeDetail);
          this.common.chargetypeFormatter(chargetype, this.typeDetail);
          this.common.chargetypeFormatter2(chargetype, this.typeDetail, "ct2", "ct1");
        }
      });
    },
    //打开弹框
    addApply(type, row) {
      this.dialogType = type;
      switch (type) {
        case "add":
          this.form = {};
          this.form.attrList = this.common
            .comma(this.typeDetail, "extraAttrKey")
            .map(a => ({
              name: a,
              attrv: "",
              typeattrid: a
            }));
          this.disabled = false;
          break;
        case "edit":
          this.dialogLoading = true;
          if (row.useState == 1) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
          eduResourceFind(row.id)
            .then(res => {
              this.dialogLoading = false;
              if (res && res.success) {
                this.$nextTick(() => {
                  const arr = this.common.comma(res.data, "ownInfrastructure");
                  const obj =
                    (res.data.extraAttrVal &&
                      JSON.parse(res.data.extraAttrVal.replace(/\\"/g, '"'))) ||
                    {};
                  this.$refs.child.form = res.data;
                  this.$refs.child.form.attrList = [];
                  for (const str in obj) {
                    this.$refs.child.form.attrList.push({
                      name: str,
                      attrv: obj[str],
                      typeattrid: str
                    });
                  }
                  this.$refs.child.form.oldBaseList = arr;
                });
              }
            })
            .catch(e => {
              this.dialogLoading = false;
            });
          break;
        default:
          break;
      }
      this.dialogFormVisible = true;
    },

    //提交
    submit() {
      this.$refs.child.$refs.form.validate(valid => {
        if (valid) {
          let url = "/eduResource/save";
          let message = "";
          let form = this.$refs.child.form;

          switch (this.dialogType) {
            case "add":
              message = "新增成功";
              this.currentPage = 1;
              break;
            case "edit":
              message = "编辑成功";
              break;
          }
          const attr = form.attrList.reduce((init, a) => {
            init[a.name] = a.attrv;
            return init;
          }, {});
          const baseList = form.oldBaseList.map(a => a);
          form.extraAttrVal = JSON.stringify(attr);
          form.ownInfrastructure = baseList.join(",");
          let form2 = {};
          for (let p in form) {
            form2[p] = form[p];
          }
          form2.eduTypeId = parseFloat(this.id);

          const loading = this.$loading({
            lock: true,
            text: "提交中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          delete form2.oldBaseList;
          delete form2.attrList;
          this.util
            .postAjax({
              code: this.global.code,
              url: url,
              isRep: true,
              data: form2
            })
            .then(res => {
              loading.close();
              if (res.success == true) {
                this.dialogFormVisible = false;
                this.$message({
                  type: "success",
                  message: message
                });
                this.getList(this.currentPage);
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            });
        }
      });
    }
  },
  created() {
    this.getTypeInfo();
    this.getList(this.currentPage);
  }
};
</script>

<style scoped lang="scss">
.shadow {
  background: #ffffff;
  box-shadow: 0px 2px 5px 0px rgba(102, 102, 102, 0.2);
  border-radius: 5px;
  &::after {
    display: table;
    clear: both;
    content: "";
  }
}
.gaparound {
  padding-left: 20px;
  padding-right: 20px;
}
.title-back {
  > div {
    margin-left: -10px;
  }
  span {
    font-weight: bold;
    margin-left: 20px;
  }
}

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #00b09b !important;
  border-color: #00b09b !important;
}
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #00b09b !important;
  border-color: #00b09b !important;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #00b09b !important;
}
/deep/ .el-checkbox.is-bordered.is-checked {
  border-color: #00b09b !important;
}
/deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #00b09b !important;
}
</style>
