<template>
    <div class="myactivity_box">
        <h3>共{{total}}个活动</h3>
         <van-list
            class="vantlist"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="activityAppointmentgetMyAct"
            >
            <div v-for="(v,i) in myactivityList" :key="i" @click="godetail(v.actId)">
                <div class="liIMG" :style="'background:url('+viewIMG+v.actPostImg+') no-repeat center center;background-size:contain;'">
                    <i>{{v.actTypeName}}</i>
                </div>
                <div class="liTEXT">
                    <!-- actState   0未开始报名1报名中2活动进行中3活动结束 -->
                    <h3><i>{{v.actState=='1'?'报名中':v.actState=='3'?'活动结束':''}}</i><span>{{v.actName}}</span></h3>
                    <p>{{v.actLocation}}</p>
                    <p>{{util.formatTime(v.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(v.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                </div>
            </div>
        </van-list>
        <div class="myactivity_back" @click="goback">返回</div>
    </div>
</template>
<script>
import '../css/activity.css'
import code from '../js/code'
import util from '../js/util'
export default {
    data() {
        return {
            limit: 10,
            page: 1,
            total: 0,
            loading:false,
            finished:false,
            myactivityList:[],
            viewIMG:code.imgURL
        }
    },
    methods: {
        activityAppointmentgetMyAct(){
            this.loading=true;
            util.postAjax({
                code: code.code,
                url: code.activityAppointmentgetMyAct,
                data: {
                    page: this.page,
                    limit: this.limit,
                }
            }).then(res => {
                // if (res.success) {
                //     console.log(res)
                //     this.myactivityList = res.items;
                //     this.total = res.total;
                // }
                if (res.success && res.items) {
                    this.total = res.total;
                    if(res.items.length < this.limit || res.items.length ==0){
                        this.loading = false;
                        this.finished = true;
                    }else {
                        this.loading = false;
                        this.page++;
                        this.finished = false;
                    }
                    for (var i =0; i< res.items.length;i++){
                        this.myactivityList.push( res.items[i]);
                    }
                }else{
                    this.loading=false;
                    this.finished=true;
                    this.myactivityList=[];
                    // this.Toast('获取列表失败');
                }
            })
        },
        goback(){
            this.$router.push('allactivity')
        },
        godetail(id){
            this.$router.push({
                path:'activitydetail',
                query:{
                    ID:id
                }
            })
        }
    },
    created() {
        this.activityAppointmentgetMyAct()
    },
    
}
</script>