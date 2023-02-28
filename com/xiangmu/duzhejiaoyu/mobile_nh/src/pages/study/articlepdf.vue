<template>
    <div class="doc_content">
        <h3 class="doctitle">{{articleDetail1.name}}</h3>
        <p class="doctitle_d">
            <span class="docnum">{{articleDetail1.watchCount}}次阅读</span>
            <span class="yellow_title">已学 
                <i v-for="v in formatonlineTimeH">{{v}}</i>
                :
                <i v-for="v in formatonlineTimeM">{{v}}</i>
                :
                <i v-for="v in formatonlineTimeS">{{v}}</i>
            </span>
        </p>
        <!-- <div id="demo"></div> -->
        <div class="demo">
            <iframe :src="'./static/pdf/web/viewer.html?file='+articleDetail1.url" class="iframepdf" frameborder="0" id="pdfContainer" name="pdfContainer" ref="iframe"></iframe>

            <!-- <iframe :src="pSrc" width="100%" class="iframepdf" height="100%"></iframe> -->
            <!-- <iframe :src="articleDetail1.url" class="iframepdf"></iframe> -->
        </div>
        <!-- pdf刚进来的加载中蒙版 -->
        <!-- <div class="pdf_meng" v-if="pdf_show">
            <p>pdf加载中...</p>
        </div> -->
    </div>
</template>
<script>
import Pdfh5 from "pdfh5";
import code from '../../util/code'
export default {
    props:{
        ended:Boolean
    },
    data() {
        return {
            pdfh5:  null,
            pdf_show:false,
            formatonlineTime:'',//页面中的计时
            formatonlineTimeH:'',
            formatonlineTimeM:'',
            formatonlineTimeS:'',
            singletime:0,//刚进来恢复0,用于计时2分钟的
            timer:null,
            articleDetail1:'',
            pSrc:'',
            domian:window.base.mainURL,//域名
        }
    },
    methods: {
        //隔2分钟调取一次接口
        interval(){
            this.util.postAjax({
                code:code.base,
                url:code.onlineadd,
            }).then(res => {
                console.log('加1',res);
            });
        },
        //刚进来查看+1
        readadd(){
            this.util.postAjax({
                code:code.base,
                url:code.readnum,
                data:{resId:this.articleDetail1.id}
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
        this.articleDetail1 = window.sessionStorage.getItem('articleDetail')?JSON.parse(window.sessionStorage.getItem('articleDetail')):'';
        if(!this.ended){
            this.endstudy(this.articleDetail1.id)
        }
        this.readadd();
    },
    mounted() {
        //实例化
        // this.pdfh5 = new  Pdfh5("#demo", {
        //     pdfurl:  this.articleDetail1.url
        // });
        // let pSrc = this.domian+this.articleDetail1.url;
        // this.pSrc = '../../../static/pdf/web/viewer.html?file=' + encodeURIComponent(pSrc);
        // console.log(this.pSrc)
    }
}
</script>
<style>
@import "pdfh5/css/pdfh5.css";
.doc_content{
    padding: .75rem;
    box-sizing: border-box;
    padding-bottom: 3.5rem;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
}
.demo,.iframepdf{
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* background: red; */
    position: relative;
}
.doctitle{
    width:100%;
    /* height:2.5rem; */
    font-size:0.9rem;
    font-weight:600;
    color:rgba(51,51,51,1);
    line-height:1.25rem;
}
.doctitle_d{
    margin: .5rem 0;
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
    font-size:0.6rem;
}
.pdf_meng{
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, .7);
    top: 0;
    left: 0;
}
.pdf_meng>p{
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    color: #fff;
    text-align: center;
    font-size: 14px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
</style>