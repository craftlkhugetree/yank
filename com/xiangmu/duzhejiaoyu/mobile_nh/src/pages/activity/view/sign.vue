<template>
    <div>
        <myform 
            ref="childform"
            :item="formItemList"
            :isapply="apply"
            @submitform="submitform" 
            />
            <!-- 报名成果的弹窗 -->
            <div class="signsuccess" v-if="signsuccess">
                <div class="signsuccess_">
                    <span></span>
                    <h3>恭喜报名成功！</h3>
                    <p>您已成功报名{{activityNAME}}</p>
                    <div @click="close">确定</div>
                </div>
            </div>
    </div>
</template>
<script>
import myform from '../components/form'
import code from '../js/code'
import util from '../js/util'
import '../css/activity.css'
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
export default {
    props:{
        apply:String,
        // activityNAME:String
    },
    components:{myform},
    data() {
        return {
            viewIMG:code.imgURL,
            formItemList:{},
            ID:'',
            signsuccess:false,
            activityNAME:''
        }
    },
    methods: {
        goback(){
            this.$router.push({
                path:'activitydetail',
                query:{
                    ID:this.ID
                }
            })
        },
        signcomform(){

        },
        close(){
            this.signsuccess = false;
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
                        this.signsuccess = true;
                    }else{
                        Toast(res.message);
                    }
                    
                }
            })
        },
    },
    created() {
        this.formItemList = JSON.parse(window.sessionStorage.getItem('formItemList'))
        this.ID = window.sessionStorage.getItem('signID')
        this.activityNAME =  window.sessionStorage.getItem('activityNAME')
        console.log(this.apply,this.ID)
        
    },
    
}
</script>