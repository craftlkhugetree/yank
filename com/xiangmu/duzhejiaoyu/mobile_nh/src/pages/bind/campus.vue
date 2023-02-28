<template>
    <div>
        <!-- <mt-header class="header" fixed title="校区绑定"></mt-header> -->
        <div class="campuscontent" v-show="!show">

        </div>

        <div class="campuscontent" v-show="show">
            <div class="campuscontent_top"> </div>
            <div class="campuscontent_bottom">
                <h3>完善信息</h3>
                <!-- <div class="selbox">
                    <select id="picker_school" @change="changeoption" v-model="id">
                        <option value="">请选择校区</option>
                        <option :value="item.id" v-for="(item,index) in list" :key="index">{{item.name}}</option>
                    </select>
                </div> -->
                <van-field v-model="id" label="校区" required right-icon="arrow"  readonly @click="showPicker = true" placeholder="请选择" />
                <!-- 输入手机号，调起手机号键盘 -->
                <van-field v-if="isneedQQ" v-model="mobile" required type="tel" label="手机号" @change="validdata(mobile,'mobile')"/>
                <van-field v-if="isneedQQ" v-model="email" required label="邮箱"  @change="validdata(email,'email')"/>
                <van-field v-if="isneedQQ" v-model="qqcard" required type="digit" label="QQ"  @change="validdata(qqcard,'qqcard')"/>
                <button id='bind' @click="gobind">确定登录</button>
            </div>
             <van-popup class="popup" v-model="showPicker" position="bottom">
                <van-picker show-toolbar :columns="list" @cancel="showPicker = false" @confirm="onConfirm"/>
            </van-popup>
        </div>
    </div>
