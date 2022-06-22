<template>
  <div class="common-content">


    <el-tabs class="my-border-card" type="border-card" v-model="activeResType" @tab-click="resTypeChange">
      <el-tab-pane :label="item.name" v-for="item in resTypeList" :key="item.id" :name="item.id"></el-tab-pane>
    </el-tabs>

    <!--搜索框-->
    <div class="search-group">
       <!--<span>
          <label>状态</label>
          <el-select v-model="searchForm.usestatus" placeholder="请选择" size="small" style="width: 150px">
            <el-option v-for="item in options.resStatus" :key="item.id" :label="item.name" :value="item.id" ></el-option>
          </el-select>
        </span>-->
        
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
        <el-tab-pane label="我的资源" name="1"></el-tab-pane>
        <el-tab-pane label="空闲资源" name="2"></el-tab-pane>
      </el-tabs>

      <span style="float: right;">
        <div v-if="activeName == 2" class="my-button green" style="margin-top: 3px;margin-right: 10px" @click="operateApply('add',null)">
          <i class="el-icon-plus"></i>
          <span>新增申请</span>
        </div>

        <!--<div class="my-button plain-green" style="" @click="changeStatus('2','more',null)">
          <img class="image" style="margin-top: 7px" src="../../../../static/images/bm-res-close.png" alt="">
          <span>批量退出</span>
        </div>-->
      </span>
    </div>

    <el-divider style=""></el-divider>

    <!--表格-->
    <el-table class="my-table" :data="resList" style="width: 100%" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" >
      <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
<!--      <el-table-column type="selection" width="45" align="center" fixed="left" ></el-table-column>-->
      <el-table-column prop="rescode" label="资源编号" align="center"></el-table-column>
      <el-table-column prop="area" label="面积(㎡)"  width="100" align="center"></el-table-column>
      <el-table-column v-if="resTypeDetail.chargecycle" prop="price" :label="'单价（元/'+resTypeDetail.chargecycle+'/'+resTypeDetail.chargetype+'）'" align="center" width="80" :formatter="common.moneyFormatter"></el-table-column>
      <el-table-column v-else prop="price" :label="'单价（元/'+'--'+'/'+'--'+''+'）'" align="center" width="150"></el-table-column>
