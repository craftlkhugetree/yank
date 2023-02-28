<template>
    <div>
        <transition :name="transitionName">    
            <!-- :name是自己命名的class的名称，用来写动画样式， -->
            <router-view></router-view>
        </transition>
        <ul class="navs">
            <li v-for="(v,i) in mymenu" :key="i" @click="swtichIndex(v.id)" :class="{isactive : v.navs}">
                <div v-show="!v.navs">
                    <img :src="'./static/img/'+v.img" alt="" >
                    <span class="names">{{v.name}}</span>
                </div>
                <transition mode="out-in">
                    <div v-show="v.navs" key="onefalse">
                        <img :src="'./static/img/'+v.actimg" alt="" >
                        <span class="names">{{v.name}}</span>
                    </div>
                </transition>
            </li>
        </ul>
    </div>
</template>

<script>
import code from '../util/code'
export default {
    data () {
        return {
            transitionName:'',
            mymenu:'',
            GLOBALNAV:'',
            initnum:'',
            activity:window.base.activity
        }
    },
    methods: {
        swtichIndex(i){
            this.mymenu.forEach(item=> {
                item.navs = false;
                if(item.id==i){
                    item.navs = true;
                }
            });
            switch (i) {
                case '0':
                    this.$router.push('index');
                    break;
                case '1':
                    this.$router.push('exam');
                    break;
                case '2':
                    this.$router.push('study');
                    break;
                case '3':
                    this.$router.push('person');
                    break;
                case '4':
                    this.$router.push('activityIndex');
                    break;
            }
        },
        change(url){
            this.activeIndex = url;
        },
        gloablview(){
            this.util.postAjax({
                code:code.base,
                url:code.ruleslist,
                data:{
                    code:'GLOBALNAV'//是否顺序阅读
                }
            }).then(data=>{
                if(data.item.rval){
                    window.sessionStorage.setItem('GLOBALNAV',data.item.rval);
                    if(this.activity){
                        this.mymenu = [{
                            name:'全景导航',
                            id:'0',
                            DISPLAYURL:'index',
                            img:'home.png',
                            actimg:'homeactive.png',
                            navs:true
                        },{
                            name:'在线学习',
                            id:'2',
                            DISPLAYURL:'study',
                            img:'exam.png',
                            actimg:'examactive.png',
                            navs:false
                        },{
                            name:'在线考试',
                            id:'1',
                            DISPLAYURL:'exam',
                            img:'study.png',
                            actimg:'studyactive.png',
                            navs:false
                        },{
                            name:'活动',
                            id:'4',
                            DISPLAYURL:'activity',
                            img:'person.png',
                            actimg:'personactive.png',
                            navs:false
                        },{
                            name:'个人中心',
                            id:'3',
                            DISPLAYURL:'person',
                            img:'person.png',
                            actimg:'personactive.png',
                            navs:false
                        }]
                    }else{
                        this.mymenu = [{
                            name:'全景导航',
                            id:'0',
                            DISPLAYURL:'index',
                            img:'home.png',
                            actimg:'homeactive.png',
                            navs:true
                        },{
                            name:'在线学习',
                            id:'2',
                            DISPLAYURL:'study',
                            img:'exam.png',
                            actimg:'examactive.png',
                            navs:false
                        },{
                            name:'在线考试',
                            id:'1',
                            DISPLAYURL:'exam',
                            img:'study.png',
                            actimg:'studyactive.png',
                            navs:false
                        },{
                            name:'个人中心',
                            id:'3',
                            DISPLAYURL:'person',
                            img:'person.png',
                            actimg:'personactive.png',
                            navs:false
                        }]
                    }
                    
                }else{
                    if(this.activity){
                        this.mymenu =[{
                            name:'在线学习',
                            id:'2',
                            DISPLAYURL:'study',
                            img:'exam.png',
                            actimg:'examactive.png',
                            navs:true
                        },{
                            name:'在线考试',
                            id:'1',
                            DISPLAYURL:'exam',
                            img:'study.png',
                            actimg:'studyactive.png',
                            navs:false
                        },{
                            name:'活动',
                            id:'4',
                            DISPLAYURL:'activity',
                            img:'person.png',
                            actimg:'personactive.png',
                            navs:false
                        },{
                            name:'个人中心',
                            id:'3',
                            DISPLAYURL:'person',
                            img:'person.png',
                            actimg:'personactive.png',
                            navs:false
                        }]

                    }else{
                        this.mymenu =[{
                            name:'在线学习',
                            id:'2',
                            DISPLAYURL:'study',
                            img:'exam.png',
                            actimg:'examactive.png',
                            navs:true
                        },{
                            name:'在线考试',
                            id:'1',
                            DISPLAYURL:'exam',
                            img:'study.png',
                            actimg:'studyactive.png',
                            navs:false
                        },{
                            name:'个人中心',
                            id:'3',
                            DISPLAYURL:'person',
                            img:'person.png',
                            actimg:'personactive.png',
                            navs:false
                        }]

                    }
                    
                }
                var str = window.location.href.split('#/')[1];
                var newstr;
                if(str=='bigthing'){
                    newstr='person'
                }else if(str.indexOf('articlepdf') != -1||str.indexOf('onlinevideo') != -1||str.indexOf('onlinearticle') != -1){
                    newstr='study'
                }else if(str=='examing'||str=='fightexaming'){
                    newstr='exam'
                }else{
                    newstr=str
                }
                this.mymenu.forEach(e=>{
                    e.navs = false
                    if(e.DISPLAYURL==newstr){
                        e.navs = true
                    }
                })
            })
        },
    },
    watch: {//使用watch 监听$router的变化
        $route(to, from) {
            console.log(to, from)
            var str = to.name;
            var newstr;
            if(str=='bigthing'){
                newstr='person'
            }else if(str.indexOf('articlepdf') != -1||str.indexOf('onlinevideo') != -1||str.indexOf('onlinearticle') != -1){
                newstr='study'
            }else if(str=='examing'||str=='fightexaming'){
                newstr='exam'
            }else if(str=='activityIndex'||str=='allactivity'||str=='datapicker'){
                newstr='activity'
            }else{
                newstr=str
            }
            this.mymenu.forEach(e=>{
                e.navs = false
                if(e.DISPLAYURL==newstr){
                    e.navs = true
                }
            })
            //如果to索引大于from索引,判断为前进状态,反之则为后退状态
            if(to.meta.index =='p1'||to.meta.index =='e1'||to.meta.index =='s1'){
                //设置动画名称
                this.transitionName = 'fade-out';
                if(from.meta.index =='p0'){
                   this.transitionName = 'fade-in';
                }
            }else{
                this.transitionName = 'none'
            }
        }
    },
    computed:{
        // mymenu(){
        //     return this.$store.state.navs
        // }
    },
    beforeMount(){
        this.gloablview();
    },
    created() {
        this.gloablview();
    },
}
</script>

