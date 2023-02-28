<template>
    <div class="common-content">

      <div class="user-title-wrap">
        <span class="title">读者分类</span>
      </div>

      <div class="user-line"></div>

      <el-button  size="small"  style="width:105px;" @click="syncData"><i class="el-icon-refresh" style="margin-right:10px"></i>同步数据</el-button>
        
        <!--列表 -->
        <div class="type-list">
            <div class="item" v-for="(item,index) in typeList" :key="index">
                <span class="index">{{index<10 ? ("0"+index) : index}}</span>
                <el-tooltip effect="dark" :content="item.readname" placement="top-start">
                    <span class="name ellipsis">{{item.readname}}</span>
                    <!-- <span class="name ellipsis">{{item.readname+(item.isconfig == '1' ? "(系统默认)" : '')}}</span> -->
                </el-tooltip>
            </div>
        </div>
      
    </div>
</template>

<script>
    
    export default {
        name: "index",
        data(){
            return{
               loading:false,
               typeList:[],
                uploadUrl:window.g.ApiUrl3+"/user/importNewStu",
            }
        },
        methods: {
            //同步数据
            syncData(){
                const loading = this.$loading({
                    lock: true,
                    text: "提交中",
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                this.util.postAjax({
                    code:this.global.code,
                    url:"/user/syncReaderType",
                }).then(res => {
                    loading.close();
                    if(res.success){
                        this.$message({
                            type:"success",
                            message:"数据同步成功"
                        })
                    }else{
                        this.$message({
                            type:"error",
                            message:"数据同步失败"
                        })
                    }
                })
            },

            // 获取列表
            getList(){
                this.loading=true;
                this.util.postAjax({
                code:this.global.code,
                url:"/user/readerType",
               
              }).then((res) =>{
                this.loading=false;
                if(res.success){
                    this.typeList=res.items;
                }
              })
            }

        },

        created() {
          this.getList();
        },
    }
</script>

<style scoped>

</style>
