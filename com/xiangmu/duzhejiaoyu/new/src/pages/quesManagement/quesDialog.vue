<template>
    <div>
        <el-form ref="form" :model="form"  :rules="rules" label-width="80px" style="margin:0 50px">
            <el-form-item label="题目内容" prop="quesTitle">
                <el-input v-model="form.quesTitle" type="textarea" rows="4"></el-input>

                <!-- <editor class="my-editor" id="editor_id" height="300px" style="width:480px" :content="editorText" :items="item"
                    pluginsPath="/static/kindeditor/plugins/" :uploadJson="uploadJson"
                    :loadStyleMode="false" @on-content-change="onContentChange"></editor> -->
            </el-form-item>

            <el-form-item v-if="quesType =='3'" label="答案" prop="isTrue">
                <el-radio-group v-model="form.isTrue" class="my-radio">
                    <el-radio :label="1" >对</el-radio>
                    <el-radio :label="0" >错</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item v-if="quesType =='1'" class="my-radio" :label=" '选项'+(index+1)" v-for="(item,index) in form.optionList" :key="index" required >
                <el-form-item style="margin: 0;width: 82%;display: inline-block;float: left" :prop="'optionList.' + index + '.optionItem'" :rules="rules.optionListRules.optionItem">
                    <el-input v-model="item.optionItem"></el-input>
                </el-form-item>

                <el-form-item style="margin: 0;width: 10%;display: inline-block;float: left">
                    <el-tooltip class="item" effect="dark" content="选中即为答案" placement="top-start">
                        <input class="my-radio" type="radio" :checked="item.isTrue" name="1" @change="radioClick(item,index)">
                        <!--<el-radio class="my-radio-without-name" label="1" :checked="item.isTrue" @change="radioClick(item,index)"></el-radio>!-->
                    </el-tooltip>
                    <el-button size="mini" @click="deleteOption(index)">删除</el-button>
                </el-form-item>
            
            </el-form-item>

            <el-form-item v-if="quesType =='2'" class="my-radio" :label=" '选项'+(index+1)" v-for="(item,index) in form.optionList" :key="index" required>
                <el-form-item style="margin: 0;width: 82%;display: inline-block;float: left" :prop="'optionList.' + index + '.optionItem'" :rules="rules.optionListRules.optionItem">
                    <el-input v-model="item.optionItem"></el-input>
                </el-form-item>

                <el-form-item style="margin: 0;width: 10%;display: inline-block;float: left">
                    <el-tooltip class="item" effect="dark" content="选中即为答案" placement="top-start">
                        <input  class="my-checkbox" type="checkbox" :checked="item.isTrue" @change="checkboxClick(item,index)">
                        <!--<el-checkbox class="my-radio-without-name" :checked="item.isTrue ==1" @change="checkboxClick(item,index)"></el-checkbox>!-->
                    </el-tooltip>
                    <el-button size="mini" @click="deleteOption(index)">删除</el-button>
                </el-form-item>
            </el-form-item>

            <el-form-item v-if="quesType !='3'">
                <div class="add-option" @click="addOption"><i class="el-icon-plus" style="margin-right:10px"></i>新增选增</div>
            </el-form-item>
        
            <el-form-item label="分类" prop="classId">
                <el-select v-model="form.classId" placeholder="请选择" style="width:100%"> 
                    <el-option v-for="item in classifyList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="题目分析">
                <el-input v-model="form.quesAnaly" type="textarea"></el-input>
            </el-form-item>

            <el-form-item label="是否必考">
                <el-switch v-model="form.isUse" :inactive-value="0" :active-value="1" ></el-switch>
            </el-form-item>

            <el-form-item label="图片">
                <el-button type="primary" plain size="small" @click="uploadFile">上传图片</el-button>

                <span div style="font-size: 12px;color: red">建议图片尺寸为1000*300,图片大小不超过10M</span>

                <div v-if="form.fileUrl" style="width: 150px;margin-top: 10px">
                    <img  :src="domain+form.fileUrl" style="width:100%;height:100%">
                </div>    
                
            </el-form-item>
            
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="() => $emit('closeDialog')">取 消</el-button>
            <el-button type="primary" @click="confirm" size="small">确 定</el-button>
        </div>

        <upload  v-show="false" ref="child" :url="uploadUrl" :size="10*1024" :lowSize="10" exts="png|jpg|bmp|gif" @choose="choosefile" @done="finish"></upload>


        
    </div>
</template>