</template>
<script>
import code from '../../util/code';
import axios from "axios";
export default {
    data() {
        return {
            list:[],//校区的列表
            id:'',
            campusId:'',
            qqcard:'',
            mobile:'',
            email:'',
            show:true,
            istel:false,
            isemail:false,
            isqq:false,
            showPicker:false,
            GLOBALNAV:'',
            isneedQQ:false,//是否需要qq
            personinfo:'',
            isfirst:false,
        }
    },
    created() {
      if(window.base.nh){
        this.loginNh()
      }else if(window.base.isCx){//超星微信平台登录
        this.loginCx()
      }else{
        this.getuser();
      }
      this.test();
    },
    methods: {
        loginCx(){
          var appId = this.util.getUrlParam('appId');
          var appKey = this.util.getUrlParam('appKey');
          var uid = this.util.getUrlParam('uid');
          var mappId = this.util.getUrlParam('mappId');
          var fidEnc = this.util.getUrlParam('fidEnc');
          if(appId&&appKey&&uid){
             this.loginNhWx({appId:appId,appKey:appKey,uid:uid},code.CxLogin);
          }else{
            this.getuser();
          }
        },
        loginNh(){
          var appid = this.util.getUrlParam('appId');
          var secret = this.util.getUrlParam('appKey');
          var code = this.util.getUrlParam('code');
          var grant_type = 'authorization_code';
          var state = this.util.getUrlParam('state');

          if(appid&&secret&&code&&grant_type&&state){
              this.loginNhWx({appid:appid,appkey:secret,code:code,state:state},code.nhWxLogin);
            }else{
              if( this.util.isWeiXin()){
                this.getuser();
              }else{
                getToken_app((u,v)=>{this.iNhLogin(u,v)});
              }
            }
        },
        iNhLogin(u,v){
          this.loginNhWx({token:u.d.access_token},code.inhLogin);
        },
        getNhWxInfo(access_token,state,expires_time){
          axios({
              method:"post",
              url:"http://v-jx.wlib.nuaa.edu.cn/backSchool/user/getUserByTokenFormMooc",
              params:{access_token:encodeURIComponent(access_token),expires_time:access_token(expires_time),state:state}
              }).then(res=>{
                  if(res.status){
                    this.loginNhWx(res.userInfo);
                  }
              })
        },
        loginNhWx(data,url){
          this.util
            .postAjax({
              code: code.base4,
              url: url,
              data: data
            })
            .then(res => {
              if (res.success) {
                this.getuser();
              }
            });
        },
        test(){
            var tarr = [];
            var video = document.querySelector("video");
            video.addEventListener("timeupdate", function (e) {
                // console.log("timeupdate",video.currentTime);
                tarr.unshift(video.currentTime);
                tarr.length = 2;
            }, false);
            video.addEventListener("seeking", function (e) {
                // console.log("seeking",video.currentTime);
                if (video.currentTime<tarr[1]) {
                    video.currentTime = tarr[1];
                }
            }, false);
        },

        validdata(val,type){
            if(type=='mobile'){
                this.istel = this.isPoneAvailable(val);
                if(!this.istel){
                    this.Toast('请输入正确的手机号码')
                    return
                }
            }
            if(type=='email'){
                this.isemail = this.isemailAvailable(val);
                if(!this.isemail){
                    this.Toast('请输入正确的邮箱')
                    return
                }
            }
            if(type=='qqcard'){
                this.isqq = this.isqqAvailable(val);
                if(!this.isqq){
                    this.Toast('请输入正确的QQ')
                    return
                }
            }


        },
        //个人信息
        getuser(){
            this.util.postAjax({
                code:code.base,
                url:code.userInfo,
                isRep:true,
                // data:window.sessionStorage.getItem('userdata')?JSON.parse(window.sessionStorage.getItem('userdata')):{}

            }).then(res=>{
                this.getconfiglist();//配置
                this.personinfo = res.item;
                this.getuserreaderType(this.personinfo.readerType);
                //判断第一次登录
                var firstlogin = '';
                if(this.personinfo.firstlogin){//登录过的
                    this.isfirst = false
                }else{
                    this.isfirst = true
                }
            })
        },
        getuserreaderType(type){
            this.util.postAjax({
                code:code.base,
                url:code.userreaderType,
            }).then(res=>{
                if(res.success){
                    var typelist = res.items;
                    typelist.forEach(e=>{
                        if(e.readtype==type){//readerType
                            window.sessionStorage.setItem('readerType',e.readtype);
                            return
                        }
                    })

                }else{
                    this.Toast('获取信息失败，请稍后重试')
                }
            })
        },
        getschoollist(){
            var flag = true;
            this.util.postAjax({
                code:code.base,
                url:code.campuslist,
            }).then(response => {
                //判断校区
                this.list = response.items;
                this.list.forEach(v=>{
                    v.text=v.name;
                    v.value=v.id;
                })
                if(this.list.length>1){//多个校区，没有绑定校区
                    if(!this.personinfo.campusId){
                        flag = false;
                    }else{
                        this.campusId = this.personinfo.campusId;
                        window.sessionStorage.setItem('campusId',this.campusId);
                        this.qqcard = this.personinfo.qqcard;
                        this.mobile = this.personinfo.mobile;
                        this.email = this.personinfo.email;
                        this.list.forEach(v=>{
                            if(this.campusId==v.id){
                                this.id = v.name
                            }
                        })
                    }
                }else{
                    this.id = this.list[0].text;
                    this.campusId = this.list[0].value;
                }
                //判断qq
                if(this.isneedQQ && !this.personinfo.qqcard){
                    flag = false;
                }

                if(flag){//直接调取绑定接口
                    this.util.postAjax({
                        code:code.base,
                        url:code.bindUserCampus,
                        data:{
                            data:JSON.stringify({
                                campusId:this.campusId,
                                qqcard:this.qqcard,
                                mobile:this.mobile,
                                email:this.email
                            })
                        }
                    }).then(res => {
                        if(res.success){
                            if(this.GLOBALNAV){//有全景
                                if(this.isfirst){//第一次
                                    window.sessionStorage.setItem('finish','guide');
                                    if(window.base.nh){
                                        window.sessionStorage.setItem('useguide','0');
                                        window.sessionStorage.setItem('isfirstlogin','1');
                                    }else{
                                        window.sessionStorage.setItem('isfirstlogin','0');
                                    }
                                }else{
                                    window.sessionStorage.setItem('isfirstlogin','0');
                                }
                                // this.$router.push('index');
                                this.$router.push('exam');
                            }else{
                                if(this.isfirst){//第一次
                                    // window.sessionStorage.setItem('finish','study');
                                    window.sessionStorage.setItem('finish','exam');
                                    if(window.base.nh){
                                        window.sessionStorage.setItem('useguide','1');
                                        window.sessionStorage.setItem('isfirstlogin','1');
                                    }else{
                                        window.sessionStorage.setItem('isfirstlogin','0');
                                    }
                                }else{
                                    window.sessionStorage.setItem('isfirstlogin','0');
                                }
                                // this.$router.push('study');
                                this.$router.push('exam');
                            }
                        }
                    })
                }
            })
        },
        onConfirm(value) {
            this.id = value.text;
            this.campusId = value.id;
            window.sessionStorage.setItem('campusId',this.campusId)
            this.showPicker = false;
        },
        getGLOBALNAV(){
            this.util.postAjax({
                code:code.base,
                url:code.ruleslist,
                data:{
                    code:'GLOBALNAV'//
                }
            }).then(data=>{
                if(data.item.rval){//有全景的
                    var menu = [{
                        name:'全景导航',
                        id:'0',
                        DISPLAYURL:'index',
                        img:'home.png',
                        actimg:'homeactive.png',
                        navs:true
                    },{
                        name:'在线学习',
                        id:'2',
                        DISPLAYURL:'study',
                        img:'exam.png',
                        actimg:'examactive.png',
                        navs:false
                    },{
                        name:'在线考试',
                        id:'1',
                        DISPLAYURL:'exam',
                        img:'study.png',
                        actimg:'studyactive.png',
                        navs:false
                    },{
                        name:'个人中心',
                        id:'3',
                        DISPLAYURL:'person',
                        img:'person.png',
                        actimg:'personactive.png',
                        navs:false
                    }]
                    this.$store.dispatch('getnavs', menu)
                    this.GLOBALNAV = data.item.rval;
                }else{
                    var menu = [{
                            name:'在线学习',
                            id:'2',
                            DISPLAYURL:'study',
                            img:'exam.png',
                            actimg:'examactive.png',
                            navs:true
                        },{
                            name:'在线考试',
                            id:'1',
                            DISPLAYURL:'exam',
                            img:'study.png',
                            actimg:'studyactive.png',
                            navs:false
                        },{
                            name:'个人中心',
                            id:'3',
                            DISPLAYURL:'person',
                            img:'person.png',
                            actimg:'personactive.png',
                            navs:false
                        }]
                    this.$store.dispatch('getnavs', menu)
                }
                this.getschoollist();
            })

        },
        getconfiglist(){
            this.util.postAjax({
                code:code.base,
                url:code.configlist,
            }).then(res=>{
                if(res.success){
                    this.getGLOBALNAV();//判断全景的
                    res.items.forEach(e=>{
                        if(e.configkey=='ISNEEDQQ'){
                            if(e.configval=='1'){
                                this.isneedQQ = true;
                            }else{
                                this.isneedQQ = false;
                            }
                        }else if(e.configkey=='ISNEEDVIDEOCONTROL'){
                            if(e.configval=='1'){
                                window.sessionStorage.setItem('isneedvideocontrol','1')
                            }else{
                                window.sessionStorage.setItem('isneedvideocontrol','0')
                            }
                        }
                    })
                }
            })
        },
        changeoption(){
        },
        isPoneAvailable($poneInput) {
            var myreg=/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
            if (!myreg.test($poneInput)) {
                return false;
            } else {
                return true;
            }
        },
        isemailAvailable($email){
            var myreg=/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            if (!myreg.test($email)) {
                return false;
            } else {
                return true;
            }
        },
        isqqAvailable($qq){
            var myreg=/^[1-9]\d{4,13}$/;
            if (!myreg.test($qq)) {
                return false;
            } else {
                return true;
            }
        },
        gobind(){
            // console.log(this.GLOBALNAV)
            var flag = false;
            if(this.isneedQQ){
                if(!this.id){
                    this.Toast('请选择校区')
                }else if(!this.mobile){
                    this.Toast('请输入手机号')
                }else if(!this.email){
                    this.Toast('请输入邮箱')
                }else if(!this.qqcard){
                    this.Toast('请输入QQ')
                }else if(!this.istel){
                    this.Toast('请输入正确的手机号码')
                }else if(!this.isemail){
                    this.Toast('请输入正确的邮箱')
                }else if(!this.isqq){
                    this.Toast('请输入正确的QQ')
                }else{
                    flag = true;
                }
            }else{
                if(!this.id){
                    this.Toast('请选择校区')
                }else{
                    flag = true;
                }
            }

            if(flag){
                document.getElementById('bind').setAttribute('disabled',true);
                this.util.postAjax({
                    code:code.base,
                    url:code.bindUserCampus,
                    data:{
                        data:JSON.stringify({
                            campusId:this.campusId,
                            qqcard:this.qqcard,
                            mobile:this.mobile,
                            email:this.email
                        })
                    }
                }).then(res => {
                    if(res.success){
                        if(this.GLOBALNAV){
                            this.$router.push('index');
                            if(window.base.nh){
                                window.sessionStorage.setItem('useguide','0');
                                window.sessionStorage.setItem('isfirstlogin','1');
                            }else{
                                window.sessionStorage.setItem('isfirstlogin','0');
                            }
                            window.sessionStorage.setItem('finish','guide');
                            window.sessionStorage.setItem('menu',JSON.stringify([{
                                    name:'全景导航',
                                    id:'0',
                                    DISPLAYURL:'index',
                                    img:'home.png',
                                    actimg:'homeactive.png',
                                    navs:true
                                },{
                                    name:'在线学习',
                                    id:'2',
                                    DISPLAYURL:'study',
                                    img:'exam.png',
                                    actimg:'examactive.png',
                                    navs:false
                                },{
                                    name:'在线考试',
                                    id:'1',
                                    DISPLAYURL:'exam',
                                    img:'study.png',
                                    actimg:'studyactive.png',
                                    navs:false
                                },{
                                    name:'个人中心',
                                    id:'3',
                                    DISPLAYURL:'person',
                                    img:'person.png',
                                    actimg:'personactive.png',
                                    navs:false
                                }]
                            ))

                        }else{
                            // this.$router.push('study');
                            // window.sessionStorage.setItem('finish','study');
                            this.$router.push('exam');
                            window.sessionStorage.setItem('finish','exam');

                            if(window.base.nh){
                                window.sessionStorage.setItem('useguide','1');
                                window.sessionStorage.setItem('isfirstlogin','1');
                            }else{
                                window.sessionStorage.setItem('isfirstlogin','0');
                            }
                            window.sessionStorage.setItem('menu',JSON.stringify([{
                                name:'在线学习',
                                id:'2',
                                DISPLAYURL:'study',
                                img:'exam.png',
                                actimg:'examactive.png',
                                navs:true
                            },{
                                name:'在线考试',
                                id:'1',
                                DISPLAYURL:'exam',
                                img:'study.png',
                                actimg:'studyactive.png',
                                navs:false
                            },{
                                name:'个人中心',
                                id:'3',
                                DISPLAYURL:'person',
                                img:'person.png',
                                actimg:'personactive.png',
                                navs:false
                            }]
                        ))
                        }
                    }

                })
            }

        },
    }
}
</script>

