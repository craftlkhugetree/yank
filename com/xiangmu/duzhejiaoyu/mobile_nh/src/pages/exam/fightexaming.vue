<template>
    <div class="fightexaming_content">
        <div class="fightexaming_auto">
            <div class="fightexaming_top">
                <span class="fighteaxm_back" @click="fighteaxm_back"></span>
                闯关考试
                <!-- <span class="fighteaxm_explain" @click="seefightexplain"></span> -->
            </div>
            <div class="fightexaming_card">
                <div class="fightexaming_time">
                    <span>倒计时</span>
                    <i>{{formatexamtime.slice(3,4)}}</i><i>{{formatexamtime.slice(4,5)}}</i>:<i>{{formatexamtime.slice(6,7)}}</i><i>{{formatexamtime.slice(7,8)}}</i>

                </div>
                <div class="fightexaming_text">
                    <div class="fightexamingtext_top">
                        <span class="qus_type">{{questList[num].quesType=='1'?'单选题':questList[num].quesType=='2'?'多选题':'判断题'}}</span><span class="qus_num"><em>{{num+1}}</em>/{{questList.length}}</span>
                    </div>
                    <!-- <div class="fightexaming_img"></div> -->
                    <div class="fightexaming_img" v-if="questList[num].fileUrl">
                        <img :preview="num" :src="domain+questList[num].fileUrl" alt="" width="auto" height="100%">
                    </div>
                    <div class="fightexaming_title" v-html="questList[num].quesTitle"></div>
                    <div class="fightexaming_ans">
                        <div :class="{'err':v.is_error,'right':v.is_right}" v-for="(v,i) in questList[num].optionList" :key="i" @click="myfight(questList[num],v)">{{v.optionItem}}</div>
                    </div>
                </div>
            </div>
            <!-- <div class="fightexaming_bottom">
                <span class="fightexaming_mid" >下一题</span>
            </div> -->
        </div>
        <!-- 闯关答错的弹窗 -->
        <div class="fightexaming_err" v-if="fightexamingerr_show">
            <div class="fightexaming_err_">
                <div class="fightexaming_err_img"></div>
                <h3>闯关失败!</h3>
                <span @click="re_fight">重新开始</span>
                <span class="exitfight" @click="exitfight">退出本关</span>
            </div>
        </div>
        <!-- 闯关时间到弹窗 -->
        <div class="fightexaming_timeout" v-if="fightexamingtime_show">
            <div class="fightexaming_timeout_">
                <span @click="re_fight">重新开始</span>
                <span class="exitfight" @click="exitfight">退出本关</span>
            </div>
        </div>
        <!-- 闯关暂停 -->
        <div class="fightexaming_pause" v-if="fightexamingpause_show">
            <div class="fightexaming_pause_">
                <div class="fightexaming_pause_img"></div>
                <span class="goon_fight" @click="goonfight">继续闯关</span>
                <span class="re_fight" @click="re_fight">重新开始</span>
                <span class="exitfight" @click="exitfight">退出本关</span>
            </div>
        </div>
        <!-- 闯关成功的弹窗 -->
        <div class="fightexaming_succ" v-if="fightexamingsucc_show">
            <div class="fightexaming_succ_">
                <div class="fightexaming_succ_img"></div>
                <h3>闯关成功!</h3>
                <p v-if="!active">未激活图书证，请继续闯关</p>
                <span @click="fightsure" v-if="!active">确定</span>
                <span @click="fightsure1" v-else>确定</span>
            </div>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    // props:{
    //     fightques:String,
    // },
    data() {
        return {
            finishshow:false,//交卷的弹窗
            fightexamingerr_show:false,//挑战失败
            fightexamingpause_show:false,//暂停
            fightexamingtime_show:false,//时间到弹窗
            fightexamingsucc_show:false,
            fightques1:[],
            questList:[],//当前的闯关的题目数组
            num:0,//现在做的题号
            fighttimer:null,
            fighttime:0,//闯关计时
            totalTime:'',//考试需要的总时长
            time:0,//本题需要的最大答题时间
            formatexamtime:'',//格式化的考试总时长
            active:false,//是否激活图书证
            domain:''
        }
    },
    methods: {
        //暂停
        fighteaxm_back(){
            this.fightexamingpause_show = true;
            clearInterval(this.timer)  
            clearInterval(this.fighttimer)
        },
        //继续
        goonfight(){
            this.fightexamingpause_show = false;
            this.fighttimer = setInterval(() => {
                this.fighttime ++;
            }, 1000);
            this.timer = setInterval(()=>{
                if(this.time==0){
                    this.Toast("闯关时间到！")
                    this.fightexamingtime_show = true;
                    clearInterval(this.timer);
                    clearInterval(this.fighttimer);
                    return false;
                }
                this.time--;
                this.formatexamtime = this.util.formatSeconds(this.time);
            },1000)
        },
        //退出
        exitfight(){
            this.$router.push({
                path:'fightexam',
                query:{
                    fightDetails:window.sessionStorage.getItem('fightobj')
                }
            })
        },
        //确认
        fightsure(){
            this.$router.push({
                path:'fightexam',
                query:{
                    fightDetails:window.sessionStorage.getItem('fightobj')
                }
            })
        },
        fightsure1(){
            this.$router.push('exam')
        },
        //答题
        myfight(qus,option){
            var questArr = [];
            questArr.push({
                "questId":option.questId,//题目ID
                "optionIds":option.id,//学生选择
                "score":qus.score//该题目分数
            });
            //本题定时器暂停
            clearInterval(this.timer);
            //开启新的定时器
            this.time = parseInt(this.fightques1.needTime*60/this.questList.length);
            this.formatexamtime = this.util.formatSeconds(this.time)
            this.fighttimer = setInterval(() => {
                this.fighttime ++;
            }, 1000);
            this.timer = setInterval(()=>{
                if(this.time==0){
                    this.Toast("闯关时间到！")
                    this.fightexamingtime_show = true;
                    clearInterval(this.timer);
                    clearInterval(this.fighttimer);
                    return false;
                }
                this.time--;
                this.formatexamtime = this.util.formatSeconds(this.time);
            },1000)
            //调取每题答案验证的接口
            this.util.postAjax({
                code:code.base,
                url:code.optionResult,
                data:{questId:option.questId,optionIds:option.id}
            }).then(res => {
                if(res.item.result){//答对的继续往下
                    option.is_right=true
                    if(this.questList.length==this.num+1){ //答题结束
                        clearInterval(this.fighttimer);
                        clearInterval(this.timer);
                        this.fighttimeformat = this.util.formatmintomins(this.fighttime);
                        this.util.postAjax({
                            code:code.base,
                            url:code.checkfight,
                            data:{levelId:this.fightques1.id,questList:JSON.stringify(questArr)}
                        }).then(res => {
                            if(res.item.isPass){
                                this.fightexamingsucc_show=true;
                            }else{
                                this.fightexamingerr_show=true;
                            }
                            this.active = res.item.active;//是否激活图书证
                        });
                    }else{
                        this.num++;
                        if(this.questList[this.num].quesType==3){//判断
                            this.questList[this.num].optionList = [{
                                    id:'1',
                                    optionItem:'正确',
                                    questId:this.questList[this.num].id,
                                },{//判断题自己做选项，选项id就传0或者1
                                    id:'0',
                                    optionItem:'错误',
                                    questId:this.questList[this.num].id,
                                }];
                        }else{
                            this.optionList = this.questList[this.num].optionList;//每题题目的选项，选项id
                        }
                        this.optionList.forEach(e=>{
                            e.is_error= false;
                            e.is_right = false;
                        })
                    }
                }else{//答错的就直接调取最后的接口
                    option.is_error=true
                    this.util.postAjax({
                        code:code.base,
                        url:code.checkfight,
                        data:{levelId:this.fightques1.id,questList:JSON.stringify(questArr)}
                    }).then(res => {
                        clearInterval(this.timer);
                        clearInterval(this.fighttimer);
                        this.fighttimeformat = this.util.formatmintomins(this.fighttime);
                        if(res.item.isPass){
                            this.fightexamingsucc_show=true;
                        }else{
                            this.fightexamingerr_show=true;
                        }
                        this.active = res.item.active;//是否激活图书证
                    });
                }
               
            });
        },
        //倒计时
        timedown(){
            this.time = parseInt(this.fightques1.needTime*60/this.questList.length);
            this.formatexamtime = this.util.formatSeconds(this.time)
            this.fighttimer = setInterval(() => {
                this.fighttime ++;
            }, 1000);
            this.timer = setInterval(()=>{
                if(this.time==0){
                    this.Toast("闯关时间到！")
                    this.fightexamingtime_show = true;
                    clearInterval(this.timer);
                    clearInterval(this.fighttimer);
                    return false;
                }
                this.time--;
                this.formatexamtime = this.util.formatSeconds(this.time);
            },1000)
        },
        //重现开始
        re_fight(){
            this.num = 0;
            this.fightexamingtime_show = false;
            this.fightexamingpause_show = false;
            this.fightexamingerr_show = false;
            this.optionArr = this.questList[this.num].optionList;
            this.optionArr.forEach(e=>{
                e.is_error= false;
                e.is_right = false;
            })
            this.timedown()
        }
    },
    created () {
        this.domain = window.location.protocol+'//'+window.location.host;
        // this.fightques1 = JSON.parse(this.fightques);
        this.fightques1 = JSON.parse(window.sessionStorage.getItem('fightexaming_detail'));
        this.questList = this.fightques1.questList;
        this.questList.forEach(e=>{
            if(e.quesType==3){//判断
                e.optionList = [{
                    id:'1',
                    optionItem:'正确',
                    questId:this.questList[this.num].id,
                },{//判断题自己做选项，选项id就传0或者1
                    id:'0',
                    optionItem:'错误',
                    questId:this.questList[this.num].id,
                }];
            }
        })
        this.timedown();
    },
    beforeDestroy () {
        clearInterval(this.fighttimer);
        clearInterval( this.timer );
    }
    
}
</script>
<style>
.fightexaming_bottom{
    width: 100%;
    height: 2.5rem;
    text-align: center;
    margin-top: .45rem;
}
.fightexaming_bottom>.fightexaming_mid{
    display: inline-block;
    width:7.25rem;
    height:2rem;
    background:url(../../../static/img/submit.png) no-repeat center center;
    background-size: cover;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:2rem;
    text-align: center;
    border-radius:1.25rem;
}
.fightexaming_content{
    width:100%;
    height: 100%;
    position: fixed;
    background: url(../../../static/img/fightexam.png) no-repeat center center;
    background-size: cover;

}
.fightexaming_auto{
    width: 90%;
    height: calc(100% - 7rem);
    margin: 0 auto;
    margin-top: 2.5rem;

}
.fightexaming_card{
    width: 100%;
    height: calc(100% - 1.25rem);
    position: relative;
    margin-top: .85rem;
}
.fightexaming_text{
    width: 100%;
    height: calc(100% - 1.75rem);
    background: #fff;
    position: absolute;
    bottom: 0;
    padding: .75rem;
    box-sizing: border-box;
    overflow: scroll;
}
.fightexamingtext_top{
    width: 100%;
}
.fightexamingtext_top>.qus_type{
    display: inline-block;
    width:2.5rem;
    height:1rem;
    background:rgba(111,132,249,1);
    border-radius:0.13rem;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:1rem;
    text-align: center;
}
.fightexamingtext_top>.qus_num{
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    float: right;
}
.fightexamingtext_top>.qus_num>em{
    font-size: 1rem;
}
.fightexamingtext_top>i{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    float: right;
    font-style: normal;
}
.fightexaming_time{
    /* width: 42%; */
    height: 1.75rem;
    background: #fff;
    position: absolute;
    right: 0;
    top: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: .48rem;
    box-sizing: border-box;
    font-size:0.6rem;
    font-weight:400;
}
.fightexaming_time>span{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(135,104,0,1);
}
.fightexaming_time>i{
    font-style: normal;
    display: inline-block;
    width:0.6rem;
    height:1rem;
    /* background:rgba(255,245,102,1); */
    border-radius:0.08rem;
    margin: 0 .05rem;
    font-size:0.6rem;
    font-weight:400;
    /* color:rgba(97,71,0,1); */
    line-height:1rem;
    text-align: center;
    background: rgba(45,148,251,.4);
    color: rgba(45,148,251,1);
}
.fightexaming_img{
    width: 100%;
    height: 6.5rem;
    margin-top: .5rem;
}
.fightexaming_title{
    width:100%;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    text-align: justify;
    margin-top: .5rem;
}
.fightexaming_ans{
    width: 100%;
}
.fightexaming_ans>div{
    width: 100%;
    padding: .5rem .75rem;
    background:rgba(247,247,247,1);
    border-radius:0.25rem;
    box-sizing: border-box;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    text-align: justify;
    margin-top: .5rem;
}
.fightexaming_ans>div.err{
    border: 1px solid #FE3E61;
}
.fightexaming_ans>div.right{
    border: 1px solid #0DCF7B;
}
.fightexaming_top{
    width: 100%;
    height: 1.65rem;
    text-align: center;
    font-size:0.9rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:1.65rem;
}
.fightexaming_err,.fightexaming_timeout{
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, .7);
    top: 0;
}
.fightexaming_err_{
    width: 55%;
    height:11.3rem;
    background:rgba(255,255,255,1);
    border-radius:0.25rem;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
}
.fightexaming_timeout_{
    width: 55%;
    height:7rem;
    background:rgba(255,255,255,1);
    border-radius:0.25rem;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
}
.fightexaming_err_img,.fightexaming_pause_img{
    width:3.75rem;
    height:3.75rem;
    background:url(../../../static/img/answrong.png) no-repeat center center;
    background-size: 130%;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 1.875rem);
    top: -1.875rem;
}
.fightexaming_pause_img{
    background:url(../../../static/img/fight_pause.png) no-repeat center center;
    background-size: 130%;
}
.fightexaming_err_>h3{
    width:100%;
    height:1.05rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    margin-top: 2.875rem;
    text-align: center;
}
.fightexaming_err_>span,.fightexaming_timeout_>span{
    display: inline-block;
    width:6rem;
    height:1.75rem;
    background:linear-gradient(180deg,rgba(71,243,132,1) 0%,rgba(16,169,54,1) 100%);
    border-radius:0.88rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:1.75rem;
    text-align: center;
    margin: 0 auto;
    margin-top: 1rem;
}
.fightexaming_err_>span.exitfight,.fightexaming_timeout_>span.exitfight{
    background:linear-gradient(180deg,rgba(255,191,32,1) 0%,rgba(242,106,22,1) 100%);
}
.fightexaming_pause{
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, .7);
    top: 0;
}
.fightexaming_pause_{
    width: 55%;
    height:12rem;
    background:rgba(255,255,255,1);
    border-radius:0.25rem;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
}
.fightexaming_pause_>span{
    display: inline-block;
    width:6rem;
    height:1.75rem;
    background:linear-gradient(180deg,rgba(83,169,255,1) 0%,rgba(11,101,227,1) 100%);
    border-radius:0.88rem;
    margin-top: 1rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:1.75rem;
}
.fightexaming_pause_>span.goon_fight{
    margin-top: 2.875rem
}
.fightexaming_pause_>span.re_fight{
    background:linear-gradient(180deg,rgba(71,243,132,1) 0%,rgba(16,169,54,1) 100%);
}
.fightexaming_pause_>span.exitfight{
    background:linear-gradient(180deg,rgba(255,191,32,1) 0%,rgba(242,106,22,1) 100%);
}
.fightexaming_succ{
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, .7);
    top: 0;

}
.fightexaming_succ_{
    width: 87%;
    height:10.1rem;
    background:rgba(255,255,255,1);
    border-radius:0.25rem;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
}
.fightexaming_succ_img{
    width:3.48rem;
    height:3.48rem;
    background:url(../../../static/img/fight_succ.png) no-repeat center center;
    background-size: 130%;
    box-shadow:0rem 0rem 0.25rem 0rem rgba(223,90,0,0.3);
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 1.875rem);
    top: -1.875rem;
}
.fightexaming_succ_>h3{
    width:100%;
    height:1.05rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    margin-top: 2.875rem;
    text-align: center;
}
.fightexaming_succ_>p{
    width:100%;
    height:1.05rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    margin-top: .5rem;
}
.fightexaming_succ_>span{
    display: inline-block;
    width:6rem;
    height:1.75rem;
    background:linear-gradient(180deg,rgba(83,169,255,1) 0%,rgba(11,101,227,1) 100%);
    border-radius:0.88rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:1.75rem;
    margin-top: 1rem;
}
</style>
