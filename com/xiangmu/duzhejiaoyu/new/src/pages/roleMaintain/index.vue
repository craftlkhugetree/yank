<template>
    <div class="common-content">
        

      <!-- 搜索框查询 -->
      <div class="search-box">
        <el-button type="primary" size="small"  style="min-width:100px" @click="openDialog('add',null)"><i class="el-icon-plus" style="margin-right:10px"></i>新增角色组</el-button>
      </div>


      <!--表格-->
      <el-row :gutter="30">
        <el-col :span="10">
            <!-- 角色组 -->
            <el-table class="my-table" :data="tableList" style="width: 100%" stripe v-loading="loading">
              <el-table-column label="序号" align="center" type="index"></el-table-column>
              <el-table-column prop="NAME" label="角色组名称" align="center"></el-table-column>
              <el-table-column label="操作" fixed="right" width="150" align="center">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="角色详情" placement="top-start">
                    <i class="table-icon-btn green el-icon-view" @click="viewRole(scope.row,scope.$index)"></i>
                  </el-tooltip>

                  <el-tooltip class="item" effect="dark" content="新增角色" placement="top-start">
                    <i class="table-icon-btn orange el-icon-circle-plus-outline" @click="openRoleDialog(scope,'add')"></i>
                  </el-tooltip>

                  <el-tooltip class="item" effect="dark" content="编辑角色组" placement="top-start">
                    <i class="table-icon-btn blue el-icon-edit-outline" @click="openDialog('edit',scope)"></i>
                  </el-tooltip>

                  <el-tooltip class="item" effect="dark" content="删除角色组" placement="top-start">
                    <i class="table-icon-btn red el-icon-delete" @click="deleteRoleGroup(scope.row)"></i>
                  </el-tooltip>
                  
                </template>
              </el-table-column>
            </el-table>
        
        </el-col>

        <el-col :span="14" style="position:relative">
            <div style="position:absolute;top:-30px;color:#666;font-weight:bold">当前角色组名称：{{currentRoleGroup.NAME}}</div>

            <!-- 角色组 -->
            <el-table class="my-table" :data="roleList" style="width: 100%" stripe v-loading="loading">
              <el-table-column label="序号" align="center" type="index"></el-table-column>
              <el-table-column prop="NAME" label="角色名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="DES" label="角色描述" align="center" show-overflow-tooltip></el-table-column>
              
              <el-table-column label="操作" fixed="right" width="150" align="center">
                <template slot-scope="scope">

                  <el-tooltip class="item" effect="dark" content="权限管理" placement="top-start">
                    <i class="table-icon-btn green el-icon-setting" @click="toRight(scope.row)"></i>
                  </el-tooltip>

                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                    <i class="table-icon-btn blue el-icon-edit-outline" @click="openRoleDialog(scope,'edit')"></i>
                  </el-tooltip>

                  <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <i class="table-icon-btn red el-icon-delete" @click="deleteRole(scope.row)"></i>
                  </el-tooltip>
                  
                </template>
              </el-table-column>
            </el-table>
        
        </el-col>
      </el-row>

      

      <!--分页-->
      <!-- <div class="my-pagination" >
        <span>显示{{limit}}条，共{{totalPage}}条</span>
        <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                       :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
       </div>    -->


       <!--用户弹框-->
      <el-dialog class="my-dialog" :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="600px" :close-on-click-modal="false">
        <dialog-form ref="child" @closeDialog="closeDialog" :dialogTitle="dialogTitle" :dialogType="dialogType" :roleGroupForm="roleGroupForm"></dialog-form>
      </el-dialog> 

      <!--密码弹框-->
      <el-dialog class="my-dialog" :title="dialogRoleTitle" v-if="pwdFormVisible" :visible.sync="pwdFormVisible"
                 width="600px" :close-on-click-modal="false">
        <pwd-form ref="pwdChild"  @closePwdDialog="closePwdDialog" :groupID="groupID" :dialogRoleTitle="dialogRoleTitle" 
        :roleForm="roleForm" :dialogRoleType="dialogRoleType"></pwd-form>
      </el-dialog> 

      
    </div>
</template>

