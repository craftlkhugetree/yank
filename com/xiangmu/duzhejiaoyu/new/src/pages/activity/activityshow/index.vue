<template>
    <div class="activityShow_box">
        <div class="activityList_top">
            <h3>{{activityNAME}}</h3>
            <div class="my-tabs-wrap">
                <el-tabs class="my-tabs" v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="照片墙" name="photo"></el-tab-pane>
                    <el-tab-pane label="图文" name="text"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="activityShow_text" v-if="activeName=='photo'">
            <el-button type="primary" @click="uploadIMG">上传图片</el-button>
            <ul v-if="total>0"  class="activityShow_imgs clearfix">
                <li v-dragging="{ item: v }" v-for="(v,i) in imgList" :key="i" @mouseover="enterIMG(v)" @mouseleave="outIMG(v)">
                    <div class="show_img" >
                        <img :src="imgURL+v.fileId" alt="">
                    </div>
                    <p class="show_text" v-if="v.isedit">{{v.fileRemark}} <i @click="edit_img(v,i)"></i></p>
                    <p v-else class="show_text_">
                        <el-input v-model="v.fileRemark" class="name" placeholder="" size="small"></el-input>
                        <i @click="save_img(v)"></i>
                    </p>
                    <div class="deleteIMG" v-if="v.isdelete">
                        <div @click="deleteIMG(v)"></div>
                    </div>
                </li>
            </ul>
            <div v-else class="nodata">
            </div>
        </div>
        <div class="activityEdotor" v-else>
            <angkeeditor id="editor_id" height="500px" width="100%" :option="option" ref="editor"></angkeeditor>
        </div>
        <div class="activityShow_fixedBtn" v-if="activeName=='text'">
            <el-button @click="save">保存</el-button>
        </div>
        <upload  v-show="false" :multiple=true :url="uploadUrl" ref="upload" exts="png|PNG|jpg|JPG" 
            @choose="chooseflie" @done="finish" @unfinished="unfinished"
        ></upload>
    </div>
