<template>
  <div class="list-box">
    <div class="list-box-title">
      <span class="title">{{item.title}}</span>
      <span class="time">{{common.timeFormat(item.createtime)}}</span>
    </div>
    <!---------------------------------- 详情 ---------------------------------->
    <div class="list-box-content clearfix">
      <div class="left-content">
        <p class="ellipsis--l2">{{item.note}}</p>
        <span class="status-tag">{{common.statusFormat(item.applystatus)}}</span>
      </div>
      <div class="right-content">
        <div class="images" v-if="item.photos">
          <img :src="srcList[0]" alt />
          <span class="count">{{ srcList.length }}图</span>
        </div>
        <img v-else src="../../static/images/nophoto.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    // 图片列表
    srcList() {
      let images = this.item.photos ? this.item.photos.split(",") : [];
      return images.map(i => this.fileUrl + i);
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.list-box {
  padding: 20px 30px;
  margin-bottom: 20px;
  border-radius: 5px;
  &.active {
    .list-box-title {
      .title {
        color: #638dec;
        font-weight: 600;
      }
    }
  }
}
.list-box-title {
  margin-bottom: 10px;
  .tag {
    display: inline-block;
    font-size: 12px;
    line-height: 20px;
    padding: 2px 6px;
    background: #f6f6f6;
    margin-right: 6px;
    color: #a7a7a7;
  }
  .title {
    font-size: 16px;
    color: #464032;
    line-height: 24px;
  }
  .time {
    float: right;
    font-size: 12px;
    color: #999999;
    line-height: 24px;
  }
}
.list-box-content {
  p {
    font-size: 12px;
    color: #93928e;
    line-height: 24px;
    min-height: 48px;
    margin-bottom: 10px;
  }
  .left-content {
    float: left;
    width: calc(100% - 100px);
  }
  .right-content {
    float: right;
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
    .images {
      width: 100%;
      height: 100%;
      position: relative;
      .count {
        position: absolute;
        display: inline-block;
        padding: 5px;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 5px 0 0 0;
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }
    }
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
  .process-content {
    padding: 25px 0 0;
    .process-box {
      padding: 5px 0 0;
      color: #999999;
      .time {
        margin-right: 20px;
        font-size: 12px;
      }
      p {
        margin: 10px 0;
        font-size: 14px;
        line-height: 20px;
        color: #999999;
      }
      .images {
        margin-bottom: 10px;
        .el-image {
          width: 80px;
          height: 80px;
          margin-right: 10px;
        }
      }
      .result {
        margin: 10px 0;
        font-size: 14px;
        line-height: 30px;
        label {
          margin-right: 5px;
        }
        img {
          width: 24px;
          height: 24px;
          margin-right: 5px;
          vertical-align: middle;
        }
        .score {
          float: right;
          .el-rate {
            float: right;
          }
        }
      }
    }
    .el-timeline-item.active {
      .process-box {
        color: #666666;
        p {
          color: #666666;
        }
      }
    }
  }
}
.list-box-footer {
  margin: 0 -30px -10px;
  padding: 10px 30px 0;
  box-shadow: 0px -1px 3px 0px rgba(18, 18, 18, 0.1);
}
.status-tag {
  display: inline-block;
  background: rgba(253, 125, 24, 0.1);
  font-size: 14px;
  color: #fd7d18;
  line-height: 22px;
  padding: 5px 16px;
}
.right-btns {
  float: right;
  .el-button {
    min-width: 80px;
  }
}

// 动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease-in;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-30px);
  opacity: 0;
}

.list-leave-active,
.list-enter-active {
  transition: all 0.5s ease-in;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}
</style>