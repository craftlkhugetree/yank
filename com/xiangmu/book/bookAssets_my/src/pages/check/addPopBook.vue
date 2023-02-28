<template>
  <!--<el-dialog title="收货地址" :visible.sync="dialogFormVisible">-->
    <div>

      <div :style="{'max-height':innerHeight*0.6+'px'}" class="topnav_box dialog-innner-box">

        <div class="dialog-remark-item" v-show="form.ISCHECKED =='0' && isAddDialog == false">
          <label class="dialog-remark-label">审核意见</label>
          <span class="dialog-remark-text">{{form.REMARK}}</span>
        </div>

        <el-form  :model="form" :label-width="formLabelWidth" size="small" >
          <!--<el-form-item label-color="red" >
            <span>{{form.REMARK}}</span>
          </el-form-item>-->
          <!-- <el-form-item class="el-form-item-self" label="经费负责人" required style="position: relative">
            <input v-model="form.CREATERNAME" autocomplete="off" placeholder="请选择或输入经费负责人" @keyup="getCreator" @change="valueChange"></input>
            <div class="creatname-wrap" v-show="isshowbookorders" style="width: 100%">
              <ul>
                <li class="creatname-item" v-for="(item,index) in creatorList" :key="index" @click="setvalue(item.NAME,item.ID)"  >{{item.NAME}} {{item.ID}}</li>
              </ul>
            </div>
          </el-form-item> -->
          <el-form-item class="el-form-item-self" label="经费本号" required style="position: relative">
            <input v-model="form.FUNDNUMBER" autocomplete="off" placeholder="请输入经费本号" @change="form.FUNDNUMBER = (form.FUNDNUMBER || '').toUpperCase()" maxlength="100"/>
          </el-form-item>

          <!-- <el-form-item class="el-form-item-self" label="经费类型" required >
            <el-select v-model="form.FUNDTYPE" placeholder="请选择经费类型" :clearable="true" style="width: 100%" >
              <el-option label="行政类" value="行政类"></el-option>
              <el-option label="非行政类" value="非行政类"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="el-form-item-self" label="图书类型" required>
            <el-radio-group v-model="form.ISCHINESE">
              <el-radio label="1" value="1">境内出版</el-radio>
              <el-radio label="0" value="0">境外出版</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="el-form-item-self" label="发票总金额" required>
            <el-input-number v-model="form.NOTEALLMONEY" autocomplete="off" placeholder="请输入发票总金额" :controls="false" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item class="el-form-item-self" label="发票号"  required>
            <el-input v-model="form.INVOICENUM" autocomplete="off" placeholder="请输入发票号(只允许使用一次)" @blur="checkInvoice(form.INVOICENUM)"></el-input>
            <!--<el-input v-model="form.INVOICENUM" autocomplete="off" placeholder="请输入发票号(只允许使用一次)" @blur="checkInvoice(form.INVOICENUM)"></el-input>-->
		  </el-form-item>
		  <el-form-item class="el-form-item-self" label-width="20px">
			  <span style="color: red;">一定要使用Chrome浏览器或双核浏览器的极速模式</span>
		  </el-form-item>
          <!--<el-form-item class="el-form-item-self" label="经费本编号" required>
            <el-input v-model="form.FUNDNUMBER" autocomplete="off" placeholder="请输入经费本编号"></el-input>
          </el-form-item>-->
          <!--<el-form-item class="el-form-item-self" label="手机号" required>
            <el-input v-model="form.PHONE" autocomplete="off" placeholder="请输入手机号" ></el-input>
          </el-form-item>-->
          <el-form-item label="用途说明" style="width: 98.5%">
            <el-input v-model="form.REASON" autocomplete="off" placeholder="请输入用途说明"></el-input>
          </el-form-item>
        </el-form>

        <div class="line"></div>

        <el-table :data="tableData" border size="mini" >
          <el-table-column  label="序号" align="center" width="45">
            <template slot-scope="scope" >
              <span @click="handleClick(scope)">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="ISBN" align="center">
            <template slot-scope="scope">
              <input class="table-input" type="text" v-model="scope.row.BOOK.ISBN" @blur="getISBN(scope)"  v-loading.fullscreen.lock="fullscreenLoading" placeholder="点击填写" >
              <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
            </template>
          </el-table-column>
          <el-table-column  label="图书名称" align="center">
            <template slot-scope="scope">
              <!--<input class="table-input" v-model="scope.row.BOOK.title" type="text"  readonly placeholder="读取数据" >-->
              <input class="table-input" v-model="scope.row.BOOK.title" type="text" >
            </template>
          </el-table-column>
          <el-table-column label="作者" align="center">
            <template slot-scope="scope">
              <!--<input class="table-input" v-model="scope.row.BOOK.author" type="text" readonly placeholder="读取数据" >-->
              <input class="table-input" v-model="scope.row.BOOK.author" type="text" >
            </template>
          </el-table-column>
          <el-table-column label="出版社" align="center">
            <template slot-scope="scope">
              <!--<input class="table-input" v-model="scope.row.BOOK.publisher" type="text" readonly placeholder="读取数据" >-->
              <input class="table-input" v-model="scope.row.BOOK.publisher" type="text">
            </template>
          </el-table-column>
          <!--<el-table-column label="标价" align="center" width="75">
            <template slot-scope="scope">
              <input class="table-input" v-model="scope.row.BOOK.BIDPRICE" type="text" placeholder="点击填写" >
            </template>
          </el-table-column>-->
          <el-table-column  label="册数" align="center" width="75">
            <template slot-scope="scope">
              <input class="table-input" v-model="scope.row.BOOK.QUANTITY" type="text" placeholder="点击填写"  @blur="isNum(scope.row.BOOK.QUANTITY,scope,1)">
              <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
            </template>
          </el-table-column>
          <!--<el-table-column  label="实付总价" align="center" width="75">
            <template slot-scope="scope">
              <input class="table-input" v-model="scope.row.BOOK.TOTAL" type="text" placeholder="点击填写" @blur="isNum(scope.row.BOOK.TOTAL,scope,2)" >
            </template>
          </el-table-column>-->
          <el-table-column label="操作" align="center" width="90">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addBook(scope)">增加</el-button>
              <el-button type="text" size="small" @click="deleteBook(scope)" v-show="tableData.length > 1">删除</el-button>
              <!--<span >增加</span>-->
              <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
            </template>

          </el-table-column>
        </el-table>

        <!--<div style="text-align: right;margin-top: 10px">总额：￥{{totalAmount ? totalAmount.toFixed(2) :0 }}</div>-->

        <div class="line"></div>

        <div class="upload-wrap" style="margin-bottom: 20px">
          <div class="upload-item" style="width: 140px">
            <el-button type="primary" size="small" class="self-button" @click="uploadImg(0)" element-loading-text="正在上传"
                       element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="fullscreenLoading" >
              <span>上传发票</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg0" :url="uploadUrl" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(2)" @done="finish"></up-load>
            </el-button>
            <div>
              <img class="single-img" :preview="1" v-for="(item,index) in imgIds" :key="index" :src="domain+'/fileManage/get?ID='+item.ID" alt="" >
            </div>
          </div>

          <div  class="upload-item right" style="width: 370px">

            <el-tooltip class="item" effect="dark" content="书单是指购书的清单明细，要求由书商提供" placement="right-start">
              <el-button type="primary" size="small" class="self-button" @click="uploadImg(2)">
              <span>上传购书清单</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg2" :url="uploadUrl" multiple="true" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(0)" @done="finish"></up-load>
            </el-button>
            </el-tooltip>

            <div>
              <div class="more-img" v-for="(item,index) in imgIds2" :key="index">
                <img  style="width: 100%;height: 100%" :preview="2"  :src="domain+'/fileManage/get?ID='+item.ID" alt="">
                <i class="el-icon-delete" @click="deleteImg(index)" title="删除"></i>
              </div>
            </div>

          </div>

          <!-- 行政类的大于2万和非行政类的大于5万的 上传 采购结果公告（图片或者文档），去除OA审核单和采购清单 -->
          <div  class="upload-item right" style="width: 140px" v-show="isNeedPurchaseResult">
            <el-button type="primary" size="small" class="self-button" @click="uploadImg(5)">
              <span>采购结果公告</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg5" :url="uploadUrl" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(5)" @done="finish"></up-load>
            </el-button>
            <div>
              <img class="single-img" :preview="5" v-for="(item,index) in imgIds5" :key="index" :src="domain+'/fileManage/get?ID='+item.ID" alt="">
            </div>
          </div>

          <!-- <div  class="upload-item" style="width: 140px" v-show="(form.ISCHINESE == 1 && form.NOTEALLMONEY >=2000) || (form.ISCHINESE == 0 && form.NOTEALLMONEY >= 5000) ">
            <el-button type="primary" size="small" class="self-button" @click="uploadImg(3)">
              <span>OA审核文件截图</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg3" :url="uploadUrl" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(3)" @done="finish"></up-load>
            </el-button>
            <div>
              <img  class="single-img" :preview="3" v-for="(item,index) in imgIds3" :key="index" :src="domain+'/fileManage/get?ID='+item.ID" alt="">
            </div>
          </div> -->

          <!-- <div  class="upload-item" style="width: 140px" v-show="(form.ISCHINESE == 1 && form.NOTEALLMONEY >= 2000) || (form.ISCHINESE == 0 && form.NOTEALLMONEY >= 5000)">
            <el-button type="primary" size="small" class="self-button" @click="uploadImg(4)">
              <span>文献资源项目采购申报表</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg4" :url="uploadUrl" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(4)" @done="finish"></up-load>
            </el-button>
            <div >
              <img class="single-img" :preview="4" v-for="(item,index) in imgIds4" :key="index" :src="domain+'/fileManage/get?ID='+item.ID" alt="">
            </div>
          </div> -->

        </div>
      </div>

      <div slot="footer" class="dialog-footer pop-footer" >
        <el-button @click="cancel" size="small" style="width: 100px">取 消</el-button>
        <el-button type="primary" @click="submit" size="small" style="width: 100px">提 交</el-button>
      </div>
    </div>

  <!--</el-dialog>-->
