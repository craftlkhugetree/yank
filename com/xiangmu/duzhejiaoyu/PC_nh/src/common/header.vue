<template>
    <div class="myheader clearfix">
        <div class="myheader_title"><i></i>入馆考试</div>
        <ul class="myheader_ clearfix">
            <li :class="{'act':num==v.id}" v-for="(v,i) in mymenu" :key="i" @click="gomenu(v.id,$event)">
                {{v.name}}
                <span v-show="childspan" v-for="e in v.children" @click="gomenu1(e.id,$event)">{{e.name}}</span>
                <div class="guide clearfix" v-if="initnum=='guide'&&v.id==0">
                    <div class="guide_img"></div>
                    <div class="guide_text">
                        <h3>【全景导览】版块</h3>
                        <p>看看图书馆全貌</p>
                        <span @click.stop="goon_study">继续探索</span>
                    </div>
                </div>
                <div class="guide clearfix" v-if="initnum=='study'&&v.id==2">
                    <div class="guide_img_1"></div>
                    <div class="guide_text">
                        <h3>【在线学习】版块</h3>
                        <p>好好学习吧，考试答案都在资料中哦</p>
                        <span @click.stop="goon_onlineexam">继续探索</span>
                    </div>
                </div>
                <div class="guide clearfix" v-if="initnum=='exam'&&v.id==1">
                    <div class="guide_img_2"></div>
                    <div class="guide_text">
                        <h3>【在线考试】版块</h3>
                        <p>通过考试就可激活图书证啦！</p>
                        <span @click.stop="finish">完成</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="myheader_exit">
            <i ></i>
            <span>{{personinfo.name}}</span>
            <em @click="exit">退出</em>
        </div>
    </div>
