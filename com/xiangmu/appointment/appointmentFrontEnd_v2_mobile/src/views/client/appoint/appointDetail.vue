<template>
  <div class="detail-content">
    <van-nav-bar
      title="查看详细"
      fixed
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="jumpSearch"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div>
      <div class="detail">
        <div class="time clearfix">
          <span>申请时间: {{createtime}}</span>
          <span class="tag right">{{status}}</span>
        </div>
        <div class="info">
          <div class="info-res clearfix">
            <img v-if="imgUrls.length > 0" :src="imgUrls[0]" alt @click="showImage = true;" />
            <img v-else src="@/assets/img/no-img.png" alt @click="showImage = true;" />
            <van-image-preview v-model="showImage" :images="imgUrls"></van-image-preview>
            <div class="right-info clearfix">
              <h2 class="van-ellipsis">{{detail.resname}}</h2>
              <p class="van-ellipsis">
                <span class="tag-dark">{{detail.resgroupname}}</span>
                <van-icon name="location" />
                {{detail.reslocation}}
              </p>
            </div>
          </div>
          <div class="info-apply">
            <p>
              <label>申请人</label>
              <span>{{detail.applyername}}({{detail.applyerid}})</span>
            </p>
            <p>
              <label>使用时间</label>
              <span>{{useTimes}}</span>
            </p>
          </div>
        </div>
      </div>
      <!--------------------------- 多人预约 --------------------------->
      <div class="apply-form" v-if="isMulPeople">
        <div class="item">
          <h3 class="title">多人预约</h3>
          <div class="content">
            <div class="content-item" v-for="(item, index) in detail.persons" :key="index">
              <label class="extra">预约人</label>
              <div class="attach extra">
                <span class="ellipsis">{{ item.userName + '(' + item.userId + ')' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--------------------------- 申请表单 --------------------------->
      <div class="apply-form" v-if="applyFields.length > 0">
        <div class="item">
          <h3 class="title">申请表单</h3>
          <div class="content">
            <div class="content-item" v-for="(item,index) in applyFields" :key="index">
              <label>{{item.name}}</label>
              <div class="attach" v-if="item.type == 'upload'">
                <ul v-if="item.attaches">
                  <li
                    class="van-ellipsis"
                    v-for="attach in item.attaches"
                    :key="attach.ID"
                    @click="common.downloadFile(attach.ID)"
                  >
                    <img src="@/assets/img/attach.png" alt />
                    <span>{{attach.TITLE}}</span>
                  </li>
                </ul>
              </div>
              <span v-else>{{item.val}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--------------------------- 进度 --------------------------->
      <div class="apply-form">
        <div class="item">
          <h3 class="title">进度</h3>
          <div class="process-content">
            <el-timeline class="process-timeline">
              <transition-group name="list" tag="div">
                <el-timeline-item v-for="item in processList" :key="item.time" :color="item.color">
                  <div class="approve-timeline-item">
                    <h3>{{item.name}}</h3>
                    <p>{{item.time}}</p>
                    <p>{{item.creatername}}{{item.resultnote}}{{item.note ? "：" + item.note : ""}}</p>
                  </div>
                </el-timeline-item>
              </transition-group>
            </el-timeline>
          </div>
          <p class="text-btn" @click="showProcess=!showProcess">
            {{showProcess ? "点击收起进度" : "点击展开进度"}}
            <van-icon :name="showProcess ? 'arrow-up' : 'arrow-down'"></van-icon>
          </p>
        </div>
      </div>
    </div>
    <!--------------------------- 取消预约 签到 预约码按钮 --------------------------->
    <div class="footer-btn" v-if="isCanCancel">
      <van-button type="default" @click="appointCancel(detail)" v-show="cancelBtn(detail)">取消预约</van-button>
      <template v-if="detail.checktype">
        <van-button
          v-show="showAppointBtn(detail)"
          class="blue-btn"
          type="info"
          @click.stop="appointCode(detail)"
        >预约码</van-button>
        <van-button
          :disabled="!isShowScan(detail)"
          class="blue-btn"
          type="info"
          @click.stop="doScan(detail)"
        >扫码签到</van-button>
      </template>
    </div>
    <van-dialog
      class="code-dialog"
      v-model="showCode"
      width="215px"
      title
      :showConfirmButton="false"
      :close-on-click-overlay="true"
    >
      <!-- <van-icon name="close" class="close-btn" /> -->
      <div id="qrcode" v-if="showCode"></div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from "vant";
import QRCode from "qrcodejs2";
import { scanQRCode, checkIn } from "@/api/check/check";
import { fetchAppointList, cancelAppoint } from "@/api/client/appoint";
import { getApplyDetail } from "@/api/admin/appoint";
import { getFileInfo } from "@/api/admin/file";
import { diffmin } from "@/assets/js/client/public";
export default {
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      detail: {},
      applyFields: [],
      showImage: false,
      showProcess: false,
      showCode: false
    };
  },
  computed: {
    // 是否开启多人预约
    isMulPeople() {
      return this.detail.personRuleCheck;
    },
    // 是否可以取消预约：已预约、审核中、审核通过
    isCanCancel() {
      return this.$store.state.isCanCancel;
    },
    imgUrls() {
      let imgs = this.detail.resicon;
      imgs = imgs ? imgs.split(",") : [];
      return imgs.map(i => window.g.viewUrl + i);
    },
    // 申请时间
    createtime() {
      let time = this.detail.createtime;
      return this.common.defaultTimeFormat(time);
    },
    // 状态列表
    statusList() {
      return this.$store.state.statusList;
    },
    // 状态
    status() {
      let status = this.detail.applystatus;
      if (this.detail.approveorder == "-1" && status == "1") {
        status = "1-1";
        return "已预约";
      } else if (status == "1") {
        status = "1-2";
        return this.detail.nowapprovename;
      } else {
        status = status;
        let item = this.statusList.filter(i => i.id == status)[0];
        return item ? item.name : "--";
      }
    },
    // 使用时间
    useTimes() {
      let date = this.detail.usedate;
      let starttime = this.detail.starttime;
      let endtime = this.detail.endtime;
      let time =
        this.moment(date).format("YYYY-MM-DD") +
        " " +
        this.moment(starttime, "HHmm").format("HH:mm") +
        " - " +
        this.moment(endtime, "HHmm").format("HH:mm");
      return time;
    },
    // 进度
    processList() {
      let events = _.cloneDeep(this.detail.events) || [];
      events.sort((a, b) => {
        return a.createtime > b.createtime ? -1 : 1;
      });
      events.push({
        name: "提交",
        createtime: this.detail.createtime
      });
      events.forEach((i, index) => {
        if (index == 0) {
          i.color = "#3f86f7";
        }
        i.time = this.common.defaultTimeFormat(i.createtime);
        i.resultnote =
          i.result == "1" ? "审核通过" : i.result == "0" ? "审核不通过" : "";
        this.common.signEvents(i)
      });
      return this.showProcess ? events : events.slice(0, 1);
    }
  },
  methods: {
    //是否展示预约码
    showAppointBtn(item) {
      let flag = false,
        stShow = false,
        edShow = false;
      //签到成功后，不显示预约码和签到扫一扫
      if (item.checkintime) {
        return false;
      }
      if (item.checktype) {
        let checktype = JSON.parse(item.checktype);
        if (checktype.code == "2") {
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
          let checkinrule = JSON.parse(item.checkinrule);
          //例：资源开始时间  前10分钟可以签到
          if (startDura > 0 && startDura <= checkinrule.checkTime) {
            stShow = true;
          }
          //例：资源开始时间  20分钟 后 停止签到
          if (endDura > 0 && endDura <= checkinrule.stopCheckTime) {
            edShow = true;
          }
        }
        let show = flag && (stShow || edShow);
        return show;
      }
    },
    //是否展示签到扫一扫
    isShowScan(item) {
      let flag = false,
        stShow = false,
        edShow = false;
      //签到成功后，不显示预约码和签到扫一扫
      if (item.checkintime) {
        return false;
      }
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
          let checkinrule = JSON.parse(item.checkinrule);
          //例：资源开始时间  前10分钟可以签到
          if (startDura > 0 && startDura <= checkinrule.checkTime) {
            stShow = true;
          }
          //例：资源开始时间  20分钟 后 停止签到
          if (endDura > 0 && endDura <= checkinrule.stopCheckTime) {
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
              this.$toast.fail("签到失败：" + res.data.message || "");
            }
          })
          .catch(err => {
            this.$toast.fail("签到失败：" + err);
          });
      });
    },

    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },
    // 初始化申请表单
    setApplyFields() {
      let fields = this.detail.applyfields;
      let arr = fields ? JSON.parse(fields) : [];
      arr.forEach(i => {
        // 附件
        if (i.type == "upload") {
          let attachIds = i.val ? i.val.split(",") : [];
          if (attachIds.length > 0) {
            this.getAttaches(attachIds).then(res => {
              this.$set(i, "attaches", res);
            });
          }
        }
      });
      this.applyFields = arr;
    },

    // 获取附件
    async getAttaches(ids) {
      let arr = [];
      let data = {
        IDs: ids
      };
      await getFileInfo(data).then(res => {
        if (res.success) {
          let obj = res.data || {};
          arr = ids.map(i => obj[i]);
        }
      });
      return arr;
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
                this.$router.go(-1);
              } else {
                this.$toast.fail(`取消预约失败：${res.data.message}`);
              }
            })
            .catch(err => {
              this.$toast.fail("取消预约失败!");
            });
        })
        .catch(() => {
          return;
        });
    },

    // 获取详情
    getDetail() {
      this.loading = true;
      let data = {
        id: this.id
      };
      getApplyDetail(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.detail = res.data || {};
            this.setApplyFields();
            // 判断是否可以取消(已预约、审核中、审核通过)
            let status = this.detail.applystatus;
            let isCanCancel = ["1", "2"].includes(status);
            this.$store.commit("setIsCanCancel", isCanCancel);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.detail-content {
  height: 100%;
  background: #f6f6f6;
}
.detail {
  padding-top: 88px;
  background: #fff;
  .time {
    font-size: 24px;
    padding: 0 24px;
    height: 80px;
    line-height: 80px;
    color: #7d7d80;
    border-bottom: 1px solid #dbdbdb;
    .tag {
      font-size: 24px;
      color: #f56323;
    }
    .right {
      float: right;
    }
  }
  .info {
    padding: 24px;
    margin-bottom: 32px;
    .info-res {
      margin-bottom: 32px;
      img {
        float: left;
        margin-right: 24px;
        width: 134px;
        height: 100px;
      }
      .right-info {
        float: left;
        height: 90px;
        width: calc(100% - 180px);
        h2 {
          font-weight: blod;
          color: #474d51;
          line-height: 38px;
          font-size: 28px;
          width: 100%;
          margin-bottom: 20px;
        }
        p {
          width: 100%;
          font-size: 24px;
          color: #474d51;
          margin-top: 18px;
          color: #474d51;
          height: 42px;
          .tag-dark {
            display: inline-block;
            color: #ffffff;
            padding: 0 16px;
            background: #f56323;
            border-radius: 2px;
            height: 42px;
            line-height: 42px;
            margin-right: 30px;
          }
          .van-icon {
            font-size: 20px;
            color: #cccccc;
            vertical-align: bottom;
          }
        }
      }
    }
    .info-apply {
      p {
        font-size: 24px;
        line-height: 28px;
        margin-bottom: 24px;
        color: #7d7d80;
        label {
          display: inline-block;
          width: 120px;
          margin-right: 10px;
        }
      }
    }
  }
}
.apply-form {
  background: #ffffff;
  .item {
    margin-bottom: 30px;
    .title {
      font-size: 28px;
      font-weight: blod;
      color: #51575c;
      line-height: 33px;
      position: relative;
      padding: 32px 0 0 68px;
      &::before {
        display: inline-block;
        content: "";
        width: 12px;
        height: 12px;
        border: 6px solid #3f86f7;
        border-radius: 12px;
        position: absolute;
        left: 32px;
        top: 36px;
      }
    }
  }
  .content {
    padding: 32px;
    .content-item {
      margin-bottom: 26px;
    }
    label {
      display: inline-block;
      width: 128px;
      color: #7d7d80;
      line-height: 28px;
      vertical-align: top;
      margin-right: 10px;
    }
    span {
      color: #474d51;
      line-height: 28px;
    }
  }
  .attach {
    display: inline-block;
    width: calc(100% - 150px);
    li {
      cursor: pointer;
      margin-bottom: 10px;
      color: #3f86f7;
      img {
        width: 25px;
        height: 25px;
        margin-right: 15px;
        vertical-align: text-top;
      }
      span {
        color: #3f86f7;
      }
    }
  }
}

.process-content {
  padding: 32px;
  .process-timeline {
    .approve-timeline-item {
      h3 {
        font-size: 24px;
        font-weight: blod;
        color: #7d7d80;
        line-height: 28px;
        margin-bottom: 24px;
      }
      p {
        font-size: 24px;
        font-weight: 400;
        color: #7d7d80;
        line-height: 28px;
        margin-bottom: 10px;
      }
    }

    .el-timeline-item {
      padding-bottom: 30px;
      &:nth-of-type(1) {
        h3 {
          color: #51575c;
        }
        p {
          color: #474d51;
        }
      }
    }
  }
}
.text-btn {
  font-size: 20px;
  color: #999999;
  line-height: 28px;
  text-align: center;
  padding-bottom: 32px;
}

.footer-btn {
  width: 100%;
  height: 120px;
  position: fixed;
  bottom: 0;
  background: #ffffff;
  text-align: center;
  padding: 0 48px;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-around;
  align-items: center;
  .van-button {
    width: 150px;
    border-radius: 35px;
  }
  .blue-btn {
    background: #3f86f7;
    border-color: #3f86f7;
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
.extra {
    height: 28px;
    font-size: 24px;
}
</style>