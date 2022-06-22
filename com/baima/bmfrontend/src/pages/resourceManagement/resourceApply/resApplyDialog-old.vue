<template>
  <el-form :model="form" label-position="top" ref="form" :hide-required-asterisk="true" :rules="rules">

    <el-row>
<!--      <img class="connect-icon" src="../../../../static/images/bm-connect-icon.png" alt="">-->
      <el-col :span="12">
        <el-form-item :label="'资源编号(最多可选择'+limitNum+'个)'" :label-width="formLabelWidth" prop="resids" >
          <el-select v-model="form.resids"  placeholder="请选择" multiple :multiple-limit=limitNum collapse-tags style="width: 100%" @change="resChange" :disabled="dialogType == 'continue'">
            <el-option v-for="item in resList" :label="item.rescode" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="面积(㎡)" :label-width="formLabelWidth" prop="areas">
          <el-input v-model="form.areas" autocomplete="off" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>


<!--申请人，学院名称，入驻时间暂时修改-->

    <el-row>
      <img class="connect-icon" src="../../../../static/images/bm-connect-icon.png" alt="">
      <el-col :span="12">
        <!------------------- 当前登录人，不可修改 ------------------->
        <!-- <el-form-item label="申请人" :label-width="formLabelWidth" prop="eventername">
          <el-input v-model="form.eventername" autocomplete="off" disabled></el-input>
        </el-form-item> -->

        <!------------------- 暂时可以修改 ------------------->
        <el-form-item v-if="dialogType == 'add'" label="申请人" :label-width="formLabelWidth" prop="applyername">
          <el-select v-model="form.applyername" filterable remote placeholder="请输入或选择" :remote-method="remoteMethod" :loading="selectLoading" @change="dataFilterApply" style="width: 100%">
            <el-option v-for="item in jzgList" :label="item.name+'--'+item.id" :value="JSON.stringify({id:item.id,name:item.name})" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="applyermobile" >
          <el-input v-model="form.applyermobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <!--      <img class="connect-icon" src="../../../../static/images/bm-connect-icon.png" alt="">-->
      <el-col :span="12">
        <el-form-item label="学院名称" :label-width="formLabelWidth" prop="orgid">
          <el-select v-model="form.orgid" filterable  placeholder="请选择" style="width: 100%" disabled>
            <el-option v-for="item in groupList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="课题组名称" :label-width="formLabelWidth" prop="classname">
          <el-input v-model="form.classname" autocomplete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <img class="connect-icon" src="../../../../static/images/bm-connect-icon.png" alt="">
      <el-col :span="12">
        <el-form-item label="课题组负责人" :label-width="formLabelWidth" prop="classleadername">
          <el-select v-model="form.classleadername" filterable remote placeholder="请输入或选择" :remote-method="remoteMethod" :loading="selectLoading" @change="dataFilter" style="width: 100%">
            <el-option v-for="item in jzgList" :label="item.name+'--'+item.id" :value="JSON.stringify({id:item.id,name:item.name})" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="classleadermobile" >
          <el-input v-model="form.classleadermobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="projectname">
