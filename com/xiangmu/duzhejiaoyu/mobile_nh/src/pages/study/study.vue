<template>
<div>
    <div class="study_content" ref="box">
        <p v-if="studytime!=0">总共已学  
            <i v-for="v in formatonlineTimeH">{{v}}</i>
            :
            <i v-for="v in formatonlineTimeM">{{v}}</i>
            :
            <i v-for="v in formatonlineTimeS">{{v}}</i>
        </p>
        <div class="study_contentlist" v-if="studylists.length>0" v-infinite-scroll="loadstudylists" :infinite-scroll-disabled=studyLoading :infinite-scroll-distance="10">
            <div class="singlestudy_list" :class="{'endstudy':!((!v.end&&!needstudy)||(needstudy&&v.isNeedstudy==1&&!v.end))}" @click="gostudydetail(v,v.id)" v-for="(v,i) in studylists" :key="i">
                <i v-if="islearnnum&&v.ending" :class="{'ending':v.ending}">未读</i>
                <div class="clearfix main_text" >
                    <div class="imgs" v-if="v.fileType=='1'">
                        <video id="video" style="width:100%;height:100%;object-fit:fill;" v-if="v.photourl" :src="v.url" preload="auto" :poster="v.photourl" @click="godetail(v)">
                            您的浏览器不支持 video 标签。
                        </video>
                        <video id="video" style="width:100%;height:100%;object-fit:fill;" v-else :src="v.url" preload="auto" poster="../../../static/img/default.png" @click="godetail(v)">
                            您的浏览器不支持 video 标签。
                        </video>
                    </div>
                    <div class="imgs" v-else>
                        <img v-if="v.photourl" :src="v.photourl" alt="">
                        <img v-if="!v.photourl" src="../../../static/img/default.png" alt="">
                    </div>
                    <div class="text">
                        <h3>{{v.name}}</h3>
                        <div class="text_num">
                            <div class="fileTypebtn" >
                                <i class="fileType_" :class="{'fileType_1':v.fileType=='1','fileType_2':v.fileType=='2'}"></i>
                                {{v.fileType=='1'?'学习视频':v.fileType=='2'?'学习文档':'在线文章'}}
                            </div>
                            <span class="texts" v-if="v.end">{{v.watchCount>10000?formatNum(v.watchCount):v.watchCount}}次阅读</span>
                            <span :class="{'lock':(!v.end&&!needstudy)||(needstudy&&v.isNeedstudy==1&&!v.end)}"></span>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="study_contentlist1" v-else>
            <p v-if="loadingshow">数据加载中。。。</p>
            <p v-else>暂无数据</p>
        </div>
        <!-- 引导的弹窗 -->
        <div class="guide_index" v-if="guide_show">
            <ul class="guide_bottom clearfix">
                <li>
                    <div v-if="initnum=='study'">
                        <div class="xx xxact">
                            <img src="../../../static/img/studyactive.png" alt="" >
                            <span class="names">在线学习</span>
                        </div>
                        <div class="xx_line"></div>
                        <div class="xx_text">
                            <h3>在线学习</h3>
                            <p>好好学习吧，考试答案都在资料中哦</p>
                            <span @click="goguide_exam">下一步</span>
                        </div>
                    </div>
                </li>
                <li>
                    <div v-if="initnum=='exam'">
                        <div class="ks ksatc">
                            <img src="../../../static/img/exam.png" alt="" >
                            <span class="names">在线考试</span>
                        </div>
                        <div class="ks_line"></div>
                        <div class="ks_text">
                            <h3>在线考试</h3>
                            <p>满足学习条件才可考试，通过考试就可激活图书证啦</p>
                            <span @click="finish_guide">完成</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <guideUse v-if="showUse" @closeuseguide="closeuse"></guideUse>
</div>
</template>

