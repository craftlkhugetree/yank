<template>
    <div class="common-content">
      <!--搜索框-->
      <div class="search-group">
        <span>
          <label>学院</label>
          <!--<el-select v-model="searchForm.orgid" placeholder="请选择" size="small" style="width: 150px" filterable>
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
        <span class="reset-icon" @click="reSet">
          <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
        </span>
      </div>

      <!--tab切换-->
      <div class="my-tab-wrap">
        <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="1"></el-tab-pane>
          <el-tab-pane label="待审批" name="2"></el-tab-pane>
          <el-tab-pane label="已审批" name="3"></el-tab-pane>
        </el-tabs>

        <!--<div class="my-button green" style="float: right;margin-top: 3px;" @click="operateApply('add',null)">
          <i class="el-icon-plus"></i>
          <span>新增申请</span>
        </div>-->
      </div>

      <el-divider style=""></el-divider>

      <!--表格-->
      <el-table class="my-table" :data="applyList" style="width: 100%" stripe v-loading="loading">
<!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
        <el-table-column prop="usetype" label="申请类型" align="center" :formatter="common.useTypeFormatter"></el-table-column>
        <el-table-column prop="typename" label="资源类型" align="center"></el-table-column>
        <el-table-column prop="rescodes" label="资源编号" align="center"></el-table-column>
        <el-table-column prop="orgname" label="学院名称" align="center"></el-table-column>
        <el-table-column prop="classleadername" label="负责教师" align="center"></el-table-column>
        <el-table-column prop="usecycle" label="时长" align="center">
          <template slot-scope="scope">
            {{scope.row.usecycle ? scope.row.usecycle : "--"}}{{scope.row.chargecyclename}}
          </template>
        </el-table-column>
        <el-table-column prop="applystatus" label="审批状态" align="center">
          <template slot-scope="scope">
            <span :class="common.statusColor('','',scope.row.applystatus)">{{common.processFormatter("","",scope.row.applystatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actionstatus" label="状态" align="center" :formatter="common.applyLiveStatusFormatter">
         <!-- <template slot-scope="scope">
            <span :class="common.actionColor('','',scope.row.actionstatus)">{{common.applyLiveStatusFormatter("","",scope.row.actionstatus)}}</span>
          </template>-->
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <div class="table-btn green" @click="goDetail(scope.row)">详情</div>
            <!--actionstatus-->
            <div v-if="(scope.row.usetype == '1' || scope.row.usetype == '2') && scope.row.actionstatus=='0' && scope.row.applystatus ==3" class="table-btn purple" @click="checkIn(scope.row)">入驻</div>
            <div v-if="scope.row.applystatus == 2" class="table-btn purple" @click="goAudit(scope.row)">审批</div>
            <div v-if="(scope.row.usetype == '3') && scope.row.actionstatus=='0' && scope.row.applystatus ==3 " class="table-btn pink" @click="reCall(scope.row)">退出</div>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="my-pagination" v-if="totalPage > limit">
        <span>显示{{limit}}条，共{{totalPage}}条</span>
        <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                       :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
      </div>

      <!--&lt;!&ndash;弹框&ndash;&gt;
      <el-dialog class="res-apply-dialog" :title="(dialogType == 'add' )? '资源申请新增' : '资源申请编辑'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="700px" :close-on-click-modal="false">
        <apply-form ref="child" :form="form" :formLabelWidth="formLabelWidth" ></apply-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible = false">取 消</div>
          <div class="my-button plain-green"  @click="submit(0)">保 存</div>
          <div class="my-button green" @click="submit(1)">提 交</div>
        </div>
      </el-dialog>-->


    </div>
</template>

<script>
  // import applyForm from "../../components/irrDialog"
    export default {
      name: "index",
      components:{
        // applyForm
      },
      data(){
          return{
            totalPage:1,
            limit:10,
            currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
            activeName: sessionStorage.getItem("activeName") || "2",
            searchForm:{},
            applyList:[],  //申请列表
            dialogFormVisible: false,
            form: {
             /* owngroupname:this.options.userInfo.ORGNAME,
              owngroup:this.options.userInfo.ORGID,
              eventername:this.options.userInfo.NAME,*/
            },
            formLabelWidth: '120px',
            applyStatus:this.options.applyStatus,   //状态列表
            codeList:JSON.parse(sessionStorage.getItem("codeList")) ,  //资源编号列表
            dialogType:"",  //弹框类型
            groupList:[],  //学院列表
            loading:false,
            selectLoading:false,
            disableCheckin:false,
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


          //查询
          search(){
            this.getList(1);
            this.currentPage =1;
          },

          //重置
          reSet(){
            this.searchForm={};
            this.getList(1);
            this.currentPage =1;
          },

          timeFormatter(row, column, cellValue){
            if(cellValue == null){
              return "--"
            }else {
              return this.util.formatTime(cellValue,"yyyy.MM.dd hh:mm:ss")
            }
          },

          //表格内日期格式转化
          dateFormatter(row, column, cellValue){
            if(cellValue && cellValue.length == 14){
              return this.util.formatTime(cellValue,"yyyy.MM.dd")
            }else {
              return cellValue
            }
          },

          //点击分页
          getCurrentChange(currentPage){
            this.currentPage=currentPage;
            this.getList(currentPage)
          },

          //跳转详情
          goDetail(row){
            this.$router.push({
              path:`resource-BM-audit/detail/${row.id}`,
              query:{
                activeName:this.activeName,
                currentPage:this.currentPage
              }
            },)
          },

          //跳转审核页面
          goAudit(row){
            this.$router.push({
              path:`resource-BM-audit/audit/${row.id}`,
              query:{
                activeName:this.activeName,
                currentPage:this.currentPage
              }
            },)
          },

        //入驻
        checkIn(row){
          this.$confirm('确定办理入驻吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            /*let params={
              id:row.id
            };*/
            if(!this.disableCheckin){
              this.disableCheckin=true;
              this.util.postAjax({
                code:this.global.code,
                url:"/spapply/checkIn",
                // isRep:true,
                data:{
                  id:row.id
                }
              }).then(res => {
                // console.log(res);
                this.disableCheckin=false;
                if(res.success == true){
                  this.getList( this.currentPage);
                  // this.currentPage =1;
                }else{
                  // console.log(res);
                  this.$message({
                    type:"warning",
                    message:res.data.message
                  });
                }
              })
            }else{
              this.disableCheckin=false;
            }

            
          }).catch(() => {});
        },


          //白马办退出
          reCall(row){
            this.$confirm('确定办理退出吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              /*let params={
                eventtype:2,
                applyid:row.id
              };*/
              this.util.postAjax({
                code:this.global.code,
                url:"/spapply/checkOut",
                // isRep:true,
                data:{
                  id:row.id
                }
              }).then(res => {
                // console.log(res);
                if(res.success == true){
                  this.getList( this.currentPage);
                  // this.currentPage =1;
                }else{
                  // console.log(res);
                  this.$message({
                    type:"warning",
                    message:res.data.message
                  });
                }
              })
            }).catch(() => {});

          },

          //获取列表
          getList(page){
            this.loading=true;
            this.util.postAjax({
              code:this.global.code,
              url:"/spapply/pageList",
              data:{
                params:JSON.stringify({
                  page:page,
                  limit:this.limit,
                  applytype:this.activeName,
                  // applystatus:this.searchForm.applystatus,
                  rescode:this.searchForm.rescode,
                  orgid:this.searchForm.orgid,
                })
              }
            }).then(res =>{
              this.loading=false;
              if(res.success == true){
                // console.log(res);
                 this.applyList = res.item.bmList.list;
  
                 this.totalPage = res.item.bmList.total;

              
                this.common.chargecycleFormatter2(this.applyList);
              }
            })
          },

          //打开编辑弹框
         /* eidtAudit(row){
            this.util.postAjax({
              code:this.global.code,
              url:"/irapply/findById",
              data:{
                id:row.id
              }
            }).then(res => {
              if(res.success == true){
                console.log(res);
                this.dialogFormVisible = true;
                let apply=res.item.apply;
                this.form={
                  id:apply.id,
                  orgid:apply.orgid,
                  projectname:apply.projectname,
                  classleaderInfo:JSON.stringify(
                    {
                      id:apply.classleaderid,
                      name:apply.classleadername
                    }
                  ),
                  classleadermobile:apply.classleadermobile,
                  eventername:this.options.userInfo.NAME,
                  applyermobile:apply.applyermobile,
                  worker:apply.worker,
                  workermobile:apply.workermobile,
                  irrestypeid:apply.irrestypeid,
                  irdate:apply.irdate,
                  note:apply.note
                };

                let ress=res.item.ress;
                let arr=[];
                ress.forEach(v=>{
                  arr.push(v.id)
                });
                this.form.resids=arr;

                console.log("11",this.form);
                /!* let events= res.item.events;

                 if(apply.applystatus == 0){
                   this.form.event.eventnote = apply.note;
                 }else {
                   events.forEach(v => {
                     if(v.eventtype == 1){
                       this.form.event.eventnote = v.eventnote
                     }
                   })
                   // this.form.event.eventnote=events[0].eventnote;
                 }*!/
              }
            })
          },*/

          //打开弹框
          /*operateApply(type,row){
            this.dialogType=type;
            this.form={
              orgid:this.options.userInfo.ORGID,
              eventername:this.options.userInfo.NAME,
            };
            switch (type) {
              case "add":
                this.dialogFormVisible = true;
                break;
              case "edit":
                this.eidtAudit(row);
                break;
            }
          },*/


          //提交
         /* submit(type){
            this.$refs.child.$refs.form.validate((valid) => {
                if (valid) {
                  console.log(this.$refs.child.form);
                  // return false;
                  let form=this.$refs.child.form;
                  let form2 = {};
                  let url="";
                  let message="";
                  if(type == 0){
                    // form2.note = form.event.eventnote;
                    url="/irapply/saveDraft";
                    message="保存成功";
                  }else {
                    // form2.event=form.event;
                    url="/irapply/save";
                    message="提交成功";
                  }
                  if(form.id){
                    form2.id = form.id;
                  }
                  // form2.owngroupname=form.owngroupname;

                  form2.orgid=form.orgid;
                  form2.projectname=form.projectname;
                  let classleaderInfo= JSON.parse(form.classleaderInfo);
                  form2.classleaderid=classleaderInfo.id;
                  form2.classleadername=classleaderInfo.name;
                  form2.worker=form.worker;
                  form2.classleadermobile=form.classleadermobile;
                  form2.applyermobile=form.applyermobile;
                  form2.workermobile=form.workermobile;
                  form2.irrestypeid=form.irrestypeid;
                  form2.note=form.note;
                  //资源编号格式转换
                  let arr=[];
                  this.codeList.forEach(m=>{
                    form.resids.forEach(v=>{
                      if(m.id==v){
                        arr.push({resid:v})
                      }
                    })
                  });
                  form2.resList=arr;
                  form2.irdate=form.irdate ? this.util.formatTime(form.irdate,"yyyyMMdd000000") : "";

                  console.log("form2",form2);

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
                      this.getList(1);
                      this.currentPage =1;
                    }
                  })
                }
            });
            // return false;


          },*/



          //tab切换
          handleClick(row) {
            this.currentPage = 1;
            this.getList(1);
          }
        },
      created() {
          this.getList(this.currentPage);
          this.common.getSeriesLists();
      },
      beforeDestroy() {
        sessionStorage.removeItem("currentPage");
        sessionStorage.removeItem("activeName");
      },
    }
</script>

<style scoped>

</style>
