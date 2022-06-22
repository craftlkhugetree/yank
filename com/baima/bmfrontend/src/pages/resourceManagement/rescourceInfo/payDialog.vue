<template>
  <el-form :model="form2"  ref="form2" :hide-required-asterisk="true" :rules="rules">
   <!-- <div class="title">
      <span class="num">1</span>
      <span>基本信息</span>
    </div>-->
    <el-form-item :label="activeName=='1' ? '单价(元/吨)' : '单价(元/度)' " :label-width="formLabelWidth" prop="price">
      <el-input-number v-model="form2.price" style="width: 100%" controls-position="right"	:min="0" :precision="2"></el-input-number>
    </el-form-item>
    <el-form-item :label="activeName=='1' ? '数值(吨)' : '数值(度)'" :label-width="formLabelWidth" prop="showv">
      <el-input-number v-model.number="form2.showv" style="width: 100%" controls-position="right" :min="form2.lastshowv ? form2.lastshowv : 0" :precision="2"></el-input-number>
    </el-form-item>

    <!--    <el-button @click="submit">点击</el-button>-->
  </el-form>
</template>

<script>

  export default {
    name: "applyDialog",
    props:{
      form2:Object,
      formLabelWidth:String,
      activeName:String
      // rules:Object,
    },
    data(){
      return{
        jzgList:[], //教职工列表
        typeList:JSON.parse(sessionStorage.getItem("typeList")) ,  //资源类型列表
        codeList:[] ,  //资源编号列表
        groupList:JSON.parse(sessionStorage.getItem("groupList")) ,  //学院列表
        rules:{
          price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
          showv: [{ required: true, message: '请输入数值', trigger: 'blur' }],
        }
      }
    },

    methods: {

      //刷新
      forceUpdate() {
        this.$forceUpdate();
      },

    },
    created() {

      // console.log("222",this.form);
    }
  }
</script>

<style scoped>

</style>