<script>
import code from '../../util/code'
import guideUse from '../../components/use'
export default {
    components:{guideUse},
    data() {
        return {
            studylists: [], //在线学习的列表
            studyed:[],//学完的学习资料的id
            page: 1,
            limit: 10,
            studyLoading: false,
            searchkeyword: '', //搜索关键字
            studytime:'',//学习时间
            formatonlineTimeH:'',
            formatonlineTimeM:'',
            formatonlineTimeS:'',
            islearnnum:false,
            islearnnumflag:'',
            isstudyedflag:'',
            initnum:'',
            guide_show:false,
            loadingshow:true,
            needstudy:window.base.needstudy,
            showUse:false


        }
    },
    methods: {
        closeuse(){
            this.showUse = false;
            window.sessionStorage.removeItem('useguide');
        },
        //将10000万转成1万
        formatNum(n){
            n = Math.round((n /10000) * 100) / 100;
            n = n + "万";
            return n
        },
        goguide_exam(){
            this.initnum = 'exam';
        },
        finish_guide(){
            this.initnum = 'person';
            window.sessionStorage.setItem('finish',this.initnum)
            this.guide_show = false;
        },
        parseDom(arg) {
        　　 var objE = document.createElement("div");
        　　 objE.innerHTML = arg;
        　　 return objE.childNodes;
        },
        loadstudylists() {
            if(this.islearnnumflag){//调取过
                if(this.islearnnum){
                    if(this.isstudyedflag){
                        if (!this.studyLoading) {
                                this.util.postAjax({
                                    code: code.base,
                                    url: code.getstudy,
                                    data: {
                                        page: this.page,
                                        limit: this.limit,
                                        filter: JSON.stringify({
                                            name: this.searchkeyword,
                                            readerType:window.sessionStorage.getItem('readerType'),
                                            campusId:window.sessionStorage.getItem('campusId')
                                        })
                                    }
                                }).then(res => {
                                    var data = res.items;
                                    this.loadingshow = false;
                                    if (data.length < this.limit || data.length === 0) {
                                        this.studyLoading = true;
                                    } else {
                                        this.page++;
                                    }
                                    for (var i = 0; i < data.length; i++) {
                                        data[i].video = (`<video id='video' src='${data[i].url}'></video>`);
                                        data[i].end = true;//放开所有
                                        this.studylists.push(data[i]);
                                    }
                                    //id不相同的
                                    let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                                    if(this.needstudy){
                                        add.forEach((e,i)=>{
                                            e.end = false;
                                            if(e.isNeedstudy==0){
                                                e.end = true;
                                            }
                                        })
                                        let index = this.studylists.findIndex( item => item.end == false);
                                        if(index!=-1){
                                            this.studylists[index].ending = true;
                                            this.studylists[index].end = true;
                                        }
                                    }else{
                                        add.forEach((e,i)=>{
                                            e.end = false;
                                            if(i==0){//把后一个放开
                                                e.end = true;
                                                e.ending = true;
                                            }
                                        })
                                    }
                                    console.log('tag', this.studylists)
                                        
                                })
                            }
                    }else{
                        this.studyed = [];
                        this.util.postAjax({
                            code: code.base,
                            url: code.userStudyed,
                        }).then(resp => {
                            this.isstudyedflag = true;
                            resp.items.forEach(e=>{
                                var obj = {id:e.lsourceid};
                                this.studyed.push(obj);
                                var obj = {};
                                this.studyed = this.studyed.reduce((cur,next) => {
                                    obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                                    return cur;
                                },[]) //设置cur默认类型为数组，并且初始值为空的数组
                            })
                            if (!this.studyLoading) {
                                this.util.postAjax({
                                    code: code.base,
                                    url: code.getstudy,
                                    data: {
                                        page: this.page,
                                        limit: this.limit,
                                        filter: JSON.stringify({
                                            name: this.searchkeyword,
                                            readerType:window.sessionStorage.getItem('readerType'),
                                            campusId:window.sessionStorage.getItem('campusId')
                                        })
                                    }
                                }).then(res => {
                                    var data = res.items;
                                    this.loadingshow = false;
                                    if (data.length < this.limit || data.length === 0) {
                                        this.studyLoading = true;
                                    } else {
                                        this.page++;
                                    }
                                    for (var i = 0; i < data.length; i++) {
                                        data[i].video = (`<video id='video' src='${data[i].url}'></video>`);
                                        data[i].end = true;//放开所有
                                        this.studylists.push(data[i]);
                                    }
                                    //id不相同的
                                    // let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                                    // add.forEach((e,i)=>{
                                    //     e.end = false;
                                    //     if(i==0){//把后一个放开
                                    //         e.end = true;
                                    //         e.ending = true;
                                    //     }
                                    // })
                                    let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                                    if(this.needstudy){
                                        add.forEach((e,i)=>{
                                            e.end = false;
                                            if(e.isNeedstudy==0){
                                                e.end = true;
                                            }
                                        })
                                        let index = this.studylists.findIndex( item => item.end == false);
                                        if(index!=-1){
                                            this.studylists[index].ending = true;
                                            this.studylists[index].end = true;
                                        }
                                    }else{
                                        add.forEach((e,i)=>{
                                            e.end = false;
                                            if(i==0){//把后一个放开
                                                e.end = true;
                                                e.ending = true;
                                            }
                                        })
                                    }
                                    console.log('tag', this.studylists)
                                })
                            }
                        })
                    }
                    }else{
                        if (!this.studyLoading) {
                            this.util.postAjax({
                                code:code.base,
                                url:code.getstudy,
                                data:{
                                    page:this.page,
                                    limit:this.limit,
                                    filter:JSON.stringify({
                                        name: this.searchkeyword,
                                        readerType:window.sessionStorage.getItem('readerType'),
                                        campusId:window.sessionStorage.getItem('campusId')
                                    })
                                }
                            }).then(res => {
                                var data = res.items;
                                this.loadingshow = false;
                                if (data.length < this.limit || data.length === 0) {
                                    this.studyLoading = true;
                                } else {
                                    this.page++;
                                }
                                for (var i = 0; i < data.length; i++) {
                                    data[i].end = true;//放开所有
                                    this.studylists.push(data[i]);
                                }
                            })

                        }
                    }

            }else{
                this.util.postAjax({
                    code:code.base,
                    url:code.ruleslist,
                    data:{
                        code:'ISLEARNNUMOPEN'//是否顺序阅读

                    }
                }).then(data=>{
                    if(data.item.rval=='1'){
                        this.islearnnum = true;
                        this.islearnnumflag = true;
                        if(this.isstudyedflag){
                            if (!this.studyLoading) {
                                    this.util.postAjax({
                                        code: code.base,
                                        url: code.getstudy,
                                        data: {
                                            page: this.page,
                                            limit: this.limit,
                                            filter: JSON.stringify({
                                                name: this.searchkeyword,
                                                readerType:window.sessionStorage.getItem('readerType'),
                                                campusId:window.sessionStorage.getItem('campusId')
                                            })
                                        }
                                    }).then(res => {
                                        var data = res.items;
                                        this.loadingshow = false;
                                        if (data.length < this.limit || data.length === 0) {
                                            this.studyLoading = true;
                                        } else {
                                            this.page++;
                                        }
                                        for (var i = 0; i < data.length; i++) {
                                            data[i].video = (`<video id='video' src='${data[i].url}'></video>`);
                                            data[i].end = true;//放开所有
                                            this.studylists.push(data[i]);
                                        }
                                        //id不相同的
                                        // let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                                        // add.forEach((e,i)=>{
                                        //     e.end = false;
                                        //     if(i==0){//把后一个放开
                                        //         e.end = true;
                                        //         e.ending = true;
                                        //     }
                                        // })
                                        let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                                        if(this.needstudy){
                                            add.forEach((e,i)=>{
                                                e.end = false;
                                                if(e.isNeedstudy==0){
                                                    e.end = true;
                                                }
                                            })
                                            let index = this.studylists.findIndex( item => item.end == false);
                                            if(index!=-1){
                                                this.studylists[index].ending = true;
                                                this.studylists[index].end = true;
                                            }
                                        }else{
                                            add.forEach((e,i)=>{
                                                e.end = false;
                                                if(i==0){//把后一个放开
                                                    e.end = true;
                                                    e.ending = true;
                                                }
                                            })
                                        }
                                        console.log('tag', this.studylists)
                                    })
                                }

                        }else{
                            this.studyed = [];
                            this.util.postAjax({
                                code: code.base,
                                url: code.userStudyed,
                            }).then(resp => {
                                this.isstudyedflag = true;
                                resp.items.forEach(e=>{
                                    var obj = {id:e.lsourceid};
                                    this.studyed.push(obj);
                                    var obj = {};
                                    this.studyed = this.studyed.reduce((cur,next) => {
                                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                                        return cur;
                                    },[]) //设置cur默认类型为数组，并且初始值为空的数组
                                })
                                if (!this.studyLoading) {
                                    this.util.postAjax({
                                        code: code.base,
                                        url: code.getstudy,
                                        data: {
                                            page: this.page,
                                            limit: this.limit,
                                            filter: JSON.stringify({
                                                name: this.searchkeyword,
                                                readerType:window.sessionStorage.getItem('readerType'),
                                                campusId:window.sessionStorage.getItem('campusId')
                                            })
                                        }
                                    }).then(res => {
                                        var data = res.items;
                                        this.loadingshow = false;
                                        if (data.length < this.limit || data.length === 0) {
                                            this.studyLoading = true;
                                        } else {
                                            this.page++;
                                        }
                                        for (var i = 0; i < data.length; i++) {
                                            data[i].video = (`<video id='video' src='${data[i].url}'></video>`);
                                            data[i].end = true;//放开所有
                                            this.studylists.push(data[i]);
                                        }
                                        //id不相同的
                                        let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                                        if(this.needstudy){
                                            add.forEach((e,i)=>{
                                                e.end = false;
                                                if(e.isNeedstudy==0){
                                                    e.end = true;
                                                }
                                            })
                                            let index = this.studylists.findIndex( item => item.end == false);
                                            if(index!=-1){
                                                this.studylists[index].ending = true;
                                                this.studylists[index].end = true;
                                            }
                                        }else{
                                            add.forEach((e,i)=>{
                                                e.end = false;
                                                if(i==0){//把后一个放开
                                                    e.end = true;
                                                    e.ending = true;
                                                }
                                            })
                                        }
                                        console.log('tag', this.studylists)
                                    })
                                }
                            })

                        }
                    }else{
                        this.islearnnum = false;
                        this.islearnnumflag = true;
                        if (!this.studyLoading) {
                            this.util.postAjax({
                                code:code.base,
                                url:code.getstudy,
                                data:{
                                    page:this.page,
                                    limit:this.limit,
                                    filter:JSON.stringify({
                                        name: this.searchkeyword,
                                        readerType:window.sessionStorage.getItem('readerType'),
                                        campusId:window.sessionStorage.getItem('campusId')
                                    })
                                }
                            }).then(res => {
                                var data = res.items;
                                this.loadingshow = false;
                                if (data.length < this.limit || data.length === 0) {
                                    this.studyLoading = true;
                                } else {
                                    this.page++;
                                }
                                for (var i = 0; i < data.length; i++) {
                                    data[i].end = true;//放开所有
                                    this.studylists.push(data[i]);
                                }
                            })

                        }
                    }


                })

            }
            
        },
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
        //搜索
        searchstudy(val) {
            // if (e.keyCode == '13') {
                this.util.postAjax({
                    code: code.base,
                    url: code.getstudy,
                    data: {
                        filter: JSON.stringify({
                            name: this.searchkeyword,
                            readerType:window.sessionStorage.getItem('readerType'),
                            campusId:window.sessionStorage.getItem('campusId')
                        })
                    }
                }).then(res => {
                    this.studylists = res.items;
                    this.studylists.forEach(v=>{
                        v.end = true;//放开所有
                    })
                    //id不相同的
                    let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                    add.forEach((e,i)=>{
                        e.end = false;
                        if(i==0){//把后一个放开
                            e.end = true;
                            e.ending = true;
                        }
                    })
                })
            // }
        },
        //学习时间查询------
        lrecordqueryUserRecord(){
            this.util.postAjax({
                code:code.base,
                url:code.lrecordqueryUserRecord,
            }).then(res => {
                this.studytime = res.studytime;
                if(this.studytime == null){
                    this.studytime = 0;
                }else{
                    this.studytime = this.util.formatSeconds(parseInt(res.studytime) * 60);
                    this.studytime= this.studytime.split(":");
                    this.formatonlineTimeH = this.studytime[0].split("") //;
                    this.formatonlineTimeM = this.studytime[1].split("");
                    this.formatonlineTimeS = this.studytime[2].split("");
                            
                }
            });
        },
        //进入详情
        gostudydetail(obj,id) {
            localStorage.setItem('remTime',0)
            var ended = false;
            this.studyed.forEach(e=>{
                if(e.id==id){
                    ended = true;
                }
            })
            if(!obj.end){
                //
                this.Toast('请先学习上一条学习资料');
                return;
            }
            this.util.postAjax({
                code: code.base,
                url: code.getstudydetail,
                data: {
                    id: id
                }
            }).then(res => {
                if (res.success) {
                    // fileType= 1视频2文档3超文本
                    if (res.item.fileType == '1') {
                        this.$router.push({
                            path: "onlinevideo",
                            query:{
                                ended:ended
                            }
                        })
                        window.sessionStorage.setItem('videoDetail', JSON.stringify(res.item))
                    } else if (res.item.fileType == '2') {
                        this.$router.push({
                            path: "articlepdf",
                            query:{
                                ended:ended
                            }
                        })
                        window.sessionStorage.setItem('articleDetail', JSON.stringify(res.item))
                    } else {
                        this.$router.push({
                            path: "onlinearticle",
                            query:{
                                ended:ended
                            }
                        })
                        window.sessionStorage.setItem('docDetail', JSON.stringify(res.item))

                    }
                }
            });
        },
        goarticlepdf() {
            this.$router.push('articlepdf')
        },
        govedio() {
            this.$router.push('onlinevideo')
        }
    },
    created() {
        this.showUse = window.sessionStorage.getItem('useguide')=='1'?true:false;
        this.initnum = window.sessionStorage.getItem('finish')?window.sessionStorage.getItem('finish'):'';
        if(this.initnum=='study'){
            this.guide_show = true;
        }
        this.lrecordqueryUserRecord();
        this.loadstudylists();
    },
}
</script>

