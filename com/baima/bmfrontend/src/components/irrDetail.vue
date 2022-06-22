<template>
    <div style="background: #ffffff;">
      <!--面包屑-->
      <bread-crumb :breadList="breadList"></bread-crumb>


      <div class="back-top">
        <div class="my-button green" style="border-radius: 16px" @click="back">
          <i class="el-icon-back"></i>
          <span>返回</span>
        </div>
      </div>

      <!--进度条-->
      <process :applyInfoForm="applyInfoForm" :processData="processData"></process>


      <!--申请信息和审批意见-->
      <div class="audit-content">

        <irr-apply-table :applyInfoForm="applyInfoForm"></irr-apply-table>

        <div style="margin-bottom: 20px">
          <div class="item-title">
            <img style="width: 22px;height: 20px" src="../../static/images/bm-audit-info.png" alt="">
            <span>审批</span>
          </div>

          <div v-if="auditList && auditList.length ==0">暂无审批内容</div>
          <div v-else class="inner-item" v-for="item in auditList" :key="item.id">
            <div class="part">
<!--              <span v-show="item.eventtype == '3'">单位领导审批意见:</span>-->
              <span v-show="item.eventtype =='4' ">白马办审批意见:</span>
<!--              <span v-show="item.eventtype == '5'">水电工审批意见:</span>-->
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
  import irrApplyTable from "./irrApplyTable";
  import process from "./process";
  import breadCrumb from "../components/breadcrumb";

  export default {
      name: "detail",
      components:{
        irrApplyTable,process,breadCrumb
      },
      props:{
        id:String,
        breadList:Array,
        indexActiveName:String,
        indexCurrentPage:Number | String,
      },
      data(){
        return{
          isOver:false,  //进程是否结束
          processData:[
            {hideLine:true,num:1,date:"",active:true,text:"申请时间",status:"success"},
            {hideLine:false,num:2,date:"",active:false,text:"审批时间",status:"fail"},
            {hideLine:false,num:3,date:"",active:false,text:"接收",status: ""},
          ],

          applyInfoForm:{}, //申请信息表格
          typeList:JSON.parse(sessionStorage.getItem("typeList")) ,  //资源类型列表
          codeList:JSON.parse(sessionStorage.getItem("codeList")) ,  //资源编号列表
          groupList:JSON.parse(sessionStorage.getItem("groupList")) ,  //学院列表

          auditList:[],  //审核列表
          events:[],
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
            url:"/irapply/findById",
            data:{
              id:this.id
            }
          }).then(res => {
            if(res.success == true){
              this.applyInfoForm=res.item.apply;
              //获取学院名称
              // this.groupList.forEach(v => {
              //   if(v.id == this.applyInfoForm.orgid){
              //     this.applyInfoForm.orgname=v.name
              //   }
              // })




              //日期转换
              this.applyInfoForm.irdate = this.util.formatTime(this.applyInfoForm.irdate,"yyyy.MM.dd");
              //资源类型转换

              // console.log("this.typeList",this.typeList);
              // this.typeList.forEach(v => {
              //   if(v.id == this.applyInfoForm.irrestypeid){
              //     this.applyInfoForm.irrestype = v.typename
              //   }
              // } );


              //资源编号转换
              let arr=[];
              // console.log("this.codeList",this.codeList);
              // this.codeList.forEach(v => {
              //   res.item.ress.forEach(m => {
              //     if(v.id == m.id ){
              //        arr.push(v.rescode);
              //       this.applyInfoForm.rescodes=arr.join(",");
              //     }
              //   })
              // });

              res.item.ress.forEach(m => {
                  arr.push(m.rescode);
                  this.applyInfoForm.rescodes=arr.join(",");
                  
                })

              //审核列表转换

              let events=JSON.parse(JSON.stringify(res.item.events));
              events.forEach(v=>{
                v.eventtime = this.util.formatTime(v.eventtime,"yyyy.MM.dd hh:mm:ss");
                if( v.eventtype == "4"){
                  this.auditList.push(v)
                }else if(v.eventtype == "1") {
                  this.applyInfoForm.eventnote =v.eventnote;
                  this.applyInfoForm.eventername = v.eventername;
                }
              });

              //进程时间
              res.item.events.forEach(v => {
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
              })


              // console.log("auditList2",this.processData);

              //进程列表
              switch (this.applyInfoForm.applystatus) {
                case "1":
                  this.processData[0].active = true;
                  break;
                case "2":
                  this.processData[1].active = true;
                  this.processData[1].status = "success";
                  break;

                case "9":
                  let result=res.item.events.some(v => v.eventtype == '4');
                  if(result){
                    this.processData[1].active = true;
                    this.processData[1].status = "success";
                  }
                  break;

                case "8":   //驳回
                  this.processData[1].active = true;
                  this.processData[1].status = "fail";
                  this.processData[1].text = "驳回时间";
                  break;

                case "3":
                  this.processData[1].active = true;
                  this.processData[2].active = true;
                  this.processData[1].status = "success";
                  this.processData[2].status = "success";
                  break;
              }
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
