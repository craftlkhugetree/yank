<template>
    <div>
        <div class="content">
            <div class='addbooklistbox' @click="addupload">
                <upload class="upload" :multiple='true' ref="upload" exts="png|jpg|bmp|gif|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finish" :url="uploadUrl"></upload>
                <div class='addbooklist'>
                </div>
            </div>
            <div class='addbooklistbox' v-show="files.length > 0" v-for="(v,i) in files" :key="i">
                <i @click="select(i)" :class="{'selected':v.checked}" ref="select" :data-id="v.ID"></i>
                <img :preview='i' :src="domain+'/fileManage/get?ID='+v.ID" width="100%" height="100%" alt="">
            </div>
        </div>
        <button class="del" @click="delimg">删除</button>
        <button @click="back">确认添加</button>
        <div class="meng" v-show="imgmeng">
            <p>图片上传中...</p>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import upload from '../components/upload'
import code from '../util/code'
import { global } from '../util/global'

export default {
    components:{
        upload
    },
    data() {
        return {
            uploadUrl:'',//url的路径 http://160.255.0.246:8081/book2/rest/fileManage/upload
            files:[],//上传图片成功后的数组
            filelength:'',//上传后回调的长度
            hasselect:'',//是否有选择的
            domain:global,
            imgmeng:false,
        }
    },
    methods: {
        back(){
            if(window.sessionStorage.getItem('formbook') == 'formbook'){
                this.$router.push('bookreimbursement');
            }else{
                this.$router.push('periodicalreimbursement');
            }
            // window.sessionStorage.setItem('setselectimgs',JSON.stringify(this.files))
            this.$store.commit('setselectimgs',this.files);

        },
        addupload(){
            this.$refs.upload.toupload();
        },
        choosefiel(file){
            console.log("上传后回调");
            this.imgmeng = true;
        },
        finish(res){
            console.log("结束后");
            this.imgmeng = false;
            res.FILE.forEach(element => {
                element.checked = false;
                this.files.push(element);
            });
            Vue.set(this.files,res);
            this.$previewRefresh()
        },
         //获取上传的url
        uploadFile(){
          this.util.getUrlByCode(code.base,code.fileManageupload).then(res => {
            this.uploadUrl = res;
          })
        },
        //选择图片
        select(i){
            this.files[i].checked = !this.files[i].checked;
        },
        //删除图片
        delimg(){
            for(let i =0;i<this.files.length;i++){
                if(this.files[i].checked){
                    this.files.splice(i,1);
                    i--;
                }
            }
        },
    },
    created() {
        this.files = this.$store.state.selectimgs?this.$store.state.selectimgs:[];
        this.uploadFile()
    },
}
</script>
<style scoped>
.content{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.content>div{
    width: calc(100% / 3 - 1px);
    height: 6rem;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    /* border: 1px solid #eee; */
}
.content>div.addbooklistbox{
    position: relative;
}
.content>div.addbooklistbox>.addbooklist{
    width: 1rem;
    height: 1rem;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url(../../static/imgs/addbooklist.png) no-repeat center center;
    background-size: cover;
}
.addbooklistbox>div.upload{
    width: 100%;
    height: 100%;
    display: none;
}
.addbooklistbox>i{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url(../../static/imgs/unselect.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    right: .1rem;
    top: .1rem;
}
.addbooklistbox>i.selected{
    background: url(../../static/imgs/select.png) no-repeat center center;
    background-size: cover;
}
button{
    width: 90%;
    height:1.85rem;
    border-radius:0.1rem;
    border: none;
    outline: none;
    margin: 1rem 0;
    background:rgba(255,255,255,1);
    border-radius:0.1rem;
    border:0.03rem solid rgba(204,204,204,1);
}
button.del{
    background:rgba(219,71,71,1);
    color: #fff;
    border: none;
}
.upload{
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
