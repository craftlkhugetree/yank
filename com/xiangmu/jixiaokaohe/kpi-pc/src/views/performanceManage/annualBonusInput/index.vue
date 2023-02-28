<template>
  <!---------------------------- tab页 ---------------------------->
  <div class="base-tab" ref="baseTab">
    <p v-if="groupList.length == 0" style="padding: 60px 20px">暂无数据</p>
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane
        v-for="tab in groupList"
        :key="tab.id"
        :title="tab.name"
        :name="tab.id"
      >
        <span slot="label">{{ tab.name }}</span>
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
                    style="width: 140px"
                    :clearable="false"
                    @change="changeTime"
                  ></el-date-picker>
                  <span class="tips">当前考核{{ tableData.length }}人</span>
                  <el-button
                    style="margin-left: 10px"
                    type="primary"
                    size="small"
                    @click="syncUser"
                    v-show="status == '1'"
                    >同步数据</el-button
                  >
                </div>
                <!---------------------------- 已审核补充附件 ---------------------------->
                <div v-if="status == '4'">
                  <label>补充考核材料：</label>
                  <template>
                    <el-button
                      icon="el-icon-upload2"
                      plain
                      size="small"
                      @click="uploadEdit"
                      :loading="uploadEditLoading"
                      >上传文件</el-button
                    >
                    <span class="tips"
                      >请上传本月部门考核结果相关证明材料，支持扩展名：.rar .zip
                      .doc .docx .pdf .jpg...</span
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
                          <i
                            class="el-icon-close"
                            @click="deleteEditFiles(index)"
                          ></i>
                        </span>
                      </span>
                    </div>
                  </template>
                </div>
                <!----------------------------其他状态下上传附件 ---------------------------->
                <div v-else>
                  <label>考核材料：</label>
                  <template v-if="status == '1'">
                    <el-button
                      icon="el-icon-upload2"
                      plain
                      size="small"
                      :loading="uploadLoading"
                      @click="upload"
                      >上传文件</el-button
                    >
                    <span class="tips"
                      >请上传本年度部门考核结果相关证明材料，支持扩展名：.rar
                      .zip .doc .docx .pdf .jpg...</span
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
                          <i
                            class="el-icon-close"
                            @click="deleteFiles(index)"
                          ></i>
                        </span>
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="attach"
                      v-for="(item, index) in attaches"
                      :key="item.ID"
                    >
                      <img src="@/assets/img/fujian.png" alt />
                      <span @click="common.downloadFile(item.ID)">{{
                        item.TITLE
                      }}</span>
                      <i
                        v-show="status == '1'"
                        class="el-icon-close"
                        @click="deleteAttaches(index)"
                      ></i>
                    </div>
                    <div class="attach" v-if="attaches.length == 0">无</div>
                  </template>
                </div>
                <!---------------------------- 导入excel ---------------------------->
                <div v-if="status == '1'">
                  <label>模板录入：</label>
                  <el-button
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
            <!---------------------------- 标题 ---------------------------->
            <div class="h3-title">
              <h3 v-if="kpiData">『 {{ tab.name }} 』{{ year }}年终绩效清单</h3>
            </div>
            <!---------------------------- 步骤条 ---------------------------->
            <step-box :kpiData="kpiData" :groupWorks="groupWorks"></step-box>
            <!---------------------------- 记录 ---------------------------->
            <section class="record-box" v-show="eventList.length">
              <div :class="{ noexpend: !isOpen }">
                <div
                  v-for="event in eventList"
                  :key="event.id"
                  :name="event.id"
                >
                  <span class="record">
                    <i class="status-blue"></i>
                    {{
                      moment(event.createtime, "YYYYMMDDHHmmss").format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    }}
                    <span class="blue-txt">{{ event.creatername }}</span>
                    {{ eventType[event.type]
                    }}{{
                      ["4", "5"].includes(event.type)
                        ? event.result == "1"
                          ? `通过 ${event.note}`
                          : `不通过 ${event.note}`
                        : ""
                    }}
                  </span>
                </div>
                <span class="record-btn" @click="isOpen = !isOpen">
                  <span v-if="isOpen">
                    <i class="el-icon-arrow-up"></i>收起记录
                  </span>
                  <span v-else>
                    <i class="el-icon-arrow-down"></i>展开记录
                  </span>
                </span>
              </div>
            </section>

            <!---------------------------- 表格 ---------------------------->
            <el-table
              :data="tableData"
              style="width: 100%"
              header-row-class-name="table-header"
              v-loading="tableLoading"
            >
              <el-table-column
                type="index"
                label="序号"
                width="80"
              ></el-table-column>
              <el-table-column
                prop="username"
                label="姓名"
                show-overflow-tooltip
              >
                <template slot-scope="scope"
                  >{{ scope.row.username }}（{{ scope.row.userid }}）</template
                >
              </el-table-column>
              <el-table-column
                prop="orgname"
                label="部门"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="joblvname"
                label="领导岗位级别"
                show-overflow-tooltip
                :formatter="common.defaultFormat"
              ></el-table-column>
              <el-table-column
                prop="rylxm"
                label="人员类型"
                show-overflow-tooltip
                :formatter="common.defaultFormat"
              ></el-table-column>
              <el-table-column
                prop="yearsalary"
                label="年终考核奖(元)"
                :formatter="common.defaultFormat"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.yearsalary"
                    @keyup.native="
                      common.moneyInput($event, scope.row.yearsalary)
                    "
                    placeholder="请输入"
                    v-if="status == '1'"
                  ></el-input>
                  <i v-else>{{ scope.row.yearsalary }}</i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="btn-footer" v-if="groupList.length">
      <label>可用额度：</label>
      <span class="mg-r30" :class="{ 'red-txt': availableFund < 0 }"
        >{{ availableFund }}元</span
      >
      <label>年终考核奖合计：</label>
      <span class="mg-r20">{{ alltotal }}元</span>
      <span v-show="status == '1'">
        <el-button size="small" type="primary" @click="handleClear"
          >清空</el-button
        >
        <el-button
          type="primary"
          size="small"
          :disabled="availableFund < 0"
          :loading="submitLoading"
          @click="handleSubmit(2)"
          >提交确认</el-button
        >
        <el-button
          size="small"
          type="success"
          :loading="saveLoading"
          :disabled="availableFund < 0"
          @click="handleSubmit(1)"
          >保存草稿</el-button
        >
      </span>
      <span>
        <el-button
          v-show="status == '2' || status == '3'"
          v-if="kpiData && userInfo.ID == kpiData.createrid"
          size="small"
          type="warning"
          @click="doRecall"
          >撤回</el-button
        >
        <span v-else>
          <span v-show="!confirmids.includes(userInfo.ID) && status == '2'">
            <el-input
              v-model="explain"
              class="explain-input"
              style="width: 300px"
              placeholder="请输入说明"
            ></el-input>
            <el-button size="small" type="warning" @click="doConfirm('0')"
              >不通过</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button size="small" type="primary" @click="doConfirm('1')"
              >通过</el-button
            >
          </span>
        </span>
      </span>
    </div>

    <!-- ----------------------- 上传组件 ----------------------- -->
    <upload
      v-show="false"
      :multiple="false"
      :size="51200"
      exts="pdf|rar|zip|doc|docx|jpg|png|jpeg|xlsx|xls|txt"
      @done="uploaded"
      @choose="uploadLoading = true"
      :url="uploadUrl"
      ref="upload"
    ></upload>
    <!-- ----------------------- 补充材料上传组件 ----------------------- -->
    <upload
      v-show="false"
      :multiple="false"
      :size="51200"
      exts="pdf|rar|zip|doc|docx|jpg|png|jpeg|xlsx|xls|txt"
      @done="uploadedEdit"
      @choose="uploadEditLoading = true"
      :url="uploadUrl"
      ref="uploadEdit"
    ></upload>
    <!-- ----------------------- 导入excel组件 ----------------------- -->
    <upload
      v-show="false"
      :multiple="false"
      :size="51200"
      exts="xlsx|xls"
      @done="uploadedExcel"
      @choose="uploadExcelLoading = true"
      :url="uploadExcelUrl"
      ref="uploadExcel"
    ></upload>
  </div>
