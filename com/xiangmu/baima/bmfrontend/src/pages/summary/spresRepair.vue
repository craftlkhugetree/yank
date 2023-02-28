<template>
  <div class="common-content">
    <!--<el-tabs class="my-border-card" type="border-card" v-model="activeResType" @tab-click="resTypeChange" v-loading="tabLoading">
      <el-tab-pane :label="item.name" v-for="item in resTypeList" :key="item.id" :name="item.id"></el-tab-pane>
    </el-tabs>
-->
    <!--搜索框-->
    <div class="search-group">
      <span>
        <label>资源类型</label>
        <el-select v-model="searchForm.sprestypeid" placeholder="请选择" size="small" style="width: 150px">
          <el-option v-for="item in resTypeList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
        </el-select>
      </span>
      <span>
        <el-input v-model="searchForm.rescode" placeholder="请输入资源编号" prefix-icon="el-icon-search" size="small" style="width: 220px"></el-input>
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
      <el-table-column prop="typename" label="资源类型" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rescodes" label="资源编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orgname" label="学院名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="applyername" label="申请人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="problemnote" label="问题描述" show-overflow-tooltip ></el-table-column>
      <el-table-column label="图片" align="center" >
        <template slot-scope="scope">
          <div class="table-image" style="">
            <el-image v-if="scope.row.firstFileId" style="width: 80%!important;height: 80%!important;" :src="viewUrl+scope.row.firstFileId" :preview-src-list="scope.row.srcList" fit="fill"></el-image>
            <span v-else>--</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="applytime" label="报修时间" align="center" width="200">
        <template slot-scope="scope">
          {{scope.row.applytime ? util.formatTime(scope.row.applytime, "yyyy.MM.dd hh:mm:ss") : ""}}
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage>limit">
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
        activeName: 'second',
        resList:[],  //申请列表
        groupList:JSON.parse(sessionStorage.getItem("groupList")) ,  //学院列表
        searchForm:{},
        loading:false,
        tabLoading:false,
        typeDetail:{},
        selectedIds:"",
        resTypeDetail:{},
        resTypeList:[],
        viewUrl: window.g.ApiUrl3 + "rest/FileOut/view/",   //预览地址
      }
    },
    methods:{
      //导出
      download(){
        let params=JSON.stringify({
          rescode:this.searchForm.rescode ,
          sprestypeid:this.searchForm.sprestypeid
          }
        )

        // console.log(params);
        this.util.getUrlByCode(this.global.code, "/data/exportSpresRepair").then(res=>{
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
          url:"/data/spresRepairList",
          data:{
            params:JSON.stringify({
              page:this.currentPage,
              limit:this.limit,
              rescode:this.searchForm.rescode,
              sprestypeid:this.searchForm.sprestypeid
            })
          }
        }).then(res =>{
          this.loading=false;
          if(res.success == true){
            // console.log(res);
            this.resList = res.items;
            this.totalPage=res.total;
            this.resList.forEach(v=>{
              if(v.files && v.files.length >0){
                v.firstFileId=v.files[0].ID;
                v.srcList=[];
                v.files.forEach(m=>{
                  v.srcList.push(this.viewUrl+m.ID)
                })
              }

            });

          }
        })
      },

    },
    created() {
      this.getList(this.currentPage);
      this.getResTypeList();
    }
  }
</script>

<style scoped>

</style>
