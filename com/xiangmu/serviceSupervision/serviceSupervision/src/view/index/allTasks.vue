<!--  -->
<template>
  <div>
    <replySearch
      class="replysearch"
      @search="getSearch('taskList')"
      ref="taskListSearch"
    ></replySearch>
    <empty v-if="!taskList.length"></empty>
    <div class="taskslist" v-for="item in taskList" :key="item.id">
      <taskItem :info="item"></taskItem>
      <div v-if="item.lastEvent" class="infos hide">
        <p class="transferInfo">
          <span class="item orgname">{{
            util.formatTime(item.lastEvent.time, "YYYY-MM-DD hh:mm")
          }}</span>
          <span class="item orgname"
            >{{ item.lastEvent.name }}  转移至  {{ item.lastEvent.dept }}</span
          >
        </p>
        <p class="transferInfo">
          <span class="label">转移说明：</span>
          <span class="item">{{ item.lastEvent.note }}</span>
        </p>
      </div>
      <replyItem :key="item.id" :info="item" class="replyitem"></replyItem>
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
        @current-change="(page) => getTableData(page, taskpageSize, 'taskList')"
        @size-change="(size) => getTableData(taskcurrentPage, size, 'taskList')"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
let applyStatusMap = {
  taskList: 1,
  disList: 2,
};
import empty from "../../components/emptyList";
import replySearch from "./allSearch";
import taskItem from "../supervision/taskItem";
import replyInfo from "../reply/replyinfo";
import replyItem from "../reply/replyItem";
export default {
  name: "supervision",
  data() {
    return {
      status: "taskList",
      taskList: [],
      tasktotal: 0,
      taskpageSize: 10,
      taskcurrentPage: 1,
    };
  },
  components: { empty, taskItem, replyInfo, replySearch, replyItem },
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
      }
    },
    //重置搜索
    reset() {
      this.taskcurrentPage = 1;
      this.getTableData(this.taskcurrentPage, this.taskpageSize, "taskList");
    },
    getTableData(page, size, key) {
      let queryData = {};
      queryData = this.$refs["taskListSearch"].getData();
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              keyword: queryData.title || null,
              applystatus: "2,3",
              isopen: "1",
              types: queryData.types || null,
            },
            limit: size,
            page: page,
          },
        })
        .then((res) => {
          if (res.success) {
            _.forEach(res.data, (item) => {
              if (item.events.length) {
                item.lastEvent = {
                  name: `${item.events[0].creatername}(${item.events[0].createrid})`,
                  time: item.events[0].createtime,
                  note: item.events[0].note,
                  dept: item.events[0].handledeptname,
                };
              }
            });

            this.taskList = res.data;
            console.log(this.taskList);
            this.tasktotal = res.total;
          }
        });
    },
  },
  mounted() {
    this.reset();
  },
  created() {},
};
</script>

<style lang='scss' scoped>
.section {
  margin-top: 20px;
}
.hide {
  display:none;
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
  margin-bottom: 10px;
}
.orgname {
  display: inline-block;
  margin-right: 30px;
}

.replyitem {
  margin-top: 20px;
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
}
.replysearch {
  margin-top: 20px;
}
</style>
