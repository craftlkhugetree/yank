<template>
    <div class="vedio_content">
         <div class="doc_img">
            <video ref="video" id="vedio" 
                webkit-playsinline 
                playsinline 
                x5-video-player-type="h5"
                style="object-fit: fill;" 
                preload="auto" 
                :src="domian+videoDetail1.url"
                controls
                autoplay>
            </video>
        </div>
        <h3 class="doctitle">{{videoDetail1.name}}</h3>
        <p class="doctitle_d">
            <span class="docnum">{{videoDetail1.watchCount}}次阅读</span> 
        </p>
        <p class="doc_context" v-html="videoDetail1.description"></p>
        <div class="doctitle_time clearfix">
            <div class="time_icon"></div>
            <div class="time_text">已学习时长：
                <span>
                    <i v-for="v in formatonlineTimeH">{{v}}</i>
                    :
                    <i v-for="v in formatonlineTimeM">{{v}}</i>
                    :
                    <i v-for="v in formatonlineTimeS">{{v}}</i>
                </span>
            </div>
        </div>
        <!-- 视频弹窗 -->
        <!-- <div class="closevedio_box" v-if="closevedio">
            <div class="closevedio_">
                <div class="closevedio_top"></div>
                <p>还有{{formatSeconds(vedioduration - vediocurr)}}观看完视频，确定退出吗？</p>
                <div class="vediobtns ">
                    <button class="cancel" @click="cancel">取消</button>
                    <button class="sure" @click="close">确认</button>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import code from '../../util/code'
import { Dialog } from 'vant';

