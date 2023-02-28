<template>
    <div class="common-content">

      <div class="user-title-wrap">
        <span class="title">用户信息列表</span>

        <span v-if="isNewLogin == '1'" style="float:right">
            <el-button type="primary" plain size="mini"  @click="downloadTemplate('new')">下载新生导入模版</el-button>
            <el-button type="primary" plain size="mini"  @click="downloadTemplate('sync')">下载同步导入模版</el-button>
        </span>
      </div>

      <div class="user-line"></div>
        

      <!-- 搜索框查询 -->
      <div class="search-box">
        <span class="item">
          <label>年级</label>
          <el-select v-model="searchForm.grade" placeholder="请选择" size="small" style="width:160px;margin-bottom:10px" @change="search" clearable @clear="clear('grade')">
            <el-option v-for="(k,i) in years" :key="i" :label="k" :value="k">
            </el-option>
          </el-select>
        </span>

        <span class="item">
          <label>日期</label>
          <el-date-picker v-model="searchForm.date" style="width: 230px;" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" 
          end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="search" clearable @clear="clear('date')"></el-date-picker>
        </span>

        <span class="item">
          <el-input placeholder="请输入证件号/条码/身份证号/姓名" prefix-icon="el-icon-search" v-model="searchForm.queryParam" style="width:260px" size="small"
          @keyup.enter.native="search" clearable  @clear="clear('queryParam')" >
           
          </el-input>
        </span>

        <el-button  plain size="small" style="width:80px;margin-bottom:10px" @click="search">搜索</el-button>
        <el-button  plain size="small" style="width:80px" icon="el-icon-refresh-right" @click="reset">重置</el-button>

        <span style="float:right;margin-right:0">
            <el-button type="primary" size="small"  style="width:100px;" @click="exportFile"><i class="el-icon-download" style="margin-right:10px"></i>导出</el-button>
            <el-button  v-if="isNewLogin == '1'" size="small"  style="width:105px" @click="importTemplate('new')"><i class="btn-icons btn-icon-stu" style="margin-right:10px"></i>新生导入</el-button>
            <el-button  v-if="isNewLogin == '1'" size="small"  style="width:105px;" @click="importTemplate('sync')"><i class="el-icon-refresh" style="margin-right:10px"></i>同步导入</el-button>
        </span>
        
      </div>


      <!--表格-->
      <el-table class="my-table" :data="tableList" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="readerId" label="证件号" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="barcode" label="条码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="idcard" label="身份证号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dept" label="所属" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="campusName" label="校区" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isNeedQQ == '1'" prop="qqcard" label="QQ号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isNeedQQ == '1'" prop="email" label="邮箱" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isNeedQQ == '1'" prop="mobile" label="手机号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" label="性别" align="center" :formatter="sex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="readerTypename" label="身份" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="readerFlag" label="状态" align="center" :formatter="status"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="qtime" label="考试时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="qname" label="考试详情" align="left"  min-width="200" :formatter="qname" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.readerFlag != 1" class="table-btn blue" @click="active(scope.row)">激活</div>
            <!-- <div class="table-btn blue" @click="active(scope.row)">激活</div> -->
            <div v-if="scope.row.readerFlag == 1 && scope.row.readerId && scope.row.readerId.length>0 " class="table-btn pink" @click="deleteActive(scope.row)">删除</div>

          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="my-pagination" >
        <span>显示{{limit}}条，共{{totalPage}}条</span>
        <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                       :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
       </div>   


        <!--上传组件-->
      <upload  v-show="false" :url="uploadUrl" ref="upload" exts="xlsx|xls" @choose="chooseflie" @done="finish"></upload>
      
    </div>
</template>

