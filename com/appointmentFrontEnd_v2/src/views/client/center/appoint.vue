<template>
  <div class="wapper-list">
    <div v-loading="loading" style="padding:0 0 18px;">
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id">
          <!---------------------------- 标签 ---------------------------->
          <span slot="label">{{tab.name}}</span>
          <div class="tab-content" v-loading="tableLoading">
            <!---------------------------- 有资源数据 ---------------------------->
            <div class="base-search-table">
              <div class="search-box clearfix" style="padding:0px;">
                <!---------------------------- 查询条件 ---------------------------->
                <div class="search-box-right">
                  <el-date-picker
                    v-model="useTimes"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="请选择使用日期"
                    end-placeholder="请选择使用日期"
                    size="small"
                    style="width:280px;"
                    value-format="yyyyMMdd"
                    @change="getTableData(1,pageSize)"
                  ></el-date-picker>
                  <el-select
                    v-model="status"
                    size="small"
                    placeholder="状态"
                    style="width:100px;margin:0 5px;"
                    clearable
                    @change="getTableData(1,pageSize)"
                  >
                    <el-option
                      v-for="option in statusOptions"
                      :key="option.name"
                      :label="option.name"
                      :value="option.id"
                    ></el-option>
                  </el-select>
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-search"
                    @click="getTableData(1,pageSize)"
                  >查询</el-button>
                </div>
              </div>
              <!---------------------------- 列表 ---------------------------->
              <template v-for="(item,index) in opointList">
                <el-card
                  class="box-card"
                  :class="{'box-margin':  index%2 == 0 }"
                  :key="index + item.id"
                  @click.native="openDrawer(item)"
                >
                  <div slot="header" class="clearfix">
                    <span>申请时间：{{formatAllTimeStr(item.createtime)}}</span>
                    <el-button class="right-btn" type="text">{{statusFormat(item)}}</el-button>
                  </div>
                  <div class="card-content">
                    <p class="title">
                      <span class="group">{{item.resgroupname}}</span>
                      <span class="res">{{item.resname}}</span>
                    </p>
                    <p
                      class="time"
                    >{{formatDate(item.usedate)}} {{formatTime(item.starttime)}} ~ {{formatTime(item.endtime)}}</p>
                  </div>
                  <div class="card-footer" v-show="activeTab=='going'">
                    <el-button
                      class="suc-btn"
                      plain
                      @click.stop="appointCancel(item)"
                      v-show="cancelBtn(item)"
                    >取消预约</el-button>
                    <el-popover
                      popper-class="popverClass"
                      placement="bottom"
                      trigger="click"
                      width="200"
                      visible-arrow="false"
                    >
                      <div
                        class="myCode"
                        :id="item.id+'qrcode'"
                        :key="item.id"
                        v-show="isShowId ==item.id"
                      ></div>
                      <el-button
                        v-if="isShowCodeBtn(item)"
                        slot="reference"
                        class="suc-btn"
                        plain
                        @click.stop="appointCode(item)"
                      >预约码</el-button>
                    </el-popover>
                  </div>
                </el-card>
              </template>

              <!---------------------------- 分页 ---------------------------->
              <div class="pagination" v-if=" currentPage>1">
                <el-pagination
                  background
                  layout="sizes, prev, pager, next"
                  :total="total"
                  :page-size="pageSize"
                  :page-sizes="[5,10,15,20]"
                  :current-page.sync="currentPage"
                  @current-change="page => getTableData(page, pageSize)"
                  @size-change="size => {pageSize = size; getTableData(1, size)}"
                ></el-pagination>
              </div>
              <!---------------------------- 无数据 ---------------------------->
              <div class="nodata" v-if="total == 0">
                <img src="@/assets/img/nofind.png" alt />
                <p>没有找到</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!---------------------------- 预约单详情弹窗 ---------------------------->
    <detail-drawer ref="detailDrawer" @doFunc="getTableData(1,pageSize)"></detail-drawer>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import detailDrawer from "./detailDrawer";