<!--          <el-input v-model="form.projectname" autocomplete="off"></el-input>-->
          <el-select v-model="form.projectname" filterable remote placeholder="请输入或选择" :remote-method="remoteMethodProject" @change="dataFilterProject" :loading="selectLoading" style="width: 100%">
            <el-option v-for="item in projectList" :label="item.xmmc" :value="JSON.stringify(item)" :key="item.id"></el-option>
          </el-select>

          <!-- <div class="my-select-box" style="position: relative">
            <el-input v-model="form.projectname" autocomplete="off" placeholder="请输入项目名称" @input="chooseProject"></el-input>
            <div v-if="projectList && projectList.length >0" class="project-options-box">
              <div class="name-item" v-for="item in projectList" @click="clickItem(item)">{{item.xmmc}}</div>
            </div>
          </div> -->
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="项目来源" :label-width="formLabelWidth" prop="projectfrom" >
          <el-input v-model="form.projectfrom" autocomplete="off"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目经费 ( 万元 ) " :label-width="formLabelWidth" prop="projectprice">
          <el-input-number v-model="form.projectprice" autocomplete="off" controls-position="right" style="width: 100%" :min="0" :precision="4"></el-input-number>
        </el-form-item>
      </el-col>

      <!------------------- 暂时可以修改 ------------------->
      <el-col v-if="dialogType == 'add'" :span="12">
        <el-form-item label="入驻时间" :label-width="formLabelWidth" prop="applytime">
          <el-date-picker type="date" placeholder="请选择日期" v-model="form.applytime" format="yyyy-MM-dd" value-format="yyyyMMddhhmmss" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="'使用时长 ( 最大使用时长为'+(resTypeDetail.maxusecycle ? resTypeDetail.maxusecycle : 0) +resTypeDetail.chargecycle+' ) '" :label-width="formLabelWidth" prop="usecycle">
          <el-input-number v-model="form.usecycle" autocomplete="off" style="width: 100%" controls-position="right" :min="0" :max="resTypeDetail.maxusecycle" :precision="0">
