<template>
    <div>
        <div class="activityshow">
            <div class="activityshow_top clearfix">
                <div class="show_top_left"></div>
                <div class="show_top_right">
                    <h3>图书馆电子资源培训讲座图书馆电子资源培训讲座图书馆电子资源培训讲座</h3>
                    <span></span>
                    <p><i class="locationICON"></i>场地位置：<span>北体育馆二楼</span></p>
                    <p><i class="timeICON"></i>活动时间：<span>7月27日 15:00-16:00</span></p>
                    <p><i class="numICON"></i>活动人数：<span>不限制</span></p>
                </div>
            </div>
            <div class="activityshow_bottom">
                <el-tabs v-model="activeName" @tab-click="handleClick" style="height:70px;">
                    <el-tab-pane label="活动详情" name="first"></el-tab-pane>
                    <el-tab-pane label="活动风采" name="second"></el-tab-pane>
                </el-tabs>
                <div class="showIMGS">
                    <p>照片墙</p>
                    <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '../css/activity_.css'
export default {
    data() {
        return {
            activeName:'',
        }
    },
    methods: {
        handleClick(tab, event){

        }
    },
}
</script>