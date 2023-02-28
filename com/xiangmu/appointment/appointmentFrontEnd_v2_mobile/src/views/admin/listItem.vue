<template>
  <div class="list-item">
    <div class="title">
      申请时间：{{common.defaultTimeFormat(item.createtime)}}
      <span class="tag right">{{status}}</span>
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
        <span class="time">
          {{moment(item.usedate, "YYYYMMDD").format("YYYY-MM-DD")}}
          {{moment(item.starttime, "HHmm").format("HH:mm")}} ~ {{moment(item.endtime, "HHmm").format("HH:mm")}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    // 是否预约管理
    isAppointManage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 状态列表
    statusList() {
      return this.$store.state.statusList;
    },
    // 状态
    status() {
      let status = this.item.applystatus;
      if (this.item.approveorder == "-1" && status == "1") {
        status = "1-1";
        return "已预约";
      } else if (status == "1") {
        status = "1-2";
        return this.isAppointManage ? "审核中" : this.item.nowapprovename;
      } else {
        status = status;
        let item = this.statusList.filter(i => i.id == status)[0];
        return item ? item.name : "--";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
      width: 134px;
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
        font-weight: 600;
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
</style>