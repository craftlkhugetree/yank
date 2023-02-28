<template>
  <div>
    <div class="section clearfix">
      <!-- 问题列表 -->
      <div class="tasks">
        <el-tabs v-model="status" @tab-click="refresh">
          <el-tab-pane name="taskList" label="待回复">
            <span slot="label" class="tab-label">
              待回复
              <i class="tab-num">{{tasktotal}}</i>
            </span>
            <replySearch
              v-if="userDepts.length > 0"
              listType="task"
              class="replysearch"
              @search="getSearch('taskList')"
              ref="taskListSearch"
            ></replySearch>
            <transition class="container" name="slide-fade">
              <div v-if="status == 'taskList'">
                <!-- <span slot="label"><i class="tabshow"></i> 待回复</span> -->

                <empty v-if="!taskList.length"></empty>
                <div class="taskslist" v-for="item in taskList" :key="item.id">
                  <!-- <transition class="container" name="slide-fade" > -->
                  <taskItem v-if="status == 'taskList'" :showApplyer="true" :info="item"></taskItem>
                  <!-- </transition>
                  <transition class="container" name="slide-fade" >-->
                  <div v-if="item.lastEvent" class="infos">
                    <p class="transferInfo">
                      <span class="item orgname">
                        {{
                        util.formatTime(item.lastEvent.time, "YYYY-MM-DD HH:mm")
                        }}
                      </span>
                      <span class="item orgname">
                        {{ item.lastEvent.name }} 转移至
                        {{ item.lastEvent.dept }}
                      </span>
                    </p>
                    <p class="transferInfo">
                      <span class="label">转移说明1：</span>
                      <span class="item">{{ item.lastEvent.note }}</span>
                    </p>
                  </div>
                  <!-- </transition>
                  <transition class="container" name="slide-fade" >-->
                  <div class="btns" v-if="status == 'taskList'">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="small"
                      @click="replyTask(item.id,item.version)"
                    >回复</el-button>
                    <el-button
                      size="small"
                      class="trsbtn"
                      @click="showOptionDialogs(item.id, item.version,'returnVisiable')"
                    >转移</el-button>
                  </div>
                  <!-- </transition> -->
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
              </div>
            </transition>
          </el-tab-pane>
          <el-tab-pane label="已回复" name="disList">
            <span slot="label" class="tab-label">
              已回复
              <i class="tab-num">{{distotal}}</i>
            </span>
            <!-- <span slot="label"><i class="tabshow"></i> 已回复</span> -->
            <transition class="container" name="slide-fade1">
              <replySearch
                v-if="userDepts.length > 0"
                listType="dis"
                class="replysearch"
                @search="getSearch('disList')"
                ref="disListSearch"
              ></replySearch>
            </transition>
            <empty v-if="!disList.length"></empty>
            <div class="taskslist" v-for="item in disList" :key="item.id">
              <transition class="container" name="slide-fade1">
                <taskItem :showApplyer="true" :info="item" v-if="status == 'disList'"></taskItem>
              </transition>
              <transition class="container" name="slide-fade1">
                <replyInfo :info="item" v-if="status == 'disList'"></replyInfo>
              </transition>
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
        </el-tabs>
      </div>
      <!-- 查询 -->
    </div>

    <!-- 转移弹窗 -->
    <el-dialog
      title="转移"
      :visible.sync="returnVisiable"
      width="500px"
      class="service-small-dialog"
      top="35vh"
    >
      <el-form
        label-position="left"
        ref="transferForm"
        :rules="transferRules"
        :model="transferForm"
        label-width="95px"
      >
        <el-form-item label="转移部门：" prop="handledeptid">
          <el-select v-model="transferForm.handledeptid" placeholder="请输入部门名称选择" size="small">
            <el-option
              v-for="item in $store.state.departments.filter(i => i.ISLOCK=='0')"
              :key="item.ID"
              :label="item.NAME"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转移说明：" prop="note">
          <el-input type="textarea" :rows="6" v-model="transferForm.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="transferTask">提 交</el-button>
        <el-button size="small" @click="returnVisiable = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let applyStatusMap = {
  taskList: 1,
  disList: 2
};
import empty from "../../components/emptyList";
import replySearch from "./replySearch";
import taskItem from "../supervision/taskItem";
import replyInfo from "./replyinfo";
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
      //退回操作
      returnVisiable: false,
      transferForm: {
        applyid: "",
        note: "",
        handledeptid: "",
        handledeptname: "",
        version:""
      },
      transferRules: {
        handledeptid: { required: true, message: "请选择部门！" },
        note: { required: true, message: "请说明原因！" }
      }
    };
  },
  computed: {
    userDepts() {
      return this.$store.state.userInfo.userOrgId;
    }
  },
  watch: {
    userDepts() {
      this.$nextTick(() => {
        this.reset();
      });
    }
  },
  components: { empty, taskItem, replyInfo, replySearch },
  methods: {
    //查询按钮，通过当前tab选择查什么状态的
    getSearch(state) {
      switch (state) {
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
    },
    getTableData(page, size, key) {
      let queryData = {};

      if (key === "taskList") {
        queryData = this.$refs["taskListSearch"].getData();
        queryData.applystatus = "1";
      }
      if (key === "disList") {
        queryData = this.$refs["disListSearch"].getData();
        queryData.applystatus = "2,3";
      }
      // queryData.handledeptid = null;
      // let handledeptid = [];
      // _.forEach(this.$store.state.userInfo.userOrgId, orgs => {
      //   handledeptid.push(orgs.ID);
      // });
      // if (handledeptid.indexOf("8") == -1) {
      //   queryData.handledeptid = handledeptid.join(",");
      // }
      // let userRoleIds = this.$store.state.userRoles.map(i => i.ID);
      // if (userRoleIds.includes("9100003-1")) {
      //   queryData.handledeptid = null;
      // }
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              keyword: queryData.title || null,
              applystatus: queryData.applystatus,
              types: queryData.types || null,
              handledeptids: queryData.handledeptids,
              areaids: queryData.areaids || null,
              questtypeids: queryData.questtypeids || null,
              markscore: queryData.markscore || null,
              starttime: queryData.starttime || null,
              endtime: queryData.endtime || null,
              handlestarttime: queryData.handlestarttime || null,
              handleendtime: queryData.handleendtime || null
            },
            orderBy: key == "taskList" ? "createtime" : "handletime",
            sort: "desc",
            limit: size,
            page: page
          }
        })
        .then(res => {
          _.forEach(res.data, item => {
            if (item.events.length) {
              item.lastEvent = {
                name: `${item.events[0].creatername}(${item.events[0].createrid})`,
                time: item.events[0].createtime,
                note: item.events[0].note,
                dept: item.events[0].handledeptname
              };
            }
          });
          if (res.success) {
            if (key === "taskList") {
              this.taskList = res.data;
              this.tasktotal = res.total;
            }
            if (key === "disList") {
              this.disList = res.data;
              this.distotal = res.total;
            }
          }
        });
    },
    //分配和转移按钮调出弹窗
    showOptionDialogs(id,version, viskey) {
      this.transferForm = {
        applyid: id,
        version:version,
        note: "",
        handledeptid: "",
        handledeptname: ""
      };
      this[viskey] = true;
    },
    // 回复任务，需要跳到回复页面
    replyTask(id,version) {
      // let routeUrl = this.$router.resolve({
      //   name: "reply",
      //   params: { id: id },
      // });
      this.$router.push({
        name: "reply",
        params: { id: id ,version:version}
      });
      // window.open(routeUrl.href, "_blank");
      // window.open("/#/reply/" + id);
    },
    //转移任务
    transferTask() {
      let { transferForm } = this;
      let departments = this.$store.state.departments;
      transferForm.handledeptname =
        departments[
          _.findIndex(departments, { ID: this.transferForm.handledeptid })
        ].NAME;
      this.$refs["transferForm"].validate(valid => {
        if (valid) {
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/move",
              isRep: true,
              data: transferForm
            })
            .then(res => {
              if (res.success) {
                this.$message.success("转移成功！");
                this.returnVisiable = false;
                this.getTableData(
                  this.taskcurrentPage,
                  this.taskpageSize,
                  "taskList"
                );
              } else {
                 this.$message.error(res.data.message);
              }
            });
        }
      });
    }
  },
  mounted() {
    if (this.userDepts.length > 0) {
      this.$nextTick(() => {
        this.reset();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-fade-enter-active,
.slide-fade1-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  /* transition: all .3s ; */
}
.slide-fade-enter, .slide-fade-leave-to

    /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(800px);
  opacity: 0;
}
.slide-fade1-enter,
.slide-fade1-leave-to {
  transform: translateX(-800px);
  opacity: 0;
}
.section {
  margin: 0 auto;
  width: 1200px;
  margin-top: 20px;
}
.tasks {
  width: 100%;
  float: left;
  margin-right: 0;
  background-color: #fff;
  padding: 20px 200px;
  & /deep/ .el-tabs__item {
    height: 30px;
    line-height: 10px;
  }
  & /deep/ .el-tabs__active-bar {
    background-color: #ff6f4b;
    // position: relative;
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
.tasks /deep/ .el-tabs__item:hover .tabshow {
  width: 36px;
}
.tabshow {
  display: inline-block;
  height: 2px;
  background: #fd7d18;
  width: 0;
  margin: 0 auto;
  position: absolute;
  bottom: 0;
  transition: width 0.3s linear;
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
.service-small-dialog /deep/ .el-dialog__body {
  padding: 14px 44px 38px 20px;
}
.service-small-dialog /deep/ .el-textarea__inner {
  // border: 1px solid transparent;
}
.infos {
  margin-top: 10px;
  height: 100%;
}
.replysearch {
  margin-top: 20px;
}

.tab-label {
  position: relative;
}
.tab-num {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  font-style: normal;
  position: absolute;
  left: 45px;
  top: 4px;
}
</style>
