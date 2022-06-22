<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
      <div style="display:inline-block;float: right;margin-top: 3px;margin-bottom: 20px">
        <div class="my-button green" style="" @click="download">
          <span>导出</span>
        </div>
      </div>
    </div>

    <!--表格-->
    <el-table class="my-table" :data="tableData" style="width: 100%" stripe v-loading="loading">
      <el-table-column prop="name" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="allnum" label="总量" align="center"></el-table-column>
      <el-table-column prop="used" label="使用" align="center"></el-table-column>
      <el-table-column prop="unuse" label="未使用" align="center"></el-table-column>
    </el-table>

    <!--分页-->
    <!--<div class="my-pagination" v-if="totalPage > limit">
      <span>显示{{limit}}条，共{{totalPage}}条</span>
      <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                     :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
    </div>-->

  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        loading:false,
        totalPage:1,
        limit:10,
        currentPage:1,
        tableData:[],  //申请列表
      }
    },
    methods:{
      //导出
      download(){
        this.util.getUrlByCode(this.global.code,"/data/exportSpresUseSummary").then(res=>{
          window.open(res,"_blank")
        })
      },

      //分页点击
      getCurrentChange(currentPage){
        this.currentPage=currentPage;
        this.getList(currentPage)
      },


      //获取列表
      getList(page){
        this.loading=true;
        this.util.postAjax({
          code:this.global.code,
          url:"/data/spresUseSummaryList",
         /* data:{
            params:JSON.stringify({
              page:page,
              limit:this.limit,
            })
          }*/
        }).then(res =>{
          this.loading=false;
          if(res.success == true){
            // console.log(res);
            this.tableData = res.items;
            this.totalPage=res.total
          }
        })
      },
    },
    created() {
      this.getList(this.currentPage);
    }
  }
</script>

<style scoped>

</style>
