<template>
    <div>
        <div class="common-content">
            <div class="message-top">
                <span class="title">消息通知</span>
                <div class="my-button green" style="float: right;" @click="openDialog">
                    <i class="el-icon-plus"></i>
                    <span>新建通知</span>
                </div>
            </div>
        </div>
        
        <div  v-if="messageList.length > 0"  style="margin-top:20px">
            <el-row :gutter="20">
              <el-col :span="8">
                <div style="min-width:300px" v-loading="loading">
                    <ul>
                        <li class="common-content message-item" :class="{active:activeIndex == index }" v-for="(item,index) in messageList" :key="index" @click="activeChange(index,item)">
                            <div class="top">
                                <span class="title ellipsis">{{item.title}}</span>
                                <span class="valid-date" :class="{'invalid-date': (util.formatTime(today,'yyyyMMddhhmmss') > item.validtime)}">有效日期：{{util.formatTime(item.validtime,"yyyy.MM.dd")}}</span>
                            </div>
                            <div class="content more-ellipsis">{{item.content}}</div>
                            <div class="bottom">
                                <span class="date">{{util.formatTime(item.updatetime,"yyyy.MM.dd")}}</span>
                                <span class="delete" @click.prevent.stop="deleteMessage(item)">删除</span>
                            </div>
                        </li>
                    </ul>
                </div>

                 <!--分页-->
                <div style="text-align:center">
                    <!-- <span>显示{{limit}}条，共{{totalPage}}条</span> -->
                    <el-pagination  background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                                :current-page="currentPage" @current-change="getCurrentChange"></el-pagination>
                </div>
              </el-col>

              <el-col :span="16">
                <div v-if="canEdit" class="common-content single-message">
                    <div class="top">
                        <span class="title">{{messageObj.title}}</span>
                        <span class="valid-date" :class="{'invalid-date': (util.formatTime(today,'yyyyMMddhhmmss') > messageObj.validtime)}">有效日期:{{util.formatTime(messageObj.validtime,"yyyy.MM.dd")}}</span>
                    </div>

                    <div class="content">{{messageObj.content}}</div>

                    <div v-if="util.formatTime(today,'yyyyMMddhhmmss') > messageObj.validtime" style="text-align:center">
                         <div class="my-button grey" style="margin:150px auto;display:inline-block">
                            <span>编辑</span>
                        </div>
                    </div>

                    <div v-else style="text-align:center">
                         <div class="my-button green" @click="openEdit" style="margin:150px auto;display:inline-block">
                            <span>编辑</span>
                        </div>
                    </div>

                    
                   
                </div>

                <div v-else class="common-content single-message">
                   <el-form class="message-form" ref="form" :model="form" :hide-required-asterisk="true" :rules="rules" label-width="80px" style="margin:0" label-position="top">
                    
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="form.title" placeholder="请输入"></el-input>
                    </el-form-item>
               
                    <el-form-item label="有效日期" prop="validtime">
                        <el-date-picker v-model="form.validtime" type="date" placeholder="选择日期" value-format="yyyyMMddhhmmss" style="width:100%" :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>

                    <el-form-item label="消息内容" prop="content">
                        <el-input v-model="form.content" type="textarea" rows="8" placeholder="请输入"></el-input>
                    </el-form-item>

                    <div style="text-align:center">
                        <div class="my-button green" style="margin-left:40px" @click="confirm">完 成</div>
                    </div>

                     
                </el-form>

                </div>


              </el-col>
            </el-row>

            
        </div>

        <div v-else style="text-align:center">
            <img src="../../../static/images/no-message.png">
            <div style="margin-top:-60px;color:#999999;font-size:16px">还没有任何通知，需要新建通知哦</div>
        </div>

         <!--弹框-->
        <el-dialog class="my-dialog" title="新建通知" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                    width="800px" :close-on-click-modal="false">
            <dialog-form ref="child"  @closeDialog="closeDialog"></dialog-form>
        </el-dialog> 
    
    </div>
    
