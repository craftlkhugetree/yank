<template>
    <div class="common-content">
      <!--面包屑-->
<!--      <bread-crumb :breadList="breadList"></bread-crumb>-->

      <!--搜索框-->
      <div class="search-group">
        <span>
          <label>类型</label>
          <el-select v-model="searchForm.restypeid" placeholder="请选择" size="small" style="width: 150px">
            <el-option v-for="item in typeList" :key="item.id" :label="item.typename" :value="item.id" ></el-option>
          </el-select>
        </span>
        <span>
          <label>学院</label>
         <!-- <el-select v-model="searchForm.orgid" placeholder="请选择" size="small" style="width: 150px" filterable>
            <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
          </el-select>-->

          <el-select v-model="searchForm.orgid" filterable remote placeholder="请输入或选择" size="small" :remote-method="remoteMethod" :loading="selectLoading" style="width: 150px">
            <el-option v-for="item in groupList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </span>
        <span>
          <el-input v-model="searchForm.rescode" placeholder="请输入资源编号" prefix-icon="el-icon-search" size="small" style="width: 220px"></el-input>
          <el-button size="small" style="width: 100px" @click="search">搜索</el-button>
        </span>
        <span class="reset-icon" @click="reset">
          <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
        </span>

        <div style="display:inline-block;float: right;margin-top: 3px;margin-bottom: 20px">
          <div class="my-button green" style="margin-right: 10px" @click="addApply('add',null)">
            <i class="el-icon-plus"></i>
            <span>新增资源</span>
          </div>
          <div class="my-button green" style="" @click="downloadResTemp">
<!--            <i class="el-icon-plus"></i>-->
            <span>下载模板</span>
          </div>
          <el-tooltip class="item" effect="dark" content="请检查类型名称统一性，避免相似类型名称" placement="top">
            <div class="my-button green" style="" @click="uploadResTemp">
              <span>导入</span>
            </div>
          </el-tooltip>
        </div>
      </div>

      <!--表格-->
      <el-table class="my-table" :data="resList" style="width: 100%" stripe v-loading="loading">
<!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
        <el-table-column prop="restypename" label="灌溉类型" align="center"></el-table-column>
        <el-table-column prop="orgname" label="学院" align="center">
            <template slot-scope="scope">
              {{scope.row.orgname ? scope.row.orgname : "公共资源"}}
          </template>
        </el-table-column>
        <el-table-column prop="rescode" label="资源编号" width="180" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <div class="table-btn green" @click="addApply('edit',scope.row)">编辑</div>
            <div class="table-btn pink" @click="deleteRes(scope.row)">删除</div>
<!--            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>-->
<!--            <el-button type="text" size="small">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="my-pagination" v-if="totalPage > limit">
        <span>显示{{limit}}条，共{{totalPage}}条</span>
        <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                       :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
      </div>

      <!--弹框-->
      <el-dialog class="res-apply-dialog" :title= "dialogType =='add' ? '灌溉资源新增' : '灌溉资源编辑'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="700px" :close-on-click-modal="false">
        <res-form ref="child" :form="form" :formLabelWidth="formLabelWidth"></res-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible = false">取 消</div>
          <div class="my-button green"  @click="submit()">提 交</div>
        </div>
      </el-dialog>

      <upload v-show="false" ref="upload" class="my-upload" :url="uploadUrl" :multiple="false" :exts="fileType" @choose="choosefile" @done="finish" @unfinished="unfinished"></upload>

    </div>
</template>

