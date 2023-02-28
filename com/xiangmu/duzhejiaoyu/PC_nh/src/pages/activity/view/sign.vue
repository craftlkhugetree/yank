<template>
<div>
    <div class="activityshow">
        <div class="activityshow_top clearfix">
            <div class="show_top_left" :style="'background:url('+viewIMG+activity.actPostImg+') no-repeat center center;background-size:cover;'"></div>
            <div class="show_top_right">
                <h3>{{activity.actName}}</h3>
                <span><i class="card"></i>{{activity.actTypeName}}</span>
                <p><i class="locationICON"></i>场地位置：<span>{{activity.actLocation}}</span></p>
                <p><i class="timeICON"></i>活动时间：<span>{{util.formatTime(activity.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(activity.gmtEnd,'YYYY-MM-DD hh:mm')}}</span></p>
                <p><i class="numICON"></i>活动人数：<span>{{activity.actLimitNum?activity.actLimitNum:'不限制'}}</span></p>
            </div>
        </div>
        <div class="signbox">
            <el-button v-if="formItemList.isOpenApply && isapply==0" type="primary" @click="signform">立即报名</el-button>
            <div v-if="sign||isapply==1">
                <h3>填写报名单</h3>
                <myform 
                    ref="childform"
                    :item="formItemList"
                    :isapply="isapply"
                    @submitform="submitform" 
                    />
            </div>
        </div>
        <div class="sign_bottom">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="活动详情" name="detail"></el-tab-pane>
                <el-tab-pane label="活动风采" name="wonderful"></el-tab-pane>
            </el-tabs>
            <div v-if="activeName=='wonderful'" class="wonderful">
                <ul v-if="total>0"  class="activityShow_imgs clearfix">
                    <li v-for="(v,i) in wonderfulFile" :key="i">
                        <div class="show_img" >
                            <img :preview="1" :src="viewIMG+v.fileId" alt="" width="auto" height="100%">
                            <!-- <img :preview="1" :src="' http://app.dev.angke.com.cn/fileweb/rest/FileOut/view/'+v.fileId" alt="" width="auto" height="100%"> -->
                            <!-- <img :src="viewIMG+v.fileId" alt=""> -->
                        </div>
                        <p class="show_text">{{v.fileRemark}}</p>
                    </li>
                </ul>
                <div v-html="wonderfulText"></div>
                <div v-if="total<1 && !wonderfulText" class="nodata">
                </div>
            </div>
            <div v-html="actDetail" v-if="activeName=='detail'"></div>
        </div>
        <!-- 报名成功的弹窗 -->
        <div class="signSuccess" v-if="showSign">
            <div class="signSuccess_">
                <div class="signSuccess_top">
                    <div></div>
                </div>
                <div class="signSuccess_bottom">
                    <h3>报名成功</h3>
                    <p>恭喜报名成功！可返回活动页继续报名</p>
                    <div class="btns">
                        <el-button size="mini" @click="gohome">返回首页</el-button>
                        <el-button size="mini" type="primary" @click="closesign">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import '../css/activity_.css'
import myform from '../components/form'
import code from '../js/code'
import util from '../js/util'
export default {
    props:{
        ID:Number
    },
    components: {
        myform
    },
    data() {
        return {
            activeName: 'detail',
            sign:false,
            showSign:false,
            actDetail:'',
            activity:'',
            total:0,
            wonderfulFile:[],
            wonderfulText:'',
            viewIMG:code.imgURL,
            isapply:'',
            formItemList: [
                // {checked: true,eltype: "input",label: "name",name: "姓名",placeholder: "1111",type: "0",value:'1111'}
            ]
        }
    },
    methods: {
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
                        console.log('this.formItemList', this.formItemList)
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
                }
            })

        },
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
       signform(){
            this.sign = true;
        },
        //返回首页
        gohome(){
            this.$router.push('activityIndex');
        },
        //关闭
        closesign(){
            this.showSign = false;
            this.$router.push('myactivity')
        },
        submitform(res){
            util.postAjax({
                code: code.code,
                url: code.activityAppointmenttoApply,
                data: {
                    actId:this.ID,
                    formInfo: JSON.stringify(res)
                }
            }).then(res => {
                if (res.success) {
                    if(res.item==0){
                        this.showSign = true;
                    }else{
                        this.$message({
                            message: res.message,
                            type: 'warning'
                        });
                    }
                    
                }
            })

            
        },
        handleClick(tab, event) {
            this.$previewRefresh()
        },
        setDefaultValue() {

        }
    },
    created () {
        this.activityTextgetImgText();
        this.activityFiledetailShow();
        this.activityAppointmentgetAppoint();
    }
}
</script>
