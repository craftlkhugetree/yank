<template>
    <div class="header-menu-wrap">
      <div class="top">
        <span class="left"><img src="../../static/images/logo.jpg" alt="图片"></span>
        <ul class="menu">
          <router-link v-show="item.isShow" v-for="(item,index) in menuList" :to="item.path" tag="li" :key="index">{{item.pathName}}</router-link>
        </ul>
        <span class="span-title right">欢迎您，{{userName}}</span>
      </div>

      <div class="content">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
    export default {
      name: "headerMenu",
      data:function(){
        return {
          power:"",
          menuList:[
            {path:"/check",pathName:"待审核",isShow:true},
            {path:"/checked",pathName:"已审核",isShow:true}
          ],
          powerList: [
            {path:"/count",pathName:"统计报表",isShow:true},
            {path:"/remark",pathName:"审核意见",isShow:true},
            {path:"/backup",pathName:"数据备份",isShow:true}
          ],
          Index:"",
          userName:"" ,  //用户名
          gid:"",
        }
      },
      methods:{
        GetQueryString(name){
          var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
          // const url="http://160.255.0.246:8081/book2/bookAssets/index.html?amp_sec_version_=1&gid_=YnpKb1cwL0hTakJSK2ZhOE9jUEM1b1ZDZitEZG9iM3c2alBqWXloT0hxZmxqTTlGQjZpTTRXM3RNNnRTbzZ2ODYwVTdLbHlqZy9JY0tlUVBPUkxiNVE9PQ&EMAP_LANG=zh&THEME=teal&_ti=1558924948323"
          var r = window.location.search.substr(1).match(reg);
          if(r!=null)return  unescape(r[2]); return null;
        },

        //获取当前登录信息
       /* getUserInfo:function () {
          this.util.postAjax({
            code:this.global.code,
            url:"/book/getUser",
            data:{
              gid_:this.gid
            }
          }).then((res)=>{
            this.userName=res.NAME;

           /!* this.power=res.POWER;
            this.menuList.forEach((v,i) => {
              if(i==2){
                v.isShow = this.power
              }
            });
            console.log("POWER1",typeof (this.power));*!/

           /!* sessionStorage.removeItem("checkPower");
            sessionStorage.removeItem("checkedPower");
            sessionStorage.removeItem("power");*!/
            if(res.POWER == true){
              sessionStorage.setItem("power",true);
              sessionStorage.setItem("checkPower","2");
              sessionStorage.setItem("checkedPower","0,1");
            }else if(res.POWER == false) {
              sessionStorage.setItem("power",false);
              sessionStorage.setItem("checkPower","0,2");
              sessionStorage.setItem("checkedPower","1");
            }

            this.power=sessionStorage.getItem('power');
            if(this.power == "true"){
              this.power = true
            }else if(this.power == "false"){
              this.power = false
            }

            console.log("POWER1",this.power,typeof (this.power));

            this.menuList.forEach((v,i) => {
              if(i==2){
                v.isShow = this.power
              }
            })

            // console.log("res",res);
          })
        },*/

        getUserInfo:function () {
          this.util.postAjax({
            code:this.global.code,
            url:"/book/getUser",
            data:{
              gid_:this.gid
            }
          }).then((res)=>{
            /*this.userName=res.NAME;

            if(res.POWER == true){
              sessionStorage.setItem("power",true);
              sessionStorage.setItem("checkPower","2");
              sessionStorage.setItem("checkedPower","0,1");
            }else if(res.POWER == false) {
              sessionStorage.setItem("power",false);
              sessionStorage.setItem("checkPower","0,2");
              sessionStorage.setItem("checkedPower","1");
            }*/

            this.power=sessionStorage.getItem('power');
            if(this.power == "true"){
              this.power = true
              this.powerList.forEach(one => {
                this.menuList.push(one)
              })
            }else if(this.power == "false"){
              this.power = false
            }
            console.log("POWER1",this.power,typeof (this.power));
          })
        },
      },
      created() {
        this.gid=this.GetQueryString("gid_");
        this.getUserInfo();
        console.log("gid",this.gid);
       this.userName=sessionStorage.getItem("name");

       /* console.log("power2",sessionStorage.getItem("power"));

        this.menuList.forEach((v,i) => {
          if(i==2){
            v.isShow = sessionStorage.getItem("power")
          }
        })*/
      }
    }
</script>

<style scoped>
  .top {
    width: 100%;
    height: 70px;
    background: #1976d3;
    text-align: center;
    line-height: 70px;
    color: #fff;
    min-width: 1200px;
  }

  .span-title {
    display: inline-block;
  }

  .left {
    margin-left: 35px;
    float: left;
    display: inline-block;
    height: 100%;
  }

  .right {
    margin-right: 35px;
    float: right;
  }

  .menu{
    display: inline-block;
    float: left;
    margin-left: 150px;
  }

  .menu li{
    float: left;
    width: 130px;
    font-size: 16px;
    cursor: pointer;
  }

  .router-link-active{
    background: #0254A7;
  }

  .content{
    margin: 0 auto;
    width: 92%;
    min-width: 1000px;
  }
</style>