<!--      <el-table-column prop="price" :label="'单价（元/'+(resTypeDetail && resTypeDetail.chargecycle ? resTypeDetail.chargecycle : '&#45;&#45;')+'/'+(resTypeDetail && resTypeDetail.chargetype ? +resTypeDetail.chargetype : '&#45;&#45;')+'）'" align="center" width="150"></el-table-column>-->
      <el-table-column prop="liveinfo" label="入驻信息" align="center">
        <el-table-column prop="liveinfo.orgname" label="学院名称"  width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="liveinfo.projectname" label="项目名称"  width="200" show-overflow-tooltip>
         <!-- <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.liveinfo.projectname" placement="right">
              <div style="width: 100%;" class="ellipsis">{{scope.row.liveinfo.projectname}}</div>
            </el-tooltip>
          </template>-->
        </el-table-column>
        <el-table-column prop="liveinfo.classleadername" label="负责人" align="center" width="100"></el-table-column>
        <el-table-column prop="liveinfo.classleadermobile" label="联系方式" align="center" width="120"></el-table-column>
        <el-table-column prop="liveinfo.applyendtime" label="退出时间" width="100" align="center"></el-table-column>
        <el-table-column prop="liveinfo.waterFee" label="待缴水费(元)" :formatter="common.moneyFormatter" align="center" width="90"></el-table-column>
        <el-table-column prop="liveinfo.eleFee" label="待缴电费(元)" :formatter="common.moneyFormatter" align="center" width="90"></el-table-column>
        <el-table-column prop="liveinfo.limitDay" label="剩余使用时间(天)" width="120" align="center">
          <template slot-scope="scope">
            <span :style="{'color': scope.row.liveinfo && scope.row.liveinfo.limitDay <=30 ? 'red' : ''}">{{scope.row.liveinfo && scope.row.liveinfo.limitDay ? scope.row.liveinfo.limitDay : ""}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="usestatus" label="入驻状态" align="center">
        <template slot-scope="scope">
          <span :class="common.useColor('','',scope.row.usestatus)">{{common.useStateFormatter("","",scope.row.usestatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.usestatus == '3'" class="table-btn orange" @click="repair('add',scope.row)">报修</div>
          <div class="table-btn green" @click="goDetail(scope.row.id)">详情</div>
          <!-- 续租：已入驻 并且 没有续租申请 并且 没有 退出申请 并且 剩余时间小于30天 -->
          <div v-if="scope.row.usestatus == '3' && (!scope.row.hasXuzApply && !scope.row.hasExitApply) && ( scope.row.liveinfo && scope.row.liveinfo.limitDay <=30)" class="table-btn blue" @click="operateApply('continue',scope.row)">续租</div>
          <!-- 退出：已入驻 并且 没有续租申请 并且 没有 退出申请 -->
          <div v-if="scope.row.usestatus == '3' && (!scope.row.hasXuzApply && !scope.row.hasExitApply)" class="table-btn pink" @click="checkOut(scope.row.id)">退出</div>


         <!-- <div v-if="scope.row.resstatus =='2'" class="table-btn purple" @click="changeStatus('1','single',scope.row.id)">开启</div>
          <div v-else class="table-btn purple" @click="changeStatus('2','single',scope.row.id)">关闭</div>-->
        </template>
      </el-table-column>
    </el-table>


    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit" style="padding-bottom: 80px">
      <span>显示{{limit}}条，共{{totalPage}}条</span>
      <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                     :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
    </div>

    <!--资源申请弹框-->
    <el-dialog class="res-apply-dialog" :title="applyTitle" v-if="applyFormVisible" :visible.sync="applyFormVisible"
               width="700px" :close-on-click-modal="false">
      <apply-form ref="child" :form="form" :formLabelWidth="formLabelWidth" :resList="resListNoPage" :dialogType="dialogType" :resTypeDetail="resTypeDetail" ></apply-form>

      <el-dialog  width="900px" title="南京农业大学白马教学科研基地科教资源租用协议" v-if="innerVisible" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
        <agreement-form ref="innnerchild" :form="form" :resTypeDetail="resTypeDetail" :endApplyTime="endApplyTime" :dialogType="dialogType"></agreement-form>
        <div>
          <el-checkbox v-model="readchecked">已阅读上述协议后请确认填写信息无误</el-checkbox>
        </div>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="innerVisible = false">取 消</div>
          <div v-if="dialogType == 'add'" class="my-button green" @click="innerSubmit('add')">确 认</div>
          <div v-if="dialogType == 'continue'" class="my-button green" @click="innerSubmit('continue')">确 认</div>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="applyFormVisible = false">取 消</div>
        <div v-if="dialogType == 'add'" class="my-button green" @click="submit('add')">提 交</div>
        <div v-if="dialogType == 'continue'" class="my-button green" @click="submit('continue')">提 交</div>
      </div>
    </el-dialog>

    <!--报修弹框-->
    <el-dialog class="res-apply-dialog repair-dialog" title="报修" v-if="repairFormVisible" :visible.sync="repairFormVisible"
               width="550px" :close-on-click-modal="false">
      <repair-form ref="child" :repairform="repairform" v-if="repairFormVisible" :formLabelWidth="formLabelWidth2" ></repair-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="repairFormVisible = false">取 消</div>
        <div class="my-button green" @click="submitRepair('add')">提 交</div>
      </div>
    </el-dialog>

    <div class="total-fee">
      <span class="text">合计待缴费用：</span>
      <span class="fee">{{common.moneyFormatter("","",needPay)}}元</span>
    </div>
  </div>
</template>

<script>
  import applyForm from "./resApplyDialog"
  import repairForm from "./repairDialog"
  import agreementForm from "./agreementForm";
  export default {
    name: "index",
    components:{
      applyForm,repairForm,agreementForm
    },
    data(){
      return{
        needPay:"",
        readchecked:false,   //是否已经阅读
        innerVisible:false,
        totalPage:1,
        limit:10,
        currentPage:JSON.parse(sessionStorage.getItem("currentPage")) || 1 ,
        orderBy:null,
        sort:null,
        activeName: sessionStorage.getItem("activeName") || '1',
        searchForm:{},
        applyList:[],  //申请列表
        applyFormVisible: false,
        form: {
          owngroupname:this.options.userInfo.ORGNAME,
           owngroup:this.options.userInfo.ORGID,
           eventername:this.options.userInfo.NAME,

        },
        formLabelWidth: '120px',
        formLabelWidth2:"100px",
        applyStatus:this.options.applyStatus,   //状态列表
        codeList:JSON.parse(sessionStorage.getItem("codeList")) ,  //资源编号列表
        dialogType:"",  //弹框类型
        groupList:JSON.parse(sessionStorage.getItem("groupList")) ,  //学院列表
        resTypeList:[],  //资源类型列表
        activeResType:"",    //默认资源id
        resList:[],    //资源列表
        resListNoPage:[],    //资源列表无分页
        selectedIds:"",   //多选框值
        // userid:this.userInfo,
        loading:false,
        applyTitle:"",
        resTypeDetail:{},
        repairFormVisible:false,
        repairform:{
        },
        endApplyTime:"",  //申请单退出时间
      }
    },

    computed:{
      userInfo() {
        return this.$store.state.userInfo;
      },
    },


    methods:{
      //排序
      sortChange(column, prop, order){
        this.orderBy=column.prop.toUpperCase();
        // console.log(this.orderBy);
        switch (column.order) {
          case "ascending":
            this.sort="asc";
            break;
          case "descending":
            this.sort="desc";
            break;
        }
        this.currentPage=1;
        this.getList(this.currentPage);
        this.getListNoPage();
      },

      //总支付费用
      getPayAll(){
        this.util.postAjax({
          code:this.global.code,
          url:"/spreselec/needPayAll",
        }).then(res => {
          if(res.success){
            // console.log(res);
            this.needPay=res.item.needAllPay;
            if(!this.needPay){
              this.needPay=0
            }
          }
        })
      },

      //报修申请
      repair(type,row){
        // console.log(row);
        this.repairFormVisible=true;
        this.repairform={
          orgid:row.liveinfo.orgid,
          sprestypeid:row.restypeid,
          rescode:row.rescode,
          resList:[{resid:row.id}],
          files:[]
        }
      },

      //报修弹框提交
      submitRepair(){
        this.$refs.child.$refs.repairform.validate((valid) => {
          if (valid) {
            // console.log(this.$refs.child.repairform)
            let repairform=this.$refs.child.repairform;
            let files=this.$refs.child.files;
            files.forEach(v=>{
              v.FILEID=v.ID;
            })
            let form={
              orgid:repairform.orgid,
              sprestypeid:repairform.sprestypeid,
              resList:repairform.resList,
              files:files,
              problemnote:repairform.problemnote
            }

            // console.log(form);

            // return false;
            this.util.postAjax({
              code:this.global.code,
              url:"/sprepair/add",
              isRep:true,
              data:form
            }).then(res => {
              if(res.success == true){
                this.$message({
                  type:"success",
                  message:"报修成功，请等待相关人员处理"
                });
                this.repairFormVisible=false
              }else{
                // console.log(res);
                this.$message({
                  type:"warning",
                  message:res.data.message
                });
              }
            })
          }
        })
      },


      //控制选框是否能选
      selectable(row){
        if(row.usestatus == "3"){
          return true
        }else{
          return false
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

      //查询
      search(){
        this.currentPage =1;
        this.getList(this.currentPage);
        
        this.getListNoPage();
      },

      //重置
      reSet(){
        this.searchForm.rescode=null;
        this.currentPage =1;
        this.getList(this.currentPage);
        
        this.getListNoPage();
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
        this.getList(currentPage);
        this.getListNoPage();
      },

      //跳转详情
      goDetail(id){

        this.$router.push({
          path:`resource-apply/detail/${id}`,
          query:{
            restypeid:this.activeResType,
            currentPage:this.currentPage,
            activeName:this.activeName,
          }
        },)
      },

      //一键退出
      checkOut(id){
        this.$confirm('一旦退出后便不可再使用，确定退出吗？', '确认退出？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          /*let params={
            resid:row.id
          };*/

          this.loading=true;
          this.util.postAjax({
            code:this.global.code,
            url:"/spres/saveCheckOut",
            // isRep:true,
            data:{
              resId:id
            }
          }).then(res => {

            this.loading=false;
            // console.log(res);
            if(res.success == true){
              this.getList( this.currentPage);
              this.getListNoPage();
              this.$message({
                type: 'success',
                message: '已提交退出申请，请等待白马办审批!'
              });
            }else {
              this.$message({
                type:"warning",
                message:res.data.message
              });
            }
          })
        }).catch(() => {
          this.loading = false;
        });
      },

      //获取资源列表
      getList(page){
        this.loading=true;


        console.log(this.currentPage);
        this.util.postAjax({
          code:this.global.code,
          url:"/spres/pageList",
          data:{
            params:JSON.stringify({
              page:this.currentPage,
              limit:this.limit,
              restypeid:this.activeResType,
              // orgid:this.searchForm.orgid,
              rescode:this.searchForm.rescode,
              usestatus:this.searchForm.usestatus,
              userid:this.searchForm.usestatus == 3 ? this.userInfo.ID : null,
              resstatus:this.searchForm.usestatus == 1 ? "1" :null
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
            })
          }
        })
      },

      //获取资源列表
      getListNoPage(){
        this.loading=true;
        this.util.postAjax({
          code:this.global.code,
          url:"/spres/pageList",
          data:{
            params:JSON.stringify({
              page:1,
              limit:10000,
              restypeid:this.activeResType,
              usestatus:this.searchForm.usestatus,
              userid:this.searchForm.usestatus == 3 ? this.userInfo.ID : null,
              resstatus:this.searchForm.usestatus == 1 ? "1" :null
            })
          }
        }).then(res =>{
          this.loading=false;
          if(res.success == true){
            // console.log(res);
            this.resListNoPage = res.items;
          }
        })
      },

      //打开弹框
      operateApply(type,row){
        this.dialogType=type;
        this.applyFormVisible = true;
        // console.log("userInfo",this.options.userInfo);

        if(this.dialogType == "add"){
          this.form={
           orgid:this.userInfo.ORGID,
            orgname:this.userInfo.ORGNAME,
            eventername:this.options.userInfo.NAME,
          };
        }else if(this.dialogType == "continue"){
          this.form={
            orgid:this.userInfo.ORGID,
            orgname:this.userInfo.ORGNAME,
            eventername:this.options.userInfo.NAME,
          };
        }

        // this.getTypeInfo();
        switch (type) {
          case "add":
            this.applyTitle="资源申请新增(请在审批后5个工作日内办理入驻)";
            break;
          case "edit":
            this.applyTitle="资源申请编辑(请在审批后5个工作日内办理入驻)";
            break;
          case "continue":
            this.applyTitle="续租申请(请在审批后5个工作日内办理入驻)";
            this.form.resids=row.id.split(",");
            this.form.areas=row.area;
            this.endApplyTime=row.liveinfo.applyendtime;
            break;
        }
      },


      //提交
       submit(type){
         /*console.log(this.$refs.child.form);
          return;*/
           this.$refs.child.$refs.form.validate((valid) => {
             if (valid) {
               this.innerVisible=true;
               this.readchecked=false;
               setTimeout(()=>{
                 this.$refs.innnerchild.calcFee();
               },500)
             }
           });

       },

      //弹框内确认
      innerSubmit(type){

        if(this.readchecked){
          this.$refs.child.$refs.form.validate((valid) => {
            if (valid) {
              let form=this.$refs.child.form;
              
              let form2 = {};
              let url="";
              let usetype="";    //使用类型：1入驻，2续租
              let message="";
              if(type =='add'){
                // form2.event=form.event;
                url="/spapply/save";
                message="添加成功";
                usetype="1";
                // form2.note = form.event.eventnote;
              }else if(type == 'edit'){
                url="/spapply/edit";
                message="编辑成功";
              }else if(type =='continue'){
                url="/spapply/save";
                message="续租申请已提交，请等待领导审批";
                usetype="2";
              }

              if(form.id){
                form2.id = form.id;
              }

              form2.resList=[];
              form.resids.forEach(v=>{
                form2.resList.push({resid:v});
              })

              form2.classname=form.classname;
              form2.applyermobile=form.applyermobile;
              form2.classleadername=form.classleadername;
              form2.classleaderid=form.classleaderid;
              form2.classleadermobile=form.classleadermobile;
              form2.projectname=form.projectname;
              form2.projectbh=form.projectbh;
              form2.projectfrom=form.projectfrom;
              form2.projectprice=form.projectprice;
              form2.usecycle=form.usecycle;
              form2.projectnote=form.projectnote;
              form2.situation=form.situation;
              form2.approverid=form.approverid;
              form2.orgid=form.orgid;

              //暂时添加

              // if(this.dialogType == "add"){
              //   form2.applyerid=form.applyerid;
              //   form2.applyername=form.applyername;
              //   form2.applytime=form.applytime;
              // }

              

              form2.sprestypeid=this.activeResType;
              form2.usetype=usetype;

              

              const loading = this.$loading({
                lock: true,
                text: '提交中',
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
                  this.applyFormVisible = false;
                  this.innerVisible=false;
                  this.$message({
                    type:"success",
                    message:message
                  });
                  this.currentPage =1;
                  this.getList(this.currentPage);
                  this.getListNoPage();

                }else {
                  this.$message({
                    type:"warning",
                    message:res.data.message
                  });
                }
              })
            }
          });
        }else {
          this.$message({
            type:"warning",
            message:"请先阅读以上协议，阅读完后请勾选"
          })
        }
      },



      //tab切换
      handleClick(row) {
        if(this.activeName == "1"){
          // this.userid = this.options.userInfo.ID;
          this.searchForm.usestatus = "3"
        }else{
          // this.userid = null;
          this.searchForm.usestatus = "1"
        }

        if(sessionStorage.getItem("fromDetail") == "1"){
            this.currentPage = JSON.parse(sessionStorage.getItem("currentPage"));
        }else{
            this.currentPage = 1
        }

        
        this.getList(this.currentPage);
        this.getListNoPage();
      },

      //资源类型tab切换
      resTypeChange(tab, event){
        this.getResTypeDetail(this.activeResType);
        this.currentPage = 1;
        this.getList(this.currentPage);
        this.getListNoPage();
      },

      //获取资源类型详情
      getResTypeDetail(id){
        this.common.getResTypeDetail2(id).then(res => {
          this.resTypeDetail=res;
        })
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
            this.activeResType= sessionStorage.getItem("activeResType") || this.resTypeList[0].id;
            this.form.usestatus=3;
            this.getList(this.currentPage);
            this.getListNoPage();
            this.getResTypeDetail(this.activeResType);
            // console.log(this.resTypeDetail);
          }
        })
      }
    },
    created() {

      this.getResTypeList();
      this.handleClick();
      this.getPayAll();
      this.common.getGroupList();

      sessionStorage.setItem("fromDetail","0")

      // this.getResTypeDetail(this.activeResType);

    },

     beforeDestroy() {
        sessionStorage.removeItem("activeResType");
        sessionStorage.removeItem("currentPage");
        sessionStorage.removeItem("activeName");
        sessionStorage.removeItem("fromDetail");
        
      },
  }
</script>

<style scoped>

</style>
