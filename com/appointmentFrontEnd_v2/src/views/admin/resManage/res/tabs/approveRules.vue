<template>
  <div class="main">
    <!--------------------------- 审核层级 --------------------------->
    <div class="item">
      <h3 class="title">审核层级</h3>
      <div class="content approve-content">
      <div v-if="list.length == 0" style="color:#595959;">暂无审核层级</div>
        <el-timeline class="approve-timeline">
          <el-timeline-item v-for="(item, index) in list" :key="index">
            <div class="approve-timeline-item">
              <h3>第{{item.order}}步</h3>
              <p>{{item.name}}</p>
              <p>
                {{item.usernames}}
                <span class="tip">
                  <i class="el-icon-warning"></i>
                  或签（一名审批人同意或拒绝即可）
                </span>
              </p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <!--------------------------- 审核超时 --------------------------->
    <div class="item">
      <h3 class="title">审核超时</h3>
      <div class="content approve-content">资源使用时间开始前 {{timeOut}} 分钟未审核，则默认审核不通过</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resDetail: Object
  },
  data() {
    return {
      timeOut: 0,
      list: []
    };
  },
  watch: {
    resDetail() {
      this.setList();
    }
  },
  methods: {
    // 初始化数据
    setList() {
      let data = this.resDetail.approves;
      if (data[0]) {
        this.timeOut = data[0].timeout || 0;
        let arr = [];
        this.list = data;
        this.list.sort((a, b) => {
          return a.order > b.order ? 1 : -1;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  padding: 5px 0;
}
.item {
  margin-bottom: 30px;
  .title {
    font-size: 16px;
    color: #474d51;
    line-height: 22px;
    position: relative;
    padding: 0 0 10px 36px;
    border-bottom: 1px dashed #dbdbdb;
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
}
.approve-timeline {
  margin: 20px 0 0 4px;
  .el-timeline-item {
    padding-bottom: 10px;
  }
  .approve-timeline-item {
    h3 {
      font-size: 14px;
      color: #7d7d80;
      font-weight: 400;
      margin-bottom: 10px;
    }
    p {
      line-height: 30px;
    }
  }
}
.approve-content {
  font-size: 14px;
  color: #595959;
}
.tip {
  display: inline-block;
  min-width: 200px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  margin-bottom: 10px;
  margin-left: 20px;
  i {
    color: #3f86f7;
    font-size: 14px;
  }
}
</style>