import { fetchAppointList, cancelAppoint } from "@/api/client/appoint";
import { diffmin } from "@/assets/js/client/public";
export default {
  components: {
    detailDrawer
  },
  data() {
    return {
      loading: false,
      activeTab: "going",
      tabs: [
        { id: "going", name: "进行中" },
        { id: "finish", name: "已完成" }
      ],
      status: null,
      tableLoading: false,
      opointList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      useTimes: [],
      resGroupId: null,
      keyword: null,
      goingStatusList: [
        { id: "1-1", name: "已预约" },
        { id: "1-2", name: "审核中" },
        { id: "2", name: "审核通过" }
      ],
      finishStatusList: [
        { id: "3", name: "审核不通过" },
        { id: "8", name: "已完成" },
        { id: "9", name: "已取消" }
      ],
      isShowId: ""
    };
  },
  computed: {
    userInfo() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      return userInfo;
    },
    statusOptions() {
      let options =
        this.activeTab == "going"
          ? this.goingStatusList
          : this.finishStatusList;
      return options;
    },
    statusList() {
      return this.$store.state.statusList;
    }
  },

  methods: {
    //格式化成  hh:mm
    formatTime(time) {
      let ftime = this.moment(time, "hhmm").format("HH:mm");
      return ftime;
    },
    //格式化成 YYYY-MM-DD
    formatDate(date) {
      let fdate = this.moment(date).format("YYYY-MM-DD");
      return fdate;
    },
    //格式化成 YYYY-MM-DD  hh:mm:ss
    formatAllTimeStr(str) {
      let strTime = this.moment(str, "YYYYMMDDhhmmss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return strTime;
    },
    // 状态格式
    statusFormat(row) {
      let status = "--";
      if (row.approveorder == "-1" && row.applystatus == "1") {
        status = "1-1";
      } else if (row.applystatus == "1") {
        status = "1-2";
      } else {
        status = row.applystatus;
      }
      return this.statusList.filter(i => i.id === status)[0].name;
    },

    isShowCodeBtn(item) {
      let flag = false,
        stShow = false,
        edShow = false;
      //签到成功后，不显示预约码和签到扫一扫
      if (item.checkintime) {
        return false;
      }
      //是否有签到规则
      if (item.checktype) {
        if (item.checktype.code == "2") {
          if (item.applystatus == "2" && item.approves) {
            flag = true;
          }
          if (item.applystatus == "1" && !item.approves) {
            flag = true;
          }
        }
        //资源开始时间
        let startResTime = this.moment(
          `${item.usedate}${item.starttime}`,
          "YYYYMMDDhhmm"
        ).format("YYYY-MM-DD HH:mm");
        //当前操作时间
        let nowTime = this.moment().format("YYYY-MM-DD HH:mm");
        let startDura = diffmin(startResTime, nowTime);
        let endDura = diffmin(nowTime, startResTime);
        if (item.checkinrule) {
          //例：资源开始时间  前10分钟可以签到
          if (startDura > 0 && startDura <= item.checkinrule.checkTime) {
            stShow = true;
          }
          //例：资源开始时间  20分钟 后 停止签到
          if (endDura > 0 && endDura <= item.checkinrule.stopCheckTime) {
            edShow = true;
          }
        }
        let show = flag && (stShow || edShow);
        return show;
      }
    },

    appointCode(item) {
      this.isShowId = item.id;
      this.$nextTick(() => {
        let qrcode = new QRCode(`${item.id}qrcode`, {
          width: 132,
          height: 132,
          text: item.id, // 二维码内容
          colorDark: "#000",
          colorLight: "#fff"
        });
      });
    },
    cancelBtn(item) {
      let appointTime = this.moment(
        `${item.usedate}${item.starttime}`,
        "YYYYMMDDhhmm"
      ).format("YYYY-MM-DD HH:mm");
      let nowTime = this.moment().format("YYYY-MM-DD HH:mm");
      //计算时间差并转换成标准时间单位
      let dura =
        this.moment(appointTime).format("x") - this.moment(nowTime).format("x");
      let tempTime = this.moment.duration(dura);
      let days = tempTime.days() || 0,
        hours = tempTime.hours() || 0,
        mins = tempTime.minutes() || 0;
      let diffHours = parseInt(hours) + parseInt(days * 24);
      let diffMins =
        parseInt(mins) + parseInt(hours * 60) + parseInt(days * 24 * 60);
      let isShowCancel = true;
      if (item.canceltimeunit == "minute" && diffMins < item.canceltimeval) {
        isShowCancel = false;
      }
      if (item.canceltimeunit == "hour" && diffHours < item.canceltimeval) {
        isShowCancel = false;
      }
      return isShowCancel;
    },
    // 取消预约
    appointCancel(item) {
      this.$confirm("是否确认取消该预约单吗?", "确认取消预约", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        type: "warning",
        center: true
      })
        .then(() => {
          let data = {
            ids: item.id,
            note: ""
          };
          cancelAppoint(data)
            .then(res => {
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "取消预约成功！"
                });
                this.getTableData(1, this.pageSize);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "取消预约失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "取消预约失败：" + err
              });
            });
        })
        .catch(() => {
          return;
        });
    },

    // 详情弹窗
    openDrawer(row, type) {
      let detailDrawer = this.$refs.detailDrawer;
      detailDrawer.drawer = true;

      detailDrawer.id = row.id;
      detailDrawer.operType = type;
      detailDrawer.row = row;
    },
    // 点击tab 初始化数据
    handleClick(tab, event) {
      this.useTimes = [];
      this.status = null;
      this.activeTab = tab.name;
      this.getTableData(1, this.pageSize);
    },

    // 获取表格数据 状态进行中  1 已提交 2 审核中
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let times = this.useTimes;
      let curStatus;
      //不选中状态时， 进行中1,2  已完成3,8,9
      if (!this.status) {
        curStatus = this.activeTab == "going" ? "1,2" : "3,8,9";
      } else {
        curStatus = ["1-1", "1-2"].includes(this.status) ? "1" : this.status;
      }
      let data = {
        filter: {
          starttime: times ? times[0] : null,
          endtime: times ? times[1] : null,
          applystatus: curStatus,
          applyerid: this.userInfo.ID
        },
        page: page || 1,
        limit: pageSize || this.pageSize
      };
      fetchAppointList(data)
        .then(res => {
          this.tableLoading = false;
          let dataList = res.data || [];
          dataList.forEach(res => {
            res.checktype = JSON.parse(res.checktype);
            res.checkinrule = JSON.parse(res.checkinrule);
          });
          this.opointList = dataList;
          this.total = res.total;
          this.currentPage = page;
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          this.tableLoading = false;
        });
    }
  },
  created() {
    this.getTableData(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.wapper-list {
  width: 980px;
  overflow-x: hidden;
}
.wapper-list /deep/ .el-tabs__header .el-tabs__nav-wrap {
  padding: 0px;
}
.wapper-list /deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 15px;
}
.wapper-list /deep/ .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 15px;
}
.el-card {
  position: relative;
  box-shadow: 0px 2px 4px 0px rgba(3, 27, 78, 0.06);
  border: 1px solid #f2f2f2;
}
.box-card /deep/ .el-card__header {
  border: none;
  background: #fafafa;
}
.box-card /deep/ .el-card__body {
  padding: 0px;
}
.search-box-right {
  position: relative;
  max-width: 100% !important;
}
.fixed-dialog {
  position: absolute;
  width: 400px;
  height: 200px;
  left: -240px;
  top: 36px;
}
.tab-content {
  position: relative;
  min-height: 500px;
}

