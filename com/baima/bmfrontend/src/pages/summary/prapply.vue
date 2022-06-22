<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
     <!-- <span>
        <label>资源类型</label>
        <el-select v-model="searchForm.sprestypeid" placeholder="请选择" size="small" style="width: 150px">
          <el-option v-for="item in resTypeList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>
      </span>-->
      <span>
        <label>学院</label>
       <!-- <el-select v-model="searchForm.orgid" placeholder="请选择" size="small" style="width: 150px" filterable>
          <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>-->
        <el-select v-model="searchForm.orgid" filterable remote placeholder="请输入或选择" size="small" :remote-method="remoteMethod" :loading="selectLoading" style="width: 150px">
            <el-option v-for="item in groupList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </span>
      <span>
        <el-input v-model="searchForm.classname" placeholder="请输入班级名称" prefix-icon="el-icon-search" size="small" style="width: 220px"></el-input>
        <el-button size="small" style="width: 100px" @click="search">搜索</el-button>
      </span>
      <span class="reset-icon" @click="reset">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>

      <div style="display:inline-block;float: right;margin-top: 3px;margin-bottom: 20px">
        <div class="my-button green" style="" @click="download">
          <span>导出</span>
        </div>
      </div>

    </div>


    <!--表格-->
    <el-table class="my-table" :data="resList" style="width: 100%" stripe ref="multipleTable" v-loading="loading">
      <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
      <el-table-column prop="orgname" label="学院名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="classname" label="班级名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="leadername" label="负责教师" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="leadermobile" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prpersonnum" label="实习人数" align="center"></el-table-column>
      <el-table-column prop="sleepboynum" label="男生数" align="center"></el-table-column>
      <el-table-column prop="sleepgirlnum" label="女生数" align="center"></el-table-column>
      <el-table-column prop="eatmpersonnum" label="民族生数" align="center"></el-table-column>
      <el-table-column prop="prstarttime" label="实习日期" align="center" width="200" :formatter="prTimeFormatter"></el-table-column>
      <el-table-column prop="applystatus" label="申请单状态" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="common.statusColor('','',scope.row.applystatus)">{{common.processFormatter("","",scope.row.applystatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prcontent" label="实习内容"  width="300" show-overflow-tooltip></el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit">
      <span>显示{{limit}}条，共{{totalPage}}条</span>
      <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                     :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
    </div>

  </div>
</template>

<script>

  export default {
    name: "index",
    components:{
      // resForm
    },

    data(){
      return{
        activeResType:"",    //默认资源id
        totalPage:1,
        limit:10,
        currentPage:1,
        resList:[],  //申请列表
        groupList:[] ,  //学院列表
        searchForm:{},
        loading:false,
        resTypeList:[],
        selectLoading:false
      }
    },
    methods:{
      //搜索学院名称
      remoteMethod(query) {
        this.selectLoading = true;
        if (query !== '') {
          this.common.getGroupList2(query)
            .then(res => {
              console.log(res);
              this.selectLoading = false;
              this.groupList=res.items;
            }).catch(err => {
            this.selectLoading = false;
            this.groupList=[];
          })
        } else {
          this.selectLoading = false;
          this.groupList = [];
        }
      },

      //表格内实习时间转换
      prTimeFormatter(row, column, cellValue){
        let startDate =this.util.formatTime(cellValue,"yyyy.MM.dd");
        let endDate =this.util.formatTime(row.prendtime,"yyyy.MM.dd");
        return startDate+"~"+endDate;
      },
      //导出
      download(){
        let params=JSON.stringify({
          classname:this.searchForm.classname,
          orgid:this.searchForm.orgid
          }
        )
        console.log(params);
        this.util.getUrlByCode(this.global.code, "/data/exportPrapply").then(res=>{
          window.open(res+"?params="+encodeURI(params),"_blank")
        })
      },

      //获取资源类型列表
      getResTypeList(){
        this.tabLoading = true;
        this.util.postAjax({
          code:this.global.code,
          url:"/sprestype/list",
        }).then(res => {
          this.tabLoading = false;
          if(res.success == true){
            this.resTypeList =res.items;
            this.activeResType=this.resTypeList[0].id;
            this.getList(this.currentPage);
            // this.common.getResTypeDetail(this.activeResType,this.resTypeDetail);
          }
        })
      },

      //资源类型tab切换
      resTypeChange(tab, event){
        // this.common.getResTypeDetail(this.activeResType,this.resTypeDetail);
        this.activeResType = tab.name;
        this.currentPage = 1;
        this.getList(this.currentPage);
      },


      //点击分页
      getCurrentChange(currentPage){
        this.currentPage=currentPage;
        this.getList(currentPage)
      },


      //搜索
      search(){
        this.getList(1);
        // console.log("searchForm",this.searchForm);
      },

      //清空
      reset(){
        this.searchForm = {};
        this.currentPage=1;
        this.getList(this.currentPage);
      },

      //获取列表
      getList(page){
        this.loading=true;
        this.util.postAjax({
          code:this.global.code,
          url:"/data/prapplyList",
          data:{
            params:JSON.stringify({
              page:this.currentPage,
              limit:this.limit,
              classname:this.searchForm.classname,
              orgid:this.searchForm.orgid
            })
          }
        }).then(res =>{
          this.loading=false;
          if(res.success == true){
            console.log(res);
            this.resList = res.items;
            this.totalPage=res.total;
          }
        })
      },

    },
    created() {
      this.getList(this.currentPage);
      // this.getResTypeList();
    }
  }
</script>

<style scoped>

</style>
