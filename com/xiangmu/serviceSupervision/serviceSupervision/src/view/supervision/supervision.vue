<template>
  <div>
    <div class="section clearfix">
      <!-- 问题列表 -->
      <div class="tasks">
        <el-tabs v-model="status" @tab-click="refresh">
          <el-tab-pane label="待处理" name="taskList">
            <div class="taskslist" v-for="item in taskList" :key="item.id">
              <taskItem :info="item"></taskItem>
              <div v-if="item.currentevent && item.currentevent.type == 4">
                <p class="transferInfo">
                  <span class="label">负责部门：</span>
                  <span class="item orgname">{{
                    item.currentevent.createorgname
                  }}</span>
                  <span class="label">退回人：</span>
                  <span class="item orgname">{{
                    item.currentevent.createname
                  }}</span>
                  <span class="label">退回时间：</span>
                  <span class="item">{{ item.currentevent.createtime }}</span>
                </p>
                <p class="transferInfo">
                  <span class="label">退回说明：</span>
                  <span class="item"></span>
                </p>
              </div>
              <div class="btns">
                <el-button
                  type="primary"
                  icon="el-icon-top-right"
                  size="small"
                  @click="showOptionDialogs(item.id, item.version,'disVisiable')"
                  >分配</el-button
                >
                <el-button
                  size="small"
                  class="trsbtn"
                  @click="showOptionDialogs(item.id, item.version,'transferVisiable')"
                  >转移</el-button
                >
              </div>
            </div>
            <!-- 待处理分页 -->
            <div class="pagination-box">
              <el-pagination
                background
                layout="sizes, prev, pager, next"
                :total="tasktotal"
                :page-size="taskpageSize"
                :page-sizes="[10, 15, 20]"
                :current-page.sync="taskcurrentPage"
                @current-change="
                  (page) => getTableData(page, taskpageSize, 'taskList')
                "
                @size-change="
                  (size) => getTableData(taskcurrentPage, size, 'taskList')
                "
              ></el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="已分配" name="disList">
            <div class="taskslist" v-for="item in disList" :key="item.id">
              <taskItem :info="item"></taskItem>
              <div>
                <p class="transferInfo">
                  <span class="label">负责部门：</span>
                  <span class="item orgname">{{
                    item.currentevent.handleorgname
                  }}</span>
                  <span class="label">分配时间：</span>
                  <span class="item">{{
                    util.formatTime(
                      item.currentevent.createtime,
                      "YYYY-MM-DD HH:mm"
                    )
                  }}</span>
                </p>
              </div>
              <div class="btns">
                <el-button
                  type="primary"
                  icon="el-icon-top-left"
                  size="small"
                  @click="showOptionDialogs(item.id, 'recallVisiable')"
                  >撤回</el-button
                >
              </div>
            </div>
            <!-- 待处理分页 -->
            <div class="pagination-box">
              <el-pagination
                background
                layout="sizes, prev, pager, next"
                :total="distotal"
                :page-size="dispageSize"
                :page-sizes="[10, 15, 20]"
                :current-page.sync="discurrentPage"
                @current-change="
                  (page) => getTableData(page, dispageSize, 'disList')
                "
                @size-change="
                  (size) => getTableData(discurrentPage, size, 'disList')
                "
              ></el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="已转移" name="transferList">
            <div class="taskslist" v-for="item in transferList" :key="item.id">
              <taskItem :info="item"></taskItem>
              <div>
                <p class="transferInfo">
                  <span class="label">转移至：</span>
                  <span class="item orgname">{{
                    item.currentevent.handleorgname
                  }}</span>
                  <span class="label">转移时间</span>
                  <span class="item">{{
                    util.formatTime(
                      item.currentevent.createtime,
                      "YYYY-MM-DD HH:mm"
                    )
                  }}</span>
                </p>
                <p class="transferInfo">
                  <span class="label">转移说明：</span>
                  <span class="item"></span>
                </p>
              </div>
            </div>
            <!-- 待处理分页 -->
            <div class="pagination-box">
              <el-pagination
                background
                layout="sizes, prev, pager, next"
                :total="transferTotal"
                :page-size="transferpageSize"
                :page-sizes="[10, 15, 20]"
                :current-page.sync="transfercurrentPage"
                @current-change="
                  (page) => getTableData(page, transferpageSize, 'transferList')
                "
                @size-change="
                  (size) =>
                    getTableData(transfercurrentPage, size, 'transferList')
                "
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 查询 -->
      <!-- <div class="searchbox">
        <searchBox @search="search" @reset="reset" ref="searchbox"></searchBox>
      </div> -->
    </div>
    <!-- 分配弹窗 -->
    <el-dialog
      title="分配"
      :visible.sync="disVisiable"
      width="400px"
      class="service-small-dialog"
      top="35vh"
    >
      <p><span class="nessary">*</span><span>负责部门</span></p>
      <el-select
        v-model="selectedDepartments"
        placeholder="请输入部门名称选择"
        class="selects"
        size="small"
      >
        <el-option
          v-for="item in departments"
          :key="item.ID"
          :label="item.NAME"
          :value="item.ID"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="disTask"
          >提 交</el-button
        >
        <el-button size="small" @click="disVisiable = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 转移弹窗 -->
    <el-dialog
      title="转移"
      :visible.sync="transferVisiable"
      width="400px"
      class="service-small-dialog"
      top="35vh"
    >
      <p><span class="nessary">*</span><span>咨询区</span></p>
      <el-select
        v-model="selectedDepartments"
        placeholder="请输入部门名称选择"
        class="selects"
        size="small"
      >
        <el-option
          v-for="item in departments"
          :key="item.ID"
          :label="item.NAME"
          :value="item.ID"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="transferTask"
          >提 交</el-button
        >
        <el-button size="small" @click="transferVisiable = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!-- 撤回弹窗 -->
    <el-dialog
      title=""
      :visible.sync="recallVisiable"
      width="424px"
      class="service-small-dialog-onhead"
      top="35vh"
    >
      <p>
        <i class="el-icon-warning"></i><span class="recalltitle">撤回咨询</span>
      </p>
      <p class="recalltext">
        该咨询已分配至 {{ recallDepartment }} ，是否确定撤回？
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="recallVisiable = false"
          >取 消</el-button
        >
        <el-button type="primary" size="small" @click="recallTask"
          >提 交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
