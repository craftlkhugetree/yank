<template>
<div>
    <div class="activityIndex">
        <!-- <div>
            <el-input placeholder="请输入内容" class="index_search" prefix-icon="el-icon-search" v-model="searchname">
            </el-input>
            <el-button type="primary">搜索</el-button>
        </div> -->
        <div class="index_top clearfix">
            <div class="index_top_left">
                <h3>最新活动 <span @click="seeMore">查看更多</span></h3>
                <el-carousel class="newcarousel" indicator-position="none" >
                    <el-carousel-item v-for="(v,i) in ActivityCarousel" :key="i" :style="'background:url('+viewIMG+v.actPostImg+') no-repeat center center;background-size:cover;'">
                        <h3>{{v.actName}}</h3>
                        <p>{{v.actLocation}}</p>
                        <p>{{util.formatTime(v.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(v.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                    </el-carousel-item>
                    <div class="newcarouselbox"> </div>
                </el-carousel>
            </div>
            <div class="index_top_right">
                <h3>活动日历</h3>
                <div>
                    <el-calendar v-model="value" id="calendar">
                        <template
                        slot="dateCell"
                        slot-scope="{date, data}">
                            <!--自定义内容-->
                            <div>
                                <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
                                    <div v-for="item in calendarData" :key="item.id">
                                    <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                                        <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1"  @mouseleave="outcalendar(item)" @mouseover="hovercalendar(item)">
                                            <div class="selectedcircel">
                                                <i></i>
                                                <div v-if="item.selected">
                                                    <p v-for="v in item.things" :key="v.id" @click="activityActivitydetail(v.id)">{{v.actName}};</p> 
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else></div>
                                    </div>
                                <div v-else></div>
                                </div>
                            </div>
                        </template>
                    </el-calendar>
                </div>
            </div>
        </div>
        <div class="index_middle">
            <h3>发现活动<span @click="seeMore">查看更多</span></h3>
            <div v-for="(v,i) in findActivityList" :key="i">
                <h4 v-if="v.activityList.length>0">{{v.typeName}}</h4>
                <ul class="theme_act clearfix" v-if="v.activityList.length>0">
                    <li v-for="item in v.activityList" :key="item.id" @click="activityActivitydetail(item.id)">
                        <div class="li_top" :style="'background:url('+viewIMG+item.actPostImg+') no-repeat center center;'"></div>
                        <h3>{{item.actName}}</h3>
                        <p>{{item.actLocation}}</p>
                        <p>{{util.formatTime(item.gmtStart,'YYYY-MM-DD hh:mm')}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="index_bottom">
            <h3>精彩回顾<span @click="seeMore">查看更多</span></h3>
            <el-carousel :interval="4000" type="card" height="401px">
                <el-carousel-item v-for="item in wonderfulReview" :key="item.id" >
                    <div class="carousIMG_" @click="activityActivitydetail(item.id)">
                        <div class="carousIMG" :style="'background:url('+viewIMG+item.actPostImg+') no-repeat center center;'">
                            <h3 class="medium">{{item.actName}}</h3>
                            <p>
                                {{item.actLocation}} <br>
                                {{util.formatTime(item.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(item.gmtEnd,'YYYY-MM-DD hh:mm')}}
                            </p>
                        </div>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</div>
</template>

<script>
import '../css/activity_.css'
import util from '../js/util'
import code from '../js/code'
export default {
    data() {
        return {
            searchname:'',
            ActivityCarousel:[],
            findActivityList:[],
            wonderfulReview:[],
            viewIMG:code.imgURL,
            calendarData: [
                // { months: ['09', '11'],days: ['15'],things: [{id:1,name:'看电影'},{id:1,name:'看电影1'}] ,selected:false},
            ],
            value: new Date(),
            year:'',
            month:''
        }
    },
    methods: {
        activityAppointmentgetMyMonthAppoint(year,month){
            util.postAjax({
                code: code.code,
                url: code.getMonthAppoint,
                data:{
                    year: year,
                    month: month
                }
            }).then(res => {
                if (res.success) {
                    this.calendarData = res.items;
                }
            })

        },
        hovercalendar(item){
            item.selected = true;
        },
        outcalendar(item){
            item.selected = false;
        },
        //获取活动轮播图
        activityActivitygetCarousel(){
            util.postAjax({
                code: code.code,
                url: code.activityActivitygetCarousel,
            }).then(res => {
                if (res.success) {
                    this.ActivityCarousel = res.items;
                }
            })
        },
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
        //活动详情
        activityActivitydetail(id){
            this.$router.push({
                path:'sign',
                query:{
                    ID:id
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
        //查看更多
        seeMore(){
            this.$router.push('allactivity')
        },
    },
    created() {
        this.year = this.value.getFullYear();
        this.month = this.value.getMonth()+1;
        if (this.month >= 1 && this.month <= 9) {//月
	        this.month = "0" + this.month;
        }
        this.activityAppointmentgetMyMonthAppoint(this.year,this.month);
        this.activityActivitygetCarousel();
        this.activityTypefindActivity();
        this.activityActivitywonderfulReview();
    },
    mounted(){
        this.$nextTick(() => {
            // 点击前一个月
            let prevBtn = document.querySelector(
                '.el-calendar__button-group .el-button-group>button:nth-child(1)');
            prevBtn.addEventListener('click', () => {
                console.log(this.value);
                var year = this.value.getFullYear();
                var month = this.value.getMonth()+1;
                if (month >= 1 && month <= 9) {//月
                    month = "0" + month;
                }
                this.activityAppointmentgetMyMonthAppoint(year,month);
            })
        })


        this.$nextTick(() => {
            // 点击后一个月
            let prevBtn = document.querySelector(
                '.el-calendar__button-group .el-button-group>button:last-child');
            prevBtn.addEventListener('click', () => {
                console.log(this.value);
                var year = this.value.getFullYear();
                var month = this.value.getMonth()+1;
                if (month >= 1 && month <= 9) {//月
                    month = "0" + month;
                }
                this.activityAppointmentgetMyMonthAppoint(year,month);
            })
        })
    }

}
</script>
