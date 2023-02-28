<template>
  <div class="detail" v-loading="loading">
    <h3>报修单详情</h3>
    <div class="detail-content">
      <div class="detail-title">
        <span class="title">{{detail.title}}</span>
        <span class="status-tag">{{common.statusFormat(applyDetail.applystatus)}}</span>
      </div>
      <div class="detail-info">
        <span>报修时间：{{common.timeFormat(applyDetail.createtime)}}</span>
        <span>报修人：{{applyDetail.applyername}}</span>
        <span>联系电话：{{applyDetail.mobile}}</span>
      </div>
      <p style="margin-bottom:10px;color:#999999;">物品类型：{{applyDetail.itemname || "--"}}</p>
      <p>{{applyDetail.note}}</p>
      <div class="big-images" v-if="detail.photos">
        <el-image v-for="img in srcList" :key="img" :src="img" :preview-src-list="srcList"></el-image>
      </div>
    </div>
    <slot></slot>
    <!---------------------------------- 派单信息 ---------------------------------->
    <div class="process">
      <div class="process-title">
        <span class="title">派单信息</span>
        <span class="status-tag">
          <i class="iconfont iconshijianzhongbiao2"></i>
          维修时间：{{common.timeFormat(detail.starttime,"YYYY-MM-DD")}}
        </span>
      </div>
      <div class="send-info">
        <p>{{detail.sendnote}}</p>
        <span>派单人：{{detail.repairleadername}}</span>
        <span style="float:right;">派单时间：{{common.timeFormat(detail.createtime)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      detail: {}
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    applyDetail() {
      let data = {};
      let applys = this.detail.relationApplys || [];
      if (applys.length > 0) {
        for (let i = 0; i < applys.length; i++) {
          if (applys[i].title === this.detail.title) {
            data = applys[i];
          }
        }
      }
      return data;
    },
    // 图片列表
    srcList() {
      let images = this.detail.photos ? this.detail.photos.split(",") : [];
      return images.map(i => this.fileUrl + i);
    }
  },
  watch: {
    id() {
      this.getDetail();
    }
  },
  methods: {
    // 获取数据
    getDetail() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "repair/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.detail = res.data || {};
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
  margin: 0 20px 20px 0;
  padding: 25px 20px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(37, 38, 41, 0.1),
    0px 24px 20px -24px rgba(37, 38, 41, 0.18);
  border-radius: 5px;
  h3 {
    color: #464032;
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 15px;
    border-bottom: 1px solid #dbdbdb;
  }
  h4 {
    margin-bottom: 10px;
  }
  .detail-title {
    padding-top: 20px;
    padding-bottom: 5px;
    line-height: 32px;
    .title {
      color: #638dec;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .detail-info {
    line-height: 17px;
    margin-bottom: 10px;
    span {
      color: #999999;
      font-size: 12px;
      margin-right: 30px;
    }
  }
  p {
    color: #666666;
    font-size: 14px;
    line-height: 28px;
    margin-bottom: 20px;
  }
  .big-images {
    margin-bottom: 30px;
    .el-image {
      width: 160px;
      height: 160px;
      margin-right: 20px;
    }
  }
}
.process {
  .process-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #dbdbdb;
    .title {
      color: #464032;
      font-weight: 600;
      font-size: 16px;
    }
    .right-btn {
      float: right;
      font-size: 12px;
      color: #999999;
      cursor: pointer;
    }
    .title,
    .right-btn {
      line-height: 22px;
    }
  }
}

// 动画
.list-leave-active,
.list-enter-active {
  transition: all 0.5s ease-in;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}

.status-tag {
  float: right;
  background: rgba(253, 125, 24, 0.1);
  font-size: 14px;
  color: #fd7d18;
  line-height: 22px;
  padding: 5px 16px;
}
.process-title {
  .status-tag {
    margin-top: -10px;
  }
}

.send-info {
  padding: 20px 0;
  p {
    margin-bottom: 10px;
  }
  span {
    color: #93928e;
  }
}
</style>