<template>
  <div>
    <div class="file-item" :class="{'view-file-item': isView,'active': activeFile == index }"  v-for="(item,index) in fileList"
         :key="item.id" @click="change(item.fileid,index,item.title)">
     <!-- <img v-show="item.ftype == 'doc' || item.ftype == 'DOC'" src="../../../static/images/bm-filetype-doc.png" alt="">
      <img v-show="item.ftype == 'jpg' || item.ftype == 'JPG'" src="../../../static/images/bm-filetype-jpg.png" alt="">
      <img v-show="item.ftype == 'pdf' || item.ftype == 'PDF'" src="../../../static/images/bm-filetype-pdf.png" alt="">
      <img v-show="item.ftype == 'png' || item.ftype == 'PNG'" src="../../../static/images/bm-filetype-png.png" alt="">-->
      <img src="../../../static/images/bm-filetype-common.png" alt="">
      <div class="file-info">
        <div class="name ellipsis">{{item.title}}</div>
        <div class="info">
          {{util.formatTime(item.createtime, "yyyy.MM.dd hh:mm")}}

          <span class="operate" v-if="!isView">
            <img @click="deleteFile(item.id)" src="../../../static/images/bm-file-delete.png" alt="" title="删除">
            <a :href=downUrl+item.fileid target="_blank" style="margin-right: 10px">
              <img style="width: 19px;height: 16px" src="../../../static/images/bm-file-download.png" alt="" title="下载">
            </a>
            <img @click="sortFile('up',index)" src="../../../static/images/bm-file-up.png" alt="" title="上移">
            <img @click="sortFile('down',index)" src="../../../static/images/bm-file-down.png" alt="" title="下移">
          </span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
    export default {
      name: "fileList",
      props:{
        fileList:Array,
        isView: Boolean,
        activeFile:Number
      },
      data(){
        return{
          downUrl: window.g.ApiUrl3 + "rest/FileOut/down?ID=",            // 下载地址
          // activeFile:0, //当前文件
        }
      },
      methods:{
        deleteFile(id){
          this.$emit("deleteFile",id)
        },

        sortFile(type,index){
          this.$emit("sortFile",type,index)
        },

        change(fileid,index,title){
          // this.activeFile = index;
          this.$emit("getPreviewUrl",fileid,index,title)
        }
      },

      created() {
        console.log(this.activeFile);
      }
    }
</script>

<style scoped>

</style>
