<template>
    <div class="use_box">
        <div class="use_auto">
            <h3>使用规则</h3>
            <p>同学们需提前完成入馆教育考试，只有顺利通过考试的同学（可多次考试），方可激活校园卡的图书借还功能，顺利进入图书馆借阅图书。<br>
                <!-- 1、在线学习规则：<br>
                （1）本科新生需学习视频全部看完后，方可解锁下一条学习内容；<br>
                （2）视频播放时不可退出，退出后需要重新进入学习；<br>
                （3）研究生对视频学习无要求，文档学习时长均不限。<br>
                2、在线考试规则：<br>
                （1）在线总学习时长须超过十分钟；<br>
                （2）且须按顺序学完所有视频学习资料。 -->
            </p>
            <div class="close" @click="closeuse">知道啦</div>
        </div>
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
        width: 45%;
        /* height: 46%; */
        margin:10% auto;
        background: #FFFFFF;
        border-radius: 0.6rem;
        padding-bottom: 20px;
        box-sizing: border-box;
    }
    .use_auto>h3{
        height: 92px;
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        line-height: 92px;
        position: relative;
        padding: 0 50px;
        box-sizing: border-box;
    }
    .use_auto>h3>i{
        display: inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        right: 50px;
        top: 38px;
    }
    .use_auto>p{
        padding: 40px 50px;
        box-sizing: border-box;
        width: 100%;
        background: #F7F7F7;
        font-size: 0.7rem;
        font-weight: 400;
        color: #333333;
        line-height: 1.05rem;
        text-align: justify;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 21px;
    } 
    .close{
        width: 136px;
        height: 32px;
        background: linear-gradient(90deg, #2DABFF 0%, #1472FF 100%);
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 32px;
        text-align: center;
        margin: 20px auto 0;
    }
</style>