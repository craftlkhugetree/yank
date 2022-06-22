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

    <!--&lt;!&ndash;进度条&ndash;&gt;
    <div class="process-wrap">
      <el-alert v-if="applyInfoForm.applystatus == '8'" title="该申请已被驳回,进程结束" type="error" center :closable="false"></el-alert>
      <el-alert v-if="applyInfoForm.applystatus == '9'" title="该申请已被撤回,进程结束" type="error" center :closable="false"></el-alert>
      <div v-if="applyInfoForm.applystatus =='1' || applyInfoForm.applystatus =='2' || applyInfoForm.applystatus =='3' "
           class="item" v-for="(item,index) in processData" :class="{active:item.active}" :key="index">
        <div class="process-line" v-show="!item.hideLine"></div>
        <div class="num-data">
          <div class="num" >
            {{item.num}}
            <div class="date">
              {{item.text}}
              <span v-if="item.date && item.date.length >0">: {{item.date}}</span>
            </div>
          </div>

        </div>
      </div>
    </div>-->


    <div class="audit-content">
      <!--申请信息和费用-->
      <apply-info-fee :applyInfoForm="applyInfoForm"></apply-info-fee>

      <!--查看审批详情-->
      <div style="margin-bottom: 20px">
        <div class="item-title">
          <img style="width: 22px;height: 20px" src="../../../../static/images/bm-audit-info.png" alt="">
          <span>审批</span>
        </div>

<!--        <div v-if="auditList && auditList.length ==0">暂无审批内容</div>-->
        <div class="inner-item" v-for="item in auditList" :key="item.id">
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

        <opinions ref="opinions" :auditDev="auditDev"></opinions>
      </div>

      <!--操作按钮-->
      <div style="text-align: center">
        <div class="my-button plain-red" @click="operate('0')">
          <span>审批不通过</span>
        </div>

        <div style="margin-left: 20px" class="my-button green" @click="operate('1')">
          <span>审批通过</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import applyInfoFee from "../applyInfoFee";
  import Opinions from "../../../components/opinions";
  import breadCrumb from "../../../components/breadcrumb";

  export default {
    name: "detail",
    components:{
      applyInfoFee,Opinions,breadCrumb
    },
    props:{
      id:String,
      auditDev:String,
      breadList:Array,
      indexCurrentPage:Number,
      indexActiveName:String
    },
    data(){
      return{
        isOver:false,  //进程是否结束
        /*processData:[
          {hideLine:true,num:1,date:"2010.10.13",active:true,text:"申请时间"},
          {hideLine:false,num:2,date:"",active:false,text:"审批时间"},
          {hideLine:false,num:3,date:"",active:false,text:"接收"},
        ],*/

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
        sessionStorage.setItem("activeName",this.indexActiveName);
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
            /* res.item.events.forEach(v => {
               v.eventtime = this.util.formatTime(v.eventtime,"yyyy.MM.dd");
               switch (v.eventtype) {
                 case "1":
                   this.processData[0].date = v.eventtime;
                   break;
                 case "4":
                   this.processData[1].date = v.eventtime;
                   break;
                 case "5":
                   this.processData[2].date = v.eventtime;
                   break;
               }
             })*/

            // console.log("auditList",res.item.events);

          }
        })
      },

      //添加常用字段
      addOpenUse() {
        this.util
          .postAjax({
            code: this.global.code,
            url: "/opinions/add",
            isRep: true,
            data: {
              note: this.$refs.opinions.eventnote
            }
          })
          .then(res => {
            if (res.success == true) {
              /* this.getTipList();
               this.dialogVisible = false;*/
            }else{
              // console.log(res);
              this.$message({
                type:"warning",
                message:res.data.message
              });
            }
          });
      },

      //审核操作
      operate(type) {
        if(!this.$refs.opinions.eventnote){
          this.$message({
            type: 'warning',
            message: '请输入审批意见!'
          });
        }else {
          let params = {
            eventnote: this.$refs.opinions.eventnote,
            eventresult: type,
            eventtype: this.auditDev == "leader" ? 3 : 4,
            applyid: this.id
          };

          const loading = this.$loading({
                  lock: true,
                  text: "提交审批中",
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });

          // console.log("params",params);
          // return false;
          this.util
            .postAjax({
              code: this.global.code,
              url: "/spapply/saveEvent",
              isRep: true,
              data: params
            })
            .then(res => {
              loading.close();
              // console.log(res);
              this.$message({
                type: type=="0" ? "error" : "success",
                message: type == "0" ? "审批不通过" : "审批通过"
              });
              this.addOpenUse();
              this.back();
            });
        }


      },
    },

    created() {
      this.getDetail();
    }
  }
</script>

<style scoped>

</style>