<style>
.lock{
    width: 1.2rem;
    height: 1.2rem;
    background: url(../../../static/img/lock.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    right: 0rem;
}
.text_dept{
    margin-top: .25rem;
}
.text_num{
    width: 100%;
    height: 1.25rem;
    line-height: 1.25rem;
    position: absolute;
    bottom: 0;
}
.ending{
    position: absolute;
    width: 40px;
    height: 20px;
    background: #FFCD43;
    font-style: normal;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    right: 0;
    top: 0;
}
.study_content>p{
    width: 100%;
    height: 2rem;
    background:rgba(248,248,248,1);
    font-size:0.6rem;
    font-weight:400;
    color:rgba(135,104,0,1);
    line-height:2rem;
    padding: 0 .6rem;
    box-sizing: border-box;
}
.study_content>p>i{
    display: inline-block;
    width:0.9rem;
    height:1rem;
    border-radius:0.08rem;
    text-align: center;
    line-height: 1rem;
    margin: 0 .1rem;
    font-style: normal;
    background: rgba(45,148,251,.4);
    color: rgba(45,148,251,1);
    font-size:0.6rem;
}
.study_contentlist {
    width: 100%;
    margin: 0 auto;
    padding-bottom: 2.5rem;
    box-sizing: border-box;
    background:rgba(248,248,248,1);
}
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
    /* width:5.15rem;
    height:2.98rem; */
    width:42%;
    height:4.5rem;
    float: left;
    border-radius: 5px;
    overflow: hidden;
}
.imgs>img{
    width: 100%;
    height: 100%;
}
.main_text>.text{
    width:calc(58% - .8rem);
    float: right;
    height:4.5rem;
    position: relative;
    margin-left: .75rem;
}
.main_text1>h3{
    width:100%;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
}
.text>h3{
    font-size: 0.75rem;
    font-weight: 400;
    color: rgba(51,51,51,1);
}
.texts,.time{
    font-size:0.6rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:1.5rem;
    float: right;
}
.time{
    float: right;
}
.study_contentlist1 {
    width: 90%;
    margin: 0 auto;
    font-size: 14px;
    padding: .85rem 0;
    box-sizing: border-box;
    text-align: center;
}

.study_contentlist .singlestudy_list {
    width: 100%;
    background:rgba(243,245,249,1);
    opacity:0.5;
    padding: .7rem;
    box-sizing: border-box;
    margin-bottom: .5rem;
    position: relative;
}
.study_contentlist .singlestudy_list.endstudy{
    background: rgba(255, 255, 255, 1);
    opacity:1;
}
.study_contentlist .singlestudy_list>p {
    width: 100%;
    height: 1.05rem;
    font-size: 0.75rem;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 1.05rem;
}
</style>
