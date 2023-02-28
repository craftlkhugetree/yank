<template>
<div>
    <div class="index_content">
        <iframe :src="GLOBALNAV" frameborder="0" name="showHere" scrolling=auto height="90%" width="100%"></iframe>
    </div>
    <!-- 引导的弹窗 -->
    <div class="guide_index" v-if="guide_show">
        <ul class="guide_bottom1 clearfix">
            <li>
                <div v-if="initnum=='guide'">
                    <div class="qj qjact">
                        <img src="../../../static/img/homeactive.png" alt="" >
                        <span class="names">全景导航</span>
                    </div>
                    <div class="qj_line"></div>
                    <div class="qj_text">
                        <h3>全景导览</h3>
                        <p>看看图书馆全貌</p>
                        <span @click="goguide_study">下一步</span>
                    </div>
                </div>
            </li>
            <li>
                <div v-if="initnum=='study'">
                    <div class="xx xx_index">
                        <img src="../../../static/img/study.png" alt="" >
                        <span class="names">在线学习</span>
                    </div>
                    <div class="xx_line xx_indexline"></div>
                    <div class="xx_text xx_indextext">
                        <h3>在线学习</h3>
                        <p>好好学习吧，考试答案都在资料中哦</p>
                        <span @click="goguide_exam">下一步</span>
                    </div>
                </div>
            </li>
            <li>
                <div v-if="initnum=='exam'">
                    <div class="ks ks_index">
                        <img src="../../../static/img/exam.png" alt="" >
                        <span class="names">在线考试</span>
                    </div>
                    <div class="ks_line"></div>
                    <div class="ks_text">
                        <h3>在线考试</h3>
                        <p>通过考试就可激活图书证啦</p>
                        <span @click="finish_guide">完成</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <guideUse v-if="showUse" @closeuseguide="closeuse"></guideUse>
</div>
</template>
<script>
import guideUse from '../../components/use'
export default {
    data() {
        return {
            GLOBALNAV:'',
            initnum:'',
            guide_show:false,
            showUse:false
        }
    },
    components:{
        guideUse
    },
    methods: {
        closeuse(){
            this.showUse = false;
            window.sessionStorage.removeItem('useguide');
        },
        goguide_study(){
            this.initnum = 'study';
        },
        goguide_exam(){
            this.initnum = 'exam';
        },
        finish_guide(){
            this.initnum = 'person';
            window.sessionStorage.setItem('finish',this.initnum)
            this.guide_show = false;
        },

    },
    created () {
        this.showUse = window.sessionStorage.getItem('useguide')=='0'?true:false;
        this.initnum = window.sessionStorage.getItem('finish')?window.sessionStorage.getItem('finish'):'';
        if(this.initnum=='guide'){
            this.guide_show = true;
        }
        console.log(this.initnum)
        this.GLOBALNAV= window.sessionStorage.getItem('GLOBALNAV');
    }
    
}
</script>
<style>
.index_content{
    background:rgba(238,238,238,1);
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
}
</style>