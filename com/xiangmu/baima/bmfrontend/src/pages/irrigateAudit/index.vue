<template>
  <div class="common-content">
    <!--面包屑-->
    <!--      <bread-crumb :breadList="breadList"></bread-crumb>-->

    <!--搜索框-->
    <div class="search-group" style="">
      <span style="display: inline-block">
        <label>灌溉日期</label>
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="searchForm.irdate"
          value-format="yyyyMMdd"
          size="small"
          style="width: 150px;"
        ></el-date-picker>
      </span>
      <span>
        <label>类型</label>
        <el-select
          v-model="searchForm.restypeid"
          placeholder="请选择"
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.typename"
            :value="item.id"
          ></el-option>
        </el-select>
      </span>
      <span>
        <label>学院</label>
        <!--<el-select v-model="searchForm.orgid" placeholder="请选择" size="small" style="width: 150px" filterable>
            <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
          </el-select>-->

        <el-select
          v-model="searchForm.orgid"
          filterable
          remote
          placeholder="请输入或选择"
          size="small"
          :remote-method="remoteMethod"
          :loading="selectLoading"
          style="width: 150px"
        >
          <el-option
            v-for="item in groupList"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </span>
      <span>
        <label>状态</label>
        <el-select
          v-model="searchForm.applystatus"
          placeholder="请选择"
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="item in applyStatus.filter(a => a.id != '0')"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </span>
      <span>
        <el-input
          v-model="searchForm.rescode"
          placeholder="请输入资源编号"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 220px"
        ></el-input>
        <el-button size="small" style="width: 100px" @click="search"
          >搜索</el-button
        >
      </span>
      <span class="reset-icon" @click="reset">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>
    </div>

    <!--tab切换-->
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
        <!--          <el-tab-pane label="全部" name="1"></el-tab-pane>-->
        <el-tab-pane label="待审批" name="2"></el-tab-pane>
        <el-tab-pane label="已审批" name="3"></el-tab-pane>
        <el-tab-pane label="已撤回" name="4"></el-tab-pane>
      </el-tabs>

      <button
        class="imgBtn"
        @click="isBatchOpen = true"
        :disabled="!checkedList.length"
        :class="{ grey: !checkedList.length }"
        v-if="activeName == '2'"
      >
        <div style="margin-top: -3px">
          <img class="batchImg" :src="batchPng" />
          <!-- <img class="batchImg" :src="require(`st@tic/images/batch_approve.png`)"/> -->
          <span>批量审批</span>
        </div>
      </button>
    </div>

    <el-divider style=""></el-divider>

    <!--表格-->
    <el-table
      class="my-table"
      :data="auditList"
      style="width: 100%"
      stripe
      @sort-change="sortChange"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
      <el-table-column
        type="selection"
        v-if="activeName == '2'"
      ></el-table-column>
      <el-table-column
        prop="irdate"
        label="灌溉日期"
        align="center"
        sortable
        :formatter="dateFormatter"
      ></el-table-column>
      <el-table-column
        prop="orgname"
        label="学院名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="projectname"
        label="项目名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="typename"
        label="灌溉类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="rescodes"
        label="资源编号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="applyername"
        label="申请人"
        align="center"
      ></el-table-column>
      <el-table-column prop="applystatus" label="状态" align="center">
        <template slot-scope="scope">
          <span :class="common.statusColor('', '', scope.row.applystatus)">{{
            common.statusFormatter("", "", scope.row.applystatus)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="250" align="center">
        <template slot-scope="scope">
          <div class="table-btn green" @click="goDetail(scope.row)">详情</div>
          <div
            v-if="scope.row.applystatus == 0 || scope.row.applystatus == 1"
            class="table-btn orange"
            @click="eidtAudit(scope.row)"
          >
            编辑
          </div>
          <div
            v-if="scope.row.applystatus == 0 || scope.row.applystatus == 1"
            class="table-btn blue"
            @click="auditOperate(scope.row)"
          >
            审批
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
        :current-page="parseInt(currentPage)"
        small
        @current-change="getCurrentChange"
      ></el-pagination>
    </div>

    <!--弹框-->
    <el-dialog
      class="res-apply-dialog"
      title="资源申请编辑"
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <apply-form
        ref="child"
        :form="form"
        :formLabelWidth="formLabelWidth"
      ></apply-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="dialogFormVisible = false">取 消</div>
        <div class="my-button green" @click="editSubmit">提 交</div>
      </div>
    </el-dialog>

    <el-dialog
      class="res-apply-dialog"
      title="批量审批"
      v-if="isBatchOpen"
      :visible.sync="isBatchOpen"
      width="700px"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom: 20px" class="audit-content">
        <div class="item-title">
          <img
            style="width: 22px;height: 20px"
            :src="require('st@tic/images/bm-audit-info.png')"
            alt=""
          />
          <span>审批</span>
        </div>
        <opinions :isCol="true" ref="opinions"></opinions>
      </div>

      <div slot="footer" class="dialog-footer">
        <div class="my-button plain-red" @click="batchOperate('0')">
          审批不通过
        </div>
        <div class="my-button green" @click="batchOperate('1')">审批通过</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import applyForm from "../../components/irrDialog";
import breadCrumb from "../../components/breadcrumb";
export default {
  name: "index",
  components: {
    applyForm,
    breadCrumb,
    Opinions: () => import("@/components/opinions")
  },
  props: {
    breadList: Array
  },
  data() {
    return {
      isBatchOpen: false,
      checkedList: [],
      batchPng: require("st@tic/images/batch_approve.png"),
      loading: false,
      totalPage: 0,
      limit: 10,
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      activeName: sessionStorage.getItem("activeName") || "2",
      sort: null,
      orderBy: null,
      auditList: [], //申请列表
      dialogFormVisible: false,
      form: {
        event: {
          eventnote: ""
        }
      },
      formLabelWidth: "120px",
      applyStatus: this.options.applyStatus, //状态列表
      value: "",
      searchForm: {},
      typeList: JSON.parse(sessionStorage.getItem("typeList")), //资源类型列表
      groupList: [], //学院列表
      codeList: JSON.parse(sessionStorage.getItem("codeList")), //学院列表
      selectLoading: false
    };
  },
  methods: {
    //审核操作
    batchOperate(type) {
      if (!this.$refs.opinions.eventnote) {
        this.$message({
          type: "warning",
          message: "请输入审批意见!"
        });
      } else {
        let params = [
          // {
          //   applyid: "string",
          //   eventer: "string",
          //   eventername: "string",
          //   eventnote: "string",
          //   eventresult: 0,
          //   eventtime: "string",
          //   eventtype: "string",
          //   id: "string"
          // }
        ];

        this.checkedList.forEach(c => {
          let obj = {
            eventnote: this.$refs.opinions.eventnote,
            eventresult: type,
            eventtype: 4,
            applyid: c.id
          };
          params.push(obj);
        });
        const loading = this.$loading({
          lock: true,
          text: "提交审批中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.util
          .postAjax({
            code: this.global.code,
            url: "/irapply/saveEventBatch",
            isRep: true,
            data: params
          })
          .then(res => {
            // console.log(res);
            loading.close();
            if (res.success) {
              this.addOpenUse();
              this.$message({
                type: type == "0" ? "error" : "success",
                message: type == "0" ? "审批不通过" : "审批通过"
              });
              this.batchCancel();
              // “审核完成，有一条申请已撤回”
            } else {
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
      }
    },
    //添加常用字段
    addOpenUse() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/opinions/add",
          isRep: true,
          data: {
            note: this.$refs.opinions.eventnote
          }
        })
        .then(res => {
          if (res.success == true) {
          } else {
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        });
    },

    batchCancel() {
      this.isBatchOpen = false;
    },
    handleSelectionChange(val) {
      this.checkedList = val;
    },
    //搜索学院名称
    remoteMethod(query) {
      this.selectLoading = true;
      if (query !== "") {
        this.common
          .getGroupList2(query)
          .then(res => {
            console.log(res);
            this.selectLoading = false;
            this.groupList = res.items;
          })
          .catch(err => {
            this.selectLoading = false;
            this.groupList = [];
          });
      } else {
        this.selectLoading = false;
        this.groupList = [];
      }
    },

    //排序
    sortChange(column, prop, order) {
      this.orderBy = column.prop.toUpperCase();
      console.log(this.orderBy);
      switch (column.order) {
        case "ascending":
          this.sort = "asc";
          break;
        case "descending":
          this.sort = "desc";
          break;
      }

      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    //搜索
    search() {
      console.log(this.searchForm);
      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    //清空
    reset() {
      this.searchForm = {};
      this.currentPage = 1;
      this.getList(this.currentPage);
    },

    //表格内日期格式转化
    dateFormatter(row, column, cellValue) {
      if (cellValue && cellValue.length == 14) {
        return this.util.formatTime(cellValue, "yyyy.MM.dd");
      } else {
        return cellValue;
      }
    },

    //点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    },

    //跳转详情
    goDetail(row) {
      this.$router.push({
        path: `/irrigate-audit/audit-detail/${row.id}`,
        query: {
          activeName: this.activeName,
          currentPage: this.currentPage
        }
      });
    },

    //跳转审核页面
    auditOperate(row) {
      this.$router.push({
        path: `/irrigate-audit/audit-operate/${row.id}`,
        query: {
          activeName: this.activeName,
          currentPage: this.currentPage
        }
      });
    },

    //获取列表
    getList() {
      let param = {
        page: this.currentPage,
        limit: this.limit,
        applystatus: this.searchForm.applystatus,
        orgid: this.searchForm.orgid,
        rescode: this.searchForm.rescode,
        irrestypeid: this.searchForm.restypeid,
        applytype: this.activeName,
        sort: this.sort,
        orderBy: this.orderBy
      };
      if (this.searchForm.irdate) {
        param.irdate = this.util.formatTime(
          this.searchForm.irdate,
          "yyyyMMdd000000"
        );
      }
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/irapply/pageList",
          data: {
            params: JSON.stringify(param)
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.auditList = (res.item.bmList && res.item.bmList.list) || [];
            this.totalPage = (res.item.bmList && res.item.bmList.total) || 0;
          }
          // console.log("tableData:",this.auditList);
        });
    },

    //打开编辑弹框
    eidtAudit(row) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/irapply/findById",
          data: {
            id: row.id
          }
        })
        .then(res => {
          if (res.success == true) {
            console.log(res);
            this.dialogFormVisible = true;
            let apply = res.item.apply;
            let ress = res.item.ress;
            let arr = [];
            ress.forEach(v => {
              arr.push(v.id);
            });
            this.form = {
              id: apply.id,
              orgid: apply.orgid,
              projectname: apply.projectname,
              /* classleaderInfo:JSON.stringify(
                    {
                      id:apply.classleaderid,
                      name:apply.classleadername
                    }
                  ),*/
              classleaderid: apply.classleaderid,
              classleadername: apply.classleadername,
              classleadermobile: apply.classleadermobile,
              eventername: this.options.userInfo.NAME,
              applyermobile: apply.applyermobile,
              worker: apply.worker,
              workermobile: apply.workermobile,
              irrestypeid: apply.irrestypeid,
              irdate: apply.irdate,
              note: apply.note,
              resids: arr
            };

            console.log("11", this.form);
          }
        });
    },

    //打开编辑弹框
    /*eidtAudit(row){
            this.util.postAjax({
              code:this.global.code,
              url:"/irapply/findById",
              data:{
                id:row.id
              }
            }).then(res => {
              if(res.success == true){
                console.log(res);
                this.dialogFormVisible = true;
                let apply=res.item.apply;
                this.form.id=apply.id;
                this.form.owngroupname=apply.owngroupname;
                this.form.projectname=apply.projectname;
                this.form.classleader=apply.classleader;
                this.form.classleadermobile=apply.classleadermobile;
                this.form.creater=apply.creater;
                this.form.eventername=this.options.userInfo.NAME;
                this.form.applyermobile=apply.applyermobile;
                this.form.worker=apply.worker;
                this.form.workermobile=apply.workermobile;
                this.form.irrestype=apply.irrestype;
                this.form.irdate=apply.irdate;
                this.form.irrestype=apply.irrestype;

                let ress=res.item.ress;
                let arr=[];
                ress.forEach(v=>{
                  arr.push(v.id)
                });
                this.form.resids=arr;
                let events= res.item.events;
                this.form.event.eventnote=events[0].eventnote;
              }
            })
          },*/

    //提交
    editSubmit() {
      console.log(this.$refs.child.form);

      this.$refs.child.$refs.form.validate(valid => {
        if (valid) {
          // return false;
          let form = this.$refs.child.form;
          let form2 = {};
          let url = "";
          let message = "";
          /* if(type == 0){
                  // form2.note = form.event.eventnote;
                  url="/irapply/saveDraft";
                  message="保存成功";
                }else {
                  // form2.event=form.event;
                  url="/irapply/save";
                  message="提交成功";
                }*/
          url = "/irapply/edit";
          if (form.id) {
            form2.id = form.id;
          }
          // form2.owngroupname=form.owngroupname;

          form2.orgid = form.orgid;
          form2.projectname = form.projectname;
          form2.projectbh = form.projectbh;
          /*let classleaderInfo= JSON.parse(form.classleaderInfo);
                form2.classleaderid=classleaderInfo.id;
                form2.classleadername=classleaderInfo.name;*/
          form2.classleaderid = form.classleaderid;
          form2.classleadername = form.classleadername;
          form2.worker = form.worker;
          form2.classleadermobile = form.classleadermobile;
          form2.applyermobile = form.applyermobile;
          form2.workermobile = form.workermobile;
          form2.irrestypeid = form.irrestypeid;
          form2.note = form.note;
          //资源编号格式转换
          let arr = [];
          form.resids.forEach(v => {
            arr.push({ resid: v });
          });
          /* this.codeList.forEach(m=>{
                  form.resids.forEach(v=>{
                    if(m.id==v){
                      arr.push({resid:v})
                    }
                  })
                });*/
          form2.resList = arr;
          form2.irdate = form.irdate
            ? this.util.formatTime(form.irdate, "yyyyMMdd000000")
            : "";

          // console.log("form2",form2);

          // return false;

          const loading = this.$loading({
            lock: true,
            text: "提交中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

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
                  message: "编辑成功"
                });
                // this.currentPage =1;
                this.getList(this.currentPage);
              } else {
                console.log(res);
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            });
        }
      });
      // return false;
    },

    //提交
    /*editSubmit(){
            this.$refs.child.$refs.form.validate((valid) => {
              if (valid) {
                console.log(this.$refs.child.form);
                // return false;
                let form=this.$refs.child.form;
                let form2 = {};

                form2.event=form.event;
                form2.id=form.id;
                form2.owngroupname=form.owngroupname;
                form2.projectname=form.projectname;
                // form2.classleader=form.classleader;
                form2.classleaderid=form.classleaderid;
                form2.classleadername=form.classleadername;
                /!* classleaderid:apply.classleaderid,
                   classleadername:apply.classleadername,*!/
                form2.creater=form.creater;
                form2.worker=form.worker;
                form2.classleadermobile=form.classleadermobile;
                form2.applyermobile=form.applyermobile;
                form2.workermobile=form.workermobile;
                form2.irrestype=form.irrestype;
                //资源编号格式转换
                let arr=[];
                this.codeList.forEach(m=>{
                  form.resids.forEach(v=>{
                    if(m.id==v){
                      arr.push({resid:v})
                    }
                  })
                });
                form2.resList=arr;
                form2.irdate=form.irdate ? this.util.formatTime(form.irdate,"yyyyMMdd000000") : "";

                console.log("form2",form2);

                // return false;
                this.util.postAjax({
                  code:this.global.code,
                  url:"/irapply/edit",
                  isRep:true,
                  data:form2
                }).then(res => {
                  if(res.success == true){
                    this.dialogFormVisible = false;
                    this.$message({
                      type:"success",
                      message:"编辑成功"
                    });
                    this.getList(1);
                  }
                })

              }
            })

          },*/

    handleClick(row) {
      console.log(this.activeName);

      this.currentPage = 1;
      this.getList(this.currentPage);
    }
  },
  created() {
    this.getList(this.currentPage);
    // console.log('options:', this.codeList, this.options);
    this.common.getSeriesLists();
  },

  beforeDestroy() {
    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("activeName");
  }
};
</script>

<style scoped lang="scss">
.imgBtn {
  border-radius: 5px;
  width: 100px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #dcdfe6;
  text-decoration: none !important;
  float: right;
  margin-top: 3px;
  box-shadow: 0px 0px 4px 0px rgba(226, 226, 226, 0.3);
  background-color: rgba(0, 176, 155, 1);
  cursor: pointer;
  img {
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
    overflow-wrap: break-word;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: PingFangSC-Medium;
    text-align: center;
    white-space: nowrap;
  }
  &.grey {
    background: #e2e2e2;
    color: #999999;
    border-color: #e2e2e2;
    cursor: inherit;
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