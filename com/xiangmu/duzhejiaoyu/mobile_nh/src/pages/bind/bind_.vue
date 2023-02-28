<template>
   <div>
        <!-- <mt-header class="header" fixed title="用户绑定"></mt-header> -->
        <div class="bindcontent">
            <div class="bindcontent_top"> </div>
            <div class="bindcontent_bottom">
                <h3>读者教育绑定</h3>
                <p>
                    <i>证件号  <span v-if="isCZ">(学号)</span></i>
                    <input type="text" v-model="loginname" placeholder="请输入" value="" id='loginname'/>
                </p>
                <p>
                    <i>密码 <span v-if="isCZ">(初始密码为身份证后六位)</span></i>
                    <input placeholder="请输入" type="password" v-model="pwd" value="" id='name'/>
                </p>
                <div class="valid_num">
                    <i>验证码</i>
                    <input type="text" placeholder="请输入算式结果" value="" v-model="vxcode" id='validnum'/>
                    <img :src="img_" alt="" @click="getpic">
                </div>
                <button class="userbind_bottom" @click="bind" id="bindlogin">绑定并登录</button>
                <div class="newlogin" @click="gonewStulogin" v-if="isnewlogin">新生登录 <i></i></div>
            </div>
        </div>
        <!-- 登录引导蒙层 -->
        <div class="guide_meng" v-if="guide_show&&isnewlogin">
            <div class="guide_meng_">
                <div class="guide_newlogin" @click="gonewStulogin" v-if="isnewlogin">新生登录 <i></i></div>
                <div class="guide_line"></div>
                <div class="guide_text">
                    <h3>登录方式选择</h3>
                    <p>有通知书未入校新生可用身份证登录</p>
                    <span @click="finish">完成</span>
                </div>
            </div>
        </div>

   </div>