let applyStatusMap = {
  taskList: 1,
  disList: 2,
  transferList: 3,
};
// import searchBox from "./searchbox";
import taskItem from "./taskItem";
export default {
  name: "supervision",
  data() {
    return {
      status: "taskList",
      taskList: [],
      tasktotal: 0,
      taskpageSize: 10,
      taskcurrentPage: 1,
      disList: [],
      distotal: 0,
      dispageSize: 10,
      discurrentPage: 1,
      transferList: [],
      transferTotal: 0,
      transferpageSize: 10,
      transfercurrentPage: 1,
      //任务操作
      disVisiable: false,
      departments: [],
      selectedDepartments: "",
      transferVisiable: false,
      recallVisiable: false,
      recallDepartment: "",
      currentTaskId: "",
      version:""
    };
  },
  components: {
    // searchBox,
   taskItem },
  methods: {
    //查询按钮，通过当前tab选择查什么状态的
    search() {
      switch (this.status) {
        case "taskList":
          this.taskcurrentPage = 1;
          this.getTableData(
            this.taskcurrentPage,
            this.taskpageSize,
            "taskList"
          );
          break;
        case "disList":
          this.discurrentPage = 1;
          this.getTableData(this.discurrentPage, this.dispageSize, "disList");
          break;
        case "transferList":
          this.transfercurrentPage = 1;
          this.getTableData(
            this.transfercurrentPage,
            this.transferpageSize,
            "transferList"
          );
          break;
      }
    },
    //用于操作后重新获取任务列表
    refresh() {
      switch (this.status) {
        case "taskList":
          this.getTableData(
            this.taskcurrentPage,
            this.taskpageSize,
            "taskList"
          );
          break;
        case "disList":
          this.getTableData(this.discurrentPage, this.dispageSize, "disList");
          break;
        case "transferList":
          this.getTableData(
            this.transfercurrentPage,
            this.transferpageSize,
            "transferList"
          );
          break;
      }
    },
    //重置搜索
    reset() {
      this.taskcurrentPage = 1;
      this.getTableData(this.taskcurrentPage, this.taskpageSize, "taskList");
      this.discurrentPage = 1;
      this.getTableData(this.discurrentPage, this.dispageSize, "disList");
      this.transfercurrentPage = 1;
      this.getTableData(
        this.transfercurrentPage,
        this.transferpageSize,
        "transferList"
      );
    },
    getTableData(page, size, key) {
      let queryData = this.$refs["searchbox"].getForm();
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              keyword: queryData.title || null,
              applystatus: applyStatusMap[key],
              type: queryData.type || null,
              starttime:
                queryData.dates && queryData.dates[0]
                  ? this.util.formatTime(
                      queryData.dates[0].getTime(),
                      "YYYYMMDDHHMM"
                    )
                  : null,
              endtime:
                queryData.dates && queryData.dates[1]
                  ? this.util.formatTime(
                      queryData.dates[1].getTime(),
                      "YYYYMMDDHHMM"
                    )
                  : null,
            },
            limit: size,
            page: page,
          },
        })
        .then((res) => {
          if (res.success) {
            if (key === "taskList") {
              this.taskList = res.data;
              this.tasktotal = res.total;
            }
            if (key === "disList") {
              this.disList = res.data;
              this.distotal = res.total;
            }
            if (key === "transferList") {
              this.transferList = res.data;
              this.transferTotal = res.total;
            }
          }
        });
    },
    //分配和转移按钮调出弹窗
    showOptionDialogs(id, version,viskey) {
      this.currentTaskId = id;
      this.version = version;
      this.selectedDepartments = "";
      if (viskey === "recallVisiable") {
        this.recallDepartment = this.disList[
          _.findIndex(this.disList, { id: id })
        ].currentevent.handleorgname;
      }
      this[viskey] = true;
    },
    //转移任务
    transferTask() {
      if (!this.selectedDepartments) {
        this.$message.error("请选择一个部门！");
        return false;
      }
      let data = {
        applyid: this.currentTaskId,
        version: this.version,
        createrorgname: "后勤保障部",
        handleorgid: this.selectedDepartments,
        handleorgname: this.departments[
          _.findIndex(this.departments, {
            ID: this.selectedDepartments,
          })
        ].NAME,
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/move",
          isRep: true,
          data: data,
        })
        .then((res) => {
          if (res.success) {
            this.$message.success("转移任务成功！");
            this.transferVisiable = false;
            this.refresh();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 分配任务
    disTask() {
      if (!this.selectedDepartments) {
        this.$message.error("请选择一个部门！");
        return false;
      }
      let data = {
        applyid: this.currentTaskId,
        createrorgname: "后勤保障部",
        handleorgid: this.selectedDepartments,
        handleorgname: this.departments[
          _.findIndex(this.departments, {
            ID: this.selectedDepartments,
          })
        ].NAME,
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/distribute",
          isRep: true,
          data: data,
        })
        .then((res) => {
          if (res.success) {
            this.$message.success("转移分配成功！");
            this.disVisiable = false;
            this.refresh();
          } else {
            this.$message.error("出现错误！");
          }
        });
    },
    recallTask() {
      let data = {
        applyid: this.currentTaskId,
      };
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/withdraw",
          isRep: true,
          data: data,
        })
        .then((res) => {
          if (res.success) {
            this.$message.success("撤回成功！");
            this.recallVisiable = false;
            this.refresh();
          } else {
            this.$message.error("出现错误！");
          }
        });
    },
  },
  mounted() {
    this.reset();
  },
  created() {
    this.util
      .postAjax({
        code: this.global.authCode,
        url: "rest/Org/simpleList",
        data: {
          filter: JSON.stringify({
            PID: "090002",
          }),
          limit: 1000,
          page: 1,
        },
      })
      .then((res) => {
        if (res.success) {
          this.departments = res.items;
        }
      });
  },
};
</script>

