<template>
    <div>
        <el-form ref="form" :model="form"  :rules="rules" label-width="100px" style="margin:0 50px">
            <el-form-item label="角色组名称" prop="NAME">
                <el-input v-model="form.NAME"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="() => $emit('closeDialog')">取 消</el-button>
            <el-button type="primary" @click="confirm" size="small">确 定</el-button>
        </div>
        
    </div>
</template>

<script>
// import upload from '../../components/BaseUpload'
export default{
    
    // components:{upload},
    props:{
        roleGroupForm:Object,
        dialogType:String,
        dialogTitle:String
    },

    data(){
        return {
            form:{
                ID:"",
                NAME:"",
            },
            rules:{
                NAME:[{required:true,message: '请输入角色组名称', trigger: 'blur'}]
            },
        }
    },

    methods: {

        // 提交
        confirm(){
            // console.log(this.form);
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    let form={
                        ID:this.form.ID,
                        NAME:this.form.NAME,
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
                        url:"/Role/addGroup",
                        data:{
                            data:JSON.stringify(form)
                        }
                    }).then(res => {
                        loading.close();
                        if(res.success){
                             this.$message({
                                type:"success",
                                message:this.dialogTitle+"成功"
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

            

            // return;

            
        },

       

        // 获取角色列表
        getRoleList(){
            this.util.postAjax({
                code:this.global.authCode,
                url:"/Role/groupRole",
              }).then(res => {
                   
                  if(res.success && res.items){
                    let arr=[];  
                    res.items.forEach(v => {
                        if(v.children){
                            v.children.forEach(m => {
                                arr.push(m)
                            })
                        }
                    })

                    this.roleList=arr;
                    
                  }
              })
        }
    },

    created() {
        
        
        this.getRoleList();
                   
        this.$nextTick(()=>{
            this.$refs.form.clearValidate();
        })

        if(this.dialogType =="edit"){
            this.form=this.roleGroupForm;
        }

        // console.log(this.roleGroupForm)
        // console.log(this.dialogType)

        // this.contentText=this.form.quesTitle;
       
    },
}
</script>