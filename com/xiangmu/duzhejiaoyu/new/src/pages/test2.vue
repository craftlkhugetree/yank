<template>
  <div class="common-content">
    <el-button type="primary" for="uploads" size="small" @click="choosePic">选择图片</el-button>
    <div style="margin-top:20px">
        <img v-if="photourl" :src="domain+photourl" style="width:150px;height:150px;object-fit:cover">   
    </div>
    

    <div v-show="isClip">
      <test ref="test" :option="option" @done="finishImg"></test>
    </div>
  </div>

</template>

<script>

import test from '../components/cropper'

export default{
name: 'HelloWorld',
components: {test},
  data() {

      return {
        isClip:false,
        domain:this.global.domain,  //域名
        photourl:"",

        //剪切图片上传
        option:{
          img: '',
          outputSize:1, //剪切后的图片质量（0.1-1）
          full: false,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 150,
          autoCropHeight: 150,
          fixedBox: true
        },
      }

    },

    

    methods: {
        choosePic(){
            this.isClip=true;
            this.$refs.test.$refs.filebtn.click();
        },

        // 图片上传完成后
        finishImg(res){
            console.log("上传后回调",res)
            this.photourl=res.item.fileUrl;
            this.$forceUpdate();
        },
    }

}

</script>

<style scoped>
</style>
