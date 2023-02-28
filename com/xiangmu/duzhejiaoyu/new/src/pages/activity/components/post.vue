<template>
    <div>
        <ul class="postbox clearfix">
            <li v-for="(v,i) in postList" :key="i" @click="selectpost(v)">
                <div :style="'background:url('+viewIMG+v.fileId+') no-repeat center center;background-size:contain;'"></div>
                <p>{{v.fileRemark}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
import util from '../js/util'
import code from '../js/code'
export default {
    data() {
        return {
            postList:[],
            viewIMG:code.imgURL
        }
    },
    methods: {
        activityFilelistPost(){
            util.postAjax({
                code: code.code,
                url: code.activityFilelistPost,
                data:{
                    page:1,
                    limit:10000,
                    fileRemark:''
                }
            }).then(res=>{
                if(res.success){
                    console.log(res)
                    this.postList = res.items;
                    
                }
            })

        },
        selectpost(item){
            this.$emit('selectpost',item)
        }
    },
    created() {
        this.activityFilelistPost();
    },
}
</script>
<style scoped>
.postbox{
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.postbox>li{
    width: calc(calc(100% - 48px) / 3);
    height: 200px;
    margin-right: 24px;
    margin-bottom: 24px;
}
.postbox>li:nth-child(3){
    margin-right: 0;
}
.postbox>li>div{
    width: 100%;
    height: calc(100% - 40px);
}
.postbox>li>p{
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: #89898c;
    font-size: 14px;
}
</style>