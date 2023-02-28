<template>
  <div class="wapper-list">
    <van-nav-bar
      title="智慧校园预约平台"
      fixed
      :border="false"
      left-arrow
      @click-right="jumpSearch"
      @click-left="$router.go(-1)"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>

    <van-tabs v-model="activeTab" @click="handleClick" color="#3F86F7" title-active-color="#3F86F7">
      <van-tab v-for="tab in tabs" :key="tab.id" :title="tab.name" :name="tab.id">
        <div class="main-content">
          <!---------------------------- 列表 ---------------------------->
          <van-list
            v-model="loading"
            :finished="finished"
            @load="getTableData(1, pageSize)"
            :immediate-check="immediateCheck"
          >
            <template v-for="(item,index) in opointList">
              <div
                class="list-item"
                :class="`animation-${index + 1}`"
                :key="index + item.id"
                @click="toDetail(item)"
              >
                <div class="title">
                  申请时间：{{formatAllTimeStr(item.createtime)}}
                  <span
                    class="tag right"
                  >{{statusFormat(item)}}</span>
                </div>
                <div class="content clearfix">
                  <div class="img-box">
                    <img v-if="item.imgs.length > 0" :src="item.imgs[0]" alt />
                    <img v-else src="@/assets/img/no-img.png" alt />
                  </div>
                  <div class="right-info">
                    <h3 class="van-ellipsis">
                      <span class="tag">{{item.resgroupname}}</span>
                      {{item.resname}}
                    </h3>
                    <span
                      class="time"
                    >{{formatDate(item.usedate)}} {{formatTime(item.starttime)}} ~ {{formatTime(item.endtime)}}</span>
                  </div>
                </div>

                <div class="card-footer" v-show="activeTab=='going'">
                  <van-button
                    class="gray-btn"
                    type="default"
                    v-show="cancelBtn(item)"
                    @click.stop="appointCancel(item)"
                  >取消预约</van-button>
                  <template>
                    <van-button
                      v-if="showAppointBtn(item)"
                      class="blue-btn"
                      plain
                      @click.stop="appointCode(item)"
                    >预约码</van-button>
                    <!--    -->
                    <van-button
                      :disabled="!isShowScan(item)"
                      class="blue-btn"
                      plain
                      @click.stop="doScan(item)"
                    >扫码签到</van-button>
                  </template>
                </div>
              </div>
            </template>
            <div slot="finished" :class="`animation-${opointList.length + 1}`">
              <van-divider
                :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
              >没有更多了</van-divider>
            </div>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <van-dialog
      class="code-dialog"
      v-model="showCode"
      width="215px"
      title
      :showConfirmButton="false"
      :close-on-click-overlay="true"
    >
      <div id="qrcode" v-if="showCode"></div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from "vant";
