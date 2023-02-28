<template>
    <div class="common-content" :style="{padding: total > 0 ? 0 : 30+'px'}">

      <div v-if="total == 0"> 暂无相关文件</div>
      <div v-if="total > 0" class="back-top view-info-top">
        <span>
          <img src="../../../static/images/bm-single-file.png" alt="">
          <span>{{firstFile}}</span>
        </span>

        <a :href=downUrl+firstid target="_blank" class="my-button green" style="float: right;margin-top:8px">
<!--          <i class="el-icon-plus"></i>-->
          <img src="../../../static/images/bm-filetype-download.png" alt="" style="width: 15px;height: 12px;vertical-align: top;margin-top: 10px">
          <span>下 载</span>
        </a>
      </div>
      <el-row  v-if="total > 0" class="view-info-content">
        <el-col :span="17" class="preview-content" style="">
           <span @click="operate('pre')">
             <img src="../../../static/images/bm-prev.png" alt="" title="上一个文件">
           </span>
          <iframe :src="viewUrl" frameborder="1" width="85%" height="700"></iframe>
          <span @click="operate('next')">
             <img src="../../../static/images/bm-next.png" alt="" title="下一个文件">
           </span>
        </el-col>
        <el-col class="all-files-box" :span="7" style="height: 722px;overflow: auto">
          <div class="view-info-top" style="padding: 0" >
            <img src="../../../static/images/bm-all-file.png" alt="" >全部文件
          </div>
          <all-file :fileList="fileList" :isView="isView" @getPreviewUrl="getPreviewUrl" :activeFile="activeFile"></all-file>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import allFile from "./fileList";
    export default {
      name: "viewInfo",
      components:{
        allFile
      },
      data(){
        return{
          viewUrl:"",
          fileList:[],
          isView:true,
          firstid:"",
          firstFile:"",
          activeFile:0,
          total:"",
          downUrl: window.g.ApiUrl3 + "rest/FileOut/down?ID=",
        }
      },
      methods:{

        //下载文件
        downloadFile(){

        },

        //前后文件
        changeFile(index){
          let fileid=this.fileList[index].fileid;
          let title=this.fileList[index].title;
          this.getPreviewUrl(fileid,index,title);
        },

        operate(type){
          switch (type) {
            case "next":
              this.activeFile +=1;
              if(this.activeFile > this.total-1){
                this.activeFile = this.total-1;
                this.$message({
                  type:"warning",
                  message:"已是最后一个文件"
                });
                return;
              }else{
                this.changeFile(this.activeFile)
              }
              break;
            case "pre":
              this.activeFile =this.activeFile-1;
              if(this.activeFile < 0){
                this.activeFile = 0;
                this.$message({
                  type:"warning",
                  message:"已是第一个文件"
                });
                return;
              }else {
                this.changeFile(this.activeFile)
              }
              break;
          }

        },

        //预览刷新
        getPreviewUrl(id,index,title){
          this.util.postAjax({
            code: this.global.fileCode,
            url: "rest/FileOut/getPreviewUrl2",
            isRep: true,
            data: {
              PHYAPPID: "unknow",

              // ID: "1d13dc32dbe844889087f31649a11f52"
              ID: id || this.firstid
            }
          }).then(res => {
            console.log(res);
            if(res.success == true){
              this.viewUrl=res.data.previewUrl;
              this.activeFile = index;
              this.firstFile = title;
              this.firstid=id;
            }
          })
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
              if(this.total > 0){
                this.firstid=this.fileList[0].fileid;
                this.firstFile=this.fileList[0].title;
              }

              this.getPreviewUrl(this.firstid,0,this.firstFile);

              // this.total=res.total;
              // this.updateSort();
            }
          })
        }

      },

      created() {
        this.getFileList();
      }


    }
</script>

<style scoped>

</style>
