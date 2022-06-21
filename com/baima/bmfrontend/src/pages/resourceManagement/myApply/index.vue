<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
      <span>
        <label>状态</label>
        <el-select v-model="searchForm.applystatus" placeholder="请选择" size="small" style="width: 150px">
          <el-option v-for="item in options.resApplyStatus" v-if="item.id !=9" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>
      </span>
      <span>
          <el-input v-model="searchForm.rescode" placeholder="请输入资源编号" prefix-icon="el-icon-search" size="small" style="width: 220px"></el-input>
          <el-button size="small" style="width: 100px" @click="search">搜索</el-button>
        </span>
      <span class="reset-icon" @click="reSet">
          <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
        </span>

      <div class="my-button green" style="float: right;margin-top: 3px;"  @click="downForm">
<!--        <i class="el-icon-plus"></i>-->
        <span>下载转账单</span>
      </div>
    </div>

    <!--表格-->
    <el-table class="my-table" :data="applyList" style="width: 100%" stripe v-loading="loading">
      <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
<!--      <el-table-column label="序号" align="center" type="index"></el-table-column>-->
      <el-table-column prop="usetype" label="申请类型" align="center" :formatter="common.useTypeFormatter"></el-table-column>
      <el-table-column prop="rescodes" label="资源编号" align="center"></el-table-column>
      <el-table-column prop="projectname" label="项目名称" align="center" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column prop="usecycle" label="时长" align="center">
        <template slot-scope="scope">
         {{scope.row.usecycle ? scope.row.usecycle : "--"}}{{scope.row.chargecyclename}}
        </template>
      </el-table-column>
      <el-table-column prop="applystatus" label="状态" align="center">
        <template slot-scope="scope">
          <span :class="common.statusColor('','',scope.row.applystatus)">{{common.processFormatter("","",scope.row.applystatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rescodes" label="申请表" align="center" width="150">
        <template slot-scope="scope" >
          <div v-if="scope.row.usetype !=3">
            <img class="table-img-attachment" src="../../../../static/images/attachment-icon.png" alt="">
            <span class="table-text-download"  @click="downloadApplyForm(1,scope.row.id)">{{scope.row.projectname}}申请单</span>
          </div>
          <div v-else>--</div>

        </template>
      </el-table-column>
      <el-table-column prop="rescodes" label="协议" align="center"  width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.usetype !=3">
            <img class="table-img-attachment" src="../../../../static/images/attachment-icon.png" alt="">
            <span class="table-text-download" @click="downloadAgreement(1,scope.row.id)" >{{scope.row.projectname}}协议</span>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
<!--          <div v-if ="scope.row.applystatus ==0" class="table-btn orange" @click="operateApply('edit',scope.row)">编辑</div>-->
          <div class="table-btn green" @click="goDetail(scope.row.id)">详情</div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit">
      <span>显示{{limit}}条，共{{totalPage}}条</span>
      <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                     :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
    </div>


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
        currentPage:JSON.parse(sessionStorage.getItem("currentPage")) || 1 ,
        searchForm:{},
        applyList:[],  //申请列表
        dialogFormVisible: false,
        form: {},
        formLabelWidth: '120px',
        dialogType:"",  //弹框类型
        downUrl: window.g.ApiUrl3 + "rest/FileOut/down?ID=",
        loading:false
      }
    },

    methods:{
      //申请单操作
      downloadApplyForm(type,id){
        // console.log(id);
        // type 1下载2预览
       this.util.getUrlByCode(this.global.code,"/spapply/applyForm").then(res=>{
         window.open(res+"?id="+id+"&type="+type)
       })
      },

      //协议操作
      downloadAgreement(type,id){
        // console.log(id);
        // type 1下载2预览
        this.util.getUrlByCode(this.global.code,"/spapply/applyRules").then(res=>{
          window.open(res+"?id="+id+"&type="+type)
        })
      },

      //下载转账单
      downForm(){
        this.util.postAjax({
          code:this.global.code,
          url:"/rules/findByCode",
          data:{
            code:"BILLTEMPLATEID"
          }
        }).then(res => {
          if(res.success == true){
            // console.log(res);
            window.open(this.downUrl+res.item.rulevalue,"_blank")
          }
        })
      },



      //查询
      search(){
        this.currentPage =1;
        this.getList(this.currentPage);

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

      //跳转申请记录详情
      goDetail(id){
        this.$router.push({
          path:`my-apply/detail/${id}`,
          query:{
            currentPage:this.currentPage
          }

        },)
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
              applystatus:this.searchForm.applystatus,  //'1:单位领导审核中2:白马办审核中3:已完成8:驳回9:撤回'
              rescode:this.searchForm.rescode
            })
          }
        }).then(res =>{
          this.loading=false;
          if(res.success == true){
            this.applyList = res.item.applyerList.list;
            this.totalPage = res.item.applyerList.total;
            this.common.chargecycleFormatter2(this.applyList);
          }

        })
      },

      //打开编辑弹框
      eidtAudit(row){
        this.util.postAjax({
          code:this.global.code,
          url:"/irapply/findById",
          data:{
            id:row.id
          }
        }).then(res => {
          if(res.success == true){
            // console.log(res);
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

            // console.log("11",this.form);
            /* let events= res.item.events;

             if(apply.applystatus == 0){
               this.form.event.eventnote = apply.note;
             }else {
               events.forEach(v => {
                 if(v.eventtype == 1){
                   this.form.event.eventnote = v.eventnote
                 }
               })
               // this.form.event.eventnote=events[0].eventnote;
             }*/
          }
        })
      },

      //打开弹框
      operateApply(type,row){
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
      },


      //提交
      submit(type){
        this.$refs.child.$refs.form.validate((valid) => {
          if (valid) {
            // console.log(this.$refs.child.form);
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
                this.getList(1);
                this.currentPage =1;
              }else {
                this.$message({
                  type:"warning",
                  message:res.data.message
                });
              }
            })
          }
        });
        // return false;


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
      },
  }
</script>

<style scoped>

</style>
