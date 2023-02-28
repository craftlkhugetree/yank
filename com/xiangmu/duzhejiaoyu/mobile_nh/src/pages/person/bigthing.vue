<template>
    <div class="big_content">
        <div class="single_big" v-for="(v,i) in bigThing" :key="i">
            <div class="singlebig_top clearfix">
                <div class="big_img"></div>
                <div class="big_text">
                    <h3>{{v.title}}<span>{{v.createTime}}</span></h3>
                    <p v-if="v.type==1"></p>
                    <p v-if="v.type==2">本次共学习了<span>{{v.learnTime}}分钟</span></p>
                    <p v-if="v.type==3 && v.testType==1">{{v.isPass==0?'很遗憾，未通过普通考试':'恭喜通过普通考试'}},本次分数为<span>{{v.score}}分</span></p>
                    <p v-if="v.type==3 && v.testType==2">{{v.isPass==0?'很遗憾，未通过模拟考试':'恭喜通过模拟考试'}},本次分数为<span>{{v.score}}分</span></p>
                    <p v-if="v.type==4">{{v.isPass==0?'很遗憾，未通过闯关考试':'恭喜通过闯关考试'}}</p>
                </div>
            </div>
            <div class="personline"></div>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    data() {
        return {
            bigThing:[],//大事记列表
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
                        }else{//在线学习
                            element.title = '在线学习';
                        }
                    }else{//考试记录（普通）4考试记录（闯关
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
        }
    },
    created() {
        this.bigthingslist()
    },
}
</script>
<style>
.big_content{
    padding: 1rem;
    padding-bottom: 2rem;
    box-sizing: border-box;
}
.single_big{
    width:100%;
    height: 5rem;
    position: relative;
    /* background: red; */
}
.singlebig_top{
    width:100%;
    height: 3rem;
}
.big_img{
    width: 3rem;
    height: 3rem;
    background: url(../../../static/img/headphoto.png) no-repeat center center;
    background-size: cover;
    float: left;
}
.big_text{
    width: calc(100% - 3.5rem);
    height: 3rem;
    float: right;
    margin-top: .25rem;
}
.big_text>h3{
    font-size:0.75rem;
    font-weight:600;
    color:rgba(51,51,51,1);
}
.big_text>h3>span{
    float: right;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.big_text>p{
    height:0.83rem;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:0.83rem;
    margin-top: .25rem;
}
.personline{
    width:0.1rem;
    height:2rem;
    background:rgba(216,216,216,1);
    border-radius:0.13rem;
    position: absolute;
    left: 1.5rem;
}
</style>