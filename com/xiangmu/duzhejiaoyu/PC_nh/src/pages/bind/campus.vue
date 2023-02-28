<template>
<div class="bind_content clearfix">
    <div class="bind_left"></div>
    <div class="bind_right">
        <div class="bind_right_">
            <h3>完善信息</h3>
            <div>
                <span><i>*</i>校区</span>
                <el-select class="add_input" v-model="campusId" placeholder="请选择" @change='changecampus(campusId)'>
                    <el-option
                        v-for="item in list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div v-if="isneedQQ">
                <span><i>*</i> 手机号</span>
                <el-input class="add_input" v-model="mobile" placeholder="请输入手机号" @blur="validdata(mobile,'mobile')"></el-input>
            </div>
            <div v-if="isneedQQ">
                <span><i>*</i>邮箱</span>
                <el-input class="add_input" v-model="email" placeholder="请输入邮箱" @blur="validdata(email,'email')"></el-input>
            </div>
            <div v-if="isneedQQ">
                <span><i>*</i>QQ</span>
                <el-input class="add_input" v-model="qqcard" placeholder="请输入QQ" @blur="validdata(qqcard,'qqcard')"></el-input>
            </div>
            <el-button type="primary" class="loginbtn" id="bind" @click="gobind">完成</el-button>
        </div>
        <div class="bottom_fix">Copyright © 2020 南京昂克软件 All Rights Reserved </div>
    </div>
</div>
</template>

