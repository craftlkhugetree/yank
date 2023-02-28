<template>
    <div>
        <div class="errlog_ clearfix">
            <div class="errlog_left">
                <h3>答题卡</h3>
                <div class="errlog_pro">
                    <h3>答题正确率<span>{{rightpercent}}%</span></h3>
                    <p>答对：<span class="rightnum">{{parseInt(examlist.questionList.length) - parseInt(errlist.length)}}题</span> &nbsp;&nbsp;答错：<span class="errnum">{{errlist.length}}题</span></p>
                </div>
                <h4>单选题</h4>
                <ul class="errlog_num clearfix">
                    <li @click="gonum(v.titlenum,v)" :class="{'answering':parseInt(v.titlenum)==num_}" v-for="(v,i) in errlist" v-if="v.quesType=='1'" :key="i">{{v.titlenum}}</li>
                </ul>
                <h4 style="margin-top:20px;">多选题</h4>
                <ul class="errlog_num clearfix">
                    <li @click="gonum(v.titlenum,v)" :class="{'answering':parseInt(v.titlenum)==num_}" v-for="(v,i) in errlist" v-if="v.quesType=='2'" :key="i">{{v.titlenum}}</li>
                </ul>
                <h4 style="margin-top:20px;">判断题</h4>
                <ul class="errlog_num clearfix">
                    <li @click="gonum(v.titlenum,v)" :class="{'answering':parseInt(v.titlenum)==num_}" v-for="(v,i) in errlist" v-if="v.quesType=='3'" :key="i">{{v.titlenum}}</li>
                </ul>
            </div>
            <div class="errlog_right">
                <div class="errlog_right_">
                    <h3>{{errlist[num].quesType=='1'?'单选题':errlist[num].quesType=='2'?'多选题':'判断题'}}</h3>
                    <h4>{{errlist[num].titlenum}}. <span v-html="errlist[num].quesTitle"></span></h4>
                    <div class="errlog_titleimg" v-if="errlist[num].fileUrl"></div>
                    <div class="errlog_ans">
                        <div v-for="(v,i) in optionArr" :key="i" :class="{'rightopt':errlist[num].trueIds.indexOf(v.id) != -1 || errlist[num].isTrue==v.id,'wrongopt':errlist[num].chooseIds.indexOf(v.id) != -1}">
                            <span >{{i==0?'A':i==1?'B':i==2?'C':i==3?'D':i==4?'E':'F'}}. {{v.optionItem}}</span>
                            <i :class="{'radiobox':errlist[num].quesType!='2' ,'mycheckbox':errlist[num].quesType=='2'}"></i>
                        </div>
                    </div>
                    <div class="errlog_explain">
                        <h3><i></i> 题目解析</h3>
                        <p>我的答案：{{errlist[num].myoption==''?'未作答':errlist[num].myoption}}</p>
                        <p>正确答案：{{errlist[num].trueoption}}</p>
                        <p>{{errlist[num].quesAnaly}}</p>
                    </div>
                </div>
                <div class="errlog_btns">
                    <el-button type="primary" @click="gobackexam" class="goback">返回主页</el-button>
                    <el-button type="primary" v-if="num != errlist.length-1" class="down" @click="next">下一题</el-button>
                    <el-button class="up" v-if="num !=0" @click="up">上一题</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            errlist:[],//错题列表
            examlist:[],//试卷列表
            num:0,//当前题号
            num_:0,
            optionArr:[],//选项
            rightpercent:0,
        }
    },
    methods: {
        initerrlog(){
            this.errlist = JSON.parse(window.sessionStorage.getItem('errlog'));
            this.errlist.forEach(e=>{
                e.myoption = '';
                e.trueoption = '';
                if(e.quesType == 2){//多选
                    e.options.forEach((o,j)=>{
                        if(e.trueIds.indexOf(o.id) != -1){
                            var ans = (j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':'F');
                            e.trueoption = e.trueoption +' ' +  ans
                        }
                        if(e.chooseIds.indexOf(o.id) != -1){
                            var ans = (j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':'F');
                            e.myoption = e.myoption+' ' + ans;
                        }
                    });
                }else if(e.quesType == 1){
                    e.options.forEach((o,j)=>{
                        if(e.trueIds.indexOf(o.id) != -1){
                            var ans = (j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':'F');
                            e.trueoption = e.trueoption +' ' +  ans
                        }
                        if(e.chooseIds.indexOf(o.id) != -1){
                            e.myoption=(j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':'F');
                        }
                    });
                }else{
                    e.options = [{
                        id:'0',
                        optionItem:'错误'
                    },{
                        id:'1',
                        optionItem:'正确'
                    }]
                    if(e.chooseIds==''){
                        e.myoption="未作答";
                        // if(e.isTrue==0){//表示答案是  错误
                        //     e.trueoption = 'A'
                        // }else{
                        //     e.trueoption = 'B'
                        // }
                    }else{
                        e.myoption=(e.chooseIds==0?"A":"B")
                        // if(e.isTrue==0){//表示答案是  错误
                        //     e.trueoption = 'A'
                        // }else{
                        //     e.trueoption = 'B'
                        // }
                    }
                    if(e.isTrue==0){//表示答案是  错误
                        e.trueoption = 'A'
                    }else{
                        e.trueoption = 'B'
                    }
                }
            })
            this.optionArr = this.errlist[this.num].options;
            this.num_ = this.errlist[this.num].titlenum;
        },
        //下一题
        next(){
            this.num++;
            this.num_ =  this.errlist[this.num].titlenum;
            this.optionArr = this.errlist[this.num].options;
        },
        //上一题
        up(){
            this.num--;
            this.num_ =  this.errlist[this.num].titlenum;
            this.optionArr = this.errlist[this.num].options;
        },
        gonum(num,v){
            this.num_ = num
            this.errlist.forEach((e,i)=>{
                if(e.titlenum==num){
                    this.num = i
                }
            })
            this.optionArr = this.errlist[this.num].options;
        },
        //返回考试
        gobackexam(){
            this.$router.push('exam')
        }
    },
    created () {
        this.initerrlog();
        this.examlist = JSON.parse(window.sessionStorage.getItem('examdetail'));
        this.rightpercent = Math.round((this.examlist.questionList.length - this.errlist.length)/this.examlist.questionList.length*10000)/100
    }
    
}
</script>
<style scoped>
    .errlog_explain{
        width:740px;
        background:rgba(255,253,243,1);
        border-radius:5px;
        padding: 20px;
        box-sizing: border-box;
    }
    .errlog_explain>h3{
        width:100%;
        font-size:14px;
        font-weight:550;
        color:rgba(31,35,47,1);
        line-height:20px;
        border-bottom: 1px solid #FFF2CB;
        padding-bottom: 10px;
    }
    .errlog_explain>h3>i{
        display: inline-block;
        width:20px;
        height:20px;
        float: left;
        background: url(../../../static/img/expalin.png) no-repeat center center;
        background-size: cover;
        margin-right: 5px;
    }
    .errlog_explain>p{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin: 5px 0;
    }
    .errlog_explain>p:first-of-type{
        margin-top: 19px;
    }
    .errlog_{
        width: 1100px;
        height: 100%;
        margin: 0 auto;
    }
    .errlog_left{
        width:300px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 10px 0px rgba(164,201,255,0.22);
        border-radius:5px;
        float: left;
        padding: 20px;
        box-sizing: border-box;
        padding-bottom: 100px;
    }
    .errlog_left>h4{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin: 5px 0;
    }
    .errlog_left>h4:first-of-type{
        margin-top: 30px;
    }
    .errlog_left>h3,.errlog_right_>h3{
        width:100%;
        font-size:22px;
        font-weight:550;
        color:rgba(31,35,47,1);
        line-height:50px;
        border-bottom: 1px solid #E8EBEF;
        padding-bottom: 10px;
        box-sizing: border-box;
    }
    .errlog_left>h3>span{
        float: right;
        font-size:12px;
        font-weight:400;
        color:rgba(98,101,109,1);
    }
    .errlog_pro{
        width:100%;
        margin-top: 20px;
        height:74px;
        background:rgba(205,225,255,.49);
        border-radius:5px;
        padding: 15px 20px;
        box-sizing: border-box;
    }
    .errlog_pro>h3{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
    }
    .errlog_pro>h3>span{
        font-size:14px;
        font-weight:550;
        color:rgba(26,119,255,1);
        float: right;
    }
    .errlog_pro>h3>span>i{
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        font-style: normal;
    }
    .errlog_pro>p{
        width:100%;
        height:17px;
        font-size:12px;
        font-weight:400;
        color:rgba(98,101,109,1);
        line-height:17px;
        margin-top: 10px;
    }
    .errlog_pro>p>span.rightnum{
        color: #0CD07A;
    }
    .errlog_pro>p>span.errnum{
        color: #FE3E61;
    }
    .pro_{
        margin-top: 15px;
    }
    .errlog_num>li{
       width:30px;
        height:30px;
        background:rgba(254,62,97,1);
        border-radius:3px;
        float: left;
        margin: 5px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        border: 1px solid transparent;
    }
    /* .errlog_num>li:first-of-type{
        margin-left: 0;
    } */
    .errlog_num>li.answering{
        background:rgba(254,62,97,0.3);
        border-radius:3px;
        border:1px solid rgba(254,62,97,1);
        color:rgba(254,62,97,1);
        
    }
    .errlog_right{
        width:780px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 10px 0px rgba(164,201,255,0.22);
        border-radius:5px;
        float: right;
        padding: 20px;
        box-sizing: border-box;
        height: 100%;
    }
    .errlog_right_{
        height: calc(100% - 60px);
        overflow: auto;
    }
    .singlenum{
        font-size:18px;
        font-weight:400;
        color:rgba(98,101,109,1);
    }
    .errlog_time{
        float: right;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
    }
    .errlog_time>i{
        display: inline-block;
        width:20px;
        height:20px;
        background:url(../../../static/img/exam_time.png) no-repeat center center;
        background-size: cover;
        float: left;
        margin-top: 15px;
        margin-right: 5px;
    }
    .errlog_time>em{
        color:rgba(26,119,255,1);
    }
    .errlog_right_>h4{
        width:100%;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin-top: 20px;
    }
    .errlog_titleimg{
        width:348px;
        height:204px;
        background: red;
        margin-top: 20px;
    }
    .errlog_ans{
        margin-top: 20px;
    }
    .errlog_ans>div{
        width: 100%;
        border:1px solid rgba(232,235,239,1);
        border-radius:5px;
        padding: 13px 20px;
        box-sizing: border-box;
        margin: 20px 0;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
    }
    .errlog_ans>div.rightopt,.errlog_ans>div.rightopt.wrongopt{
        /* border-radius:5px; */
        /* opacity:0.69; */
        border:1px solid rgba(12,208,122,1);
    }
    .errlog_ans>div.wrongopt{
        border:1px solid rgba(254,62,97,1);
    }
    .errlog_ans>div.act{
        background:rgba(255,255,255,1);
        border-radius:5px;
        border:1px solid rgba(26,119,255,1);
    }
    .errlog_ans>div.act>i,.errlog_ans>div.rightopt>i.radiobox,.errlog_ans>div.wrongopt.rightopt>i.mycheckbox{
        background: url(../../../static/img/right.png) no-repeat center center;
        background-size: contain;
    }
    .errlog_ans>div.act>i,.errlog_ans>div.rightopt>i.mycheckbox{
        background:url(../../../static/img/right.png) no-repeat center center;
        background-size: contain;
    }
    .errlog_ans>div.wrongopt>i.radiobox{
        width: 16px;
        height: 16px;
        background: url(../../../static/img/wrong.png) no-repeat center center;
        background-size: contain;
    }
    .errlog_ans>div.wrongopt>i.mycheckbox{
        width: 16px;
        height: 16px;
        background:url(../../../static/img/wrong.png) no-repeat center center;
        background-size: contain;
    }
    .errlog_ans>div>span{
        display: inline-block;
        width:calc(100% - 22px);
        text-indent: 10px;
    }
    .errlog_ans>div>i,.errlog_ans>div.rightopt.wrongopt>i{
        display: inline-block;
        width: 22px;
        height: 16px;
        /* background: url(../../../static/img/noans.png) no-repeat center center; */
        background-size: contain;
        float: right;
    }
    /* .errlog_ans>div.rightopt,.errlog_ans>div.rightopt.wrongopt>i{
        width: 22px;
        height: 16px;
    } */
    .errlog_ans>div>i.mycheckbox{
        /* background: url(../../../static/img/checkbox.png) no-repeat center center; */
        background-size: contain;
    }
    .errlog_btns{
        margin-top: 20px;
    }
    .up,.down{
        float: right;
    }
    .down,.goback{
        margin-left: 40px;
        background:rgba(20,114,255,1);
    }
    
</style>