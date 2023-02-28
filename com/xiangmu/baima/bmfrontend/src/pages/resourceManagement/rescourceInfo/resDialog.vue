<template>
  <el-form :model="form" ref="form" :rules="rules" label-position="top" :hide-required-asterisk="true" >
    <el-row>
      <el-col :span="12">
        <el-form-item label="资源编号" :label-width="formLabelWidth" prop="rescode">
          <el-input v-model="form.rescode" autocomplete="off" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="面积(m²)" :label-width="formLabelWidth" prop="area">
          <el-input-number v-model="form.area" autocomplete="off" controls-position="right" :min="0" :precision="2" style="width: 100%"></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="单价(元)" :label-width="formLabelWidth" prop="price" style="position: relative">
          <el-input-number v-model="form.price" autocomplete="off" controls-position="right" :min="0" :precision="2" style="width: 100%"></el-input-number>
          <div style="line-height: 20px;position: absolute;color: #1A5AC1;top: -30px;left:58px">(计费周期：{{typeDetail.chargecycle}} ; 计费方式：{{typeDetail.chargetype}})</div>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="基础设施" :label-width="formLabelWidth" prop="oldBaseList">
          <el-select v-model="form.oldBaseList" style="width: 100%" multiple collapse-tags placeholder="请选择基础设施" @change="() => $forceUpdate()">
            <el-option v-for="item in typeDetail.baseList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col v-for="(item,index) in form.oldAttrList" :span="12" :key="item.id">
        <el-form-item :prop="'oldAttrList.'+index+'.attrv'" :label="item.name" :label-width="formLabelWidth"  :rules="[{required: true, message: '请输入'+item.name, trigger: 'blur'}]">
          <el-input v-model="item.attrv" autocomplete="off" @change="() => $forceUpdate()"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item  label="资源状态" prop="resstatus" >
          <el-radio-group v-model="form.resstatus" class="my-radio-right-18" :disabled="disabled">
            <el-radio label="1">开放</el-radio>
            <el-radio label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

    </el-row>

    <el-row>

    </el-row>






  </el-form>
</template>

<script>
  export default {
      name: "applyDialog",
      props:{
        form:Object,
        formLabelWidth:String,
        id:String,
        disabled:Boolean
        // typeDetail:Object
      },
      data(){

        return{
          typeList:JSON.parse(sessionStorage.getItem("typeList")) ,  //资源类型列表
          codeList:JSON.parse(sessionStorage.getItem("codeList")) ,  //资源编号列表
          groupList:JSON.parse(sessionStorage.getItem("groupList")) ,  //学院列表
          rules: {
            rescode: [{required: true, message: '请输入资源编号', trigger: 'blur'}],
            area: [{required: true, message: '请输入面积', trigger: 'blur'}],
            price: [{required: true, message: '请输入单价', trigger: 'blur'}],
            resstatus: [{required: true, message: '请选择资源状态', trigger: 'change'}],
            oldBaseList: [{required: true, message: '请选择基础设施', trigger: 'blur'}],
            // oldAttrList: [{required: true, message: '请选择基础设施', trigger: 'blur'}],
          },

          typeDetail:{},
        }
      },
      methods:{
        //获取类型详情
        getTypeInfo(){
          // this.loading=true;
          this.util.postAjax({
            code:this.global.code,
            url:"/sprestype/findById",
            data:{
              id:this.id
            }
          }).then(res => {
            // this.loading=false;
            if(res.success == true){
              // console.log("11",res);
              this.typeDetail=res.item;
              // this.form.oldAttrList=[];
              this.form.oldAttrList=res.item.attrList;
              /*this.form.oldAttrList=res.item.attrList.map(i => {
                return {
                  name:i.name,
                  attrv: "",
                  typeattrid: i.id
                }
              });*/


              // console.log("22",this.form);
              let chargecycle=this.typeDetail.chargecycle;
              let chargetype=this.typeDetail.chargetype;
              this.common.chargecycleFormatter(chargecycle,this.typeDetail);
              this.common.chargetypeFormatter(chargetype,this.typeDetail)
            }
          });
        },

      },
      created() {
        this.getTypeInfo();
        // console.log("弹框内收到的",this.form);
      }
    }
</script>

<style scoped>

</style>
