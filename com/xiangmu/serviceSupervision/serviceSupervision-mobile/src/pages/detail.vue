<template>
  <div>
    <van-nav-bar title="查看" left-arrow fixed @click-left="goback" />
    <div style="width:100%;height:46px;"></div>
    <div class="basic-box">
      <div class="basic-box-title">
        <span class="tag">{{common.typeFormat(detail.type)}}</span>
        {{detail.title}}
      </div>
      <div class="basic-box-content">
        <p class="applyer-info" v-if="operType==='edit'">
          <span>提问人: {{ detail.applyername }}({{ detail.applyerid }})</span>
          <span style="float:right;">联系方式: {{ detail.applyermobile || "--" }}</span>
        </p>
        <p>{{detail.content}}</p>
        <div class="images">
          <img v-for="item in imageUrls" @click="imgShow=true" :key="item" :src="item" alt />
          <van-image-preview v-model="imgShow" :images="imageUrls"></van-image-preview>
        </div>
        <span class="time">{{common.timeFormat(detail.createtime)}}</span>
      </div>
    </div>
    <div class="reply-box" v-if="['2','3'].includes(detail.applystatus)">
      <div class="reply-box-title clearfix">
        <img src="../../static/images/reply.png" alt />
        <span
          v-if="operType==='edit'"
        >{{detail.handledeptname}}/{{detail.handlername}}({{detail.handlerid}})</span>
        <span v-else>{{detail.handledeptname}}</span>
        <span class="time">{{common.timeFormat(detail.handletime)}}</span>
      </div>
      <div class="reply-box-content">
        <p>{{detail.handlenote}}</p>
        <div
          class="attach"
          v-for="item in attaches"
          :key="item.ID"
          @click="common.downloadFile(item.ID)"
        >
          <i class="iconfont iconfujian"></i>
          <span class="ellipsis">{{item.TITLE}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    operType: String // edit-编辑  view-查看
  },
  data() {
    return {
      detail: {},
      attaches: [],
      imgShow: false,
      imageUrls: []
    };
  },
  computed: {
    // 图片地址
    fileUrl() {
      return this.$store.state.fileUrl;
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    // 获取详情
    getDetail() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.detail = res.data || {};
            let photos = this.detail.photos;
            if (photos) {
              let images = photos.split(",");
              images.forEach(i => {
                this.imageUrls.push(this.fileUrl + i);
              });
            }
            // 如果存在附件，则获取附件信息
            let attaches = this.detail.handleattch;
            if (attaches) {
              this.getAttachInfo(attaches);
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 获取附件信息
    getAttachInfo(attaches) {
      let attachids = attaches.split(",");
      this.util
        .postAjax({
          code: this.global.fileCode,
          url: "rest/FileOut/getFiles",
          isRep: true,
          data: {
            IDs: attachids
          }
        })
        .then(res => {
          if (res.success) {
            let data = res.data;
            _.forEach(attachids, id => {
              this.attaches.push(data[id]);
            });
          }
        });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.basic-box {
  margin-top: 6px;
}
.basic-box-title {
  padding: 16px;
  height: auto !important;
  min-height: 52px;
  font-size: 14px;
  color: #2a2e2e;
  font-weight: 600;
  line-height: 22px;
  .tag {
    display: inline-block;
    background: #ff6f4b;
    border-radius: 3px;
    width: 40px;
    text-align: center;
    color: #ffffff;
    font-size: 12px;
    margin-right: 8px;
  }
}
.basic-box-content,
.reply-box-content {
  padding: 12px 16px;
  p {
    font-size: 14px;
    color: #5f6464;
    line-height: 20px;
    margin-bottom: 12px;
  }
  .time {
    display: inline-block;
    font-size: 12px;
    color: #999999;
  }
  .images {
    margin-bottom: 12px;
    img {
      width: 80px;
      height: 80px;
      margin-right: 8px;
    }
  }
  .applyer-info {
    font-size: 12px;
    color: #999999;
  }
}
.reply-box {
  background: #ffffff;
  .reply-box-title {
    padding: 12px 16px 8px 16px;
    img {
      float: left;
      width: 36px;
      height: 30px;
      vertical-align: middle;
      margin-right: 6px;
    }
    span {
      float: left;
      font-size: 12px;
      color: #999999;
      margin-bottom: 2px;
      margin-top: 6px;
    }
    .time {
      float: right;
      margin-top: 6px;
    }
  }
  .reply-box-content {
    padding-top: 0;
    .attach {
      height: 25px;
      margin-bottom: 8px;
      i {
        background: #e7eefe;
        padding: 5px;
        border-radius: 2px;
        color: #3a78fc;
        margin-right: 8px;
      }
      span {
        width: calc(100% - 60px);
        color: #3a78fc;
        font-size: 14px;
      }
    }
  }
}
</style>