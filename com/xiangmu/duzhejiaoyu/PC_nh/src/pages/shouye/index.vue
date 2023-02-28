<template>
    <div>
        <div class="index_content">
            <iframe :src="GLOBALNAV" frameborder="0" name="showHere" scrolling=auto height="90%" width="100%"></iframe>
        </div>
        <div v-if="isIE9" class="ie_box">
            <div class="ie_box_">
                <div class="ie_box_img"></div>
                <p>为了不影响系统使用，请升级浏览器版本</p>
                <div class="btn" @click="close">确定</div>
            </div>
        </div>
        <guideUse v-if="showUse" @closeuseguide="closeuse"></guideUse>
    </div>
</template>
<script>
import guideUse from '../../common/use'
export default {
    components:{guideUse},
    data() {
        return {
            GLOBALNAV:'',
            isIE9:false,
            showUse:false,
        }
    },
    methods: {
        closeuse(){
            this.showUse = false;
            window.sessionStorage.removeItem('useguide');
        },
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
        }
    },
    created() {
        window.sessionStorage.setItem('finish','0');
        this.showUse = window.sessionStorage.getItem('useguide')=='0'?true:false;
        this.IE_VERSION();
        this.GLOBALNAV= window.sessionStorage.getItem('GLOBALNAV');
        //加一个判断全景地址的get请求是不是404
    },
    
}
</script>
<style  scoped>
    .ie_box_img{
        width:36px;
        height:36px;
        background:url(../../../static/img/info.png) no-repeat center center;
        background-size: cover;
        margin: 30px auto;
    }
    .ie_box_{
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
    }
    .ie_box_>p{
        width:100%;
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(31,35,47,1);
        line-height:20px;
        text-align:center;
    }
    .ie_box_>.btn{
        width:83px;
        height:38px;
        background:rgba(20,114,255,1);
        border-radius:3px;
        position: absolute;
        bottom: 30px;
        left: calc(50% - 41.5px);
        font-size:14px;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:38px;
        letter-spacing:1px;
        text-align: center;
    }
    .index_content{
        width: 100%;
        height: 100%;
        background: #fff;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
    }
    .ie_box{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .7);
        position: fixed;
        left: 0;
        top:0;
    }
    
</style>