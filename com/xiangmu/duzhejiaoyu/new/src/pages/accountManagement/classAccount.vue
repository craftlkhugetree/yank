<template>
<div>
    
    <div class="exam-account-box">
        <div class="top">
            <span class="name">考试统计</span>
            <!-- <span class="num">考试总人数 {{totalObj.totals?totalObj.totals:'--'}}人</span> -->
             <el-date-picker style="float:right;width: 300px;" v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始日期" 
                      end-placeholder="结束日期" @change="changedate" value-format="yyyyMMdd" size="small" clearable >
                      </el-date-picker>
        </div>

        <el-row class="data" :gutter="20">
          <el-col :span="8">
            <div class="item">
                <span class="image">
                    <img src="../../../static/images/exam-account-pic1.png">
                </span>
                <div class="account">
                    <div class="num">{{totalObj.tgrs?totalObj.tgrs:0}}人</div>
                    <div class="name">考试通过人数</div>
                </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
                <span class="image">
                    <img src="../../../static/images/exam-account-pic2.png">
                </span>
                <div class="account">
                    <div class="num">{{totalObj.wtgrs?totalObj.wtgrs:0}}人</div>
                    <div class="name">考试未通过人数</div>
                </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
                <span class="image">
                    <img src="../../../static/images/exam-account-pic3.png">
                </span>
                <div class="account">
                    <div class="num">{{totalObj.ksrs?totalObj.ksrs:0}}人</div>
                    <div class="name">参加考试人数</div>
                </div>
            </div>
          </el-col>
        </el-row>
        
    </div>
    <div class="common-content">

        <!-- <el-row> -->
          <!-- <el-col :span="16" class="centent-left"> -->
            <!-- 搜索框查询 -->
            <div class="search-box">
                <span class="item">
                    <label>年级</label>
                    <el-select v-model="searchForm.grade" placeholder="请选择" size="small" style="width:160px">
                        <el-option v-for="(k,i) in years" :key="i" :label="k" :value="k">
                        </el-option>
                    </el-select>
                </span>

                <el-button plain size="small" style="width:80px" @click="search">搜索</el-button>
                <el-button plain size="small" style="width:80px" icon="el-icon-refresh-right" @click="reset">重置</el-button>

                <el-button type="primary" size="small" style="width:100px;float:right" @click="exportFile"><i class="el-icon-download" style="margin-right:10px"></i>导出</el-button>
            </div>

            <!--表格-->
            <el-table class="my-table" :data="tableList" style="width: 100%" stripe v-loading="loading" @sort-change="getSort">
                <el-table-column prop="grade" label="年级" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="dept" label="班级" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="zrs" label="总人数" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="ksrs" label="考试人数" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="tgrs" label="通过人数" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="wtgrs" label="未通过人数" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="tgl" label="通过率" align="center" sortable show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.tgl+"%"}}</template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="220" align="center">
                    <template slot-scope="scope">
                        <!-- <div class="table-btn blue" @click="getCurrentCount(scope.row)">统计图表</div> -->
                        <div v-if="scope.row.dept" class="table-btn orange" @click="toUserDetail(scope.row)">班级详情</div>

                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <div class="my-pagination">
                <span>显示{{limit}}条，共{{totalPage}}条</span>
                <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit" 
                :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
            </div>
          <!-- </el-col> -->

           <!-- <el-col :span="8" class="content-right">
                <div class="title">班级分析</div>
                <div id="main" style="width: 200px;height: 200px;margin:0 auto"></div>
                <div class="explain">
                    <div class="item">
                        <div class="top">
                            <span class="circle green"></span>
                            <span>考试通过人数</span>
                        </div>
                        <div class="bottom">
                        <span style="margin-right:15px;">{{currentCount.bt? (currentCount.bt+"%") : "--"}} </span>
                        {{currentCount.patotal == null ? "--" : currentCount.patotal}}人</div>
                    </div>

                    <div class="item">
                        <div class="top">
                            <span class="circle yellow"></span>
                            <span>考试未通过人数</span>
                        </div>
                        <div class="bottom">
                        <span style="margin-right:15px;">{{currentCount.bt? ((100-currentCount.bt)+"%") : "--"}} </span>
                        {{currentCount.ntotal == null ? "--" : currentCount.ntotal}}人</div>
                    </div>

                    <div class="item">
                        <div class="top">
                            <span class="circle grey"></span>
                            <span>未参加考试人数</span>
                        </div>
                        <div class="bottom">
                        <span style="margin-right:15px;">{{currentCount.qtotal? (currentCount.qtotal/currentCount.total+"%") : "--"}} </span>
                        {{currentCount.patotal == null ? "--" : currentCount.patotal}}人</div>
                    </div>
                </div>
           </el-col> -->
        <!-- </el-row> -->
        
    </div>
