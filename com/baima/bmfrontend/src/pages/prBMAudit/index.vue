<template>
  <div class="common-content">
    <!--面包屑-->
    <bread-crumb :breadList="breadList"></bread-crumb>

    <!--搜索框-->
    <div class="search-group">
      <span>
        <label>申请时间</label>
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="searchForm.applytime"
          value-format="yyyyMMdd"
          size="small"
          style="width: 150px;"
        ></el-date-picker>
      </span>
      <span>
        <label>学院</label>
        <!--<el-select v-model="searchForm.orgid" placeholder="请选择" size="small" style="width: 150px" filterable>
          <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
        <el-input
          v-model="searchForm.classname"
          placeholder="请输入班级名称"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 220px"
        ></el-input>
        <el-button size="small" style="width: 100px" @click="search"
          >搜索</el-button
        >
      </span>
      <span class="reset-icon" @click="reSet">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>
    </div>

    <!--tab切换-->
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
        <!--        <el-tab-pane label="全部" name="1"></el-tab-pane>-->
        <el-tab-pane label="待审批" name="2"></el-tab-pane>
        <el-tab-pane label="已审批" name="3"></el-tab-pane>
        <!--        <el-tab-pane label="已撤回" name="4"></el-tab-pane>-->
      </el-tabs>

      <!-- <div class="my-button green" style="float: right;margin-top: 3px;">
        <i class="el-icon-download"></i>
        <span>批量导出</span>
      </div>-->
    </div>

    <el-divider style></el-divider>

    <!--表格-->
    <el-table
      class="my-table"
      :data="auditList"
      style="width: 100%"
      stripe
      @sort-change="sortChange"
      v-loading="pageLoading"
    >
      <!-- <el-table-column prop="name" label="申请编号" width="180"></el-table-column> -->
      <el-table-column
        prop="orgname"
        label="学院名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="classname"
        label="班级名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="leadername"
        label="负责教师"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="prpersonnum"
        label="实习人数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="prstarttime"
        label="实习日期"
        sortable
        align="center"
        min-width="150"
      >
        <template slot-scope="scope">
          {{
            scope.row.prstarttime
              ? util.formatTime(scope.row.prstarttime, "yyyy.MM.dd")
              : "--"
          }}
          ~
          {{
            scope.row.prendtime
              ? util.formatTime(scope.row.prendtime, "yyyy.MM.dd")
              : "--"
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="申请表"
        align="center"
        v-if="activeName == '3'"
        width="120"
      >
        <template slot-scope="scope">
          <div
            class="table-btn green"
            @click="downloadForm(1, scope.row)"
            style="border: none"
          >
            <i class="el-icon-paperclip"></i>申请表
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="学生信息表"
        align="center"
        v-if="activeName == '3'"
        width="150"
      >
        <template slot-scope="scope">
          <div
            v-if="scope.row.students && scope.row.students.length"
            class="table-btn green"
            @click="downStd(scope.row)"
            style="border: none"
          >
            <i class="el-icon-paperclip"></i>学生信息表
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="applystatus"
        label="审批状态"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <span
            :class="common.statusColorPractice('', '', scope.row.applystatus)"
            >{{
            common.processFormatterPractice("", "", scope.row.applystatus)
            }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="eventername"
        label="审批人"
        align="center"
        v-if="activeName == '3'"
      >
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <div class="table-btn green" @click="goDetail(scope.row)">详情</div>
          <div
            v-if="scope.row.applystatus != '6'"
            class="table-btn orange"
            @click="editAudit(scope.row)"
          >
            编辑
          </div>
          <div
            class="table-btn blue"
            @click="auditOperate(scope.row)"
            v-if="
              scope.row.applystatus === '2' || scope.row.applystatus === '3'
            "
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
        :current-page="currentPage"
        small
        @current-change="getCurrentChange"
      ></el-pagination>
    </div>

    <!--弹框-->
    <el-dialog
      class="res-apply-dialog"
      title="实习申请编辑"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="750px"
      :close-on-click-modal="false"
    >
      <apply-form
        ref="child"
        :form="form"
        formLabelWidth="120px"
        :teacherList="teacherList"
        @addTeacher="addTeacher"
        :studentList="studentList"
        @deleteTeacher="deleteTeacher"
        @getFileInfo="getFileInfo"
        @deleteFile="deleteFile"
      ></apply-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="dialogVisible = false">取 消</div>
        <!--        <div class="my-button plain-green" @click="submit(0)">保 存</div>-->
        <div class="my-button green" @click="submit(2)">保 存</div>
      </div>
    </el-dialog>
    <div id="tmpTable" v-show="isDomShow">
      <h2>本科生实习申请</h2>
      <table border="1" cellspacing="0">
        <thead>
          <tr>
            <th v-for="(h, i) in tableTitle" :key="i">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tr, i) in studentList" :key="tr.idcard + i" class="trClassFlag">
            <td>{{ tr.classname }}</td>
            <td>{{ tr.username }}</td>
            <td>{{ tr.userid }}</td>
            <td>{{ tr.idcard }}</td>
            <td>{{ tr.sex }}</td>
            <td>{{ tr.national }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <student-apply
      v-show="stdApply"
      :form="resDetail"
      style="margin-left: -2000px"
    >
    </student-apply>
  </div>
</template>

<script>
import applyForm from "../../components/prDialog";
import breadCrumb from "../../components/breadcrumb";
import { roleId } from "@/assets/js/options";
export default {
  components: {
    applyForm,
    breadCrumb,
    studentApply: () => import("@/components/stdApplyInfo")
  },
  props: {
    breadList: Array
  },
  computed: {
    curRole() {
      let url = document.location.href;
      if (url.indexOf("/practive-BM-audit") > -1) {
        return roleId.bm;
      } else if (url.indexOf("/practive-HQ-audit") > -1) {
        return roleId.hq;
      }
      return "16000";
    },
    isRearService() {
      return roleId.hq === this.curRole;
    }
  },
  data() {
    return {
      resDetail: {},
      stdApply: false,
      tableTitle: ["班级", "姓名", "学号", "身份证号", "性别", "民族"],
      studentList: [],
      totalPage: 1,
      limit: 10,
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      activeName: sessionStorage.getItem("activeName") || "2",
      orderBy: null,
      sort: null,

      groupList: [], //学院列表
      searchForm: {
        owngroup: "",
        rescode: ""
      },
      auditList: [],
      loading: false,
      pageLoading: false,
      dialogVisible: false,
      form: {},
      teacherList: [],
      selectLoading: false,
      isDomShow: false
    };
  },
  watch: {
    "searchForm.owngroup"() {
      this.getList(1);
    }
  },
  methods: {
    // 下载学生信息表
    downStd(row) {
      let stdList = row.students || [];
      stdList.forEach(s => {
        s.sex = s.sex == "1" ? "男" : "女";
      });
      this.studentList = stdList;
      this.isDomShow = true;
      let that = this;
      // this.$nextTick(() =>
      //   that.common.transToPdf("学生信息表", "tmpTable", that)
      // );
      this.common.outPutPdfFn(that, 'tmpTable', 'trClassFlag', "学生信息表", true)
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

    //申请单操作
    downloadForm(type, row) {
      // type 1下载2预览
      // return false;
      // this.util
      //   .getUrlByCode(this.global.code, "/prapply/applyForm")
      //   .then(res => {
      //     window.open(res + "?id=" + row.id + "&type=" + type);
      //   });
      this.resDetail = row;
      //开始：早中晚餐转换
      let eatstarttype = this.resDetail.eatstarttype;
      if (eatstarttype) {
        switch (eatstarttype) {
          case "1":
            this.resDetail.eatstarttype = "含早、中、晚餐";
            break;
          case "2":
            this.resDetail.eatstarttype = "含中、晚餐";
            break;
          case "3":
            this.resDetail.eatstarttype = "含晚餐";
        }
      }
      //结束：早中晚餐转换
      let eatendtype = this.resDetail.eatendtype;
      if (eatendtype) {
        switch (eatendtype) {
          case "1":
            this.resDetail.eatendtype = "含早餐";
            break;
          case "2":
            this.resDetail.eatendtype = "含早、中餐";
            break;
          case "3":
            this.resDetail.eatendtype = "含早、中、晚餐";
        }
      }
      this.stdApply = true;
      let that = this;
      this.common.outPutPdfFn(that, 'stdApply', 'normal-table', row.classname + "申请表")
      // this.$nextTick(() =>
      //   that.common.transToPdf(row.classname + "申请表", "stdApply", that)
      // );
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

    // 查询
    search() {
      this.getList(1);
    },
    // 重置
    reSet() {
      this.searchForm = {};
      this.getList(1);
    },
    // 点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(this.currentPage);
    },
    //tab切换
    handleClick() {
      this.currentPage = 1;
      this.getList(1);
    },
    // 跳转详情
    goDetail(row) {
      this.$router.push({
        path: `practive-BM-audit/audit-detail/${row.id}`,
        query: {
          activeName: this.activeName,
          currentPage: this.currentPage,
          // data: JSON.stringify(row),
          isRearService: this.isRearService
        }
      });
    },
    // 编辑
    editAudit(row) {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/prapply/findById",
          data: {
            id: row.id
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            this.dialogVisible = true;
            let apply = res.item.apply;
            this.form = res.item.apply || {};
            this.form.stuinfofilename =
              (res.item.attment && res.item.attment.TITLE) || "";
            this.teacherList = res.item.teachers || [];
            this.studentList = res.item.students || [];
            this.form.prdaterange = apply.prstarttime
              ? [apply.prstarttime, apply.prendtime]
              : [];
            this.form.sleepdaterange = apply.sleepstarttime
              ? [apply.sleepstarttime, apply.sleependtime]
              : [];
            this.form.eatdaterange = apply.eatstarttime
              ? [apply.eatstarttime, apply.eatendtime]
              : [];
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "获取详情失败！"
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: "获取详情失败！" + err
          });
        });
    },
    // 获取学生信息表
    getFileInfo(data) {
      this.form.stuinfofileid = data.ID;
      this.form.stuinfofilename = data.TITLE;
    },

    //删除文件
    deleteFile() {
      this.form.stuinfofileid = "";
      this.form.stuinfofilename = "";
    },

    //删除教师
    deleteTeacher(index) {
      this.teacherList.splice(index, 1);
    },

    //验证手机号码格式
    isPoneAvailable(phone) {
      let myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!myreg.test(phone)) {
        return false;
      } else {
        return true;
      }
    },

    //新增教师
    addTeacher() {
      if (this.teacherList && this.teacherList.length > 0) {
        let length = this.teacherList.length;
        if (
          this.teacherList[length - 1].teachername &&
          this.teacherList[length - 1].teachermobile
        ) {
          if (
            this.isPoneAvailable(this.teacherList[length - 1].teachermobile)
          ) {
            this.teacherList.push({
              teacherid: "",
              teachername: "",
              teachermobile: ""
            });
          } else {
            this.$message({
              type: "warning",
              message: "手机格式不正确"
            });
          }
        } else {
          this.$message({
            type: "warning",
            message: "请填写教师名称和联系方式"
          });
        }
      } else {
        this.teacherList.push({
          teacherid: "",
          teachername: "",
          teachermobile: ""
        });
      }
    },

    submit(type) {
      // return false;
      let form = this.$refs.child.form;
      console.log(form);
      // return false;
      this.$refs.child.$refs.form.validate(valid => {
        if (valid) {
          let form = this.$refs.child.form;
          let teacherList = this.$refs.child.teacherList;

          if (teacherList && teacherList.length == 0) {
            this.$message({
              type: "warning",
              message: "请添加参与教师"
            });
          } else {
            if (
              !teacherList.every(v => v.teachername) ||
              !teacherList.every(v => v.teachermobile)
            ) {
              this.$message({
                type: "warning",
                message: "请填写教师名称和联系方式"
              });
            } else if (
              teacherList.every(v => {
                this.isPoneAvailable(v.teachermobile);
              })
            ) {
              this.$message({
                type: "warning",
                message: "参与老师列表内有手机格式不正确"
              });
            } else {
              if (
                this.$refs.child.tableData &&
                !this.$refs.child.tableData.length
              ) {
                // if(!form.stuinfofilename && !form.stuinfofilename){
                this.$message({
                  type: "warning",
                  message: "请上传学生信息表"
                });
              } else {
                this.$refs.child.checkAllTable();
                // let form2 = {};
                let url = "";
                let message = "";
                let text = "";
                if (type == 0) {
                  // form2.note = form.event.eventnote;
                  url = "/prapply/saveDraft";
                  message = "保存成功";
                  text = "保存中";
                } else if (type == 1) {
                  // form.event={};
                  url = "/prapply/save";
                  message = "提交成功";
                  text = "提交中";
                  this.currentPage = 1;
                } else if (type == 2) {
                  // form.event={};
                  url = "/prapply/edit";
                  message = "编辑成功";
                  text = "编辑中";
                }

                //教师列表
                /* teacherList.forEach(v=>{
                   v.teacherid=JSON.parse(v.teacherInfo).id;
                   v.teachername=JSON.parse(v.teacherInfo).name;
                 })*/
                form.teacherList = teacherList;
                let studentList = this.$refs.child.tableData.map(t => {
                  let obj = { ...t };
                  obj.sex = obj.sex === "男" ? 1 : 0;
                  return obj;
                });
                form.studentList = studentList;

                //当食宿没有选择时
                if (form.issleep == "0") {
                  form.sleepstarttime = "";
                  form.sleependtime = "";
                  form.sleepboynum = 0;
                  form.sleepgirlnum = 0;
                }
                if (form.iseat == "0") {
                  form.eatstarttime = "";
                  form.eatendtime = "";
                  form.eatstarttype = "";
                  form.eatendtype = "";
                  form.eatpersonnum = 0;
                  form.eatmpersonnum = 0;
                }

                //时间转换格式
                form.prstarttime = form.prstarttime
                  ? this.util.formatTime(form.prstarttime, "yyyyMMdd000000")
                  : "";
                form.prendtime = form.prendtime
                  ? this.util.formatTime(form.prendtime, "yyyyMMdd000000")
                  : "";
                form.sleepstarttime = form.sleepstarttime
                  ? this.util.formatTime(form.sleepstarttime, "yyyyMMdd000000")
                  : "";
                form.sleependtime = form.sleependtime
                  ? this.util.formatTime(form.sleependtime, "yyyyMMdd000000")
                  : "";
                // form.eatstarttime = form.eatstarttime
                //   ? this.util.formatTime(form.eatstarttime, "yyyyMMdd000000")
                //   : "";
                // form.eatendtime = form.eatendtime
                //   ? this.util.formatTime(form.eatendtime, "yyyyMMdd000000")
                //   : "";
                form.eatstarttime = form.eatstarttime
                  ? this.util.formatTime(
                      this.util.formatMYD(form.eatstarttime),
                      "yyyyMMdd000000"
                    )
                  : "";
                form.eatendtime = form.eatendtime
                  ? this.util.formatTime(
                      this.util.formatMYD(form.eatendtime),
                      "yyyyMMdd000000"
                    )
                  : "";

                // console.log("form2",form);

                const loading = this.$loading({
                  lock: true,
                  text: text,
                  spinner: "el-icon-loading",
                  background: "rgba(0, 0, 0, 0.7)"
                });

                this.util
                  .postAjax({
                    code: this.global.code,
                    url: url,
                    isRep: true,
                    data: form
                  })
                  .then(res => {
                    loading.close();
                    if (res.success == true) {
                      this.dialogVisible = false;
                      this.$message({
                        type: "success",
                        message: message
                      });
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
            }
          }
        }
      });

      // return false;
    },
    // 审批
    auditOperate(row) {
      this.$router.push({
        path: `practive-BM-audit/audit-operate/${row.id}`,
        query: {
          activeName: this.activeName,
          currentPage: this.currentPage
        }
      });
    },
    // 获取列表
    getList(page) {
      this.pageLoading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/prapply/pageList",
          data: {
            params: JSON.stringify({
              page: page,
              limit: this.limit,
              applytype: this.activeName,
              orgid: this.searchForm.orgid,
              classname: this.searchForm.classname,
              applytime: this.searchForm.applytime
                ? this.util.formatTime(
                    this.searchForm.applytime,
                    "yyyyMMdd000000"
                  )
                : null,
              orderBy: this.orderBy,
              sort: this.sort
            })
          }
        })
        .then(res => {
          this.pageLoading = false;
          if (res.success == true) {
            let str = this.isRearService ? "hqList" : "bmList";
            this.auditList = res.item[str].list || [];
            this.totalPage = res.item[str].total;
            this.currentPage = page;
            // this.auditList.forEach(a => {
            //    a.events.forEach(e => {
            //      if (e.eventer === this.userInfo.ID) {
            //        a.eventer = e.eventername
            //      }
            //    })
            // })
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "获取列表失败！"
            });
          }
        });
      /*.catch(err => {
          this.$message({
            showClose: true,
            type: "error",
            message: "获取列表失败！" + err
          });
        });*/
    }
  },
  created() {
    this.getList(1);
  },

  beforeDestroy() {
    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("activeName");
  }
};
</script>

<style scoped lang="scss">
.btn-img {
  width: 14px;
  height: 14px;
}
#tmpTable {
  padding: 100px 10px;
  margin-top: 2000px;
  width: 900px;
  h2 {
    margin: 20px;
    text-align: center;
  }
  table {
    width: 70%;
    margin: 0 auto;
  }
  th,
  td {
    text-align: center;
    line-height: 30px;
    border: 1px solid black;
  }
}
</style>
