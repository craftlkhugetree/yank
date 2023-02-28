<template>
  <div>
    <el-form :model="form" label-position="top" ref="form" :hide-required-asterisk="true" :rules="rules">
      <div class="title">
        <span class="num">1</span>
        <span>基本信息</span>
      </div>
      <el-form-item label="资源类型名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <div class="title">
        <span class="num">2</span>
        <span>资源属性</span>
      </div>

      <el-form-item class="resource-attr" style="white-space: normal">
        <div class="item default">编号</div>
        <div class="item default">面积</div>
        <div class="item default">单价</div>
        <div class="item default">设施</div>
        <div class="item green" v-for="(item,index) in form.attrList" :key="index">{{item.name}}
          <i class="el-icon-close" title="删除" @click="deleteAttr('attr',index,item)" style="cursor: pointer"></i>
        </div>
        <div class="item add" @click="addAttr('attr')">
          <i class="el-icon-plus"></i>新增属性
        </div>
      </el-form-item>

      <div class="title">
        <span class="num">3</span>
        <span>其它</span>
      </div>

      <el-form-item label="单价" :label-width="formLabelWidth" >
        <el-form-item style="margin: 0" prop="billingCycle" class="my-el-form-item">
          <label>计费周期：</label>
          <el-radio-group v-model="form.billingCycle">
            <el-radio :label="1">天</el-radio>
            <el-radio :label="2">月</el-radio>
            <el-radio :label="3">年</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin: 0" prop="billingMethod" class="my-el-form-item">
          <label>计费方式：</label>
          <el-radio-group v-model="form.billingMethod">
            <el-radio :label="1">面积</el-radio>
            <el-radio :label="2">房间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin: 0" prop="maxUse" class="my-el-form-item">
          <label>最大使用时长：</label>
          <el-input-number size="small" v-model="form.maxUse" :min="1" :disabled="!form.billingCycle" :precision="0"></el-input-number>
          <span v-if="form.billingCycle ==1">天</span>
          <span v-if="form.billingCycle ==2">月</span>
          <span v-if="form.billingCycle ==3">年</span>
        </el-form-item>
      </el-form-item>

      <el-form-item label="基础设施" :label-width="formLabelWidth"  prop="baseList" >
        <div class="resource-attr basic-attr" style="white-space: normal">
          <div class="item green" v-for="(item,index) in form.baseList" :key="index">
            {{item.name}}
            <i class="el-icon-close" title="删除" @click="deleteAttr('basic',index,item)" style="cursor: pointer"></i>
          </div>
          <div class="item add" @click="addAttr('basic')">
            <i class="el-icon-plus"></i>新增设施
          </div>
        </div>
      </el-form-item>

      <div class="title">
        <span class="num">4</span>
        <span>规则</span>
      </div>

      <el-form-item :label-width="formLabelWidth" prop="rules">
        <el-input type="textarea" v-model="form.rules" rows="4" maxlength="1000"></el-input>
      </el-form-item>


    </el-form>

    <!--弹框-->
    <el-dialog class="res-apply-dialog" :title="innerType=='attr' ? '新增属性' : '新增设施'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
               width="500px" :close-on-click-modal="false" append-to-body>
      <el-form :model="innerForm">
        <el-form-item class="no-margin-left">
          <el-input v-model.trim="innerForm.name" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="dialogFormVisible = false">取 消</div>
        <div class="my-button green" @click="innerSubmit">提 交</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "applyDialog",
    props:{
      form:Object,
      formLabelWidth:String,
      dialogType:String
      // rules:Object,
    },
    data(){
      return{
        dialogFormVisible:false,
        innerForm:{},  //二层弹框
        innerType:"",  //二层弹框类型
        rules:{
          name: [{ required: true, message: '请输入资源类型', trigger: 'blur' }],
          billingCycle: [{ required: true, message: '请选择单价计费周期', trigger: 'change' }],
          billingMethod: [{ required: true, message: '请选择单价计费方式', trigger: 'change' }],
          maxUse: [{ required: true, message: '请输入最大使用时长', trigger: 'blur' }],
          baseList: [{ required: true, trigger: ['blur', 'change'], type: "array", message: "请添加基础设施"
            // validator: (r, v, cb) => {
            //   if (!this.baseList || !this.baseList.length) {
            //     return cb(new Error("请添加基础设施"));
            //   } else {
            //     cb();
            //   }
            // }
          }],
          rules:[{ required: true, message: '请输入规则', trigger: 'blur'}]
        }
      }
    },

    methods: {
      //删除属性和设施
      deleteAttr(type,index,item){
        switch (type) {
          case "attr":
            this.form.attrList.length && this.form.attrList.splice(index,1);
            // if(this.dialogType == "add"){
            // }
            // else {
            //   this.util.postAjax({
            //     code:this.global.code,
            //     url:"/spres/validateTypeAttr?id="+item.id,
            //   }).then(res => {
            //     if(res.success){
            //       this.form.attrList.splice(index,1);
            //     }else {
            //       this.$message({
            //         type: 'warning',
            //         message: res.data.message
            //       });
            //     }
            //   });
            // }

            break;
          case "basic":
            this.form.baseList.length && this.form.baseList.splice(index,1);
            // if(this.dialogType == "add"){
            // }else {
            //   this.util.postAjax({
            //     code:this.global.code,
            //     url:"/spres/validateTypeBase?id="+item.id,
            //   }).then(res => {
            //     if(res.success){
            //       this.form.baseList.splice(index,1);
            //     }else {
            //       this.$message({
            //         type: 'warning',
            //         message: res.data.message
            //       });
            //     }
            //   });
            // }
            break;
        }
        this.$forceUpdate()
      },

      //新增属性和设施弹框打开
      addAttr(type){
        this.innerType=type;
        this.dialogFormVisible = true;
        this.innerForm={};
        /*switch (type) {
          case "attr":

            break;
        }*/
      },

      //新增属性和设施按钮点击
      innerSubmit(){
        if(this.innerForm.name){
          this.dialogFormVisible = false;
          switch (this.innerType) {
            case "attr":
              this.form.attrList.push({name: this.innerForm.name});
              break;
            case "basic":
              this.form.baseList.push({name: this.innerForm.name});
              this.$refs['form'].validateField('baseList', valid => {})
              break;
          }
          }else{
            this.$message({
              type:"warning",
              message:this.innerType == "attr" ? "请输入属性" : "请输入基础设施"
            })
          }

      },


      //刷新
      forceUpdate() {
        this.$forceUpdate();
      },

    },
    created() {
      // console.log(this.form);
    }
  }
</script>

<style scoped>

</style>
