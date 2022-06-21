<template>
    <div class="info-detail">
      <!--面包屑-->
      <bread-crumb :breadList="breadList"></bread-crumb>

      <div class="back-box">
        <div class="table-btn white" @click="back">返回</div>
        <div v-if="prevPage == 'resource-type-management'" style="float: right">
          <div class="table-btn orange" @click="addApply('edit',id)">编辑</div>
          <div v-show="resTypeForm.resstatus =='1' && (resTypeForm.usestatus== '1' || resTypeForm.usestatus== '4')" class="table-btn purple" @click="changeStatus('2','single',id)">关闭</div>
          <div  v-show="resTypeForm.resstatus =='2' && (resTypeForm.usestatus== '1' || resTypeForm.usestatus== '4') " class="table-btn purple" @click="changeStatus('1','single',id)">开启</div>
          <div v-show="resTypeForm.usestatus== '1'" class="table-btn pink" @click="deleteRes('single',id)">删除</div>
        </div>
      </div>

      <div class="info-content">
        <el-row :gutter="15">
          <el-col :span="15">
            <div class="res-info">
                <div class="item" style="margin:0 30px 0 0">
                  <label>编号:</label>
                  <span>{{resTypeForm.rescode}}</span>
                </div>

                <div class="item">
                  <img src="../../../static/images/bm-info-area.png" alt="">
                  <label>面积</label>
                  <span>{{resTypeForm.area}}㎡</span>
                </div>

                <el-divider direction="vertical"></el-divider>

                <div class="item">
                  <img src="../../../static/images/bm-info-price.png" alt="">
                  <label>单价</label>
                  <span>{{common.moneyFormatter("","",resTypeForm.price)}}元/{{typeDetail.chargecycle ? typeDetail.chargecycle : "--"}}/{{typeDetail.chargetype ? typeDetail.chargetype : "--"}}</span>
                </div>

                <el-divider direction="vertical"></el-divider>

                <div class="item">
                  <img src="../../../static/images/bm-info-base.png" alt="">
                  <label>设施</label>
                   <el-tooltip class="item" effect="dark" :content="resTypeForm.baseListText" placement="top-start">
                      <!-- <span v-for="(item,index) in resTypeForm.baseList">
                        <span>{{item.name}}</span>
                        <span v-if="resTypeForm.baseList && resTypeForm.baseList.length > 3">...</span>
                      </span> -->

                      <div style="width:30%;vertical-align:top" class="ellipsis">{{resTypeForm.baseListText}}</div>
                  </el-tooltip>
                   <!-- <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                    <el-button>上左</el-button>
                  </el-tooltip> -->
                </div>
            </div>
            <div class="left-right list-shadow" style="padding: 20px">
              <div style="font-weight: bold;font-size:16px;margin-bottom: 10px">水电信息</div>
              <!--tab切换-->
              <div class="my-tab-wrap">
                <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="水表" name="1"></el-tab-pane>
                  <el-tab-pane label="电表" name="2"></el-tab-pane>
                </el-tabs>

                <div v-if="prevPage == 'resource-type-management'" class="my-button green" style="float: right;margin-top: 3px;" @click="operateApply('add',null)">
                  <i class="el-icon-plus"></i>
                  <span>新建记录</span>
                </div>
              </div>

              <el-divider></el-divider>

              <!--表格-->
              <el-table class="my-table" :data="applyList" style="width: 100%" stripe v-loading="loading">
                <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
                <el-table-column prop="createtime" label="记录时间" align="center" :formatter="timeFormatter" width="150"></el-table-column>
                <el-table-column prop="showv" :label="activeName == 1 ? '数值(吨)' : '数值(度)'" align="center"></el-table-column>
                <!-- <el-table-column v-if="typeDetail.chargecycle" prop="price" :label="'单价（元/'+typeDetail.chargecycle+'/'+typeDetail.chargetype+'）'" align="center" :formatter="common.moneyFormatter"></el-table-column>
                <el-table-column v-else prop="price" :label="'单价（元/'+'--'+'/'+'--'+'）'" align="center" :formatter="common.moneyFormatter" width="150"></el-table-column> -->

                <el-table-column prop="price" :label="activeName == 1 ? '单价(元/吨)' :'单价(元/度)'" align="center" :formatter="common.moneyFormatter" width="100"></el-table-column>

                <el-table-column prop="cost" label="费用(元)" align="center" :formatter="common.moneyFormatter" width="100"></el-table-column>
                <el-table-column prop="classleadername" label="付方" align="center"></el-table-column>
                <el-table-column prop="paystatus" label="缴费状态" align="center" :formatter="common.payFormatter"></el-table-column>
                <el-table-column prop="paytime" label="缴费时间" align="center" width="150" :formatter="timeFormatter"></el-table-column>

                <el-table-column v-if="prevPage == 'resource-type-management'" label="操作" fixed="right" width="220" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.$index == 0 && currentPage ==1 && scope.row.paystatus =='1'" class="table-btn orange" @click="operateApply('edit',scope.row)">编辑</div>
                    <div v-if="scope.$index == 0 && currentPage ==1 && scope.row.paystatus =='1'" class="table-btn pink" @click="deletetr(scope.row)">删除</div>
                    <div v-show="scope.row.paystatus =='1' && scope.row.cost !=0" class="table-btn green" @click="payment(scope.row)">缴费</div>
                  </template>
                </el-table-column>
              </el-table>

              <!--分页-->
              <div class="my-pagination" v-if="totalPage > limit">
                <span>显示{{limit}}条，共{{totalPage}}条</span>
                <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                               :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
              </div>
            </div>
          </el-col>
          <el-col class="right-item" :span="9">
            <div class="check-in-list left-right list-shadow">
              <div class="top">
                {{prevPage == 'resource-type-management' ? '入驻信息' : "当前入驻信息"}}
                <div v-if="prevPage == 'resource-apply' && resTypeForm.usestatus=='3' " class="tag" >已入驻</div>
              </div>
              <div class="my-el-divider" style="margin-top: 0"></div>
              <div class="list-box my-scroll" v-loading="liveLoading">
                <live-list :liveList="liveList" :prevPage="prevPage"></live-list>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!--弹框-->
      <el-dialog class="" :title="(activeName=='1' ? '水表' : '电表')+'记录'+(dialogType2=='add' ? '新增' : '编辑')" v-if="dialogFormVisible2" :visible.sync="dialogFormVisible2"
                 width="500px" :close-on-click-modal="false">
        <pay-form ref="child2" :form2="form2" :formLabelWidth="formLabelWidth2" :activeName="activeName"></pay-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible2 = false">取 消</div>
          <div class="my-button green" @click="paySubmit(1)">提 交</div>
        </div>
      </el-dialog>

      <!--弹框-->
      <el-dialog class="res-apply-dialog" :title="dialogType =='add' ? '资源新增' : '资源编辑'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="700px" :close-on-click-modal="false">
        <res-form ref="child" :form="form" :formLabelWidth="formLabelWidth" :id="restypeid" v-loading="dialogLoading" :disabled="disabled"></res-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible = false">取 消</div>
          <div class="my-button green"  @click="submit()">提 交</div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import payForm from "./rescourceInfo/payDialog"
  import liveList from "./rescourceInfo/liveList";
  import resForm from "./rescourceInfo/resDialog2"
  import breadCrumb from "../../components/breadcrumb";


  export default {
        name: "detail",
      props:{
        id:String,
        restypeid:String,
        prevPage:String,
        breadList:Array,
        indexCurrentPage:Number,
        indexActiveName:String
      },
      components:{
        payForm,liveList,resForm,breadCrumb
      },
      data(){
        return{
          liveList:[],
          totalPage:1,
          limit:10,
          currentPage:1,
          activeName: '1',
          searchForm:{},
          applyList:[],  //申请列表
          dialogFormVisible2: false,
          dialogFormVisible: false,
          form2: {},
          form: {},
          formLabelWidth2: '80px',
          formLabelWidth: '120px',
          dialogType2:"",  //弹框类型
          dialogType:"",  //弹框类型
          loading:false,  //表格加载
          liveLoading:false,  //入驻列表加载
          resTypeForm:{},
          dialogLoading:false,
          typeDetail:{},
          disabled:false,
        }
      },
      methods:{
        //返回
        back(){
          this.common.back();
          sessionStorage.setItem("activeResType",this.restypeid);
          sessionStorage.setItem("currentPage",JSON.stringify(this.indexCurrentPage));

          if(this.prevPage == 'resource-apply'){
            sessionStorage.setItem("activeName",this.indexActiveName);
            sessionStorage.setItem("fromDetail","1")
          }

        },
        //删除
        deleteRes(num,id){
          let ids="";
          switch (num) {
            case "more":
              ids=this.selectedIds;
              break;
            case "single":
              ids=id;
              break;
          }

          // console.log(ids);

          if(!ids){
            this.$message({
              type:"warning",
              message:"请先选择资源"
            });
          }else {
            // this.selectedIds=id;
            this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.util.postAjax({
                code:this.global.code,
                url:"/spres/deleteByIds",
                data:{
                  ids:ids
                }
              }).then(res => {
                if(res.success == true){
                  this.common.back();
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }else {
                  this.$message({
                    type: 'warning',
                    message: res.data.message
                  });
                }
              })
            }).catch(() => {});
          }
        },

        //资源状态开启和关闭
        changeStatus(resstatus,num,id){
          // debugger;
          let ids="";
          switch (num) {
            case "more":
              ids=this.selectedIds;
              break;
            case "single":
              ids=id;
              break;
          }

          // console.log(ids);
          if(!ids){
            this.$message({
              type:"warning",
              message:"请先选择资源"
            });
          }else{
            this.util.postAjax({
              code:this.global.code,
              url:"/spres/changeStatus",
              data:{
                resstatus:resstatus,
                ids:ids
              }
            }).then(res => {
              if(res.success == true){
                // this.getList(this.currentPage);

                this.resTypeForm.resstatus = resstatus ==1 ? "1" : "2";
                this.$message({
                  type:"success",
                  message:resstatus =="1" ? "资源已开放" : "资源已关闭"
                });
              }else {
                this.$message({
                  type: 'warning',
                  message: res.data.message
                });
              }
            })
          }
        },

        //打开资源编辑弹框
        addApply(type,id){
          this.dialogType=type;
          // this.getTypeInfo();
          switch (type) {
            case "add":
              this.common.getResTypeDetail2(this.restypeid).then(res => {
                this.$refs.child.form = {};
                res.attrList.forEach(v=>{
                  v.attrv=""
                })
                this.$refs.child.form = {
                  attrList:JSON.parse(JSON.stringify(res.attrList))
                }
              })
              this.disabled=false;
              break;
            case "edit":
              this.dialogLoading=true;
              // this.getTypeInfo();
              if(this.resTypeForm.usestatus == 1){
                this.disabled = false
              }else {
                this.disabled = true
              }

              this.util.postAjax({
                code:this.global.code,
                url:"/spres/findById",
                data:{
                  id:id
                }
              }).then(res => {
                this.dialogLoading=false;

                if(res.success == true){
                  this.$nextTick(()=>{
                    this.$refs.child.form=res.item;

                    let arr=[];
                    res.item.baseList.forEach(v=>{
                      arr.push(v.typebaseid)
                    })

                    this.$refs.child.form={
                      rescode:res.item.rescode,
                      area:res.item.area,
                      price:res.item.price,
                      oldBaseList:arr,
                      attrList:res.item.attrList,
                      resstatus:res.item.resstatus,
                      id:res.item.id,
                    }

                    this.common.getResTypeDetail2(this.restypeid).then(res => {
                      if((res.attrList && res.attrList.length) !== (this.$refs.child.form.attrList && this.$refs.child.form.attrList.length)){
                        let attrids = this.$refs.child.form.attrList.map(i => i.typeattrid);
                        res.attrList.forEach(i => {
                          if(!attrids.includes(i.id)) {
                            this.$refs.child.form.attrList.push({
                              name: i.name,
                              attrv: "",
                              typeattrid: i.id
                            })
                          }
                        })
                      }
                    })

                    // console.log(res.item.attrList);
                    // console.log("打开弹框",this.$refs.child.form);
                  })
                }
              })
              break;
          }
          this.dialogFormVisible = true;
        },

        //获取类型详情
        getTypeInfo(){
          // this.loading=true;
          this.dialogLoading=true;
          this.util.postAjax({
            code:this.global.code,
            url:"/sprestype/findById",
            data:{
              id:this.restypeid
            }
          }).then(res => {
            // this.loading=false;
            this.dialogLoading=false;
            if(res.success == true){
              // console.log("11",res);
              this.typeDetail=res.item;
              // this.form.oldAttrList=[];
              // this.form.oldAttrList=res.item.attrList;

              let chargecycle=this.typeDetail.chargecycle;
              let chargetype=this.typeDetail.chargetype;
              this.common.chargecycleFormatter(chargecycle,this.typeDetail);
              this.common.chargetypeFormatter2(chargetype,this.typeDetail);

              // console.log("22",this.typeDetail);
            }
          });
        },

        // 获取资源详情
        getResTypeDetail(){
          this.util.postAjax({
            code:this.global.code,
            url:"/spres/findById",
            data:{
              id:this.id
            }
          }).then(res => {
            if(res.success == true){
              this.resTypeForm=res.item;
                let arr=[];
              arr = this.resTypeForm.baseList.map(v => v.name);

              this.resTypeForm.baseListText = arr.join("、");
              console.log("resTypeForm",this.resTypeForm);
            }
          });
        } ,

        //tab切换
        handleClick() {
          this.currentPage = 1;
          this.getList(1);
        },

        //获取入驻信息
        getLiveList(){
          this.liveLoading=true;
          this.util.postAjax({
            code:this.global.code,
            url:"/spresliveinfo/pageList",
            data:{
              params:JSON.stringify({
                resid:this.id
              })
            }
          }).then(res => {
            this.liveLoading=false;
            if(res.success == true){
              // console.log(res);
              this.liveList=res.items;

              

              if(this.liveList && this.liveList.length>0){
                this.liveList.forEach(v => {
                  if(!v.endtime){
                    v.lasttime = v.applyendtime;
                  }else{
                    if(v.endtime >= v.applyendtime){
                       v.lasttime = v.applyendtime;
                    }else{
                      v.lasttime = v.endtime
                    }
                  }
                })
              }

              console.log(this.liveList);


            }
          })
        },

        //费用
        chargeFormatter(row, column, cellValue){
          return row.showv*row.price
        },

        //时间转换
        timeFormatter(row, column, cellValue){
          if(cellValue == null){
            return "--"
          }else {
            return this.util.formatTime(cellValue,"yyyy.MM.dd hh:mm")
          }
        },

        //表格内日期格式转化
        dateFormatter(row, column, cellValue){
          if(cellValue && cellValue.length == 14){
            return this.util.formatTime(cellValue,"yyyy.MM.dd")
          }else {
            return cellValue
          }
        },

        //点击分页
        getCurrentChange(currentPage){
          this.currentPage=currentPage;
          this.getList(currentPage)
        },

        //删除
        deletetr(row){
          // console.log(row.id);
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.util.postAjax({
              code:this.global.code,
              url:"/spreselec/deleteById?id="+row.id,
            }).then(res => {
              if(res.success == true){
                this.currentPage=1;
                this.getList(this.currentPage);
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                //刷新列表

              }else {
                this.$message({
                  type: 'warning',
                  message: res.data.message
                });
              }
            })


          }).catch(() => {});
        },

        //缴费
        payment(row){
          this.$confirm('确定缴费吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            /*let params={
              id:row.id
            };*/
            this.util.postAjax({
              code:this.global.code,
              url:"/spreselec/pay",
              // isRep:true,
              data:{
                id:row.id
              }
            }).then(res => {

              if(res.success == true){
                this.getList( this.currentPage);
              }else {

                // console.log(res);
                this.$message({
                  type:"warning",
                  message:res.data.message
                });
              }
            })
          }).catch(() => {});
        },

        //获取列表
        getList(page){
          this.loading=true;
          this.util.postAjax({
            code:this.global.code,
            url:"/spreselec/pageList",
            data:{
              params:JSON.stringify({
                page:page,
                limit:this.limit,
                resid:this.id,
                type:this.activeName
              })
            }
          }).then(res =>{
            this.loading=false;
            if(res.success == true){
              this.applyList = res.items;
              this.totalPage = res.total;
            }
          })
        },

        //打开编辑弹框
        eidtAudit(row){
          this.util.postAjax({
            code:this.global.code,
            url:"/spreselec/findById",
            data:{
              id:row.id
            }
          }).then(res => {
            if(res.success == true){
              // console.log(res);
              // return false;
              this.dialogFormVisible2 = true;
              this.form2=res.item;

              // console.log("11",this.form2);
            }
          })
        },

        //打开弹框
        operateApply(type,row){
          this.dialogType2=type;

          switch (type) {
            case "add":
              if(this.totalPage > 0){
                // console.log(this.totalPage);
                let length=this.totalPage;
                this.form2={
                  price:this.applyList[0].price,
                  lastshowv:this.applyList[0].showv,
                };
              }else {
                this.form2={}
              }
              this.dialogFormVisible2 = true;
              break;
            case "edit":
              this.eidtAudit(row);
              break;
          }
        },

        //提交
        paySubmit(type){

          this.$refs.child2.$refs.form2.validate((valid) => {
            if (valid) {
              // console.log("11",this.$refs.child2.form2);
              // return false;
              let form=this.$refs.child2.form2;
              let form2 = {};
              let url="";
              let message="";
              if(this.dialogType2 == "add"){
                url="/spreselec/add";
                message="添加成功";
              }else if(this.dialogType2 == "edit") {
                url="/spreselec/update";
                message="编辑成功";
              }
              if(form.id){
                form2.id = form.id;
              }

              form2.resid=this.id;
              form2.price=form.price;
              form2.showv=form.showv;
              form2.type=this.activeName;

              // console.log("form2",form2);

              const loading = this.$loading({
                  lock: true,
                  text: "提交中",
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });

              // return false;
              this.util.postAjax({
                code:this.global.code,
                url:url,
                isRep:true,
                data:form2
              }).then(res => {
                loading.close();
                if(res.success == true){
                  this.dialogFormVisible2 = false;
                  this.$message({
                    type:"success",
                    message:message
                  });
                  this.currentPage =1;
                  this.getList(this.currentPage);
                }else {
                  this.$message({
                    type: 'warning',
                    message: res.data.message
                  });
                }
              })
            }
          });
          // return false;

        },

        //提交
        submit(){
          this.$refs.child.$refs.form.validate((valid) => {
            if (valid) {
              let url="";
              let message="";
              let form=this.$refs.child.form;
              // console.log("提交时",form);

              // return false;

              let baseList=[];
              let attrList=[];
              /*switch (this.dialogType) {
                case "add":
                  url="/spres/add";
                  message = "新增成功";
                  this.currentPage=1;
                  form.oldAttrList.forEach(v=>{
                    attrList.push({typeattrid:v.id,attrv:v.attrv})
                  });
                  form.oldBaseList.forEach(v=>{
                    baseList.push({typebaseid:v})
                  });
                  form.attrList=attrList;
                  form.baseList=baseList;
                  break;
                case "edit":
                  url="/spres/update";
                  message = "编辑成功";
                  form.oldAttrList.forEach(v=>{
                    attrList.push({id:v.id,typeattrid:v.typeattrid,attrv:v.attrv,resid:v.resid})
                  });

                  form.baseList.forEach(v=>{
                    baseList.push({typebaseid:v.typebaseid,id:v.id,resid:v.resid})
                  });
                  form.attrList=attrList;
                  form.baseList=baseList;
                  break;
              }*/
              switch (this.dialogType) {
                case "add":
                  url="/spres/add";
                  message = "新增成功";
                  this.currentPage=1;
                  form.attrList.forEach(v=>{
                    attrList.push({typeattrid:v.id,attrv:v.attrv})
                  });
                  form.oldBaseList.forEach(v=>{
                    baseList.push({typebaseid:v})
                  });
                  form.attrList=attrList;
                  form.baseList=baseList;
                  break;
                case "edit":
                  url="/spres/update";
                  message = "编辑成功";
                  form.attrList.forEach(v=>{
                    attrList.push({id:v.id,typeattrid:v.typeattrid,attrv:v.attrv,resid:v.resid,name:v.name})
                  });

                  // console.log("this.typeDetail.baseList",this.$refs.child.typeDetail.baseList);
                  form.oldBaseList.forEach(v=>{
                    baseList.push({typebaseid:v})
                  });
                  form.attrList=attrList;
                  form.baseList=baseList;
                  break;
              }



              // console.log(this.$refs.child.form);

              // let typeDetail=this.$refs.child.typeDetail;
              // console.log("typeDetail",typeDetail);





              let form2={};
              form2.id=form.id ? form.id : "";
              form2.rescode=form.rescode;
              form2.area=form.area;
              form2.price=form.price;
              form2.resstatus=form.resstatus;
              form2.baseList=form.baseList;
              form2.attrList=form.attrList;
              form2.restypeid=this.restypeid;

              // console.log("form2",form2);

              // return false;
              this.util.postAjax({
                code:this.global.code,
                url:url,
                isRep:true,
                data:form2
              }).then(res => {
                if(res.success == true){
                  this.dialogFormVisible = false;
                  this.$message({
                    type:"success",
                    message:message
                  });
                /*  this.currentPage=1;
                  this.getList(this.currentPage);*/
                  // this.common.getSeriesLists();
                }else {
                  this.$message({
                    type:"warning",
                    message:res.data.message
                  });
                }
              })
            }
          })


        },

      },
      created() {
        // console.log(this.restypeid);
        this.getTypeInfo();
        this.getLiveList();
        this.getList(this.currentPage);
        this.getResTypeDetail();
        // console.log("prevPage",this.prevPage);

      }
    }
</script>

<style scoped>

</style>
