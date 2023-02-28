<template>
    <div class="activityshow">
        <div class="activityshow_top clearfix">
            <div class="show_top_left" :style="'background:url('+viewIMG+ruleForm.actPostImg+') no-repeat center center;background-size:contain;'"></div>
            <div class="show_top_right">
                <h3>{{ruleForm.actName}}</h3>
                <span><i class="card"></i>{{ruleForm.TypeName}}</span>
                <p><i class="locationICON"></i>场地位置：<span>{{ruleForm.actLocation}}</span></p>
                <p><i class="timeICON"></i>活动时间：<span>{{ymd(ruleForm.actTime[0])}} ~ {{ymd(ruleForm.actTime[1])}}</span></p>
                <p><i class="numICON"></i>活动人数：<span>{{ruleForm.actLimitNum}}</span></p>
            </div>
        </div>
        <div class="activity_signbox">
            <el-button type="primary" @click="signform">立即报名</el-button>
        </div>
        <div class="activity_detail">
            <h3>活动详情</h3>
            <div v-html="actDetail">
            </div>
        </div>
    </div>
</template>
<script>
import code from '../js/code'
export default {
    props:{
        ruleForm:Object,
        actDetail:String
    },
    data() {
        return {
            viewIMG:code.imgURL,
        }
    },
    methods: {
        ymd(myDate) {
            // var myDate = new Date(time);
            var month = myDate.getMonth() + 1;
            if (month >= 1 && month <= 9) { //月
                month = "0" + month;
            }
            var strDate = myDate.getDate();
            if (strDate >= 0 && strDate <= 9) { //日
                strDate = "0" + strDate;
            }
            var hour = myDate.getHours(); // 时

            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            var minutes = myDate.getMinutes(); // 分
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }
            var seconds = myDate.getSeconds(); // 分
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + seconds;
            }
            return ''+myDate.getFullYear()+'-' + month +'-' + strDate+' ' +hour+':' +minutes+':' +seconds;
        },
    },
    created() {
        console.log(this.ruleForm)
    },
    
}
</script>
<style scoped>
.activityshow{
    width: 100%;
    margin: 0 auto;
}
.activityshow_top{
    width: 100%;
    border-radius: 4px;
    background: #fff;
}
.show_top_left{
    width: 40%;
    height: 220px;
    background: red;
    float: left;
}
.show_top_right{
    width: calc(60% - 20px);
    height: 100%;
    float: right;
}
.show_top_right>h3,.activity_detail>h3{
    width: 100%;
    font-size: 22px;
    font-weight: 500;
    color: #1F232F;
    line-height: 30px;
    letter-spacing: 1px;
    white-space: normal;
}
.show_top_right>span{
    display: inline-block;
    width: 118px;
    height: 31px;
    background: url(../static/imgs/activityImg.png) no-repeat center center;
    background-size: cover;
    border-radius: 5px;
    margin-top: 18px;
    margin-bottom: 38px;
    font-size: 14px;
    font-weight: 500;
    color: #FF9D2F;
    line-height: 31px;
    letter-spacing: 1px;
    position: relative;
    text-align: center;
}
.card{
    display: inline-block;
    width: 15px;
    height: 14px;
    background: url(../static/imgs/card.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    left: 9px;
    top: 8.5px;

}
.show_top_right>p{
    width: 100%;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    color: #62656D;
    line-height: 22px;
    margin-bottom: 24px;
}
.locationICON,.timeICON,.numICON{
    display: inline-block;
    width: 15px;
    height: 14px;
    background: #000000;
    margin-right: 16px;
}
.locationICON{
    background: url(../static/imgs/location.png) no-repeat center center;
    background-size: contain;
}
.timeICON{
    background: url(../static/imgs/time.png) no-repeat center center;
    background-size: contain;
}
.numICON{
    background: url(../static/imgs/personnum.png) no-repeat center center;
    background-size: contain;
}
.show_top_right>p>span{
    font-size: 16px;
    font-weight: 400;
    color: #1F232F;
}
.activityshow_bottom{
    width: 100%;
    height: 874px;
    background: #FFFFFF;
    border-radius: 4px;
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
}
.activity_signbox{
    width: 100%;
    background: #fff;
}
.signbox h3{
    width: 100%;
    height: 16px;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 16px;
    margin-bottom: 24px;
    margin-top: 24px;
}
.activity_detail,.activity_detail>div{
    margin-top: 24px;
    overflow: auto;
}
</style>