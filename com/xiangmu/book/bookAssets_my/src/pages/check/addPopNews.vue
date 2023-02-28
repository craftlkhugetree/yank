<template>
  <!--<el-dialog title="收货地址" :visible.sync="dialogFormVisible">-->
    <div>


      <div :style="{'max-height':innerHeight*0.6+'px'}" class="topnav_box dialog-innner-box">
        <div class="dialog-remark-item" v-show="form.ISCHECKED =='0' && isAddDialog == false">
          <label class="dialog-remark-label">审核意见</label>
          <span class="dialog-remark-text">{{form.REMARK}}</span>
        </div>
        <el-form :model="form" :label-width="formLabelWidth" size="small" >
          <!-- <el-form-item class="el-form-item-self" label="经费负责人" required style="position: relative">
            <input v-model="form.CREATORNAME" autocomplete="off" placeholder="请选择或输入经费负责人"  autofocus="autofocus" @keyup="getCreator" @change="valueChange"></input>
            <div class="creatname-wrap" v-show="isshowbookorders">
              <ul>
                <li class="creatname-item" v-for="(item,index) in creatorList" :key="index" @click="setvalue(item.NAME,item.ID)">{{item.NAME}} {{item.ID}}</li>
              </ul>
            </div>
          </el-form-item> -->
          <el-form-item class="el-form-item-self" label="经费本号" required style="position: relative">
            <input v-model="form.FUNDNUMBER" autocomplete="off" placeholder="请输入经费本号" @change="form.FUNDNUMBER = (form.FUNDNUMBER || '').toUpperCase()" maxlength="100"/>
          </el-form-item>

          <!-- <el-form-item class="el-form-item-self" label="经费类型" required >
            <el-select v-model="form.FUNDTYPE" placeholder="请选择经费类型" :clearable="true" style="width: 100%">
              <el-option label="行政类" value="行政类"></el-option>
              <el-option label="非行政类" value="非行政类"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item class="el-form-item-self" label="报刊种类" required>
            <el-radio-group v-model="form.ISCHINESE">
              <el-radio label="1" value="1">境内出版</el-radio>
              <el-radio label="0" value="0">境外出版</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="el-form-item-self" label="报刊种数" required>
            <!--<el-input v-model="form.KINDNUM" autocomplete="off" placeholder="请输入报刊种数"></el-input>-->
            <el-input-number v-model="form.KINDNUM" autocomplete="off" placeholder="请输入报刊种数" :controls="false" style="width: 100%;"></el-input-number>
          </el-form-item>

          <el-form-item class="el-form-item-self" label="发票总金额" required>
            <!--<el-input v-model="form.ALLMONEY" autocomplete="off" placeholder="请输入发票总金额" ></el-input>-->
            <el-input-number v-model="form.ALLMONEY" autocomplete="off" placeholder="请输入发票总金额" :controls="false" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item class="el-form-item-self" label="发票号"  required >
            <el-input v-model="form.INVOICENUMBER" autocomplete="off" placeholder="请输入发票号(只允许使用一次)" @blur="checkInvoice(form.INVOICENUMBER)"></el-input>
          </el-form-item>
         <!-- <el-form-item class="el-form-item-self" label="经费本编号" required>
            <el-input v-model="form.FUNDNUMBER" autocomplete="off" placeholder="请输入经费本编号"></el-input>
          </el-form-item>-->
          <!--<el-form-item class="el-form-item-self" label="手机号" required>
            <el-input v-model="form.PHONE" autocomplete="off" placeholder="请输入手机号"></el-input>
          </el-form-item>-->
          <el-form-item label="用途说明" style="width: 98.5%">
            <el-input v-model="form.REASON" autocomplete="off" placeholder="请输入用途说明"></el-input>
          </el-form-item>
        </el-form>
        <div class="line"></div>
        <div class="upload-wrap" style="margin-bottom: 20px">
          <div class="upload-item" style="width: 140px">
            <el-button type="primary" size="small" class="self-button" @click="uploadImg(0)" element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="fullscreenLoading">
              <span>上传发票</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg0" :url="uploadUrl" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(2)" @done="finish"></up-load>
            </el-button>

            <div>
              <img class="single-img" :preview="1" v-for="(item,index) in imgIds" :key="index" :src="domain+'/fileManage/get?ID='+item.ID" alt="" >
            </div>
          </div>

          <div  class="upload-item" style="width: 450px">
            <el-tooltip class="item" effect="dark" content="书单是指购书的清单明细，要求由书商提供" placement="right-start">
              <el-button type="primary" size="small" class="self-button" @click="uploadImg(2)">
              <span>上传购书清单</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg2" :url="uploadUrl" multiple="true" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(0)" @done="finish"></up-load>
            </el-button>
            </el-tooltip>
            <div>
              <!--<img class="more-img" :preview="2" v-for="(item,index) in imgIds2" :key="index" :src="domain+'/fileManage/get?ID='+item.ID" alt="">-->
              <div class="more-img" v-for="(item,index) in imgIds2" :key="index">
                <img  style="width: 100%;height: 100%" :preview="2"  :src="domain+'/fileManage/get?ID='+item.ID" alt="">
                <i class="el-icon-delete" @click="deleteImg(index)" title="删除"></i>
              </div>
            </div>

          </div>

          <div  class="upload-item" style="width: 140px"  v-show="isNeedPurchaseResult">
            <el-button type="primary" size="small" class="self-button" @click="uploadImg(5)">
              <span>采购结果公告</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg5" :url="uploadUrl" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(5)" @done="finish"></up-load>
            </el-button>
            <div >
              <img class="single-img" :preview="5" v-for="(item,index) in imgIds5" :key="index" :src="domain+'/fileManage/get?ID='+item.ID" alt="">
            </div>
          </div>
          <!-- <div  class="upload-item" style="width: 140px" v-show="(form.ISCHINESE == 1 && form.ALLMONEY >= 2000) || (form.ISCHINESE == 0 && form.ALLMONEY >= 5000) ">
            <el-button type="primary" size="small" class="self-button" @click="uploadImg(3)">
              <span>OA审核文件截图</span>
              <i class="el-icon-upload el-icon--right"></i>
              <up-load class="upload-component" ref="uploadImg3" :url="uploadUrl" exts="png|jpg|bmp|gif|JPG|PNG|pdf|PDF|jpeg|JPEG" @choose="choosefiel(3)" @done="finish"></up-load>
            </el-button>
            <div>
              <img  class="single-img" :preview="3" v-for="(item,index) in imgIds3" :key="index" :src="domain+'/fileManage/get?ID='+item.ID" alt="">
            </div>
          </div>
          <div  class="upload-item" style="width: 140px"  v-show="(form.ISCHINESE == 1 && form.ALLMONEY >= 2000) || (form.ISCHINESE == 0 && form.ALLMONEY >= 5000)">
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

      <div slot="footer" class="dialog-footer pop-footer">
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
          currentInvoice:"",//当前发票号
          isshowbookorders:false,
          domain:global,
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
          ISBN:"",  //编号
          form: {
            FUNDTYPE:"行政类",
            ISCHINESE:"1",
            CREATORNAME:"",
          },  //表单数据
          creatorList:[] , //负责人列表
          formLabelWidth: '100px',
          uploadUrl:"",  //上传文件返回的路径
          imgIds:[],  //图片集
          imgIds2:[],
          imgIds3:[],
          imgIds4:[],
          imgIds5:[],
          order:"",
          note:[],  //存放书单和发票的图片
          restaurants:[],
          fullscreenLoading:false,   //整页加载
          // isMoreThan:(this.form.ISCHINESE == 1 && this.form.NOTEALLMONEY >=2000) || (this.form.ISCHINESE == 0 && this.form.NOTEALLMONEY >=5000)
        }
      },
      methods:{
        //判断总价是否大于等于20000元
        /*moreThan20000(){
          let flag = true;
          if(this.form.ALLMONEY >= 20000){
            flag = false;
            this.$message({
              message:"本系统不支持提交大于等于20000元的登记",
              type:"warning",
            })
          }
          return flag;
        },*/

        //书单上传后删除
        deleteImg:function(index){
          this.imgIds2.splice(index,1)
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

        //审核发票是否重复
        checkInvoice:function(invoice){

          if(!invoice){
            this.$message({
              message:"请填写发票号",
              type:"warning",
            })
          }else if(!this.isInvoiceAvailable(invoice) && this.form.ISCHINESE == 1){
            this.$message({
              message:"一次填报一张发票，发票号码全数字，不超过八位",
              type:"warning",
            });
            // this.form.INVOICENUMBER = ""
          }
          else{
            this.isInvoiceRepeat(invoice)
          }

        },

        isInvoiceRepeat(invoice){
          let flag=true;
          this.util.postAjax({
            code:this.global.code,
            url:"Periodical/checkInvoiceNum",
            data:{
              INVOICENUMBER :invoice
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
                  this.form.INVOICENUMBER=invoice;
                  /*this.$message({
                    message:"当前正在使用该发票号！",
                    type:"success",
                  })*/
                }else {
                  // this.form.INVOICENUM = "";
                  flag=false;
                  this.form.INVOICENUMBER=invoice;
                  this.$message({
                    message:res.message,
                    type:"warning",
                  })
                }
              }
            }
            // console.log("invoice",res);
            return flag;
          })

        },

        isPoneAvailable(phone) {
          // var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          var myreg = /^1\d{10}$/;
          if (!myreg.test(phone)) {
            return false;
          } else {
            return true;
          }
        },

        //上传文件触发
        uploadImg:function(index){},

        //提交按钮点击
        submit:function(){
          // if(!this.form.CREATORNAME){
          //   this.$message({
          //     message:"请选择经费负责人！",
          //     type:"warning",
          //   })
          // }
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
              message:"请选择报刊类型！",
              type:"warning",
            })
          }else if(!this.form.KINDNUM){
            this.$message({
              message:"请选择报刊种数！",
              type:"warning",
            })
          }
          else if(!this.form.ALLMONEY){
            this.$message({
              message:"请填写发票金额！",
              type:"warning",
            })
          }
          else if(this.form.ALLMONEY >= 20000){
            this.$message({
              message:"采购金额超过两万元（含两万元），请与资源建设部联系。联系电话：025-84396822",
              type:"warning",
            })
          }
          /*else if(this.moreThan20000() == false){
            this.$message({
              message:"本系统不支持提交大于等于20000元的登记",
              type:"warning",
            })
          }*/
          else if(!this.form.INVOICENUMBER){
            this.$message({
              message:"请填写发票号！",
              type:"warning",
            })
          }
          else if(!this.isInvoiceAvailable(this.form.INVOICENUMBER) && this.form.ISCHINESE == 1){
            this.$message({
              message:"一次填报一张发票，发票号码全数字，不超过八位",
              type:"warning",
            });
            // this.form.INVOICENUMBER = ""
          }
          else if(this.isInvoiceRepeat(this.form.INVOICENUMBER)){
            this.$message({
              message:"发票号已报销！",
              type:"warning",
            })
          }
         /* else if(!this.form.FUNDNUMBER) {
            this.$message({
              message: "请填写经费本编号！",
              type: "warning",
            })
          }*/

         /* else if(!this.form.PHONE){
            this.$message({
              message: "请填写手机号！",
              type: "warning",
            })
          }*/
          /*else if(!this.isPoneAvailable(this.form.PHONE)){
            this.$message({
              message: "手机号格式不正确！",
              type: "warning",
            })
          }*/
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
          // else if( ((this.form.ISCHINESE == 1 && this.form.ALLMONEY >=2000) || (this.form.ISCHINESE == 0 && this.form.ALLMONEY >=5000)) && this.imgIds3.length == 0){
          //   this.$message({
          //     message: "请上传OA截图！",
          //     type: "warning",
          //   })
          // }else if( ((this.form.ISCHINESE == 1 && this.form.ALLMONEY >=2000) || (this.form.ISCHINESE == 0 && this.form.ALLMONEY >=5000)) && this.imgIds4.length == 0){
          //   this.$message({
          //     message: "请上传文献资源项目采购申报表！",
          //     type: "warning",
          //   })
          // }
          else if (this.isNeedPurchaseResult && this.imgIds5.length === 0) {
              this.$message({
                message: "请上传采购结果公告",
                type: "warning",
              })
          } else {
            /*this.creatorList.forEach( (m,i) => {
              if(m.NAME == this.form.CREATORNAME){
                this.form.CREATORID=m.ID
              }
            });*/

            // console.log("form",this.form);
            if(this.isAddDialog == false){
              this.form.CREATORID=this.currentBook.item.CREATORID;
            }


            //note
            this.note=[];
            this.imgIds2.forEach( v => {
              this.note.push({TYPE:0,URL:v.ID});
            });
            this.imgIds.forEach( v => {
              this.note.push({TYPE:2,URL:v.ID});
            });
            // if((this.form.ISCHINESE == 1 && this.form.ALLMONEY >=2000) || (this.form.ISCHINESE == 0 && this.form.ALLMONEY >=5000)){
            //   this.imgIds3.forEach( v => {
            //     this.note.push({TYPE:3,URL:v.ID});
            //   });
            //   this.imgIds4.forEach( v => {
            //     this.note.push({TYPE:4,URL:v.ID});
            //   });
            // }
            if (this.isNeedPurchaseResult) {
              this.imgIds5.forEach(v => {
                this.note.push({ TYPE: 5, URL: v.ID })
              })
            }
            // console.log("note2",this.note);

            this.util.postAjax({
              code:this.global.code,
              url:"Periodical/save",
              data:{
                data:JSON.stringify({
                  "periodical":this.form,
                  "files":this.note,
                })
              }
            }).then(res => {
              if(res.success == true){
                if(this.isAddDialog == true){
                  this.$message({
                    message: "报刊添加成功！",
                    type: "success",
                  })
                }else {
                  this.$message({
                    message: "报刊编辑成功！",
                    type: "success",
                  })
                }
                this.$emit("closeDialog");
                this.$emit("getJournalInfo",1,this.pageSize);
              }
              // console.log("提交返回",res);
            })

          }
        },

        //取消按钮点击
        cancel:function(){
          this.$emit("closeDialog")
        },


        handleClick(row) {
          // console.log("row",row);
        },

        //上传文件
        choosefiel:function(file){
          console.log("上传后回调");
          console.log(file);
          this.order=file;
          this.fullscreenLoading=true;
        },

        finish:function(res){
         /* console.log("结束后");
          console.log(res);*/


          switch (this.order) {
            case 0:
              res.FILE.forEach((v) => {
                // console.log("v",v);
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
            // console.log("uploadUrl",res);
            this.uploadUrl = res;
          })
        },

        //获取负责人
        getCreator:function (e) {

          // console.log(this.form.CREATORNAME)
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
                  KEYWORD:this.form.CREATORNAME}
              )
            }
          }).then((res)=>{
            // console.log(res);
            if(res.items.length == 0){
              this.creatorList = [];
              this.form.CREATORNAME = '';
            }else {
              this.creatorList=res.items;
            }
          })
        },

        //文本框变化设置值
        setvalue(data,id){
          this.form.CREATORNAME = data;
          //将负责人的id存起来
          // sessionStorage.setItem('mainpersonID',id);
          this.form.CREATORID=id;
          this.creatorList = [];
          this.isshowbookorders = false;
        },

        valueChange(value){
          console.log("value",value);
          this.form.CREATORNAME = "";
        }
      },
      computed: {
        isNeedPurchaseResult () {
          console.log(this.form)
          return (this.form.FUNDTYPE === '行政类' && this.form.ALLMONEY >= 20000) || (this.form.FUNDTYPE === '非行政类' && this.form.ALLMONEY >= 50000)
        }
      },
      created() {
        this.uploadFile();

        // console.log("currentBook",this.currentBook);

        if(this.currentBook != null){
          this.form= this.currentBook.item;

          this.currentInvoice = this.currentBook.item.INVOICENUMBER;

          this.imgIds = this.currentBook.invoice;
          this.imgIds2 = this.currentBook.list;
          this.imgIds3 = this.currentBook.oa;
          this.imgIds4 = this.currentBook.artical;
          this.imgIds5 = this.currentBook.purchaseresult;
          
          /*this.note=this.currentBook.list;
          console.log("note",this.note);
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
            }
            m.NOTEID= m.ID;
          });*/

        }
        // this.currentBook
      },




    }
</script>

<style scoped>
  .upload-item{
    display: inline-block;
    vertical-align: top;
    margin: 0 13px 20px 0;
  }

  .upload-component{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    opacity: 0;
  }

  .upload-item .self-button{
    position: relative
  }

  .upload-item .single-img{
    width:140px;
    height: 130px;
    margin-top: 10px;
  }

  .upload-item .more-img{
    width: 64px;
    height: 60px;
    margin:10px 10px 0 0;
  }

  .table-input{
    width: 100%;
    outline: none;
    border: #fff;
    text-align: center;
  }

</style>
