<template>
  <div>
    <div class="section clearfix">
      <div class="conditions clearfix">
        <div
          class="states"
          :class="{ selected: status === 'allList' }"
          @click="changeTab('allList')"
        >
          <el-badge :value="allTotal" class="item" type="primary">
            <!-- <i class="iconfont"></i> -->
            <img
              v-show="status !== 'allList'"
              width="25px"
              height="25px"
              src="../../../static/images/quanbu2.png"
              alt
            />
            <img
              v-show="status === 'allList'"
              width="25px"
              height="25px"
              src="../../../static/images/quanbu1.png"
              alt
            />
          </el-badge>全部
        </div>
        <div
          class="states"
          :class="{ selected: status === 'taskList' }"
          @click="changeTab('taskList')"
        >
          <el-badge :value="tasktotal" class="item" type="primary">
            <!-- <i class="iconfont"></i> -->
            <img
              v-show="status !== 'taskList'"
              width="25px"
              height="25px"
              src="../../../static/images/status-daihuifu.png"
              alt
            />
            <img
              v-show="status === 'taskList'"
              width="25px"
              height="25px"
              src="../../../static/images/status-daihuifu-active.png"
              alt
            />
          </el-badge>待回复
        </div>
        <div
          :class="{ selected: status === 'disList' }"
          class="states"
          @click="changeTab('disList')"
        >
          <el-badge :value="distotal" class="item" type="primary">
            <img
              v-show="status !== 'disList'"
              width="25px"
              height="25px"
              src="../../../static/images/status-yihuifu.png"
              alt
            />
            <img
              v-show="status === 'disList'"
              width="25px"
              height="25px"
              src="../../../static/images/status-yihuifu-active.png"
              alt
            />
          </el-badge>已回复
        </div>
        <div
          :class="{ selected: status === 'transferList' }"
          class="states"
          @click="changeTab('transferList')"
        >
          <el-badge :value="transferTotal" class="item" type="primary">
            <img
              v-show="status !== 'transferList'"
              width="25px"
              height="25px"
              src="../../../static/images/status-pingjia.png"
              alt
            />
            <img
              v-show="status === 'transferList'"
              width="25px"
              height="25px"
              src="../../../static/images/status-pingjia-active.png"
              alt
            />
          </el-badge>评价
        </div>
        <el-input
          prefix-icon="el-icon-search"
          size="small"
          class="historySearch"
          clearable
          v-model="searchInput"
          @keypress.native.enter="search"
          placeholder="请输入关键字搜索"
          @clear="search"
        ></el-input>
      </div>
      <div class="tasks">
        <div v-show="status === 'allList'" name="taskList">
          <empty v-if="!allList.length"></empty>
          <div class="taskslist" v-for="item in allList" :key="item.id">
            <taskItem :info="item"></taskItem>
            <div v-if="item.lastEvent" class="infos hide">
              <p class="transferInfo">
                <span class="item orgname">
                  {{
                  util.formatTime(item.lastEvent.time, "YYYY-MM-DD hh:mm")
                  }}
                </span>
                <span class="item orgname">
                  {{ item.lastEvent.name }} 转移至
                  {{ item.lastEvent.dept }}
                </span>
              </p>
              <p class="transferInfo">
                <span class="label">转移说明：</span>
                <span class="item">{{ item.lastEvent.note }}</span>
              </p>
            </div>
            <!-- 已回复 -->
            <div v-if="item.applystatus === '2'">
              <replyItem class="btns" :info="item" :showHandler="true"></replyItem>
              <el-button
                icon="el-icon-edit"
                class="ratebtn"
                size="small"
                @click="showRate(item.id,item.version)"
              >评价</el-button>
            </div>
            <!-- 评价 -->
            <div v-if="item.applystatus === '3'">
              <replyItem class="btns" :info="item"></replyItem>
            </div>
          </div>
          <!-- 待处理分页 -->
          <div class="pagination-box">
            <el-pagination
              background
              layout="sizes, prev, pager, next"
              :total="allTotal"
              :page-size="allListpageSize"
              :page-sizes="[10, 15, 20]"
              :current-page.sync="allListcurrentPage"
              @current-change="
                (page) => getTableData(page, allListpageSize, 'allList')
              "
              @size-change="
                (size) => getTableData(allListcurrentPage, size, 'allList')
              "
            ></el-pagination>
          </div>
        </div>
        <div v-show="status === 'taskList'" name="taskList">
          <empty v-if="!taskList.length"></empty>
          <div class="taskslist" v-for="item in taskList" :key="item.id">
            <taskItem :info="item"></taskItem>
            <div v-if="item.lastEvent" class="infos hide">
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
                <span class="label">转移说明：</span>
                <span class="item">{{ item.lastEvent.note }}</span>
              </p>
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
        </div>
        <div v-show="status === 'disList'" name="disList">
          <empty v-if="!disList.length"></empty>
          <div class="taskslist" v-for="item in disList" :key="item.id">
            <taskItem :info="item"></taskItem>
            <replyItem class="btns" :info="item" :showHandler="true"></replyItem>
            <el-button
              icon="el-icon-edit"
              class="ratebtn"
              size="small"
              @click="showRate(item.id,item.version)"
            >评价</el-button>
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
        </div>
        <div v-show="status === 'transferList'" name="transferList">
          <empty v-if="!transferList.length"></empty>
          <div class="taskslist" v-for="item in transferList" :key="item.id">
            <taskItem :info="item"></taskItem>
            <replyItem class="btns" :info="item"></replyItem>
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
        </div>
      </div>
    </div>
    <el-dialog title="评价" :visible.sync="ratevis" class="service-small-dialog" width="300px">
      <el-form :model="replyform" :rules="replyformRule" ref="rateform" label-position="right">
        <el-form-item style="margin-bottom: 0px" label="对我们的答复满意吗" prop="replystar"></el-form-item>
        <el-rate v-model="replyform.replystar" :colors="['#ff6f4b']"></el-rate>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rated" size="small">提 交</el-button>
        <el-button @click="ratevis = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let applyStatusMap = {
  taskList: 1,
  disList: 2,
  transferList: 3,
  allList: "1,2,3"
};
// import searchBox from "./searchbox";
import empty from "../../components/emptyList";
import taskItem from "../supervision/taskItem";
import replyItem from "../reply/replyItem";
export default {
  name: "supervision",
  data() {
    return {
      status: "allList",
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
      allList: [],
      allTotal: 0,
      allListpageSize: 10,
      allListcurrentPage: 1,
      //
      searchInput: "",
      currentId: "",
      version:"",
      replyform: {
        replystar: 0
      },
      replyformRule: {
        replystar: { required: true, message: "请评价！" }
      },
      ratevis: false
    };
  },
  components: {
    empty,
    // searchBox,
    taskItem,
    replyItem
  },
  methods: {
    rated() {
      this.$refs["rateform"].validate(valid => {
        // alert(this.replyform.replystar)
        if (valid) {
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/markscore",
              isRep: true,
              data: {
                applyid: this.currentId,
                version: this.version,
                markscore: this.replyform.replystar + ""
              }
            })
            .then(res => {

              if (res.success) {
                this.ratevis = false;
                this.$message.success("评价成功！");
                this.refresh();
                this.transfercurrentPage = 1;
                this.getTableData(
                  this.transfercurrentPage,
                  this.transferpageSize,
                  "transferList"
                );
              }else{
                this.$message.error(res.data.message);
              }
            });
        }
      });
    },
    showRate(id,version) {
      this.replyform.replystar = 0;
      this.ratevis = true;
      this.currentId = id;
      this.version = version;
    },
    //切换当前状态
    changeTab(state) {
      this.status = state;
      this.refresh();
    },
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
        case "allList":
          this.allListcurrentPage = 1;
          this.getTableData(
            this.allListcurrentPage,
            this.allListpageSize,
            "allList"
          );
          break;
      }
    },
    //用于操作后重新获取任务列表
    refresh() {
      switch (this.status) {
        case "allList":
          this.getTableData(
            this.allListcurrentPage,
            this.allListpageSize,
            "allList"
          );
          break;
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
      this.allListcurrentPage = 1;
      this.getTableData(
        this.allListcurrentPage,
        this.allListpageSize,
        "allList"
      );
    },
    getUserId() {
      return new Promise((reslove, reject) => {
        if (this.$store.state.userInfo.userID) {
          reslove(this.$store.state.userInfo.userID);
        } else {
          this.util
            .postAjax({
              code: this.global.authCode,
              url: "rest/User/userDetail"
            })
            .then(res => {
              reslove(res.item.ID);
            })
            .catch(() => {
              reject("");
            });
        }
      });
    },
    getTableData(page, size, key) {
      this.getUserId().then(ID => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "apply/pageQuery",
            isRep: true,
            data: {
              filter: {
                keyword: this.searchInput || null,
                applystatus: applyStatusMap[key],
                applyerid: ID
              },
              limit: size,
              page: page
            }
          })
          .then(res => {
            if (res.success) {
              _.forEach(res.data, item => {
                if (item.events.length) {
                  item.lastEvent = {
                    name: `${item.events[0].creatername}(${item.events[0].createrid})`,
                    time: item.events[0].createtime,
                    note: item.events[0].note,
                    dept: item.events[0].handledeptname
                  };
                }
                if (item.markscore) {
                  item.markscore = parseInt(item.markscore);
                }
              });
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
              if (key === "allList") {
                this.allList = res.data;
                this.allTotal = res.total;
              }
            }
          });
      });
    }
  },
  mounted() {
    this.reset();
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.section {
  margin-top: 20px;
}
.hide {
  display:none;
}
.tasks {
  width: 100%;
  background-color: #fff;
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

.pagination-box {
  margin-top: 20px;
  float: right;
  margin-bottom: 20px;
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
.states {
  float: left;
  width: 100px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  cursor: pointer;
  .el-badge {
    margin-right: 12px;
  }
  & /deep/ .el-badge__content--primary {
    background-color: #fff;
  }
  & /deep/ .el-badge__content {
    border-color: rgba(204, 204, 204, 1);
    color: rgba(204, 204, 204, 1);
  }
  .iconfont {
    font-size: 25px;
    display: inline-block;
  }
  &.selected {
    color: rgba(58, 120, 252, 1);
  }
  &.selected /deep/ .el-badge__content {
    color: rgba(58, 120, 252, 1);
    border-color: rgba(58, 120, 252, 1);
  }
}
.historySearch /deep/ input {
  background-color: #f6f6f6;
  border: none;
}
.historySearch {
  width: 200px;
  float: right;
}
.ratebtn {
  margin-top: 20px;
  margin-left: 56px;
  border-color: rgba(58, 120, 252, 1);
  color: rgba(58, 120, 252, 1);
}
.service-small-dialog /deep/ .el-rate__icon {
  font-size: 24px;
  margin-right: 2px;
  color: #ff6f4b;
}
</style>
