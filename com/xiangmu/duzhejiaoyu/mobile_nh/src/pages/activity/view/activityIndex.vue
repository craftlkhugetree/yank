<template>
<div class="index_box">
    <div class="index_top clearfix">
        <van-search class="index_input" @focus="seeMore" v-model="searchname" shape="round" background="#fff" placeholder="请输入搜索关键词" />
        <span class="dateICON" @click="godate"></span>
    </div>
    <div class="findActivity" v-for="(v,i) in findActivityList" :key="i">
        <h3 v-if="v.activityList.length>0">{{v.typeName}} <span @click="seeMore">全部</span></h3>
        <ul v-if="v.activityList.length>0">
            <li class="findLi" v-for="item in v.activityList" :key="item.id" @click="activityActivitydetail(item.id)">
                <div class="findIMG" :style="'background:url('+viewIMG+item.actPostImg+') no-repeat center center;background-size:contain;'"></div>
                <div class="findTEXT">
                    <h3>{{item.actName}}</h3>
                    <p>{{item.actLocation}}</p>
                    <p>{{util.formatTime(item.gmtStart,'YYYY-MM-DD hh:mm')}}</p>
                </div>
            </li>
        </ul>
    </div>
    <div class="findActivity">
        <h3>精彩回顾 <span @click="seeMore">全部</span></h3>
        <ul>
            <li class="findshowLi" v-for="(item,i) in wonderfulReview" :key="i" @click="activityActivitydetail(item.id)">
                <div class="findshowLiIMG" :style="'background:url('+viewIMG+item.actPostImg+') no-repeat center center;background-size:contain;'">
                    <h3>{{item.actName}}</h3>
                </div>
                <div class="findshowLiTEXT">
                    <p>{{item.actLocation}}</p>
                    <p>{{util.formatTime(item.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(item.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                </div>
            </li>
        </ul>
    </div>
</div>
</template>
<script>
import '../css/activity.css'
import code from '../js/code'
import util from '../js/util'
export default {
    data() {
        return {
            searchname:'',
            findActivityList:[],
            wonderfulReview:[],
            viewIMG:code.imgURL,
        }
    },
    methods: {
        //发现活动
        activityTypefindActivity(){
            util.postAjax({
                code: code.code,
                url: code.activityTypefindActivity,
                data:{
                    typeNum: 3,
                    activityNum: 4
                }
            }).then(res => {
                if (res.success) {
                    this.findActivityList = res.items;
                }
            })
        },
        //精彩回顾
        activityActivitywonderfulReview(){
            util.postAjax({
                code: code.code,
                url: code.activityActivitywonderfulReview,
            }).then(res => {
                if (res.success) {
                    this.wonderfulReview = res.items;
                }
            })
        },
        seeMore(){
            this.$router.push('allactivity')
        },
        //活动详情
        activityActivitydetail(id){
            this.$router.push({
                path:'activitydetail',
                query:{
                    ID:id
                }
            })
        },
        godate(){
            this.$router.push('datapicker')
        }
    },
    created() {
        this.activityTypefindActivity();
        this.activityActivitywonderfulReview();
    },
}
</script>
