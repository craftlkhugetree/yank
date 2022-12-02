<template>
  <div class="main">
    <!---------------------------- 左侧资源列表---------------------------->
    <section class="left-wrapper">
      <template v-for="(group) in resGroupData">
        <div v-show="group.ress.length" :key="'group'+group.id">
          <h3 class="title-h3 mg-bt30">
            {{group.name}}
            <span class="more" @click="lookMore(group)">查看更多</span>
          </h3>
          <p class="client-gray-text p-text">{{group.managerinfo | filterHtml}}</p>
        </div>
        <template v-for="(res,index) in group.ress">
          <el-card
            v-show="res.status=='1'"
            :key="'res'+res.id"
            :body-style="{ padding: '0px' }"
            @click.native="jumpDetail(res,group)"
            :class=" index==group.ress.length-1 ?'':' cardmg'"
          >
            <img :src="reviewImg(res.icon) " class="image" v-if="res.icon" />
            <img src="@/assets/img/no-img.png" class="image" v-else />
            <div style="padding: 14px;">
              <span class="name">{{res.name}}</span>
            </div>
          </el-card>
        </template>
      </template>
    </section>

    <!---------------------------- 右侧系统通知---------------------------->
    <section class="right-wrapper">
      <img class="header-img" src="@/assets/img/header-icon.png" alt="智慧校园预约平台" />
      <div class="msg-box">
        <h4 class="title-h4 mg-bt30">
          系统通知
          <span class="more" @click="jumpCenter()">查看更多</span>
        </h4>
        <ul class="list">
          <li v-for="(msg,index) in messageData" :key="index">
            <p class="time">{{formatTimeStr(msg.createtime)}}</p>
            <p class="p-text">{{msg.content}}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
<script>
import { fetchResGrouptList } from "@/api/client/resources.js";
import { fetchMessageList } from "@/api/client/message.js";
import { getUserInfo, getUserGroups } from "@/api/admin/user";

export default {
  data() {
    return {
      resGroupData: [],
      messageData: []
    };
  },
  created() {},
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  mounted() {
    this.getResGrouptList();
    this.getMessageList();
  },
  //过滤掉html标签及空行
  filters: {
    filterHtml(val) {
      if (val) {
        val = val.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
        val = val.replace(/&nbsp;/gi, "");
        val = val.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
        val = val.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
        val = val.replace(/ /gi, ""); //去掉
      }
      return val;
    }
  },
  methods: {
    //分割时间格式
    formatTimeStr(str) {
      let strTime = this.moment(str, "YYYYMMDDhhmmss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      return strTime;
    },
    // 默认展示资源下的第一个图片
    reviewImg(icon) {
      let firstIcon = icon.split(",")[0];
      return `${window.g.viewUrl}${firstIcon}`;
    },
    //跳转到详情页
    jumpDetail(curRes, group) {
      sessionStorage.setItem("activeGroup", JSON.stringify(group));
      this.$router.push(`/detail/${curRes.id}`);
    },
    //跳转到个人中心
    jumpCenter() {
      this.$router.push({
        name: "center",
        params: { type: "message" }
      });
    },
    // 获取资源集
    getResGrouptList() {
      // 获取用户信息
      getUserInfo().then(res => {
        if (res.success) {
          let data = res.item || {};
          this.$store.commit("setUserInfo", data);
          sessionStorage.setItem("userInfo", JSON.stringify(data));
          let param = {
            filter: JSON.stringify({ ID: data.ID }),
            withUserGroup: "1",
            appid: this.$store.state.GROUPID
          };
          getUserGroups(param).then(res => {
            if (res.success) {
              let groups = res.items[0].groups.map(item => item.ID);
              let params = {
                ugroupid: `${this.$store.state.ScoolGROUPID},${groups.join()}`
              };
              fetchResGrouptList(params).then(res => {
                if (res.success) {
                  this.resGroupData = res.data;
                  sessionStorage.setItem(
                    "resGroupData",
                    JSON.stringify(res.data)
                  );
                }
              });
            }
          });
        }
      });
    },
    // 获取系统通知消息
    getMessageList() {
      let params = {
        filter: { userid: this.userInfo.ID },
        limit: 5,
        page: 1
      };

      fetchMessageList(params).then(res => {
        if (res.success) {
          this.messageData = res.data;
        }
      });
    },

    lookMore(group) {
      sessionStorage.setItem("activeGroup", JSON.stringify(group));
      this.$router.push({
        name: "res-list"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  margin-bottom: 100px;
  width: 1200px;
  position: relative;
  margin: 0 auto;
}

.left-wrapper {
  margin-top: 140px;
  width: 780px;
  float: left;
}
.msg-box {
  width: 400px;
  min-height: 400px;
  background: #ffffff;
  border: 1px solid #f2f2f2;
  padding: 20px;
}

.title-h3 {
  font-size: 24px;
  font-weight: 600;
  color: #474d51;
  line-height: 33px;
}
.title-h4 {
  font-size: 20px;
  font-weight: 600;
  color: #474d51;
  line-height: 28px;
  display: inline;
}
.name {
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.more {
  width: 52px;
  height: 26px;
  font-size: 13px;
  font-weight: 400;
  color: #999999;
  line-height: 33px;
  float: right;
  cursor: pointer;
}

.el-card {
  width: 180px;
  color: #474d51 !important;
  line-height: 20px;
  margin-bottom: 30px;
  display: inline-block;
  cursor: pointer;
  &:hover {
    font-weight: 600;
    color: #586add !important;
  }
  .image {
    width: 180px;
    height: 135px;
    display: block;
  }
}
.cardmg {
  margin-right: 20px;
}

.right-wrapper {
  width: 420px;
  display: inline-block;
  position: absolute;
  top: 0px;
  right: -30px;
  .header-img {
    // position: absolute;
    // top: -140px;
    // z-index: 9999;
  }
}
.time {
  margin-top: 20px;
  padding: 20px 0px;
  width: 360px;
  height: 18px;
  font-size: 13px;
  color: #7d7d80;
  line-height: 18px;
  border-top: 1px solid #f2f2f2;
}
.p-text {
  line-height: 26px;
  margin: 10px 0 20px;
  color: #474d51 !important;
  font-size: 14px !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