</template>
<script>
import code from '../../util/code'
import Base from 'js-base64'
import axios from 'axios';
import qs from 'qs'
export default {
    data() {
        return {
            Domain:window.base.mainDomain,
            TID:'',
            loginname:'',//用户名
            pwd:'',//密码
            vxcode:'',
            img_:'',//验证码图片
            sessionid:'',
            isnewlogin:false,
            guide_show:true,
            isCZ:window.base.cz,
        }
    },
    methods: {
        finish(){
            this.guide_show = false;
        },
        hasnewlogin(){
            this.util.postAjax({
                code:code.base,
                url:code.ruleslist,
                data:{
                    code:'ISNEWLOGIN'//是否开启新生登录

                }
            }).then(res=>{
                if(res.item.rval=='1'){
                    this.isnewlogin = true;
                }else{
                    this.isnewlogin = false;
                }
            })
        },
        //获取验证码图片
        getpic(){
            this.img_ = '/idsweb/rest/captcha/get?id='+new Date().getTime();
        },
        //新生登录
        gonewStulogin(){
            this.$router.push('newbind')
        },
        bind(){
            if(this.loginname==''){
                this.Toast("请输入证件号！！")
            }else if(this.name==''){
                this.Toast("请输入姓名！！")
            }else if(this.vxcode==''){
                this.Toast("请输入验证码！！")
            }else{
                document.getElementById('bindlogin').setAttribute('disabled',true);
                document.getElementById('bindlogin').style.background = '#ccc';
                this.util.postAjax({
                    code:code.base4,
                    url:code.frontLogin,
                    data:{
                        loginname:this.loginname,
                        pwd:this.pwd,
                        vxcode:this.vxcode,
                        sessionid:this.sessionid
                    }
                })
                .then(res => {
                    if(res.success){
                        this.$router.push('campus');
                        window.sessionStorage.setItem('userdata',JSON.stringify(res.data));
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                    }else{
                        this.Toast(res.msg);
                        this.getpic();
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                    }
                })
                .catch(error => {
                    // this.Toast(error.msg);
                    this.getpic();
                    document.getElementById('bindlogin').removeAttribute('disabled');
                    document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                });
            }
        },
        
    },
    created() {
        this.hasnewlogin();
        this.getpic();
    },
    mounted() {
        let keyTimer = null;
        document.body.addEventListener('focusin', () => {
            //软键盘弹起事件
            clearTimeout(keyTimer);
        });
        document.body.addEventListener('focusout', () => {
            // 软键盘关闭事件
            window.scrollTo(0, 0);
            keyTimer = setTimeout(() => {
            if (window.pageYOffset > 0) {
                window.scrollTo(0, 0);
            }
            }, 200);
        });
    },
}
</script>
<style scoped>
    .guide_text>span{
        display: inline-block;
        width:3.8rem;
        height:1.33rem;
        border-radius:2.5rem;
        border:0.03rem solid rgba(255,255,255,1);
        text-align: center;
        line-height: 1.33rem;
        font-size:0.65rem;
        font-weight:400;
        color:rgba(255,255,255,1);
        margin-top: 1rem;
    }
    .guide_text>p{
        width:100%;
        height:1.85rem;
        font-size:0.65rem;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:0.93rem;
        margin-top: .5rem;
    }
    .guide_text>h3{
        width:100%;
        height:1.2rem;
        font-size:0.85rem;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:1.2rem;
    }
    .guide_text{
        width: 50%;
        height: 6rem;
        position: absolute;
        left: 1rem;
        top: 9rem;
    }
    .guide_line{
        width:1.73rem;
        height:2.95rem;
        position: absolute;
        top: 16rem;
        left: calc(32% - 2rem);
        border: none;
        border-left: 1px dotted #fff;
        border-bottom: 1px dotted #fff;
    }
    .guide_meng_{
        width: 100%;
        height: 80%;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .guide_meng{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .55);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
    }
    .newlogin,.guide_newlogin{
        width: 100%;
        height:0.83rem;
        font-size:0.6rem;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:0.83rem;
        margin-top: 1.2rem;
    }
    .guide_newlogin{
        margin-top: 18rem;
        width: 36%;
        height: 2rem;
        line-height: 2rem;
        background: #fff;
        border-radius: 20px;
        margin-left: 32%;
        text-align: center;
    }
    .newlogin>i{
        display: inline-block;
        width:0.65rem;
        height:0.55rem;
        background:url(../../../static/img/newlogin.png) no-repeat center center;
        background-size: cover;
        margin-left: .5rem;
    }
    .valid_num{
        width: 84%;
        height: 2rem;
        margin: 1rem auto;
        margin-bottom: 1.5rem;
    }
    .valid_num>i{
        display: inline-block;
        /* width:2.3rem; */
        height:2rem;
        font-size:0.7rem;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:2rem;
        font-style: normal;
        float: left;
    }
    .valid_num>input{
        width:calc(100% - 9.5rem);
        height:100%;
        border-radius:0.25rem;
        opacity:0.6;
        border:0.05rem solid rgba(43,47,57,1);
        outline: none;
        text-indent: 1rem;
        float: left;
        margin-left: .7rem;
    }
    .valid_num>img{
        display: inline-block;
        width:6rem;
        height: 100%;
        /* width:5.3rem;
        height:2.25rem; */
        /* width: calc(100% - 10.45rem);
        height: 100%; */
        float: right;
    }
    .bindcontent{
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1000;
        /* padding: .5rem;
        box-sizing: border-box; */
        /* background: url(../../../static/img/whiteback.png) no-repeat center center; 
        background-size: cover; */
    }
    
    .bindcontent>div.bindcontent_top{
        width: 100%;
        height: 25%;
        background:url(../../../static/img/mobileback.png) no-repeat center center;
        background-size: cover;
        /* position: absolute;
        top: 0; */
    }
    
    .bindcontent>div.bindcontent_bottom{
        width:100%;
        height:80%;
        /* height:76%; */
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        /* z-index: 9999; */
        background: url(../../../static/img/whiteback.png) no-repeat center center;
        background-size: cover;
    }
    .bindcontent>div>.line{
        width:84%;
        height:0.03rem;
        background: #979797;
        margin: 1rem auto;
    }
    .bindcontent>div>p{
        width: 84%;
        height: 2rem;
        margin: 0 auto;
        position: relative;
        margin-top: 1rem;
    }
    .bindcontent>div>p>i{
        position: absolute;
        top: -.4rem;
        left: .8rem;
        font-size:0.6rem;
        font-weight:400;
        color:rgba(32,36,47,1);
        font-style: normal;
        background: #fff;
    }
    .bindcontent>div>h3{
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
    #loginname,#name{
        width: 100%;
        height: 100%;
        outline: none;
        border:0.05rem solid rgba(32,36,47,1);
        text-indent: .5rem;
        border-radius: .2rem;
        font-size: 14px;
        margin: 0 auto;
    }
    .userbind_bottom{
        width: 84%;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        background:linear-gradient(90deg,rgba(45,171,255,1) 0%,rgba(20,114,255,1) 100%);
        box-shadow:0rem 0rem 0.5rem 0rem rgba(205,226,255,1);
        border-radius:0.25rem;
        border: none;
        color: #fff;
        border-radius: .2rem;
        font-size: 14px;
        outline: none;
    }
</style>