</div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: "index",
    components: {

    },
    data() {
        let toYear = new Date().getFullYear(); //今年
        return {
            tableList: [],
            loading: false,
            totalPage: 1,
            limit: 10,
            currentPage: 1,
            classifyList: [], //题目分类列表
            searchForm: {},
            orderSort: null,
            orderBy: null,
            years: new Set([toYear, toYear - 1, toYear - 2, toYear - 3, toYear - 4]), //查询5内年级列表
            totalObj: {},
            totalObjChart: {},
            charts: '',
            opinion: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
            opinionData: [],
            currentCount: {},
            currentData:[],  //用于环形图
            
            starttime:toYear+"0101",
            endtime:toYear+"1231",
            selectDate:[],

        }
    },

    methods: {
        // 点击时间选择器
      changedate(){
        // console.log(this.selectDate);
        if(this.selectDate){
            this.starttime=this.selectDate[0];
            this.endtime=this.selectDate[1];
        }else{
            this.starttime="";
            this.endtime="";
        }
         this.getTotalCount();
         this.getList();
      },

       
         // 图表(当前)
        // drawPieCurrent(id) {
        //     this.charts = echarts.init(document.getElementById(id))
        //     this.charts.setOption({
        //         tooltip: {
        //             trigger: 'item',
        //             formatter: '{a}<br/>{b}:{c} ({d}%)'
        //         },
        //         //  legend: {
        //         //    orient: 'vertical',
        //         //    x: 'left',
        //         //    data:this.opinion
        //         //  },
        //         series: [{
        //             name: '',
        //             type: 'pie',
        //             radius: ['40%', '90%'],
        //             avoidLabelOverlap: false,
        //             label: {
        //                 show: true,
        //                 position: "inside",
        //                 formatter: "{d}%",
        //                 // formatter:"{c}({d}%)",
        //                 fontSize: 12,
        //             },
        //             labelLine: {
        //                 normal: {
        //                     show: false
        //                 }
        //             },
        //             data: this.currentData,
        //             itemStyle: {
        //                 borderWidth: 3,
        //                 borderColor: "#fff",
        //                 borderType: "solid"
        //             },

        //         }],

        //         color: ["#F7C122","#6ADFAF","#6D7FA1"]
        //     })
        // },

        // 跳转到用户详情
        toUserDetail(row) {
            sessionStorage.setItem("dept", row.dept)
            this.$router.push({
                path: "/userInfo",
                query:{
                    grade:row.grade,
                    dept:row.dept
                }
            })
        },

        // 点击排序
        getSort: function (column, prop, order) {
            let data = column.prop;

            this.orderBy = data.toUpperCase();

            let sort = column.order;
            switch (sort) {
                case "ascending":
                    this.orderSort = "asc";
                    break;
                case "descending":
                    this.orderSort = "desc";
                    break;
            }

            this.currentPage = 1;
            this.getList();
        },

        //导出
        exportFile() {
            var str1 = '?';
            var str2 = '?';
            var str3 = '?';
            // str1+=this.starttime?'starttime='+this.starttime+'&':'';
            // str1+=this.endtime?'endtime='+this.endtime+'&':'';
            str1+=this.searchForm.grade?'grade='+this.searchForm.grade+'&':'';
            str1+=this.starttime&&this.starttime.length>0?'starttime='+this.starttime+'&':'';
            str1+=this.endtime&&this.endtime.length>0?'endtime='+this.endtime:'';

            console.log(str1);
        //    return;

            this.util.getUrlByCode(this.global.code, "/dataDept/exportBottom"+str1).then(res => {
                window.open(res, "_target");
            })
        },

        // 搜索和重置
        search() {
            this.currentPage = 1;
            this.getList();
        },

        reset() {
            this.searchForm = {};
            this.search();
        },

        // 点击分页
        getCurrentChange(val) {
            this.currentPage = val;
            this.getList();
        },

        

        // 获取列表
        getList() {
            this.loading = true;
           
            this.util.postAjax({
                code: this.global.code,
                url: "/dataDept/bottom",
                isRep:true,
                data:{
                    filter:{
                        starttime:this.starttime,
                        endtime:this.endtime,
                        grade:this.searchForm.grade,
                    },
                    limit: this.limit,
                    orderBy: this.orderBy,
                    page: this.currentPage,
                    sort: this.orderSort,
                },
                // }
            }).then((res) => {
                this.loading = false;
                if (res.success) {
                    this.tableList = res.data;
                    this.totalPage = res.total;

                    this.selectDate=[this.starttime,this.endtime]


                    // this.$nextTick(function () {
                    //     this.drawPieCurrent('main');
                    //     //图表宽度自适应
                    //     window.addEventListener("resize", () => {
                    //         this.charts.resize();
                    //     });
                    // })
                    // console.log(this.tableList)
                }

                // this.isShowPage();
            })
        },

        // 获取总统计
        getTotalCount() {

            console.log(this.starttime);
            
            this.util.postAjax({
                code: this.global.code,
                url: "/dataDept/top",
                data:{
                    starttime:this.starttime ? this.starttime : null,
                    endtime:this.endtime ? this.endtime :null,
                    // starttime:null,
                    // endtime:null
                }
            }).then(res => {
                if (res.success) {
                    this.totalObj = res.data[0];

                    // this.$nextTick(function () {
                    //     this.drawPie('main');
                    //     //图表宽度自适应
                    //     window.addEventListener("resize", () => {
                    //         this.charts.resize();
                    //     });
                    // })
                }
            })

        }

    },

    created() {
        this.getList();
        this.getTotalCount();
    },

    //调用
    mounted() {
        // this.$nextTick(function() {
        //     this.drawPie('main');
        //   //图表宽度自适应
        //   window.addEventListener("resize", ()=> {
        //     this.charts.resize();
        //   });
        // })
    }
}
</script>

