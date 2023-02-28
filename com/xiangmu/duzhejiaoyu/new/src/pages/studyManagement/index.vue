<template>
    <div class="common-content">

      <!-- 搜索框查询 -->
      <div class="search-box">
        <span class="item">
          <label>校区</label>
          <el-select v-model="searchForm.campusId" placeholder="请选择" size="small" style="width:160px;margin-bottom:10px" @change="search" clearable @clear="clear('campusId')">
             <el-option :label="item.name" :value="item.id" :key="index" v-for="(item,index) in campusList"></el-option>
          </el-select>
        </span>

        <span class="item">
          <label>类别</label>
          <el-select v-model="searchForm.fileType" placeholder="请选择" size="small" style="width:160px" @change="search" clearable @clear="clear('fileType')">
             <el-option v-for="item in fileList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </span>

        <span class="item">
          <el-input placeholder="请输入资料名称" prefix-icon="el-icon-search" v-model="searchForm.name" style="width:200px" size="small"
          @keyup.enter.native="search" clearable  @clear="clear('name')" ></el-input>
        </span>

        <el-button  plain size="small" style="width:80px" @click="search">搜索</el-button>
        <el-button  plain size="small" style="width:80px" icon="el-icon-refresh-right" @click="reset">重置</el-button>

        <el-button type="primary" size="small"  style="width:100px;float:right" @click="openDialog('add',null)"><i class="el-icon-plus" style="margin-right:10px"></i>新 增</el-button>
        
      </div>
  

      <!--表格-->
      <el-table class="my-table" :data="tableList" style="width: 100%" stripe v-loading="loading" row-key="id">
        <el-table-column prop="name" label="资料名称" min-width="250" show-overflow-tooltip ></el-table-column>
        <!-- <el-table-column prop="id" label="id" show-overflow-tooltip ></el-table-column> -->
        <!-- <el-table-column prop="levelcode" label="levelcode" show-overflow-tooltip ></el-table-column> -->
        <el-table-column prop="campusNames" label="校区" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="readerNames" label="适用对象" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="showdown" label="下载开启" align="center" show-overflow-tooltip :formatter="common.showdownFormatter"></el-table-column>
        <el-table-column prop="fileType" label="类别" align="center"  :formatter="common.fileTypeFormatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="简介" min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fileSize" label="资料大小" align="center"  :formatter="common.fileSizeFormatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"  min-width="250" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.createTime.split(".")[0]}}
            </template>
        </el-table-column>
        <!-- <el-table-column prop="downloadCount" label="下载次数" align="center"></el-table-column>
        <el-table-column prop="watchCount" label="阅览次数" align="center"></el-table-column> -->
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <div class="table-btn orange" @click="openDialog('edit',scope.row)">编辑</div>
            <div class="table-btn pink" @click="deleteQues(scope.row)">删除</div>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <!-- <div class="my-pagination" >
        <span>显示{{limit}}条，共{{totalPage}}条</span>
        <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                       :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
       </div>    -->


       <!--弹框-->
      <el-dialog class="my-dialog study-dialog" :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="100%" :close-on-click-modal="false">
        <dialog-form ref="child" :islearnnum="islearnnum" :fileType="activeName"  :dialogTitle="dialogTitle" :dialogType="dialogType" @closeDialog="closeDialog" @closeEditDialog="closeEditDialog"></dialog-form>
      </el-dialog> 

     
    </div>
</template>

