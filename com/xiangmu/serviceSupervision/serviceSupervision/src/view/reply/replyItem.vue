<!--  -->
<template>
  <div class="bgc clearfix">
    <div class="replyicon">
      答复
      <div class="iconarro"></div>
    </div>
    <div class="replyinfo">
      <p class="transferInfo">
        <span class="label">负责部门：</span>
        <span class="item orgname">{{ info.handledeptname }}</span>
        <span class="label">答复时间：</span>
        <span class="item orgname">{{
          util.formatTime(info.handletime, "YYYY-MM-DD HH:mm")
        }}</span>
        <!-- <span class="label" v-if="showHandler">答复人员：</span>
        <span class="item" v-if="showHandler">{{ info.handlername }}</span> -->
        <el-rate
          v-if="info.markscore"
          class="rates"
          v-model="info.markscore"
          :colors="['#ff6f4b']"
          disabled
        >
        </el-rate>
      </p>
      <p class="replycontent">
        {{ info.handlenote }}
      </p>
      <div class="attachs">
        <span
          v-for="item in replyAttaches"
          :key="item.ID"
          @click="download(item.ID)"
        >
          <i class="el-icon-paperclip"></i> {{ item.TITLE }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      replyAttaches: [],
    };
  },
  props: {
    info: Object,
    showHandler: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  methods: {
    download(id) {
      window.open(this.$store.state.downUrl + id);
    },
  },
  created() {
    this.info.markscore = parseInt(this.info.markscore);
    if (this.info.handleattch) {
      let attachids = this.info.handleattch.split(",");
      this.util
        .postAjax({
          code: this.global.fileCode,
          url: "rest/FileOut/getFiles",
          isRep: true,
          data: {
            IDs: attachids,
          },
        })
        .then((res) => {
          if (res.success) {
            let data = res.data;
            _.forEach(attachids, (id) => {
              this.replyAttaches.push(data[id]);
            });
          }
        });
    }
  },
};
</script>
<style lang='scss' scoped>
.bgc {
  width: 100%;
  // margin-top: 20px;
  // border-bottom: 1px solid #eeeeee;
}
.replyicon {
  width: 36px;
  height: 20px;
  background: #3a78fc;
  float: left;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #ffffff;
  position: relative;
  margin-right: 20px;
}
.iconarro {
  width: 8px;
  height: 8px;
  border-top: 4px solid #3a78fc;
  border-left: 4px solid #3a78fc;
  border-right: 4px solid #fff;
  border-bottom: 4px solid #fff;
}
.replyinfo {
  float: left;
  width: calc(100% - 56px);
}
.transferInfo {
  height: 14px;
  font-size: 12px;
  color: #999999;
  line-height: 14px;
  margin-bottom: 10px;
}
.orgname {
  display: inline-block;
  margin-right: 30px;
}
.replycontent {
  font-size: 14px;
  color: #5f6464;
  margin-bottom: 12px;
  line-height: 28px;
}
.el-icon-paperclip {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #3a78fc;
  background: #e7eefe;
  font-size: 12px;
  border-radius: 3px;
  margin-right: 10px;
}
.attachs > span {
  display: block;
  font-size: 12px;
  color: #3a78fc;
  line-height: 14px;
  cursor: pointer;
  margin-bottom: 10px;
}
.attachs {
  // margin-bottom: 30px;
}
.rates {
  float: right;
  & /deep/ .el-rate__icon {
    font-size: 24px;
    margin-right: 2px;
    color: #ff6f4b;
  }
}
</style>