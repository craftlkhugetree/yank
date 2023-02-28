<template>
<div id="calendar" :class="{'change':isChange}">
    <!-- 年份 月份 -->
    <div class="month">
        <div>
            <i class="icon iconfont icon-ic_back_ arrowL" @click="back"></i>
            <span class="top-time">{{this.currentYear}}年{{this.currentMonth}}月</span>
        </div>
    </div>
    <!-- 星期 -->
    <ul class="weekdays">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
    </ul>
    <!-- 日期 -->
    <ul class="days" :class="{'fadeOut':fadeOut,'fadeIn':fadeIn,'fadeOutR':fadeOutR,'fadeInR':fadeInR}" @touchstart="allTouchStart" @touchend="allTouchEnd" @touchstart.stop="touchStart" @touchend.stop="touchEnd">
        <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
        <li v-for="(dayobject,index) in days" :class="{'weekend':(index%7 == 0)||((index+1)%7 == 0)}" :key="index">
            <!--本月-->
            <!--如果不是本月 改变类名加灰色-->
            <div v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</div>
            <!--如果是本月 还需要判断是不是这一天-->
            <div v-else class="everyDay">
                <!--今天 同年同月同日-->
                <div @click="getDayMessage(currentYear,currentMonth,dayobject.day.getDate(),index)" v-if="dayobject.day.getFullYear() == new Date().getFullYear()
&& dayobject.day.getMonth() == new Date().getMonth()
&& dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}
                </div>
                <div :class="{'otherday':index == otherDay}" v-else @click="getDayMessage(currentYear,currentMonth,dayobject.day.getDate(),index)">
                    {{ dayobject.day.getDate() }}
                </div>
                <div :class="{'circle':dayobject.status==3,'o':dayobject.status==2}"></div>
            </div>
        </li>
    </ul>
    <!--背景色-->
    <div class="background" :class="{'change':isChange}">
        <div v-for="(value,index) in 5" :class="{'dbg':(index%2==0),'lbg':(index%2!=0)}" :key="index"></div>
    </div>
</div>
</template>

<script>
// import '../../../public/fonts/iconfont.css'

// import {
//     sign
// } from '@/public/js/corpty.js'

