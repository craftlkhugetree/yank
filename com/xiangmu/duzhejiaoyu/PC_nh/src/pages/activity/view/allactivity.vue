<template>
<div>
    <div class="allactivity myactivity">
        <h3>全部活动<el-button style="float:right;" type="info" plain @click="back">返回</el-button>
        </h3>
        <div>
            类型：<span :class="{'act':v.checked}" v-for="(v,i) in activityType" :key="i" @click="changeTYPE(v,i)">{{v.typeName}}</span>
        </div>
        <el-select class="allselect" style="width:260px;" v-model="actState" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-date-picker v-model="selectDate" type="daterange" range-separator="至" 
        start-placeholder="开始日期" end-placeholder="结束日期" 
        @change="changedata">
        </el-date-picker>
        <el-input class="search_input" style="width:320px;" placeholder="请输入内容" v-model="searchname">
        </el-input>
        <el-button type="primary" @click="search">搜索</el-button>
        <p>共 {{total}} 个活动</p>
        <ul v-if="total>0">
            <li class="clearfix" v-for="(v,i) in activityLists" :key="i" @click="activityActivitydetail(v.id)">
                <div class="myIMG" :style="'background:url('+viewIMG+v.actPostImg+') no-repeat center center;background-size:contain;'"></div>
                <div class="myTEXT">
                    <h3>{{v.actName}} <i></i><span>{{v.actTypeName}}</span></h3>
                    <p>{{v.actLocation}}</p>
                    <p>{{util.formatTime(v.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(v.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                </div>
                <!-- <span class="cancelbtn" v-if="v.actState==3">已结束</span> -->
                <!-- <span class="signtext" v-if="v.actState==1&&v.isApply">已报名</span>
                <span class="signbtn" v-if="v.actState==1&&!v.isApply" @click="signing(v.id)">立即报名</span>
                <span class="signtext" v-if="v.actState==2">活动进行中</span>
                <span class="signtext" v-if="v.actState==3">已结束</span> -->
                <span class="signbtn" v-if="v.isOpenApply&&v.actState==1&&!v.isApply" @click="activityActivitydetail(v.id)">立即报名</span>
                <span class="signtext" v-if="v.isOpenApply&&v.actState==3">立即报名</span>
                <span class="signtext" v-if="v.actLimitNum !=0 &&v.actApplyNum==v.actLimitNum ">报名人数已满</span>
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
            actTypeId: '',
            actState:'',
            start:'',
            end:'',
            activityType: [],
            activityLists:[],
            selectDate:'',
            searchname: '',
            options: [
                {value: '',label: '全部'},{value: '1',label: '报名中'}, {value: '2',label: '活动进行中'}, {value: '3',label: '活动结束'
            }],
            viewIMG:code.imgURL
        }
    },
    methods: {
        back(){
            this.$router.push('activityIndex')
        },
        search(){
            this.page = 1;
            this.activityActivitylist();
        },
        changeTYPE(item,index){
            this.page = 1;
            this.activityType.forEach((e, i) => {
                e.checked = false;
            })
            item.checked = true;
            this.actTypeId = item.id;
            this.activityActivitylist();
        },
        getCurrentChange(page){
            this.page = page;
            this.activityActivitylist();
        },
        changedata(){
            if(this.selectDate){
                this.start = this.util.formatTime_(this.selectDate[0]);
                this.end = this.util.formatTime_(this.selectDate[1],'end');
            }else{
                this.start = '';
                this.end = '';
            }
        },
        //活动类型
        activityTypelist() {
            util.postAjax({
                code: code.code,
                url: code.activityTypelist,
                data: {
                    typeName: this.searchname,
                }
            }).then(res => {
                if (res.success) {
                    var obj = {
                        id: '',
                        typeName: "全部",
                        checked: true
                    }
                    res.items.unshift(obj);
                    res.items.forEach((e, i) => {
                        if (i == 0) {
                            e.checked = true;
                            this.actTypeId = e.id;
                        } else {
                            e.checked = false;
                        }
                    })
                    this.activityType = res.items;
                }
            })
        },
        //活动列表
        activityActivitylist(){
            util.postAjax({
                code: code.code,
                url: code.activityActivitylist,
                data: {
                    page:this.page,
                    limit:this.limit,
                    gmtStart:this.start,
                    gmtEnd:this.end,
                    actState: this.actState, 
                    actTypeId: this.actTypeId,
                    keyword: this.searchname
                }
            }).then(res => {
                if (res.success) {
                    this.activityLists = res.items;
                    this.total = res.total;
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
        }
    },
    created() {
        this.activityTypelist();
        this.activityActivitylist();
    },

}
</script>
