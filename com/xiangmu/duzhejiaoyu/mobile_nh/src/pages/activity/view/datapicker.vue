<template>
    <div>
        <!-- 日期表格 -->
        <Calendar
            v-on:choseDay="clickDay"
            v-on:changeMonth="changeDate"
            :markDateMore=arr
            ></Calendar>
        <div class="datepicker_box">
            <div v-for="(v,i) in dayactivity" :key="i">
                <h3>{{v.actName}}</h3>
                <p><i class="location"></i> {{v.actLocation}}</p>
                <p><i class="time"></i> {{util.formatTime(v.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(v.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                <span @click="godetail(v.id)">查看详情</span>
            </div>
        </div>

    </div>
</template>
<script>
import '../css/activity.css'
import code from '../js/code'
import util from '../js/util'
//vue文件中引入
import Calendar from 'vue-calendar-component';
export default {
    components:{Calendar},
    data() {
        return {
            value: new Date(),
            // arr:[{date:'2020/9/26',className:"mark1"}, {date:'2020/9/27',className:"mark2"}]
            arr:[],//多个标记示例
            dayactivity:[],//某一天的活动
            day:'',
            daymonth:''
        }
    },
    methods: {
        activityAppointmentgetMyMonthAppoint(year,month){
            this.dayactivity = [];
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
                    this.arr = [];
                    this.calendarData.forEach(e=>{
                        var obj = {
                            date:this.year+'/'+e.months[0]+'/'+e.days[0],
                            className:'mark2',
                            things:e.things
                        }
                        this.arr.push(obj)
                    })
                }
            })
        },
        activityAppointmentgetMyDayAppoint(day){
            // console.log(day)
            this.arr.forEach(e=>{
                if(e.date == day){
                    this.dayactivity = e.things;
                }
            })
            return
            this.dayactivity = [];
            util.postAjax({
                code: code.code,
                url: code.activityAppointmentgetMyDayAppoint,
                data:{
                    day: day
                }
            }).then(res => {
                if (res.success) {
                    this.dayactivity = res.items;
                }
            })
            
        },
        clickDay(data) {//选中某天
            var day = data.split('/');
            var month_,day_;
            if(day[1]<10){
                month_ = '0'+day[1]
            }else{
                month_ = day[1]
            }
            if(day[2]<10){
                day_ = '0'+day[2]
            }else{
                day_ = day[2]
            }
            var formatday = ''+day[0]+'/'+month_+'/'+day_;
            this.daymonth = month_;
            this.day = data;
            // console.log(data)
            // console.log(this.arr)
            this.activityAppointmentgetMyDayAppoint(data)
        },
        changeDate(data) {
            // console.log(data); //左右点击切换月份
            var day = data.split('/');
            var month_,year_;
            year_ = day[0]
            if(day[1]<10){
                month_ = '0'+day[1]
            }else{
                month_ = day[1]
            }
            this.activityAppointmentgetMyMonthAppoint(year_,month_);
            // console.log(this.day,this.daymonth)
            if(this.day && this.daymonth==month_){
                setTimeout(()=>{
                    this.activityAppointmentgetMyDayAppoint(this.day)
                },500)
            }
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
    created () {
        this.year = this.value.getFullYear();
        this.month = this.value.getMonth()+1;
        if (this.month >= 1 && this.month <= 9) {//月
	        this.month = "0" + this.month;
        }
        this.activityAppointmentgetMyMonthAppoint(this.year,this.month);
    }
}
 
</script>
<style scoped>
.van-calendar__top-info {
  background: linear-gradient(86deg, rgba(212, 165, 116, 0.98), rgba(238, 202, 163, 0.98));
}
</style>