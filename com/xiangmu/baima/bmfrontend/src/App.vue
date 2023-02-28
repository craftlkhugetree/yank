<template>
  <div id="app">
<!--    <keep-alive>-->
      <router-view></router-view>
<!--    </keep-alive>-->

       <!--弹框-->
        <el-dialog class="message-dialog" :title="messageObj.title" v-if="dialogFormVisible && flag" :visible.sync="dialogFormVisible" width="650px" :close-on-click-modal="false">
            <div class="content">
                <div class="text my-scroll">{{messageObj.content}}</div>
                <div class="time">发布日期：{{util.formatTime(messageObj.updatetime,"yyyy.MM.dd")}}</div>
            </div>

            <div slot="footer" class="dialog-footer" style="text-align:center;margin-top:20px">
                <div class="my-button green" @click="dialogFormVisible = false">知道啦</div>
            </div>
        </el-dialog> 

  </div>
</template>

<script>
import util from "./assets/js/util";
// import global from "./assets/js/global";
import options from "./assets/js/options";

export default {
  name: "App",
  data(){
    return{
      dialogFormVisible:"",
      messageObj:{},
      flag:"",
    }
  },
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

    //获取列表
      getList(){
       
          this.util.postAjax({
          code:this.global.code,
          url:"/notice/pageQuery",
          data:{
              params:JSON.stringify({
                  page:this.currentPage,
                  limit:this.limit,
              })
          }
          }).then(res =>{
        
          if(res.success == true){
              this.messageObj = res.items[0];

              let today=this.util.formatTime(new Date().getTime(),'yyyyMMddhhmmss');

              this.flag = this.messageObj && today <= this.messageObj.validtime;

              // console.log(this.messageObj)
          }
          })
      },

  },

  created() {
    // this.getUserInfo();

    // 获取用户信息
    this.$store.dispatch("getUserInfo").then(() => {
    
      this.$store.dispatch("getLeaderList");
      this.$store.dispatch("getResTypeList");
    }).catch(() => {return;});


    if(window.performance.navigation.type == 1){
        console.log("页面被刷新");
        this.dialogFormVisible=false;
      }else{
         console.log("首次被加载");
        window.name = "isFirstVisit";
        this.dialogFormVisible=true;
      }
     this.getList();
  }
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
