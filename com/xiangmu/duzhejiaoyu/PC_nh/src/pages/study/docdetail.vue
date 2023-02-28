<template>
    <div>
        <div class="docdetail_">
            <div class="docdetail_top">
                <el-button style="float:left;margin-top:15px;" @click="goback">返回</el-button>
                <span class="doc_time">已在线学习<i>{{formatonlineTime[0]}}</i>:<i>{{formatonlineTime[1]}}</i>:<i>{{formatonlineTime[2]}}</i></span>
                <el-button v-if="docdetail.showdown==1" type="primary" style="float:right;margin-top:15px;background:linear-gradient(90deg,rgba(45,171,255,1) 0%,rgba(20,114,255,1) 100%);" icon="mydown" @click="downdoc(docdetail.url)">
                    <!-- <a :href="domain+docdetail.url" @click="downloadFile" style="color: #fff;text-align: left;" download="文档下载">下载</a> -->
                    <a style="color: #fff;text-align: left;" download="文档下载">下载</a>
                </el-button>
            </div>
            <div class="docdetail_top1 clearfix">
                <h3>{{docdetail.name}}</h3>
                <p class="pub_time"><span><i></i> {{docdetail.watchCount}}</span> <span><i class="down"></i> {{docdetail.downloadCount}}</span></p>
            </div>
            <!-- <div id="demo"></div> -->
            <div class="docdetail_bottom">
                <iframe :src="docdetail.url" class="iframepdf"></iframe>
            </div>
        </div>
    </div>
</template>
<script>
import Pdfh5 from "pdfh5";
import code from '../../util/code'
export default {
    props:{
        id:String,
        ended: Boolean,
        islearnnum: Boolean,
    },
    data () {
        return {
            docdetail:'',
            domain:window.base.sourceurl,
            timer:null,
            formatonlineTime:'',
            singletime:0,//刚进来恢复0,用于计时2分钟的
            domain:window.base.mainURL,
            pdfh5:null,
            isIE9:false
        }
    },
    methods: {
        IE_VERSION(){
            var browser=navigator.appName 
            var b_version=navigator.appVersion 
            var version=b_version.split(";"); 
            var trim_Version=version[1].replace(/[ ]/g,""); 
            if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){ 
                this.isIE9 = true;
            } 
        },
        close(){
            this.isIE9 = false;
        },
        downloadFile(url){ 
            var downurl = this.domain + url ;
            var a = document.createElement("a");
            a.setAttribute("href", downurl);
            a.setAttribute("target", "_blank");
            a.setAttribute("id", "camnpr");
            document.body.appendChild(a);
            a.click();
        } ,
        //视频详情
        gostudydetail(id){
            this.util.postAjax({
                code:code.base,
                url:code.getstudydetail,
                data:{id:id}
            }).then(res => {
                if(res.success){
                    this.docdetail = res.item;
                }
            });
        },
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
        readadd(id){
            this.util.postAjax({
                code:code.base,
                url:code.readnum,
                data:{resId:id}
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
                            this.formatonlineTime = this.util.formatSeconds(this.onlineTime).split(':');
                            this.timer = setInterval(()=>{
                                this.onlineTime++;
                                this.singletime++;
                                this.formatonlineTime = this.util.formatSeconds(this.onlineTime).split(':');
                                if(this.singletime == 61){//及时到2分钟，调取type=2的接口
                                    this.singletime=0;
                                    this.interval();
                                }
                            },1000)
                            // this.$store.commit('setonlinetimer',this.timer)
                        }else{
                            this.$message.error(res.message);
                        }
                    });

                })
            });
        },
        //返回
        goback(){
            this.$router.push('study');
            clearInterval(this.timer)
        },
        //下载
        downdoc(url){
            this.util.postAjax({
                code:code.base,
                url:code.downloadnum,
                data:{
                    resId:this.id
                }
            }).then( () => {
                var downurl = this.domain + url ;
                var a = document.createElement("a");
                a.setAttribute("href", downurl);
                a.setAttribute("target", "_blank");
                a.setAttribute("id", "camnpr");
                document.body.appendChild(a);
                a.click();
                this.util.postAjax({
                    code:code.base,
                    url: code.onlineadd,
                    data:{
                        type:1
                    }
                }).then(()=>{
                    // console.log("刷新本页面！");
                })
            })
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
        },
    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
    created () {
        console.log(this.$route, this.islearnnum, this.ended);
        if(this.islearnnum){
            if(!this.ended || this.ended == 'false'){
                console.log('isAPIrun');
                this.endstudy(this.id);
            }
        }
        this.gostudydetail(this.id);
        this.readadd(this.id);
    },
}
</script>
<style scoped>
    .pub_time{
        width:100%;
        height:22px;
        font-size:12px;
        font-weight:400;
        color:rgba(184,187,190,1);
        line-height:22px;
        margin: 10px 0;
        text-align: right;
    }
    .pub_time>span>i{
        display: inline-block;
        width:15px;
        height:11px;
        background:url(../../../static/img/see.png) no-repeat center center;
        background-size: cover;
        margin-right: 5px;
        margin-top: 3px;
    }
    .pub_time>span>i.down{
        background:url(../../../static/img/down.png) no-repeat center center;
        background-size: contain;
        margin-left: 20px;
    }
    .docdetail_{
        width: 1100px;
        height: 100%;
        background: #fff;
        margin: 0 auto;
        overflow: auto;
    }
    .docdetail_top1{
        width: 100%;
        background:rgba(255,253,243,1);
        line-height: 40px;
        padding: 0 40px;
        box-sizing: border-box;
        text-align: center;
        
    }
    .docdetail_top1>h3{
        width: 80%;
        float: left;
        text-align: left;
    }
    .docdetail_top1>p{
        float: right;
        width: 20%;
    }
    .docdetail_top{
        width: 100%;
        height:70px;
        background:rgba(255,253,243,1);
        border-radius:5px 5px 0px 0px;
        line-height: 70px;
        padding: 0 40px;
        box-sizing: border-box;
        text-align: center;
    }
    .docdetail_bottom,#demo{
        width: 100%;
        height:calc(100% - 110px);
        background:rgba(255,253,243,1);
    }
    .doc_time{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(26,119,255,1);
        line-height:20px;
    }
    .doc_time>i{
        display: inline-block;
        /* width:17px; */
        height:20px;
        background:rgba(205,225,255,1);
        border-radius:3px;
        line-height: 20px;
        text-align: center;
        margin: 0 2px;
        font-style: normal;
    }
    .doc_time>i:first-of-type{
        margin-left: 10px;
    }
    #demo{
        width: 100%;
    }
    .iframepdf{
        width: 100%;
        height: 100%;
    }
</style>