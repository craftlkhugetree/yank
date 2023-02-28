<template>
    <div class="common-content">
        

      <!-- 搜索框查询 -->
      <div class="search-box" style="text-align:right">
        <el-button type="primary" size="small"  style="width:100px" @click="setExam('add',null)"><i class="el-icon-plus" style="margin-right:10px"></i>新 增</el-button>
      </div>


      <!--表格-->
      <el-table class="my-table" :data="tableList" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="userTypeStr" label="适用对象" min-width="300" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="needTime" label="考试时长(分钟)" min-width="80" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="testType" label="考试形式" align="center" :formatter="testTypeFormatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="试卷主题" min-width="250" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="campusStr" label="校区" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="minTime" label="提前交卷时间(分钟)" align="center" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isUse" label="是否使用" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
           {{scope.row.isUse == 1 ? "是" : "否"}}
          </template>
        </el-table-column>
        <el-table-column prop="validDateStr" label="可参加考试时间范围" min-width="250" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <div class="table-btn orange" @click="setExam('edit',scope.row)">编辑</div>
            <div class="table-btn pink" @click="deleteQues(scope.row)">删除</div>
          </template>
        </el-table-column>
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
                dialogType:"",
                tableList:[],
                loading:false,
                totalPage:1,
                limit:10,
                currentPage:JSON.parse(sessionStorage.getItem("currentPage")) || 1,
                classifyList:[], //题目分类列表
            }
        },

        methods: {
            // 跳转设置页面
            setExam(type,row){

              this.dialogType = type;
              switch (type) {
                case "add":
                  // this.$router.push("/examManage/set-exam");
                  this.$router.push({
                    path:"/examManage/set-exam",
                    query:{
                        currentPage:this.currentPage
                      }
                    });
                  break;
                case "edit":
                  // this.$router.push(`/examManage/set-exam/${row.id}`);
                  this.$router.push({
                    path:`/examManage/set-exam/${row.id}`,
                    query:{
                        currentPage:this.currentPage
                      }
                    });
                  break;
              }

              
            },

            //考试形式字样转换
            testTypeFormatter(row,column,cellValue){
              switch (cellValue) {
                case 1:
                  return "普通考试";
                  break;
                case 2:
                  return "模拟考试";
                  break;
                case 3:
                  return "闯关考试";
                  break;
              }
            },

            


            

           
            //删除
            deleteQues(row) {
              
              this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.code,
                  url: "/qresourceManager/delete",
                  data:{
                    id:row.id
                  }
                }).then( (res) =>{
                  this.getList();
                  this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                })
              }).catch(() => {});
            },

            // 获取单条详情
            getCurrentRow(row){
              this.util.postAjax({
                code:this.global.code,
                url: "/qusetion/find",
                data:{
                  id:row.id
                }
              }).then(res => {
                if(res.success){
                  // console.log(res);
                  this.$nextTick(() => {
                    this.$refs.child.form=res.item;
                    // console.log(this.$refs.child.form)
                  })
                }
              })
            },


            //否正确字样
              isTrueFormatter(row,column,cellValue) {
                if (cellValue === 1){
                  return "正确"
                }else if (cellValue === 0){
                  return "错误"
                }
              },

            //是否必考字样
              isUseFormatter(row,column,cellValue) {
                // console.log(cellValue);
                if (cellValue === 1){
                  return "是"
                }else if (cellValue === 0){
                  return "否"
                }
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
                url:"/qresourceManager/pageList",
                data:{
                  page:this.currentPage,
                  limit:this.limit
                }
              }).then((res) =>{
                this.loading=false;
                if(res.success){
                   

                    this.tableList=res.items;
                    this.totalPage=res.total;

                    if(this.tableList){

                  
                    }

                    // console.log(this.tableList)

                    
                }

                // this.isShowPage();
              })
            }

        },

        created() {
          this.getList();

         
        },

        beforeDestroy() {
          sessionStorage.removeItem("currentPage")
        },
    }
</script>

<style scoped>

</style>
