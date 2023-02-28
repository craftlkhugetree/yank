<template>
  <!--<el-dialog title="收货地址" :visible.sync="dialogFormVisible">-->
    <div>
      <el-form :model="form" :label-width="formLabelWidth" size="small" >
        <el-form-item label="经费负责人" required>
          <el-select v-model="form.CREATERNAME" placeholder="请选择经费负责人">
            <el-option v-for="(item,index) in creatorList" :label="item.NAME" :value="item.NAME" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经费类型" required >
          <el-select v-model="form.FUNDTYPE" placeholder="请选择经费类型">
            <el-option label="科研" value="科研"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图书类型" required>
          <el-radio-group v-model="form.ISCHINESE">
            <el-radio label="1" value="1">境内出版物</el-radio>
            <el-radio label="0" value="0">境外出版物</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票总金额" required>
          <el-input v-model="form.NOTEALLMONEY" autocomplete="off" placeholder="请输入发票总金额"></el-input>
        </el-form-item>
        <el-form-item label="发票号"  required >
          <el-input v-model="form.INVOICENUM" autocomplete="off" placeholder="请输入发票号(只允许使用一次)" @blur="checkInvoice(form.INVOICENUM)"></el-input>
        </el-form-item>
        <el-form-item label="经费本编号" required>
          <el-input v-model="form.FUNDNUMBER" autocomplete="off" placeholder="请输入经费本编号"></el-input>
        </el-form-item>
        <el-form-item label="用途说明">
          <el-input v-model="form.REASON" autocomplete="off" placeholder="请输入用途说明"></el-input>
        </el-form-item>
      </el-form>

      <div class="line"></div>

      <el-table :data="tableData" border size="mini" >
        <el-table-column  label="序号" align="center" width="45">
          <template slot-scope="scope" >
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="ISBN" align="center">
          <template slot-scope="scope">
            <input class="table-input" type="text" v-model="scope.row.ISBN" @blur="getISBN(scope)" placeholder="点击填写" >
            <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
          </template>
        </el-table-column>
        <el-table-column  label="图书名称" align="center">
          <template slot-scope="scope">
            <!--<input class="table-input" v-model="scope.row.BOOKNAME" type="text"  readonly placeholder="读取数据" >-->
            <input class="table-input" v-model="scope.row.title" type="text"  readonly placeholder="读取数据" >
            <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
          </template>
        </el-table-column>
        <el-table-column label="作者" align="center">
          <template slot-scope="scope">
            <!--<input class="table-input" v-model="scope.row.AUTHOR" type="text" readonly placeholder="读取数据" >-->
            <input class="table-input" v-model="scope.row.author" type="text" readonly placeholder="读取数据" >
            <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
          </template>
        </el-table-column>
        <el-table-column label="出版社" align="center">
          <template slot-scope="scope">
            <!--<input class="table-input" v-model="scope.row.PUBLISHER" type="text" readonly placeholder="读取数据" >-->
            <input class="table-input" v-model="scope.row.publisher" type="text" readonly placeholder="读取数据" >
            <!--<el-input placeholder="请输入内容" size="mini" style="padding: 0;border-color: #fff"></el-input>-->
          </template>
        </el-table-column>
        <el-table-column label="标价" align="center" width="75">
          <template slot-scope="scope">
            <input class="table-input" v-model="scope.row.BIDPRICE" type="text" placeholder="点击填写" >
            <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
          </template>
        </el-table-column>
        <el-table-column  label="册数" align="center" width="75">
          <template slot-scope="scope">
            <input class="table-input" v-model="scope.row.QUANTITY" type="text" placeholder="点击填写" >
            <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
          </template>
        </el-table-column>
        <el-table-column  label="购买价格" align="center" width="75">
          <template slot-scope="scope">
            <input class="table-input" v-model="scope.row.TRADINGPRICE" type="text" placeholder="点击填写" >
            <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="90">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addBook(scope)">增加</el-button>
            <el-button type="text" size="small" @click="deleteBook(scope)" v-show="tableData.length > 1">删除</el-button>
            <!--<span >增加</span>-->
            <!--<el-input placeholder="请输入内容" size="mini"></el-input>-->
          </template>

        </el-table-column>
      </el-table>

      <div style="text-align: right;margin-top: 10px">总额：￥{{totalAmount ? totalAmount :0 }}</div>

      <div class="line"></div>

      <div class="upload-wrap" style="margin-bottom: 20px">
        <div class="upload-item" style="width: 140px">
          <el-button type="primary" size="small" class="self-button">
            <span>上传发票</span>
            <i class="el-icon-upload el-icon--right"></i>
            <up-load class="upload-component" :url="uploadUrl" exts="png|jpg|bmp|gif" @choose="choosefiel(1)" @done="finish"></up-load>
          </el-button>
          
          <div>
            <img class="single-img" v-for="(item,index) in imgIds" :key="index" :src="'http://160.255.0.246:8081/book2/rest/fileManage/get?ID='+item.ID" alt="">
          </div>
        </div>

        <div  class="upload-item" style="width: 640px">
          <!--<el-button type="primary" size="small">上传书单<i class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>-->
          <el-button type="primary" size="small" class="self-button">
            <span>上传书单</span>
            <i class="el-icon-upload el-icon--right"></i>
            <up-load class="upload-component" :url="uploadUrl" multiple="true" exts="png|jpg|bmp|gif" @choose="choosefiel(2)" @done="finish"></up-load>
          </el-button>

          <div>
            <img class="more-img" v-for="(item,index) in imgIds2" :key="index" :src="'http://160.255.0.246:8081/book2/rest/fileManage/get?ID='+item.ID" alt="">
          </div>
        </div>

        <div  class="upload-item" style="width: 140px" v-show="(form.ISCHINESE == 1 && form.NOTEALLMONEY >=2000) || (form.ISCHINESE == 0 && form.NOTEALLMONEY >=5000) ">
          <!--<el-button type="primary" size="small">OA审核文件截图<i class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>-->
          <el-button type="primary" size="small" class="self-button">
            <span>OA审核文件截图</span>
            <i class="el-icon-upload el-icon--right"></i>
            <up-load class="upload-component" :url="uploadUrl" exts="png|jpg|bmp|gif" @choose="choosefiel(3)" @done="finish"></up-load>
          </el-button>

          <div>
            <img class="single-img" v-for="(item,index) in imgIds3" :key="index" :src="'http://160.255.0.246:8081/book2/rest/fileManage/get?ID='+item.ID" alt="">
          </div>
        </div>

        <div  class="upload-item" style="width: 640px" v-show="(form.ISCHINESE == 1 && form.NOTEALLMONEY >=2000) || (form.ISCHINESE == 0 && form.NOTEALLMONEY >=5000)">
          <!--<el-button type="primary" size="small">文献资源项目采购申报表<i class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>-->
          <el-button type="primary" size="small" class="self-button">
            <span>文献资源项目采购申报表</span>
            <i class="el-icon-upload el-icon--right"></i>
            <up-load class="upload-component" :url="uploadUrl" exts="png|jpg|bmp|gif" @choose="choosefiel(4)" @done="finish"></up-load>
          </el-button>

          <div>
            <img class="single-img" v-for="(item,index) in imgIds4" :key="index" :src="'http://160.255.0.246:8081/book2/rest/fileManage/get?ID='+item.ID" alt="">
          </div>
        </div>

      </div>


      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogFormVisible = false" size="small" style="width: 100px">取 消</el-button>
        <el-button type="primary" @click="submit" size="small" style="width: 100px">提 交</el-button>
      </div>
    </div>

  <!--</el-dialog>-->
