<template>
    <div class="common-content">
      <el-tabs class="my-border-card" type="border-card" v-model="activeResType" @tab-click="resTypeChange">
        <el-tab-pane :label="item.name" v-for="item in resTypeList" :key="item.id" :name="item.id"></el-tab-pane>
      </el-tabs>

      <!--搜索框-->
      <div class="search-group">
        <span>
          <label>状态</label>
          <el-select v-model="searchForm.usestatus" placeholder="请选择" size="small" style="width: 150px">
            <el-option v-for="item in resStatus" :key="item.id" :label="item.name" :value="item.id" ></el-option>
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

       <!-- <div style="display:inline-block;float: right;margin-top: 3px;margin-bottom: 20px">


        </div>-->
      </div>

      <div class="search-group">
        <div class="my-button green" style="margin-right: 10px" @click="addApply('add',null)">
          <i class="el-icon-plus"></i>
          <span>新增资源</span>
        </div>

        <div class="my-button plain-green" style="margin-right: 10px" @click="changeStatus('1','more',null)">
          <img class="image" src="../../../../static/images/bm-res-open.png" alt="">
          <span>批量开放</span>
        </div>

        <div class="my-button plain-green" style="margin-right: 10px" @click="changeStatus('2','more',null)">
          <img class="image" style="margin-top: 7px" src="../../../../static/images/bm-res-close.png" alt="">
          <span>批量关闭</span>
        </div>

        <div class="my-button plain-red" style="" @click="deleteRes('more',null)">
          <img class="image" style="margin-top: 7px" src="../../../../static/images/bm-file-delete.png" alt="">
          <span>批量删除</span>
        </div>
      </div>

      <div class="my-el-divider"></div>

      <!--表格-->
      <el-table class="my-table" :data="resList" style="width: 100%" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
<!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
        <el-table-column type="selection" width="45" align="center" fixed="left"></el-table-column>
        <el-table-column prop="rescode" label="资源编号"></el-table-column>
        <el-table-column prop="area" label="面积(㎡)" width=""></el-table-column>
<!--        <el-table-column prop="price" :label="'单价(元/'+typeDetail.chargetype" ></el-table-column>-->
        <el-table-column v-if="resTypeDetail.chargecycle" prop="price" :label="'单价（元/'+resTypeDetail.chargecycle+'/'+resTypeDetail.chargetype+'）'" align="center" width="150" :formatter="common.moneyFormatter"></el-table-column>
        <el-table-column v-else prop="price" :label="'单价（元/'+'--'+'/'+'--'+''+'）'" align="center" width="150"></el-table-column>

