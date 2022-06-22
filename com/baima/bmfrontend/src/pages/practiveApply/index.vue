<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
        <span>
          <label>申请时间</label>
          <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.applytime" value-format="yyyyMMdd" size="small" style="width: 150px;"></el-date-picker>
        </span>
        <span>
          <label>状态</label>
          <el-select v-model="searchForm.applystatus" placeholder="请选择" size="small" style="width: 150px">
            <el-option v-for="item in applyStatus" :key="item.id" :label="item.name" :value="item.id" ></el-option>
          </el-select>
        </span>
        <span>
<!--          <el-input v-model="searchForm.rescode" placeholder="请输入编号" prefix-icon="el-icon-search" size="small" style="width: 220px"></el-input>-->
          <el-button size="small" style="width: 100px" @click="search">搜索</el-button>
        </span>
        <span class="reset-icon" @click="reSet">
          <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
        </span>
    </div>

    <!--tab切换-->
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部申请" name="1"></el-tab-pane>
        <el-tab-pane label="已提交" name="3"></el-tab-pane>
        <el-tab-pane label="草稿箱" name="2"></el-tab-pane>
      </el-tabs>

      <div class="my-button green" style="float: right;margin-top: 3px;" @click="operateApply('add',null)">
        <i class="el-icon-plus"></i>
        <span>新增申请</span>
      </div>
    </div>

    <el-divider style=""></el-divider>

    <!--表格-->
    <el-table class="my-table" :data="applyList" style="width: 100%" stripe @sort-change="sortChange" v-loading="loading">
      <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
      <el-table-column prop="classname" label="班级名称" align="center"></el-table-column>
      <el-table-column prop="leadername" label="负责教师" align="center"></el-table-column>
      <el-table-column prop="prpersonnum" label="实习人数" sortable align="center" ></el-table-column>
      <el-table-column prop="prstarttime" label="实习日期" sortable align="center" :formatter="prTimeFormatter"></el-table-column>
      <el-table-column prop="applystatus" label="审批进度" align="center">
        <template slot-scope="scope">
          <span :class="common.statusColor('','',scope.row.applystatus)">{{common.processFormatter("","",scope.row.applystatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.applystatus == 0" class="table-btn orange" @click="operateApply('edit',scope.row)">编辑</div>
          <div v-if="scope.row.applystatus !=0" class="table-btn green" @click="goDetail(scope.row)">详情</div>
          <div v-if="scope.row.applystatus==1 || scope.row.applystatus ==2" class="table-btn pink" @click="reCall(scope.row)">撤回</div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit">
      <span>显示{{limit}}条，共{{totalPage}}条</span>
      <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                     :current-page="parseInt(currentPage)" small @current-change="getCurrentChange"></el-pagination>
    </div>

    <!--弹框-->
    <el-dialog class="res-apply-dialog" :title="dialogType == 'add' ? '实习申请新增' : '实习申请编辑'"   v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
               width="750px" :close-on-click-modal="false">
      <apply-form ref="child" :form="form" :formLabelWidth="formLabelWidth" :studentList="studentList" :teacherList="teacherList"  @addTeacher="addTeacher" @submitDiag="submit"
                  @deleteTeacher="deleteTeacher" @getFileInfo="getFileInfo" @deleteFile="deleteFile"></apply-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="dialogFormVisible = false">取 消</div>
        <div class="my-button plain-green"  @click="submit(0)">保 存</div>
        <div class="my-button green" @click="triggerSubmit(1)">提 交</div>
        <!--          <div v-else class="my-button green" @click="submit(3)">提 交</div>-->
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // import upload from "../../components/BaseUpload"
  import applyForm from "../../components/prDialog"
  export default {
    name: "index",
    components:{
      applyForm,
      // upload
    },
    data(){
      return{
        studentList: [],
        totalPage:1,
        limit:10,
        currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
        activeName: sessionStorage.getItem("activeName") || "1",
        searchForm:{},
        applyList:[],  //申请列表
        dialogFormVisible: false,
        form: {},
        formLabelWidth: '120px',
        applyStatus:this.options.prApplyStatus,   //状态列表
        codeList:JSON.parse(sessionStorage.getItem("codeList")) ,  //资源编号列表
        dialogType:"",  //弹框类型
        groupList:JSON.parse(sessionStorage.getItem("groupList")) ,  //学院列表
        teacherList:[],
        fullscreenLoading:"",
        orderBy:null,
        sort:null,
        loading:false
      }
    },
     beforeDestroy() {
        sessionStorage.removeItem("currentPage");
        sessionStorage.removeItem("activeName");
      },
    methods:{
      //排序
      sortChange(column, prop, order){
        this.orderBy=column.prop.toUpperCase();
        // console.log(this.orderBy);
        switch (column.order) {
          case "ascending":
            this.sort="asc";
            break;
          case "descending":
            this.sort="desc";
            break;
        }
        this.currentPage=1;
        this.getList(this.currentPage);
      },

      // 跳转详情
      goDetail(row) {
        this.$router.push({
          path: `practive-apply/detail/${row.id}`,
          query:{
                activeName:this.activeName,
                currentPage:this.currentPage
              }
        });
      },

      getFileInfo(data){
        this.form.stuinfofileid=data.ID;
        this.form.stuinfofilename=data.TITLE;
      },

      //删除文件
      deleteFile(){
        this.form.stuinfofileid="";
        this.form.stuinfofilename="";
      },

      //删除教师
      deleteTeacher(index){
        // console.log("teacherList",this.teacherList);
        this.teacherList.splice(index,1)
      },

      //验证手机号码格式
      isPoneAvailable(phone) {
        let myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (!myreg.test(phone)) {
          return false;
        } else {
          return true;
        }
      },

      //新增教师
      addTeacher(){

        if(this.teacherList && this.teacherList.length > 0){
          let length =this.teacherList.length;
          if(this.teacherList[length-1].teachername && this.teacherList[length-1].teachermobile ){
            if(this.isPoneAvailable(this.teacherList[length-1].teachermobile)){
              this.teacherList.push({teacherid:"",teachername:"",teachermobile:""})
            }else {
              this.$message({
                type:"warning",
                message:"手机格式不正确"
              })
            }
          }else {
            this.$message({
              type:"warning",
              message:"请填写教师名称和联系方式"
            })
          }
        }else {
          this.teacherList.push({teacherid:"",teachername:"",teachermobile:""})
        }
      },

      //查询
      search(){
        this.getList(1);
        this.currentPage =1;
      },

      //重置
      reSet(){
        this.searchForm={};
        this.getList(1);
        this.currentPage =1;
      },

      //表格内实习时间转换
      prTimeFormatter(row, column, cellValue){
        let startDate =cellValue ? this.util.formatTime(cellValue,"yyyy.MM.dd") : "--";
        let endDate =row.prendtime ? this.util.formatTime(row.prendtime,"yyyy.MM.dd") : "--";
        return startDate+"~"+endDate;
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
        this.currentPage = currentPage;
        this.getList( this.currentPage);
      },

      //撤回
      reCall(row){
        let params={
          eventtype:2,
          applyid:row.id
        };
        this.util.postAjax({
          code:this.global.code,
          url:"/prapply/saveEvent",
          isRep:true,
          data:params
        }).then(res => {
          // console.log(res);
          if(res.success == true){
            this.getList(1);
            this.currentPage =1;
          }else {
            this.$message({
              type: 'warning',
              message: res.data.message
            });
          }
        })
      },

      //获取列表
      getList(page){
        this.loading=true;
        this.util.postAjax({
          code:this.global.code,
          url:"/prapply/pageList",
          data:{
            params:JSON.stringify({
              page:this.currentPage,
              limit:this.limit,
              applytype:this.activeName,
              applystatus:this.searchForm.applystatus,
              // rescode:this.searchForm.rescode,
              applytime:this.searchForm.applytime ? this.util.formatTime(this.searchForm.applytime,"yyyyMMdd000000") : null,
              sort:this.sort,
              orderBy:this.orderBy
            })
          }
        }).then(res =>{
          this.loading=false;
          if(res.success == true){
            this.applyList = res.item.applyerList.list;
            this.totalPage = res.item.applyerList.total;
            // console.log("1111",this.applyList);
          }

        })
      },


      //打开编辑弹框
      eidtAudit(row){
        this.util.postAjax({
          code:this.global.code,
          url:"/prapply/findById",
          data:{
            id:row.id
          }
        }).then(res => {
          if(res.success == true){
            console.log(res);
            this.dialogFormVisible = true;
            let apply=res.item.apply;
            let attment=res.item.attment || {};
            this.form=apply;

            this.teacherList=res.item.teachers || [];
            this.studentList=res.item.students || [];
            this.teacherList.forEach(v=>{
              v.teacherInfo=JSON.stringify({
                id:v.teacherid,
                name:v.teachername
              })
            })
            // this.form.leaderInfo=JSON.stringify({
            //   id:this.form.leaderid,
            //   name:this.form.leadername
            // })
            console.log("form",this.form);
            this.form.stuinfofilename=attment.TITLE ? attment.TITLE : "";

          }
        })
      },

      //打开弹框
      operateApply(type,row){
        this.dialogType=type;
        this.form={
          orgid:this.options.userInfo.ORGID,
          applyername:this.options.userInfo.NAME,
          issleep:"1",
          iseat:"1",
         /* sleepboynum:0,
          sleepgirlnum:0,
          eatpersonnum:0,
          eatmpersonnum:0,*/
          eatdaterange:[]
        };

        this.teacherList=[];

        switch (type) {
          case "add":
            this.dialogFormVisible = true;
            break;
          case "edit":
            this.eidtAudit(row);
            break;
        }
      },

      //提交的数据
      submitData(type,form){
        let url="";
        let message="";
        let teacherList=this.$refs.child.teacherList;
        let studentList = this.studentList;
        let text="";
        if(type == 0){
          // form2.note = form.event.eventnote;
          url="/prapply/saveDraft";
          message="保存成功";
          text="保存中"
        }else if(type == 1){
          // form.event={};
          url="/prapply/save";
          message="提交成功";
          text="提交中";
          this.currentPage =1;
        }else if(type == 2){
          // form.event={};
          url="/prapply/edit";
          message="编辑成功";
          text="编辑中"
        }

        //教师列表
        form.teacherList=teacherList;
        form.studentList = studentList;

        //当食宿没有选择时
        if(form.issleep == "0"){
          form.sleepstarttime="";
          form.sleependtime="";
          /*form.sleepboynum=0;
          form.sleepgirlnum=0;*/
        }
        if(form.iseat == "0"){
          form.eatstarttime="";
          form.eatendtime="";
          form.eatstarttype="";
          form.eatendtype="";
         /* form.eatpersonnum=0;
          form.eatmpersonnum=0;*/
        }

        //时间转换格式
        form.prstarttime=form.prstarttime ? this.util.formatTime(form.prstarttime,"yyyyMMdd000000") : "";
        form.prendtime=form.prendtime ? this.util.formatTime(form.prendtime,"yyyyMMdd000000") : "";
        form.sleepstarttime=form.sleepstarttime ? this.util.formatTime(form.sleepstarttime,"yyyyMMdd000000") : "";
        form.sleependtime=form.sleependtime ? this.util.formatTime(form.sleependtime,"yyyyMMdd000000") : "";
        form.eatstarttime=form.eatstarttime　? this.util.formatTime(form.eatstarttime,"yyyyMMdd000000") : "";
        form.eatendtime=form.eatendtime ? this.util.formatTime(form.eatendtime,"yyyyMMdd000000") : "";

        // console.log("form2",form);

        const loading = this.$loading({
                  lock: true,
                  text: text,
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });

        this.util.postAjax({
          code:this.global.code,
          url:url,
          isRep:true,
          data:form
        })
          .then(res => {
            loading.close();
            if(res.success == true){
              this.dialogFormVisible = false;
              this.$message({
                type:"success",
                message:message
              });
              this.getList(this.currentPage);

            }else{
              // console.log(res);
              this.$message({
                type:"warning",
                message:res.data.message
              });
            }
          }).catch((e) => loading.close())
      },

      triggerSubmit(type) {
        this.$refs.child.dVisible = true;
        this.$refs.child.diagType = 'submit';
        this.$refs.child.diagTitle = '友情提醒';
        this.$refs.child.diagBody = '实习期间，未经允许，请勿随意进入他人实验区域。';
      },

      //提交
      submit(type){
        this.$refs.child.checkAllTable();
        let form=this.$refs.child.form;
        this.studentList = this.$refs.child.tableData.map(t => {
          let obj = {...t};
          obj.sex = obj.sex === '男' ? 1 : 0;
          return obj;
        });
        // console.log(form, this.studentList);

        if(type == 0){
          this.submitData(type,form)
        }else if(type == 1 || type==2){
          this.$refs.child.$refs.form.validate((valid) => {
            if (valid) {
              let form=this.$refs.child.form;
              let teacherList=this.$refs.child.teacherList;

              if(teacherList && teacherList.length == 0){
                this.$message({
                  type:"warning",
                  message:"请添加参与教师"
                });
              }else {
                if(!teacherList.every(v => v.teachername) || !teacherList.every(v => v.teachermobile)){
                  this.$message({
                    type:"warning",
                    message:"请填写教师名称和联系方式"
                  })
                }else if(teacherList.every(v => {this.isPoneAvailable(v.teachermobile)})){
                  this.$message({
                    type:"warning",
                    message:"参与老师列表内有手机格式不正确"
                  })
                }

                //日期校验
                else if(form.issleep == "1" && form.sleepstarttime < form.prstarttime){
                  this.$message({
                    type:"warning",
                    message:"住宿开始日期不能晚于实习开始日期"
                  })
                }
                else if(form.issleep == "1" && form.eatstarttime < form.prstarttime){
                  this.$message({
                    type:"warning",
                    message:"用餐开始日期不能晚于实习开始日期"
                  })
                }

                else {
                  // if(!form.stuinfofilename && !form.stuinfofilename){
                  //   this.$message({
                  //     type:"warning",
                  //     message:"请上传学生信息表"
                  //   });
                  // }
                  if(!this.studentList.length){
                    this.$message({
                      type:"warning",
                      message:"请上传学生信息表"
                    });
                  }
                  else {

                    // return false;
                    // let form2 = {};
                    this.submitData(type,form)
                  }
                }
              }


            }
          })
        }




        // return false;
      },


      //tab切换
      handleClick(row) {
        this.currentPage = 1;
        this.getList(1);
      }
    },
    created() {
      this.getList(this.currentPage)
    }
  }
</script>

<style scoped>

</style>
