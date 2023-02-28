<template>
  <el-form :model="form" ref="form" :rules="rules" label-position="top" :hide-required-asterisk="true">
    <!--<div class="title">
      <span class="num">1</span>
      <span>基本信息</span>
    </div>-->
    <el-form-item class="no-required" label="学院名称" :label-width="formLabelWidth">
      <!--<el-select v-model="form.orgid" filterable  placeholder="请输入或选择" style="width: 100%">
        <el-option v-for="item in groupList" :label="item.name" :value="item.id" :key="item.id"></el-option>
      </el-select>
-->
      <el-select v-model="form.orgname" filterable remote placeholder="请输入或选择" clearable @clear="clear" :remote-method="remoteMethod" @change="dataFilter" :loading="selectLoading" style="width: 100%">
        <el-option v-for="item in groupList" :label="item.name" :value="JSON.stringify(item)" :key="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="灌溉类型 ( 请检查类型名称统一性，避免相似类型名称 )" :label-width="formLabelWidth" prop="restypename">
      <el-input v-model="form.restypename" autocomplete="off" ></el-input>

      <!--<el-select v-model="form.restype" placeholder="请选择" style="width: 100%">
        <el-option v-for="item in typeList" :label="item.typename" :value="item.id" :key="item.id"></el-option>
      </el-select>-->

    </el-form-item>

    <el-form-item label="灌溉编号" :label-width="formLabelWidth" prop="rescode">
      <el-input v-model="form.rescode" autocomplete="off"></el-input>

     <!-- <el-select v-model="form.rescode" placeholder="请选择" style="width: 100%">
        <el-option v-for="item in codeList" :label="item.rescode" :value="item.rescode" :key="item.id"></el-option>
      </el-select>-->
    </el-form-item>

  </el-form>
</template>

<script>
    import util from "../../assets/js/util";
    import global from "../../assets/js/global";

    export default {
      name: "applyDialog",
      props:{
        form:Object,
        formLabelWidth:String
      },
      data(){
        return{
          typeList:JSON.parse(sessionStorage.getItem("typeList")) ,  //资源类型列表
          codeList:JSON.parse(sessionStorage.getItem("codeList")) ,  //资源编号列表
          groupList:[] ,  //学院列表
          rules: {
            // orgid: [{required: true, message: '请选择学院名称', trigger: 'change'}],
            restypename: [{required: true, message: '请输入灌溉类型', trigger: 'blur'}],
            rescode: [{required: true, message: '请输入灌溉编号', trigger: 'blur'}],
          },
          selectLoading:false
        }
      },
      methods:{
        clear(){
          this.form.orgname="";
          this.form.orgid="";

          this.$forceUpdate();
        },

        //搜索学院名称
        remoteMethod(query) {
          this.selectLoading = true;
          if (query !== '') {
            this.common.getGroupList2(query)
              .then(res => {
                console.log(res);
                this.selectLoading = false;

                this.groupList=res.items;
                if("公共资源".includes(query)) {
                    this.groupList.push({
                    id: -1,
                    name: "公共资源"
                  })
                  
                }
              }).catch(err => {
              this.selectLoading = false;
              this.groupList=[];
            })
          } else {
            this.selectLoading = false;
            this.groupList = [];
          }
        },

        dataFilter(val){

          console.log(val)
        this.form.orgname=JSON.parse(val).name;
        this.form.orgid=JSON.parse(val).id;
        this.$forceUpdate();
      },

      },
      created() {

        // this.remoteMethod("农学院")
      }
    }
</script>

<style scoped>

</style>
