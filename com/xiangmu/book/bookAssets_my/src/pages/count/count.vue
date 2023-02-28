<!--<template>
    <div class="count-wrap">
      统计报表
    </div>
</template>

<script>
    export default {
        name: "count"
    }
</script>

<style scoped>

</style>-->
<template>
  <div class="check-wrap">
    <ul class="kind-wrap">
      <li @click="typeChange(1)" :class="{active:isActive}">图书登记</li>
      <li @click="typeChange(2)" :class="{active:!isActive}">报刊登记</li>
    </ul>

    <div class="line" style="margin:-4px auto 30px"></div>

    <div  class="search-wrap" style="background: none;padding-left: 0">
      <el-select v-model="ISCHINESE" placeholder="境内/境外" size="small" style="width: 120px">
        <el-option :key="1" label="境内" :value="1"></el-option>
        <el-option :key="0" label="境外" :value="0"></el-option>
      </el-select>
      <el-select v-model="FUNDTYPE" placeholder="经费类型" size="small" style="width: 120px">
        <el-option  label="科研" value="科研"></el-option>
        <el-option  label="其他" value="其他"></el-option>
      </el-select>
      <el-date-picker size="small" style="width: 240px" v-model="dates" type="daterange" range-separator="至"
                      start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyyMMdd"></el-date-picker>

      <el-button type="primary" size="small" style="width: 79px;" @click="search">查询</el-button>
      <el-button type="primary" size="small" style="width: 79px" @click="clearInput">清空</el-button>
    </div>

    <div class="echarts-wrap">
      <div v-show="!allMoney" class="no-data" style="">暂无数据</div>
      <div class="echarts-item">
        <div v-show="allMoney">
          <div class="echarts-title">总金额：{{allMoney}}元</div>
          <div style="width:450px;height:300px;display: inline-block" ref="line"></div>
        </div>
      </div>
      <div class="echarts-item">
        <div v-show="allMoney">
          <div class="echarts-title" v-show="currentType == 1">总册数：{{allSum}}本</div>
          <div class="echarts-title" v-show="currentType == 2">总种类数：{{allSum}}种</div>
          <div style="width:450px;height:300px;display: inline-block" ref="line2"></div>
        </div>
      </div>
    </div>

    <el-button type="primary" size="small" style="width: 100px;margin-bottom: 20px" @click="exportInfo">导出</el-button>

    <div class="table-wrap">
      <el-table :data="tableData" border style="width: 100%" size="mini" stripe	>
        <el-table-column prop="ORGNAME" label="单位" align="center"></el-table-column>
        <el-table-column prop="ISCHINESE" :label="labelName" align="center"></el-table-column>
        <el-table-column prop="FUNDTYPE" label="经费类型" align="center"></el-table-column>
        <el-table-column prop="ALLMONEY" label="金额" align="center"></el-table-column>
        <el-table-column prop="ALLSUM" :label="labelKind" align="center"></el-table-column>
      </el-table>

      <div style="margin-top: 20px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
                       :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" small
                       layout=" prev, pager, next, jumper, total,sizes" :total="totalSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from "echarts"
  export default {
    name: "count",
    data:function () {
      let todayYear=new Date().getFullYear();
     let todayMonth=new Date().getMonth()+1;
     let todayMonth0=new Date().getMonth();
     let todayDay=new Date().getDate();

     if(todayMonth < 10){
       todayMonth="0"+todayMonth;
     }

     if(todayMonth0 < 10){
       todayMonth0="0"+todayMonth0;
     }

     if(todayDay<10){
       todayDay="0"+todayDay
     }

      // let start = todayYear+todayMonth+todayDay;
     let start =""+ todayYear+todayMonth0+todayDay;
     let end = this.util.formatTime(new Date().getTime(),"YYYYMMDD");
      console.log("todayYear",start + "/" + end);

      return {
       ISCHINESE:"", //图书类型查询
       FUNDTYPE:"", //经费类型查询
       // dates: '',  //日期查询
       dates:[start,end],

       isActive:true,  //是否选中
       tableData: [], //表格数据
       echartsData:[],  //图标数据
       currentPage: 1,  //当前分页
       pageSizes:[5,10,20, 30, 40],  //设置每页显示多少条
       pageSize:10,  //每页限制
       totalSize:0  ,  //总条数
       currentType:1 ,  //图书或报刊
       allMoney:"",  //总金额
       allSum:"",  //总册数
       gradeData: {
         /*  title : {
             text: '某站点用户访问来源',
             // subtext: '纯属虚构',
             x:'left'
           },*/
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            /*legend: {
              orient: 'vertical',
              left: 'left',
              data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },*/
            series : [
              {
                name: '单位',
                type: 'pie',
                radius : '65%',
                center: ['55%', '50%'],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ],
          //设置每个系列的颜色
          color:["#D2335C","#0082D5","#FF9948","#9DBF16","#A93ABA","#FF9948"]
          },  //两个图表数据
        gradeData2: {
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [
            {
              name: '单位',
              type: 'pie',
              radius : '65%',
              center: ['55%', '50%'],
              /*data:[
                {value:"335", name:'直接访问'},
                {value:"310", name:'邮件营销'},
                {value:"234", name:'联盟广告'},
              ],*/
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          //设置每个系列的颜色
          color:["#D2335C","#0082D5","#FF9948","#9DBF16","#A93ABA","#FF9948"]
        },
        labelName:""  ,  //图书/报刊
        labelKind:""
    }
    },
    methods: {
      //导出
      exportInfo:function(){
        var filter = {};
        filter.type=this.currentType;
        var str = encodeURIComponent(JSON.stringify(filter), 'utf-8');
        window.open('/book2/rest/Statistic/exportExcel?filter='+str);
      },

      /*getNowFormatDate() {//获取当前时间
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
        var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
        var currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
          + " "  + date.getHours()  + seperator2  + date.getMinutes()
          + seperator2 + date.getSeconds();
        return currentdate;
        console.log("currentdate",currentdate);
      },*/

      //查找
      search:function(){
        console.log("dates",this.dates);
        this.getCountTable(1,this.pageSize,this.currentType);
        this.getCountEcharts(this.currentType)
      },

      handleClick(row) {
        console.log(row);
      },

      start:function (data,data2) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(this.$refs.line);
        let myChart2 = echarts.init(this.$refs.line2);
        // 绘制图表，this.echarts1_option是数据
        this.gradeData.series[0].data = data;
        this.gradeData2.series[0].data = data2;
        myChart.setOption(this.gradeData);
        myChart2.setOption(this.gradeData2);

      },

      typeChange:function(type){
        if(type == 1){
          this.isActive=true;

        }else if(type == 2){
          this.isActive=false;
        }
        this.currentType=type;
        this.getCountTable(1,this.pageSize,this.currentType);
        this.getCountEcharts(this.currentType);
      },


      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getCountTable(1,this.pageSize,this.currentType)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getCountTable(this.currentPage,this.pageSize,this.currentType)
      },

      //获取统计列表
      getCountTable:function (page,limit,type) {



        this.util.postAjax({
          code:this.global.code,
          url:"Statistic/getTable",
          data:{
            page: page,
            limit:limit ,
            filter:JSON.stringify({
              type:type,
              ISCHINESE:this.ISCHINESE,
              FUNDTYPE:this.FUNDTYPE,
              START:this.dates[0],
              END:this.dates[1],
            })
          }
        }).then((res)=>{
          this.tableData=res.items;
          this.totalSize=res.total;
          // console.log(res);
          if(type == 1){
            this.labelName="图书类型";
            this.labelKind="册数";
          }else if(type == 2){
            this.labelName="报刊种类";
            this.labelKind="种数";
          }
        })
      },

      //获取统计图表
      getCountEcharts:function (type) {
        this.util.postAjax({
          code:this.global.code,
          url:"Statistic/getChart",
          data:{
            filter:JSON.stringify({
              type:type,
              ISCHINESE:this.ISCHINESE,
              FUNDTYPE:this.FUNDTYPE,
              START:this.dates[0],
              END:this.dates[1],
            })
          }
        }).then((res)=>{

          this.start(res.orgMoney,res.orgSum);
          this.allMoney=res.allMoney;
          console.log("allMoney",this.allMoney);
          this.allSum=res.allSum;
          console.log("allSum",this.allSum);
        })
      },

      //清空查询
      clearInput:function () {
        this.ISCHINESE="";
        this.FUNDTYPE ="";
        this.dates="";
       /* this.dates[0]="";
        this.dates[1]="";*/
        this.getCountTable(1,this.pageSize,this.currentType);
        this.getCountEcharts(this.currentType);
        // this.getBookInfo(1,this.pageSize);
      },

    },

    created() {
      // this.getBookInfo(1,10);
      this.getCountTable(1,10,1);
      this.getCountEcharts(1);
      // this.start();

      // this.getNowFormatDate();
      /*let todayYear=new Date().getFullYear();
      let todayMonth=new Date().getMonth()+1;
      let todayMonth0=new Date().getMonth();
      let todayDay=new Date().getDate();

      if(todayMonth < 10){
        todayMonth+="0"+todayMonth;
      }

      if(todayMonth0 < 10){
        todayMonth0+="0"+todayMonth0;
      }

      this.today=""+todayYear+todayMonth+todayDay;
      this.today0=""+todayYear+todayMonth0+todayDay;
      this.dates=[this.today0,this.today];*/

      console.log("today",this.dates);
    },

    mounted() {

      // console.log("1111",this.util.formatTime(new Date().getTime(), "YYYYMMDD"));
    }
  }
</script>

<style scoped>
.echarts-item{
  display: inline-block;
  width: 40%;
  /*height: 325px;*/
}

  .echarts-title{
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }

  .echarts-wrap{
    /*vertical-align: middle;*/
    height: 325px;
  }

.no-data{
  text-align: center;
  color: #909399;
  display: inline-block;
  width: 100%;
  vertical-align: middle;
  margin-top: 130px;
}

/*.echarts-wrap:after{*/
  /*content: '';*/
  /*height: 100%;*/
  /*display: inline-block;*/
  /*vertical-align: middle;*/
/*}*/


</style>
