<template>
<div class="bind_content clearfix">
    <div class="bind_left"></div>
    <div class="bind_right">
        <div class="bind_right_">
            <h3>新生登录</h3>
            <p>{{other?'证件号':'身份证号'}}</p>
            <el-input :placeholder="other?'请输入证件号':'请输入身份证号'" v-model="idcard" @blur="vaildidcard">
                <i slot="prefix" class="el-input__icon el-icon-mypostcard"></i>
            </el-input>
            <p class="pwd">姓名</p>
            <el-input placeholder="请输入姓名" v-model="name">
                <i slot="prefix" class="el-input__icon el-icon-myuser"></i>
            </el-input>
            <p class="pwd">图形验证码</p>
            <div class="validnum_">
                <el-input class="validnum_input" placeholder="请输入算式结果" v-model="vxcode">
                </el-input>
                <img :src="img_" alt="" @click="getpic">
            </div>
            <el-button type="primary" class="loginbtn" id="bindlogin" @click="bind">本科新生登录</el-button>
            <div class="backbtn" @click="goback">{{nh?"研究生新生登录":"证件号登录"}} <i></i></div>
        </div>
        <div class="bottom_fix">Copyright © 2020 南京昂克软件 All Rights Reserved </div>
    </div>
</div>
</template>

<script>
import code from '../../util/code'
import Base from 'js-base64'
import qs from 'qs'
import axios from 'axios'
export default {
    data() {
        return {
            Domain:window.base.mainDomain,
            TID:'',
            idcard:'',//
            name:'',//
            vxcode:'',//验证码
            img_:'',//图片验证码
            isidcard:false,
            sessionid:'',
            nh:window.base.nh,
            other:window.base.other,
            ysu:window.base.ysu
        }
    },
    methods: {
        //返回
        goback(){
            this.$router.push('bind')
        },
         //获取验证码图片
        getpic(){
            this.img_ = '/idsweb/rest/captcha/get?id='+new Date().getTime();
            // axios.get(window.base.idsURL+this.ysu?'':'captcha/sessionid?validateKey=FRONT_IDSTGC').then(response=>{
            //     this.sessionid = response.data;
            //     this.img_ = window.base.idsURL+'captcha/get?id='+response.data+new Date().getTime();
            // })
        },
        vaildidcard(){
            if(!this.other){
                this.isidcard  = this.IsCard(this.idcard);
            }else{
                this.isidcard = true;
            }
            if(!this.isidcard){
                this.$message({
                    message: '请输入正确的身份件号！！',
                    type: 'warning'
                });
            }
        },
        IsCard(str) {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return reg.test(str);
        },
        bind(){
            if(!this.idcard){
                this.$message({
                    message: '请输入身份证号！！',
                    type: 'warning'
                });
            }else if(!this.name){
                this.$message({
                    message: '请输入姓名！！',
                    type: 'warning'
                });
            }else if(!this.vxcode){
                this.$message({
                    message: '请输入验证码！！',
                    type: 'warning'
                });
            }else if(!this.isidcard){
                this.$message({
                    message: '请输入正确的身份件号！！',
                    type: 'warning'
                });
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
                        this.getpic();
                        this.$message.error(res.msg);
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                    }
                })
                .catch(error => {
                    this.getpic();
                    this.$message.error(error.msg);
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
.now_login{
    width:170px;
    height:45px;
    background:rgba(20,114,255,0.1);
    border-radius:28px;
    margin: 40px auto 0;
    font-size:16px;
    font-weight:400;
    color:rgba(26,119,255,1);
    line-height:45px;
    text-align: center;
}
.now_login>i{
    display: inline-block;
    width:16px;
    height:14px;
    background:url(../../../static/img/new_login.png) no-repeat center center;
    background-size: cover;
}
.validnum_{
    width: 100%;
    height: 49px;
}
.validnum_>.validnum_input{
    width: calc(100% - 121px);
    height: 100%;
    background: pink;
}
.validnum_>img{
    display: inline-block;
    width: 106px;
    height: 100%;
    float: right;
    margin-left: 15px;
}
.bind_content {
    position: fixed;
    width: 100%;
    height: 100% !important;
    top: 0;
    left: 0;
    padding: 0 !important;
}

.bind_left {
    width: 65%;
    height: 100%;
    background: url(../../../static/img/login.png) no-repeat center center;
    background-size: cover;
    float: left;
}

.bind_right {
    width: 35%;
    height: 100%;
    float: left;
    position: relative;
    background: #fff;
}
.bind_right_ {
    width: 70%;
    height: 80%;
    margin-top: 20%;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

.bind_right_>h3 {
    width: 100%;
    height: 59px;
    font-size: 42px;
    font-weight: 500;
    color: rgba(31, 35, 47, 1);
    line-height: 59px;
    letter-spacing: 10px;
    text-align: center;
    margin-bottom: 23px;
}

.bind_right_>p {
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(98, 101, 109, 1);
    line-height: 20px;
    margin: 10px 0;
}
.bind_right_>p>span{
    font-size: 12px;
}
.bind_right_>p.pwd{
    margin-top: 30px;
}
.el-icon-myuser,.el-icon-mypostcard{
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(../../../static/img/user_icon.png) no-repeat center center;
    background-size: cover;
    margin-top: 17.5px;
    margin-left: 5px;
}
.el-icon-mypostcard{
    background: url(../../../static/img/cardnum.png) no-repeat center center;
    background-size: contain;
}
.loginbtn{
    width: 100%;
    margin-top: 70px;
    background:rgba(20,114,255,1);
}
.backbtn{
    width:170px;
    height:45px;
    background:rgba(20,114,255,0.1);
    border-radius:28px;
    margin: 40px auto 0;
    font-size:16px;
    font-weight:400;
    color:rgba(26,119,255,1);
    line-height:45px;
    text-align: center;
}
.backbtn>i{
    display: inline-block;
    width:16px;
    height:14px;
    background:url(../../../static/img/new_login1.png) no-repeat center center;
    background-size: cover;
}
.back{
    display: inline-block;
    width:16px;
    height:14px;
    background:url(../../../static/img/new_login.png) no-repeat center center;
    background-size: cover;
}
.bottom_fix{
    width: 100%;
    position: absolute;
    bottom: 70px;
    text-align: center;
    left: 0;
    font-size:12px;
    font-weight:500;
    color:rgba(165,173,186,1);
    line-height:17px;
}
</style>