<script>
import code from '../../util/code'
export default {
    data() {
        return {
            campusId: '',
            show:false,
            qqcard:'',
            mobile:'',
            email:'',
            show:true,
            istel:false,
            isemail:false,
            isqq:false,
            list: [],
            GLOBALNAV:'',
            isneedQQ:false,
            personinfo:'',
            isfirst:false,
        }
    },
    methods: {
        changecampus(value){
            this.campusId = value;
            window.sessionStorage.setItem('campusId',this.campusId)
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
                    window.sessionStorage.setItem('menu',JSON.stringify([{
                            name:'全景导航',
                            id:'0',
                            DISPLAYURL:'index'
                        },{
                            name:'在线学习',
                            id:'2',
                            DISPLAYURL:'study'
                        },{
                            name:'在线考试',
                            id:'1',
                            DISPLAYURL:'exam'
                        },{
                            name:'个人中心',
                            id:'3',
                            DISPLAYURL:'person'
                        }]
                    ))
                    window.sessionStorage.setItem('activeIndex',0);
                    this.GLOBALNAV = data.item.rval;
                }else{
                    window.sessionStorage.setItem('menu',JSON.stringify([{
                            name:'在线学习',
                            id:'2',
                            DISPLAYURL:'study'
                        },{
                            name:'在线考试',
                            id:'1',
                            DISPLAYURL:'exam'
                        },{
                            name:'个人中心',
                            id:'3',
                            DISPLAYURL:'person'
                        }]
                    ))
                    window.sessionStorage.setItem('activeIndex',2);
                    this.GLOBALNAV = '';
                }
                this.getschoollist();
            })
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
                this.getuserreaderType(this.personinfo.readerType)
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
                    this.$message.error('获取信息失败，请稍后重试');
                }
            })
        },
        //获取校区
        getschoollist(){
            // this.getuser();//个人信息的
            var flag = true;
            this.util.postAjax({
                code:code.base,
                url:code.campuslist,
            }).then(response => {
                //判断校区
                this.list = response.items;
                if(this.list.length>1){//多个校区，没有绑定校区
                    // console.log(this.personinfo.campusId)
                    if(!this.personinfo.campusId){
                        flag = false;
                    }else{
                        this.campusId = this.personinfo.campusId;
                        window.sessionStorage.setItem('campusId',this.campusId);
                        this.qqcard = this.personinfo.qqcard;
                        this.mobile = this.personinfo.mobile;
                        this.email = this.personinfo.email;
                    }
                }else{
                    this.campusId = this.list[0].id;
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
                            // console.log('this.GLOBALNAV', this.GLOBALNAV)
                            // console.log('this.isfirst', this.isfirst)
                            // console.log('window.base.nh', window.base.nh)
                            if(this.GLOBALNAV){//有全景
                            // console.log('有全景')
                                if(this.isfirst){//第一次
                                    // console.log('第一次')
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
                                this.$router.push('shouye');
                                
                            }else{
                                if(this.isfirst){//第一次
                                    window.sessionStorage.setItem('finish','study');
                                    if(window.base.nh){
                                        window.sessionStorage.setItem('useguide','1');
                                        window.sessionStorage.setItem('isfirstlogin','1');
                                    }else{
                                        window.sessionStorage.setItem('isfirstlogin','0');
                                    }
                                }else{
                                    window.sessionStorage.setItem('isfirstlogin','0');
                                }
                                this.$router.push('study');
                            }
                        }
                    })
                }
            })

        },
        validdata(val,type){
            if(type=='mobile'){
                this.istel = this.isPoneAvailable(val);
                if(!this.istel){
                    this.$message({
                        message: '请输入正确的手机号码',
                        type: 'warning'
                    });
                    return
                }
            }
            if(type=='email'){
                this.isemail = this.isemailAvailable(val);
                if(!this.isemail){
                    this.$message({
                        message: '请输入正确的邮箱',
                        type: 'warning'
                    });
                    return
                }
            }
            if(type=='qqcard'){
                this.isqq = this.isqqAvailable(val);
                if(!this.isqq){
                    this.$message({
                        message: '请输入正确的QQ',
                        type: 'warning'
                    });
                    return
                }
            }
        },
        isPoneAvailable($poneInput) {
            var myreg=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
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
            var myreg=/^[1-9]\d{4,19}$/;
            if (!myreg.test($qq)) {
                return false;
            } else {
                return true;
            }
        },
        //绑定
        gobind(){
            var flag = false;
            if(this.isneedQQ){
                if(!this.campusId){
                    this.$message({
                        message: '请选择校区',
                        type: 'warning'
                    });
                }else if(!this.mobile){
                    this.$message({
                        message: '请输入手机号',
                        type: 'warning'
                    });
                }else if(!this.email){
                    this.$message({
                        message: '请输入邮箱',
                        type: 'warning'
                    });
                }else if(!this.qqcard){
                    this.$message({
                        message: '请输入QQ',
                        type: 'warning'
                    });
                }else if(!this.istel){
                    this.$message({
                        message: '请输入正确的手机号码',
                        type: 'warning'
                    });
                }else if(!this.isemail){
                    this.$message({
                        message: '请输入正确的邮箱',
                        type: 'warning'
                    });
                }else if(!this.isqq){
                    this.$message({
                        message: '请输入正确的QQ',
                        type: 'warning'
                    });
                }else{
                    flag = true
                }
            }else{
                if(!this.campusId){
                    this.$message({
                        message: '请选择校区',
                        type: 'warning'
                    });
                }else{
                    flag = true
                }
            }
            if(flag ){
            // else{
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
                            this.$router.push('shouye');
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
                                    DISPLAYURL:'index'
                                },{
                                    name:'在线学习',
                                    id:'2',
                                    DISPLAYURL:'study'
                                },{
                                    name:'在线考试',
                                    id:'1',
                                    DISPLAYURL:'exam'
                                },{
                                    name:'个人中心',
                                    id:'3',
                                    DISPLAYURL:'person'
                                }]
                            ))
                            window.sessionStorage.setItem('activeIndex',0);

                        }else{
                            this.$router.push('study');
                            if(window.base.nh){
                                window.sessionStorage.setItem('useguide','1');
                                window.sessionStorage.setItem('isfirstlogin','1');
                            }else{
                                window.sessionStorage.setItem('isfirstlogin','0');
                            }
                            window.sessionStorage.setItem('finish','study');
                            window.sessionStorage.setItem('menu',JSON.stringify([{
                                    name:'在线学习',
                                    id:'2',
                                    DISPLAYURL:'study'
                                },{
                                    name:'在线考试',
                                    id:'1',
                                    DISPLAYURL:'exam'
                                },{
                                    name:'个人中心',
                                    id:'3',
                                    DISPLAYURL:'person'
                                }]
                            ))
                            window.sessionStorage.setItem('activeIndex',2);
                        }
                    }
                    
                })
            }
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
    },
    created () {
        this.getuser();
        // this.getschoollist();
        // this.$nextTick(()=>{
            
        // })
        // this.getschoollist();
        // this.getconfiglist();
    }

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
    width: calc(100% - 80px);
    float: right;
   
}
.bind_right_>div>span{
    display: inline-block;
    /* width: 60px; */
    height: 100%;
    line-height: 49px;
    float: left;
}
.bind_right_>div>span>i{
    color: red;
    margin-right: 10px;
    font-style: normal;
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
