<template>
<div>
    <div class="person_content_ clearfix">
        <div class="person_left">
            <div class="person_left_img"></div>
            <h3>{{personinfo.name}}</h3>
            <!-- <p>南京农业大学</p> -->
            <ul class="person_card">
                <li>证 件<span>{{personinfo.readerId}}</span></li>
                <li>条 码<span>{{personinfo.barcode}}</span></li>
                <li>班 级<span>{{personinfo.dept}}</span></li>
                <li>年 级<span>{{personinfo.grade}}</span></li>
                <li>校 区<span>{{personinfo.campusName}}</span></li>
            </ul>
            <div class="read_card">
                <h3>图书馆借书证</h3>
                <div v-if="readerFlag_show">
                    <h3>{{personinfo.name}}</h3>
                    <p>图书馆借书证已激活</p>
                </div>
                <div v-else>
                    <p class="goexam_" v-if="ispass_show">图书馆借书证待激活</p>
                    <p class="goexam_" v-if="exam_show">图书馆借书证未激活</p>
                    <span class="goexam" @click="goexam" v-if="!ispass_show">去考试</span>
                </div>
            </div>
        </div>
        <div class="person_right">
            <div class="person_right_img"></div>
            <h3>大事记</h3>
            <el-timeline>
                <el-timeline-item placement="bottom" v-for="(v,i) in bigThing" :key="i">
                    <el-card class="elcard_">
                        <h4><i :style="{background:'url(./static/img/'+v.img+')',backgroundSize:'cover'}"></i>{{v.title}} <span>{{v.createTime}}</span></h4>
                        <p v-if="v.type==1"></p>
                        <p v-if="v.type==2">本次共学习了<span class="studytext">{{v.learnTime}}</span>分钟</p>
                        <!-- testType -->
                        <p v-if="v.type==3 && v.testType==1">{{v.isPass==0?'很遗憾，未通过普通考试':'恭喜通过普通考试'}},本次分数为<span class="nopasstext">{{v.score}}</span>分</p>
                        <p v-if="v.type==3 && v.testType==2">{{v.isPass==0?'很遗憾，未通过模拟考试':'恭喜通过模拟考试'}},本次分数为<span class="nopasstext">{{v.score}}</span>分</p>
                        <p v-if="v.type==4">{{v.isPass==0?'很遗憾，未通过闯关考试':'恭喜通过闯关考试'}}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</div>
</template>

<script>
import code from '../../util/code'
export default {
    data() {
        return {
            bigThing: [],//大事记
            personinfo:'',//个人信息
            readerFlag_show:false,
            ispass_show:false,
            exam_show:false
        }
    },
    methods: {
        //获取大事记
        bigthingslist(){
            this.util.postAjax({
                code:code.base,
                url:code.bigThing,
            }).then(res => {
                //根据事件的type，改变左边的icon
                res.items.forEach(element => {
                    if(element.type==1 || element.type==2){//登陆  学习
                        if(element.type==1){//初次登陆系统
                            element.title = '初次登陆系统';
                            element.img = 'loginicon.png';
                        }else{//在线学习
                            element.title = '在线学习';
                            element.img = 'studyicon.png';
                        }
                    }else{//考试记录（普通）4考试记录（闯关
                        element.img = 'examicon.png';
                        if(element.type==3){//考试记录（普通
                            if(element.isPass==0){
                                element.title = '未通过考试';
                            }else{
                                element.title = '通过考试';
                            }
                            
                        }else{//闯关
                            if(element.isPass==0){
                                element.title = '未通过闯关';
                            }else{
                                element.title = '通过闯关';
                            }
                        }
                    }
                });
                this.bigThing = res.items;
                this.bigThing.sort(function(a,b){
                    return Date.parse(b.createTime) - Date.parse(a.createTime);//时间倒序
                });
            });
        },
        //获取个人信息接口
        getuserinfo(){
            this.util.postAjax({
                code:code.base,
                url:code.campuslist,
            }).then(data=>{
                this.util.postAjax({
                    code:code.base,
                    url:code.userInfo,
                    isRep:true,
                    data:{}
                }).then(res => {
                    if(res.success){
                        this.personinfo = res.item;
                        data.items.forEach(e=>{
                            if(e.id==this.personinfo.campusId){
                                this.personinfo.campusName = e.name
                            }
                        })
                        if(this.personinfo.readerFlag==1){//表示老生或者新生
                            this.readerFlag_show = true;
                        }else{
                            if(this.personinfo.ispass==1){
                                this.ispass_show = true;
                            }else{
                                this.exam_show = true;
                            }
                        }
                        
                    }
                });
            })
        },
        goexam(){
            this.$router.push('exam');
            window.sessionStorage.setItem('activeIndex','1')
        },
    },
    created() {
        this.bigthingslist();
        this.getuserinfo();
    },

}
</script>