export default {
    props:{
        ended:Boolean
    },
    data () {
        return {
            timer:null,
            formatonlineTime:'',
            formatonlineTimeH:'',
            formatonlineTimeM:'',
            formatonlineTimeS:'',
            singletime:0,//刚进来恢复0,用于计时2分钟的
            domian:window.base.mainURL,//域名
            videoDetail1:'',
            closevedio:true,
            vedioduration:0,//视频的总时长
            vediocurr:0,//视频当前时长
            myvedio:'',
            isneedvideocontrol:'0',//能不能拖动

        }
    },
    methods: {
        //隔1分钟调取一次接口
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
                data:{resId:this.videoDetail1.id}
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
        //获取视频总时长
        getTitalTimes(){
            this.myvedio = document.getElementById('vedio');
            this.vedioduration = Math.floor(this.myvedio.duration);
            this.myvedio.play();
        },
        //学完视频就调取学完的接口
        endstudy(id){
            this.util.postAjax({
                code:code.base,
                url:code.saveStudyed,
                data:{id:id}
            }).then(res => {
                console.log('end',res);
            });
        },
        goBack_(){
            this.vediocurr = Math.floor(this.myvedio.currentTime);
            this.vedioduration = Math.floor(this.myvedio.duration);
            if(!this.playend){
                if(this.vedioduration - this.vediocurr == 0){
                    this.$router.push('study');
                    return
                }else{
                    this.myvedio.pause();
                    if(isNaN(this.vedioduration-this.vediocurr)){ 
                        Dialog.confirm({
                            message: `是否退出该视频`,
                        })
                        .then(() => {
                            this.$router.push('study');
                        }).catch(()=>{
                            if (window.history && window.history.pushState) {
                                history.pushState(null, null, document.URL);
                                window.addEventListener('popstate', this.goBack_, false);
                            }
                        })
                        return
                    }
                    Dialog.confirm({
                        message: `还有${this.formatSeconds(this.vedioduration - this.vediocurr)}观看完视频，确定退出吗`,
                    })
                    .then(() => {
                        this.$router.push('study');
                    })
                    .catch(() => {
                        this.myvedio.play();
                    });
                    if (window.history && window.history.pushState) {
                        history.pushState(null, null, document.URL);
                        window.addEventListener('popstate', this.goBack_, false);
                    }
                }
            }else{
                this.$router.push('study');
                return
            }

            
        },
        goBack_1(){
            this.$router.push('study');
        },
        //将秒转成时分秒
        formatSeconds(value) {
            let result = parseInt(value)
            let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
            let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
            let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
        
            let res = '';
            if(h !== '00') res += `${h}时`;
            if(m !== '00') res += `${m}分`;
            res += `${s}秒`;
            return res;
        },
        autoplay(){
            var that = this;
            var resetTime = 0;
            var curTime = 0;
            var vd = document.getElementById('vedio');
            var getCurTime = localStorage.getItem('remTime');
            if(getCurTime>0.1){
                curTime = getCurTime;
                resetTime = getCurTime;
                vd.addEventListener('play',function(){
                    setTimeout(function(){
                        vd.currentTime = getCurTime;
                        setInterval(timer,100)
                    },2000)
                })

            }else{
                vd.play()
                setInterval(timer,100)
            }
            function timer(){
                curTime = vd.currentTime;
                var aparTime = curTime - resetTime;
                if(aparTime>2){
                    vd.currentTime=resetTime
                }else{
                    resetTime = curTime
                }
                that.curTime = curTime
            }
        }

    },
    //页面销毁时，取消监听。否则其他vue路由页面也会被监听
    destroyed () {
        window.removeEventListener('popstate', this.goBack_, false);
    },
    beforeDestroy(){
        clearInterval(this.timer);
    },
    mounted(){
        if(this.isneedvideocontrol =='1'){
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', this.goBack_, false);
            }
            var tarr = [];
            var video = document.getElementById("vedio");
            video.addEventListener("timeupdate", function (e) {//当前播放位置改变则执行函数
                if(video.duration == video.currentTime){
                    video.currentTime = 0 ;
                    video.pause();
                }
            }, false);
            video.addEventListener("seeking", function (e) {//用户开始移动/跳跃到新的视频播放位置时弹出文本信息
                if (video.currentTime<tarr[1]) {//不知道你说的向前和向后是指什么方向，方向不对的话把 < 改成 >
                    video.currentTime = tarr[1];
                }
            }, false);
            video.addEventListener("ended",()=>{
                this.playend = true;
                if(!this.ended||this.ended=='false'){
                    this.endstudy(this.videoDetail1.id);
                }
                console.log("结束");
            })
        }else{
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', this.goBack_1, false);
            }
        }
    },
    created () {
        this.isneedvideocontrol = window.sessionStorage.getItem('isneedvideocontrol')?window.sessionStorage.getItem('isneedvideocontrol'):false;
        this.videoDetail1 = window.sessionStorage.getItem('videoDetail')? JSON.parse(window.sessionStorage.getItem('videoDetail')):'';
        setTimeout(()=>{
            if(this.isneedvideocontrol =='1'){
                this.autoplay();
            }
            this.getTitalTimes();
        },1000)
        this.readadd()//要放开
    },
}
</script>
<style>
video::-webkit-media-controls-timeline {
    display: none;
}
/* #video{
    object-fit:fill !important;
} */
.time_icon{
    width:0.75rem;
    height:0.75rem;
    background:url(../../../static/img/time.png) no-repeat center center;
    background-size: cover;
    float: left;
    margin-top: .1rem;
}
.time_text{
    width: calc(100% - 1rem);
    float: right;
    font-size:0.7rem;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.time_text>span{
    float: right;
}
.time_text>span>i{
    display: inline-block;
    width:0.9rem;
    height:1rem;
    background:rgba(45,148,251,.4);
    border-radius:0.08rem;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(45,148,251,1);
    line-height:1rem;
    margin: 0 .13rem;
    font-style: normal;
    text-align: center;
}
.doctitle_time{
    width:100%;
    /* height:2.25rem; */
    background:rgba(255,255,255,1);
    position: fixed;
    left: 0;
    bottom: 0rem;
    padding: .75rem;
    box-sizing: border-box;
    border-top: 1px solid #E8EBEF;
}
.closevedio_box{
    position: fixed;
    width: 100%;
    height: 100%;
    background:rgba(0, 0, 0, .7);
    top: 0;
    left: 0;
    z-index: 9999;
}
.closevedio_{
    width:383px;
    height:211px;
    background:rgba(255,255,255,1);
    border-radius:5px;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 30px;
    box-sizing: border-box;
}
.vedio_content{
    padding: .75rem;
    box-sizing: border-box;
    padding-bottom: 6.5rem;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2001;
    background: #fff;
    overflow: auto;
}
.doctitle{
    width:100%;
    font-size:0.9rem;
    font-weight:600;
    color:rgba(51,51,51,1);
    line-height:1.25rem;
    margin-top: 30px;
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
    /* height: 9.5rem; */
    /* background: pink; */
    margin: 0 auto;
    margin-top: .5rem;
}
.doc_img>video{
    width: 100%;
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