export default {

    data() {

        return {

            currentDay: 1,

            currentMonth: 1,

            currentYear: 1970,

            currentWeek: 1,

            days: [],

            // 上下滑动的鼠标位置

            positionSX: '',

            positionEX: '',

            positionSY: '',

            positionEY: '',

            isChange: false,

            userDataUrl: '/punchTime/getMonthPunchInfo',

            userDayUrl: '/punchTime/getDayPunchInfo',

            // 左右滑动动画的初始状态

            show: true,

            fadeOut: false,

            fadeIn: false,

            fadeOutR: false,

            fadeInR: false,

            monthList: [],

            status: '',

            otherDay: '',

        }

    },

    created: function () {

        this.initData(null);

    },

    mounted() {

        var t = new Date();

        var time = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate()

        this.getMonth(time)

    },

    methods: {

        getDayMessage(y, m, d, index) {

            var str = this.formatDate(y, m, d)

            this.$emit('changeL', str, m, d)

            this.otherDay = index;

        },

        back() {

            this.$router.goBack();

        },

        getMonth(time) {

            var timestamp = Date.parse(new Date());

            var obj = {

                date: time,

            }

            var Params = JSON.stringify(obj)

            this.$http.post(this.host + this.userDataUrl, {

                request: obj,

                token: this.$cookie.get("token"),

                service: this.userDataUrl,

                //传入的顺序依次是获得的severKey，cookie的token，请求的url,事件戳，和包裹request的对象

                sign: sign(this.$cookie.get("serverKey"), this.$cookie.get("token"), this.userDataUrl, timestamp, Params),

                timestamp: timestamp

            }).then(response => {

                // console.log(response.data.response.content[0])

                this.monthList = response.data.response.content

                for (var i = 0; i < this.days.length; i++) {

                    for (var j = 0; j < response.data.response.content.length; j++) {

                        if (new Date(response.data.response.content[j].date).toLocaleString() == this.days[i].day.toLocaleString()) {

                            this.days[i].status = response.data.response.content[j].status

                        }

                    }

                }

            }).catch((error) => {

                console.log(error);

            });

        },

        //向下滑监听坐标

        allTouchStart: function (e) {

            //开始x轴坐标

            this.positionSX = e.changedTouches[0].clientX;

            //开始y轴坐标

            this.positionSY = e.changedTouches[0].clientY;

        },

        allTouchEnd: function (e) {

            //结束x轴坐标

            this.positionEX = e.changedTouches[0].clientX;

            //结束y轴坐标

            this.positionEY = e.changedTouches[0].clientY;

            var distanceY = this.positionEY - this.positionSY;

            var distanceX = this.positionSX - this.positionEX;

            //判断滑动的方向

            if (distanceY < -30 && Math.abs(distanceY) > Math.abs(distanceX)) {

                this.isChange = true;

            }

            if (distanceY > 30 && Math.abs(distanceY) > Math.abs(distanceX)) {

                this.isChange = false;

            }

        },

        //监听左右滑动坐标

        touchStart: function (e) {

            //开始x轴坐标

            this.positionSX = e.changedTouches[0].clientX;

            //开始y轴坐标

            this.positionSY = e.changedTouches[0].clientY;

        },

        touchEnd: function (e) {

            this.show = !this.show

            //结束x轴坐标

            this.positionEX = e.changedTouches[0].clientX;

            //结束y轴坐标

            this.positionEY = e.changedTouches[0].clientY;

            var distanceY = this.positionEY - this.positionSY;

            var distanceX = this.positionSX - this.positionEX;

            //判断滑动 的方向

            if (distanceX > 30 && Math.abs(distanceY) < Math.abs(distanceX)) {

                this.pickNext(this.currentYear, this.currentMonth)

                //             淡出

                this.fadeOut = true;

                this.fadeIn = false;

                this.fadeInR = false;

                this.fadeOutR = false;

                var that = this;

                setTimeout(function () {

                    that.fadeIn = true;

                    that.fadeOut = false;

                    that.fadeOutR = false;

                    that.fadeInR = false

                }, 300)

            }

            if (distanceX < -30 && Math.abs(distanceY) < Math.abs(distanceX)) {

                this.pickPre(this.currentYear, this.currentMonth)

                this.fadeOutR = true;

                this.fadeInR = false;

                this.fadeOut = false;

                this.fadeIn = false;

                var that = this;

                setTimeout(function () {

                    that.fadeInR = true;

                    that.fadeOutR = false;

                    that.fadeOut = false;

                    that.fadeIn = false;

                }, 300)

            }

        },

        touchmove: function (e) {

        },

        initData: function (cur) {

            var leftcount = 0; //存放剩余数量

            var date;

            if (cur) {

                date = new Date(cur);

            } else {

                var now = new Date();

                var t = this.formatDate(now.getFullYear(), now.getMonth(), 1)

                var d = new Date(t);

                d.setDate(35);

                date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));

            }

            this.currentDay = date.getDate();

            this.currentYear = date.getFullYear();

            this.currentMonth = date.getMonth() + 1;

            this.currentWeek = date.getDay();

            var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);

            this.days.length = 0;

            //初始化本周

            for (var i = this.currentWeek; i >= 0; i--) {

                var d = new Date(str);

                d.setDate(d.getDate() - i);

                var dayobject = {}; //用一个对象包装Date对象 以便为以后预定功能添加属性

                dayobject.day = d;

                dayobject.status = '';

                this.days.push(dayobject); //将日期放入data 中的days数组 供页面渲染使用

            }

            //其他周

            for (var i = 1; i <= 34 - this.currentWeek; i++) {

                var d = new Date(str);

                d.setDate(d.getDate() + i);

                var dayobject = {};

                dayobject.day = d;

                dayobject.status = '';

                this.days.push(dayobject);

            }

        },

        //     上个月信息

        pickPre: function (year, month) {

            var d = new Date(this.formatDate(year, month, 1));

            d.setDate(0);

            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));

            this.getMonth(d.getFullYear() + "-" + (d.getMonth() + 1) + "-1")

        },

        // 下个月信息

        pickNext: function (year, month) {

            var d = new Date(this.formatDate(year, month, 1));

            d.setDate(35);

            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));

            this.getMonth(d.getFullYear() + "-" + (d.getMonth() + 1) + "-1");

        },

        // 补零处理

        formatDate: function (year, month, day) {

            var y = year;

            var m = month;

            if (m < 10) m = "0" + m;

            var d = day;

            if (d < 10) d = "0" + d;

            return y + "-" + m + "-" + d

        },

    },

}
</script>

