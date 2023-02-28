<template>
  <div class="list-item" @click="toDetail(item)">
    <div class="list-title">
      <span class="tag">{{ common.typeFormat(item.type) }}</span>
      <h4 class="ellipsis">{{ item.title }}</h4>
      <p class="applyer-info" v-if="operType === 'edit'">
        <span>提问人: {{ item.applyername }}({{ item.applyerid }})</span>
        <span style="float:right;">联系方式: {{ item.applyermobile || "--" }}</span>
      </p>
    </div>
    <div class="list-content clearfix">
      <div class="text" :style="{ width: item.photos ? 'calc(100% - 2rem)' : '100%' }">
        <p class="van-multi-ellipsis--l2">{{ item.content }}</p>
        <!-- <span class="dept">{{item.handledeptname}}</span> -->
        <span class="time">{{ common.timeFormat(item.createtime) }}</span>
        <span class="open" v-if="item.isopen === '1' && operType === 'edit'">公开</span>
        <span class="status" v-if="item.applystatus === '1' && operType === 'view'">等待回复</span>
      </div>
      <div class="images" v-if="item.photos">
        <img :src="fileUrl + item.photos.split(',')[0]" alt />
        <span class="count">{{ item.photos.split(",").length }}图</span>
      </div>
    </div>

    <!-------------------- 已回复(查看) -------------------->
    <div
      class="list-footer clearfix"
      v-if="['2', '3'].includes(item.applystatus) && operType === 'view'"
    >
      <van-button type="info" size="small" @click.stop="toDetail(item)">查看回复</van-button>
      <van-button
        v-if="item.applystatus === '2' && isMy==='1'"
        type="info"
        plain
        size="small"
        icon="edit"
        @click.stop="toScore(item)"
      >评价</van-button>
      <van-rate v-if="item.applystatus === '3'" color="#FD7D18" v-model="item.markscore" readonly></van-rate>
    </div>

    <!-------------------- 已回复(管理员) -------------------->
    <div
      class="list-footer clearfix"
      v-if="['2', '3'].includes(item.applystatus) && operType === 'edit'"
    >
      <van-button
        type="info"
        size="small"
        icon="edit"
        style="width: 80px"
        @click.stop="toReply(item)"
      >编辑</van-button>
      <van-button
        type="info"
        size="small"
        plain
        @click.stop="setPublic(item)"
      >{{ item.isopen === "1" ? "隐藏回答" : "设为公开" }}</van-button>
    </div>
    <!-------------------- 待回复(管理员) -------------------->
    <div class="list-footer clearfix" v-if="item.applystatus === '1' && operType === 'edit'">
      <van-button
        type="info"
        size="small"
        icon="edit"
        style="width: 80px"
        @click.stop="toReply(item)"
      >回复</van-button>
      <van-button type="info" size="small" plain @click.stop="toMove(item)">转移</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object, // 具体内容
    operType: {
      // view查看（普通人员)、edit操作（管理员）
      type: String,
      default: "view"
    },
    isMy: {
      // 我的
      type: String,
      default: "0"
    }
  },
  computed: {
    // 图片地址
    fileUrl() {
      return this.$store.state.fileUrl;
    }
  },
  methods: {
    setPublic(item) {
      let state = item.isopen === "1" ? "0" : "1";
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/changeIsopen",
          data: {
            id: this.item.id,
            isopen: state
          }
        })
        .then(res => {
          if (res.success) {
            this.item.isopen = state;
          }
        });
    },
    // 详情
    toDetail(item) {
      let url = "";
      if (this.operType === "edit") {
        url = `/detail/${item.id}?operType=edit`;
      } else {
        url = `/detail/${item.id}`;
      }
      this.$router.push(url);
    },

    // 评价
    toScore(item) {
      this.$router.push(`/score/${item.id}/${item.version}`);
    },

    // 回复
    toReply(item) {
      this.$router.push(`/managerReply/${item.id}/${item.version}`);
    },

    // 转移
    toMove(item) {
      this.$router.push(`/move/${item.id}/${item.version}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.list-item {
  background: #ffffff;
  padding: 12px 16px;
  margin-bottom: 12px;
  .list-title {
    margin-bottom: 6px;
    .tag {
      background: #ff6f4b;
      border-radius: 3px;
      width: 40px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
      margin-right: 8px;
    }
    h4 {
      font-size: 14px;
      color: #2a2e2e;
      font-weight: 600;
      width: calc(100% - 60px);
    }
    .tag,
    h4 {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      vertical-align: middle;
    }
    .applyer-info {
      margin-top: 6px;
      color: #999999;
    }
  }
  .list-content {
    .text {
      float: left;
      font-size: 12px;
      color: #5f6464;
      line-height: 18px;
      p {
        height: 36px;
      }
    }
    .dept {
      display: inline-block;
      background: #fff0ed;
      border-radius: 3px;
      font-size: 12px;
      font-weight: 400;
      color: #ff6f4b;
      line-height: 16px;
      padding: 2px 4px;
      margin-top: 8px;
    }
    .time {
      // float: right;
      display: inline-block;
      margin-top: 8px;
      font-size: 12px;
      color: #999999;
    }
    .open {
      display: inline-block;
      background: #e7eefe;
      border-radius: 5px;
      width: 40px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      color: #3a78fc;
      font-size: 12px;
      margin-left: 8px;
    }
    .status {
      float: right;
      color: #ff6f4b;
      margin-top: 8px;
    }
    .images {
      float: right;
      width: 60px;
      height: 60px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .count {
        position: absolute;
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 2px 0 0 0;
        color: #ffffff;
        font-size: 8px;
      }
    }
  }
  .list-footer {
    margin-top: 12px;
    .van-button {
      margin-right: 12px;
      vertical-align: middle;
    }
    .van-rate {
      float: right;
      margin-top: 4px;
    }
  }
}
</style>
