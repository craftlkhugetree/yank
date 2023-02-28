<template>
  <div class="record">
    <van-nav-bar fixed title="操作记录" :border="false" left-arrow @click-left="$router.goBack()" />
    <div style="width:100%;height:46px;"></div>
    <div class="record-box" v-for="item in list" :key="item.ID">
      <span class="dot"></span>
      <span class="title">{{common.defaultTimeFormat(item.createtime)}}</span>
      <div class="content">
        <span class="name">{{item.creatername}}（{{item.createrid}}）</span>
        {{item.content}}
      </div>
    </div>
    <div v-if="list.length == 0" class="nodata">
        暂无数据
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    let data = sessionStorage.getItem("events");
    this.list = data ? JSON.parse(data) : [];
    this.list.sort((a,b) => {
      return a.createtime > b.createtime ? -1 : 1
    })
    this.list.forEach(i => {
      let content = "";
      let note = i.note ? "，" + i.note : "";
      switch (i.type) {
        case "1":
          content = "发起录入 " + note;
          break;
        case "2":
          content = "撤回录入";
          break;
        case "3":
          content = "提交录入结果，发起内部确认" + note;
          break;
        case "4":
          if (i.result == "1") {
            content = "内部确认通过" + note;
          } else {
            let rNote = i.note ? "，原因：" + i.note : "";
            content = "内部确认未通过，请求重新修改" + rNote;
          }
          break;
        case "5":
          if (i.result == "1") {
            content = "审核通过" + note;
          } else {
            let rNote = i.note ? "，原因：" + i.note : "";
            content = "审核未通过，请求重新修改" + rNote;
          }
          break;
      }
      i.content = content;
    });
  }
};
</script>

<style lang="scss" scoped>
.record {
  width: 100%;
  min-height: 100%;
  background: #ffffff;
  .record-box {
    padding: 24px 28px;
    border-bottom: 1px solid #dbdbdb;
    .dot {
      float: left;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background: #3f86f7;
      margin-top: 12px;
    }
    .title {
      display: inline-block;
      width: 80%;
      font-size: 26px;
      color: #333333;
      line-height: 38px;
      padding-left: 20px;
    }
    .content {
      padding: 16px 28px 0;
      font-size: 26px;
      color: #333333;
      line-height: 38px;
      .name {
        color: #3f86f7;
      }
    }
  }
}
</style>
<style>
.nodata {
    text-align: center;
    font-size: 28px;
    color: #999999;
    padding: 60px;
}
</style>