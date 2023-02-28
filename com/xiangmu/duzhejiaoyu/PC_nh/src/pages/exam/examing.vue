<template>
    <div>
        <div class="examing_ clearfix">
            <div class="examing_left">
                <h3>答题卡<span>共{{examdetail.questionList.length}}题，满分{{examdetail.score}}分</span></h3>
                <div class="examing_pro">
                    <h3>答题进度<span><i>{{num+1}}</i>/{{examdetail.questionList.length}}</span></h3>
                    <el-progress class="pro_" :percentage="percentage" :show-text="false"></el-progress>
                </div>
                <h4>单选题</h4>
                <ul class="examing_num clearfix">
                    <li @click="gonum(v.titlenum)" :class="{'answered':v.answer.length>0,'answering':parseInt(v.titlenum)==num+1}" v-for="(v,i) in examdetail.questionList" v-if="v.quesType=='1'" :key="i">{{v.titlenum}}</li>
                </ul>
                <h4 style="margin-top:20px;">多选题</h4>
                <ul class="examing_num clearfix">
                    <li @click="gonum(v.titlenum)" :class="{'answered':v.answer.length>0,'answering':parseInt(v.titlenum)==num+1}" v-for="(v,i) in examdetail.questionList" v-if="v.quesType=='2'" :key="i">{{v.titlenum}}</li>
                </ul>
                <h4 style="margin-top:20px;">判断题</h4>
                <ul class="examing_num clearfix">
                    <li @click="gonum(v.titlenum)" :class="{'answered':v.answer.length>0,'answering':parseInt(v.titlenum)==num+1}" v-for="(v,i) in examdetail.questionList" v-if="v.quesType=='3'" :key="i">{{v.titlenum}}</li>
                </ul>
            </div>
            <div class="examing_right">
                <div class="examing_right_">
                    <h3>{{examdetail.questionList[num].quesType=='1'?'单选题':examdetail.questionList[num].quesType=='2'?'多选题':'判断题'}}
                        <span class="singlenum">（{{examdetail.questionList[num].score}}分）</span> 
                        <span class="examing_time">
                            <i></i> 剩余时间&nbsp;
                            <em> {{formatexamtime.slice(0,1)}}{{formatexamtime.slice(1,2)}} : {{formatexamtime.slice(3,4)}}{{formatexamtime.slice(4,5)}} : {{formatexamtime.slice(6,7)}}{{formatexamtime.slice(7,8)}}</em>
                        </span>
                    </h3>
                    <h4>{{examdetail.questionList[num].titlenum}}. <span v-html="examdetail.questionList[num].quesTitle"></span>
                    </h4>
                    <div class="examing_titleimg" v-if="examdetail.questionList[num].fileUrl">
                        <img :preview="num" :src="domain+examdetail.questionList[num].fileUrl" alt="" width="auto" height="100%">
                    </div>
                    <div class="examing_ans">
                        <div :class="{'act':v.checked ,'selact':v.selected}" ref="opts" @click="sel_ans(examdetail.questionList[num],i)" v-for="(v,i) in optionArr" :key="i" >
                            <span>{{i=='0'?'A':i=='1'?'B':i=='2'?'C':i=='3'?'D':i=='4'?'E':i=='5'?'F':'G'}}. {{v.optionItem}}</span>
                            <i :class="{'radiobox':examdetail.questionList[num].quesType!='2' ,'mycheckbox':examdetail.questionList[num].quesType=='2'}"></i>
                        </div>
                    </div>
                    <div class="examing_explain" v-if="two=='3'&& !examdetail.questionList[num].showsinglesys" @click="analyze(examdetail.questionList[num])">查看分析</div>
                    <div class="examing_explain" v-if="examdetail.questionList[num].showsinglesys">
                        <p class="ansright" v-if="examdetail.questionList[num].result">回答正确</p>
                        <p class="answrong" v-else>回答错误</p>
                        <p>正确答案：<span class="rightans">{{examdetail.questionList[num].trueresult}}</span></p>
                        <p class="ansaya">{{examdetail.questionList[num].asys}}</p>
                    </div>
                </div>
                <div class="examing_btns">
                    <el-button type="primary" @click="submittext" class="goback">我要交卷</el-button>
                    <el-button type="primary" v-if="num != examdetail.questionList.length-1" class="down" @click="next">下一题</el-button>
                    <el-button class="up" v-if="num !=0" @click="up">上一题</el-button>
                </div>
            </div>
        </div>
        <!-- 弹窗 -->
        <!-- 交卷中 -->
        <div v-if="examing_show" class="meng">
            <div class="meng1_auto">
                <div class="examing_endingicon"></div>
                <p>交卷完成，成绩计算中…</p>
            </div>
        </div>
        <!-- 确认交卷弹窗 -->
        <div v-if="commitexam_show" class="meng">
            <div class="meng_auto">
                <h3><i class="meng_title"></i> 确认交卷？ <i class="meng_close el-icon-close" @click="closemeng"></i></h3>
                <p>一旦交卷后便不可再作答和修改答案，确定交卷吗？</p>
                <div class="btns">
                    <el-button @click="goonexam">继续作答</el-button>
                    <el-button type="primary" @click="submit_exam">确 定</el-button>
                </div>
            </div>
        </div>
        <!-- 考试提交弹窗 -->
        <div v-if="endexam_show" class="meng">
            <div class="meng_auto">
                <h3>
                    <i class="meng_title_s" :style="{background:'url(./static/img/'+endexam_icon+')',backgroundSize:'cover'}"></i> 
                    {{ispass?'恭喜通过考试！':'遗憾未通过考试'}} 
                    <i class="meng_close el-icon-close" @click="closemeng1"></i>
                </h3>
                <p>本次成绩为：<span :class="{'pass':ispass,'nopass':!ispass}">{{passscore}}分</span></p>
                <div class="btns">
                    <el-button @click="see_err" v-if="examdetail.two=='2'&& errlist.length>0">错题回顾</el-button>
                    <el-button type="primary" @click="goexam">确 定</el-button>
                </div>
            </div>
        </div>
        <!-- <el-dialog
            append-to-body
            :visible.sync="exit_show"
            width="30%"
            :before-close="handleClose">
            <span>确定退出考试吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exit_show = false">取 消</el-button>
                <el-button type="primary" @click="exit_exam">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    data() {
        return {
            examdetail:'',
            domain:'',
            testid:'',//当前考试的试卷id
            num:0,//现在做的题号
            subject:'',//当前的题目信息
            optionArr:[],//选项的数组
            finishshow:false,//交卷的弹窗
            minTime:'',//考试需要的最少时间
            myminTime:'',//自己已经考试的时间  秒数
            totalTime:'',//考试需要的总时长
            formatexamtime:'',//格式化的考试总时长
            timer:null,
            passscore:'',//交卷之后的分数
            ispass:false,//是否通过
            two:'',//1：一直到最后交卷   2 到最后交卷且有查看分析   3 每题都有分析
            errlist:[],//错题回顾列表
            showsinglesys:false,//显示单个的分析
            percentage:0,//答题的百分比
            commitexam_show:false,//确认交卷弹窗
            endexam_show:false,
            examing_show:false,
            endexam_icon:'',
            showerrlog:true,//显示错题回顾
            exit_show:false
        }
    },
    methods: {
        exit_exam(){
        },
        compare(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        //答题
        sel_ans(item,index){
            if(item.optionList[index].checked){
                item.optionList[index].checked = false
            }else if(item.optionList[index].selected){
                item.optionList[index].selected = false
            }
            else{
                if(item.quesType != '2'){//不是多选题
                    item.optionList.forEach(e => {
                        e.checked = false
                    });
                    item.optionList[index].checked = true;
                }else{
                    // item.optionList[index].checked = true;
                    item.optionList[index].selected = true;
                }
            }
            item.answer = [];
            item.optionList.forEach(e=>{
                if(e.checked||e.selected){
                    item.answer.push(e.id)
                }
            })
            this.$forceUpdate();
            var a = 0;
            this.examdetail.questionList.forEach(e=>{
                if(e.answer.length>0){
                    a++
                }
            })
            this.percentage = parseInt(a) /this.examdetail.questionList.length*100;
        },
        //下一题
        next(){
            this.num++;
            this.optionArr = this.examdetail.questionList[this.num].optionList;
        },
        //上一题
        up(){
            if(this.num==0){
                this.num=0
            }else{
                this.num--
            }
            this.optionArr = this.examdetail.questionList[this.num].optionList;
        },
        //跳转
        gonum(num){
            this.num = num-1;
            this.optionArr = this.examdetail.questionList[this.num].optionList;
        },
        //交卷
        submittext(){
            this.commitexam_show = true;
        },
        goonexam(){
            this.commitexam_show = false;
        },
        submit_exam(){
            this.commitexam_show = false;
            if(this.myminTime<this.minTime){
                this.$message({
                    message: '还未到交卷时间！',
                    type: 'warning'
                });
            }else{
                this.examing_show = true;
                var myanswer = [];
                this.examdetail.questionList.forEach(e=>{
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
                    this.examing_show = false;
                    this.endexam_show = true;
                    // this.finishshow = true;//打开弹窗
                    this.passscore = res.item.sumScore;
                    this.ispass = res.item.isPass;
                    if(this.ispass){
                       this.endexam_icon = 'passexam.png'
                    }else{
                       this.endexam_icon = 'nopassexam.png'

                    }
                    this.errlist = res.item.errorItem;
                    if(this.errlist.length<1){
                        this.showerrlog = false
                    }
                    clearInterval(this.timer)
                });
            }
        },
        examtime_(){
            this.timer = setInterval(()=>{
                if(this.totalTime==0){
                    this.$message.error('考试时间到！');
                    this.submit_exam();
                    clearInterval(this.timer);
                    return false;
                }
                this.totalTime--;
                this.myminTime++;
                this.formatexamtime = this.util.formatSeconds(this.totalTime);
            },1000)
        },
        closemeng(){
            this.commitexam_show = false
        },
        closemeng1(){
            this.endexam_show = false
        },
        //查看错题回顾
        see_err(){
            this.examdetail.questionList.forEach(e=>{
                this.errlist.forEach(v=>{
                    if(e.id==v.id){
                        v.titlenum = e.titlenum
                    }
                })
            })
            window.sessionStorage.setItem('errlog',JSON.stringify(this.errlist))
            this.$router.push('errlog');

        },
        //查看分析
        analyze(item){
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
                this.examdetail.questionList[this.num].showsinglesys = true;
                this.examdetail.questionList[this.num].asys = res.item.analy;
                this.examdetail.questionList[this.num].result = res.item.result;
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
                this.examdetail.questionList[this.num].trueresult = ans_num;
            });
        },
        goexam(){
            this.$router.push('exam');
        }

    },
    beforeDestroy () {
        clearInterval(this.timer);
        // if(window.location.href.indexOf('examing')==-1){

        // }else{

        // }
        
        
        // this.exit_show = true;
        // confirm(this.exit_show)
    },
    created () {
        this.examdetail = JSON.parse(window.sessionStorage.getItem('examdetail'));//试卷详情
        this.domain = window.location.protocol+'//'+window.location.host;
        this.examdetail.questionList.sort(this.compare('quesType'));
        this.examdetail.questionList.forEach((e,i)=>{
            e.titlenum = i+1;
            e.answer = []
            if(e.quesType=='3'){
                e.optionList = [{//判断题自己做选项，选项id就传0或者1
                    id:'0',
                    optionItem:'错误',
                    checked:false
                },{
                    id:'1',
                    optionItem:'正确',
                    checked:false
                }];
            }else{
                e.optionList.forEach(ee=>{
                    ee.checked = false;
                })
            }
        })
        this.two = this.examdetail.two;
        this.testid = this.examdetail.id;
        this.optionArr = this.examdetail.questionList[this.num].optionList;
        this.minTime = this.examdetail.minTime*60;
        this.totalTime = this.examdetail.needTime*60;//将接收到的分钟数转成秒数
        this.examtime_()
        
    }
}
</script>
<style scoped>
    .opt_act{
        background:rgba(243,245,249,.69);
        border:none;
        background:rgba(255,255,255,1);
        border-radius:5px;
        border:1px solid rgba(26,119,255,1);
    }
    .examing_explain{
        width: 100%;
        background:rgba(255,253,243,1);
        border-radius:5px;
        font-size:14px;
        font-weight:500;
        color:rgba(31,35,47,1);
        line-height:20px;
        padding: 20px;
        box-sizing: border-box;
    }
    .examing_explain>p{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin-top: 5px;
    }
    .examing_explain>p.ansright{
        color: green;
    }
    .examing_explain>p.answrong{
        color: red;
    }
    .meng{
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .7);
        top: 0;
        left: 0;
    }
    .meng_auto{
        width:443px;
        height:215px;
        background:rgba(255,255,255,1);
        border-radius:5px;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 30px;
        box-sizing: border-box;
    }
    .meng1_auto{
        width:383px;
        height:133px;
        background:rgba(255,255,255,1);
        border-radius:5px;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 30px;
        box-sizing: border-box;
    }
    .meng1_auto>p{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        text-align: center;
        margin-top: 10px;
    }
    .examing_endingicon{
        width:36px;
        height:36px;
        background:url(../../../static/img/waiting.png) no-repeat center center;
        background-size: cover;
        margin: 0 auto;
    }
    .meng_auto>h3{
        width:100%;
        height:25px;
        font-size:18px;
        font-weight:500;
        color:rgba(31,35,47,1);
        line-height:25px;
        text-indent: 6px;
    }
    .meng_auto>p{
        width:100%;
        height:40px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin-top: 20px;
        text-indent: 41px;
    }
    .meng_auto>p>span.pass{
        font-size:14px;
        font-weight:500;
        color:rgba(13,207,123,1);
    }
    .meng_auto>p>span.nopass{
        font-size:14px;
        font-weight:500;
        color:rgba(254,62,97,1);
    }
    .meng_title,.meng_title_s{
        display: inline-block;
        width:30px;
        height:26px;
        background:url(../../../static/img/commitexam.png) no-repeat center center;
        background-size: contain;
        float: left;
        margin-right: 5px;
    }
    .meng_title_s{
        background:url(../../../static/img/passexam.png) no-repeat center center;
        background-size: cover;
    }
    .meng_close{
        display: inline-block;
        width:14px;
        height:14px;
        float: right;
    }
    .meng_auto>.btns{
        width: 100%;
        position: absolute;
        bottom: 20px;
        left: 0;
        text-align: right;
        padding: 0 30px;
        box-sizing: border-box;
    }
    .examing_{
        width: 1100px;
        height: 100%;
        margin: 0 auto;
    }
    .examing_left{
        width:300px;
        background:rgba(255,255,255,1);
        /* box-shadow:0px 0px 10px 0px rgba(164,201,255,0.22); */
        border-radius:5px;
        float: left;
        padding: 20px;
        box-sizing: border-box;
        height: calc(100% - 20px);
        overflow: auto;
    }
    .examing_left>h4{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin: 5px 0;
    }
    .examing_left>h3,.examing_right_>h3{
        width:100%;
        font-size:22px;
        font-weight:550;
        color:rgba(31,35,47,1);
        line-height:50px;
        border-bottom: 1px solid #E8EBEF;
        padding-bottom: 10px;
        box-sizing: border-box;
    }
    .examing_left>h3>span{
        float: right;
        font-size:12px;
        font-weight:400;
        color:rgba(98,101,109,1);
    }
    .examing_pro{
        width:100%;
        margin-top: 20px;
        height:74px;
        background:rgba(205,225,255,.49);
        border-radius:5px;
        padding: 15px 20px;
        box-sizing: border-box;
    }
    .examing_pro>h3{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
    }
    .examing_pro>h3>span{
        font-size:12px;
        font-weight:400;
        color:rgba(98,101,109,1);
        float: right;
    }
    .examing_pro>h3>span>i{
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        font-style: normal;
    }
    .pro_{
        margin-top: 15px;
    }
    .examing_num>li{
        width:30px;
        height:30px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(216,218,219,1);
        border-radius:3px;
        float: left;
        margin: 5px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
    }
    .examing_num>li:first-of-type{
        margin-left: 0;
    }
    .examing_num>li.answered{
        background:rgba(26,119,255,1);
        color: #fff;
    }
    .examing_num>li.answering{
        background:rgba(205,225,255,1);
        border:1px solid rgba(26,119,255,1);
        color:rgba(26,119,255,1);
    }
    .examing_right{
        width:780px;
        background:rgba(255,255,255,1);
        /* box-shadow:0px 0px 10px 0px rgba(164,201,255,0.22); */
        border-radius:5px;
        float: right;
        padding: 20px;
        box-sizing: border-box;
        margin-left: 20px;
        height: calc(100% - 20px);
        position: relative;
    }
    .examing_right_{
        width: 100%;
        height: calc(100% - 40px);
        overflow: auto;
    }
    .singlenum{
        font-size:18px;
        font-weight:400;
        color:rgba(98,101,109,1);
    }
    .examing_time{
        float: right;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
    }
    .examing_time>i{
        display: inline-block;
        width:20px;
        height:20px;
        background:url(../../../static/img/exam_time.png) no-repeat center center;
        background-size: cover;
        float: left;
        margin-top: 15px;
        margin-right: 5px;
    }
    .examing_time>em{
        color:rgba(26,119,255,1);
        font-size:18px;
        font-weight:500;
    }
    .examing_right_>h4{
        width:100%;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        margin-top: 20px;
    }
    .examing_titleimg{
        width:348px;
        height:204px;
        margin-top: 20px;
    }
    .examing_ans{
        margin-top: 20px;
    }
    .examing_ans>div{
        width: 100%;
        /* background:rgba(243,245,249,.69); */
        border-radius:5px;
        padding: 13px 20px 13px 0;
        box-sizing: border-box;
        margin: 20px 0;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        border:1px solid rgba(232,235,239,1);
        line-height:20px;
    }
    .examing_ans>div.act,.examing_ans>div.selact{
        background:rgba(255,255,255,1);
        border-radius:5px;
        border:1px solid rgba(26,119,255,1);
    }
    .examing_ans>div.selact>i.mycheckbox{
        background:url(../../../static/img/checkboxed.png) no-repeat center center;
        background-size: contain;
    }
    .examing_ans>div.act>i.radiobox{
        background: url(../../../static/img/yesans.png) no-repeat center center;
        background-size: contain;
    }
    .examing_ans>div>span{
        display: inline-block;
        width:calc(100% - 40px);
    }
    .examing_ans>div>i{
        display: inline-block;
        width: 40px;
        height: 18px;
        float: left;
    }
    .examing_ans>div>i.radiobox{
        background: url(../../../static/img/noans.png) no-repeat center center;
        background-size: contain;
    }
     .examing_ans>div>i.mycheckbox{
        background: url(../../../static/img/checkbox.png) no-repeat center center;
        background-size: contain;
    }
    .examing_btns{
        width:100%;
        height:84px;
        background:rgba(255,255,255,1);
        box-shadow:0px -2px 5px 0px rgba(191,197,216,0.1);
        border-radius:0px 0px 5px 5px;
        position: absolute;
        margin-top: 40px;
        bottom:0;
        left:0;
        padding:20px;
        box-sizing: border-box;
    }
    .up,.down{
        float: right;
    }
    .down,.goback{
        background:rgba(20,114,255,1);
    }
</style>