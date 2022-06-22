<template>
    <div class="common-content">
      <!--面包屑-->
<!--      <bread-crumb :breadList="breadList"></bread-crumb>-->

      <!--搜索框-->
      <div class="search-group">
        <span>
          <label>状态</label>
          <el-select v-model="searchForm.applystatus" placeholder="请选择" size="small" style="width: 150px">
            <el-option v-for="item in applyStatus" :key="item.id" :label="item.name" :value="item.id" ></el-option>
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
          <el-tab-pane label="全部申请" name="1"></el-tab-pane>
          <el-tab-pane label="已提交" name="3"></el-tab-pane>
          <el-tab-pane label="草稿箱" name="2"></el-tab-pane>
        </el-tabs>

        <div class="my-button green" style="float: right;margin-top: 3px;" @click="operateApply('add',null)">
          <i class="el-icon-plus"></i>
          <span>新增申请</span>
        </div>
      </div>

      <el-divider style=""></el-divider>

      <!--表格-->
      <el-table class="my-table" :data="applyList" style="width: 100%" stripe v-loading="loading">
<!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
        <el-table-column prop="typename" label="灌溉类型" align="center"></el-table-column>
        <el-table-column prop="rescodes" label="资源编号" align="center"></el-table-column>
        <el-table-column prop="irdate" label="灌溉日期" align="center" :formatter="dateFormatter"></el-table-column>
        <el-table-column prop="endtime" label="完成时间" align="center" :formatter="timeFormatter"></el-table-column>
        <el-table-column prop="applystatus" label="状态" align="center">
          <template slot-scope="scope">
            <span :class="common.statusColor('','',scope.row.applystatus)">{{common.statusFormatter("","",scope.row.applystatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.applystatus ==0" class="table-btn orange" @click="operateApply('edit',scope.row)">编辑</div>
            <div v-if="scope.row.applystatus !=0" class="table-btn green" @click="goDetail(scope.row)">详情</div>
            <div v-if="scope.row.applystatus==1 || scope.row.applystatus ==2" class="table-btn pink" @click="reCall(scope.row)">撤回</div>
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
      <el-dialog class="res-apply-dialog" :title="(dialogType == 'add' )? '资源申请新增' : '资源申请编辑'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="700px" :close-on-click-modal="false">
        <apply-form ref="child" :form="form" :formLabelWidth="formLabelWidth"></apply-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible = false">取 消</div>
          <div class="my-button plain-green"  @click="submit(0)">保 存</div>
          <div class="my-button green" @click="submit(1)">提 交</div>
        </div>
      </el-dialog>


    </div>
</template>

<script>
  import applyForm from "../../components/irrDialog"
  import breadCrumb from "../../components/breadcrumb";

  export default {
      name: "index",
      components:{
        applyForm,breadCrumb
      },
      props:{
        breadList:Array,
        enterType:Number
      },
      data(){
          return{
            loading:false,
            totalPage:1,
            limit:10,
            currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
            activeName: sessionStorage.getItem("activeName") || "1",
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
            firstRow:{}
          }
      },

       beforeDestroy() {
        sessionStorage.removeItem("currentPage");
        sessionStorage.removeItem("activeName");
      },

      methods:{
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
              path:`irrigate-apply/irrigate-apply-detail/${row.id}`,
              query:{
                activeName:this.activeName,
                currentPage:this.currentPage
              }
            },)
          },

          //撤回
          reCall(row){
            this.$confirm('确定撤回此申请单吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let params={
                eventtype:2,
                applyid:row.id
              };
              this.util.postAjax({
                code:this.global.code,
                url:"/irapply/saveEvent",
                isRep:true,
                data:params
              }).then(res => {
                // console.log(res);
                if(res.success == true){
                  this.getList( this.currentPage);
                  // this.currentPage =1;
                }else {
                  this.$message({
                    type: 'warning',
                    message: res.data.message
                  });
                }
              })
            }).catch(() => {});
          },

          setSessionStorage(){
            sessionStorage.setItem("currentPage",this.currentPage);
            sessionStorage.setItem("limit",this.limit);
            sessionStorage.setItem("activeName",this.activeName);
            sessionStorage.setItem("applystatus",this.searchForm.applystatus);
            sessionStorage.setItem("rescode",this.searchForm.rescode);
          },

          //获取列表
          getList(page){
            this.loading=true;

            // this.setSessionStorage();

            this.util.postAjax({
              code:this.global.code,
              url:"/irapply/pageList",
              data:{
                params:JSON.stringify({
                  page:page,
                  limit:this.limit,
                  applytype:this.activeName,
                  applystatus:this.searchForm.applystatus,
                  rescode:this.searchForm.rescode
                })
              }
            }).then(res =>{
              this.loading=false;
              if(res.success == true){
                this.applyList = res.item.applyerList.list;
                this.totalPage = res.item.applyerList.total;

                if(this.activeName != 2){
                  this.firstRow=this.applyList[0];
                }
              }
              // console.log("1111",this.applyList);
            })
          },

          //打开编辑弹框
          eidtAudit(row,type){
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
                let ress=res.item.ress;
                let arr=[];
                ress.forEach(v=>{
                  arr.push(v.id)
                });
                // this.form.resids=JSON.parse(JSON.stringify(arr));
                // if(type == "edit"){
                //   this.form.id=apply.id
                // }

                // console.log("type",type)

                this.form={
                  id:type == "edit" ? apply.id : null,
                  orgid:apply.orgid,
                  projectname:apply.projectname,
                  classleadername:apply.classleadername,
                  classleaderid:apply.classleaderid,
                  classleadermobile:apply.classleadermobile,
                  eventername:this.options.userInfo.NAME,
                  applyermobile:apply.applyermobile,
                  worker:apply.worker,
                  workermobile:apply.workermobile,
                  irrestypeid:apply.irrestypeid,
                  irdate: type == "edit" ?apply.irdate : new Date(), 
                  note:apply.note,
                  resids:JSON.parse(JSON.stringify(arr)),
                  daytype: apply.daytype
                };



                // console.log("11",this.form);
              }
            })
          },

          //打开弹框
          operateApply(type,row){
            this.dialogType=type;
            this.form={
              orgid:this.options.userInfo.ORGID,
              eventername:this.options.userInfo.NAME,
              resids:[],
              projectbh:""
            };
            switch (type) {
              case "add":
                this.dialogFormVisible = true;
                if(this.firstRow){
                  // let apply=this.applyList[0];

                  
                  this.eidtAudit(this.firstRow,"add");
                  
                  // let ress=apply.rescodes;


                  // // let arr=[];
                  // // ress.forEach(v=>{
                  // //   arr.push(v.resid)
                  // // });
                  // this.form={
                  //   orgid:apply.orgid,
                  //   projectname:apply.projectname,
                  //   classleadername:apply.classleadername,
                  //   classleaderid:apply.classleaderid,
                  //   classleadermobile:apply.classleadermobile,
                  //   eventername:this.options.userInfo.NAME,
                  //   applyermobile:apply.applyermobile,
                  //   worker:apply.worker,
                  //   workermobile:apply.workermobile,
                  //   irrestypeid:apply.irrestypeid,
                  //   irdate:apply.irdate,
                  //   note:apply.note,
                  //   // resids:JSON.parse(JSON.stringify(arr))
                  // }

                }
                break;
              case "edit":
                this.eidtAudit(row,"edit");
                break;
            }
          },


          //提交的数据
          submitData(type){
            let form=this.$refs.child.form;
            let form2 = {};
            let url="";
            let message="";
            let text="";
            if(type == 0){
              // form2.note = form.event.eventnote;
              url="/irapply/saveDraft";
              message="保存成功";
              text="保存中"
            }else {
              // form2.event=form.event;
              url="/irapply/save";
              message="提交成功";
              text="提交中"
            }

            // console.log("form",form)
            // if(form.id){
            //   form2.id = form.id;
            // }
            // form2.owngroupname=form.owngroupname;
            form2.daytype = this.$refs.child.selectTimeId;
            form2.id = form.id;
            form2.orgid=form.orgid;
            form2.projectname=form.projectname;
            form2.projectbh=form.projectbh;
            /*let classleaderInfo= JSON.parse(form.classleaderInfo);
            form2.classleaderid=classleaderInfo.id;
            form2.classleadername=classleaderInfo.name;*/
            form2.classleaderid=form.classleaderid;
            form2.classleadername=form.classleadername;
            form2.worker=form.worker;
            form2.classleadermobile=form.classleadermobile;
            form2.applyermobile=form.applyermobile;
            form2.workermobile=form.workermobile;
            form2.irrestypeid=form.irrestypeid;
            form2.note=form.note;
            //资源编号格式转换
            let arr=[];
            form.resids.forEach(v=>{
              arr.push({resid:v})
            });
            /* this.codeList.forEach(m=>{
               form.resids.forEach(v=>{
                 if(m.id==v){
                   arr.push({resid:v})
                 }
               })
             });*/
            form2.resList=arr;
            let time = this.dialogType === 'edit' && form.irdate ? form.irdate : new Date(form.irdate || new Date()).getTime();
            form2.irdate=form.irdate ? this.util.formatTime(time, "yyyyMMdd000000") : "";


            const loading = this.$loading({
                lock: true,
                text: text,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });

            // return false;
            this.util.postAjax({
              code:this.global.code,
              url:url,
              isRep:true,
              data:form2
            }).then(res => {
              loading.close();
              if(res.success == true){
                this.dialogFormVisible = false;
                this.$message({
                  type:"success",
                  message:message
                });
                this.getList(1);
                this.currentPage =1;
                // sessionStorage.setItem("form",JSON.stringify(form2));

              }else{
                // console.log(res);
                this.$message({
                  type:"warning",
                  message:res.data.message
                });
              }
            })
          },


          //提交
          submit(type){

            if(type == 0){
              this.submitData(type)
            }else{
              this.$refs.child.$refs.form.validate((valid) => {
                if (valid) {
                  // return false;
                  this.submitData(type)
                }
              });
            }
          },



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
        sessionStorage.removeItem("limit");
        sessionStorage.removeItem("activeName");
        sessionStorage.removeItem("applystatus");
        sessionStorage.removeItem("rescode");
        // sessionStorage.removeItem("form");
      }
  }
</script>

<style scoped>

</style>
