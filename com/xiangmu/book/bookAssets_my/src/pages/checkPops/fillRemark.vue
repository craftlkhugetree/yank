<template>
    <div>
      <el-input v-if="innerType=='1'" v-model="remark" autocomplete="off" ></el-input>

      <el-select v-if="innerType=='0'" v-model="remark" filterable allow-create default-first-option placeholder="请输入或选择" style="width: 100%">
        <el-option  v-for="item in remarkList" :key="item.ID" :label="item.NAME" :value="item.NAME">
        </el-option>
      </el-select>
    </div>
</template>

<script>
    export default {
        name: "fillRemark",
      props:{
        innerType:Number,
        // remarkList:Array
      },
      data(){
          return{
            remark:"",
            remarkList:[]
          }
      },
      methods:{
        //获取审批意见列表
        getList(){
          this.util.postAjax({
            code:this.global.code,
            url:"Exp/list",
            data:{
              page: 1,
              limit:200 ,
            }
          }).then(res => {
            if(res.success){
              console.log(res);
              this.remarkList=res.items;
            }
          })
        },
      },
      created() {
          this.getList();
      }
    }
</script>

<style scoped>

</style>