.switch-text-left,
.switch-text-right {
  position: absolute;
  font-size: 12px;
  color: #ffffff !important;
}
.switch-text-left {
  left: 16px;
  top: 12px;
}
.switch-text-right {
  right: 6px;
  top: 12px;
}

.box-card {
  display: inline-block;
  width: 480px;
  margin-top: 20px;

  cursor: pointer;
  .right-btn {
    font-size: 13px;
    float: right;
    padding: 3px 6px;
    color: #f56323;
    background: #feefe9;
    border-radius: 2px;
  }
}
.box-margin {
  margin-right: 20px;
}
.card-content {
  padding: 20px;
  .title {
    margin-bottom: 10px;
    line-height: 22px;
  }
  .time {
    margin-bottom: 10px;
    line-height: 22px;
    font-size: 16px;
  }
  .group {
    padding: 3px 10px;
    background: #f56323;
    border-radius: 2px;
    font-size: 13px;
    font-weight: 400;
    color: #ffffff;
    margin-right: 10px;
  }
  .res {
    font-size: 16px;
    font-weight: 600;
    color: #474d51;
  }
}
.card-footer {
  border-top: 1px solid #f2f2f2;
  text-align: right;
  padding: 10px;
  height: 54px;
  .suc-btn {
    width: 100px;
    height: 32px;
    line-height: 6px;
    border-radius: 28px;
    border: 1px solid #d6d6d6;
    margin-left: 10px;
  }
}
</style>