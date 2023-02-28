<template>
    <div class="common-content">
        

      <!-- 搜索框查询 -->
      <div class="search-box">
        <el-input size="small" v-model="searchForm.NAME" style="width:200px" placeholder="请输入用户名" @keyup.enter.native="search" clearable  @clear="clear('NAME')" ></el-input>

        <el-cascader placeholder="请选择部门" size="small" v-model="searchForm.ORGID" :options="orgList" :props="optionProps" style="width:200px" 
        @change="handleChange" clearable @clear="clear('ORGID')"></el-cascader>
        <el-button size="small" style="width: 100px" @click="search">搜索</el-button>
        <el-button size="small" style="width: 100px;margin-left:0" @click="reSet">重置</el-button>
        

        <el-button type="primary" size="small"  style="width:100px;float:right" @click="openDialog('add',null)"><i class="el-icon-plus" style="margin-right:10px"></i>新增用户</el-button>
      </div>


      <!--表格-->
      <el-table class="my-table" :data="tableList" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="LOGINNAME" label="登录名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="NAME" label="用户名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SEX" label="性别" align="center" :formatter="sexFormatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PHONE" label="手机号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ORGNAME" label="部门名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="STATUS" label="状态" align="center" :formatter="statusFormatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CREATETIME" label="更新时间" align="center" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            {{common.formatTime(scope.row.CREATETIME,"yyyy-MM-DD hh:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="停用" placement="top-start">
              <i class="table-icon-btn orange el-icon-remove-outline" @click="deleteUser(scope.row,2)"></i>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="密码重置" placement="top-start">
              <i class="table-icon-btn green el-icon-setting" @click="openPwdDialog(scope.row)"></i>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <i class="table-icon-btn blue el-icon-edit-outline" @click="openDialog('edit',scope.row)"></i>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <i class="table-icon-btn red el-icon-delete" @click="deleteUser(scope.row,0)"></i>
            </el-tooltip>
            
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="my-pagination" >
        <span>显示{{limit}}条，共{{totalPage}}条</span>
        <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                       :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
       </div>   


       <!--用户弹框-->
      <el-dialog class="my-dialog" :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="600px" :close-on-click-modal="false">
        <dialog-form ref="child"  :classifyList="classifyList" @closeDialog="closeDialog" :dialogTitle="dialogTitle" :dialogType="dialogType"></dialog-form>
      </el-dialog> 

      <!--密码弹框-->
      <el-dialog class="my-dialog" title="密码重置" v-if="pwdFormVisible" :visible.sync="pwdFormVisible"
                 width="600px" :close-on-click-modal="false">
        <pwd-form ref="pwdChild"  @closePwdDialog="closePwdDialog"></pwd-form>
      </el-dialog> 

      
    </div>
</template>

<script>
  import dialogForm from '../../pages/userMaintain/userDialog.vue'
  import pwdForm from '../../pages/userMaintain/pwdDialog.vue'
  
    export default {
        name: "index",
        components:{
          dialogForm,pwdForm
        },
        data(){
            return{
                dialogTitle:"",
                dialogType:"",
                tableList:[],
                loading:false,
                totalPage:1,
                limit:10,
                currentPage:1,
                searchForm:{},
                classifyList:[], //题目分类列表
                domain:this.global.domain,  //域名
                dialogFormVisible:false,
                pwdFormVisible:false,
                searchForm:{},
                orgList:[],
                optionProps:{
                  value: 'ID',
                  label: 'NAME',
                  children: 'children'
              },
            }
        },
        computed: {
          userInfo() {
            return this.$store.state.userInfo;
          }
        },
        methods: {
          // 搜索框单个清除
            clear(type){
              switch (type) {
                case "NAME":
                  this.searchForm.NAME=null;
                  break;
                case "ORGID":
                  this.searchForm.fileType=null;
                  break;
              }

              this.search();
            },
          // 查询
          search() {
            this.currenentPage=1;
            this.getList();
          },
          // 重置
          reSet() {
            this.searchForm={};
            this.search();
          },
          // 部门名称选择
          handleChange(value) {
              this.searchForm.ORGID=this.searchForm.ORGID[this.searchForm.ORGID.length-1];
              this.search();
          },

            // 获取组织列表
            getOrgList(){
                this.util.postAjax({
                    code:this.global.authCode,
                    url:"/Org/tree",
                  }).then(res => {
                      // console.log(res)
                      this.orgList=res;
                  })
            },
            // 打开密码重置弹框
            openPwdDialog(row){
              this.pwdFormVisible=true;

              this.common.getCurrentUser(row).then(res => {
                if(res.success){
                  this.$nextTick(() => {
                    this.$refs.pwdChild.form={
                      ID:res.item.ID,
                      LOGINNAME:res.item.LOGINNAME,
                      NAME:res.item.NAME,
                      PWD:"",
                      checkPWD:"",
                    };
                  })
                }
              })
            },

            // 关闭密码重置弹框
            closePwdDialog(){
              this.pwdFormVisible=false;
              this.getList();
            },

            //删除和停用用户
            deleteUser(row,type) {
              let text="";
              let message="";
              switch (type){
                 case 0:
                   text="确定删除此用户吗?";
                   message="删除成功!";
                   break;
                 case 2:
                   text="确定停用此用户吗?";
                    message="已停用";
                   break;  
              }
              
              this.$confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.authCode,
                  url: "/User/simpleSave",
                  data:{
                    d:JSON.stringify({
                      ID:row.ID,
                      STATUS:type,     // 0删除1在用2停用
                    })
                  }
                }).then( (res) =>{
                  if(res.success){
                    this.getList();
                      this.$message({
                      type: 'success',
                      message: message
                    });
                  }
                })
              }).catch(() => {});
            },

            // 获取单条详情
            getCurrentRow(row){
              this.common.getCurrentUser(row).then(res => {
                if(res.success){
                  // console.log(res);

                  let arr = [];
                  this.$nextTick(() => {
                    // this.$refs.child.form=res.item;

                    this.util.postAjax({
                    code:this.global.authCode,
                    url: "/User/getUserRoles",
                    data:{
                      USERID:row.ID
                    }
                  }).then(res => {
                    // console.log(res)
                    
                    res.items.forEach(one => {
                      arr.push(one.ID)
                    })
                    // console.log(arr);
                  })

                   this.$refs.child.form={
                        ID:res.item.ID,
                        LOGINNAME:res.item.LOGINNAME,
                        PWD:res.item.PWD,
                        PHONE:res.item.PHONE,
                        NAME:res.item.NAME,
                        SEX:res.item.SEX,
                        ORGID:res.item.ORGID,
                        STATUS:res.item.STATUS,
                        ROLEID:arr
                    }
                  })
                }
              })
            },

            // 打开弹框
            openDialog(type,row){
              this.dialogType=type;
             
              switch (type) {
                case "add":
                  this.dialogTitle="新增用户"
                  break;

                case "edit":
                  this.dialogTitle="编辑用户";
                  this.getCurrentRow(row);
                  break;  
              }

              this.dialogFormVisible=true;
            },

            // 关闭弹框
            closeDialog(){
              this.dialogFormVisible=false;
              this.getList();
            },

            //性别转换
            sexFormatter(row,column,cellValue) {
              if (cellValue === "1"){
                return "女"
              }else if (cellValue === "0"){
                return "男"
              }
            },

             //性别转换
            statusFormatter(row,column,cellValue) {
              if (cellValue === "1"){
                return "正常"
              }else if (cellValue === "0"){
                return "删除"
              }else if (cellValue === "2"){
                return "停用"
              }
            },

            // 点击分页
            getCurrentChange(val){

              this.currentPage=val;
              this.getList();

            },

          

            // 获取列表
            getList(){
              this.loading=true;
                this.util.postAjax({
                code:this.global.authCode,
                url:"/User/simpleList",
                data:{
                  filter:JSON.stringify({
                    // STATUS: '1', // 带上，只筛选状态正常的用户
                    // LOGOUT: '0',
                    STATUSin:["2", "1"],
                    HASPWD: true, // 带上，只筛选有密码的用户
                    ID: '',
                    TID: this.userInfo.TID,
                    // LOGINNAME: this.searchForm.LOGINNAME,
                    ORGID: this.searchForm.ORGID,
                    // NAME: this.searchForm.NAME, // 模糊
                    KEYWORD: this.searchForm.NAME, // NAME 和 LOGINNAME 的模糊查询
                    MYTID: true, // 我的租户下的人
                    // NYORG: true, // 我的同组织下的人
                  }),
                  page:this.currentPage,
                  limit:this.limit
                }
              }).then((res) =>{
               this.loading=false;
                if(res.success){
                   

                    this.tableList=res.items;
                    this.totalPage=res.total;

                    // console.log(this.tableList)

                    
                }

                // this.isShowPage();
              })
            }

        },

        created() {
          this.getList();
          this.getOrgList();
         


          

        },
    }
</script>

<style scoped>

</style>
