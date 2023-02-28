<template>
    <div class="signbox">
        <div class="sign_img">
            <!-- <div class="signImg_top"></div> -->
            <div class="qrcode signImg_top" id="qrcode" ref="qrCodeUrl"></div>
            <div class="signImg_text">
                <h3>{{activity.actName}}</h3>
                <p><i class="location"></i><span class="signName">场地位置：</span><span class="signText">{{activity.actLocation}}</span></p>
                <p><i class="activityTime"></i><span class="signName">活动时间：</span><span>{{util.formatTime(activity.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(activity.gmtEnd,'YYYY-MM-DD hh:mm')}}</span></p>
                <p><i class="activityNum"></i><span class="signName">活动人数：</span><span>{{activity.actLimitNum}}</span></p>
                <div class="signDown" @click="downLoad">下载</div>
            </div>
        </div>
    </div>
</template>
<script>
import "../css/activity_css.css";
import axios from 'axios'
import util from '../js/util'
import code from '../js/code'
import QRCode from 'qrcodejs2'
export default {
    props:{
        ID:Number
    },
    data () {
        return {
            activity:''
        }
    },
    methods: {
        activityActivitydetail(id){
           util.postAjax({
                code: code.code,
                url: code.activityActivitydetail,
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.success){
                    this.activity = res.item.activity
                }
            })
        },
        creatQrCode(id) {
            var qrcode = new QRCode(this.$refs.qrCodeUrl, {
                // text: code.baseURL+code.activityAppointmenttoSign+'?appointmentId='+id, // 需要转换为二维码的内容
                text: code.baseURL1+'sign.jsp?authType=lresnh&activityId='+id, // 需要转换为二维码的内容
                colorDark: '#000000',
                colorLight: '#ffffff',
                // correctLevel: QRCode.CorrectLevel.H
            })
        },
        downLoad() {
           let myCanvas = document.getElementById('qrcode').getElementsByTagName('canvas');
           let a = document.createElement('a')
           a.href = myCanvas[0].toDataURL('image/png');
           a.download = '二维码';
           a.click()
           this.$message({
               message: "正在进行下载保存",
               type: 'success'
           })
        },
    },
    created() {
        this.activityActivitydetail(this.ID);
        
    },
    mounted() {
        setTimeout(()=>{
            this.creatQrCode(this.ID);
        },200)
    },
    
}
</script>
<style scoped>

</style>