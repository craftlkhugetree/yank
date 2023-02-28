<template>
    <div class="common-content">
        

      <!-- 搜索框查询 -->
      <div class="search-box" style="text-align:right">
        <el-button type="primary" size="small"  style="width:100px;" @click="exportFile"><i class="el-icon-download" style="margin-right:10px"></i>导出</el-button>
      </div>


      <!--表格-->
      <el-table class="my-table" :data="tableList" style="width: 100%" stripe v-loading="loading" @sort-change="getSort">
        <el-table-column prop="quesTitle" label="题目内容" min-width="500" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="useNum" label="被答次数"" align="center" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="passNum" label="正确次数" align="center" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="errorNum" label="错误次数" align="center" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="bt" label="正确率" align="center" sortable show-overflow-tooltip></el-table-column>
      </el-table>

      <!--分页-->
      <div class="my-pagination" >
        <span>显示{{limit}}条，共{{totalPage}}条</span>
        <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                       :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
       </div>   


      
    </div>
</template>

<script>
  
    export default {
        name: "index",
        components:{
         
        },
        data(){
            return{
                tableList:[],
                loading:false,
                totalPage:1,
                limit:10,
                currentPage:1,
                classifyList:[], //题目分类列表
                searchForm:{},
                orderSort:"",
                orderBy:"",

            }
        },

        methods: {
            // 点击排序
            getSort:function(column, prop, order){
            let data=column.prop;

            console.log(data);

            // this.orderBy=data.toUpperCase();

            switch (data) {
              case "quesTitle":
                this.orderBy ="QUES_TITLE";
                break;
              case "useNum":
                this.orderBy ="USE_NUM";
                break;
              case "passNum":
                this.orderBy ="PASS_NUM";
                break;
              case "errorNum":
                this.orderBy ="ERROR_NUM";
                break;
              case "bt":
                this.orderBy ="bt";
                break;  
            }

            let sort=column.order;
                switch (sort) {
                    case "ascending":
                    this.orderSort = "asc";
                    break;
                    case "descending":
                    this.orderSort = "desc";
                    break;
                }
                
                this.currentPage=1;
                this.getList();
            },

            //导出
            exportFile(){
                this.util.getUrlByCode(this.global.code,"/dataAnalysis/exportQuestionExcel").then(res => {
                    window.open(res,"_target");
                })
            },

            // 搜索和重置
            search(){
                this.currentPage=1;
                this.getList();
            },

            reset(){
              this.searchForm={};
              this.search();
            },   
            
            // 点击分页
            getCurrentChange(val){
              this.currentPage=val;
              this.getList();
            },

            // 获取列表
            getList(){
                this.loading=true;
                this.util.postAjax({
                code:this.global.code,
                url:"/dataAnalysis/questionData",
                data:{
                    filter:JSON.stringify({
                        orderBy:this.orderBy || null,
                        sort:this.orderSort || null
                    }),
                  page:this.currentPage,
                  limit:this.limit
                }
              }).then((res) =>{
                this.loading=false;
                if(res.success){
                   

                    this.tableList=res.items;
                    this.totalPage=res.total;

                   //提取html内的文字
                      this.tableList.forEach(v=>{
                        v.quesTitle=v.quesTitle.replace(/<[^>]*>|/g,"");

                      });


                    // console.log(this.tableList)

                    
                }

                // this.isShowPage();
              })
            }

        },

        created() {
          this.getList();
        },
    }
</script>

<style scoped>

</style>
