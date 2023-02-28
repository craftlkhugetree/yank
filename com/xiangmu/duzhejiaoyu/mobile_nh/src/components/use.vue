<template>
    <div class="use_box">
        <div class="use_auto">
            <h3><i></i>
                使用规则</h3>
            <p>
                同学们需提前完成入馆教育考试，只有顺利通过考试的同学（可多次考试），方可激活校园卡的图书借还功能，顺利进入图书馆借阅图书。<br>
                <!-- 1、在线学习规则：<br>
                （1）本科新生需学习视频全部看完后，方可解锁下一条学习内容；<br>
                （2）视频播放时不可退出，退出后需要重新进入学习；<br>
                （3）研究生对视频学习无要求，文档学习时长均不限。<br>
                2、在线考试规则：<br>
                （1）在线总学习时长须超过十分钟；<br>
                （2）且须按顺序学完所有视频学习资料。 -->
            </p>
        </div>
        <div class="close" @click="closeuse"></div>
        
    </div>
</template>
<script>
export default {
    methods: {
        closeuse(){
            this.$emit('closeuseguide')
        }
    },
    
}
</script>
<style>
    .close{
        width: 1.54rem;
        height: 1.54rem;
        background: url(../../static/img/close.png) no-repeat center center;
        background-size: cover;
        border-radius: 50%;
        margin: 0 auto;
    }
    .use_box{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .6);
        z-index: 9999;
    }
    .use_auto{
        width: 88%;
        height: 62%;
        margin:10% auto;
        background: #FFFFFF;
        border-radius: 0.6rem;
        padding: 1.5rem;
        box-sizing: border-box;
        overflow: auto;
    }
    .use_auto>h3{
        text-indent: 5px;
        position: relative;
        height: 1.11rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: #333333;
        line-height: 1.11rem;
        margin-bottom: 1rem;

    }
    .use_auto>h3>i{
        display: inline-block;
        width: 1.11rem;
        height: 1.11rem;
        background: linear-gradient(138deg, #69D0C4 0%, #00B09B 100%);
        opacity: 0.29;
        border-radius: 50%;
        position: absolute;
        top: -10px;
        left: 0;
    }
    .use_auto>p{
        font-size: 0.7rem;
        font-weight: 400;
        color: #333333;
        line-height: 1.05rem;
        text-align: justify;
    }
</style>