<template>
    <div class="index_content">
        <!-- <div class="index_top">
            <mt-swipe :auto="4000">
                <mt-swipe-item>
                    <img src="../../../static/img/1.png" alt="" width="100%" srcset="">
                </mt-swipe-item>
                <mt-swipe-item>
                    <img src="../../../static/img/2.png" alt="" width="100%" srcset="">
                </mt-swipe-item>
                <mt-swipe-item>
                    <img src="../../../static/img/3.png" alt="" width="100%" srcset="">
                </mt-swipe-item>
            </mt-swipe>
        </div> -->
        <div class="activate_card">
            <h3>{{personinfo.name}}</h3>
            <p>{{personinfo.readerFlag=='1'?'图书馆借书证已激活':'图书馆借书证未激活'}}<span v-if="personinfo.readerFlag!='1'" class="goexam" @click="goexam">去考试</span></p>
        </div>
        <div class="index_contentlist" v-if="studylists.length>0">
            <div class="single_list" :class="{'endstudy':v.end}" v-for="(v,i) in studylists" :key="i" @click="gostudydetail(v.id)">
                <!-- fileType= 1视频2文档3超文本 -->
                <div class="fileTypebtn" >
                    <i class="fileType_" :class="{'fileType_1':v.fileType=='1','fileType_2':v.fileType=='2'}"></i>
                    {{v.fileType=='1'?'学习视频':v.fileType=='2'?'学习文档':'在线文章'}}
                </div>
                <div class="clearfix main_text" v-if="v.fileType=='1'">
                    <h3>{{v.name}}</h3>
                    <div class="imgs">
                        <video style="width:100%;height:100%;" :src="v.url" @click="godetail(v)">
                            您的浏览器不支持 video 标签。
                        </video>
                    </div>
                </div>
                <div class="clearfix main_text1" v-else>
                    <h3>{{v.name}}</h3>
                </div>
                <p><span class="texts">{{v.watchCount}}次阅读</span> <span class="time">{{v.createTime}}</span></p>
            </div>
        </div>
        <div v-else class="index_contentlist1">
            <div class="index_contentlist1_auto"></div>
        </div>

    </div>