<style scoped>
    .campuscontent{
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1000;
        /* padding: .5rem;
        padding-bottom: 5rem;
        box-sizing: border-box;
        background: #fff;
        overflow: auto; */
        /* background: url(../../../static/img/bindbac.jpg) no-repeat center center;
        background-size: cover; */
    }
    .campuscontent>.campuscontent_top{
        width: 100%;
        height: 30%;
        background:url(../../../static/img/mobileback.png) no-repeat center center;
        background-size: cover;
        /* position: absolute;
        top: 0;
        left: 0; */
    }
    .campuscontent>div.campuscontent_bottom{
        width:100%;
        height:80%;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        /* z-index: 9999; */
        background: url(../../../static/img/whiteback.png) no-repeat center center;
        background-size: cover;

    }
    /* .campuscontent>div{
        width:100%;
        height:70%;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        padding: 6%;
        box-sizing: border-box;
    } */
     .campuscontent>div.popup{
        height: 40%;
    }
    .campuscontent>div>h3{
        width:100%;
        height:1.4rem;
        font-size:1rem;
        font-weight:550;
        color:rgba(3,3,3,1);
        line-height:1.4rem;
        text-align: center;
        margin-top: 2.5rem;
        margin-bottom: 1.9rem;
    }
    .selbox{
        width: 84%;
        height: 2rem;
        margin: 0 auto;
        margin-top: 1rem;
    }
    #picker_school{
        width: 100%;
        height: 100%;
        outline: none;
        border: 1px solid #eee;
        text-indent: .5rem;
        border-radius: .2rem;
        font-size:0.7rem;
    }
    #bind{
        width: 84%;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        margin-top: 1rem;
        background:linear-gradient(90deg,rgba(45,171,255,1) 0%,rgba(20,114,255,1) 100%);
        box-shadow:0rem 0rem 0.5rem 0rem rgba(205,226,255,1);
        border: none;
        color: #fff;
        border-radius: .2rem;
        font-size:0.7rem;
    }


</style>