<!--        <el-table-column  prop="price" :label="'单价（元/'+(resTypeDetail && resTypeDetail.chargecycle ? resTypeDetail.chargecycle : '&#45;&#45;')+'/'+(resTypeDetail && resTypeDetail.chargetype ? +resTypeDetail.chargetype : '&#45;&#45;')+'）'" align="center" width="150"></el-table-column>-->
        <el-table-column prop="liveinfo" label="入驻信息" align="center">
          <el-table-column prop="liveinfo.orgname" label="学院名称" align="center"></el-table-column>
          <el-table-column prop="liveinfo.projectname" label="项目名称" align="center" width="200" show-overflow-tooltip>
           <!-- <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.liveinfo.projectname" placement="right">
                <div style="width: 100%;" class="ellipsis">{{scope.row.liveinfo.projectname}}</div>
              </el-tooltip>
            </template>-->
          </el-table-column>
          <el-table-column prop="liveinfo.classleadername" label="负责人" align="center"></el-table-column>
          <el-table-column prop="liveinfo.classleadermobile" label="联系方式" align="center"></el-table-column>
          <el-table-column prop="liveinfo.applyendtime" label="退出时间" align="center" width="100"></el-table-column>
        </el-table-column>

        <el-table-column prop="usestatus" label="入驻状态" align="center">
          <template slot-scope="scope">
            <span :class="common.useColor('','',scope.row.usestatus)">{{common.useStateFormatter("","",scope.row.usestatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="resstatus" label="是否开启" align="center" >
          <template slot-scope="scope">
            <span :class="common.actionColor('','',scope.row.resstatus)">{{common.resStateFormatter("","",scope.row.resstatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280" align="center">
          <template slot-scope="scope">
            <div class="table-btn green" @click="goDetail(scope.row.id)">详情</div>
            <div class="table-btn orange" @click="addApply('edit',scope.row)">编辑</div>
            <div v-if="(scope.row.usestatus== '1' || scope.row.usestatus== '4' ) && scope.row.resstatus =='2' && !scope.row.onapply" class="table-btn purple" @click="changeStatus('1','single',scope.row.id)">开启</div>
            <div v-if="(scope.row.usestatus== '1' || scope.row.usestatus== '4' ) && scope.row.resstatus =='1' && !scope.row.onapply" class="table-btn purple" @click="changeStatus('2','single',scope.row.id)">关闭</div>
            <div v-if="scope.row.usestatus== '1' && !scope.row.onapply" class="table-btn pink" @click="deleteRes('single',scope.row.id)">删除</div>
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
      <el-dialog class="res-apply-dialog" :title= "dialogType =='add' ? '资源新增' : '资源编辑'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="700px" :close-on-click-modal="false">
        <res-form ref="child" :form="form" :formLabelWidth="formLabelWidth" :id="this.activeResType" v-loading="dialogLoading" :typeDetail="typeDetail" :disabled="disabled"></res-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible = false">取 消</div>
          <div class="my-button green"  @click="submit()">提 交</div>
        </div>
      </el-dialog>


    </div>
</template>

<script>
  import resForm from "./resDialog"
    export default {
      name: "index",
      components:{
        resForm
      },
      props:{
        id:String
      },
      data(){
          return{
            activeResType:"",    //默认资源id
            totalPage:1,
            limit:5,
            currentPage:1,
            activeName: 'second',
            resList:[],  //申请列表
            dialogFormVisible: false,
            form: {},
            formLabelWidth: '120px',
            options: [],
            value: '',
            resStatus:this.options.resStatus,
            typeList:JSON.parse(sessionStorage.getItem("typeList")) ,  //资源类型列表
            groupList:[] ,  //学院列表
            searchForm:{},
            dialogType:"" ,//弹框类型
            dialogLoading:false,
            loading:false,
            typeDetail:{},
            selectedIds:"",
            resTypeDetail:{},
            resTypeList:[],
            disbaled:false,
            selectLoading:false
          }
      },
        methods:{
          //搜索学院名称
          remoteMethod(query) {
            this.selectLoading = true;
            if (query !== '') {
              this.common.getGroupList2(query)
                .then(res => {
                  console.log(res);
                  this.selectLoading = false;
                  this.groupList=res.items;
                }).catch(err => {
                this.selectLoading = false;
                this.groupList=[];
              })
            } else {
              this.selectLoading = false;
              this.groupList = [];
            }
          },

          //获取资源类型列表
          getResTypeList(){
            this.loading = true;
            this.util.postAjax({
              code:this.global.code,
              url:"/sprestype/list",
            }).then(res => {
              this.loading = false;
              if(res.success == true){
                this.resTypeList =res.items;
                if(this.id){
                  this.activeResType =this.id;
                }else {
                  this.activeResType=this.resTypeList[0].id;
                }
                this.getList(this.currentPage);
               this.getResTypeDetail(this.activeResType);
              }
            })
          },

          //获取资源类型详情
          getResTypeDetail(id){
            this.common.getResTypeDetail2(id).then(res => {
              this.resTypeDetail=res;
            })
          },

          //资源类型tab切换
          resTypeChange(tab, event){
            this.getResTypeDetail(this.activeResType);
            this.activeResType = tab.name;
            this.currentPage = 1;
            this.getList(1);
          },

          //跳转详情
          goDetail(id){
            this.$router.push({
              path:`/resource-info-management/detail/${id}`,
              query:{
                restypeid:this.activeResType
              }
            },)
          },

          //删除
          deleteRes(num,id){
            let ids="";
           switch (num) {
             case "more":
               ids=this.selectedIds;
               break;
             case "single":
               ids=id;
               break;
           }

            // console.log(ids);

            if(!ids){
              this.$message({
                type:"warning",
                message:"请先选择资源"
              });
            }else {
              // this.selectedIds=id;
              this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.code,
                  url:"/spres/deleteByIds",
                  data:{
                    ids:ids
                  }
                }).then(res => {
                  if(res.success == true){
                    this.currentPage=1;
                    this.getList(this.currentPage);
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                  }else {
                    this.$message({
                      type: 'warning',
                      message: res.data.message
                    });
                  }
                })
              }).catch(() => {});
            }
          },

          //资源状态开启和关闭
          changeStatus(resstatus,num,id){
            let ids="";
            switch (num) {
              case "more":
                ids=this.selectedIds;
                break;
              case "single":
                ids=id;
                break;
            }

            // console.log(ids);
            if(!ids){
              this.$message({
                type:"warning",
                message:"请先选择资源"
              });
            }else{
              this.util.postAjax({
                code:this.global.code,
                url:"/spres/changeStatus",
                data:{
                  resstatus:resstatus,
                  ids:ids
                }
              }).then(res => {
                if(res.success == true){
                  this.getList(this.currentPage);
                  this.$message({
                    type:"success",
                    message:resstatus =="1" ? "资源已开放" : "资源已关闭"
                  });
                }else {
                  this.$message({
                    type: 'warning',
                    message: res.data.message
                  });
                }
              })
            }

          },

          //多选框
          handleSelectionChange(val) {
            // this.multipleSelection = val;
            // console.log(val);
            let arr=[];
            val.forEach(v => {
              arr.push(v.id)
            })
            this.selectedIds =arr.join(",").toString();

            // console.log(this.selectedIds);

            // this.selectedIds=arr;
            // this.selectedIds=val
          },

          //点击分页
          getCurrentChange(currentPage){
            this.currentPage=currentPage;
            this.getList(currentPage)
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
              url:"/spres/pageList",
              data:{
                params:JSON.stringify({
                  page:page,
                  limit:this.limit,
                  restypeid:this.activeResType,
                  orgid:this.searchForm.orgid,
                  rescode:this.searchForm.rescode,
                  usestatus:this.searchForm.usestatus,
                })
              }
            }).then(res =>{
              this.loading=false;
              if(res.success == true){
                // console.log(res);
                this.resList = res.items;
                this.totalPage=res.total;

                this.resList.forEach(v=>{
                  if(v.liveinfo && v.liveinfo.applyendtime){
                    v.liveinfo.applyendtime=this.util.formatTime( v.liveinfo.applyendtime, "yyyy.MM.dd hh:mm:ss")
                  }
                  // v.liveinfo.applyendtime=v.liveinfo.applyendtime ? this.util.formatTime( v.liveinfo.applyendtime, "yyyy.MM.dd hh:mm:ss") : "--"
                })
              }
            })
          },

          //获取类型详情
          getTypeInfo(){
            // this.loading=true;
            this.dialogLoading=true;
            this.util.postAjax({
              code:this.global.code,
              url:"/sprestype/findById",
              data:{
                id:this.activeResType
              }
            }).then(res => {
              // this.loading=false;
              // console.log("11111111",res);
              this.dialogLoading=false;
              if(res.success == true){

                this.typeDetail=res.item;
               /* this.form.oldAttrList=[];
                this.form.oldAttrList=res.item.attrList;*/
                this.form.oldAttrList=res.item.attrList.map(i => {
                  return {
                    name:i.name,
                    attrv: "",
                    typeattrid: i.id
                  }
                });

                // console.log("22",this.form);

                let chargecycle=this.typeDetail.chargecycle;
                let chargetype=this.typeDetail.chargetype;
                this.common.chargecycleFormatter(chargecycle,this.typeDetail);
                this.common.chargetypeFormatter(chargetype,this.typeDetail)

              }
            });
          },

          //打开弹框
          addApply(type,row){
            this.dialogType=type;
            // this.getTypeInfo();
            switch (type) {
              case "add":
                this.form={
                  oldAttrList:[],
                  // baseList2:[]
                };

                this.disabled = false;
                // this.getTypeInfo();

                break;
              case "edit":
                this.dialogLoading=true;
                if(row.usestatus == 1){
                  this.disabled = false
                }else {
                  this.disabled = true
                }
                // this.getTypeInfo();
                this.util.postAjax({
                  code:this.global.code,
                  url:"/spres/findById",
                  data:{
                    id:row.id
                  }
                }).then(res => {
                  this.dialogLoading=false;
                  // console.log(res);
                  // return false;
                  if(res.success == true){

                    this.$nextTick(()=>{
                      this.form=res.item;

                      this.form.oldBaseList=[];
                      this.form.baseList.forEach(v=>{
                        this.form.oldBaseList.push(v.typebaseid)
                      })

                     /* this.form.oldAttrList=[{
                        attrv: "100.1",
                        id: "b555a350e93843b49f38472669c8ed49",
                        name: "新增属性22",
                        resid: "0f5c082b267e4c4db6ad3dd650a6f8cd",
                        typeattrid: "83a66bfa619e4391ab29e7c1c7b6d060"}];*/
                      // this.form.oldAttrList=JSON.parse(JSON.stringify(this.form.attrList));
                      // console.log("打开弹框",this.form);
                    })

                  }
                })
                break;
            }
            this.dialogFormVisible = true;
          },


          //提交
          submit(){
            this.$refs.child.$refs.form.validate((valid) => {
                if (valid) {
                  let url="";
                  let message="";
                  let form=this.$refs.child.form;
                  // console.log("提交时",form);

                  // return false;

                  let baseList=[];
                  let attrList=[];
                  switch (this.dialogType) {
                    case "add":
                      url="/spres/add";
                      message = "新增成功";
                      this.currentPage=1;
                      form.oldAttrList.forEach(v=>{
                        attrList.push({typeattrid:v.id,attrv:v.attrv})
                      });
                      form.oldBaseList.forEach(v=>{
                        baseList.push({typebaseid:v})
                      });
                      form.attrList=attrList;
                      form.baseList=baseList;
                      break;
                    case "edit":
                      url="/spres/update";
                      message = "编辑成功";
                      form.oldAttrList.forEach(v=>{
                        attrList.push({id:v.id,typeattrid:v.typeattrid,attrv:v.attrv,resid:v.resid})
                     });

                      // console.log("this.typeDetail.baseList",this.$refs.child.typeDetail.baseList);
                      form.oldBaseList.forEach(v=>{
                        baseList.push({typebaseid:v})
                      });
                      form.attrList=attrList;
                      form.baseList=baseList;
                      break;
                  }




                  // console.log(this.$refs.child.form);

                  // let typeDetail=this.$refs.child.typeDetail;
                  // console.log("typeDetail",typeDetail);
                  let form2={};
                  form2.id=form.id ? form.id : "";
                  form2.rescode=form.rescode;
                  form2.area=form.area;
                  form2.price=form.price;
                  form2.resstatus=form.resstatus;
                  form2.baseList=form.baseList;
                  form2.attrList=form.attrList;
                  form2.restypeid=this.activeResType;

                  // console.log("form2",form2);

                  // return false;
                  this.util.postAjax({
                    code:this.global.code,
                    url:url,
                    isRep:true,
                    data:form2
                  }).then(res => {
                    if(res.success == true){
                      this.dialogFormVisible = false;
                      this.$message({
                        type:"success",
                        message:message
                      });
                      this.currentPage=1;
                      this.getList(this.currentPage);
                      // this.common.getSeriesLists();
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
          this.getResTypeList();
          this.getTypeInfo()
      }
    }
</script>

<style scoped>

</style>