</template>
<script>
import upload from "@/components/BaseUpload";
import stepBox from "../components/StepBox";
import {
  saveKpi,
  findKpiByDate,
  confirmKpi,
  withdrawKpi,
  saveAttachment,
} from "@/api/kpi/manage";
import { fetchMyGroupList, fetchGroupDetail } from "@/api/admin/group";
import { fetchAllUserList } from "@/api/admin/users";
import { fetchQuotaList } from "@/api/admin/quota";
import { fetchFileInfo } from "@/api/kpi/awardList";
export default {
  components: {
    upload,
    stepBox,
  },
  data() {
    return {
      isOpen: true,
      submitLoading: false,
      saveLoading: false,
      activeTab: null,
      explain: "",
      groupList: [],
      ativeName: null,
      kpiData: null,
      year: null,
      files: [],
      yearquota: "",
      quota: {
        used: "",
        last: "",
      },
      tableLoading: false,
      beforeData: [],
      tableData: [],
      availableFund: "",
      uploadUrl: window.g.uploadUrl,
      uploadLoading: false,
      uploadItemfiles: [],
      uploadExcelUrl: window.g.excelUrl,
      uploadExcelLoading: false,
      uploadEditLoading: false,
      groupWorks: [],
      eventList: [], // type 1发起 2撤回 3提交 4确认 5审核
      //发放状态：1未发放2暂不发放3已发放
      eventType: [
        "",
        "发起录入",
        "撤回录入",
        "提交录入结果，发起内部确认",
        "确认",
        "审核",
      ],
      status: "1", //返回的状态 1草稿 2已提交 3已确认4已审核
      confirmids: [],
      attaches: [],
      saveTableData: [],
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },

    alltotal() {
      let sum = 0,
        grant = 0;
      this.tableData.forEach((item) => {
        let yearsalary = this.common.filterInput(item.yearsalary);
        sum = this.common.add(sum, yearsalary, 2);
      });
      this.availableFund = this.common.subtract(this.yearquota, sum, 2);
      return sum;
    },
  },
  created() {
    this.year = this.moment().format("YYYY");
  },
  mounted() {
    this.getGroupList();
  },
  methods: {
    //同步当前用户组数据
    syncUser() {
      let param = {
        groupid: this.activeTab,
      };
      fetchAllUserList(param).then((res) => {
        if (res.success) {
          let syncData = res.data || [];
          syncData.forEach((item) => {
            item.userid = item.id;
            item.username = item.name;
            item.outsalary = item.salary;
            this.beforeData.forEach((last) => {
              if (last.userid == item.id) {
                item.lastmonth = last.monthsalary;
                item.lastother = last.othersalary;
              }
            });

            let saveData = _.cloneDeep(this.saveTableData);
            if (saveData.length) {
              saveData.forEach((save) => {
                if (save.userid == item.userid) {
                  let { yearsalary, totalsalary } = save;
                  item.yearsalary = save.yearsalary;
                  item.totalsalary = save.totalsalary;
                }
              });
            }
            delete item.id;
          });
          this.tableData = syncData;
        }
      });
    },
    // 上传模板
    uploadExcel() {
      this.$refs.uploadExcel.toupload();
    },
    // 模板数据上传完成
    uploadedExcel(res) {
      this.uploadExcelLoading = false;
      if (res.success) {
        let list = res.data || [];
        this.tableData.map((user) => {
          let excelUser = list.filter((i) => i[0] == user.userid);
          if (excelUser.length) {
            let excel = excelUser[0];
            this.$set(user, "yearsalary", excel[2]);
            // user.yearsalary = excel[2];
          }
        });
        this.$message({
          showClose: true,
          message: `导入成功`,
          type: "success",
        });
      } else {
        this.$message({
          showClose: true,
          message: `导入失败！`,
          type: "error",
        });
      }
    },
    // 年份 下载excel模板
    downloadTemp() {
      let url = `${window.g.url}kpi/yearTemplate`;
      window.open(url, "_blank");
    },
    changeTime() {
      this.uploadItemfiles = [];
      this.getQuota();
      this.getSaveData();
    },
    // 获取组下已保存的数据
    getSaveData() {
      let param = {
        type: 2,
        groupid: this.activeTab,
        year: this.year,
        month: null,
      };
      this.tableLoading = true;
      findKpiByDate(param).then((res) => {
        if (res.success) {
          let kpiItmes = res.data;
          this.kpiData = kpiItmes;
          this.confirmids =
            (kpiItmes.confirmids && kpiItmes.confirmids.split(",")) || [];
          this.quota.used = kpiItmes.totalfee || 0;
          this.quota.last = this.common.subtract(
            this.yearquota,
            kpiItmes.totalfee,
            2
          );
          this.tableData = kpiItmes.details || [];
          this.saveTableData = _.cloneDeep(kpiItmes.details) || [];
          let eventArr = kpiItmes.events || []; //事件排序
          eventArr.sort((a, b) => {
            return a.createtime < b.createtime ? 1 : -1;
          });
          this.eventList = eventArr;
          this.status = res.data.status || "1";
          if (!this.tableData.length) {
            this.getTableData();
          }
          if (kpiItmes.attachment) {
            let fileIds = kpiItmes.attachment.split(",");
            this.getFileList(fileIds);
          } else {
            this.attaches = [];
          }
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
    },

    handleClear() {
      this.getSaveData();
    },

    // 获取文件列表
    getFileList(ids) {
      // 获取考核文件
      if (ids.length > 0) {
        fetchFileInfo({ IDs: ids }).then((res) => {
          if (res.success) {
            let data = res.data || {};
            let arr = [];
            for (let key in data) {
              arr.push(data[key]);
            }
            this.attaches = arr;
            this.uploadItemfiles = arr;
          }
        });
      }
    },
    // 组下的用户列表
    getTableData() {
      let param = {
        groupid: this.activeTab,
      };
      fetchAllUserList(param).then((res) => {
        if (res.success) {
          let newData = res.data || [];
          newData.forEach((item) => {
            item.userid = item.id;
            item.username = item.name;
            item.outsalary = item.salary;
            delete item.id;
          });
          this.tableData = newData;
        }
      });
    },
    // 获取考核分组
    getGroupList() {
      let data = {};
      fetchMyGroupList(data)
        .then((res) => {
          this.groupList = res.data || [];
          if (this.groupList.length) {
            this.activeTab = this.groupList[0].id;
            this.ativeName = this.groupList[0].name;
            this.getSaveData();
            this.getGroupDetail();
            this.getQuota();
          }
        })
        .catch((err) => {});
    },

    // 获取分组详情
    getGroupDetail() {
      let param = {
        id: this.activeTab,
      };
      fetchGroupDetail(param)
        .then((res) => {
          if (res.success) {
            this.groupWorks = (res.data && res.data.workers) || [];
          }
        })
        .catch((err) => {});
    },
    //组下的额度
    getQuota() {
      let param = {
        groupid: this.activeTab,
        kpiyear: this.year,
      };
      fetchQuotaList(param)
        .then((res) => {
          if (res.success) {
            let quota = res.data[0];
            this.yearquota = quota ? quota.yearquota : "";
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    // 补充上传
    uploadEdit() {
      this.$refs.uploadEdit.toupload();
    },
    // 补充上传
    uploadedEdit(res) {
      this.uploadEditLoading = false;
      if (res.success) {
        this.uploadItemfiles.unshift(res.data[0]);
        this.editAttach();
      } else {
        this.$message({
          showClose: true,
          message: "上传失败！",
          type: "error",
        });
      }
    },
    //删除补充材料
    deleteEditFiles(index) {
      this.uploadItemfiles.splice(index, 1);
      this.editAttach();
    },
    //只修改附件
    editAttach() {
      let attachs = this.uploadItemfiles.map((v) => v.ID);
      let data = {
        attachment: attachs.join(","),
        kpiid: this.kpiData.id,
      };
      saveAttachment(data).then((res) => {});
    },

    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.uploadLoading = false;
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
    // 删除已经上传文件 （草稿、已撤回）
    deleteAttaches(index) {
      this.attaches.splice(index, 1);
    },

    // 删除上传文件 清空隐藏的绑定文件值
    deleteFiles(index) {
      this.uploadItemfiles.splice(index, 1);
    },
    //确认通过 不通过
    doConfirm(flag) {
      let { id } = this.kpiData;
      let param = {
        kpiid: id,
        note: this.explain,
        result: flag,
        type: 4,
      };
      confirmKpi(param).then((res) => {
        if (res.success) {
          this.$message({
            showClose: true,
            message: "内部确认成功！",
            type: "success",
          });
          this.getSaveData();
          this.explain = "";
        } else {
          this.$message({
            showClose: true,
            message: "内部确认失败！",
            type: "error",
          });
        }
      });
    },

    // 撤回
    doRecall(row) {
      let tip =
        this.status == "2"
          ? "考核工作组确认中"
          : this.status == "3"
          ? "分管领导审核中"
          : "";
      this.$confirm(
        `『 ${this.year}年终绩效清单 』${tip}，确认要撤回吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let { id } = this.kpiData;
          let param = {
            kpiid: id,
            type: 2, //1发起 2撤回 3提交 4确认 5审核
          };
          withdrawKpi(param).then((res) => {
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: `撤回成功！`,
              });
              this.getSaveData();
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: `撤回失败：${
                  res.data.message || res.data.errInf.shortBusInf
                }`,
              });
            }
          });
        })
        .catch((err) => {});
    },

    // 点击tab
    handleClick(tab, event) {
      this.uploadItemfiles = [];
      this.activeTab = tab.name;
      this.ativeName = event.target.innerText;
      this.getSaveData();
      this.getGroupDetail();
      this.getQuota();
    },

    // 考核组人提交 、保存草稿
    handleSubmit(flag) {
      if (!this.yearquota) {
        this.$message({
          showClose: true,
          type: "warning",
          message: `暂无年考核奖额度！`,
        });
        return false;
      }
      let newArr = [];
      this.tableData.forEach((item) => {
        newArr.push({
          kpiid: item.kpiid || null,
          id: item.id || null,
          userid: item.userid,
          username: item.username,
          totalsalary: item.yearsalary - 0 || 0,
          yearsalary: item.yearsalary - 0 || 0,
          joblvname: item.joblvname,
          orgname: item.orgname,
          rylxm: item.rylxm,
        });
      });
      let attachs = this.uploadItemfiles.map((v) => v.ID);
      let data = {
        attachment: attachs.join(","),
        details: newArr,
        groupid: this.activeTab,
        groupname: this.ativeName,
        id: (this.kpiData && this.kpiData.id) || null,
        monthdate: "",
        savetype: flag, // 1录入 2 提交
        totalfee: this.alltotal - 0,
        totalman: this.tableData.length,
        type: 2, // 1 月度绩效 2年度绩效 3特殊发放 4系统生成
        yeardate: this.year,
      };
      if (flag == 2) {
        this.submitLoading = true;
      } else {
        this.saveLoading = true;
      }
      saveKpi(data)
        .then((res) => {
          this.tableLoading = false;
          if (res.success) {
            let msg = ["", "保存草稿", "提交确认"];
            this.$message({
              showClose: true,
              message: `${msg[flag]}成功！`,
              type: "success",
            });
            this.getSaveData();
          } else {
            this.$message({
              showClose: true,
              message: `${msg[flag]}失败！`,
              type: "error",
            });
          }
          this.submitLoading = false;
          this.saveLoading = false;
        })
        .catch((err) => {
          this.submitLoading = false;
          this.saveLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-content {
  position: relative;
  min-height: 500px;
  margin-bottom: 70px;
}
.search-box {
  padding: 0px 20px !important;
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
.h3-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  width: 100%;
  text-align: center;
  line-height: 22px;
  padding-bottom: 10px;
  font-weight: 600;
  color: #373b4b;
  font-size: 16px;
}
</style>