<style scoped>
body {

    font-family: Verdana, sans-serif;

    background: #E8F0F3;

}

.change {

    /*height:84px !important;*/

    height: 250px !important;

}

.days {

    /*transition:all 0.5s;*/

    overflow: hidden;

    position: relative;

    height: 210px;

}

.days span {

    display: inline-block;

    height: 40px;

    width: 40px;

    text-align: center;

    line-height: 40px;

    position: absolute;

    top: 0;

    left: 0;

    right: 0;

    bottom: 0;

    margin: auto;

}

.background {

    position: absolute;

    top: 100px;

    height: 211px;

    width: 100%;

    z-index: -1;

    overflow: hidden;

    transition: all 0.5s;

}

.dbg {

    background-color: #E1E1E1;

    height: 42.2px;

}

.lbg {

    background-color: #D5D5D5;

    height: 42.2px;

}

#calendar {

    width: 100%;

    /*height: 640px;*/

    height: 850px;

    margin: 0 auto;

    transition: all 0.5s;

    overflow: hidden;

}

.month ul {

    margin: 0;

    padding: 0;

    display: flex;

    justify-content: space-between;

}

.year-month {

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: space-around;

}

.month {

    width: 100%;

    background: #FAFAFA;

    padding: 15px;

    font-size: 20px;

    text-align: left;

    color: #000;

}

.top-time {

    padding-left: 30px;

}

.weekdays {

    margin: 0;

    height: 48px;

    padding: 10px 0;

    font-size: 20px;

    background-color: #D5D5D5;

    display: flex;

    flex-wrap: wrap;

    color: #212121;

    justify-content: space-around;

}

.weekdays li {

    display: inline-block;

    width: 13.6%;

    text-align: center;

}

.days {

    padding: 0;

    margin: 0;

    display: flex;

    flex-wrap: wrap;

    justify-content: space-around;

}

.days li {

    list-style-type: none;

    display: inline-block;

    height: 42px;

    width: 14.2%;

    text-align: center;

    font-size: 14px;

    color: #212121;

    position: relative;

}

.days li .active {

    border-radius: 50%;

    background: #ffa516;

    color: #fff;

    height: 30px;

    width: 30px;

    line-height: 30px;

}

.days li .other-month {

    color: rgba(0, 0, 0, 0);

}

.weekend {

    /*color:#61212121 !important;*/

}

.arrowL {

    font-size: 23px;

}

.everyDay {

    width: 30px;

    height: 30px;

    line-height: 30px;

    text-align: center;

    margin: 3px auto;

}

.circle {

    width: 4px;

    height: 4px;

    border-radius: 50%;

    background-color: #F2553D;

    position: absolute;

    bottom: 1px;

    left: 49%;

}

.o {

    width: 4px;

    height: 4px;

    border-radius: 50%;

    border: 1px solid #F2553D;

    position: absolute;

    bottom: 1px;

    left: 49%;

}

.otherday {

    width: 30px;

    height: 30px;

    border-radius: 50%;

    background-color: #ffeac8;

}

.fadeOut {

    animation-name: fadeOut;

    animation-duration: 0.5s;

    animation-timing-function: ease-in-out;

    /* animation-delay: 1s;*/

}

.fadeIn {

    animation-name: fadeIn;

    animation-duration: 0.5s;

    animation-timing-function: ease-in-out;

}

@keyframes fadeOut {

    0% {

        transform: translateX(0);

        opacity: 1;

    }

    100% {

        transform: translateX(-100%);

        opacity: 0;

    }

}

@keyframes fadeIn {

    0% {

        transform: translateX(100%);

        opacity: 0;

    }

    100% {

        transform: translateX(0);

        opacity: 1;

    }

}

.fadeOutR {

    animation-name: fadeOutR;

    animation-duration: 0.5s;

    animation-timing-function: ease-in-out;

    /* animation-delay: 1s;*/

}

.fadeInR {

    animation-name: fadeInR;

    animation-duration: 0.5s;

    animation-timing-function: ease-in-out;

}

@keyframes fadeOutR {

    0% {

        transform: translateX(0);

        opacity: 1;

    }

    100% {

        transform: translateX(100%);

        opacity: 0;

    }

}

@keyframes fadeInR {

    0% {

        transform: translateX(-100%);

        opacity: 0;

    }

    100% {

        transform: translateX(0);

        opacity: 1;

    }

}
</style>