<script>
  import dialogForm from '../../pages/roleMaintain/roleGroupDialog.vue'
  import pwdForm from '../../pages/roleMaintain/roleDialog.vue'
  import Vue from 'vue'
    export default {
        name: "index",
        components:{
          dialogForm,pwdForm
        },
        data(){
            return{
                dialogTitle:"",
                dialogType:"",
                tableList:[], //角色组列表
                loading:false,
                totalPage:1,
                limit:10,
                currentPage:1,
                searchForm:{},
                classifyList:[], //题目分类列表
                domain:this.global.domain,  //域名
                dialogFormVisible:false,
                pwdFormVisible:false,

                roleList:[], //角色列表
                roleGroupForm:{},  //当前角色组
                dialogRoleTitle:"",
                dialogRoleType:"",
                groupID:"",
                groupIndex:"",
                roleForm:{}, //当前角色
                currentRoleGroup:{}
                
            }
        },

        methods: {
          //跳转到权限管理页面
          toRight(row){
            // path:`irrigate-apply/irrigate-apply-detail/${row.id}`,
            this.$router.push({
              path:"/roleMatain/right-management",
              query:{
                ROLEID:row.ID
              }
            })
          },

          // 查看角色详情
           viewRole(row,index){
             this.groupIndex=index;
             this.roleList=this.tableList[index].children;
             this.currentRoleGroup=row;
           }, 

            // 打开角色弹框
            openRoleDialog(scope,type){
              this.pwdFormVisible=true;
              this.dialogRoleType=type;

              if(type == "add"){
                this.groupID=scope.row.ID;
                this.groupIndex=scope.$index;
              }
             

              // console.log(scope)
              switch (type) {
                case "add":
                  this.dialogRoleTitle="新增角色"
                  break;

                case "edit":
                  this.dialogRoleTitle="编辑角色";
                  this.roleForm=JSON.parse(JSON.stringify(scope.row));
                  break;  
              }
              
            },

            // 关闭角色弹框
            closePwdDialog(){
              this.pwdFormVisible=false;
              // this.getList();

              this.util.postAjax({
                code:this.global.authCode,
                url:"/Role/groupRole",
              }).then((res) =>{
              //  console.log(this.roleList);
                if(res.success){
                    this.tableList=res.items;

                    // console.log(this.tableList,this.groupIndex);
                    this.roleList=[];
                  
                    this.roleList=this.tableList[this.groupIndex].children;
                  
                    // Vue.set(this.tableList[this.groupIndex],this.groupIndex,this.tableList[this.groupIndex].children)
                    //  console.log(this.tableList);
                    // this.roleList=this.tableList[this.groupIndex].children;
                    // console.log(this.tableList);
                    this.currentRoleGroup=this.tableList[this.groupIndex];
                }
              })
            },

            //删除角色组
            deleteRoleGroup(row) {
              this.$confirm("确定删除此角色组吗?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.authCode,
                  url: "/Role/delGroup",
                  data:{
                    id:row.ID
                  }
                }).then( (res) =>{
                  if(res.success){
                    this.getList();
                      this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                  }
                })
              }).catch(() => {});
            },

            //删除角色
             deleteRole(row) {
              this.$confirm("确定删除此角色吗?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.authCode,
                  url: "/Role/delRole",
                  data:{
                    data:JSON.stringify({
                      ID:[row.ID]
                    })
                  }
                }).then( (res) =>{
                  if(res.success){
                    this.util.postAjax({
                      code:this.global.authCode,
                      url:"/Role/groupRole",
                    }).then((res) =>{
                    
                      if(res.success && res.items){
                          this.tableList=res.items;
                          this.roleList=this.tableList[this.groupIndex].children;

                          // console.log(this.roleList);
                        
                      }
                    })
                      this.$message({
                      type: 'success',
                      message: '删除成功!'
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
            openDialog(type,scope){
              this.dialogType=type;
             
              switch (type) {
                case "add":
                  this.dialogTitle="新增角色组"
                  break;

                case "edit":
                  this.dialogTitle="编辑角色组";
                  this.roleGroupForm=JSON.parse(JSON.stringify(scope.row));
                  
                  break;  
              }

              this.dialogFormVisible=true;
            },

            // 关闭弹框
            closeDialog(){
              this.dialogFormVisible=false;

              this.util.postAjax({
                code:this.global.authCode,
                url:"/Role/groupRole",
              }).then((res) =>{
               
                if(res.success && res.items){
                    this.tableList=res.items;
                    this.roleList=this.tableList[this.groupIndex].children;
                   
                    this.currentRoleGroup=this.tableList[this.groupIndex];
                }
              })
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
                url:"/Role/groupRole",
              }).then((res) =>{
               this.loading=false;
                if(res.success && res.items){
                   

                    this.tableList=res.items;

                    this.roleList=this.tableList[0].children;
                    this.currentRoleGroup=this.tableList[0];
                    this.groupIndex=0;
                    // this.totalPage=res.total;
                    // console.log(this.tableList)
                }
              })
            }

        },

        created() {
          this.getList();

         


          

        },
    }
</script>

<style scoped>

</style>
