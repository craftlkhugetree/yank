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
          <span>申请时间：{{createtime}}</span>
          <span class="tag right">{{status}}</span>
        </div>
        <div class="info">
          <div class="info-res clearfix">
            <el-image
              v-if="imgUrls.length > 0"
              style="width: 120px; height: 90px"
              :src="imgUrls[0]"
              :preview-src-list="imgUrls"
              :z-index="2200"
              fit="contain"
            ></el-image>
            <div class="right-info clearfix">
              <el-tooltip :content="detail.resname">
                <h2 class="ellipsis">
                  <span class="tag-dark">{{detail.resgroupname}}</span>
                  {{detail.resname}}
                </h2>
              </el-tooltip>
              <p>
                <i class="el-icon-location"></i>
                {{detail.reslocation}}
              </p>
            </div>
          </div>
          <div class="info-apply">
            <p>
              <label>申请人 </label>
              <span>{{detail.applyername}}({{detail.applyerid}})</span>
            </p>
            <p>
              <label>使用时间 </label>
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
              <label>预约人</label>
              <div class="attach">
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
              <label>{{item.name}} </label>
              <div class="attach" v-if="item.type == 'upload'">
                <ul v-if="item.attaches">
                  <li
                    v-for="attach in item.attaches"
                    :key="attach.ID"
                    @click="common.downloadFile(attach.ID)"
                  >
                    <img src="@/assets/img/attach.png" alt />
                    <span class="ellipsis">{{attach.TITLE}}</span>
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
              <el-timeline-item
                v-for="(item, index) in processList"
                :key="index"
                :color="item.color"
              >
                <div class="approve-timeline-item">
                  <h3>{{item.name}}</h3>
                  <p>{{item.time}}</p>
                  <p>{{item.creatername}}{{item.resultnote}}{{item.note ? "：" + item.note : ""}}</p>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
      <!--------------------------- 审核意见 --------------------------->
      <div class="apply-form" v-if="operType == 'audit'">
        <div class="item">
          <h3 class="title">审核意见</h3>
          <div class="content">
            <el-input type="textarea" v-model="note" :rows="5" resize="none" placeholder="请输入审核意见"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-footer" v-if="operType == 'audit'">
      <el-button type="primary" size="small" @click="doAudit('1')">通过</el-button>
      <el-button size="small" @click="doAudit('0')">不通过</el-button>
    </div>
    <div class="drawer-footer" v-else>
      <el-button size="small" @click="drawer = false">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { getApplyDetail } from "@/api/admin/appoint";
import { doApprove } from "@/api/admin/approve";
import { getFileInfo } from "@/api/admin/file";
export default {
  data() {
    return {
      operType: null, // view-查看  audit-审核
      id: null,
      drawer: false,
      drawerLoading: false,
      detail: {},
      applyFields: [],
      note: null
    };
  },
  computed: {
    // 是否开启多人预约
    isMulPeople() {
      return this.detail.personRuleCheck;
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
      let events = this.detail.events || [];
      events.sort((a,b) => {
        return a.createtime > b.createtime ? -1 : 1
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
      return events;
    }
  },
  methods: {
    // 审核
    doAudit(result) {
      let msg = result == "1" ? "通过" : "不通过";
      this.$confirm(`是否确认审核${msg}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.drawerLoading = true;
          let data = {
            applyid: this.id,
            note: this.note,
            result: result
          };
          doApprove(data)
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "审核成功！"
                });
                this.drawer = false;
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "审核失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "审核失败：" + err
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

    // 获取详情
    getDetail() {
      this.drawerLoading = true;
      let data = {
        id: this.id
      };
      getApplyDetail(data)
        .then(res => {
          this.drawerLoading = false;
          if (res.success) {
            this.detail = res.data || {};
            this.setApplyFields();
            this.note = null;
          }
        })
        .catch(err => {
          this.drawerLoading = false;
        });
    }
  }
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
        content: "";
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
</style>