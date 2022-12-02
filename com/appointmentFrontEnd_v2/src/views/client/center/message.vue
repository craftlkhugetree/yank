<template>
  <div class="wapper-list">
    <el-tabs class="nav" @tab-click="toggle" v-model="active">
      <el-tab-pane label="消息" name="msg">
        <section>
          <ul>
            <li v-for="(msg,index) in messageData" :key="index" class="list">
              <p class="time">
                <img class="logo" src="@/assets/img/msg-icon.png" alt="消息" />
                <span>
                  <span class="mgLR_10">系统通知</span>
                  {{ formatTimeStr(msg.createtime)}}
                </span>
              </p>
              <p>
                <span class="p-text">{{msg.content+'，'}}</span>
                <el-popover placement="bottom" width="400" trigger="click" :visible-arrow="false">
                  <div>
                    <h3 class="popover-dialog-title">详情记录</h3>
                    <div class="popover-dialog-content">
                      <p class="time-text">{{messageDetail.content}}</p>
                    </div>
                  </div>
                  <span class="blue-text" slot="reference" @click="lookDetail(msg.id)">戳此查看详情</span>
                </el-popover>
              </p>
            </li>
          </ul>

          <!---------------------------- 分页 ---------------------------->
          <div class="pagination" v-if=" currentPage>1">
            <el-pagination
              background
              layout="sizes, prev, pager, next"
              :total="total"
              :page-size="pageSize"
              :page-sizes="[5,10,15,20]"
              :current-page.sync="currentPage"
              @current-change="page => getMessageList(page, pageSize)"
              @size-change="size => {pageSize = size; getMessageList(1, size)}"
            ></el-pagination>
          </div>
          <!---------------------------- 无数据 ---------------------------->
          <div class="nodata" v-if="total == 0">
            <img src="@/assets/img/nofind.png" alt />
            <p>没有找到</p>
          </div>
        </section>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { fetchMessageList, fetchMsgDetail } from "@/api/client/message.js";
export default {
  data() {
    return {
      messageData: [],
      tabs: [],
      active: "msg",
      total: 0,
      pageSize: 5,
      currentPage: 1,
      messageDetail: {}
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
    this.getMessageList();
  },
  methods: {
    formatTimeStr(str) {
      let strTime = this.moment(str, "YYYYMMDDhhmmss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return strTime;
    },

    // 切换 tab
    toggle(tab, event) {
      this.active = tab.name;
      this.currentPage = 1;
      this.pageSize = 12;
      this.getMessageList();
    },
    //查看详情
    lookDetail(id) {
      let params = {
        id: id
      };
      fetchMsgDetail(params).then(res => {
        if (res.success) {
          this.messageDetail = res.data;
        }
      });
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
          this.messageData = res.data;
          this.total = res.total;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.wapper-list {
  width: 980px;
}

.nav /deep/ .el-tabs__item {
  font-size: 14px;
  color: #7d7d80;
  line-height: 70px;
}
.nav.el-tabs.el-tabs--top {
  line-height: 60px;
}
.nav /deep/ .el-tabs__nav-next,
.nav /deep/ .el-tabs__nav-prev {
  font-size: 14px;
  line-height: 70px;
}
.nav /deep/ .el-tabs__item.is-active {
  color: #3f86f7 !important;
  font-weight: 600;
}
.nav /deep/ .el-tabs__active-bar {
  height: 2px;
  background-color: #3f86f7 !important;
}
.nav /deep/ .el-tabs__nav-wrap.is-scrollable {
  padding: 0 25px;
}
.nav /deep/ .el-tabs__nav-wrap::after {
  height: 1px;
}

.list {
  border-bottom: 1px solid #f2f2f2;
  padding: 0 10px;
}
.time {
  margin-top: 20px;
  padding: 20px 0px;
  height: 18px;
  font-size: 13px;
  color: #7d7d80;
  line-height: 18px;
  img {
    vertical-align: middle;
    display: inline-block;
  }
}
.p-text {
  text-indent: 35px;
  line-height: 26px;
  margin: 10px 0 20px;
  color: #474d51 !important;
  font-size: 14px !important;
}
.blue-text {
  font-weight: 400;
  color: #3f86f7;
  font-size: 14px;
  cursor: pointer;
  display: inline-block;
  line-height: 20px;
}
</style>
