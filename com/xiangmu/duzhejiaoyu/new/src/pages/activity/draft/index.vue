<template>
<div>
    <div class="activityList_top activitydraft_top">
        <h3>草稿箱</h3>
    </div>
    <div class="activityList_text">
        <div class="draftsearch_box">
            <el-input class="search_input"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="searchname"
                @keypress.native="search">
            </el-input>
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <ul class="activityList_single" v-if="total>0">
            <li class="clearfix" v-for="(v,i) in draftList" :key="i">
                <div class="list_img" :style="'background:url('+viewIMG+v.actPostImg+') no-repeat center center;background-size:contain;'"></div>
                <div class="list_text">
                    <h3>{{v.actName}} <i class="type">{{v.actTypeName}}</i> <i class="line"></i> <span>创建时间：{{util.formatTime(v.gmtCreate,'YYYY-MM-DD')}}</span></h3>
                    <p>{{v.actLocation}}</p>
                    <p>{{util.formatTime(v.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(v.gmtEnd,'YYYY-MM-DD hh:mm')}} </p>
                    <div class="btns">
                        <el-button type="text" @click="deletaDraft(v.id)">删除</el-button>
                        <el-button type="text" @click="edit(v.id)">活动编辑</el-button>
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
            viewIMG:code.imgURL,
            draftList:[],
            searchname:'',
            activityType: ''
        }
    },
    methods: {
        //活动列表
        Activitylist(){
            util.postAjax({
                code: code.code,
                url: code.Activitylist,
                data:{
                    page:this.page,
                    limit:this.limit,
                    isDraft: true,//true/false
                    actName: this.searchname//名称模糊查询
                }
            }).then(res=>{
                if(res.success){
                    this.draftList = res.items;
                    this.total = res.total
                }
            })
        },
        getCurrentChange(page){
            this.page = page;
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
        //删除活动
        deletaDraft(id){
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
                        this.Activitylist();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                })
            });
        },
        edit(id){
            this.$router.push({
                path:'createActivity',
                query:{
                    id:id,
                    edit:true
                }
            })
        }
    },
    created() {
        this.Activitylist();
    },
}
</script>
<style scoped>

</style>
