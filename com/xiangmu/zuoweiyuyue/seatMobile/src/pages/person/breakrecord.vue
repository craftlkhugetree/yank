<template>
    <div class="orderHistoryContent">
        <van-list  class="orderHistorybox" 
            v-model="breakLoading"
            :finished="breakfinished"
            finished-text="没有更多了"
            @load="getbreakrecord">
            <div class="single" v-for="(v,i) in breakList" :key="i">
                <h3>{{v.note}}  </h3>
                <p>{{v.showtime}}</p>
            </div>
        </van-list>
        <div class="bottom">
            <div @click="goperson">返 回</div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            page:1,
            limit:10,
            breakList:[],
            breakLoading:false,
            breakfinished:false,
        }
    },
    methods: {
        goperson(){
            this.$router.push('person')
        },
        getbreakrecord(){
            this.util.postAjax({
                    code: this.code.base,
                    url: this.code.breakrecord,
                    data: {
                        limit: this.limit,
                        page: this.page,
                    },
                    isRep:true
                }).then(res => {
                    if(res.success){
                        var data = res.data;
                        if (data.length < this.limit || data.length === 0) {
                            this.breakLoading = false;
                            this.breakfinished = true;
                        } else {
                            this.breakLoading = false;
                            this.page++;
                            this.breakfinished = false;
                        }
                        data.forEach(e=>{
                            e.showtime = e.createtime.substring(0,4)+'-'+e.createtime.substring(4,6)+'-'+e.createtime.substring(6,8)+' '+e.createtime.substring(8,10)+':'+e.createtime.substring(10,12);
                            this.breakList.push(e)
                        })
                    }else{
                        this.Toast(res.data.message)
                    }
                })
        }
    },
    created() {
        // this.getOrderHistory();
    },
}
</script>
<style scoped>
   
</style>