<style scoped>
    .exam-account-box{
        padding:30px 20px;
        box-sizing:border-box;
        background:#ffffff;
        margin-bottom:20px;
        }

    .exam-account-box .top{
        margin-bottom:25px;
        
    }

    .exam-account-box .top .name{
        font-size:17px;
        border-bottom:5px solid #CDE1FF;
        font-weight:bold;
        display:inline-block;
        line-height:12px;
        margin-right:25px;
        margin-top:12px;
    }

    .exam-account-box .top .num{
        color:#666666;
        font-size:14px;
    }

    .exam-account-box .data .item{
        height:120px;
        background:#ffffff;
        box-shadow: 0px 2px 15px 0px rgba(238, 238, 238, 0.5);
        padding:24px 40px;
        box-sizing:border-box;
        white-space:nowrap;
    }

    .exam-account-box .image{
        display:inline-block;
        width:80px;
        height:80px;
        
        margin-right:50px
    }

    .exam-account-box .image img{
        width:100%;
        height:100%;
    }

    .exam-account-box .account{
        display:inline-block;
        vertical-align:top;
   
    }

    .exam-account-box .account .num{
        font-size:26px;
        margin-bottom:10px;
        margin-top:15px;
    }

    .centent-left{
        border-right:1px solid #F2F2F2;
        padding-right:20px
    }

    .content-right{
        padding-left:30px
    }

    .content-right .title{
        font-size:16px;
        font-weight:bold;
        margin-bottom:30px;
        
    } 

    .explain .item{
        display:inline-block;
    }

    .explain .item .circle{
        display:inline-block;
        width:8px;
        height:8px;
        margin-right:15px;
        color:#2C3542;
    }

    .explain .item .circle.green{
        background:#6ADFAF;
        border:none;
        border-radius:50%;
    }

    .explain .item .circle.yellow{
        background:#F7C122;
        border:none;
        border-radius:50%;
    }

    .explain .item .circle.grey{
        background:#6D7FA1;
        border:none;
        border-radius:50%;
    }

    .explain .item .bottom{
        margin-top:10px;
        box-sizing:border-box;
        padding-left:28px;
        font-size:18px;
        font-weight:bold;
    }

</style>