<!--            <template slot="append">{{resTypeDetail.chargecycle}}</template>-->
          </el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="项目概况" :label-width="formLabelWidth" prop="projectnote">
      <el-input type="textarea" v-model="form.projectnote"></el-input>
    </el-form-item>

    <el-form-item label="实验概况" :label-width="formLabelWidth" prop="situation">
      <el-input type="textarea" v-model="form.situation" placeholder="主要包括实验目的、材料、实验方法、进度计划及预期成果和应用价值等；（如果是宿舍类，注明居住人姓名、性别、身份证号、联系电话等）"></el-input>
    </el-form-item>

    <el-row>
      <!--      <img class="connect-icon" src="../../../../static/images/bm-connect-icon.png" alt="">-->
      <el-col :span="12">
        <el-form-item label="审批领导" :label-width="formLabelWidth" prop="approverid">
          <el-select v-model="form.approverid" filterable  placeholder="请选择" style="width: 100%" >
            <el-option v-for="item in leaderList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import util from "../../../assets/js/util";
  import global from "../../../assets/js/global";

  export default {
    name: "applyDialog",
    props:{
      form:Object,
      formLabelWidth:String,
      resList:Array,
      dialogType:String,
      resTypeDetail:Object,
      totalPage:Number
      // resTypeDetail:Object,
      // rules:Object,
    },
    data(){
      return{
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        jzgList:[], //教职工列表
        selectLoading:false,
        typeList:JSON.parse(sessionStorage.getItem("typeList")) ,  //资源类型列表
        codeList:[] ,  //资源编号列表
        groupList:JSON.parse(sessionStorage.getItem("groupList")) ,  //学院列表
        rules:{
          orgid: [{ required: true, message: '请选择学院名称', trigger: 'blur' }],
          resids: [{ required: true, message: '请选择资源编号', trigger: 'blur' }],
          // areas: [{ required: true, message: '请选择资源编号', trigger: 'blur' }],
          projectname: [{ required: true, message: '请输入项目名称', trigger: 'change' }],
          classleadername: [{ required: true, message: '请选择课题组负责人', trigger: 'change' }],
          classleadermobile: [
            { required: true, message: '请输入电话号码', trigger: 'blur'},
            this.options.testPhone
            ],
          eventername: [{ required: true, message: '请输入申请人', trigger: 'blur'}],
          applyername: [{ required: true, message: '请选择申请人', trigger: 'change'}],
          applytime: [{ required: true, message: '请选择入驻时间', trigger: 'change'}],
          applyermobile: [
            { required: true, message: '请输入电话号码', trigger: 'blur'},
            this.options.testPhone
            ],
          classname: [{ required: true, message: '请输入课题组名称', trigger: 'blur' }],
          projectfrom: [{ required: true, message: '请输入项目来源', trigger: 'blur' }],
          projectprice: [{ required: true, message: '请输入项目经费', trigger: 'blur' }],
          usecycle: [{ required: true, message: '请输入使用时长', trigger: 'blur' }],
          // projectnote: [{ required: true, message: '请输入项目概况', trigger: 'blur' }],
          // situation: [{ required: true, message: '请输入实验概况', trigger: 'blur' }],
          approverid: [{ required: true, message: '请选择审批领导', trigger: 'change' }],
        },

        areas:"",
        // resTypeDetail:JSON.parse(sessionStorage.getItem("resTypeDetail")),
        limitNum:5,
        projectList:[],  //项目名称列表
        current:1, // 分页
        total:0, //总页数
        limit:20,
        // resList:[],

        // leaderList:[],  //领导列表
      }
    },
    computed:{
      leaderList() {
        return this.$store.state.leaderList;
      }
    },
    methods: {
      //搜索项目名称
      remoteMethodProject(query){

        this.selectLoading = true;
        this.projectList=[];
        if (query !== '') {
          this.common.getProjectList(query,1,10)
            .then(res => {
              console.log(res);
              this.selectLoading = false;
              if(res.total == 0){
                // this.form.projectname=query;
                this.projectList.push({xmmc:query+"-(新增)",xmbh:""})
              }else {
                this.projectList=res.items;
              }

            }).catch(err => {
            this.selectLoading = false;
            this.projectList=[];
          })
        } else {
          this.selectLoading = false;
          this.projectList = [];
        }
      },

      //搜索教职工
      remoteMethod(query) {
        this.selectLoading = true;
        if (query !== '') {
          this.common.getjzgList(query)
            .then(res => {
              console.log(res);
              this.selectLoading = false;
              this.jzgList=res.items;
            }).catch(err => {
            this.selectLoading = false;
            this.jzgList=[];
          })
        } else {
          this.selectLoading = false;
          this.jzgList = [];
        }
      },

      //点击选项
      clickItem(item){
        // console.log(item);
        this.form.projectname = item.xmmc;
        this.form.projectbh = item.xmbh;
        this.projectList=[];
      },

      //项目名称格式变化
      dataFilterProject(value){
        let val=JSON.parse(value);
        this.form.projectname=val.xmmc.includes("新增") ? val.xmmc.split("-")[0] :val.xmmc;
        this.form.projectbh=val.xmbh;
        console.log(this.form.projectname);
      },

      //
      dataFilter(val){
        this.form.classleadername=JSON.parse(val).name;
        this.form.classleaderid=JSON.parse(val).id;
        // console.log(val);
      },

      //申请人格式变化
      dataFilterApply(val){
        this.form.applyername=JSON.parse(val).name;
        this.form.applyerid=JSON.parse(val).id;

        // this.form.orgid = "000029";
        console.log(val);
        this.util.postAjax({
          code: global.code,
          url: "/user/findOrgByUserId",
          data: {
            userId:this.form.applyerid
          }
        }).then(res => {
          // console.log(res);
          this.form.orgid = res.id;
          this.form.orgname = res.name;
          console.log(this.form.orgid);
          this.$forceUpdate();
        })

      },

      //资源编号选择
      resChange(item){

        let arr=[];
       this.resList.forEach(v=>{

         // console.log("v",v);
         item.forEach(m => {
           // console.log("m",m);
           if(v.id == m){
             arr.push(v.area)
           }
         })
       })

        this.form.areas=arr.join(";");
        // console.log(this.form.areas)
      },

      //获取资源编号列表
      getResCodeList() {
        util.postAjax({
          code: global.code,
          url: "/irres/list",
          data: {
            params: JSON.stringify({
              restypeid:this.form.irrestypeid
            })
          }
        }).then(res => {
          if (res.success == true) {
            this.codeList = res.items;
          }
        })
      },
      //刷新
      forceUpdate() {
        this.$forceUpdate();
      },


    },
    created() {
      this.getResCodeList();
      // this.getList();

      this.common.findRule("SPAPPLYNUM").then(res => {
        if(res.success){
          this.limitNum=Number(res.item.rulevalue)
        }
      })

      console.log(this.resTypeDetail);
    }
  }
</script>

<style scoped>

</style>
