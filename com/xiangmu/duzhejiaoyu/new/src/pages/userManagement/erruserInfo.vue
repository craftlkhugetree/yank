<template>
    <div class="common-content">
      <div class="user-title-wrap">
        <span class="title">异常用户信息列表</span>
        <el-button type="primary" plain size="mini" style="float:right;" @click="batchActive">一键激活</el-button>
      </div>
      <div class="user-line"></div>

      <!--表格-->
      <el-table class="my-table" :data="tableList.slice((page-1)*limit,page*limit)" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="readerId" label="证件号" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="barcode" label="条码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="idcard" label="身份证号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dept" label="所属" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="campusname" label="校区" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isNeedQQ == '1'" prop="qqcard" label="QQ号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isNeedQQ == '1'" prop="email" label="邮箱" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="isNeedQQ == '1'" prop="mobile" label="手机号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" label="性别" align="center" :formatter="sex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="readertypename" label="身份" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="readerFlag" label="状态" align="center" :formatter="status"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="qtime" label="考试时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="qname" label="考试详情" align="left"  min-width="200" :formatter="qname" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.readerFlag == 3" class="table-btn blue" @click="active(scope.row)">激活</div>
            <div v-if="scope.row.readerFlag == 1 && scope.row.readerId && scope.row.readerId.length>0 " class="table-btn pink" @click="deleteActive(scope.row)">删除</div>

          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="my-pagination" >
        <span>显示{{limit}}条，共{{totalPage}}条</span>
        <el-pagination class="my-el-pagination" background layout="prev, pager, next" :total="totalPage" :page-size="limit"
                       :current-page="page" small @current-change="getCurrentChange"></el-pagination>
       </div>   
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return{
                tableList:[],
                page:1,
                limit:10,
                totalPage:1,
                loading:false,
                isNeedQQ:"",
            }
        },

        methods: {
           //获取是否完善个人信息
          getInfo(){
            this.util.postAjax({
                  code: this.global.code,
                  url: "/config/list",
              }).then((res) => {
                if(res.success){
                  console.log(res)
                  let arr=res.items.filter(v => v.configkey == "ISNEEDQQ");

                  this.isNeedQQ=arr[0].configval;
                  console.log(this.isNeedQQ)

                }
              })
          },
            // 激活
            active(row){
                this.$confirm('确定激活该用户吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
                        const loading = this.$loading({
                            lock: true,
                            text: "激活中",
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        this.util.postAjax({
                        code: this.global.code,
                        url: "/user/acitveReader",
                        data:{
                            id:row.id
                        }
                    }).then( () => {
                        loading.close();
                        this.$message({
                            message: '激活成功!',
                            type: 'success',
                            showClose:true
                        });
                        this.getList();
                    }).catch( () => {
                        loading.close();
                        this.$message({
                            message: '激活失败!',
                            type:"error",
                            showClose:true
                        });
                    })
                })
            },
            batchActive(){
              var ids = '';
              this.tableList.forEach(e=>{
                ids+=e.id+','
              })
              if(this.tableList.length<1){
                this.$message({
                    type: 'warning',
                    message: '没有可激活的数据!'
                });
                return
              }
              ids = ids.substring(0,ids.length-1)
              this.$confirm('确定一键激活吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: "激活中",
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    this.util.postAjax({
                      code: this.global.code,
                      url: "/user/batchActive",
                      data:{
                          ids:ids
                      }
                      }).then(res => {
                        this.getList();
                        loading.close();
                        this.$message({
                            type: 'success',
                            message: '激活成功!'
                        });
                    });
                })
            },
            //删除
            deleteActive(row){
                this.$confirm('确定删除该条用户信息吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.util.postAjax({
                    code: this.global.code,
                    url: "/user/deleteReader",
                    data:{
                        id:row.id
                    }
                    }).then(res => {
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    });
                });
            },
            //性别字样转换
            sex(row,col,cellValue){
                if(cellValue == 0){
                    return "男"
                }else if (cellValue == 1){
                    return "女"
                }
            },
            //改变表格中的文字
            status:function (row,column,cellValue) {
                // console.log(cellValue);
                if (cellValue === 1){
                    return "正常"
                }else if (cellValue === 0){
                    return "注销"
                }else if (cellValue === 2){
                    return "挂失"
                }else if (cellValue === 3){
                    return "停借"
                }
            },
            qname:function(row,column,cellValue){
                switch (row.testType) {
                    case 1:
                    return cellValue+",参加了普通考试,得分"+row.score+"分";
                    break;
                    case 2:
                    return cellValue+",参加了模拟考试,得了"+row.score+"分";
                    break;
                    case 3:
                    return cellValue+",参加了闯关考试,过了"+row.score+"关";
                    break;
                }
            },
            // 点击分页
            getCurrentChange(val){
              this.page=val;
              this.getList();
            },
            // 获取列表
            getList(){
                this.loading=true;
                this.util.postAjax({
                code:this.global.code,
                url:"/user/unnormalStus",
                isRep:true,
              }).then((res) =>{
                this.loading=false;
                if(res.success){
                    this.tableList=res.data;
                    this.totalPage=res.total;
                }
              })
            }
        },
        created() {
          this.getInfo();
          this.getList();
        },
    }
</script>

<style scoped>

</style>