<script>
    import upload from "../../components/BaseUpload.vue"
    export default {
        name: "index",
        components:{
            upload
        },
        props:{
            dept:String,
            grade:String
        },
        data(){
            let  toYear=new Date().getFullYear() ; //今年
            return{
                
                dialogType:"",
                tableList:[],
                loading:false,
                totalPage:1,
                limit:10,
                currentPage:1,
                classifyList:[], //题目分类列表
                searchForm:{
                    date:[],

                },
                years: new Set([toYear,toYear-1,toYear-2,toYear-3,toYear-4]),  //查询5内年级列表
                orderSort:"",
                orderBy:"",
                uploadUrl:window.g.ApiUrl3+"/user/importNewStu",
                isNewLogin:"",
                isNeedQQ:"",
        
            }
        },

        methods: {
          //获取是否完善个人信息
          getInfo(){
            this.util.postAjax({
                  code: this.global.code,
                  url: "/config/list",
              }).then((res) => {
                if(res.success){
                  console.log(res)
                  let arr=res.items.filter(v => v.configkey == "ISNEEDQQ");

                  this.isNeedQQ=arr[0].configval;
                  console.log(this.isNeedQQ)

                }
              })
          },


            //获取单个规则
            getCode(){
              this.util.postAjax({
                  code: this.global.code,
                  url: "/rules/findByCode",
                  data:{
                      code:"ISNEWLOGIN"
                  }
              }).then(res => {
                if(res.success){
                    console.log(res);
                    this.isNewLogin=res.item.rval;
                    console.log(this.isNewLogin)
                }
              })
            },

            // 搜索框单个清除
            clear(type){
              switch (type) {
                case "grade":
                  this.searchForm.grade=null;
                  break;
                case "date":
                  this.searchForm.date=null;
                  break;
                case "queryParam":
                  this.searchForm.queryParam=null;
                  break;  
              }

              this.search();
            },

            //题库上传
            chooseflie:function(file){
            //   console.log("上传后回调");
            //   console.log(file);
            },

             finish(res){
               
                this.$message({
                  message:"上传成功",
                  type:"success"
                })

                this.currentPage =1;
                this.getList();
              },
            //模板上传
            importTemplate(type){
                 let url="";
                switch (type) {
                    case "new":
                        url="/user/importNewStu"
                        break;
                    case "sync":
                        url="/user/importSyncStu"
                        break;
                }

                this.uploadUrl=window.g.ApiUrl3+url;

                this.$refs.upload.$refs.uploaddom.click();

            },

            //获取上传的url
            getUploadUrl(){
              this.util.getUrlByCode(this.global.code,"/user/importNewStu").then(res => {
                this.uploadUrl = res;
                // console.log(this.uploadUrl)
              })
            },

            // 模板下载
            downloadTemplate(type){
                let url="";
                switch (type) {
                    case "new":
                        url="/user/newStuTemplate"
                        break;
                    case "sync":
                        url="/user/syncStuTemplate"
                        break;
                }

              this.util.getUrlByCode(this.global.code,url).then(res => {
                window.open(res,"_target");
              })

            },

            // 点击排序
            getSort:function(column, prop, order){
                let data=column.prop;

                this.orderBy=data.toUpperCase();

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
              // console.log('this.searchForm', this.searchForm)
              var str1 = '?';
              str1+=this.searchForm.queryParam?'queryParam='+this.searchForm.queryParam+'&':'';
              str1+=this.searchForm.grade?'grade='+this.searchForm.grade+'&':'';
              str1+=this.searchForm.date&&this.searchForm.date.length>0?'startDate='+this.searchForm.date[0]+'&':'';
              str1+=this.searchForm.date&&this.searchForm.date.length>0?'endDate='+this.searchForm.date[1]+'&':'';
              // console.log('str1', str1)
              this.util.getUrlByCode(this.global.code,"/user/exportExcel"+str1).then(res => {
                  window.open(res,"_target");
              })
            },

            // 搜索和重置
            search(){
                if(sessionStorage.getItem("dept") != this.searchForm.queryParam){
                    sessionStorage.removeItem("dept")
                }

                this.currentPage=1;
                this.getList();
            },

            reset(){
              sessionStorage.removeItem("dept");
              this.searchForm={};
              this.search();
            },   

            // 激活
            active(row){
                this.$confirm('确定激活该用户吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
    
                        const loading = this.$loading({
                            lock: true,
                            text: "激活中",
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

                        this.util.postAjax({
                        code: this.global.code,
                        url: "/user/acitveReader",
                        data:{
                            id:row.id
                        }
                    }).then( () => {
                        loading.close();
                        this.$message({
                            message: '激活成功!',
                            type: 'success',
                            showClose:true
                        });
                        this.getList();
                    }).catch( () => {
                        loading.close();
                        this.$message({
                            message: '激活失败!',
                            type:"error",
                            showClose:true
                        });
                    })
                }).catch(()=>{})

                
            },

            //删除
            deleteActive(row){
                this.$confirm('确定删除该条用户信息吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.util.postAjax({
                    code: this.global.code,
                    url: "/user/deleteReader",
                    data:{
                        id:row.id
                    }
                    }).then(res => {
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    });
                }).catch(() => {});
            },

            //性别字样转换
            sex(row,col,cellValue){
                if(cellValue == 0){
                    return "男"
                }else if (cellValue == 1){
                    return "女"
                }
            },

            //改变表格中的文字
            status:function (row,column,cellValue) {
                // console.log(cellValue);
                if (cellValue === 1){
                    return "正常"
                }else if (cellValue === 0){
                    return "注销"
                }else if (cellValue === 2){
                    return "挂失"
                }else if (cellValue === 3){
                    return "停借"
                }
            },

            //
            qname:function(row,column,cellValue){
                switch (row.testType) {
                    case 1:
                    return cellValue+",参加了普通考试,得分"+row.score+"分";
                    break;
                    case 2:
                    return cellValue+",参加了模拟考试,得了"+row.score+"分";
                    break;
                    case 3:
                    return cellValue+",参加了闯关考试,过了"+row.score+"关";
                    break;
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
                url:"/user/pageList",
                data:{
                    filter:JSON.stringify({
                        queryParam:sessionStorage.getItem("dept") || this.searchForm.queryParam,
                        grade:this.searchForm.grade || null,
                        startDate:this.searchForm.date ? this.searchForm.date[0] : null,
                        endDate:this.searchForm.date ? this.searchForm.date[1] : null,
                        // orderBy:this.orderBy,
                        // sort:this.orderSort
                    }),
                  page:this.currentPage,
                  limit:this.limit
                }
              }).then((res) =>{
                this.loading=false;
                
                if(res.success){
                    this.tableList=res.items;
                    this.totalPage=res.total;
                }

                // this.isShowPage();
              })
            }

        },

        created() {
        //   console.log(sessionStorage.getItem("dept"))
        //  if(sessionStorage.getItem("dept")){
        //        this.searchForm={
        //             queryParam:sessionStorage.getItem("dept")
        //         }
        //  }  
         this.searchForm={
            grade:this.grade?this.grade:null,
            queryParam:this.dept?this.dept:null
          }
          // this.searchForm={
          //           queryParam:this.dept
          //       }
         this.getList();
         this.getCode();

         this.getInfo();
          
        //   this.getUploadUrl();

        // console.log(this.uploadUrl)
           
         
        },

        beforeDestroy() {
            sessionStorage.removeItem("dept")
        },
    }
</script>

<style scoped>

</style>