</template>
<script>
import Vue from 'vue';
import angkeeditor from 'angkeeditor';
Vue.use(angkeeditor)
import VueDND from 'awe-dnd'
Vue.use(VueDND)
import "../css/activity_css.css";
import upload from '../components/upload'
import util from '../js/util'
import code from '../js/code'
export default {
    components:{upload},
    props:{
        ID:Number||String,
        activityNAME:String
    },
    data() {
        return {
            imgList:[],
            total:0,
            draging:undefined,
            imgURL:code.imgURL,
            activeName:'photo',
            option:{
                uploadJson:code.imgsaveURL,//上传地址
                fileReadUrl:code.imgURL,//读取文件的地址
                templateUrl:code.templateURL+code.Templatelist,//模板路径
                saveTemplateUrl:code.templateURL+code.Templatesave ,//保存模板路径
                delTemplateUrl:code.templateURL+code.Templatedelete,//删除模板接口
                templateCode:code.code, //模板分类码
            },
            uploadUrl:code.imgsaveURL,
            activityText:{}
        }
    },
    methods: {
        //
        activityFilelistShow(){
            util.postAjax({
                code: code.code,
                url: code.activityFilelistShow,
                data:{
                    actId: this.ID//名称模糊查询
                }
            }).then(res=>{
                if(res.success){
                    this.imgList = res.items;
                    this.total = res.total;
                    if(this.imgList.length>0){
                        this.imgList.forEach(e=>{
                            e.isedit = true;
                            e.isdelete = false
                        })
                    }
                    
                }
            })
        },
        edit_img(item){
            item.isedit = false;
            this.$forceUpdate();
        },
        save_img(item){
            this.activityFileupdateShow(item.id,item.fileId,item.fileRemark)
        },
        enterIMG(item){
            item.isdelete = true;
            this.$forceUpdate();
        },
        outIMG(item){
            item.isdelete = false;
            this.$forceUpdate();
        },
        deleteIMG(item){
             this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                 util.postAjax({
                    code: code.code,
                    url: code.activityFiledeleteShow,
                    data:{
                        id: item.id,//名称模糊查询
                    }
                }).then(res=>{
                    if(res.success){
                        this.activityFilelistShow();
                        this.$message({
                            message:"删除成功",
                            type:"success"
                        })
                    }
                })
            })
        },
        //上传图片
        uploadIMG(){
            this.$refs.upload.toupload();
        },
        unfinished(){
            console.log(22222222)
        },
        //题库上传
        chooseflie:function(file){
            console.log("上传后回调");
        },
        activityFilesaveShowBatch(fileArr,fileRemark){
            util.postAjax({
                code: code.code,
                url: code.activityFilesaveShowBatch,
                data:{
                    actId: this.ID,//名称模糊查询
                    arr:JSON.stringify(fileArr)
                }
            }).then(res=>{
                if(res.success){
                    this.activityFilelistShow();
                    this.$message({
                        message:"上传成功",
                        type:"success"
                    })
                }
            })
        },
        activityFileupdateShow(id,fileId,fileRemark){
            util.postAjax({
                code: code.code,
                url: code.activityFileupdateShow,
                data:{
                    id: id,//名称模糊查询
                    fileId: fileId,//文件id
                    fileRemark: fileRemark//图片说明
                }
            }).then(res=>{
                if(res.success){
                    this.activityFilelistShow();
                    this.$message({
                        message:"编辑成功",
                        type:"success"
                    })
                }
            })
        },
        finish(res){
            console.log("结束后");
            var arr = [];
            var num = this.imgList.length;
            this.imgList.forEach(e=>{
                var obj = {
                    id: e.id,
                    pId: this.ID,  //这个传活动id
                    fileId: e.fileId,  //文件id
                    fileRemark: e.fileRemark,  //说明
                    fileSort: e.fileSort
                }
                arr.push(obj)
            })
            res.data.forEach((e,i)=>{
                var obj = {
                    id: "",
                    pId: this.ID,  //这个传活动id
                    fileId: e.ID,  //文件id
                    fileRemark: "",  //说明
                    fileSort: i+num
                }
                arr.push(obj)
            })
            this.activityFilesaveShowBatch(arr,'')
        },
        handleClick(tab, event) {
            if(tab.name=='photo'){
                this.activeName = 'photo';
                this.activityFilelistShow();
            }else{
                this.activeName = 'text';
                this.activityTextgetImgText();
            }
        },
        activityTextgetImgText(){
            util.postAjax({
                code: code.code,
                url: code.activityTextgetImgText,
                data:{
                    actId: this.ID,//名称模糊查询
                }
            }).then(res=>{
                if(res.success){
                    this.activityText = res.item;
                    this.$refs['editor'].setHtml(this.activityText.textText)
                }
            })
        },
        activityTextupdateImgText(textText){
            util.postAjax({
                code: code.code,
                url: code.activityTextupdateImgText,
                data:{
                    id: this.activityText.id, 
                    textText:textText
                }
            }).then(res=>{
                if(res.success){
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    });
                }
            })
        },
        activityFilesortImgText(id1,id2){
            util.postAjax({
                code: code.code,
                url: code.activityFilesortImgText,
                data:{
                    id1:id1, 
                    id2:id2
                }
            }).then(res=>{
                if(res.success){
                    this.activityFilelistShow();
                    // this.$message({
                    //     message: '排序成功',
                    //     type: 'success'
                    // });
                }
            })
        },
        save(){
            this.activityTextupdateImgText(this.$refs['editor'].getHTML());
        },
    },
    mounted() {
        this.$dragging.$on('dragged', (val) => {
            this.activityFilesortImgText(val.draged.id,val.to.id);
            // console.log(this.form.detail)//这里我们不需要做任何操作；组件内部会把我们绑定上去的list自动排序;只需要查看结果就可以
            //如果需要在这里进行其他操作，可以查看val的内容，包括：拖动的元素，拖动后与之兑换的元素，以及原始数据和拖动组名
        })
        this.$dragging.$on('dragend', (val) => {
            console.log(val)
            //此处是拖动完成后鼠标松开时触发的事件
        })
    },
    created() {
        this.activityFilelistShow()
    },
    
}
</script>