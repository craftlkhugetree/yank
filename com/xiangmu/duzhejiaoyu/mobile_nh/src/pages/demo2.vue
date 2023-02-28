<template>
    <div class="home">
        <p>{{title}}</p>
        {{reqText}}
    </div>
</template>

<script>
    // @ is an alias to /src
    // import $ from 'jquery'

    export default {
        name: 'Home',
        data() {
            return {
                title: localStorage.getItem('ua'),
                beforeUnloadTime: '',
                reqText: localStorage.getItem('req'),
                gapTime:''
            }
        },
        created() {
        },
        mounted() {
            // 判断是否是微信浏览器
            let ua = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
            ua = ua !== null ? ua[0] : null;
            if (ua === "micromessenger") {
                window.addEventListener('pagehide', e => this.beforeunloadHandler(e))
                window.addEventListener('unload', e => this.unloadHandler(e))
            } else {
                // 监听普通页面离开事件
                window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
                window.addEventListener('unload', e => this.unloadHandler(e))
            }
        },
        destroyed() {

       // 销毁监听的关闭事件
            window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
            window.removeEventListener('pagehide', e => this.beforeunloadHandler(e))
            window.removeEventListener('unload', e => this.unloadHandler(e))
        },
        methods: {
         timeDate(){
           //处理进入事件，停留时间，离开时间的函数
         },
            beforeunloadHandler(e) {
                console.log(e);
                this.beforeUnloadTime = new Date().getTime();
            },
            unloadHandler(e) {
                // 这里调用时间函数确保记录时间的准确性
                this.timeDate()
                console.log(e);
                this.gapTime = new Date().getTime() - this.beforeUnloadTime;
                //判断是窗口关闭还是刷新
                if (this.gapTime <= 5) {
                    localStorage.setItem('ua','true')
                    $.ajax({
                        url: '/api/demo',
                        type: 'get',
                        async: false, //或false,是否异步
                        success: function (res) {
                            console.log(res)
                            localStorage.setItem('reqs', JSON.stringify(res))
                        },
                        error:function (res) {
                            console.log(res)
                            localStorage.setItem('reqs', JSON.stringify(res))
                        }
                    })
                }
            }
        }
    }
</script>