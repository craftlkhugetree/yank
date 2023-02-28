<template>
    <div>
        <div class="myactivity">
            <h3>我的活动</h3>
            <p>共 {{total}} 个活动</p>
            <ul v-if="total>0">
                <li class="clearfix" v-for="(v,i) in myactivityList" :key="i">
                    <div class="myIMG" :style="'background:url('+viewIMG+v.actPostImg+') no-repeat center center;background-size:contain;'"></div>
                    <div class="myTEXT">
                        <h3>{{v.actName}} <i></i><span>{{v.actTypeName}}</span></h3>
                        <p>{{v.actLocation}}</p>
                        <p>{{util.formatTime(v.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(v.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                    </div>
                    <span class="cancelbtn" v-if="v.actState!=3" @click="cancelActivity(v.id)">取消</span>
                    <!-- actState   0未开始报名1报名中2活动进行中3活动结束 -->
                    <span class="activityTYPE" v-if="v.actState==1"></span>
                    <span class="activityTYPE1" v-if="v.actState==3"></span>
                    <span class="signtext" v-if="v.isSign">已签到</span>
                </li>
            </ul>
            <div v-else class="nodata"> </div>
            <el-pagination 
                class="page_box"
                background
                v-if="total>0"
                layout="prev, pager, next"
                :total=total
                :page-size="limit"
                :current-page="currentPage"
                @current-change="getCurrentChange">
            </el-pagination>
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
            page:1,
            limit:10,
            total:0,
            currentPage:0,
            myactivityList:[],
            viewIMG:code.imgURL
        }
    },
    methods: {
        getCurrentChange(page){
            this.page = page;
            this.activityAppointmentgetMyAct();
        },
        cancelActivity(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                util.postAjax({
                    code: code.code,
                    url: code.activityAppointmenttoCancelApply,
                    data: {
                        appointmentId:id,
                    }
                }).then(res => {
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '取消成功!'
                        });
                        this.activityAppointmentgetMyAct();
                    }
                })
            })
        },
        activityAppointmentgetMyAct(){
            util.postAjax({
                code: code.code,
                url: code.activityAppointmentgetMyAct,
                data: {
                    page: this.page,
                    limit: this.limit,
                }
            }).then(res => {
                if (res.success) {
                    this.myactivityList = res.items;
                    this.total = res.total;
                }
            })

        }
    },
    created() {
        this.activityAppointmentgetMyAct();
    },
}
</script>