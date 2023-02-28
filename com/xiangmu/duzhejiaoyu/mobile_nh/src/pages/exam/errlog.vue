<template>
    <div class="err_content">
        <div class="err_auto">
            <div class="err_card">
                <div class="err_time">
                    错题回顾
                </div>
                <div class="err_text">
                    <div class="errtext_top">
                        <!-- quesType 1  单选   2  多选   3 判断 -->
                        <span class="qus_type">{{errlogDetails1[num].quesType=='1'?'单选题':errlogDetails1[num].quesType=='2'?'多选题':'判断题'}}</span><span class="qus_num">答错{{errlogDetails1.length}}题</span>
                        <i @click="seeerrcard">答题卡</i>
                    </div>
                    <div class="err_img" v-if="errlogDetails1[num].fileUrl">
                        <img :preview="num" :src="domain+errlogDetails1[num].fileUrl" alt="" width="auto" height="100%">
                    </div>
                    <div class="err_title" >{{errlogDetails1[num].titlenum}}. <span v-html="errlogDetails1[num].quesTitle"></span> </div>
                    <div class="err_ans">
                        <div v-for="(item,j) in errlogDetails1[num].options" :key="j">{{j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':j=='5'?'F':'G'}}. {{item.optionItem}}</div>
                    </div>
                    <div class="errany">
                        <p class="my_ans">我的答案：{{errlogDetails1[num].myoption?errlogDetails1[num].myoption:'未作答'}}</p>
                        <p class="right_ans">正确答案：{{errlogDetails1[num].trueoption}}</p>
                        <p>{{errlogDetails1[num].quesAnaly}}</p>
                    </div>
                    
                </div>
            </div>
            <div class="err_bottom">
                <span class="err_up" v-if="num !=0" @click="up">上一题</span>
                <span class="err_down" v-if="num != errlogDetails1.length-1" @click="next">下一题</span>
            </div>
        </div>
        <!-- 点击答题卡的弹窗 -->
        <div class="errqusnums" ref="qusnums_meng" v-if="errcardshow" @click="close_errqusnumsmeng">
            <div class="errqusnums_">
                <div class="errqusnum_top">
                    <span class="errrighttype"><i></i><em>错误</em></span>
                    <span><i></i><em>正确</em></span>
                </div>
                <ul class="errqusnum_bottom">
                    <!-- <li class="errqusnum_wrong">1</li> -->
                    <li class="errqusnum_wrong" v-for="(v,i) in errlogDetails1" :key="i" @click="goerrnum(v.titlenum)">{{v.titlenum}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    // props:{
    //     errlogDetails:String,
    // },
    data() {
        return {
            errlogDetails1:[],
            questionList1:[],
            num:0,//当前的错题回顾
            errcardshow:false,//错题回顾答题卡
            domain:'',
            myanswer:[],//我的选择
        }
    },
    methods: {
        // 答题卡弹窗
        seeerrcard(){
            this.errcardshow = true;
        },
        //弹窗中的题目
        goerrnum(num){
            this.errlogDetails1.forEach((e,i)=>{
                if(e.titlenum==num){
                    this.num = i
                }
            })
            this.errcardshow = false;
        },
        //关闭答题卡
        close_errqusnumsmeng(e){
            var isshow = e.path.some(e=>{
                if(e.className=='errqusnums_'){
                    return true
                }
            })
            if(!isshow){
                this.errcardshow = false;
            }
        },
         //下一题
        next(){
            this.num++
        },
        // 上一题
        up(){
            if(this.num==0){
                this.num=0
            }else{
                this.num--
            }
        },
        //把错题回顾跟所有问题对比，确定哪题错
        initlist(){
            // this.errlogDetails1 = JSON.parse(this.errlogDetails);
            this.errlogDetails1 = window.sessionStorage.getItem('errlogDetails')? JSON.parse(window.sessionStorage.getItem('errlogDetails')):[];
            this.errlogDetails1.forEach(e=>{
                e.myoption = '';
                e.trueoption = '';
                if(e.quesType == 2){//不是判断题
                    e.options.forEach((o,j)=>{
                        if(e.trueIds.indexOf(o.id) != -1){
                            var ans = (j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':j=='5'?'F':'G');
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
                            var ans = (j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':j=='5'?'F':'G');
                            e.trueoption = e.trueoption +' ' +  ans
                        }
                        if(e.chooseIds.indexOf(o.id) != -1){
                            e.myoption=(j=='0'?'A':j=='1'?'B':j=='2'?'C':j=='3'?'D':j=='4'?'E':j=='5'?'F':'G');
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
                    }else{
                        e.myoption=(e.chooseIds==0?"A":"B")
                    }
                    if(e.isTrue==0){//表示答案是  错误
                        e.trueoption = 'A'
                    }else{
                        e.trueoption = 'B'
                    }
                }
            })
        },

        
    },
    created () {
        this.domain = window.location.protocol+'//'+window.location.host;
        this.initlist();
    }
}
</script>
<style>
.err_content{
    width:100%;
    height: 100%;
    position: fixed;
    background: url(../../../static/img/moniback.png) no-repeat center center;
    background-size: cover;

}
.err_auto{
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
.err_card{
    height: calc(100% - 4rem);
    position: relative;
    min-width: 90%;
    margin-left: 5%;
    border-radius: 0.25rem;
    overflow: hidden;
    position: relative;
}
.err_text{
    width: 100%;
    height: calc(100% - 1.75rem);
    background: #fff;
    position: absolute;
    bottom: 0;
    padding: .75rem;
    box-sizing: border-box;
    overflow: scroll;
}
.errtext_top{
    width: 100%;
}
.errtext_top>.qus_type{
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
.errtext_top>.qus_num{
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin-left: .5rem;
}
.errtext_top>.qus_num>em{
    font-size: 1rem;
}
.errtext_top>i{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    float: right;
    font-style: normal;
}
.err_time{
    width: 35%;
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
    font-size:0.6rem;
    font-weight:400;
    color:rgba(135,104,0,1);
    text-align: center;
}
.err_time>i{
    font-style: normal;
    display: inline-block;
    width:0.6rem;
    height:1rem;
    background:rgba(255,245,102,1);
    border-radius:0.08rem;
    margin: 0 .05rem;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(97,71,0,1);
    line-height:1rem;
    text-align: center;
}
.err_img{
    width: 100%;
    height: 6.5rem;
    background: red;
    margin-top: .5rem;
}
.err_title{
    width:100%;
    /* height:3.15rem; */
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    text-align: justify;
    margin-top: .5rem;
}
.err_ans{
    width: 100%;
}
.err_ans>div{
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
.err_ans>div.myans{
    background:rgba(111,132,249,1);
    color: #fff;
}
.err_bottom{
    width: 100%;
    height: 2.5rem;
    padding: .75rem;
    box-sizing: border-box;
    position: absolute;
    bottom: 1.5rem;
    text-align: center;
}
.err_bottom>.err_up,.err_bottom>.err_down{
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
.err_bottom>.err_mid{
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
.errqusnums{
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
}
.errqusnums_{
    width: 100%;
    height: 60%;
    background: #fff;
    position: absolute;
    bottom: 0;
    padding: 1rem;
    box-sizing: border-box;
}
.errqusnum_top{
    width: 100%;
    height: 2rem;
    border-bottom: 1px solid #DBDBDB;
}
.errqusnum_top>span{
    display: inline-block;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    float: right;
}
.errqusnum_top>span>i{
    display: inline-block;
    width:0.8rem;
    height:0.8rem;
    border:0.03rem solid rgba(151,151,151,1);
    border-radius: 50%;
    float: left;
}
.errqusnum_top>span.errrighttype>i{
    background:rgba(245,34,45,1);
    border: none;
}
.errqusnum_top>span>em{
    float: right;
    margin-left: .25rem;
}
.errrighttype{
    margin-left: 1rem;
}
.errqusnum_bottom{
    width: 100%;
    height: calc(100% - 3rem);
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: scroll;
}
.errqusnum_bottom>li{
    width:2rem;
    height:2rem;
    border:0.03rem solid rgba(175,175,175,1);
    margin: .5rem;
    border-radius: 50%;
    text-align: center;
    line-height: 2rem;
}
.errqusnum_bottom>li.errqusnum_wrong{
    background:rgba(245,34,45,1);
    border: none;
    color: #fff;
}
.erranalyze{
    width: 100%;
    border-top: 1px solid rgba(219,219,219,.7);
    font-size: 12px;
    margin-top: .5rem;
    padding-top: .2rem;
    box-sizing: border-box;
    color: #6F84F9;
}
.erranalyze_{
    font-size: 12px;
    margin-top: .5rem;
    width: 100%;
    text-align: justify;
}
.errany{
    width:100%;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.errany>p{
    margin: .5rem 0;
    text-align: justify;
}
.errany>p.my_ans{
    color: red;
}
.errany>p.right_ans{
    color: green;
}
</style>