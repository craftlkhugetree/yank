<template>
  <!--<el-dialog title="收货地址" :visible.sync="dialogFormVisible">-->
  <div>

    <div :style="{'max-height':innerHeight*0.6+'px'}" class="topnav_box dialog-innner-box">
      <div  class="form-wrap" style="position: relative">
        <!--<div style="position: absolute;right: 0;top:-73px;color: #666666;text-align: right">
          <div style="font-size: 12px">{{record.ALLMONEY}}人民币</div>
          <div style="font-size: 10px">{{record.KINDNUM}}种类数</div>
        </div>-->

        <!-- <div class="form-item">
          <label>经费负责人：</label>
          <span>{{record.CREATORNAME}}</span>
        </div> -->
        <div class="form-item">
          <label>经费本号：</label>
          <span>{{record.FUNDNUMBER || '--'}}</span>
        </div>
        <div class="form-item">
          <label>报刊种类：</label>
          <span>{{record.ISCHINESE == '1' ? "境内出版" :"境外出版"}}</span>
        </div>
        <div class="form-item">
          <label>报销时间：</label>
          <span>{{record.REPORTDATE}}</span>
        </div>
        <div class="form-item">
          <label>发票号：</label>
          <span>{{record.INVOICENUMBER}}</span>
        </div>
        <div class="form-item">
          <label>经办人：</label>
          <span>{{record.OPERATORNAME}}</span>
        </div>
        <div class="form-item">
          <label>经费类型：</label>
          <span>{{record.FUNDTYPE}}</span>
        </div>
       
        <div class="form-item" style="font-weight: bold">
          <label>总金额：</label>
          <span>￥{{record.ALLMONEY}}</span>
        </div>
        <div class="form-item" style="font-weight: bold">
          <label>总种数：</label>
          <span>{{record.KINDNUM}}</span>
        </div>
        <!--<div class="form-item">
          <label>手机号：</label>
          <span>{{record.PHONE}}</span>
        </div>-->
        <div class="form-item" style="width: 100%">
          <label style="vertical-align: top">报销说明：</label>
          <span style="display: inline-block;width: 90%;vertical-align: top;">{{record.REASON}}</span>
        </div>

        <div class="dialog-remark-item" v-show="record.REMARK && record.ISCHECKED !=2">
          <label class="dialog-remark-label" style="width: 68px">审核意见</label>
          <span class="dialog-remark-text" >{{record.REMARK}}</span>
        </div>
      </div>

      <div class="line"></div>

      <div class="invoice-wrap">
        <div class="invoice-item">
          <div class="kind-name">发票</div>
          <div class="invoice-img" v-for="(item,index) in invoiceImg" :key="index">
            <img :preview="1" :src="domain+'/fileManage/get?ID='+item.URL" alt="">
          </div>
        </div>

        <div class="book-img-wrap" style="">
          <div class="kind-name">购书单</div>
          <div class="book-img" v-for="(item,index) in bookListImg" :key="index">
            <img :preview="2" :src="domain+'/fileManage/get?ID='+item.URL" alt="">
          </div>
        </div>
        
        <div class="invoice-item" v-show="purchaseresultImg.length >0">
          <div class="kind-name">采购结果公告</div>
          <div class="invoice-img" v-for="(item,index) in purchaseresultImg" :key="index">
            <img :preview="5" :src="domain+'/fileManage/get?ID='+item.URL" alt="">
          </div>
        </div>
        
        <!-- <div class="invoice-item" v-show="OAImg.length>0">
          <div class="kind-name">OA审核文件截图</div>
          <div class="invoice-img" v-for="(item,index) in OAImg" :key="index">
            <img :preview="3" :src="domain+'/fileManage/get?ID='+item.URL" alt="">
          </div>
        </div>

        <div class="invoice-item" v-show="buyImg.length >0">
          <div class="kind-name">文献资源项目采购申报表</div>
          <div class="invoice-img" v-for="(item,index) in buyImg" :key="index">
            <img :preview="4" :src="domain+'/fileManage/get?ID='+item.URL" alt="">
          </div>
        </div> -->
      </div>
    </div>

    <div style="position: absolute;right: 60px;top:17px;font-size: 15px">
      <span v-show="record.ISCHECKED == 0" style="color: #F56C6C">审核未通过</span>
      <span v-show="record.ISCHECKED == 1" style="color: #67C23A">审核通过</span>
      <span v-show="record.ISCHECKED == 2" style="color: #E6A23C">待审核</span>
    </div>

    <div  slot="footer" class="dialog-footer pop-footer" >
      <el-button size="small" style="width: 100px" @click="cancel">返 回</el-button>
      <el-button v-if="isCheckPop" type="success" size="small" style="width: 100px" @click="toCheck(1)">通 过</el-button>
      <el-button v-if="isCheckPop" type="danger" size="small" style="width: 100px" @click="toCheck(0)">退 回</el-button>
    </div>

    <el-dialog width="420px" title="审核意见" v-if="innerVisible" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
      <fill-remark ref="child" :innerType="innerType"></fill-remark>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false" size="small" >取 消</el-button>
        <el-button type="primary" size="small" @click="toCheckConfirm(innerType)">确 定</el-button>
      </div>
    </el-dialog>
  </div>

  <!--</el-dialog>-->
