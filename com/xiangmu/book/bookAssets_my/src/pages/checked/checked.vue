<template>
  <div class="check-wrap">
    <ul class="kind-wrap">
      <li @click="chooseType('book')" :class="{active:isActive}">图书登记</li>
      <li @click="chooseType('Journal')" :class="{active:!isActive}">报刊登记</li>
    </ul>

    <div class="line" style="margin:-4px auto 30px"></div>

    <div v-show="isActive"  class="search-wrap">

      <span style="float: right;background: #D8D8D8;padding: 15px 15px 0">
        <!-- <el-input placeholder="请输入负责人姓名" v-model="CREATERNAME" size="small" style="width: 150px;margin-bottom: 15px;border-radius: 0"></el-input>
        <el-input placeholder="请输入负责人工号" v-model="CREATERID" size="small" style="width: 150px"></el-input> -->
        <el-input placeholder="请输入经办人姓名" v-if="power" v-model="OPERATORNAME" size="small" style="width: 150px"></el-input>
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


      <!--<el-button type="primary" size="small" style="float: right;width: 110px" @click="addBook(0)">新增</el-button>-->
    </div>

    <div v-show="!isActive" class="search-wrap">

      <span style="float: right;background: #D8D8D8;padding: 15px 15px 0">
         <!-- <el-input placeholder="请输入负责人姓名" v-model="CREATORNAME" size="small" style="width: 150px;margin-bottom: 15px;border-radius: 0"></el-input>
        <el-input placeholder="请输入负责人工号" v-model="CREATORID" size="small" style="width: 150px"></el-input> -->
        <el-input placeholder="请输入经办人姓名" v-if="power" v-model="OPERATORNAME" size="small" style="width: 150px"></el-input>
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

      <!--<el-button type="primary" size="small" style="float: right;width: 110px" @click="addNewspaper(0)">新增</el-button>-->
    </div>

    <div class="table-wrap">
      <el-table  v-show="isActive" :data="tableData" border style="width: 100%" size="mini" stripe	>
        <!-- <el-table-column prop="CREATERNAME" label="经费负责人(工号)" align="center" width="160" :formatter="(row)=>{return row.CREATERNAME +' ('+ row.CREATERID+')'}"></el-table-column> -->
          <el-table-column prop="FUNDNUMBER" label="经费本号" align="center" width="200" :formatter="(row)=>{return row.FUNDNUMBER || '--'}"></el-table-column>
        <el-table-column prop="OPERATORNAME" label="经办人(工号)" align="center" width="160" :formatter="(row)=>{return row.OPERATORNAME +' ('+ row.OPERATORID+')'}"></el-table-column>
        <el-table-column prop="CREATETIME" label="发起时间" align="center" width="200" :formatter="creatTime"></el-table-column>
        <el-table-column prop="ALLSUM" label="册数" align="center"></el-table-column>
        <el-table-column prop="ALLMONEY" label="金额(人民币)" align="center"></el-table-column>
        <el-table-column prop="ISCHINESE" label="图书类型" align="center" :formatter="isChinese"></el-table-column>
        <el-table-column prop="INVOICENUM" label="发票号" align="center"></el-table-column>
        <!--<el-table-column prop="FUNDNUMBER" label="经费本号" align="center"></el-table-column>-->
        <el-table-column prop="FUNDTYPE" label="经费类型" align="center" ></el-table-column>
        <el-table-column prop="CHECKTIME" label="审核时间" align="center" width="200" :formatter="creatTime" ></el-table-column>
        <el-table-column prop="ISCHECKED" label="状态" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.ISCHECKED == 0" style="color: #F56C6C">审核未通过</span>
            <span v-show="scope.row.ISCHECKED == 1" style="color: #67C23A">审核通过</span>
            <span v-show="scope.row.ISCHECKED == 2" style="color: #E6A23C">待审核</span>
            <!--<el-tag size="small" :type="scope.row.ISCHECKED === '0' ? 'danger' : 'success'">{{scope.row.ISCHECKED=="0" ? "审核不通过":"审核通过"}}</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column prop="CHECKERNAME" label="审核人(工号)" align="center" width="160" :formatter="(row)=>{return row.CHECKERNAME +' ('+ row.CHECKERID+')'}"></el-table-column>
        <el-table-column fixed="right" label="操作" width="205" align="center">
          <template slot-scope="scope">
            <!--<el-button type="text" size="small" @click="addBook(1,scope.row)">编辑</el-button>-->
            <!--<el-button type="text" size="small" @click="checkBook(scope.row)">查看</el-button>-->
            <el-button class="table-btn" type="text" size="mini" @click="checkBook(scope.row)" title="查看详情">
              查看详情
            </el-button>
            <el-button class="table-btn" type="text" size="mini" @click="deleteBook(scope.row,1)" v-show="power" title="删除">
              删除
            </el-button>

            <el-button v-if="scope.row.ISCHECKED == 1" class="table-btn" type="text" size="mini" @click="exportList(scope.row,'book')" title="下载">
              下载
            </el-button>
            <span style="line-height: 13px;" v-if="scope.row.ISCHECKED == 1" class="table-download" title="下载次数" :class="{'table-download-power':power}" @click="checkDownloadRecord(scope.row)">( {{scope.row.downNum}} )</span>
          </template>
        </el-table-column>
      </el-table>

      <el-table  v-show="!isActive" :data="tableData1" border style="width: 100%" size="mini" stripe	>
        <!-- <el-table-column prop="CREATORNAME" label="经费负责人(工号)" align="center" width="160" :formatter="(row)=>{return row.CREATORNAME +' ('+ row.CREATORID+')'}"></el-table-column> -->
          <el-table-column prop="FUNDNUMBER" label="经费本号" align="center" width="200" :formatter="(row)=>{return row.FUNDNUMBER || '--'}"></el-table-column>
        <el-table-column prop="OPERATORNAME" label="经办人(工号)" align="center" width="160" :formatter="(row)=>{return row.OPERATORNAME +' ('+ row.OPERATORID+')'}"></el-table-column>
        <el-table-column prop="CREATETIME" label="发起时间" align="center" :formatter="creatTime" width="150"></el-table-column>
        <el-table-column prop="KINDNUM" label="种数" align="center"></el-table-column>
        <el-table-column prop="ALLMONEY" label="金额(人民币)" align="center"></el-table-column>
        <el-table-column prop="ISCHINESE" label="报刊类型" align="center" :formatter="isChinese"></el-table-column>
        <el-table-column prop="INVOICENUMBER" label="发票号" align="center"></el-table-column>
        <!--<el-table-column prop="FUNDNUMBER" label="经费本号" align="center"></el-table-column>-->
        <el-table-column prop="FUNDTYPE" label="经费类型" align="center" ></el-table-column>
        <el-table-column prop="CHECKTIME" label="审核时间" align="center" :formatter="creatTime" width="150"></el-table-column>
        <!--<el-table-column prop="ISCHECKED" label="状态" align="center" :formatter="status"></el-table-column>-->
        <el-table-column prop="ISCHECKED" label="状态" align="center"  >
          <template slot-scope="scope">
            <span v-show="scope.row.ISCHECKED == 0" style="color: #F56C6C">审核未通过</span>
            <span v-show="scope.row.ISCHECKED == 1" style="color: #67C23A">审核通过</span>
            <span v-show="scope.row.ISCHECKED == 2" style="color: #E6A23C">待审核</span>
            <!--<el-tag size="small" :type="scope.row.ISCHECKED === '0' ? 'danger' : 'success'">{{scope.row.ISCHECKED=="0" ? "审核不通过":"审核通过"}}</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column prop="CHECKERNAME" label="审核人(工号)" align="center" width="160" :formatter="(row)=>{return row.CHECKERNAME +' ('+ row.CHECKERID+')'}"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <!--<el-button type="text" size="small" @click="addNewspaper(1,scope.row)">编辑</el-button>-->
            <el-button class="table-btn" type="text" size="mini" @click="checkBook2(scope.row,1)" title="查看详情">
				查看详情
            </el-button>
            <el-button class="table-btn" type="text" size="mini" @click="deleteBook(scope.row,2)" v-show="power" title="删除">
				删除
			</el-button>

            <el-button v-if="scope.row.ISCHECKED == 1" class="table-btn" type="text" size="mini" @click="exportList(scope.row,'periodical')" title="下载">
              下载
            </el-button>
            <span style="line-height: 13px;" v-if="scope.row.ISCHECKED == 1" class="table-download" title="下载次数" :class="{'table-download-power':power}" @click="checkDownloadRecord(scope.row)">( {{scope.row.downNum}} )</span>
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

   <!-- &lt;!&ndash;新增和编辑图书&ndash;&gt;
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="850px" style="margin-top: 0">
      <check-pop @closeDialog="closeDialog" @getBookInfo="getBookInfo" :currentBook="currentBook" :isAddDialog="isAddDialog"></check-pop>
    </el-dialog>

    &lt;!&ndash;新增和编辑报刊&ndash;&gt;
    <el-dialog :title="dialogTitle2" :visible.sync="dialogFormVisible2" v-if="dialogFormVisible2" width="850px" style="margin-top: 0">
      <add-pop-news @closeDialog="closeDialog" :currentBook2="currentBook2" @getJournalInfo="getJournalInfo" :isAddDialog="isAddDialog2"></add-pop-news>
    </el-dialog>-->

    <!--审核图书-->
    <el-dialog class="check-pop" :title="popTitle" :visible.sync="dialogToCheck" v-if="dialogToCheck" width="1030px" style="margin-top: 0" :close-on-click-modal="false">
      <to-check-pop :toCheckInfo="toCheckInfo" :currentId="currentId" @closeDialog="closeDialog" @getBookInfo="getBookInfo" :isChecked="isChecked" :innerHeight="innerHeight" :isCheckPop="isCheckPop"></to-check-pop>
    </el-dialog>

    <!--审核报刊-->
    <el-dialog class="check-pop" :title="popTitle" :visible.sync="dialogToCheck2" v-if="dialogToCheck2" width="850px" style="margin-top: 0" :close-on-click-modal="false">
      <check-pop-news :toCheckInfo="toCheckInfo2" :currentId="currentId" @closeDialog="closeDialog" @getJournalInfo="getJournalInfo" :isChecked="isChecked" :innerHeight="innerHeight" :isCheckPop="isCheckPop"></check-pop-news>
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

    <!--查看下载记录弹框-->
    <el-dialog class="check-pop" title="下载详情（发票号）" :visible.sync="recordVisible" v-if="recordVisible" width="1000px" style="margin-top: 0" :close-on-click-modal="false">
      <download-list ref="recordDialog" :rowId="rowId"></download-list>
      <div slot="footer" style="margin-top: -30px">
        <el-button @click="recordVisible = false" size="small" style="width: 100px">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // import checkPop from "./checkPop2"
  // import addPopNews from "./addPopNews"
  import toCheckPop from "../checkPops/checkPopBook"
  import checkPopNews from "../checkPops/checkPopNews"
  import downloadList from "./downloadList";
  export default {
    name: "check",
    components:{
      toCheckPop,checkPopNews,downloadList
    },
    data:function () {
      return {
        isActive:true,  //是否选中
        innerHeight:window.innerHeight,

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

        dialogFormVisible: false, //弹框开关
        dialogFormVisible2: false, //弹框开关
        dialogToCheck:false,  //审核弹框开关
        dialogToCheck2:false,  //审核弹框开关
        popTitle:"", //审核弹框标题
        popTitle2:"", //审核弹框标题
        toCheckInfo:{},  //审核的单条内容
        toCheckInfo2:{},
        currentBook:{},   //编辑的单条内容
        currentBook2:{},   //编辑的单条内容
        isAddDialog:true,  //编辑或新增区分
        isAddDialog2:true,  //编辑或新增区分
        dialogTitle:"",
        dialogTitle2:"",
        currentId:"",  //当前id
        isChecked:false,  //是否已经审核过
        isCheckPop:false,
        power:JSON.parse(sessionStorage.getItem("power")), //判断是否为管理员

        outerVisible:false,
        innerVisible:false,
        deleteRow:{},
        deleteType:"",
        downloadUrl:this.util.global.url['book2'],  //下载路径
        recordVisible:false,  //下载记录弹框是否可见
        rowId:""
      }
    },
    methods: {
      chooseType(type){
        this.currentPage=1;
        switch (type) {
          case "book":
            this.getBookInfo(1,this.pageSize);
            break;
          case "Journal" :
            this.getJournalInfo(1,this.pageSize);
            break;
        }
      },


      //下载记录
      checkDownloadRecord(row){
        if(this.power){
          console.log(row.ID);
          this.rowId=row.ID;
          this.recordVisible = true
        }

      },


      //导出报销单
      exportList(row,type){
        switch (type) {
          case "book":
            window.open(this.downloadUrl+"/book/getPdf?ID="+row.ID+"&TYPE=book");
            this.getBookInfo(this.currentPage,this.pageSize);
            break;
          case "periodical":
            window.open(this.downloadUrl+"/book/getPdf?ID="+row.ID+"&TYPE=periodical");
            this.getJournalInfo(this.currentPage,this.pageSize);
            break;
        }

      },

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

      /*deleteBook:function(row,type){
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
          }else if(type == 2){
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

      //
      handleClick(row) {
        console.log(row);
      },

      //打开审核弹框
      checkBook:function(row){
        // console.log("row",row);
        this.currentId=row.ID;
        this.getCheckInfo(row.ID);
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
      checkBook2:function(row){
        // console.log("row",row);
        this.currentId=row.ID;
        this.getCheckInfo2(row.ID);

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
          this.toCheckInfo2=res;
          this.dialogToCheck2 = true;
        })
      },


      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.currentPage=1;

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

      //获取已审核的图书
      getBookInfo:function (page,limit) {

        // this.currentPage = 1;
        if(sessionStorage.getItem("power") == "false"){
          console.log("非管理员");
          console.log("id",sessionStorage.getItem("id"));
          this.OPERATORID=sessionStorage.getItem("id");
          console.log("id",this.OPERATORID);
        }
        this.isActive=true;
        this.util.postAjax({
          code:this.global.code,
          url:"book/checkList",
          data:{
            page: page,
            limit:limit ,
            filter:JSON.stringify({
              "ISCHECKED": sessionStorage.getItem("checkedPower") || '1',
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

         /* this.tableData.forEach(v => {
            if(v.ISCHECKED =="0"){
              v.ISCHECKED = "不通过"
            }else if(v.ISCHECKED =="1"){
              v.ISCHECKED = "通过"
            }
          });*/
          console.log(res);
        })
      },

      //获取已审核的报刊
      getJournalInfo:function(page,limit){
        this.isActive=false;

        // this.currentPage = 1;

        if(sessionStorage.getItem("power") == "false"){
          console.log("非管理员");
          console.log("id",sessionStorage.getItem("id"));
          this.OPERATORID=sessionStorage.getItem("id");
          console.log("id",this.OPERATORID);
        }

        console.log("isActive",this.isActive);
        this.util.postAjax({
          code:this.global.code,
          url:"Periodical/list",
          data:{
            page: page,
            limit:limit ,
            filter:JSON.stringify({
              "ISCHECKED": sessionStorage.getItem("checkedPower") || '1',
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
      this.getBookInfo(1,this.pageSize);

      // this.power=sessionStorage.getItem("power");

      console.log("0000",this.power);
    }
  }
</script>

<style scoped>

</style>
