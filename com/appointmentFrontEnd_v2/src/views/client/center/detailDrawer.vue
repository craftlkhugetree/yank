<template>
  <el-drawer
    class="base-drawer"
    title="预约详情"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    v-loading="drawerLoading"
    size="660px"
    @open="getDetail"
  >
    <div class="drawer-container">
      <div class="detail">
        <div class="time clearfix">
          <span>申请时间：{{ createtime }}</span>
          <span class="tag right">{{ status }}</span>
        </div>
        <div class="info">
          <div class="info-res clearfix">
            <el-image
              v-if="imgUrls.length > 0"
              style="width: 120px; height: 90px;"
              :src="imgUrls[0]"
              :preview-src-list="imgUrls"
              :z-index="2200"
              fit="contain"
            ></el-image>
            <div class="right-info clearfix">
              <el-tooltip :content="detail.resname">
                <h2 class="ellipsis">
                  <span class="tag-dark">{{ detail.resgroupname }}</span>
                  {{ detail.resname }}
                </h2>
              </el-tooltip>
              <p>
                <i class="el-icon-location"></i>
                {{ detail.reslocation }}
              </p>
            </div>
          </div>
          <div class="info-apply">
            <p>
              <label>申请人</label>
              <span>{{ detail.applyername }}({{ detail.applyerid }})</span>
            </p>
            <p>
              <label>使用时间</label>
              <span>{{ useTimes }}</span>
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
              <label>预约人</label>
              <div class="attach">
                <span class="ellipsis">{{ item.userName + '(' + item.userId + ')' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--------------------------- 申请表单 --------------------------->
      <div class="apply-form">
        <div class="item">
          <h3 class="title">申请表单</h3>
          <div class="content">
            <div class="content-item" v-for="(item, index) in applyFields" :key="index">
              <label>{{ item.name }}</label>
              <div class="attach" v-if="item.type == 'upload'">
                <ul v-if="item.attaches">
                  <li
                    v-for="attach in item.attaches"
                    :key="attach && attach.ID"
                    @click="common.downloadFile(attach && attach.ID)"
                  >
                    <img src="@/assets/img/attach.png" alt />
                    <span class="ellipsis">{{ attach && attach.TITLE }}</span>
                  </li>
                </ul>
              </div>
              <span v-else>{{ item.val }}</span>
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
              <el-timeline-item
                v-for="(item, index) in processList"
                :key="index"
                :color="item.color"
              >
                <div class="approve-timeline-item">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.time }}</p>
                  <p>
                    {{ item.creatername }}{{ item.resultnote
                    }}{{ item.note ? '：' + item.note : '' }}
                  </p>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button
        v-if="!['3', '8', '9'].includes(detail.applystatus)"
        class="suc-btn"
        plain
        @click="appointCancel(detail)"
        v-show="cancelBtn(detail)"
      >
        取消预约
      </el-button>
      <el-popover
        popper-class="popverClass"
        placement="bottom"
        trigger="click"
        width="200"
        visible-arrow="false"
        @hide="hidePopover"
      >
        <!--        -->
        <div
          class="myDrawerCode"
          :id="detail.id + 'drawerCode'"
          v-if="isShowCode"
          :key="detail.id"
        ></div>
        <el-button
          slot="reference"
          v-show="showAppointBtn(detail)"
          class="suc-btn"
          plain
          @click.stop="appointCode(detail)"
        >
          预约码
        </el-button>
      </el-popover>
    </div>
  </el-drawer>
</template>

