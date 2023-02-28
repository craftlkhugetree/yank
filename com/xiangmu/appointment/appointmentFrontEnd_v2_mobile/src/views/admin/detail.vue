<template>
  <div style="padding-bottom: 120px;background:#f6f6f6;">
    <div class="detail">
      <div class="time clearfix">
        <span>申请时间：{{createtime}}</span>
        <span class="tag right">{{status}}</span>
      </div>
      <div class="info">
        <div class="info-res clearfix">
          <div class="img-box">
            <img v-if="imgUrls.length > 0" :src="imgUrls[0]" alt @click="showImage = true;" />
            <img v-else src="@/assets/img/no-img.png" alt @click="showImage = true;" />
          </div>
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
            <label>{{item.name}} </label>
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
    <slot></slot>
  </div>
</template>

<script>
import { getApplyDetail } from "@/api/admin/appoint";
import { getFileInfo } from "@/api/admin/file";
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
      showProcess: false
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
.detail {
  padding-top: 88px;
  background: #ffffff;
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
      .img-box {
        width: 134px;
        height: 100px;
        float: left;
        margin-right: 24px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .right-info {
        float: left;
        height: 90px;
        width: calc(100% - 180px);
        h2 {
          font-weight: 600;
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
      font-weight: 600;
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
      width: 160px;
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
    width: calc(100% - 180px);
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
        font-weight: 600;
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
.extra {
    height: 28px;
      font-size: 24px;
}
</style>