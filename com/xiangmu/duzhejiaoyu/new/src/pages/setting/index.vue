<template>
  <div class="common-content" v-loading="loading">
      <div class="setting-item">
        <div class="title">参数设置</div>

        <el-form  class="setting-page" ref="form" :model="form" label-width="150px" style="margin:0 50px" >
            <el-form-item label="新生身份证登录:" >
               <el-switch v-model="ISNEWLOGIN" inactive-value="0" active-value="1" ></el-switch>
            </el-form-item>

            <el-form-item label="考试IP地址限制:" prop="ISIPOPEN" >
               <el-switch v-model="ISIPOPEN" inactive-value="0" active-value="1" @change="IPChange"></el-switch>
            </el-form-item>

            <el-form-item v-if="ISIPOPEN == '1'" label="考试IP地址范围:">
               <el-input v-model="IPSCOPE1" placeholder="请输入" size="small" style="width:200px"></el-input>
               <span>--</span>
                <el-input v-model="IPSCOPE2" placeholder="请输入" size="small" style="width:200px"></el-input>
            </el-form-item>

            <el-form-item v-if="ISIPOPEN == '1'" label="考试地址:">
               <el-input v-model="KAOSHIADDR" placeholder="请输入" size="small" style="width:420px"></el-input>
            </el-form-item>

            <el-form-item label="按顺序学习:" prop="ISLEARNNUMOPEN">
               <el-switch v-model="ISLEARNNUMOPEN" inactive-value="0" active-value="1" ></el-switch>
               <span style="color:#FAAC16;margin-left:30px">开启后，读者需要按顺序进行在线学习</span>
            </el-form-item>
        </el-form>

      </div>

      <div class="setting-item" >
        <div class="title">模块配置</div>

        <el-form  class="setting-page" ref="form" :model="form" label-width="150px" style="margin:0 50px">
            <el-form-item label="全景导览地址配置:" >
               <el-input v-model="GLOBALNAV" placeholder="请输入" size="small" style="width:420px"></el-input>
            </el-form-item>
        </el-form>

      </div>

      <el-button type="primary" size="small" style="width:100px;margin:20px" @click="save">保存</el-button>
    
  </div>
</template>

<script>

