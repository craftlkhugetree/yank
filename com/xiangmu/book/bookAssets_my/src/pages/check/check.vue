<template>
    <div class="check-wrap">
      <ul class="kind-wrap">
        <li @click="getBookInfo(1,pageSize)" :class="{active:isActive}">图书登记 <span v-show="booktotal > 0 && power" class="circle-remark"></span></li>
        <li @click="getJournalInfo(1,pageSize)" :class="{active:!isActive}">报刊登记<span v-show="journaltotal > 0 && power" class="circle-remark"></span></li>
      </ul>

      <div class="line" style="margin:-4px auto 30px"></div>

      <div v-show="isActive"  class="search-wrap">
        <el-button type="primary" size="small" style="width: 110px;margin-bottom: 15px;margin-top: 15px" @click="addBook(0)">新增图书登记</el-button>

        <span style="float: right;background: #D8D8D8;padding: 15px 15px 0">
          <!-- <el-input placeholder="请输入负责人姓名" v-model="CREATERNAME" size="small" style="width: 150px;margin-bottom: 15px;border-radius: 0"></el-input>
          <el-input placeholder="请输入负责人工号" v-model="CREATERID" size="small" style="width: 150px"></el-input> -->
          <el-input placeholder="请输入经办人姓名" v-if="power" v-model="OPERATORNAME" size="small" style="width: 150px;margin-bottom: 15px;"></el-input>
          <el-input placeholder="请输入经办人工号" v-if="power" v-model="OPERATORID" size="small" style="width: 150px"></el-input>
          <el-input placeholder="请输入发票号" v-model="INVOICENUM" size="small" style="width: 150px"></el-input>
          <!--<el-input placeholder="请输入经费本编号" v-model="FUNDNUMBER" size="small" style="width: 150px"></el-input>-->
          <el-select v-model="ISCHINESE" placeholder="境内出版/境外出版" size="small" style="width: 160px">
            <el-option :key="1" label="境内出版" :value="1"></el-option>
            <el-option :key="0" label="境外出版" :value="0"></el-option>
          </el-select>
          <el-select v-model="FUNDTYPE" placeholder="经费类型" size="small" style="width: 120px">
            <el-option  label="科研" value="科研"></el-option>
            <el-option  label="其他" value="其他"></el-option>
          </el-select>
          <el-button type="primary" size="small" style="width: 79px;margin-bottom: 15px" @click="getBookInfo(1,pageSize)">查询</el-button>
          <el-button type="primary" size="small" style="width: 79px;margin-bottom: 15px" @click="clearInput">清空</el-button>
        </span>
      </div>

      <div v-show="!isActive" class="search-wrap">
        <el-button type="primary" size="small" style="width: 110px;margin-bottom: 15px;margin-top: 15px" @click="addNewspaper(0)">新增报刊登记</el-button>

        <span style="float: right;background: #D8D8D8;padding: 15px 15px 0">
          <!-- <el-input placeholder="请输入负责人姓名" v-model="CREATORNAME" size="small" style="width: 150px;margin-bottom: 15px;border-radius: 0"></el-input>
          <el-input placeholder="请输入负责人工号" v-model="CREATORID" size="small" style="width: 150px"></el-input> -->
          <el-input placeholder="请输入经办人姓名" v-if="power" v-model="OPERATORNAME" size="small" style="width: 150px;margin-bottom: 15px;"></el-input>
          <el-input placeholder="请输入经办人工号" v-if="power" v-model="OPERATORID" size="small" style="width: 150px"></el-input>
          <el-input placeholder="请输入发票号" v-model="INVOICENUMBER" size="small" style="width: 150px"></el-input>
          <!--<el-input placeholder="请输入经费本编号" v-model="FUNDNUMBER" size="small" style="width: 150px"></el-input>-->
          <el-select v-model="ISCHINESE" placeholder="境内出版/境外出版" size="small" style="width: 160px">
            <el-option :key="1" label="境内出版" :value="1"></el-option>
            <el-option :key="0" label="境外出版" :value="0"></el-option>
          </el-select>
          <el-select v-model="FUNDTYPE" placeholder="经费类型" size="small" style="width: 120px">
            <el-option  label="科研" value="科研"></el-option>
            <el-option  label="其他" value="其他"></el-option>
          </el-select>
          <el-button type="primary" size="small" style="width: 79px;margin-bottom: 15px" @click="getJournalInfo(1,pageSize)">查询</el-button>
          <el-button type="primary" size="small" style="width: 79px;margin-bottom: 15px" @click="clearInput">清空</el-button>
        </span>
      </div>

      <div class="table-wrap">
        <el-table  v-show="isActive" :data="tableData" border style="width: 100%" size="mini" stripe	>
          <!-- <el-table-column prop="CREATERNAME" label="经费负责人(工号)" align="center" width="200" :formatter="(row)=>{return row.CREATERNAME +' ('+ row.CREATERID+')'}"></el-table-column> -->
          <el-table-column prop="FUNDNUMBER" label="经费本号" align="center" width="200" :formatter="(row)=>{return row.FUNDNUMBER || '--'}"></el-table-column>
          <el-table-column prop="OPERATORNAME" label="经办人(工号)" align="center" width="200" :formatter="(row)=>{return row.OPERATORNAME +' ('+ row.OPERATORID+')'}"></el-table-column>
          <el-table-column prop="CREATETIME" label="发起时间" align="center" :formatter="creatTime"></el-table-column>
          <el-table-column prop="ALLSUM" label="册数" align="center"></el-table-column>
          <el-table-column prop="ALLMONEY" label="金额(人民币)" align="center"></el-table-column>
          <el-table-column prop="ISCHINESE" label="图书类型" align="center" :formatter="isChinese"></el-table-column>
          <el-table-column prop="INVOICENUM" label="发票号" align="center"></el-table-column>
          <!--<el-table-column prop="FUNDNUMBER" label="经费本号" align="center"></el-table-column>-->
          <el-table-column prop="FUNDTYPE" label="经费类型" align="center" ></el-table-column>
          <el-table-column prop="ISCHECKED" label="状态" align="center">
            <template slot-scope="scope">
              <div v-show="scope.row.ISCHECKED == 0" style="color: #F56C6C">审核未通过</div>
              <div v-show="scope.row.ISCHECKED == 1" style="color: #67C23A">审核通过</div>
              <div v-show="scope.row.ISCHECKED == 2" style="color: #E6A23C">待审核</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <!--<el-button class="table-btn" type="text" size="mini" @click="addBook(1,scope.row)" v-show= "(scope.row.ISCHECKED == '0' && !power) || power" title="编辑">
                <img class="table-btn-img"  src="../../../static/images/edit-icon.png" alt="">
              </el-button>-->
              <el-button class="table-btn" type="text" size="mini" @click="addBook(1,scope.row)" title="编辑">
                编辑
				<!-- <img class="table-btn-img"  src="../../../static/images/edit-icon.png" alt=""> -->
              </el-button>
              <el-button class="table-btn" type="text" size="mini" @click="checkBook(scope.row,1)" v-show="power" title="审核">
                审核
				<!-- <img class="table-btn-img" src="../../../static/images/check-icon.png" alt=""> -->
              </el-button>
              <el-button class="table-btn" type="text" size="mini" @click="checkBook(scope.row,2)" v-show="!power" title="查看详情">
                查看详情
				<!-- <img class="table-btn-img" src="../../../static/images/detail-icon.png" alt=""> -->
              </el-button>
              <el-button class="table-btn" type="text" size="mini" @click="deleteBook(scope.row,1)" v-show="power" title="删除">
                删除
				<!-- <img class="table-btn-img" src="../../../static/images/delete-icon.png" alt=""> -->
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table  v-show="!isActive" :data="tableData1" border style="width: 100%" size="mini" stripe	>
          <!-- <el-table-column prop="CREATORNAME" label="经费负责人(工号)" align="center" width="200" :formatter="(row)=>{return row.CREATORNAME +' ('+ row.CREATORID+')'}"></el-table-column> -->
          <el-table-column prop="FUNDNUMBER" label="经费本号" align="center" width="200" :formatter="(row)=>{return row.FUNDNUMBER || '--'}"></el-table-column>
          <el-table-column prop="OPERATORNAME" label="经办人(工号)" align="center" width="200" :formatter="(row)=>{return row.OPERATORNAME +' ('+ row.OPERATORID+')'}"></el-table-column>
          <el-table-column prop="CREATETIME" label="发起时间" align="center" :formatter="creatTime"></el-table-column>
          <el-table-column prop="KINDNUM" label="种数" align="center"></el-table-column>
          <el-table-column prop="ALLMONEY" label="金额(人民币)" align="center"></el-table-column>
          <el-table-column prop="ISCHINESE" label="报刊类型" align="center" :formatter="isChinese"></el-table-column>
          <el-table-column prop="INVOICENUMBER" label="发票号" align="center"></el-table-column>
          <!--<el-table-column prop="FUNDNUMBER" label="经费本号" align="center"></el-table-column>-->
          <el-table-column prop="FUNDTYPE" label="经费类型" align="center" ></el-table-column>
          <el-table-column prop="ISCHECKED" label="状态" align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.ISCHECKED == 0" style="color: #F56C6C">审核未通过</span>
              <span v-show="scope.row.ISCHECKED == 1" style="color: #67C23A">审核通过</span>
              <span v-show="scope.row.ISCHECKED == 2" style="color: #E6A23C">待审核</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button class="table-btn" type="text" size="mini" @click="addNewspaper(1,scope.row)" title="编辑">
                编辑
              </el-button>
              <el-button class="table-btn" type="text" size="mini" @click="checkBook2(scope.row,1)" v-show="power" title="审核">
				审核
              </el-button>
              <el-button class="table-btn" type="text" size="mini" @click="checkBook2(scope.row,2)" v-show="!power" title="查看详情">
                查看详情
              </el-button>
              <el-button class="table-btn" type="text" size="mini" @click="deleteBook(scope.row,2)" v-show="power" title="删除">
                删除
              </el-button>
              <!--<el-button class="table-btn" type="text" size="mini" @click="deleteBook(scope.row,2)" v-show="scope.row.ISCHECKED == '0' && !power" title="删除">
                <img class="table-btn-img" src="../../../static/images/delete-icon.png" alt="">
              </el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <div style="margin: 20px 0 40px">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
            :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" small
            layout=" prev, pager, next, jumper, total,sizes" :total="totalSize">
          </el-pagination>
        </div>
      </div>

      <!--新增和编辑图书-->
      <el-dialog  :title="dialogTitle" :visible.sync="dialogFormVisible"  v-if="dialogFormVisible" width="850px" style="margin-top: 0;" class="el-dialog-self" :close-on-click-modal="false">
        <check-pop @closeDialog="closeDialog" @getBookInfo="getBookInfo" :currentBook="currentBook" :isAddDialog="isAddDialog" :pageSize="pageSize" :innerHeight="innerHeight"></check-pop>
      </el-dialog>

      <!--新增和编辑报刊-->
      <el-dialog :title="dialogTitle2" :visible.sync="dialogFormVisible2" v-if="dialogFormVisible2" width="850px" style="margin-top: 0" class="el-dialog-self" :close-on-click-modal="false">
        <add-pop-news @closeDialog="closeDialog" :currentBook="currentBook2" @getJournalInfo="getJournalInfo" :isAddDialog="isAddDialog2" :pageSize="pageSize" :innerHeight="innerHeight"></add-pop-news>
      </el-dialog>

      <!--审核图书-->
      <el-dialog class="check-pop" :title="popTitle" :visible.sync="dialogToCheck" v-if="dialogToCheck" width="1030px" style="margin-top: 0" :close-on-click-modal="false">
        <to-check-pop :toCheckInfo="toCheckInfo" :currentId="currentId" @closeDialog="closeDialog"
                      @getBookInfo="getBookInfo" :isChecked="isChecked" :pageSize="pageSize" :innerHeight="innerHeight" :isCheckPop="isCheckPop"></to-check-pop>
      </el-dialog>

      <!--审核报刊-->
      <el-dialog class="check-pop" :title="popTitle" :visible.sync="dialogToCheck2" v-if="dialogToCheck2" width="850px" style="margin-top: 0" :close-on-click-modal="false">
        <check-pop-news :toCheckInfo="toCheckInfo" :currentId="currentId" @closeDialog="closeDialog"
                        @getJournalInfo="getJournalInfo" :isChecked="isChecked" :pageSize="pageSize" :innerHeight="innerHeight" :isCheckPop="isCheckPop"></check-pop-news>
      </el-dialog>

      <!--二次确认弹框-->
      <el-dialog width="25%" title="提示" :visible.sync="outerVisible" >
        <el-dialog width="25%" title="提示" :visible.sync="innerVisible" append-to-body>
          <span>确定删除吗？</span>
          <div slot="footer" class="dialog-footer">
            <el-button @click="outerVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRecord" >确定</el-button>
          </div>
        </el-dialog>
        <span>此操作将永久删除该记录, 是否继续?</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
          <el-button type="primary" @click="innerVisible = true">确定</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    import checkPop from "./addPopBook"
    import addPopNews from "./addPopNews"
    import toCheckPop from "../checkPops/checkPopBook"
    import checkPopNews from "../checkPops/checkPopNews"

    import html2canvas from "html2canvas"
    import jsPDF from "jspdf"
    export default {
      name: "check",
      components:{
        checkPop,toCheckPop,addPopNews,checkPopNews
      },
      data:function () {
        return {
          htmlTitle: "PDF44名称",
          nowTime: "",

          isActive:true,  //是否选中
          tableData: [], //图书表格数据
          tableData1: [], //报刊表格数据
          // FUNDNUMBER: "",//（经费本号）
          FUNDTYPE: "",//（经费类型  科研/其他）
          CREATERID: "",//（负责人ID）
          CREATERNAME: "",//（负责人姓名，模糊查询）
          OPERATORID: "",//（经办人ID）
          OPERATORNAME: "",//（经办人姓名，模糊查询）
          INVOICENUM: "",//（发票号）
          ISCHINESE: "",//（1境内0境外）

          CREATORNAME:"", //（负责人姓名，模糊查询）
          CREATORID:"",
          INVOICENUMBER:"",

          currentPage: 1,  //当前分页
          pageSizes:[5,10,20, 30, 40],  //设置每页显示多少条
          pageSize:10,  //每页限制
          totalSize:0  ,  //总条数
          booktotal:0,  //图书总条数
          journaltotal:0,  //报刊总条数

          dialogFormVisible: false, //弹框开关
          dialogFormVisible2: false, //弹框开关
          dialogToCheck:false,  //审核弹框开关
          dialogToCheck2:false,  //审核弹框开关
          popTitle:"", //审核弹框标题
          popTitle2:"", //审核弹框标题
          toCheckInfo:{},  //审核的单条内容
          currentBook:{},   //编辑的单条内容
          currentBook2:{},   //编辑的单条内容
          isAddDialog:true,  //编辑或新增区分
          isAddDialog2:true,  //编辑或新增区分
          dialogTitle:"",
          dialogTitle2:"",
          currentId:"",  //当前id
          isChecked:true,  //是否已经审核过
          power:JSON.parse(sessionStorage.getItem("power")), //判断是否为管理员
          innerHeight:window.innerHeight,

          isCheckPop:false,
          isCheckPop2:false,

          outerVisible:false,
          innerVisible:false,
          deleteRow:{},
          deleteType:"",
        }
      },
      methods: {
        toPDF(){

          var target = document.getElementById("pdfCentent");
          target.style.background = "yellow";

          html2canvas(target, {
            onrendered:function(canvas) {
              var contentWidth = canvas.width;
              var contentHeight = canvas.height;

              //一页pdf显示html页面生成的canvas高度;
              var pageHeight = contentWidth / 592.28 * 841.89;
              //未生成pdf的html页面高度
              var leftHeight = contentHeight;
              //页面偏移
              var position = 0;
              //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
              var imgWidth = 595.28;
              var imgHeight = 592.28/contentWidth * contentHeight;

              var pageData = canvas.toDataURL('image/jpeg', 1.0);

              var pdf = new jsPDF('', 'pt', 'a4');

              //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
              //当内容未超过pdf一页显示的范围，无需分页
              if (leftHeight < pageHeight) {
                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
              } else {
                while(leftHeight > 0) {
                  pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                  leftHeight -= pageHeight;
                  position -= 841.89;
                  //避免添加空白页
                  if(leftHeight > 0) {
                    pdf.addPage();
                  }
                }
              }

              pdf.save("content.pdf");
            }
          })
        },

        //日期转时间
        creatTime:function(row,column,cellValue){
          let year=cellValue.slice(0,4);
          let month=cellValue.slice(4,6);
          let date=cellValue.slice(6,8);
          let hour=cellValue.slice(8,10);
          let second=cellValue.slice(10,12);
          let miao=cellValue.slice(12,14);
          return year+"-"+month+"-"+date+" "+hour+":"+second+":"+miao
        },

        /*creatName:function(row,column,cellValue){
          // console.log(row);
          return row.CREATERNAME +"("+ row.CREATERID+")"
        },*/

        //删除记录(都能删除，正在使用)
        deleteRecord:function(){

          // console.log(this.deleteRow);
          // return false;
          if(this.deleteType == 1){
            this.util.postAjax({
              code:this.global.code,
              url:"book/delete",
              data:{
                IDs:JSON.stringify([this.deleteRow.ID])
              }
            }).then( (res)=>{
              this.outerVisible=false;
              this.innerVisible=false;
              this.getBookInfo(1,this.pageSize)
              // console.log("res1",res);
            })
          } else if(this.deleteType == 2){
            this.util.postAjax({
              code:this.global.code,
              url:"Periodical/delete",
              data:{
                IDs:JSON.stringify([this.deleteRow.ID])
              }
            }).then( (res)=>{
              // console.log("res2",res);
              this.outerVisible=false;
              this.innerVisible=false;
              this.getJournalInfo(1,this.pageSize)
            })
          }

          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        },

        deleteBook:function(row,type){
          this.outerVisible=true;
          this.deleteRow=row;
          this.deleteType=type;
        },

        /* deleteBook:function(row,type){
          /!*let rowIdArr=[];
          rowIdArr.push(re)*!/

          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            if(type == 1){
              this.util.postAjax({
                code:this.global.code,
                url:"book/delete",
                data:{
                  IDs:JSON.stringify([row.ID])
                }
              }).then( (res)=>{
                this.getBookInfo(1,this.pageSize)
                // console.log("res1",res);
              })
            }
            else if(type == 2){
              this.util.postAjax({
                code:this.global.code,
                url:"Periodical/delete",
                data:{
                  IDs:JSON.stringify([row.ID])
                }
              }).then( (res)=>{
                // console.log("res2",res);
                this.getJournalInfo(1,this.pageSize)
              })
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        },*/

        //删除记录(只能删除审核未通过的，暂时废弃)
        /*deleteBook:function(row,type){

          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            if(type == 1){
              this.util.postAjax({
                code:this.global.code,
                url:"book/deleteRecords",
                data:{
                  data:JSON.stringify([row.ID])
                }
              }).then( (res)=>{
                this.getBookInfo(1,this.pageSize)
                // console.log("res1",res);
              })
            }else if(type == 2){
              this.util.postAjax({
                code:this.global.code,
                url:"Periodical/deleteRecords",
                data:{
                  data:JSON.stringify([row.ID])
                }
              }).then( (res)=>{
                // console.log("res2",res);
                this.getJournalInfo(1,this.pageSize)
              })
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        },*/



        //类型转化
        isChinese:function(row,column,cellValue){
          if(cellValue == 1){
            return "境内出版"
          }else if(cellValue == 0){
            return "境外出版"
          }
        },

        status:function(row,column,cellValue){
          // console.log("cellValue",typeof (cellValue));
          switch (cellValue) {
            case "0":
              return "不通过";
              break;
            case "1":
              return "通过";
              break;
            case "2":
              return "待审核";
              break
          }
        },

        //新增和编辑图书
        addBook(type,row){
          if(type == 1){
            this.dialogTitle="编辑图书登记";
            this.isAddDialog=false;
            this.util.postAjax({
              code:this.global.code,
              url:"book/getOne",
              data:{
                ID:row.ID
              }
            }).then(res => {
              this.currentBook=res;
              this.dialogFormVisible = true;
              console.log(this.$refs.hll);
            })
          }else if(type == 0){
            this.dialogTitle="新增图书登记";
            this.isAddDialog=true;
            this.currentBook=null;
            console.log("currentBook",this.currentBook);
            this.dialogFormVisible = true;
            // console.log("hll",document.getElementById("hll").style);
          }

        },

        //新增和编辑报刊
        addNewspaper:function(type,row){
          console.log("报刊");
          if(type == 1){
            this.dialogTitle2="编辑报刊登记";
            this.isAddDialog2=false;
            this.util.postAjax({
              code:this.global.code,
              url:"Periodical/view",
              data:{
                ID:row.ID
              }
            }).then(res => {
              this.currentBook2=res;
              this.dialogFormVisible2 = true;
            })
          }else if(type == 0){
            this.dialogTitle2="新增报刊登记";
            this.isAddDialog2=true;
            this.currentBook2=null;
            this.dialogFormVisible2= true
          }

        },

       //

        handleClick(row) {
          console.log(row);
        },

        //打开审核弹框
        checkBook:function(row,type){
          // console.log("row",row);
          this.currentId=row.ID;
          this.getCheckInfo(row.ID);

          if(type == 1){
            this.isCheckPop=true;
          }else if(type == 2){
            this.isCheckPop=false;
          }

          console.log(row.ISCHINESE == "1");
          if(row.ISCHINESE == "1"){
            this.popTitle = "境内出版物";
            this.popTitle2 = "境内出版物"
          }else if(row.ISCHINESE == "0") {
            this.popTitle = "境外出版物";
            this.popTitle2 = "境外出版物";
          }
        },

        //获取单条图书信息
        getCheckInfo:function (id) {
          this.util.postAjax({
            code:this.global.code,
            url:"book/getOne",
            data:{
              ID:id
            }
          }).then(res => {
            this.toCheckInfo=res;
            this.dialogToCheck = true;
          })
        },

        //打开审核弹框报刊
        checkBook2:function(row,type){
          // console.log("row",row);
          this.currentId=row.ID;
          this.getCheckInfo2(row.ID);

          if(type == 1){
            this.isCheckPop=true;
          }else if(type == 2){
            this.isCheckPop=false;
          }

          console.log(row.ISCHINESE == "1");
          if(row.ISCHINESE == "1"){
            this.popTitle = "境内出版物";
            this.popTitle2 = "境内出版物"
          }else if(row.ISCHINESE == "0") {
            this.popTitle = "境外出版物";
            this.popTitle2 = "境外出版物";
          }
        },

        //获取单条报刊信息
        getCheckInfo2:function (id) {
          this.util.postAjax({
            code:this.global.code,
            url:"Periodical/view",
            data:{
              ID:id
            }
          }).then(res => {
            this.toCheckInfo=res;
            this.dialogToCheck2 = true;
          })
        },


        //分页
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.pageSize = val;

          if(this.isActive ==true){
            this.getBookInfo(1,this.pageSize)
          }else {
            this.getJournalInfo(1,this.pageSize)
          }
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.currentPage = val;

          if(this.isActive ==true){
            this.getBookInfo(this.currentPage,this.pageSize)
          }else {
            this.getJournalInfo(this.currentPage,this.pageSize)
          }
          // this.getBookInfo(this.currentPage,this.pageSize)
        },

        //获取待审核的图书
        getBookInfo:function (page,limit) {
          console.log("userRight",sessionStorage.getItem("checkPower"));
          console.log("power22",typeof (this.power));
          console.log("power2",this.power);
          this.currentPage = 1;

          console.log(this.currentPage);
          if(sessionStorage.getItem("power") == "false"){
            this.OPERATORID=sessionStorage.getItem("id")
          }
            this.isActive=true;
            // this.clearInput();
            this.util.postAjax({
              code:this.global.code,
              url:"book/checkList",
              data:{
                page: page,
                limit:limit ,
                filter:JSON.stringify({
                  "ISCHECKED": sessionStorage.getItem("checkPower") || '0,2',
                  // "FUNDNUMBER": this.FUNDNUMBER,//（经费本号）
                  "FUNDTYPE": this.FUNDTYPE,//（经费类型  科研/其他）
                  "CREATERID": this.CREATERID,//（负责人ID）
                  "CREATERNAME": this.CREATERNAME,//（负责人姓名，模糊查询）
                  "OPERATORID": this.OPERATORID,//（经办人ID）
                  "OPERATORNAME": this.OPERATORNAME,//（经办人姓名，模糊查询）
                  "INVOICENUM": this.INVOICENUM,//（发票号）
                  "ISCHINESE": this.ISCHINESE//（1境内0境外）
                })
              }
            }).then((res)=>{
              this.tableData=res.items;
              this.totalSize=res.total;
              this.booktotal=res.total;
              console.log(res);
            })
          // })




        },

        //获取待审核的报刊
        getJournalInfo:function(page,limit){
          console.log("power3",this.power);

          console.log(typeof (sessionStorage.getItem("power")));
          this.isActive=false;
          this.currentPage = 0;
          console.log(this.currentPage);

          if(sessionStorage.getItem("power") == "false"){
            console.log("非管理员");
            console.log("id",sessionStorage.getItem("id"));
            this.OPERATORID=sessionStorage.getItem("id");
            console.log("id",this.OPERATORID);
          }

          this.util.postAjax({
            code:this.global.code,
            url:"Periodical/list",
            data:{
              page: page,
              limit:limit ,
              filter:JSON.stringify({
                "ISCHECKED": sessionStorage.getItem("checkPower") || (0,2),
                // "FUNDNUMBER": this.FUNDNUMBER,//（经费本号）
                "FUNDTYPE": this.FUNDTYPE,//（经费类型  科研/其他）
                "CREATORID": this.CREATORID,//（负责人ID）
                "CREATORNAME": this.CREATORNAME,//（负责人姓名，模糊查询）
                "OPERATORID": this.OPERATORID,//（经办人ID）
                "OPERATORNAME": this.OPERATORNAME,//（经办人姓名，模糊查询）
                "INVOICENUMBER": this.INVOICENUMBER,//（发票号）
                "ISCHINESE": this.ISCHINESE//（1境内0境外）
              })
            }
          }).then((res)=>{
            this.tableData1=res.items;
            this.totalSize=res.total;
            this.journaltotal=res.total;

            console.log(res);
          })

        },

        //清空查询
        clearInput:function () {
          // this.FUNDNUMBER= "";
          this.FUNDTYPE="";
          this.OPERATORID="";
          this.OPERATORNAME="";
          this.ISCHINESE="";
          if(this.isActive == true){
            this.CREATERNAME="";
            this.CREATERID="";
            this.INVOICENUM="";
            this.getBookInfo(1,this.pageSize);
          }else {
            this.CREATORNAME="";
            this.CREATORID="";
            this.INVOICENUMBER="";
            this.getJournalInfo(1,this.pageSize)
          }

        },

        //关闭新增和编辑弹框
        closeDialog:function () {
          this.dialogFormVisible = false;
          this.dialogFormVisible2 = false;
          this.dialogToCheck = false;
          this.dialogToCheck2 = false
        }

      },

      created() {
        this.power=sessionStorage.getItem('power');
        console.log("this.power",this.power);
        if(this.power == "true"){
          this.power = true
        }else if(this.power == "false"){
          this.power = false
        }
        // console.log("power",typeof (this.power));
        this.getJournalInfo(1,10);
        this.getBookInfo(1,10);


        // console.log("01100",this.power);
      },

      mounted() {
        this.innerHeight=window.innerHeight;
        console.log("innerHeight",this.innerHeight);
      }

    }
</script>

<style scoped>

</style>