<style scoped>
.names{
    font-size: 0.7rem;
}

/* fade-in名字都是自己起的 */
.fade-in-enter-active,
.fade-in-leave-active,
.fade-out-enter-active,
.fade-out-leave-active {
    opacity: 0;
    transform: scale(1);
    transition: all 300ms;
    /* position: absolute; */
}
.fade-in-enter {
    transform-origin:100% 0%;
    opacity: .5;
    /* translate:(100% 0); */
    transform: scale(0)
}
.fade-in-leave-active {
  opacity: 0;
}
.fade-out-enter {
  opacity: 1;
  transform: scale(0)
}
.fade-out-leave-active {
  opacity: 0;
  transform: scale(0)
}
    .navs {
        width: 100%;
        height: 3rem;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        z-index: 8;
    }
    .navs>li {
        box-sizing: border-box;
        padding-top: 0.5rem;
        color: #000;
        font-size: 0.5rem;
        text-align: center;
        position: relative;
        width: 25%;
    }
    .navs>li>div{
        position: absolute;
        width: 100%;
    }
    .navs>li>div>img {
        width: 1rem;
        height: 1rem;
    }
    .navs>li>div>span{
        display: block;
    }
    .isactive span {
        color: #70A9FF;
    }
    .innerpage {
        width: 100%;
        /* height: calc(100% - 2.5rem);
        position: absolute;
        overflow: scroll; */
    }
    /* 动效 */
    .v-enter,.v-leave-to{
        opacity: 0;
    }
    .v-enter-active,.v-leave-active{
        transition: opacity 1s;
    }
</style>
