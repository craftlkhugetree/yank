<template>
<div>
    <div class="activityclass_top">
        <h3>创建活动</h3>
    </div>
    <div class="create_basic">
        <h3>基本信息 
            <span @click="createSave('add1')"><i></i> 保存</span>
        </h3>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="actName">
                <el-input v-model="ruleForm.actName" style="width:50%;"></el-input>
            </el-form-item>
            <el-form-item label="活动时间" prop="actTime">
                <el-date-picker
                    v-model="ruleForm.actTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changetime">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动地点" prop="actLocation" style="width:50%;">
                <el-input v-model="ruleForm.actLocation"></el-input>
            </el-form-item>
            <el-form-item label="活动海报" required prop="actPostImg">
                <div class="create_upload" @click="addIMG" v-if="!addedIMG"> 
                    <i class="addupload "></i>
                    <p>上传图片</p>
                </div>
                <div class="create_upload1" v-else> 
                    <img :src="fileReadUrl+ruleForm.actPostImg" alt="">
                    <span class="deletdIMG" @click="deleteIMG"></span>
                </div>
                <el-button class="uploadbtn" type="primary" @click="addpost">海报图库</el-button>
            </el-form-item>
            <el-form-item label="活动分类" prop="actTypeId"  style="width:50%;">
                <el-select v-model="ruleForm.actTypeId" placeholder="搜索分类" @change="changeopt">
                    <el-option v-for="(v,i) in activityTypeLists" :key="i" :label="v.typeName" :value="v.id">{{v.typeName}}
                        <i class="el-icon-edit typeEdit" @click="editTYPE(v.id)"></i>
                    </el-option>
                </el-select>
                <i class="typeADD" @click="addTYPE_"></i>
            </el-form-item>
            <el-form-item label="活动人数" prop="actLimitNum" style="width:50%;">
                <el-input v-model="ruleForm.actLimitNum"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="create_detail">
        <h3>活动详情
            <span @click="createSave1('add2')"><i ></i> 保存</span>
        </h3>
        <div class="detailEditor">
            <angkeeditor id="editor_id" height="500px" width="100%" :option="option" ref="editor"></angkeeditor>
        </div>
    </div>
    <div class="create_form">
        <h3>报名表单
            <span class="save" @click="createSave2('add3')"><i ></i> 保存</span>
            <span class="preview" @click="preview"><i></i> 预览</span>
        </h3>
        <div class="create_switch">
            <span>
                报名开关&nbsp;&nbsp;
                <el-radio-group v-model="form.isOpenApply">
                    <el-radio :label='true'>开</el-radio>
                    <el-radio :label="false">关</el-radio>
                </el-radio-group>
            </span>
            <span>
                签到开关&nbsp;&nbsp;
                <el-radio-group v-model="form.isOpenSign">
                    <el-radio :label='true'>开</el-radio>
                    <el-radio :label="false">关</el-radio>
                </el-radio-group>
            </span>
        </div>
        <div class="create_add" v-if="!adddetail">
            <div class="created_add_" @click="adddetails"></div>
            <p>可添加报名活动需要填写的信息，无需报名可跳过</p>
        </div>
        <div class="create_add_detail" v-else>
            <h4>默认信息</h4>
            <div v-for="(v,i) in defaultform" :key="i">
                <el-checkbox v-model="v.checked" disabled>必填</el-checkbox>
                <span class="detailName">{{v.name}}</span>
                <input class="detail_input" type="text" v-model="v.value" placeholder="示例文案示例文案" @change="changeplace(v)">
            </div>
            <h4>更多信息</h4>
            <div v-for="(v,i) in addForms" :key="i">
                <el-checkbox v-model="v.checked">必填</el-checkbox>
                <!-- <span class="detailName">{{v.name}}</span> -->
                <input class="detailName" type="text" v-model="v.name" >
                <input class="detail_input" type="text" v-model="v.value" placeholder="示例文案示例文案" @change="changeplace(v)">
                <i class="delete_form" @click="deleteform(v,i)"></i>
                <div v-if="v.neechild" class="formMutiply">
                    <span v-for="(item,index) in v.children" :key="item.id">
                        <input type="text" placeholder="选项" v-model="item.value">
                        <i @click="deleteoption(v,index)"></i>
                    </span>
                    <i class="addchild" @click="addchild(v)"></i>
                </div>
                
            </div>
        </div>
        <div class="forms" v-if="adddetail">
            <h4>常用选项</h4>
            <div class="normal_form">
                <span v-for="(v,i) in normalForms" :class="{'selectNormal':v.selected}" :key="i" @click="selectNormal(v)">{{v.name}}
                    <i v-if="v.selected"></i>
                </span>
            </div>
            <h4 class="userH4">自定义选项</h4>
            <div class="user_form">
                <span v-for="(v,i) in userForms" :class="{'selectNormal':v.selected}" :key="i" @click="selectUser(v)">{{v.name}}</span>
            </div>
        </div>
    </div>
    <div class="created_fixedbtn">
        <el-button @click="previewAll">预览</el-button>
        <el-button class="created_fixedbtn1" @click="save('0')">保存草稿</el-button>
        <el-button class="created_fixedbtn1" @click="save('1')" type="primary">发布</el-button>
    </div>
    <upload v-show="false" :url="uploadUrl" ref="upload" exts="png|PNG|jpg|JPG" 
        @choose="chooseflie" @done="finish" 
    ></upload>
    <el-dialog
        :title="isedittype?'编辑':'新增'"
        :visible.sync="editDialog"
        width="30%"
        :before-close="handleClose">
        <el-input v-model="typeName" placeholder="请输入活动类别名称"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialog = false">取 消</el-button>
            <el-button type="primary" @click="addTYPE">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="海报库"
        :visible.sync="fileDialog"
        width="50%"
        :before-close="handleClose1">
        <post @selectpost="selectpost"></post>
    </el-dialog>
    <el-dialog
        title="预览表单"
        :visible.sync="formVisible"
        v-if="formVisible"
        width="50%"
        center>
        <myform 
            ref="childform"
            :item="formItemList"
            :isapply="isapply"
            />
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeform">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="预览"
        :visible.sync="formAllVisible"
        v-if="formAllVisible"
        width="70%"
        center>
        <formAll :ruleForm="ruleForm" :actDetail="actDetail"></formAll>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeformall">确 定</el-button>
        </span>
    </el-dialog>
    