import QRCode from "qrcodejs2";
import { scanQRCode, checkIn } from "@/api/check/check";
import { fetchAppointList, cancelAppoint } from "@/api/client/appoint";
import { diffmin } from "@/assets/js/client/public";
export default {
  components: {},
  data() {
    return {
      loading: false,
      finished: false,
      immediateCheck: false,
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
      showCode: false
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
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
    showAppointBtn(item) {
      let flag = false,
        stShow = false,
        edShow = false;
      //签到成功后，不显示预约码和签到扫一扫
      if (item.checkintime) {
        return false;
      }
      //是否展示签到规则
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
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },
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

    toDetail(item) {
      this.$router.push(`/appoint/detail/${item.id}`);
    },

    isShowScan(item) {
      let flag = false,
        stShow = false,
        edShow = false;
      //签到成功后，不显示预约码和签到扫一扫
      if (item.checkintime) {
        return false;
      }
      //是否有签到规则
      if (item.checktype) {
        if (item.checktype.code == "1") {
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

    // 扫一扫
    doScan(item) {
      scanQRCode(id => {
        if (id !== item.resid) {
          this.$toast.fail("签到失败,请扫描正确二维码！");
          return false;
        }
        let data = {
          id: item.id
        };
        checkIn(data)
          .then(res => {
            if (res.success) {
              this.$toast.success("签到成功！");
              this.$router.push({
                name: "check-success"
              });
            } else {
              this.$toast.fail("签到失败" + res.data.message || "");
            }
          })
          .catch(err => {
            this.$toast.fail("签到失败：" + err);
          });
      });
    },

    appointCode(item) {
      this.showCode = true;
      this.$nextTick(() => {
        let qrcode = new QRCode(`qrcode`, {
          width: 200,
          height: 200,
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
      Dialog.confirm({
        title: "确认取消预约",
        message: "是否确认取消该预约单吗?"
      })
        .then(() => {
          let data = {
            ids: item.id,
            note: ""
          };
          cancelAppoint(data)
            .then(res => {
              if (res.success) {
                this.$toast.success("取消预约成功！");
                this.getTableData(1, this.pageSize);
              } else {
                this.$toast.fail(`取消预约失败：${res.data.message}`);
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$toast.fail("取消预约失败!");
            });
        })
        .catch(() => {
          return;
        });
    },

    // 点击tab 初始化数据
    handleClick(tabId, title) {
      this.useTimes = [];
      this.status = null;
      this.activeTab = tabId;
      this.getTableData(1, this.pageSize);
    },

    // 获取表格数据 状态进行中  1 已预约 2 审核中
    getTableData(page, pageSize) {
      this.tableLoading = true;
      let times = this.useTimes;
      let curStatus;
      //不选中状态时， 进行中1,2  审核中3,8,9
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
          this.$toast.clear();
          this.loading = false;
          this.finished = true;
          let list = res.data || [];
          list.forEach(i => {
            let imgs = i.resicon;
            imgs = imgs ? imgs.split(",") : [];
            i.imgs = imgs.map(i => window.g.viewUrl + i);
            i.checktype = JSON.parse(i.checktype);
            i.checkinrule = JSON.parse(i.checkinrule);
          });
          this.opointList = list;
        })
        .catch(err => {
          this.$toast.clear();
          this.loading = false;
          this.finished = true;
        });
    }
  },
  created() {
    // 如果不是立即加载，则延迟加载
    if (!this.immediateCheck) {
      setTimeout(() => {
        this.getTableData(this.currentPage, this.pageSize);
      }, 600);
    }
  }
};
</script>

<style lang="scss" scoped>
.wapper-list {
  margin-top: 88px;
}

.main-content {
  padding: 24px;
  background: #f6f6f6;
}
.list-item {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 5px 20px 0px #e6e6e6;
  border-radius: 10px;
  margin-bottom: 24px;
  .title {
    height: 80px;
    font-size: 24px;
    color: #7d7d80;
    line-height: 80px;
    padding-left: 24px;
    border-bottom: 1px solid #dbdbdb;
    .tag {
      font-size: 24px;
      color: #f56323;
      padding-right: 24px;
    }
    .right {
      float: right;
    }
  }
  .content {
    padding: 24px;
    .img-box {
      width: 133px;
      height: 100px;
      float: left;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .right-info {
      float: left;
      margin-left: 25px;
      width: calc(100% - 180px);
      h3 {
        height: 42px;
        font-size: 28px;
        font-weight: blod;
        color: #474d51;
        width: 100%;
        margin-bottom: 20px;
      }
      .tag {
        display: inline-block;
        font-size: 24px;
        color: #ffffff;
        height: 42px;
        line-height: 42px;
        background: #f56323;
        border-radius: 2px;
        padding: 0 16px;
        margin-right: 16px;
      }
      .time {
        font-size: 28px;
        color: #474d51;
        line-height: 33px;
      }
    }
  }
}
.card-footer {
  text-align: right;
  padding: 24px;
  .gray-btn {
    width: 160px;
    height: 56px;
    border-radius: 28px;
    border: 1px solid #d6d6d6;
    font-size: 24px;
  }
  .blue-btn {
    width: 160px;
    height: 56px;
    background: #3f86f7;
    border-radius: 28px;
    color: #ffffff;
    font-size: 24px;
    margin-left: 20px;
  }
}

#qrcode {
  display: inline-block;
  padding: 15px;
  img {
    width: 132px;
    height: 132px;
    background-color: #fff; //设置白色背景色
    // 利用padding的特性，挤出白边
  }
}

.close-btn {
  // position: absolute;
  // right: 10px;
  // top: 0px;
  display: block;
  color: #fff;
}
.van-icon-close::before {
  font-size: 32px;
}
</style>