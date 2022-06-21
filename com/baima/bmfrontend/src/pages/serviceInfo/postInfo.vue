<template>
    <div class="common-content">
      <el-row :gutter="30">
        <el-col :span="13">
          <div class="file-box " ref="select_frame">
            <div class="text">
              将文件拖至此处 或 &nbsp;&nbsp;<div class="my-button green" @click="uploadFile">上传文件</div>
            </div>
          </div>
        </el-col>
        <el-col :span="11" class="my-scroll file-list-box" >
          <all-file :fileList="fileList" :isView="isView" @deleteFile="deleteFile" @sortFile="sortFile"></all-file>
        </el-col>
      </el-row>

      <upload v-show="false" ref="upload" class="my-upload" :url="uploadUrl" :multiple="false" :exts="fileType" @choose="choosefile" @done="finish"></upload>

    </div>
</template>

<script>
  import upload from "../../components/BaseUpload"
  import allFile from "./fileList";
    export default {
      name: "postInfo",
      components:{
        upload,
        allFile
      },
      data(){
        return{
          fullscreenLoading:"",
          fileList:[],
          isView:false, //是否有操作
          total:"",
          fileType:"doc|DOC|docx|DOCX|jpg|JPG|png|PNG|xls|XLS|xlsx|XLSX|pdf|PDF",
          uploadUrl:window.g.ApiUrl3 +"rest/FileOut/saveFile",
        }
      },
      methods:{
        swapItems(arr, index1, index2,direction) {
          arr[index1] = arr.splice(index2, 1, arr[index1])[0];
          return arr;
        },

        //排序
        sortFile(type,index){
          switch (type) {
            case "up":
              if (index === 0) {
                return;
              }
              this.swapItems(this.fileList, index, index - 1);
              break;
            case "down":
              if (index === this.fileList.length - 1) {
                return;
              }
              this.swapItems(this.fileList, index, index + 1);
              break;
          }

          let fileList=JSON.parse(JSON.stringify(this.fileList));
         this.updateSort();
        },

        //排序接口
        updateSort(){
          let arr=[];
          this.fileList.forEach(v=>{
            arr.push({id:v.id,levelcode:v.levelcode})
          });

          arr.forEach((v,i)=>{
            v.levelcode = i+1;
          })

          this.util.postAjax({
            code:this.global.code,
            url:"/farmerinfo/sort",
            isRep:true,
            data:arr,
          }).then(res => {
            if(res.success == true){}
          })
        },

        //删除文件
        deleteFile(id){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.util.postAjax({
              code:this.global.code,
              url:"/farmerinfo/deleteById",
              data:{
                id:id
              }
            }).then(res => {
              if(res.success == true){
                this.getFileList();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }else {
                this.$message({
                  type: 'warning',
                  message: res.data.message
                });
              }
            })
          }).catch(() => {});
        },

        //下载文件
        downFile(id){
          window.open(this.downFile+id,"_blank")
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

        //点击上传
        uploadFile(){
          this.$refs.upload.$refs.uploaddom.click();
        },

        //结束后返回
        finish(res){
          console.log(res);
          // this.fullscreenLoading = false;
          this.fullscreenLoading.close();
          if(res.success ==true){
            let data=res.data[0]
            let form={};
            form.fileid=data.ID;
            form.ftype=data.FTYPE;
            form.furl=data.FURL;
            form.title=data.TITLE;
            form.createtime=data.CREATETIME;
            form.levelcode=this.total+1;

            this.util.postAjax({
              code:this.global.code,
              url:"/farmerinfo/add",
              isRep:true,
              data:form,
            }).then(res => {

              if(res.success == true){
                // console.log(res);
                this.getFileList()
              }else{
                console.log(res);
                this.$message({
                  type:"warning",
                  message:res.data.message
                });
              }
            })
          }
        },

        //获取文件列表
        getFileList(){
          this.util.postAjax({
            code:this.global.code,
            url:"/farmerinfo/list",
          }).then(res => {
            if(res.success == true){
              console.log("fileList",res);
              this.fileList=res.items;
              this.total=res.total;
              this.updateSort();
            }
          })
        }

      },
      created() {
        console.log(this.uploadUrl);
        this.getFileList();

      },
      mounted() {

        this.$refs.select_frame.ondragleave = (e) => {
          e.preventDefault();  //阻止离开时的浏览器默认行为
        };

        this.$refs.select_frame.ondrop=(e)=>{
          e.preventDefault();    //阻止拖放后的浏览器默认行为

          this.$refs.upload.dropFile(e);
        }

       /* this.$refs.select_frame.ondrop = (e) => {
          e.preventDefault();    //阻止拖放后的浏览器默认行为
          const data = e.dataTransfer.files;  // 获取文件对象
          if (data.length < 1) {
            return;  // 检测是否有文件拖拽到页面
          }
          console.log(e.dataTransfer.files);
          const formData = new FormData();
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            console.log(e.dataTransfer.files[i]);
            if (e.dataTransfer.files[i].name.indexOf('map') === -1) {
              alert('只允许上传.map文件');
              return;
            }
            formData.append('uploadfile', e.dataTransfer.files[i], e.dataTransfer.files[i].name);
          }
          this.fileList = this.fileList.concat(e.dataTransfer.files[0]);
          console.log(formData, this.fileList, e.dataTransfer.files[0]);
        };*/
        this.$refs.select_frame.ondragenter = (e) => {
          e.preventDefault();  //阻止拖入时的浏览器默认行为
          this.$refs.select_frame.border = '2px dashed red';
        };
        this.$refs.select_frame.ondragover = (e) => {
          e.preventDefault();    //阻止拖来拖去的浏览器默认行为
        };
      },
    }
</script>

<style scoped>

</style>