</template>

<script>
  import upLoad from "../../common/upload"
    export default {
      name: "checkPop",
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

          tableData: [     //ISBN数据
            {
              BOOK: {
                title: '',
                publisher: '',
                author: ''
              },
              IMG:{}
            }
          ],
          // totalAmount:"",  //报销总金额
          ISBN:"",  //编号
          form: {},  //表单数据
          creatorList:[] , //负责人列表
          formLabelWidth: '100px',
          uploadUrl:"",  //上传文件返回的路径
          imgIds:[],  //图片集
          imgIds2:[],
          imgIds3:[],
          imgIds4:[],
          order:"",
        }
      },
      methods:{
        //审核发票是否重复
        checkInvoice:function(invoice){
          this.util.postAjax({
            code:this.global.code,
            url:"book/checkInvoiceNum",
            data:{
              INVOICENUM:invoice
            }
          }).then( (res)=> {
            if(res.status == true){
              this.$message({
                message:res.message,
                type:"success",
              })
            }else if(res.status == false){
              this.form.INVOICENUM = "";
              this.$message({
                message:res.message,
                type:"warning",
              })
            }
            console.log("invoice",res);
          })
        },

        //提交
        submit:function(){
          if(!this.form.CREATERNAME){
            this.$message({
              message:"请选择图书负责人！",
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
          }else if(!this.form.INVOICENUM){
            this.$message({
              message:"请填写发票号！",
              type:"warning",
            })
          }else if(!this.form.FUNDNUMBER) {
            this.$message({
              message: "请填写经费本编号！",
              type: "warning",
            })
          }else if(this.form.NOTEALLMONEY != this.totalAmount ) {
            this.$message({
              message: "报销金额与发票金额不一致！",
              type: "warning",
            })
          }else {
            this.creatorList.forEach( (m,i) => {
              if(m.NAME == this.form.CREATERNAME){
                this.form.CREATERID=m.ID
              }
            });

            this.form.ALLMONEY = this.totalAmount;

            //今天时间
            let today =new Date().getTime();
            this.form.BUYTIME=this.util.formatTime(today,"YYYYMMDD");

            //册数总和
            let sum=0;
            this.tableData.forEach( m => {
              sum += parseInt(m.QUANTITY)
            });
            this.form.ALLSUM =sum;

            console.log("form",this.form);


            this.tableData.forEach((value,index)=>{

              this.tableData[index]={
                ISBN:value.ISBN,
                BOOKNAME: value.title,
                AUTHOR:value.author,
                PUBLISHER:value.publisher,
                QUANTITY:value.QUANTITY,
                BIDPRICE:value.BIDPRICE,
                ISCHINESE:this.form.ISCHINESE,
                TRADINGPRICE:value.TRADINGPRICE,
                TOTAL:value.QUANTITY*value.TRADINGPRICE,
                MONEYTYPE:"人民币",
              };
            });

            console.log("table",this.tableData);




          }



        },

        //添加图书信息
        addBook:function(row){
          let index=row.$index;
          // console.log(row.$index+1);
          if(!this.form.CREATERNAME){
            this.$message({
              message:"请选择图书负责人！",
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
          }else if(!this.form.INVOICENUM){
            this.$message({
              message:"请填写发票号！",
              type:"warning",
            })
          }else if(!this.form.FUNDNUMBER){
            this.$message({
              message:"请填写经费本编号！",
              type:"warning",
            })
          }else if(!this.tableData[row.$index].ISBN){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的ISBN！",
              type:"warning",
            })
          }else if(!this.tableData[row.$index].BIDPRICE){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的标价！",
              type:"warning",
            })
          }else if(!this.tableData[row.$index].QUANTITY){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的册数！",
              type:"warning",
            })
          }else if(!this.tableData[row.$index].TRADINGPRICE){
            this.$message({
              message:"请填写第"+(row.$index+1)+"条数据的购买价格！",
              type:"warning",
            })
          }else {
            // this.ISBN="";

            if(this.totalAmount >= this.form.NOTEALLMONEY){
              this.$message({
                message:"报销总额大于或等于发票金额，无法继续添加",
                type:"warning",
              })
            }else {
              this.tableData.push(
                {title:"",
                  author:"",
                  publisher:"",
                  BIDPRICE:"",
                  QUANTITY:"",
                  TRADINGPRICE:"",
                  ISBN:""
                }
              )
            }

          }
        },

        //删除图书信息
        deleteBook:function(scope){
          let index = scope.$index;
          if (index !== 0) {
            this.tableData.splice(index, 1)
          }
        },

        //获取getISBN
        getISBN:function(scope){
          this.util.postAjax({
            code:this.global.code,
            url: "book/isbnGetBookInfo",
            data:{
              ISBN:this.tableData[scope.$index].ISBN,
            }
          }).then((res)=>{

            // if(res.success == true){
              /*let arr=[];
              arr.push(res);
              arr.map((value,index,arry)=>{
                console.log("author",typeof (value.author),value.author);
                if(value.title == ""){
                  value.title = "--"
                }else if( value.author.length==0){
                  value.author = "--"
                }else if(value.publisher === ""){
                  value.publisher = "--"
                }

                this.tableData[scope.$index]={ 'BOOKNAME': value.title,"AUTHOR":value.author,"PUBLISHER":value.publisher };
              });
              console.log("data2",this.tableData);*/

            if(res.title == ""){
              res.title = "--"
            }else if( res.author.length==0){
              res.author = "--"
            }else if(res.publisher === ""){
              res.publisher = "--"
            }

            console.log(res);
            res.ISBN=this.tableData[scope.$index].ISBN;
            this.tableData[scope.$index].title=res.title;
            this.tableData[scope.$index].author=res.author;
            this.tableData[scope.$index].publisher=res.publisher;
            this.tableData[scope.$index].ISBN=res.ISBN;
            // res.push({ISBN:this.tableData[scope.$index].ISBN});
            // this.tableData[scope.$index].push({ISBN:this.tableData[scope.$index].ISBN});

            // this.tableData[scope.$index].ISBN=;

            // }
            /*else if(res.success == false){
              // this.tableData[scope.$index]={ 'BOOKNAME': "","AUTHOR":"","PUBLISHER":"" };
              this.$message({
                message:"搜不到该ISBN信息，请检查或手动重新输入",
                type:"warning",
              })
            }*/


            // console.log("tableData",this.tableData);
            // console.log("ISBN",res);
          }).catch( res => {
            this.tableData[scope.$index]={};
            this.$message({
              message:"搜不到该ISBN信息，请检查或手动重新输入",
              type:"warning",
            });

          })
        },

        handleClick(row) {
          console.log("row",row);
        },

        //上传文件
        choosefiel:function(file){
          console.log("上传后回调");
          console.log(file);
          this.order=file
        },

        finish:function(res){
         /* console.log("结束后");
          console.log(res);*/
          switch (this.order) {
            case 1:
              this.imgIds=res.FILE;
              console.log("imgIds",this.imgIds);
              break;
            case 2:
                res.FILE.forEach((v) => {
                  console.log("v",v);
                  this.imgIds2.push(v);
                });
              console.log("imgIds2",this.imgIds2);
              break;
            case 3:
              this.imgIds3=res.FILE;
              console.log("imgIds3",this.imgIds3);
              break;
            case 4:
              this.imgIds4=res.FILE;
              console.log("imgIds4",this.imgIds4);
              break;
          }

          // console.log("data",data);
          // this.imgIds=res.FILE;
          // console.log(this.imgIds);
          // let backUrlName=res.item.fileUrl.split("/")[res.item.fileUrl.split("/").length-1];
          // let backUrl=res.item.fileUrl;
          // this.$store.commit("setUrlName1",backUrl);
          // this.$emit("transformFileUrl",res.item.fileUrl)   //传递给父组件
        },

        //获取上传的url
        uploadFile(){
          this.util.getUrlByCode(this.global.code,"fileManage/upload").then(res => {
            console.log("uploadUrl",res);
            this.uploadUrl = res;
          })
        },

        //获取负责人
        getCreator:function () {
          this.util.postAjax({
            code:this.global.code,
            url:"book/getGroup"
          }).then((res)=>{
            console.log(res);
            this.creatorList=res.items;
          })
        }
      },

      created() {
        this.uploadFile();

        this.getCreator();
      },

      computed:{
        totalAmount:function () {
          let sum=0;
          this.tableData.forEach( m => {
            sum += m.TRADINGPRICE * m.QUANTITY
          });

         return sum;
        }
      }


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