</template>

<script>
  import {global} from "../../assets/js/global";
  import fillRemark from "./fillRemark";
  export default {
    name: "checkPop",
    components:{
      fillRemark
    },
    props:{
      toCheckInfo:Object,
      currentId:String,
      isChecked:Boolean,
      pageSize:Number,
      innerHeight:Number,
      isCheckPop:Boolean
    },
    data:function () {
      return {
        domain:global,
        record:{},  //表单内容
        bookList:{},  //图书列表
        noteList:[],  //相关发票上传
        invoiceImg:[],
        bookListImg:[],
        OAImg:[],
        buyImg:[],
        purchaseresultImg: [],
        innerVisible:false,
        innerType:"",
      }
    },
    methods:{
      //审核
     /* toCheck:function (type) {

        let inputText;
        if(type == 1){
          inputText="已通过"
        }

        // console.log("type",type);
        this.$prompt("", '审核意见', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: inputText,
          inputPattern: /\S+/,
          inputErrorMessage: '请输入审核意见'
        }).then(({ value }) => {
          if(value){
            this.toCheckConfirm(type,value);
          }
        }).catch(() => {});
      },*/

      toCheck:function (type) {
        this.innerType=type;
        this.innerVisible=true;
        this.$nextTick(()=>{
          if(type == 1){
            this.$refs.child.remark="已按要求登记"
          }else {
            this.$refs.child.remark="";
          }
        })

      },

      toCheckConfirm:function(type){
        let remark=this.$refs.child.remark;
        if(!remark){
          this.$message({
            message:"请输入审核意见！",
            type:"warning",
          })
        }else {
          this.util.postAjax({
            code:this.global.code,
            url:"Periodical/toCheck",
            data:{
              data:JSON.stringify(
                [{
                  "ID":this.currentId,
                  "ISCHECKED":type,    // 0不通过1通过
                  "REMARK":remark
                }]
              )}
          }).then( res => {

            if(type == 1){
              this.$message({
                message:"审核通过！",
                type:"success",
              });
              this.innerVisible = false
            }else if(type == 0){
              this.$message({
                message:"审核不通过,已退回！",
                type:"warning",
              });
              this.innerVisible = false
            }
            this.$emit("closeDialog");
            this.$emit("getJournalInfo",1,this.pageSize);
            // this.$router.push({path:"/checked"});
          })
        }


      },

      //取消按钮点击
      cancel:function(){
        this.$emit("closeDialog")
      },
    },

    created() {
      // console.log("currentId",this.currentId);

      // console.log("toCheckInfo",this.toCheckInfo);

      if(this.toCheckInfo.item){
        this.record=this.toCheckInfo.item;
      }

      // this.bookList = this.toCheckInfo.items;

      this.noteList=this.toCheckInfo.NOTE;
      // console.log("noteList",this.noteList);
      this.invoiceImg = this.toCheckInfo.invoice;
      this.bookListImg = this.toCheckInfo.list;
      this.OAImg = this.toCheckInfo.oa;
      this.buyImg = this.toCheckInfo.artical;
      this.purchaseresultImg = this.toCheckInfo.purchaseresult

    },

  }
</script>

<style scoped>
  .form-item{
    display: inline-block;
    width: 33%;
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
  }

  .book-item{
    width: 30%;
    height: 90px;
    display: inline-block;
    /*background: red;*/
    margin-right: 20px;
  }

  .book-img{
    width: 80px;
    height: 100%;
    /*background: yellow;*/
    display: inline-block;
    vertical-align: top;
    margin-bottom: 4px;
  }

  .book-img img{
    vertical-align: top;
    width: 100%;
    max-height: 100%;
    cursor: crosshair;
  }

  .book-infos{
    /*width: 100px;*/
    display: inline-block;
    /*background: lightsteelblue;*/
    vertical-align: top;
    float: right;
    height: 100%;
    width: 60%;
  }

  .book-title{
    font-weight: bold;
    margin-bottom: 5px;
  }

  /*.invoice-wrap{
    overflow: auto;
  }*/
  .kind-name{
    margin-bottom: 10px;
    line-height: 16px;
    height: 30px;
  }

  .invoice-item{
    width: 123px;
    /*background: yellow;*/
    display: inline-block;
    vertical-align: top;
    margin-right: 23px;
  }

  .invoice-item .invoice-img{
    width: 100%;
    height: 123px;
    /*background: pink;*/
  }

  .invoice-item .invoice-img img{
    width: 100%;
    height: 100%;
    cursor: crosshair;
  }

  .book-img-wrap{
    display: inline-block;
    width: 320px;
    /*background: lightblue;*/
    vertical-align: top;
    margin-right: 5px;
  }

  .book-img-wrap img{
    width: 60px;
    height: 60px;
    cursor: crosshair;
  }

</style>

