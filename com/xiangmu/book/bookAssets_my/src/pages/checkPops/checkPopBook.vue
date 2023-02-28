<template>
  <!--<el-dialog title="收货地址" :visible.sync="dialogFormVisible">-->
  <div >

    <div :style="{'max-height':innerHeight*0.6+'px'}" class="topnav_box dialog-innner-box">
      <div class="form-wrap" style="position: relative" >
        <!--<div style="position: absolute;right: 30px;top:-67px;font-size: 15px">-->
          <!--<span v-show="record.ISCHECKED == 0" style="color: #F56C6C">审核未通过</span>-->
          <!--<span v-show="record.ISCHECKED == 1" style="color: #67C23A">审核通过</span>-->
          <!--<span v-show="record.ISCHECKED == 2" style="color: #E6A23C">待审核</span>-->
        <!--</div>-->
        <!-- <div class="form-item">
          <label>经费负责人：</label>
          <span>{{record.CREATERNAME}}</span>
        </div> -->
         <div class="form-item">
          <label>经费本号：</label>
          <span>{{record.FUNDNUMBER || '--'}}</span>
        </div>
        <div class="form-item">
          <label>图书类型：</label>
          <span>{{record.ISCHINESE == '1' ? "境内出版" :"境外出版"}}</span>
        </div>
        <div class="form-item">
          <label>报销日期：</label>
          <span>{{record.BUYTIME}}</span>
        </div>
        <div class="form-item">
          <label>发票号：</label>
          <span>{{record.INVOICENUM}}</span>
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
          <label>总册数：</label>
          <span>{{record.ALLSUM}}</span>
        </div>
       <!-- <div class="form-item">
          <label>手机号：</label>
          <span>{{record.PHONE}}</span>
        </div>-->
        <div class="form-item" style="width: 100%">
          <label style="vertical-align: top;display: inline-block">报销说明：</label>
          <span style="display: inline-block;width: 90%;vertical-align: top;">{{record.REASON}}</span>
        </div>
        <div class="dialog-remark-item" v-show="record.REMARK && record.ISCHECKED !=2">
          <label class="dialog-remark-label" style="width: 68px">审核意见</label>
          <span class="dialog-remark-text" >{{record.REMARK}}</span>
        </div>
      </div>

      <div class="line"></div>

      <div class="book-list-wrap">
        <ul>
          <li class="book-item" v-for="(book,indexs) in bookList" :key="indexs">
            <div class="book-img">
              <!--{{book.PIC[0].URL}}
              111-->
              <img :src="book.PIC[0].URL" alt="">
            </div>
            <div class="book-infos">
              <div class="book-title ellipsis" :title="book.BOOK.BOOKNAME">{{book.BOOK.BOOKNAME}}</div>
              <div class="book-item-text book-author ellipsis">{{book.BOOK.ISBN}}</div>
              <div class="book-item-text book-author ellipsis">{{book.BOOK.AUTHOR}}</div>
              <div class="book-item-text book-publisher ellipsis">{{book.BOOK.PUBLISHER}}</div>
              <!--<div class="book-item-text book-price-num">实付总价：￥{{book.BOOK.TOTAL}}</div>-->
              <div class="book-item-text">册数：{{book.BOOK.QUANTITY}}</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="line"></div>

      <div class="invoice-wrap">
        <div class="invoice-item">
          <div class="kind-name">发票</div>
          <div class="invoice-img" v-for="(item,index) in invoiceImg" :key="index">
            <img :src="domain+'/fileManage/get?ID='+item.URL" :preview="1"  alt="" :preview-text="'发票号:'+record.INVOICENUM+', '+'发票金额：￥'+record.ALLMONEY">
          </div>
        </div>

        <div class="book-img-wrap" style="">
          <div class="kind-name">购书单</div>
          <div class="book-img" v-for="(item,index) in bookListImg" :key="index">
            <img :preview="2" :src="domain+'/fileManage/get?ID='+item.URL" alt="" :preview-text="'发票号:'+record.INVOICENUM+', '+'发票金额：￥'+record.ALLMONEY">
          </div>
        </div>

        <!-- <div class="invoice-item" v-show="OAImg.length>0">
          <div class="kind-name">OA审核文件截图</div>
          <div class="invoice-img" v-for="(item,index) in OAImg" :key="index">
            <img :preview="3" :src="domain+'/fileManage/get?ID='+item.URL" alt="">
          </div>
        </div> -->
        <!-- <div class="invoice-item" v-show="buyImg.length >0">
          <div class="kind-name">文献资源项目采购申报表</div>
          <div class="invoice-img" v-for="(item,index) in buyImg" :key="index">
            <img :preview="4" :src="domain+'/fileManage/get?ID='+item.URL" alt="">
          </div>
        </div> -->
        <div class="invoice-item" v-show="purchaseresultImg.length >0">
          <div class="kind-name">采购结果公告</div>
          <div class="invoice-img" v-for="(item,index) in purchaseresultImg" :key="index">
            <img :preview="5" :src="domain+'/fileManage/get?ID='+item.URL" alt="">
          </div>
        </div>
      </div>
    </div>

    <div style="position: absolute;right: 60px;top:17px;font-size: 15px">
      <span v-show="record.ISCHECKED == 0" style="color: #F56C6C">审核未通过</span>
      <span v-show="record.ISCHECKED == 1" style="color: #67C23A">审核通过</span>
      <span v-show="record.ISCHECKED == 2" style="color: #E6A23C">待审核</span>
    </div>

    <div slot="footer" class="dialog-footer pop-footer">
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
      isCheckPop:Boolean,
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
        purchaseresultImg:[],
        innerVisible:false,
        innerType:"",
      }
    },
    methods:{


      //审核
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
            url:"book/toCheck",
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
              })
              this.innerVisible = false
            }
            this.$emit("closeDialog");
            this.$emit("getBookInfo",1,this.pageSize);
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

      // console.log("toCheckInfo",this.isChecked);

      if(this.toCheckInfo.RECORD){
        this.record=this.toCheckInfo.RECORD;
      }

      this.bookList = this.toCheckInfo.items;

      this.noteList=this.toCheckInfo.NOTE;
      // console.log("noteList",this.noteList);
      if(this.toCheckInfo.NOTE){
        this.noteList.forEach( m => {
          switch ( m.TYPE) {
            case "0":
              this.bookListImg.push(m);
              break;
            case "2":
              this.invoiceImg.push(m);
              break;
            case "3":
              this.OAImg.push(m);
              break;
            case "4":
              this.buyImg.push(m);
              break;
            case "5":
              this.purchaseresultImg.push(m);
              break;
          }
        });
      }



     /* console.log("invoiceImg",this.invoiceImg);
      console.log("bookListImg",this.bookListImg);*/


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
    /*width: 30%;*/
    width: 18%;
    height: 100px;
    display: inline-block;
    /*background: red;*/
    margin-right: 15px;
    margin-bottom: 10px;
  }

  /*.book-item:nth-of-type(5n){
    margin-right: 0;
  }*/

  .book-item .book-item-text{
    font-size: 12px;
  }

  .book-img{
    width: 60px;
    height: 100%;
    /*background: yellow;*/
    display: inline-block;
    vertical-align: top;
  }

  .book-img img{
    vertical-align: top;
    width: 100%;
    max-height: 100%;
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
    width: 130px;
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
    /*width: 307px;*/
    width: 465px;
    /*background: lightblue;*/
    vertical-align: top;
    margin-right: 5px;
  }

  .book-img-wrap>.book-img{
    width: 60px;
    height: 60px;
    /*background: yellow;*/
    display: inline-block;
    vertical-align: top;
    margin: 0 15px 10px 0;
  }

  .book-img-wrap>.book-img img{
    width: 100%;
    height: 100%;
    cursor: crosshair;
  }

</style>