<script>
  import dialogForm from '../../pages/studyManagement/studyDialog.vue'
  import upload from "../../components/BaseUpload.vue"
 import Sortable from 'sortablejs';
    export default {
        name: "index",
        components:{
          dialogForm,upload,Sortable
        },
        data(){
            return{
                activeName:"1",
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
                fileList:this.options.fileList,
                campusList:[],
                islearnnum:false,//是否开启顺序学习
                
            }
        },

        methods: {
          //获取是否开启顺序学习
          getislearnnum(){
            this.util.postAjax({
              code:this.global.code,
              url:'/rules/findByCode',
              data:{
                  code:'ISLEARNNUMOPEN'//是否顺序阅读
              }
            }).then(res=>{
               if(res.item.rval=='1'){
                  this.islearnnum = true;
               }
            })
          },
          // 搜索框单个清除
            clear(type){
              switch (type) {
                case "campusId":
                  this.searchForm.campusId=null;
                  break;
                case "fileType":
                  this.searchForm.fileType=null;
                  break;
                case "name":
                  this.searchForm.name=null;
                  break;  
              }

              this.search();
            },


          //行拖拽
            rowDrop() {
              const tbody = document.querySelector('.el-table__body-wrapper tbody')
              const _this = this
              Sortable.create(tbody, {
                onEnd({ newIndex, oldIndex }) {
              
                  const currRow = _this.tableList.splice(oldIndex, 1)[0];
                  console.log('currRow', currRow)
                  _this.tableList.splice(newIndex, 0, currRow)
                  let currIndex="";
                  _this.tableList.forEach((v,i) => {
                    if(v.id == currRow.id){
                      currIndex=i;
                    }
                  })
                  // console.log(_this.tableList)
                  // console.log(oldIndex,currIndex)
                  // console.log( _this.tableList[oldIndex])
                  // console.log(_this.tableList[currIndex-1])
                  let levelcode="";
                  var flag = true ;
                  if(currIndex>0){
                    levelcode=_this.tableList[currIndex-1].levelcode;
                    if(currRow.isNeedstudy==1&&_this.tableList[currIndex-1].isNeedstudy==0){
                      levelcode=-1;
                    }
                    if(_this.tableList[currIndex].isNeedstudy==0&&_this.tableList[currIndex-1].isNeedstudy==1){
                      flag = false;
                      _this.getList();
                    }
                  }else{
                    levelcode=-1;
                  }
                  
                  // console.log(_this.tableList[currIndex-1])
                  // return;
                  if(flag){
                    _this.util.postAjax({
                      code:_this.global.code,
                      url: "/lresource/changeLevelcode",
                      data:{
                        id:currRow.id,
                        levelcode:levelcode
                      }
                    }).then(res => {
                      // console.log(res);
                      if(res.success){
                          _this.getList();
                          _this.$message({
                            type:"success",
                            message:"排序成功"
                          })
                      }
                    })
                  }
                }
              })
            },

            //删除题目
            deleteQues(row) {
              // console.log(1);
              this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.code,
                  url: "/lresource/delete",
                  data:{
                    id:row.id
                  }
                }).then( (res) =>{
                  this.getList();
                  this.$message({
                  type: 'success',
                  message: '文件删除成功!'
                });
                })
              }).catch(() => {});
            },

            // 获取单条详情
            getCurrentRow(row){
              this.util.postAjax({
                code:this.global.code,
                url: "/lresource/find",
                data:{
                  id:row.id
                }
              }).then(res => {
                if(res.success){
                  this.$nextTick(() => {
                    let item=res.item;
                    let arr=item.campusids ? item.campusids.split(",") :"";
                    let readerArr=item.readertypes ? item.readertypes.split(",") : "";
                    this.$refs.child.form={
                      id:item.id,
                      fileType:item.fileType,
                      name:item.name,
                      campuss:arr,
                      description:item.description,
                      dhtml:item.dhtml,
                      url:item.url,
                      photourl:item.photourl,
                      readerTypes:readerArr,
                      showdown:item.showdown,
                      isNeedstudy:item.isNeedstudy
                    };

                    setTimeout(()=>{
                      console.log(this.$refs.child.$refs['editor1'])
                    },500)

                    this.$refs.child.fileTypeChange();

                    if(this.$refs.child.form.fileType == 1){
                       setTimeout(()=>{
                        this.$refs.child.$refs['editor'].setHtml(res.item.description);
                      },500)
                      //  this.$refs.child.editorDes = res.item.description;
                    }

                    if(this.$refs.child.form.dhtml){
                      setTimeout(()=>{
                        this.$refs.child.$refs['editor1'].setHtml(res.item.dhtml);
                      },500)
                        // this.$refs['editor'].setHtml(this.actDetail);
                        // this.$refs.child.editorText = res.item.dhtml;
                    }
                    
                  })
                }
              })
            },

            // 打开弹框
            openDialog(type,row){
              this.dialogType=type;
              switch (type) {
                case "add":
                  this.dialogTitle="新增";
                  
                  break;

                case "edit":
                  this.dialogTitle="编辑"
                  this.getCurrentRow(row);
                  break;  
              }

              this.dialogFormVisible=true;
            },

            // 关闭弹框
            closeDialog(){
              this.dialogFormVisible=false;
              this.currentPage=1;
              this.getList();
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

            // tab切换
             tabClick(tab, event) {
                // console.log(tab, event);
                this.activeName=tab.name;
                this.currentPage=1;
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
                url:"/lresource/list",
                data:{
                  filter:JSON.stringify({
                      // fileType:this.activeName
                      fileType:this.searchForm.fileType || null,
                      name:this.searchForm.name || null,
                      campusId:this.searchForm.campusId || null
                  }),
                  page:"1",
                  limit:"10000"
                }
              }).then((res) =>{
               this.loading=false;
                if(res.success){
                    this.tableList=res.items;
                    this.totalPage=res.total;

                    //提取html内的文字
                      this.tableList.forEach(v=>{
                        v.description=v.description.replace(/<[^>]*>|/g,"");
                      });
                   
                    // console.log(this.tableList)
                }

                // this.isShowPage();
              })
            }

        },

        created() {
          this.getislearnnum();
          this.getList();

          this.common.getCampusList().then((res) => {
              if (res.success) {
                this.campusList = res.items;
              } 
          });

          

        //   this.getUploadUrl();

        },

        mounted() {
          this.rowDrop();
        },
    }
</script>

<style scoped>
  
</style>
