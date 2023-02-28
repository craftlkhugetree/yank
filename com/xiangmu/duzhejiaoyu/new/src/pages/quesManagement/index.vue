<template>
    <div class="common-content">
        <!-- 搜索框查询 -->
      <div class="search-box">
        <span class="item">
          <label>分类</label>
          <el-select v-model="searchForm.classId" placeholder="请选择" size="small" style="width:160px;margin-bottom:10px" @change="search" clearable @clear="clear('classId')">
            <el-option v-for="item in classifyList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </span>

        <span class="item">
          <label>是否必考</label>
          <el-select v-model="searchForm.isUse" placeholder="请选择" size="small" style="width:100px" @change="search" clearable @clear="clear('isUse')">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </span>

        <span class="item">
          <el-input placeholder="请输入题目内容" prefix-icon="el-icon-search" v-model="searchForm.quesTitle" style="width:200px" 
          size="small" @keyup.enter.native="search" clearable  @clear="clear('quesTitle')" ></el-input>
        </span>

        <el-button  plain size="small" style="width:80px" @click="search">搜索</el-button>
        <el-button  plain size="small" style="width:80px" icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>

        <!-- tab切换 -->
        <div class="my-tabs-wrap">
            <el-tabs class="my-tabs" v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="判断题" name="3"></el-tab-pane>
                <el-tab-pane label="单选题" name="1"></el-tab-pane>
                <el-tab-pane label="多选题" name="2"></el-tab-pane>
            </el-tabs>

            <div class="my-tabs-btns">
                <el-button type="danger" plain size="small"  style="width:100px" @click="deleteQuesMore"><i class="el-icon-delete" style="margin-right:10px" ></i>批量删除</el-button>
                <el-button type="primary" size="small"  style="width:100px" @click="openDialog('add',null)"><i class="el-icon-plus" style="margin-right:10px"></i>新 增</el-button>
                <el-button type="primary" size="small"  style="width:100px" @click="downloadExcel"><i class="el-icon-menu" style="margin-right:10px"></i>模板下载</el-button>
                <el-button type="primary" plain size="small"  style="width:100px" @click="uploadFile"><i class="el-icon-upload2" style="margin-right:10px" ></i>题库上传</el-button>
                <el-button type="primary" plain size="small"  style="width:100px" @click="downloadFile"><i class="el-icon-download" style="margin-right:10px"></i>题库下载</el-button>
            </div>
        </div>

      


      <!--表格-->
      <el-table class="my-table" :data="tableList" style="width: 100%" stripe v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="quesTitle" label="题目内容" min-width="300" show-overflow-tooltip ></el-table-column>
        <el-table-column v-if="activeName == '3'" prop="isTrue" label="答案" min-width="100" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
           {{scope.row.isTrue == 1 ? "是" : "否"}}
          </template>
        </el-table-column>
        <el-table-column v-if="activeName != '3'" label="选项" align="left" width="250" >
          <template slot-scope="scope">
            <el-tooltip class="cell-border ellipsis" effect="dark" :content="item" placement="top-start" v-for="(item,index) in scope.row.optionStrArr" :key="index">
              <div style="width:250px">{{'●  '+item}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="activeName != '3'" label="答案" align="left" width="250">
          <template slot-scope="scope">
            <!-- <div class="cell-border" v-for="item in scope.row.trueStrArr">{{item}}</div> -->
            <el-tooltip class="cell-border ellipsis" effect="dark" :content="item" placement="top-start" v-for="(item,index) in scope.row.trueStrArr" :key="index">
              <div style="width:250px">{{'●  '+item}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="classStr" label="分类" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="quesAnaly" label="题目分析" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isUse" label="是否必考" align="center" :formatter="isUseFormatter" show-overflow-tooltip></el-table-column>
        <el-table-column label="附件" align="center" width="100">
           <template slot-scope="scope">
            <el-image v-if="scope.row.fileUrl" style="width: 70px; height: 40px" :src="domain+scope.row.fileUrl"></el-image>
            <!--
            <img v-if="scope.row.fileUrl" style="width: 70px; height: 40px" :src="domain+scope.row.fileUrl">
            -->
          </template>

          


        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <div class="table-btn orange" @click="openDialog('edit',scope.row)">编辑</div>
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


       <!--弹框-->
      <el-dialog class="my-dialog" :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="700px" :close-on-click-modal="false">
        <dialog-form ref="child" :quesType="activeName" :classifyList="classifyList" @closeDialog="closeDialog" @closeEditDialog="closeEditDialog" 
        :dialogTitle="dialogTitle" :dialogType="dialogType" :domain="domain"></dialog-form>
      </el-dialog> 

      <!--上传组件-->
      <upload  v-show="false" :url="uploadUrl" ref="upload" exts="xlsx|xls" @choose="chooseflie" @done="finish"></upload>
    </div>
</template>

<script>
  import dialogForm from '../../pages/quesManagement/quesDialog.vue'
  import upload from "../../components/BaseUpload.vue"
    export default {
        name: "index",
        components:{
          dialogForm,upload
        },
        data(){
            return{
                activeName:"3",
                dialogTitle:"",
                dialogType:"",
                tableList:[],
                loading:false,
                totalPage:1,
                limit:10,
                currentPage:1,
                searchForm:{},
                classifyList:[], //题目分类列表
                domain:this.global.domain,  //域名
                dialogFormVisible:false,
                uploadUrl:"",
                deleteIds:""
              
            }
        },

        methods: {
          // 搜索框单个清除
            clear(type){
              switch (type) {
                case "classId":
                  this.searchForm.classId=null;
                  break;
                case "isUse":
                  this.searchForm.isUse=null;
                  break;
                case "quesTitle":
                  this.searchForm.quesTitle=null;
                  break;  
              }

              this.search();
            },

            // 表格多选
            handleSelectionChange(val) {
              // console.log(val);
              let arr=[];
              val.forEach(v => {
                arr.push(v.id)
              })
              this.deleteIds=arr.toString();
              
            },

            //题库下载
            downloadFile(){
              this.util.getUrlByCode(this.global.code,"/qusetion/downloadQuestion").then(res => {
                // console.log("res",res);
                window.open(res,"_target");
              })
            },

            //题库上传
            chooseflie:function(file){
              // console.log("上传后回调");
              // console.log(file);
            },

             finish(res){
                // console.log("结束后");
                // console.log(res);
          
                this.$message({
                  message:"题库上传成功",
                  type:"success"
                })

                this.currentPage =1;
                this.getList();
              
              },


            uploadFile(){
              this.$refs.upload.$refs.uploaddom.click();
            },

            //获取上传的url
            getUploadUrl(){
              this.util.getUrlByCode(this.global.code,"/qusetion/uploadQuestion").then(res => {
                this.uploadUrl = res;
                // console.log(this.uploadUrl)
              })
            },

            //模板下载
            downloadExcel(){
              this.util.getUrlByCode(this.global.code,"/qusetion/downloadTemplate").then(res => {
                window.open(res,"_target");
              })

            },

            // 批量删除
            deleteQuesMore(){
              this.$confirm('一旦删除后便不可再使用，确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.code,
                  url: "/qusetion/deleteByIds",
                  data:{
                    ids:this.deleteIds
                  }
                }).then( (res) =>{
                  this.getList();
                  this.$message({
                    type: 'success',
                    message: '批量删除成功!'
                  });
                })
              }).catch(() => {});
            },

            //删除题目
            deleteQues(row) {
              // console.log(1);
              this.$confirm('一旦删除后便不可再使用，确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.code,
                  url: "/qusetion/delete",
                  data:{
                    id:row.id
                  }
                }).then( (res) =>{
                  this.getList();
                  this.$message({
                  type: 'success',
                  message: '题目删除成功!'
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

                    // this.$refs.child.editorText=res.item.quesTitle;
                    // console.log(this.$refs.child.form)
                  })
                }
              })
            },

            // 打开弹框
            openDialog(type,row){
              this.dialogType=type;
              switch (type) {
                case "add":
                  switch (this.activeName) {
                    case "3":
                      this.dialogTitle="判断题新增"
                      break;
                    case "1":
                      this.dialogTitle="单选题新增"
                      break;
                    case "2":
                      this.dialogTitle="多选题新增"
                      break;
                  }
                  break;

                case "edit":
                  switch (this.activeName) {
                    case "3":
                      this.dialogTitle="判断题编辑"
                      break;
                    case "1":
                      this.dialogTitle="单选题编辑"
                      break;
                    case "2":
                      this.dialogTitle="多选题编辑"
                      break;
                  }

                  this.getCurrentRow(row);
                  break;  
              }

              this.dialogFormVisible=true;
            },

            // 关闭弹框
            closeDialog(){
              this.dialogFormVisible=false;
              this.search();
            },

            closeEditDialog(){
              this.dialogFormVisible=false;
              this.getList();
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
          
            // tab切换
             tabClick(tab, event) {
                // console.log(tab, event);
                this.activeName=tab.name;
                this.currentPage=1;
                this.deleteIds="";
                this.getList();
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
                url:"/qusetion/pageList",
                data:{
                  filter:JSON.stringify({
                    quesType:this.activeName,
                    quesTitle:this.searchForm.quesTitle || null, 
                    classId:this.searchForm.classId || null,
                    isUse:this.searchForm.isUse || null
                  }),
                  page:this.currentPage,
                  limit:this.limit
                }
              }).then((res) =>{
               this.loading=false;
                if(res.success){
                   

                    this.tableList=res.items;
                    this.totalPage=res.total;

                    if(this.tableList){

                      let arr=[];
                      let arr2=[];

                      //提取html内的文字
                      this.tableList.forEach(v=>{
                        v.quesTitle=v.quesTitle.replace(/<[^>]*>|/g,"");

                        if(v.optionStr && v.optionStr.length>0){
                          arr=v.optionStr.split("|")
                        }
                        v.optionStrArr=arr;

                        if(v.trueStr && v.trueStr.length>0){
                          arr2=v.trueStr.split("|")
                        }
                        v.trueStrArr=arr2;
                      });

                    }

                    // console.log(this.tableList)

                    
                }

                // this.isShowPage();
              })
            }

        },

        created() {
          this.getList();

          this.common.getClassifyList().then(res => {
            this.classifyList = res.items;
          });

          this.getUploadUrl();


          

        },
    }
</script>

<style scoped>

</style>