</template>

<script>
import dialogForm from '../message/messageDialog'
    export default{
        components:{
            dialogForm
        },
        data(){
            return{
                totalPage:1,
                limit:5,
                currentPage:1,
                loading:false,
                messageList:[],
                dialogFormVisible:false,
                activeIndex:0,
                messageObj:{},
                form:{},
                 rules:{
                    title:[{required:true,message: '请输入标题', trigger: 'blur'}],
                    validtime:[{required:true,message: '请选择有效日期', trigger: 'change'}],
                    content:[{required:true,message: '请输入消息内容', trigger: 'blur'}],
                },
                canEdit:true,
                activeId:"",
                today:new Date().getTime(),
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < Date.now()-24 * 60 * 60 * 1000;
                    }
                },
                noList:true

        
            }
        },

        methods: {
            //删除
            deleteMessage(row) {
              this.$confirm('此操作将永久删除该条通知, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.util.postAjax({
                  code:this.global.code,
                  url: "/notice/deleteByIds",
                  data:{
                    ids:row.id
                  }
                }).then( (res) =>{
                  this.getList();
                  this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                })
              }).catch(() => {});
            },

            // 打开编辑页面
            openEdit(){
                this.canEdit=false;
                this.form={
                    id:this.messageObj.id,
                    title:this.messageObj.title,
                    validtime:this.messageObj.validtime,
                    content:this.messageObj.content,
                }
            },

            // 提交
            confirm(){

                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let form={
                            title:this.form.title,
                            validtime:this.form.validtime,
                            content:this.form.content,
                            id:this.form.id
                        }

                        console.log(form);

                        // return false;
                        const loading = this.$loading({
                            lock: true,
                            text: "提交中",
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

                        this.util.postAjax({
                            code:this.global.code,
                            url:"/notice/save",
                            isRep:true,
                            data:form
                        }).then(res => {
                            loading.close();
                            if(res.success){
                            this.$message({
                                    type:"success",
                                    message:"编辑成功"
                                });

                             this.getList();

                             this.getMessage();
                             this.canEdit=true;   
                            }else{
                                this.$message({
                                    type:"error",
                                    message:res.data.message
                                }); 
                            }
                        })
                    } 
                });
            },
        

            //获取单条消息
            getMessage(){
                this.util.postAjax({
                code:this.global.code,
                url:"/notice/findById",
                data:{
                    // id:id || this.messageList[0].id
                    id:this.activeId
                    }
                }).then(res => {
                    if(res.success){
                        console.log(res);
                        this.messageObj=res.item;
                        this.canEdit=true;
                    }
                })
            },

            //点击消息列表
            activeChange(index,item){
                this.activeIndex = index;
                this.activeId=item.id;
                this.getMessage()
            },

            //点击分页
            getCurrentChange(currentPage){
                this.currentPage=currentPage;
                this.getList()
            },

            // 关闭弹框
            closeDialog(){
              this.dialogFormVisible=false;
              this.getList();
            },
            
            // 打开新建弹框
            openDialog(){
                this.dialogFormVisible=true;
            },

            //获取列表
            getList(){
                this.loading=true;
                this.util.postAjax({
                code:this.global.code,
                url:"/notice/pageQuery",
                data:{
                    params:JSON.stringify({
                        page:this.currentPage,
                        limit:this.limit,
                    })
                }
                }).then(res =>{
                this.loading=false;
                if(res.success == true){
                    this.messageList = res.items;
                    this.totalPage=res.total;

                    if(this.activeIndex == 0 && this.messageList){
                        this.activeId=this.messageList[0].id;
                        this.getMessage();
                    }else{

                    }
                    
                    console.log(this.messageList)
                }
                })
            },
        },

        created() {
            this.getList();
            
            console.log(this.today)
        },
    }
</script>