</div>
</template>

<script>
import '../css/activity_css.css'
import createRule from '../js/activity'
import Vue from 'vue';
import angkeeditor from 'angkeeditor';
Vue.use(angkeeditor)
import util from '../js/util' 
import code from '../js/code'
import upload from '../components/upload'
import post from '../components/post'
import myform from '../components/form'
import formAll from '../components/previewForm'
export default {
    components:{upload,post,myform,formAll},
    props:{
        id:Number,
        edit:Boolean
    },
    data() {
        return {
            isapply:'1',
            formItemList:{},
            option:{
                uploadJson:code.imgsaveURL,//上传地址
                fileReadUrl:code.imgURL,//读取文件的地址
                templateUrl:code.templateURL+code.Templatelist,//模板路径
                saveTemplateUrl:code.templateURL+code.Templatesave ,//保存模板路径
                delTemplateUrl:code.templateURL+code.Templatedelete,//删除模板接口
                templateCode:code.code, //模板分类码
            },
            adddetail:false,//是不是需要新增其他信息
            activityTypeLists:[],
            uploadUrl:code.imgsaveURL,
            fileReadUrl:code.imgURL,
            uploadING:'',
            addedIMG:false,
            newAdd:true,//是不是直接新增
            newaddNUM:'',
            newId:'',//直接新增的id
            newEdit:0,
            ruleForm: {
                actName: '',
                actTime: '',
                actLocation: '',
                actPostImg: '',
                actTypeId:'',
                actLimitNum: '',
            },
            actDetail:'',//
            form:{
                isOpenApply:false,
                isOpenSign:false,
                formInfo:{}
            },
            rules: createRule.createRule,
            checked:true,
            defaultform:[
                {type:'0',name:'姓名',checked:true,label:'name',placeholder:"",eltype:'input',subtype: "text",rules:[{ message: '请输入姓名'}]},
                {type:'0', name:'手机号',checked:true,label:'tel',placeholder:"",eltype:'input',subtype: "text",rules:[{pattern:'/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/',message:'请输入正确的手机号'}]}
            ],
            normalForms:[//type:'0','1','2'//0默认1常规2自定义
                {type:'1',name:'学院',selected:false,checked:false,label:'campus',placeholder:"",eltype:'input',rules:[{message: '请输入学院'}]},
                {type:'1',name:'学号',selected:false,checked:false,label:'num',placeholder:"",eltype:'input',rules:[{message: '请输入学号'}]},
                {type:'1',name:'邮箱',selected:false,checked:false,label:'email',placeholder:"",eltype:'input',rules:[{pattern:'/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/',message:'请输入正确的邮箱'}]},
                {type:'1',name:'QQ号',selected:false,checked:false,label:'qq',placeholder:"",eltype:'input',rules:[{pattern:'/^[1-9]\d{4,9}$/',message:'请输入正确的qq'}]},
                {type:'1',name:'地址',selected:false,checked:false,label:'location',placeholder:"",eltype:'input',rules:[{message: '请输入地址'}]},
                {type:'1',name:'意见反馈',selected:false,checked:false,label:'des',placeholder:"",eltype:'input',rules:[{message: '请输入意见反馈'}]}
            ],
            userForms:[
                {type:'2',name:'文本框',selected:false,checked:false,label:'text',eltype:'input',rules:[{message: '请输入'}]},
                {type:'2',name:'数字框',selected:false,checked:false,label:'number',eltype:'input',rules:[{pattern:'/^[1-9]\d{4,9}$/',message: '请输入数字'}]},
                {type:'2',name:'日期框',selected:false,checked:false,label:'date',eltype:'date',rules:[{message: '请选择'}]},
                {type:'2',name:'时间框',selected:false,checked:false,label:'time',eltype:'time',rules:[{message: '请选择'}]},
                {type:'2',name:'单选框',selected:false,checked:false,label:'radio',neechild:true,children:[],eltype:'radio',rules:[{message: '请选择'}]},
                {type:'2',name:'多选框',selected:false,checked:false,label:'checkbox',neechild:true,children:[],eltype:'checkbox',rules:[{message: '请选择'}]},
                {type:'2',name:'下拉框',selected:false,checked:false,label:'select',neechild:true,children:[],eltype:'select',rules:[{message: '请选择'}]},
                // {type:'2',name:'附件',selected:false,checked:false,label:'file',eltype:'file',rules:[{message: '请输入学院'}]}
            ],
            addForms:[],
            isedit:false,
            isedittype:false,
            typeName:'',
            typeid:'',
            editDialog:false,
            fileDialog:false,//海报库
            formVisible:false,//预览弹窗
            formAllVisible:false,
        }
    },
    methods: {
        changetime(){
            console.log(this.ruleForm.actTime[0])
            console.log(this.ymd(this.ruleForm.actTime[0]))
        },
        //预览全部
        previewAll(){
            this.actDetail = this.$refs['editor'].getHTML();
            this.activityTypeLists.forEach(e=>{
                if(e.id==this.ruleForm.actTypeId){
                    this.ruleForm.TypeName = e.typeName;
                    return
                }
            })
            // this.form.formInfo = [];
            // this.form.formInfo = this.defaultform.concat(this.addForms);
            // this.form.formInfo.forEach(e=>{
            //     if(e.eltype== "checkbox"){
            //         e.value = []
            //     }else{
            //         e.value = ""
            //     }
            // })
            this.formAllVisible = true;
            
        },
        closeformall(){
            this.formAllVisible = false;
        },
        //预览
        preview(){
            this.form = {
                formInfo : this.defaultform.concat(this.addForms)
            }
            this.form.formInfo.forEach(e=>{
                if(e.eltype== "checkbox"){
                    e.value = []
                }else{
                    e.value = ""
                }
            })
            this.formItemList.formInfo = this.form.formInfo;
            this.formVisible = true;
        },
        closeform(){
            this.formVisible = false;
            this.formItemList = {};
        },
        //选择海报库
        selectpost(res){
            this.addedIMG = true;
            this.fileDialog = false;
            this.ruleForm.actPostImg = res.fileId;
        },
        deleteoption(obj,index){
            obj.children.splice(index,1)
        },
        changeplace(item){
            item.placeholder = item.value
        },
        addTYPE_(){
            this.typeName = "";
            this.editDialog = true;
            this.isedittype = false;
        },
        handleClose(){
          this.editDialog = false;
        },
        addpost(){
            this.fileDialog = true;
        },
        handleClose1(){
            this.fileDialog = false;
        },
        addTYPE(){
            if(!this.typeName){
                this.$message({
                    message: '请输入活动类型',
                    type: 'warning'
                });
                return
            }
            if(this.isedittype){
                util.postAjax({
                    code: code.code,
                    url: code.activityTypeupdate,
                    data: {
                        id:this.typeid,
                        typeName: this.typeName,
                    }
                }).then(res => {
                    if (res.success) {
                        this.editDialog = false;
                        this.getActivityTypeList()
                    }
                })
            }else{
                util.postAjax({
                code: code.code,
                url: code.activityTypesave,
                data: {
                    typeName: this.typeName,
                }
                }).then(res => {
                    if (res.success) {
                        this.editDialog = false;
                        this.getActivityTypeList()
                    }
                })
            }
        },
        editTYPE(id){
            this.editDialog = true;
            this.isedittype = true;
            this.typeid = id;
            util.postAjax({
              code: code.code,
              url: code.activityTypedetail,
              data: {
                id:id,
              }
            }).then(res => {
                if (res.success) {
                    this.editDialog = true;
                    this.typeName = res.item.typeName;
                }
            })
        },
        changeopt(){
            console.log('tag', this.ruleForm)
        },
        createSave(newaddNUM){
            if(!this.isedit || this.isedit=='false'){
                this.newAdd = true;//代表是新增
            }else{
                this.newAdd = false;//代表是编辑
            }
            this.newaddNUM = newaddNUM;
            this.save('',newaddNUM);
        },
        createSave1(newaddNUM){
            this.newaddNUM = newaddNUM;
            if(this.isedit){
                this.newEdit = "1";
                this.newId = this.id;
                this.save('',newaddNUM);
            }else{
                if(!this.newId){
                    this.$message({
                        message: '请先保存基本信息',
                        type: 'warning'
                    });
                }else{
                    this.save('',newaddNUM);
                }
            }
        },
        createSave2(newaddNUM){
            this.newaddNUM = newaddNUM;
            if(this.isedit){
                this.newId = this.id;
                this.save('',newaddNUM);
            }else{
                if(!this.newId){
                    this.$message({
                        message: '请先保存基本信息',
                        type: 'warning'
                    });
                }else{
                    this.save('',newaddNUM);
                }
            }
        },
        activityActivitydetail(id){
            util.postAjax({
                code: code.code,
                url: code.activityActivitydetail,
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.success){
                    this.addedIMG = true;
                    this.ruleForm = {
                        actName: res.item.activity.actName,
                        actLocation: res.item.activity.actLocation,
                        actPostImg: res.item.activity.actPostImg,
                        actTypeId:Number(res.item.activity.actTypeId),
                        actLimitNum: res.item.activity.actLimitNum,
                        actTime:''
                    };
                    // console.log(typeof(this.ruleForm.actTypeId))
                    console.log(this.util.formatTime(res.item.activity.gmtStart,'YYYY-MM-DD hh:mm:ss'))
                    this.ruleForm.actTime = [new Date(this.util.formatTime(res.item.activity.gmtStart,'YYYY/MM/DD hh:mm:ss')),new Date(this.util.formatTime(res.item.activity.gmtEnd,'YYYY/MM/DD hh:mm:ss'))];
                    console.log(this.ruleForm.actTime)
                    this.actDetail = res.item.actDetail;
                    this.$refs['editor'].setHtml(this.actDetail);
                    this.form = res.item.form;
                    if(this.form.formInfo.length>0){
                        this.adddetail = true
                    }
                    this.addForms = [],this.defaultform=[];
                    this.form.formInfo.forEach(e=>{
                        e.value = e.placeholder;
                        if(e.type=='1'||e.type=='2'){
                            this.addForms.push(e);
                            this.normalForms.forEach(v=>{
                                if(e.name==v.name){
                                    v.selected = true
                                }
                            })
                        }else{
                            this.defaultform.push(e);
                        }
                    })
                }
            })

        },
        deleteform(item,index){
            this.addForms.splice(index,1);
            this.normalForms.forEach(e=>{
                if(e.label==item.label){
                    e.selected = false;
                    e.checked = false;
                }
            })
            console.log(this.addForms)
        },
        addchild(item){
            var obj = {
                name:'选项',selected:false,label:'option',value:''
            }
            item.children.push(obj)
        },
        //活动类别
        getActivityTypeList() {
            util.postAjax({
                code: code.code,
                url: code.activityTypelist,
                data: {
                    typeName: '' //名称模糊查询
                }
            }).then(res => {
                if (res.success) {
                    this.activityTypeLists = res.items;
                }
            })
        },
        deleteIMG(){
            this.uploadING = "";
            this.addedIMG = false;
        },
        //上传图片
        addIMG(){
            this.addedIMG = false;
            this.$refs.upload.toupload();
        },
        adddetails(){
            this.adddetail = true;
        },
        chooseflie(res){
            console.log(res)
        },
        finish(res){
            this.addedIMG = true;
            this.ruleForm.actPostImg = res.data[0].ID;
        },
        selectNormal(item){
            if(item.selected){
                return
            }
            item.selected = !item.selected;
            this.addForms.push(item);
            console.log(this.normalForms)
        },
        selectUser(item){
            this.addForms.push(item);
            console.log(this.userForms)
            console.log(this.normalForms)
        },
        activityActivitysave(activity,actDetail,form,isdraft,newadd){
            var savecode = this.isedit||this.newaddNUM=='add2'||this.newaddNUM=='add3'?code.activityActivityupdate:code.activityActivitysave;
            util.postAjax({
                code: code.code,
                url: savecode,
                data: {
                    activity:JSON.stringify(activity),
                    actDetail:actDetail,
                    form: JSON.stringify(form)   
                }
            }).then(res => {
                if (res.success) {
                    if(newadd=='add1'){
                        this.newId = res.item;
                        this.activityActivitydetail(this.newId);
                    }
                    this.$message({
                        type: 'success',
                        message: '创建活动成功!'
                    });
                    if(newadd){
                        return
                    }
                    if(isdraft=='1'){
                        this.$router.push('activityList');
                    }else{
                        this.$router.push('activityDraft');
                    }
                }
            })
        },
        ymd(time) {
            console.log(time)
            var myDate = new Date(time);
            var month = myDate.getMonth() + 1;
            if (month >= 1 && month <= 9) { //月
                month = "0" + month;
            }
            var strDate = myDate.getDate();
            if (strDate >= 0 && strDate <= 9) { //日
                strDate = "0" + strDate;
            }
            var hour = myDate.getHours(); // 时

            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            var minutes = myDate.getMinutes(); // 分
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }
            var seconds = myDate.getSeconds(); // 分
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + seconds;
            }
            return ''+myDate.getFullYear() + month + strDate+hour+minutes+seconds;
        },
        save(isdraft,newadd){//第一个传参是是不是存草稿，0是存 1 不是
            console.log(this.ruleForm.actTime[0])
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    console.log('tag', this.ruleForm,this.form);
                    var obj = {
                        actTypeId: this.ruleForm.actTypeId,  //活动类型id
                        actName: this.ruleForm.actName,  //活动名称
                        actLocation: this.ruleForm.actLocation,  // 活动地点
                        actPostImg: this.ruleForm.actPostImg, // 活动海报id
                        actLimitNum: this.ruleForm.actLimitNum?this.ruleForm.actLimitNum:0, // 活动限制数量
                        gmtStart: this.ymd(this.ruleForm.actTime[0]),  //活动开始时间14位
                        gmtEnd: this.ymd(this.ruleForm.actTime[1]),  //活动结束时间14位
                        isDraft: false  //是否草稿
                    }
                    if(isdraft=='0'){
                        obj.isDraft = true;
                    }else if(isdraft=='1'){
                        obj.isDraft = false;
                    }
                    if(this.isedit){
                        obj.id = this.id
                    }
                    if(this.newaddNUM=='add2'||this.newaddNUM=='add3'){
                        obj.id = this.newId
                    }
                    this.actDetail = this.$refs['editor'].getHTML();
                    this.form.formInfo = [];
                    this.form.formInfo = this.defaultform.concat(this.addForms);
                    this.form.formInfo.forEach(e=>{
                        if(e.eltype== "checkbox"){
                            e.value = []
                        }else{
                            e.value = ""
                        }
                        
                    })
                    // console.log('this.form.formInfo', this.form.formInfo)
                    // return
                    this.activityActivitysave(obj,this.actDetail,this.form,isdraft,newadd)
                    
                } else {
                    return false;
                }
            });
        }
    },
    created() {
        this.getActivityTypeList();
        this.isedit = this.edit;
        if(typeof this.isedit=='boolean'){
            if(this.isedit){
                this.activityActivitydetail(this.id);
            }
        }else{
            if(this.isedit=='true'){
                this.activityActivitydetail(this.id);
            }
        }
        
    },

}
</script>
