<template>
    <div>
      <div class="resource-title">全部资源类型</div>

      <div class="resource-list-box" v-loading="loading">
        <div class="resource-item" v-for="item in resTypeList" :key="item.id">
          <div class="top">
            <span class="name ellipsis">{{item.name}}</span>
            <div class="my-button blue round" style="float: right" @click="goResInfo(item.id)">资源管理</div>
          </div>
          <div class="middle">
            <div class="left">
              <img style="width: 32px;height: 32px;margin-bottom: 5px" src="../../../../static/images/bm-resource-price.png" alt="">
              <div style="color: #383A48">单价</div>
            </div>
            <div class="right">
                <div>计费周期:&nbsp;&nbsp;&nbsp; {{item.chargecyclename}}</div>
                <div>计费方式:&nbsp;&nbsp;&nbsp; {{item.chargetype == "1" ? "面积" : "房间"}}</div>
            </div>
          </div>

          <div class="bottom">
<!--            <div class="my-button" @click="openDialog('detail',item.id)">详情</div>-->
            <div class="my-button " @click="openDialog('edit',item.id)">编辑</div>
            <div class="my-button plain-red" @click="deleteRes(item.id)">删除</div>
          </div>
        </div>
        <div class="resource-item-add" @click="openDialog('add',null)">
          <div class="img-text">
            <img style="width: 44px;height: 44px;margin-bottom: 15px" src="../../../../static/images/bm-resource-add.png" alt="">
            <div>新增资源类型</div>
          </div>
        </div>
      </div>

      <!--弹框-->
      <el-dialog class="res-apply-dialog" :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="700px" :close-on-click-modal="false">
        <apply-form ref="child" :form="form" :formLabelWidth="formLabelWidth" v-loading="dialogLoading" :dialogType="dialogType"></apply-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible = false">取 消</div>
          <div class="my-button green" @click="submit"  v-loading.fullscreen.lock="fullscreenLoading">提 交</div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import applyForm from "./resDialog"
    export default {
      name: "index",
      components:{
        applyForm
      },
      data(){
        return{
          dialogFormVisible: false,
          form: {

          },
          formLabelWidth: '120px',
          resTypeList:[] ,//资源类型列表
          loading:false,
          dialogLoading:false,
          dialogType:"",  //弹框类型
          dialogTitle:"",  //弹框标题
          fullscreenLoading:false
        }
      },
      methods:{
        //跳转资源列表页面
        goResInfo(id){
          this.$router.push({
            // path:`resource-type-management/info-list/${id}`,
            path:`resource-info-management`,
            query:{
              id:id
            },
          },)
        },

        //删除
        deleteRes(id){
          this.$confirm('此操作将永久删除该资源类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.util.postAjax({
              code:this.global.code,
              url:"/sprestype/deleteById?id="+id,
            }).then(res => {
              if(res.success == true){
                // this.currentPage=1;
                this.getList();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                //刷新列表

              }else {
                this.$message({
                  type: 'warning',
                  message: res.data.message
                });
              }
            })
          }).catch(() => {});
        },

        //提交
        submit(){
          this.$refs.child.$refs.form.validate((valid) => {
              if (valid) {
                this.fullscreenLoading=true;
                // console.log(this.$refs.child.form);
                // return false;
                let form=this.$refs.child.form;
                let url="";
                let message="";
                switch (this.dialogType) {
                  case "add":
                    url="/sprestype/add";
                    message="新增成功";
                    break;
                  case "edit":
                    url="/sprestype/update";
                    message="编辑成功";
                    break;
                }
                this.util.postAjax({
                  code:this.global.code,
                  url:url,
                  isRep:true,
                  data:form
                }).then(res => {
                  this.fullscreenLoading=false;
                  if(res.success == true){
                    this.dialogFormVisible =false;
                    this.getList();
                    this.$message({
                      type: 'success',
                      message: message
                    });
                  }else {
                    this.$message({
                      type: 'warning',
                      message: res.data.message
                    });
                  }
                })
              }
          })

        },

        //打开弹框
        openDialog(type,id){
          this.dialogType=type;
          this.dialogFormVisible=true;
          this.form={
            attrList:[],
            baseList:[]
          };
          switch (type) {
            case "add":
              this.dialogTitle= "资源类型新增";
              break;
            case "edit":
              this.dialogTitle= "资源类型编辑";
              this.dialogLoading=true;
              this.util.postAjax({
                code:this.global.code,
                url:"/sprestype/findById",
                data:{
                  id:id
                }
              }).then(res => {
                if(res.success == true){
                  this.form=res.item;
                  this.dialogLoading=false;
                }
              });
              break;
            case "detail":
              this.dialogTitle= "资源类型详情";
              break;
          }
        },

        //获取资源类型列表
        getList(){
          this.loading = true;
          this.util.postAjax({
            code:this.global.code,
            url:"/sprestype/list",
          }).then(res => {
            this.loading = false;
            if(res.success == true){
              this.resTypeList =res.items;
              this.common.chargecycleFormatter2(this.resTypeList);
              // console.log(res);
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
