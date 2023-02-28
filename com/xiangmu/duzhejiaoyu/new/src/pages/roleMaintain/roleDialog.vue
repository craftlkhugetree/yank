<template>
    <div>
        <el-form ref="form" :model="form"  :rules="rules" label-width="80px" style="margin:0 50px">
            <el-form-item label="角色名称" prop="NAME">
                <el-input v-model="form.NAME"></el-input>
            </el-form-item>

            <el-form-item label="描述" prop="DES">
                <el-input v-model="form.DES" type="textarea"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="() => $emit('closePwdDialog')">取 消</el-button>
            <el-button type="primary" @click="confirm" size="small">确 定</el-button>
        </div>
        
    </div>
</template>

<script>
// import upload from '../../components/BaseUpload'
export default{
    props:{
        groupID:String,
        dialogRoleTitle:String,
        dialogRoleType:String,
        roleForm:Object
       
    },
    // components:{upload},
    data(){
        
        return {
            form:{
                ID:"",
                NAME:"",
                DES:"",
              
            },
            rules:{
                DES:[{required:true,message: '请输入描述', trigger: 'blur'}],
                NAME:[{required:true,message: '请输入角色名称', trigger: 'blur'}],
                
            },
            
        }
    },

    computed: {
          userInfo() {
            return this.$store.state.userInfo;
          }
        },

    methods: {
        

        // 提交
        confirm(){

            // console.log(this.form);

            // return false;

            this.$refs["form"].validate((valid) => {
                if (valid) {
                    let form={
                        ID:this.form.ID,
                        NAME:this.form.NAME,
                        DES:this.form.DES,
                        GROUPID:this.dialogRoleType=="add" ? this.groupID : this.form.GROUPID,
                        CODE:"CODE",
                        ISUSE: 1,
                        ISDELETE:0,
                    }

                    // console.log(form);

                    // return false;
                    const loading = this.$loading({
                        lock: true,
                        text: "提交中",
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });

                    this.util.postAjax({
                        code:this.global.authCode,
                        url:"/Role/addRole",
                        data:{
                            data:JSON.stringify(form)
                        }
                    }).then(res => {
                        loading.close();
                        if(res.success){
                           this.$message({
                                type:"success",
                                message:this.dialogRoleTitle+"成功"
                            });

                            this.$emit("closePwdDialog");
                        }else{
                            this.$message({
                                type:"error",
                                message:res.data.message
                            }); 
                        }
                    })
                } 
            });

            

            // return;

            
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