<script>
  import resForm from "./resDialog"
  import upload from "../../components/BaseUpload"
  import breadCrumb from "../../components/breadcrumb";

  export default {
      name: "index",
      props:{
        breadList:Array
      },
      components:{
        resForm,upload,breadCrumb
      },
      data(){
          return{
            totalPage:1,
            limit:10,
            currentPage:1,
            activeName: 'second',
            resList:[],  //申请列表
            dialogFormVisible: false,
            form: {},
            formLabelWidth: '120px',
            options: [],
            value: '',
            // typeList:JSON.parse(sessionStorage.getItem("typeList")) ,  //资源类型列表
            groupList:[] ,  //学院列表
            searchForm:{},
            dialogType:"" ,//弹框类型
            uploadUrl:window.g.ApiUrl2 +"/irres/importData",
            fileType:"xls|XLS|xlsx|XLSX",
            fullscreenLoading:false,
            loading:false,
            selectLoading:false,

            groupListNew:[], 
            

          }
      },
        computed:{
          typeList(){
            return this.$store.state.irrtypeList
          }
        },
        methods:{

          //搜索学院名称
          remoteMethod(query) {
            console.log(query)

            this.selectLoading = true;
            if (query !== '') {
              this.common.getGroupList2(query)
                .then(res => {
                  console.log(res);
                  this.selectLoading = false;
                  this.groupList=res.items;
                  if("公共资源".includes(query)) {
                     this.groupList.push({
                      id: -1,
                      name: "公共资源"
                    })
                    
                  }
                  
                  // else{
                  //   this.groupList=res.items;
                  // }
                
                }).catch(err => {
                this.selectLoading = false;
                this.groupList=[];
              })
            } else {
              this.selectLoading = false;
              this.groupList = [];
            }

            console.log(this.groupList)

            
          },

          /*uploadResTemp(){
            this.util.postAjax({
              code:this.global.code,
              url:"/irres/importData",
              data:{

              }
            })
          },*/

          //导入
          uploadResTemp(){
            this.$refs.upload.$refs.uploaddom.click();
          },

          choosefile(res){
            // this.fullscreenLoading = true;
            // console.log(res);
            /*this.fullscreenLoading =this.$loading({
              lock: true,
              text: '上传中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });*/
          },

          unfinished(res){
            // console.log("message",res);
            // this.fullscreenLoading.close();
            // this.$message(res.message[0])
            this.refresh()
          },

          refresh(){
            this.searchForm={};
            this.$store.dispatch("getResTypeList");
          },


          //结束后返回
          finish(res){
            // console.log(res);
            // this.fullscreenLoading = false;

            if(res.success ==true){
              // this.fullscreenLoading.close();
              this.currentPage=1;
              this.getList(this.currentPage);
              this.refresh();
              this.$message({
                type: 'success',
                message: '导入成功!'
              });
            }else{
              // console.log(res);
              // this.fullscreenLoading.close();
              this.$message({
                type:"warning",
                message:res.data.message
              });
            }
          },

          //下载模板
          downloadResTemp(){
            this.util.getUrlByCode(this.global.code,"/irres/exportTemplate").then(res=>{
              window.open(res,"_blank")
            })
          },

          //分页点击
          getCurrentChange(currentPage){
            this.currentPage=currentPage;
            this.getList(currentPage)
          },

          //删除
          deleteRes(row){
            // console.log(row.id);
            this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

             
              this.util.postAjax({
                code:this.global.code,
                url:"/irres/deleteById?id="+row.id,
              }).then(res => {
                
                if(res.success == true){
                  // this.currentPage=1;
                  this.getList(this.currentPage);
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  //刷新列表

                }else {
                  this.$message({
                    type: 'warning',
                    message: res.data.message
                  });
                }
              })
            }).catch(() => {});
          },

          //搜索
          search(){
            this.getList(1);
            // console.log("searchForm",this.searchForm);
          },

          //清空
          reset(){
            this.searchForm = {};
            this.currentPage=1;
            this.getList(this.currentPage);
          },

          //获取列表
          getList(page){
            this.loading=true;
            this.util.postAjax({
              code:this.global.code,
              url:"/irres/pageList",
              data:{
                params:JSON.stringify({
                  page:page,
                  limit:this.limit,
                  restypeid:this.searchForm.restypeid,
                  orgid:this.searchForm.orgid,
                  rescode:this.searchForm.rescode
                })
              }
            }).then(res =>{
              this.loading=false;
              if(res.success == true){
                this.resList = res.items;
                this.totalPage=res.total
              }
            })
          },

          //打开弹框
          addApply(type,row){
            this.dialogType=type;
            switch (type) {
              case "add":
                this.form={
                  orgid:"",
                  restypename:"",
                  rescode:"",
                };
                break;
              case "edit":
                this.util.postAjax({
                  code:this.global.code,
                  url:"/irres/findById",
                  data:{
                    id:row.id
                  }
                }).then(res => {
                  if(res.success == true){
                    this.form=res.item;

                    console.log(this.form);
            
                    console.log(this.groupListNew);

                    this.groupListNew.forEach(v => {
                       console.log(v.id);
                       console.log(this.form.id);
                        if(v.id == this.form.orgid){
                            this.form.orgname = v.name
                        }
                    })

                    if(this.form.orgid == -1){
                        this.form.orgname = "公共资源"
                    }
                    // this.form.orgid = this.form.orgid == -1 ? "公共资源" :  this.form.orgid;
                    console.log(this.form)
                  }
                })
                break;
            }
            this.dialogFormVisible = true;


          },

          

          //提交
          /*submit(){
            console.log(this.$refs.child.form);
            let form=this.$refs.child.form;

            console.log("form2",form);
            this.util.postAjax({
              code:this.global.code,
              url:"/irres/add",
              isRep:true,
              data:form
            }).then(res => {
              if(res.success == true){
                this.dialogFormVisible = false;
                this.$message({
                  type:"success",
                  message:"新增成功"
                });
                this.getList(1);
              }
            })

          },*/

          //提交
          submit(){

            this.$refs.child.$refs.form.validate((valid) => {
                if (valid) {
                  let url="";
                  let message="";

                 
                  let form=JSON.parse(JSON.stringify(this.$refs.child.form))
                  switch (this.dialogType) {
                    case "add":
                      url="/irres/add";
                      message = "新增成功";
                      this.currentPage=1;
                      // form.orgid =  form.orgid || -1
                      break;
                    case "edit":
                      url="/irres/update";
                      message = "编辑成功";
                      // form.orgid =  form.orgid == "公共资源" ? -1 :  form.orgid
                      break;
                  }

                  // console.log(this.$refs.child.form);

                 
                  
                  this.groupList.forEach(v=> {
                    if(v.id == form.owngroup){
                      form.owngroupname = v.name
                    }
                  })

                  form.orgid =  form.orgid || -1

                  const loading = this.$loading({
                  lock: true,
                  text: "提交中",
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                  

                  // console.log("form",form);
                  // return false;
                  this.util.postAjax({
                    code:this.global.code,
                    url:url,
                    isRep:true,
                    data:form
                  }).then(res => {
                    loading.close();
                    if(res.success == true){
                      this.dialogFormVisible = false;
                      this.$message({
                        type:"success",
                        message:message
                      });
                      this.getList(this.currentPage);
                      this.common.getSeriesLists();
                    }else {
                      this.$message({
                        type:"warning",
                        message:res.data.message
                      });
                    }
                  })
                }
            })


          },

         /* //编辑保存
          update(){
            let form=this.$refs.child.form;
            this.util.postAjax({
              code:this.global.code,
              url:"/irres/update",
              isRep:true,
              data:form
            }).then(res => {
              if(res.success == true){
                this.dialogFormVisible = false;
                this.$message({
                  type:"success",
                  message:"保存成功"
                });
                this.getList(1);
              }
            })
          },*/

          handleClick(row) {
            // console.log(row);
          }
        },
      created() {
          this.getList(this.currentPage);
          this.common.getSeriesLists();


          this.common.getGroupList2(null).then(res => {
            
            if(res.success){
              this.groupListNew=res.items;
              console.log(this.groupListNew)
            }
          })
        // this.breadList=
        // console.log("name",this.breadList);
        // sessionStorage.setItem("name",this.name)
      },
    beforeDestroy() {
      this.$message.closeAll();
    },
    }
</script>

<style scoped>

</style>
