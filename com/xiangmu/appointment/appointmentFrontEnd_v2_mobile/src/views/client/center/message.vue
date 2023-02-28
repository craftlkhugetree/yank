<template>
  <div class="wrapper">
    <van-nav-bar
      title="通知消息"
      fixed
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="jumpSearch"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <section class="main-wapper">
      <ul>
        <van-list
          v-model="loading"
          :finished="finished"
          @load="getMessageList"
          :immediate-check="immediateCheck"
        >
          <li
            v-for="(msg,index) in messageList"
            :key="index"
            class="list"
            :class="`animation-${index + 1}`"
          >
            <div class="title">
              <h2>
                <img src="@/assets/img/msg-icon.png" alt="消息" />
                <span class="title-text">系统通知</span>
              </h2>
              <span class="time">{{ formatTimeStr(msg.createtime)}}</span>
            </div>
            <div class="p-text">
              <span>{{msg.content+'，'}}</span>
              <span class="blue-text" slot="reference" @click="msgDetail(msg.applyid)">戳此查看详情</span>
            </div>
          </li>
          <div slot="finished" :class="`animation-${messageList.length + 1}`">
            <van-divider
              :style="{ color: '#999999', fontSize: '12px', borderColor: '#dbdbdb', padding: '0 24px' }"
            >没有更多了</van-divider>
          </div>
        </van-list>
        <van-popup
          position="bottom"
          :style="{ height: '30%' }"
          closeable
          close-icon="close"
          v-model="isShowPopup"
        >
          <div class="popup-box">
            <h3 class="h3-title">详情记录</h3>
            <div class="popup-msg">{{showContent}}</div>
          </div>
        </van-popup>
      </ul>
    </section>
  </div>
</template>
<script>
import { fetchMessageList, fetchMsgDetail } from "@/api/client/message.js";
export default {
  data() {
    return {
      messageList: [],
      pageSize: 10,
      currentPage: 1,
      msgVisible: false,
      messageDetail: {},
      loading: false,
      finished: false,
      showContent: "",
      isShowPopup: false,
      immediateCheck: false
    };
  },
  components: {},
  created() {},
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  mounted() {
    // 如果不是立即加载，则延迟加载
    if (!this.immediateCheck) {
      setTimeout(() => {
        this.getMessageList();
      }, 600);
    }
  },
  methods: {
    formatTimeStr(str) {
      let strTime = this.moment(str, "YYYYMMDDhhmmss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return strTime;
    },
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    },

    //查看详情
    msgDetail(applyid) {

        this.$router.push(`/appoint/detail/${applyid}`);
      // this.isShowPopup = true;
      // this.msgVisible = id;
      // let params = {
      //   id: id
      // };
      // fetchMsgDetail(params).then(res => {
      //   if (res.success) {
      //     this.messageDetail = res.data;
      //     this.showContent = res.data.content;
      //   }
      // });
    },

    // 获取系统通知消息
    getMessageList() {
      let params = {
        filter: { userid: this.userInfo.ID },
        limit: this.pageSize,
        page: this.currentPage
      };

      fetchMessageList(params).then(res => {
        if (res.success) {
          this.loading = false;
          this.messageList = res.data;
          if (this.messageList.length >= 0) {
            this.finished = true;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-wapper {
  background: #f6f6f6;
  padding: 32px;
  margin-top: 88px;
}
.list {
  background: #ffffff;
  border-radius: 10px;
  margin-bottom: 32px;
  padding: 32px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-text {
    font-size: 28px;
    color: #7d7d80;
  }
  img {
    width: 52px;
    height: 52px;
    vertical-align: middle;
    margin-right: 16px;
  }
  .time {
    font-size: 20px;
    color: #7d7d80;
    line-height: 38px;
  }
}
.p-text {
  line-height: 38px;
  margin: 10px 0 20px;
  color: #474d51;
  font-size: 26px;
}
.blue-text {
  font-weight: 400;
  color: #3f86f7;
  font-size: 26px;
  line-height: 38px;
}
.popup-box {
  height: 500px;
}
.h3-title {
  font-size: 32px;
  color: #474d51;
  text-align: center;
  padding: 32px;
}
.popup-msg {
  font-size: 28px;
  color: #474d51;
  padding: 32px;
}
</style>
