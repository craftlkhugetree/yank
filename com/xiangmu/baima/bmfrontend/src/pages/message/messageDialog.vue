<template>
    <div>
        <el-form class="message-form" ref="form" :model="form" :hide-required-asterisk="true" :rules="rules" label-width="80px" style="margin:0" label-position="top">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="有效日期" prop="validtime">
                    <!-- <el-input v-model="form.validtime"></el-input> -->

                    <el-date-picker v-model="form.validtime" type="date" placeholder="选择日期" value-format="yyyyMMddhhmmss" style="width:100%" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="消息内容" prop="content">
                <el-input v-model="form.content" type="textarea" rows="8" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align:center">
            <div class="my-button" @click="() => $emit('closeDialog')">取 消</div>
            <div class="my-button green" style="margin-left:40px" @click="confirm">完 成</div>
        </div>
        
    </div>
</template>

<script>

export default{
    data(){
        
        return {
            form:{
                title:"",
                validtime:"",
                content:"",
              
            },
            rules:{
                title:[{required:true,message: '请输入标题', trigger: 'blur'}],
                validtime:[{required:true,message: '请选择有效日期', trigger: 'change'}],
                content:[{required:true,message: '请输入消息内容', trigger: 'blur'}],
                
            },
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() < Date.now()-24 * 60 * 60 * 1000;
                }
            }
            
        }
    },

    methods: {
        

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
                                message:"新建成功"
                            });

                            this.$emit("closeDialog");
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
        
    },

    created() {
        
       
                   
        this.$nextTick(()=>{
            this.$refs.form.clearValidate();
        })


        if(this.dialogRoleType=="edit"){
            this.form=this.roleForm;

            // console.log(this.form);
        }
    },
}
</script>

<style scoped>

</style>