</template>
<script>
import code from '../util/code'
import axios from "axios"
export default {
    data() {
        return {
            mymenu:'',
            num:'',//当前点击的num
            domain:'',
            personinfo:'',
            initnum:'',
            activity:window.base.activity,
            childspan:false,
            ysu:window.base.ysu,
            nuist:window.base.nuist,
            exitURL:window.base.loginToUrl
        }
    },
    methods: {
        finish(){
            this.initnum = 3;
            window.sessionStorage.setItem('finish',this.initnum)
        },
        goon_study(){
            this.initnum = 'study';
        },
        goon_onlineexam(){
            this.initnum = 'exam';
        },
        gomenu(id,event){
            // console.log(id,event)
            switch (id) {
                case '0':
                    this.$router.push({path:'shouye'})
                    break;
                case '1':
                    this.$router.push('exam')
                    break;
                case '2':
                    this.$router.push('study')
                    break;
                case '3':
                    this.childspan = true;

                    // this.$router.push('person')
                    break;
                case '4':
                    this.$router.push('activityIndex')
                    break;
            }
            window.sessionStorage.setItem('activeIndex',id)
        },
        gomenu1(id,event){
            switch (id) {
                case '5':
                    this.$router.push('myactivity')
                    break;
                case '6':
                    this.$router.push('person')
                    break;
            }
        },
        exit(){
            window.sessionStorage.setItem('finish','person');
            if(this.nuist||this.ysu){
                location.href =
                location.protocol +
                "//" +
                location.host +
                "/idsweb/rest/Idsclient/reqLogout?reqUrl=" +
                window.location.href;

            }else{
                // location.href=location.protocol+'//'+location.host;
                location.href =
                location.protocol +
                "//" +
                location.host +
                "/idsweb/rest/Idsclient/reqLogout?reqUrl=" +
                this.exitURL;
            }
            
        },
        //获取个人信息接口
        getuserinfo(){
            this.util.postAjax({
                code:code.base,
                url:code.userInfo,
                isRep:true,
                data:{}
            }).then(res => {
                if(res.success){
                    this.personinfo = res.item;
                }
            });
        },
        gloablview(){
            console.log('activity', this.activity)
            var obj = {
                name:'活动',
                id:'4',
                DISPLAYURL:'activityIndex'
            }
            this.util.postAjax({
                code:code.base,
                url:code.ruleslist,
                data:{
                    code:'GLOBALNAV'//是否顺序阅读
                }
            }).then(data=>{
                if(data.item.rval){
                    window.sessionStorage.setItem('GLOBALNAV',data.item.rval)
                    this.mymenu = [{
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
                        children:[{
                            name:'我的信息',
                            DISPLAYURL:'person',
                            id:'6',
                        }
                        // ,{
                        //     name:'我的活动',
                        //     DISPLAYURL:'myactivity',
                        //     id:'5'
                        // }
                        ]
                    }]
                    if(this.activity){
                        // this.mymenu.push(obj)
                        this.mymenu = [{
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
                        name:'活动',
                        id:'4',
                        DISPLAYURL:'activityIndex'
                    },{
                        name:'个人中心',
                        id:'3',
                        children:[{
                            name:'我的信息',
                            DISPLAYURL:'person',
                            id:'6',
                        },{
                            name:'我的活动',
                            DISPLAYURL:'myactivity',
                            id:'5'
                        }]
                    }]
                    }
                }else{
                    this.mymenu =[{
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
                        // DISPLAYURL:'person'
                        children:[{
                            name:'我的信息',
                            DISPLAYURL:'person',
                            id:'6',
                        }
                        // ,{
                        //     name:'我的活动',
                        //     DISPLAYURL:'myactivity',
                        //     id:'5'
                        // }
                        ]
                    }]
                    if(this.activity){
                        // this.mymenu.push(obj)
                        this.mymenu =[{
                        name:'在线学习',
                        id:'2',
                        DISPLAYURL:'study'
                    },{
                        name:'在线考试',
                        id:'1',
                        DISPLAYURL:'exam'
                    },{
                        name:'活动',
                        id:'4',
                        DISPLAYURL:'activityIndex'
                    },{
                        name:'个人中心',
                        id:'3',
                        // DISPLAYURL:'person'
                        children:[{
                            name:'我的信息',
                            DISPLAYURL:'person',
                            id:'6',
                        },{
                            name:'我的活动',
                            DISPLAYURL:'myactivity',
                            id:'5'
                        }]
                    }]
                    }
                }
            })
            // console.log('this.mymenu', this.mymenu)
        },
        
    },
    created () {
        this.initnum = window.sessionStorage.getItem('finish')?window.sessionStorage.getItem('finish'):'';
        this.gloablview();
        this.getuserinfo();
        this.num = window.sessionStorage.getItem('activeIndex');
        this.domain = window.location.protocol+'//'+window.location.host;
    }
    
}
</script>
<style scoped>
.guide_text>h3{
    width:128px;
    height:16px;
    font-size:16px;
    font-weight:500;
    color:rgba(5,19,71,1);
    line-height:24px;
}
.guide_text>span{
    font-size:14px;
    font-weight:400;
    color:rgba(26,119,255,1);
    line-height:21px;
    position: absolute;
    right: 24px;
    bottom: 24px;
}
.guide_text>p{
    height:14px;
    font-size:14px;
    font-weight:400;
    color:rgba(115,115,115,1);
    line-height:21px;
    margin-top: 15px;
    text-align: left;
}
.guide{
    width:442px;
    background:rgba(255,255,255,1);
    background: url(../../static/img/guide.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    z-index: 99;
    left: -145px;
    bottom: -156px;
    padding: 24px;
    box-sizing: border-box;
}
.guide_img,.guide_img_1,.guide_img_2{
    width:161px;
    height:90px;
    background:url(../../static/img/view.png) no-repeat center center;
    background-size: cover;
    border-radius:5px;
    float: left;
}
.guide_img_1{
    background:url(../../static/img/guide_study.png) no-repeat center center;
    background-size: cover;
}
.guide_img_2{
    background:url(../../static/img/guide_exam.png) no-repeat center center;
    background-size: cover;
}
.guide_text{
    width:209px;
    height:90px;
    border-radius:5px;
    float: right;
}
.el-menu{
    background:rgba(26,119,255,1);
    
}
.el-menu--horizontal>.el-menu-item{
    color: #fff;
}
.myheader{
    width:100%;
    height:60px;
    background:rgba(26,119,255,1);
    box-shadow:0px 2px 5px 0px rgba(191,197,216,0.2);
}
.myheader>div{
    float: left;
    width: 300px;
}
.myheader_title,.myheader_exit{
    width: calc(calc(100% - 600px) / 2);
    height:100%;
    font-size:22px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:60px;
    letter-spacing:1px;
    text-indent: 20px;
    float: right;
}
.myheader_title>i{
    display: inline-block;
    width:40px;
    height:36px;
    background:url(../../static/img/logo.png) no-repeat center center;
    background-size: cover;
    float: left;
    margin-left: 80px;
    margin-top: 10px;
    cursor: pointer;
}
.myheader_exit{
    float: right;
    padding-right: 100px;
    box-sizing: border-box;
    text-align: right;
    font-size:14px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:60px;
    position: relative;
    cursor: pointer;
}
.myheader_exit>i{
    display: inline-block;
    width:40px;
    height:40px;
    background: url(../../static/img/person_title.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    right: 240px;
    top: 10px;
}
.myheader_exit>span{
    text-align: right;
    margin-right: 20px;
}
.myheader_{
    width: calc(100% - 600px);
    height: 100%;
    float: left;
    padding-left: 75px;
    box-sizing: border-box;
    text-align: center;
}
.myheader_>li>span:first-of-type{
     top: 60px;
     border-top: none;
}
.myheader_>li>span{
    position: absolute;
    top: 100px;
    right: 0;
    width: calc(100% - 2px);
    height: 40px;
    display: inline-block;
    background: #fff;
    line-height: 40px;
    color: #1A77FF;
    border: 1px solid #1A77FF;
    /* display: none; */
}
.myheader_>li{
    display: inline-block;
    width: 100px;
    height: 100%;
    line-height: 60px;
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    text-align: center;
    cursor: pointer;
    position: relative;
}
.myheader_>li.act{
    background:rgba(205,225,255,1);
    color:rgba(26,119,255,1);
}
</style>