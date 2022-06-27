<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header height="80px">
      <header-bar></header-bar>
    </el-header>
    <el-container class="main-container">
      <!------------------------------ 左侧菜单 ------------------------------>
      <el-aside width="200px">
        <side-bar ref="sideBar"></side-bar>
      </el-aside>
      <!------------------------------ 主要内容 ------------------------------>
      <el-main :class="{ 'no-bg': noBg }">
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view></router-view>
        </transition>
        <!--------------------- 新订单消息 --------------------->
        <div v-show="false" v-if="isCafeManage">
          <!-- 消息 -->
          <web-socket-message :url="webSocketUrl" @doFunc="showMsg"></web-socket-message>
          <!-- 音频 -->
          <audio ref="audio" :src="sound"></audio>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HeaderBar from "./components/HeaderBar";
import SideBar from "./components/SideBar";
import { getUserRole } from "@/api/admin/user";
import { fetchMyCafe } from "@/api/admin/cafe";
import WebSocketMessage from "@/components/WebSocketMessage";
import mp3 from "@/assets/audio/msg.mp3";
export default {
  components: {
    HeaderBar,
    SideBar,
    WebSocketMessage
  },
  data() {
    return {
      isCafeManage: false,
      webSocketUrl: null,
      sound: mp3
    };
  },
  computed: {
    noBg() {
      return this.$route.meta.noBg || false;
    },
  },
  methods: {
    // 收到订单消息
    showMsg(data) {
      this.$message({
        showClose: true,
        type: "success",
        duration: 5000,
        message: "您有新订单，请及时处理！"
      });
      let audio = this.$refs.audio;
      audio.currentTime = 0;
      audio.play();
      this.$store.commit("setMsgList", data);
    },
    // 根据当前的时间 x 随机数
    tid() {
      let mydate = new Date();
      return (
        mydate.getDay() +
        mydate.getHours() +
        mydate.getMinutes() +
        mydate.getSeconds() +
        mydate.getMilliseconds() +
        Math.round(Math.random() * 10000)
      );
    },
    // 表示产生一个4位的随机数
    rid() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
  },
  created() {
    // 获取用户角色
    getUserRole().then(res => {
      if (res.success) {
        let data = res.data || [];
        this.$store.commit("setUserRoles", data);
        // 如果是餐厅管理员，则要实时接收新订单
        if (data.some(i => i.ID == "20210729-3")) {
          // 获取我的餐厅
          fetchMyCafe().then(res => {
            if (res.success) {
              let data = res.data[0] || {};
              let shopid = data.id;
              // 组合4个4位随机数
              let uuid =
                this.tid() +
                "_" +
                this.rid() +
                "_" +
                this.rid() +
                "_" +
                this.rid();
              this.webSocketUrl = `${window.g.webSocketUrl}${shopid}/${uuid}`;
              this.isCafeManage = true;
            }
          });
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-width: 1200px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fafafc;
  .el-header {
    background: #1957fb;
    padding: 0 30px;
  }
  .main-container {
    overflow: auto;
  }
  .el-aside {
    background: #ffffff;
  }
  .el-main {
    height: calc(100% - 20px);
    background: #ffffff;
    margin: 20px 0 0 20px;
    padding: 0;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);    
    &.no-bg {
      height: 100%;
      margin: 0;
      background: none;
      box-shadow: none;
    }
  }
}
</style>