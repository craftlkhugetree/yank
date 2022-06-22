<template>
  <div style="background: #ffffff;">
    <!--面包屑-->
    <bread-crumb :breadList="breadList"></bread-crumb>

    <div class="back-top" style="margin-bottom: 30px">
      <div class="my-button green" style="border-radius: 16px" @click="back">
        <i class="el-icon-back"></i>
        <span>返回</span>
      </div>
    </div>

    <!--进度条-->
    <process :applyInfoForm="applyInfoForm" :processData="this.applyInfoForm.usetype =='3' ? processData2 : processData"></process>

    <!--申请信息和审批意见-->
    <div class="audit-content">
      <apply-info-fee :applyInfoForm="applyInfoForm"></apply-info-fee>

      <div style="margin-bottom: 20px">
        <div class="item-title">
          <img style="width: 22px;height: 20px" src="../../../../static/images/bm-audit-info.png" alt="">
          <span>审批</span>
        </div>

        <div v-if="auditList && auditList.length ==0">暂无审批内容</div>
        <div v-else class="inner-item" v-for="item in auditList" :key="item.id">
          <div class="part">
            <span v-show="item.eventtype == '3'">单位领导审批意见:</span>
            <span v-show="item.eventtype == '4'">白马办审批意见:</span>
          </div>
          <div class="advice-content">
            <div class="text">
                <span style="margin-right: 25px">
                  <label>审批人:</label>
                  <span>{{item.eventername}}</span>
                </span>
              <span>
                 {{item.eventtime}}
                </span>
            </div>
            <div>
              {{item.eventnote}}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import applyInfoFee from "../applyInfoFee";
  import process from "../../../components/process"
  import breadCrumb from "../../../components/breadcrumb";

  export default {
    name: "detail",
    components:{
      applyInfoFee,process,breadCrumb
    },
    props:{
      id:String,
      breadList:Array,
      indexCurrentPage:Number,
    },
    data(){
      return{
        isOver:false,  //进程是否结束
        processData:[
          {hideLine:true,num:1,date:"",active:true,text:"申请时间",status:"success"},
          {hideLine:false,num:2,date:"",active:false,text:"单位领导审批",status:"fail"},
          {hideLine:false,num:3,date:"",active:false,text:"白马办审批",status: ""},
        ],
        processData2:[
          {hideLine:true,num:1,date:"",active:true,text:"申请时间",status:"success"},
          {hideLine:false,num:2,date:"",active:false,text:"白马办审批",status:"fail"},
          // {hideLine:false,num:3,date:"",active:false,text:"白马办审批",status: ""},
        ],
        applyInfoForm:{
          restype:{}
        }, //申请信息表格
        typeList:JSON.parse(sessionStorage.getItem("typeList")) ,  //资源类型列表
        codeList:JSON.parse(sessionStorage.getItem("codeList")) ,  //资源编号列表
        groupList:JSON.parse(sessionStorage.getItem("groupList")) ,  //学院列表

        auditList:[],  //审核列表
        chargecyclename:"",
      }
    },

    methods:{
      back(){
        window.history.go(-1);
        sessionStorage.setItem("currentPage",JSON.stringify(this.indexCurrentPage));
      },

      //获取详情接口
      getDetail(){
        this.util.postAjax({
          code:this.global.code,
          url:"/spapply/findById",
          data:{
            id:this.id
          }
        }).then(res => {
          if(res.success == true){

            // console.log(res);
            // return false;
            this.applyInfoForm=res.item;
            this.common.chargecycleFormatter(this.applyInfoForm.chargecycle,this.applyInfoForm);
            this.common.chargetypeFormatter2(this.applyInfoForm.restype.chargetype,this.applyInfoForm);




            //日期转换
            // this.applyInfoForm.irdate = this.util.formatTime(this.applyInfoForm.irdate,"yyyy.MM.dd");

            //资源编号转换
            let arr=[];
            res.item.ress.forEach(v => {
              arr.push(v.rescode);
              this.applyInfoForm.rescodes=arr.join(",");
            })

            //审核列表转换
            let events=JSON.parse(JSON.stringify(res.item.events));
            events.forEach(v=>{
              v.eventtime = this.util.formatTime(v.eventtime,"yyyy.MM.dd hh:mm:ss");
              if(v.eventtype == "3" || v.eventtype == "4"){
                this.auditList.push(v)
              }else if(v.eventtype == "1") {
                this.applyInfoForm.eventnote =v.eventnote;
                this.applyInfoForm.eventername = v.eventername;
              }
            });

            //进程时间
            res.item.events.forEach(v => {
              v.eventtime = this.util.formatTime(v.eventtime,"yyyy.MM.dd");

              if(this.applyInfoForm.usetype !='3'){
                switch (v.eventtype) {
                  case "1":
                    this.processData[0].date = v.eventtime;
                    break;
                  case "3":
                    this.processData[1].date = v.eventtime;
                    this.processData[1].text = "单位领导审批";
                    this.processData[1].active = true;
                    this.processData[1].status = v.eventresult == 1 ? "success" :"fail";
                    break;
                  case "4":
                    this.processData[2].date = v.eventtime;
                    this.processData[2].text = "白马办审批";
                    this.processData[2].active = true;
                    this.processData[2].status = v.eventresult == 1 ? "success" :"fail";
                    break;
                }
              }else {
                switch (v.eventtype) {
                  case "1":
                    this.processData2[0].date = v.eventtime;
                    break;
                  case "4":
                    this.processData2[1].date = v.eventtime;
                    this.processData2[1].text = "白马办审批";
                    this.processData2[1].active = true;
                    this.processData2[1].status = v.eventresult == 1 ? "success" :"fail";
                    break;
                }
              }

            })
            // console.log("auditList2",this.processData);
            //"applystatus"//'1:单位领导审核中2:白马办审核中3:已完成8:驳回9:撤回'
          }
        })
      }
    },

    created() {
      this.getDetail();
    }
  }
</script>

<style scoped>

</style>
