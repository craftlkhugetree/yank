<template>
  <div id="app">
<!--    <keep-alive>-->
      <router-view></router-view>
<!--    </keep-alive>-->

  </div>
</template>

<script>
import util from "./assets/js/util";
// import global from "./assets/js/global";
import options from "./assets/js/options";

export default {
  name: "App",
  methods:{

    //获取用户接口
    getUserInfo(){
      this.util.postAjax({
        code:this.global.authCode,
        url:"/rest/User/userDetail",
      }).then(res => {
        if(res.success == true){
          options.userInfo = res.item;
        }
        // console.log(res);
      })
    },

  },

  created() {

    // 获取用户信息
    this.$store.dispatch("getUserInfo");

  }
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
