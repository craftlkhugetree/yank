<template>
    <div class="examing_content" :style="{background:'url(./static/img/'+examingDetails.backpic+')',backgroundSize:'cover'}">
        <div class="examing_auto">
            <div class="examing_card">
                <div class="examing_time">
                    <span>倒计时</span>
                    <i>{{formatexamtime.slice(0,1)}}</i><i>{{formatexamtime.slice(1,2)}}</i>:<i>{{formatexamtime.slice(3,4)}}</i><i>{{formatexamtime.slice(4,5)}}</i>:<i>{{formatexamtime.slice(6,7)}}</i><i>{{formatexamtime.slice(7,8)}}</i>
                </div>
                <div class="examing_text">
                    <div class="examingtext_top">
                        <!-- quesType 1  单选   2  多选   3 判断 -->
                        <span class="qus_type">{{examingDetails.questionList[num].quesType=='1'?'单选题':examingDetails.questionList[num].quesType=='2'?'多选题':'判断题'}}</span><span class="qus_num"><em>{{examingDetails.questionList[num].titlenum}}</em>/{{examingDetails.questionList.length}}</span>
                        <i @click="seecard">答题卡</i>
                    </div>
                    <div class="examing_img" v-if="examingDetails.questionList[num].fileUrl">
                        <img :preview="num" :src="domain+examingDetails.questionList[num].fileUrl" alt="" width="auto" height="100%">
                    </div>
                    <div class="examing_title" v-html="examingDetails.questionList[num].quesTitle"></div>
                    <div class="examing_ans">
                        <div :class="{'myans':item.checked}" @click="(e)=>myans(e,examingDetails.questionList[num],j)" v-for="(item,j) in optionArr" :key="j">{{j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':j=='5'?'F':'G'}}. {{item.optionItem}}</div>
                    </div>
                    <div class="analyze" v-if="two=='3'&& !examingDetails.questionList[num].showsinglesys" @click="analyze(examingDetails.questionList[num])">查看分析</div>
                    <div class="analyze_" v-if="examingDetails.questionList[num].showsinglesys">
                        <p class="ansright" v-if="examingDetails.questionList[num].result">回答正确</p>
                        <p class="answrong" v-else>回答错误</p>
                        <p>正确答案：<span class="rightans">{{examingDetails.questionList[num].trueresult}}</span></p>
                        <p class="ansaya">{{examingDetails.questionList[num].asys}}</p>
                    </div>
                </div>
            </div>
            <div class="examing_bottom">
                <span class="examing_up" v-if="num !=0" @click="up">上一题</span>
                <span class="examing_mid" @click="submittext1">我要交卷</span>
                <span class="examing_down" v-if="num != examingDetails.questionList.length-1" @click="next">下一题</span>
            </div>
        </div>
        <!-- 交卷之后的弹窗 -->
        <div class="nopass" v-if="finishshow">
            <div class="nopass_auto">
                <div class="nopass_img">
                    <img v-if="ispass" src="../../../static/img/pass.png" width="100%" alt="">
                    <img v-else src="../../../static/img/nopass.png" width="100%" alt="">
                </div>
                <h3 v-if="ispass">恭喜通过考试!</h3>
                <h3 v-else>未通过考试，请加油!</h3>
                <h3>您的成绩：{{passscore}}分</h3>
                <div class="nopass_bottom">
                    <span v-if="two=='2' && errlist.length>0" @click="goerrlog">错题回顾</span>
                    <span class="nopass_surebtn" @click="closeover">确定</span>
                </div>
            </div>
        </div>
        <!-- 点击答题卡的弹窗 -->
        <div class="qusnums" ref="qusnums_meng" v-if="anscardshow" @click="close_qusnumsmeng">
            <div class="qusnums_">
                <div class="qusnum_top">
                    <span class="righttype"><i></i><em>已答</em></span>
                    <span><i></i><em>未答</em></span>
                </div>
                <ul class="qusnum_bottom">
                    <!-- <li class="qusnum_wrong">1</li> -->
                    <li :class="{'qusnum_da':v.answer.length}" v-for="(v,i) in examingDetails.questionList" :key="i" @click="goexamingnum(v.titlenum)">{{v.titlenum}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'

export default {
    props:{
        examingDetails1:String
    },
    data() {
        return {
            testid:'',//当前考试的试卷id
            num:0,//现在做的题号
            subject:'',//当前的题目信息
            optionArr:[],//选项的数组
            finishshow:false,//交卷的弹窗
            anscardshow:false,//答题卡的弹窗
            minTime:'',//考试需要的最少时间
            myminTime:'',//自己已经考试的时间  秒数
            totalTime:'',//考试需要的总时长
            formatexamtime:'',//格式化的考试总时长
            timer:null,
            passscore:'',//交卷之后的分数
            ispass:false,//是否通过
            two:'',//1：一直到最后交卷   2 到最后交卷且有查看分析   3 每题都有分析
            domain:'',
            errlist:[],//错题回顾列表
            showsinglesys:false,//显示单个的分析
            examingDetails:'',
            showerrlog:true,//显示错题回顾
            submitloading:true,//提交的阻止

        }
    },
    methods: {
        // 答题卡弹窗
        seecard(){
            this.anscardshow = true;
        },
        //答题卡弹窗中的题目
        goexamingnum(num){
            this.num = num-1;
            this.optionArr = this.examingDetails.questionList[this.num].optionList;
            this.anscardshow = false;
        },
        // 关闭答题卡弹窗
        close_qusnumsmeng(e){
            var isshow = e.path.some(e=>{
                if(e.className=='qusnums_'){
                    return true
                }
            })
            if(!isshow){
                this.anscardshow = false;
            }
        },
        //答题
        myans(e,item,index){
            if(item.optionList[index].checked){
                item.optionList[index].checked = false
            }else{
                if(item.quesType != 2){//不是多选题
                    item.optionList.forEach(e => {
                        e.checked = false
                    });
                    item.optionList[index].checked = true;
                }else{
                    item.optionList[index].checked = true;
                }
            }
            item.answer = [];
            item.optionList.forEach(e=>{
                if(e.checked){
                    item.answer.push(e.id)
                }
            })
            this.$forceUpdate();
        },
        //每题的查看分析
        analyze(item){//点击分析
            var ans = '';
            // quesType  1  单选   2  多选   3 判断
            if(item.quesType !='2'){
                ans = '';
                item.optionList.forEach(e=>{
                    if(e.checked){
                        ans = e.id
                    }
                })
            }else{
                ans = '';
                item.optionList.forEach(e=>{
                    if(e.checked){
                        ans = ans+','+e.id
                    }
                })
            }
            if(ans[0]==','){
                ans = ans.slice(1)
            }
            //答案对错分析
            this.util.postAjax({
                code:code.base,
                url:code.optionResultAna,
                data:{questId:item.id,optionIds:ans}
            }).then(res => {
                this.examingDetails.questionList[this.num].showsinglesys = true;
                this.examingDetails.questionList[this.num].asys = res.item.analy;
                this.examingDetails.questionList[this.num].result = res.item.result;
            });
            this.util.postAjax({
                code:code.base,
                url:code.optionResultAna1,
                data:{questId:item.id}
            }).then(res => {
                var ans_num = [];//正确答案
                this.optionArr.forEach((e,j)=>{
                    if(res.item.trueIds.indexOf(e.id) != -1){
                        var ans = (j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':j=='5'?'F':'G');
                        ans_num.push(ans)
                    }
                })
                this.examingDetails.questionList[this.num].trueresult = ans_num;
            });
        },
        //下一题
        next(){
            this.num++
            this.optionArr = this.examingDetails.questionList[this.num].optionList;
        },
        // 上一题
        up(){
            if(this.num==0){
                this.num=0
            }else{
                this.num--
            }
            this.optionArr = this.examingDetails.questionList[this.num].optionList;
        },
        //交卷
        submittext(){
            if(this.myminTime<this.minTime){
                this.Toast("还未到交卷时间！")
            }else{
                var myanswer = [];
                this.examingDetails.questionList.forEach(e=>{
                    var myansweroption = {
                        questId:'',
                        optionIds:'',
                        score:''
                    };
                    myansweroption.questId = e.id;
                    if(e.answer instanceof Array){
                        e.answer = e.answer.join(',');
                    }else{
                        if(e.answer.indexOf('s') != -1){
                             e.answer =  e.answer.split('s')[1]
                        }else{
                            e.answer = e.answer;
                        }
                    }
                    myansweroption.optionIds = e.answer;
                    myansweroption.score = e.score;
                    myanswer.push(myansweroption)
                })
                //全部考完获取考试成绩
                this.util.postAjax({
                    code:code.base,
                    url:code.checkResultList,
                    data:{"id":this.testid,questList:JSON.stringify(myanswer)}
                }).then(res => {
                    this.finishshow = true;//打开弹窗
                    this.passscore = res.item.sumScore;
                    this.ispass = res.item.isPass;
                    this.errlist = res.item.errorItem;
                    if(this.errlist.length<1){
                        this.showerrlog = false;
                    }
                    clearInterval(this.timer)
                });
            }
        },
        submittext1(){
            if(this.myminTime<this.minTime){
                this.Toast("还未到交卷时间！")
            }else{
                if(this.submitloading){
                    this.MessageBox.confirm('确定交卷?').then(action => {
                        if (action === 'confirm') {
                            var myanswer = [];
                            this.examingDetails.questionList.forEach(e=>{
                                var myansweroption = {
                                    questId:'',
                                    optionIds:'',
                                    score:''
                                };
                                myansweroption.questId = e.id;
                                if(e.answer instanceof Array){
                                    e.answer = e.answer.join(',');
                                }else{
                                    if(e.answer.indexOf('s') != -1){
                                        e.answer =  e.answer.split('s')[1]
                                    }else{
                                        e.answer = e.answer;
                                    }
                                }
                                myansweroption.optionIds = e.answer;
                                myansweroption.score = e.score;
                                myanswer.push(myansweroption)
                            })
                            this.submitloading = false;
                                //全部考完获取考试成绩
                                this.util.postAjax({
                                    code:code.base,
                                    url:code.checkResultList,
                                    data:{"id":this.testid,questList:JSON.stringify(myanswer)}
                                }).then(res => {
                                    this.finishshow = true;//打开弹窗
                                    this.passscore = res.item.sumScore;
                                    this.ispass = res.item.isPass;
                                    this.errlist = res.item.errorItem;
                                    clearInterval(this.timer)
                                });
                            
                        }
                    });
                }else{
                    this.Toast("已经提交试卷！")
                }
            }
        },
        //查看错题回顾
        goerrlog(){
            this.examingDetails.questionList.forEach(e=>{
                this.errlist.forEach(v=>{
                    if(e.id==v.id){
                        v.titlenum = e.titlenum
                    }
                })
            })
            window.sessionStorage.setItem('errlogDetails',JSON.stringify(this.errlist))
            this.$router.push({
                path:'errlog',
                // query:{
                //     errlogDetails:JSON.stringify(this.errlist),
                // }
            })
        },
        //关闭考完试弹窗
        closeover(){
            this.finishshow = false;
            this.$router.push('exam');
        },
        examtime_(){
            this.timer = setInterval(()=>{
                if(this.totalTime==0){
                    this.Toast("考试时间到！")
                    this.submittext();
                    clearInterval(this.timer);
                    return false;
                }
                this.totalTime--;
                this.myminTime++;
                this.formatexamtime = this.util.formatSeconds(this.totalTime);
            },1000)
        }
    },
    beforeDestroy () {
        clearInterval(this.timer);
    },
    created () {
        // this.examingDetails = JSON.parse(this.examingDetails1);
        this.examingDetails = JSON.parse(window.sessionStorage.getItem('examing_detail'));
        // testType  考试形式：1.普通考试 2.模拟考试   3.闯关考试  4.开卷考试
        this.domain = window.location.protocol+'//'+window.location.host;
        this.examingDetails.questionList.forEach((e,i)=>{
            e.titlenum = i+1;
            e.answer = []
            if(e.quesType=='3'){
                e.optionList = [{
                    id:'1',
                    // id:e.id+'s1',
                    optionItem:'正确'
                },{//判断题自己做选项，选项id就传0或者1
                    // id:e.id+'s0',
                    id:'0',
                    optionItem:'错误'
                }];
            }
        })
        this.two = this.examingDetails.two;
        this.testid = this.examingDetails.id
        this.optionArr = this.examingDetails.questionList[this.num].optionList;
        this.minTime = this.examingDetails.minTime*60;
        this.totalTime = this.examingDetails.needTime*60;//将接收到的分钟数转成秒数
        this.examtime_()
    }
    
}
</script>
<style>
.examing_content{
    width:100%;
    height: 100%;
    position: fixed;
    /* background: url(../../../static/imgs/moniback.png) no-repeat center center;
    background-size: cover; */

}
.examing_auto{
    /* width: 90%;
    height: calc(100% - 5rem);
    margin: 0 auto;
    margin-top: 2.5rem; */
    width: 90%;
    height: calc(100% - 5rem);
    margin: 0 auto;
    margin-top: 2.5rem;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    top: 0;
    left: 0;
    position: absolute;
    transition: left .5s;

}
.examing_card{
    height: calc(100% - 4rem);
    position: relative;
    min-width: 90%;
    margin-left: 5%;
    border-radius: 0.25rem;
    overflow: hidden;
    position: relative;
}
.examing_text{
    width: 100%;
    height: calc(100% - 1.75rem);
    background: #fff;
    position: absolute;
    bottom: 0;
    padding: .75rem;
    box-sizing: border-box;
    overflow: scroll;
}
.examingtext_top{
    width: 100%;
}
.examingtext_top>.qus_type{
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
.examingtext_top>.qus_num{
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin-left: .5rem;
}
.examingtext_top>.qus_num>em{
    font-size: 1rem;
}
.examingtext_top>i{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    float: right;
    font-style: normal;
}
.examing_time{
    /* width: 46%; */
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
.examing_time>span{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(135,104,0,1);
}
.examing_time>i{
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
.examing_img{
    width: 100%;
    height: 6.5rem;
    margin-top: .5rem;
}
.examing_title{
    width:100%;
    /* height:3.15rem; */
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    text-align: justify;
    margin-top: .5rem;
}
.examing_ans{
    width: 100%;
}
.examing_ans>div{
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
.examing_ans>div.myans{
    background:rgba(111,132,249,1);
    color: #fff;
}
.examing_bottom{
    width: 100%;
    height: 2.5rem;
    padding: .75rem;
    box-sizing: border-box;
    position: absolute;
    bottom: 1.5rem;
    text-align: center;
}
.examing_bottom>.examing_up,.examing_bottom>.examing_down{
    display: inline-block;
    width:3.25rem;
    height:2rem;
    background:url(../../../static/img/nextup_dowm.png) no-repeat center center;
    background-size: cover;
    border-radius:1.25rem;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:2rem;
    text-align: center;
}
.examing_bottom>.examing_mid{
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
.nopass{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background:rgba(0, 0, 0, 0.7);
    z-index: 9;
}
.nopass_auto{
    width: 90%;
    height: 55%;
    background: #fff;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99;
}
.nopass_img{
    width: 30%;
    height: auto;
    margin-left: 35%;
    margin-top: 1rem;
}
/* .nopass_img>img{
    margin-left: 70%;
    margin-top: 2rem;
} */
.nopass_auto>h3{
    height:1.05rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    text-align: center;
    margin-top: 1rem;
}
.nopass_bottom{
    width: 100%;
    height: 1.75rem;
    position: absolute;
    bottom: 1rem;
    text-align: center;
}
.nopass_bottom>span{
    display: inline-block;
    width:5rem;
    height:1.75rem;
    border-radius:0.88rem;
    border:0.03rem solid rgba(45,148,251,1);
    text-align: center;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(45,148,251,1);
    line-height:1.75rem;
    margin: 0 .5rem;
}
.nopass_bottom>span.nopass_surebtn{
    background:rgba(45,148,251,1);
    color: #fff;
}
.qusnums{
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
}
.qusnums_{
    width: 100%;
    height: 60%;
    background: #fff;
    position: absolute;
    bottom: 0;
    padding: 1rem;
    box-sizing: border-box;
}
.qusnum_top{
    width: 100%;
    height: 2rem;
    border-bottom: 1px solid #DBDBDB;
}
.qusnum_top>span{
    display: inline-block;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    float: right;
}
.qusnum_top>span>i{
    display: inline-block;
    width:0.8rem;
    height:0.8rem;
    border:0.03rem solid rgba(151,151,151,1);
    border-radius: 50%;
    float: left;
}
.qusnum_top>span.righttype>i{
    background:rgba(45,148,251,1);
    border: none;
}
.qusnum_top>span>em{
    float: right;
    margin-left: .25rem;
}
.righttype{
    margin-left: 1rem;
}
.qusnum_bottom{
    width: 100%;
    height: calc(100% - 3rem);
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: scroll;
}
.qusnum_bottom>li{
    width:2rem;
    height:2rem;
    border:0.03rem solid rgba(175,175,175,1);
    margin: .5rem;
    border-radius: 50%;
    text-align: center;
    line-height: 2rem;
}
.qusnum_bottom>li.qusnum_wrong{
    background:rgba(245,34,45,1);
    border: none;
    color: #fff;
}
.qusnum_bottom>li.qusnum_da{
    background:rgba(45,148,251,1);
    border: none;
    color: #fff;
}
.analyze{
    width: 100%;
    border-top: 1px solid rgba(219,219,219,.7);
    font-size: 12px;
    margin-top: .5rem;
    padding-top: .2rem;
    box-sizing: border-box;
    color: #6F84F9;
}
.analyze_{
    font-size: 12px;
    margin-top: .5rem;
    width: 100%;
    text-align: justify;
}
.analyze_>p{
    width:100%;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin: .5rem 0;
}
.analyze_>p.ansright{
    color: green;
}
.analyze_>p.answrong{
    color: red;
}
</style>
