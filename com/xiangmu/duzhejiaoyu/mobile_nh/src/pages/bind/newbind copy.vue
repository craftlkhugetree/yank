<template>
   <div>
        <!-- <mt-header class="header" fixed title="用户绑定"></mt-header> -->
        <div class="bindcontent">
            <div class="bindcontent_top"> </div>
            <div class="bindcontent_bottom">
                <h3>本科新生登录</h3>
                <p>
                    <i>证件号</i>
                    <input type="text" placeholder="请输入身份证号" value="" v-model="idcard" @blur="vaildidcard" id='IDnum' />
                </p>
                <p>
                    <i>姓名</i>
                    <input type="text" placeholder="请输入姓名" value="" v-model="name" id='name' />
                </p>
                <div class="valid_num">
                    <i>验证码</i>
                    <input type="text" placeholder="请输入算式结果" v-model="vxcode" value="" id='vxcode' />
                    <img :src="img_" alt="" @click="getpic">

                </div>
                <button class="userbind_bottom" @click="bind" id="bindlogin">本科新生登录</button>
                <button class="back_bottom" @click="goback" id="backlogin">{{nh?'研究生新生登录':'证件号登录'}}</button>
            </div>
        </div>
   </div>
</template>
<script>
import code from '../../util/code'
import Base from 'js-base64'
import qs from 'qs'
import axios from 'axios'
export default {
    props:{
        // campusId:String
    },
    data() {
        return {
            Domain:window.base.mainDomain,
            TID:'',
            idcard:'',//
            name:'',//
            vxcode:'',
            isidcard:false,
            img_:'',//验证码图片
            sessionid:'',
            nh:window.base.nh
        }
    },
    methods: {
        //获取验证码图片
        getpic(){
            this.img_ = '/idsweb/rest/captcha/get?id='+new Date().getTime();
        },
        //返回
        goback(){
            this.$router.push('bind')
        },
        vaildidcard(){
            // this.isidcard  = this.IsCard(this.idcard);
            // if(!this.isidcard){
            //     this.Toast("请输入正确的身份件号！！")
            // }
        },
        IsCard(str) {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return reg.test(str);
        },
        bind(){
            if(this.idcard==''){
                this.Toast("请输入身份证号！！")
            }else if(this.name==''){
                this.Toast("请输入姓名！！")
            }else if(this.vxcode==''){
                this.Toast("请输入验证码！！")
            }else if(!this.isidcard){
                this.Toast("请输入正确的身份件号！！")
            }else{
                document.getElementById('bindlogin').setAttribute('disabled',true);
                document.getElementById('bindlogin').style.background = '#ccc';
                this.util.postAjax({
                    code:code.base4,
                    url:code.frontLogin,
                    data:{
                        name:this.name,
                        idcard:this.idcard,
                        vxcode:this.vxcode,
                        sessionid:this.sessionid
                    }
                })
                .then(res => {
                    if(res.success){
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                        this.$router.push('campus');
                    }else{
                        this.Toast(res.msg);
                        this.getpic();
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                    }
                })
                .catch(error => {
                    this.getpic();
                    document.getElementById('bindlogin').removeAttribute('disabled');
                    document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                });
            }
        },
        
    },
    created() {
        this.getpic();
    },
}
</script>
<style scoped>
    .bindcontent>div.bindcontent_top{
        width: 100%;
        height: 25%;
        background:url(../../../static/img/mobileback.png) no-repeat center center;
        background-size: cover;
        /* position: absolute;
        top: 0; */
    }
    .newlogin{
        width: 100%;
        height:0.83rem;
        font-size:0.6rem;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:0.83rem;
        margin-top: 1.2rem;
    }
    .newlogin>i{
        display: inline-block;
        width:0.65rem;
        height:0.55rem;
        background:rgba(26,119,255,1);
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
        float: right;
    }
    .bindcontent{
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1000;
        /* padding: .5rem;
        box-sizing: border-box;
        background: #fff; */
        /* background: url(../../../static/img/bindbac.jpg) no-repeat center center;
        background-size: cover; */
    }
    .bindcontent>div.bindcontent_bottom{
        width:100%;
        height:80%;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
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
    }
    #IDnum,#name{
        width: 100%;
        height: 100%;
        outline: none;
        border:0.05rem solid rgba(32,36,47,1);
        text-indent: .5rem;
        border-radius: .2rem;
        font-size: 14px;
        margin: 0 auto;
    }
    .userbind_bottom,.back_bottom{
        width: 84%;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        background: #fff;;
        border-radius:0.25rem;
        color:rgba(51,51,51,1);
        border:0.05rem solid rgba(151,151,151,1);
        border-radius: .2rem;
        font-size: 14px;
        outline: none;
    }
    .userbind_bottom{
        background:linear-gradient(90deg,rgba(45,171,255,1) 0%,rgba(20,114,255,1) 100%);
        color: #fff;
        border: none;
        margin-bottom: .5rem;
    }
</style>
