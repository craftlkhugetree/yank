<template>
  <el-form :model="repairform" label-position="top" ref="repairform" :hide-required-asterisk="true" :rules="rules">

    <el-form-item :label-width="formLabelWidth" >
      <div>
        <label>资源编号：</label>
        <span>{{repairform.rescode}}</span>
      </div>
    </el-form-item>

    <el-form-item label="问题描述" :label-width="formLabelWidth" prop="problemnote">
      <el-input type="textarea" v-model="repairform.problemnote" :rows="5"></el-input>
    </el-form-item>

    <el-form-item :label-width="formLabelWidth" >
      <div>场地图片</div>
      <div class="repair-image-box">
        <div class="item" v-for="(item,index) in files" :key="item.ID">
          <img :src="viewUrl+item.ID" alt="">
          <div class="delete-box" title="删除" @click="deleteFile(index)">
            <img src="../../../../static/images/bm-file-delete.png" alt="" >
          </div>
        </div>


        <div class="upload-img" @click="uploadFile">
          <div>
            <img style="width: 30px;height: 30px;margin-top:30px" src="../../../../static/images/bm-resource-add.png" alt="">
            <div>上传图片</div>
          </div>
        </div>
      </div>
    </el-form-item>

    <upload v-show="false" ref="upload" class="my-upload" :url="uploadUrl" :multiple="true" :exts="fileType" @choose="choosefile" @done="finish"></upload>
  </el-form>
</template>

<script>
  import util from "../../../assets/js/util";
  import global from "../../../assets/js/global";
  import upload from "../../../components/BaseUpload"

  export default {
    name: "applyDialog",
    components:{
      upload
    },
    props:{
      repairform:Object,
      formLabelWidth:String,
      // resList:Array,
      // dialogType:String,
    },
    data(){
      return{
        fileType:"png|PNG|jpg|JPG",
        uploadUrl:window.g.ApiUrl3 +"rest/FileOut/saveFile",
        viewUrl:window.g.ApiUrl3+"rest/FileOut/view/",

        fullscreenLoading:false,
        rules:{
          problemnote: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
        },

        files:[]
      }
    },
    computed:{
      leaderList() {
        return this.$store.state.leaderList;
      }
    },
    methods: {
      //删除图片
      deleteFile(index){
        this.files.splice(index,1);
      },

      //点击上传
      uploadFile(){
        this.$refs.upload.$refs.uploaddom.click();
      },

      choosefile(){
        // this.fullscreenLoading = true;
        this.fullscreenLoading =this.$loading({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },

      //结束后返回
      finish(res){
        // console.log(res);
        // this.fullscreenLoading = false;
        this.fullscreenLoading.close();
        if(res.success ==true){
          let arr=[];
          res.data.forEach(v=>{
            this.files.push(v)
          })


          // console.log("this.files",this.files);
        }else{
          // console.log(res);
          this.$message({
            type:"warning",
            message:res.data.message
          });
        }
      },


      //刷新
      forceUpdate() {
        this.$forceUpdate();
      },


    },
    created() {

    }
  }
</script>

<style scoped>

</style>