</template>

<script>
  import upLoad from "../../common/upload"
  import {global} from "../../assets/js/global"
    export default {
      name: "checkPop",
      props:{
        currentBook:Object,
        isAddDialog:Boolean,
        pageSize:Number,
        innerHeight:Number
      },
      components:{
        upLoad
      },
      data:function () {
        return {
          /*tableData: [     //ISBN数据
            {
              title: '',
              publisher: '',
              author: ''
            }
          ],*/
          state: '',
          timeout:  null,
          isshowbookorders:false,
          domain:global,
          state1:"",
          tableData: [     //ISBN数据
            {
              BOOK: {
                title: '',
                publisher: '',
                author: ''
              },
              IMG:{
                COVER:{}
              }
            }
          ],
          // totalAmount:"",  //报销总金额
          ISBN:"",  //编号
          form: {
            FUNDTYPE:"行政类",
            ISCHINESE:"1",
            CREATERNAME:"",
            CREATERID:""

          },  //表单数据
          creatorList:[] , //负责人列表
          formLabelWidth: '100px',
          uploadUrl:"",  //上传文件返回的路径
          imgIds:[],  //图片集
          imgIds2:[],
          imgIds3:[], // OA
          imgIds4:[], // 采购申报
          imgIds5:[], // 采购结果公告
          order:"",
          note:[],  //存放书单和发票的图片
          restaurants:[],
          currentInvoice:"", //当前发票号
          isMoreThan1000:false,    //单价是否超过1000
          // height:window.innerHeight

          fullscreenLoading:false,   //整页加载

          loading:false,
          readonly:false,
          IMGURL:"",
        }
      },
      methods:{
        //判断单价是否大于等于1000
        moreThan1000(){
          /*if(price >= 1000){
            this.isMoreThan1000=true
          }else {
            this.isMoreThan1000=false
          }*/

         /* this.tableData.forEach(v=>{
            console.log("TRADINGPRICE",v.BOOK.TRADINGPRICE);
            if(v.BOOK.TRADINGPRICE >= 1000){
              this.isMoreThan1000=true;
              console.log("1",this.tableData);
            }else {
              this.isMoreThan1000=false;
              console.log("2",this.tableData);
            }
          })*/

          // this.isMoreThan1000=this.tableData.some(v=> v.BOOK.TRADINGPRICE >= 1000);


          // console.log("1111",this.isMoreThan1000);
        },

        //判断总价是否大于等于20000元
        // moreThan20000(){
        //   let flag = true;
        //  if(this.form.NOTEALLMONEY >= 20000){
        //    flag = false;
        //    this.$message({
        //      message:"本系统不支持提交大于等于20000元的登记",
        //      type:"warning",
        //    })
        //  }
        //  return flag;
        // },


        //上传文件触发
        uploadImg:function(index){
          switch (index) {
            case 0:
              this.$refs.uploadImg0.toupload();
              break;
            case 2:
              this.$refs.uploadImg2.toupload();
              break;
            case 3:
              this.$refs.uploadImg3.toupload();
              break;
            case 4:
              this.$refs.uploadImg4.toupload();
              break;
            case 5:
              this.$refs.uploadImg5.toupload();
              break;
          }
        },

        //书单上传后删除
        deleteImg:function(index){
          this.imgIds2.splice(index,1)
        },

        //审核发票是否重复
        checkInvoice:function(invoice){
          if(!invoice){
            this.$message({
              message:"请填写发票号",
              type:"warning",
            })
          }
          else if(!this.isInvoiceAvailable(invoice) && this.form.ISCHINESE == 1){
            this.$message({
              message:"一次填报一张发票，发票号码全数字，不超过八位",
              type:"warning",
            });
          }
          else {
            this.isInvoiceRepeat(invoice)
          }
        },

        isInvoiceRepeat(invoice){
          let flag=true;
          this.util.postAjax({
            code:this.global.code,
            url:"book/checkInvoiceNum",
            data:{
              INVOICENUM:invoice
            }
          }).then( (res)=> {
            if(res.status == false){

              if(this.isAddDialog){
                // this.form.INVOICENUM = "";
                this.$message({
                  message:res.message,
                  type:"warning",
                })
              }else {
                if(this.currentInvoice==invoice){
                  this.form.INVOICENUM=invoice;
                }else {
                  flag=false;
                  this.form.INVOICENUM=invoice;
                  this.$message({
                    message:res.message,
                    type:"warning",
                  })
                }
              }
            }

            console.log("flag;",flag);
            return flag
          })
        },

        //验证发票号
        isInvoiceAvailable(invoice) {
          var myreg = /^[0-9]{1,8}$/;
          // var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          if (!myreg.test(invoice)) {
            return false;
          } else {
            return true;
          }
        },

        //验证手机号
        isPoneAvailable(phone) {
          var myreg = /^1\d{10}$/;
          // var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          if (!myreg.test(phone)) {
            return false;
          } else {
            return true;
          }
        },

        //判断是否为数字
        isNum(num,scope,type){
          var myreg = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
          let index=scope.$index;
          // var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          if (!myreg.test(num)) {
            // this.$message({
            //   message: "金额必须为数字！",
            //   type: "warning",
            // });
            if(type == 1){
              this.tableData[index].BOOK.QUANTITY="";
            }else if(type == 2){
              this.tableData[index].BOOK.TOTAL="";
            }
            return false;
          } else {
            return true;
          }
        },

        isTableData(){
          let flag=true;
          this.tableData.forEach(v => {
            if(!v.BOOK.ISBN){
              flag = false;
              this.$message({
                message: "请填写ISBN编号！",
                type: "warning",
              })
            }
            else if(!v.BOOK.title){
              flag = false;
              this.$message({
                message: "请填写图书名称！",
                type: "warning",
              })
            }
            else if(!v.BOOK.QUANTITY){
              flag = false;
              this.$message({
                message: "请填写图书册数！",
                type: "warning",
              })
            }

            /*else if(!v.BOOK.TOTAL){
              flag = false;
              this.$message({
                message: "请填写图书实付总价！",
                type: "warning",
              })
            }*/
          });
          return flag
        },

        //提交
        submit:function(){
          // if(!this.form.CREATERNAME){
          //   this.$message({
          //     message:"请选择经费负责人！",
          //     type:"warning",
          //   })
          if(!this.form.FUNDNUMBER){
            this.$message({
              message:"请输入经费本号！",
              type:"warning",
            })
          }else if(!this.form.FUNDTYPE){
            this.$message({
              message:"请选择经费类型！",
              type:"warning",
            })
          }else if(!this.form.ISCHINESE){
            this.$message({
              message:"请选择图书类型！",
              type:"warning",
            })
          }else if(!this.form.NOTEALLMONEY){
            this.$message({
              message:"请填写发票金额！",
              type:"warning",
            })
          }
          else if(!this.form.INVOICENUM){
            this.$message({
              message:"请填写发票号！",
              type:"warning",
            })
          }
          else if(this.form.NOTEALLMONEY >= 20000){
            this.$message({
              message:"采购金额超过两万元（含两万元），请与资源建设部联系。联系电话：025-84396822",
              type:"warning",
            })
          }
          else if(!this.isInvoiceAvailable(this.form.INVOICENUM) && this.form.ISCHINESE == 1){
            this.$message({
              message:"一次填报一张发票，发票号码全数字，不超过八位",
              type:"warning",
            });
            return false;
          }
          else if(this.isInvoiceRepeat(this.form.INVOICENUM)){
            this.$message({
              message:"发票号已报销！",
              type:"warning",
            })
          }
          else if(!this.isTableData()){
            /*this.$message({
              message: "请填写ISBN编号！",
              type: "warning",
            })*/
          }
          else if(this.imgIds.length == 0){
            this.$message({
              message: "请上传发票！",
              type: "warning",
            })
          }else if(this.imgIds2.length == 0){
            this.$message({
              message: "请上传书单！",
              type: "warning",
            })
          }
          // else if(((this.form.ISCHINESE == 1 && this.form.NOTEALLMONEY >=2000) || (this.form.ISCHINESE == 0 && this.form.NOTEALLMONEY >=5000))&& this.imgIds3.length == 0){
          //   this.$message({
          //     message: "请上传OA截图！",
          //     type: "warning",
          //   })
          // }else if(((this.form.ISCHINESE == 1 && this.form.NOTEALLMONEY >=2000) || (this.form.ISCHINESE == 0 && this.form.NOTEALLMONEY >=5000))&& this.imgIds4.length == 0){
          //   this.$message({
          //     message: "请上传文献资源项目采购申报表！",
          //     type: "warning",
          //   })
          // }
          else if (this.isNeedPurchaseResult && this.imgIds5.length == 0) {
            this.$message({
              message: "请上传采购结果公告",
              type: "warning",
            })
          } else {

            this.form.ALLMONEY = this.form.NOTEALLMONEY;

            if(this.isAddDialog == false){
              this.form.CREATERID=this.currentBook.RECORD.CREATERID;
            }

            //今天时间
            let today =new Date().getTime();
            this.form.BUYTIME=this.util.formatTime(today,"YYYYMMDD");

            //册数总和
            let sum=0;
            this.tableData.forEach( m => {
              sum += parseInt(m.BOOK.QUANTITY)
            });
            this.form.ALLSUM =sum;

            console.log("form",this.form);


            this.tableData.forEach((value,index)=>{
              console.log(value);
              this.tableData[index]={
                BOOK:{
                  ISBN:value.BOOK.ISBN,
                  BOOKNAME: value.BOOK.title,
                  AUTHOR:value.BOOK.author ? value.BOOK.author : "--",
                  PUBLISHER:value.BOOK.publisher ? value.BOOK.publisher : "--",
                  QUANTITY:value.BOOK.QUANTITY,
                  // BIDPRICE:value.BOOK.BIDPRICE,
                  ISCHINESE:this.form.ISCHINESE,
                  // TRADINGPRICE:value.BOOK.TRADINGPRICE,
                  // TOTAL:value.BOOK.QUANTITY*value.BOOK.TRADINGPRICE,
                  // TOTAL:value.BOOK.TOTAL,
                  MONEYTYPE:"人民币",
                },
                IMG:{
                   COVER: {
                     TYPE: "1",  // （固定1代表封面图）
                     SHOWNAME: "COVER", //（固定 COVER）
                     URL: value.IMG.COVER.URL   //(取2.1 ISBN获取到的IMGURL)
                   }
                }
              };
            });

            //note
            this.note=[];
            this.imgIds2.forEach( v => {
              this.note.push({TYPE:0,NOTEID:v.ID});
            });

            this.imgIds.forEach( v => {
              this.note.push({TYPE:2,NOTEID:v.ID});
            });


            // if((this.form.ISCHINESE == 1 && this.form.NOTEALLMONEY >=2000) || (this.form.ISCHINESE == 0 && this.form.NOTEALLMONEY >=5000)){
            //   this.imgIds3.forEach( v => {
            //     this.note.push({TYPE:3,NOTEID:v.ID});
            //   });

            //   this.imgIds4.forEach( v => {
            //     this.note.push({TYPE:4,NOTEID:v.ID});
            //   });
            // }

            if (this.isNeedPurchaseResult) {
              this.imgIds5.forEach( v => {
                this.note.push({ TYPE: 5, NOTEID: v.ID })
              })
            }

            /*this.creatorList.forEach(v=>{
              if(this.form.CREATERNAME == v.NAME){

              }
            })*/


            console.log("note2",this.note);

            this.util.postAjax({
              code:this.global.code,
              url:"book/save",
              data:{
                data:JSON.stringify({
                  "RECORD":this.form,
                  "NOTE":this.note,
                  "BOOKS":this.tableData
                })
              }
            }).then(res => {
              if(res.success == true){

                if(this.isAddDialog == true){
                  this.$message({
                    message: "图书添加成功！",
                    type: "success",
                  })
                }else {
                  this.$message({
                    message: "图书编辑成功！",
                    type: "success",
                  })
                }
                this.$emit("closeDialog");
                this.$emit("getBookInfo",1,this.pageSize);

              }
              // console.log("提交返回",res);
            })

          }
        },

        //取消按钮点击
        cancel:function(){
          this.$emit("closeDialog")
        },

        //添加图书信息
        addBook:function(row){
          let index=row.$index;
          if(!this.form.FUNDNUMBER){
            this.$message({
              message:"请输入经费本号！",
              type:"warning",
          })
          // if(!this.form.CREATERNAME){
          //   this.$message({
          //     message:"请选择经费负责人！",
          //     type:"warning",
          //   })
          }else if(!this.form.FUNDTYPE){
            this.$message({
              message:"请选择经费类型！",
              type:"warning",
            })
          }else if(!this.form.ISCHINESE){
            this.$message({
              message:"请选择图书类型！",
              type:"warning",
            })
          }else if(!this.form.NOTEALLMONEY){
            this.$message({
              message:"请填写发票金额！",
              type:"warning",
            })
          }else if(this.form.NOTEALLMONEY >= 20000){
            this.$message({
              message:"采购金额超过两万元（含两万元），请与资源建设部联系。联系电话：025-84396822",
              type:"warning",
            })
          }
          else if(!this.form.INVOICENUM){
            this.$message({
              message:"请填写发票号！",
              type:"warning",
            })
          }
          /*else if(!this.form.FUNDNUMBER){
            this.$message({
              message:"请填写经费本编号！",
              type:"warning",
            })
          }*/
          else if(!this.tableData[row.$index].BOOK.ISBN){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的ISBN！",
              type:"warning",
            })
          }
          /*else if(!this.tableData[row.$index].BOOK.BIDPRICE){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的标价！",
              type:"warning",
            })
          }*/
          else if(!this.tableData[row.$index].BOOK.title){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的图书名称！",
              type:"warning",
            })
          }
          else if(!this.tableData[row.$index].BOOK.QUANTITY){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的册数！",
              type:"warning",
            })
          }

          /*else if(!this.tableData[row.$index].BOOK.TRADINGPRICE){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的购买价格！",
              type:"warning",
            })
          }*/
         /* else if(!this.tableData[row.$index].BOOK.TOTAL){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的实付价格！",
              type:"warning",
            })
          }*/
          else {
            // this.ISBN="";

           /* if(this.totalAmount >= this.form.NOTEALLMONEY){
              this.$message({
                message:"报销总额大于或等于发票金额，无法继续添加",
                type:"warning",
              })
            }else {*/
              this.tableData.push(
                {
                  BOOK: {
                    title:"",
                    author:"",
                    publisher:"",
                    // BIDPRICE:"",
                    QUANTITY:"",
                    // TRADINGPRICE:"",
                    ISBN:"",
                    TOTAL: "",
                  },
                })
            // }

          }
        },

        //删除图书信息
        deleteBook:function(scope){
          let index = scope.$index;
          /*if (index !== 0) {
            this.tableData.splice(index, 1)
          }*/

          if (this.tableData.length > 1) {
            this.tableData.splice(index, 1)
          }
          // this.moreThan1000();
          this.imgIds3=[];
          this.imgIds4=[];

        },


        //获取getISBN
        getISBN:function(scope){
          // this.loading=true;
          // this.fullscreenLoading=true;
          if(this.tableData[scope.$index].BOOK.ISBN && this.tableData[scope.$index].BOOK.ISBN.length>0){
            this.loading=this.$loading({
              lock: true,
              text: '搜索中',
              // spinner: 'el-icon-loading',
              // background: 'rgba(0, 0, 0, 0.7)'
            });

            this.util.postAjax({
              code:this.global.code,
              url: "book/isbnGetBookInfo",
              data:{
                ISBN:this.tableData[scope.$index].BOOK.ISBN,
              }
            }).then((res)=>{
              this.loading.close();
              // this.fullscreenLoading=false;
              if(res.success == true){
                // this.readonly = true;
                res.ISBN=this.tableData[scope.$index].BOOK.ISBN;
                this.tableData[scope.$index].BOOK.title=res.title;
                this.tableData[scope.$index].BOOK.author=res.author;
                this.tableData[scope.$index].BOOK.publisher=res.publisher;
                this.tableData[scope.$index].IMG ={
                  COVER:{
                    URL:res.IMGURL
                  }
                };

                // console.log("publisher",this.tableData[scope.$index].BOOK.publisher.length == 0);

                if(this.tableData[scope.$index].BOOK.title == ""){
                  this.tableData[scope.$index].BOOK.title = "--"
                }else if( this.tableData[scope.$index].BOOK.author.length==0){
                  this.tableData[scope.$index].BOOK.author = "--"
                }else if(this.tableData[scope.$index].BOOK.publisher.length == 0){
                  this.tableData[scope.$index].BOOK.publisher = "--"
                }
                console.log("length",res.IMGURL);
              }else {
                this.loading.close()
                // this.fullscreenLoading=false;
                // this.readonly = false;
                // debugger
                this.tableData[scope.$index].BOOK.title="";
                this.tableData[scope.$index].BOOK.author="";
                this.tableData[scope.$index].BOOK.publisher="";
                this.tableData[scope.$index].IMG ={
                  COVER:{
                    URL:res.data.IMGURL
                  }
                };
                // this.tableData[scope.$index].BOOK=res.IMGURL;
                this.$message({
                  message:"搜不到该ISBN信息，请检查或手动重新输入",
                  type:"warning",
                });
              }
            })
            // .catch( err => {
            //   console.log("err",err);
            // })
          }



        },

        handleClick(row) {
          console.log("row",row);
        },

        //上传文件
        choosefiel:function(file){
          console.log("上传后回调");
          console.log(file);
          this.fullscreenLoading=true;
          this.order=file
        },

        finish:function(res){
          switch (this.order) {
            case 0:
              res.FILE.forEach((v) => {
                console.log("v",v);
                this.imgIds2.push(v);
              });
              break;
            case 2:
              this.imgIds=res.FILE;
              break;
            case 3:
              this.imgIds3=res.FILE;
              break;
            case 4:
              this.imgIds4=res.FILE;
              break;
            case 5:
              this.imgIds5=res.FILE;
              break;
          }

          this.$previewRefresh();
          this.fullscreenLoading=false;
        },

        //获取上传的url
        uploadFile(){
          this.util.getUrlByCode(this.global.code,"fileManage/upload").then(res => {
            console.log("uploadUrl",res);
            this.uploadUrl = res + "?date="+ new Date().getTime();
          })
        },

        //获取负责人
        getCreator:function (e) {
          console.log(this.form.CREATERNAME)
          this.isshowbookorders = true;
          this.util.postAjax({
            code:this.global.code,
            url:"book/getGroup",
            data:{
              page:1,
              limit:10,
              filter:JSON.stringify(
                {
                  // NAME:"",
                  // ID:"",
                  KEYWORD:this.form.CREATERNAME}
                )
            }
          }).then((res)=>{
            console.log(res);
            if(res.items.length == 0){
              this.creatorList = [];
              this.form.CREATERNAME = '';
            }else {
              this.creatorList=res.items;
            }

          })
        },

        //文本框变化设置值
        setvalue(data,id){
          this.form.CREATERNAME = data;
          //将负责人的id存起来
          // sessionStorage.setItem('mainpersonID',id);

          this.form.CREATERID=id;
          this.creatorList = [];
          this.isshowbookorders = false;
        },

        valueChange(value){
          console.log("value",value);
          this.form.CREATERNAME = "";
        }
      },
      computed:{
        /*totalAmount:function () {
          let sum=0;
          this.tableData.forEach( m => {
            // sum += m.BOOK.TRADINGPRICE * m.BOOK.QUANTITY
            sum += Number(m.BOOK.TOTAL)
          });

          return sum;
        }*/
        isNeedPurchaseResult () {
          return (this.form.FUNDTYPE === '行政类' && this.form.NOTEALLMONEY >= 20000) || (this.form.FUNDTYPE === '非行政类' && this.form.NOTEALLMONEY >= 50000)
        }
      },

      created() {

        console.log(1111);
        this.uploadFile();
        console.log("currentBook",this.currentBook);
        if(this.currentBook != null){
          this.form= this.currentBook.RECORD;
          this.currentInvoice = this.currentBook.RECORD.INVOICENUM;
          this.note=this.currentBook.NOTE;
          this.note.forEach( m => {
            switch ( m.TYPE) {
              case "0":
                this.imgIds2.push(m);
                break;
              case "2":
                this.imgIds.push(m);
                break;
              case "3":
                this.imgIds3.push(m);
                break;
              case "4":
                this.imgIds4.push(m);
                break;
              case "5":
                this.imgIds5.push(m);
                break;
            }
            m.NOTEID= m.ID;
          });
          console.log("note",this.note);

          this.tableData = this.currentBook.items;
          this.tableData.forEach(m => {
            for( var i in m.BOOK){
              if ( i == "PUBLISHER"){
                console.log(m.BOOK[i]);
                m.BOOK.publisher=m.BOOK[i];
              }else if(i == "AUTHOR"){
                m.BOOK.author=m.BOOK[i];
              }else if (i == "BOOKNAME"){
                m.BOOK.title=m.BOOK[i];
              }
            };

            m.IMG = {
              "COVER":m.PIC[0]
            }
          });
          console.log("tableData",this.tableData);
        };
        console.log("tableData",this.tableData);

        // this.tableData.forEach(v=>{
        //   if(v.BOOK.TRADINGPRICE >= 1000){
        //     this.isMoreThan1000=true
        //   }else {
        //     this.isMoreThan1000=false
        //   }
        // })
        // this.isMoreThan1000=this.tableData.some(v=> v.BOOK.TRADINGPRICE >= 1000);

        // this.moreThan1000();

        // this.tableData.some(v=)
        // console.log("innerHeight",window.innerHeight);
      },


    }
</script>

<style scoped>
  .upload-item{
    display: inline-block;
    vertical-align: top;
    margin: 0 40px 20px 0;
  }

  .upload-component{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    opacity: 0;
    z-index: -1;
  }


  .table-input{
    width: 100%;
    outline: none;
    border: #fff;
    text-align: center;
  }

</style>
