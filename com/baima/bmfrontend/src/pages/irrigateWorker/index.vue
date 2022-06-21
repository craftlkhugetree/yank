<template>
    <div class="common-content">
      <div v-for="item in list" :key="item.id" style="padding: 15px">
        {{item.projectname}}
        <el-button size="mini" type="success" style="float: right" @click="operate(item.id)" :disabled="item.applystatus == 3">接收</el-button>
      </div>
    </div>
</template>

<script>
    export default {
      name: "index",
      data(){
        return{
          list:[]
        }
      },
      methods:{
        //接收
        operate(id){
          let params={
            eventtype:5,
            applyid:id
          };
          this.util.postAjax({
            code:this.global.code,
            url:"/irapply/saveEvent",
            isRep:true,
            data:params
          }).then(res => {
            // console.log(res);
            if(res.success == true){
              this.getList();
            }else {
              this.$message({
                type: 'warning',
                message: res.data.message
              });
            }
          })
        },

        //获取列表
        getList(page){
          this.util.postAjax({
            code:this.global.code,
            url:"/irapply/pageList",
            data:{
              params:JSON.stringify({})
            }
          }).then(res =>{
            if(res.success == true){
              this.list = res.item.workerList.list;
            }
            // console.log("1111",this.list);
          })
        },
      },
      created() {
        this.getList()
      }
    }
</script>

<style scoped>

</style>
