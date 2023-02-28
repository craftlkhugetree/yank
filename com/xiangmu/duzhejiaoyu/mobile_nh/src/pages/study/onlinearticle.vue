<template>
    <div class="doc_content">
        <h3 class="doctitle">{{docDetail1.name}}</h3>
        <p class="doctitle_d">
            <!-- <span class="doctime">{{docDetail1.createTime}}</span> -->
            <span class="docnum">{{docDetail1.watchCount}}次阅读</span>
            <span class="yellow_title">已学 
                <i v-for="v in formatonlineTimeH">{{v}}</i>
                :
                <i v-for="v in formatonlineTimeM">{{v}}</i>
                :
                <i v-for="v in formatonlineTimeS">{{v}}</i>
                <!-- <i>{{formatonlineTime.slice(0,1)}}</i><i>{{formatonlineTime.slice(1,2)}}</i>:<i>{{formatonlineTime.slice(3,4)}}</i><i>{{formatonlineTime.slice(4,5)}}</i>:<i>{{formatonlineTime.slice(6,7)}}</i><i>{{formatonlineTime.slice(7,8)}}</i> -->
            </span>
        </p>
        <!-- <div class="doc_img"></div> -->
        <!-- <p class="doc_context">2019年10月26日，“不忘初心 牢记使命——纪念李大钊先生诞辰130周年文献展”在图书馆一层中厅开展。本次展览将李大钊先生诞辰130周年纪念活动与“不忘初心，牢记使命”主题教育相结合，展期至11月15日。</p> -->
        <p class="doc_context">{{docDetail1.description}}</p>
        <p v-html="docDetail1.dhtml"></p>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    props:{
        ended:Boolean
    },
    data () {
        return {
            timer:null,
            formatonlineTime:'',//页面中的计时
            formatonlineTimeH:'',
            formatonlineTimeM:'',
            formatonlineTimeS:'',
            singletime:0,//刚进来恢复0,用于计时2分钟的
            docDetail1:''
        }
    },
    methods: {
        //隔2分钟调取一次接口
        interval(){
            this.util.postAjax({
                code:code.base,
                url:code.onlineadd,
                // data:{type:2}
            }).then(res => {
                // this.util.postAjax({
                //     code:code.base,
                //     url:code.onlineadd,
                //     data:{type:1}
                // }).then(res => {
                    console.log('加1',res);
                // });
            });
        },
        //刚进来查看+1
        readadd(){
            this.util.postAjax({
                code:code.base,
                url:code.readnum,
                data:{resId:this.docDetail1.id}
            }).then(res => {
                this.singletime = 0;//刚进来恢复0,用于计时2分钟的
                this.util.postAjax({
                    code:code.base,
                    url:code.onlineadd,
                    data:{action:'init'}
                }).then(data=>{
                    //刚进来调取已经学习的分钟数
                    this.util.postAjax({
                        code:code.base,
                        url:code.lrecordqueryUserRecord,
                    }).then(res => {
                        if(res.success){
                            if(!res.studytime){
                                res.studytime = 0
                            }
                            this.onlineTime = parseInt(res.studytime) * 60;
                            this.formatonlineTime = this.util.formatSeconds(this.onlineTime);
                            this.formatonlineTime=this.formatonlineTime.split(":");
                            this.formatonlineTimeH = this.formatonlineTime[0].split("") //;
                            this.formatonlineTimeM = this.formatonlineTime[1].split("");
                            this.formatonlineTimeS = this.formatonlineTime[2].split("");
                            this.timer = setInterval(()=>{
                                this.onlineTime++;
                                this.singletime++;
                                this.formatonlineTime = this.util.formatSeconds(this.onlineTime);
                                this.formatonlineTime=this.formatonlineTime.split(":");
                                this.formatonlineTimeH = this.formatonlineTime[0].split("") //;
                                this.formatonlineTimeM = this.formatonlineTime[1].split("");
                                this.formatonlineTimeS = this.formatonlineTime[2].split("");
                                if(this.singletime == 61){//及时到2分钟，调取type=2的接口
                                    this.singletime=0;
                                    this.interval();
                                }
                            },1000)
                            // this.$store.commit('setonlinetimer',this.timer)
                        }else{
                            this.Toast(res.message)
                        }
                    });

                })
            });
        },
        //进来就调取学完的接口
        endstudy(id){
            this.util.postAjax({
                code:code.base,
                url:code.saveStudyed,
                data:{id:id}
            }).then(res => {
                console.log('end',res);
            });
        }
    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
    created () {
        this.docDetail1 = window.sessionStorage.getItem('docDetail')?JSON.parse(window.sessionStorage.getItem('docDetail')):'';
        if(!this.ended){
            this.endstudy(this.docDetail1.id)
        }
        this.readadd();
    },
    
}
</script>
<style>
.doc_content{
    padding: .75rem;
    padding-bottom: 3rem;
    box-sizing: border-box;
    padding-bottom: 3.5rem;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    overflow: auto;
}
.doc_content img{
    width:90% !important;
    height: auto !important;
}
.doctitle{
    width:100%;
    height:2.5rem;
    font-size:0.9rem;
    font-weight:600;
    color:rgba(51,51,51,1);
    line-height:1.25rem;
}
.doctitle_d{
    margin-top: .5rem;
    position: relative;
}
.doctime,.docnum{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
}
.docnum{
    margin-left: .5rem;
}
.yellow_title{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(135,104,0,1);
    position: absolute;
    right: 0;
    top: .2rem;
}
.yellow_title>i{
    font-style: normal;
    display: inline-block;
    width:0.9rem;
    height:1rem;
    border-radius:0.08rem;
    margin-left: .1rem;
    text-align: center;
    line-height: 1rem;
    background: rgba(45,148,251,.4);
    color: rgba(45,148,251,1);
}
.doc_img{
    width: 100%;
    height: 9.5rem;
    margin: 0 auto;
    margin-top: .5rem;
}
.doc_context{
    width:100%;
    /* height:5.25rem; */
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    margin-top: .5rem;
    text-align: justify;
    /* text-indent: 1rem; */
}
</style>