</template>
<script>
import code from '../../util/code'
export default {
    data() {
        return {
            studylists:[],//在线学习的列表
            studyed:[],
            personinfo:'',//个人信息
            islearnnum:false,
        }
    },
    methods: {
        //学完的列表
        endlists(){
            this.studyed = [];
            this.util.postAjax({
                code: code.base,
                url: code.userStudyed,
            }).then(res => {
                res.items.forEach(e=>{
                    var obj = {id:e.lsourceid};
                    this.studyed.push(obj);
                    var obj = {};
                    this.studyed = this.studyed.reduce((cur,next) => {
                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                        return cur;
                    },[]) //设置cur默认类型为数组，并且初始值为空的数组
                })
            })
        
        },
        goexam(){
            this.$router.push('exam');
            var navs = [{check : false},
                {check : true},
                {check : false},
                {check : false}]
            this.$store.dispatch("getnavs",navs);
        },
        //获取底部学习列表
        studyLists(){
            this.util.postAjax({
                code:code.base,
                url:code.ruleslist,
                data:{
                    code:'ISLEARNNUMOPEN'//是否顺序阅读

                }
            }).then(data=>{
                if(data.item.rval=='1'){
                    this.islearnnum = true;
                    this.studyed = [];
                    this.util.postAjax({
                        code: code.base,
                        url: code.userStudyed,
                    }).then(resp=>{
                        resp.items.forEach(e=>{
                            var obj = {id:e.lsourceid};
                            this.studyed.push(obj);
                            var obj = {};
                            this.studyed = this.studyed.reduce((cur,next) => {
                                obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                                return cur;
                            },[]) //设置cur默认类型为数组，并且初始值为空的数组
                        })
                        //获取在线学习的文档的详情
                        this.util.postAjax({
                            code:code.base,
                            url:code.getstudy,
                            data: {
                                page: this.page,
                                limit: this.limit,
                                filter: JSON.stringify({
                                    name: '',
                                    campusId:window.sessionStorage.getItem('campusId')
                                })
                            }
                        }).then(res => {
                            if(res.success){
                                this.studylists = res.items;
                                this.studylists.forEach(e=>{
                                    e.end = true;//放开所有
                                })
                                //id不相同的
                                let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                                add.forEach((e,i)=>{
                                    e.end = false;
                                    if(i==0){//把后一个放开
                                        e.end = true;
                                    }
                                })
                            }
                        });

                    })

                }else{
                    this.islearnnum = false;
                    this.util.postAjax({
                        code:code.base,
                        url:code.getstudy,
                        data:{
                            page:this.page,
                            limit:this.limit,
                            filter:JSON.stringify({
                                name: this.searchkeyword,
                                campusId:window.sessionStorage.getItem('campusId')
                            })
                        }
                    }).then(res => {
                        var data = res.items;
                        if (data.length < this.limit || data.length === 0) {
                            this.studyLoading = true;
                        } else {
                            this.page++;
                        }
                        for (var i = 0; i < data.length; i++) {
                            data[i].end = true;//放开所有
                            this.studylists.push(data[i]);
                        }
                        // this.studylists = res.items;
                        // this.studylists.forEach(e=>{
                        //     e.end = true;//放开所有
                        // })
                    })
                }
            })
        },
        //点击进去学习详情
        gostudydetail(id){
            this.util.postAjax({
                code:code.base,
                url:code.getstudydetail,
                data:{id:id}
            }).then(res => {
                if(res.success){
                    // fileType= 1视频2文档3超文本
                    if(res.item.fileType =='1'){
                        this.$router.push({
                            path: "onlinevideo",
                            // query: {
                            //     videoDetail: JSON.stringify(res.item)
                            // }
                        })
                        window.sessionStorage.setItem('videoDetail',JSON.stringify(res.item));
                    }else if(res.item.fileType =='2'){
                        this.$router.push({
                            path: "articlepdf",
                            // query: {
                            //     articleDetail: JSON.stringify(res.item)
                            // }
                        })
                        window.sessionStorage.setItem('articleDetail',JSON.stringify(res.item))
                    }else{
                        this.$router.push({
                            path: "onlinearticle",
                            // query: {
                            //     docDetail: JSON.stringify(res.item)
                            // }
                        })
                        window.sessionStorage.setItem('docDetail',JSON.stringify(res.item))
                    }
                    // var navs = [{check : false},
                    //     {check : false},
                    //     {check : true},
                    //     {check : false}]
                    // this.$store.dispatch("getnavs",navs);
                }
            });
        },
        // 获取用户
        getuserinfo(){
            this.util.postAjax({
                code:code.base,
                url:code.userInfo,
            }).then(res => {
                if(res.success){
                    this.personinfo = res.item;
                }
            });
        },
    },
    created () {
        this.endlists();
        this.studyLists();
        this.getuserinfo();
    }
    
}
</script>
<style>
.index_content{
    background:rgba(238,238,238,1);
    padding-top: 1rem;
    box-sizing: border-box;
}
.index_contentlist1_auto{
    width: 6.68rem;
    height: 5.65rem;
    background: url(../../../static/img/nodata.png) no-repeat center center;
    background-size: cover;
    margin: 0 auto;
}
.index_top{
    width:100%;
    height:10rem;
    /* background: pink; */
    position: relative;
    display: none;
}
.searchicon{
    display: inline-block;
    width:1rem;
    height:1rem;
    background: url(../../../static/img/search.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    left: 1rem;
    top: .83rem;
}
.indextop_search{
    width: 90%;
    margin: .5rem auto;
    margin-left: 5%;
    outline: none;
    border: none;
    font-size:0.75rem;
    height:1.63rem;
    background:rgba(255,255,255,1);
    border-radius:0.13rem;
    text-indent: 1.3rem;
}
.activate_card{
    width: 90%;
    height:3.26rem;
    border:0.05rem solid rgba(230,153,65,1);
    border-radius: .2rem;
    margin: 0 auto;
    margin-bottom: 0;
    background: url(../../../static/img/activitycard.png) no-repeat center center;
    background-size: cover;
    padding: .2rem 1rem;
    box-sizing: border-box;
    margin-bottom: 20px;
}
.activate_card>h3{
    font-size:0.9rem;
    font-weight:600;
    color:rgba(255,255,255,1);
}
.activate_card>p{
    font-size:0.75rem;
    font-weight:400;
    color:rgba(255,255,255,1);
}
.goexam{
    display: inline-block;
    width:3rem;
    height:1.25rem;
    background:rgba(255,255,255,1);
    border-radius:0.63rem;
    font-size:0.6rem;
    font-weight:400;
    line-height: 1.25rem;
    color:rgba(0,120,241,1);
    text-align: center;
    margin-left: .75rem;
}
.title{
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding-left:1rem;
    box-sizing: border-box;
    margin-top: .48rem;
}
.index_contentlist{
    width: 90%;
    margin: 0 auto;
    padding-bottom: 2.5rem;
    box-sizing: border-box;
}
.index_contentlist1{
    width: 90%;
    margin: 0 auto;
    font-size: 14px;
    padding: .85rem 0;
    box-sizing: border-box;
    text-align: center;
}
.index_contentlist .single_list{
    width: 100%;
    background:rgba(243,245,249,1);
    opacity:0.5;
    padding: .7rem;
    box-sizing: border-box;
    margin-bottom: .5rem;
}
.index_contentlist .single_list.endstudy{
    background: rgba(255, 255, 255, 1);
    opacity:1;
}
.index_contentlist .single_list>p{
    width:100%;
    height:1.05rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:1.05rem;
}
/*.single_list>div>h3{
    width:100%;
    height:2.5rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    float: left;
    margin-top: .5rem;
}
.single_list>div>.btn{
    display: inline-block;
    width:3.2rem;
    height:1rem;
    border:0.03rem solid rgba(51,51,51,1);
    font-size:0.6rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1rem;
    text-align: center;
}
.single_list>div>.texts{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    margin-left: .75rem;
} */
.fileTypebtn {
    display: inline-block;
    width:4.6rem;
    height:1.25rem;
    background:rgba(255,255,255,1);
    box-shadow:0rem 0.05rem 0.15rem 0rem rgba(26,119,255,0.2);
    border-radius:0.63rem;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:1.25rem;
    text-align: center;
}
.endstudy .fileType_{
    display: inline-block;
    width:0.75rem;
    height:0.6rem;
    background:url(../../../static/img/article.png) no-repeat center center;
    background-size: contain;
    margin-top: .325rem;
    margin-right: .25rem;
}
.fileType_{
    display: inline-block;
    width:0.75rem;
    height:0.6rem;
    background:url(../../../static/img/articel_grey.png) no-repeat center center;
    background-size: contain;
    margin-top: .325rem;
    margin-right: .25rem;
}
.fileType_.fileType_1{
    background:url(../../../static/img/video_grey.png) no-repeat center center;
    background-size: contain;
}
.fileType_.fileType_2{
    background:url(../../../static/img/doc_grey.png) no-repeat center center;
    background-size: contain;
}
.endstudy .fileType_.fileType_1{
    background:url(../../../static/img/vedio.png) no-repeat center center;
    background-size: contain;
}
.endstudy .fileType_.fileType_2{
    background:url(../../../static/img/doc.png) no-repeat center center;
    background-size: contain;
}
.main_text1,.main_text{
    width: 100%;
    padding: .5rem 0;
    box-sizing: border-box;
}
.main_text>h3{
    width: calc(100% - 5.15rem);
    float: left;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
}
.main_text>.imgs{
    width:5.15rem;
    height:2.98rem;
    background: red;
    float: right;
}
.main_text1>h3{
    width:100%;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
}
.texts,.time{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:1.05rem;
    float: left;
}
.time{
    float: right;
}
</style>