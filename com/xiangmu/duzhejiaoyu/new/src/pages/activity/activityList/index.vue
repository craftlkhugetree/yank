<template>
<div>
    <div class="activityList_top">
        <h3>活动列表</h3>
        <div class="my-tabs-wrap">
            <el-tabs class="my-tabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name=""></el-tab-pane>
                <el-tab-pane label="报名中" name="1"></el-tab-pane>
                <el-tab-pane label="已结束" name="3"></el-tab-pane>
            </el-tabs>
            <div class="my-tabs-btns">
                <el-button type="info" plain size="small" style="width:100px" @click="goDraft">草稿箱（{{draftNum}}）</el-button>
                <el-button type="primary" size="small" style="width:100px" @click="createActivity"><i class="el-icon-circle-plus-outline" style="margin-right:10px"></i>创建活动</el-button>
            </div>
        </div>
    </div>
    <div class="activityList_text">
        <el-select v-model="activityType" placeholder="活动类别" @change="changeTYPE">
            <el-option v-for="item in activityTypeLists" :key="item.value" :label="item.typeName" :value="item.id">
            </el-option>
        </el-select>
        <div class="search_box">
            <el-input class="search_input"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="searchname"
                @keypress.native="search">
            </el-input>
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <ul class="activityList_single" v-if="total>0">
            <li class="clearfix" v-for="(v,i) in activityLists" :key="i">
                <div class="list_img" :style="'background:url('+viewIMG+v.actPostImg+') no-repeat center center;background-size:contain;'">
                    <div v-if="v.actState==1" class="list_1"></div>
                    <div v-if="v.actState==3" class="list_2"></div>
                </div>
                <div class="list_text">
                    <h3>{{v.actName}} <i class="type">{{v.actTypeName}}</i> <i class="line"></i> <span>创建时间：{{util.formatTime(v.gmtCreate,'YYYY-MM-DD')}}</span></h3>
                    <p>{{v.actLocation}}</p>
                    <p>{{util.formatTime(v.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(v.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                    <div class="btns">
                        <el-button type="text" @click="deleteActivity(v.id)">删除</el-button>
                        <el-button type="text" @click="editActivity(v.id)">活动编辑</el-button>
                        <el-button type="text" @click="applyManage(v.id,v.actName)">报名管理</el-button>
                        <el-button type="text" @click="goSignImg(v.id)" v-if="v.isOpenSign">签到码</el-button>
                        <el-button type="text" @click="goShow(v.id,v.actName)"> 活动风采</el-button>
                    </div>
                </div>
            </li>
        </ul>
        <div v-else class="nodata">
        </div>
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
import "../css/activity_css.css";
import util from '../js/util'
import code from '../js/code'
export default {
    data() {
        return {
            page:1,
            limit:10,
            total:0,
            currentPage:0,
            draftNum:0,
            viewIMG:code.imgURL,
            activeName: '',//tab
            searchname:'',//搜索
            activityTypeLists: [],//类型列表
            activityLists:[],
            activityType: '',//类型id
        }
    },
    methods: {
        changeTYPE(){
            this.page = 1;
            this.Activitylist();
        },
        search(e){
            this.page = 1;
            if(e.type=="keypress"){
                if(e.keyCode==13){
                    this.Activitylist();
                }
            }
            if(e.type=='click'){
                this.Activitylist();
            }
        },
        getCurrentChange(page){
            this.page = page;
            this.Activitylist();
        },
        //活动类别
        getActivityTypeList(){
            util.postAjax({
                code: code.code,
                url: code.activityTypelist,
                data:{
                    typeName: ''//名称模糊查询
                }
            }).then(res=>{
                if(res.success){
                    this.activityTypeLists = res.items;
                }
            })
        },
        editActivity(id){
            this.$router.push({
                path:'createActivity',
                query:{
                    id:id,
                    edit:true
                }
            })
        },
        //活动列表
        Activitylist(){
            util.postAjax({
                code: code.code,
                url: code.Activitylist,
                data:{
                    page:this.page,
                    limit:this.limit,
                    actState: this.activeName !=0?this.activeName:"",//0未开始报名1报名中2活动进行中3活动结束
                    isDraft: false,//true/false
                    actTypeId: this.activityType,//类型id
                    actName: this.searchname//名称模糊查询
                }
            }).then(res=>{
                if(res.success){
                    this.activityLists = res.items;
                    this.total = res.total
                }
            })
        },
        handleClick(tab, event) {
            console.log(this.activeName)
            this.page = 1;
            this.Activitylist();
        },
        //删除活动
        deleteActivity(id){
            this.$confirm('确定要删除活动?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                util.postAjax({
                    code: code.code,
                    url: code.Activitydelete,
                    data:{
                        id: id//名称模糊查询
                    }
                }).then(res=>{
                    if(res.success){
                        this.page = 1;
                        this.currentPage = 1;
                        this.Activitylist();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                })
            })
        },
        //跳转签到码
        goSignImg(id){
            this.$router.push({
                path:'activitySign',
                query:{
                    ID:id
                }
            })
        },
        //跳转草稿箱
        goDraft(){
            this.$router.push('activityDraft')
        },
        ActivitydraftNum(){
            util.postAjax({
                code: code.code,
                url: code.activityActivitydraftNum,
            }).then(res=>{
                if(res.success){
                    this.draftNum = res.item;
                }
            })
        },
        //跳转活动风采
        goShow(id,name){
            this.$router.push({
                path:'activityShow',
                query:{
                    ID:id,
                    activityNAME:name
                }
            })
        },
        createActivity(){
            this.$router.push({
                path:'createActivity',
                query:{
                    edit:false
                }
            })
        },
        applyManage(id,name){
            this.$router.push({
                path:'activityApply',
                query:{
                    ID:id,
                    activityNAME:name
                }
            })
        }
    },
    created() {
        this.ActivitydraftNum();
        this.getActivityTypeList();
        this.Activitylist();
    },
}
</script>
<style scoped>

</style>
