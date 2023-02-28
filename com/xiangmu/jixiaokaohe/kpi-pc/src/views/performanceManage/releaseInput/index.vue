<template>
  <!---------------------------- 发放录入 ---------------------------->
  <div class="base-tab" ref="baseTab">
    <div class="table-title clearfix">
      <h3>发放录入</h3>
      <!---------------------------- 查询条件 ---------------------------->
      <div class="search-right">
        <el-button type="primary" size="small" @click="jump"
          >历史发放记录</el-button
        >
      </div>
    </div>
    <div class="tab-content">
      <div class="base-search-table">
        <div class="search-box clearfix">
          <div class="search-box-left">
            <div style="margin-bottom: 15px">
              <label>选择年度：</label>
              <el-date-picker
                v-model="year"
                type="year"
                placeholder="选择年"
                size="small"
                format="yyyy年"
                value-format="yyyy"
                style="width: 200px"
                :clearable="false"
              ></el-date-picker>
              <label style="margin-left: 100px">发放名称：</label>
              <el-input
                class="input-box"
                v-model="name"
                placeholder="请输入名称"
                style="width: 300px"
                size="small"
                clearable
              ></el-input>
            </div>
            <div>
              <label>考核材料：</label>
              <el-button
                icon="el-icon-upload2"
                plain
                size="small"
                @click="uploadFile"
                :loading="uploadFileLoading"
                >上传文件</el-button
              >
              或
              <history-files ref="historyFiles" :checkedData.sync="checkedFiles"></history-files>
              <span class="tips"
                >请上传考核结果相关证明材料，支持扩展名：.rar .zip .doc .docx
                .pdf .jpg...</span
              >
              <div class="attach-div">
                <span
                  class="attach"
                  v-for="(file, index) in uploadItemfiles"
                  :key="index"
                >
                  <span>
                    <img src="@/assets/img/fujian.png" alt />
                    <span @click="common.downloadFile(file.ID)">{{
                      file.TITLE
                    }}</span>
                    <i class="el-icon-close" @click="deleteFiles(index)"></i>
                  </span>
                </span>
                <span
                  class="attach"
                  v-for="(file, index) in checkedFiles"
                  :key="file.id"
                >
                  <span>
                    <img src="@/assets/img/fujian.png" alt />
                    <span @click="common.downloadFile(file.fileid)">{{
                      file.filename
                    }}</span>
                    <i class="el-icon-close" @click="deleteCheckedFiles(index)"></i>
                  </span>
                </span>
              </div>
            </div>
            <div>
              <label>录入名单：</label>
              <base-user-select
                :vmodel.sync="user"
                style="width: 200px"
                @doFunc="(val) => changeSelect(val)"
              ></base-user-select>
              <el-button
                style="margin-left: 10px"
                class="orange-btn"
                type="primary"
                size="small"
                icon="el-icon-search"
                @click="addClick"
                >添加</el-button
              >
              <el-button
                style="margin-left: 10px"
                class="orange-btn"
                type="primary"
                size="small"
                icon="el-icon-upload2"
                @click="uploadExcel"
                :loading="uploadExcelLoading"
                >导入</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-download"
                @click="downloadTemp"
                >下载模板</el-button
              >
            </div>
          </div>
        </div>
        <!---------------------------- 表格 ---------------------------->
        <el-table
          :data="tableData"
          style="width: 100%"
          header-row-class-name="table-header"
        >
          <el-table-column
            type="index"
            label="序号"
            width="100"
          ></el-table-column>
          <el-table-column prop="username" label="姓名" show-overflow-tooltip>
            <template slot-scope="scope"
              >{{ scope.row.username }}（{{ scope.row.userid }}）</template
            >
          </el-table-column>
          <el-table-column
            prop="orgname"
            label="部门"
            :formatter="common.defaultFormat"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="groupname"
            label="考核分组"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="joblvname"
            label="领导岗位级别"
            :formatter="common.defaultFormat"
            min-width="110"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="rylxm"
            label="人员类型"
            min-width="100"
            :formatter="common.defaultFormat"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="specialsalary"
            label="发放金额(元)"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.specialsalary"
                @keyup.native="
                  common.moneyInput($event, scope.row.specialsalary)
                "
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span @click="handleDel(scope.$index)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="btn-footer">
        <label>发放合计：</label>
        <span class="mg-r20">{{ alltotal }}元</span>
        <el-button size="small" type="primary" @click="handleClear"
          >清空</el-button
        >
        <el-button
          :disabled="alltotal == 0"
          type="primary"
          size="small"
          :loading="submitLoading"
          @click="handleSubmit"
          >提交确认</el-button
        >
      </div>
      <!-- ----------------------- 上传excel表格 ----------------------- -->
      <upload
        v-show="false"
        :multiple="false"
        :size="51200"
        exts="xlsx|xls|cvs"
        @done="uploadedExcel"
        @choose="uploadExcelLoading = true"
        :url="uploadExcelUrl"
        ref="uploadExcel"
      ></upload>
      <!-- ----------------------- 上传证明材料组件 ----------------------- -->
      <upload
        v-show="false"
        :multiple="false"
        :size="51200"
        exts="pdf|rar|zip|doc|docx|jpg|png|jpeg|xlsx|xls|txt"
        @done="uploadedFile"
        @choose="uploadFileLoading = true"
        :url="uploadUrl"
        ref="uploadFile"
      ></upload>
    </div>
  </div>
