<template>
    <div >

      <el-form  :model="form" label-width="120px" size="small" >

        <el-form-item label="审批意见" style="width: 98.5%" required>
          <el-input type="textarea" v-model="form.NAME" autocomplete="off" placeholder="请输入审批意见" rows="3"></el-input>
        </el-form-item>

        <el-form-item class="el-form-item-self" label="是否启用" required>
          <el-radio-group v-model="form.ISUSE" style="white-space: nowrap">
            <el-radio label="1" value="1" >是</el-radio>
            <el-radio  label="0" value="0" >否</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
    </div>
</template>

<script>
    export default {
        name: "addRemark",
      data(){
          return{
            form:{
              ID:"",
              NAME:"",
              ISUSE:""
            }
          }
      }
    }
</script>

<style scoped>

</style>
