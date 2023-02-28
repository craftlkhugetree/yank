<template>
    <div class="detail_box">
        <div class="detail_top" :style="'background:url('+viewIMG+activity.actPostImg+') no-repeat center center;background-size:cover;'">
            <div class="detail_topIMG" >
                <div class="detailtopIMG_title">
                    <i>{{activity.actTypeName}}</i>
                    <span>{{activity.actName}}</span>
                </div>
                <div class="detailtopIMG_text">
                    <p><i class="location"></i><span>场地位置：</span>{{activity.actLocation}}</p>
                    <p><i class="time"></i><span>活动时间：</span>{{util.formatTime(activity.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(activity.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                    <p><i class="personNUM"></i><span>活动人数：</span>{{activity.actLimitNum}}</p>
                </div>
            </div>
        </div>
        <div class="detail_botttom">
            <div class="detail_tab">
                <span :class="{'act':tabname=='detail'}" @click="changeTab('detail')">活动详情<i></i></span>
                <span :class="{'act':tabname=='show'}" @click="changeTab('show')">活动风采<i></i></span>
            </div>
        </div>
        <div class="detail_tabdetail" v-if="tabname=='detail'" v-html="actDetail">
        </div>
        <div class="detail_tabdetail1" v-else>
            <h3>照片墙</h3>
            <transition>
            <ul class="clearfix">
                <li v-for="(v,i) in wonderfulFile" :key="i" >
                    <img :preview="1" :src="viewIMG+v.fileId" alt="" width="auto" height="100%">
                    <!-- <img :preview="1" :src="'http://app.dev.angke.com.cn/fileweb/rest/FileOut/view/'+v.fileId" alt="" width="auto" height="100%"> -->
                    <p>{{v.fileRemark}}</p>
                </li>
            </ul>
            </transition>
        </div>
        <div class="detail_tabdetail1" v-if="tabname=='show'&&wonderfulText" v-html="wonderfulText">
        </div>
        <div class="detailbtn" >
            <span @click="goback">返回</span>
            <span class="sign" @click="sign">立即报名</span>
        </div>
    </div>
</template>
<script>
import '../css/activity.css'
import code from '../js/code'
import util from '../js/util'
export default {
    props:{
        ID:Number
    },
    data() {
        return {
            tabname:'detail',
            activity:'',
            actDetail:'',
            formItemList: [
                // {checked: true,eltype: "input",label: "name",name: "姓名",placeholder: "1111",type: "0",value:'1111'}
            ],
            wonderfulFile:[],
            wonderfulText:'',
            viewIMG:code.imgURL,
            isapply:'',
            formItemList: {
                // {checked: true,eltype: "input",label: "name",name: "姓名",placeholder: "1111",type: "0",value:'1111'}
            }
        }
    },
    methods: {
        //获取活动详情
        activityActivitydetail(type){
            util.postAjax({
                code: code.code,
                url: code.activityActivitydetail,
                data: {
                    id:this.ID
                }
            }).then(res => {
                if (res.success) {
                    this.activity = res.item.activity;
                    this.actDetail = res.item.actDetail;
                    if(type=='0'){
                        this.formItemList = res.item.form;
                        this.formItemList.formInfo.forEach(e => {
                            e.disabled = false;
                        });
                    }
                }
            })
        } ,
        activityTextgetImgText(){
            util.postAjax({
                code: code.code,
                url: code.activityTextgetImgText,
                data: {
                    actId:this.ID
                }
            }).then(res => {
                if (res.success) {
                    this.wonderfulText = res.item.textText;
                }
            })
        },
        activityFiledetailShow(){
            util.postAjax({
                code: code.code,
                url: code.activityFiledetailShow,
                data: {
                    actId:this.ID
                }
            }).then(res => {
                if (res.success) {
                    this.wonderfulFile = res.items;
                    this.total = res.total;
                    this.$previewRefresh();  
                }
            })
        },
        changeTab(val){
            this.tabname = val;
            this.$previewRefresh();  
        },
        goback(){
            this.$router.push('allactivity')
        },
        activityAppointmentgetAppoint(){
            util.postAjax({
                code: code.code,
                url: code.activityAppointmentgetAppoint,
                data: {
                    actId:this.ID,
                    isMe: true,
                }
            }).then(res => {
                if (res.success) {
                    this.isapply = res.message;
                    if(res.message==0){
                        this.activityActivitydetail('0');
                    }else{
                        this.activityActivitydetail('1');
                        this.formItemList = {
                            formInfo:JSON.parse(res.item.formInfo)
                        };
                        this.formItemList.formInfo.forEach(e => {
                            e.disabled = true;
                        });
                    }
                    
                }
            })

        },
        //获取活动详情
        activityActivitydetail(type){
            util.postAjax({
                code: code.code,
                url: code.activityActivitydetail,
                data: {
                    id:this.ID
                }
            }).then(res => {
                if (res.success) {
                    this.activity = res.item.activity;
                    this.actDetail = res.item.actDetail;
                    if(type=='0'){
                        this.formItemList = res.item.form;
                        this.formItemList.formInfo.forEach(e => {
                            e.disabled = false;
                        });
                    }
                }
            })
        } ,
        sign(){
            window.sessionStorage.setItem('formItemList',JSON.stringify(this.formItemList))
            window.sessionStorage.setItem('signID',this.ID)
            window.sessionStorage.setItem('activityNAME',this.activity.actName)
            this.$router.push({
                path:'sign',
                query:{
                    apply:this.isapply,
                    // activityNAME:this.activity.actName
                }
            })
        }
    },
    created () {
        this.activityTextgetImgText();
        this.activityFiledetailShow();
        this.activityActivitydetail(this.ID);
        this.activityAppointmentgetAppoint();
    }
}
</script>