</template>

<script>
import upload from "@/components/BaseUpload";
import BaseUserSelect from "../components/BaseUserSelect";
import { saveKpi } from "@/api/kpi/manage";
import HistoryFiles from "./historyFiles.vue";
import { saveFileBatch } from '@/api/kpi/historyFile'
export default {
  components: { upload, BaseUserSelect, HistoryFiles },
  data() {
    return {
      uploadUrl: window.g.uploadUrl,
      uploadFileLoading: false,
      year: null,
      name: "",
      user: null,
      userInfo: null,
      submitLoading: false,
      tableData: [],
      uploadExcelUrl: window.g.url + "kpi/importData",
      uploadExcelLoading: false,
      uploadItemfiles: [],
      checkedFiles: [],  // 已选择的历史材料
    };
  },
  computed: {
    alltotal() {
      let sum = 0;
      this.tableData.forEach((item) => {
        sum = this.common.add(sum, item.specialsalary, 2);
      });
      return sum;
    },
  },
  methods: {
    // 上传材料
    uploadFile() {
      this.$refs.uploadFile.toupload();
    },
    // 上传完成
    uploadedFile(res) {
      this.uploadFileLoading = false;
      if (res.success) {
        this.uploadItemfiles.unshift(res.data[0]);
      } else {
        this.$message({
          showClose: true,
          message: "上传失败！",
          type: "error",
        });
      }
    },
    // 删除历史选择的材料
    deleteCheckedFiles(index) {
      this.checkedFiles.splice(index,1);
    },
    // 删除刚上传文件
    deleteFiles(index) {
      this.uploadItemfiles.splice(index, 1);
    },
    jump() {
      this.$router.push("/inputHistory");
    },
    // 下载模板
    downloadTemp() {
      let url = `${window.g.url}kpi/exportTemplate`;
      window.open(url, "_blank");
    },
    addClick() {
      if (!this.userInfo) {
        return false;
      }
      let ids = this.tableData.map((v) => v.userid);
      if (ids.includes(this.userInfo.id)) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "该用户已存在！",
        });
        return false;
      }
      let newUser = this.userInfo;
      (newUser.userid = this.userInfo.id),
        (newUser.username = this.userInfo.name);
      // delete newUser.id;
      this.tableData.unshift(newUser);
    },
    // 改变选择值
    changeSelect(val) {
      let user = JSON.parse(val);
      this.userInfo = user;
    },

    handleDel(index) {
      this.tableData.splice(index, 1);
    },

    //清空人员对应的特殊发放值
    handleClear() {
      this.tableData.forEach((item) => {
        item.specialsalary = "";
      });
    },

    // 提交
    handleSubmit() {
      if (!this.name) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "发放名称不能为空！",
        });
        return false;
      }
      this.$confirm(`确认要提交『 ${this.name} 』吗?`, "确认要提交吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let newArr = [];
          this.tableData.forEach((item) => {
            newArr.push({
              kpiid: item.kpiid || null,
              id: null,
              userid: item.userid,
              username: item.username,
              totalsalary: item.specialsalary - 0 || 0,
              specialsalary: item.specialsalary - 0 || 0,
              joblvname: item.joblvname,
              orgname: item.orgname,
              rylxm: item.rylxm,
              groupid: item.groupid,
              groupname: item.groupname,
            });
          });
          let attachs = this.uploadItemfiles.map((v) => v.ID);
          let historyFiles = this.checkedFiles.map(v => v.fileid);
          let data = {
            attachment: [...attachs,...historyFiles].join(","),
            name: this.name,
            details: newArr,
            id: (this.kpiData && this.kpiData.id) || null,
            monthdate: "",
            savetype: 2, // 1录入 2 提交
            totalfee: this.alltotal - 0,
            totalman: this.tableData.length,
            type: 3, // 1 月度绩效 2年度绩效 3特殊发放 4系统生成
            yeardate: this.year,
          };
          this.submitLoading = true;

          saveKpi(data)
            .then((res) => {
              this.submitLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  message: `提交成功！`,
                  type: "success",
                });
                // 保存新材料
                this.saveNewFile(this.uploadItemfiles);
                // 清空表单
                this.name = "";
                this.user = "";
                this.userInfo = "";
                this.tableData = [];
                this.uploadItemfiles = [];
                this.checkedFiles = [];
                this.$refs.historyFiles.firstClick = true;
              } else {
                this.$message({
                  showClose: true,
                  message: `提交成功！`,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.submitLoading = false;
            });
        })
        .catch((err) => {});
    },
    
    // 保存新上传的材料
    saveNewFile(files) {
      if (files.length > 0) {
        let arr = files.map(i => {
          return {
            fileid: i.ID,
            filename: i.TITLE
          }
        });
        saveFileBatch(arr).then(res => {}).catch(err=>{})
      }
    },

    // 上传
    uploadExcel() {
      this.$refs.uploadExcel.toupload();
    },
    // 上传完成
    uploadedExcel(res) {
      this.uploadExcelLoading = false;
      if (res.success && res.data && res.data.importflag) {
        let list = res.data.details || [];
        let num = 0,
          uionArr = [];
        list.forEach((user) => {
          if (this.tableData.some((i) => i.userid == user.userid)) {
            num++;
          } else {
            uionArr.push(user);
          }
        });
        this.tableData = this.tableData.concat(uionArr);
        this.$message({
          showClose: true,
          message: `上传成功！${num ? `有${num}条重复的人` : ""}`,
          type: "success",
        });
      } else {
        let error = res.data && res.data.errMsg;
        let errorArr = Object.values(error);
        this.$message({
          showClose: true,
          message: `上传失败！${errorArr.join(",")}`,
          type: "error",
        });
      }
    },
  },
  created() {
    this.year = this.moment().format("YYYY");
  },
};
</script>

<style lang="scss" scoped>
.base-search-table .search-box {
  border-top: 1px solid #dbdbdb;
  padding: 15px !important;
}
.tab-content {
  position: relative;
  min-height: 500px;
}
.search-box {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  .search-box-left {
    float: left;
  }
  label {
    color: #5f6464;
  }
  .tips {
    margin-left: 10px;
    color: rgba(0, 0, 0, 0.65);
  }
}
.search-box-right {
  & > div {
    display: inline-block;
  }
}
.el-divider--vertical {
  margin: 0 10px;
}
.base-search-table {
  padding-bottom: 80px;
}
.table-title {
  height: 53px;
  line-height: 53px;
  padding: 0 20px;
  h3 {
    display: inline-block;
    width: 20%;
    min-width: 150px;
    font-size: 16px;
    height: 22px;
    line-height: 22px;
    color: #373b4b;
    font-weight: 600;
  }
  .search-right {
    float: right;
  }
}
</style>
