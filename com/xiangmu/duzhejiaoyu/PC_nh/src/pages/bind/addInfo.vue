<template>
<div class="bind_content clearfix">
    <div class="bind_left"></div>
    <div class="bind_right">
        <div class="bind_right_">
            <h3>完善信息</h3>
            <div>
                <span>校区</span>
                <!-- <p>选择校区</p>
            <el-select v-model="campus" placeholder="请选择">
                <i slot="prefix" class="el-input__icon el-icon-campus"></i>
                <el-option
                    class="seloption"
                    v-for="item in list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select> -->
                <el-select class="add_input" v-model="value" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <span>手机号</span>
                <el-input class="add_input" v-model="input" placeholder="请输入手机号"></el-input>
            </div>
            <div>
                <span>邮箱</span>
                <el-input class="add_input" v-model="input" placeholder="请输入邮箱"></el-input>
            </div>
            <div>
                <span>QQ</span>
                <el-input class="add_input" v-model="input" placeholder="请输入QQ"></el-input>
            </div>
            <el-button type="primary" class="loginbtn" id="bindlogin" @click="bind">完成</el-button>
        </div>
        <div class="bottom_fix">Copyright © 2020 南京昂克软件 All Rights Reserved </div>
    </div>
</div>
</template>

<script>
import code from '../../util/code'
import Base from 'js-base64'
import qs from 'qs'
export default {
    data() {
        return {
            Domain:window.base.mainDomain,
            TID:'',
            cardnum:'',//用户名
            username:'',//密码
            validnum:'',//验证码
        }
    },
    methods: {
        bind(){
            if(this.username==''){
                this.$message({
                    message: '请输入证件号！！',
                    type: 'warning'
                });
            }else if(this.password==''){
                this.$message({
                    message: '请输入密码！！',
                    type: 'warning'
                });
            }else{
                document.getElementById('bindlogin').setAttribute('disabled',true);
                document.getElementById('bindlogin').style.background = '#ccc';
                this.util.postAjax({
                    code:code.base2,
                    url:code.login,
                    isRep:true,
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    },
                    data:{
                        name:this.username,
                        password:this.password,
                    }
                })
                .then(res => {
                    if(res.success){
                        res.item.TID = this.TID;//在返回数据的基础上加TID
                        var params = Base.Base64.encode(encodeURI(JSON.stringify(res.item)));
                        window.location.href = window.location.protocol+'//'+window.location.host+'/lres/web/index.jsp?authType=lrespc&param='+params;
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                    }else{
                        if(res.state=='1'){//state:1表示用户账号或密码有误，2表示已经绑定
                            this.$message.error('用户账号或密码有误');
                        }else{
                            this.$message.error('用户账号已绑定');
                        }
                        document.getElementById('bindlogin').removeAttribute('disabled');
                        document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                    }
                })
                .catch(error => {
                    this.$message.error('用户名或密码错误！');
                    document.getElementById('bindlogin').removeAttribute('disabled');
                    document.getElementById('bindlogin').style.background = 'rgba(0,109,255,1)';
                });
            }
        },
        
    },
    created() {
        // this.util.postAjax({
        //     code:code.base2,
        //     url:code.detailByUrl,
        //     data:{INDEXURL:this.Domain}
        // }).then(res => {
        //     this.TID = res.item.ID;
        // }).catch(res=>{
        //     this.$message.error('登陆异常');
        //     location.reload() 
        // })
    },
}
</script>

<style scoped>
.bind_right_>div{
    width: 100%;
    height: 49px;
    border-bottom: 1px solid #DBDBDB;
    margin-top: 9px;
}
.bind_right_>div>.add_input{
    width: calc(100% - 50px);
    float: right;
   
}
.bind_right_>div>span{
    display: inline-block;
    width: 50px;
    height: 100%;
    line-height: 49px;
    float: left;
}
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
.validnum_>span{
    display: inline-block;
    width: 106px;
    height: 100%;
    background: red;
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
    height: 60%;
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
    margin-bottom: 73px;
}

.el-icon-user,.el-icon-postcard{
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(../../../static/img/user_icon.png) no-repeat center center;
    background-size: cover;
    margin-top: 17.5px;
    margin-left: 5px;
}
.el-icon-postcard{
    background: url(../../../static/img/cardnum.png) no-repeat center center;
    background-size: contain;
}
.loginbtn,.backbtn{
    width: 100%;
    margin-top: 70px;
    background:rgba(20,114,255,1);
}
.backbtn{
    background:#fff;
    border:1px solid rgba(151,151,151,1);
    margin-top: 20px;
    margin-left: 0;
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
