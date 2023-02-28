<!--  -->
<template>
  <div class="bgc clearfix">
    <p class="transferInfo">
      <span class="isopen" v-show="info.isopen === '1'">公开</span>
      <span class="label">答复时间：</span>
      <span class="item">{{
        util.formatTime(info.handletime, "YYYY-MM-DD HH:mm")
      }}</span>

      <span class="label">答复人员：</span>
      <span class="item">{{ info.handlername }}</span>
    </p>
    <p class="replycontent">
      {{ info.handlenote }}
    </p>
    <div class="attachs" v-if="attaches.length">
      <span v-for="item in attaches" :key="item.ID" @click="download(item.ID)">
        <i class="el-icon-paperclip"></i>{{ item.TITLE }}</span
      >
    </div>
    <el-button
      class="btns"
      icon="el-icon-edit"
      type="primary"
      size="mini"
      @click="reply(info.id,info.version)"
      >编辑</el-button
    >
    <el-button
      class="btns hidebtn"
      size="mini"
      v-if="info.isopen === '0'"
      @click="setOpen('1')"
      >设为公开</el-button
    >
    <el-button
      class="btns hidebtn"
      @click="setOpen('0')"
      size="mini"
      v-if="info.isopen === '1'"
      >隐藏回答</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      attaches: [],
    };
  },
  props: {
    info: Object,
  },
  methods: {
    download(id) {
      window.open(this.$store.state.downUrl + id);
    },
    reply(id,version) {
      this.$router.push({
        name: "reply",
        params: { id: id,version:version },
      });
      // window.open(routeUrl.href, "_blank");
    },
    setOpen(state) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/changeIsopen",
          data: {
            id: this.info.id,
            isopen: state,
          },
        })
        .then((res) => {
          if (res.success) {
            this.info.isopen = state;
          }
        });
    },
  },
  created() {
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
              this.attaches.push(data[id]);
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
  margin-top: 20px;
  background-color: #f6f6f6;
  padding: 20px 10px;
}
.replyinfo {
  float: left;
  width: 100%;
}
.transferInfo {
  height: 22px;
  font-size: 12px;
  color: #999999;
  line-height: 22px;
  margin-bottom: 10px;
  & .item {
    display: inline-block;
    margin-right: 10px;
  }
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
  font-size: 12px;
  color: #3a78fc;
  line-height: 14px;
  cursor: pointer;
}
.attachs {
  margin-bottom: 20px;
  & > span {
    display: block;
    margin-bottom: 10px;
  }
}
.btns {
  font-size: 14px;
}
.hidebtn {
  background-color: transparent;
  color: #3a78fc;
  border: 1px solid #3a78fc;
}
.hidebtn:hover {
  background-color: #ebf2ff;
}
.isopen {
  // margin-left: 10px;
  margin-right: 10px;
  display: inline-block;
  width: 40px;
  height: 22px;
  background: #e7eefe;
  border-radius: 3px;
  font-size: 12px;
  line-height: 22px;
  color: #3a78fc;
  text-align: center;
}
</style>