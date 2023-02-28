<template>
    <div>

      <el-table :data="downloadList" border style="width: 100%" size="mini" stripe	>
        <el-table-column prop="USERNAME" label="下载人(工号)" align="center" width="160" :formatter="(row)=>{return row.USERNAME +' ('+ row.USERID+')'}"></el-table-column>
        <el-table-column prop="CREATETIME" label="下载时间" align="center" width="150" >
          <template slot-scope="scope">
            {{util.formatTime(scope.row.CREATETIME,"yyyy-MM-dd HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column prop="IP" label="IP" align="center"></el-table-column>
        <el-table-column prop="DETAIL" label="Agent" align="left" width="500"></el-table-column>
      </el-table>

      <div style="margin-top: 20px" v-if="totalPage > limit">
        <el-pagination @current-change="handleCurrentChange"  :current-page="currentPage" :page-size="limit" small
                       layout=" prev, pager, next" :total="totalPage">
        </el-pagination>
      </div>
    </div>
</template>

<script>
    export default {
      name: "downloadList",
      props:{
        rowId:String
      },
      data(){
        return{
          downloadList:[],
          // rowId:"",
          currentPage:1,
          limit:5,
          totalPage:0
        }
      },
      methods:{
        //点击分页
        handleCurrentChange(val) {
          this.currentPage = val;
          this.getList();
        },


        //获取下载记录列表
        getList(){
          this.util.postAjax({
            code:this.global.code,
            url:"book/downRecordList",
            data:{
              page: this.currentPage,
              limit:this.limit ,
              filter:JSON.stringify({
                "RECORDID": this.rowId,
              })
            }
          }).then(res => {
            if(res.success){
              console.log(res);
              this.downloadList=res.items;
              this.totalPage=res.total
            }
          })
        }
      },

      created() {
        this.getList();
        console.log(this.rowId);
      }
    }
</script>

<style scoped>

</style>
