<template>
  <div class="choose-role">
    <div class="role-title">
      <h2>
        <img src="../../static/imgs/bm-role-logo.png" alt />
        基地科教资源管理
      </h2>
      <span>您有如下身份可以访问该服务，请选择：</span>
    </div>
    <ul>
      <li v-if="userRoles.length === 0" style="line-height:24px;">
        您暂时没有权限访问该服务，
        <br />请联系基地管理员
      </li>
      <li v-for="item in userRoles" :key="item.ID" @click="setCurRole(item)">
        <img
          :src="item.ID.split('-')[1] ? require(`../../static/imgs/bm-role-${item.ID.split('-')[1]}.png`) : require('../../static/imgs/bm-role-1.png')"
          alt
        />
        <span>{{item.NAME}}</span>
        <van-icon name="arrow" />
      </li>
    </ul>

  </div>
</template>

<script>
import { roleId } from "@/assets/js/options";
export default {
  data() {
    return {
      curNotice: {}
    };
  },
  computed: {
    // 用户角色
    userRoles() {
      let roles = this.$store.state.userRoles || [];
      return (
        roles.filter(i =>
          ["16000-1", "16000-2", "16000-3", "16000-4", "16000-5", roleId.hq].includes(i.ID)
        ) || []
      );
    }
  },
  methods: {
    // 设置当前角色
    setCurRole(item) {
      sessionStorage.setItem("curRole", item.ID);
      let path = "";
      let funM = '/fun-module';
      switch (item.ID) {
        case "16000-1":
          path = "/service-info-view";
          break;
        case "16000-2":
          path = "/service-info-view";
          break;
        case "16000-3":
          path = "/service-info";
          break;
        case "16000-4":
          path = "/irrgate-worker";
          funM = "/irrgate-worker";
          break;
        case "16000-5":
          path = "/service-info-view";
        case roleId.hq:
          path = "/practice-audit-hq";
      }
      this.$router.push(funM || path);

      // 判断消息是否在有效期内
      let validtime = this.curNotice.validtime || "";
      let now = this.util.formatTime(new Date().getTime(), "YYYYMMDDhhmmss");
      // 如果在有效期内 则弹出消息弹窗
      if (validtime >= now) {
        this.$parent.noticeDialogShow = true;
        this.$parent.curNotice = this.curNotice;
      }
    },
    // 获取消息
    getNotice() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/notice/pageQuery?date=" + new Date().getTime(),
          data: {
            params: JSON.stringify({
              page: 1,
              limit: 5
            })
          }
        })
        .then(res => {
          if (res.success) {
            let arr = res.items || [];
            this.curNotice = arr[0] || {};
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getNotice();
  }
};
</script>

<style lang="scss" scoped>
.choose-role {
  width: 100%;
  height: 100%;
  background: url("../../static/imgs/bm-role-bg.png") no-repeat;
  background-size: cover;
  .role-title {
    padding: 35px 0 70px 50px;
    h2 {
      font-size: 18px;
      color: #ffffff;
      line-height: 24px;
      margin-bottom: 10px;
      img {
        height: 20px;
        width: 24px;
        vertical-align: text-top;
      }
    }
    span {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  ul {
    padding: 0 50px 20px;
    position: relative;
    top: calc(50% - 100px);
    transform: translateY(-50%);
    li {
      background: #ffffff;
      border-radius: 15px;
      box-shadow: 0px 5px 20px 0px rgba(1, 176, 155, 0.1);
      padding: 10px 25px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      img {
        width: 50px;
        height: 50px;
        vertical-align: middle;
        margin-right: 20px;
      }
      span {
        line-height: 50px;
      }
      .van-icon {
        float: right;
        line-height: 50px;
      }
      &:active {
        background: #e3f9f5;
        color: #00b09b;
        border: 2px solid rgba(0, 176, 155, 1);
      }
    }
  }
}
</style>