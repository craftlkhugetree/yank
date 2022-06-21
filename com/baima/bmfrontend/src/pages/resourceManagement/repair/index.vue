<template>
  <div class="common-content">
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
      <span class="reset-icon" @click="reSet">
          <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
        </span>
    </div>

    <!--tab切换-->
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane label="待维修" name="1"></el-tab-pane>
        <el-tab-pane label="已维修" name="2"></el-tab-pane>
      </el-tabs>

      <!--<div class="my-button green" style="float: right;margin-top: 3px;" @click="operateApply('add',null)">
        <i class="el-icon-plus"></i>
        <span>新增申请</span>
      </div>-->
    </div>

    <el-divider style=""></el-divider>

    <!--表格-->
    <el-table class="my-table" :data="applyList" style="width: 100%" stripe v-loading="loading">
      <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
      <el-table-column prop="typename" label="资源类型" align="center"></el-table-column>
      <el-table-column prop="rescodes" label="资源编号" align="center"></el-table-column>
      <el-table-column prop="orgname" label="学院名称" align="center"></el-table-column>
      <el-table-column prop="applyername" label="申请人" align="center"></el-table-column>
      <el-table-column prop="problemnote" label="问题描述" align="center"></el-table-column>
      <el-table-column label="图片" align="center" >
        <template slot-scope="scope">
          <div class="table-image" style="">
            <el-image v-if="scope.row.firstFileId" style="width: 80%!important;height: 80%!important;" :src="viewUrl+scope.row.firstFileId" :preview-src-list="scope.row.srcList" fit="fill"></el-image>
            <span v-else>--</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="repairstatus" label="维修状态" align="center">
        <template slot-scope="scope">
          <span :class="common.repairColor('','',scope.row.repairstatus)">{{common.repairStateFormatter("","",scope.row.repairstatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applytime" label="报修时间" align="center">
         <template slot-scope="scope">
          {{scope.row.applytime ? util.formatTime(scope.row.applytime, "yyyy.MM.dd hh:mm:ss") : ""}}
        </template>
      </el-table-column>
      <el-table-column v-if="auditDev == 'bm' && activeName !=2" label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.repairstatus ==1" class="table-btn green" @click="repair(scope.row)" >维修</div>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit">
      <span>显示{{limit}}条，共{{totalPage}}条</span>
      <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                     :current-page="currentPage" small @current-change="getCurrentChange"></el-pagination>
    </div>

    <!--&lt;!&ndash;弹框&ndash;&gt;
    <el-dialog class="res-apply-dialog" :title="(dialogType == 'add' )? '资源申请新增' : '资源申请编辑'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
               width="700px" :close-on-click-modal="false">
      <apply-form ref="child" :form="form" :formLabelWidth="formLabelWidth" ></apply-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="dialogFormVisible = false">取 消</div>
        <div class="my-button plain-green"  @click="submit(0)">保 存</div>
        <div class="my-button green" @click="submit(1)">提 交</div>
      </div>
    </el-dialog>-->


  </div>
</template>

<script>
  // import applyForm from "../../components/irrDialog"
  export default {
    name: "index",
    components:{
      // applyForm
    },

    props:{
      auditDev:String
    },
    data(){
      return{
        totalPage:1,
        limit:10,
        currentPage:1,
        activeName: "1",
        searchForm:{},
        applyList:[],  //申请列表
        dialogFormVisible: false,
        form: {
          /* owngroupname:this.options.userInfo.ORGNAME,
           owngroup:this.options.userInfo.ORGID,
           eventername:this.options.userInfo.NAME,*/
        },
        formLabelWidth: '120px',
        dialogType:"",  //弹框类型
        resTypeList:[],
        viewUrl: window.g.ApiUrl3 + "rest/FileOut/view/",   //预览地址
        loading:false

      }
    },

    methods:{
      //查询
      search(){
        this.getList(1);
        this.currentPage =1;
      },

      //重置
      reSet(){
        this.searchForm={};
        this.getList(1);
        this.currentPage =1;
      },

      timeFormatter(row, column, cellValue){
        if(cellValue == null){
          return "--"
        }else {
          return this.util.formatTime(cellValue,"yyyy.MM.dd hh:mm:ss")
        }
      },

      //表格内日期格式转化
      dateFormatter(row, column, cellValue){
        if(cellValue && cellValue.length == 14){
          return this.util.formatTime(cellValue,"yyyy.MM.dd")
        }else {
          return cellValue
        }
      },

      //点击分页
      getCurrentChange(currentPage){
        this.currentPage=currentPage;
        this.getList(currentPage)
      },

      //维修操作
      repair(row){
        this.$confirm('确定维修吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.util.postAjax({
            code:this.global.code,
            url:"/sprepair/repair",
            data:{
              id:row.id
            }
          }).then(res => {
            // console.log(res);
            if(res.success == true){
              this.getList( this.currentPage);
              // this.currentPage =1;
            }else{
              // console.log(res);
              this.$message({
                type:"warning",
                message:res.data.message
              });
            }
          })
        }).catch(() => {});



      },

      //获取列表
      getList(page){
        // console.log(this.options.userInfo.ID);
        this.loading=true;

        let params={
          page:page,
          limit:this.limit,
          rescode:this.searchForm.rescode,
          repairstatus:this.activeName && this.activeName.length >0  ? this.activeName : null ,
          sprestypeid:this.searchForm.sprestypeid,
          applyerid:this.auditDev == 'bm' ? null : this.options.userInfo.ID
        }

       /* if(this.activeName){
          params.repairstatus =this.activeName
        }else {
          params.repairstatus =null
        }*/

        // console.log("params",params);

        this.util.postAjax({
          code:this.global.code,
          url:"/sprepair/pageList",
          data:{
            params:JSON.stringify(params)
          }
        }).then(res =>{
          this.loading=false;
          if(res.success == true){
            // console.log(res);
            this.applyList = res.items;
            this.totalPage = res.total;
            this.applyList.forEach(v=>{
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

      //tab切换
      handleClick(row) {

        // this.activeName =  this.activeName && this.activeName.length>0 ? this.activeName : null

        this.currentPage = 1;
        this.getList(1);
      }
    },
    created() {
      this.getList(this.currentPage);
      this.common.resTypeList().then(res => {
        this.resTypeList=res.items;
      });

    }
  }
</script>

<style scoped>

</style>
