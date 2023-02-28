<template>
    <div>
        <div class="examing_ clearfix">
            <div class="examing_left">
                <h3>共{{fightexamdetail.levelList.length}}关 <span>超过 {{fightexamdetail.passScore}} 关即视为通过考试</span> </h3>
                <div class="examing_pro">
                    <h3>闯关进度<span><i>{{opennum+1}}</i>/{{fightexamdetail.levelList.length}}</span></h3>
                    <el-progress class="pro_" :percentage="percentage" :show-text="false"></el-progress>
                </div>
                <ul class="examing_num clearfix">
                    <li :class="{'fighting':i<=opennum,'fighting_old':i<opennum}" v-for="(v,i) in fightexamdetail.levelList" @click="gofightexaming(i)" :key="i">{{v.levelNum}}</li>
                </ul>
            </div>
            <div class="examing_right">
                <div class="examing_right_">
                    <h3>{{questList[num].quesType=='1'?'单选题':questList[num].quesType=='2'?'多选题':'判断题'}}
                        <span class="examing_time"><i></i> 剩余时间&nbsp;
                        <em> {{formatexamtime.slice(0,1)}}{{formatexamtime.slice(1,2)}} : {{formatexamtime.slice(3,4)}}{{formatexamtime.slice(4,5)}} : {{formatexamtime.slice(6,7)}}{{formatexamtime.slice(7,8)}}</em>
                        </span>
                    </h3>
                    <h4> <span v-html="questList[num].quesTitle"></span>
                    </h4>
                    <div class="examing_titleimg" v-if="questList[num].fileUrl">
                        <img :preview="num" :src="domain+questList[num].fileUrl" alt="" width="auto" height="100%">
                    </div>
                    <div class="examing_ans">
                        <div :class="{'act':v.checked ,'selact':v.selected,'err':v.is_error,'right':v.is_right}" ref="opts" v-for="(v,i) in optionArr" @click="myfight(questList[num],v,i)" :key="i" >
                            <span>{{i=='0'?'A':i=='1'?'B':i=='2'?'C':i=='3'?'D':i=='4'?'E':i=='5'?'F':'G'}}. {{v.optionItem}}</span>
                            <i :class="{'radiobox':questList[num].quesType!='2' ,'mycheckbox':questList[num].quesType=='2'}"></i>
                        </div>
                    </div>
                </div>
                <!-- <div class="examing_btns">
                    <el-button type="primary" v-if="num != fightexamdetail.levelList.length-1" class="down" @click="next">下一题</el-button>
                    <el-button class="up" v-if="num !=0" @click="up">上一题</el-button>
                </div> -->
            </div>
            <!-- <div class="examing_right" v-else>
                <p>请点击考试关卡开始闯关考试</p>
            </div> -->
        </div>
        <!-- 闯关提交弹窗 -->
        <div v-if="fightexamingerr_show" class="meng">
            <div class="meng_auto">
                <h3>
                    <i class="meng_title_s" :style="{background:'url(./static/img/nopassexam.png)',backgroundSize:'cover'}"></i> 
                    很遗憾，闯关失败
                    <i class="meng_close el-icon-close"></i>
                </h3>
                <div class="btns">
                    <el-button @click="re_fight">重新开始</el-button>
                    <el-button type="primary" @click="exitfight">退出闯关</el-button>
                </div>
            </div>
        </div>
        <div v-if="fightexamingsucc_show" class="meng">
            <div class="meng_auto">
                <h3 v-if="!active">
                    <i class="meng_title_s" :style="{background:'url(./static/img/passexam.png)',backgroundSize:'cover'}"></i> 
                    恭喜！本关闯关成功
                    <p>未激活图书证，请继续闯关</p>
                </h3>
                 <h3 v-else>
                    <i class="meng_title_s" :style="{background:'url(./static/img/passexam.png)',backgroundSize:'cover'}"></i> 
                    闯关成功 
                    <p>图书证已激活</p>
                </h3>
                <div class="btns">
                    <el-button v-if="!active" @click="goon_fight">下一关</el-button>
                    <el-button v-else @click="goon_fight1">确定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    data() {
        return {
            fightexamdetail:'',
            opennum:0,
            num:0,//现在做的题号
            percentage:0,//答题的百分比
            fightingshow:false,//是不是开始考试
            fightques:'',
            questList:[],//当前的闯关的题目数组
            fighttimer:null,
            fighttime:0,//闯关计时
            totalTime:'',//考试需要的总时长
            time:0,//本题需要的最大答题时间
            formatexamtime:'',//格式化的考试总时长
            optionArr:[],//选项的数组
            fightexamingerr_show:false,//挑战失败
            fightexamingsucc_show:false,//闯关成功
            fightexamingpause_show:false,//暂停
            fightexamingtime_show:false,//时间到弹窗
            active:false,//是否激活图书证
            domain:''
        }
    },
    methods: {
        //全部考完获取考试成绩
        getfightresult(){
            this.util.postAjax({
                code:code.base,
                url:code.fightliststate,
                data:{qresId:this.fightexamdetail.id}
            }).then(res => {
                if(res.item.passLevel||res.item.passLevel==0){
                    if(res.item.passLevel==1){//表示当前的关卡已经通过
                        this.opennum = res.item.level;
                    }else{
                        this.opennum = res.item.level-1;
                    }
                }else{
                    this.opennum = 0
                }
                this.percentage = parseInt(this.opennum+1) /this.fightexamdetail.levelList.length*100;
                this.gofightexaming(this.opennum)
            });
        },
        gofightexaming(i){
            this.num = 0;
            // if(i>this.opennum){
            //     return
            // }
            if(this.fightingshow){
                return
            }
            this.fightingshow = true
            this.fightques = this.fightexamdetail.levelList[i];
            this.questList = this.fightques.questList;
            this.questList.forEach(e=>{
                e.titlenum = i + 1;
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
            this.optionArr = this.questList[this.num].optionList;
            this.timedown();
        },
        //答题
        myfight(qus,option,index){
            var questArr = [];
            questArr.push({
                "questId":option.questId,//题目ID
                "optionIds":option.id,//学生选择
                "score":qus.score//该题目分数
            });
            //本题定时器暂停
            clearInterval(this.timer);
            //开启新的定时器
            this.time = parseInt(this.fightques.needTime*60/this.questList.length);
            this.formatexamtime = this.util.formatSeconds(this.time)
            this.fighttimer = setInterval(() => {
                this.fighttime ++;
            }, 1000);
            this.timer = setInterval(()=>{
                if(this.time==0){
                    this.$message({
                        message: '闯关时间到！',
                        type: 'warning'
                    });
                    this.fightexamingerr_show = true;
                    clearInterval(this.timer);
                    clearInterval(this.fighttimer);
                    return false;
                }
                this.time--;
                this.formatexamtime = this.util.formatSeconds(this.time);
                console.log(this.time)
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
                            data:{levelId:this.fightques.id,questList:JSON.stringify(questArr)}
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
                        // console.log(this.questList[this.num])
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
                        }
                        this.optionArr = this.questList[this.num].optionList;//每题题目的选项，选项id
                        this.optionArr.forEach(e=>{
                            e.is_error= false;
                            e.is_right = false;
                        })
                    }
                }else{//答错的就直接调取最后的接口
                    option.is_error=true
                    this.util.postAjax({
                        code:code.base,
                        url:code.checkfight,
                        data:{levelId:this.fightques.id,questList:JSON.stringify(questArr)}
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
        //重现开始
        re_fight(){
            this.num = 0;
            this.optionArr = this.questList[this.num].optionList;
            this.optionArr.forEach(e=>{
                e.is_error= false;
                e.is_right = false;
            })
            this.fightexamingtime_show = false;
            this.fightexamingpause_show = false;
            this.fightexamingerr_show = false;
            this.timedown()
        },
        goon_fight(){
            this.fightexamingsucc_show = false;
            this.fightingshow = false;
            this.getfightresult()
        },
        goon_fight1(){
            this.$router.push('exam')
        },
         //退出
        exitfight(){
            this.fightingshow = false;
            this.fightexamingtime_show = false;
            this.fightexamingpause_show = false;
            this.fightexamingerr_show = false;
            this.$router.push('exam')
        },
         //倒计时
        timedown(){
            this.time = parseInt(this.fightques.needTime*60/this.questList.length);
            this.formatexamtime = this.util.formatSeconds(this.time)
            this.fighttimer = setInterval(() => {
                this.fighttime ++;
            }, 1000);
            this.timer = setInterval(()=>{
                if(this.time==0){
                    this.$message({
                        message: '闯关时间到！',
                        type: 'warning'
                    });
                    this.fightexamingerr_show = true;
                    clearInterval(this.timer);
                    clearInterval(this.fighttimer);
                    return false;
                }
                this.time--;
                this.formatexamtime = this.util.formatSeconds(this.time);
            },1000)
        },

    },
    beforeDestroy () {
        clearInterval(this.fighttimer);
        clearInterval( this.timer );
    },
    created () {
        this.domain = window.location.protocol+'//'+window.location.host;
        this.fightexamdetail = JSON.parse(window.sessionStorage.getItem('fightdetail'));//试卷详情
        this.fightques = this.fightexamdetail.levelList[this.num];
        this.questList = this.fightques.questList;
        this.getfightresult()
        // this.testid = this.examdetail.id;
        // this.optionArr = this.examdetail.questionList[this.num].optionList;
        // this.minTime = this.examdetail.minTime*60;
        // this.totalTime = this.examdetail.needTime*60;//将接收到的分钟数转成秒数
        // this.examtime_()
        
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
    .meng_auto>h3>p{
        font-size:16px;
        font-weight:400;
        margin-top: 20px;
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
    .examing_num{
        margin-top: 20px;
    }
    .examing_num>li{
        width:60px;
        height:60px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(216,218,219,1);
        border-radius:3px;
        float: left;
        margin: 5px;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
        border-radius: 50%;
    }
    .examing_num>li.fighting{
        background:rgba(205,225,255,1);
        border:1px solid rgba(26,119,255,1);
    }
    .examing_num>li.fighting.fighting_old{
        background: rgba(26,119,255,1);
        color: #fff;
        border: none;
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
    .examing_right>p{
        width:100%;
        height: 50px;
        font-size:22px;
        font-weight:550;
        color:rgba(31,35,47,1);
        line-height:50px;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        text-align: center;
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
    .examing_ans>div.err{
        border: 1px solid #FE3E61;
    }
    .examing_ans>div.right{
        border: 1px solid #0DCF7B;
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
        background:rgba(20,114,255,1) ;
    }
</style>