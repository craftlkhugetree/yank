<template>
<div>
    <div class="activityApply_top">
        <h3>{{activityNAME}} <span>
                <el-button>报名人数：{{num.applyNum}}</el-button>
                <el-button>签到人数：{{num.signNum}}</el-button>
            </span></h3>
    </div>
    <div class="activityList_text clearfix">
        <div class="applysearch_box" style="float:left">
            <el-input class="applysearch_input" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchname" @keypress.native="search">
            </el-input>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="exportTable">导出</el-button>
        </div>
        <div class="colSelect">
            <el-button @click="overCOL">设置列表信息</el-button>
            <div class="colLists clearfix" v-if="showCOL">
                <el-checkbox-group v-model="checkList" @change="changeLists">
                    <el-checkbox v-for="(v,i) in allCols" :key="i" class="singleCol" :label="v.prop+'+'+v.label">{{v.label}}</el-checkbox>
                </el-checkbox-group>
                
            </div>
        </div>
        
    </div>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column :key="col.prop" v-for="col in cols" :prop="col.prop" :label="col.label" :value="col.checked" align="center" ></el-table-column>
    </el-table>
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
</template>

<script>
import "../css/activity_css.css";
import util from '../js/util'
import code from '../js/code'
import axios from 'axios'
export default {
    props:{
        ID:String||Number,
        activityNAME:String
    },
    data() {
        return {
            searchname:'',
            page:1,
            currentPage:0,
            limit:10,
            total:0,
            checkList:[],
            tableData: [],
            cols: [],
            allCols:[],
            num:'',
            showCOL:false
        }
    },
    methods: {
        overCOL(){
            console.log('tag', '111')
            this.showCOL = !this.showCOL;
        },
        activityAppointmentgetApplySignNum(id){
            util.postAjax({
                code: code.code,
                url: code.activityAppointmentgetApplySignNum,
                data:{
                    actId:id,
                }
            }).then(res=>{
                if(res.success){
                    this.num = res.item
                }
            })
        },
        //获取表格信息
        getApplyLists(id){
            util.postAjax({
                code: code.code,
                url: code.activityAppointmentlist,
                data:{
                    page:this.page,
                    limit:this.limit,
                    actId:id,
                    keyword:this.searchname
                }
            }).then(res=>{
                if(res.success){
                    this.tableData = res.items;
                    this.total = res.total;
                    this.tableData.forEach(e=>{
                        if(e.isSign){
                            e.isSign_ = "已签到"
                        }else{
                            e.isSign_ = "未签到"
                        }
                        e.gmtCreate = this.util.formatTime(e.gmtCreate,'YYYY-MM-DD hh:mm:ss')
                    })
                    this.allCols = [];
                    // var colKeys = Object.keys(this.tableData[0]);
                    var colKeys = ['userName','gmtCreate','isSign_'];//写死的几个
                    colKeys.forEach(e=>{
                        var obj = {
                            prop:e
                        };
                        if(e=='userName'){
                            obj.label = "用户名"
                        }else if(e=='gmtCreate'){
                            obj.label = "创建时间"
                        }else if(e=='isSign_'){
                            obj.label = "签到"
                        }
                        this.allCols.push(obj)
                    })
                    this.cols = this.allCols;
                    this.checkList = ['userName+用户名','gmtCreate+创建时间','isSign_+签到'];
                    this.cols.forEach(e=>{
                        e.checked = true;
                    })
                }
            })
        },
        changeLists(){
            console.log(this.checkList)
            var col = [];
            this.checkList.forEach(e=>{
                var obj = {
                    prop:'',
                    label:''
                }
                obj.prop = e.split('+')[0];
                obj.label = e.split('+')[1];
                col.push(obj)
            })
            this.cols = col;
        },
        search(e){
            console.log(e)
            this.page = 1;
            if(e.type=='click'){
                this.getApplyLists(this.ID)
            }
            if(e.keyCode== 13){
                this.getApplyLists(this.ID)
            }
        },
        getCurrentChange(page){
            this.page = page;
            this.getApplyLists(this.ID)
        },
        exportTable(){
            window.open(code.baseURL+code.activityAppointmentexportExcel+"?actId="+this.ID+"&keyword="+this.searchname)
            // axios.get(code.baseURL+code.activityAppointmentexportExcel+"?actId="+this.ID+"&keyword="+this.searchname).then(res=>{
            //     console.log('res', res)
            //     window.open(res)
            // })
        }
    },
    created() {
        this.getApplyLists(this.ID);
        this.activityAppointmentgetApplySignNum(this.ID);
    },

}
</script>

<style>

</style>