<script>
import upload from '../../components/BaseUpload'
export default{
    props:{
        quesType:String,
        classifyList:Array,
        dialogTitle:String,
        dialogType:String,
        domain:String,
    },
    components:{upload},
    data(){
        return {
            form:{
                id:"",
                quesTitle:"",
                isTrue:"",
                classId:"",
                quesAnaly:"",
                isUse:0,
                fileUrl:"",
                optionList:[
                    {optionItem:"",isTrue:0},
                    {optionItem:"",isTrue:0},
                ],
                uploadUrl:"" ,
            },
            rules:{
                quesTitle:[{required:true,message: '请输入题目内容', trigger: 'blur'}],
                isTrue:[{required:true,message:"请选择答案",trigger:"blur"}],
                classId:[{required:true,message:"请选择题目类型",trigger:"change"}],
                quesAnaly:[{required:true,message:"请填写题目分析",trigger:"blur"}],
                optionListRules:{
                    optionItem:[{required: true, message: '选项不能为空', trigger: 'blur'}],
                }
            
            },

            uploadUrl:"",

            item:[
            'undo', 'redo', '|', 'preview', 'template', 'code', 'cut', 'copy', 'paste',
            'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'formatblock', 'fontname',
            'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
            'table', 'hr', 'emoticons', 'pagebreak', 'anchor', 'link', 'unlink',
            ],  //富文本框组件
            uploadJson:"http://file.dev.angke.com.cn/fileweb/rest/FileOut/saveFile",//富文本框上传地址
            editorText:"",
                
            
           
        }
    },

    methods: {
        // 富文本内容
        onContentChange(val){
        // console.log(a);
        this.form.quesTitle=val;
      },

        //删除选项
        deleteOption(index){
            // console.log(index);

            let length=this.form.optionList.length;

            if(length > 2 ){
                this.form.optionList.splice(index,1)
            }else{
                this.$message({
                    type:"error",
                    message:"请至少保留两个选项"
                })
            }
        },

        // 新增选项
        addOption(){
            // console.log(this.form.optionList);

            let isFill=this.form.optionList.every(v => v.optionItem.length > 0);
            
            if(isFill){
                 this.form.optionList.push({optionItem:"",isTrue:0})
            }else{
                this.$message({
                    type:"error",
                    message:"请填写上述选项内容"
                })
            }
            
        },

        //单选
        radioClick(item,index){
            this.form.optionList.forEach(v => {
                v.isTrue = 0;
            })
            item.isTrue=1;

            // console.log(this.form.optionList)
        },
        
        //多选
        checkboxClick(item,index){
            // console.log(item);
            if(item.isTrue == 0){
                item.isTrue =1
            }else{
                item.isTrue =0
            }

            // console.log(item);
        },

        //获取上传的url
        getUploadFile(){
            this.util.getUrlByCode(this.global.code,"/upload/add").then(res => {
                this.uploadUrl = res;
            })
        },

        //点击上传
        uploadFile(){
              this.$refs.child.$refs.uploaddom.click();
        },

        //上传图片
        choosefile(file){
            // console.log(file)
        },

        // 图片上传完成后
        finish(res){
            // console.log("上传后回调",res)
          
            this.form.fileUrl=res.item.fileUrl;
            this.$forceUpdate();
        },


        // 提交
        submit(){
            if(this.form.optionList){
                this.form.optionList.forEach( v=>{
                    if(v.optionItem.indexOf(",") != -1){
                    v.optionItem=v.optionItem.replace(",","，");
                    }
                });
            }

            let form={
                
                quesType:this.quesType,
                id:this.form.id,
                quesTitle:this.form.quesTitle,
                isTrue:this.quesType == "3" ? this.form.isTrue : null,
                classId:this.form.classId,
                quesAnaly:this.form.quesAnaly,
                isUse:this.form.isUse,
                fileUrl:this.form.fileUrl,
                optionList:this.quesType != "3" ? this.form.optionList : []
            }

            // console.log(form);

        
            let url="";
            switch (this.dialogType) {
                case "add":
                    url="/qusetion/add";
                    break;
                case "edit":
                    url="/qusetion/update";
                break;   
            }

            const loading = this.$loading({
                lock: true,
                text: "提交中",
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });

            this.util.postAjax({
                code:this.global.code,
                url:url,
                data:{
                    data:JSON.stringify(form)
                }
            }).then(res => {
                // console.log(res);
                loading.close();
                if(res.success){
                    this.$message({
                        type:"success",
                        message:this.dialogTitle+"成功"
                    });
                    
                    switch (this.dialogType) {
                        case "add":
                            this.$emit("closeDialog");
                            break;
                        case "edit":
                            this.$emit("closeEditDialog");
                        break;   
                    }
                }
            })
        },

        confirm(){
        
            // console.log(this.form);

            this.$refs["form"].validate((valid) => {
                if (valid) {
                    let isTrueArr=[];

                    this.form.optionList.forEach(v => {
                        if(v.isTrue == "1"){
                            isTrueArr.push(v);
                        }
                    })

                    // 单选题
                    if(this.quesType =="1"){
                        if(isTrueArr.length < 1){
                            this.$message({
                                type:"warning",
                                message:"请设置正确答案选项"
                            })
                        }else{
                            this.submit()
                        }
                        return;
                    }

                    // 多选题
                    if(this.quesType =="2"){
                        
                        if(isTrueArr.length < 2){
                            this.$message({
                                type:"warning",
                                message:"请设置正确答案选项(至少两个)"
                            })
                        }else{
                            this.submit()
                        }
                        return;
                    }

                    // 判断题
                    if(this.quesType =="3"){
                        this.submit()
                        return;
                    }
                } 
                });

            

            // return;

            
        }
    },

    created() {
        
        this.getUploadFile();

        // this.contentText=this.form.quesTitle;
        // console.log(this.form);
    },
}
</script>