<style lang="scss" scoped>
.section {
  margin-top: 20px;
}
.tasks {
  width: 860px;
  float: left;
  margin-right: 20px;
  background-color: #fff;
  padding: 20px;
  & /deep/ .el-tabs__item {
    height: 30px;
    line-height: 10px;
  }
  & /deep/ .el-tabs__active-bar {
    background-color: #ff6f4b;
  }
  & /deep/ .el-tabs__header {
    margin: 0 0 0;
  }
}
.tasks /deep/ .el-tabs__item.is-active {
  color: #ff6f4b;
}
.tasks /deep/ .el-tabs__item:hover {
  color: #ff6f4b;
}
.btns {
  margin-top: 20px;
}
.taskslist {
  padding-top: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}
.trsbtn {
  color: #3a78fc;
  border-color: #3a78fc;
}
.pagination-box {
  margin-top: 20px;
  float: right;
}
.searchbox {
  width: 320px;
  height: 318px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  left: 1130px;
  .labels {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #5f6464;
    line-height: 20px;
    margin-bottom: 10px;
  }
  & >>> .daterange,
  & >>> .selects {
    width: 100%;
    margin-bottom: 20px;
  }
}
.transferInfo {
  height: 14px;
  font-size: 12px;
  color: #999999;
  line-height: 14px;
  margin-top: 10px;
}
.orgname {
  display: inline-block;
  margin-right: 30px;
}
.el-button--small {
  height: 28px;
  padding: 6px 15px;
}
.nessary {
  color: red;
  display: inline-block;
  margin-right: 10px;
}
.selects {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 70px;
}
.el-icon-warning {
  color: #ff6f4b;
  font-size: 24px;
  margin-right: 16px;
}
.recalltitle {
  height: 24px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}
.recalltext {
  height: 22px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  margin-top: 12px;
  margin-left: 40px;
}
</style>
