<template>
    <div class="remark-box">
<!--      审核意见-->
      <div style="margin-bottom: 20px">
        <el-button type="primary" size="small" style="width: 110px;margin-bottom: 15px;margin-top: 15px" @click="openDialog('add',null)">新增</el-button>
      </div>

<!--      表格-->
      <el-table :data="tableData" border style="width: 100%" size="mini" stripe	>
        <el-table-column prop="CREATORNAME" label="创建人(工号)" align="center" :formatter="(row)=>{return row.CREATORNAME +' ('+ row.CREATORID+')'}"></el-table-column>
        <el-table-column prop="CREATETIME" label="创建时间" align="center">
          <template slot-scope="scope">
            {{util.formatTime(scope.row.CREATETIME,"yyyy-MM-dd HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column prop="NAME" label="审批意见" align="left" width="500"></el-table-column>
        <el-table-column prop="ISUSE" label="是否启用" align="center" >
          <template slot-scope="scope">
            {{scope.row.ISUSE == 1 ? "是" : "否"}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button class="table-btn" type="text" size="mini" @click="openDialog('edit',scope.row)" title="编辑">
							编辑
						</el-button>
            <el-button class="table-btn" type="text" size="mini" @click="deleteRemark(scope.row)" title="删除">
							删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin: 20px 0 40px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
                       :current-page="currentPage" :page-size="limit" :page-sizes="pageSizes"  small layout=" prev, pager, next, jumper, total,sizes" :total="totalPage">
        </el-pagination>
      </div>

      <!--审核意见弹框-->
      <el-dialog class="check-pop" :title="dialogType=='add' ? '新增' : '编辑' +'审核意见'" :visible.sync="remarkVisible" v-if="remarkVisible" width="600px" style="margin-top: 0" :close-on-click-modal="false">

        <add-remark ref="remarkChild" ></add-remark>
        <div slot="footer" style="margin-top: -30px">
          <el-button @click="remarkVisible = false" size="small" style="width: 100px">取 消</el-button>
          <el-button type="primary" size="small" style="width: 100px" @click="submitReamrk">确定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import addRemark from "./addRemark";
    export default {
        name: "remark",
      components: {
          addRemark
      },
      data(){
          return{
            tableData:[],
            totalPage:0,
            currentPage:1,
            limit:10,
            pageSizes:[5,10,20, 30, 40],  //设置每页显示多少条
            remarkVisible:false,
            dialogType:""
          }
      },
      methods:{
        //  删除审批意见
        deleteRemark:function(row){
        this.$confirm('此操作将永久删除该审批意见, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.util.postAjax({
            code:this.global.code,
            url:"Exp/del",
            data:{
              ids:JSON.stringify([row.ID])
            }
          }).then( (res)=>{
            if(res.success){
              this.getList();
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

        //  新增提交和编辑提交意见
        submitReamrk(){
          let form=this.$refs.remarkChild.form;
          if(!form.NAME){
            this.$message({
              message:"请输入审批意见！",
              type:"warning",
            })
          }else if(!form.ISUSE){
            this.$message({
              message:"请选择是否启用！",
              type:"warning",
            })
          }else {
            console.log("success");
            this.util.postAjax({
              code:this.global.code,
              url:"Exp/save",
              data:{
                data:JSON.stringify({
                  "ID":form.ID,
                  "NAME":form.NAME,
                  "ISUSE":form.ISUSE
                })
              }
            }).then(res => {
              if(res.success){
                this.getList();
                this.$message({
                  message:this.dialogType =="add" ? "添加成功！" : "编辑成功！",
                  type:"success",
                })
                this.remarkVisible=false;
              }else {
                this.$message({
                  message:"审批意见"+res.data.message,
                  type:"warning",
                })
              }
            })
          }
        },

        //  打开弹框
        openDialog(type,row){
          this.dialogType=type;
          switch (type) {
            case "add":
              this.remarkVisible=true;
              break;
            case "edit":
              this.util.postAjax({
                code:this.global.code,
                url:"Exp/viewById",
                data:{
                  id:row.ID
                }
              }).then(res => {
                if(res.success){
                  console.log(res);
                  this.remarkVisible=true;
                  this.$nextTick(() => {
                    this.$refs.remarkChild.form=res.item;
                  });
                }
              });

              break;
          }
        },

        //分页
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.limit = val;
          this.getList();
        },

        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.currentPage = val;
          this.getList();
        },

        //获取审批意见列表
        getList(){
          this.util.postAjax({
            code:this.global.code,
            url:"Exp/list",
            data:{
              page: this.currentPage,
              limit:this.limit ,
              filter:JSON.stringify({})
            }
          }).then(res => {
            if(res.success){
              console.log(res);
              this.tableData=res.items;
              this.totalPage=res.total
            }
          })
        }
      },
      created() {
          this.getList()
      }
    }
</script>

<style scoped>

</style>