export default {
    
        data(){
            var checkAge = (rule, value, callback) => {
            if (!value ) {
              return callback(new Error('请输入考试IP地址范围'));
            }else{
                callback();
            }
          }
        return{
          loading:false,
          form:{},
          rulesList:[],
          rules:{
            // IPSCOPE1:[{required:true,message: '请输入考试IP地址范围', trigger: 'blur'}],
            IPSCOPE1:[{validator:checkAge, trigger: 'blur'}],
            // IPSCOPE2:[{required:true,message: '请输入', trigger: 'blur'}],
            KAOSHIADDR:[{required:true,message: '请输入考试地址', trigger: 'blur'}],
          },
          IPSCOPE1:"",
          IPSCOPE2:"",
          KAOSHIADDR:"",
          ISNEWLOGIN:"",
          ISLEARNNUMOPEN:"",
          GLOBALNAV:"" ,
          ISIPOPEN:""
          
        }
    },

    methods: {
      //保存
      save(){
        var reg =/^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
        var re = new RegExp(reg);

        var reg2=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
        var re2 = new RegExp(reg2);

       if((this.ISIPOPEN=='1' && !this.IPSCOPE1) || (this.ISIPOPEN=='1' && !this.IPSCOPE2)){
         this.$message({
           type:"error",
           message:"请输入考试IP地址范围"
         })
         return;
       }

       if((this.ISIPOPEN=='1' && !re.test(this.IPSCOPE1)) ||(this.ISIPOPEN=='1' && !re.test(this.IPSCOPE2)) ){
            this.$message({
              type:"error",
              message:"请填写有效的IP地址！"
            })
            return;
        }

       let scope1Arr= this.IPSCOPE1.split(".");
       let scope2Arr= this.IPSCOPE2.split(".");
       let scope1Last= this.IPSCOPE1.split(".")[3];
       let scope2Last= this.IPSCOPE2.split(".")[3];

      //  console.log(scope1Arr);
      //  console.log(scope2Arr);

       let flag=true;
       let scope1Str="";
       let scope2Str="";
       scope1Arr.forEach( (v,i) => {
         if(i < 3){
           scope1Str += v
         }
       })

        scope2Arr.forEach( (v,i) => {
         if(i < 3){
           scope2Str += v
         }
       })
        

        // console.log((scope1Str != scope2Str) || (scope1Last >= scope2Last));

        if(this.ISIPOPEN=='1' && ((scope1Str != scope2Str) || (scope1Last >= scope2Last))){
            this.$message({
              type:"error",
              message:"请确认IP地址范围是否符合规范！"
            })
            return;
        }

       if(this.ISIPOPEN=='1' && !this.KAOSHIADDR){
         this.$message({
           type:"error",
           message:"请输入考试地址"
         })
         return;
       }

       if(this.GLOBALNAV && !re2.test(this.GLOBALNAV)){
            this.$message({
              type:"error",
              message:"请填写有效的网址！"
            })
            return;
        }

        this.rulesList.forEach(v => {
                switch (v.rcode) {
                  case "ISNEWLOGIN":
                      v.rval =this.ISNEWLOGIN;
                    break;
                  case "ISIPOPEN":
                      v.rval=this.ISIPOPEN;
                    break;
                  case "IPSCOPE":
                      v.rval=this.IPSCOPE1 +"-"+this.IPSCOPE2
                    break;
                  case "ISLEARNNUMOPEN":
                      v.rval=this.ISLEARNNUMOPEN;
                    break;      
                  case "GLOBALNAV":
                      v.rval=this.GLOBALNAV;
                    break;
                   case "KAOSHIADDR":
                      v.rval=this.KAOSHIADDR;
                    break;   
                }
              })

        //   let arr=[];
        //  this.rulesList.forEach(v => {
        //    arr.push({id:v.id,rval:v.rval})
        //  });
         
         const loading = this.$loading({
                lock: true,
                text: "提交中",
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });

         this.util.postAjax({
                code:this.global.code,
                url:"/rules/update",
                isRep:true,
                data:this.rulesList
            }).then(res => {
              loading.close();
              
              if(res.success){
                  this.$message({
                  type:"success",
                  message:"保存成功"
                })
              }
            })      

        // console.log(this.rulesList)
      },

      // IP地址切换
      IPChange(){
        if(this.ISIPOPEN == 0){
           this.IPSCOPE1="";
          this.IPSCOPE2="";
          this.KAOSHIADDR="";
            // this.form={
            //   IPSCOPE1:"",
            //   IPSCOPE2:"",
            //   KAOSHIADDR:"",
            //   ISNEWLOGIN:this.form.ISNEWLOGIN,
            //   ISLEARNNUMOPEN:this.form.ISLEARNNUMOPEN,
            //   GLOBALNAV:this.form.GLOBALNAV
            // }
        }
      },

      // 获取参数列表
        getSettingList(){
          this.loading=true;
          this.util.postAjax({
            code:this.global.code,
            url:"/rules/list",
          }).then(res => {
            console.log(res)
            this.loading=false;
            
            if(res.success){
              this.rulesList=res.items;
              res.items.forEach(v => {
                switch (v.rcode) {
                  case "ISNEWLOGIN":
                      this.ISNEWLOGIN=v.rval;
                    break;
                  case "ISIPOPEN":
                      this.ISIPOPEN=v.rval;
                    break;
                  case "IPSCOPE":
                      let arr=v.rval.split("-");
                      this.IPSCOPE1=arr[0];
                      this.IPSCOPE2=arr[1];
                    break;
                  case "ISLEARNNUMOPEN":
                      this.ISLEARNNUMOPEN=v.rval;
                    break;      
                  case "GLOBALNAV":
                      this.GLOBALNAV=v.rval
                    break;
                   case "KAOSHIADDR":
                      this.KAOSHIADDR=v.rval;
                    break;   
                }
              })
            }
          })
        }
    
    },

    created() {
      this.getSettingList();
    },

   
}
</script>>