<style scoped>
.nopasstext{
    color:#FE3E61;
}
.studytext{
    color:#0CD07A;
}
.elcard_ h4>i{
    display: inline-block;
    width:22px;
    height:22px;
    background:rgba(255,161,0,1);
    opacity:0.69;
    float: left;
    margin-right: 10px;
}
.goexam{
    display: inline-block;
    width:82px;
    height:26px;
    background:rgba(255,255,255,1);
    border-radius:13px;
    line-height: 26px;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    font-weight:400;
    color:rgba(26,119,255,1);
    cursor: pointer;
}
.elcard_ p{
    width:100%;
    height:18px;
    font-size:13px;
    font-weight:400;
    color:rgba(98,101,109,1);
    line-height:18px;
    margin-top: 10px;
    text-indent: 20px;
}
.elcard_ h4>span{
    float: right;
    font-size:12px;
    font-weight:400;
    color:rgba(184,187,190,1);
}
.person_content_ {
    width: 1100px;
    /* height: 100%; */
    margin: 0 auto;
    overflow: auto;
}

.person_left {
    width: 322px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(164, 201, 255, 0.22);
    border-radius: 5px;
    float: left;
}

.person_left>h3 {
    width: 100%;
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(31, 35, 47, 1);
    line-height: 22px;
    letter-spacing: 1px;
    text-align: center;
    margin-top: 22px;
}

.person_left>p {
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(98, 101, 109, 1);
    line-height: 20px;
    letter-spacing: 1px;
    margin-top: 5px;
    text-align: center;
}

.person_card {
    width: 282px;
    /* height: 150px; */
    background: rgba(243, 245, 249, 1);
    border-radius: 5px;
    margin: 30px auto;
    padding: 20px;
    box-sizing: border-box;
}

.person_card>li {
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 550;
    color: rgba(31, 35, 47, 1);
    line-height: 20px;
    margin: 10px 0;
}

.person_card>li:first-of-type {
    margin: 0;
}

.person_card>li>span {
    width: 67px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(98, 101, 109, 1);
    line-height: 20px;
    margin-left: 20px;
}

.read_card {
    border-top: 1px solid #E8EBEF;
    width: calc(100% - 40px);
    margin: 0 auto;
    padding: 20px 0;
    box-sizing: border-box;
}

.read_card>h3 {
    width: 100%;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(31, 35, 47, 1);
    line-height: 22px;
}

.read_card>div {
    width: 100%;
    height: 144px;
    background: url(../../../static/img/pccard.png) no-repeat center center;
    background-size: 120%;
    box-shadow: 0px 0px 10px 0px rgba(216, 218, 219, 1);
    margin: 0 auto;
    margin-top: 20px;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
}

.read_card>div>h3 {
    width: 100%;
    height: 25px;
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 25px;
    margin-top: 44px;
}
.read_card>div>p {
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
    margin-top: 10px;
}
.read_card>div>p.goexam_{
    margin-top: 25px;
}
.person_left_img {
    width: 83px;
    height: 83px;
    background: url(../../../static/img/person_title.png) no-repeat center center;
    background-size: cover;
    margin: 0 auto;
    margin-top: 73px;
}

.person_right {
    width: 755px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(164, 201, 255, 0.22);
    border-radius: 5px;
    float: right;
    /* margin-left: 20px; */
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    /* overflow: auto; */
}

.person_right_img {
    width: 100%;
    height: 156px;
    background: url(../../../static/img/person.png) no-repeat center center;
    background-size: cover;
}

.person_right>h3 {
    width: 100%;
    height: 30px;
    font-size: 22px;
    font-weight: 500;
    color: rgba(31, 35, 47, 1);
    line-height: 30px;
    margin: 40px 0 20px 0;
}
</style>
