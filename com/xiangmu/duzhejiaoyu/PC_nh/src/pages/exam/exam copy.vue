<template>
    <div>
        <div class="exam_content_" v-if="exam_length>0">
            <div class="exam_content_img"></div>
            <div class="pt_exam"><i></i>普通考试</div>
            <div class="pt_exam_ clearfix" ref="pt_exam_1" v-for="(v,i) in exam_pt" :key="v.id" @mouseover="in_exam(i)" @mouseout="out_exam(i)">
                <div class="pt_eaxm_left">
                    <h3>{{v.name}}</h3>
                    <p class="pt_exam_time"><i></i>考试时间：{{v.validStart}} ～ {{v.validEnd}}</p>
                    <p><span>总分：{{v.score}}分</span><span>题数：{{v.questionList.length}}题</span><span>答题时间：{{v.needTime}}分钟</span><span>合格分数线：{{v.passScore}}分</span></p>
                </div>
                <div class="pt_eaxm_right">
                    <span @click="goexam(v)">开始考试</span>
                </div>
            </div>
            <div class="line"></div>
            <div class="moni_exam"><i></i>模拟考试</div>
            <div class="pt_exam_ clearfix" ref="pt_exam_2" v-for="(v,i) in exam_mn" :key="v.id" @mouseover="in_exam2(i)" @mouseout="out_exam2(i)">
                <div class="pt_eaxm_left">
                    <h3>{{v.name}}</h3>
                    <p class="pt_exam_time"><i></i>考试时间：{{v.validStart}} ～ {{v.validEnd}}</p>
                    <p><span>总分：{{v.score}}分</span><span>题数：{{v.questionList.length}}</span><span>答题时间：{{v.needTime}}分钟</span><span>合格分数线：{{v.passScore}}分</span></p>
                </div>
                <div class="pt_eaxm_right" >
                    <span @click="goexam(v)">开始考试</span>
                </div>
            </div>
            <div class="line"></div>
            <div class="cg_exam"><i></i>闯关考试</div>
            <div class="pt_exam_ clearfix" ref="pt_exam_3" v-for="(v,i) in exam_cg" :key="v.id" @mouseover="in_exam3(i)" @mouseout="out_exam3(i)">
                <div class="pt_eaxm_left">
                    <h3>{{v.name}}</h3>
                    <p class="pt_exam_time"><i></i>考试时间：{{v.validStart}} ～ {{v.validEnd}}</p>
                    <p><span>共 {{v.score}} 关</span><span>超过 {{v.passScore}} 关即视为通过考试， 且不限考试次数。</span></p>
                </div>
                <div class="pt_eaxm_right" >
                    <span @click="gofight(v)">开始闯关</span>
                </div>
            </div>
        </div>
        <div class="exam_content_" v-else>
            <div class="exam_content_img"></div>
            <p class="exam_end">恭喜完成考试，图书馆借书证已被激活！</p>
            <div class="exam_end_img">
                <div class="loading" v-if="showloading">
                    数据加载中...
                </div>
                <div class="exam_end_img_" v-else>
                    <h3>{{personinfo.name}}</h3>
                    <p>图书馆借书证已激活</p>
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
            exam_pt:[],
            exam_mn:[],
            exam_cg:[],
            exam_length:1,
            personinfo:'',
            showloading:true,
            studytime:0,
            showbtn:false
        }
    },
    methods: {
        // 试卷列表
        examLists(){
            //调个人信息接口，判断是否已经激活图书证
            this.util.postAjax({
                code:code.base,
                url:code.personindexinfo,
            }).then(res => {
                this.showloading = false;
                if(res.item.readerFlag=='1'){//激活
                    this.exam_length = 0;
                    this.personinfo = res.item
                }else{
                    //获取考试的试题的套数
                    this.util.postAjax({
                        code:code.base,
                        url:code.getExam,
                        data:{campusId:res.item.campusId,userType:res.item.readerType}//campusId 校区ID ,userType 读者类型
                        // data:{campusId:'e792c4d5bb0049c29d6d13e94f5b8879',userType:'04'}//campusId 校区ID ,userType 读者类型
                    }).then(res => {
                        if(res.success){
                            if(res.items){
                                this.exam_pt = [];
                                this.exam_mn = [];
                                this.exam_cg = [];
                                //根据试卷的类型，改变背景色
                                res.items.forEach(element => {
                                    if(element.testType==1){//testType 1.普通考试 2.模拟考试 3.闯关考试  4.开卷考试
                                        this.exam_pt.push(element)
                                    }else if(element.testType==2){
                                        this.exam_mn.push(element)
                                    }else{
                                        this.exam_cg.push(element)
                                    }
                                });
                                this.exam_length = res.items.length;
                            }
                        }
                    });
                }
            });
        },
        //鼠标事件
        in_exam(i){
            this.$refs.pt_exam_1[i].setAttribute('class','pt_exam_ exam_bac')
        },
        out_exam(i){
            this.$refs.pt_exam_1[i].setAttribute('class','pt_exam_')
        },
        in_exam2(i){
            this.$refs.pt_exam_2[i].setAttribute('class','pt_exam_ exam_bac')
        },
        out_exam2(i){
            this.$refs.pt_exam_2[i].setAttribute('class','pt_exam_')
        },
        in_exam3(i){
            this.$refs.pt_exam_3[i].setAttribute('class','pt_exam_ exam_bac')
        },
        out_exam3(i){
            this.$refs.pt_exam_3[i].setAttribute('class','pt_exam_')
        },
        //去考试
        goexam(obj){
            if(obj.needstudytime){
                if(obj.needstudytime>this.studytime){
                    this.$message({
                        message: '请先学习后再考试',
                        type: 'warning'
                    });
                    return
                }
            }
            var endtime = obj.validEnd.replace(/-/g,'/');
            if(new Date(obj.validStart.replace(/-/g,'/')).getTime()>new Date().getTime()){
                this.$message({
                    message: '未到考试开始时间',
                    type: 'warning'
                });
                return;
            }else if((new Date(endtime).getTime()+24*60*60*1000)< new Date().getTime()){
                this.$message({
                    message: '考试已经结束',
                    type: 'warning'
                });
                return;
            }else{
                //two:2 有错题回顾   3 一题一题分析
                //testType  考试形式：1.普通考试 2.模拟考试   3.闯关考试  4.开卷考试
                if(obj.testType==1){
                    if(obj.resultType==1){
                        obj.two = '1';
                    }else{//一直到最后才会有分析
                        obj.two = '2'
                    }
                }else if(obj.testType==2){
                    if(obj.resultType==1){
                        obj.two = '1'
                    }else if(obj.resultType==2){
                        obj.two = '2'
                    }else{
                        obj.two = '3'
                    }
                }
            }
            obj.questionList.sort((a,b)=>{
                if (a.quesType =='1') {
                    return -1;
                } else if (a.quesType =='2') {
                    return 0;
                } else {
                    return 1;
                }
            })
            window.sessionStorage.setItem('examdetail',JSON.stringify(obj));
            this.$router.push('examing')
        },
        gofight(obj){
            if(obj.needstudytime){
                if(obj.needstudytime>this.studytime){
                    this.Toast('请先学习后再考试');
                    return
                }
            }
            var endtime = obj.validEnd.replace(/-/g,'/');
            if(new Date(obj.validStart.replace(/-/g,'/')).getTime()>new Date().getTime()){
                this.$message({
                    message: '未到考试开始时间',
                    type: 'warning'
                });
                return;
            }else if((new Date(endtime).getTime()+24*60*60*1000)< new Date().getTime()){
                this.$message({
                    message: '考试已经结束',
                    type: 'warning'
                });
                return;
            }else{
                window.sessionStorage.setItem('fightdetail',JSON.stringify(obj));
                this.$router.push('fightexaming')
            }
            
        },
        //考试时间查询
        lrecordqueryUserRecord(){
            this.util.postAjax({
                code:code.base,
                url:code.lrecordqueryUserRecord,
            }).then(res => {
                this.studytime = res.studytime
            });
        }
    },
    created () {
        this.lrecordqueryUserRecord();
        this.examLists()
    }
}
</script>
<style scoped>
.line{
    border: .5px solid #D5D6D6;
    margin-top: 30px;
}
.exam_end{
    width:100%;
    height:25px;
    font-size:18px;
    font-weight:500;
    color:rgba(0,176,155,1);
    line-height:25px;
    letter-spacing:1px;
    margin: 40px 0 20px 0;
}
.exam_end_img{
    width: 100%;
    height: calc(100% - 340px);
    background: url(../../../static/img/exam_endback.png) no-repeat center center;
    background-size: cover;
    position: relative;
}
.loading{
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    color: #000;
}
.exam_end_img_{
    width:509px;
    height:263px;
    position: absolute;
    margin: auto;
    background: url(../../../static/img/exam_card.png) no-repeat center center;
    background-size: cover;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 50px;
    box-sizing: border-box;
}
.exam_end_img_>h3{
    width:100%;
    height:40px;
    font-size:28px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:40px;
}
.exam_end_img_>p{
    width:100%;
    height:33px;
    font-size:24px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:33px;
    letter-spacing:1px;
    margin-top: 30px;
}
.exam_content_{
    width: 1100px;
    height: 100%;
    background: #fff;
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 40px;
    box-sizing: border-box;
    overflow: auto;
}
.exam_content_img{
    width: 100%;
    height:232px;
    background:url(../../../static/img/exam.png) no-repeat center center;
    background-size: cover;
}
.pt_exam,.moni_exam,.cg_exam{
    width:100%;
    height:22px;
    font-size:16px;
    font-weight:500;
    color:rgba(19,20,21,1);
    line-height:22px;
    margin-top: 40px;
}
.pt_exam>i,.moni_exam>i,.cg_exam>i{
    display: inline-block;
    width:22px;
    height:22px;
    background:url(../../../static/img/putong.png) no-repeat center center;
    background-size: cover;
    float: left;
    margin-right: 10px;
}
.moni_exam>i{
    background:url(../../../static/img/moni.png) no-repeat center center;
    background-size: cover;
}
.cg_exam>i{
    background:url(../../../static/img/fight.png) no-repeat center center;
    background-size: cover;
}
.pt_exam_{
    width:100%;
    height:130px;
    background:rgba(255,255,255,1);
    border-radius:5px;
    border:1px solid rgba(216,218,219,1);
    margin-top: 20px;
}
.pt_exam_.exam_bac{
    background:rgba(205,225,255,0.4);
    box-shadow:0px 0px 10px 0px rgba(221,231,240,1);
    border:1px solid rgba(26,119,255,1);
}
.pt_exam_>div{
    float: left;
}
.pt_eaxm_left{
    width: calc(100% - 213px);
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
}
.pt_eaxm_left>h3{
    width:100%;
    height:25px;
    font-size:18px;
    font-weight:500;
    color:rgba(31,35,47,1);
    line-height:25px;
    letter-spacing:1px;
}
.pt_eaxm_left>p{
    width:100%;
    height:20px;
    font-size:14px;
    font-weight:400;
    color:rgba(98,101,109,1);
    line-height:20px;
    letter-spacing:1px;
}
.pt_eaxm_left>p>span{
    margin: 0 30px;
}
.pt_eaxm_left>p>span:first-of-type{
    margin: 0;
}
.pt_eaxm_left>p.pt_exam_time{
    width:100%;
    height:20px;
    font-size:14px;
    font-weight:400;
    color:rgba(31,35,47,1);
    line-height:20px;
    letter-spacing:1px;
    margin: 10px 0;
}
.pt_exam_time>i{
    display: inline-block;
    width:20px;
    height:20px;
    background:url(../../../static/img/exam_time.png) no-repeat center center;
    background-size: cover;
    float: left;
    margin-right: 12px;
}
.pt_eaxm_right{
    width: 213px;
    height: 100%;
    position: relative;
}
.pt_eaxm_right>span{
    display: inline-block;
    width:133px;
    height:40px;
    background:rgba(20,114,255,1);
    border-radius:5px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    cursor: pointer;
}
</style>