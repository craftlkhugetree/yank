<template>
    <div class="agreement-page">
      <div>甲方：<span class="text-with-underline">南京农业大学实验室与基地处</span></div>
      <div>乙方：<span class="text-with-underline">{{form.orgname}}{{form.classname}}</span></div>
      <div>(项目名称：<span class="text-with-underline">{{form.projectname}}</span>)</div>
      <p style="margin-bottom: 15px">
        乙方提出科教资源使用需求的基础上，甲方根据学校发展和白马教学科研基地现有资源情况进行经统筹调配，经双方协商后达成如下协议：
      </p>
      <p class="item-content">
        <span class="order-num">第一条</span> 乙方租用甲方科教资源用于教学科研实验，资源的所有权归学校，甲方代表学校负责统筹管理与服务，乙方租赁期负责资源的日常管理。
      </p>
      <p class="item-order">
        <span class="order-num">第二条</span> 租用情况
      </p>
      <p class="item-order">租用的资源  类型：{{resTypeDetail.name}}&nbsp;&nbsp;计费周期：{{resTypeDetail.chargecycle}}&nbsp;&nbsp;计费方式：{{resTypeDetail.chargetype}}</p>
      <p class="item-content">
        <el-table class="my-table my-table-with-total" :data="tableTable" style="width: 100%" show-summary border v-loading="tableLoading">
          <el-table-column prop="rescode" label="资源编号" align="center"></el-table-column>
          <el-table-column prop="area" label="面积(㎡)" align="center"></el-table-column>
          <el-table-column prop="price" :label="'单价（元/'+resTypeDetail.chargecycle+'/'+resTypeDetail.chargetype+'）'" align="center" :formatter="common.moneyFormatter"></el-table-column>
          <el-table-column prop="usecycle" :label="'时长('+resTypeDetail.chargecycle+')'" align="center"></el-table-column>
          <el-table-column prop="cost" label="费用(元)" align="center" :formatter="common.moneyFormatter"></el-table-column>
        </el-table>
      </p>
      <p class="item-order">
        <span class="order-num">第三条</span> 租用期限
      </p>
      <p class="item-content">
        租期自{{today}}到 {{newDate}}，共{{form.usecycle}}{{resTypeDetail.chargecycle}}。乙方如需继续使用，租期满前30天，向甲方提出续租申请，经审批后办理续租手续。
      </p>
      <p class="item-order">
        <span class="order-num">第四条</span> 相关规定
      </p>
      <p class="item-content">{{resTypeDetail.rules}}</p>
      <p class="item-order">
        <span class="order-num">第五条</span> 协议自双方签字之日起生效。一式两份，双方各执一份。
      </p>
    </div>
</template>

<script>
    import util from "../../../assets/js/util";
    import global from "../../../assets/js/global";
    var bigDecimal = require('js-big-decimal');
    export default {
      name: "agreementForm",
      props:{
        form:Object,
        resTypeDetail:Object,
        endApplyTime:String,
        dialogType:String
      },
      data(){
        return{
          // resTypeDetail:JSON.parse(sessionStorage.getItem("resTypeDetail")),
          tableTable:[],  //表格内容
          today:"",
          newDate:"",
          tableLoading:false
        }
      },

      methods:{
        //计算表格
        /*calcFee(){
          console.log(this.form);

          this.form.resids.forEach(v=>{
            this.getResDetail(v).then(res => {
              if(res.success == true){
                this.tableTable.push(res.item);
              }
            })
          })
          console.log("this.tableTable",this.tableTable);
        },*/

        calcFee(){
          // console.log("form",this.form.resids);
          this.tableLoading=true;
          let arr=[];
          this.form.resids.forEach(v=>{
            this.util.postAjax({
              code:this.global.code,
              url:"/spres/findById",
              data:{
                id:v
              }
            }).then(res => {
              this.tableLoading=false;
              if(res.success == true){
                this.tableTable.push(res.item);
                // console.log("tableTable1",this.tableTable);
                this.tableTable.forEach(m=>{
                  m.usecycle=this.form.usecycle;
                  // console.log(this.resTypeDetail.chargetype);

                  /*if(this.resTypeDetail.chargetype == 'm²'){
                    m.cost=m.usecycle*m.price*m.area;
                  }else if(this.resTypeDetail.chargetype == '间'){
                    m.cost=m.usecycle*m.price;
                  }*/

                  /*let usecycle=new bigDecimal(m.usecycle);
                  let price=new bigDecimal(m.price);
                  let area =new bigDecimal(m.area);*/

                  let usecycle=m.usecycle;
                  let price=m.price;
                  let area =m.area;

                  if(this.resTypeDetail.chargetype == 'm²'){
                    let unit=bigDecimal.multiply(usecycle,price);
                    let cost=bigDecimal.multiply(unit,area);
                    m.cost=bigDecimal.round(cost,2);
                  }else if(this.resTypeDetail.chargetype == '间'){
                    let cost=bigDecimal.multiply(usecycle,price);
                    m.cost=bigDecimal.round(cost,2);
                  }
                })
              }
              // console.log("tableTable",this.tableTable);
            })
          })

        },


        //获取资源详情
        getResDetail(id){
          return new Promise((resolve, reject) => {
            this.util.postAjax({
              code:this.global.code,
              url:"/spres/findById",
              data:{
                id:id
              }
            }).then(res => {
              if (res.success){
                resolve(res)
              } else {
                reject(res);
              }
            }).catch(err =>{
              reject(err)
            })
          });
        }
      },

      created() {
        this.common.chargecycleFormatter(this.resTypeDetail.chargecycle,this.resTypeDetail);
        this.common.chargetypeFormatter2(this.resTypeDetail.chargetype,this.resTypeDetail);
        // console.log("this.resTypeDetail",this.resTypeDetail);
        let interval="";
        switch (this.resTypeDetail.chargecycle){
          case "天":
            interval="d";
            break;
          case "月":
            interval="M";
            break;
          case "年":
            interval="y";
            break;
        }
        // console.log("interval",interval);
        let newDate="";
        // this.calcFee();
        if(this.dialogType == "add"){
          // 从当天开始计算
          let now=new Date();
          this.today=this.util.formatTime(now.getTime(),"yyyy年MM月dd日");

          // 暂时修改，根据填写的入驻时间开始计算
          // this.today = this.util.formatTime(this.form.applytime,"yyyy年MM月dd日");
          // let now = new Date(this.util.formatTime(this.form.applytime,"yyyy-MM-dd"));
          
          newDate=this.common.DateAdd(interval,this.form.usecycle, now).getTime();
        }else if(this.dialogType == "continue"){

          let endApplyTime=new Date(this.endApplyTime);
          // console.log(endApplyTime);
          this.today=this.util.formatTime(endApplyTime.getTime(),"yyyy年MM月dd日");
          newDate=this.common.DateAdd(interval,this.form.usecycle, endApplyTime).getTime();
        }

        this.newDate=this.util.formatTime(newDate,"yyyy年MM月dd日");
        // console.log( this.today);
        // console.log("111",this.newDate);


      }
    }
</script>

<style scoped>

</style>