<script>
import QRCode from 'qrcodejs2';
import { getApplyDetail, cancelAppoint } from '@/api/client/appoint';
import { getFileInfo } from '@/api/admin/file';
import { diffmin } from '@/assets/js/client/public';
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      detail: {},
      applyFields: [],
      isShowCode: false,
    };
  },
  computed: {
    // 是否开启多人预约
    isMulPeople() {
      return this.detail.personRuleCheck;
    },
    imgUrls() {
      let imgs = this.detail.resicon;
      imgs = imgs ? imgs.split(',') : [];
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
      if (this.detail.approveorder == '-1' && status == '1') {
        status = '1-1';
        return '已预约';
      } else if (status == '1') {
        status = '1-2';
        return this.detail.nowapprovename;
      } else {
        status = status;
        let item = this.statusList.filter(i => i.id == status)[0];
        return item ? item.name : '--';
      }
    },
    // 使用时间
    useTimes() {
      let date = this.detail.usedate;
      let starttime = this.detail.starttime;
      let endtime = this.detail.endtime;
      let time =
        this.moment(date).format('YYYY-MM-DD') +
        ' ' +
        this.moment(starttime, 'HHmm').format('HH:mm') +
        ' - ' +
        this.moment(endtime, 'HHmm').format('HH:mm');
      return time;
    },
    // 进度
    processList() {
      let events = this.detail.events || [];
      events.sort((a, b) => {
        return a.createtime > b.createtime ? -1 : 1;
      });
      events.push({
        name: '提交',
        createtime: this.detail.createtime,
      });
      events.forEach((i, index) => {
        if (index == 0) {
          i.color = '#3f86f7';
        }
        i.time = this.common.defaultTimeFormat(i.createtime);
        i.resultnote = i.result == '1' ? '审核通过' : i.result == '0' ? '审核不通过' : '';
        this.common.signEvents(i);
      });
      return events;
    },
  },
  mounted() {
    console.log('id', this.id);
  },
  methods: {
    //隐藏时
    hidePopover() {
      this.isShowCode = false;
    },
    //创建预约码
    appointCode(item) {
      this.isShowCode = !this.isShowCode;
      console.log('1111', item, this.isShowCode);
      if (this.isShowCode) {
        this.$nextTick(() => {
          let drawerCode = new QRCode(`${item.id}drawerCode`, {
            width: 132,
            height: 132,
            text: item.id, // 二维码内容
            colorDark: '#000',
            colorLight: '#fff',
          });
        });
      }
    },
    cancelBtn(item) {
      let appointTime = this.moment(`${item.usedate}${item.starttime}`, 'YYYYMMDDhhmm').format(
        'YYYY-MM-DD HH:mm'
      );
      let nowTime = this.moment().format('YYYY-MM-DD HH:mm');
      //计算时间差并转换成标准时间单位
      let dura = this.moment(appointTime).format('x') - this.moment(nowTime).format('x');
      let tempTime = this.moment.duration(dura);
      let days = tempTime.days() || 0,
        hours = tempTime.hours() || 0,
        mins = tempTime.minutes() || 0;
      let diffHours = parseInt(hours) + parseInt(days * 24);
      let diffMins = parseInt(mins) + parseInt(hours * 60) + parseInt(days * 24 * 60);
      let isShowCancel = true;
      if (item.canceltimeunit == 'minute' && diffMins < item.canceltimeval) {
        isShowCancel = false;
      }
      if (item.canceltimeunit == 'hour' && diffHours < item.canceltimeval) {
        isShowCancel = false;
      }
      return isShowCancel;
    },
    // 取消预约
    appointCancel(item) {
      this.$confirm(`是否确认取消该预约单吗?`, '确认取消预约', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        showClose: false,
      })
        .then(() => {
          let data = {
            ids: item.id,
            note: '',
          };
          cancelAppoint(data)
            .then(res => {
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '取消预约成功！',
                });
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '取消预约失败：' + res.data.message,
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: '取消预约失败：' + err,
              });
            });
        })
        .catch(() => {
          return;
        });
    },

    // 初始化申请表单
    setApplyFields() {
      let fields = this.detail.applyfields;
      let arr = fields ? JSON.parse(fields) : [];
      arr.forEach(i => {
        // 附件
        if (i.type == 'upload') {
          let attachIds = i.val ? i.val.split(',') : [];
          if (attachIds.length > 0) {
            this.getAttaches(attachIds).then(res => {
              this.$set(i, 'attaches', res);
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
        IDs: ids,
      };
      await getFileInfo(data).then(res => {
        if (res.success) {
          let obj = res.data || {};
          arr = ids.map(i => obj[i]);
        }
      });
      return arr;
    },

    // 获取详情
    getDetail() {
      this.drawerLoading = true;
      let data = {
        id: this.id,
      };
      getApplyDetail(data)
        .then(res => {
          this.drawerLoading = false;
          if (res.success) {
            this.detail = res.data || {};
            this.setApplyFields();
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(err => {
          this.drawerLoading = false;
        });
    },
    // 判断是否展示预约码 ，有无审核规则
    showAppointBtn() {
      let flag = false,
        stShow = false,
        edShow = false;
      let item = this.row;
      console.log('this.row', this.row);

      //签到成功后，不显示预约码和签到扫一扫
      if (item && item.checkintime) {
        return false;
      }
      if (item && item.checktype) {
        if (item.checktype.code == '2') {
          if (item.applystatus == '2' && item.approves) {
            flag = true;
          }
          if (item.applystatus == '1' && !item.approves) {
            flag = true;
          }
        }
        //资源开始时间
        let startResTime = this.moment(`${item.usedate}${item.starttime}`, 'YYYYMMDDhhmm').format(
          'YYYY-MM-DD HH:mm'
        );
        //当前操作时间
        let nowTime = this.moment().format('YYYY-MM-DD HH:mm');
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
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 0 20px 32px;
}
.detail {
  .time {
    padding: 14px 10px;
    background: #fafafa;
    border-radius: 2px;
    margin-bottom: 20px;
    color: #7d7d80;
    span {
      line-height: 24px;
    }
    .tag {
      font-size: 13px;
      color: #f56323;
      padding: 3px 6px;
      line-height: 18px;
      background: #feefe9;
    }
    .right {
      float: right;
    }
  }
  .info {
    .info-res {
      margin-bottom: 10px;
      .el-image {
        float: left;
        margin-right: 10px;
      }
      .right-info {
        float: left;
        height: 90px;
        .tag-dark {
          font-size: 13px;
          color: #ffffff;
          padding: 3px 10px;
          background: #f56323;
          border-radius: 2px;
          line-height: 18px;
        }
        h2 {
          margin-top: 12px;
          font-weight: 600;
          color: #474d51;
          line-height: 28px;
          font-size: 20px;
          width: 480px;
        }
        p {
          clear: both;
          margin-top: 18px;
          color: #474d51;
          line-height: 20px;
          i {
            font-size: 18px;
            color: #cccccc;
          }
        }
      }
    }
    .info-apply {
      margin-bottom: 30px;
      p {
        line-height: 20px;
        margin-bottom: 10px;
        label {
          display: inline-block;
          width: 80px;
          color: #7d7d80;
          margin-right: 10px;
        }
        span {
          color: #474d51;
        }
      }
    }
  }
}
.apply-form {
  .item {
    margin-bottom: 30px;
    .title {
      font-size: 16px;
      color: #474d51;
      line-height: 22px;
      position: relative;
      padding: 0 0 10px 36px;
      border-bottom: 1px solid #dbdbdb;
      &::before {
        display: inline-block;
        content: '';
        width: 8px;
        height: 8px;
        border: 4px solid #3f86f7;
        border-radius: 8px;
        position: absolute;
        left: 10px;
        top: 3px;
      }
    }
  }
  .content {
    padding: 20px 10px;
    .content-item {
      margin-bottom: 10px;
    }
    label {
      display: inline-block;
      width: 80px;
      color: #7d7d80;
      line-height: 18px;
      vertical-align: top;
    }
    span {
      color: #474d51;
      line-height: 18px;
    }
  }
  .attach {
    display: inline-block;
    width: calc(100% - 100px);
    li {
      cursor: pointer;
      img {
        width: 13px;
        height: 13px;
        margin-right: 7px;
        vertical-align: text-top;
      }
      span {
        color: #3f86f7;
      }
    }
  }
}

.process-timeline {
  margin: 20px 0 0 10px;
  .approve-timeline-item {
    h3 {
      font-size: 16px;
      color: #7d7d80;
      font-weight: 600;
      margin-bottom: 20px;
    }
    p {
      font-size: 13px;
      font-weight: 400;
      color: #474d51;
      line-height: 18px;
      margin-bottom: 10px;
    }
  }

  .el-timeline-item {
    padding-bottom: 30px;
    &:nth-of-type(1) {
      h3 {
        color: #474d51;
      }
    }
  }
}
.suc-btn {
  width: 100px;
  height: 32px;
  line-height: 6px;
  border-radius: 2px;
  border: 1px solid #d6d6d6;
  margin-right: 10px;
}
</style>
